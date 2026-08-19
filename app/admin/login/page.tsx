"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { requestPasswordReset } from "./actions";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [rememberMe, setRememberMe] = useState(true);

  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient({ rememberMe });
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  function openForgotPassword() {
    setResetEmail(email);
    setResetError(null);
    setResetSent(false);
    setMode("forgot");
  }

  function backToLogin() {
    setMode("login");
    setResetError(null);
    setResetSent(false);
  }

  function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResetError(null);

    const formData = new FormData();
    formData.set("email", resetEmail);

    startTransition(async () => {
      const result = await requestPasswordReset(formData);
      if (result.error) {
        setResetError(result.error);
        return;
      }
      setResetSent(true);
    });
  }

  if (mode === "forgot") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <main className="w-full max-w-[420px]">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary-container"></div>
            <button
              type="button"
              onClick={backToLogin}
              className="flex items-center gap-1.5 mb-4 font-label-md text-label-md text-primary transition-transform duration-200 hover:scale-105 hover:drop-shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Sign In
            </button>
            <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center border border-outline-variant mb-4 text-primary-container">
              <span
                className="material-symbols-outlined text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                mail
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface text-center m-0">
              Reset Password
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-center">
              Enter the email on your admin account and we&rsquo;ll send you a link to
              reset your password.
            </p>
          </div>

          {resetSent ? (
            <div className="flex flex-col gap-5">
              <div className="bg-secondary-container/20 text-on-surface text-body-sm font-body-sm px-4 py-3 rounded-lg border border-secondary-container">
                Check <span className="font-semibold">{resetEmail}</span> for a link to
                reset your password. It may take a minute to arrive.
              </div>
              <button
                type="button"
                onClick={backToLogin}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-outline-variant rounded-lg font-label-lg text-label-lg text-on-surface hover:bg-surface-container-low transition-colors duration-200"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleForgotSubmit}>
              {resetError && (
                <div className="bg-error-container text-on-error-container text-body-sm font-body-sm px-4 py-2.5 rounded-lg">
                  {resetError}
                </div>
              )}
              <div className="space-y-1.5">
                <label
                  className="block font-label-md text-label-md text-on-surface-variant"
                  htmlFor="reset-email"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                      person
                    </span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
                    id="reset-email"
                    placeholder="admin@school.edu"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm font-label-lg text-label-lg text-on-primary bg-primary-container hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <main className="w-full max-w-[420px]">
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 relative overflow-hidden">
<div className="absolute top-0 left-0 w-full h-1 bg-primary-container"></div>
<button
  type="button"
  onClick={() => router.push("/")}
  className="flex items-center gap-1.5 mb-4 font-label-md text-label-md text-primary transition-transform duration-200 hover:scale-105 hover:drop-shadow-lg"
>
  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
  Back to Site
</button>
<div className="flex flex-col items-center mb-8">
<div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center border border-outline-variant mb-4 text-primary-container">
<span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>account_balance</span>
</div>
<h1 className="font-headline-md text-headline-md text-on-surface text-center m-0">Admin Login</h1>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-center">PAES ADMIN Management Page</p>
</div>
<form className="space-y-5" onSubmit={handleSubmit}>
{error && (
<div className="bg-error-container text-on-error-container text-body-sm font-body-sm px-4 py-2.5 rounded-lg">
{error}
</div>
)}
<div className="space-y-1.5">
<label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="username">Email or Username</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
</div>
<input className="block w-full pl-10 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors" id="username" placeholder="admin@school.edu" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
</div>
</div>
<div className="space-y-1.5">
<div className="flex items-center justify-between">
<label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
<button type="button" onClick={openForgotPassword} className="font-label-md text-label-md text-primary-container hover:text-surface-tint transition-colors">Forgot Password?</button>
</div>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<span className="material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
</div>
<input className="block w-full pl-10 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors" id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
</div>
</div>
<div className="flex items-center justify-between pt-2">
<div className="flex items-center">
<input className="h-4 w-4 rounded border-outline-variant text-primary-container focus:ring-primary-container bg-surface-container-lowest cursor-pointer" id="remember-me" name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
<label className="ml-2 block font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="remember-me">
                            Keep me logged in
                        </label>
</div>
</div>
<div className="pt-4">
<button className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm font-label-lg text-label-lg text-on-primary bg-primary-container hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed" type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                        <span className="material-symbols-outlined ml-2 text-[18px]">login</span>
</button>
</div>
</form>
</div>
<div className="mt-6 text-center">
<p className="font-body-sm text-body-sm text-on-surface-variant/70">
                Secure access restricted to authorized personnel.
            </p>
</div>
</main>
    </div>
  );
}
