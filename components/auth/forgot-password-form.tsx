"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Button, FieldLabel, TextInput } from "@/components/ui";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget as HTMLFormElement;
    const invalid: Record<string,string> = {};
    for (const element of Array.from(form.elements)) {
      if (!(element instanceof HTMLInputElement)) continue;
      if (!element.checkValidity()) invalid[element.id] = element.validationMessage;
      else if (element.required && element.type !== 'checkbox' && !element.value.trim()) invalid[element.id] = 'This field is required.';
    }
    
    setFieldErrors(invalid);
    if (Object.keys(invalid).length) {
      (form.elements.namedItem(Object.keys(invalid)[0]) as HTMLElement)?.focus();
      return;
    }
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
    <div className="auth-form forgot-password-form flex flex-col gap-6">
      {/* Header — Sora with positive tracking */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
          Reset password
        </h1>
        <p className="text-body text-app-muted">
          Enter your email and we will send you a link to reset your password
        </p>
      </div>

      {success ? (
        <div className="flex flex-col gap-5">
          {/* A real success state, so it takes the accent rather than neutral grey */}
          <div
            role="status"
            className="rounded-lg border border-app-accent/30 bg-app-accent-surface p-4 flex flex-col gap-2"
          >
            <span className="flex gap-2 items-center text-body font-semibold text-app-accent-text">
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
              Check your email
            </span>
            <p className="text-body text-app-muted">
              If an account exists for{" "}
              <span className="font-semibold text-app-text">{email}</span>, reset instructions will be sent if email delivery is available. Check your inbox and spam folder.
            </p>
          </div>

          <Button as={Link} href="/login" variant="primary" className="w-full">
            Back to Sign In
          </Button>
        </div>
      ) : (
        <form noValidate aria-busy={isLoading} onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Error — functional red, announced to assistive tech */}
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-app-danger/30 bg-app-danger-surface p-3 text-body font-semibold text-app-danger-text flex gap-2 items-center"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
              <span>{error}</span>
            </div>
          )}

          <div>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <TextInput required aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined}
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors(previous => { const next = {...previous}; delete next.email; return next; }); }}
              disabled={isLoading}
            />
            {fieldErrors.email && <p id="email-error" className="auth-field-error" role="alert">{fieldErrors.email}</p>}
          </div>

          <Button type="submit" variant="primary" disabled={isLoading} className="mt-2 w-full">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" aria-hidden />
                Sending link…
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      )}

      {!success && (
        <div className="text-center text-body text-app-muted border-t border-app-border pt-5">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-app-accent-text hover:underline hover:underline-offset-2"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
