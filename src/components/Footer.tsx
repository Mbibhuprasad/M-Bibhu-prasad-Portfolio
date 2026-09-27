import { profile } from "@/lib/data";
import { Logo } from "@/components/ui";

export default function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="container-x flex flex-col gap-10 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Logo size={28} />
          <div>
            <div className="font-display text-lg font-semibold tracking-[0.06em]">{profile.shortName}</div>
            <div className="label mt-1 text-[11px]">Full-Stack Developer</div>
          </div>
        </div>

        <nav aria-label="Social" className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs tracking-[0.14em] text-fg-2">
          <a href={profile.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-fg">GITHUB ↗</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-fg">LINKEDIN ↗</a>
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-fg">EMAIL ↗</a>
        </nav>

        <div className="flex items-center justify-between gap-8 md:justify-end">
          <span className="font-mono text-[11px] tracking-[0.1em] text-fg-3">© 2026 Bibhu Prasad Mahapatra</span>
          <a
            href="#top"
            aria-label="Back to top"
            className="glass grid size-11 place-items-center rounded-full text-fg-2 transition-colors hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
