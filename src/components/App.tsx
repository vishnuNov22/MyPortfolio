import { ACHIEVEMENTS, CERTIFICATIONS } from "@/lib/data";
import { SmoothScroll } from "@/lib/scroll";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";
import RevealObserver from "./ui/RevealObserver";

/**
 * Page composition. Sections whose data is empty in the résumé
 * (certifications, achievements) are not rendered and get no number.
 */
export default function App() {
  const order = [
    "about",
    "skills",
    "work",
    ...(CERTIFICATIONS.length ? ["certifications"] : []),
    "experience",
    ...(ACHIEVEMENTS.length ? ["achievements"] : []),
    "contact",
  ];
  const n = (id: string) => String(order.indexOf(id) + 1).padStart(2, "0");

  return (
    <SmoothScroll>
      <a href="#main" className="skip">Skip to content</a>
      <RevealObserver />
      <Navigation />
      <main id="main">
        <Hero />
        <About index={n("about")} />
        <Skills index={n("skills")} />
        <Work index={n("work")} />
        {CERTIFICATIONS.length > 0 && <Certifications index={n("certifications")} />}
        <Experience index={n("experience")} />
        {ACHIEVEMENTS.length > 0 && <Achievements index={n("achievements")} />}
        <Contact index={n("contact")} />
      </main>
      <style>{`
        .skip{position:fixed;left:16px;top:-60px;z-index:100;background:var(--ink);color:#fff;padding:10px 16px;border-radius:999px;font-size:14px;transition:top .3s var(--ease)}
        .skip:focus{top:16px}
      `}</style>
    </SmoothScroll>
  );
}
