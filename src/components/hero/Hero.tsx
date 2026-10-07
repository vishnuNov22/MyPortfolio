import { PROFILE } from "@/lib/data";
import HeroVideo from "./HeroVideo";
import ScrollLink from "../ui/ScrollLink";

export default function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </div>

      <div className="hero-grid wrap">
        <div className="hero-copy">
          <p className="tag hero-in" style={{ "--d": 1 } as React.CSSProperties}>
            <b>{PROFILE.name}</b> — {PROFILE.location}
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-line" style={{ "--d": 2 } as React.CSSProperties}>
              <span>Generative AI</span>
            </span>
            <span className="hero-line" style={{ "--d": 3 } as React.CSSProperties}>
              <span>
                <span className="it">Engineer.</span>
              </span>
            </span>
          </h1>
        </div>

        <div className="hero-media">
          <HeroVideo />
        </div>

        <div className="hero-side">
          <p className="hero-lede hero-in" style={{ "--d": 4 } as React.CSSProperties}>
            {PROFILE.experience} designing, developing and deploying LLM-powered applications — chatbots, document
            Q&amp;A and enterprise knowledge assistants built on RAG.
          </p>
          <div className="hero-cta hero-in" style={{ "--d": 5 } as React.CSSProperties}>
            <ScrollLink to="work" className="btn btn-primary">
              Explore work
            </ScrollLink>
            <ScrollLink to="contact" className="btn btn-ghost">
              Let&apos;s talk
            </ScrollLink>
            <a href={PROFILE.resume} download className="btn btn-ghost">
              Résumé <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .hero{position:relative;min-height:100svh;display:flex;align-items:flex-end;overflow:hidden}
        .hero-ghost{position:absolute;left:50%;top:50%;transform:translate(-50%,-46%);font-weight:800;letter-spacing:-.06em;line-height:.8;
          font-size:clamp(120px,27vw,440px);color:transparent;-webkit-text-stroke:1.2px rgba(26,20,70,.09);white-space:nowrap;pointer-events:none;user-select:none;
          animation:ghostIn 1.8s var(--ease) both}
        @keyframes ghostIn{from{opacity:0;transform:translate(-50%,-40%)}to{opacity:1;transform:translate(-50%,-46%)}}
        .hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:end;gap:clamp(16px,2.5vw,40px)}
        .hero-media{position:relative;height:min(96svh,1040px);aspect-ratio:768/960;max-width:56vw}
        .hero-copy{align-self:end;padding-bottom:clamp(40px,10vh,120px);container-type:inline-size;min-width:0}
        .hero-title{margin:18px 0 0;font-size:clamp(36px,19cqw,92px);font-weight:700;letter-spacing:-.045em;line-height:.98}
        .hero-line{display:block;overflow:hidden;padding-bottom:.06em}
        .hero-line>span{display:block;animation:lineUp 1.2s var(--ease) both;animation-delay:calc(var(--d)*110ms + 150ms)}
        .hero-title .it{font-size:1.08em}
        @keyframes lineUp{from{transform:translateY(105%)}to{transform:none}}
        .hero-in{animation:fadeUp 1s var(--ease) both;animation-delay:calc(var(--d)*110ms + 150ms)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        .hero-side{align-self:end;padding-bottom:clamp(40px,10vh,120px)}
        .hero-lede{margin:0;max-width:34ch;color:var(--ink-2);font-size:clamp(15px,1.15vw,17px)}
        .hero-cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
        @media (max-width:1100px){
          .hero-grid{grid-template-columns:minmax(0,1fr) auto}
          .hero-copy{grid-column:1;grid-row:1}
          .hero-media{grid-column:2;grid-row:1 / span 2;max-width:52vw}
          .hero-side{grid-column:1;grid-row:2;padding-bottom:clamp(40px,8vh,80px)}
          .hero-copy{padding-bottom:0;align-self:end}
        }
        @media (max-width:720px){
          .hero{align-items:flex-start;padding-top:76px;min-height:auto;padding-bottom:56px}
          .hero-grid{grid-template-columns:minmax(0,1fr);gap:0}
          .hero-media{grid-column:1;grid-row:1;height:62svh;max-width:100%;margin:0 auto;justify-self:center}
          .hero-copy{grid-row:2;padding:8px 0 0;text-align:left}
          .hero-side{grid-row:3;padding:14px 0 0}
          .hero-ghost{top:31svh;font-size:24vw}
          .hero-title{font-size:clamp(40px,12vw,60px)}
          .hero-copy{container-type:normal}
        }
      `}</style>
    </section>
  );
}
