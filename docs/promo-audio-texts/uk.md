# Promo audio — Українська (`uk`)

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

> Поясни, як електрика насправді потрапляє з електростанції до моєї кухні.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Я постійно починаю проєкти й ніколи їх не завершую. Чому так стається і що справді допомагає?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> Мені запропонували роботу з вищою оплатою, але доведеться переїхати подалі від друзів. Допоможи це обміркувати.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Сьогодні ввечері готую на шістьох, і одна людина не їсть молочного. Поміркуй зі мною, що приготувати.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Чому в деяких мовах так багато слів для однієї й тієї самої речі?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Voiced by:** ElevenLabs `Eleven v3` — this is the clip the intro sheet plays.

**Prompt**

> Як узагалі працює цей застосунок?

**Answer** (387 words)

Ти говориш, а Mr Broccoli перетворює сказане на текст, надсилає його обраній тобою моделі й потім зачитує відповідь уголос. Ось і весь цикл. Різниця в тому, що ти сам вирішуєш, що стоїть посередині, і ніщо в цьому рішенні від тебе не приховано.

Живити це можна трьома способами, і це справді різні компроміси, а не рівні того самого.

Перший — скористатися ключем провайдера, який у тебе вже є: OpenAI, Anthropic, Google і ще кілька. Ти отримуєш їхні найкращі моделі, ті самі, що й у їхніх власних застосунках, і платиш безпосередньо їм за те, що використовуєш. Mr Broccoli ніколи не торкається цих грошей і нічого зверху не додає.

Другий — завантажити моделі, які працюють цілком на цьому телефоні. Першого разу це триває якийсь час і займає місце, але потім не коштує взагалі нічого й працює без зв'язку: у літаку, в метро, будь-де. Ці моделі менші за хмарні, тому зі складними міркуваннями дають раду гірше. Застосунок каже тобі про це прямо, а не вдає протилежне.

Третій — просто голос, який у твоєму телефоні вже є, доступний з моменту встановлення.

Їх можна змішувати. Передова модель думає, а голос самого телефона читає вголос. Або локальна модель із по-справжньому хорошим голосом. Думати й говорити — це окремі рішення.

Щодо приватності — ось точна версія замість зручної. Твої розмови зберігаються на цьому пристрої, і жодного сервера Mr Broccoli не існує ніде. Ні облікового запису, ні синхронізації, нічого, що могло б витекти. Але коли ти користуєшся хмарною моделлю, сказане йде до цього провайдера, на його умовах, точно так само, як пішло б у його власному застосунку. Застосунок гарантує, що воно йде туди й більше нікуди, і що біля кожного окремого повідомлення ти бачиш, який маршрут на нього відповів.

Останнє, що варто знати: Mr Broccoli радше буде правий, ніж швидкий. Більшість голосових помічників тихо перемикають тебе на слабшу модель, щоб відповідь надійшла раніше, і ти про це ніколи не дізнаєшся. Цей так не робить. Якщо ти просиш продуману відповідь, він бере стільки часу, скільки продумана відповідь потребує, і при цьому показує, чим саме зайнятий: думає, шукає, говорить. Замість тиші та кружальця, що крутиться. Перервати можна будь-коли. І те саме питання можна поставити ще раз іншій моделі та порівняти дві відповіді.

І ніщо з цього не закріплено назавжди. Провайдера, модель чи голос можна змінити будь-якої миті, хоч посеред розмови, і розмова просто триватиме далі з новим вибором.

---
