import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Atom, Calendar, FlaskConical } from "lucide-react";
import { projects } from "@/data/portfolio";
import { cn } from "@/utils/cn";
import { staggerContainer, staggerItem } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

type ProjectsProps = {
  onNavigateToSimulations?: () => void;
};

export function Projects({ onNavigateToSimulations }: ProjectsProps) {
  const handleGoToSimulations = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToSimulations) {
      onNavigateToSimulations();
    } else {
      window.location.hash = "#/simulations";
    }
  };

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Projects"
          title="Work I'm"
          highlight="proud of."
          description="Platforms, experiments and programs that bring laboratory science to learners wherever they are."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 md:grid-cols-2"
        >
          {projects.map(({ title, period, description, tags, icon: Icon, link, linkLabel, featured }) => {
            const Wrapper = link ? "a" : "div";
            return (
              <motion.div key={title} variants={staggerItem} className={cn(featured && "md:col-span-2")}>
                <Wrapper
                  {...(link ? { href: link, target: "_blank", rel: "noreferrer" } : {})}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/70 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 md:p-8",
                    featured && "md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-10",
                  )}
                >
                  {/* Decorative gradient */}
                  <div
                    className={cn(
                      "pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl transition-opacity",
                      featured
                        ? "bg-gradient-to-br from-primary/25 to-accent/25"
                        : "bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100",
                    )}
                  />

                  <div className="relative flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition-transform group-hover:scale-110">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {period}
                      </span>
                    </div>

                    {featured && (
                      <span className="mt-5 inline-flex w-fit items-center rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-primary uppercase">
                        Flagship platform
                      </span>
                    )}

                    <h3
                      className={cn(
                        "mt-4 font-display font-bold text-foreground",
                        featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl",
                      )}
                    >
                      {title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 leading-relaxed text-muted-foreground",
                        featured ? "max-w-2xl text-base" : "text-sm md:text-[15px]",
                      )}
                    >
                      {description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-foreground/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      {link && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                          {linkLabel ?? "View project"}
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      )}

                      {featured && (
                        <button
                          type="button"
                          onClick={handleGoToSimulations}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          <FlaskConical className="h-3.5 w-3.5" />
                          <span>Explore Science Simulations</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {featured && (
                    <div className="relative mt-8 hidden md:block">
                      <ExperimentPreview />
                    </div>
                  )}
                </Wrapper>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dedicated Navigation Call-to-Action Banner */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12"
        >
          <motion.div
            variants={staggerItem}
            className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card/95 to-primary/10 p-6 md:p-10 shadow-xl"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-transparent blur-3xl opacity-75" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase">
                  <Atom className="h-3.5 w-3.5" />
                  <span>Virtual Science Laboratory</span>
                </div>

                <h3 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Interactive Science Simulations
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  Explore degree-level computational physics simulations: large-amplitude nonlinear pendulum dynamics,
                  multilevel projectile motion with aerodynamic drag and Magnus lift, symplectic integrator benchmarking
                  (RK4, Velocity-Verlet, Euler-Cromer), phase space separatrices, and live data telemetry.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground/80">
                    Projectile Motion Lab
                  </span>
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground/80">
                    Simple Pendulum
                  </span>
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground/80">
                    Aerodynamic Drag & Magnus Lift
                  </span>
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground/80">
                    Symplectic Integrators (RK4)
                  </span>
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground/80">
                    10 Guided Science Labs
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <a
                  href="#/simulations"
                  onClick={handleGoToSimulations}
                  className="group inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-4 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                >
                  <FlaskConical className="h-4 w-4" />
                  <span>View All Simulations</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/** Small decorative "simulation window" for the featured project */
function ExperimentPreview() {
  return (
    <div className="glass w-72 rounded-2xl p-4 shadow-xl shadow-black/10">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-auto text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
          Simulation
        </span>
      </div>
      <svg viewBox="0 0 260 130" className="mt-3 w-full">
        <defs>
          <linearGradient id="wave-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 45, 70, 95].map((y) => (
          <line key={y} x1="0" x2="260" y1={y} y2={y} stroke="var(--border)" strokeWidth="1" />
        ))}
        {[40, 90, 140, 190, 240].map((x) => (
          <line key={x} y1="0" y2="120" x1={x} x2={x} stroke="var(--border)" strokeWidth="1" />
        ))}
        <path
          d="M0 60 C 20 10, 40 10, 60 60 S 100 110, 120 60 S 160 10, 180 60 S 220 110, 240 60 S 280 10, 300 60 V130 H0 Z"
          fill="url(#wave-fill)"
        >
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="M0 60 C 20 10, 40 10, 60 60 S 100 110, 120 60 S 160 10, 180 60 S 220 110, 240 60 S 280 10, 300 60 V130 H0 Z;
                    M0 60 C 20 110, 40 110, 60 60 S 100 10, 120 60 S 160 110, 180 60 S 220 10, 240 60 S 280 110, 300 60 V130 H0 Z;
                    M0 60 C 20 10, 40 10, 60 60 S 100 110, 120 60 S 160 10, 180 60 S 220 110, 240 60 S 280 10, 300 60 V130 H0 Z"
          />
        </path>
        <path
          d="M0 60 C 20 10, 40 10, 60 60 S 100 110, 120 60 S 160 10, 180 60 S 220 110, 240 60 S 280 10, 300 60"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="M0 60 C 20 10, 40 10, 60 60 S 100 110, 120 60 S 160 10, 180 60 S 220 110, 240 60 S 280 10, 300 60;
                    M0 60 C 20 110, 40 110, 60 60 S 100 10, 120 60 S 160 110, 180 60 S 220 10, 240 60 S 280 110, 300 60;
                    M0 60 C 20 10, 40 10, 60 60 S 100 110, 120 60 S 160 10, 180 60 S 220 110, 240 60 S 280 10, 300 60"
          />
        </path>
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["Amplitude", "2.0 cm"],
          ["Frequency", "1.5 Hz"],
          ["Phase", "π / 4"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-border bg-background/60 px-2 py-1.5">
            <p className="text-[9px] tracking-wider text-muted-foreground uppercase">{k}</p>
            <p className="font-display text-xs font-semibold text-foreground">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
