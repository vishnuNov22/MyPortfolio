"use client";

import { useEffect, useState, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True once (or while, if `once` is false) the element intersects the viewport. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { threshold = 0.2, rootMargin = "0px", once = true }: { threshold?: number; rootMargin?: string; once?: boolean } = {},
): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, once]);
  return inView;
}

/**
 * Progress (0 → 1) of an element scrolling through the viewport.
 * 0 when its top reaches `startAt` × viewport height, 1 when its bottom reaches `endAt` × viewport height.
 * Only runs a rAF loop while the element is near the viewport.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { startAt = 0.75, endAt = 0.5 }: { startAt?: number; endAt?: number } = {},
): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let visible = false;
    let last = -1;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * startAt;
      const total = r.height + start - vh * endAt;
      const p = Math.min(1, Math.max(0, (start - r.top) / Math.max(total, 1)));
      if (Math.abs(p - last) > 0.0005) {
        last = p;
        setProgress(p);
      }
      if (visible) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
      else tick();
    }, { rootMargin: "20% 0px 20% 0px" });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref, startAt, endAt]);
  return progress;
}
