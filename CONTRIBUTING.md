# Mitmachen & neue Sätze hinzufügen

Schön, dass du **Rechtschreib-Rakete 🚀** mit aufbauen möchtest! Hier die wichtigsten Schritte.

## Vorbereitung

```bash
npm install     # nur für die Tests nötig (jsdom)
```

## Neue Sätze für ein Thema

1. Öffne die Datei des Themas in `content/`, z. B. `content/tiere.json`
   (oder lege für ein **neues Thema** eine neue Datei an – siehe unten).
2. Schreibe Sätze nach dem Schema (siehe `scripts/AUTOR_GUIDE.md` für alle Details und Beispiele):

   ```jsonc
   {
     "s": 1,                       // Stufe 1 | 2 | 3
     "satz": "Der Astronaut steuert seine Rakete zur Raumstation.",
     "f": [                        // GENAU 3 Fehler
       {
         "r": "Astronaut",         // richtig (genau so im Satz, kommt nur 1× vor, nie letztes Wort)
         "w": "Astronout",         // falsch (wird angezeigt)
         "o": ["Astronaut","Astronout","Astranaut","Asdronaut"], // 4 Optionen, genau eine == r
         "k": "b",                 // b = Buchstabe · g = Groß/klein · k = Komma
         "tipp": "Merksatz: ..."   // Stufe 1: Merksatz · Stufe 2/3: Regel
       }
     ]
   }
   ```

   Wichtigste Regeln:
   - **Stufe 1:** alle 3 Fehler `"b"` + **Merksatz**.
   - **Stufe 2:** mindestens 1 `"g"` + **Regel**.
   - **Stufe 3:** mindestens 1 `"k"` + **Regel**.
   - `"g"`: `r`/`w` unterscheiden sich **nur** in Groß/klein.
   - `"k"`: `r` endet mit Komma, `w` ohne – und der Satz enthält das Komma.
   - Inhalte: **lustig, kreativ, kindgerecht (8–14)**.

3. Datei prüfen, bis „✅ OK" erscheint:

   ```bash
   node scripts/selfcheck.mjs content/tiere.json
   ```

4. Korpus neu bauen und Tests laufen lassen:

   ```bash
   npm run build      # erzeugt saetze.js neu (mit Validierung & Statistik)
   npm test           # jsdom-Integration + Datenintegrität
   ```

5. **`saetze.js` mitcommitten** – die CI erzwingt, dass es aktuell ist.

## Neues Thema anlegen

1. Eintrag in `THEMEN` in `data.js` ergänzen: `{ id, name, emoji, farbe, gruppe }`
   (`gruppe` ist eine der IDs aus `GRUPPEN`).
2. Datei `content/<id>.json` mit den Sätzen anlegen (Schema oben).
3. `npm run build && npm test`.

## Neues Design (Skin)

1. Eintrag in `DESIGNS` in `data.js` ergänzen: `{ id, name, emoji, farbe }`.
2. In `styles.css` einen Block `.skin-<id> { --accent: …; … }` ergänzen.

## Neues Abzeichen

1. Eintrag in `ACHIEVEMENTS` in `data.js`: `{ id, name, emoji, stat, val, txt }`.
2. `stat` muss in `computeStats()` in `app.js` existieren.

## Stil
- UI-Sprache und Kommentare: **Deutsch**.
- Keine externen Laufzeit-Abhängigkeiten, kein Build-Schritt zum Spielen.
- Vor jedem Push: `npm run check && npm test` grün halten.
