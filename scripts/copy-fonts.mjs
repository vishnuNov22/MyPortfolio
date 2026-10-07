// Copies the self-hosted font files from @fontsource packages into src/fonts
// so next/font/local can bundle them. Runs automatically after `npm install`.
// Fonts: Inter Tight, Instrument Serif, JetBrains Mono — all SIL Open Font License 1.1.
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "src", "fonts");
mkdirSync(out, { recursive: true });

// [package, preferred file, fallback pattern, output name]
const files = [
  ["@fontsource-variable/inter-tight", "inter-tight-latin-wght-normal.woff2", /-latin-wght-normal\.woff2$/, "InterTight-Variable.woff2"],
  ["@fontsource/instrument-serif", "instrument-serif-latin-400-normal.woff2", /-latin-400-normal\.woff2$/, "InstrumentSerif-Regular.woff2"],
  ["@fontsource/instrument-serif", "instrument-serif-latin-400-italic.woff2", /-latin-400-italic\.woff2$/, "InstrumentSerif-Italic.woff2"],
  ["@fontsource-variable/jetbrains-mono", "jetbrains-mono-latin-wght-normal.woff2", /-latin-wght-normal\.woff2$/, "JetBrainsMono-Variable.woff2"],
];

let missing = 0;
for (const [pkg, file, pattern, to] of files) {
  const dir = join(root, "node_modules", pkg, "files");
  let src = join(dir, file);
  if (!existsSync(src) && existsSync(dir)) {
    const hit = readdirSync(dir).find((f) => pattern.test(f) && !f.includes("latin-ext"));
    if (hit) src = join(dir, hit);
  }
  if (existsSync(src)) {
    copyFileSync(src, join(out, to));
  } else if (!existsSync(join(out, to))) {
    console.warn(`[fonts] missing ${pkg}/files/${file}`);
    missing++;
  }
}
console.log(missing ? `[fonts] ${missing} font file(s) missing — run npm install again` : "[fonts] ready in src/fonts");
