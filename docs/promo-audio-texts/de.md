# Promo audio — Deutsch (`de`)

Spoken examples for the intro sheet.

Each language ships one clip as a store-hosted asset pack — Background
Assets on iOS, Play Asset Delivery on Android — fetched only when a user
asks to hear it. See
[`src/services/introAssetPacks/SPEC.md`](../../src/services/introAssetPacks/SPEC.md).

The first five prompts were each answered by a different frontier model, so
the set demonstrates range rather than one vendor. The sixth is written for
the app and is the one that ships in the intro sheet.

Conventions that matter once this is spoken aloud:

- The product name is **Mr Broccoli**, never "Mr. Broccoli". The period
  creates an unwanted pause in speech.
- Text is written for the ear: no lists, no markup, nothing that reads oddly
  when read out.
- Recordings are generated from the approved text here. Audio is invisible to
  a diff, so a mistranslation inside a clip cannot be caught by reading one —
  this file is where the wording gets reviewed.
- Word counts are not comparable across languages. Turkish and the Slavic
  languages say the same thing in far fewer, longer words than English; Hindi
  and Urdu in more. Match the spoken **duration** of the other clips, not the
  count — and do not pad a text to hit a number.

---

## 1. Electricity

**Model:** OpenAI `gpt-5.6-sol`

**Prompt**

> Erkläre mir, wie der Strom eigentlich vom Kraftwerk bis in meine Küche kommt.

**Answer** (411 words)

Vom Kraftwerk bis zu deiner Küche läuft Strom nicht wie Wasser durch ein einzelnes, festes Rohr. Das Stromnetz ist ein großes, vermaschtes System, in das viele Kraftwerke, Windräder und Solaranlagen gleichzeitig Energie einspeisen. Welche Anlage deine Kaffeemaschine konkret versorgt, lässt sich daher meist nicht eindeutig sagen.

In einem klassischen Kraftwerk treibt Dampf, Wasser oder Wind einen Generator an. Dieser erzeugt Wechselstrom. Solaranlagen erzeugen zunächst Gleichstrom, der durch einen Wechselrichter in netzkonformen Wechselstrom umgewandelt wird. In Deutschland wechselt dessen Richtung 50-mal pro Sekunde, also mit 50 Hertz.

Direkt am Kraftwerk liegt die Spannung typischerweise bei einigen zehntausend Volt. Ein Transformator erhöht sie für den Transport auf bis zu 380.000 Volt. Die hohe Spannung ist wichtig, weil bei gleicher Leistung dann weniger Strom fließen muss. Dadurch entstehen in den Leitungen deutlich geringere Wärmeverluste.

Über das Höchstspannungsnetz gelangt die Energie zu großen Umspannwerken. Dort wird die Spannung schrittweise reduziert, zunächst etwa auf 110.000 Volt und anschließend im regionalen Mittelspannungsnetz meist auf 10.000 bis 30.000 Volt. Eine Ortsnetzstation in deinem Viertel transformiert sie schließlich auf 400 beziehungsweise 230 Volt herunter.

Von dort führt ein Niederspannungskabel zu deinem Haus. Der Hausanschluss besitzt drei Außenleiter, umgangssprachlich Phasen genannt. Zwischen einem Außenleiter und dem Neutralleiter liegen 230 Volt; zwischen zwei Außenleitern sind es 400 Volt. Normale Steckdosen verwenden 230 Volt. Ein leistungsstarker Elektroherd wird häufig an alle drei Phasen angeschlossen, damit sich seine Last besser verteilt.

Im Haus läuft der Strom zuerst durch den Zähler und dann in den Sicherungskasten. Leitungsschutzschalter schützen Kabel vor Überlastung und Kurzschluss. Ein Fehlerstromschutzschalter, kurz FI oder RCD, schaltet sehr schnell ab, wenn Strom auf einem unerwünschten Weg abfließt, etwa über ein beschädigtes Gerät oder schlimmstenfalls über einen Menschen. Der Schutzleiter verbindet berührbare Metallteile mit dem Erdungssystem und hilft, solche Fehler sicher abzuschalten.

