# Promo audio — हिन्दी (`hi`)

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

---

## 1. Electricity

**Model:** OpenAI `gpt-5.6-sol`

**Prompt**

> समझाओ कि बिजली असल में पावर स्टेशन से मेरी रसोई तक कैसे पहुँचती है।

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> मैं लगातार नए काम शुरू करता हूँ और कभी पूरे नहीं करता। ऐसा क्यों होता है, और सच में क्या मदद करता है?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> मुझे ज़्यादा तनख़्वाह वाली नौकरी मिली है, लेकिन दोस्तों से दूर जाना पड़ेगा। इस पर सोचने में मेरी मदद करो।

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> आज रात मैं छह लोगों के लिए खाना बना रहा हूँ, और उनमें से एक दूध से बनी चीज़ें नहीं खाता। मेरे साथ सोचो कि क्या बनाऊँ।

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> कुछ भाषाओं में एक ही चीज़ के लिए इतने सारे शब्द क्यों होते हैं?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Prompt**

> यह ऐप असल में काम कैसे करता है?

**Answer**

_Not generated yet._

---
