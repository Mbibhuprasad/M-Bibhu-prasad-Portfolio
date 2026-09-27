import { education, profile } from "@/lib/data";
import { FadeIn, RevealLines, SectionLabel } from "@/components/ui";

const facts = [
  { k: "Name", v: profile.name },
  { k: "Role", v: "Software Developer / Full-Stack Developer" },
  { k: "Location", v: profile.location },
  { k: "Focus", v: "SaaS · Healthcare · Business systems · AI integrations" },
];

export default function Profile() {
  return (
    <section id="about-profile" className="relative py-32 md:py-40">
      <div className="container-x">
        <SectionLabel index="08">PROFILE</SectionLabel>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* portrait slot */}
          <FadeIn className="lg:col-span-4">
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
                style={{ backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px)" }}
                aria-hidden="true"
              />
              <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.16em] text-fg-3">PORTRAIT — add /public/portrait.jpg</span>
              <span className="absolute bottom-4 right-4 font-mono text-[10px] tracking-[0.16em] text-fg-3">BHUBANESWAR · IN</span>
            </div>
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

          {/* education — secondary */}
          <FadeIn delay={0.3} className="lg:col-span-3">
            <div className="lg:pl-8">
              <div className="label mb-6">Education</div>
              <ul className="space-y-6">
                {education.map((e) => (
                  <li key={e.degree} className="border-l border-line pl-4">
                    <div className="font-mono text-[11px] tracking-[0.14em] text-fg-3">{e.period}</div>
                    <div className="mt-2 text-sm text-fg">{e.degree}</div>
                    <div className="mt-1 text-sm text-fg-3">{e.school}</div>
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
