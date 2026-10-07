import SectionHead from "../ui/SectionHead";
import SkillsTable from "./SkillsTable";
import { SKILL_GROUPS } from "@/lib/data";

export default function Skills({ index }: { index: string }) {
  const total = SKILL_GROUPS.reduce((n, g) => n + g.skills.length, 0);
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="wrap">
        <div className="sk-head">
          <SectionHead index={index} label="Skills" id="skills-title" title="The periodic table of my" accent="stack." />
          <p className="sk-sub rv">
            {total} elements from my résumé, grouped into {SKILL_GROUPS.length} families. Hover or focus a tile to inspect it.
          </p>
        </div>
        <SkillsTable />
      </div>
      <style>{`
        .sk-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:40px}
        .sk-head .h-sec{max-width:12ch}
        .sk-sub{margin:0;max-width:34ch;color:var(--mute)}
      `}</style>
    </section>
  );
}
