# Promo audio — Italiano (`it`)

Spoken examples for the intro sheet.

Each language ships one clip bundled in the app at
`assets/intro-audio/intro-<lang>.m4a`, normalized to -16 LUFS so no language
is noticeably louder or quieter than another.

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

> Spiegami come arriva davvero la corrente dalla centrale fino alla mia cucina.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Comincio continuamente progetti che non finisco mai. Da cosa dipende, e cosa aiuta davvero?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> Mi hanno offerto un lavoro che paga di più, ma dovrei trasferirmi lontano dai miei amici. Aiutami a ragionarci.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Stasera cucino per sei persone e una non mangia latticini. Ragiona con me su cosa preparare.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Perché certe lingue hanno così tante parole per la stessa cosa?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Voiced by:** Alibaba Qwen `qwen3-tts-flash` — this is the clip the intro sheet plays.

**Prompt**

> Come funziona questa app?

**Answer** (452 words)

Tu parli, e Mr Broccoli trasforma quello che hai detto in testo, lo manda al modello che hai scelto e poi ti legge la risposta ad alta voce. Il ciclo è tutto qui. La differenza è che sei tu a decidere cosa sta nel mezzo, e niente di quella scelta ti viene nascosto.

Ci sono tre modi per alimentarlo, e sono compromessi davvero diversi, non livelli della stessa cosa.

Il primo è usare una chiave di un fornitore che hai già: OpenAI, Anthropic, Google e diversi altri. Ottieni i loro modelli migliori, gli stessi che avresti nelle loro app, e paghi direttamente loro per quello che usi. Mr Broccoli non tocca mai quei soldi e non ci aggiunge alcun ricarico.

Il secondo è scaricare modelli che girano interamente su questo telefono. La prima volta ci vuole un po' di tempo e di spazio, ma dopo non costa assolutamente nulla e funziona senza campo: in aereo, in metropolitana, ovunque. Questi modelli sono più piccoli di quelli ospitati online, quindi rendono meno sui ragionamenti difficili. L'app te lo dice, invece di fingere il contrario.

Il terzo è semplicemente la voce che il tuo telefono ha già, disponibile dal momento in cui installi l'app.

Puoi anche mescolarli. Un modello di punta che ragiona e la voce del tuo telefono che legge. Oppure un modello locale con una voce di qualità. Pensare e parlare sono scelte separate.

Sulla privacy, ecco la versione precisa invece di quella comoda. Le tue conversazioni restano su questo dispositivo, e non esiste alcun server di Mr Broccoli da nessuna parte. Nessun account, nessuna sincronizzazione, niente che possa essere violato. Però quando usi un modello ospitato online, quello che dici arriva a quel fornitore, alle sue condizioni, esattamente come nella sua app. Quello che questa app garantisce è che arrivi lì e da nessun'altra parte, e che tu possa vedere quale percorso ha risposto a ogni singolo messaggio.

L'ultima cosa che vale la pena sapere è che Mr Broccoli preferisce avere ragione piuttosto che essere veloce. La maggior parte degli assistenti vocali ti sposta in silenzio su un modello più debole perché la risposta arrivi prima, e tu non lo scopri mai. Questo no. Se chiedi una risposta ragionata, si prende il tempo che una risposta ragionata richiede, e ti mostra cosa sta facendo mentre lo fa: pensare, cercare, parlare. Invece di lasciarti con il silenzio e una rotellina che gira. Puoi interrompere quando vuoi. E puoi anche rifare la stessa domanda a un altro modello e confrontare le due risposte.

E niente di tutto questo è vincolante. Puoi cambiare fornitore, modello o voce in qualsiasi momento, anche a metà di una conversazione, e la conversazione prosegue semplicemente con la nuova scelta.

---
