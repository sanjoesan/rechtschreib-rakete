/* =========================================================
   Rechtschreib-Rakete 🚀 — Stammdaten
   ---------------------------------------------------------
   Diese Datei enthält KEINE Sätze, sondern:
   • STUFEN     — die 3 Schwierigkeitsgrade
   • GRUPPEN    — Themen-Kategorien (für die Filterleiste)
   • THEMEN     — 50+ Themengebiete (id, name, emoji, farbe, gruppe)
   • DESIGNS    — einstellbare Design-Skins (Weltraum, Tiere, Feen …)
   • ACHIEVEMENTS — 50+ Abzeichen (deklarative Bedingungen)

   Die eigentlichen Sätze liegen in  saetze.js  (const SAETZE = [...]),
   das vom Build-Skript aus  content/<thema>.json  zusammengebaut wird.

   Satz-Schema (ein Eintrag in SAETZE):
   {
     t: "weltraum",         // Themen-id
     s: 1,                  // Stufe 1 | 2 | 3
     satz: "Der Astronaut …",   // KORREKTER Satz
     f: [                   // GENAU 3 Fehler
       {
         r: "Astronaut",    // richtiges Token (genau so im Satz)
         w: "Astronout",    // falsches Token, das angezeigt wird
         o: ["Astronaut","Astronout","Astronaurt","Asdronaut"], // 4 Optionen, eine == r
         k: "b",            // Art: b=Buchstabe, g=Groß/klein, k=Komma
         tipp: "…"          // Stufe 1: Merksatz · Stufe 2/3: Regel
       }, …
     ]
   }
   ========================================================= */

/* ---------- Die 3 Schwierigkeitsgrade ---------- */
const STUFEN = [
  {
    n: 1, name: "Buchstaben-Pilot", kurz: "Stufe 1", emoji: "🅰️",
    farbe: "#3aa757",
    blurb: "Nur Buchstabenfehler – mit Merksätzen zum Lösen.",
    arten: ["b"]
  },
  {
    n: 2, name: "Groß-und-klein-Lotse", kurz: "Stufe 2", emoji: "🔠",
    farbe: "#d98a00",
    blurb: "Buchstaben + Groß-/Kleinschreibung – mit Regeln.",
    arten: ["b", "g"]
  },
  {
    n: 3, name: "Beistrich-Kapitän", kurz: "Stufe 3", emoji: "✂️",
    farbe: "#c0392b",
    blurb: "Buchstaben + Groß/klein + Beistriche (Kommas) – mit Regeln.",
    arten: ["b", "g", "k"]
  }
];
const STUFE_BY_N = Object.fromEntries(STUFEN.map((s) => [s.n, s]));
const ART_NAME = { b: "Buchstabe", g: "Groß-/Kleinschreibung", k: "Beistrich (Komma)" };

/* ---------- Themen-Gruppen (Filterleiste) ---------- */
const GRUPPEN = [
  { id: "alle", name: "Alle", emoji: "✨" },
  { id: "maerchen", name: "Märchen & Fantasy", emoji: "🧚" },
  { id: "natur", name: "Natur & Tiere", emoji: "🦊" },
  { id: "weltall", name: "Weltall & Zukunft", emoji: "🚀" },
  { id: "geschichte", name: "Geschichte & Welt", emoji: "🏛️" },
  { id: "abenteuer", name: "Abenteuer", emoji: "🗺️" },
  { id: "alltag", name: "Alltag & Spaß", emoji: "🎈" }
];

