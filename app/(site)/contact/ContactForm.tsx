"use client";

import { useRef, useState, useTransition } from "react";
import { sendContactMessage } from "./actions";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await sendContactMessage(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      formRef.current?.reset();
    });
  }

  if (success) {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-10">
        <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Message sent</h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
          Thanks for reaching out — we&apos;ve received your message and will get back to you soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 font-label-md text-label-md text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-DEFAULT bg-error/10 text-error text-body-sm font-body-sm">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
            id="name"
            name="name"
            placeholder="Juan Dela Cruz"
            type="text"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
            id="email"
            name="email"
            placeholder="juan@example.com"
            type="email"
            required
          />
        </div>
      </div>
      <div>
        <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="subject">
          Subject (Optional)
        </label>
        <select
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
          id="subject"
          name="subject"
          defaultValue="Enrollment Inquiry"
        >
          <option>Enrollment Inquiry</option>
          <option>General Question</option>
          <option>Technical Support</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="message">
          Message
        </label>
        <textarea
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow resize-y"
          id="message"
          name="message"
          placeholder="How can we help you?"
          rows={5}
          required
        />
      </div>
      <button
        className="self-start bg-primary text-on-primary font-label-md text-label-md px-8 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2 disabled:opacity-60"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Submit Message"}
        <span className="material-symbols-outlined text-sm" data-icon="send">
          {isPending ? "progress_activity" : "send"}
        </span>
      </button>
    </form>
  );
}
