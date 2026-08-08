# Promo audio — Русский (`ru`)

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

> Объясни, как электричество на самом деле доходит от электростанции до моей кухни.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Я постоянно начинаю проекты и никогда их не заканчиваю. Почему так происходит и что реально помогает?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> Мне предложили работу с большей зарплатой, но придётся переехать далеко от друзей. Помоги это обдумать.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Сегодня вечером готовлю на шестерых, и один из них не ест молочное. Подумай вместе со мной, что приготовить.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Почему в некоторых языках так много слов для одного и того же?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Voiced by:** Alibaba Qwen `qwen3-tts-flash` — this is the clip the intro sheet plays.

**Prompt**

> Как вообще работает это приложение?

**Answer** (390 words)

Ты говоришь, а Mr Broccoli превращает сказанное в текст, отправляет его выбранной тобой модели и затем зачитывает ответ вслух. Вот и весь цикл. Отличие в том, что ты сам решаешь, что стоит в середине, и ничто в этом решении от тебя не скрыто.

Питать это можно тремя способами, и это по-настоящему разные компромиссы, а не уровни одного и того же.

Первый — использовать ключ провайдера, который у тебя уже есть: OpenAI, Anthropic, Google и ещё несколько. Ты получаешь их лучшие модели, ровно те же, что и в их собственных приложениях, и платишь напрямую им за то, что используешь. Mr Broccoli никогда не касается этих денег и ничего сверху не накидывает.

Второй — скачать модели, которые работают целиком на этом телефоне. В первый раз это займёт время и место, но потом не стоит вообще ничего и работает без связи: в самолёте, в метро, где угодно. Эти модели меньше облачных, поэтому со сложными рассуждениями справляются хуже. Приложение говорит тебе об этом прямо, а не делает вид, что всё наоборот.

Третий — просто голос, который уже есть в твоём телефоне, доступный с момента установки.

Их можно смешивать. Передовая модель думает, а голос самого телефона читает вслух. Или локальная модель с по-настоящему хорошим голосом. Думать и говорить — это отдельные решения.

Насчёт приватности — вот точная версия вместо удобной. Твои разговоры хранятся на этом устройстве, и никакого сервера Mr Broccoli не существует нигде. Ни аккаунта, ни синхронизации, ничего, что могло бы утечь. Но когда ты используешь облачную модель, сказанное уходит этому провайдеру, на его условиях, ровно так же, как ушло бы в его собственном приложении. Приложение гарантирует, что уходит оно туда и никуда больше, и что по каждому отдельному сообщению ты видишь, какой маршрут на него ответил.

Последнее, что стоит знать: Mr Broccoli предпочитает быть правым, а не быстрым. Большинство голосовых помощников тихо переключают тебя на более слабую модель, чтобы ответ пришёл раньше, и ты об этом никогда не узнаёшь. Этот так не делает. Если ты просишь продуманный ответ, он берёт столько времени, сколько продуманный ответ требует, и при этом показывает, чем занят: думает, ищет, говорит. Вместо тишины и крутящегося кружка. Прервать можно в любой момент. И тот же вопрос можно задать заново другой модели и сравнить два ответа.

И ничто из этого не закреплено намертво. Провайдера, модель или голос можно поменять когда угодно, хоть посреди разговора, и разговор просто продолжится с новым выбором.

---