Wenn du in der Küche den Wasserkocher einschaltest, wird der Stromkreis geschlossen. Elektrische Energie gelangt über das elektromagnetische Feld praktisch sofort zum Gerät. Die einzelnen Elektronen rasen dabei nicht vom Kraftwerk bis zu dir, sondern bewegen sich im Wechselstromnetz nur langsam hin und her. Der Wasserkocher wandelt die elektrische Energie in Wärme um, und der Strom fließt über den Neutralleiter beziehungsweise bei Drehstrom über die anderen Phasen zurück.

Damit das alles stabil bleibt, müssen Erzeugung und Verbrauch zu jedem Zeitpunkt nahezu exakt übereinstimmen. Netzbetreiber regeln deshalb Kraftwerke, Speicher und flexible Verbraucher laufend nach. Ein sichtbares Maß dafür ist die Netzfrequenz: Sie soll möglichst genau bei 50 Hertz bleiben. So endet eine technisch erstaunlich komplexe Reise ganz unspektakulär an deiner Küchensteckdose.

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Ich fange ständig Projekte an und bringe sie nie zu Ende. Woran liegt das, und was hilft wirklich dagegen?

**Answer** (485 words)

Oh, das ist ein wunderbar gut erforschtes Phänomen! Der Kern liegt in deinem Dopaminsystem. Dopamin belohnt nämlich nicht das Erreichen von Zielen, sondern die Erwartung von Belohnung – Neurowissenschaftler nennen das Reward Prediction Error. Und die Anfangsphase eines Projekts ist reine Erwartung: Alles ist möglich, nichts ist noch mühsam. Sobald es konkret wird, flacht diese Kurve brutal ab.

Dazu kommt der Goal-Gradient-Effekt: Motivation steigt, je näher das Ziel rückt. Projekte haben also eine U-Kurve – hoch am Anfang, hoch kurz vorm Ende, und dazwischen liegt das berüchtigte messy middle, wo die meisten Projekte sterben. Du bist zu weit weg vom Neuheitskick und zu weit weg vom Ziel, als dass es dich ansaugen könnte.

Es gibt aber noch einen subtileren Mechanismus: Ein unfertiges Projekt ist unendliches Potenzial, ein fertiges ist kritisierbar. Fertigmachen heißt, sich dem Urteil auszusetzen, dem eigenen und dem von anderen. Wenn deine Sachen auffällig oft bei achtzig oder neunzig Prozent liegen bleiben, ist das dein eigentliches Thema, nicht mangelnde Motivation.

Und noch ein spannender Befund von Gabriele Oettingen: Positives Fantasieren über das fertige Ergebnis senkt die Motivation sogar, weil das Gehirn den Erfolg quasi schon vorwegkonsumiert. Das Träumen vom fertigen Roman ersetzt teilweise das Schreiben.

Deshalb ist der erste Schritt Diagnose. Sterben deine Projekte bei zwanzig Prozent, ist es das Dopamin-Neuheits-Problem. Sterben sie kurz vor Schluss, ist es Bewertungsangst. Liegen sie wild verstreut herum, hast du schlicht zu viele parallel laufen.

Was nachweislich hilft: Implementation Intentions, also konkrete Wenn-dann-Pläne. Die haben in Metaanalysen richtig ordentliche Effektstärken. Kombiniert mit Mental Contrasting nennt sich das WOOP – du stellst dir das Ziel vor, dann bewusst das Hindernis, und planst die Reaktion darauf. Das umgeht genau die Fantasie-Falle.

Zweitens: Definiere vorab knallhart, was fertig bedeutet, und schneide den Scope brutal runter auf die kleinste abschließbare Version. Fertigwerden ist ein trainierbarer Skill, und jedes abgeschlossene Ding baut die Identität als jemand, der Dinge zu Ende bringt.

Drittens, mein Lieblingswerkzeug: ein Work-in-Progress-Limit wie im Kanban. Nur ein aktives Projekt. Neue Ideen kommen in eine Ideenliste, nicht in die Umsetzung – so bekommt die glänzende neue Idee ihre Würdigung, ohne das laufende Projekt zu killen. Und ein Projekt bewusst zu beerdigen zählt übrigens auch als Abschluss.

Für das messy middle: der Hemingway-Trick. Hör mitten in einer Aufgabe auf, nicht an einem sauberen Endpunkt. Dann arbeitet der Zeigarnik-Effekt für dich statt gegen dich, weil das Unfertige dich zurückzieht. Dazu Fortschritt sichtbar machen – Teresa Amabiles Forschung zeigt, dass wahrgenommene kleine Fortschritte der stärkste Motivationstreiber im Alltag sind. Und externe Accountability, also öffentliches Commitment oder Deadlines mit echten Konsequenzen.

