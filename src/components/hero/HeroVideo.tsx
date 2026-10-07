"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";

/**
 * Looping intro video.
 * - tries to play with sound; falls back to muted if the browser blocks it
 * - unlocks sound on the first pointerdown / keydown / touchend
 * - pauses when < 35% of the hero is visible, resumes when back
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const userMuted = useRef(false);
  const visible = useRef(true);

  const safePlay = useCallback(() => {
    const v = ref.current;
    if (!v || !visible.current || document.hidden) return;
    v.play().catch(() => {
      // sound blocked → play muted
      if (!v.muted) {
        v.muted = true;
        setSoundOn(false);
        setBlocked(true);
        v.play().catch(() => {});
      }
    });
  }, []);

  /* initial attempt: with sound */
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.play()
      .then(() => setSoundOn(true))
      .catch(() => {
        v.muted = true;
        setBlocked(true);
        v.play().catch(() => {});
      });
  }, []);

  /* unlock sound on first interaction */
  useEffect(() => {
    if (!blocked) return;
    const unlock = (e: Event) => {
      if (btnRef.current && e.target instanceof Node && btnRef.current.contains(e.target)) return;
      if (userMuted.current) return;
      const v = ref.current;
      if (!v) return;
      v.muted = false;
      setSoundOn(true);
      setBlocked(false);
      if (visible.current) v.play().catch(() => {});
    };
    const opts = { once: true, passive: true } as const;
    window.addEventListener("pointerdown", unlock, opts);
    window.addEventListener("keydown", unlock, opts);
    window.addEventListener("touchend", unlock, opts);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchend", unlock);
    };
  }, [blocked]);

  /* pause outside the hero */
  useEffect(() => {
    const hero = document.getElementById("hero");
    const v = ref.current;
    if (!hero || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35;
        if (visible.current) safePlay();
        else v.pause();
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(hero);
    const onVis = () => (document.hidden ? v.pause() : safePlay());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [safePlay]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (soundOn) {
      v.muted = true;
      userMuted.current = true;
      setSoundOn(false);
    } else {
      v.muted = false;
      userMuted.current = false;
      setSoundOn(true);
      setBlocked(false);
      v.play().catch(() => {});
    }
  };

  return (
    <>
      <video
        ref={ref}
        className="hero-video"
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero/hero-poster.webp"
        width={768}
        height={960}
        aria-label={`Intro video: ${PROFILE.name}, ${PROFILE.role}, introducing himself`}
      >
        <source src="/hero/hero.webm" type="video/webm" />
        <source src="/hero/hero.mp4" type="video/mp4" />
      </video>

      <button
        ref={btnRef}
        type="button"
        className={`hero-sound ${blocked ? "is-blocked" : ""}`}
        onClick={toggle}
        aria-label={soundOn ? "Mute intro voice" : "Play intro voice with sound"}
        aria-pressed={soundOn}
      >
        {soundOn ? (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="3" y="2" width="3.4" height="12" rx="1" fill="currentColor" />
            <rect x="9.6" y="2" width="3.4" height="12" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 2.2v11.6c0 .6.7 1 1.2.7l9-5.8a.8.8 0 0 0 0-1.4l-9-5.8C4.7 1.2 4 1.6 4 2.2z" fill="currentColor" />
          </svg>
        )}
      </button>

      <style>{`
        .hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;
          animation:vidIn 1.6s var(--ease) both .1s}
        @keyframes vidIn{from{opacity:0;transform:translateY(24px) scale(.98)}to{opacity:1;transform:none}}
        .hero-sound{position:absolute;left:4%;bottom:9%;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;
          background:var(--ink);color:#fff;transition:transform .4s var(--ease),background-color .4s var(--ease);z-index:2}
        .hero-sound:hover{transform:scale(1.07);background:#2A2160}
        .hero-sound.is-blocked::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(26,20,70,.35);animation:ping 1.8s var(--ease) infinite}
        @keyframes ping{0%{box-shadow:0 0 0 0 rgba(26,20,70,.35)}80%,100%{box-shadow:0 0 0 16px rgba(26,20,70,0)}}
        @media (max-width:720px){.hero-sound{left:auto;right:2%;bottom:6%}}
      `}</style>
    </>
  );
}
