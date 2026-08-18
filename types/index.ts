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

// Admin-facing shape: includes the raw hash/salt so the dashboard can
// show whether a code is set. The plaintext code itself is never
// stored anywhere, and this type should never be handed to a "use
// client" component's props — only used server-side / to compute
// hasAccessCode before rendering.
export type SbmFolder = {
  id: string;
  sbm_year_id: string;
  label: string;
  description: string | null;
  onedrive_url: string;
  access_code_hash: string | null;
  access_code_salt: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type SbmYearWithFolders = SbmYear & { folders: SbmFolder[] };

// Public/browser-safe shape used on the site's SBM page: the OneDrive
// URL is only ever populated for folders with no code set. Gated
// folders carry onedrive_url: null until the visitor passes the
// on-site code check (see app/(site)/sbm/actions.ts).
export type PublicSbmFolder = {
  id: string;
  label: string;
  description: string | null;
  requires_code: boolean;
  onedrive_url: string | null;
};

export type PublicSbmYear = Omit<SbmYear, "status"> & { folders: PublicSbmFolder[] };

