/* =========================================================
   Rechtschreib-Rakete 🚀 — App-Logik
   Reine Client-App, kein Build-Schritt. Globale aus data.js + saetze.js.
   ========================================================= */
"use strict";

/* ---------- Hilfen ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const todayStr = () => new Date().toISOString().slice(0, 10);
const LEVEL_STEP = 120;

/* ---------- State ---------- */
const SAVE_KEY = "rakete_v1";
const DEFAULT_STATE = () => ({
  xp: 0, sterne: 0,
  stufe: 1,
  gruppe: "alle",
  lastDay: "", streak: 0, streakBest: 0,
  skin: "rakete", sound: true, speech: false,
  triedSkins: ["rakete"],
  badges: [],
  perTheme: {},          // themeId -> Anzahl gelöster Sätze
  stats: {
    geloest: 0, perfekt: 0, comboCur: 0, comboBest: 0,
    stufe: { 1: 0, 2: 0, 3: 0 },
    fix: { b: 0, g: 0, k: 0 },
    blitz: 0, fund3: 0
  }
});

let state = load();
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!raw) return DEFAULT_STATE();
    const d = DEFAULT_STATE();
    return deepMerge(d, raw);
  } catch { return DEFAULT_STATE(); }
}
function deepMerge(base, over) {
  for (const k in over) {
    if (over[k] && typeof over[k] === "object" && !Array.isArray(over[k]) && typeof base[k] === "object")
      base[k] = deepMerge(base[k], over[k]);
    else base[k] = over[k];
  }
  return base;
}
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {} }

/* ---------- Abgeleitete Werte ---------- */
function levelInfo(xp) {
  const level = Math.floor(xp / LEVEL_STEP) + 1;
  const inLevel = xp % LEVEL_STEP;
  return { level, inLevel, need: LEVEL_STEP, pct: Math.round((inLevel / LEVEL_STEP) * 100) };
}
function computeStats() {
  const s = state.stats;
  const themen = Object.keys(state.perTheme).length;
  const gemeistert = Object.values(state.perTheme).filter((n) => n >= 10).length;
  const lvl = levelInfo(state.xp).level;
  return {
    geloest: s.geloest, sterne: state.sterne, perfekt: s.perfekt,
    streakBest: state.streakBest, comboBest: s.comboBest,
    stufe1: s.stufe[1], stufe2: s.stufe[2], stufe3: s.stufe[3],
    alleStufen: (s.stufe[1] >= 5 && s.stufe[2] >= 5 && s.stufe[3] >= 5) ? 1 : 0,
    fixB: s.fix.b, fixG: s.fix.g, fixK: s.fix.k,
    themen, gemeistert, level: lvl,
    blitz: s.blitz, fund3: s.fund3,
    nachtSkin: state.triedSkins.includes("nacht") ? 1 : 0,
    skins: state.triedSkins.length
  };
}

/* ---------- Tagesserie ---------- */
function touchStreak() {
  const t = todayStr();
  if (state.lastDay === t) return;
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  state.streak = (state.lastDay === y) ? state.streak + 1 : 1;
  state.lastDay = t;
  if (state.streak > state.streakBest) state.streakBest = state.streak;
}

/* ---------- Sounds ---------- */
let actx = null;
function beep(freq, dur = 0.12, type = "sine", vol = 0.15) {
  if (!state.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = vol; o.connect(g); g.connect(actx.destination);
    o.start(); g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
    o.stop(actx.currentTime + dur);
  } catch {}
}
const sndGood = () => { beep(660, 0.1, "sine"); setTimeout(() => beep(880, 0.12, "sine"), 90); };
const sndBad = () => beep(160, 0.18, "sawtooth", 0.12);
const sndWin = () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.14, "triangle"), i * 110)); };

