"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, profile } from "@/lib/data";
import { Logo, StatusDot } from "@/components/ui";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const pathname = usePathname();
  // on sub-pages (case studies) anchors must point back to the home page
  const to = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  // highlight the section in view
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-6">
        <nav aria-label="Primary" className="flex items-center justify-between gap-4">
          <a href={to("#top")} className="glass flex h-12 items-center gap-2.5 rounded-full pl-3.5 pr-5 md:h-13">
            <Logo />
            <span className="font-display text-[15px] font-semibold tracking-[0.06em]">{profile.shortName}</span>
          </a>

          <div className="glass hidden h-10 items-center gap-2.5 rounded-full border-signal/25! px-4 font-mono text-[11px] tracking-[0.14em] text-[#c9f5e3] lg:flex">
            <StatusDot />
            AVAILABLE FOR OPPORTUNITIES
          </div>

          <div className="glass hidden h-13 items-center gap-7 rounded-full pl-6 pr-2 font-mono text-xs tracking-[0.14em] md:flex">
            {navLinks.slice(0, 4).map((l) => (
              <a
                key={l.href}
                href={to(l.href)}
                className={`transition-colors duration-300 hover:text-fg ${active === l.href ? "text-fg" : "text-fg-2"}`}
              >
                {l.label}
              </a>
            ))}
            <a
              href={to("#contact")}
              className={`inline-flex h-9.5 items-center rounded-full border px-4 transition-colors duration-300 ${
                active === "#contact" ? "border-fg bg-fg text-void" : "border-line bg-white/5 text-fg hover:bg-white/10"
              }`}
            >
              CONTACT
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="glass flex h-12 items-center gap-2.5 rounded-full px-5 font-mono text-xs tracking-[0.14em] md:hidden"
          >
            <StatusDot />
            MENU
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-60 flex flex-col bg-void/95 px-5 pb-8 pt-4 backdrop-blur-xl md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="glass flex h-12 items-center gap-2.5 rounded-full pl-3.5 pr-5">
                <Logo />
                <span className="font-display text-[15px] font-semibold tracking-[0.06em]">{profile.shortName}</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="glass grid size-12 place-items-center rounded-full"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <ul className="mt-14 flex flex-col gap-2">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={to(l.href)}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-line py-4"
                  >
                    <span className="font-mono text-xs text-fg-3">0{i + 1}</span>
                    <span className="font-display text-[44px] font-medium leading-none tracking-[-0.03em]">{l.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto flex flex-col gap-5">
              <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] text-[#c9f5e3]">
                <StatusDot /> AVAILABLE FOR OPPORTUNITIES
              </div>
              <a href={`mailto:${profile.email}`} className="text-fg-2">{profile.email}</a>
              <div className="flex gap-6 font-mono text-xs tracking-[0.14em]">
                <a href={profile.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
