import { Briefcase, CheckCircle2, MapPin } from "lucide-react";
import { experience } from "@/data/portfolio";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-accent absolute top-1/4 -left-40 h-[480px] w-[480px] rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Experience"
          title="My professional"
          highlight="journey."
          description="More than a decade dedicated to building and scaling virtual laboratories for science education."
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-2 bottom-2 left-4 w-px bg-gradient-to-b from-primary via-border to-transparent md:left-[220px]" />

          <ol className="space-y-12">
            {experience.map((job, i) => (
              <Reveal key={job.role} as="li" delay={i * 0.05} className="relative pl-12 md:grid md:grid-cols-[220px_1fr] md:gap-10 md:pl-0">
                {/* Dot */}
                <span className="absolute top-1.5 left-4 flex h-4 w-4 -translate-x-1/2 items-center justify-center md:left-[220px]">
                  <span className="absolute h-4 w-4 rounded-full bg-primary/30" />
                  {job.current && <span className="absolute h-4 w-4 animate-pulse-ring rounded-full bg-primary/40" />}
                  <span className="relative h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                </span>

                {/* Date column */}
                <div className="mb-4 md:mb-0 md:pr-12 md:text-right">
                  <p className="font-display text-base font-semibold text-foreground">
                    {job.start} — {job.end}
                  </p>
                  {job.current && (
                    <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-500 uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Current
                    </span>
                  )}
                  <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground md:justify-end">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </p>
                </div>

                {/* Card */}
                <article className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-6 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 md:p-7">
                  <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex items-start gap-4">
                    <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary sm:flex">
                      <Briefcase className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground md:text-xl">{job.role}</h3>
                      <p className="mt-1 text-sm font-medium text-primary">{job.organisation}</p>
                    </div>
                  </div>

                  <p className="relative mt-4 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                    {job.summary}
                  </p>

                  <ul className="relative mt-4 space-y-2.5">
                    {job.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
