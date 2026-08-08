# Promo audio — Français (`fr`)

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

> Explique-moi comment l'électricité arrive vraiment de la centrale jusqu'à ma cuisine.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Je commence sans arrêt des projets que je ne finis jamais. Pourquoi, et qu'est-ce qui aide vraiment ?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> On m'a proposé un poste mieux payé, mais je devrais déménager loin de mes amis. Aide-moi à y réfléchir.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Je cuisine pour six ce soir et l'un d'eux ne mange pas de produits laitiers. Réfléchis avec moi à ce que je peux faire.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Pourquoi certaines langues ont-elles autant de mots pour une même chose ?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Prompt**

> Comment fonctionne cette application ?

**Answer** (478 words)

Tu parles, et Mr Broccoli transforme ce que tu as dit en texte, l'envoie au modèle que tu as choisi, puis te lit la réponse à voix haute. C'est toute la boucle. Ce qui change, c'est que tu décides de ce qui se trouve au milieu, et que rien de ce choix ne t'est caché.

Il y a trois façons de l'alimenter, et ce sont de vrais compromis différents, pas des niveaux d'une même chose.

La première consiste à utiliser une clé d'un fournisseur que tu as déjà : OpenAI, Anthropic, Google et plusieurs autres. Tu obtiens leurs meilleurs modèles, exactement ceux que tu aurais dans leurs propres applications, et tu les paies directement pour ce que tu consommes. Mr Broccoli ne touche jamais cet argent et ne prend aucune marge.

La deuxième consiste à télécharger des modèles qui tournent entièrement sur ce téléphone. La première fois, cela prend un moment et de l'espace, mais ensuite cela ne coûte plus rien du tout et fonctionne sans réseau : en avion, dans le métro, absolument partout. Ces modèles sont plus petits que ceux hébergés en ligne, donc moins solides sur le raisonnement difficile. L'application te le dit au lieu de prétendre le contraire.

La troisième, c'est simplement la voix que ton téléphone possède déjà, disponible dès l'installation.

Tu peux les mélanger. Un modèle de pointe pour réfléchir, et la voix de ton propre téléphone pour lire. Ou un modèle local avec une voix haut de gamme. Penser et parler sont deux choix distincts.

Sur la confidentialité, voici la version précise plutôt que la version confortable. Tes conversations sont stockées sur cet appareil, et il n'existe aucun serveur Mr Broccoli, nulle part. Pas de compte, pas de synchronisation, rien qui puisse fuiter. Mais quand tu utilises un modèle hébergé, ce que tu dis part chez ce fournisseur, selon ses conditions, exactement comme dans sa propre application. Ce que cette application garantit, c'est que cela part là et nulle part ailleurs, et que tu peux voir quelle route a répondu à chaque message.

La dernière chose à savoir, c'est que Mr Broccoli préfère avoir raison plutôt qu'aller vite. La plupart des assistants vocaux te basculent discrètement sur un modèle plus faible pour que la réponse arrive plus tôt, et tu ne l'apprends jamais. Celui-ci ne le fait pas. Si tu demandes une réponse réfléchie, il prend le temps qu'une réponse réfléchie demande, et il te montre ce qu'il fait pendant ce temps : réfléchir, chercher, parler. Plutôt que de te laisser avec du silence et un indicateur qui tourne. Tu peux interrompre à tout moment. Tu peux aussi reposer la même question à un autre modèle et comparer les deux réponses.

Et rien n'est verrouillé. Tu peux changer de fournisseur, de modèle ou de voix quand tu veux, même au milieu d'une conversation, et la conversation continue simplement avec le nouveau.

---
