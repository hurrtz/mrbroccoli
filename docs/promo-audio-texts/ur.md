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
- Word counts are not comparable across languages. Turkish and the Slavic
  languages say the same thing in far fewer, longer words than English; Hindi
  and Urdu in more. Match the spoken **duration** of the other clips, not the
  count — and do not pad a text to hit a number.

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

**Answer** (564 words)

تم بولتے ہو، اور Mr Broccoli جو تم نے کہا اسے متن میں بدلتا ہے، اسے اُس ماڈل کو بھیجتا ہے جو تم نے منتخب کیا، اور پھر جواب تمہیں بلند آواز میں پڑھ کر سناتا ہے۔ پورا عمل بس یہی ہے۔ فرق یہ ہے کہ درمیان میں کیا ہوگا، اس کا فیصلہ تم کرتے ہو، اور اس فیصلے کی کوئی بات تم سے چھپائی نہیں جاتی۔

اسے چلانے کے تین طریقے ہیں، اور یہ واقعی الگ الگ سمجھوتے ہیں، ایک ہی چیز کے درجے نہیں۔

پہلا یہ کہ کسی ایسے فراہم کنندہ کی کلید استعمال کرو جو تمہارے پاس پہلے سے ہے: OpenAI، Anthropic، Google اور کئی دوسرے۔ تمہیں ان کے بہترین ماڈل ملتے ہیں، وہی جو ان کی اپنی ایپس میں ملتے، اور جو تم استعمال کرتے ہو اس کی ادائیگی براہِ راست انہی کو کرتے ہو۔ Mr Broccoli اس رقم کو کبھی ہاتھ نہیں لگاتا اور اس پر کچھ اضافی نہیں لیتا۔

دوسرا یہ کہ ایسے ماڈل ڈاؤن لوڈ کرو جو مکمل طور پر اسی فون پر چلتے ہیں۔ پہلی بار اس میں کچھ وقت لگتا ہے اور جگہ درکار ہوتی ہے، لیکن اس کے بعد اس کا کوئی خرچ نہیں اور یہ بغیر سگنل کے بھی چلتا ہے: جہاز میں، زیرِ زمین ٹرین میں، کہیں بھی۔ یہ ماڈل آن لائن والوں سے چھوٹے ہیں، اس لیے مشکل سوچ بچار میں کمزور ہیں۔ ایپ تمہیں یہ صاف بتا دیتی ہے، اس کے برعکس ظاہر نہیں کرتی۔

تیسرا محض وہ آواز ہے جو تمہارے فون میں پہلے سے موجود ہے، اور انسٹال کرتے ہی کام کرتی ہے۔

تم ان کو ملا بھی سکتے ہو۔ ایک اعلیٰ ماڈل سوچے، اور تمہارے اپنے فون کی آواز پڑھ کر سنائے۔ یا مقامی ماڈل کے ساتھ ایک عمدہ آواز۔ سوچنا اور بولنا الگ الگ فیصلے ہیں۔

رازداری کے بارے میں، آسان بات کے بجائے درست بات یہ ہے۔ تمہاری گفتگو اسی آلے پر محفوظ رہتی ہے، اور Mr Broccoli کا کوئی سرور کہیں موجود نہیں۔ کوئی اکاؤنٹ نہیں، کوئی مطابقت پذیری نہیں، کچھ ایسا نہیں جو لیک ہو سکے۔ لیکن جب تم آن لائن ماڈل استعمال کرتے ہو تو جو تم کہتے ہو وہ اُس فراہم کنندہ تک جاتا ہے، اُس کی شرائط پر، بالکل ویسے ہی جیسے اُس کی اپنی ایپ میں جاتا۔ یہ ایپ جس بات کی ضمانت دیتی ہے وہ یہ ہے کہ وہ وہیں جاتا ہے اور کہیں اور نہیں، اور یہ کہ ہر ایک پیغام پر تم دیکھ سکتے ہو کہ کس راستے نے اس کا جواب دیا۔

آخری بات جو جاننے کے قابل ہے: Mr Broccoli تیز ہونے کے بجائے درست ہونے کو ترجیح دیتا ہے۔ زیادہ تر صوتی معاون خاموشی سے تمہیں کمزور ماڈل پر منتقل کر دیتے ہیں تاکہ جواب جلد آئے، اور تمہیں کبھی خبر نہیں ہوتی۔ یہ ایسا نہیں کرتا۔ اگر تم سوچا سمجھا جواب مانگو تو یہ اتنا وقت لیتا ہے جتنا ایسے جواب کو درکار ہے، اور اس دوران تمہیں دکھاتا رہتا ہے کہ وہ کیا کر رہا ہے: سوچ رہا ہے، تلاش کر رہا ہے، بول رہا ہے۔ خاموشی اور گھومتے ہوئے دائرے کے بجائے۔ تم جب چاہو ٹوک سکتے ہو۔ اور وہی سوال دوبارہ کسی دوسرے ماڈل سے پوچھ کر دونوں جواب موازنہ بھی کر سکتے ہو۔

اور ان میں سے کوئی چیز مستقل نہیں۔ تم فراہم کنندہ، ماڈل یا آواز کسی بھی وقت بدل سکتے ہو، گفتگو کے بیچ میں بھی، اور گفتگو نئی پسند کے ساتھ بس چلتی رہتی ہے۔

---
