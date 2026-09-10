import { motion } from "framer-motion";
import { BookMarked, ExternalLink, FileText, Users } from "lucide-react";
import { Fragment } from "react";
import { publications, scholarUrl } from "@/data/portfolio";
import { cn } from "@/utils/cn";
import { Reveal, staggerContainer, staggerItem } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const SELF = "Saneesh P. Francis";

function Authors({ authors }: { authors: string }) {
  const parts = authors.split(SELF);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <strong className="font-semibold text-foreground">{SELF}</strong>}
        </Fragment>
      ))}
    </>
  );
}

export function Publications() {
  const journals = publications.filter((p) => p.type === "Journal").length;
  const conferences = publications.length - journals;

  return (
    <section id="publications" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-accent absolute top-1/2 -left-40 h-[520px] w-[520px] -translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Research"
          title="Peer-reviewed"
          highlight="publications."
          description="Research on how virtual laboratories influence motivation, reflective learning, skill acquisition and remote experimentation."
        />

        <Reveal className="mb-8 flex flex-wrap gap-3">
          {[
            { icon: BookMarked, label: `${publications.length} publications` },
            { icon: FileText, label: `${journals} journal articles` },
            { icon: Users, label: `${conferences} conference papers` },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-sm font-medium text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-primary" />
              {label}
            </span>
          ))}
        </Reveal>

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-4"
        >
          {publications.map((pub, i) => (
            <motion.li key={pub.title} variants={staggerItem}>
              <a
                href={scholarUrl(pub.title)}
                target="_blank"
                rel="noreferrer"
                className="group relative grid gap-5 overflow-hidden rounded-2xl border border-border bg-card/70 p-6 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 md:grid-cols-[96px_1fr_auto] md:items-center md:gap-8 md:p-7"
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-accent opacity-0 transition-opacity group-hover:opacity-100" />

                {/* Year */}
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-1">
                  <span className="font-display text-3xl font-bold text-gradient md:text-4xl">{pub.year}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {String(publications.length - i).padStart(2, "0")}
                  </span>
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase",
                        pub.type === "Journal"
                          ? "bg-primary/15 text-primary"
                          : "bg-accent/15 text-accent",
                      )}
                    >
                      {pub.type}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">{pub.publisher}</span>
                  </div>
                  <h3 className="font-display text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-lg">
                    {pub.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground italic">{pub.venue}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    <Authors authors={pub.authors} />
                  </p>
                </div>

                {/* Link */}
                <span className="inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-primary md:self-center">
                  Scholar
                  <ExternalLink className="h-4 w-4" />
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
