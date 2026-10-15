"use client";

import { Moon, Sun } from "lucide-react";
import type { Theme } from "@/lib/theme";

export function ThemeToggle() {
  return (
    <>
      <button
        type="button"
        className="theme-toggle"
        aria-describedby="theme-status"
        onClick={() => {
          const next: Theme =
            document.documentElement.dataset.theme === "dark"
              ? "light"
              : "dark";
          window.__portfolioTheme?.set(next);
        }}
      >
        <Moon
          className="theme-to-dark"
          size={19}
          strokeWidth={1.6}
          aria-hidden="true"
        />
        <Sun
          className="theme-to-light"
          size={19}
          strokeWidth={1.6}
          aria-hidden="true"
        />
        <span className="sr-only theme-to-dark">Switch to dark mode</span>
        <span className="sr-only theme-to-light">Switch to light mode</span>
      </button>
      <span id="theme-status" className="sr-only">
        <span className="theme-to-dark">Current theme: light</span>
        <span className="theme-to-light">Current theme: dark</span>
      </span>
    </>
  );
}
