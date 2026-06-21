/* Integrationstests für Rechtschreib-Rakete.
   Lädt index.html + data.js + saetze.js + app.js in jsdom und spielt durch. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";
import { validateEntry } from "../scripts/validate.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(join(ROOT, f), "utf8");

function boot() {
  const html = read("index.html");
  const dom = new JSDOM(html, { url: "https://example.org/", runScripts: "dangerously", pretendToBeVisual: true });
  const { window } = dom;
  // Browser-APIs stubben
  window.scrollTo = () => {};
  window.requestAnimationFrame = (cb) => setTimeout(() => cb(0), 0);
  window.HTMLCanvasElement.prototype.getContext = () => null;
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.Element.prototype.scrollIntoView = () => {};
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  // Skripte als Inline-<script> in Reihenfolge ausführen (echter Global-Scope)
  for (const f of ["data.js", "saetze.js", "app.js"]) {
    const s = window.document.createElement("script");
    s.textContent = read(f);
    window.document.body.appendChild(s);
  }
  // init() ist an DOMContentLoaded gebunden – das ist beim Bauen schon gefeuert:
  window.eval("typeof init === 'function' && init()");
  return window;
}

test("App startet und zeigt Home", () => {
  const w = boot();
  assert.ok(!w.document.getElementById("viewHome").classList.contains("hidden"));
  assert.ok(w.document.querySelectorAll("#stufeGrid .stufe-card").length === 3);
  assert.ok(w.document.querySelectorAll("#themeGrid .theme-card").length > 0);
});

test("Datenintegrität: jeder Satz ist gültig", () => {
  const w = boot();
  const SAETZE = w.eval("SAETZE");
  assert.ok(SAETZE.length >= 18, "mindestens Seed vorhanden");
  let probs = [];
  SAETZE.forEach((e, i) => { probs.push(...validateEntry(e, { where: `${e.t}[${i}]` })); });
  assert.deepEqual(probs.slice(0, 10), [], "keine Validierungsfehler:\n" + probs.slice(0, 10).join("\n"));
});

test("Korpus-Umfang & Stufen-Verteilung erfüllen die Spezifikation", () => {
  const w = boot();
  const SAETZE = w.eval("SAETZE");
  assert.ok(SAETZE.length >= 1500, `mind. 1500 Sätze (sind ${SAETZE.length})`);
  for (const s of [1, 2, 3]) {
    const list = SAETZE.filter((e) => e.s === s);
    assert.ok(list.length >= 300, `Stufe ${s}: genug Sätze`);
    if (s === 1) assert.ok(list.every((e) => e.f.every((f) => f.k === "b")), "Stufe 1 nur Buchstabenfehler");
    if (s === 2) assert.ok(list.every((e) => e.f.some((f) => f.k === "g")), "Stufe 2: jeder Satz mit Groß/klein");
    if (s === 2) assert.ok(list.every((e) => e.f.every((f) => f.k !== "k")), "Stufe 2: keine Kommafehler");
    if (s === 3) assert.ok(list.every((e) => e.f.some((f) => f.k === "k")), "Stufe 3: jeder Satz mit Komma");
  }
});

test("Alle Themen aus data.js haben Sätze in allen 3 Stufen", () => {
  const w = boot();
  const SAETZE = w.eval("SAETZE");
  const THEMEN = w.eval("THEMEN");
  for (const t of THEMEN) {
    for (const s of [1, 2, 3]) {
      const n = SAETZE.filter((e) => e.t === t.id && e.s === s).length;
      assert.ok(n >= 4, `Thema ${t.id} Stufe ${s}: mind. 4 Sätze (sind ${n})`);
    }
  }
});

test("Jeder Satz erzeugt genau 3 anklickbare Fehler", () => {
  const w = boot();
  const SAETZE = w.eval("SAETZE");
  for (const e of SAETZE) {
    const correct = e.satz.trim().split(/\s+/);
    const idxs = e.f.map((f) => correct.indexOf(f.r));
    assert.ok(idxs.every((i) => i >= 0), `r nicht gefunden in: ${e.satz}`);
    assert.equal(new Set(idxs).size, 3, `nicht 3 eindeutige Positionen: ${e.satz}`);
  }
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test("Spiel durchspielen: finden + korrigieren führt zum Ergebnis", async () => {
  const w = boot();
  const doc = w.document;
  w.eval('startGame("weltraum", 1)');
  assert.ok(!doc.getElementById("viewGame").classList.contains("hidden"), "Spielansicht sichtbar");

  // Phase 1: die 3 Fehlerwörter anklicken
  const errorIdx = w.eval("[...game.puzzle.errorIdx]");
  for (const i of errorIdx) {
    const chip = doc.querySelector(`.sentence-find .word[data-i="${i}"]`);
    assert.ok(chip, "Fehler-Chip vorhanden");
    chip.dispatchEvent(new w.Event("click"));
  }
  await sleep(650); // renderPhase2 (550ms)
  assert.ok(doc.getElementById("phaseStep2").classList.contains("active"), "Phase 2 aktiv");

  // Phase 2: 3x die richtige Option wählen, dann selbstbestimmt „Weiter"
  for (let n = 0; n < 3; n++) {
    const correctText = w.eval("game.puzzle.errors[game.curError].r");
    const btns = [...doc.querySelectorAll(".options .option")];
    const target = btns.find((b) => b.textContent === correctText);
    assert.ok(target, "richtige Option vorhanden für " + correctText);
    target.dispatchEvent(new w.Event("click"));
    // Merksatz/Regel bleibt sichtbar, bis das Kind weiterklickt
    const tip = doc.querySelector(".step-tip");
    assert.ok(tip, "Merksatz/Regel wird eingeblendet");
    const weiter = doc.querySelector(".step-next .btn");
    assert.ok(weiter, "Weiter-Knopf erscheint und bleibt stehen");
    weiter.dispatchEvent(new w.Event("click"));
  }
  assert.ok(doc.querySelector(".result-card"), "Ergebnis-Karte erscheint");
  assert.ok(w.eval("state.stats.geloest") >= 1, "gelöst-Zähler erhöht");
});

test("Design-Auswahl ist prominent auf der Startseite (nicht in Einstellungen)", () => {
  const w = boot();
  const doc = w.document;
  const home = doc.querySelectorAll("#designGridHome .design-chip");
  const DESIGNS = w.eval("DESIGNS");
  assert.equal(home.length, DESIGNS.length, "alle Designs als Chips auf der Startseite");
  // Settings-Modal enthält KEIN Design-Raster mehr
  assert.equal(doc.querySelectorAll("#settingsModal .design-grid").length, 0);
  // Topbar-Button + Schnellwahl-Modal vorhanden
  assert.ok(doc.getElementById("designBtn"), "Design-Button in der Topbar");
  assert.ok(doc.getElementById("designModal"), "Design-Schnellwahl-Modal");
});

test("Skin wechseln setzt body-Klasse und Abzeichen-Tracking", () => {
  const w = boot();
  w.eval('setSkin("weltraum")');
  assert.equal(w.document.body.className, "skin-weltraum");
  assert.ok(w.eval('state.triedSkins.includes("weltraum")'));
});

test("Abzeichen 'Countdown' nach erstem Lösen", () => {
  const w = boot();
  // direkt Stats setzen und prüfen
  w.eval("state.stats.geloest = 1");
  const newB = [];
  w.eval("checkBadges([])");
  assert.ok(w.eval('state.badges.includes("start")'), "Start-Abzeichen freigeschaltet");
});
