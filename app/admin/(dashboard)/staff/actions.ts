"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAllStaffPage } from "@/lib/data/staff";
import type { StaffMember } from "@/types";

export type ActionResult = { error: string | null };

// Every path that shows staff data anywhere on the site.
function revalidateStaffPaths() {
  revalidatePath("/admin/staff");
  revalidatePath("/staff");
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase: null, error: "Not authenticated." as const };
  }

  return { supabase, error: null };
}

function readFields(formData: FormData) {
  return {
    fullName: String(formData.get("full_name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    department: String(formData.get("department") ?? "").trim(),
    photoUrl: String(formData.get("photo_url") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    displayOrder: Number(formData.get("display_order") ?? 0) || 0,
  };
}

export async function createStaffMember(formData: FormData): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { fullName, role, department, photoUrl, email, displayOrder } = readFields(formData);
  const publishNow = formData.get("publish_now") === "on";

  if (!fullName) return { error: "Full name is required." };
  if (!role) return { error: "Role / title is required." };

  const { error } = await supabase.from("staff").insert({
    full_name: fullName,
    role,
    department: department || null,
    photo_url: photoUrl || null,
    email: email || null,
    display_order: displayOrder,
    status: publishNow ? "published" : "draft",
  });

  if (error) return { error: error.message };

  revalidateStaffPaths();
  return { error: null };
}

export async function updateStaffMember(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { fullName, role, department, photoUrl, email, displayOrder } = readFields(formData);

  if (!fullName) return { error: "Full name is required." };
  if (!role) return { error: "Role / title is required." };

  const { error } = await supabase
    .from("staff")
    .update({
      full_name: fullName,
      role,
      department: department || null,
      photo_url: photoUrl || null,
      email: email || null,
      display_order: displayOrder,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateStaffPaths();
  return { error: null };
}

export async function setStaffStatus(
  id: string,
  status: "draft" | "published"
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase.from("staff").update({ status }).eq("id", id);

  if (error) return { error: error.message };

  revalidateStaffPaths();
  return { error: null };
}

export async function deleteStaffMember(id: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase.from("staff").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidateStaffPaths();
  return { error: null };
}

export async function fetchStaffPage(
  offset: number,
  limit: number,
  status?: "draft" | "published"
): Promise<{ items: StaffMember[]; hasMore: boolean; error: string | null }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { items: [], hasMore: false, error: authError };

  const { items, hasMore } = await getAllStaffPage(offset, limit, status);
  return { items, hasMore, error: null };
}
