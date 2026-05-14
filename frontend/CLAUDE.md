@AGENTS.md

# Frontend — Next.js App

Next.js 16 (App Router) on React 19, TypeScript, Tailwind CSS v4, shadcn-style components built on `@base-ui/react`. Toasts via `sonner`, icons via `lucide-react`.

> ⚠️ Next.js 16 has breaking changes vs. older versions. Read `node_modules/next/dist/docs/` before relying on training-data knowledge. See `AGENTS.md`.

## Commands

All run from `frontend/`:

```bash
pnpm dev      # next dev → http://localhost:3000
pnpm build    # next build
pnpm start    # next start (production server)
pnpm lint     # eslint
pnpm format   # prettier --write .
```

## Layout

```
src/
  app/              # App Router pages & layouts
  api/              # Shared API infrastructure (axios client, React Query)
  components/
    ui/             # shadcn-style primitives (button, dialog, input, ...)
  features/
    auth/           # Auth feature (store, provider, token-storage, api, schemas, hooks)
    todos/          # Todos feature (api, schemas, hooks, components/)
  lib/
    utils.ts        # cn() helper, etc.
public/             # static assets
```

New shadcn components are added via the `shadcn` CLI; config lives in `components.json`.

## Conventions

- **Package manager**: pnpm (not npm).
- **API base URL**: read from `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080/api/v1`). Feature APIs call short paths like `/todos`, `/auth/login`.
- **Backend calls**: use `apiClient` from `src/api/client.ts` — never raw `fetch()`. Backend returns Spring `Page<T>` shapes (`{ content, page: { size, number, totalElements, totalPages } }`) for paginated lists.
- **Auth**: JWT access + refresh tokens stored in localStorage. Axios interceptor handles auto-refresh. `AuthProvider` in root layout hydrates auth state on mount. `ProtectedLayout` guards pages that require auth.
- **State management**: Zustand for auth state; React Query for server state (todos, etc.).
- **Feature structure**: each feature in `src/features/<name>/` owns its schemas, API functions, hooks, and components. Shared infrastructure lives in `src/api/`, `src/lib/`, `src/components/`.
- **Components**: prefer composing existing `components/ui/*` primitives over hand-rolling. Add new shadcn primitives via the CLI.
- **Styling**: Tailwind v4 utility-first. Use `cn()` from `lib/utils.ts` for conditional class merging.
- **Client vs server components**: `"use client"` only when needed (state, effects, event handlers). Default to server components otherwise.
- **Feedback**: use `sonner` `toast.success` / `toast.error` for user-visible outcomes.
- **Formatting**: 4-space indent, double quotes, semicolons — enforced by Prettier (`.prettierrc`).

## What's missing (roadmap)

- Auth UI (login/register forms, protected routes with route groups).
- API client abstraction for error handling (toast on network errors globally).
- Tests — none yet.
