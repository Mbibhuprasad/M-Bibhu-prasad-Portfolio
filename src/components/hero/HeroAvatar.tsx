import Image from "next/image";
import { profile } from "@/lib/data";
import { Magnetic } from "@/components/ui";

/** Small identity marker for the hero's top-right corner (3rem → 3.5rem). */
export default function HeroAvatar({ className = "" }: { className?: string }) {
  return (
    <Magnetic className={className}>
      <div data-cursor="magnetic" className="group relative size-12 lg:size-14">
        {/* blue → orange halo */}
        <span
          aria-hidden="true"
          className="absolute -inset-1.5 rounded-full opacity-60 blur-md transition-opacity duration-500 group-hover:opacity-90"
          style={{ background: "conic-gradient(from 210deg, rgba(61,123,255,0.55), rgba(61,123,255,0.1), var(--color-accent), rgba(61,123,255,0.55))" }}
        />
        <span className="relative block size-full overflow-hidden rounded-full border border-line-strong bg-ink ring-1 ring-accent/30 ring-offset-2 ring-offset-void">
          {profile.avatar ? (
            <Image src={profile.avatar} alt={profile.name} fill sizes="56px" className="object-cover" priority />
          ) : (
            <span role="img" aria-label={profile.name} className="grid size-full place-items-center font-display text-sm font-semibold tracking-[0.04em] text-fg lg:text-base">
              {profile.initials}
            </span>
          )}
        </span>
        {/* status pip */}
        <span aria-hidden="true" className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-void bg-signal" />
      </div>
    </Magnetic>
  );
}
