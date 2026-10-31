"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button, Checkbox, FieldLabel, TextInput } from "@/components/ui";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  const [error, setError] = useState<string | null>(null);
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

    if (!email) {
      setError("Email address is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to sign in.");
      const nextPath = new URLSearchParams(window.location.search).get("next");
      const safeNextPath =
        nextPath?.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : result.data.redirectTo;
      router.push(safeNextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form login-form flex flex-col gap-5 sm:gap-6">
      {/* Header — Sora with positive tracking, never tracking-tight */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h1 className="font-heading text-h6 font-semibold tracking-headline text-app-text sm:text-h5">
          Welcome back
        </h1>
        <p className="text-body text-app-muted">
          Enter your credentials to access your CMS dashboard
        </p>
      </div>

      <form noValidate aria-busy={isLoading} onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        {/* Error — a real error state, so it uses the functional red */}
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

        <div>
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="text-caption font-semibold text-app-accent-text hover:underline mb-1.5"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <TextInput required aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? "password-error" : undefined}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors(previous => { const next = {...previous}; delete next.password; return next; }); }}
              disabled={isLoading}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="auth-password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
            {fieldErrors.password && <p id="password-error" className="auth-field-error" role="alert">{fieldErrors.password}</p>}
        </div>

        <div className="flex items-center gap-2 py-1">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={isLoading}
          />
          <label
            htmlFor="remember-me"
            className="text-body text-app-muted select-none cursor-pointer"
          >
            Remember me on this device
          </label>
        </div>

        {/* Primary action carries the brand hero as a fill with a dark label */}
        <Button type="submit" variant="primary" disabled={isLoading} className="mt-2 w-full">
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" aria-hidden />
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="border-t border-app-border pt-4 text-center text-body text-app-muted sm:pt-5">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-app-accent-text hover:underline hover:underline-offset-2"
        >
          Create one free
        </Link>
      </div>
    </div>
  );
}
