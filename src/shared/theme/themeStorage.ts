import { useEffect, useState, useSyncExternalStore } from "react";

export type AppTheme = "light" | "dark" | "system";

const STORAGE_KEY = "bonga_theme_preference";

let currentTheme: AppTheme = "system";
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getStoredTheme(): AppTheme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage may be unavailable in private mode
  }
  return "system";
}

export function applyTheme(theme: AppTheme) {
  currentTheme = theme;
  if (typeof document === "undefined") return;

  const isDark =
    theme === "dark" || (theme === "system" && getSystemPrefersDark());

  const root = document.documentElement;
  if (isDark) {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }

  notify();
}

export function setStoredTheme(theme: AppTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage quota / private browsing errors
  }
  applyTheme(theme);
}

export function initTheme(): void {
  if (typeof window === "undefined") return;

  const theme = getStoredTheme();
  applyTheme(theme);

  // Watch for OS theme changes when in system mode
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleMediaChange = () => {
    if (getStoredTheme() === "system") {
      applyTheme("system");
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleMediaChange);
  } else {
    mediaQuery.addListener(handleMediaChange);
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return currentTheme;
}

export function useAppTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "system");
  const [isDark, setIsDark] = useState<boolean>(() => {
    return theme === "dark" || (theme === "system" && getSystemPrefersDark());
  });

  useEffect(() => {
    setIsDark(theme === "dark" || (theme === "system" && getSystemPrefersDark()));
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: AppTheme = isDark ? "light" : "dark";
    setStoredTheme(nextTheme);
  };

  return {
    isDark,
    setTheme: setStoredTheme,
    theme,
    toggleTheme,
  };
}
