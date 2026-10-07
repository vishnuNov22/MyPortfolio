"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

let lenis: Lenis | null = null;

/** Header height to keep clear when jumping to a section. */
const OFFSET = 0;

/** Smoothly scroll to an element id (or "top"). Falls back to native scrolling. */
export function scrollToTarget(target: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (target === "top") {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    return;
  }
  const el = document.getElementById(target);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: OFFSET, duration: 1.4 });
  else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  // move focus for keyboard / screen-reader users without a second jump
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const start = () => {
      if (mq.matches || lenis) return;
      lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
    start();
    const onChange = () => (mq.matches ? stop() : start());
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      stop();
    };
  }, []);
  return <>{children}</>;
}
