"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export default function AuthThemeToggle() {
  const { setTheme } = useTheme();
  return (
    <button
      type="button"
      className="auth-theme-toggle"
      aria-label="Toggle light and dark mode"
      onClick={() => setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")}
    >
      <span className="auth-switch-to-light"><Sun size={16} aria-hidden />Light mode</span>
      <span className="auth-switch-to-dark"><Moon size={16} aria-hidden />Dark mode</span>
    </button>
  );
}
