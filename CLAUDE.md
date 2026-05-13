# Project — Spring Boot + Next.js Template

Production-ready full-stack boilerplate. The `backend/` is a Spring Boot 4 / Java 21 REST API backed by MongoDB with JWT auth. The `frontend/` is a Next.js 16 / React 19 app using shadcn-style components on Tailwind v4.

The current sample feature is a per-user Todo CRUD with pagination. New features should follow the same patterns.

## Layout

- `backend/` — Spring Boot API. See `backend/CLAUDE.md` for details.
- `frontend/` — Next.js app. See `frontend/CLAUDE.md` for details.

## Running locally

A MongoDB instance must be reachable at the URI in `backend/src/main/resources/application.properties` (default: `mongodb://admin:secret@localhost:27017/Blue-App`).

```bash
# backend (http://localhost:8080)
cd backend && make run

# frontend (http://localhost:3000)
cd frontend && npm run dev
```

The frontend calls the backend via `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080`).

## Conventions

- **API versioning**: every endpoint lives under `/api/v1/...`. New endpoints must keep the version prefix.
- **Commit messages**: follow the existing style — `feat:`, `fix:`, `refactor:`, `chore:` — short imperative subject, no trailing period.
- **No secrets in code**: the JWT secret in `application.properties` is a placeholder for dev; production must override via env vars.

## Roadmap context

This template is being grown alongside learning Spring Boot. Near-term areas of work:

1. Auth & security hardening — refresh-token rotation, password reset, OAuth, role-based access.
2. Deployment — Docker, CI/CD, cloud hosting.
3. Testing — unit, integration, and E2E layers (none exist yet beyond the generated `AppApplicationTests`).
4. More todo features — categories, due dates, sharing, etc.

When adding any new dependency or pattern, prefer the simplest option that fits a learning context, and update the relevant CLAUDE.md so future sessions stay in sync.
