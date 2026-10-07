"use client";

import { useMemo, useRef, useState } from "react";
import { PROJECTS, SKILL_GROUPS } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import TechLogo, { BRAND, isBrand } from "../ui/TechLogo";

type Tile = {
  n: number;
  name: string;
  symbol: string;
  logo: string;
  family: string;
  short: string;
  projects: string[];
};

const TILES: Tile[] = SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ ...s, family: g.family, short: g.short, projects: s.projects ?? [] }))).map(
  (t, i) => ({ ...t, n: i + 1 }),
);
const PROJECT_TITLE = Object.fromEntries(PROJECTS.map((p) => [p.id, p.title]));

export default function SkillsTable() {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { threshold: 0.15 });
  const [family, setFamily] = useState<string | null>(null);
  const [sel, setSel] = useState<Tile>(TILES[0]);

  const families = useMemo(() => SKILL_GROUPS.map((g) => g.family), []);
  const brand = isBrand(sel.logo) ? BRAND[sel.logo] : null;

  return (
    <div className="sk">
      <div className="sk-chips" role="group" aria-label="Filter skills by family">
        <button className={`sk-chip ${family === null ? "is-on" : ""}`} aria-pressed={family === null} onClick={() => setFamily(null)}>
          All
        </button>
        {families.map((f) => (
          <button key={f} className={`sk-chip ${family === f ? "is-on" : ""}`} aria-pressed={family === f} onClick={() => setFamily(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="sk-layout">
        <div ref={gridRef} className={`sk-grid ${inView ? "is-in" : ""}`}>
          {TILES.map((t, i) => {
            const dim = family !== null && t.family !== family;
            const d8 = Math.floor(i / 8) + (i % 8);
            const d4 = Math.floor(i / 4) + (i % 4);
            return (
              <button
                key={t.n}
                className={`sk-tile ${dim ? "is-dim" : ""} ${sel.n === t.n ? "is-sel" : ""}`}
                style={{ "--d8": d8, "--d4": d4 } as React.CSSProperties}
                onMouseEnter={() => setSel(t)}
                onFocus={() => setSel(t)}
                onClick={() => setSel(t)}
                aria-label={`${t.name}, ${t.family}`}
                aria-controls="sk-inspector"
              >
                <span className="sk-n mono">{t.n}</span>
                <span className="sk-sym">{t.symbol}</span>
                <span className="sk-name">{t.name}</span>
                <span className="sk-fam mono">{t.short}</span>
              </button>
            );
          })}
        </div>

        <aside id="sk-inspector" className="sk-insp card" aria-live="polite" aria-label="Skill inspector">
          <div className="sk-insp-top mono">
            <span>No. {String(sel.n).padStart(2, "0")}</span>
            <span>{sel.symbol}</span>
          </div>
          <div key={sel.n} className="sk-logo">
            <span className="sk-glow" style={{ background: brand ? `radial-gradient(closest-side, ${brand.color}2e, transparent)` : undefined }} />
            <TechLogo name={sel.logo} size={150} decorative={false} className="sk-logo-img" />
          </div>
          <h3 className="sk-insp-name">{sel.name}</h3>
          <p className="sk-insp-fam mono">{sel.family}</p>
          <div className="sk-insp-proj">
            <p className="mono">Used in</p>
            {sel.projects.length ? (
              <ul>
                {sel.projects.map((p) => (
                  <li key={p}>{PROJECT_TITLE[p]}</li>
                ))}
              </ul>
            ) : (
              <p className="sk-none">Listed under Key Skills</p>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        .sk-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
        .sk-chip{height:36px;padding:0 16px;border-radius:999px;font-size:13.5px;font-weight:500;color:var(--ink-2);background:var(--card);box-shadow:inset 0 0 0 1px var(--line);
          transition:background-color .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
        .sk-chip:hover{transform:translateY(-1px);color:var(--ink)}
        .sk-chip.is-on{background:var(--ink);color:#fff;box-shadow:none}
        .sk-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}
        .sk-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
        .sk-tile{position:relative;display:flex;flex-direction:column;align-items:flex-start;text-align:left;aspect-ratio:1/1.12;padding:10px 10px 9px;border-radius:14px;background:var(--card);
          box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;
          opacity:0;transform:translateY(16px) scale(.96);
          transition:opacity .7s var(--ease),transform .7s var(--ease),background-color .35s var(--ease),color .35s var(--ease),box-shadow .35s var(--ease);
          transition-delay:calc(var(--d8)*40ms),calc(var(--d8)*40ms),0s,0s,0s}
        .sk-grid.is-in .sk-tile{opacity:1;transform:none}
        .sk-grid.is-in .sk-tile.is-dim{opacity:.2}
        .sk-tile:hover,.sk-tile.is-sel{background:var(--ink);color:#fff;box-shadow:none}
        .sk-tile:hover .sk-n,.sk-tile:hover .sk-fam,.sk-tile.is-sel .sk-n,.sk-tile.is-sel .sk-fam{color:rgba(255,255,255,.6)}
        .sk-n{font-size:10px;color:var(--faint)}
        .sk-sym{margin-top:auto;font-size:clamp(20px,2.2vw,32px);font-weight:700;letter-spacing:-.04em;line-height:1}
        .sk-name{margin-top:5px;font-size:11px;line-height:1.2;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.4em}
        .sk-fam{margin-top:4px;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint)}
        .sk-insp{position:sticky;top:96px;padding:20px;display:flex;flex-direction:column;align-items:center;text-align:center}
        .sk-insp-top{width:100%;display:flex;justify-content:space-between;font-size:11px;color:var(--mute)}
        .sk-logo{position:relative;width:150px;height:150px;margin:18px 0 6px;display:grid;place-items:center;color:var(--ink);animation:pop .7s var(--ease) both}
        .sk-glow{position:absolute;inset:-40px;border-radius:50%;background:radial-gradient(closest-side,rgba(13,13,13,.06),transparent);pointer-events:none}
        .sk-logo-img{position:relative}
        @keyframes pop{0%{opacity:0;transform:scale(.7) rotate(-6deg)}60%{opacity:1;transform:scale(1.05)}100%{transform:none}}
        .sk-insp-name{margin:14px 0 0;font-size:22px;font-weight:700;letter-spacing:-.03em;line-height:1.1}
        .sk-insp-fam{margin:6px 0 0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
        .sk-insp-proj{width:100%;margin-top:18px;padding-top:14px;border-top:1px solid var(--line);text-align:left}
        .sk-insp-proj>p.mono{margin:0 0 8px;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint)}
        .sk-insp-proj ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}
        .sk-insp-proj li{font-size:14px;padding-left:14px;position:relative}
        .sk-insp-proj li::before{content:"";position:absolute;left:0;top:.62em;width:6px;height:6px;border-radius:50%;background:var(--ink)}
        .sk-none{margin:0;font-size:14px;color:var(--mute)}
        @media (max-width:980px){
          .sk-layout{grid-template-columns:minmax(0,1fr)}
          .sk-insp{position:relative;top:0}
        }
        @media (max-width:640px){
          .sk-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
          .sk-tile{transition-delay:calc(var(--d4)*40ms),calc(var(--d4)*40ms),0s,0s,0s;padding:8px 8px 7px}
          .sk-sym{font-size:22px}
          .sk-name{font-size:10px}
        }
      `}</style>
    </div>
  );
}
