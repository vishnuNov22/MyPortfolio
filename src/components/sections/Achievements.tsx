"use client";

import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS } from "@/lib/data";
import TechLogo, { BRAND } from "../ui/TechLogo";

/**
 * Pinned horizontal gallery. Rendered only when ACHIEVEMENTS has entries
 * (the current résumé lists none, so App.tsx skips it).
 */
export default function Achievements({ index }: { index: string }) {
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [p, setP] = useState(0);
  const [center, setCenter] = useState(0);
  const [seen, setSeen] = useState<boolean[]>([]);

  useEffect(() => {
    const measure = () => {
      const t = track.current;
      if (t) setTravel(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const o = outer.current;
      const t = track.current;
      if (o && t) {
        const r = o.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const prog = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
        setP(prog);
        const mid = window.innerWidth / 2;
        let best = 0;
        let bestD = Infinity;
        const s: boolean[] = [];
        Array.from(t.children).forEach((c, i) => {
          const cr = c.getBoundingClientRect();
          const d = Math.abs(cr.left + cr.width / 2 - mid);
          if (d < bestD) { bestD = d; best = i; }
          s[i] = cr.left < window.innerWidth && cr.right > 0 && r.top < window.innerHeight && r.bottom > 0;
        });
        setCenter(best);
        setSeen((prev) => s.map((v, i) => v || !!prev[i]));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!ACHIEVEMENTS.length) return null;

  return (
    <section id="achievements" ref={outer} className="ac" style={{ height: `calc(100svh + ${travel}px)` }} aria-labelledby="ach-title">
      <div className="ac-pin">
        <div className="wrap ac-head">
          <p className="tag"><b>{index}</b> — Achievements</p>
          <h2 id="ach-title" className="h-sec">Proof in <span className="it">numbers.</span></h2>
          <div className="ac-bar" aria-hidden="true"><span style={{ transform: `scaleX(${p})` }} /></div>
        </div>
        <div ref={track} className="ac-track" style={{ transform: `translateX(${-p * travel}px)` }}>
          {ACHIEVEMENTS.map((a, i) => (
            <article key={a.label} className={`ac-card card ${center === i ? "is-center" : ""}`}>
              <div className="ac-top">
                <span className="ac-logo" style={{ "--g": BRAND[a.logo]?.color ?? "#1A1446" } as React.CSSProperties}>
                  <TechLogo name={a.logo} size={40} decorative={false} />
                </span>
                <span className="mono ac-idx">{String(i + 1).padStart(2, "0")} / {String(ACHIEVEMENTS.length).padStart(2, "0")}</span>
              </div>
              <div className="ac-bottom">
                <div>
                  <h3>{a.label}</h3>
                  <p>{a.caption}</p>
                  <p className="mono ac-detail">{a.detail}</p>
                </div>
                <CountUp value={a.value} suffix={a.suffix} start={!!seen[i]} />
              </div>
            </article>
          ))}
          <div className="ac-end">and counting →</div>
        </div>
      </div>
      <style>{`
        .ac{position:relative}
        .ac-pin{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:center;gap:40px}
        .ac-bar{margin-top:24px;height:2px;background:var(--line)}.ac-bar span{display:block;height:100%;background:var(--ink);transform-origin:0 50%}
        .ac-track{display:flex;gap:20px;padding:0 var(--gutter);will-change:transform}
        .ac-card{flex:0 0 clamp(340px,40vw,540px);height:clamp(260px,36vh,310px);border-radius:28px;padding:24px;display:flex;flex-direction:column;justify-content:space-between;transition:transform .7s var(--ease),box-shadow .7s var(--ease)}
        .ac-card.is-center{transform:translateY(-12px);box-shadow:inset 0 0 0 1px var(--line),0 40px 80px -30px rgba(26,20,70,.28)}
        .ac-top{display:flex;justify-content:space-between;align-items:flex-start}
        .ac-logo{width:72px;height:72px;border-radius:20px;display:grid;place-items:center;background:#fff;box-shadow:inset 0 0 0 1px var(--line),0 10px 40px -10px color-mix(in srgb,var(--g) 30%,transparent);transition:box-shadow .7s var(--ease)}
        .is-center .ac-logo{box-shadow:inset 0 0 0 1px var(--line),0 12px 50px -6px color-mix(in srgb,var(--g) 55%,transparent)}
        .ac-idx{font-size:12px;color:var(--mute)}
        .ac-bottom{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
        .ac-bottom h3{margin:0;font-size:20px;letter-spacing:-.02em}.ac-bottom p{margin:4px 0 0;color:var(--ink-2);font-size:14px}
        .ac-detail{font-size:11px!important;color:var(--mute)!important}
        .ac-num{font-size:clamp(56px,6vw,96px);font-weight:700;letter-spacing:-.05em;line-height:.9}
        .ac-end{flex:0 0 auto;align-self:center;padding:0 80px 0 20px;font-family:var(--font-serif);font-style:italic;font-size:40px;color:var(--mute);white-space:nowrap}
      `}</style>
    </section>
  );
}

function CountUp({ value, suffix = "", start }: { value: number; suffix?: string; start: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(value);
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 1400);
      setN(Math.round(value * (1 - Math.pow(1 - t, 4))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value]);
  return <span className="ac-num" aria-label={`${value}${suffix}`}>{n}{suffix}</span>;
}
