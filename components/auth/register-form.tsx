"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time password rules check
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
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
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Demo Mode: Registration successful! Workspace and User created.");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Create an account
        </h2>
        <p className="text-sm text-zinc-400">
          Get started by setting up your workspace and user profile
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Error Notification */}
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

        {/* First & Last Name Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="firstName"
              className="text-[10px] font-bold uppercase tracking-wider text-zinc-400"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Alex"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-lg border border-zinc-900 bg-zinc-950 text-white placeholder-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-white focus:border-white transition-all text-sm disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="lastName"
              className="text-[10px] font-bold uppercase tracking-wider text-zinc-400"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Rivera"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-lg border border-zinc-900 bg-zinc-950 text-white placeholder-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-white focus:border-white transition-all text-sm disabled:opacity-50"
            />
          </div>
        </div>

        {/* Workspace Name Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="workspaceName"
            className="text-[10px] font-bold uppercase tracking-wider text-zinc-400"
          >
            Workspace Name
          </label>
          <div className="relative">
            <input
              id="workspaceName"
              type="text"
              placeholder="Acme Content"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-900 bg-zinc-950 text-white placeholder-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-white focus:border-white transition-all text-sm disabled:opacity-50"
            />
          </div>
          <p className="text-[10px] text-zinc-500">
            This will be used to create your unique multi-tenant URL slug.
          </p>
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-[10px] font-bold uppercase tracking-wider text-zinc-400"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="alex@acme.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full px-3.5 py-2 rounded-lg border border-zinc-900 bg-zinc-950 text-white placeholder-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-white focus:border-white transition-all text-sm disabled:opacity-50"
          />
        </div>

        {/* Password Inputs */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-[10px] font-bold uppercase tracking-wider text-zinc-400"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-3.5 pr-10 py-2 rounded-lg border border-zinc-900 bg-zinc-950 text-white placeholder-zinc-650 focus:outline-hidden focus:ring-1 focus:ring-white focus:border-white transition-all text-sm disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-[10px] font-bold uppercase tracking-wider text-zinc-400"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-3.5 pr-10 py-2 rounded-lg border border-zinc-900 bg-zinc-950 text-white placeholder-zinc-650 focus:outline-hidden focus:ring-1 focus:ring-white focus:border-white transition-all text-sm disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              {showConfirmPassword ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Password Strength Cues */}
        {password && (
          <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-900 text-[11px] flex flex-col gap-1.5">
            <span className="font-semibold text-zinc-400">Security Check:</span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-zinc-400">
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${hasMinLength ? "bg-white" : "bg-zinc-800"}`} />
                <span className={hasMinLength ? "text-white font-medium" : ""}>Min 8 characters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${hasNumber ? "bg-white" : "bg-zinc-800"}`} />
                <span className={hasNumber ? "text-white font-medium" : ""}>Contains a number</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${hasSpecial ? "bg-white" : "bg-zinc-800"}`} />
                <span className={hasSpecial ? "text-white font-medium" : ""}>Special character</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${passwordsMatch ? "bg-white" : "bg-zinc-800"}`} />
                <span className={passwordsMatch ? "text-white font-medium" : ""}>Passwords match</span>
              </div>
            </div>
          </div>
        )}

        {/* Terms checkbox */}
        <div className="flex items-start gap-2 py-1">
          <input
            id="terms"
            type="checkbox"
            required
            disabled={isLoading}
            className="h-4 w-4 mt-0.5 rounded-sm border-zinc-900 text-white bg-zinc-950 focus:ring-white focus:ring-offset-0 accent-white transition-colors"
          />
          <label
            htmlFor="terms"
            className="text-xs text-zinc-400 select-none cursor-pointer"
          >
            I agree to the{" "}
            <Link href="#" className="underline text-white">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline text-white">
              Privacy Policy
            </Link>
          </label>
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
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center text-xs text-zinc-400 border-t border-zinc-900 pt-5">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-white hover:underline hover:underline-offset-2 transition-all"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