/* ---------- 56 Themengebiete ---------- */
const THEMEN = [
  // — Märchen & Fantasy —
  { id: "maerchen",     name: "Märchen",            emoji: "🏰", farbe: "#b5651d", gruppe: "maerchen" },
  { id: "zauberwesen",  name: "Zauberwesen",        emoji: "🧙", farbe: "#7e57c2", gruppe: "maerchen" },
  { id: "drachen",      name: "Drachen",            emoji: "🐉", farbe: "#c0392b", gruppe: "maerchen" },
  { id: "feen",         name: "Feen & Elfen",       emoji: "🧚", farbe: "#ec5fa0", gruppe: "maerchen" },
  { id: "hexen",        name: "Hexen & Zauberei",   emoji: "🔮", farbe: "#6a3d9a", gruppe: "maerchen" },
  { id: "ritter",       name: "Ritter & Burgen",    emoji: "🛡️", farbe: "#8d6e63", gruppe: "maerchen" },
  { id: "zwerge",       name: "Zwerge & Riesen",    emoji: "⛏️", farbe: "#5d8aa8", gruppe: "maerchen" },
  { id: "einhorn",      name: "Einhörner",          emoji: "🦄", farbe: "#d56fb0", gruppe: "maerchen" },
  { id: "geister",      name: "Gespenster",         emoji: "👻", farbe: "#90a4ae", gruppe: "maerchen" },
  { id: "monster",      name: "Freundliche Monster",emoji: "👹", farbe: "#43a047", gruppe: "maerchen" },

  // — Natur & Tiere —
  { id: "tiere",        name: "Tiere",              emoji: "🦊", farbe: "#e67e22", gruppe: "natur" },
  { id: "haustiere",    name: "Haustiere",          emoji: "🐶", farbe: "#a1887f", gruppe: "natur" },
  { id: "ozean",        name: "Ozean & Meer",       emoji: "🐠", farbe: "#0288d1", gruppe: "natur" },
  { id: "dinosaurier",  name: "Dinosaurier",        emoji: "🦕", farbe: "#558b2f", gruppe: "natur" },
  { id: "insekten",     name: "Insekten & Käfer",   emoji: "🐞", farbe: "#c62828", gruppe: "natur" },
  { id: "voegel",       name: "Vögel",              emoji: "🦜", farbe: "#00897b", gruppe: "natur" },
  { id: "wald",         name: "Im Wald",            emoji: "🌲", farbe: "#2e7d32", gruppe: "natur" },
  { id: "wetter",       name: "Wetter",             emoji: "⛈️", farbe: "#546e7a", gruppe: "natur" },
  { id: "pflanzen",     name: "Pflanzen & Blumen",  emoji: "🌻", farbe: "#f9a825", gruppe: "natur" },
  { id: "bauernhof",    name: "Bauernhof",          emoji: "🚜", farbe: "#8bc34a", gruppe: "natur" },
  { id: "landwirtschaft",name:"Landwirtschaft",     emoji: "🌾", farbe: "#c9a227", gruppe: "natur" },
  { id: "berge",        name: "Berge & Wandern",    emoji: "⛰️", farbe: "#6d4c41", gruppe: "natur" },

  // — Weltall & Zukunft —
  { id: "weltraum",     name: "Weltraum",           emoji: "🚀", farbe: "#3949ab", gruppe: "weltall" },
  { id: "planeten",     name: "Planeten",           emoji: "🪐", farbe: "#5e35b1", gruppe: "weltall" },
  { id: "sciencefiction",name:"Science-Fiction",    emoji: "🛸", farbe: "#00acc1", gruppe: "weltall" },
  { id: "roboter",      name: "Roboter",            emoji: "🤖", farbe: "#607d8b", gruppe: "weltall" },
  { id: "aliens",       name: "Außerirdische",      emoji: "👽", farbe: "#43a047", gruppe: "weltall" },
  { id: "erfindungen",  name: "Erfindungen",        emoji: "💡", farbe: "#fbc02d", gruppe: "weltall" },
  { id: "computer",     name: "Computer & Spiele",  emoji: "🎮", farbe: "#5c6bc0", gruppe: "weltall" },

  // — Geschichte & Welt —
  { id: "geschichte",   name: "Geschichte",         emoji: "📜", farbe: "#8d6e63", gruppe: "geschichte" },
  { id: "aegypten",     name: "Altes Ägypten",      emoji: "🐫", farbe: "#c8a415", gruppe: "geschichte" },
  { id: "roemer",       name: "Die Römer",          emoji: "🏛️", farbe: "#b71c1c", gruppe: "geschichte" },
  { id: "wikinger",     name: "Wikinger",           emoji: "⚓", farbe: "#37474f", gruppe: "geschichte" },
  { id: "steinzeit",    name: "Steinzeit",          emoji: "🦣", farbe: "#795548", gruppe: "geschichte" },
  { id: "mittelalter",  name: "Mittelalter",        emoji: "⚔️", farbe: "#6d4c41", gruppe: "geschichte" },
  { id: "laender",      name: "Länder der Welt",    emoji: "🌍", farbe: "#1e88e5", gruppe: "geschichte" },

  // — Abenteuer —
  { id: "piraten",      name: "Piraten",            emoji: "🏴‍☠️", farbe: "#263238", gruppe: "abenteuer" },
  { id: "detektive",    name: "Detektive",          emoji: "🔍", farbe: "#455a64", gruppe: "abenteuer" },
  { id: "schatzsuche",  name: "Schatzsuche",        emoji: "🗺️", farbe: "#bf8f30", gruppe: "abenteuer" },
  { id: "dschungel",    name: "Dschungel",          emoji: "🌴", farbe: "#2e7d32", gruppe: "abenteuer" },
  { id: "wueste",       name: "Wüste",              emoji: "🏜️", farbe: "#d4a017", gruppe: "abenteuer" },
  { id: "nordpol",      name: "Am Nordpol",         emoji: "🐧", farbe: "#0277bd", gruppe: "abenteuer" },
  { id: "hoehlen",      name: "Höhlen",             emoji: "🕯️", farbe: "#4e342e", gruppe: "abenteuer" },
  { id: "superhelden",  name: "Superhelden",        emoji: "🦸", farbe: "#d32f2f", gruppe: "abenteuer" },
  { id: "zirkus",       name: "Zirkus",             emoji: "🎪", farbe: "#e91e63", gruppe: "abenteuer" },

  // — Alltag & Spaß —
  { id: "schule",       name: "Schule",             emoji: "🎒", farbe: "#3f51b5", gruppe: "alltag" },
  { id: "sport",        name: "Sport",              emoji: "⚽", farbe: "#2e7d32", gruppe: "alltag" },
  { id: "fussball",     name: "Fußball",            emoji: "🥅", farbe: "#1b5e20", gruppe: "alltag" },
  { id: "essen",        name: "Essen & Kochen",     emoji: "🍕", farbe: "#e64a19", gruppe: "alltag" },
  { id: "suessigkeiten",name: "Süßigkeiten",        emoji: "🍬", farbe: "#ec407a", gruppe: "alltag" },
  { id: "musik",        name: "Musik",              emoji: "🎵", farbe: "#8e24aa", gruppe: "alltag" },
  { id: "kunst",        name: "Kunst & Malen",      emoji: "🎨", farbe: "#f4511e", gruppe: "alltag" },
  { id: "berufe",       name: "Berufe",             emoji: "👷", farbe: "#fb8c00", gruppe: "alltag" },
  { id: "verkehr",      name: "Fahrzeuge & Verkehr",emoji: "🚗", farbe: "#1976d2", gruppe: "alltag" },
  { id: "jahreszeiten", name: "Jahreszeiten",       emoji: "🍂", farbe: "#ef6c00", gruppe: "alltag" },
  { id: "geburtstag",   name: "Geburtstag & Feste", emoji: "🎂", farbe: "#d81b60", gruppe: "alltag" },
  { id: "ferien",       name: "Ferien & Reisen",    emoji: "🏖️", farbe: "#00acc1", gruppe: "alltag" },
  { id: "traeume",      name: "Träume & Fantasie",  emoji: "💭", farbe: "#7986cb", gruppe: "alltag" }
];
const THEMA_BY_ID = Object.fromEntries(THEMEN.map((t) => [t.id, t]));

