"use client";

import { useMemo, useState } from "react";
import {
  Anchor,
  ArrowRight,
  Cpu,
  Factory,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Landmark,
  Minus,
  Plus,
  Radar,
  Rocket,
  ShieldHalf,
  Sprout,
  TrainFront,
  TrendingUp,
  Zap,
  Globe2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type CategoryId =
  | "all"
  | "space"
  | "infrastructure"
  | "ai"
  | "energy"
  | "startups"
  | "transportation"
  | "manufacturing"
  | "public-systems"
  | "research"
  | "defence"
  | "education"
  | "agriculture"
  | "healthcare";

const CATEGORIES: {
  id: CategoryId;
  label: string;
  count: number;
  icon: typeof Radar;
}[] = [
  { id: "all", label: "All", count: 41, icon: Radar },
  { id: "space", label: "Space", count: 1, icon: Rocket },
  { id: "infrastructure", label: "Infrastructure", count: 7, icon: Landmark },
  { id: "ai", label: "AI & Technology", count: 2, icon: Cpu },
  { id: "energy", label: "Energy", count: 4, icon: Zap },
  { id: "startups", label: "Startups", count: 3, icon: TrendingUp },
  { id: "transportation", label: "Transportation", count: 6, icon: TrainFront },
  { id: "manufacturing", label: "Manufacturing", count: 5, icon: Factory },
  { id: "public-systems", label: "Public Systems", count: 3, icon: Anchor },
  { id: "research", label: "Research", count: 3, icon: FlaskConical },
  { id: "defence", label: "Defence Technology", count: 2, icon: ShieldHalf },
  { id: "education", label: "Education", count: 2, icon: GraduationCap },
  { id: "agriculture", label: "Agriculture", count: 2, icon: Sprout },
  { id: "healthcare", label: "Healthcare", count: 1, icon: HeartPulse },
];

const CATEGORY_LOOKUP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, (typeof CATEGORIES)[number]>;

// Marker positions are authored in the same 600x760 coordinate space as the
// map path below, so they stay pinned to the coastline at any screen size.
type Signal = {
  id: string;
  x: number;
  y: number;
  count: number;
  category: Exclude<CategoryId, "all">;
  title: string;
};

const SIGNALS: Signal[] = [
  { id: "s1", x: 292, y: 232, count: 9, category: "infrastructure", title: "Delhi–NCR transit expansion" },
  { id: "s2", x: 254, y: 172, count: 1, category: "defence", title: "Punjab border outpost upgrade" },
  { id: "s3", x: 234, y: 128, count: 1, category: "education", title: "Ladakh research campus" },
  { id: "s4", x: 148, y: 348, count: 1, category: "infrastructure", title: "Rajasthan solar corridor" },
  { id: "s5", x: 342, y: 392, count: 1, category: "energy", title: "MP power grid link" },
  { id: "s6", x: 543, y: 272, count: 1, category: "space", title: "Assam ground station" },
  { id: "s7", x: 393, y: 452, count: 1, category: "transportation", title: "Odisha port rail line" },
  { id: "s8", x: 355, y: 540, count: 1, category: "transportation", title: "Andhra coastal highway" },
  { id: "s9", x: 113, y: 486, count: 1, category: "research", title: "Mumbai marine institute" },
  { id: "s10", x: 138, y: 500, count: 1, category: "ai", title: "Pune AI cluster" },
  { id: "s11", x: 282, y: 540, count: 2, category: "ai", title: "Hyderabad compute park" },
  { id: "s12", x: 302, y: 562, count: 3, category: "manufacturing", title: "Telangana fab units" },
  { id: "s13", x: 228, y: 618, count: 6, category: "startups", title: "Bengaluru startup wave" },
  { id: "s14", x: 253, y: 630, count: 1, category: "research", title: "Bengaluru research labs" },
  { id: "s15", x: 240, y: 642, count: 1, category: "public-systems", title: "Karnataka e-governance" },
  { id: "s16", x: 274, y: 646, count: 1, category: "manufacturing", title: "Chennai auto plant" },
  { id: "s17", x: 198, y: 672, count: 1, category: "agriculture", title: "Kerala agri-tech pilot" },
  { id: "s18", x: 228, y: 690, count: 2, category: "public-systems", title: "Kanyakumari desal plant" },
  { id: "s19", x: 365, y: 408, count: 1, category: "agriculture", title: "Chhattisgarh irrigation" },
  { id: "s20", x: 285, y: 300, count: 1, category: "healthcare", title: "UP district hospital" },
];

const TOTAL_48H = 41;
const INDIA_WIDE = 9;
const TOTAL_TODAY = 1;
const TOTAL_ALL_TIME = 167;

// A hand-simplified silhouette of India (portrait, 600x760 viewBox) — smooth
// coastline, Kutch bulge on the west, Bengal notch and north-east appendage.
const INDIA_PATH =
  "M292,10 C270,10 252,24 240,46 C214,54 192,64 178,90 C158,102 142,124 146,158 " +
  "C120,168 98,190 90,224 C68,236 46,254 46,282 C28,292 16,312 34,332 " +
  "C54,348 80,342 102,326 C96,358 92,390 102,418 C90,448 84,478 100,504 " +
  "C88,534 94,566 116,590 C110,616 126,642 152,660 C168,680 188,696 212,700 " +
  "C232,706 248,696 258,676 C278,692 298,674 308,648 C324,622 318,592 332,566 " +
  "C348,540 352,508 346,478 C362,452 368,420 356,394 C372,368 384,342 406,326 " +
  "C420,344 440,350 460,340 C450,314 456,288 476,272 C502,268 528,252 552,236 " +
  "C572,224 592,212 584,190 C562,180 536,192 516,204 C494,198 474,210 460,226 " +
  "C440,210 418,216 402,232 C384,220 368,226 358,242 C342,226 332,204 338,178 " +
  "C320,158 310,132 316,106 C300,92 292,70 298,48 C304,32 300,18 292,10 Z";

// A small teardrop for Sri Lanka, for context only.
const SRI_LANKA_PATH = "M244,724 C238,736 240,750 250,758 C262,750 264,734 256,722 C252,716 248,716 244,724 Z";

const VIEW_W = 600;
const VIEW_H = 760;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Samoa() {
  const [active, setActive] = useState<CategoryId>("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  const visibleSignals = useMemo(
    () => SIGNALS.filter((s) => active === "all" || s.category === active),
    [active]
  );

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0c12] text-white">
      {/* Ambient background: vignette + faint dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 62% 45%, rgba(120,60,140,0.20), transparent 60%), radial-gradient(ellipse 60% 50% at 30% 10%, rgba(220,140,60,0.10), transparent 60%), #0a0c12",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* ------------------------------------------------------------ */}
      {/* Left panel                                                    */}
      {/* ------------------------------------------------------------ */}
      <div className="absolute left-5 top-5 z-20 w-[260px] space-y-3">
        <div className="rounded-2xl border border-white/10 bg-[#12141c]/90 p-4 shadow-2xl backdrop-blur">
          <h1 className="text-[15px] font-semibold tracking-tight text-white">
            INDIA IS{" "}
            <span className="text-orange-400" style={{ fontFamily: "serif" }}>
              बिल्डिंग
            </span>
          </h1>
          <div className="mt-2 inline-block rounded-md bg-orange-500/15 px-2 py-1 text-[10px] font-semibold tracking-wide text-orange-400">
            INDEPENDENCE WEEK EDITION
          </div>
          <p className="mt-3 text-[13px] leading-snug text-white/70">
            <span className="font-semibold text-white">{TOTAL_48H} things</span>{" "}
            moved India forward in the last 48 hours.
          </p>
        </div>

        <div className="max-h-[62vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#12141c]/90 p-1.5 shadow-2xl backdrop-blur [scrollbar-width:thin]">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white/85"
                }`}
              >
                <span
                  className={`h-4 w-0.5 rounded-full ${
                    isActive ? "bg-orange-400" : "bg-transparent"
                  }`}
                />
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span className={`flex-1 truncate ${isActive ? "font-medium" : ""}`}>
                  {cat.label}
                </span>
                <span className="text-white/40">{cat.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Top-right stats panel                                        */}
      {/* ------------------------------------------------------------ */}
      <div className="absolute right-5 top-5 z-20 w-[210px] rounded-2xl border border-white/10 bg-[#12141c]/90 p-4 shadow-2xl backdrop-blur">
        <StatRow label="TODAY" value={TOTAL_TODAY} />
        <div className="my-2 flex items-center justify-between rounded-lg bg-white/[0.06] px-2.5 py-1.5">
          <span className="text-[11px] font-medium tracking-wide text-white/70">
            48 HOURS
          </span>
          <span className="text-[13px] font-semibold text-white">{TOTAL_48H}</span>
        </div>
        <StatRow label="ALL TIME" value={TOTAL_ALL_TIME} />

        <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-orange-400/30 bg-orange-500/10 py-2 text-[12px] font-medium text-orange-300 transition-colors hover:bg-orange-500/20">
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Contribute a signal
        </button>
      </div>

      {/* India-wide badge, floats above the map near the top */}
      <button
        onClick={() => setActive("all")}
        className="absolute right-[230px] top-[64px] z-20 flex flex-col items-center gap-1.5"
        title="Signals not tied to one location"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#12141c] shadow-[0_0_24px_rgba(255,255,255,0.08)]">
          <Globe2 className="h-6 w-6 text-white/70" strokeWidth={1.5} />
        </span>
        <span className="text-[10px] font-medium tracking-wide text-white/50">
          INDIA-WIDE · {INDIA_WIDE}
        </span>
      </button>

      {/* ------------------------------------------------------------ */}
      {/* Bottom-right note card                                       */}
      {/* ------------------------------------------------------------ */}
      <div className="absolute bottom-16 right-5 z-20 w-[300px] rounded-2xl border border-white/10 bg-[#12141c]/90 p-4 shadow-2xl backdrop-blur">
        <div className="text-[10px] font-semibold tracking-wide text-orange-400">
          DEAR INDIA, 2047
        </div>
        <p className="mt-1.5 text-[13px] leading-snug text-white/80">
          India turns 100 in 2047. What do you hope we build by then?
        </p>
        <button className="mt-3 flex items-center gap-1 text-[12px] font-medium text-white hover:text-orange-300">
          Write a note <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <button className="absolute bottom-5 right-5 z-20 text-[11px] text-white/40 hover:text-white/70">
        Read what others hope for →
      </button>

      {/* ------------------------------------------------------------ */}
      {/* Map                                                           */}
      {/* ------------------------------------------------------------ */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative h-[92%] max-w-[46%] transition-transform duration-200 ease-out"
          style={{
            aspectRatio: `${VIEW_W} / ${VIEW_H}`,
            transform: `scale(${zoom / 100})`,
          }}
        >
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="indiaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5a742" />
                <stop offset="30%" stopColor="#e8734f" />
                <stop offset="55%" stopColor="#c04f7c" />
                <stop offset="75%" stopColor="#7c53b8" />
                <stop offset="100%" stopColor="#3f6fd6" />
              </linearGradient>
              <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#c05a7a" floodOpacity="0.35" />
              </filter>
            </defs>

            <path d={INDIA_PATH} fill="url(#indiaFill)" filter="url(#softShadow)" />
            <path d={INDIA_PATH} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <path d={SRI_LANKA_PATH} fill="url(#indiaFill)" opacity={0.85} />

            {/* subtle internal texture lines to suggest state borders */}
            <g stroke="rgba(0,0,0,0.18)" strokeWidth="1" fill="none" opacity={0.5}>
              <path d="M150,155 C210,190 260,220 292,232" />
              <path d="M292,232 C320,280 340,340 342,392" />
              <path d="M100,326 C160,360 220,400 260,460" />
              <path d="M260,460 C280,510 290,560 282,618" />
              <path d="M282,618 C300,640 320,660 308,690" />
              <path d="M356,394 C380,420 400,440 406,326" />
            </g>
          </svg>

          {/* Markers, positioned by percentage so they track the SVG coordinate space */}
          {visibleSignals.map((s) => {
            const isDimmed = active !== "all" && s.category !== active;
            const size = s.count >= 6 ? 34 : s.count >= 2 ? 26 : 16;
            return (
              <button
                key={s.id}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                className="absolute flex items-center justify-center rounded-full border border-white/40 bg-[#171922] font-semibold text-white transition-all duration-150"
                style={{
                  left: `${(s.x / VIEW_W) * 100}%`,
                  top: `${(s.y / VIEW_H) * 100}%`,
                  width: size,
                  height: size,
                  fontSize: size > 20 ? 13 : 9,
                  transform: `translate(-50%, -50%) scale(${hovered === s.id ? 1.15 : 1})`,
                  boxShadow:
                    hovered === s.id
                      ? "0 0 0 6px rgba(245,167,66,0.18), 0 0 18px rgba(245,167,66,0.5)"
                      : "0 0 0 4px rgba(255,255,255,0.06), 0 0 12px rgba(255,255,255,0.15)",
                  opacity: isDimmed ? 0.25 : 1,
                }}
              >
                {s.count > 1 ? s.count : (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}

          {/* Tooltip */}
          {hovered &&
            (() => {
              const s = SIGNALS.find((sig) => sig.id === hovered);
              if (!s) return null;
              const cat = CATEGORY_LOOKUP[s.category];
              return (
                <div
                  className="pointer-events-none absolute z-30 w-max max-w-[180px] -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-lg border border-white/10 bg-[#0e0f16] px-3 py-2 text-[11px] shadow-xl"
                  style={{
                    left: `${(s.x / VIEW_W) * 100}%`,
                    top: `${(s.y / VIEW_H) * 100}%`,
                  }}
                >
                  <div className="font-medium text-white">{s.title}</div>
                  <div className="mt-0.5 text-white/45">{cat.label}</div>
                </div>
              );
            })()}
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Zoom control                                                  */}
      {/* ------------------------------------------------------------ */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[#12141c]/90 px-3 py-1.5 shadow-2xl backdrop-blur">
        <button
          onClick={() => setZoom((z) => Math.max(50, z - 10))}
          className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-9 text-center text-[12px] tabular-nums text-white/70">
          {zoom}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(200, z + 10))}
          className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between px-2.5 py-1">
      <span className="text-[11px] font-medium tracking-wide text-white/50">
        {label}
      </span>
      <span className="text-[13px] font-semibold text-white/90">{value}</span>
    </div>
  );
}
