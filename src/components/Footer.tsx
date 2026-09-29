"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { footerLinks, profile } from "@/lib/data";
import { EXPO, FadeIn, Logo, RevealLines } from "@/components/ui";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/SocialIcons";

export default function Footer() {
  const pathname = usePathname();
  // on sub-pages (case studies) anchors must point back to the home page
  const to = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  const rule = useRef<HTMLDivElement>(null);
  const inView = useInView(rule, { once: true, margin: "0px 0px -5% 0px" });

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0 });
  };

  const social = [
    { label: "GitHub", href: profile.github, Icon: GitHubIcon, external: true },
    { label: "LinkedIn", href: profile.linkedin, Icon: LinkedInIcon, external: true },
    { label: "Email", href: `mailto:${profile.email}`, Icon: MailIcon, external: false },
  ];

  return (
    <footer className="relative">
      {/* top rule draws in, with the orange accent tick */}
      <div ref={rule} className="container-x relative" aria-hidden="true">
        <motion.span
          className="block h-px w-full origin-left bg-line-strong"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.4, ease: EXPO }}
        />
        <motion.span
          className="absolute top-0 block h-px w-10 bg-accent"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.6 }}
        />
      </div>

      <div className="container-x grid gap-12 pb-10 pt-14 md:grid-cols-12 md:gap-8 md:pt-20">
        {/* identity */}
        <div className="md:col-span-6 lg:col-span-5">
          <div className="flex items-center gap-3">
            <Logo size={26} />
            <span className="label text-[11px]">{profile.role}</span>
          </div>
          <RevealLines
            as="p"
            className="mt-6 font-display text-[36px] font-semibold uppercase leading-[0.95] tracking-[-0.035em] sm:text-[44px] lg:text-[52px]"
            lines={["M Vibhu", <span key="m" className="text-outline">Prasad</span>]}
          />
          <FadeIn delay={0.2}>
            <p className="mt-6 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] text-fg-3">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {profile.location.toUpperCase()}
            </p>
          </FadeIn>
        </div>

        {/* navigation */}
        <FadeIn delay={0.1} className="md:col-span-3 lg:col-span-4">
          <nav aria-label="Footer">
            <div className="label mb-5">Navigate</div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-xs tracking-[0.14em] text-fg-2">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <a href={to(l.href)} className="group inline-flex items-center gap-2 transition-colors hover:text-fg">
                    <span className="h-px w-0 bg-accent transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-3" aria-hidden="true" />
                    {l.label.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </FadeIn>

        {/* social */}
        <FadeIn delay={0.2} className="md:col-span-3">
          <div className="label mb-5">Connect</div>
          <ul className="flex flex-col gap-3 font-mono text-xs tracking-[0.14em] text-fg-2">
            {social.map(({ label, href, Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer", "aria-label": `${label} (opens in a new tab)` } : {})}
                  className="inline-flex items-center gap-3 transition-colors hover:text-fg"
                >
                  <Icon size={14} />
                  {label.toUpperCase()} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>

      <div className="container-x flex items-center justify-between gap-6 border-t border-line py-6">
        <span className="font-mono text-[11px] tracking-[0.1em] text-fg-3">© 2026 {profile.name}</span>
        <button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          className="glass grid size-11 place-items-center rounded-full text-fg-2 transition-colors hover:border-accent/50! hover:text-fg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