/* ---------- Design-Skins (im Einstellungs-Menü wählbar) ---------- */
/* Jeder Skin = CSS-Klasse  skin-<id>  am <body>.  bg = kurze Beschreibung. */
const DESIGNS = [
  { id: "rakete",       name: "Rakete (Standard)", emoji: "🚀", farbe: "#3949ab" },
  { id: "weltraum",     name: "Weltraum",          emoji: "🌌", farbe: "#1a237e" },
  { id: "tiere",        name: "Tierwald",          emoji: "🦊", farbe: "#e67e22" },
  { id: "feen",         name: "Feenzauber",        emoji: "🧚", farbe: "#ec5fa0" },
  { id: "ozean",        name: "Tiefsee",           emoji: "🐠", farbe: "#0277bd" },
  { id: "dschungel",    name: "Dschungel",         emoji: "🌴", farbe: "#2e7d32" },
  { id: "ritterburg",   name: "Ritterburg",        emoji: "🛡️", farbe: "#8d6e63" },
  { id: "suessigkeiten",name: "Zuckerwelt",        emoji: "🍭", farbe: "#ec407a" },
  { id: "roboter",      name: "Roboterfabrik",     emoji: "🤖", farbe: "#546e7a" },
  { id: "dino",         name: "Dino-Land",         emoji: "🦕", farbe: "#558b2f" },
  { id: "regenbogen",   name: "Regenbogen",        emoji: "🌈", farbe: "#d500f9" },
  { id: "drache",       name: "Drachenhöhle",      emoji: "🐉", farbe: "#b71c1c" },
  { id: "nacht",        name: "Sternennacht",      emoji: "🌙", farbe: "#263238" }
];

