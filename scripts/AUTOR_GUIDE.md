# Autor-Guide — Rechtschreib-Rakete 🚀

Du schreibst Übungssätze für ein deutsches Rechtschreib-Lernspiel für **Kinder von 8 bis 14 Jahren**.

## So funktioniert das Spiel
Dem Kind wird ein Satz gezeigt, in dem **GENAU 3 Wörter falsch geschrieben** sind. Das Kind findet zuerst die 3 Fehler und wählt dann zu jedem aus **4 Vorschlägen** die richtige Schreibweise. **Du schreibst den KORREKTEN Satz** und beschreibst die 3 Fehler dazu.

## Die 3 Stufen
- **Stufe 1 (`s:1`)**: NUR Buchstabenfehler (Art `"b"`). Alle 3 Fehler sind `"b"`. Tipp = ein **MERKSATZ** (Eselsbrücke), beginnt mit `Merksatz: `.
- **Stufe 2 (`s:2`)**: Buchstabenfehler (`"b"`) UND Groß-/Kleinschreibung (`"g"`). **Mindestens 1 `"g"`** pro Satz. Tipp = die **REGEL**, beginnt mit `Regel: `.
- **Stufe 3 (`s:3`)**: `"b"`, `"g"` UND Beistrich/Komma (`"k"`). **Mindestens 1 `"k"`** pro Satz. Tipp = die **REGEL**, beginnt mit `Regel: `.

## Daten-Schema (ein Eintrag im JSON-Array)
```
{"s":1,"satz":"<korrekter Satz>","f":[ <genau 3 Fehler-Objekte> ]}
```
Jedes Fehler-Objekt:
```
{"r":"<richtig>","w":"<falsch>","o":["..4 Optionen.."],"k":"b|g|k","tipp":"<Merksatz oder Regel>"}
```

## STRENGE REGELN (sonst wird der Eintrag automatisch verworfen!)
1. `satz` ist **korrekt** geschrieben, beginnt groß, endet mit `.` `!` oder `?`.
2. **GENAU 3** Fehler-Objekte pro Satz.
3. `r` ist das richtige Wort **EXAKT so, wie es als ganzes Wort (durch Leerzeichen getrennt) im Satz steht**. Es muss **GENAU EINMAL** im Satz vorkommen. Die 3 `r` sind **verschiedene** Wörter.
4. Setze ein Fehlerwort **NIE als LETZTES Wort** des Satzes (es trägt sonst den Schlusspunkt).
5. Wähle als Fehlerwörter **keine winzigen Allerweltswörter** wie der/die/das/und/ist/ein – nimm echte, **typische Stolperwörter**.
6. `o` hat **4 verschiedene** Einträge; **GENAU EINER** ist exakt gleich `r`. Die anderen 3 sind glaubhafte falsche Schreibweisen.
7. Art `"b"` (Buchstabe): `r` und `w` unterscheiden sich in **Buchstaben** (NICHT nur Groß/klein). Beispiel `r:"Fahrrad"`, `w:"Farrad"`.
8. Art `"g"` (Groß/klein): `r` und `w` unterscheiden sich **NUR** in der Groß-/Kleinschreibung. Beispiel `r:"Hund"`, `w:"hund"`. (Komplett kleingeschrieben sind beide identisch.)
9. Art `"k"` (Komma): `r` enthält ein **angehängtes Komma**, `w` ist dasselbe Wort **OHNE** Komma. Beispiel `r:"Hund,"`, `w:"Hund"`. Der `satz` MUSS das Wort **mit** Komma enthalten (z.B. `... der Hund, der bellt ...`). Optionen z.B. `["Hund,","Hund","Hund;","Hund."]`.
10. `tipp`: Stufe 1 → `Merksatz: ...`; Stufe 2/3 → `Regel: ...`. Kurz, kindgerecht, **fachlich korrekt**.
11. **Gültiges JSON**: doppelte Anführungszeichen für Strings. In Tipps/Texten **KEINE doppelten Anführungszeichen** – benutze 'einfache'. Kein Komma hinter dem letzten Element.
12. Inhalt: **lustig, kreativ, kindgerecht**, zum Thema passend, abwechslungsreich. Keine Gewalt/Angst/unpassende Inhalte.

## GOLD-BEISPIELE

**Stufe 1** (alle `"b"`, Merksätze):
```json
{"s":1,"satz":"Der hungrige Drache verschluckt aus Versehen einen ganzen Heißluftballon.","f":[
 {"r":"hungrige","w":"hungrieche","o":["hungrige","hungrieche","hungerige","hungrigge"],"k":"b","tipp":"Merksatz: In 'hungrig' steckt der 'Hunger' – mit u und g."},
 {"r":"verschluckt","w":"ferschluckt","o":["verschluckt","ferschluckt","verschlukt","verschlukd"],"k":"b","tipp":"Merksatz: 'ver-' schreibt man immer mit v, wie in 'verstecken'."},
 {"r":"Heißluftballon","w":"Heißluftbalon","o":["Heißluftballon","Heißluftbalon","Heisluftballon","Heißluftballoon"],"k":"b","tipp":"Merksatz: Der Ballon braucht doppel-L: Bal-lon."}
]}
```

