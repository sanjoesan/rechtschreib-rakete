/* Heuristik: findet "Fehler", bei denen w wahrscheinlich nur eine andere
   gültige WORTFORM (Zeitform/Beugung/Plural) von r ist – also KEIN echter
   Rechtschreibfehler. Beispiel: r="klopfen", w="klopften".

   Vorgehen: r und w teilen einen langen Wortstamm und unterscheiden sich nur
   durch das Vertauschen einer gültigen Flexionsendung. Solche Paare werden
   zur Durchsicht gemeldet (manuell prüfen – Heuristik kann auch mal danebenliegen).

   Aufruf:  node scripts/grammar-check.mjs            (alle Themen)
            node scripts/grammar-check.mjs tiere      (ein Thema) */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");

// gültige Flexionsendungen (Verb / Adjektiv / Nomen-Plural), inkl. "leer"
const END = new Set([
  "", "e", "en", "st", "t", "et", "te", "test", "tet", "ten", "end", "est",
  "em", "er", "es", "ere", "eren", "erem", "erer", "eres",
  "ste", "sten", "stem", "ster", "stes", "n", "s", "ern", "ns"
]);

const strip = (s) => s.replace(/[,;.!?]+$/, "");
function commonPrefix(a, b) { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i; }

function suspicious(r0, w0) {
  const r = strip(r0).toLowerCase(), w = strip(w0).toLowerCase();
  if (r === w) return null;
  // Form-Swap am Wortende: gemeinsamer Stamm + beide Reste gültige Endungen
  const p = commonPrefix(r, w);
  const rs = r.slice(p), ws = w.slice(p);
  if (p >= 3 && END.has(rs) && END.has(ws) && rs !== ws) {
    // mind. eine Endung ist nicht leer und es ist ein "Endungstausch"
    return `Endungstausch  -${rs || "∅"} ↔ -${ws || "∅"}  (Stamm '${r.slice(0, p)}')`;
  }
  // ge-Partizip vorne hinzu/weg: r="macht" w="gemacht"
  if (w === "ge" + r || r === "ge" + w) return "ge-Partizip-Wechsel";
  return null;
}

const only = process.argv[2];
const files = readdirSync(CONTENT).filter((f) => f.endsWith(".json") && (!only || f === only + ".json")).sort();
let total = 0;
const hits = [];
for (const f of files) {
  const theme = f.replace(/\.json$/, "");
  const arr = JSON.parse(readFileSync(join(CONTENT, f), "utf8"));
  arr.forEach((e, i) => {
    e.f.forEach((fl) => {
      if (fl.k !== "b") return; // nur Buchstaben-Fehler betrachten (g/k sind absichtlich)
      const why = suspicious(fl.r, fl.w);
      if (why) { total++; hits.push({ theme, i, r: fl.r, w: fl.w, why, satz: e.satz }); }
    });
  });
}
hits.forEach((h) => console.log(`${h.theme}[${h.i}]  "${h.w}" -> "${h.r}"   ${h.why}\n     ${h.satz}`));
console.log(`\n>>> ${total} verdächtige Form-Paare gefunden (manuell prüfen).`);
