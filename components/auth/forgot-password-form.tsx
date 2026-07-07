"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to send reset link.");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Reset password
        </h2>
        <p className="text-sm text-zinc-400">
          Enter your email and we will send you a link to reset your password
        </p>
      </div>

      {success ? (
        <div className="flex flex-col gap-5 text-center sm:text-left">
          <div className="rounded-lg bg-zinc-900 p-4 border border-zinc-800 text-sm text-zinc-200 flex flex-col gap-2">
            <div className="flex gap-2 items-center text-white font-semibold">
              <svg
                className="h-5 w-5 text-white shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Reset Link Sent</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              If an account exists for <span className="text-white font-medium">{email}</span>, you will receive an email shortly with instructions on how to reset your password.
            </p>
          </div>

          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black py-2.5 text-sm font-semibold hover:bg-zinc-200 transition-all focus:outline-hidden focus:ring-2 focus:ring-zinc-50 active:scale-[0.99]"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Error alert */}
          {error && (
            <div className="rounded-lg bg-zinc-900 p-3 border border-zinc-800 text-xs text-zinc-200 flex gap-2 items-center animate-shake">
              <svg
                className="h-4 w-4 text-white shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-900 bg-zinc-950 text-white placeholder-zinc-650 focus:outline-hidden focus:ring-1 focus:ring-white focus:border-white transition-all text-sm disabled:opacity-50"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black py-2.5 text-sm font-semibold hover:bg-zinc-200 transition-all focus:outline-hidden focus:ring-2 focus:ring-zinc-50 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending Link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      )}

      {/* Switch to Login */}
      {!success && (
        <div className="text-center text-xs text-zinc-400 border-t border-zinc-900 pt-5">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-white hover:underline hover:underline-offset-2 transition-all"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
