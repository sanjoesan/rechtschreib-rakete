/* Selbst-Check für eine einzelne content/<thema>.json.
   Aufruf:  node scripts/selfcheck.mjs content/tiere.json
   Gibt OK + Statistik aus oder listet die Probleme (zum Nachbessern). */
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { validateEntry } from "./validate.mjs";

const file = process.argv[2];
if (!file) { console.error("Usage: node scripts/selfcheck.mjs <pfad-zur-json>"); process.exit(2); }

const theme = basename(file).replace(/\.json$/, "");
let arr;
try { arr = JSON.parse(readFileSync(file, "utf8")); }
catch (e) { console.error("✗ Ungültiges JSON: " + e.message); process.exit(1); }
if (!Array.isArray(arr)) { console.error("✗ Datei ist kein JSON-Array"); process.exit(1); }

const probs = [];
const cnt = { 1: 0, 2: 0, 3: 0 };
arr.forEach((e, i) => {
  e.t = theme;
  if ([1, 2, 3].includes(e.s)) cnt[e.s]++;
  probs.push(...validateEntry(e, { where: `${theme}[${i}]` }));
});

if (probs.length) {
  console.log(`✗ ${probs.length} Problem(e) in ${file}:`);
  console.log(probs.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.log(`✅ OK: ${arr.length} Sätze (Stufe1: ${cnt[1]}, Stufe2: ${cnt[2]}, Stufe3: ${cnt[3]})`);
