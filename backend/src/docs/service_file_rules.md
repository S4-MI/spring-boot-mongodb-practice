# Writing a Good Service Class

## Responsibilities

- Business logic and validation
- Transaction boundaries (`@Transactional`)
- Orchestrate repositories and external clients
- Ownership / permission checks

## Dependencies

✅ Repository, other Services, external clients, domain entities  
❌ `HttpServletRequest`, `HttpSession`, web-layer DTOs (`@RequestBody` objects)

## Method inputs

Prefer primitives or command records over web DTOs.

```java
// bad
public Project create(ProjectRequest req) { ... }

// good
public Project create(String name, Long ownerId) { ... }
public Project create(CreateProjectCommand cmd) { ... }
```

## Returning DTOs

Return entities by default. Return DTOs only when the entity must not leak (e.g. `User` with password) or when mapping inside `.map()` on a `Page<T>`.

## Permissions

```java
// role checks → controller (@PreAuthorize)
// ownership checks → service
if (!project.getOwnerId().equals(currentUserId))
    throw new AccessDeniedException("Not your project");
```

## Don'ts

- No `@Autowired` on fields — use constructor injection
- No business logic in controllers or repositories
- No catching and silently swallowing exceptions
- No `System.out.println` — use a logger
