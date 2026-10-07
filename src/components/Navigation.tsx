"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  /* scroll state + progress bar (rAF-throttled) */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* active section */
  useEffect(() => {
    const ids = ["hero", ...NAV.map((n) => n.id)];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id === "hero" ? null : e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* sliding indicator */
  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list || !active) return setPill(null);
    const a = list.querySelector<HTMLAnchorElement>(`a[data-id="${active}"]`);
    if (!a) return setPill(null);
    setPill({ x: a.offsetLeft, w: a.offsetWidth });
  }, [active]);
  useIsoLayoutEffect(() => {
    measure();
  }, [measure, scrolled]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /* mobile menu: Esc + scroll lock */
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      menuBtn.current?.focus();
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // let the overlay release the scroll lock before scrolling
    requestAnimationFrame(() => scrollToTarget(id));
  };

  return (
    <>
      <div className="nav-progress" aria-hidden="true">
        <div ref={barRef} />
      </div>
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#hero" className="nav-brand" onClick={go("top")} aria-label={`${PROFILE.name} — back to top`}>
          <span className="nav-mark mono">{PROFILE.initials}</span>
          <span className="nav-name">{PROFILE.name}</span>
        </a>

        <nav aria-label="Primary" className="nav-desk">
          <ul ref={listRef} className="nav-pill">
            <li
              aria-hidden="true"
              className="nav-ind"
              style={pill ? { transform: `translateX(${pill.x}px)`, width: pill.w, opacity: 1 } : { opacity: 0 }}
            />
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  data-id={n.id}
                  className={active === n.id ? "is-active" : ""}
                  aria-current={active === n.id ? "true" : undefined}
                  onClick={go(n.id)}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuBtn}
          className="nav-menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div
        id="mobile-menu"
        className={`nav-overlay ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        data-lenis-prevent
      >
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
              <a href={`#${n.id}`} onClick={go(n.id)} tabIndex={open ? 0 : -1}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ol>
        <p className="nav-overlay-foot mono">
          <a href={`mailto:${PROFILE.email}`} tabIndex={open ? 0 : -1}>{PROFILE.email}</a>
        </p>
      </div>

      <style>{`
        .nav-progress{position:fixed;inset:0 0 auto 0;height:2px;z-index:60;pointer-events:none}
        .nav-progress>div{height:100%;background:var(--grad);box-shadow:0 0 12px rgba(236,72,153,.6);transform-origin:0 50%;transform:scaleX(0)}
        .nav{position:fixed;z-index:50;top:14px;left:50%;transform:translateX(-50%);width:calc(100% - var(--gutter)*2);max-width:var(--maxw);
          display:flex;align-items:center;justify-content:space-between;gap:16px;padding:8px;border-radius:999px;
          transition:background-color .6s var(--ease),box-shadow .6s var(--ease),backdrop-filter .6s var(--ease)}
        .nav.is-scrolled{background:rgba(255,255,255,.62);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -18px rgba(26,20,70,.25)}
        .nav-brand{display:flex;align-items:center;gap:12px;border-radius:999px}
        .nav-mark{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;font-size:11px;font-weight:600;letter-spacing:.02em;
          box-shadow:inset 0 0 0 1.5px var(--ink);transition:background-color .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
        .nav.is-scrolled .nav-mark{background:var(--ink);color:#fff}
        .nav-brand:hover .nav-mark{transform:rotate(360deg)}
        .nav-name{font-weight:600;letter-spacing:-.02em;transition:opacity .5s var(--ease),transform .5s var(--ease)}
        .nav.is-scrolled .nav-name{opacity:0;transform:translateX(-6px);pointer-events:none}
        .nav-pill{position:relative;display:flex;list-style:none;margin:0;padding:4px;border-radius:999px;background:rgba(255,255,255,.7);box-shadow:inset 0 0 0 1px var(--line)}
        .nav.is-scrolled .nav-pill{background:transparent;box-shadow:none}
        .nav-pill a{position:relative;z-index:1;display:block;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:500;color:var(--ink-2);transition:color .45s var(--ease)}
        .nav-pill a:hover{color:var(--ink)}
        .nav-pill a.is-active{color:#fff}
        .nav-ind{position:absolute;top:4px;bottom:4px;left:0;border-radius:999px;background:var(--ink);transition:transform .6s var(--ease),width .6s var(--ease),opacity .4s}
        .nav-menu-btn{display:none;height:42px;padding:0 20px;border-radius:999px;background:var(--ink);color:#fff;font-size:14px;font-weight:500;position:relative;z-index:70}
        .nav-overlay{position:fixed;inset:0;z-index:45;background:var(--paper);display:flex;flex-direction:column;justify-content:center;padding:96px var(--gutter) 40px;
          clip-path:circle(0% at calc(100% - 60px) 36px);transition:clip-path .8s var(--ease);overflow:auto}
        .nav-overlay[hidden]{display:flex;visibility:hidden}
        .nav-overlay.is-open{clip-path:circle(150% at calc(100% - 60px) 36px);visibility:visible}
        .nav-overlay ol{list-style:none;margin:0;padding:0}
        .nav-overlay li{overflow:hidden;border-bottom:1px solid var(--line)}
        .nav-overlay li a{display:flex;align-items:baseline;gap:16px;padding:14px 0;font-size:clamp(40px,12vw,72px);font-weight:700;letter-spacing:-.045em;line-height:1;
          transform:translateY(110%);transition:transform .8s var(--ease);transition-delay:calc(var(--i)*60ms + 150ms)}
        .nav-overlay li a .mono{font-size:12px;font-weight:400;letter-spacing:0;color:var(--mute)}
        .nav-overlay.is-open li a{transform:none}
        .nav-overlay-foot{margin-top:32px;font-size:13px;color:var(--mute)}
        @media (max-width:860px){
          .nav-desk{display:none}
          .nav-menu-btn{display:block}
        }
      `}</style>
    </>
  );
}
