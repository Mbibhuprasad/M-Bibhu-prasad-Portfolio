"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeIn, RevealLines, SectionLabel } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

type ServiceId = "cloudinary" | "aws" | "auth" | "ai";

const layers: {
  id: string;
  kicker: string;
  title: string;
  stack: string;
  telemetry: string;
  services: ServiceId[];
}[] = [
  { id: "frontend", kicker: "L1", title: "FRONTEND", stack: "React / Next.js / Vite", telemetry: "render /dashboard · hydrated", services: ["auth"] },
  { id: "api", kicker: "L2", title: "API LAYER", stack: "REST APIs", telemetry: "GET /api/patients · 200", services: ["auth"] },
  { id: "backend", kicker: "L3", title: "BACKEND", stack: "Node.js + Express.js", telemetry: "POST /orders → controller · 201", services: ["auth", "cloudinary", "ai", "aws"] },
  { id: "database", kicker: "L4", title: "DATABASE", stack: "MongoDB / MySQL", telemetry: "query appointments · indexed", services: ["aws"] },
];

const serviceList: { id: ServiceId; name: string; note: string }[] = [
  { id: "cloudinary", name: "Cloudinary", note: "media" },
  { id: "aws", name: "AWS", note: "cloud" },
  { id: "auth", name: "Authentication", note: "JWT" },
  { id: "ai", name: "AI APIs", note: "LLM" },
];

const logLines = [
  { m: "GET", p: "/api/patients", s: "200" },
  { m: "POST", p: "/api/auth/login", s: "200" },
  { m: "POST", p: "/api/orders", s: "201" },
  { m: "PUT", p: "/api/inventory/42", s: "200" },
  { m: "POST", p: "/api/ai/assistant", s: "200" },
];

/** Vertical link between two layers: request packet travels down, response travels up. */
function Connector({ index }: { index: number }) {
  return (
    <div className="arch-connector relative mx-auto h-16 w-24" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 96 64" fill="none" preserveAspectRatio="none">
        <line className="arch-line" x1="36" y1="0" x2="36" y2="64" stroke="rgba(61,123,255,0.55)" strokeWidth="1" strokeDasharray="3 5" />
        <line className="arch-line" x1="60" y1="0" x2="60" y2="64" stroke="rgba(34,211,238,0.45)" strokeWidth="1" strokeDasharray="3 5" />
      </svg>
      <span
        className="arch-packet-down absolute left-[36px] top-0 -ml-[3px] size-1.5 rounded-full bg-electric shadow-[0_0_10px_2px_rgba(61,123,255,0.8)]"
        style={{ animationDelay: `${index * 0.4}s` }}
      />
      <span
        className="arch-packet-up absolute left-[60px] top-0 -ml-[3px] size-1.5 rounded-full bg-cyan shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]"
        style={{ animationDelay: `${index * 0.4 + 0.8}s` }}
      />
    </div>
  );
}

