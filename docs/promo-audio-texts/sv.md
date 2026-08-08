# Promo audio — Svenska (`sv`)

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

> Förklara hur elen faktiskt tar sig från kraftverket ända in i mitt kök.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Jag börjar hela tiden med projekt som jag aldrig avslutar. Varför blir det så, och vad hjälper egentligen?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> Jag har fått ett jobberbjudande med bättre lön, men jag skulle behöva flytta långt bort från mina vänner. Hjälp mig tänka igenom det.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Jag lagar mat till sex personer i kväll och en av dem äter inte mejeriprodukter. Tänk med mig kring vad jag ska göra.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Varför har vissa språk så många ord för samma sak?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Voiced by:** ElevenLabs `Eleven v3` — this is the clip the intro sheet plays.

**Prompt**

> Hur fungerar den här appen egentligen?

**Answer** (461 words)

Du pratar, och Mr Broccoli gör om det du sagt till text, skickar det till modellen du valt och läser sedan upp svaret för dig. Det är hela loopen. Det som skiljer är att du bestämmer vad som sitter i mitten, och att ingenting med det valet döljs för dig.

Det finns tre sätt att driva den, och det är genuint olika avvägningar, inte nivåer av samma sak.

Det första är att använda en nyckel från en leverantör du redan har: OpenAI, Anthropic, Google och flera andra. Du får deras bästa modeller, samma som du skulle få i deras egna appar, och du betalar dem direkt för det du använder. Mr Broccoli rör aldrig de pengarna och lägger inget påslag på dem.

Det andra är att ladda ner modeller som körs helt på den här telefonen. Första gången tar det en stund och lite lagring, men efteråt kostar det ingenting alls och fungerar utan täckning: på ett flygplan, i tunnelbanan, var som helst. De här modellerna är mindre än de som körs i molnet, så de är svagare på svårt resonemang. Appen säger det rakt ut i stället för att låtsas något annat.

Det tredje är helt enkelt rösten din telefon redan har, tillgänglig från stunden du installerar.

Du kan blanda dem. En toppmodell som tänker, och telefonens egen röst som läser upp. Eller en lokal modell med en riktigt bra röst. Att tänka och att tala är separata val.

När det gäller integritet, här kommer den exakta versionen i stället för den bekväma. Dina samtal sparas på den här enheten, och det finns ingen Mr Broccoli-server någonstans. Inget konto, ingen synkronisering, ingenting som kan läcka. Men när du använder en molnmodell går det du säger till den leverantören, på deras villkor, precis som det skulle göra i deras egen app. Det appen garanterar är att det går dit och ingen annanstans, och att du kan se vilken väg som besvarade varje enskilt meddelande.

Det sista värt att veta är att Mr Broccoli hellre har rätt än är snabb. De flesta röstassistenter växlar tyst över dig till en svagare modell så att svaret kommer fortare, och du får aldrig veta om det. Den här gör inte det. Ber du om ett genomtänkt svar tar den den tid ett genomtänkt svar kräver, och den visar vad den håller på med under tiden: tänker, söker, talar. I stället för att lämna dig med tystnad och en snurrande symbol. Du kan avbryta när du vill. Du kan också ställa samma fråga igen till en annan modell och jämföra de två svaren.

Och ingenting av det här är låst. Du kan byta leverantör, modell eller röst när som helst, till och med mitt i ett samtal, och samtalet fortsätter helt enkelt med det nya valet.

---
