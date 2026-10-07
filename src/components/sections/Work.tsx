import SectionHead from "../ui/SectionHead";
import WorkAccordion from "./WorkAccordion";

export default function Work({ index }: { index: string }) {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="wrap">
        <div className="wk-head">
          <SectionHead index={index} label="Selected work" id="work-title" title="Things I've" accent="built." />
          <p className="wk-sub rv">
            Enterprise Generative AI platforms delivered for confidential clients in banking and healthcare.
          </p>
        </div>
        <WorkAccordion />
      </div>
      <style>{`
        .wk-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:40px}
        .wk-sub{margin:0;max-width:36ch;color:var(--mute)}
      `}</style>
    </section>
  );
}
