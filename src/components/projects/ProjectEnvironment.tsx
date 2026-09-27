"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/data";

/* ───────── shared building blocks ───────── */

type PanelProps = {
  className?: string;
  depth?: number; // parallax strength in px
  title?: string;
  accent: string;
  children: React.ReactNode;
};

function Panel({ className = "", depth = 10, title, accent, children }: PanelProps) {
  return (
    <div
      className={`absolute rounded-2xl border border-white/10 bg-[rgba(14,17,25,0.78)] p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      style={{ transform: `translate3d(calc(var(--mx, 0) * ${depth}px), calc(var(--my, 0) * ${depth}px), 0)` }}
    >
      <span
        className="absolute inset-x-4 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        aria-hidden="true"
      />
      {title && (
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-fg-3">
          <span>{title}</span>
          <span className="flex gap-1" aria-hidden="true">
            <span className="size-1 rounded-full bg-white/20" />
            <span className="size-1 rounded-full bg-white/20" />
            <span className="size-1 rounded-full" style={{ background: accent }} />
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

function Spark({ points, accent, h = 60, w = 240, fill = true }: { points: number[]; accent: string; h?: number; w?: number; fill?: boolean }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const step = w / (points.length - 1);
  const ys = points.map((p) => h - ((p - min) / (max - min || 1)) * (h - 6) - 3);
  const d = ys.map((y, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)},${y.toFixed(1)}`).join(" ");
  const id = `sp-${accent.replace("#", "")}-${points.length}-${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block w-full" style={{ height: h }} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />}
      <path d={d} fill="none" stroke={accent} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Bars({ values, accent, h = 70 }: { values: number[]; accent: string; h?: number }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-1.5" style={{ height: h }} aria-hidden="true">
      {values.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${(v / max) * 100}%`,
            background: i === values.length - 1 ? accent : "rgba(242,244,248,0.14)",
          }}
        />
      ))}
    </div>
  );
}

function Meter({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between font-mono text-[10px] tracking-[0.1em] text-fg-2">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/8">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: value < 30 ? "#f87171" : accent }} />
      </div>
    </div>
  );
}

function Row({ a, b, c, accent, strong }: { a: string; b: string; c?: string; accent?: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-white/6 py-2 text-[11px] first:border-t-0">
      <span className="font-mono text-fg-3">{a}</span>
      <span className={`flex-1 truncate ${strong ? "text-fg" : "text-fg-2"}`}>{b}</span>
      {c && (
        <span className="rounded-full px-2 py-0.5 font-mono text-[9px] tracking-[0.1em]" style={{ color: accent, background: `${accent}1f` }}>
          {c}
        </span>
      )}
    </div>
  );
}

const Icon = {
  cross: (
    <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
  ),
  bed: <path d="M3 18V6M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3M7 11.5a1.5 1.5 0 1 0 0-.01" />,
  car: <path d="M5 16h14M6 16v2M18 16v2M4 16l1.5-5A2 2 0 0 1 7.4 9.5h9.2a2 2 0 0 1 1.9 1.5L20 16M7.5 13h.01M16.5 13h.01" />,
  bowl: <path d="M3 11h18a9 9 0 0 1-18 0zM8 7c0-1 1-1.5 1-2.5M12 7c0-1 1-1.5 1-2.5M16 7c0-1 1-1.5 1-2.5" />,
  ticket: <path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4zM14 7v10" />,
  bag: <path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2" />,
  flask: <path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7 15h10" />,
  microscope: <path d="M6 21h12M9 17h6M12 17v4M10 3l4 2-3 6-4-2zM11 11a5 5 0 0 1 5 5M8.5 7.5l-1.5 3" />,
  gauge: <path d="M4 16a8 8 0 1 1 16 0M12 16l4-5M4 20h16" />,
  doc: <path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" />,
  ship: <path d="M3 17l2 4h14l2-4zM6 17V9h12v8M9 9V5h6v4M12 5V2" />,
  ambulance: <path d="M3 16V8h11v8M14 11h4l3 3v2h-7M6.5 18.5a1.5 1.5 0 1 0 .01 0M17.5 18.5a1.5 1.5 0 1 0 .01 0M7 12h4M9 10v4" />,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
};

