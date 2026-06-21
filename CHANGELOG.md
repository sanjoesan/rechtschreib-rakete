# Änderungsprotokoll

Alle nennenswerten Änderungen an **Rechtschreib-Rakete 🚀**.
Format orientiert an [Keep a Changelog](https://keepachangelog.com/de/).

## [1.1.0] – 2026-06-21

### Geändert
- **Design-Auswahl ist jetzt prominent**: direkt auf der Startseite sowie über ein neues 🎨-Symbol in der Kopfzeile (jederzeit, auch im Spiel). Vorher war sie in den Einstellungen versteckt.
- Nach dem Lösen scrollt der Bildschirm automatisch zu den Buttons („Nächster Satz"), damit es flüssig weitergeht.

### Behoben (Inhaltsqualität)
- Buchstabenfehler, deren angezeigte Falschschreibung in Wahrheit ein **echtes deutsches Wort** war (nur eine andere Zeitform/Beugung oder ein gleich geschriebenes anderes Wort, z. B. `klopften` statt `klopfen`, `offen` statt `Ofen`, `fiel` statt `viel`, `kriegt` statt `kriecht`, `Uhrzeit` statt `Urzeit`), wurden durch klare Falschschreibungen ersetzt. So ist jeder Fehler ein echter Rechtschreibfehler.
- Neue QA-Werkzeuge: `scripts/grammar-check.mjs` und `scripts/realword-check.mjs` (letzteres prüft mit einer Wortform-Frequenzliste, ob ein „falsches" Wort in Wahrheit ein echtes Wort ist).

## [1.0.0] – 2026-06-21

### Erste Veröffentlichung 🎉
- **Spielprinzip:** pro Satz genau 3 Rechtschreibfehler – Phase 1 finden, Phase 2 aus 4 Vorschlägen die richtige Schreibweise wählen.
- **3 Schwierigkeitsstufen:**
  - Stufe 1 – nur Buchstabenfehler, gelöst mit **Merksätzen**.
  - Stufe 2 – zusätzlich Groß-/Kleinschreibung, erklärt mit **Regeln**.
  - Stufe 3 – zusätzlich Beistriche (Kommas), erklärt mit **Regeln**.
- **2088 Sätze** aus **58 Themenwelten** (Märchen, Weltraum, Tiere, Geschichte, Landwirtschaft, Zauberwesen, Science-Fiction, Piraten, Dinosaurier u. v. m.).
- **Lernfortschritt:** XP, Spieler-Level, Sterne, Tages-Serie, gemeisterte Themen.
- **60 Abzeichen** zum Freischalten.
- **13 Design-Skins** (Weltraum, Tierwald, Feenzauber, Tiefsee, Dschungel, Ritterburg, Zuckerwelt, Roboterfabrik, Dino-Land, Regenbogen, Drachenhöhle, Sternennacht).
- Soundeffekte, optionales Vorlesen (Sprachausgabe), Konfetti, voll responsiv, Fortschritt lokal im Browser (`localStorage`).
- **Technik:** Vanilla JS ohne Build-Schritt, jsdom-Integrationstests, GitHub-Actions-CI, Deployment auf GitHub Pages.

## Geplant / Ideen
- Druckbare Arbeitsblätter pro Thema.
- Eltern-/Lehrer-Modus mit Wortlisten nach Klassenstufe.
- Mehr Sätze pro Thema und weitere Themenwelten.
- Tägliche Übungs-Challenge.