Eine ehrliche Nuance noch: Wenn dieses Muster sich durch alle Lebensbereiche zieht, seit der Kindheit, zusammen mit Konzentrations- und Organisationsproblemen, könnte auch ADHS eine Rolle spielen – das wäre einen professionellen Blick wert. Und manchmal ist Anfangen bei Hobbys einfach das eigentliche Hobby, was völlig legitim ist. Die Kunst ist, das von den Projekten zu trennen, die dir wirklich am Herzen liegen.

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> Mir wurde ein Job angeboten, der besser bezahlt ist, aber ich müsste wegziehen, weg von meinen Freunden. Hilf mir, das durchzudenken.

**Answer** (771 words)

Oh, das ist eine wunderbare Frage – eine klassische Zwickmühle zwischen zwei fundamentalen menschlichen Bedürfnissen: Sicherheit und Wachstum auf der einen Seite, Bindung und Zugehörigkeit auf der anderen. Lass uns das mal systematisch auseinandernehmen, wie ein Konstrukteur, der ein feinmechanisches Uhrwerk unter die Lupe nimmt – nur dass die Zahnräder hier aus Geld, Emotionen und Sozialkapital bestehen.

Fangen wir mit dem Offensichtlichen an, dem Geld. Ein höheres Gehalt klingt erstmal verlockend, aber du musst es nüchtern netto betrachten, abzüglich der Lebenshaltungskosten in der neuen Stadt. Was bringt dir ein Plus von zwanzig Prozent, wenn die Miete plötzlich vierzig Prozent höher ist? Pack die Umzugskosten, Kaution, vielleicht ein neues Auto oder andere versteckte Posten in deine Rechnung. Und dann die entscheidende Frage: Was machst du mit dem zusätzlichen Geld? Investierst du es in Freiheit – frühere Rente, Reisen, Hobbys? Oder verpufft es in einer teureren Umgebung und bringt dir unterm Strich keinen Zugewinn an Lebensqualität? Finanzielle Entscheidungen sind immer nur so gut wie der Zweck, dem sie dienen.

Jetzt zum eigentlich Spannenden: dein Sozialkapital. Freunde sind keine Bonus-Punkte im Lebensspiel, sondern ein massiver Faktor für psychische und physische Gesundheit. Die Harvard Study of Adult Development, eine der längsten Studien überhaupt, zeigt: Die Qualität unserer engen Beziehungen ist der stärkste Prädiktor für ein glückliches, langes Leben. Was du jetzt hast, sind gewachsene Bindungen – Menschen, die deine Geschichte kennen, bei denen du keine performative Energie aufwenden musst. Das ist eine Art emotionaler Grundsicherung, die dir Resilienz gegen Stress gibt. Wenn du das ersatzlos streichst, riskierst du Einsamkeit, und die ist toxisch auf neurologischer Ebene, sie erhöht Cortisol-Spiegel und Entzündungswerte im Körper.

Allerdings gibt es hier eine wichtige Unterscheidung: Wir haben nicht nur eine Art von Freundschaft. Der Soziologe Granovetter prägte das Konzept der starken und schwachen Bindungen. Deine engen Freunde sind die starken – die, die dich um drei Uhr morgens vom Flughafen abholen. Schwache Bindungen sind Bekanntschaften, ehemalige Kollegen, der Freund eines Freundes. Und ausgerechnet diese schwachen Bindungen sind es, die uns oft neue Jobs, Ideen und Gelegenheiten eröffnen. Ein Umzug zwingt dich, dein Netzwerk neu zu knüpfen, und das kann langfristig ein enormer Multiplikator für dein Sozial- und Karrierekapital sein – vorausgesetzt, du bist der Typ Mensch, der aktiv auf andere zugeht.

