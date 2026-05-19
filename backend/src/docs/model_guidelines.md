# Model Writing Guidelines

Conventions and best practices for writing MongoDB document classes in this codebase. Pair this with `model_naming.md` (collection-name rules) and `service_file_rules.md` (where business logic belongs).

---

## 1. Inheritance

- **Every persistable document extends `BaseModel`.** Inherit `id`, `createdAt`, `updatedAt` once; never redefine them on subclasses.
- **`BaseModel` is `abstract`.** Do not instantiate it. Do not put `@Document` on it.
- Use Lombok's `@SuperBuilder` (not `@Builder`) so subclass builders include the inherited fields.

---

## 2. Annotations checklist

For a typical entity:

```java
@Document(collection = "things")          // plural snake_case, see model_naming.md
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor                        // Spring Data needs it
@AllArgsConstructor                       // pairs with @SuperBuilder
public class Thing extends BaseModel {

    @NotBlank
    @Field(name = "owner_id")
    private String ownerId;
}
```

**Required, in order at the top:**

1. `@Document(collection = "...")` — explicit collection name.
2. `@CompoundIndexes({...})` — only if you need multi-field or unique-pair indexes.
3. `@SuperBuilder` — before Lombok getter/setter so the generated builder sees all fields.
4. `@Getter`, `@Setter` — never expose fields directly.
5. `@NoArgsConstructor`, `@AllArgsConstructor` — both. Spring uses the no-arg; the builder uses the all-arg.

**Do not use:**

- `@Data` — pulls in `equals`/`hashCode` based on every field; dangerous with mutable entities and JPA-style identity.
- Field-level `@Autowired` — entities are not Spring beans.
- `@JsonProperty` on entity fields — keep Jackson concerns on DTOs, not entities.

---

## 3. Field naming

- **Java side:** camelCase (`createdAt`, `chatId`, `senderId`).
- **Mongo side:** snake_case via `@Field(name = "...")` (`created_at`, `chat_id`, `sender_id`).
- **Booleans:** prefix with `is` only if it reads naturally (`isActive`); the Mongo field stays `is_active`.
- **References to other documents:** name them `<entity>Id` (string), not `<entity>` (object). We do not embed cross-collection references.

```java
@Field(name = "chat_id")
private String chatId;                    // good

private Chat chat;                        // avoid — implies an embed or a join we don't do
```

---

## 4. Indexes

Add an index when the field is in a `WHERE`-equivalent or `ORDER BY` clause of a frequent query.

- **Single field:** `@Indexed` on the field.
- **Unique single field:** `@Indexed(unique = true)` (e.g. `email` on `User`).
- **Compound or unique-pair:** `@CompoundIndexes` at the class level. The `def` string uses **stored** (snake_case) names.
- **Don't over-index.** Each index costs write throughput and RAM. Default to no index; add when a query becomes hot.

**Always use a unique index for membership / join-table pairs** (e.g. `(chat_id, user_id)`). Application-level uniqueness checks race.

---

## 5. Timestamps

- `createdAt` and `updatedAt` are managed by Spring Data auditing (already configured via `@EnableMongoAuditing` on `AppApplication`).
- Never set them manually in service code.
- If you find them `null` after a save, the cause is almost always missing `@EnableMongoAuditing` — not a model bug.

---

## 6. Enums

- Declare constants in `UPPER_CASE`, no extra fields.
- Use `@JsonValue` on a serialization method to control the wire format. Default to `name().toLowerCase()` for REST APIs.
- Store the constant `name()` in Mongo (the default). It's stable, refactor-safe, and matches what `@JsonValue` returns when we lowercase it.

```java
public enum Role {
    MEMBER, MODERATOR, ADMIN;

    @JsonValue
    public String getValue() {
        return name().toLowerCase();
    }
}
```

If you need a different stored form (e.g. legacy integer codes), document why at the top of the enum.

---

## 7. Validation — two layers

We enforce constraints at **both the DTO layer and the entity layer**. This is intentional defense-in-depth.

1. **DTO layer** — `jakarta.validation` annotations on request records, triggered by `@Valid` on controller parameters. Catches bad input early, returns 400 with field-level messages.
2. **Entity layer** — the same `jakarta.validation` annotations on `@Document` fields. A `ValidatingEntityCallback` bean (in `config/MongoValidationConfig`) runs them before every save. This is our "DB-level" guard.

**Why both:**

- DTO validation only fires on web requests. Anything that calls `repository.save(...)` from a service, scheduled job, listener, fixture, or migration bypasses it.
- Entity validation closes that gap — any code path that writes the entity is checked.
- A second copy of the rule is cheap; an invalid document persisted to the database is not.

**Constraint rules:**

- Required strings: `@NotBlank`.
- Required non-strings (enums, numbers, refs): `@NotNull`.
- Length: `@Size(min = ..., max = ...)`. Always set both ends for user-supplied strings.
- Numeric ranges: `@Min`, `@Max`, `@Positive`, `@PositiveOrZero`.
- Don't annotate auditing fields (`id`, `createdAt`, `updatedAt`) — Spring sets them.
- Keep custom messages out of the annotation unless the default reads badly to an end user. The `GlobalExceptionHandler` returns the field name + default message untouched.

**Errors:**

- DTO violations → `MethodArgumentNotValidException` → 400 with field map.
- Entity violations → `jakarta.validation.ConstraintViolationException` → 400 with field map.
- Both produce the same `ErrorResponse` shape, so the frontend treats them identically.

**When you may skip a layer:**

- Internal-only entities with no public write path can rely on entity-level validation alone — no DTO needed.
- Fields the user can never set (audit log timestamps, system status flags) don't need DTO constraints because they never appear on any DTO.

---

## 8. Don't leak entities

- `User` and anything with secrets (password hashes, tokens) **must not** be returned from a controller. Convert to a DTO in the service layer.
- For other entities, returning them directly is acceptable for a learning template, but prefer a DTO once a field would be added that shouldn't ship over the wire (audit fields, soft-delete flags, internal status).

---

## 9. File layout

Inside a feature package (e.g. `chat/`), models live in a `models/` sub-package:

```
chat/
├── ChatController.java
├── ChatService.java
├── ChatRepository.java
├── dto/
│   ├── CreateChatRequest.java
│   └── ChatResponse.java
└── models/
    ├── Chat.java
    ├── ChatParticipant.java
    ├── Message.java
    └── Role.java
```

One class per file. Enums used by exactly one model may live next to it (as `Role.java` does for chat); enums used cross-package go in a `common/` package.

---

## 10. Quick review checklist

Before committing a new model:

- [ ] Extends `BaseModel`.
- [ ] `@Document(collection = "...")` with plural snake_case name.
- [ ] `@SuperBuilder`, `@Getter`, `@Setter`, both constructors.
- [ ] Every camelCase field with a multi-word stored form has `@Field(name = "snake_case")`.
- [ ] Foreign keys are `<entity>Id : String`, not embedded objects.
- [ ] Indexes added for hot query paths; unique index on any membership pair.
- [ ] Validation annotations on every user-settable field (`@NotBlank` / `@NotNull` / `@Size` / ranges).
- [ ] Matching constraints exist on the request DTO that writes this entity.
- [ ] No password / secret fields exposed by `@Getter` without a downstream DTO scrub.
- [ ] Enums use `@JsonValue` if the wire format differs from `name()`.