export default function Architecture() {
  const root = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const litServices = new Set<ServiceId>(hovered ? layers.find((l) => l.id === hovered)?.services ?? [] : []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.from(".arch-node", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.15,
        scrollTrigger: { trigger: ".arch-diagram", start: "top 75%" },
      });
      gsap.from(".arch-connector", {
        opacity: 0,
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.15,
        delay: 0.1,
        scrollTrigger: { trigger: ".arch-diagram", start: "top 75%" },
      });
      gsap.from(".arch-bus", {
        strokeDashoffset: 1,
        duration: 1.4,
        ease: "expo.inOut",
        scrollTrigger: { trigger: ".arch-services", start: "top 85%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const dim = (id: string) => (hovered && hovered !== id ? "opacity-40" : "opacity-100");

  return (
    <section ref={root} id="architecture" className="relative overflow-hidden py-20 md:py-28">
      <style>{`
        @keyframes arch-down { 0% { transform: translateY(-4px); opacity: 0 } 15% { opacity: 1 } 85% { opacity: 1 } 100% { transform: translateY(62px); opacity: 0 } }
        @keyframes arch-up { 0% { transform: translateY(62px); opacity: 0 } 15% { opacity: 1 } 85% { opacity: 1 } 100% { transform: translateY(-4px); opacity: 0 } }
        .arch-packet-down { animation: arch-down 1.6s linear infinite; }
        .arch-packet-up { animation: arch-up 1.6s linear infinite; }
        .arch-line { animation: dash-flow 3s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .arch-packet-down, .arch-packet-up { display: none } }
      `}</style>

      {/* backdrop: faint blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61,123,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(61,123,255,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="container-x relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          {/* left: heading + legend */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionLabel index="08">HOW I BUILD</SectionLabel>
              <RevealLines
                className="mt-8 font-display text-[56px] font-medium leading-[0.95] tracking-[-0.035em] md:text-[80px]"
                lines={["HOW I", <span key="b" className="text-outline">BUILD</span>]}
              />
              <FadeIn delay={0.2}>
                <p className="mt-8 max-w-sm text-[17px] leading-relaxed text-fg-2">
                  Every product I ship follows the same backbone: a fast interface, a clean API contract, a disciplined
                  backend and a data layer that holds up in production.
                </p>
              </FadeIn>

              <FadeIn delay={0.3} className="mt-12 hidden lg:block">
                <div className="label mb-4">Legend</div>
                <ul className="space-y-3 font-mono text-xs tracking-[0.08em] text-fg-2">
                  <li className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-electric shadow-[0_0_10px_#3d7bff]" /> Request packet
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-cyan shadow-[0_0_10px_#22d3ee]" /> Response packet
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-signal" /> Layer healthy
                  </li>
                </ul>

                <div className="glass mt-10 rounded-xl p-5">
                  <div className="label mb-4 flex items-center justify-between">
                    <span>Request log</span>
                    <span className="text-[10px] text-fg-3">Illustrative</span>
                  </div>
                  <ul className="space-y-2 font-mono text-[11px] text-fg-2">
                    {logLines.map((l, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="w-10 text-electric">{l.m}</span>
                        <span className="flex-1 truncate">{l.p}</span>
                        <span className="text-signal">{l.s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* right: live diagram */}
          <div className="arch-diagram lg:col-span-8 lg:pl-8">
            <div className="mx-auto max-w-[620px]" onPointerLeave={() => setHovered(null)}>
              {layers.map((layer, i) => (
                <div key={layer.id}>
                  <div
                    className={`arch-node group relative rounded-2xl border border-line bg-ink/80 p-5 backdrop-blur transition-[opacity,border-color,box-shadow] duration-500 hover:border-electric/50 hover:shadow-[0_0_60px_-20px_rgba(61,123,255,0.6)] md:p-6 ${dim(layer.id)}`}
                    onPointerEnter={() => setHovered(layer.id)}
                    onFocus={() => setHovered(layer.id)}
                    onBlur={() => setHovered(null)}
                    tabIndex={0}
                    aria-label={`${layer.title}: ${layer.stack}`}
                  >
                    {/* ports */}
                    <span className="absolute -top-[5px] left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-line-strong bg-void" aria-hidden="true" />
                    <span className="absolute -bottom-[5px] left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-line-strong bg-void" aria-hidden="true" />

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-[11px] tracking-[0.16em] text-fg-3">
                          {layer.kicker} <span className="mx-2 text-line-strong">/</span> LAYER
                        </div>
                        <div className="mt-3 font-display text-2xl font-medium tracking-[-0.02em] md:text-[28px]">{layer.title}</div>
                        <div className="mt-1 text-fg-2">{layer.stack}</div>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-signal">
                        <span className="pulse-dot size-1.5 rounded-full bg-signal" /> LIVE
                      </div>
                    </div>
                    <div className="mt-5 flex items-center gap-3 border-t border-line pt-4 font-mono text-[11px] text-fg-3">
                      <span className="text-electric">›</span>
                      <span className="truncate">{layer.telemetry}</span>
                      <span className="ml-auto hidden gap-1 sm:flex" aria-hidden="true">
                        {Array.from({ length: 12 }).map((_, k) => (
                          <span
                            key={k}
                            className="w-1 rounded-sm bg-electric/40"
                            style={{ height: `${6 + ((k * 7 + i * 5) % 11)}px` }}
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                  <Connector index={i} />
                </div>
              ))}

              {/* services bus */}
              <div className={`arch-services arch-node relative rounded-2xl border border-line bg-ink/60 p-5 backdrop-blur md:p-6 ${hovered ? "opacity-100" : ""}`}>
                <span className="absolute -top-[5px] left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-line-strong bg-void" aria-hidden="true" />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[11px] tracking-[0.16em] text-fg-3">L5 / SERVICES</div>
                    <div className="mt-3 font-display text-2xl font-medium tracking-[-0.02em] md:text-[28px]">SERVICES</div>
                  </div>
                  <span className="label hidden text-[10px] sm:block">Hover a layer</span>
                </div>

                <svg className="mt-5 hidden h-6 w-full sm:block" viewBox="0 0 400 24" preserveAspectRatio="none" fill="none" aria-hidden="true">
                  <path
                    className="arch-bus"
                    pathLength={1}
                    strokeDasharray="1"
                    d="M200 0 V8 M50 8 H350 M50 8 V24 M150 8 V24 M250 8 V24 M350 8 V24"
                    style={{ stroke: "rgb(var(--rgb-fg) / 0.2)" }}
                    strokeWidth="1"
                  />
                </svg>

                <ul className="mt-3 grid grid-cols-2 gap-3 sm:mt-0 sm:grid-cols-4">
                  {serviceList.map((s) => {
                    const lit = litServices.has(s.id);
                    return (
                      <li
                        key={s.id}
                        className={`rounded-xl border px-3 py-3 transition-all duration-500 ${
                          lit
                            ? "border-cyan/60 bg-cyan/10 shadow-[0_0_30px_-10px_rgba(34,211,238,0.8)]"
                            : hovered
                              ? "border-line opacity-40"
                              : "border-line"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`size-1.5 rounded-full ${lit ? "bg-cyan shadow-[0_0_8px_#22d3ee]" : "bg-fg-3"}`} />
                          <span className="text-sm text-fg">{s.name}</span>
                        </div>
                        <div className="mt-1 pl-3.5 font-mono text-[10px] tracking-[0.14em] text-fg-3 uppercase">{s.note}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