Kommen wir zur Psychologie der Veränderung. Unser Gehirn hat eine eingebaute Verlustaversion: Ein Verlust wird etwa doppelt so stark gewichtet wie ein gleichgroßer Gewinn. Das bedeutet, der drohende Verlust deiner vertrauten Umgebung und deiner Freunde fühlt sich massiver an, als die objektive Chance es vielleicht ist. Gleichzeitig ist der Mensch ein Meister der hedonischen Anpassung. Wir überschätzen die Dauer und Intensität von negativen Gefühlen nach einem Einschnitt. Du würdest wahrscheinlich ein halbes Jahr brauchen, um dich einzuleben, neue Routinen zu etablieren, erste lockere Bekanntschaften zu vertiefen. Dann normalisiert sich das emotionale Niveau wieder. Die Frage ist: Hältst du dieses halbe Jahr aus? Und hast du Strategien, um die Übergangszeit aktiv zu gestalten – zum Beispiel ein wöchentlicher Video-Call mit deinem engsten Freund, ein fester Besuchsrhythmus?

Und dann ist da der Karriere-Aspekt. Ist der Job nur besser bezahlt, oder bringt er dich auf eine ganz neue Entwicklungsstufe – mehr Verantwortung, spannendere Projekte, ein Netzwerk zu einflussreichen Leuten? Manchmal ist ein solcher Sprung weniger eine Frage des Geldes als eine Frage des zukünftigen Optionsraums. Wie Jeff Bezos seine Entscheidungen traf: Stell dir vor, du wärst achtzig Jahre alt und blickst zurück. Würdest du es mehr bereuen, den Job nicht genommen zu haben und das Abenteuer verpasst zu haben – oder würdest du die verlorene Zeit mit deinen Freunden betrauern? Dein Zukunfts-Ich hat vielleicht ganz andere Werte als dein heutiges.

Praktische Gedanken: Kannst du den Umzug als Experiment auf Zeit betrachten? Zwei Jahre, dann wird neu evaluiert? Das nimmt der Entscheidung die Endgültigkeit und reduziert den Druck. Deine Freundschaften sterben nicht automatisch, wenn du gehst. Aber sie verändern sich. Du wirst von den Alltagsanekdoten abgekoppelt, und das erfordert aktive Pflege. Manche Freunde werden sich als stabil erweisen, andere werden verblassen. Das ist ein schmerzhafter, aber auch reinigender Prozess, der dir zeigt, wer wirklich in dein Leben gehört.

Zum Schluss: Hör auf das Körpergefühl, das jenseits aller Pro-und-Contra-Listen liegt. Wenn du nachts wach liegst, in welcher der beiden Zukünfte spürst du ein leichtes Ziehen im Bauch – ein Ziehen, das sich mehr nach Aufregung als nach Furcht anfühlt? Oder ein flaues, beengendes Gefühl des Verlusts? Das limbische System rechnet oft präziser als der präfrontale Kortex, gerade bei Entscheidungen, die so tief in unseren Grundbedürfnissen verankert sind. Welcher Wert schwingt bei dir im Moment lauter mit: Geborgenheit oder Entdeckung? Beide sind legitim. Du musst nur wissen, welchem du in dieser Lebensphase den Vortritt gibst.

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Ich koche heute Abend für sechs Leute, und einer davon isst nichts mit Milchprodukten. Überleg mit mir, was ich machen könnte.

**Answer** (246 words)

Das ist die perfekte Gelegenheit, um über Aromenprofilierung und Emulsionen nachzudenken! Anstatt zu versuchen, klassische Molkereiprodukte mit oft enttäuschenden Ersatzstoffen zu imitieren, sollten wir auf Küchen setzen, die von Natur aus ohne Milchfette auskommen und ihre Cremigkeit und Tiefe über Pflanzenfette, Stärke und Umami aufbauen.

Eine geniale Option ist ein südostasiatisches Curry auf Kokosmilchbasis, zum Beispiel ein originales Massaman- oder Panang-Curry. Wenn du die Paste zuerst in der dicken Kokossahne anbrätst, bricht die Emulsion auf und löst die fettlöslichen Aromastoffe aus Schalotten, Galgant und Zitronengras optimal heraus. Die samtige Textur kommt von den mittelkettigen Triglyceriden der Kokosnuss, ergänzt durch stärkehaltige Kartoffeln und Röstaromen von gerösteten Erdnüssen.

