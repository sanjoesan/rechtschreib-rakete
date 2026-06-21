# Rechtschreib-Rakete 🚀

> Starte durch zur fehlerfreien Galaxie!

Ein spielerisches **Deutsch-Rechtschreibtraining für Kinder von 8 bis 14 Jahren**.
In jedem Satz verstecken sich **genau 3 Rechtschreibfehler**. Erst werden alle 3 aufgespürt,
dann wird zu jedem aus **4 Vorschlägen** die richtige Schreibweise gewählt – mit **Merksätzen**
(Stufe 1) bzw. der passenden **Rechtschreib-/Kommaregel** (Stufe 2 & 3).

Reine statische Client-App – **kein Build-Schritt zum Spielen, keine Server, keine Tracker**.
Einfach `index.html` im Browser öffnen.

## ✨ Features

- **3 Schwierigkeitsstufen**
  - **Stufe 1 – Buchstaben-Pilot:** nur Buchstabenfehler, gelöst mit kindgerechten **Merksätzen**.
  - **Stufe 2 – Groß-und-klein-Lotse:** zusätzlich **Groß-/Kleinschreibung**, erklärt mit **Regeln**.
  - **Stufe 3 – Beistrich-Kapitän:** zusätzlich **Beistriche (Kommas)**, erklärt mit **Regeln**.
- **Über 2000 Sätze** aus **58 Themenwelten** (Märchen, Weltraum, Tiere, Geschichte, Landwirtschaft,
  Zauberwesen, Science-Fiction, Piraten, Dinosaurier u. v. m.) – lustig, kreativ und kindgerecht.
- **2-Phasen-Spiel:** ① Fehler finden ② richtig schreiben.
- **Lernfortschritt:** XP, Spieler-Level, Sterne, Tages-Serie, gemeisterte Themen.
- **60 Abzeichen** zum Freischalten.
- **13 Design-Skins** (Weltraum, Tierwald, Feenzauber, Tiefsee, Dschungel, Ritterburg, Zuckerwelt,
  Roboterfabrik, Dino-Land, Regenbogen, Drachenhöhle, Sternennacht …).
- Soundeffekte, optionales Vorlesen (Sprachausgabe), Konfetti, voll **responsiv** (Handy/Tablet/PC).
- Fortschritt wird lokal im Browser gespeichert (`localStorage`) – nichts verlässt das Gerät.

## 🗂️ Projektstruktur

| Datei / Ordner        | Inhalt |
|-----------------------|--------|
| `index.html`          | Statische Struktur (Topbar, Home, Spielansicht, Modals) |
| `data.js`             | Stammdaten: Stufen, Themen, Design-Skins, Abzeichen |
| `saetze.js`           | **Autogenerierter** Satz-Korpus (`const SAETZE`) |
| `app.js`              | Spiel-Logik: State (localStorage), Rendering, Spielablauf, Sounds |
| `styles.css`          | Komplettes Design inkl. aller 13 Skins & Responsive |
| `content/<thema>.json`| Quelldateien der Sätze (je Thema eine Datei) |
| `scripts/build.mjs`   | Baut `saetze.js` aus `content/*.json` (mit Validierung) |
| `scripts/validate.mjs`| Validierungsregeln (von Build & Tests genutzt) |
| `scripts/selfcheck.mjs`| Prüft eine einzelne `content`-Datei |
| `tests/app.test.mjs`  | jsdom-Integrationstests + Datenintegrität |

### Satz-Schema (`content/<thema>.json`)

```jsonc
{
  "s": 1,                       // Stufe 1 | 2 | 3
  "satz": "Der Astronaut steuert seine Rakete zur Raumstation.",  // KORREKTER Satz
  "f": [                        // genau 3 Fehler
    {
      "r": "Astronaut",         // richtig (genau so im Satz)
      "w": "Astronout",         // falsch (wird angezeigt)
      "o": ["Astronaut","Astronout","Astranaut","Asdronaut"], // 4 Optionen, eine == r
      "k": "b",                 // b = Buchstabe, g = Groß/klein, k = Komma
      "tipp": "Merksatz: ..."   // Stufe 1: Merksatz · Stufe 2/3: Regel
    }
  ]
}
```

Aus dem korrekten Satz baut die App zur Laufzeit den fehlerhaften Satz (ersetzt jedes `r` durch `w`),
markiert die Fehlerstellen und erzeugt die Auswahlfragen.

## 🛠️ Entwicklung

```bash
npm install        # nur für Tests nötig (jsdom)
npm run build      # content/*.json  ->  saetze.js  (mit Validierung & Statistik)
npm run check      # Syntax-Check (node --check)
npm test           # jsdom-Integrationstests + Datenintegrität
```

Neue Sätze? Eine Theme-Datei in `content/` bearbeiten, mit
`node scripts/selfcheck.mjs content/<thema>.json` prüfen, dann `npm run build` ausführen
und `saetze.js` mitcommitten (die CI erzwingt, dass `saetze.js` aktuell ist).

## 🚀 Deployment

Statische Seite via **GitHub Pages** (Branch `main`, Ordner `/`). Die Datei `.nojekyll`
sorgt dafür, dass Pages die Dateien unverändert ausliefert.

## 📄 Lizenz

MIT
