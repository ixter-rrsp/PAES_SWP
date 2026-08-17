-- ============================================================
-- Events: add a cover image, matching the announcements table.
-- Run this in the Supabase SQL editor.
-- ============================================================

alter table events
  add column if not exists cover_image_url text;