Alternativ ist die mexikanische Küche fantastisch für sechs Personen. Denk an stundenlang geschmortes Carnitas oder Birria mit einer sämigen Salsa aus gerösteten Ancho- und Guajillo-Chilis. Statt Saure Sahne liefert eine reife Avocadocreme mit Limettensaft die frische Fettkomponente, während die Maillard-Reaktion des scharf angebratenen Fleisches für gewaltige Umami-Tiefe sorgt. Das lässt sich hervorragend vorbereiten und entspannt servieren.

Falls es eher levantinisch sein soll, funktioniert ein langsam geschmorter Lamm- oder Auberginen-Eintopf mit Tahini-Dressing hervorragend. Tahini ist eine reine Sesam-Emulsion, die mit Zitronensaft und etwas Eiswasser aufgeschlagen extrem cremig wird und geschmacklich viel komplexer ist als Sahne. Dazu geröstetes Wurzelgemüse und reichlich kaltgepresstes Olivenöl am Ende für ein großartiges Mundgefühl.

Mein Favorit für sechs Leute wäre die mexikanische Schmorvariante oder ein aromatisches Curry. Über reduzierten Fond, pflanzliche Emulsionen und Säure vermisst hier garantiert niemand die Milchprodukte. Welches Aromenprofil spricht dich am meisten an?

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Warum haben manche Sprachen so viele Wörter für ein und dieselbe Sache?

**Answer** (445 words)

Das ist eine richtig faszinierende Frage, und die Antwort steckt tief in der Geschichte, der Kultur und der Art, wie Menschen die Welt wahrnehmen und benennen.

Im Kern geht es oft um historische Schichtung. Viele Sprachen haben im Lauf der Zeit Wörter aus ganz unterschiedlichen Quellen aufgenommen. Englisch ist ein Klassiker dafür: Nach der normannischen Eroberung kamen massenhaft französische und lateinische Ausdrücke dazu, die neben den alten germanischen Wörtern weiterlebten. So hast du Paare wie freedom und liberty, oder begin und commence, die auf den ersten Blick dasselbe meinen, aber unterschiedliche Register, Herkunft und feine Konnotationen mitbringen. Die alten Wörter sterben nicht einfach aus, sie bleiben und füllen stilistische oder emotionale Nischen.

Dazu kommt die semantische Differenzierung. Was wir als „dieselbe Sache“ empfinden, ist für Sprecher oft gar nicht identisch. Es gibt Nuancen in Intensität, Perspektive, Formalität, emotionaler Färbung oder Kontext. Denk an die vielen deutschen Verben für Bewegungsarten oder an englische Wörter rund ums Gehen: walk, stroll, saunter, amble, stride, trudge. Jedes transportiert Tempo, Haltung, Absicht oder Stimmung mit. Sprachen speichern solche feinen Unterschiede, weil sie kommunikativ nützlich sind. Synonyme sind selten perfekte Zwillinge; meist tragen sie unterschiedliche Assoziationen, Gebrauchsfrequenzen oder Kollokationen.

Kulturelle Relevanz spielt eine riesige Rolle. Was einer Gesellschaft besonders wichtig ist, wird lexikalisch ausgebaut. In arabischen Dialekten gibt es traditionell sehr viele Bezeichnungen für Kamele, je nach Alter, Geschlecht, Zustand oder Verwendung. In japanischen und anderen ostasiatischen Sprachen findest du differenzierte Wörter für Reis in verschiedenen Stadien – roh, gekocht, als Pflanze und so weiter. Das berühmte Beispiel mit den angeblich hunderten Eskimo-Wörtern für Schnee ist übrigens stark übertrieben und ein linguistischer Mythos, aber das Prinzip dahinter stimmt: Wo Umwelt oder Alltag etwas zentral machen, entstehen feinere Kategorien und mehr Bezeichnungen. Es ist weniger „viele Wörter für dasselbe“ als „viele Wörter für das, was für uns unterscheidenswert ist“.

Dazu kommen Stil, Literatur, Tabus und soziale Variation. Dichter und Redner lieben Varianten, um Wiederholung zu vermeiden und Rhythmus oder Bildhaftigkeit zu erzeugen. Euphemismen und Tabuwörter erzeugen ständig neue Ausdrücke für heikle Themen wie Tod, Sex oder Körperfunktionen. Dialekte, Soziolekte und Fachsprachen liefern weitere Schichten. Und manchmal bleiben alte Wörter einfach aus Trägheit oder Prestigegründen neben neuen stehen.

