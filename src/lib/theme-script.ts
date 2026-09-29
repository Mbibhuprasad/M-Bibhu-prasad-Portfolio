// Server-safe (no React imports): used by the root layout.
export const STORAGE_KEY = "theme";
export const LIGHT_QUERY = "(prefers-color-scheme: light)";

/**
 * Runs in <head> before first paint so the page never flashes the wrong theme.
 * Stored choice wins; otherwise follow the OS; dark is the fallback.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}");var t=s==="light"||s==="dark"?s:(window.matchMedia("${LIGHT_QUERY}").matches?"light":"dark");document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="dark";}})();`;