/* ---------- Sprachausgabe ---------- */
function speak(text) {
  if (!state.speech || !("speechSynthesis" in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE"; u.rate = 0.95;
    const v = speechSynthesis.getVoices().find((x) => /de/i.test(x.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch {}
}

/* ---------- Toast & Konfetti ---------- */
let toastTimer = null;
function toast(msg, ms = 2200) {
  const t = $("#toast");
  t.innerHTML = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), ms);
}
function confetti(n = 120) {
  const cv = $("#confetti"), ctx = cv && cv.getContext && cv.getContext("2d");
  if (!ctx) return;
  cv.width = innerWidth; cv.height = innerHeight; cv.classList.add("show");
  const cols = ["#ffd166", "#ef476f", "#06d6a0", "#118ab2", "#8338ec", "#fb5607"];
  const ps = Array.from({ length: n }, () => ({
    x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * 0.3,
    r: 4 + Math.random() * 6, c: pick(cols), vy: 2 + Math.random() * 4,
    vx: -2 + Math.random() * 4, rot: Math.random() * 6, vr: -0.2 + Math.random() * 0.4
  }));
  let frames = 0;
  (function anim() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); ctx.restore();
    });
    if (++frames < 150) requestAnimationFrame(anim);
    else cv.classList.remove("show");
  })();
}

/* =========================================================
   PUZZLE-AUFBAU
   ========================================================= */
function makePuzzle(entry) {
  const correct = entry.satz.trim().split(/\s+/);
  const wrong = correct.slice();
  const errors = entry.f.map((f) => {
    const idx = correct.indexOf(f.r);
    wrong[idx] = f.w;
    return { idx, r: f.r, w: f.w, options: shuffle(f.o), k: f.k, tipp: f.tipp, fixed: false, chosen: null };
  });
  errors.sort((a, b) => a.idx - b.idx);
  return { entry, correct, wrong, errors, errorIdx: new Set(errors.map((e) => e.idx)) };
}

/* Satz-Auswahl: nach Thema + Stufe, ohne unmittelbare Wiederholung */
const recent = [];
function pickEntry(themeId, stufe) {
  const pool = SAETZE.filter((e) => e.t === themeId && e.s === stufe);
  if (!pool.length) return null;
  let cand = pool.filter((e) => !recent.includes(e.satz));
  if (!cand.length) { recent.length = 0; cand = pool; }
  const e = pick(cand);
  recent.push(e.satz); if (recent.length > 8) recent.shift();
  return e;
}

/* =========================================================
   SPIEL-ABLAUF
   ========================================================= */
let game = null; // {puzzle, theme, stufe, phase, found:Set, mistakesFind, mistakesFix, roundStars, startTime, curError}

function startGame(themeId, stufe) {
  const entry = pickEntry(themeId, stufe);
  if (!entry) { toast("😅 Für dieses Thema und diese Stufe gibt es noch keinen Satz."); return; }
  game = {
    theme: themeId, stufe,
    puzzle: makePuzzle(entry),
    phase: 1, found: new Set(),
    mistakesFind: 0, mistakesFix: 0,
    roundStars: game ? game.roundStars : 0,
    startTime: Date.now(), curError: 0
  };
  const th = THEMA_BY_ID[themeId], st = STUFE_BY_N[stufe];
  $("#gameEmoji").textContent = th.emoji;
  $("#gameTheme").textContent = th.name;
  $("#gameStufeBadge").textContent = st.emoji + " " + st.kurz;
  $("#gameStufeBadge").style.background = st.farbe;
  $("#roundStars").textContent = game.roundStars;
  showView("game");
  renderPhase1();
}

function renderPhase1() {
  game.phase = 1;
  $("#phaseStep1").classList.add("active");
  $("#phaseStep2").classList.remove("active");
  const p = game.puzzle;
  const body = $("#gameBody"); body.innerHTML = "";

  const card = el("div", "task-card");
  card.appendChild(el("p", "task-instruct", "🔍 <b>Finde die 3 Fehler!</b> Tippe die Wörter an, die falsch geschrieben sind."));

  const counter = el("div", "find-counter");
  counter.id = "findCounter";
  card.appendChild(counter);

  const sentence = el("div", "sentence sentence-find");
  p.wrong.forEach((tok, i) => {
    const chip = el("button", "word", esc(tok));
    chip.dataset.i = i;
    chip.addEventListener("click", () => onWordClick(i, chip));
    sentence.appendChild(chip);
    sentence.appendChild(document.createTextNode(" "));
  });
  card.appendChild(sentence);

  const hint = el("p", "task-hint", "💡 Tipp: Lies den Satz langsam – manche Fehler sind echt gut versteckt!");
  card.appendChild(hint);

  body.appendChild(card);
  updateFindCounter();
}

