# CLAUDE.md

Kurzanleitung für die Arbeit an **Rechtschreib-Rakete 🚀**.

## Was das ist
Statische, deutschsprachige Web-App: Rechtschreibtraining für Kinder (8–14). In jedem Satz sind
**genau 3 Fehler** versteckt — Phase 1: Fehler finden, Phase 2: aus 4 Vorschlägen die richtige
Schreibweise wählen. 3 Stufen (Buchstabe → +Groß/klein → +Komma). Kein Build-Schritt zum Spielen,
keine Laufzeit-Abhängigkeiten. `index.html` öffnen.

## Dateien
- `index.html` lädt in Reihenfolge `data.js` → `saetze.js` → `app.js`, dazu `styles.css`.
- `data.js`: `STUFEN`, `GRUPPEN`, `THEMEN`, `DESIGNS`, `ACHIEVEMENTS` (globale `const`s).
- `saetze.js`: **autogeneriert** (`const SAETZE`). NICHT von Hand editieren.
- `app.js`: State (localStorage `rakete_v1`), Spielablauf, Rendering, Sounds, Abzeichen, Skins.
- `content/<thema>.json`: Satz-Quellen (pro Thema eine Datei, ohne `t`-Feld).
- `scripts/`: `build.mjs` (Korpus bauen), `validate.mjs` (Regeln), `selfcheck.mjs`, `audit.mjs`, `AUTOR_GUIDE.md`.

## Befehle
```bash
npm run build   # content/*.json -> saetze.js (validiert, droppt Ungültiges, Statistik)
npm run check   # node --check
npm test        # jsdom-Integration + Datenintegrität
```

## Inhalte ändern / ergänzen
1. Thema-Datei in `content/` bearbeiten. Schema & Regeln stehen in `scripts/AUTOR_GUIDE.md`.
2. Wichtig: jedes Fehlerwort `r` steht **genau einmal** und **nie als letztes Wort** im Satz;
   `g` = nur Groß/klein-Unterschied; `k` = `r` mit angehängtem Komma (Satz enthält das Komma);
   4 Optionen, genau eine == `r`. Stufe 1 nur `b`+Merksatz, Stufe 2 mind. 1 `g`, Stufe 3 mind. 1 `k`.
3. `node scripts/selfcheck.mjs content/<thema>.json` bis „✅ OK".
4. `npm run build` → `saetze.js` mitcommitten (CI prüft, dass `saetze.js` aktuell ist).

## Konventionen
- UI-Sprache Deutsch, Kommentare Deutsch.
- Design über CSS-Variablen; Skins überschreiben sie in `body.skin-<id>`.
- Neues Thema = Eintrag in `THEMEN` (data.js) + `content/<id>.json`. Neuer Skin = Eintrag in `DESIGNS` + `.skin-<id>`-Block in styles.css.
- Neues Abzeichen = Eintrag in `ACHIEVEMENTS` mit `{stat, val}`; `stat` muss in `computeStats()` (app.js) existieren.
