import { PROFILE } from "@/lib/data";
import CopyEmail from "../ui/CopyEmail";
import HopHeading from "../ui/HopHeading";
import ScrollLink from "../ui/ScrollLink";

export default function Contact({ index }: { index: string }) {
  const year = new Date().getFullYear();
  return (
    <>
      <section id="contact" className="section ct" aria-labelledby="contact-title">
        <div className="wrap">
          <p className="tag rv">
            <b>{index}</b> — Contact
          </p>
          <HopHeading id="contact-title" lines={["Let's build", "something"]} accent="together." />

          <div className="ct-grid">
            <div className="ct-main rv">
              <p className="ct-lbl mono">Email</p>
              <div className="ct-email-row">
                <a className="ct-email" href={`mailto:${PROFILE.email}`}>
                  {PROFILE.email}
                </a>
                <CopyEmail email={PROFILE.email} />
              </div>
              <ul className="ct-links">
                <li>
                  <span className="mono">Phone</span>
                  <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
                </li>
                {PROFILE.github && (
                  <li>
                    <span className="mono">GitHub</span>
                    <a href={PROFILE.github} target="_blank" rel="noreferrer">
                      {PROFILE.github.replace(/^https?:\/\//, "")} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                )}
                <li>
                  <span className="mono">LinkedIn</span>
                  <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                    {PROFILE.linkedinLabel} <span aria-hidden="true">↗</span>
                  </a>
                </li>
                <li>
                  <span className="mono">Based in</span>
                  <span>{PROFILE.location}</span>
                </li>
              </ul>
            </div>

            <a className="ct-badge" href={`mailto:${PROFILE.email}`} aria-label={`Say hello — email ${PROFILE.name}`}>
              <svg viewBox="0 0 200 200" aria-hidden="true">
                <defs>
                  <path id="ct-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                </defs>
                <text>
                  <textPath href="#ct-circle" startOffset="0" textLength="486" lengthAdjust="spacing">
                    SAY HELLO · SAY HELLO · SAY HELLO ·
                  </textPath>
                </text>
              </svg>
              <span className="ct-badge-core" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="ft">
        <div className="wrap ft-in">
          <p>
            © {year} {PROFILE.name}
          </p>
          <ScrollLink to="top" className="ft-top">
            Back to top <span aria-hidden="true">↑</span>
          </ScrollLink>
          <p className="mono ft-built">Built with Next.js</p>
        </div>
      </footer>

      <style>{`
        .ct{padding-bottom:clamp(64px,10vh,120px)}
        .ct-grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end;margin-top:clamp(40px,6vw,80px)}
        .ct-lbl{margin:0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
        .ct-email-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px;margin-top:10px}
        .ct-email{font-size:clamp(22px,3.6vw,52px);font-weight:600;letter-spacing:-.035em;line-height:1.1;overflow-wrap:anywhere;
          background:linear-gradient(var(--ink),var(--ink)) 0 100%/100% 2px no-repeat;padding-bottom:4px;transition:background-size .7s var(--ease)}
        .ct-email:hover{background-size:0 2px;background-position:100% 100%}
        .ct-links{list-style:none;margin:36px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0 32px}
        .ct-links li{display:flex;flex-direction:column;gap:4px;padding:14px 0;border-top:1px solid var(--line)}
        .ct-links .mono{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
        .ct-links a{font-weight:500;width:fit-content;max-width:100%;overflow-wrap:anywhere}
        .ct-links a:hover{text-decoration:underline;text-underline-offset:4px}
        .ct-badge{position:relative;display:grid;place-items:center;width:clamp(130px,14vw,180px);aspect-ratio:1;border-radius:50%}
        .ct-badge svg{position:absolute;inset:0;width:100%;height:100%;animation:spin 18s linear infinite}
        .ct-badge text{font-family:var(--font-mono);font-size:15.5px;letter-spacing:.2em;fill:var(--ink)}
        .ct-badge-core{display:grid;place-items:center;width:44%;height:44%;border-radius:50%;background:var(--ink);color:#fff;font-size:22px;transition:transform .6s var(--ease)}
        .ct-badge:hover .ct-badge-core{transform:scale(1.1) rotate(45deg)}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ft{border-top:1px solid var(--line)}
        .ft-in{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 24px;padding-block:28px;font-size:14px;color:var(--mute)}
        .ft-in p{margin:0}
        .ft-top{color:var(--ink);font-weight:500}
        .ft-top:hover{text-decoration:underline;text-underline-offset:4px}
        .ft-built{font-size:12px}
        @media (max-width:720px){.ct-grid{grid-template-columns:minmax(0,1fr)}.ct-badge{justify-self:end}}
      `}</style>
    </>
  );
}
