"use client";

import { useEffect, useRef, useState } from "react";
import { ID_BACK, PROFILE } from "@/lib/data";

/* deterministic barcode from the name */
const BARS = (() => {
  const out: { x: number; w: number }[] = [];
  let x = 0;
  for (const ch of `${PROFILE.name}${PROFILE.role}`.toUpperCase()) {
    const c = ch.charCodeAt(0);
    const w = 1 + (c % 3);
    out.push({ x, w });
    x += w + 1 + ((c >> 2) % 3);
  }
  return { bars: out, width: x };
})();

/**
 * Lanyard ID card.
 * Damped pendulum: pointer velocity → angular impulse; spring + damping bring it back; idle sway when quiet.
 * Flip: hover (mouse), tap (touch/pen), Enter/Space (keyboard).
 */
export default function IdCard() {
  const rigRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const lastPointer = useRef<string>("mouse");

  useEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let theta = 0; // deg
    let omega = 0; // deg / s
    let lastX: number | null = null;
    let lastT = 0;
    let lastMove = 0;
    let raf = 0;
    let running = false;
    let prev = performance.now();

    const K = 38; // spring stiffness
    const C = 3.2; // damping

    const step = (now: number) => {
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      const idle = now - lastMove > 1600;
      const target = idle ? Math.sin(now / 1100) * 1.6 : 0;
      const alpha = -K * (theta - target) - C * omega;
      omega += alpha * dt;
      theta += omega * dt;
      theta = Math.max(-18, Math.min(18, theta));
      rig.style.transform = `rotate(${theta.toFixed(3)}deg)`;
      if (running) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null && now - lastT < 100) {
        const vx = (e.clientX - lastX) / Math.max(1, now - lastT); // px/ms
        // only react when the pointer is reasonably near the card
        const r = rig.getBoundingClientRect();
        const near = Math.abs(e.clientY - (r.top + r.height / 2)) < r.height && Math.abs(e.clientX - (r.left + r.width / 2)) < r.width * 1.6;
        if (near) omega = Math.max(-140, Math.min(140, omega + Math.max(-14, Math.min(14, vx * 7))));
      }
      lastX = e.clientX;
      lastT = now;
      lastMove = now;
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        prev = performance.now();
        raf = requestAnimationFrame(step);
        window.addEventListener("pointermove", onMove, { passive: true });
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
      }
    });
    io.observe(rig);
    return () => {
      running = false;
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="idc-hang">
      <div ref={rigRef} className="idc-rig">
        <div className="idc-strap" aria-hidden="true">
          <div className="idc-strap-text mono">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i}>
                {PROFILE.name.toUpperCase()} · {PROFILE.role.toUpperCase()} ·{" "}
              </span>
            ))}
          </div>
        </div>
        <div className="idc-clip" aria-hidden="true">
          <span />
        </div>

        <div
          className={`idc-card ${flipped ? "is-flipped" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={`Developer ID card for ${PROFILE.name}. ${flipped ? "Showing back" : "Showing front"} — press to flip`}
          onPointerDown={(e) => (lastPointer.current = e.pointerType)}
          onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
          onClick={() => {
            if (lastPointer.current !== "mouse") setFlipped((f) => !f);
            lastPointer.current = "mouse";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
        >
          <div className="idc-inner">
            {/* FRONT */}
            <div className="idc-face idc-front" aria-hidden={flipped}>
              <div className="idc-band mono">
                <span>DEVELOPER ID</span>
                <span className="idc-dot" />
              </div>
              <div className="idc-photo">
                <span className="idc-halo" />
                <span className="idc-ring">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={128} height={156} loading="lazy" decoding="async" />
                </span>
              </div>
              <p className="idc-name">{PROFILE.name}</p>
              <p className="idc-role mono">{PROFILE.role}</p>
              <dl className="idc-rows mono">
                <div><dt>Dept.</dt><dd>Generative AI</dd></div>
                <div><dt>Exp.</dt><dd>{PROFILE.experience}</dd></div>
                <div><dt>Base</dt><dd>Bengaluru</dd></div>
                <div><dt>Grad.</dt><dd>2020</dd></div>
              </dl>
              <div className="idc-foot">
                <svg className="idc-barcode" viewBox={`0 0 ${BARS.width} 30`} preserveAspectRatio="none" aria-hidden="true">
                  {BARS.bars.map((b, i) => (
                    <rect key={i} x={b.x} y="0" width={b.w} height="30" fill="#1a1a1a" />
                  ))}
                </svg>
                <span className="idc-holo" aria-hidden="true" />
              </div>
            </div>

            {/* BACK */}
            <div className="idc-face idc-back" aria-hidden={!flipped}>
              <div className="idc-band mono">
                <span>WHAT I AM</span>
                <span className="idc-dot" />
              </div>
              <ul className="idc-list">
                {ID_BACK.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <div className="idc-sign">
                <span className="idc-sig">{PROFILE.name}</span>
                <span className="idc-sigline mono">Signature</span>
              </div>
              <p className="idc-found mono">
                If found, say hello · <span>{PROFILE.email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .idc-hang{position:relative;height:100%;display:flex;justify-content:center}
        .idc-rig{position:relative;display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;will-change:transform}
        .idc-strap{width:30px;height:calc(var(--section-y) + 56px);background:#1b1b1b;overflow:hidden;position:relative;
          box-shadow:inset 3px 0 0 rgba(255,255,255,.06),inset -3px 0 0 rgba(0,0,0,.25)}
        .idc-strap::before,.idc-strap::after{content:"";position:absolute;left:3px;right:3px;top:0;bottom:0;border-left:1px dashed rgba(255,255,255,.18);border-right:1px dashed rgba(255,255,255,.18);pointer-events:none}
        .idc-strap-text{position:absolute;left:50%;top:0;writing-mode:vertical-rl;transform:translateX(-50%);font-size:9px;letter-spacing:.24em;color:rgba(255,255,255,.72);white-space:nowrap;
          animation:strapScroll 18s linear infinite}
        @keyframes strapScroll{from{transform:translate(-50%,0)}to{transform:translate(-50%,-50%)}}
        .idc-clip{position:relative;width:44px;height:30px;margin-top:-2px;border-radius:6px 6px 10px 10px;
          background:linear-gradient(180deg,#e9e9e9,#a8a8a8 45%,#d6d6d6 60%,#8c8c8c);box-shadow:0 2px 4px rgba(0,0,0,.25),inset 0 1px 0 #fff}
        .idc-clip span{position:absolute;left:50%;bottom:-10px;width:14px;height:16px;transform:translateX(-50%);border-radius:0 0 7px 7px;border:3px solid #9a9a9a;border-top:0}
        .idc-card{position:relative;margin-top:8px;width:300px;height:404px;perspective:1400px;cursor:pointer;border-radius:22px;outline-offset:6px}
        .idc-inner{position:absolute;inset:0;transform-style:preserve-3d;transition:transform 1s var(--ease)}
        .idc-card.is-flipped .idc-inner{transform:rotateY(180deg)}
        .idc-face{position:absolute;inset:0;border-radius:22px;background:#fff;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;
          box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -30px rgba(13,13,13,.35),0 10px 20px -12px rgba(13,13,13,.2);display:flex;flex-direction:column;align-items:center}
        .idc-face::before{content:"";position:absolute;top:10px;left:50%;width:46px;height:8px;margin-left:-23px;border-radius:8px;background:var(--paper);box-shadow:inset 0 1px 2px rgba(0,0,0,.18);z-index:2}
        .idc-back{transform:rotateY(180deg);align-items:stretch}
        .idc-band{width:100%;height:58px;background:var(--ink);color:#fff;display:flex;align-items:flex-end;justify-content:space-between;padding:0 18px 11px;font-size:11px;letter-spacing:.22em}
        .idc-dot{width:8px;height:8px;border-radius:50%;background:#fff;opacity:.85;animation:blink 2.4s ease-in-out infinite}
        @keyframes blink{50%{opacity:.25}}
        .idc-photo{position:relative;margin-top:18px;width:128px;height:156px}
        .idc-halo{position:absolute;inset:-18px;border-radius:30px;background:radial-gradient(closest-side,rgba(13,13,13,.12),transparent);filter:blur(6px)}
        .idc-ring{position:relative;display:block;width:100%;height:100%;padding:3px;border-radius:18px;background:linear-gradient(145deg,#d9d9d9,#7a7a7a 50%,#cfcfcf);overflow:hidden}
        .idc-ring img{width:100%;height:100%;object-fit:cover;border-radius:15px;filter:grayscale(1) contrast(1.04);transition:transform .9s var(--ease),filter .9s var(--ease);background:#fff}
        .idc-card:hover .idc-ring img,.idc-card:focus-visible .idc-ring img{transform:scale(1.07);filter:grayscale(0)}
        .idc-name{margin:14px 0 0;font-size:21px;font-weight:700;letter-spacing:-.03em;line-height:1}
        .idc-role{margin:6px 0 0;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
        .idc-rows{margin:12px 0 0;padding:0 22px;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;font-size:10.5px}
        .idc-rows div{display:flex;justify-content:space-between;gap:6px;border-bottom:1px dashed var(--line);padding-bottom:4px}
        .idc-rows dt{color:var(--faint)}
        .idc-rows dd{margin:0;color:var(--ink);text-align:right}
        .idc-foot{margin-top:auto;width:100%;padding:0 22px 18px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
        .idc-barcode{width:150px;height:30px}
        .idc-holo{width:40px;height:40px;border-radius:50%;background:conic-gradient(from 0deg,#f5f5f5,#9e9e9e,#e8e8e8,#6e6e6e,#f1f1f1,#b5b5b5,#f5f5f5);
          box-shadow:inset 0 0 0 1px rgba(0,0,0,.1);animation:holo 6s linear infinite;position:relative;overflow:hidden}
        .idc-holo::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.85) 50%,transparent 65%);animation:sheen 3.2s var(--ease) infinite}
        @keyframes holo{to{transform:rotate(360deg)}}
        @keyframes sheen{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
        .idc-list{list-style:none;margin:0;padding:18px 22px 0;display:grid;gap:9px}
        .idc-list li{position:relative;padding-left:16px;font-size:13px;line-height:1.35;color:var(--ink-2)}
        .idc-list li::before{content:"";position:absolute;left:0;top:.5em;width:7px;height:1.5px;background:var(--ink)}
        .idc-sign{margin-top:auto;padding:0 22px;display:flex;flex-direction:column}
        .idc-sig{font-family:var(--font-serif);font-style:italic;font-size:30px;line-height:1;transform:rotate(-4deg);transform-origin:0 100%;margin-left:6px}
        .idc-sigline{border-top:1px solid var(--ink);margin-top:4px;padding-top:4px;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--faint)}
        .idc-found{margin:12px 0 0;padding:12px 22px 18px;border-top:1px dashed var(--line);font-size:9.5px;color:var(--mute);overflow-wrap:anywhere}
        .idc-found span{color:var(--ink)}
        @media (max-width:720px){.idc-strap{height:72px}}
      `}</style>
    </div>
  );
}
