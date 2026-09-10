import { motion } from "framer-motion";
import { skillGroups } from "@/data/portfolio";
import { staggerContainer, staggerItem } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="glow-primary absolute top-1/3 -right-40 h-[480px] w-[480px] rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Skills"
          title="Tools, methods &"
          highlight="expertise."
          description="A blend of engineering, leadership and pedagogy that turns physics concepts into engaging, measurable learning experiences."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 md:grid-cols-2"
        >
          {skillGroups.map(({ title, description, icon: Icon, skills }) => (
            <motion.article
              key={title}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-6 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 md:p-7"
            >
              <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 blur-2xl transition-transform duration-500 group-hover:scale-150" />

              <div className="relative flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>

              <ul className="relative mt-6 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm font-medium text-foreground/90 transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
