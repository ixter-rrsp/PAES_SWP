# DepEd School Portal — Next.js Baseline

Runnable Next.js 16 (App Router) + TypeScript + Tailwind v4 app, ported directly
from the Stitch AI design export. Every one of the 17 designed screens is a
real route and renders without errors.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Routes

**Public site:** `/`, `/about`, `/sbm`, `/slms`, `/lrmds`, `/online-services`,
`/downloadables`, `/news-events`, `/staff`, `/contact`

**Admin (EduAdmin CMS):** `/admin/login`, `/admin`, `/admin/announcements`,
`/admin/events`, `/admin/staff`, `/admin/archive-links`, `/admin/sbm-pages`

## What's real vs. placeholder right now

- **Visual design**: 1:1 port of the Stitch export — same Tailwind classes,
  same color tokens (`app/globals.css` — `@theme` block), same fonts (Inter +
  Material Symbols, loaded via `<link>` in `app/layout.tsx`).
- **Working interactions carried over from the design**: SBM accordion
  (expand/collapse by school year), admin login → redirects to dashboard,
  admin logout → redirects to login, admin sidebar navigation between all
  manager screens.
- **Still placeholder** (expected — this is the UI baseline, not the backend
  integration): forms don't submit anywhere, admin tables show static demo
  data, a couple of admin row/panel interactions (`activateEditMode`,
  `resetForm`, slide-over panel toggles) are wired to no-op/console-log stubs
  since they weren't backed by real state yet.

## Next step: backend integration

Per the project plan, this is meant to connect to Supabase (Postgres + Auth)
with a single admin account and `is_visible` draft/published flags on
`posts`, `staff`, `archive_links`, and `sbm_pages`. Not done yet — this pass
was scoped to get every screen viewable and click-through first.
