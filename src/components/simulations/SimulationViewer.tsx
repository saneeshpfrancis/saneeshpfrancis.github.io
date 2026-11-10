import { useRef, useState } from "react";
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  BookOpen,
  X,
  Sparkles,
  Info,
} from "lucide-react";
import type { SimulationItem } from "@/data/simulations";
import { getSimulationPath } from "@/data/simulations";

type SimulationViewerProps = {
  simulation: SimulationItem;
  onBack: () => void;
};

export function SimulationViewer({ simulation, onBack }: SimulationViewerProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const simulationUrl = getSimulationPath(simulation);

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error("Exit fullscreen error:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-md shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 text-primary" />
            <span>All Simulations</span>
          </button>

          <div className="hidden sm:block h-6 w-px bg-border" />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-foreground sm:text-lg">
                {simulation.title}
              </h2>
              <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{simulation.category} · {simulation.level}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowManual(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            title="Open Theory & Lab Exercises"
          >
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Lab Manual</span>
          </button>

          <button
            type="button"
            onClick={handleReload}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            title="Reset Simulator"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>

          <a
            href={simulationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/25 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            title="Open in new window"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Tab</span>
          </a>
        </div>
      </div>

      {/* Simulator Workspace Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-border/80 bg-[#090d16] shadow-2xl transition-all"
        style={{ minHeight: "720px", height: "82vh" }}
      >
        <iframe
          key={iframeKey}
          src={simulationUrl}
          title={simulation.title}
          className="h-full w-full border-0 bg-[#090d16]"
          allow="fullscreen"
        />
      </div>

      {/* Interactive Guidance Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Interactive Drag",
            desc: "Click and drag the pendulum bob in the canvas to set initial angle θ₀.",
          },
          {
            title: "Integrator Benchmark",
            desc: "Switch between Forward Euler, Euler-Cromer, Verlet, and RK4 to view energy drift.",
          },
          {
            title: "Phase Space Flow",
            desc: "View libration vs unbounded rotation across the Separatrix boundary.",
          },
          {
            title: "FFT Harmonic Spectrum",
            desc: "Observe odd non-linear harmonic generation (3f₀, 5f₀) at large amplitudes.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border/70 bg-card/60 p-3.5 text-xs shadow-xs"
          >
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <Info className="h-3.5 w-3.5 shrink-0" />
              <span>{item.title}</span>
            </div>
            <p className="mt-1 text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Lab Manual Drawer / Modal */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Theory & Undergraduate Laboratory Manual
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {simulation.title} · Classical Mechanics
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowManual(false)}
                className="cursor-pointer rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6 text-sm text-foreground/90">
              {/* Theoretical Summary */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                <h4 className="font-display text-sm font-bold text-primary">
                  1. Mathematical & Theoretical Rigor
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The exact non-linear equation of motion:
                </p>
                <div className="rounded-lg bg-background/80 p-2.5 font-mono text-xs text-center border border-border">
                  d²θ/dt² + γ(dθ/dt) + c_quad(dθ/dt)|dθ/dt|L + (g/L)sin(θ) = τ_drive(t)/(mL²)
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Exact Period via Arithmetic-Geometric Mean (AGM): T(θ₀) = 4√(L/g) K(sin(θ₀/2)).
                  Separatrix Boundary: ω_sep(θ) = ±2√(g/L) cos(θ/2).
                </p>
              </div>

              {/* Lab Exercises */}
              <div className="space-y-4">
                <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider text-xs">
                  Undergraduate Laboratory Exercises
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {simulation.exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="rounded-xl border border-border bg-muted/30 p-4 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                          {ex.id}
                        </span>
                        <h5 className="font-display text-xs font-bold text-foreground">
                          {ex.title}
                        </h5>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Objective:</strong> {ex.objective}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Procedure:</strong> {ex.procedure}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setShowManual(false)}
                className="cursor-pointer rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110"
              >
                Close Lab Manual
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
