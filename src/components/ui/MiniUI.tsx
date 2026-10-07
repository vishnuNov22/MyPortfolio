/**
 * Grayscale, illustrative mini-UIs that hint at what each product does.
 * They are NOT screenshots — no real data, numbers or names appear here.
 */

function Chrome({ title }: { title: string }) {
  return (
    <div className="mu-chrome">
      <span className="mu-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="mu-title mono">{title}</span>
    </div>
  );
}

const css = `
.mu{position:absolute;inset:0;padding:44px 20px 20px;display:flex;flex-direction:column;gap:12px;font-size:12px;color:var(--ink-2)}
.mu-chrome{position:absolute;top:0;left:0;right:0;height:36px;display:flex;align-items:center;gap:12px;padding:0 14px;border-bottom:1px solid var(--line);background:rgba(255,255,255,.7)}
.mu-dots{display:flex;gap:5px}.mu-dots i{width:8px;height:8px;border-radius:50%;background:#d4d1cb}
.mu-title{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.mu-card{background:#fff;border-radius:12px;box-shadow:inset 0 0 0 1px var(--line);padding:12px}
.mu-lbl{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint)}
.mu-sk{height:7px;border-radius:4px;background:linear-gradient(90deg,#ebe8e2 0%,#f6f4f0 50%,#ebe8e2 100%);background-size:200% 100%;animation:muShimmer 2.4s linear infinite}
@keyframes muShimmer{to{background-position:-200% 0}}
.mu-row{display:grid;grid-template-columns:14px 1fr 70px 58px;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.mu-row.is-flag{background:var(--ink);color:#fff;box-shadow:none}
.mu-row.is-flag .mu-sk{background:rgba(255,255,255,.25);animation:none}
.mu-ico{width:14px;height:14px;border-radius:4px;background:#d9d6d0}
.mu-row.is-flag .mu-ico{background:#fff}
.mu-risk{height:5px;border-radius:3px;background:#e4e1db;overflow:hidden}
.mu-risk b{display:block;height:100%;background:#8a8780;border-radius:3px}
.mu-row.is-flag .mu-risk{background:rgba(255,255,255,.2)}.mu-row.is-flag .mu-risk b{background:#fff}
.mu-pill{justify-self:end;font-family:var(--font-mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;padding:3px 7px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);color:var(--mute)}
.mu-row.is-flag .mu-pill{box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);color:#fff}
.mu-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.mu-chip{font-size:10.5px;padding:4px 9px;border-radius:999px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line)}
.mu-btn{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-size:11px;padding:6px 12px;border-radius:999px;background:var(--ink);color:#fff}
.mu-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.mu-step{position:relative;padding:10px 8px;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);text-align:center;font-size:11px}
.mu-step::after{content:"";position:absolute;left:8px;right:8px;bottom:5px;height:2px;border-radius:2px;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;animation:muStep 4.8s var(--ease) infinite;animation-delay:calc(var(--s)*1.2s)}
@keyframes muStep{0%{transform:scaleX(0)}20%,100%{transform:scaleX(1)}}
.mu-docs{display:flex;gap:8px}
.mu-doc{flex:1;min-width:0;height:84px;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);padding:10px;display:flex;flex-direction:column;gap:6px}
.mu-doc .mu-lbl{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mu-meter{height:6px;border-radius:3px;background:#e4e1db;overflow:hidden;margin-top:10px}
.mu-meter b{display:block;height:100%;width:72%;background:var(--ink);border-radius:3px;animation:muFill 3s var(--ease) infinite alternate}
@keyframes muFill{from{width:22%}to{width:78%}}
`;

export function FraudUI() {
  const rows = [38, 22, 86, 30, 16];
  return (
    <div className="mu" role="img" aria-label="Illustrative interface: a list of transactions with one flagged, and an AI-generated alert summary card">
      <Chrome title="Fraud alerts" />
      <div style={{ display: "grid", gap: 6 }}>
        {rows.map((w, i) => (
          <div key={i} className={`mu-row ${i === 2 ? "is-flag" : ""}`}>
            <span className="mu-ico" />
            <span className="mu-sk" style={{ width: `${60 + ((i * 13) % 30)}%` }} />
            <span className="mu-risk">
              <b style={{ width: `${w}%` }} />
            </span>
            <span className="mu-pill">{i === 2 ? "Flagged" : "Clear"}</span>
          </div>
        ))}
      </div>
      <div className="mu-card" style={{ marginTop: "auto" }}>
        <span className="mu-lbl">Alert summary · LLM</span>
        <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
          <span className="mu-sk" style={{ width: "92%" }} />
          <span className="mu-sk" style={{ width: "78%" }} />
          <span className="mu-sk" style={{ width: "64%" }} />
        </div>
        <div className="mu-chips">
          <span className="mu-chip">Similar past cases</span>
          <span className="mu-chip">Policy context</span>
        </div>
        <span className="mu-btn">Send to investigator →</span>
      </div>
      <style>{css}</style>
    </div>
  );
}

export function ClaimsUI() {
  return (
    <div className="mu" role="img" aria-label="Illustrative interface: claim documents flowing through ingest, embed, retrieve and recommend steps into an adjudication recommendation">
      <Chrome title="Claim review" />
      <div className="mu-docs">
        {["Claim form", "Medical record", "Policy document"].map((d) => (
          <div key={d} className="mu-doc">
            <span className="mu-lbl">{d}</span>
            <span className="mu-sk" style={{ width: "90%" }} />
            <span className="mu-sk" style={{ width: "70%" }} />
            <span className="mu-sk" style={{ width: "80%" }} />
          </div>
        ))}
      </div>
      <div className="mu-steps">
        {["Ingest", "Embed", "Retrieve", "Recommend"].map((s, i) => (
          <span key={s} className="mu-step" style={{ "--s": i } as React.CSSProperties}>
            {s}
          </span>
        ))}
      </div>
      <div className="mu-card" style={{ marginTop: "auto" }}>
        <span className="mu-lbl">Adjudication recommendation</span>
        <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
          <span className="mu-sk" style={{ width: "88%" }} />
          <span className="mu-sk" style={{ width: "70%" }} />
        </div>
        <div className="mu-meter" aria-hidden="true">
          <b />
        </div>
        <div className="mu-chips">
          <span className="mu-chip">Policy clauses</span>
          <span className="mu-chip">Claim history</span>
        </div>
      </div>
      <style>{css}</style>
    </div>
  );
}
