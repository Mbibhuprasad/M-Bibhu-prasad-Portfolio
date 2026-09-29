"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { EXPO } from "@/components/ui";

/**
 * Enhanced cursor: a precise dot plus an eased follower ring. The native cursor
 * stays visible — this only adds feedback. Desktop fine pointers only; off for
 * touch and prefers-reduced-motion.
 *
 * Reactions (nearest match wins):
 *   [data-cursor-hide]              → fade out (areas with their own cursor, e.g. project DRAG disc)
 *   [data-cursor="view|explore"]    → large ring with a VIEW / EXPLORE label (override with data-cursor-label)
 *   [data-cursor="magnetic"]        → ring snaps around the element's centre
 *   [data-cursor="tech"]            → tight accent ring
 *   a, button, [role="button"]      → ring expands slightly
 */
type Mode = "default" | "link" | "tech" | "label" | "magnetic" | "hidden";

const SPRING = { stiffness: 260, damping: 26, mass: 0.5 };

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");
  const [size, setSize] = useState(34);
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useMotionValue(-100);
  const ry = useMotionValue(-100);
  const ringX = useSpring(rx, SPRING);
  const ringY = useSpring(ry, SPRING);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let target: HTMLElement | null = null;

    const resolve = (el: Element | null) => {
      const hide = el?.closest("[data-cursor-hide]");
      if (hide) return { mode: "hidden" as Mode, el: null };
      const tagged = el?.closest<HTMLElement>("[data-cursor]");
      const kind = tagged?.dataset.cursor;
      if (tagged && (kind === "view" || kind === "explore")) return { mode: "label" as Mode, el: tagged };
      if (tagged && kind === "magnetic") return { mode: "magnetic" as Mode, el: tagged };
      if (tagged && kind === "tech") return { mode: "tech" as Mode, el: tagged };
      const link = el?.closest<HTMLElement>('a, button, [role="button"], [data-cursor="link"]');
      if (link) return { mode: "link" as Mode, el: link };
      return { mode: "default" as Mode, el: null };
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      if (target) {
        // magnetic: ring settles between the pointer and the element centre
        const r = target.getBoundingClientRect();
        rx.set(r.left + r.width / 2 + (e.clientX - (r.left + r.width / 2)) * 0.2);
        ry.set(r.top + r.height / 2 + (e.clientY - (r.top + r.height / 2)) * 0.2);
      } else {
        rx.set(e.clientX);
        ry.set(e.clientY);
      }
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const { mode: m, el } = resolve(e.target as Element);
      setMode(m);
      target = m === "magnetic" ? el : null;
      if (m === "magnetic" && el) {
        const r = el.getBoundingClientRect();
        setSize(Math.max(r.width, r.height) + 18);
      }
      if (m === "label" && el) setLabel(el.dataset.cursorLabel ?? (el.dataset.cursor === "view" ? "VIEW" : "EXPLORE"));
    };

    const onLeaveWindow = () => setVisible(false);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y, rx, ry]);

  if (!enabled) return null;

  const ringSize = mode === "label" ? 76 : mode === "magnetic" ? size : mode === "link" ? 50 : mode === "tech" ? 26 : 34;
  const hidden = !visible || mode === "hidden";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[110]">
      {/* follower ring */}
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border ${
            mode === "label"
              ? "border-accent/60 bg-void/70 backdrop-blur-md"
              : mode === "link" || mode === "magnetic"
                ? "border-accent/55 bg-accent/[0.06]"
                : mode === "tech"
                  ? "border-accent/70"
                  : "border-fg/35"
          } grid place-items-center transition-colors duration-300`}
          animate={{ width: ringSize, height: ringSize, opacity: hidden ? 0 : 1, scale: down ? 0.86 : 1 }}
          transition={{ duration: 0.45, ease: EXPO }}
        >
          <AnimatePresence>
            {mode === "label" && (
              <motion.span
                key={label}
                className="font-mono text-[10px] tracking-[0.18em] text-fg"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EXPO }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* precise dot */}
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.span
          className="block size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
          animate={{ opacity: hidden || mode === "label" ? 0 : 1, scale: mode === "link" ? 0.6 : 1 }}
          transition={{ duration: 0.25 }}
        />
      </motion.div>
    </div>
  );
}
