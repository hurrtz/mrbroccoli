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
- Word counts are not comparable across languages. Turkish and the Slavic
  languages say the same thing in far fewer, longer words than English; Hindi
  and Urdu in more. Match the spoken **duration** of the other clips, not the
  count — and do not pad a text to hit a number.

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

**Answer** (367 words)

أنت تتحدث، ويحوّل Mr Broccoli ما قلته إلى نص، ويرسله إلى النموذج الذي اخترته، ثم يقرأ لك الإجابة بصوت مسموع. هذه هي الدورة كاملة. ما يصنع الفرق هو أنك من يقرر ما الذي يجلس في المنتصف، وأن لا شيء في هذا القرار يُخفى عنك.

هناك ثلاث طرق لتشغيله، وهي مفاضلات مختلفة فعلًا، لا مستويات للشيء نفسه.

الأولى أن تستخدم مفتاحًا من مزوّد لديك بالفعل: OpenAI وAnthropic وGoogle وعدد آخر. تحصل على أفضل نماذجهم، النماذج نفسها التي ستحصل عليها في تطبيقاتهم، وتدفع لهم مباشرة مقابل ما تستخدمه. لا يمسّ Mr Broccoli هذا المال أبدًا ولا يضيف عليه هامشًا.

الثانية أن تنزّل نماذج تعمل بالكامل على هذا الهاتف. يستغرق ذلك وقتًا في المرة الأولى ويشغل مساحة، لكنه بعد ذلك لا يكلّف شيئًا على الإطلاق ويعمل بلا تغطية: في الطائرة، في مترو الأنفاق، في أي مكان. هذه النماذج أصغر من المستضافة، لذا فهي أضعف في التفكير الصعب. والتطبيق يقول لك ذلك بدل أن يتظاهر بغير ذلك.

الثالثة هي ببساطة الصوت الموجود في هاتفك أصلًا، ويعمل منذ لحظة التثبيت.

ويمكنك المزج بينها. نموذج متقدّم يتولى التفكير، وصوت هاتفك نفسه يقرأ. أو نموذج محلي بصوت عالي الجودة. التفكير والكلام قراران منفصلان.

أما عن الخصوصية، فإليك الصيغة الدقيقة بدل المريحة. محادثاتك مخزّنة على هذا الجهاز، ولا يوجد خادم لـ Mr Broccoli في أي مكان. لا حساب، ولا مزامنة، ولا شيء يمكن تسريبه. لكن حين تستخدم نموذجًا مستضافًا، يذهب ما تقوله إلى ذلك المزوّد، وفق شروطه، تمامًا كما كان سيذهب في تطبيقه هو. ما يضمنه هذا التطبيق هو أنه يذهب إلى هناك ولا يذهب إلى أي مكان آخر، وأنك ترى عند كل رسالة أي مسار هو الذي أجاب عليها.

آخر ما يستحق أن تعرفه أن Mr Broccoli يفضّل أن يكون صائبًا على أن يكون سريعًا. معظم المساعدات الصوتية تنقلك بهدوء إلى نموذج أضعف كي تصل الإجابة أسرع، ولا تعرف أنت بذلك أبدًا. هذا لا يفعلها. إذا طلبت إجابة متأنية، فإنه يأخذ الوقت الذي تحتاجه الإجابة المتأنية، ويريك ما يفعله أثناء ذلك: يفكر، يبحث، يتكلم. بدل أن يتركك مع الصمت ودائرة تدور. ويمكنك المقاطعة في أي لحظة. ويمكنك أيضًا طرح السؤال نفسه مرة أخرى على نموذج آخر ومقارنة الإجابتين.

ولا شيء من هذا مثبّت عليك. يمكنك تغيير المزوّد أو النموذج أو الصوت في أي وقت، حتى في منتصف محادثة، وتستمر المحادثة ببساطة مع الاختيار الجديد.

---