function updateFindCounter() {
  const n = game.found.size;
  $("#findCounter").innerHTML =
    `Gefunden: <b>${n}</b> / 3 ` + "★".repeat(n) + "☆".repeat(3 - n);
}

function onWordClick(i, chip) {
  if (game.phase !== 1) return;
  if (chip.classList.contains("found")) return;
  if (game.puzzle.errorIdx.has(i)) {
    chip.classList.add("found");
    game.found.add(i);
    sndGood();
    updateFindCounter();
    if (game.found.size === 3) {
      if (game.mistakesFind === 0) { /* sauberes Finden */ }
      setTimeout(renderPhase2, 550);
    }
  } else {
    chip.classList.add("miss");
    game.mistakesFind++;
    sndBad();
    setTimeout(() => chip.classList.remove("miss"), 450);
  }
}

function renderPhase2() {
  game.phase = 2;
  game.curError = 0;
  $("#phaseStep1").classList.remove("active");
  $("#phaseStep2").classList.add("active");
  renderFixStep();
}

function renderFixStep() {
  const p = game.puzzle;
  const errsByPos = p.errors; // sortiert nach idx
  const e = errsByPos[game.curError];
  const body = $("#gameBody"); body.innerHTML = "";

  // Beistrich-Fehler (k) haben keine echte Auswahl – die 4 Optionen sind immer
  // dasselbe Schema (Wort MIT Komma vs. ohne/Strichpunkt/Punkt). Das Wort wurde
  // schon in Phase 1 erkannt; hier zählt nur die Komma-Regel. Darum überspringen
  // wir die Antwortauswahl und blenden direkt den Merksatz/die Regel ein.
  const istKomma = e.k === "k";

  const card = el("div", "task-card");
  card.appendChild(el("p", "task-instruct", istKomma
    ? `✒️ <b>Hier gehört ein Beistrich (Komma) hin!</b> &nbsp;Fehler ${game.curError + 1} von 3`
    : `✏️ <b>Wie schreibt man es richtig?</b> &nbsp;Fehler ${game.curError + 1} von 3`));

  // Satz mit aktuell schon korrigierten + aktuellem Fehler hervorgehoben
  const sentence = el("div", "sentence sentence-fix");
  p.wrong.forEach((tok, i) => {
    let txt = tok, cls = "word";
    const errHere = errsByPos.find((x) => x.idx === i);
    if (errHere) {
      if (errHere.fixed) { txt = errHere.r; cls += " ok"; }
      else if (errHere === e) { txt = errHere.w; cls += " target"; }
      else { txt = errHere.w; cls += " pending"; }
    }
    const span = el("span", cls, esc(txt));
    sentence.appendChild(span);
    sentence.appendChild(document.createTextNode(" "));
  });
  card.appendChild(sentence);

  if (istKomma) {
    body.appendChild(card);
    // ohne Auswahl als gelöst werten und gleich die Komma-Regel zeigen
    e.fixed = true; e.chosen = e.r;
    state.stats.fix[e.k] = (state.stats.fix[e.k] || 0) + 1;
    sndGood();
    revealStepTip(e);
    return;
  }

  const opts = el("div", "options");
  e.options.forEach((opt) => {
    const b = el("button", "option", esc(opt));
    b.addEventListener("click", () => onOptionClick(opt, b, e));
    opts.appendChild(b);
  });
  card.appendChild(opts);

  body.appendChild(card);
  // Auswahl-Optionen ins Bild holen, damit man am Smartphone nicht selbst scrollen muss
  scrollIntoViewSoon(opts);
}

