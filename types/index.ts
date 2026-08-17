export type ContentStatus = "draft" | "published";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  cover_image_url: string | null;
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

export type SbmPage = {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};
