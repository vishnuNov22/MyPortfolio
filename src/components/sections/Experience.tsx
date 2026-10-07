import { EDUCATION, EXPERIENCE } from "@/lib/data";
import SectionHead from "../ui/SectionHead";
import Timeline from "./Timeline";

const firstYear = (s: string) => Number(s.match(/\d{4}/)?.[0] ?? 0);

export default function Experience({ index }: { index: string }) {
  const stops = [...EDUCATION, ...EXPERIENCE].sort((a, b) => firstYear(a.year) - firstYear(b.year));
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="wrap ex-grid">
        <div className="ex-head">
          <SectionHead index={index} label="Experience" id="experience-title" title="One path, so" accent="far." />
          <p className="ex-sub rv">Education and work, in order — from engineering school to building Generative AI in production.</p>
        </div>
        <Timeline stops={stops} />
      </div>
      <style>{`
        .ex-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);gap:clamp(32px,5vw,96px);align-items:start}
        .ex-head{position:sticky;top:120px}
        .ex-sub{margin:20px 0 0;max-width:34ch;color:var(--mute)}
        @media (max-width:900px){.ex-grid{grid-template-columns:minmax(0,1fr)}.ex-head{position:relative;top:0}}
      `}</style>
    </section>
  );
}