function onOptionClick(opt, btn, e) {
  if (e.fixed) return;
  if (opt === e.r) {
    e.fixed = true; e.chosen = opt;
    btn.classList.add("correct");
    sndGood();
    state.stats.fix[e.k] = (state.stats.fix[e.k] || 0) + 1;
    revealStepTip(e);
  } else {
    btn.classList.add("wrong");
    btn.disabled = true;
    game.mistakesFix++;
    sndBad();
  }
}

/* Holt ein Element zuverlässig ins Sichtfeld – auch am Smartphone. block:"center"
   rückt es in die Bildmitte: klar sichtbar, nie hinter Kopf- oder Browserleiste,
   und auch große Sprünge (z.B. von Phase 1 oben zu den Optionen) klappen damit
   verlässlicher als window.scrollTo. Mehrfach gefeuert (doppeltes rAF + zwei
   Timeouts), weil mobile Browser nach DOM-Wechsel und Adressleisten-Animation
   die endgültige Seitenhöhe erst verzögert kennen. */
function scrollIntoViewSoon(elem) {
  if (!elem) return;
  const go = () => {
    try { elem.scrollIntoView({ behavior: "smooth", block: "center" }); }
    catch { try { elem.scrollIntoView(); } catch {} }
  };
  requestAnimationFrame(() => requestAnimationFrame(go));
  setTimeout(go, 150);
  setTimeout(go, 450);
}

/* Merksatz/Regel gut sichtbar oben einblenden – bleibt stehen, bis das Kind
   selbst auf „Weiter" tippt (kein Zeitlimit, die Kinder lesen nicht so schnell). */
function revealStepTip(e) {
  const card = $(".task-card"); if (!card) return;
  // Optionen sperren, damit nichts mehr verrutscht
  $$(".options .option").forEach((b) => { b.disabled = true; });
  // korrigiertes Wort im Satz sofort grün zeigen
  const target = $(".sentence-fix .word.target");
  if (target) { target.textContent = e.r; target.className = "word ok"; }

  const istRegel = game.stufe >= 2;
  const head = istRegel ? "📏 Merk dir die Regel:" : "💡 Merksatz zum Merken:";
  const box = el("div", "step-tip");
  box.innerHTML =
    `<div class="step-tip-head">${head}</div>
     <div class="step-tip-word">✅ <b>${esc(e.r)}</b></div>
     <div class="step-tip-body">${esc(e.tipp)}</div>`;
  card.appendChild(box);

  const istLetzter = game.curError >= game.puzzle.errors.length - 1;
  const wrap = el("div", "step-next");
  const btn = el("button", "btn btn-primary",
    istLetzter ? "🎉 Auflösung anschauen" : "Weiter ▶");
  btn.addEventListener("click", () => {
    game.curError++;
    if (game.curError < 3) renderFixStep();
    else finishSentence();
  });
  wrap.appendChild(btn);
  card.appendChild(wrap);
  // Merksatz + „Weiter"-Button zuverlässig ins Bild holen (auch am Smartphone)
  scrollIntoViewSoon(wrap);
}

/* ---------- Satz fertig ---------- */
function finishSentence() {
  const p = game.puzzle;
  const perfect = game.mistakesFind === 0 && game.mistakesFix === 0;
  const secs = (Date.now() - game.startTime) / 1000;
  const newBadges = [];

  // Belohnungen
  let stars = 1 + (perfect ? 1 : 0);
  let xp = 10 + 5 * game.stufe + (perfect ? 10 : 0);
  state.sterne += stars; state.xp += xp;
  game.roundStars += stars;
  $("#roundStars").textContent = game.roundStars;

  // Stats
  const s = state.stats;
  s.geloest++;
  s.stufe[game.stufe] = (s.stufe[game.stufe] || 0) + 1;
  state.perTheme[game.theme] = (state.perTheme[game.theme] || 0) + 1;
  if (perfect) { s.perfekt++; s.comboCur++; if (s.comboCur > s.comboBest) s.comboBest = s.comboCur; }
  else s.comboCur = 0;
  if (game.mistakesFind === 0) s.fund3++;
  if (perfect && secs < 20) s.blitz++;
  touchStreak();

  const lvlBefore = levelInfo(state.xp - xp).level;
  const lvlAfter = levelInfo(state.xp).level;

  checkBadges(newBadges);
  save();
  refreshTopbar();

  if (perfect) { sndWin(); confetti(perfect ? 140 : 80); }
  else sndGood();

  renderResult({ perfect, stars, xp, secs, newBadges, levelUp: lvlAfter > lvlBefore, lvlAfter });
}

