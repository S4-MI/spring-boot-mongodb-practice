@AGENTS.md

# Frontend — Next.js App

Next.js 16 (App Router) on React 19, TypeScript, Tailwind CSS v4, shadcn-style components built on `@base-ui/react`. Toasts via `sonner`, icons via `lucide-react`.

> ⚠️ Next.js 16 has breaking changes vs. older versions. Read `node_modules/next/dist/docs/` before relying on training-data knowledge. See `AGENTS.md`.

## Commands

All run from `frontend/`:

```bash
npm run dev      # next dev → http://localhost:3000
npm run build    # next build
npm run start    # next start (production server)
npm run lint     # eslint
npm run format   # prettier --write .
```

## Layout

```
app/         # App Router pages & layouts (app/page.tsx is the todo UI)
components/
  ui/        # shadcn-style primitives (button, dialog, input, ...)
lib/
  utils.ts   # cn() helper, etc.
public/      # static assets
```

New shadcn components are added via the `shadcn` CLI; config lives in `components.json`.

## Conventions

- **API base URL**: read from `NEXT_PUBLIC_API_URL` with `http://localhost:8080` fallback.
- **Backend calls**: hit `/api/v1/...` endpoints. Backend returns Spring `Page<T>` shapes (`{ content, page: { size, number, totalElements, totalPages } }`) for paginated lists — match that shape on the client.
- **Auth (when wired in)**: backend issues JWT access + refresh tokens; the frontend will need to store and attach them as `Authorization: Bearer ...`. Not implemented in the UI yet.
- **Components**: prefer composing existing `components/ui/*` primitives over hand-rolling. Add new shadcn primitives via the CLI rather than copy-pasting.
- **Styling**: Tailwind v4 utility-first. Use `cn()` from `lib/utils.ts` for conditional class merging.
- **Client vs server components**: `"use client"` only when needed (state, effects, event handlers). Default to server components otherwise.
- **Feedback**: use `sonner` `toast.success` / `toast.error` for user-visible outcomes (see `app/page.tsx`).
- **Formatting**: 4-space indent, double quotes, semicolons — enforced by Prettier (`.prettierrc`).

## What's missing (roadmap)

- Auth UI (login/register forms, token storage, refresh flow).
- Protected routes / middleware.
- API client abstraction — every fetch currently inlines the URL and error handling.
- Tests — none yet.
