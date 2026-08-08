# Promo audio — Português (`pt`)

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

> Explica-me como é que a eletricidade chega mesmo da central até à minha cozinha.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Estou sempre a começar projetos e nunca os termino. Porque é que isso acontece, e o que ajuda mesmo?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> Ofereceram-me um emprego mais bem pago, mas teria de me mudar para longe dos meus amigos. Ajuda-me a pensar nisso.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Hoje à noite cozinho para seis pessoas e uma delas não come laticínios. Pensa comigo no que posso fazer.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Porque é que algumas línguas têm tantas palavras para a mesma coisa?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Voiced by:** Alibaba Qwen `qwen3-tts-flash` — this is the clip the intro sheet plays.

**Prompt**

> Como funciona esta aplicação?

**Answer** (460 words)

Tu falas, e o Mr Broccoli transforma o que disseste em texto, envia-o ao modelo que escolheste e depois lê-te a resposta em voz alta. O ciclo é este. O que faz a diferença é que és tu a decidir o que está no meio, e nada dessa escolha te é escondido.

Há três formas de o alimentar, e são compromissos genuinamente diferentes, não níveis da mesma coisa.

A primeira é usares uma chave de um fornecedor que já tens: OpenAI, Anthropic, Google e vários outros. Obténs os melhores modelos deles, os mesmos que terias nas aplicações deles, e pagas-lhes diretamente pelo que usares. O Mr Broccoli nunca toca nesse dinheiro nem acrescenta margem.

A segunda é transferires modelos que correm inteiramente neste telemóvel. À primeira vez demora um bocado e ocupa espaço, mas depois não custa absolutamente nada e funciona sem rede: num avião, no metro, em qualquer sítio. Estes modelos são mais pequenos do que os alojados online, por isso são menos capazes em raciocínio difícil. A aplicação diz-to, em vez de fingir o contrário.

A terceira é simplesmente a voz que o teu telemóvel já traz, disponível a partir do momento em que instalas.

Podes misturá-las. Um modelo de topo a pensar e a voz do próprio telemóvel a ler. Ou um modelo local com uma voz de qualidade. Pensar e falar são escolhas separadas.

Quanto à privacidade, aqui vai a versão precisa em vez da confortável. As tuas conversas ficam guardadas neste dispositivo, e não existe nenhum servidor do Mr Broccoli em lado nenhum. Sem conta, sem sincronização, nada que possa ser comprometido. Mas quando usas um modelo alojado, o que dizes vai para esse fornecedor, nas condições dele, exatamente como iria na aplicação dele. O que esta aplicação garante é que vai para lá e para mais lado nenhum, e que consegues ver qual foi o percurso que respondeu a cada mensagem.

A última coisa que vale a pena saber é que o Mr Broccoli prefere acertar a ser rápido. A maioria dos assistentes de voz muda-te em silêncio para um modelo mais fraco para que a resposta chegue mais depressa, e tu nunca ficas a saber. Este não faz isso. Se pedires uma resposta ponderada, leva o tempo que uma resposta ponderada exige, e mostra-te o que está a fazer enquanto o faz: a pensar, a procurar, a falar. Em vez de te deixar com silêncio e um indicador a rodar. Podes interromper quando quiseres. E também podes voltar a fazer a mesma pergunta a outro modelo e comparar as duas respostas.

E nada disto fica preso. Podes mudar de fornecedor, de modelo ou de voz a qualquer momento, mesmo a meio de uma conversa, e a conversa continua simplesmente com a nova escolha.

---
