"use client";

import { useEffect, useRef, useState } from "react";
import type { TimelineStop } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";

/** Vertical timeline whose spine draws with scroll; each stop lights up when the spine reaches it. */
export default function Timeline({ stops }: { stops: TimelineStop[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(listRef, { startAt: 0.62, endAt: 0.62 });
  const [marks, setMarks] = useState<number[]>([]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const h = list.offsetHeight || 1;
      const items = Array.from(list.querySelectorAll<HTMLElement>("[data-stop]"));
      setMarks(items.map((el) => (el.offsetTop + 18) / h));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  const all = stops.length + 1; // + "next" card

  return (
    <div ref={listRef} className="tl">
      <span className="tl-track" aria-hidden="true" />
      <span className="tl-spine" aria-hidden="true" style={{ transform: `scaleY(${progress})` }} />
      <ol className="tl-list">
      {stops.map((s, i) => {
        const lit = marks[i] !== undefined && progress >= marks[i] - 0.001;
        return (
          <li key={`${s.title}-${s.year}`} data-stop className={`tl-stop ${lit ? "is-lit" : ""}`}>
            <span className="tl-dot" aria-hidden="true" />
            <p className="tl-year mono">
              {s.year} <span>· {s.kind === "education" ? "Education" : "Work"}</span>
            </p>
            <h3 className="tl-title">{s.title}</h3>
            <p className="tl-place">{s.place}</p>
            <p className="tl-detail">{s.detail}</p>
          </li>
        );
      })}
      <li data-stop className={`tl-stop tl-next ${marks[all - 1] !== undefined && progress >= marks[all - 1] - 0.02 ? "is-lit" : ""}`}>
        <span className="tl-dot" aria-hidden="true" />
        <div className="tl-next-card">
          <p className="tl-year mono">Next</p>
          <p className="tl-next-title">
            Your <span className="it">team?</span>
          </p>
        </div>
      </li>
      </ol>

      <style>{`
        .tl{position:relative;padding:0 0 0 44px}.tl-list{list-style:none;margin:0;padding:0}
        .tl-track,.tl-spine{position:absolute;left:11px;top:6px;bottom:6px;width:2px;border-radius:2px}
        .tl-track{background:var(--line)}
        .tl-spine{background:linear-gradient(180deg,#7c3aed,#ec4899 60%,#f97316);box-shadow:0 0 14px rgba(168,85,247,.45);transform-origin:50% 0;transform:scaleY(0);transition:transform .15s linear}
        .tl-stop{position:relative;padding:4px 0 56px}
        .tl-stop>:not(.tl-dot){opacity:.36;transform:translateX(10px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
        .tl-stop.is-lit>:not(.tl-dot){opacity:1;transform:none}
        .tl-dot{position:absolute;left:-44px;top:8px;width:24px;height:24px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);transition:box-shadow .6s var(--ease),background-color .6s var(--ease)}
        .tl-dot::after{content:"";position:absolute;inset:7px;border-radius:50%;background:var(--faint);transition:background-color .6s var(--ease),transform .6s var(--ease)}
        .tl-stop.is-lit .tl-dot{box-shadow:inset 0 0 0 2px var(--ink),0 0 0 6px rgba(26,20,70,.06)}
        .tl-stop.is-lit .tl-dot::after{background:var(--grad);box-shadow:0 0 0 4px rgba(236,72,153,.18),0 0 18px rgba(168,85,247,.55);transform:scale(1.15)}
        .tl-year{margin:0;font-size:12px;letter-spacing:.04em;color:var(--ink)}
        .tl-year span{color:var(--mute)}
        .tl-title{margin:10px 0 0;font-size:clamp(26px,2.6vw,38px);font-weight:700;letter-spacing:-.04em;line-height:1.05}
        .tl-place{margin:8px 0 0;color:var(--ink-2);font-weight:500}
        .tl-detail{margin:10px 0 0;color:var(--mute);max-width:56ch}
        .tl-next{padding-bottom:0}
        .tl-next-card{border:1.5px dashed rgba(26,20,70,.28);border-radius:24px;padding:24px 26px}
        .tl-next-title{margin:8px 0 0;font-size:clamp(30px,3vw,44px);font-weight:700;letter-spacing:-.045em;line-height:1}
      `}</style>
    </div>
  );
}
