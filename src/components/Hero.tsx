import { motion } from "framer-motion";
import { ArrowRight, Atom, BookOpen, Download, MapPin, Radio } from "lucide-react";
import { profile, publications, socials, stats } from "@/data/portfolio";
import { AtomVisual } from "./ui/AtomVisual";
import { Typewriter } from "./ui/Typewriter";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
        <div className="glow-primary absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full blur-3xl" />
        <div className="glow-accent absolute top-1/3 -right-40 h-[560px] w-[560px] rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          {/* Copy */}
          <motion.div variants={container} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div
              variants={item}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 py-1.5 pr-4 pl-2 text-sm text-muted-foreground shadow-sm backdrop-blur"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute h-2.5 w-2.5 animate-pulse-ring rounded-full bg-emerald-400" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              {profile.title} · Amrita Virtual Labs
            </motion.div>

            <motion.h1
              variants={item}
              className="font-display text-5xl leading-[1.05] font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl"
            >
              Hi, I&apos;m <span className="text-gradient">{profile.name}</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-5 font-display text-2xl font-semibold text-foreground/90 sm:text-3xl"
            >
              <span className="text-muted-foreground">A </span>
              <Typewriter words={profile.roles} className="text-primary" />
            </motion.p>

            <motion.p variants={item} className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              {profile.intro}
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
              >
                <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                Download CV
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
              >
                Let&apos;s talk
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                {socials.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                  >
                    <Icon className="h-[18px] w-[18px]" size={18} />
                  </a>
                ))}
              </div>
              <span className="hidden h-6 w-px bg-border sm:block" />
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {profile.location}
              </span>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative aspect-square">
              {/* Rotating dashed ring */}
              <div className="absolute inset-[6%] animate-spin-slow rounded-full border border-dashed border-primary/25" />
              <div className="absolute inset-[16%] rounded-full border border-border/70" />
              <div className="glass absolute inset-[16%] rounded-full shadow-2xl shadow-primary/10" />

              <AtomVisual className="absolute inset-0 h-full w-full" />

              {/* Floating badges */}
              <FloatingBadge
                className="top-[10%] -left-2 animate-float sm:left-0"
                icon={<Atom className="h-4 w-4" />}
                title="Physics Simulations"
                subtitle="Interactive & animated"
              />
              <FloatingBadge
                className="top-[48%] -right-2 animate-float-slow sm:right-0"
                icon={<Radio className="h-4 w-4" />}
                title="Remote-Triggered Labs"
                subtitle="Real instruments, online"
              />
              <FloatingBadge
                className="bottom-[8%] left-[6%] animate-float [animation-delay:2.4s]"
                icon={<BookOpen className="h-4 w-4" />}
                title={`${publications.length} Publications`}
                subtitle="IEEE · Springer · Elsevier"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass mt-16 grid grid-cols-2 divide-border/70 rounded-2xl shadow-xl shadow-black/5 md:mt-24 md:grid-cols-4 md:divide-x"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center px-6 py-6 text-center md:py-7">
              <span className="font-display text-3xl font-bold text-gradient md:text-4xl">{s.value}</span>
              <span className="mt-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary lg:flex"
      >
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-current p-1">
          <span className="h-2 w-1 animate-scroll-dot rounded-full bg-current" />
        </span>
      </a>
    </section>
  );
}

function FloatingBadge({
  className,
  icon,
  title,
  subtitle,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className={`glass absolute z-10 flex items-center gap-3 rounded-2xl px-3.5 py-2.5 shadow-lg shadow-black/10 ${className ?? ""}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">{icon}</span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="text-[11px] text-muted-foreground">{subtitle}</span>
      </span>
    </div>
  );
}
