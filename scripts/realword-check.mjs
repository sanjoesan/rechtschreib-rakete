/* Findet Buchstaben-Fehler ("b"), bei denen das ANGEZEIGTE falsche Wort w
   selbst ein echtes, häufiges deutsches Wort(form) ist – also KEIN klarer
   Rechtschreibfehler (z.B. r="klopfen", w="klopften").

   Braucht eine Wortform-Frequenzliste (Format: "wort\tcount" pro Zeile, klein).
   Aufruf:  node scripts/realword-check.mjs <pfad-zur-formliste> [minCount]
*/
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");
const listPath = process.argv[2];
const MIN = Number(process.argv[3] || 5);
if (!listPath) { console.error("Wortliste fehlt."); process.exit(2); }

const freq = new Map();
for (const line of readFileSync(listPath, "utf8").split("\n")) {
  const i = line.indexOf("\t");
  if (i < 0) continue;
  const w = line.slice(0, i), c = Number(line.slice(i + 1));
  if (w) freq.set(w, Math.max(freq.get(w) || 0, c));
}

const strip = (s) => s.replace(/[,;.!?]+$/, "").toLowerCase();
const hits = [];
for (const f of readdirSync(CONTENT).filter((x) => x.endsWith(".json")).sort()) {
  const theme = f.replace(/\.json$/, "");
  JSON.parse(readFileSync(join(CONTENT, f), "utf8")).forEach((e, i) => {
    e.f.forEach((fl) => {
      if (fl.k !== "b") return;
      const c = freq.get(strip(fl.w)) || 0;
      if (c >= MIN) hits.push({ theme, i, r: fl.r, w: fl.w, c, satz: e.satz });
    });
  });
}
hits.sort((a, b) => b.c - a.c);
hits.forEach((h) => console.log(`${String(h.c).padStart(6)}  ${h.theme}[${h.i}]  w="${h.w}" -> r="${h.r}"\n        ${h.satz}`));
console.log(`\n>>> ${hits.length} Buchstaben-Fehler, deren w ein echtes Wort (count>=${MIN}) ist.`);
