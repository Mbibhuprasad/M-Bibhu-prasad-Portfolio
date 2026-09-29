import { education } from "@/lib/data";
import { FadeIn, RevealLines, SectionLabel } from "@/components/ui";

export default function Education() {
  return (
    <section id="education" aria-label="Education" className="relative py-20 md:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionLabel index="10">EDUCATION</SectionLabel>
          <RevealLines
            className="mt-8 font-display text-[40px] font-medium leading-[0.95] tracking-[-0.035em] md:text-[56px]"
            lines={["ACADEMIC", <span key="b" className="text-outline">PATH</span>]}
          />
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-8 lg:gap-8">
          {education.map((e, i) => (
            <li key={e.degree}>
              <FadeIn delay={i * 0.1} className="relative h-full border-t border-line-strong pt-6">
                <span className="absolute left-0 top-[-1px] h-px w-10 bg-accent" aria-hidden="true" />
                <div className="font-mono text-[11px] tracking-[0.14em] text-fg-3">{e.period}</div>
                <h3 className="mt-3 font-display text-xl font-medium leading-snug tracking-[-0.01em] md:text-2xl">{e.degree}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-2">{e.school}</p>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
