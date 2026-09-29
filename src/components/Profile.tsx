import { certifications, clientWork, learning, profile } from "@/lib/data";
import { FadeIn, FloatCard, RevealLines, SectionLabel } from "@/components/ui";

const facts = [
  { k: "Name", v: profile.name },
  { k: "Role", v: "Software Developer / Full-Stack Developer" },
  { k: "Location", v: profile.location },
  { k: "Focus", v: "SaaS · Healthcare · Business systems · AI integrations" },
  { k: "Experience", v: "1+ year professional experience" },
  { k: "Client work", v: clientWork.map((c) => c.client).join(" · ") },
];

export default function Profile() {
  return (
    <section id="about-profile" className="relative z-10 py-32 md:py-40">
      <div className="container-x">
        <SectionLabel index="03">PROFILE</SectionLabel>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* portrait slot */}
          <FadeIn className="lg:col-span-4">
            <FloatCard className="w-full max-w-[420px]">
              <div className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-surface-2 via-ink to-void">
                <div
                  className="absolute inset-0 opacity-60"
                  style={{ background: "radial-gradient(80% 60% at 50% 30%, rgba(61,123,255,0.25), transparent 70%)" }}
                  aria-hidden="true"
                />
                {/* silhouette hint */}
                <svg className="absolute inset-x-0 bottom-0 mx-auto h-[72%] w-auto text-fg/10" viewBox="0 0 200 240" fill="none" aria-hidden="true">
                  <circle cx="100" cy="78" r="44" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M20 240c4-60 40-96 80-96s76 36 80 96" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{ backgroundImage: "repeating-linear-gradient(to bottom, rgb(var(--rgb-contrast) / 0.05) 0 1px, transparent 1px 4px)" }}
                  aria-hidden="true"
                />
                <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.16em] text-fg-3">PORTRAIT — add /public/portrait.jpg</span>
                <span className="absolute bottom-4 right-4 font-mono text-[10px] tracking-[0.16em] text-fg-3">BHUBANESWAR · IN</span>
              </div>
            </FloatCard>
          </FadeIn>

          {/* professional profile */}
          <div className="lg:col-span-5">
            <RevealLines
              className="font-display text-[48px] font-medium leading-[0.95] tracking-[-0.035em] md:text-[72px]"
              lines={["BIBHU PRASAD", <span key="m" className="text-outline">MAHAPATRA</span>]}
            />
            <FadeIn delay={0.15}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-fg-2">
                I work across the full stack — interfaces, APIs and databases — building SaaS platforms, healthcare systems
                and business software that run in production at Daya Consultancy Services.
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <dl className="mt-10 divide-y divide-line border-y border-line">
                {facts.map((f) => (
                  <div key={f.k} className="grid grid-cols-[110px_1fr] gap-4 py-4">
                    <dt className="label">{f.k}</dt>
                    <dd className="text-fg">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </FadeIn>
          </div>

          {/* certifications — secondary (education has its own section) */}
          <FadeIn delay={0.3} className="lg:col-span-3">
            <div className="lg:pl-8">
              <div className="label mb-6">Certifications</div>
              <ul className="space-y-5">
                {certifications.map((c) => (
                  <li key={c.title} className="border-l border-line pl-4">
                    <div className="font-mono text-[11px] tracking-[0.14em] text-fg-3">{c.issued ? c.issued.toUpperCase() : c.issuer.toUpperCase()}</div>
                    <div className="mt-2 text-sm text-fg">
                      {c.url ? (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line-strong underline-offset-4 hover:decoration-accent">
                          {c.title}
                        </a>
                      ) : (
                        c.title
                      )}
                    </div>
                    {c.issued && <div className="mt-1 text-sm text-fg-3">{c.issuer}</div>}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Additional learning">
                {learning.map((l) => (
                  <li key={l} className="rounded-md border border-line px-2 py-1 font-mono text-[10px] tracking-[0.06em] text-fg-3">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