**Stufe 2** (`"b"` + `"g"`, mind. 1 `"g"`, Regeln):
```json
{"s":2,"satz":"Am Sonntag backt die freundliche Hexe einen riesigen Kürbiskuchen.","f":[
 {"r":"Hexe","w":"hexe","o":["Hexe","hexe","Hekse","hekse"],"k":"g","tipp":"Regel: Namenwörter (Nomen) schreibt man groß – 'die Hexe' steht mit dem Begleiter 'die'."},
 {"r":"riesigen","w":"risigen","o":["riesigen","risigen","riesiegen","riessigen"],"k":"b","tipp":"Regel: 'riesig' schreibt man mit ie (langes i)."},
 {"r":"backt","w":"Backt","o":["backt","Backt","bakt","backd"],"k":"g","tipp":"Regel: Tunwörter (Verben) wie 'backen' schreibt man klein."}
]}
```

**Stufe 3** (`"b"` + `"g"` + `"k"`, mind. 1 `"k"`, Regeln):
```json
{"s":3,"satz":"Der Pirat sucht einen Schatz, weil er eine alte Schatzkarte gefunden hat.","f":[
 {"r":"Schatz,","w":"Schatz","o":["Schatz,","Schatz","Schatz;","Schatz."],"k":"k","tipp":"Regel: Vor einem Nebensatz mit 'weil' steht ein Komma."},
 {"r":"Schatzkarte","w":"Schazkarte","o":["Schatzkarte","Schazkarte","Schatzkahrte","Schatzkharte"],"k":"b","tipp":"Regel: Nach kurzem Vokal steht oft tz: Scha-tz."},
 {"r":"alte","w":"Alte","o":["alte","Alte","allte","alde"],"k":"g","tipp":"Regel: Wiewörter (Adjektive) wie 'alt' schreibt man klein."}
]}
```

## FEHLERWORT-SPICKZETTEL (nutze solche typischen Stolperwörter)
- **Doppelmitlaute**: kommen, immer, Sonne, rennen, Wasser, Mutter, Koffer, Teller, Pfanne, Schritt, Brille, hoffen, Suppe, Ratte.
- **ie**: viel, fliegen, Spiegel, Riese, Wiese, tief, Brief, sieben, vielleicht, niesen, Liebe, Ziel.
- **Dehnungs-h**: gehen, sehen, nehmen, Zahn, Uhr, fahren, wohnen, Stuhl, fröhlich, Sahne, Mühle, Bahn.
- **ä/äu** (von a/au): Bäcker, Wäsche, Häuser, träumen, läuft, Bäume, Hände, Käse, räumen.
- **v statt f / ver-/vor-**: Vogel, Vater, viel, voll, Vase, verlieren, vergessen, verstecken, Vormittag.
- **s/ss/ß**: Straße, Fuß, groß, müssen, Fluss, beißen, heißen, draußen, Schloss, Wasser, Nuss.
- **chs/x**: Fuchs, sechs, wachsen, Hexe, Taxi, Büchse.
- **tz/z, ck/k**: Katze, Platz, Mütze, Blitz, sitzen, Zucker, Brücke, Glück, schmecken, dick, Stück, backen.
- **pf/qu**: Apfel, Pferd, Kopf, Pflanze, hüpfen, Quelle, Qualle, bequem, Quark, quaken.
- **Knifflige**: plötzlich, ziemlich, Geschichte, Fenster, Spinne, gewöhnlich, eigentlich, normalerweise.

## GROSS/KLEIN-HILFEN (für `"g"`)
- **Nomen** (mit Begleiter der/die/das/ein/mein...) → **groß**: Hund, Baum, Freude, König.
- **Nominalisierung** → groß: das Laufen, beim Spielen, etwas Schönes, nichts Neues, das Wichtigste.
- **Verben** → klein: laufen, spielen, lachen, fliegen.
- **Adjektive** → klein (außer Satzanfang): schön, schnell, rot, wild, mutig.

## KOMMA-REGELN (für Stufe 3, jeder Satz braucht mind. 1 `"k"`-Fehler)
- **Aufzählung**: Komma zwischen den Gliedern, NICHT vor 'und'/'oder'. (`r` = das Wort vor dem Komma, also z.B. `"Äpfel,"`)
- Vor **'aber', 'sondern', 'doch', 'denn'**: Komma davor.
- Vor **Nebensatz** mit 'weil', 'dass', 'damit', 'obwohl', 'wenn', 'als', 'ob', 'bevor', 'nachdem': Komma davor.
- **Relativsatz** mit 'der/die/das/welcher': Komma davor (und dahinter).
- **Vorangestellter Nebensatz** ('Wenn ..., dann ...'): Komma nach dem Nebensatz.

## DEINE AUFGABE
Erzeuge für **jedes** zugewiesene Thema **36 Sätze**: **12 auf Stufe 1, 12 auf Stufe 2, 12 auf Stufe 3**. Alle Sätze passen zum Thema und wiederholen sich nicht.

Schreibe pro Thema **eine** Datei mit dem **Write-Tool** nach:
```
E:\Deutsch\content\<id>.json
```
Inhalt = **ein einziges JSON-Array** mit den 36 Einträgen (**ohne** `t`-Feld).

## PFLICHT-QUALITÄTSKONTROLLE
Führe nach dem Schreiben für **jede** Datei aus:
```
node E:\Deutsch\scripts\selfcheck.mjs E:\Deutsch\content\<id>.json
```
Wenn Probleme gemeldet werden, **korrigiere die Datei und prüfe erneut**, bis `✅ OK` mit 36 Sätzen (12/12/12) erscheint. Erst dann bist du fertig.

Antworte am Ende NUR mit einer kurzen Zusammenfassung (pro Thema: Anzahl Sätze + OK-Status).
