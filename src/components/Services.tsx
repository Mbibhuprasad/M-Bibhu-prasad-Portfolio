"use client";

import { useRef } from "react";
import { services } from "@/lib/data";
import { FadeIn, RevealLines, SectionLabel } from "@/components/ui";

const P = { pathLength: 1, strokeDasharray: "1" } as const;

const icons: React.ReactNode[] = [
  // 01 full-stack web apps — browser window
  <>
    <rect {...P} x="3" y="4" width="18" height="16" rx="2" />
    <path {...P} d="M3 8.5h18" />
    <path {...P} d="M9 13l-2 2 2 2M15 13l2 2-2 2" />
  </>,
  // 02 SaaS — stacked layers
  <>
    <path {...P} d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
    <path {...P} d="m3 12 9 4.5 9-4.5" />
    <path {...P} d="m3 16.5 9 4.5 9-4.5" />
  </>,
  // 03 healthcare — pulse
  <>
    <rect {...P} x="3" y="3" width="18" height="18" rx="4" />
    <path {...P} d="M6 12h3l1.5-3 3 6 1.5-3h3" />
  </>,
  // 04 business management — bars
  <>
    <path {...P} d="M4 20h16" />
    <path {...P} d="M7 16v-5M12 16V7M17 16v-8" />
  </>,
  // 05 REST APIs — braces + node
  <>
    <path {...P} d="M8 4c-2 0-2.5 1-2.5 3v2c0 1.5-.8 2.5-2 3 1.2.5 2 1.5 2 3v2c0 2 .5 3 2.5 3" />
    <path {...P} d="M16 4c2 0 2.5 1 2.5 3v2c0 1.5.8 2.5 2 3-1.2.5-2 1.5-2 3v2c0 2-.5 3-2.5 3" />
    <circle {...P} cx="12" cy="12" r="1.8" />
  </>,
  // 06 AI — neural nodes
  <>
    <circle {...P} cx="12" cy="5" r="2" />
    <circle {...P} cx="5" cy="17" r="2" />
    <circle {...P} cx="19" cy="17" r="2" />
    <path {...P} d="M11 7l-5 8.2M13 7l5 8.2M7 17h10" />
  </>,
  // 07 admin dashboards — panel grid
  <>
    <rect {...P} x="3" y="3" width="8" height="10" rx="1.5" />
    <rect {...P} x="13" y="3" width="8" height="6" rx="1.5" />
    <rect {...P} x="13" y="11" width="8" height="10" rx="1.5" />
    <rect {...P} x="3" y="15" width="8" height="6" rx="1.5" />
  </>,
  // 08 cloud deployment — cloud + arrow
  <>
    <path {...P} d="M7 18a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17 9a3.5 3.5 0 0 1 .5 7" />
    <path {...P} d="M12 20v-7M9.5 15.5 12 13l2.5 2.5" />
  </>,
];

function Module({ n, title, desc, icon }: { n: string; title: string; desc: string; icon: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || !window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${(-py * 12).toFixed(2)}deg) rotateY(${(px * 12).toFixed(2)}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div className="[perspective:1200px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="svc group relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-2xl border border-line bg-ink/70 p-6 transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] hover:border-line-strong hover:bg-surface/80"
      >
        {/* pointer light */}
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgba(61,123,255,0.12), transparent 60%)" }}
          aria-hidden="true"
        />
        {/* ports */}
        <span className="absolute right-5 top-5 flex gap-1" aria-hidden="true">
          <span className="size-1 rounded-full bg-line-strong transition-colors duration-500 group-hover:bg-electric" />
          <span className="size-1 rounded-full bg-line-strong" />
          <span className="size-1 rounded-full bg-line-strong" />
        </span>

        <span className="font-mono text-xs tracking-[0.16em] text-fg-3 transition-colors duration-500 group-hover:text-electric">{n}</span>

        <svg
          className="svc-icon mt-8 text-fg-2 transition-colors duration-500 group-hover:text-fg [transform:translateZ(30px)]"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {icon}
        </svg>

        <h3 className="mt-auto pt-8 font-display text-xl font-medium uppercase leading-[1.1] tracking-[-0.01em] [transform:translateZ(20px)]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-fg-2">{desc}</p>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-32 md:py-40">
      <style>{`
        @keyframes svc-draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
        .svc:hover .svc-icon * { animation: svc-draw 1.1s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>
      <div className="container-x">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="07">WHAT I BUILD</SectionLabel>
            <RevealLines
              className="mt-8 font-display text-[56px] font-medium leading-[0.95] tracking-[-0.035em] md:text-[96px]"
              lines={["WHAT I", <span key="b" className="text-outline">BUILD</span>]}
            />
          </div>
          <FadeIn delay={0.2}>
            <p className="max-w-sm text-[17px] leading-relaxed text-fg-2">
              Production software across the stack — the kinds of systems I design, build and ship.
            </p>
          </FadeIn>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.06} className="h-full">
              <Module n={s.n} title={s.title} desc={s.desc} icon={icons[i]} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
