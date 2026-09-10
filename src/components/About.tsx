import { motion } from "framer-motion";
import { Building2, Cake, Download, Globe, Mail, MapPin, User } from "lucide-react";
import { aboutParagraphs, profile, services } from "@/data/portfolio";
import { Reveal, staggerContainer, staggerItem } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

function calculateAge(birthDate: string): number | null {
  const dob = new Date(birthDate);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

export function About() {
  const age = profile.birthDate ? calculateAge(profile.birthDate) : null;

  const facts = [
    { icon: User, label: "Name", value: profile.fullName },
    ...(age !== null ? [{ icon: Cake, label: "Age", value: `${age} Years` }] : []),
    { icon: MapPin, label: "From", value: profile.location },
    { icon: Building2, label: "Based at", value: profile.workLocation },
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Globe, label: "Languages", value: profile.languages.join(", ") },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="About me"
          title="Bridging physics, technology"
          highlight="and education."
          description="A closer look at who I am, what I do and the values that drive my work in virtual laboratory education."
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Profile card */}
          <Reveal direction="left" className="lg:col-span-5">
            <div className="glass relative overflow-hidden rounded-3xl p-7 shadow-xl shadow-black/5 lg:sticky lg:top-28">
              <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />

              <div className="relative flex items-center gap-5">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-accent opacity-70 blur-sm" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-2xl font-bold text-primary-foreground ring-4 ring-background">
                    {profile.initials}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{profile.name}</h3>
                  <p className="text-sm font-medium text-primary">{profile.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Amrita Vishwa Vidyapeetham</p>
                </div>
              </div>

              <ul className="relative mt-7 space-y-3.5">
                {facts.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="block truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="relative mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
              >
                <Download className="h-4 w-4" />
                Download CV
              </a>
            </div>
          </Reveal>

          {/* Bio + services */}
          <div className="lg:col-span-7">
            <Reveal direction="right">
              <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-[17px]">
                {aboutParagraphs.map((p, i) => (
                  <p key={i} className={i === 0 ? "text-foreground/90" : undefined}>
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <h3 className="font-display text-lg font-semibold text-foreground">What I do</h3>
            </Reveal>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-5 grid gap-4 sm:grid-cols-2"
            >
              {services.map(({ title, description, icon: Icon }) => (
                <motion.article
                  key={title}
                  variants={staggerItem}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all group-hover:from-primary/5 group-hover:to-accent/5" />
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h4 className="relative mt-4 font-display text-base font-semibold text-foreground">{title}</h4>
                  <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
