"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { findAuthUserByEmail } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";

export type ForgotPasswordResult = { error: string | null; success?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Forgot-password flow for the admin login page:
 *  1. Validate the email looks like an email.
 *  2. Confirm an admin account with that email actually exists (service
 *     role lookup) — so the user gets a clear "no account" error instead
 *     of a silent "check your inbox" for an email that was never registered.
 *  3. If it exists, hand off to Supabase Auth's own resetPasswordForEmail,
 *     which sends the reset email via the project's configured email
 *     provider and issues the recovery link/token itself.
 */
export async function requestPasswordReset(
  formData: FormData
): Promise<ForgotPasswordResult> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) return { error: "Enter your email address." };
  if (!EMAIL_RE.test(email)) {
    return { error: "That doesn't look like a valid email address." };
  }

  // Rate limit by email (and loosely by requester) so this can't be used
  // to hammer the admin-users list or spam someone's inbox with resets.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = checkRateLimit(`forgot-password:${email.toLowerCase()}:${ip}`, 5, 15 * 60_000);
  if (!rate.ok) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  let userExists: boolean;
  try {
    userExists = (await findAuthUserByEmail(email)) !== null;
  } catch (err) {
    console.error("Forgot password: admin user lookup failed:", err);
    return { error: "Something went wrong. Please try again later." };
  }

  if (!userExists) {
    return { error: "No admin account is registered with that email." };
  }

  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/admin/reset-password`,
  });

  if (error) {
    console.error("Forgot password: resetPasswordForEmail failed:", error);
    return { error: "Something went wrong sending the reset email. Please try again." };
  }

  return { error: null, success: true };
}
