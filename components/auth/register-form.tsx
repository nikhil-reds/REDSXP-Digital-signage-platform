"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button, Checkbox, FieldLabel, TextInput } from "@/components/ui";

/** Password rule row: met rules take the accent, unmet stay muted. */
function RuleCheck({ met, label }: { met: boolean; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      {met ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-app-accent-text" aria-hidden />
      ) : (
        <span
          aria-hidden
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-app-muted ml-1 mr-[7px]"
        />
      )}
      <span className={met ? "text-app-text font-semibold" : "text-app-muted"}>{label}</span>
      <span className="sr-only">{met ? "requirement met" : "requirement not met"}</span>
    </span>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time password rules check
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = Boolean(password) && password === confirmPassword;

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
    if (password && (!hasNumber || !hasSpecial)) invalid.password = 'Include a number and a special character.';
    if (confirmPassword && !passwordsMatch) invalid.confirmPassword = 'Passwords do not match.';
    setFieldErrors(invalid);
    if (Object.keys(invalid).length) {
      (form.elements.namedItem(Object.keys(invalid)[0]) as HTMLElement)?.focus();
      return;
    }

    if (!firstName || !lastName) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!workspaceName) {
      setError("Please specify a name for your workspace.");
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
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!hasNumber || !hasSpecial) {
      setError("Password must include a number and special character.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, workspaceName, email, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.errors?.[0] || result.message || "Failed to create account.");
      }
      router.push(result.data.redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form register-form flex flex-col gap-5 sm:gap-6">
      {/* Header — Sora with positive tracking */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h1 className="font-heading text-h6 font-semibold tracking-headline text-app-text sm:text-h5">
          Create an account
        </h1>
        <p className="text-body text-app-muted">
          Get started by setting up your workspace and user profile
        </p>
      </div>

      <form noValidate aria-busy={isLoading} onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
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

        <div className="auth-name-fields">
          <div>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <TextInput required aria-invalid={Boolean(fieldErrors.firstName)} aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
              id="firstName"
              autoComplete="given-name"
              placeholder="Alex"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setFieldErrors(previous => { const next = {...previous}; delete next.firstName; return next; }); }}
              disabled={isLoading}
            />
            {fieldErrors.firstName && <p id="firstName-error" className="auth-field-error" role="alert">{fieldErrors.firstName}</p>}
          </div>
          <div>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <TextInput required aria-invalid={Boolean(fieldErrors.lastName)} aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
              id="lastName"
              autoComplete="family-name"
              placeholder="Rivera"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); setFieldErrors(previous => { const next = {...previous}; delete next.lastName; return next; }); }}
              disabled={isLoading}
            />
            {fieldErrors.lastName && <p id="lastName-error" className="auth-field-error" role="alert">{fieldErrors.lastName}</p>}
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="workspaceName">Workspace Name</FieldLabel>
          <TextInput required aria-invalid={Boolean(fieldErrors.workspaceName)} aria-describedby={fieldErrors.workspaceName ? "workspaceName-error" : undefined}
            id="workspaceName"
            autoComplete="organization"
            placeholder="Acme Content"
            value={workspaceName}
            onChange={(e) => { setWorkspaceName(e.target.value); setFieldErrors(previous => { const next = {...previous}; delete next.workspaceName; return next; }); }}
            disabled={isLoading}
          />
            {fieldErrors.workspaceName && <p id="workspaceName-error" className="auth-field-error" role="alert">{fieldErrors.workspaceName}</p>}
        </div>

        <div>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <TextInput required aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="alex@acme.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors(previous => { const next = {...previous}; delete next.email; return next; }); }}
            disabled={isLoading}
          />
            {fieldErrors.email && <p id="email-error" className="auth-field-error" role="alert">{fieldErrors.email}</p>}
        </div>

        <div>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <TextInput required minLength={8} aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? "password-error password-requirements" : "password-requirements"}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="auth-password-toggle"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
            {fieldErrors.password && <p id="password-error" className="auth-field-error" role="alert">{fieldErrors.password}</p>}
        </div>

        <div>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <div className="relative">
            <TextInput required minLength={8} aria-invalid={Boolean(fieldErrors.confirmPassword || (confirmPassword && !passwordsMatch))} aria-describedby={fieldErrors.confirmPassword || (confirmPassword && !passwordsMatch) ? "confirmPassword-error" : undefined}
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors(previous => { const next = {...previous}; delete next.confirmPassword; return next; }); }}
              disabled={isLoading}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
              className="auth-password-toggle"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
            {(fieldErrors.confirmPassword || (confirmPassword && !passwordsMatch)) && <p id="confirmPassword-error" className="auth-field-error">{fieldErrors.confirmPassword || "Passwords do not match."}</p>}
        </div>

        {/* Real-time password rules — met rules read as success, not just brighter */}
        {(
          <div id="password-requirements" className="rounded-lg border border-app-border bg-app-surface-alt p-3 flex flex-col gap-2">
            <span className="text-caption font-semibold uppercase tracking-headline text-app-muted">
              Security Check
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-body">
              <RuleCheck met={hasMinLength} label="Min 8 characters" />
              <RuleCheck met={hasNumber} label="Contains a number" />
              <RuleCheck met={hasSpecial} label="Special character" />
              <RuleCheck met={passwordsMatch} label="Passwords match" />
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 py-1">
          <Checkbox id="terms" aria-invalid={Boolean(fieldErrors.terms)} aria-describedby={fieldErrors.terms ? "terms-note terms-error" : "terms-note"} required disabled={isLoading} className="mt-0.5" />
          <label htmlFor="terms" className="text-body text-app-muted select-none cursor-pointer">
            I agree to the{" "}
            <span className="font-semibold text-app-text">Terms of Service</span>{" "}
            and{" "}
            <span className="font-semibold text-app-text">Privacy Policy</span>
          </label>
        </div>

        <p id="terms-note" className="auth-legal-note">Terms and Privacy Policy links are not configured. Contact your workspace administrator to review them before agreeing.</p>
        {fieldErrors.terms && <p id="terms-error" role="alert" className="auth-field-error">{fieldErrors.terms}</p>}
        <Button type="submit" variant="primary" disabled={isLoading} className="mt-2 w-full">
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" aria-hidden />
              Creating account…
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="border-t border-app-border pt-4 text-center text-body text-app-muted sm:pt-5">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-app-accent-text hover:underline hover:underline-offset-2"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
