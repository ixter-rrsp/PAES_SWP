export type ContentStatus = "draft" | "published";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  cover_image_url: string | null;
  category: string;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  cover_image_url: string | null;
  category: string;
  starts_at: string;
  ends_at: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type Downloadable = {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_size_bytes: number | null;
  file_ext: string | null;
  category: string | null;
  source: "upload" | "drive";
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type ArchiveLink = {
  id: string;
  label: string;
  drive_folder_id: string | null;
  url_legacy: string | null;
  category: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type StaffMember = {
  id: string;
  full_name: string;
  role: string;
  department: string | null;
  photo_url: string | null;
  email: string | null;
  display_order: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type GalleryFrame = {
  id: string;
  gallery_id: string;
  row_start: number;
  column_start: number;
  row_span: number;
  column_span: number;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Gallery = {
  id: string;
  title: string;
  rows: number;
  columns: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type GalleryWithFrames = Gallery & { frames: GalleryFrame[] };

export type PageContentBlockType = "text" | "richtext" | "image";

export type PageContentBlock = {
  id: string;
  page_slug: string;
  block_key: string;
  block_type: PageContentBlockType;
  value: string | null;
  updated_at: string;
};

// Flat map used at render time: block_key -> current value (or null if unset).
export type PageContentMap = Record<string, string | null>;

export type SbmYearStatus = "draft" | "published" | "archived";

export type SbmYear = {
  id: string;
  school_year: string;
  content: string;
  status: SbmYearStatus;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// Client-safe shape: never includes access_code_hash/access_code_salt.
// The dashboard only needs to know *whether* a code is set (hasAccessCode),
// not the hash/salt themselves — those are fetched separately, server-side
// only, by the verify/set-code actions in sbm-pages/actions.ts. Keeping
// them out of this type means they can never accidentally end up in a
// "use client" component's props / the RSC payload sent to the browser.
export type SbmFolder = {
  id: string;
  sbm_year_id: string;
  label: string;
  description: string | null;
  onedrive_url: string;
  hasAccessCode: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type SbmYearWithFolders = SbmYear & { folders: SbmFolder[] };

export type ActivityAction =
  | "created"
  | "updated"
  | "deleted"
  | "published"
  | "unpublished"
  | "archived";

export type ActivityLogEntry = {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  actor_name: string | null;
  action: ActivityAction;
  entity_type: string;
  entity_id: string | null;
  entity_label: string;
  created_at: string;
};