function Glyph({ d, className = "", size = 18 }: { d: React.ReactNode; className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {d}
    </svg>
  );
}

/** Deterministic QR-like matrix (decorative). */
function QR({ accent }: { accent: string }) {
  const n = 21;
  const cells: React.ReactNode[] = [];
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (finder(x, y)) continue;
      const v = (x * 31 + y * 17 + x * y * 7) % 11;
      if (v < 5) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  const F = ({ x, y }: { x: number; y: number }) => (
    <g>
      <rect x={x + 0.5} y={y + 0.5} width="6" height="6" fill="none" stroke={accent} strokeWidth="1" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill={accent} />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="size-full" shapeRendering="crispEdges" aria-hidden="true">
      <g fill="rgba(242,244,248,0.85)">{cells}</g>
      <F x={0} y={0} />
      <F x={n - 7} y={0} />
      <F x={0} y={n - 7} />
    </svg>
  );
}

/* ───────── scenes ───────── */

function HealthScene({ a }: { a: string }) {
  return (
    <>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5" aria-hidden="true">
        <Glyph d={Icon.cross} size={260} />
      </div>
      <Panel accent={a} depth={14} title="PATIENT" className="left-[5%] top-[8%] w-[46%]">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full font-display text-sm" style={{ background: `${a}22`, color: a }}>AK</span>
          <div>
            <p className="text-sm text-fg">Patient #A-1042</p>
            <p className="font-mono text-[10px] text-fg-3">CARDIOLOGY · FOLLOW-UP</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["HR", "72", "bpm"],
            ["BP", "118/76", ""],
            ["SpO₂", "98", "%"],
          ].map(([k, v, u]) => (
            <div key={k} className="rounded-lg border border-white/6 bg-white/3 p-2">
              <p className="font-mono text-[9px] text-fg-3">{k}</p>
              <p className="font-display text-sm text-fg">
                {v}
                <span className="text-[10px] text-fg-3"> {u}</span>
              </p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel accent={a} depth={22} title="VITALS · LIVE" className="right-[5%] top-[5%] w-[42%]">
        <svg viewBox="0 0 240 70" className="h-[70px] w-full" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 40 H40 L48 40 L54 20 L60 58 L66 10 L72 44 L80 40 H120 L128 40 L134 22 L140 56 L146 12 L152 44 L160 40 H200 L208 40 L214 24 L220 54 L226 14 L232 42 L240 40"
            fill="none"
            stroke={a}
            strokeWidth="1.6"
            strokeDasharray="6 4"
            style={{ animation: "dash-flow 1.6s linear infinite" }}
          />
        </svg>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-fg-3">
          <span>ECG</span>
          <span style={{ color: a }}>● STREAMING</span>
        </div>
      </Panel>
      <Panel accent={a} depth={8} title="APPOINTMENTS · TODAY" className="bottom-[7%] left-[8%] w-[44%]">
        <Row a="09:30" b="Dr. R. Das — Consultation" c="DONE" accent="#34d399" />
        <Row a="11:00" b="Dr. S. Nayak — Review" c="NOW" accent={a} strong />
        <Row a="14:15" b="Dr. P. Mishra — Lab report" c="NEXT" accent="#a7aebf" />
      </Panel>
      <Panel accent={a} depth={18} title="DOCTOR SCHEDULE" className="bottom-[12%] right-[6%] w-[36%]">
        <div className="grid grid-cols-7 gap-1" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i} className="aspect-square rounded-[3px]" style={{ background: [3, 5, 9, 10, 16, 18, 22, 25].includes(i) ? a : "rgba(242,244,248,0.07)", opacity: [9, 22].includes(i) ? 0.5 : 1 }} />
          ))}
        </div>
      </Panel>
    </>
  );
}

