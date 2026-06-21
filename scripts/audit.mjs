import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");

const all = [];
for (const f of readdirSync(CONTENT).filter((x) => x.endsWith(".json"))) {
  const t = f.replace(/\.json$/, "");
  JSON.parse(readFileSync(join(CONTENT, f), "utf8")).forEach((e) => { e.t = t; all.push(e); });
}

const byS = { 1: 0, 2: 0, 3: 0 }, kindByS = { 1: {}, 2: {}, 3: {} };
let s2noG = 0, s3noK = 0; const perTheme = {};
for (const e of all) {
  byS[e.s]++; perTheme[e.t] = (perTheme[e.t] || 0) + 1;
  const kinds = e.f.map((f) => f.k);
  kinds.forEach((k) => kindByS[e.s][k] = (kindByS[e.s][k] || 0) + 1);
  if (e.s === 2 && !kinds.includes("g")) s2noG++;
  if (e.s === 3 && !kinds.includes("k")) s3noK++;
}
console.log("Gesamt:", all.length);
console.log("Pro Stufe:", JSON.stringify(byS));
console.log("Arten S1:", JSON.stringify(kindByS[1]));
console.log("Arten S2:", JSON.stringify(kindByS[2]));
console.log("Arten S3:", JSON.stringify(kindByS[3]));
console.log("Stufe2 ohne g:", s2noG, " Stufe3 ohne k:", s3noK);
const c = Object.values(perTheme);
console.log("Themen:", Object.keys(perTheme).length, "min:", Math.min(...c), "max:", Math.max(...c));

// Verdächtige Muster: w == eine andere Option-Variante doppelt, oder w nicht in o (sollte nicht sein)
let wNotPlausible = 0;
for (const e of all) for (const f of e.f) {
  if (!f.o.includes(f.w) && f.k !== "k") { /* w muss nicht in o sein, ok */ }
}
