# Components

Organized by **who uses it**, not by file type. This keeps public-site code and
admin/CMS code from bleeding into each other as the app grows.

```
components/
  site/            Anything only the public-facing pages use
    layout/        Header, footer — rendered once by app/(site)/layout.tsx
    (add more subfolders here as needed, e.g. site/announcements/, site/sbm/)

  admin/           Anything only the admin CMS uses
    layout/        Sidebar, topbar — rendered once by app/admin/(dashboard)/layout.tsx
    (add more subfolders here as needed, e.g. admin/tables/, admin/forms/)

  ui/              Generic, reusable primitives with no site/admin opinion
                    (buttons, inputs, modals, badges — used by both sides)
```

**Rule of thumb:** if a component could plausibly render on both the public
site and the admin CMS (a `<Button>`, a `<Modal>`, a `<Badge>`), it belongs in
`ui/`. If it's specific to one side, it goes in that side's folder, in a
subfolder named after the feature it supports.

Related folders at the project root:
- `config/` — static config/data (e.g. nav links) that components read from,
  so there's one source of truth instead of copies scattered across files.
- `lib/` — non-UI logic: Supabase client/server helpers, utility functions.
- `types/` — shared TypeScript types (e.g. `Announcement`, `Event`, `StaffMember`)
  once real data wiring starts, so both `app/` and `components/` can import
  the same shape instead of redefining it per file.
