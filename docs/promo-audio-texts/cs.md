# Promo audio — Čeština (`cs`)

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

> Vysvětli mi, jak se elektřina vlastně dostane z elektrárny až do mojí kuchyně.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Pořád začínám projekty a nikdy je nedokončím. Čím to je a co doopravdy pomáhá?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> Nabídli mi lépe placenou práci, ale musel bych se odstěhovat daleko od přátel. Pomoz mi to promyslet.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Dnes večer vařím pro šest lidí a jeden z nich nejí mléčné výrobky. Promysli se mnou, co udělat.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Proč mají některé jazyky tolik slov pro jednu a tutéž věc?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Voiced by:** ElevenLabs `Eleven v3` — this is the clip the intro sheet plays.

**Prompt**

> Jak vlastně tahle aplikace funguje?

**Answer** (394 words)

Ty mluvíš a Mr Broccoli převede to, co jsi řekl, na text, pošle to modelu, který sis vybral, a pak ti odpověď přečte nahlas. To je celá smyčka. Rozdíl je v tom, že o tom, co sedí uprostřed, rozhoduješ ty, a nic z toho rozhodnutí se před tebou neskrývá.

Pohánět to jde třemi způsoby, a jsou to opravdu různé kompromisy, ne stupně téhož.

První je použít klíč od poskytovatele, kterého už máš: OpenAI, Anthropic, Google a několik dalších. Dostaneš jejich nejlepší modely, ty samé, které bys měl v jejich vlastních aplikacích, a platíš přímo jim za to, co spotřebuješ. Mr Broccoli se těch peněz nikdy nedotkne a nic si nepřirazí.

Druhý je stáhnout modely, které běží celé v tomhle telefonu. Poprvé to chvíli trvá a zabere to místo, ale potom to nestojí vůbec nic a funguje to bez signálu: v letadle, v metru, kdekoli. Tyhle modely jsou menší než ty v cloudu, takže na složité uvažování stačí hůř. Aplikace ti to řekne, místo aby předstírala opak.

Třetí je prostě hlas, který tvůj telefon už má, a funguje od chvíle, kdy aplikaci nainstaluješ.

Můžeš to i míchat. Špičkový model přemýšlí a hlas tvého telefonu předčítá. Nebo lokální model s kvalitním hlasem. Přemýšlení a mluvení jsou oddělená rozhodnutí.

K soukromí, tady je přesná verze místo té pohodlné. Tvoje konverzace zůstávají v tomhle zařízení a nikde neexistuje žádný server Mr Broccoli. Žádný účet, žádná synchronizace, nic, co by mohlo uniknout. Když ale použiješ cloudový model, to, co řekneš, jde k tomu poskytovateli, za jeho podmínek, přesně tak, jako by šlo v jeho vlastní aplikaci. Co tahle aplikace zaručuje, je, že to jde tam a nikam jinam, a že u každé jednotlivé zprávy vidíš, která cesta ji zodpověděla.

Poslední věc, kterou stojí za to vědět, je, že Mr Broccoli je radši přesný než rychlý. Většina hlasových asistentů tě potichu přepne na slabší model, aby odpověď přišla dřív, a ty se to nikdy nedozvíš. Tenhle to nedělá. Když chceš promyšlenou odpověď, vezme si na ni čas, který promyšlená odpověď potřebuje, a přitom ti ukazuje, co zrovna dělá: přemýšlí, hledá, mluví. Místo aby tě nechal s tichem a točícím se kolečkem. Přerušit můžeš kdykoli. A stejnou otázku můžeš položit znovu jinému modelu a obě odpovědi porovnat.

A nic z toho není napevno. Poskytovatele, model i hlas můžeš změnit kdykoli, klidně uprostřed rozhovoru, a rozhovor prostě pokračuje s tou novou volbou.

---
