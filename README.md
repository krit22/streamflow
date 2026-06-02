# Streamflow

Open-source video platform built as a TypeScript monorepo.

## Tech Stack

- **Language (frontend + backend):** TypeScript
- **Frontend:** Next.js (App Router), React, Tailwind CSS, TanStack Query, Zustand
- **Backend:** Node.js, Express, Prisma, PostgreSQL, JWT (cookie auth)
- **Storage:** Supabase Storage (video upload flow)
- **Monorepo tooling:** pnpm workspaces + Turborepo
- **Validation:** shared Zod schemas via `@streamflow/validation`

## Basic Architecture

- `apps/web` (frontend) talks to `apps/api` over HTTP.
- API base path is `http://localhost:8000/api/v1`.
- Auth uses an HttpOnly cookie (`access_token` by default).
- Shared packages (`packages/*`) keep UI primitives, lint/TS configs, and validation schemas centralized.

## Project Structure

```text
streamflow/
├─ apps/
│  ├─ web/                  # Next.js frontend
│  └─ api/                  # Express + Prisma backend
├─ packages/
│  ├─ ui/                   # Shared React UI package
│  ├─ validation/           # Shared Zod schemas
│  ├─ eslint-config/        # Shared ESLint config
│  └─ typescript-config/    # Shared TS config
├─ docs/                    # Project docs
├─ turbo.json               # Turborepo pipeline
└─ pnpm-workspace.yaml      # Workspace definition
```

## Prerequisites

- Node.js `>=18`
- pnpm `9.x`
- PostgreSQL database
- Supabase project (for upload/storage)

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create environment files for API and web app.
3. Start both apps from repo root:
   ```bash
   pnpm dev
   ```

## Environment Variables

### Backend (`apps/api`)

Set at least:

- `DATABASE_URL`
- `JWT_SECRET`
- `WEB_ORIGIN` (usually `http://localhost:3000`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Optional:

- `JWT_COOKIE_NAME` (default: `access_token`)
- `COOKIE_DOMAIN` (for production domain cookies)

### Frontend (`apps/web`)

Set at least:

- `NEXT_PUBLIC_API_URL` (default fallback: `http://localhost:8000/api/v1`)
- `NEXT_PUBLIC_SUPABASE_URL`

## Useful Commands (run at repo root)

```bash
pnpm dev          # run all workspace dev servers
pnpm build        # build all workspaces
pnpm lint         # lint all workspaces
pnpm check-types  # type-check all workspaces
pnpm format       # format ts/tsx/md files
```

Run a single app:

```bash
pnpm dev --filter=web
pnpm dev --filter=api
```

## API and Health Check

- API server: `http://localhost:8000`
- Health endpoint: `GET /health`
- Full API docs: `docs/backedn api documentation.md`