"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };
  return (
    <>
      <button type="button" className={`cp ${copied ? "is-done" : ""}`} onClick={copy} aria-label={`Copy email address ${email}`}>
        <span aria-hidden="true">{copied ? "Copied ✓" : "Copy"}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
      <style>{`
        .cp{height:36px;padding:0 16px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.22);background:var(--card);
          transition:background-color .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
        .cp:hover{transform:translateY(-2px)}
        .cp.is-done{background:var(--ink);color:#fff;box-shadow:none}
      `}</style>
    </>
  );
}