Interessant ist auch der trade-off: Eine reiche Synonymik macht eine Sprache expressiv und stilistisch flexibel, kann aber Lernende und Übersetzer wahnsinnig machen, weil die feinen Unterschiede schwer zu greifen sind. Manche Sprachen tendieren eher zu Komposition und Ableitung – Deutsch liebt das mit seinen Zusammensetzungen – statt zu vielen unabhängigen Wurzeln, erreichen aber ähnliche Differenzierungstiefe.

Am Ende spiegelt dieser Reichtum wider, dass Sprache kein sauberes logisches System ist, sondern ein gewachsenes, lebendiges Gebilde voller Geschichte, Bedürfnissen und menschlicher Kreativität. Genau das macht sie so spannend.

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Voiced by:** Alibaba Qwen `qwen3-tts-flash` — this is the clip the intro sheet plays.

**Prompt**

> Wie funktioniert diese App eigentlich?

**Answer** (454 words)

Wenn du sprichst, wandelt Mr Broccoli das Gesagte in Text um, schickt es an das Modell, das du ausgewählt hast, und liest dir die Antwort vor. Das ist der ganze Ablauf. Der Unterschied liegt darin, dass du bestimmst, was in der Mitte sitzt — und dass nichts an dieser Entscheidung vor dir verborgen bleibt.

Es gibt drei Möglichkeiten, das Ganze anzutreiben, und das sind wirklich unterschiedliche Kompromisse und nicht einfach Abstufungen derselben Sache.

Die erste ist ein Schlüssel von einem Anbieter, bei dem du ohnehin schon bist — OpenAI, Anthropic, Google und einige andere. Du bekommst deren beste Modelle, dieselben wie in deren eigenen Apps, und du zahlst direkt dort für das, was du nutzt. Mr Broccoli fasst dieses Geld nie an und schlägt nichts drauf.

Die zweite sind Modelle, die du herunterlädst und die vollständig auf diesem Telefon laufen. Das dauert beim ersten Mal eine Weile und braucht Speicherplatz, aber danach kostet es überhaupt nichts mehr und funktioniert ganz ohne Empfang — im Flugzeug, in der U-Bahn, einfach überall. Diese Modelle sind kleiner als die gehosteten und damit schwächer, wenn es wirklich ums Denken geht. Die App sagt dir das, statt so zu tun, als wäre es anders.

Die dritte ist schlicht die Stimme, die dein Telefon schon mitbringt. Die funktioniert ab dem Moment, in dem du die App installierst.

Du kannst das auch mischen. Ein Spitzenmodell übernimmt das Denken, und die Stimme deines Telefons liest vor. Oder ein lokales Modell mit einer hochwertigen Stimme. Denken und Sprechen sind getrennte Entscheidungen.

Zum Thema Datenschutz die genaue Antwort statt der bequemen. Deine Gespräche liegen auf diesem Gerät, und es gibt nirgendwo einen Server von Mr Broccoli. Kein Konto, keine Synchronisierung, nichts, das gehackt werden könnte. Wenn du aber ein gehostetes Modell nutzt, geht das Gesagte an diesen Anbieter, zu dessen Bedingungen, genau wie in dessen eigener App. Was diese App garantiert, ist: Es geht dorthin und sonst nirgendwohin, und du kannst bei jeder einzelnen Nachricht sehen, welcher Weg sie beantwortet hat.

Und noch etwas ist wichtig: Mr Broccoli ist lieber richtig als schnell. Die meisten Sprachassistenten schalten dich still und leise auf ein schwächeres Modell um, damit die Antwort schneller kommt, und du erfährst nie davon. Diese App macht das nicht. Wenn du eine durchdachte Antwort willst, nimmt sie sich die Zeit, die eine durchdachte Antwort braucht — und sie zeigt dir dabei, was gerade passiert: denken, suchen, sprechen. Statt Stille und einem Ladekreis. Du kannst jederzeit unterbrechen. Und du kannst dieselbe Frage noch einmal an ein anderes Modell stellen und beide Antworten nebeneinander vergleichen.

Festgelegt bist du auf nichts davon. Du kannst Anbieter, Modell oder Stimme jederzeit wechseln, auch mitten im Gespräch — und das Gespräch läuft mit der neuen Wahl einfach weiter.

---
