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
import { BackToTop } from "@/components/ui/BackToTop";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useTheme } from "@/hooks/useTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Hero />
        <About />
        <Experience />
        <Education />
        <Skills />
        <Projects />
        <Publications />
        <Workshops />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
