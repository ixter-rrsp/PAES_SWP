"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PASSWORD_REQUIREMENTS, validatePasswordStrength } from "@/lib/password";

type SessionState = "checking" | "ready" | "invalid";

export default function Page() {
  const router = useRouter();
  const [sessionState, setSessionState] = useState<SessionState>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function establishSession() {
      // The link from the reset email lands here with a one-time `code`
      // query param (PKCE flow). Exchanging it opens a real session, but
      // scoped to a password update — Supabase rejects any other auth
      // action against it until a new password is set.
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setSessionState("invalid");
          return;
        }
        setSessionState("ready");
        return;
      }

      // Fallback: some Supabase configs deliver the recovery event via a
      // hash fragment session instead of a code param.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSessionState(session ? "ready" : "invalid");
    }

    establishSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const strengthError = validatePasswordStrength(password);
    if (strengthError) {
      setError(strengthError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("Couldn't update your password. Please request a new reset link.");
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/admin/login");
    }, 2000);
  }

  return (
    <main className="w-full max-w-[420px]">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-container"></div>
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center border border-outline-variant mb-4 text-primary-container">
            <span
              className="material-symbols-outlined text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock_reset
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface text-center m-0">
            Set New Password
          </h1>
        </div>

        {sessionState === "checking" && (
          <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
            Verifying your reset link...
          </p>
        )}

        {sessionState === "invalid" && (
          <div className="flex flex-col gap-5">
            <div className="bg-error-container text-on-error-container text-body-sm font-body-sm px-4 py-2.5 rounded-lg">
              This reset link is invalid or has expired.
            </div>
            <button
              type="button"
              onClick={() => router.push("/admin/login")}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-outline-variant rounded-lg font-label-lg text-label-lg text-on-surface hover:bg-surface-container-low transition-colors duration-200"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {sessionState === "ready" && done && (
          <div className="bg-secondary-container/20 text-on-surface text-body-sm font-body-sm px-4 py-3 rounded-lg border border-secondary-container text-center">
            Password updated. Redirecting to sign in...
          </div>
        )}

        {sessionState === "ready" && !done && (
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-container text-on-error-container text-body-sm font-body-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label
                className="block font-label-md text-label-md text-on-surface-variant"
                htmlFor="new-password"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
                  id="new-password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant/70 mt-1">
                {PASSWORD_REQUIREMENTS}
              </p>
            </div>
            <div className="space-y-1.5">
              <label
                className="block font-label-md text-label-md text-on-surface-variant"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
                  id="confirm-password"
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm font-label-lg text-label-lg text-on-primary bg-primary-container hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