function RestaurantScene({ a }: { a: string }) {
  const menu = ["Hyderabadi Biryani", "Chicken 65", "Veg Biryani", "Mirchi Salan", "Raita", "Lassi"];
  return (
    <>
      <Panel accent={a} depth={10} title="POS · COUNTER 1" className="left-[4%] top-[7%] w-[50%]">
        <div className="grid grid-cols-3 gap-2">
          {menu.map((m, i) => (
            <div key={m} className="rounded-lg border p-2" style={{ borderColor: i === 0 ? `${a}80` : "rgba(255,255,255,0.06)", background: i === 0 ? `${a}14` : "rgba(255,255,255,0.02)" }}>
              <p className="truncate text-[11px] text-fg">{m}</p>
              <p className="mt-1 font-mono text-[9px] text-fg-3">ITEM {String(i + 1).padStart(2, "0")}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg px-3 py-2 font-mono text-[10px] tracking-[0.12em]" style={{ background: a, color: "#05060a" }}>
          <span>CHARGE ORDER</span>
          <span>→</span>
        </div>
      </Panel>
      <Panel accent={a} depth={20} title="LIVE ORDERS" className="right-[5%] top-[5%] w-[38%]">
        {[
          ["#T-07", "Table 4 · 3 items", "PREPARING"],
          ["#T-08", "Table 9 · QR order", "NEW"],
          ["#T-06", "Takeaway · 2 items", "READY"],
        ].map(([id, d, s]) => (
          <div key={id} className="mb-2 rounded-lg border border-dashed border-white/10 p-2.5 last:mb-0">
            <div className="flex justify-between font-mono text-[10px]">
              <span className="text-fg">{id}</span>
              <span style={{ color: s === "READY" ? "#34d399" : a }}>{s}</span>
            </div>
            <p className="mt-1 text-[11px] text-fg-2">{d}</p>
          </div>
        ))}
      </Panel>
      <Panel accent={a} depth={26} className="bottom-[10%] left-[6%] w-[22%]">
        <div className="aspect-square rounded-md bg-void p-2">
          <QR accent={a} />
        </div>
        <p className="mt-2 text-center font-mono text-[9px] tracking-[0.16em] text-fg-3">SCAN · TABLE 9</p>
      </Panel>
      <Panel accent={a} depth={12} title="SALES · WEEK" className="bottom-[8%] left-[31%] w-[32%]">
        <Bars values={[4, 6, 5, 7, 6, 9, 8]} accent={a} />
        <div className="mt-2 flex justify-between font-mono text-[9px] text-fg-3">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </Panel>
      <Panel accent={a} depth={16} title="INVENTORY" className="bottom-[14%] right-[5%] w-[30%]">
        <div className="flex flex-col gap-3">
          <Meter label="BASMATI RICE" value={72} accent={a} />
          <Meter label="CHICKEN" value={46} accent={a} />
          <Meter label="SPICE MIX" value={18} accent={a} />
        </div>
      </Panel>
    </>
  );
}

function BookingScene({ a }: { a: string }) {
  const tiles = [
    ["HOTELS", Icon.bed],
    ["RENTALS", Icon.car],
    ["FOOD", Icon.bowl],
    ["EVENTS", Icon.ticket],
    ["SHOP", Icon.bag],
  ] as const;
  return (
    <>
      <div className="absolute left-[5%] top-[8%] grid w-[52%] grid-cols-3 gap-3">
        {tiles.map(([label, d], i) => (
          <div
            key={label}
            className={`rounded-2xl border border-white/10 bg-[rgba(14,17,25,0.78)] p-4 backdrop-blur-md transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            style={{ transform: `translate3d(calc(var(--mx, 0) * ${8 + i * 3}px), calc(var(--my, 0) * ${8 + i * 3}px), 0)`, borderColor: i === 0 ? `${a}66` : undefined }}
          >
            <span style={{ color: i === 0 ? a : "#a7aebf" }}>
              <Glyph d={d} size={i === 0 ? 30 : 20} />
            </span>
            <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-fg-2">{label}</p>
            {i === 0 && (
              <div className="mt-6 flex flex-col gap-2">
                <div className="h-16 rounded-lg" style={{ background: `linear-gradient(135deg, ${a}40, transparent)` }} />
                <p className="text-sm text-fg">Deluxe Room · Sea view</p>
                <p className="font-mono text-[10px] text-fg-3">2 GUESTS · 3 NIGHTS</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <Panel accent={a} depth={22} title="BOOKING" className="right-[5%] top-[12%] w-[36%]">
        <div className="grid grid-cols-2 gap-2">
          {[
            ["CHECK-IN", "12 Oct"],
            ["CHECK-OUT", "15 Oct"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-white/6 p-2">
              <p className="font-mono text-[9px] text-fg-3">{k}</p>
              <p className="text-sm text-fg">{v}</p>
            </div>
          ))}
        </div>
        <Row a="ADD" b="Airport cab" c="+" accent={a} />
        <Row a="ADD" b="Dinner reservation" c="+" accent={a} />
        <div className="mt-3 rounded-lg py-2 text-center font-mono text-[10px] tracking-[0.14em]" style={{ background: a, color: "#05060a" }}>
          CONFIRM BOOKING
        </div>
      </Panel>
      <Panel accent={a} depth={12} title="ONE ACCOUNT · FIVE SERVICES" className="bottom-[8%] right-[8%] w-[46%]">
        <div className="flex items-center gap-2">
          {tiles.map(([label, d]) => (
            <span key={label} className="grid size-9 place-items-center rounded-full border border-white/10 text-fg-2">
              <Glyph d={d} size={15} />
            </span>
          ))}
          <span className="ml-auto font-mono text-[10px]" style={{ color: a }}>
            SHARED CART
          </span>
        </div>
      </Panel>
    </>
  );
}

function LabScene({ a }: { a: string }) {
  const items = [
    ["Borosilicate Flask", Icon.flask],
    ["Compound Microscope", Icon.microscope],
    ["Digital pH Meter", Icon.gauge],
  ] as const;
  return (
    <>
      <div className="absolute left-[5%] top-[8%] flex w-[58%] gap-3">
        {items.map(([name, d], i) => (
          <div
            key={name}
            className="flex-1 rounded-2xl border border-white/10 bg-[rgba(14,17,25,0.78)] p-4 backdrop-blur-md transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translate3d(calc(var(--mx, 0) * ${10 + i * 5}px), calc(var(--my, 0) * ${10 + i * 5}px), 0)` }}
          >
            <div className="grid aspect-[4/3] place-items-center rounded-lg" style={{ background: `radial-gradient(circle, ${a}26, transparent 70%)`, color: a }}>
              <Glyph d={d} size={40} />
            </div>
            <p className="mt-3 text-[12px] text-fg">{name}</p>
            <p className="font-mono text-[9px] text-fg-3">CATALOG · SKU-{210 + i}</p>
          </div>
        ))}
      </div>
      <Panel accent={a} depth={18} title="INQUIRY" className="right-[5%] top-[10%] w-[30%]">
        <p className="text-[12px] text-fg">Quote request</p>
        <p className="mt-1 text-[11px] text-fg-2">Compound Microscope × 4 — university lab</p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-full px-2 py-0.5 font-mono text-[9px]" style={{ background: `${a}22`, color: a }}>
            OPEN
          </span>
          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[9px] text-fg-2">ASSIGN →</span>
        </div>
      </Panel>
      <Panel accent={a} depth={10} title="INVENTORY" className="bottom-[8%] left-[8%] w-[54%]">
        <Row a="SKU-210" b="Borosilicate Flask 500ml" c="IN STOCK" accent={a} />
        <Row a="SKU-211" b="Compound Microscope" c="LOW" accent="#f5a524" />
        <Row a="SKU-212" b="Digital pH Meter" c="IN STOCK" accent={a} />
        <Row a="SKU-213" b="Centrifuge 12-slot" c="ORDERED" accent="#a7aebf" />
      </Panel>
      <Panel accent={a} depth={24} title="ADMIN" className="bottom-[16%] right-[6%] w-[26%]">
        <div className="flex flex-col gap-2 font-mono text-[10px] text-fg-2">
          {["Products", "Categories", "Inquiries", "Users"].map((x, i) => (
            <span key={x} className="flex items-center gap-2" style={{ color: i === 2 ? a : undefined }}>
              <span className="size-1 rounded-full bg-current" /> {x.toUpperCase()}
            </span>
          ))}
        </div>
      </Panel>
    </>
  );
}

function MaritimeScene({ a }: { a: string }) {
  return (
    <>
      <div
        className="absolute left-[6%] top-[8%] aspect-square w-[46%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: "translate3d(calc(var(--mx, 0) * 8px), calc(var(--my, 0) * 8px), 0)" }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-[16%] rounded-full border border-white/8" />
        <div className="absolute inset-[33%] rounded-full border border-white/8" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/8" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/8" />
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: `conic-gradient(from 0deg, ${a}55, transparent 25%)`, animation: "spin 6s linear infinite" }}
        />
        <div className="absolute left-[62%] top-[30%] size-2 rounded-full" style={{ background: a, boxShadow: `0 0 12px ${a}` }} />
        <div className="absolute left-[28%] top-[64%] size-1.5 rounded-full bg-fg/70" />
        <div className="absolute bottom-[18%] left-1/2 w-[46%] -translate-x-1/2" style={{ color: a }}>
          <svg viewBox="0 0 120 40" className="w-full" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M4 26h112l-10 10H14z" />
            <path d="M24 26V16h50v10M36 16V8h18v8M80 26V20h14v6" />
          </svg>
        </div>
      </div>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      <Panel accent={a} depth={20} title="VESSEL RECORD" className="right-[5%] top-[6%] w-[38%]">
        <p className="text-sm text-fg">MV Sample Carrier</p>
        <Row a="TYPE" b="Bulk carrier" />
        <Row a="FLAG" b="India" />
        <Row a="STATUS" b="Records verified" c="OK" accent="#34d399" />
      </Panel>
      <Panel accent={a} depth={14} title="MEDICAL CERTIFICATE" className="bottom-[26%] right-[8%] w-[34%]">
        <div className="flex items-center gap-3">
          <span style={{ color: a }}>
            <Glyph d={Icon.doc} size={26} />
          </span>
          <div>
            <p className="text-[12px] text-fg">Seafarer fitness</p>
            <p className="font-mono text-[9px] text-fg-3">ISSUED BY APPROVED DOCTOR</p>
          </div>
          <span className="ml-auto rounded-full px-2 py-0.5 font-mono text-[9px]" style={{ background: "#34d39922", color: "#34d399" }}>
            VALID
          </span>
        </div>
      </Panel>
      <Panel accent={a} depth={10} title="DOCUMENTS" className="bottom-[6%] left-[40%] w-[40%]">
        <Row a="PDF" b="Maritime college list" />
        <Row a="PDF" b="Circular — training norms" />
        <Row a="DOC" b="Blog: Life at sea" c="DRAFT" accent={a} />
      </Panel>
    </>
  );
}

