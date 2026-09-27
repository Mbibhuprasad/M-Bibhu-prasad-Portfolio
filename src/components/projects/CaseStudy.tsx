"use client";

// TODO: Case study copy is a draft — confirm details (problem, solution, challenges, contribution) with real project facts.

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/data";
import { EXPO, FadeIn, RevealLines, TechBadge } from "@/components/ui";
import ProjectEnvironment from "./ProjectEnvironment";
import CaseArchitecture from "./CaseArchitecture";

const SECTIONS = [
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "architecture", label: "Architecture" },
  { id: "features", label: "Features" },
  { id: "technology", label: "Technology" },
  { id: "challenges", label: "Challenges" },
  { id: "contribution", label: "My Contribution" },
  { id: "screenshots", label: "Screenshots" },
] as const;

function Block({ id, index, title, children }: { id: string; index: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-line py-14 md:py-20">
      <div className="label mb-6 flex items-center gap-3">
        <span className="text-fg-2">{String(index + 1).padStart(2, "0")}</span>
        <span className="h-px w-8 bg-line-strong" />
        <span>{title}</span>
      </div>
      {children}
    </section>
  );
}

export default function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const [current, setCurrent] = useState<string>("problem");
  const cs = project.caseStudy;

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <article className="relative pb-24">
      {/* hero band */}
      <header className="container-x pt-32 md:pt-40">
        <Link href="/#work" className="font-mono text-xs tracking-[0.16em] text-fg-2 transition-colors hover:text-fg">
          ← ALL WORK
        </Link>
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <span className="font-display text-6xl font-semibold leading-none tracking-[-0.05em] text-outline md:text-8xl">{project.number}</span>
              <span className="rounded-full border border-line px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-fg-2">
                {project.category.toUpperCase()}
              </span>
            </div>
            <RevealLines
              as="h1"
              lines={[project.title.toUpperCase()]}
              className="mt-6 max-w-5xl font-display text-[44px] font-medium leading-[0.95] tracking-[-0.04em] md:text-[88px]"
            />
          </div>
          <dl className="grid grid-cols-2 gap-6 font-mono text-xs tracking-[0.12em] lg:min-w-[320px]">
            <div>
              <dt className="text-fg-3">ROLE</dt>
              <dd className="mt-2 text-fg">FULL-STACK DEVELOPER</dd>
            </div>
            <div>
              <dt className="text-fg-3">DATABASE</dt>
              <dd className="mt-2 text-fg">{cs.database.toUpperCase()}</dd>
            </div>
          </dl>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {project.stack.map((s, i) => (
            <TechBadge key={s} tier={/AI/.test(s) ? "ai" : i < 3 ? "primary" : "secondary"}>
              {s}
            </TechBadge>
          ))}
        </div>
      </header>

      {/* environment */}
      <motion.div
        className="container-x mt-14"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: EXPO }}
      >
        <ProjectEnvironment project={project} className="h-[320px] rounded-[28px] border border-line sm:h-[480px] lg:h-[640px]" />
      </motion.div>

      {/* body */}
      <div className="container-x mt-16 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
        <nav aria-label="Case study sections" className="hidden lg:block">
          <ul className="sticky top-32 flex flex-col gap-3">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`flex items-center gap-3 font-mono text-xs tracking-[0.12em] transition-colors ${current === s.id ? "text-fg" : "text-fg-3 hover:text-fg-2"}`}
                >
                  <span
                    className={`h-px transition-all duration-500 ${current === s.id ? "w-8 bg-cyan" : "w-3 bg-line-strong"}`}
                    aria-hidden="true"
                  />
                  {String(i + 1).padStart(2, "0")} {s.label.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="max-w-4xl">
          <Block id="problem" index={0} title="Problem">
            <FadeIn>
              <p className="font-display text-2xl leading-snug tracking-[-0.01em] md:text-[32px]">{cs.problem}</p>
            </FadeIn>
          </Block>

          <Block id="solution" index={1} title="Solution">
            <FadeIn>
              <p className="text-lg leading-relaxed text-fg-2 md:text-xl">{cs.solution}</p>
            </FadeIn>
          </Block>

          <Block id="architecture" index={2} title="Architecture">
            <div className="overflow-hidden rounded-[20px] border border-line bg-ink p-4 md:p-8">
              <CaseArchitecture project={project} />
            </div>
            <p className="mt-4 font-mono text-[11px] tracking-[0.12em] text-fg-3">
              <span className="text-electric">●</span> REQUEST &nbsp;&nbsp; <span className="text-cyan">●</span> RESPONSE &nbsp;&nbsp;{" "}
              <span className="text-violet">●</span> SERVICE CALL
            </p>
          </Block>

          <Block id="features" index={3} title="Features">
            <ul className="grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-2">
              {project.features.map((f, i) => (
                <li key={f} className="flex items-center gap-4 bg-ink p-5">
                  <span className="font-mono text-[11px] text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px]">{f}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="technology" index={4} title="Technology">
            <div className="flex flex-wrap gap-2">
              {[...project.stack, ...cs.services.filter((s) => !project.stack.includes(s))].map((s, i) => (
                <TechBadge key={s} tier={/AI/.test(s) ? "ai" : i < 3 ? "primary" : "secondary"}>
                  {s}
                </TechBadge>
              ))}
            </div>
          </Block>

          <Block id="challenges" index={5} title="Challenges">
            <ul className="flex flex-col">
              {cs.challenges.map((c, i) => (
                <FadeIn key={c} delay={i * 0.06}>
                  <li className="flex gap-5 border-b border-line py-5 last:border-b-0">
                    <span className="font-mono text-xs text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-lg">{c}</span>
                  </li>
                </FadeIn>
              ))}
            </ul>
          </Block>

          <Block id="contribution" index={6} title="My Contribution">
            <ul className="grid gap-3 sm:grid-cols-2">
              {cs.contribution.map((c) => (
                <li key={c} className="glass rounded-2xl p-5 text-[15px] text-fg-2">
                  <span className="mb-3 block h-px w-8" style={{ background: project.accent }} aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </Block>

          <Block id="screenshots" index={7} title="Screenshots">
            {/* TODO: replace placeholders with real screenshots in /public/work/ */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`grid place-items-center rounded-[20px] border border-dashed border-line-strong bg-ink p-6 text-center font-mono text-[11px] tracking-[0.14em] text-fg-3 ${n === 1 ? "aspect-[16/9] sm:col-span-2" : "aspect-[4/3]"}`}
                >
                  SCREENSHOT — add /public/work/{project.slug}-{n}.png
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {/* TODO: add real Live Demo and GitHub URLs */}
              <a href="#" className="inline-flex h-13 items-center gap-2.5 rounded-full bg-fg px-6 font-mono text-xs font-medium tracking-[0.14em] text-void hover:bg-white">
                LIVE DEMO ↗
              </a>
              <a href="#" className="inline-flex h-13 items-center gap-2.5 rounded-full border border-line-strong px-6 font-mono text-xs tracking-[0.14em] hover:bg-white/5">
                GITHUB ↗
              </a>
            </div>
          </Block>
        </div>
      </div>

      {/* next project */}
      <Link
        href={`/work/${next.slug}`}
        className="group container-x mt-16 block border-t border-line pt-16"
      >
        <span className="label">Next project — {next.number}</span>
        <span className="mt-6 flex items-end justify-between gap-6">
          <span className="font-display text-[40px] font-medium leading-[0.95] tracking-[-0.04em] transition-colors group-hover:text-cyan md:text-[80px]">
            {next.title.toUpperCase()}
          </span>
          <span className="mb-3 text-4xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-6xl" aria-hidden="true">
            →
          </span>
        </span>
      </Link>
    </article>
  );
}
