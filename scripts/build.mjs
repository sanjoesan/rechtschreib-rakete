/* Build: liest content/<thema>.json, validiert, schreibt saetze.js.
   Aufruf:  node scripts/build.mjs        (baut + meldet Statistik)
            node scripts/build.mjs --strict  (bricht bei Problemen ab) */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validateEntry } from "./validate.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const CONTENT = join(ROOT, "content");
const strict = process.argv.includes("--strict");

// Themen-IDs NUR aus dem THEMEN-Array von data.js ziehen
const dataSrc = readFileSync(join(ROOT, "data.js"), "utf8");
const themenBlock = (dataSrc.match(/const THEMEN\s*=\s*\[([\s\S]*?)\];/) || [, ""])[1];
const themeIds = new Set(
  [...themenBlock.matchAll(/id:\s*"([a-z0-9_]+)"/g)].map((m) => m[1])
);

if (!existsSync(CONTENT)) { console.error("Kein content/ Ordner."); process.exit(1); }

const files = readdirSync(CONTENT).filter((f) => f.endsWith(".json")).sort();
let all = [];
let dropped = 0;
const perTheme = {};
const problemsSample = [];

for (const file of files) {
  const theme = file.replace(/\.json$/, "");
  if (!themeIds.has(theme)) {
    console.warn(`⚠  content/${file}: Thema "${theme}" steht nicht in data.js – übersprungen.`);
    continue;
  }
  let arr;
  try {
    arr = JSON.parse(readFileSync(join(CONTENT, file), "utf8"));
  } catch (err) {
    console.error(`✗ content/${file}: ungültiges JSON – ${err.message}`);
    if (strict) process.exit(1);
    continue;
  }
  if (!Array.isArray(arr)) { console.error(`✗ content/${file}: kein Array`); continue; }

  for (let i = 0; i < arr.length; i++) {
    const e = arr[i];
    e.t = theme; // Thema aus Dateiname erzwingen
    const probs = validateEntry(e, { where: `${theme}[${i}]` });
    if (probs.length) {
      dropped++;
      if (problemsSample.length < 40) problemsSample.push(...probs.slice(0, 2));
      continue;
    }
    all.push(e);
    perTheme[theme] = perTheme[theme] || { 1: 0, 2: 0, 3: 0 };
    perTheme[theme][e.s]++;
  }
}

// Ausgabe: kompakt, eine Zeile pro Eintrag (LF), gut komprimierbar/diffbar
const head =
`/* =========================================================
   Rechtschreib-Rakete 🚀 — Satz-Korpus  (AUTOGENERIERT)
   Nicht von Hand editieren! Quelle: content/<thema>.json
   Bauen mit:  node scripts/build.mjs
   Einträge: ${all.length}
   ========================================================= */
const SAETZE = [
`;
const body = all.map((e) => JSON.stringify(e)).join(",\n");
const tail = `\n];
if (typeof module !== "undefined" && module.exports) { module.exports = { SAETZE }; }
`;
writeFileSync(join(ROOT, "saetze.js"), head + body + tail, "utf8");

// Statistik
const themesWith = Object.keys(perTheme).length;
console.log(`\n✅ saetze.js gebaut: ${all.length} Sätze · ${themesWith} Themen · ${dropped} verworfen`);
const low = [];
for (const id of themeIds) {
  const c = perTheme[id];
  if (!c) { low.push(`${id} (FEHLT)`); continue; }
  const tot = c[1] + c[2] + c[3];
  if (tot < 12 || c[1] < 4 || c[2] < 4 || c[3] < 4)
    low.push(`${id} (S1:${c[1]} S2:${c[2]} S3:${c[3]})`);
}
if (low.length) console.log(`\n⚠  Dünne/fehlende Themen (${low.length}):\n   ` + low.join("\n   "));
if (dropped && problemsSample.length) {
  console.log(`\nBeispiel-Probleme:\n   ` + problemsSample.slice(0, 20).join("\n   "));
}
if (strict && (dropped || low.length)) process.exit(1);
