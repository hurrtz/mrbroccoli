# Promo audio — 日本語 (`ja`)

Spoken examples for the intro sheet.

Each language ships one clip bundled in the app at
`assets/intro-audio/intro-<lang>.m4a`, normalized to -16 LUFS so no language
is noticeably louder or quieter than another.

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

> 発電所から自分の家の台所まで、電気が実際どうやって届くのか教えて。

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> いつも何かを始めては最後までやり切れません。なぜそうなるのか、そして本当に効くのは何ですか。

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> 給料の高い仕事を提示されましたが、友人から遠く離れて引っ越すことになります。一緒に考えてください。

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> 今夜は六人分の料理をします。そのうち一人は乳製品を食べません。何を作るか一緒に考えて。

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> どうして言語によっては、同じものを表す言葉がそんなにたくさんあるんですか。

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Voiced by:** Alibaba Qwen `qwen3-tts-flash` — this is the clip the intro sheet plays.

**Prompt**

> このアプリは実際どうやって動いているの？

**Answer** (1228 characters)

あなたが話すと、Mr Broccoli はその内容を文字にして、あなたが選んだモデルに送り、返ってきた答えを読み上げます。仕組みはそれだけです。違うのは、その真ん中に何を置くかをあなたが決められること、そしてその選択について何ひとつ隠されていないことです。

動かし方は三通りあり、これらは同じものの上下ではなく、本当に性質の違う選択です。

一つめは、すでに持っているプロバイダーのキーを使う方法です。OpenAI、Anthropic、Google、ほかにもいくつかあります。各社の最良のモデル、つまり各社のアプリで使えるものと同じものが使えて、使った分の料金は各社に直接支払います。Mr Broccoli がそのお金に触れることはなく、上乗せもしません。

二つめは、この端末の中だけで動くモデルをダウンロードする方法です。初回は少し時間がかかり、保存容量も使いますが、そのあとは費用がまったくかからず、電波がなくても動きます。飛行機の中でも、地下鉄でも、どこでもです。これらのモデルはクラウドのものより小さいので、難しい推論では力が落ちます。アプリはそれを隠さず、はっきり伝えます。

三つめは、端末にもともと入っている音声です。インストールしたその瞬間から使えます。

組み合わせることもできます。考えるのは最前線のモデルに任せて、読み上げは端末の音声にする。あるいは端末内のモデルに、質の高い音声を組み合わせる。考えることと話すことは、別々の選択です。

プライバシーについては、耳あたりのよい説明ではなく正確な説明をします。会話はこの端末に保存され、Mr Broccoli のサーバーはどこにも存在しません。アカウントもなく、同期もなく、漏れるものがそもそもありません。ただし、クラウドのモデルを使うときは、話した内容はそのプロバイダーに送られます。そのプロバイダーの規約のもとで、各社のアプリを使ったときとまったく同じようにです。このアプリが保証するのは、送り先はそこだけで、ほかのどこにも送られないこと、そしてどの経路がその一つひとつの返答をしたのかを、あなたがいつでも確認できることです。

最後に知っておいてほしいのは、Mr Broccoli は速いことより正しいことを選ぶという点です。多くの音声アシスタントは、返事を早く届けるために、黙って性能の低いモデルに切り替えます。そしてあなたはそれに気づきません。このアプリはそれをしません。じっくり考えた答えを求めれば、そのために必要なだけの時間をかけます。そのあいだ、考えている、調べている、話している、と今していることを表示します。沈黙とぐるぐる回る印だけを見せることはしません。いつでも途中で止められます。同じ質問を別のモデルにもう一度たずねて、二つの答えを見比べることもできます。

そしてどれも固定ではありません。プロバイダーもモデルも音声も、会話の途中であっても、いつでも変えられます。会話はそのまま、新しい選択で続きます。

---
