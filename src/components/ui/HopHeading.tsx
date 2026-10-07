"use client";

import { Fragment } from "react";

/** Huge heading where each letter hops when the pointer passes over it. */
export default function HopHeading({ id, lines, accent }: { id: string; lines: string[]; accent: string }) {
  const onOver = (e: React.PointerEvent<HTMLHeadingElement>) => {
    const t = e.target as HTMLElement;
    if (!t.classList.contains("hop-l") || t.classList.contains("is-hop")) return;
    t.classList.add("is-hop");
    t.addEventListener("animationend", () => t.classList.remove("is-hop"), { once: true });
  };

  // letters are grouped per word so lines only break between words
  const letters = (text: string, italic = false) =>
    text.split(" ").map((word, w) => (
      <Fragment key={w}>
        {w > 0 && " "}
        <span className="hop-w">
          {Array.from(word).map((ch, i) => (
            <span key={i} className={`hop-l ${italic ? "it" : ""}`}>
              {ch}
            </span>
          ))}
        </span>
      </Fragment>
    ));

  const label = `${lines.join(" ")} ${accent}`;

  return (
    <h2 id={id} className="hop" onPointerOver={onOver} aria-label={label}>
      {lines.map((l, i) => (
        <span key={l} className="rv-mask" style={{ "--i": i } as React.CSSProperties} aria-hidden="true">
          <span>
            {letters(l)}
            {i === lines.length - 1 && (
              <>
                {" "}
                {letters(accent, true)}
              </>
            )}
          </span>
        </span>
      ))}
      <style>{`
        .hop{margin:18px 0 0;font-size:clamp(46px,9.6vw,160px);font-weight:700;letter-spacing:-.05em;line-height:.95}
        .hop-w{white-space:nowrap}
        .hop-l{display:inline-block;will-change:transform}
        .hop-l.it{padding-right:.02em}
        .hop-l.is-hop{animation:hop .6s var(--ease)}
        @keyframes hop{0%{transform:none}35%{transform:translateY(-.16em)}65%{transform:translateY(.03em)}100%{transform:none}}
      `}</style>
    </h2>
  );
}
