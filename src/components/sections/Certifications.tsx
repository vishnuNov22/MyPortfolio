import { CERTIFICATIONS } from "@/lib/data";
import SectionHead from "../ui/SectionHead";

/** Ink-flood index. Rendered only when CERTIFICATIONS has entries (the current résumé lists none). */
export default function Certifications({ index }: { index: string }) {
  if (!CERTIFICATIONS.length) return null;
  return (
    <section id="certifications" className="section ce" aria-labelledby="cert-title">
      <div className="wrap ce-grid">
        <div className="ce-head">
          <SectionHead index={index} label="Certifications" id="cert-title" title="Always" accent="learning." />
          <p className="ce-count mono rv">{String(CERTIFICATIONS.length).padStart(2, "0")} certifications</p>
        </div>
        <ol className="ce-list">
          {CERTIFICATIONS.map((c, i) => {
            const Inner = (
              <>
                <span className="ce-n mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="ce-t">{c.title}</span>
                <span className="ce-i">{c.issuer}</span>
                <span className="ce-arrow" aria-hidden="true">↗</span>
              </>
            );
            return (
              <li key={c.title} className="rv" style={{ "--i": i } as React.CSSProperties}>
                {c.href ? (
                  <a className="ce-row" href={c.href} target="_blank" rel="noreferrer">{Inner}</a>
                ) : (
                  <div className="ce-row" tabIndex={0}>{Inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <style>{`
        .ce{background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
        .ce-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:48px;align-items:start}
        .ce-head{position:sticky;top:120px}
        .ce-count{margin:18px 0 0;color:var(--mute);font-size:12px}
        .ce-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
        .ce-row{position:relative;display:grid;grid-template-columns:48px minmax(0,1fr) auto 24px;gap:16px;align-items:center;padding:22px 16px;border-bottom:1px solid var(--line);overflow:hidden;isolation:isolate;transition:color .5s var(--ease)}
        .ce-row::before{content:"";position:absolute;inset:0;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease);z-index:-1}
        .ce-row:hover,.ce-row:focus-visible{color:#fff}
        .ce-row:hover::before,.ce-row:focus-visible::before{transform:scaleX(1)}
        .ce-n{font-size:12px;opacity:.6}
        .ce-t{font-size:clamp(18px,1.6vw,24px);font-weight:600;letter-spacing:-.02em}
        .ce-i{font-size:14px;opacity:.7}
        .ce-arrow{opacity:0;transform:translateX(-10px);transition:opacity .5s var(--ease),transform .5s var(--ease)}
        .ce-row:hover .ce-arrow,.ce-row:focus-visible .ce-arrow{opacity:1;transform:none}
        @media (max-width:860px){.ce-grid{grid-template-columns:minmax(0,1fr)}.ce-head{position:relative;top:0}.ce-row{grid-template-columns:36px minmax(0,1fr) 20px}.ce-i{grid-column:2}}
      `}</style>
    </section>
  );
}
