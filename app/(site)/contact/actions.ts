"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";

export type ContactFormResult = { error: string | null; success?: boolean };

const SUBJECT_OPTIONS = new Set([
  "Enrollment Inquiry",
  "General Question",
  "Technical Support",
  "Other",
]);

/**
 * Sends a contact-form submission to the organization's inbox via Resend.
 *
 * Env vars required (set in .env.local, see .env.example):
 * - RESEND_API_KEY: API key from the Resend account that will send this.
 * - CONTACT_TO_EMAIL: the organization's inbox that should receive messages.
 * - CONTACT_FROM_EMAIL: the "from" address Resend sends as. Must be on a
 *   domain verified in that Resend account (see resend.com/domains).
 *   Resend's shared "onboarding@resend.dev" address also works for testing,
 *   but only delivers to the account owner's own inbox — fine for trying
 *   this locally, not for the live site.
 */
export async function sendContactMessage(formData: FormData): Promise<ContactFormResult> {
  // Server Actions don't get a NextRequest the way route handlers do,
  // so getClientIp's Request-shaped signature doesn't fit here —
  // read the same forwarded-for/real-ip headers directly instead.
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip")?.trim() ||
    "unknown";

  const rate = checkRateLimit(`contact:${ip}`, 5, 60_000);
  if (!rate.ok) {
    return { error: "Too many messages sent. Please try again in a few minutes." };
  }

  const name = String(formData.get("name") ?? "").trim().replace(/[\r\n]/g, " ");
  const email = String(formData.get("email") ?? "").trim();
  const subjectRaw = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { error: "Please enter your name." };
  if (!email) return { error: "Please enter your email address." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "That doesn't look like a valid email address." };
  }
  if (!message) return { error: "Please enter a message." };

  const subject = SUBJECT_OPTIONS.has(subjectRaw) ? subjectRaw : "General Question";

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !toEmail) {
    console.error("Contact form is missing RESEND_API_KEY or CONTACT_TO_EMAIL env vars.");
    return { error: "Message sending isn't configured yet. Please try again later." };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: `PAES School Website <${fromEmail}>`,
    to: toEmail,
    replyTo: email,
    subject: `[Contact Form] ${subject} — ${name}`,
    text: `New message from the school website contact form.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`,
  });

  if (error) {
    console.error("Resend send failed:", error);
    return { error: "Something went wrong sending your message. Please try again." };
  }

  return { error: null, success: true };
}
