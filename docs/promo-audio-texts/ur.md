# Promo audio — اردو (`ur`)

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

> سمجھاؤ کہ بجلی اصل میں پاور اسٹیشن سے میرے باورچی خانے تک کیسے پہنچتی ہے۔

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> میں مسلسل نئے کام شروع کرتا ہوں اور کبھی مکمل نہیں کرتا۔ ایسا کیوں ہوتا ہے، اور واقعی کیا مدد دیتا ہے؟

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> مجھے زیادہ تنخواہ والی نوکری کی پیشکش ہوئی ہے، لیکن مجھے دوستوں سے دور منتقل ہونا پڑے گا۔ اس پر سوچنے میں میری مدد کرو۔

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> آج رات میں چھ لوگوں کے لیے کھانا بنا رہا ہوں، اور ان میں سے ایک دودھ سے بنی چیزیں نہیں کھاتا۔ میرے ساتھ سوچو کہ کیا بناؤں۔

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> کچھ زبانوں میں ایک ہی چیز کے لیے اتنے سارے الفاظ کیوں ہوتے ہیں؟

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Prompt**

> یہ ایپ اصل میں کام کیسے کرتی ہے؟

**Answer**

_Not generated yet._

---
