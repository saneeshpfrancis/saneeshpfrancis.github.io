import { motion } from "framer-motion";
import { Building2, Calendar, Globe2, MapPin, Plane, Sparkles } from "lucide-react";
import { workshops } from "@/data/portfolio";
import { cn } from "@/utils/cn";
import { staggerContainer, staggerItem } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const flags: Record<string, string> = {
  India: "🇮🇳",
  Kenya: "🇰🇪",
};

export function Workshops() {
  return (
    <section id="outreach" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="glow-primary absolute -right-40 bottom-0 h-[480px] w-[480px] rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Workshops & Outreach"
          title="Taking virtual labs"
          highlight="to classrooms."
          description="Hands-on training programs that help faculty and students across India — and beyond — adopt virtual laboratories."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 md:grid-cols-2"
        >
          {workshops.map((w) => (
            <motion.article
              key={w.title}
              variants={staggerItem}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card/70 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 md:p-7",
                w.international && "md:col-span-2 md:grid md:grid-cols-[1fr_320px] md:gap-10",
              )}
            >
              {w.international && (
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-primary/25 to-accent/25 blur-3xl" />
              )}

              <div className="relative flex flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {w.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {w.location}, {w.country} {flags[w.country]}
                  </span>
                  {w.international && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                      <Plane className="h-3.5 w-3.5" />
                      International
                    </span>
                  )}
                </div>

                <h3
                  className={cn(
                    "mt-5 font-display font-bold text-foreground",
                    w.international ? "text-2xl md:text-3xl" : "text-lg md:text-xl",
                  )}
                >
                  {w.title}
                </h3>
                <p className="mt-2 inline-flex items-start gap-1.5 text-sm font-medium text-primary">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0" />
                  {w.host}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{w.description}</p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {w.highlights.map((h) => (
                    <li
                      key={h}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-foreground/80"
                    >
                      <Sparkles className="h-3 w-3 text-primary" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {w.international && (
                <div className="relative mt-8 hidden md:flex md:items-center md:justify-center">
                  <GlobeVisual />
                </div>
              )}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** Decorative "reach" visual: India → Kenya arc */
function GlobeVisual() {
  return (
    <div className="glass relative w-full max-w-[300px] rounded-2xl p-5 shadow-xl shadow-black/10">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          <Globe2 className="h-4 w-4 text-primary" />
          Reach
        </span>
        <span className="text-xs text-muted-foreground">2 continents</span>
      </div>
      <svg viewBox="0 0 260 150" className="mt-3 w-full">
        <defs>
          <linearGradient id="arc-stroke" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
        {[30, 60, 90, 120].map((y) => (
          <line key={y} x1="0" x2="260" y1={y} y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" />
        ))}
        <path
          d="M 50 100 Q 130 -10 210 70"
          fill="none"
          stroke="url(#arc-stroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 8"
        >
          <animate attributeName="stroke-dashoffset" from="140" to="0" dur="4s" repeatCount="indefinite" />
        </path>
        <circle r="4" fill="var(--primary)">
          <animateMotion dur="4s" repeatCount="indefinite" path="M 50 100 Q 130 -10 210 70" />
        </circle>
        {/* Kenya */}
        <circle cx="50" cy="100" r="7" fill="var(--accent)" opacity="0.25" />
        <circle cx="50" cy="100" r="3.5" fill="var(--accent)" />
        <text x="50" y="124" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--foreground)">
          Nairobi
        </text>
        {/* India */}
        <circle cx="210" cy="70" r="7" fill="var(--primary)" opacity="0.25" />
        <circle cx="210" cy="70" r="3.5" fill="var(--primary)" />
        <text x="210" y="94" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--foreground)">
          Amritapuri
        </text>
      </svg>
      <p className="mt-2 text-center text-xs text-muted-foreground">Amrita Virtual Labs × Commonwealth of Learning</p>
    </div>
  );
}
