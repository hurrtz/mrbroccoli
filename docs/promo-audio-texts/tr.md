# Promo audio — Türkçe (`tr`)

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

> Elektriğin santralden mutfağıma kadar gerçekte nasıl geldiğini anlat.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Sürekli bir şeylere başlayıp hiçbirini bitiremiyorum. Bu neden oluyor ve gerçekten ne işe yarıyor?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> Bana daha iyi maaşlı bir iş teklif edildi ama arkadaşlarımdan uzağa taşınmam gerekiyor. Bunu düşünmeme yardım et.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Bu akşam altı kişiye yemek yapıyorum ve biri süt ürünü yemiyor. Ne yapacağımı benimle birlikte düşün.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Neden bazı dillerde aynı şey için bu kadar çok kelime var?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Voiced by:** ElevenLabs `Eleven v3` — this is the clip the intro sheet plays.

**Prompt**

> Bu uygulama aslında nasıl çalışıyor?

**Answer** (343 words)

Sen konuşuyorsun, Mr Broccoli söylediğini metne çeviriyor, seçtiğin modele gönderiyor ve sonra cevabı sana sesli olarak okuyor. Döngünün tamamı bu. Farkı yaratan şey, ortada ne duracağına senin karar vermen ve bu kararla ilgili hiçbir şeyin senden gizlenmemesi.

Bunu çalıştırmanın üç yolu var ve bunlar gerçekten farklı tercihler, aynı şeyin kademeleri değil.

Birincisi, zaten sahip olduğun bir sağlayıcının anahtarını kullanmak: OpenAI, Anthropic, Google ve birkaçı daha. Onların en iyi modellerini, kendi uygulamalarında alacağın modellerin aynısını alıyorsun ve kullandığın kadarını doğrudan onlara ödüyorsun. Mr Broccoli o paraya hiç dokunmuyor ve üzerine hiçbir şey eklemiyor.

İkincisi, tamamen bu telefonda çalışan modelleri indirmek. İlk seferinde biraz zaman alıyor ve yer kaplıyor, ama sonrasında hiçbir şeye mal olmuyor ve şebeke olmadan da çalışıyor: uçakta, metroda, her yerde. Bu modeller buluttakilerden daha küçük, dolayısıyla zor akıl yürütmede daha zayıflar. Uygulama bunu sana açıkça söylüyor, aksini varmış gibi göstermiyor.

Üçüncüsü, telefonunun zaten sahip olduğu ses. Kurduğun andan itibaren çalışıyor.

Bunları karıştırabilirsin de. Düşünmeyi en iyi modellerden biri yapar, okumayı telefonunun kendi sesi. Ya da yerel bir model, gerçekten iyi bir sesle. Düşünmek ve konuşmak ayrı tercihler.

Gizlilik konusunda, rahat olanı değil kesin olanı söyleyeyim. Konuşmaların bu cihazda saklanıyor ve hiçbir yerde bir Mr Broccoli sunucusu yok. Hesap yok, senkronizasyon yok, sızabilecek bir şey yok. Ama bulut modeli kullandığında söylediklerin o sağlayıcıya gidiyor, onun koşullarıyla, tıpkı kendi uygulamasında gideceği gibi. Bu uygulamanın garantisi şu: oraya gidiyor ve başka hiçbir yere gitmiyor, ve her tek mesajda hangi yolun cevap verdiğini görebiliyorsun.

Bilmeye değer son şey: Mr Broccoli hızlı olmaktansa doğru olmayı tercih ediyor. Çoğu sesli asistan, cevap daha erken gelsin diye seni sessizce daha zayıf bir modele geçiriyor ve bunu hiç öğrenmiyorsun. Bu öyle yapmıyor. Düşünülmüş bir cevap istersen, düşünülmüş bir cevabın gerektirdiği süreyi alıyor ve bu sırada ne yaptığını sana gösteriyor: düşünüyor, arıyor, konuşuyor. Seni sessizlikle ve dönen bir simgeyle bırakmak yerine. İstediğin an sözünü kesebilirsin. Aynı soruyu başka bir modele tekrar sorup iki cevabı karşılaştırabilirsin de.

Ve bunların hiçbiri kalıcı değil. Sağlayıcıyı, modeli ya da sesi istediğin an değiştirebilirsin, konuşmanın ortasında bile, ve konuşma yeni seçimle olduğu gibi devam eder.

---
