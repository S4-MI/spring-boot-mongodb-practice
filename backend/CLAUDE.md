# Backend — Spring Boot API

Spring Boot 4.0.6 on Java 21, Gradle build, MongoDB persistence, JWT-based stateless auth. Package root is `com.blue.app`.

## Commands

All run from `backend/`:

```bash
make run      # ./gradlew bootRun  → http://localhost:8080
make build    # ./gradlew build
make test     # ./gradlew test
make compile  # ./gradlew compileJava
make clean    # ./gradlew clean
```

Swagger/Scalar UI is auto-generated via springdoc once the app is running.

## Package structure

Feature-sliced — one package per domain, controller + service + repository + entity + `dto/` live together.

```
com.blue.app
├── AppApplication.java
├── auth/           # AuthController, AuthService, dto/ (RegisterRequest, LoginRequest, RefreshRequest, AuthResponse)
├── users/          # User entity, UserRepository, UserDetailsServiceImpl, UserController, dto/
├── todo/           # Todo entity, TodoRepository, TodoService, TodoController, dto/
├── security/       # JwtService, JwtAuthenticationFilter
├── config/         # SecurityConfig, MongoConfig, WebConfig
├── exception/      # GlobalExceptionHandler + custom exceptions
└── dto/            # ErrorResponse (shared error shape)
```

## Conventions

- **API path**: every endpoint under `/api/v1/...`. Controllers use `@RequestMapping("/api/v1/<resource>")`.
- **Auth model**: stateless JWT. `SecurityConfig` permits all URLs at the filter level; access is enforced **per-method** with `@PreAuthorize("isAuthenticated()")` or stricter. Anything not annotated is public.
- **Current user**: get from `Authentication auth` parameter → `((User) auth.getPrincipal()).getId()`. Pass the id into the service; don't pass `Authentication` into services.
- **Service layer** (see `service_file_rules.md`):
  - Constructor injection only (`@RequiredArgsConstructor` / `@AllArgsConstructor`), never `@Autowired` on fields.
  - Service methods take primitives or command records, **not** web DTOs.
  - Return entities by default; return DTOs only when the entity must not leak (e.g. `User`) or inside `.map()` on `Page<T>`.
  - Ownership checks live in services; role checks live in controllers via `@PreAuthorize`.
- **MongoDB collection naming** (see `model_naming.md`): lowercase, plural, snake_case (`users`, `todos`, `audit_logs`).
- **Errors**: throw domain exceptions (`ResourceNotFound`, `EmailAlreadyInUseException`, `InvalidTokenException`); `GlobalExceptionHandler` maps them to `ErrorResponse`.
- **Validation**: `@Valid` on request bodies; DTOs are Java `record`s with `jakarta.validation` constraints.
- **Pagination**: use Spring `Pageable` with `@PageableDefault`; controller returns `Page<DTO>`.

## Configuration

`src/main/resources/application.properties`:

- `spring.mongodb.uri` — connection string.
- `jwt.secret` — **must** be base64 of ≥32 bytes (HS256). Override in production via env var.
- `jwt.access-token-expiry` — 15 min default.
- `jwt.refresh-token-expiry` — 7 days default.

`MongoConfig` strips the `_class` field from stored documents.

## Tests

Only `AppApplicationTests` (smoke test) exists today. Adding real unit + integration tests is on the roadmap — prefer real MongoDB (Testcontainers) over mocks for repository-level coverage when the time comes.
