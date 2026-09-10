import { motion } from "framer-motion";
import { Award, Calendar, GraduationCap } from "lucide-react";
import { education } from "@/data/portfolio";
import { staggerContainer, staggerItem } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Education() {
  return (
    <section id="education" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Education"
          title="Academic"
          highlight="foundations."
          description="Grounded in physics and computer science — the two disciplines that power virtual laboratories."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 md:grid-cols-3"
        >
          {education.map((edu) => (
            <motion.article
              key={`${edu.degree}-${edu.start}`}
              variants={staggerItem}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/70 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent opacity-60 transition-opacity group-hover:opacity-100" />
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                  <GraduationCap className="h-6 w-6" />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {edu.start} – {edu.end}
                </span>
              </div>

              <h3 className="mt-5 font-display text-lg font-bold text-foreground">{edu.degree}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{edu.field}</p>
              <p className="mt-3 text-sm text-muted-foreground">{edu.institution}</p>

              <div className="mt-auto pt-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
                  <Award className="h-3.5 w-3.5" />
                  {edu.grade}
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