function renderResult({ perfect, stars, xp, secs, newBadges, levelUp, lvlAfter }) {
  const p = game.puzzle;
  const body = $("#gameBody"); body.innerHTML = "";
  const card = el("div", "task-card result-card");

  card.appendChild(el("div", "result-emoji", perfect ? "🌟" : "✅"));
  card.appendChild(el("h3", "result-title", perfect ? "Perfekt gelöst!" : "Geschafft!"));

  const corrected = p.correct.join(" ");
  const sent = el("div", "sentence sentence-done", esc(corrected));
  card.appendChild(sent);

  // Alle Tipps / Merksätze auflisten
  const list = el("div", "tip-list");
  p.errors.forEach((e) => {
    const row = el("div", "tip-row");
    const tag = e.k === "b" ? "🔤 Buchstabe" : e.k === "g" ? "🔠 Groß/klein" : "✒️ Beistrich";
    row.innerHTML = `<div class="tip-word"><s>${esc(e.w)}</s> → <b>${esc(e.r)}</b> <span class="tip-tag">${tag}</span></div>
      <div class="tip-text">${esc(e.tipp)}</div>`;
    list.appendChild(row);
  });
  card.appendChild(list);

  const reward = el("div", "reward-row");
  reward.innerHTML = `<span class="reward">⭐ +${stars}</span> <span class="reward">✨ +${xp} XP</span>` +
    (perfect ? ` <span class="reward perfect">🎯 Perfekt!</span>` : "");
  card.appendChild(reward);

  if (levelUp) {
    const lu = el("div", "levelup", `🎓 Level ${lvlAfter} erreicht!`);
    card.appendChild(lu);
  }
  newBadges.forEach((b) => {
    card.appendChild(el("div", "badge-pop", `🏅 Neues Abzeichen: <b>${b.emoji} ${esc(b.name)}</b>`));
  });

  const btns = el("div", "result-btns");
  const next = el("button", "btn btn-primary", "➡️ Nächster Satz");
  next.addEventListener("click", () => startGame(game.theme, game.stufe));
  const stufeBtn = el("button", "btn btn-ghost", "🎚️ Stufe wechseln");
  stufeBtn.addEventListener("click", () => showView("home"));
  const home = el("button", "btn btn-ghost", "🏠 Startseite");
  home.addEventListener("click", () => showView("home"));
  btns.appendChild(next); btns.appendChild(home);
  card.appendChild(btns);

  body.appendChild(card);
  if (state.speech) speak(corrected);
  // Nach dem Lösen zu den Buttons scrollen, damit „Nächster Satz" sicher sichtbar ist
  scrollIntoViewSoon(btns);
}

/* =========================================================
   ABZEICHEN
   ========================================================= */
function checkBadges(collector) {
  const stats = computeStats();
  ACHIEVEMENTS.forEach((a) => {
    if (state.badges.includes(a.id)) return;
    if ((stats[a.stat] || 0) >= a.val) {
      state.badges.push(a.id);
      if (collector) collector.push(a);
      toast(`🏅 Abzeichen freigeschaltet: <b>${a.emoji} ${esc(a.name)}</b>`, 2800);
    }
  });
}

/* =========================================================
   RENDERING: HOME
   ========================================================= */
function refreshTopbar() {
  const li = levelInfo(state.xp);
  $("#statLevel").textContent = li.level;
  $("#xpFill").style.width = li.pct + "%";
  $("#xpText").textContent = `${li.inLevel} / ${li.need}`;
  $("#statStars").textContent = state.sterne;
  $("#statStreak").textContent = state.streak;
}

