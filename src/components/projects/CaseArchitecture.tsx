"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Project } from "@/lib/data";
import { EXPO } from "@/components/ui";

const W = 900;
const NODE_W = 300;
const NODE_H = 84;
const X = 280; // left of the main column
const CX = X + NODE_W / 2;
const YS = [30, 180, 330, 480];

/** Animated request/response flow for a single project. */
export default function CaseArchitecture({ project, database }: { project: Project; database: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  const hasNext = project.stack.includes("Next.js");
  const layers = [
    { k: "FRONTEND", v: hasNext ? "React / Next.js" : "React", tone: "#3d7bff" },
    { k: "API", v: "REST · JSON over HTTPS", tone: "#22d3ee" },
    { k: "NODE + EXPRESS", v: "Business logic · Auth", tone: "#8b5cf6" },
    { k: "DATABASE", v: database, tone: "#34d399" },
  ];
  const rails = ["HTTPS · JSON", "JWT BEARER", "ORM / DRIVER"];

  const services = project.caseStudy.services;
  const svcY = (i: number) => 150 + i * 70 + (4 - Math.min(services.length, 4)) * 35;
  const svcX = 690;
  const backendY = YS[2] + NODE_H / 2;

  const H = YS[3] + NODE_H + 30;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Architecture: ${layers.map((l) => `${l.k} (${l.v})`).join(" → ")}; services: ${services.join(", ")}`}
    >
      <defs>
        <filter id="ca-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="ca-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0H0V30" fill="none" style={{ stroke: "rgb(var(--rgb-contrast) / 0.035)" }} />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#ca-grid)" />

      {/* vertical edges + packets */}
      {YS.slice(0, -1).map((y, i) => {
        const y1 = y + NODE_H;
        const y2 = YS[i + 1];
        const down = `M${CX - 10},${y1} L${CX - 10},${y2}`;
        const up = `M${CX + 10},${y2} L${CX + 10},${y1}`;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : undefined} transition={{ delay: 0.3 + i * 0.25, duration: 0.6 }}>
            <path d={down} fill="none" stroke="rgba(61,123,255,0.35)" strokeDasharray="3 5" style={{ animation: "dash-flow 2s linear infinite" }} />
            <path d={up} fill="none" stroke="rgba(34,211,238,0.3)" strokeDasharray="3 5" style={{ animation: "dash-flow 2s linear infinite reverse" }} />
            <circle r="4" fill="#3d7bff" filter="url(#ca-glow)">
              <animateMotion dur="1.6s" repeatCount="indefinite" path={down} begin={`${i * 0.4}s`} />
            </circle>
            <circle r="3.5" fill="#22d3ee" filter="url(#ca-glow)">
              <animateMotion dur="1.6s" repeatCount="indefinite" path={up} begin={`${0.8 + i * 0.4}s`} />
            </circle>
            <text x={X - 24} y={(y1 + y2) / 2 + 4} textAnchor="end" className="fill-fg-3 font-mono text-[11px] tracking-[0.14em]">
              {rails[i]}
            </text>
          </motion.g>
        );
      })}

      {/* service connectors */}
      {services.map((s, i) => {
        const y = svcY(i) + 22;
        const d = `M${X + NODE_W},${backendY} C${X + NODE_W + 60},${backendY} ${svcX - 60},${y} ${svcX},${y}`;
        return (
          <motion.g key={s} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : undefined} transition={{ delay: 1.2 + i * 0.12, duration: 0.6 }}>
            <path d={d} fill="none" stroke="rgba(139,92,246,0.35)" strokeDasharray="2 5" />
            <circle r="3" fill="#a78bfa" filter="url(#ca-glow)">
              <animateMotion dur="2.2s" repeatCount="indefinite" path={d} begin={`${i * 0.5}s`} />
            </circle>
            <rect x={svcX} y={svcY(i)} width={180} height={44} rx={10} style={{ fill: "rgb(var(--rgb-surface) / 0.9)", stroke: "rgb(var(--rgb-contrast) / 0.1)" }} />
            <circle cx={svcX + 18} cy={svcY(i) + 22} r={3} fill="#8b5cf6" />
            <text x={svcX + 32} y={svcY(i) + 26} className="fill-fg font-mono text-[12px] tracking-[0.06em]">
              {s}
            </text>
          </motion.g>
        );
      })}

      {/* layer nodes */}
      {layers.map((l, i) => (
        <motion.g
          key={l.k}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: i * 0.15, duration: 0.8, ease: EXPO }}
        >
          <rect x={X} y={YS[i]} width={NODE_W} height={NODE_H} rx={16} style={{ fill: "rgb(var(--rgb-surface) / 0.92)", stroke: "rgb(var(--rgb-contrast) / 0.12)" }} />
          <rect x={X + 20} y={YS[i]} width={NODE_W - 40} height={1} fill={l.tone} />
          <circle cx={X + 26} cy={YS[i] + 30} r={4} fill={l.tone} filter="url(#ca-glow)" />
          <text x={X + 40} y={YS[i] + 34} className="fill-fg font-display text-[18px] font-medium tracking-[0.04em]">
            {l.k}
          </text>
          <text x={X + 26} y={YS[i] + 60} className="fill-fg-2 font-mono text-[12px]">
            {l.v}
          </text>
          <text x={X + NODE_W - 20} y={YS[i] + 34} textAnchor="end" className="fill-fg-3 font-mono text-[10px] tracking-[0.14em]">
            L{i + 1}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
