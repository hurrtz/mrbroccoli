# Promo audio — Magyar (`hu`)

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

> Magyarázd el, hogyan jut el az áram valójában az erőműtől a konyhámig.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Folyton új dolgokba kezdek, és soha nem fejezem be őket. Miért van ez, és mi segít igazán?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> Kaptam egy jobban fizető állásajánlatot, de el kellene költöznöm a barátaimtól. Segíts végiggondolni.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Ma este hat emberre főzök, és az egyikük nem eszik tejterméket. Gondolkodj velem, mit készítsek.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Miért van némelyik nyelvben ennyi szó ugyanarra a dologra?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Prompt**

> Hogyan működik ez az alkalmazás?

**Answer** (393 words)

Beszélsz, a Mr Broccoli pedig szöveggé alakítja, amit mondtál, elküldi az általad választott modellnek, majd felolvassa neked a választ. Ennyi az egész kör. A különbség az, hogy te döntöd el, mi ül középen, és ebből a döntésből semmit nem rejtenek el előled.

Háromféleképpen hajthatod meg, és ezek valóban különböző kompromisszumok, nem ugyanannak a dolognak a szintjei.

Az első, hogy egy olyan szolgáltató kulcsát használod, amelyiknél már megvan: OpenAI, Anthropic, Google és több másik. A legjobb modelljeiket kapod, pontosan ugyanazokat, amiket a saját alkalmazásaikban kapnál, és közvetlenül nekik fizetsz azért, amit használsz. A Mr Broccoli soha nem nyúl ehhez a pénzhez, és nem tesz rá felárat.

A második, hogy letöltesz modelleket, amelyek teljes egészében ezen a telefonon futnak. Először eltart egy ideig, és helyet foglal, utána viszont egyáltalán nem kerül semmibe, és térerő nélkül is működik: repülőn, a metróban, bárhol. Ezek a modellek kisebbek a felhőben futóknál, így a nehéz gondolkodásban gyengébbek. Az alkalmazás ezt meg is mondja, ahelyett hogy az ellenkezőjét állítaná.

A harmadik egyszerűen az a hang, ami a telefonodban már benne van, és a telepítés pillanatától működik.

Ezeket keverheted is. Egy élvonalbeli modell gondolkodik, és a telefonod saját hangja olvassa fel. Vagy egy helyi modell egy igazán jó hanggal. A gondolkodás és a beszéd külön döntés.

Az adatvédelemről itt a pontos változat a kényelmes helyett. A beszélgetéseid ezen az eszközön maradnak, és sehol nincs Mr Broccoli-kiszolgáló. Nincs fiók, nincs szinkronizálás, nincs mit kiszivárogtatni. Amikor viszont felhős modellt használsz, amit mondasz, elmegy ahhoz a szolgáltatóhoz, az ő feltételei szerint, pontosan úgy, ahogy a saját alkalmazásában is elmenne. Amit ez az alkalmazás garantál, az az, hogy oda megy és sehova máshova, és hogy minden egyes üzenetnél látod, melyik útvonal válaszolt rá.

Az utolsó, amit érdemes tudni: a Mr Broccoli inkább pontos, mint gyors. A legtöbb hangasszisztens csendben átkapcsol egy gyengébb modellre, hogy a válasz hamarabb megérkezzen, és te sosem szerzel róla tudomást. Ez nem teszi ezt. Ha átgondolt választ kérsz, annyi időt vesz rá, amennyit egy átgondolt válasz igényel, és közben megmutatja, mit csinál éppen: gondolkodik, keres, beszél. Ahelyett hogy csenddel és egy pörgő ikonnal hagyna magadra. Bármikor félbeszakíthatod. És ugyanazt a kérdést fel is teheted újra egy másik modellnek, hogy a két választ összehasonlítsd.

És semmi ebből nincs kőbe vésve. A szolgáltatót, a modellt vagy a hangot bármikor lecserélheted, akár egy beszélgetés közepén is, és a beszélgetés egyszerűen folytatódik az új választással.

---