function renderStufen() {
  const g = $("#stufeGrid"); g.innerHTML = "";
  STUFEN.forEach((st) => {
    const c = el("button", "stufe-card" + (state.stufe === st.n ? " selected" : ""));
    c.style.setProperty("--accent", st.farbe);
    c.innerHTML = `<div class="stufe-emoji">${st.emoji}</div>
      <div class="stufe-name">${esc(st.name)}</div>
      <div class="stufe-kurz">${esc(st.kurz)}</div>
      <div class="stufe-blurb">${esc(st.blurb)}</div>`;
    c.addEventListener("click", () => { state.stufe = st.n; save(); renderStufen(); toast(`${st.emoji} ${st.name} gewählt`); });
    g.appendChild(c);
  });
}

function renderGroupFilter() {
  const g = $("#groupFilter"); g.innerHTML = "";
  GRUPPEN.forEach((gr) => {
    const b = el("button", "chip" + (state.gruppe === gr.id ? " active" : ""), `${gr.emoji} ${esc(gr.name)}`);
    b.addEventListener("click", () => { state.gruppe = gr.id; save(); renderGroupFilter(); renderThemes(); });
    g.appendChild(b);
  });
}

const THEME_COUNT = {}; // themeId -> Anzahl Sätze gesamt
function indexThemeCounts() {
  SAETZE.forEach((e) => { THEME_COUNT[e.t] = (THEME_COUNT[e.t] || 0) + 1; });
}

function renderThemes() {
  const grid = $("#themeGrid"); grid.innerHTML = "";
  const list = THEMEN.filter((t) => state.gruppe === "alle" || t.gruppe === state.gruppe);
  list.forEach((t) => {
    const cnt = THEME_COUNT[t.id] || 0;
    const solved = state.perTheme[t.id] || 0;
    const card = el("button", "theme-card" + (cnt ? "" : " disabled"));
    card.style.setProperty("--accent", t.farbe);
    const mastered = solved >= 10 ? '<span class="theme-master" title="Gemeistert">🏆</span>' : "";
    card.innerHTML = `<div class="theme-emoji">${t.emoji}</div>
      <div class="theme-name">${esc(t.name)}${mastered}</div>
      <div class="theme-meta">${cnt ? cnt + " Sätze" : "bald verfügbar"}${solved ? " · ✅ " + solved : ""}</div>`;
    if (cnt) card.addEventListener("click", () => startGame(t.id, state.stufe));
    grid.appendChild(card);
  });
}

function renderProgress() {
  const stats = computeStats();
  const li = levelInfo(state.xp);
  const tiles = [
    { i: "🎓", v: li.level, l: "Level" },
    { i: "⭐", v: state.sterne, l: "Sterne" },
    { i: "✅", v: stats.geloest, l: "gelöste Sätze" },
    { i: "🎯", v: stats.perfekt, l: "perfekt" },
    { i: "🔥", v: state.streak, l: "Tage-Serie" },
    { i: "🏅", v: `${state.badges.length}/${ACHIEVEMENTS.length}`, l: "Abzeichen" },
    { i: "🗺️", v: `${stats.themen}/${THEMEN.length}`, l: "Themen" },
    { i: "🏆", v: stats.gemeistert, l: "gemeistert" }
  ];
  const g = $("#progressTiles"); g.innerHTML = "";
  tiles.forEach((t) => {
    g.appendChild(el("div", "ptile", `<div class="ptile-icon">${t.i}</div><div class="ptile-val">${t.v}</div><div class="ptile-lbl">${t.l}</div>`));
  });
  // pro Stufe
  const bar = el("div", "stufe-progress");
  STUFEN.forEach((st) => {
    const n = state.stats.stufe[st.n] || 0;
    bar.appendChild(el("div", "sp-item", `<span style="color:${st.farbe}">${st.emoji}</span> ${st.kurz}: <b>${n}</b>`));
  });
  g.appendChild(bar);
}

function renderBadges(target) {
  const t = $(target); t.innerHTML = "";
  ACHIEVEMENTS.forEach((a) => {
    const got = state.badges.includes(a.id);
    const b = el("div", "badge" + (got ? " got" : " locked"));
    b.innerHTML = `<div class="badge-emoji">${got ? a.emoji : "🔒"}</div>
      <div class="badge-name">${esc(a.name)}</div>
      <div class="badge-txt">${esc(a.txt)}</div>`;
    t.appendChild(b);
  });
}

