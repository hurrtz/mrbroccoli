# Promo audio — Português (Brasil) (`pt-BR`)

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

> Me explica como a eletricidade chega de verdade da usina até a minha cozinha.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Vivo começando projetos e nunca termino. Por que isso acontece, e o que ajuda de verdade?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> Me ofereceram um emprego que paga mais, mas eu teria que me mudar para longe dos meus amigos. Me ajuda a pensar nisso.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Hoje à noite eu cozinho para seis pessoas e uma delas não come laticínios. Pensa comigo no que fazer.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Por que algumas línguas têm tantas palavras para a mesma coisa?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Prompt**

> Como funciona esse aplicativo?

**Answer** (454 words)

Você fala, e o Mr Broccoli transforma o que você disse em texto, manda para o modelo que você escolheu e depois lê a resposta em voz alta. O ciclo é esse. O que faz diferença é que você decide o que fica no meio, e nada dessa escolha é escondido de você.

Existem três formas de alimentar isso, e são escolhas realmente diferentes, não níveis da mesma coisa.

A primeira é usar uma chave de um provedor que você já tem: OpenAI, Anthropic, Google e vários outros. Você recebe os melhores modelos deles, os mesmos que teria nos aplicativos deles, e paga diretamente a eles pelo que usar. O Mr Broccoli nunca encosta nesse dinheiro e não coloca margem em cima.

A segunda é baixar modelos que rodam inteiramente neste celular. Na primeira vez demora um pouco e ocupa espaço, mas depois não custa absolutamente nada e funciona sem sinal: num avião, no metrô, em qualquer lugar. Esses modelos são menores do que os hospedados na nuvem, então rendem menos em raciocínio difícil. O aplicativo fala isso, em vez de fingir o contrário.

A terceira é simplesmente a voz que o seu celular já tem, disponível desde o momento em que você instala.

Dá para misturar. Um modelo de ponta pensando e a voz do próprio celular lendo. Ou um modelo local com uma voz de qualidade. Pensar e falar são escolhas separadas.

Sobre privacidade, aqui vai a versão precisa em vez da confortável. Suas conversas ficam guardadas neste aparelho, e não existe nenhum servidor do Mr Broccoli em lugar nenhum. Sem conta, sem sincronização, nada que possa vazar. Mas quando você usa um modelo hospedado, o que você diz vai para aquele provedor, sob os termos dele, exatamente como iria no aplicativo dele. O que este aplicativo garante é que vai para lá e para mais lugar nenhum, e que você consegue ver qual caminho respondeu cada mensagem.

A última coisa que vale saber é que o Mr Broccoli prefere acertar a ser rápido. A maioria dos assistentes de voz troca você em silêncio por um modelo mais fraco para a resposta chegar antes, e você nunca fica sabendo. Este não faz isso. Se você pedir uma resposta pensada, ele leva o tempo que uma resposta pensada exige, e mostra o que está fazendo enquanto faz: pensando, buscando, falando. Em vez de deixar você com silêncio e uma bolinha girando. Você pode interromper quando quiser. E pode refazer a mesma pergunta em outro modelo e comparar as duas respostas.

E nada disso fica travado. Você pode trocar de provedor, de modelo ou de voz a qualquer momento, até no meio de uma conversa, e a conversa simplesmente continua com a nova escolha.

---
