# Promo audio — Español (`es`)

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

> Explícame cómo llega realmente la electricidad desde la central hasta mi cocina.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Empiezo proyectos constantemente y nunca los termino. ¿A qué se debe, y qué ayuda de verdad?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> Me han ofrecido un trabajo mejor pagado, pero tendría que mudarme lejos de mis amigos. Ayúdame a pensarlo.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Esta noche cocino para seis y uno no toma lácteos. Piensa conmigo qué puedo hacer.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> ¿Por qué algunos idiomas tienen tantas palabras para una misma cosa?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Prompt**

> ¿Cómo funciona esta aplicación?

**Answer** (463 words)

Hablas, y Mr Broccoli convierte lo que has dicho en texto, se lo envía al modelo que hayas elegido y te lee la respuesta en voz alta. Ese es todo el ciclo. Lo que lo hace distinto es que tú decides qué hay en el medio, y nada de esa decisión se te oculta.

Hay tres formas de darle energía, y son compromisos realmente distintos, no niveles de una misma cosa.

La primera es usar una clave de un proveedor que ya tengas: OpenAI, Anthropic, Google y varios más. Obtienes sus mejores modelos, los mismos que tendrías en sus propias aplicaciones, y les pagas directamente a ellos por lo que uses. Mr Broccoli nunca toca ese dinero ni le añade un recargo.

La segunda es descargar modelos que se ejecutan por completo en este teléfono. La primera vez tarda un rato y ocupa espacio, pero después no cuesta absolutamente nada y funciona sin cobertura: en un avión, en el metro, en cualquier sitio. Estos modelos son más pequeños que los alojados en la nube, así que rinden menos en razonamiento difícil. La aplicación te lo dice en lugar de fingir lo contrario.

La tercera es simplemente la voz que tu teléfono ya trae, que funciona desde el momento en que lo instalas.

Puedes mezclarlas. Un modelo puntero pensando y la voz de tu propio teléfono leyendo en voz alta. O un modelo local con una voz de calidad. Pensar y hablar son decisiones separadas.

Sobre la privacidad, aquí va la versión precisa en lugar de la cómoda. Tus conversaciones se guardan en este dispositivo, y no existe ningún servidor de Mr Broccoli en ninguna parte. Sin cuenta, sin sincronización, nada que se pueda filtrar. Pero cuando usas un modelo alojado, lo que dices va a ese proveedor, bajo sus condiciones, exactamente igual que en su propia aplicación. Lo que esta aplicación garantiza es que va ahí y a ningún otro sitio, y que puedes ver qué ruta ha respondido cada mensaje.

Lo último que conviene saber es que Mr Broccoli prefiere acertar antes que ir rápido. La mayoría de los asistentes de voz te cambian en silencio a un modelo más débil para que la respuesta llegue antes, y nunca te enteras. Este no. Si pides una respuesta meditada, se toma el tiempo que una respuesta meditada necesita, y te muestra lo que está haciendo mientras lo hace: pensando, buscando, hablando. En vez de dejarte con silencio y un indicador girando. Puedes interrumpir cuando quieras. También puedes volver a hacer la misma pregunta con otro modelo y comparar las dos respuestas.

Y nada de esto queda fijado. Puedes cambiar el proveedor, el modelo o la voz en cualquier momento, incluso en mitad de una conversación, y la conversación simplemente continúa con el nuevo.

---
