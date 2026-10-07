"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/data";
import TechLogo from "../ui/TechLogo";
import { ClaimsUI, FraudUI } from "../ui/MiniUI";

export default function WorkAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="wa rv">
      {PROJECTS.map((p, i) => {
        const isOpen = open === i;
        return (
          <article
            key={p.id}
            className={`wa-panel card ${isOpen ? "is-open is-active" : ""}`}
            onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
            aria-labelledby={`wa-t-${p.id}`}
          >
            <button
              className="wa-spine"
              aria-expanded={isOpen}
              aria-controls={`wa-c-${p.id}`}
              onClick={() => setOpen(i)}
              onFocus={() => setOpen(i)}
            >
              <span className="wa-num mono">{p.index}</span>
              <span className="wa-vt" id={`wa-t-${p.id}`}>{p.title}</span>
              <span className="wa-plus" aria-hidden="true">+</span>
            </button>

            <div id={`wa-c-${p.id}`} className="wa-content" hidden={!isOpen}>
              <div className="wa-info">
                <p className="wa-kicker mono">
                  <span>{p.index}</span> {p.kicker}
                </p>
                <h3 className="wa-title">{p.title}</h3>
                <p className="wa-client mono">Client: {p.client}</p>
                <p className="wa-desc">{p.description}</p>
                <ul className="wa-feats">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <ul className="wa-tech" aria-label="Tech used">
                  {p.tech.map((t) => (
                    <li key={t.name} className="chip">
                      <TechLogo name={t.logo} size={14} />
                      {t.name}
                    </li>
                  ))}
                </ul>
                {p.github && (
                  <a className="btn btn-primary wa-gh" href={p.github} target="_blank" rel="noreferrer">
                    View on GitHub <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
              <div className="wa-visual">
                <span className="wa-badge mono">Illustrative UI</span>
                {p.ui === "fraud" ? <FraudUI /> : <ClaimsUI />}
              </div>
            </div>
          </article>
        );
      })}

      <style>{`
        .wa{display:flex;gap:12px;height:min(78svh,600px);min-height:560px}
        .wa-panel{position:relative;flex:0.001 1 84px;min-width:84px;overflow:hidden;display:flex;transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
        .wa-panel.is-open{flex-grow:8}
        .wa-spine{flex:0 0 84px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;border-right:1px solid transparent;border-radius:26px 0 0 26px}
        .wa-panel.is-open .wa-spine{border-right-color:var(--line)}
        .wa-num{font-size:12px;color:var(--mute)}
        .wa-vt{writing-mode:vertical-rl;transform:rotate(180deg);font-size:18px;font-weight:600;letter-spacing:-.02em;white-space:nowrap;max-height:calc(100% - 110px);overflow:hidden;text-overflow:ellipsis}
        .wa-plus{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(26,20,70,.2);font-size:20px;line-height:1;transition:transform .6s var(--ease),background-color .4s var(--ease),color .4s var(--ease)}
        .wa-spine:hover .wa-plus{transform:rotate(90deg);background:var(--ink);color:#fff}
        .wa-panel.is-open .wa-plus{transform:rotate(45deg);background:var(--ink);color:#fff}
        .wa-content{flex:1 1 auto;min-width:0;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:28px;padding:30px;animation:waIn .8s var(--ease) both}
        .wa-content[hidden]{display:none}
        @keyframes waIn{from{opacity:0}to{opacity:1}}
        .wa-info{min-width:0;display:flex;flex-direction:column;overflow:auto;scrollbar-width:thin}
        .wa-kicker{margin:0;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
        .wa-kicker span{color:var(--ink);margin-right:6px}
        .wa-title{margin:12px 0 0;font-size:clamp(28px,2.6vw,40px);font-weight:700;letter-spacing:-.04em;line-height:1.02}
        .wa-client{margin:10px 0 0;font-size:11px;color:var(--faint)}
        .wa-desc{margin:14px 0 0;color:var(--ink-2);font-size:15px}
        .wa-feats{list-style:none;margin:18px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px 18px}
        .wa-feats li{position:relative;padding-left:14px;font-size:13px;line-height:1.4;color:var(--ink-2)}
        .wa-feats li::before{content:"";position:absolute;left:0;top:.55em;width:6px;height:1.5px;background:var(--ink)}
        .wa-tech{list-style:none;margin:auto 0 0;padding:20px 0 0;display:flex;flex-wrap:wrap;gap:6px}
        .wa-tech .chip{height:28px;font-size:12px;padding:0 10px}
        .wa-gh{margin-top:16px;align-self:flex-start}
        .wa-visual{position:relative;min-width:0;border-radius:18px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;
          clip-path:inset(0 100% 0 0 round 18px);animation:wipe 1.1s var(--ease) .15s forwards}
        @keyframes wipe{to{clip-path:inset(0 0 0 0 round 18px)}}
        .wa-badge{position:absolute;top:12px;right:12px;z-index:2;font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.85);box-shadow:inset 0 0 0 1px var(--line);color:var(--mute)}
        @media (max-width:1100px){
          .wa-content{grid-template-columns:minmax(0,1fr)}
          .wa-visual{min-height:260px}
          .wa{height:auto;min-height:0}
          .wa-info{overflow:visible}
        }
        @media (max-width:860px){
          .wa{flex-direction:column}
          .wa-panel{flex:0 0 auto;flex-direction:column;min-width:0}
          .wa-spine{flex:0 0 auto;flex-direction:row;justify-content:flex-start;gap:16px;padding:18px 20px;border-right:0;border-radius:26px;text-align:left}
          .wa-panel.is-open .wa-spine{border-bottom:1px solid var(--line);border-radius:26px 26px 0 0}
          .wa-vt{writing-mode:horizontal-tb;transform:none;font-size:17px;white-space:normal;max-height:none;flex:1}
          .wa-content{padding:20px}
          .wa-feats{grid-template-columns:1fr}
        }
      `}</style>
    </div>
  );
}
