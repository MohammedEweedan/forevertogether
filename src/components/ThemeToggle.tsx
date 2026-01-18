"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

type ThemeToggleProps = {
  className?: string;
};

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";

    const stored = window.localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;

    const prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => {
    setTheme((t) => {
      const next: Theme = t === "dark" ? "light" : "dark";
      window.localStorage.setItem("theme", next);
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      color="#821d30"
      className={
        "logo-pill glass shadow-soft text-sm font-semibold " +
        (className ? className : "")
      }
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
