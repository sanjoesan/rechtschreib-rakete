/* Validierung eines Satz-Eintrags. Genutzt von build.mjs und den Tests.
   Gibt ein Array von Problem-Strings zurück (leer = alles ok). */

const ARTEN_PRO_STUFE = { 1: ["b"], 2: ["b", "g"], 3: ["b", "g", "k"] };

// kleine Sicherheits-/Kindgerechtheits-Sperrliste (Wortstämme, case-insensitiv)
const SPERRE = [
  "blut", "töten", "toeten", "mord", "drogen", "sex", "nackt", "waffe schieß",
  "hass", "scheiße", "scheisse", "verdammt", "arsch", "idiot", "dumm kopf"
];

const stripKomma = (s) => s.replace(/[,;]/g, "");
const tokens = (satz) => satz.trim().split(/\s+/);
// Homoglyphen-Schutz: kyrillische/griechische Lookalike-Buchstaben verbieten
const FREMD = /[Ѐ-ӿͰ-Ͽ]/;
const hatFremd = (s) => typeof s === "string" && FREMD.test(s);

export function validateEntry(e, ctx = {}) {
  const p = [];
  const wo = ctx.where || "?";
  if (!e || typeof e !== "object") return [`${wo}: kein Objekt`];

  if (typeof e.t !== "string" || !e.t) p.push(`${wo}: t (Thema) fehlt`);
  if (![1, 2, 3].includes(e.s)) p.push(`${wo}: s (Stufe) muss 1|2|3 sein`);
  if (typeof e.satz !== "string" || e.satz.length < 8) p.push(`${wo}: satz fehlt/zu kurz`);
  if (!Array.isArray(e.f) || e.f.length !== 3) {
    p.push(`${wo}: braucht GENAU 3 Fehler (f), hat ${e.f ? e.f.length : 0}`);
    return p; // ohne 3 Fehler bringt der Rest nichts
  }

  const satz = e.satz || "";
  // Satz soll grammatisch "sauber" aussehen
  if (satz && !/^[„"»]?[A-ZÄÖÜ]/.test(satz)) p.push(`${wo}: satz beginnt nicht groß`);
  if (satz && !/[.!?]["“»]?$/.test(satz.trim())) p.push(`${wo}: satz endet nicht mit .!?`);

  const lc = satz.toLowerCase();
  for (const bad of SPERRE) {
    if (bad.includes(" ")) { if (lc.includes(bad)) p.push(`${wo}: unpassend ("${bad}")`); }
  }
  if (hatFremd(satz)) p.push(`${wo}: fremde (kyrillische/griechische) Zeichen im Satz`);

  const tks = tokens(satz);
  const erlaubt = ARTEN_PRO_STUFE[e.s] || [];
  const seen = new Set();

  e.f.forEach((f, i) => {
    const w = `${wo}/f${i}`;
    if (!f || typeof f !== "object") { p.push(`${w}: kein Objekt`); return; }
    const { r, w: falsch, o, k } = f;

    if (typeof r !== "string" || !r) p.push(`${w}: r fehlt`);
    if (typeof falsch !== "string" || !falsch) p.push(`${w}: w fehlt`);
    if (!["b", "g", "k"].includes(k)) p.push(`${w}: k muss b|g|k sein`);
    if (k && !erlaubt.includes(k)) p.push(`${w}: Art "${k}" auf Stufe ${e.s} nicht erlaubt`);

    if (typeof r === "string" && typeof falsch === "string") {
      if (r === falsch) p.push(`${w}: r und w gleich`);
      if (k === "g" && r.toLowerCase() !== falsch.toLowerCase())
        p.push(`${w}: Groß/klein-Fehler, aber Buchstaben unterscheiden sich`);
      if (k === "g" && r === falsch) p.push(`${w}: Groß/klein ohne Unterschied`);
      if (k === "b" && r.toLowerCase() === falsch.toLowerCase())
        p.push(`${w}: als Buchstabenfehler markiert, ist aber nur Groß/klein`);
      if (k === "k" && stripKomma(r) !== stripKomma(falsch))
        p.push(`${w}: Kommafehler, aber Wort selbst verändert`);
    }

    // Optionen
    if (!Array.isArray(o) || o.length !== 4) p.push(`${w}: o braucht 4 Optionen`);
    else {
      if (!o.includes(r)) p.push(`${w}: r nicht in den Optionen`);
      if (new Set(o).size !== 4) p.push(`${w}: Optionen nicht eindeutig`);
      if (o.includes(undefined) || o.some((x) => typeof x !== "string" || !x))
        p.push(`${w}: leere Option`);
    }

    // r muss GENAU EINMAL als Token im Satz stehen
    if (typeof r === "string") {
      const cnt = tks.filter((t) => t === r).length;
      if (cnt === 0) p.push(`${w}: r ("${r}") kommt nicht als Wort im Satz vor`);
      else if (cnt > 1) p.push(`${w}: r ("${r}") kommt mehrfach im Satz vor`);
      if (seen.has(r)) p.push(`${w}: r ("${r}") doppelt als Fehler genutzt`);
      seen.add(r);
    }

    if (typeof f.tipp !== "string" || f.tipp.length < 8) p.push(`${w}: tipp fehlt/zu kurz`);
    if ([r, falsch, f.tipp, ...(Array.isArray(o) ? o : [])].some(hatFremd))
      p.push(`${w}: fremde (kyrillische/griechische) Zeichen`);
  });

  return p;
}

export function validateAll(list, theme) {
  const probs = [];
  list.forEach((e, i) => {
    const ctx = { where: `${theme || e.t}[${i}]` };
    probs.push(...validateEntry(e, ctx));
  });
  return probs;
}
