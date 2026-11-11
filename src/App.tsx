import { useEffect, useState } from "react";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Projects } from "@/components/Projects";
import { Publications } from "@/components/Publications";
import { Skills } from "@/components/Skills";
import { Workshops } from "@/components/Workshops";
import { SimulationsPage } from "@/components/simulations/SimulationsPage";
import { BackToTop } from "@/components/ui/BackToTop";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useTheme } from "@/hooks/useTheme";

type RouteState = {
  page: "home" | "simulations";
  simId?: string;
};

function parseRoute(): RouteState {
  const hash = window.location.hash.toLowerCase();
  if (hash.startsWith("#/simulations") || hash.startsWith("#/simulator")) {
    const parts = hash.split("/").filter(Boolean);
    // e.g. ["#", "simulator", "simple_pendulum"] or ["#", "simulations"]
    const simId = parts.length >= 3 ? parts[2].split("?")[0] : undefined;
    return { page: "simulations", simId };
  }
  return { page: "home" };
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [route, setRoute] = useState<RouteState>(() => parseRoute());

  useEffect(() => {
    const handleHash = () => {
      setRoute(parseRoute());
    };
    window.addEventListener("hashchange", handleHash);
    window.addEventListener("popstate", handleHash);
    return () => {
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener("popstate", handleHash);
    };
  }, []);

  const navigateToSimulations = (simId?: string) => {
    const targetHash = simId ? `#/simulator/${simId}` : "#/simulations";
    window.location.hash = targetHash;
    setRoute({ page: "simulations", simId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToHome = (sectionId?: string) => {
    if (sectionId) {
      window.location.hash = `#${sectionId}`;
      setRoute({ page: "home" });
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 60);
    } else {
      window.location.hash = "#home";
      setRoute({ page: "home" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (route.page === "simulations") {
    return (
      <SimulationsPage
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateHome={navigateToHome}
        initialSimId={route.simId}
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-clip bg-background text-foreground">
      <ScrollProgress />
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateToSimulations={() => navigateToSimulations()}
      />

      <main>
        <Hero />
        <About />
        <Experience />
        <Education />
        <Skills />
        <Projects onNavigateToSimulations={() => navigateToSimulations()} />
        <Publications />
        <Workshops />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
