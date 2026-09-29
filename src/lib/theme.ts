import { useEffect, useSyncExternalStore } from "react";
import { LIGHT_QUERY, STORAGE_KEY } from "./theme-script";

export type Theme = "dark" | "light";

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

/** Current theme, read from <html data-theme>. Server snapshot is dark (the default design). */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "dark");
}

function apply(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (animate && !reduce) {
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 500);
  }
  root.dataset.theme = theme;
}

/** Explicit user choice — persisted. */
export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  apply(theme, true);
}

/** Follow OS changes for visitors who never picked a theme themselves. */
export function useSystemThemeSync() {
  useEffect(() => {
    const mql = window.matchMedia(LIGHT_QUERY);
    const onChange = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {}
      if (stored !== "light" && stored !== "dark") apply(mql.matches ? "light" : "dark", true);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
}
