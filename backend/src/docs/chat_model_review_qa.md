# Chat Models — Review Q&A

Walkthrough of every change made to the chat-feature models, framed as the question each fix answered. Read top-to-bottom to see *why* the current code looks the way it does.

---

## 1. `BaseModel` — Should it be instantiable?

**Q:** Should `BaseModel` be `abstract`?

**A:** Yes — made it `abstract`.

**Why:**
- `BaseModel` carries only shared infrastructure: `id`, `createdAt`, `updatedAt`. It has no meaning as a standalone document.
- It's never mapped with `@Document`, so persisting a raw `BaseModel` would silently fail or create garbage state.
- Marking it `abstract` makes the contract explicit at compile time: "extend me, do not new me."
- Costs nothing — Lombok's `@SuperBuilder`, `@NoArgsConstructor`, `@AllArgsConstructor` all work on abstract classes.

---

## 2. `BaseModel` — Do `@CreatedDate` / `@LastModifiedDate` actually fire?

**Q:** Auditing annotations are on the fields. Are timestamps populated automatically?

**A:** Yes — `@EnableMongoAuditing` is already on `AppApplication`. Verified.

**Why:**
- Spring Data Mongo only activates auditing listeners when `@EnableMongoAuditing` is on a `@Configuration` class (or the main app class). Without it, the annotations are silently ignored — fields stay `null`.
- This is the #1 gotcha with `@CreatedDate`. Worth re-checking any time auditing seems broken.

---

## 3. `Role` enum — How does it serialize to JSON?

**Q:** With a `value` field and a `getValue()` getter, what does the API return — `"MEMBER"` or `"member"`?

**A:** Without `@JsonValue`, Jackson uses the enum constant name → `"MEMBER"`. The custom getter is dead weight. Fixed with `@JsonValue` + dropped the redundant field.

**Why:**
- Jackson's default enum serializer calls `name()`. A plain getter named `getValue()` is not consulted.
- `@JsonValue` tells Jackson "serialize this enum using the return value of this method instead of `name()`."
- The stored `value` field duplicated information already in `name()` — `name().toLowerCase()` is the single source of truth.
- Simpler enum = fewer places to drift out of sync.

**Result:** API now emits `"member"`, `"moderator"`, `"admin"` — predictable, lowercase, matches typical REST conventions.

---

## 4. `Message` — Will message-list queries scale?

**Q:** A chat with 10k messages — what does `findByChatIdOrderByCreatedAtDesc(chatId, pageable)` do on the database?

**A:** Without an index on `chatId`, it scans every document in the `messages` collection. Added `@Indexed` on `chatId`.

**Why:**
- The hottest query in any chat app is "give me the messages in chat X." It runs on every page load, every scroll, every websocket reconnect.
- Mongo will collection-scan in the absence of an index. Fine at 100 documents, catastrophic at 1M.
- `@Indexed` creates a single-field index at app startup (when `spring.data.mongodb.auto-index-creation=true`, which is the Spring Boot default for dev).
- For production, prefer explicit index migrations — but for a learning template, `@Indexed` is the right teaching tool.

**Note:** A compound index on `(chatId, createdAt)` would be even better for the pagination-by-time case, but `@Indexed` on `chatId` alone is enough to avoid the scan.

---

## 5. `ChatParticipant` — Can a user join the same chat twice?

**Q:** What stops two `chat_participants` documents existing with identical `(chatId, userId)`?

**A:** Nothing, in application code. The database must enforce it. Added a unique compound index.

**Why:**
- A membership table only makes sense if `(chat, user)` is unique. Otherwise you get duplicate notifications, double permissions, ambiguous role state.
- Enforcing uniqueness in the service layer is a race condition waiting to happen — two requests, two reads that both see "not a member," two inserts.
- A unique index pushes the constraint into the database, where concurrency is handled atomically. A second insert fails with `DuplicateKeyException`, which the service can translate into a clean 409.

```java
@CompoundIndexes({
    @CompoundIndex(name = "chat_user_unique", def = "{'chat_id': 1, 'user_id': 1}", unique = true)
})
```

---

## 6. All models — Why are Java fields camelCase but Mongo fields snake_case?

**Q:** `chatId` in Java becomes `chat_id` in the document. Why the split?

**A:** Java idiom is camelCase. Mongo idiom (per `model_naming.md`) is snake_case. `@Field(name = "...")` bridges the two without forcing either side to compromise.

**Why:**
- Lets the Java code read naturally to a Java developer.
- Lets the Mongo shell / Compass / aggregation pipelines read naturally to a database operator.
- Keeps the convention explicit at the field — no magic global naming strategy to remember.
- Same rule applies to compound-index definitions: the `def` string uses the **stored** name (`chat_id`), not the Java name (`chatId`). Easy to get wrong.

---

## 7. Cross-cutting — Are these models enough to ship the feature?

**Q:** Models compile. Can the chat feature be used?

**A:** No. Still missing:
- `ChatRepository`, `ChatParticipantRepository`, `MessageRepository` (Spring Data interfaces).
- `ChatService` with ownership checks (creator vs participant vs moderator).
- `ChatController`, `MessageController` under `/api/v1/...`.
- DTOs for create/read/list shapes (don't leak entities directly).
- `senderId`-is-participant validation in the message-send path.

**Why these belong in the service layer, not the model:**
- Models describe *shape*, not *rules*. A `Message` document is valid in isolation; whether the sender is allowed to post in that chat is a runtime authorization concern.
- Keeping models thin makes them safe to use from tests, fixtures, migrations, and admin tooling without dragging policy in.
