# Promo audio — العربية (`ar`)

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

> اشرح لي كيف تصل الكهرباء فعليًا من محطة التوليد إلى مطبخي.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> أبدأ مشاريع باستمرار ولا أنهيها أبدًا. لماذا يحدث ذلك، وما الذي يساعد فعلًا؟

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> عُرضت عليّ وظيفة براتب أعلى، لكن عليّ الانتقال بعيدًا عن أصدقائي. ساعدني في التفكير في الأمر.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> أطبخ الليلة لستة أشخاص، وأحدهم لا يأكل منتجات الألبان. فكّر معي فيما يمكنني تحضيره.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> لماذا تملك بعض اللغات كل هذه الكلمات للشيء نفسه؟

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Prompt**

> كيف يعمل هذا التطبيق فعليًا؟

**Answer**

_Not generated yet._

---
