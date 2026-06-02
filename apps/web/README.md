# Web

Streamflow frontend (Next.js App Router).

## Scripts

Run from the monorepo root:

```bash
pnpm dev --filter=web      # http://localhost:3000
pnpm build --filter=web
pnpm lint --filter=web
pnpm check-types --filter=web
```

Or use Turbo directly: `pnpm turbo run dev --filter=web`

## Workspace packages

- `@repo/ui` — shared React components
- `@repo/eslint-config` — ESLint config
- `@repo/typescript-config` — TypeScript config
