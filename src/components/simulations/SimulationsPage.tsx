import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  FolderPlus,
  Atom,
  Moon,
  Sun,
  Layers,
} from "lucide-react";
import {
  simulations,
  simulationCategories,
  type SimulationItem,
} from "@/data/simulations";
import { profile } from "@/data/portfolio";
import type { Theme } from "@/hooks/useTheme";
import { SimulationCard } from "./SimulationCard";
import { SimulationViewer } from "./SimulationViewer";
import { cn } from "@/utils/cn";

type SimulationsPageProps = {
  theme: Theme;
  onToggleTheme: () => void;
  onNavigateHome: (sectionId?: string) => void;
  initialSimId?: string;
};

export function SimulationsPage({
  theme,
  onToggleTheme,
  onNavigateHome,
  initialSimId,
}: SimulationsPageProps) {
  const [activeSimId, setActiveSimId] = useState<string | null>(initialSimId ?? null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (initialSimId) {
      setActiveSimId(initialSimId);
    }
  }, [initialSimId]);

  // Keep window scrolled to top on mount or active change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSimId]);

  const activeSimulation = useMemo(() => {
    if (!activeSimId) return null;
    return simulations.find((s) => s.id === activeSimId) ?? null;
  }, [activeSimId]);

  const filteredSimulations = useMemo(() => {
    return simulations.filter((sim) => {
      const matchesCategory =
        selectedCategory === "All" || sim.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        sim.title.toLowerCase().includes(query) ||
        sim.description.toLowerCase().includes(query) ||
        sim.tags.some((t) => t.toLowerCase().includes(query)) ||
        sim.category.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleLaunch = (sim: SimulationItem) => {
    setActiveSimId(sim.id);
    window.location.hash = `#/simulator/${sim.id}`;
  };

  const handleBackToCatalog = () => {
    setActiveSimId(null);
    window.location.hash = "#/simulations";
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Back to Portfolio + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateHome("projects")}
              className="group flex cursor-pointer items-center gap-2 rounded-xl border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4 text-primary transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Portfolio</span>
            </button>

            <span className="hidden sm:inline text-xs text-muted-foreground">/</span>

            <div className="hidden sm:flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Atom className="h-3.5 w-3.5" />
              </span>
              <span className="font-display text-xs font-semibold tracking-wide text-foreground">
                Science Simulations
              </span>
              {activeSimulation && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {activeSimulation.title}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right Actions: Theme Toggle & Author Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{profile.name} Virtual Labs</span>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-14">
        {activeSimulation ? (
          <SimulationViewer
            simulation={activeSimulation}
            onBack={handleBackToCatalog}
          />
        ) : (
          <div className="space-y-10">
            {/* Page Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card/90 to-primary/5 p-8 md:p-12 shadow-xl">
              {/* Background radial glow */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-primary/20 via-accent/15 to-transparent blur-3xl opacity-75" />

              <div className="relative max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
                  <Atom className="h-3.5 w-3.5" />
                  Virtual Science Laboratory
                </div>

                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Interactive <span className="text-gradient">Science Simulations</span>
                </h1>

                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  Explore degree-level computational physics simulations, non-linear dynamics,
                  and numerical integrator benchmarks. Designed with high mathematical precision,
                  real-time vector visualizations, phase space analysis, and undergraduate laboratory exercises.
                </p>

                {/* Quick Highlights badges */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-foreground">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    Symplectic Integrator Benchmarking (RK4, Verlet, Euler-Cromer)
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-foreground">
                    <Atom className="h-3.5 w-3.5 text-accent" />
                    Exact AGM Elliptic Periods
                  </span>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {simulationCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "border border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[260px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search simulations, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-border bg-card/70 py-2 pl-9 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Simulations List */}
            {filteredSimulations.length > 0 ? (
              <div className="grid gap-6">
                {filteredSimulations.map((simulation) => (
                  <SimulationCard
                    key={simulation.id}
                    simulation={simulation}
                    onLaunch={handleLaunch}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center">
                <SlidersHorizontal className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                  No simulations match your criteria
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try clearing your search query or selecting "All" categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 inline-flex cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Note on adding new simulations */}
            <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FolderPlus className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-foreground">
                    Adding New Science Simulations
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    New simulations can be placed in{" "}
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-primary font-semibold">
                      src/data/simulator/&lt;folder_name&gt;/index.html
                    </code>{" "}
                    and registered in{" "}
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-primary font-semibold">
                      src/data/simulations.ts
                    </code>
                    . The build system will automatically sync and deploy them to your virtual laboratory catalog.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/70 py-8 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {profile.name} · Physical Sciences Virtual Labs · Amrita Vishwa Vidyapeetham
        </p>
      </footer>
    </div>
  );
}
