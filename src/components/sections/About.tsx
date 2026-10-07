import { PROFILE } from "@/lib/data";
import IdCard from "../ui/IdCard";

export default function About({ index }: { index: string }) {
  const facts: [string, React.ReactNode][] = [
    ["Location", PROFILE.location],
    ["Education", "Bachelor of Engineering — Anna University, 2020"],
    ["Current role", `${PROFILE.role}, HCL Tech`],
    ["Experience", PROFILE.experience],
    ["Email", <a key="e" href={`mailto:${PROFILE.email}`} className="ab-link">{PROFILE.email}</a>],
    ["Languages", PROFILE.languages.map((l) => l.name).join(" · ")],
  ];

  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="wrap ab-grid">
        <div className="ab-left">
          <p className="tag rv">
            <b>{index}</b> — About
          </p>
          <h2 id="about-title" className="h-sec ab-title">
            <span className="rv-mask">
              <span>
                Hi, I&apos;m <span className="it">{PROFILE.firstName}.</span>
              </span>
            </span>
          </h2>
          <p className="ab-summary rv" style={{ "--i": 1 } as React.CSSProperties}>{PROFILE.resumeSummary}</p>
          <p className="ab-extra rv" style={{ "--i": 2 } as React.CSSProperties}>{PROFILE.summaryExtra}</p>
          <div className="ab-btns rv" style={{ "--i": 3 } as React.CSSProperties}>
            <a className="btn btn-primary" href={PROFILE.resume} download>
              Résumé <span aria-hidden="true">↓</span>
            </a>
            {PROFILE.github && (
              <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            )}
            <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="ab-center">
          <IdCard />
        </div>

        <aside className="ab-right" aria-label="Quick facts">
          <p className="tag rv">Quick facts</p>
          <dl className="ab-facts">
            {facts.map(([k, v], i) => (
              <div key={k} className="rv" style={{ "--i": i } as React.CSSProperties}>
                <dt className="mono">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <blockquote className="ab-quote rv" style={{ "--i": 6 } as React.CSSProperties}>
            <p>
              <span aria-hidden="true">“</span>
              {PROFILE.quote}
              <span aria-hidden="true">”</span>
            </p>
          </blockquote>
        </aside>
      </div>

      <style>{`
        .about{padding-top:0}
        .ab-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,3vw,56px);align-items:stretch}
        .ab-left,.ab-right{padding-top:var(--section-y);display:flex;flex-direction:column}
        .ab-title{font-size:clamp(44px,5vw,76px)}
        .ab-summary{margin:28px 0 0;font-size:clamp(17px,1.3vw,20px);line-height:1.5;color:var(--ink);letter-spacing:-.01em}
        .ab-extra{margin:16px 0 0;color:var(--mute)}
        .ab-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto;padding-top:32px}
        .ab-center{position:relative;min-height:640px}
        .ab-facts{margin:18px 0 0;padding:0}
        .ab-facts>div{display:grid;grid-template-columns:110px minmax(0,1fr);gap:12px;padding:14px 0;border-top:1px solid var(--line)}
        .ab-facts>div:last-child{border-bottom:1px solid var(--line)}
        .ab-facts dt{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);padding-top:3px}
        .ab-facts dd{margin:0;font-size:15px;overflow-wrap:anywhere}
        .ab-link{background:linear-gradient(currentColor,currentColor) 0 100%/100% 1px no-repeat;transition:background-size .5s var(--ease)}
        .ab-link:hover{background-size:0 1px;background-position:100% 100%}
        .ab-quote{margin:auto 0 0;padding-top:32px}
        .ab-quote p{margin:0;font-family:var(--font-serif);font-style:italic;font-size:clamp(22px,1.9vw,28px);line-height:1.2;letter-spacing:-.01em;color:var(--ink-2)}
        @media (max-width:1100px){
          .ab-grid{grid-template-columns:minmax(0,1fr) 320px}
          .ab-right{grid-column:1 / -1;padding-top:24px}
          .ab-quote{margin-top:8px}
        }
        @media (max-width:720px){
          .ab-grid{grid-template-columns:minmax(0,1fr)}
          .ab-center{order:-1;min-height:560px}
          .ab-left{padding-top:24px}
        }
      `}</style>
    </section>
  );
}
