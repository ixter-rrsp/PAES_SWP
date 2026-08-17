-- Generic content-block store for the "Page Configuration" CMS.
-- One row per editable text/image block, keyed by (page_slug, block_key).
-- Run this once in the Supabase SQL editor.

create table if not exists page_content (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  block_key text not null,
  block_type text not null check (block_type in ('text', 'richtext', 'image')),
  value text,
  updated_at timestamptz not null default now(),
  unique (page_slug, block_key)
);

create index if not exists page_content_page_slug_idx on page_content (page_slug);

alter table page_content enable row level security;

-- Anyone (incl. anon) can read — public pages render from this table.
create policy "page_content_public_read" on page_content
  for select using (true);

-- Only authenticated (admin) users can write.
create policy "page_content_admin_write" on page_content
  for insert to authenticated with check (true);

create policy "page_content_admin_update" on page_content
  for update to authenticated using (true);

-- Storage bucket for admin-uploaded images (page-config blocks, staff
-- photos, etc.). Public read so the site can render them; only
-- authenticated (admin) users can write.
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

create policy "site_images_public_read" on storage.objects
  for select using (bucket_id = 'site-images');

create policy "site_images_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-images');

create policy "site_images_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'site-images');

create policy "site_images_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'site-images');
