# Vishnu A S — Portfolio

A quiet, light, single-scroll portfolio for **Vishnu A S, Generative AI Engineer**.
White / black / gray only, one continuous surface, every section with its own component and motion.

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS 4 + small component-scoped CSS
- Lenis for smooth scrolling (the only animation dependency — no GSAP, no WebGL)
- Self-hosted fonts via `next/font/local`: Inter Tight, Instrument Serif, JetBrains Mono

All copy comes from the résumé (`public/Vishnu-A-S-Resume.pdf`) and lives in **`src/lib/data.ts`**.

---

## Run it

```bash
npm install        # also copies the font files into src/fonts (postinstall)
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Requires Node 18.18+ (Node 20/22 recommended).

> If you install with `--ignore-scripts`, run `node scripts/copy-fonts.mjs` once afterwards —
> `next/font/local` needs the `.woff2` files in `src/fonts/`.

---

## Sections

| # | Section | Component | Motion |
|---|---|---|---|
| — | Navigation | `Navigation.tsx` | Initials mark turns solid + spins on hover, frosted pill, sliding active indicator, 2 px scroll-progress bar, clip-path mobile menu (Esc closes, scroll locked) |
| — | Hero | `hero/Hero.tsx`, `hero/HeroVideo.tsx` | Looping intro video (multiply blend), outlined ghost name, line-mask heading; voice pauses when < 35 % of the hero is visible |
| 01 | About | `sections/About.tsx`, `ui/IdCard.tsx` | Lanyard ID card: damped pendulum swing from pointer velocity, idle sway, 3D flip (hover / tap / Enter·Space) |
| 02 | Skills | `sections/SkillsTable.tsx`, `ui/TechLogo.tsx` | Periodic table with diagonal wave reveal, family filter chips, sticky inspector with brand-logo pop |
| 03 | Work | `sections/WorkAccordion.tsx`, `ui/MiniUI.tsx` | Expanding accordion gallery; open panel shows an *Illustrative UI* with clip-path wipe |
| 04 | Experience | `sections/Timeline.tsx` | Spine draws with scroll; stops light up as it reaches them; ends with "Next — Your team?" |
| 05 | Contact + footer | `sections/Contact.tsx`, `ui/HopHeading.tsx`, `ui/CopyEmail.tsx` | Letters hop under the cursor, Copy chip with `aria-live`, spinning "say hello" badge |

**Not shown, because the résumé has no data for them:** Certifications and Achievements.
Both components are already built (`sections/Certifications.tsx` — ink-flood index;
`sections/Achievements.tsx` — pinned horizontal gallery with count-up numbers).
Fill `CERTIFICATIONS` / `ACHIEVEMENTS` in `src/lib/data.ts` and they render automatically
with correct section numbers. Add matching entries to `NAV` to show them in the menu.
Likewise, adding a `github` URL to `PROFILE` brings back every GitHub button.

Global reveal: `ui/RevealObserver.tsx` adds `.is-in` to `.rv` (fade + 24 px rise) and `.rv-mask` (line slides up), once.
`prefers-reduced-motion` disables Lenis, the pendulum and decorative animation.

---

## Rebuild the hero video

`scripts/build-hero-assets.py` (Python 3.9+, numpy, ffmpeg/ffprobe on PATH):

```bash
pip install numpy
python3 scripts/build-hero-assets.py --video raw/intro.mp4 --photo raw/photo.jpg --name "Vishnu A S"
# or simply: npm run hero
```

What it does:

1. **Crop** — detects the person against the light backdrop and crops head-to-toe, centred, at aspect 768:960
   (override with `--crop W:H:X:Y`; for this video it found `576:720:342:0`). Scales to 768 × 960.
2. **Whiten** — `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98` so the backdrop becomes pure white and disappears under `mix-blend-mode: multiply`.
3. **Seamless loop** — takes the first 10 s, cross-fades the last 0.5 s of picture into the first 0.5 s (`xfade`), and does the
   same to the audio sample-accurately in numpy (equal-power). No retiming, so lips stay in sync. Output: 9.5 s.
4. **Export** — `public/hero/hero.mp4` (H.264 yuv420p CRF 24 `-preset slow`, AAC 96k, `+faststart`) and
   `public/hero/hero.webm` (VP9 CRF 36, Opus 80k), plus `hero-poster.webp` (first frame).
5. **Stills** — `public/portrait-bust.webp` (480 × 600, from `--photo`, or the sharpest video frame if omitted) and `public/og.jpg` (1200 × 630).

`raw/photo.jpg` is the portrait extracted from the résumé PDF.

---

## Project structure

```
src/app/            layout.tsx (metadata, OG, fonts, themeColor #f4f2ee) · page.tsx · globals.css
src/components/     App.tsx · Navigation.tsx · hero/* · sections/* · ui/*
src/lib/            data.ts · hooks.ts (useInView, useScrollProgress, prefersReducedMotion) · scroll.tsx (Lenis + scrollToTarget)
src/fonts/          *.woff2 (copied on install)
public/hero/        hero.mp4 · hero.webm · hero-poster.webp
public/logos/       brand SVGs + LICENSE.md
public/             portrait-bust.webp · og.jpg · favicon.svg · Vishnu-A-S-Resume.pdf
scripts/            build-hero-assets.py · copy-fonts.mjs
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://vishnu.dev`) when deploying so Open Graph URLs are absolute.

---

## Credits & licences

- **Brand logos** (`public/logos/`) — Python, LangChain, LangGraph, FastAPI, Pydantic, OpenSearch, Jira, Claude from
  [Simple Icons](https://simpleicons.org) (CC0 1.0); OpenAI from Remix Icon (Apache 2.0); AWS from Font Awesome Free (CC BY 4.0);
  Azure from VS Code Codicons (CC BY 4.0). Paths taken via `react-icons` (MIT). Full table in `public/logos/LICENSE.md`.
  All trademarks belong to their owners and are used only to name technologies listed in the résumé.
- **Concept icons** (RAG, embeddings, agents, …) — drawn for this site, `src/components/ui/TechLogo.tsx`.
- **Fonts** — Inter Tight, Instrument Serif, JetBrains Mono — SIL Open Font License 1.1, installed from Fontsource.
- **Illustrative UIs** in the Work section are drawings, not product screenshots; client names are confidential per the résumé.
