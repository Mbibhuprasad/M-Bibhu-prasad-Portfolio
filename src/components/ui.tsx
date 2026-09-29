"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import type { Tier } from "@/lib/data";

export const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const CINEMA: [number, number, number, number] = [0.65, 0, 0.35, 1];

export function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 5 3 12l5 7" className="stroke-fg" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m16 5 5 7-5 7" className="stroke-fg" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.2" className="fill-cyan" />
    </svg>
  );
}

export function StatusDot() {
  return <span className="pulse-dot inline-block size-[7px] rounded-full bg-signal" aria-hidden="true" />;
}

/** "[ 02 ] — INTRODUCTION" */
export function SectionLabel({ index, children, className = "" }: { index: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`label flex items-center gap-3 ${className}`}>
      <span className="text-fg-2">[ {index} ]</span>
      <span className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </div>
  );
}

const tierDot: Record<Tier, string> = {
  primary: "bg-electric shadow-[0_0_10px_#3d7bff]",
  secondary: "bg-cyan shadow-[0_0_10px_#22d3ee]",
  ai: "bg-violet shadow-[0_0_10px_#8b5cf6]",
  exploring: "bg-accent shadow-[0_0_10px_var(--color-accent)]",
};

export function TechBadge({ children, tier = "primary", className = "" }: { children: React.ReactNode; tier?: Tier; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-ink/70 py-1.5 pl-2.5 pr-3 font-mono text-xs tracking-[0.04em] text-chip backdrop-blur ${className}`}
    >
      <span className={`size-1.5 rounded-full ${tierDot[tier]}`} aria-hidden="true" />
      {children}
    </span>
  );
}

/** Headline lines revealed from behind a mask as they enter the viewport. */
export function RevealLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  as: Tag = "h2",
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string | ((i: number) => string);
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className={`block ${typeof lineClassName === "function" ? lineClassName(i) : lineClassName}`}
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{ duration: 1.1, ease: EXPO, delay: delay + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Fade + lift on enter. */
export function FadeIn({ children, delay = 0, y = 24, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Pointer-attracted wrapper for CTAs (pull 0.3, max 12px). */
export function Magnetic({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const dx = Math.max(-12, Math.min(12, (e.clientX - (r.left + r.width / 2)) * 0.3));
    const dy = Math.max(-12, Math.min(12, (e.clientY - (r.top + r.height / 2)) * 0.3));
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Floating card: follows the pointer with a small shift + 3D tilt and a soft blue/orange glow,
 * then eases back on leave. Mouse/trackpad only; off for touch and reduced motion.
 * The outer box stays still (stable hit area); only the inner layer moves.
 */
export function FloatCard({ children, className = "", glowClassName = "rounded-2xl" }: { children: React.ReactNode; className?: string; glowClassName?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const area = outer.current;
    const card = inner.current;
    if (!area || !card) return;
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(card, { transformPerspective: 900 });
      const ease = { duration: 0.8, ease: "power3.out" };
      const to = {
        x: gsap.quickTo(card, "x", ease),
        y: gsap.quickTo(card, "y", ease),
        z: gsap.quickTo(card, "z", ease),
        rx: gsap.quickTo(card, "rotationX", ease),
        ry: gsap.quickTo(card, "rotationY", ease),
      };
      const onMove = (e: PointerEvent) => {
        const r = area.getBoundingClientRect();
        const nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
        const ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
        to.x(nx * 12);
        to.y(ny * 12);
        to.z(18);
        to.ry(nx * 4);
        to.rx(-ny * 4);
      };
      const onEnter = () => gsap.to(glow.current, { opacity: 1, duration: 0.6, ease: "power3.out", overwrite: true });
      const onLeave = () => {
        to.x(0);
        to.y(0);
        to.z(0);
        to.rx(0);
        to.ry(0);
        gsap.to(glow.current, { opacity: 0, duration: 0.9, ease: "power3.out", overwrite: true });
      };
      area.addEventListener("pointerenter", onEnter);
      area.addEventListener("pointermove", onMove);
      area.addEventListener("pointerleave", onLeave);
      return () => {
        area.removeEventListener("pointerenter", onEnter);
        area.removeEventListener("pointermove", onMove);
        area.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className="relative will-change-transform">
        <span
          ref={glow}
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-px opacity-0 ${glowClassName}`}
          style={{
            boxShadow:
              "0 0 0 1px rgb(61 123 255 / 0.3), 0 24px 70px -24px rgb(61 123 255 / 0.45), 14px 18px 46px -30px color-mix(in srgb, var(--color-accent) 55%, transparent)",
          }}
        />
        {children}
      </div>
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  external,
  download,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
  download?: boolean;
}) {
  const base =
    "inline-flex h-13 items-center justify-center gap-2.5 rounded-full px-6 font-mono text-xs font-medium tracking-[0.14em] transition-colors duration-300";
  const styles =
    variant === "primary"
      ? "bg-fg text-void hover:bg-contrast"
      : "border border-line-strong text-fg hover:border-fg/40 hover:bg-contrast/5";
  return (
    <a
      href={href}
      className={`${base} ${styles} ${className}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...(download ? { download: true } : {})}
    >
      {children}
    </a>
  );
}
