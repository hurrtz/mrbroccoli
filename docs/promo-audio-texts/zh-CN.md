# Promo audio — 简体中文 (`zh-CN`)

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

> 讲讲电到底是怎么从发电站一路送到我家厨房的。

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> 我总是开始一堆项目却从来没做完。这是为什么，真正有用的办法是什么？

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> 有人给我一份薪水更高的工作，但我得搬到离朋友很远的地方。帮我理一理。

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> 今晚我要给六个人做饭，其中一个不吃乳制品。跟我一起想想做什么。

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> 为什么有些语言对同一件事有那么多说法？

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Prompt**

> 这个应用到底是怎么运作的？

**Answer** (872 characters)

你说话，Mr Broccoli 把你说的内容转成文字，发给你选定的模型，再把回答读给你听。整个流程就是这样。不同之处在于，中间放什么由你决定，而且这个选择的任何一环都不会对你隐瞒。

驱动它有三种方式，它们是真正不同的取舍，而不是同一件事的高低档。

第一种是使用你已经有的服务商密钥：OpenAI、Anthropic、Google，还有其他几家。你用到的是它们最好的模型，和你在它们自家应用里用到的完全一样，用了多少直接付给它们。Mr Broccoli 从不经手这笔钱，也不加价。

第二种是下载完全在这台手机上运行的模型。第一次要等一会儿，也占一些空间，但之后就完全不花钱，而且没有信号也能用：在飞机上、在地铁里，任何地方都行。这些模型比云端的小，所以在需要深入推理时会弱一些。应用会直接告诉你这一点，而不是假装并非如此。

第三种就是手机本身自带的语音，装好应用的那一刻就能用。

这些也可以混着用。让前沿模型负责思考，用手机自己的声音来朗读。或者用本地模型配上一个高质量的声音。思考和朗读是两个分开的选择。

关于隐私，这里说准确的版本，而不是听着舒服的版本。你的对话保存在这台设备上，任何地方都不存在 Mr Broccoli 的服务器。没有账号，不做同步，也就没有什么可以外泄。但当你使用云端模型时，你说的话会发送到那家服务商，遵照它的条款，和你在它自家应用里使用时完全一样。这个应用能保证的是：只发到那里，不发去别处，而且每一条回复你都能看到是哪条路线作答的。

最后值得知道的一点是，Mr Broccoli 宁可答得准，也不图答得快。多数语音助手会悄悄把你切到一个更弱的模型上，好让回答来得早一些，而你从来不会知道。这个应用不这么做。如果你要一个想清楚了的答案，它就花上想清楚所需要的时间，并且在这段时间里让你看到它正在做什么：在思考、在检索、在朗读，而不是只留给你一片安静和一个转圈的图标。你随时可以打断。你也可以把同一个问题再问另一个模型，把两个回答放在一起比较。

而且这些都不是定死的。服务商、模型、声音，你随时都能换，哪怕是在一段对话的中途，对话会带着新的选择继续下去。

---
