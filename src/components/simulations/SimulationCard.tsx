import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Play,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";
import type { SimulationItem } from "@/data/simulations";
import { getSimulationPath } from "@/data/simulations";
import { cn } from "@/utils/cn";

type SimulationCardProps = {
  simulation: SimulationItem;
  onLaunch: (sim: SimulationItem) => void;
};

export function SimulationCard({ simulation, onLaunch }: SimulationCardProps) {
  const [showExercises, setShowExercises] = useState(false);
  const standaloneUrl = getSimulationPath(simulation);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card/80 p-6 md:p-8 shadow-xl transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
      {/* Decorative gradient glow */}
      <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-gradient-to-br from-primary/20 via-accent/15 to-transparent blur-3xl opacity-60 transition-opacity group-hover:opacity-100" />

      {/* Top badges */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {simulation.category}
          </span>
          <span className="rounded-full border border-border bg-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {simulation.level}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <Activity className="h-3 w-3" />
          {simulation.status}
        </span>
      </div>

      {/* Main Grid: Info + Visual Preview */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        {/* Left Column: Details */}
        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {simulation.title}
          </h3>
          <p className="mt-1 text-xs font-medium tracking-wide text-primary uppercase">
            {simulation.subtitle}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {simulation.description}
          </p>

          {/* Key Capabilities */}
          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold tracking-wider text-foreground/80 uppercase">
              Scientific & Computational Highlights:
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {simulation.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {simulation.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/80 bg-background/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground/75"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Animated Preview */}
        <div className="relative flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-background/50 p-6 shadow-inner">
          <PendulumGraphicPreview />

          <div className="mt-4 flex w-full justify-between items-center text-[11px] text-muted-foreground border-t border-border/50 pt-3">
            <span className="flex items-center gap-1 font-mono">
              <Layers className="h-3 w-3 text-primary" /> RK4 & Verlet
            </span>
            <span className="font-mono">AGM Precision: 10⁻¹⁵</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onLaunch(simulation)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <Play className="h-4 w-4 fill-current" />
            Launch Simulator
          </button>

          <a
            href={standaloneUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-muted"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        </div>

        {simulation.exercises && simulation.exercises.length > 0 && (
          <button
            type="button"
            onClick={() => setShowExercises(!showExercises)}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors py-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Lab Manual & Exercises ({simulation.exercises.length})</span>
            {showExercises ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Collapsible Lab Exercises Manual */}
      <AnimatePresence>
        {showExercises && simulation.exercises && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-6 rounded-2xl border border-primary/20 bg-muted/40 p-5 md:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="font-display text-sm font-bold tracking-tight text-foreground">
                    Undergraduate Laboratory Experiments & Guides
                  </h4>
                </div>
                <span className="text-xs text-muted-foreground">Degree Level Manual</span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {simulation.exercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="rounded-xl border border-border bg-card/90 p-4 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                        {ex.id}
                      </span>
                      <h5 className="font-display text-xs font-bold text-foreground">
                        {ex.title}
                      </h5>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      <strong className="text-foreground/90">Objective:</strong> {ex.objective}
                    </p>
                    <p className="text-[11px] text-muted-foreground/90 leading-relaxed font-mono">
                      <strong className="text-foreground/90 font-sans">Procedure:</strong> {ex.procedure}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Animated SVG visualization of the pendulum for the card preview */
function PendulumGraphicPreview() {
  return (
    <div className="w-full max-w-[280px] h-[220px] flex items-center justify-center relative">
      <svg
        viewBox="0 0 280 220"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Radial gradient for the bob */}
          <radialGradient id="bob-gradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="1" />
          </radialGradient>

          {/* Pivot shadow */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Coordinate Grid / Protractor Arc */}
        <path
          d="M 60 140 A 110 110 0 0 0 220 140"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Center vertical reference line */}
        <line
          x1="140"
          y1="25"
          x2="140"
          y2="185"
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Pivot Mount */}
        <rect
          x="115"
          y="15"
          width="50"
          height="10"
          rx="4"
          fill="var(--border)"
        />
        <circle cx="140" cy="25" r="4" fill="var(--primary)" />

        {/* Oscillating Arm and Bob */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-45 140 25; 45 140 25; -45 140 25"
            dur="2.8s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          />

          {/* String / Rod */}
          <line
            x1="140"
            y1="25"
            x2="140"
            y2="155"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Bob */}
          <circle
            cx="140"
            cy="155"
            r="16"
            fill="url(#bob-gradient)"
            filter="url(#shadow)"
          />
          <circle cx="136" cy="151" r="5" fill="#ffffff" fillOpacity="0.4" />

          {/* Tangential velocity vector arrow */}
          <line
            x1="140"
            y1="155"
            x2="175"
            y2="155"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <polygon points="175,152 181,155 175,158" fill="#10b981" />
        </g>

        {/* Photogate Indicator */}
        <rect
          x="132"
          y="172"
          width="16"
          height="12"
          rx="2"
          fill="var(--muted)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <circle cx="140" cy="178" r="2" fill="#ef4444" className="animate-pulse" />
        <text
          x="140"
          y="200"
          textAnchor="middle"
          fontSize="9"
          fill="var(--muted-foreground)"
          fontFamily="monospace"
        >
          Photogate Beam
        </text>
      </svg>
    </div>
  );
}
