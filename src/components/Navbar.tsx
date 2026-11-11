import { AnimatePresence, motion } from "framer-motion";
import { Atom, Download, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { navLinks, profile } from "@/data/portfolio";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { Theme } from "@/hooks/useTheme";
import { cn } from "@/utils/cn";

type NavbarProps = {
  theme: Theme;
  onToggleTheme: () => void;
  onNavigateToSimulations?: () => void;
};

export function Navbar({ theme, onToggleTheme, onNavigateToSimulations }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sectionIds = useMemo(() => navLinks.map((l) => l.href.replace("#", "")), []);
  const active = useActiveSection(sectionIds);

  const handleSimulationsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (onNavigateToSimulations) {
      onNavigateToSimulations();
    } else {
      window.location.hash = "#/simulations";
    }
  };


  useEffect(() => {
    const getScrollTop = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const onScroll = () => setScrolled(getScrollTop() > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full max-w-full transition-all duration-300",
        scrolled || open
          ? "border-b border-border/70 bg-background/85 shadow-sm shadow-black/5 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 md:h-[72px]">
        {/* Brand */}
        <a href="#home" className="group flex items-center gap-2.5 sm:gap-3" aria-label="Go to top">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-accent font-display text-sm font-bold text-primary-foreground shadow-md shadow-primary/25">
            {profile.initials}
            <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {profile.name}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = active === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            );
          })}
          <li>
            <a
              href="#/simulations"
              onClick={handleSimulationsClick}
              className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground shadow-xs"
            >
              <Atom className="h-3.5 w-3.5" />
              <span>Simulations</span>
              <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[10px] font-bold text-primary group-hover:text-primary-foreground">
                Live
              </span>
            </a>
          </li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </motion.span>
            </AnimatePresence>
          </button>

          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 md:inline-flex"
          >
            <Download className="h-4 w-4" />
            Download CV
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition-all hover:border-primary/50 hover:text-primary active:scale-95 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-border/70 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-8">
              {navLinks.map((link, i) => {
                const id = link.href.replace("#", "");
                const isActive = active === id;
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {link.label}
                      <span className="text-xs text-muted-foreground/70">0{i + 1}</span>
                    </a>
                  </motion.li>
                );
              })}
              <motion.li
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <a
                  href="#/simulations"
                  onClick={handleSimulationsClick}
                  className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-base font-semibold text-primary"
                >
                  <span className="flex items-center gap-2">
                    <Atom className="h-4 w-4" />
                    Science Simulations
                  </span>
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                    Live
                  </span>
                </a>
              </motion.li>
              <li className="pt-2">
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground"
                >
                  <Download className="h-4 w-4" />
                  Download CV
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