function AIScene({ a }: { a: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const segs = [
    [0.45, a],
    [0.3, "#22d3ee"],
    [0.25, "#3d7bff"],
  ] as const;
  let acc = 0;
  return (
    <>
      <Panel accent={a} depth={16} title="AI ASSISTANT" className="left-[5%] top-[7%] w-[48%]">
        <div className="flex flex-col gap-2 text-[12px]">
          <p className="ml-auto max-w-[80%] rounded-xl rounded-br-sm bg-white/6 px-3 py-2 text-fg-2">Plan my meals for a low-sodium diet.</p>
          <div className="flex gap-2">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full" style={{ background: `${a}33`, color: a }}>
              <Glyph d={Icon.spark} size={13} />
            </span>
            <div className="flex-1 rounded-xl rounded-tl-sm border px-3 py-2" style={{ borderColor: `${a}40` }}>
              <p className="text-fg">Here&apos;s a 7-day plan based on your latest report.</p>
              <div className="mt-2 flex flex-col gap-1.5" aria-hidden="true">
                <span className="h-1.5 w-[90%] rounded-full bg-white/10" />
                <span className="h-1.5 w-[70%] rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </Panel>
      <Panel accent={a} depth={24} title="DIET PLAN" className="right-[6%] top-[6%] w-[28%]">
        <svg viewBox="0 0 90 90" className="mx-auto size-[110px] -rotate-90" aria-hidden="true">
          <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
          {segs.map(([p, col], i) => {
            const el = (
              <circle key={i} cx="45" cy="45" r={r} fill="none" stroke={col} strokeWidth="9" strokeDasharray={`${p * c - 3} ${c}`} strokeDashoffset={-acc * c} />
            );
            acc += p;
            return el;
          })}
        </svg>
        <div className="mt-2 flex justify-between font-mono text-[9px] text-fg-3">
          <span style={{ color: a }}>CARBS</span>
          <span className="text-cyan">PROTEIN</span>
          <span className="text-electric">FAT</span>
        </div>
      </Panel>
      <Panel accent={a} depth={10} title="HEALTH TRACKING" className="bottom-[9%] left-[6%] w-[40%]">
        <Spark points={[3, 5, 4, 6, 5, 7, 6, 8, 7, 9]} accent={a} h={56} />
        <div className="mt-2 flex justify-between font-mono text-[9px] text-fg-3">
          <span>ACTIVITY · 10 DAYS</span>
          <span style={{ color: a }}>TRENDING UP</span>
        </div>
      </Panel>
      <Panel accent={a} depth={18} title="E-PRESCRIPTION" className="bottom-[30%] right-[5%] w-[34%]">
        <p className="font-display text-2xl" style={{ color: a }}>℞</p>
        <Row a="01" b="Sample medicine · 1-0-1" />
        <Row a="02" b="Sample supplement · 0-0-1" />
      </Panel>
      <Panel accent={a} depth={12} className="bottom-[7%] right-[8%] w-[30%]">
        <div className="flex items-center gap-3">
          <span className="text-fg-2">
            <Glyph d={Icon.ambulance} size={24} />
          </span>
          <div className="flex-1">
            <p className="font-mono text-[10px] text-fg">AMB-02</p>
            <p className="font-mono text-[9px] text-fg-3">EN ROUTE · CITY HOSPITAL</p>
          </div>
          <span className="pulse-dot size-2 rounded-full bg-signal" />
        </div>
      </Panel>
    </>
  );
}

const SCENES = {
  health: HealthScene,
  restaurant: RestaurantScene,
  booking: BookingScene,
  lab: LabScene,
  maritime: MaritimeScene,
  ai: AIScene,
} as const;

/** Per-project illustrated environment with pointer parallax. */
export default function ProjectEnvironment({ project, className = "" }: { project: Project; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const Scene = SCENES[project.theme];
  const a = project.accent;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(width / 760, height / 540) * 0.96);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--mx", "0");
    ref.current?.style.setProperty("--my", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      role="img"
      aria-label={`${project.title} — illustrated interface: ${project.features.join(", ")}`}
      className={`relative overflow-hidden bg-[#07090e] ${className}`}
    >
      {/* environment ground: tinted glow + grid */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 60% 40%, ${a}24, transparent 60%), radial-gradient(ellipse at 10% 100%, rgba(61,123,255,0.12), transparent 50%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
        aria-hidden="true"
      />
      {/* scenes are composed on a fixed 760×540 stage and scaled to fit */}
      <div
        className="absolute left-1/2 top-1/2 h-[540px] w-[760px] [perspective:1400px]"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 [transform:rotateX(6deg)_rotateY(-8deg)] [transform-style:preserve-3d]">
          <Scene a={a} />
        </div>
      </div>
    </div>
  );
}
