import { Heart } from "lucide-react";
import { navLinks, profile, socials } from "@/data/portfolio";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/70">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <a href="#home" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent font-display text-sm font-bold text-primary-foreground">
                {profile.initials}
              </span>
              <span className="font-display text-base font-semibold">{profile.name}</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {profile.title} — {profile.organisation}. Making laboratory science accessible through technology.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Navigate</p>
              <ul className="space-y-2">
                {navLinks.slice(0, 4).map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-sm text-foreground/80 transition-colors hover:text-primary">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">More</p>
              <ul className="space-y-2">
                {navLinks.slice(4).map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-sm text-foreground/80 transition-colors hover:text-primary">
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#education" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                    Education
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Connect</p>
              <ul className="space-y-2">
                {socials.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      <Icon className="h-4 w-4" size={16} />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {profile.fullName}. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> using React, Tailwind CSS &amp;
            Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