/* =========================================================
   ACHIEVEMENTS  —  60 Abzeichen
   Bedingung deklarativ:  { stat, val }  → freigeschaltet, sobald stats[stat] >= val.
   stats werden in app.js geführt (siehe computeStats / state.stats).
   ========================================================= */
const ACHIEVEMENTS = [
  // — Erste Schritte / Gesamt gelöst —
  { id: "start",     name: "Countdown!",         emoji: "🚀", stat: "geloest",   val: 1,    txt: "Dein erster Satz ist geschafft." },
  { id: "los5",      name: "Abheben",            emoji: "🛫", stat: "geloest",   val: 5,    txt: "5 Sätze gelöst." },
  { id: "los10",     name: "Im Orbit",           emoji: "🛰️", stat: "geloest",   val: 10,   txt: "10 Sätze gelöst." },
  { id: "los25",     name: "Wortastronaut",      emoji: "👨‍🚀", stat: "geloest",  val: 25,   txt: "25 Sätze gelöst." },
  { id: "los50",     name: "Mondlandung",        emoji: "🌕", stat: "geloest",   val: 50,   txt: "50 Sätze gelöst." },
  { id: "los100",    name: "Hundert-Marke",      emoji: "💯", stat: "geloest",   val: 100,  txt: "100 Sätze gelöst." },
  { id: "los250",    name: "Wortgalaxie",        emoji: "🌠", stat: "geloest",   val: 250,  txt: "250 Sätze gelöst." },
  { id: "los500",    name: "Lichtgeschwindigkeit",emoji: "⚡", stat: "geloest",  val: 500,  txt: "500 Sätze gelöst." },
  { id: "los1000",   name: "Tausend Sterne",     emoji: "🌌", stat: "geloest",   val: 1000, txt: "1000 Sätze gelöst." },

  // — Sterne (Punkte) —
  { id: "stern10",   name: "Sternensammler",     emoji: "⭐", stat: "sterne",    val: 10,   txt: "10 Sterne gesammelt." },
  { id: "stern50",   name: "Sternenstaub",       emoji: "✨", stat: "sterne",    val: 50,   txt: "50 Sterne gesammelt." },
  { id: "stern100",  name: "Sternschnuppe",      emoji: "💫", stat: "sterne",    val: 100,  txt: "100 Sterne gesammelt." },
  { id: "stern250",  name: "Sternbild",          emoji: "🌟", stat: "sterne",    val: 250,  txt: "250 Sterne gesammelt." },
  { id: "stern500",  name: "Sternenmeer",        emoji: "🌠", stat: "sterne",    val: 500,  txt: "500 Sterne gesammelt." },
  { id: "stern1000", name: "Sternenkaiser",      emoji: "👑", stat: "sterne",    val: 1000, txt: "1000 Sterne gesammelt." },

  // — Perfekt (ohne Fehlklick & ohne falsche Option) —
  { id: "perf1",     name: "Glasklar",           emoji: "🔎", stat: "perfekt",   val: 1,    txt: "Erster Satz ganz ohne Patzer." },
  { id: "perf10",    name: "Adlerauge",          emoji: "🦅", stat: "perfekt",   val: 10,   txt: "10 perfekte Sätze." },
  { id: "perf25",    name: "Fehlerlos",          emoji: "🎯", stat: "perfekt",   val: 25,   txt: "25 perfekte Sätze." },
  { id: "perf50",    name: "Sauberer Profi",     emoji: "🧼", stat: "perfekt",   val: 50,   txt: "50 perfekte Sätze." },
  { id: "perf100",   name: "Makellos",           emoji: "💎", stat: "perfekt",   val: 100,  txt: "100 perfekte Sätze." },

  // — Tagesserie (Streak) —
  { id: "streak2",   name: "Dranbleiber",        emoji: "📌", stat: "streakBest",val: 2,    txt: "2 Tage in Folge geübt." },
  { id: "streak3",   name: "Drei am Stück",      emoji: "🔥", stat: "streakBest",val: 3,    txt: "3 Tage in Folge geübt." },
  { id: "streak5",   name: "Feuereifer",         emoji: "🔥", stat: "streakBest",val: 5,    txt: "5 Tage in Folge geübt." },
  { id: "streak7",   name: "Wochenheld",         emoji: "🗓️", stat: "streakBest",val: 7,    txt: "7 Tage in Folge geübt." },
  { id: "streak14",  name: "Zwei Wochen!",       emoji: "🏅", stat: "streakBest",val: 14,   txt: "14 Tage in Folge geübt." },
  { id: "streak30",  name: "Monatsmeister",      emoji: "🏆", stat: "streakBest",val: 30,   txt: "30 Tage in Folge geübt." },

  // — Combo (am Stück richtig, ohne Patzer hintereinander) —
  { id: "combo3",    name: "Dreierkette",        emoji: "🔗", stat: "comboBest", val: 3,    txt: "3 perfekte Sätze hintereinander." },
  { id: "combo5",    name: "Fünferserie",        emoji: "🎲", stat: "comboBest", val: 5,    txt: "5 perfekte Sätze hintereinander." },
  { id: "combo10",   name: "Zehnerturbo",        emoji: "🚄", stat: "comboBest", val: 10,   txt: "10 perfekte Sätze hintereinander." },
  { id: "combo20",   name: "Unaufhaltbar",       emoji: "🌪️", stat: "comboBest", val: 20,   txt: "20 perfekte Sätze hintereinander." },

  // — Stufen —
  { id: "s1_10",     name: "Buchstaben-Start",   emoji: "🅰️", stat: "stufe1",    val: 10,   txt: "10 Sätze auf Stufe 1." },
  { id: "s1_50",     name: "Buchstaben-Pilot",   emoji: "✍️", stat: "stufe1",    val: 50,   txt: "50 Sätze auf Stufe 1." },
  { id: "s2_10",     name: "Groß & klein",       emoji: "🔠", stat: "stufe2",    val: 10,   txt: "10 Sätze auf Stufe 2." },
  { id: "s2_50",     name: "Lotsen-Diplom",      emoji: "🧭", stat: "stufe2",    val: 50,   txt: "50 Sätze auf Stufe 2." },
  { id: "s3_10",     name: "Beistrich-Lehrling", emoji: "✂️", stat: "stufe3",    val: 10,   txt: "10 Sätze auf Stufe 3." },
  { id: "s3_50",     name: "Beistrich-Kapitän",  emoji: "⚓", stat: "stufe3",    val: 50,   txt: "50 Sätze auf Stufe 3." },
  { id: "alleStufen",name: "Allrounder",         emoji: "🎖️", stat: "alleStufen",val: 1,    txt: "Auf allen 3 Stufen je 5 Sätze gelöst." },

  // — Fehlerarten gemeistert —
  { id: "buch25",    name: "Buchstabendreher-Jäger", emoji: "🔤", stat: "fixB", val: 25,  txt: "25 Buchstabenfehler korrigiert." },
  { id: "buch100",   name: "Buchstaben-Boss",    emoji: "🔡", stat: "fixB",     val: 100,  txt: "100 Buchstabenfehler korrigiert." },
  { id: "buch300",   name: "Rechtschreib-Radar", emoji: "📡", stat: "fixB",     val: 300,  txt: "300 Buchstabenfehler korrigiert." },
  { id: "gross25",   name: "Großschreib-Spürnase", emoji: "🔠", stat: "fixG",   val: 25,   txt: "25 Groß/klein-Fehler korrigiert." },
  { id: "gross100",  name: "Königin der Großbuchstaben", emoji: "👸", stat: "fixG", val: 100, txt: "100 Groß/klein-Fehler korrigiert." },
  { id: "komma10",   name: "Komma-Kenner",       emoji: "✒️", stat: "fixK",     val: 10,   txt: "10 Kommafehler korrigiert." },
  { id: "komma50",   name: "Komma-Künstler",     emoji: "🖋️", stat: "fixK",     val: 50,   txt: "50 Kommafehler korrigiert." },
  { id: "komma100",  name: "Beistrich-Magier",   emoji: "🪄", stat: "fixK",     val: 100,  txt: "100 Kommafehler korrigiert." },

  // — Themen erkundet —
  { id: "thema1",    name: "Neugierig",          emoji: "🧭", stat: "themen",    val: 1,    txt: "Dein erstes Thema gespielt." },
  { id: "thema5",    name: "Entdecker",          emoji: "🌍", stat: "themen",    val: 5,    txt: "5 verschiedene Themen gespielt." },
  { id: "thema10",   name: "Weltenbummler",      emoji: "🧳", stat: "themen",    val: 10,   txt: "10 verschiedene Themen gespielt." },
  { id: "thema25",   name: "Sammler",            emoji: "🗂️", stat: "themen",    val: 25,   txt: "25 verschiedene Themen gespielt." },
  { id: "themaAll",  name: "Alleskenner",        emoji: "🏆", stat: "themen",    val: 50,   txt: "50 verschiedene Themen gespielt." },

  // — Themen gemeistert (≥10 Sätze in einem Thema) —
  { id: "meister1",  name: "Themen-Meister",     emoji: "🥇", stat: "gemeistert",val: 1,    txt: "Ein Thema gemeistert (10 Sätze)." },
  { id: "meister5",  name: "Fünffach-Meister",   emoji: "🏅", stat: "gemeistert",val: 5,    txt: "5 Themen gemeistert." },
  { id: "meister10", name: "Großmeister",        emoji: "👑", stat: "gemeistert",val: 10,   txt: "10 Themen gemeistert." },

  // — Besondere —
  { id: "level5",    name: "Aufgestiegen",       emoji: "📈", stat: "level",     val: 5,    txt: "Spieler-Level 5 erreicht." },
  { id: "level10",   name: "Routinier",          emoji: "🎓", stat: "level",     val: 10,   txt: "Spieler-Level 10 erreicht." },
  { id: "level20",   name: "Rechtschreib-Raketen-Profi", emoji: "🚀", stat: "level", val: 20, txt: "Spieler-Level 20 erreicht." },
  { id: "blitz",     name: "Blitzschnell",       emoji: "⚡", stat: "blitz",     val: 1,    txt: "Einen Satz in unter 20 Sekunden perfekt gelöst." },
  { id: "blitz10",   name: "Wirbelwind",         emoji: "🌪️", stat: "blitz",     val: 10,   txt: "10 Sätze blitzschnell & perfekt gelöst." },
  { id: "fund3",     name: "Adleraugen-Runde",   emoji: "🔭", stat: "fund3",     val: 1,    txt: "Alle 3 Fehler gefunden – ohne Fehlklick." },
  { id: "nachteule", name: "Nachteule",          emoji: "🦉", stat: "nachtSkin", val: 1,    txt: "Das Sternennacht-Design ausprobiert." },
  { id: "stylist",   name: "Designer-Auge",      emoji: "🎨", stat: "skins",     val: 5,    txt: "5 verschiedene Designs ausprobiert." }
];

/* Im Browser global; in Node (Tests/Build) exportierbar. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { STUFEN, STUFE_BY_N, ART_NAME, GRUPPEN, THEMEN, THEMA_BY_ID, DESIGNS, ACHIEVEMENTS };
}
