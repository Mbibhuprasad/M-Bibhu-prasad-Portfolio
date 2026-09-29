"use client";

import { setTheme, useSystemThemeSync, useTheme } from "@/lib/theme";

const ICON =
  "theme-icon absolute transition-[opacity,rotate,scale] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

/**
 * Small glass icon button — sun in dark mode, moon in light mode.
 * Icon visibility is keyed to <html data-theme> in CSS, so it's right on first paint
 * (before hydration); React state only drives the click and the accessible label.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  useSystemThemeSync();

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`glass group relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full text-fg-2 transition-colors duration-300 hover:border-accent/50! hover:text-fg md:size-13 ${className}`}
    >
      {/* sun (shown in dark) */}
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`${ICON} light:rotate-90 light:scale-50 light:opacity-0`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
      </svg>
      {/* moon (shown in light) */}
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`${ICON} -rotate-90 scale-50 opacity-0 light:rotate-0 light:scale-100 light:opacity-100`}
      >
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
      </svg>
      {/* orange active tick — the controlled accent */}
      <span className="absolute bottom-2 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />
    </button>
  );
}