function renderDesigns() {
  $$(".design-grid").forEach((g) => {
    g.innerHTML = "";
    DESIGNS.forEach((d) => {
      const b = el("button", "design-chip" + (state.skin === d.id ? " active" : ""));
      b.style.setProperty("--accent", d.farbe);
      b.innerHTML = `<span class="design-emoji">${d.emoji}</span><span>${esc(d.name)}</span>`;
      b.addEventListener("click", () => setSkin(d.id));
      g.appendChild(b);
    });
  });
}

function setSkin(id) {
  state.skin = id;
  if (!state.triedSkins.includes(id)) state.triedSkins.push(id);
  document.body.className = "skin-" + id;
  save();
  renderDesigns();
  const newB = []; checkBadges(newB);
  const d = DESIGNS.find((x) => x.id === id);
  if (d) toast(`${d.emoji} Design „${d.name}" aktiviert`);
}

/* =========================================================
   VIEWS & EVENTS
   ========================================================= */
function showView(name) {
  $("#viewHome").classList.toggle("hidden", name !== "home");
  $("#viewGame").classList.toggle("hidden", name !== "game");
  if (name === "home") { renderStufen(); renderThemes(); renderProgress(); renderBadges("#badgeGrid"); renderDesigns(); refreshTopbar(); }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openModal(id) { $(id).classList.remove("hidden"); }
function closeModal(id) { $(id).classList.add("hidden"); }

function play() {
  const list = THEMEN.filter((t) => (THEME_COUNT[t.id] || 0) > 0);
  if (!list.length) { toast("Noch keine Sätze geladen."); return; }
  startGame(pick(list).id, state.stufe);
}

function init() {
  document.body.className = "skin-" + state.skin;
  indexThemeCounts();

  // Topbar
  $("#brandBtn").addEventListener("click", () => showView("home"));
  $("#settingsBtn").addEventListener("click", () => { $("#soundToggle").checked = state.sound; $("#speechToggle").checked = state.speech; openModal("#settingsModal"); });
  $("#settingsClose").addEventListener("click", () => closeModal("#settingsModal"));
  $("#designBtn").addEventListener("click", () => { renderDesigns(); openModal("#designModal"); });
  $("#designClose").addEventListener("click", () => closeModal("#designModal"));
  $("#badgesBtn").addEventListener("click", () => { renderBadges("#badgeGridModal"); $("#badgesCount").textContent = `${state.badges.length} von ${ACHIEVEMENTS.length} freigeschaltet`; openModal("#badgesModal"); });
  $("#badgesClose").addEventListener("click", () => closeModal("#badgesModal"));

  // Hero
  $("#playBtn").addEventListener("click", play);
  $("#randomBtn").addEventListener("click", () => {
    const list = THEMEN.filter((t) => (THEME_COUNT[t.id] || 0) > 0);
    if (list.length) startGame(pick(list).id, state.stufe);
  });

  // Spiel
  $("#backBtn").addEventListener("click", () => showView("home"));

  // Settings
  $("#soundToggle").addEventListener("change", (e) => { state.sound = e.target.checked; save(); if (state.sound) sndGood(); });
  $("#speechToggle").addEventListener("change", (e) => { state.speech = e.target.checked; save(); });
  $("#resetBtn").addEventListener("click", () => {
    if (confirm("Wirklich den ganzen Fortschritt löschen? Das kann man nicht rückgängig machen.")) {
      const skin = state.skin;
      state = DEFAULT_STATE(); state.skin = skin; save();
      closeModal("#settingsModal"); showView("home"); toast("🧹 Fortschritt zurückgesetzt.");
    }
  });

  // Modal-Backdrop-Klick schließt
  $$(".modal-backdrop").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) m.classList.add("hidden"); }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".modal-backdrop").forEach((m) => m.classList.add("hidden")); });

  showView("home");
}

document.addEventListener("DOMContentLoaded", init);
