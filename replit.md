# ResuMate

A resume builder web app where users enter their email to start or resume building — auto-saves to a database as they type, live preview with two templates, and PDF download.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/resumate run dev` — run the frontend (proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS, Wouter (routing), React Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (`lib/db/src/schema/resumes.ts`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle for server)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/resumes.ts` — DB schema: single `resumes` table keyed by email
- `artifacts/api-server/src/routes/resume.ts` — GET `/api/resume/lookup` and POST `/api/resume`
- `artifacts/resumate/src/` — Frontend
  - `pages/EmailGate.tsx` — Email entry screen (`/`)
  - `pages/Builder.tsx` — Split-panel resume editor (`/builder`)
  - `pages/Preview.tsx` — Full-page preview + PDF download (`/preview`)
  - `components/resume/` — ClassicTemplate, ModernTemplate, ResumePreview, types
  - `context/ResumeContext.tsx` — Global email + resume state
  - `components/GoPremiumModal.tsx` — Premium upsell modal (placeholder)
  - `components/SaveIndicator.tsx` — Saving/Saved/Error status indicator

## Architecture decisions

- Email-only auth: no passwords, no sessions. Email is stored in localStorage and used as the upsert key in the DB. Simple and sufficient for v1.
- Upsert pattern: `INSERT ... ON CONFLICT (email) DO UPDATE` so save is idempotent — the frontend can call it freely on every debounced change.
- Local type definitions in `components/resume/types.ts` instead of importing from generated API types — avoids dealing with generated enum/optional differences.
- PDF via `window.print()`: no server-side PDF generation needed. Print CSS hides everything except the resume panel.
- No authentication middleware: all data is public by email lookup — appropriate for an MVP where emails are low-sensitivity.

## Product

- Users enter their email to start or reload their resume
- Form sections: contact info, summary, work experience (multi-entry), education (multi-entry), skills (tag input)
- Auto-saves to Postgres every 1.5s after last keystroke
- Live preview panel updates as user types
- Two templates: Classic (serif, traditional) and Modern (indigo header, sidebar skills)
- Download as PDF via browser print (free: includes watermark footer)
- "Go Premium" button shows a coming-soon modal

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- The resumes table uses `email` as the unique key (not a user ID) — changing this would require a migration
- `crypto.randomUUID()` is used for work experience / education entry IDs (no uuid package needed)
- Print CSS is in `src/index.css` — `@media print` hides `.no-print` and shows the resume panel only

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
