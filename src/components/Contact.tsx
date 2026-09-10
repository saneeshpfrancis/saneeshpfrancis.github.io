import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Mail, MapPin, MessageSquare, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { profile, socials } from "@/data/portfolio";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const inputClass =
  "w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/15";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject || `Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`Hi Saneesh,\n\n${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    window.setTimeout(() => setSent(false), 6000);
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-primary absolute -bottom-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build better"
          highlight="learning together."
          description="Interested in virtual labs, a workshop for your institution or a research collaboration? I'd love to hear from you."
        />

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Info */}
          <Reveal direction="left" className="lg:col-span-5">
            <div className="space-y-4">
              <InfoCard
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={profile.email}
                href={`mailto:${profile.email}`}
              />
              <InfoCard
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value={`${profile.workLocation} · ${profile.location}`}
              />
              <InfoCard
                icon={<MessageSquare className="h-5 w-5" />}
                label="Open to"
                value="Workshops · Collaborations · Consulting on virtual labs"
              />
            </div>

            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Find me on</p>
              <div className="flex flex-wrap gap-3">
                {socials.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" size={16} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal direction="right" delay={0.1} className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="glass relative overflow-hidden rounded-3xl p-6 shadow-xl shadow-black/5 md:p-8"
            >
              <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-foreground">
                    Subject
                  </label>
                  <input
                    id="subject"
                    value={form.subject}
                    onChange={update("subject")}
                    placeholder="Workshop request, collaboration, ..."
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Tell me a little about what you have in mind…"
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Submitting opens your email client with the message pre-filled.
                </p>
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                >
                  Send message
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </button>
              </div>

              <AnimatePresence>
                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="relative mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Your email client should open now — thank you for reaching out!
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{label}</p>
        <p className="mt-0.5 text-sm font-medium break-words text-foreground">{value}</p>
      </div>
    </>
  );

  const className =
    "flex items-center gap-4 rounded-2xl border border-border bg-card/70 p-4 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10";

  return href ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}
