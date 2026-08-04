# Changelog

This file records user-visible changes to Mr Broccoli.

Each released version also includes localized store notes. These summaries are
kept within Google Play's 500-character limit per language and can also be used
for Apple's **What's New in This Version** field. Beginning with version 2.5.3,
the complete Play Store translations are kept in a dedicated file under
`docs/`.

## Unreleased

### Added

- Assess every compatible on-device model before download using the current
  phone's RAM, available memory, storage, architecture, OS, power, and thermal
  state. Advanced onboarding and Settings distinguish specification estimates,
  estimates calibrated from another model tested on the same phone, and exact
  short benchmark results with tokens per second or speech real-time factor,
  load time, and RAM headroom.
- Continue from any user or assistant checkpoint, including inside an existing
  branch. Transcript markers identify the exact branch point, the conversation
  drawer renders recursive Git-style rails, related checkpoints are directly
  navigable, and every branch remains independently usable if its parent is
  deleted or restored from backup.
- Expand the on-device catalogue with opt-in Qwen3.5, Granite, Ministral
  Reasoning, and larger Qwen reasoning routes; Whisper Base and Small,
  Parakeet, and Qwen3-ASR recognition; and additional permissively licensed
  Piper voices. Automatic setup quality-ranks approved candidates after
  language and device filtering, while every advanced choice remains
  benchmark-gated and available for manual selection.
- Add an expandable Uber Mode audit to each deliberated reply, showing routes,
  rounds, challenge and convergence verdicts, failures, retired participants,
  retained synthesis history, and intermediate tokens without storing private
  contribution text.
- Interrupt a spoken response with a dedicated speak-now control. Completed
  answers remain intact, still-streaming text is retained with a visible
  interruption marker, prefetched audio is stopped, and recording starts only
  after the playback route settles.
- Render Markdown headings, lists, links, citations, tables, and code fences
  into clearer speech without changing the visible or saved response.
- Correct a misheard user transcript in place. Corrections update saved
  history, search, archives, future conversation context, and optional local
  knowledge while leaving already-generated replies visibly unchanged.
- Show separate Quick and Thorough on-device response cards when a phone has
  enough memory and storage for both benchmarked Qwen models; smaller phones
  keep a single viable Quick card.
- Add optional Omnilingual on-device speech recognition and compact Piper
  voices for Italian, Russian, and European Portuguese, each with pinned
  artifacts, license checks, and device-local benchmarks.
- Add a zero-account Free experience that selects, downloads, verifies, and
  benchmarks one complete on-device listening, thinking, and speaking setup
  for the user's preferred speaking language and phone. Once installed, Free
  conversations and session history run without provider keys or network
  inference.
- Add a permanent Premium unlock through App Store and Play Store billing,
  including localized store pricing, offline entitlement caching, automatic
  same-platform ownership reconciliation, and an explicit restore action.

### Changed

- Update the home-screen wordmark immediately with the selected interface
  language, and replace the visible translated debug-log text with the shared
  bug icon while retaining an accessible localized label.
- Prefer stronger automatic Free models when the phone has enough headroom.
  Qwen3 0.6B remains a constrained-device fallback instead of displacing
  Granite on the Quick card; high-end German profiles now pair Granite with
  Ministral Reasoning and Parakeet speech recognition.
- Keep branch families compact and collapsed until opened, expand the active
  path automatically, label each child with its parent, and show a child thread
  from its forked checkpoint while retaining earlier parent context invisibly.
- Confirm standalone fork actions, move edited-prompt submission into an
  explicit Save + send dialog action, provide parent navigation above and below
  the forked checkpoint, and keep secondary user-message actions out of the
  primary message-action row.
- Strengthen Uber Mode synthesis with an evidence-ledger contract that keeps
  established information, inference, assumptions, and unresolved dissent
  distinct and passes explicit review verdicts into the final synthesis.
- Make each conversation's compact memory directly editable as well as
  inspectable, copyable, and forgettable, so an automatic summary can be
  corrected before it shapes later turns.
- Streamline first-run Free setup around one speaking language and an automatic
  storefront-aware phone-to-model recommendation, with a deliberately readable
  evaluation, model summary, one green confirmation action, per-step download
  progress, remaining-step count, and a live ETA. An Advanced toggle exposes
  phone evidence, compatibility guidance, persistent Quick/Thorough model
  choices, local or phone-native speech routes, and voice selection.
- Build cross-session knowledge automatically from every user and assistant
  message in eligible conversations, without asking users to categorize or
  promote individual messages. Retrieved context remains linked to its source
  conversation, while private conversations remain excluded.
- Present Free as a coherent Private Offline edition across Home, setup, and
  Settings, with a three-step single-language model flow and explicit
  language-aware phone speech options.
- Group Settings by conversation, voice and models, and privacy and app tasks;
  replace the technical readiness dashboard with a clear edition summary and
  a direct setup action.
- Explain Premium before purchase with its concrete provider, response-mode,
  Uber, web, image, Drive, knowledge, and archive benefits, plus the one-time,
  no-subscription, no-token-markup purchase model and same-platform restore
  boundary.
- Keep Free Settings focused on on-device AI, data and privacy, and app
  preferences while exposing the same complete device evidence, model tests,
  route choices, and voice controls as the onboarding wizard's Advanced view.
- Hide the image attachment action from the Free home screen instead of
  showing a disabled Premium-only button beneath the main action.
- Keep cloud providers, response-mode configuration, web search, images,
  Drive and Uber modes, cross-session knowledge, portable archive sync, and
  advanced controls behind Premium while preserving the user's configuration
  across Free and Premium transitions.

### Fixed

- Tell small on-device reasoning models to treat the latest message as the
  current task and not blend an earlier topic into the answer when a branch
  changes subject.
- Keep Free setup's selected speaking language, interface locale, local model
  prompt, and speech routes synchronized; repair existing mismatched profiles,
  and remove private Qwen thinking plus stray Markdown from visible, saved, and
  spoken on-device replies.
- Prevent Qwen Thorough replies from starting with an English Markdown topic
  heading or ending mid-answer by enforcing the target language in its own
  language, removing standalone generated titles, and reserving a separate
  generation budget for private reasoning.
- Let Save + send on an edited user transcript create an independent branch
  through the corrected prompt, preserving prior context, settings, privacy,
  and image files while generating the replacement reply.
- Keep the product name exactly “Mr Broccoli” in every interface language
  instead of translating, respelling, or punctuating the brand per locale.
- Make past-conversation retrieval abstain on weak incidental matches, suppress
  duplicated conversation copies, and label retained sources by match quality
  while indexing the complete eligible conversation history.
- Add a conversation-integrity review for saved assistant responses that
  previews suspected internal-context leakage before changing anything,
  preserves the original locally for export or undo, and avoids automatic
  deletion when no safe repaired prefix exists.
- Make debug capture available in Free and record sanitized Premium store
  diagnostics for connection, product lookup, retry, purchase, restore, and
  entitlement reconciliation failures.
- Restore saved image attachments after iOS app updates by resolving their
  relative paths against the current app container, preventing one stale image
  URL from blocking readable or encrypted session backups.
- Keep the active conversation out of past-conversation retrieval from its
  first transcribed turn, reject interrupted Anthropic streams instead of
  silently continuing them, and block serialized internal context before it
  can be spoken, saved, or re-indexed.
- Keep Free setup focused on one preferred speaking language chosen from
  English, Spanish, French, German, Portuguese, Russian, or Italian. Portuguese
  automatically follows the phone's Brazilian or European locale, with the
  phone's language-aware system voice available when no downloaded voice fits.
- Prevent a stalled private Uber Mode participant from blocking an entire run
  indefinitely; timed-out participants are skipped while successful models
  continue through review and final synthesis.
- Allow max-effort model replies to remain inactive for up to ten minutes
  before timing out, matching Uber Mode's participant deadline.
- Trust a successfully installed and benchmarked Free on-device profile when
  it selects Kokoro, avoiding a stale verification warning that redirected
  Free users into the Premium-only Speaking settings after changing language.
- Prevent local Whisper testing and transcription from terminating the app
  during automatic language detection, and benchmark a real speech fixture
  through the normal file-transcription route instead of synthetic silence.
- Make the Free home action open on-device setup instead of remaining disabled,
  open the complete on-device model catalogue from Settings, and return to the
  same Settings flow after a Premium prompt closes.
- Remove the redundant home-screen Premium shortcut and prevent purchase
  attempts from failing silently when the App Store or Play Store product is
  unavailable by showing the store error with an explicit retry action.
- Reuse suitable models already installed on the device when building the Free
  profile, avoid models that failed a current-device benchmark when an
  alternative exists, and keep setup open until all three local routes pass.
- Stop portable conversation archive sync and provider-backed title generation
  from crossing the Free offline boundary, discard delayed image-picker results
  after image access is locked, and release local benchmark resources after
  failures.

## 2.8.0 - 2026-08-02

### Added

- Add optional on-device knowledge from past conversations with local hybrid
  retrieval, visible source sessions, and private conversations that are never
  indexed while retaining their own in-session memory.
- Add up to four camera or photo-library images to typed and spoken prompts,
  keep them with conversation history and backups, and require explicit
  consent before resending them to new or multiple reasoning providers.
- Add a guided on-device AI catalogue for Android and iOS. It filters models by
  the selected languages and measured device capacity, verifies every download,
  benchmarks models before use, and makes local Whisper, Qwen, Kokoro, and
  Piper routes selectable from the normal listening, thinking, and speaking
  settings. Web search remains disabled for local responses in this first
  version.
- Keep readable Markdown copies of conversations in a user-selected Files or
  Drive folder, automatically maintain index and latest-conversation files,
  and share threads as structured handoffs for other AI apps. Provider keys,
  hidden memory, instructions, and runtime metadata remain excluded.

### Fixed

- Prevent the optional past-conversation knowledge index from terminating the
  iOS app while opening or clearing its local full-text database.
- Prevent Android release optimization from renaming Sherpa JNI classes and
  crashing the app when Kokoro speech initializes.
- Keep backup export responsive by deriving encryption keys on a native
  background queue, reject duplicate exports and obviously weak passphrases,
  and retain shared files long enough for mail apps to attach them reliably.
- Prevent provider and model provenance labels from accumulating at the start
  of replies across repeated conversation turns.
- Reject recordings with clear silence before sending them to provider speech
  recognition, avoiding hallucinated one-word prompts such as “No” or “One”.

### Store release notes

See `docs/google-play-release-notes-2.8.0.md`.

## 2.7.0 - 2026-08-01

### Changed

- Optimize Android release builds with R8 and resource shrinking, and preserve
  Play Console deobfuscation mappings plus native debug symbols for readable
  production crash reports.
- Remove the legacy Ant Design Native runtime dependency while retaining the
  app's established native controls and visual behavior.
- Strengthen release validation with fresh-checkout static analysis, enforced
  coverage and TypeScript checks, native lifecycle tests, release-size and
  secret budgets, and cross-platform accessibility and localization audits.
- Make Uber Mode deliberation more efficient and adversarial: reviewers receive
  each participant's latest provider-anonymous position, actively stress-test
  agreement, and stop unused rounds after explicit unanimous convergence.
  Intermediate answers retain material reasoning without a restrictive word
  target, while final synthesis preserves earlier successful reasoning within
  a safe context budget and always keeps every model's latest position.

### Fixed

- Keep navigation, response routes, Settings, and conversation controls usable
  with accessibility-large text on compact screens.
- Prevent decorative application and provider icons from creating duplicate or
  confusing screen-reader stops.
- Make voice-preview Stop respond immediately during Kokoro or provider speech
  generation, prevent cancelled previews from playing later, and report
  intentional cancellation separately from synthesis failures.

### Store release notes

See `docs/google-play-release-notes-2.7.0.md`.

## 2.6.0 - 2026-07-31

### Added

- Added readable and passphrase-encrypted app-data backups for portable
  settings and complete conversation history. Provider API keys, diagnostics,
  caches, audio, and downloaded models are never included.
- Added non-destructive backup restore: existing data and API keys remain in
  place, identical conversations are skipped, and ID conflicts are restored as
  separate copies.

### Changed

- Display the current release version on the Settings overview.
- Replace application glyphs with consistent regular-weight Phosphor icons and
  semantic sizing, while retaining official provider-brand artwork, compact
  transcript disclosures, accessible touch targets, and clearer message
  actions.
- Promote the home wordmark to the larger screen-title size, align Conversations
  and Conversation Settings with the smaller Settings page-title hierarchy,
  and remove the inconsistent border from the conversation close action.
- Keep the Conversation Settings title on one truncated line, anchor its close
  action to the top-right corner, and replace oversized pills with compact
  segmented choices.
- Use the standard vertical overflow glyph for per-conversation actions while
  retaining an invisible accessible touch target.
- Bring the voice/text swipe indicators closer together without shrinking their
  accessible tap targets.
- Focus the direct provider list on OpenAI, OpenRouter, Anthropic, Google,
  xAI, DeepSeek, Mistral, Alibaba Qwen, and ElevenLabs by removing the direct
  ByteDance, Moonshot, and Perplexity integrations. Kimi K3 remains available
  through OpenRouter.
- Use one Gemini API key for Google chat, recorded-audio transcription, web
  search, and speech synthesis; the legacy Google Cloud Speech credential
  format is no longer supported.
- Persist provider-confirmed retired models and unsupported effort
  configurations as on-device compatibility overrides, recover through the
  curated fallback route, remove disabled choices from Settings, and expose a
  local reset under App & diagnostics. Authentication, quota, rate-limit,
  network, and server failures never disable a configuration.
- Redact credentials and user-authored text from debug captures before logs are
  written to disk or copied to the clipboard.
- Make debug reports durable, bounded, recoverable after an interrupted
  capture, and easier to diagnose with build, device, network, interaction,
  turn, pipeline, and privacy-minimized platform exit context. Validate every
  report before it is shared and clearly surface capture or export failures.
- Improve screen-reader behavior for pickers, overlays, voice phases, setup,
  and download/validation statuses, and expand interactive controls to
  accessible touch targets.
- Reduce the native app footprint by excluding Sherpa's unused audio-conversion
  runtime while retaining Kokoro model installation and WAV speech synthesis.
- Add a local, manifest-driven release gate that checks every retained provider
  model and effort, all speech and web-search routes, and one representative
  voice per TTS model behind a fail-fast credential and spend-reservation gate.
- Add an install-and-run Maestro release gate across Android emulator, physical
  Android hardware, and iOS simulator, including every UI language, landscape
  regressions, and a complete screenshot review gallery.

### Fixed

- Persist each provider capability test atomically so complete LLM, STT, TTS,
  search, and voice-library health results survive app restarts.
- Keep the conversation anchored to newly submitted prompts and incoming
  replies while preserving intentional reading of older messages.
- Replace the artificial one-second silence between spoken paragraphs with a
  short natural cadence gap.
- Add a dedicated Stop action that cancels current and prefetched reply audio,
  alongside the existing pause and resume control.
- Prevent three response modes from crowding or overlapping Drive controls in
  landscape by using the horizontal three-card layout.
- Keep long voice-preview text inside its editor instead of letting it overlap
  the preview button.
- Update OpenAI Realtime text responses to the current GA event schema.
- Keep Anthropic grounded web-search replies reliable when adaptive thinking is
  enabled by reserving enough response budget and requiring a completed search.
- Parse Gemini's current Interactions API search steps so grounded replies and
  their search results are recognized correctly.

### Store release notes

See `docs/google-play-release-notes-2.6.0.md`.

## 2.5.6 - 2026-07-31

### Changed

- Show Kokoro download, installation, and verification progress directly on
  temporarily disabled home-screen actions.
- Made the full guided-setup shortcut row in Settings tappable.

### Fixed

- Fixed an Android foreground-service startup race that could close the app
  when starting a Drive Session or voice recording.
- Fixed stopping a spoken-reply replay during preparation so it no longer
  fails with a cancellation error.
- Required the Kokoro on-device model to download and pass verification before
  Kokoro can be selected, with clearer setup guidance for existing invalid
  selections.
- Prevented voice, typed, retry, and Drive Session prompts while the selected
  Kokoro model is missing or still being prepared.
- Fixed the Kokoro model-removal confirmation being hidden behind the Settings
  window on Android.

### Store release notes

See `docs/google-play-release-notes-2.5.6.md`.

## 2.5.5 - 2026-07-30

### Added

- Added headset media-button and lock-screen controls for recording and spoken
  replies.
- Added background continuation for active Drive Sessions so listening can
  resume while the screen is off.
- Added a persistent provider-speech cache. Replaying the same answer can reuse
  previously synthesized audio instead of spending provider quota again.

### Changed

- Made Drive Session endpoint detection continuously adapt to the user's speech
  level, ambient noise, audio route, and sustained environment changes.
- Made live response estimates learn separately for Uber Mode routes, provider
  outcomes, fallbacks, and failures.
- Added provider circuit breakers so terminal quota, authentication, and
  permission failures stop repeated calls and expose clearer recovery guidance.
- Improved long-running voice diagnostics while reducing repetitive debug-log
  noise.
- Updated Expo, React Native, Android Material Components, and the native build
  toolchain for current iOS and Android compatibility.
- Changed the main action's timing border to fill symmetrically clockwise and
  counterclockwise from the top center.

### Fixed

- Fixed transcript replay quota failures so one failed speech chunk stops the
  remaining provider requests and shows a quota-specific message.
- Fixed the Input Mode and Speech to Text information dialogs being hidden
  behind the settings window on Android.
- Preserved provider speech-to-text uploads across the updated Expo networking
  stack.

### Store release notes

See `docs/google-play-release-notes-2.5.5.md`.

## 2.5.4 - 2026-07-29

### Added

- Added live response-time estimates to the main action, iOS Dynamic Island and
  Lock Screen, and the Android foreground notification, including overtime.
- Added screen wake protection during recording and active Drive Sessions.

### Changed

- Improved AirPods, Bluetooth, wired, and USB headset audio routing.
- Made Drive Session speech endpointing adapt to ambient noise and reject
  background chatter more reliably.
- Made Uber Mode response estimates account for its multi-model deliberation.
- Updated the main action wording and timing border to make the current state
  and expected wait visible together.

### Store release notes

See `docs/google-play-release-notes-2.5.4.md`.

## 2.5.3 - 2026-07-29

### Added

- Added a fully hands-free Drive Mode with microphone activity feedback, a
  ten-second silence countdown, and automatic turn submission.
- Added Uber Mode, where multiple configured models assess and refine a question
  before the selected model delivers the final answer.
- Added complete Czech, Polish, Turkish, Swedish, and Urdu interfaces and speech
  language support.

### Changed

- Improved cross-provider model fallback and recovery from quota and model
  availability failures.
- Updated Gemini validation and generation routes to current supported models.
- Localized Uber Mode naming consistently across every interface language.

### Fixed

- Fixed Android Back navigation inside settings.
- Correctly attributed Uber Mode usage to each participating provider and model.

### Store release notes

See `docs/google-play-release-notes-2.5.3.md`.

## 2.5.2 - 2026-07-29

### Added

- Added complete Japanese and Hungarian interfaces, including settings,
  provider guidance, accessibility labels, and localized app names.
- Added Hungarian as an independently selectable language for speech
  recognition and spoken replies on providers that support it.

### Changed

- Refreshed the app icon with clearer Mr Broccoli artwork on iOS and Android.
- Improved Android launcher presentation with adaptive safe-zone artwork and a
  dedicated themed-icon layer.

### Store release notes

#### English

Mr Broccoli now offers complete Japanese and Hungarian interfaces. Hungarian
can also be selected for speech recognition and spoken replies where supported.
The refreshed app icon gives Mr Broccoli a clearer new look and properly adapts
to Android launcher shapes and themed icons.

#### Deutsch

Mr. Brokkoli bietet jetzt vollständige Oberflächen auf Japanisch und Ungarisch.
Ungarisch kann, sofern unterstützt, auch für Spracherkennung und gesprochene
Antworten gewählt werden. Das neue App-Symbol sorgt für einen klareren Auftritt
und passt sich unter Android an Symbolformen und Farbschemata an.

#### Українська

Пан Броколі тепер має повні інтерфейси японською та угорською. Угорську також
можна вибрати для розпізнавання мовлення й озвучених відповідей, якщо
постачальник її підтримує. Оновлена іконка краще відображає характер Пана
Броколі та адаптується до форм і тем Android.

#### हिन्दी

मिस्टर ब्रोकली में अब पूर्ण जापानी और हंगेरियाई इंटरफ़ेस हैं। जहाँ प्रदाता
समर्थन करता है, हंगेरियाई को वाक् पहचान और बोले गए जवाबों के लिए भी चुना जा
सकता है। नया ऐप आइकन अधिक स्पष्ट रूप देता है और Android के अलग-अलग आइकन आकारों
व थीम के अनुसार ढलता है।

#### Español

Mr. Brócoli ya ofrece interfaces completas en japonés y húngaro. Cuando el
proveedor lo admite, el húngaro también puede elegirse para el reconocimiento
de voz y las respuestas habladas. El nuevo icono muestra mejor su personalidad
y se adapta a las formas y los temas de Android.

#### Français

M. Brocoli propose désormais des interfaces complètes en japonais et en
hongrois. Lorsque le fournisseur le permet, le hongrois peut aussi être choisi
pour la reconnaissance vocale et les réponses parlées. La nouvelle icône
affirme mieux son identité et s’adapte aux formes et thèmes Android.

#### Italiano

Sig. Broccoli ora offre interfacce complete in giapponese e ungherese. Dove
supportato dal provider, l’ungherese può essere scelto anche per il
riconoscimento vocale e le risposte parlate. La nuova icona rende l’identità più
chiara e si adatta alle forme e ai temi di Android.

#### Português

O Sr. Brócolo dispõe agora de interfaces completas em japonês e húngaro. Quando
o fornecedor o permite, o húngaro também pode ser escolhido para o
reconhecimento de voz e as respostas faladas. O novo ícone reforça a identidade
da aplicação e adapta-se às formas e aos temas do Android.

#### Português (Brasil)

O Sr. Brócolis agora oferece interfaces completas em japonês e húngaro. Quando
houver suporte do provedor, o húngaro também pode ser usado no reconhecimento
de voz e nas respostas faladas. O novo ícone destaca melhor a identidade do app
e se adapta aos formatos e temas do Android.

#### Русский

Мистер Брокколи теперь предлагает полноценный интерфейс на японском и венгерском
языках. Если провайдер поддерживает венгерский, его также можно выбрать для
распознавания речи и озвучивания ответов. Новая иконка лучше передаёт характер
приложения и адаптируется к формам и темам Android.

#### 简体中文

西兰花先生现已提供完整的日语和匈牙利语界面。服务提供商支持时，匈牙利语也可用于
语音识别和语音回复。全新的应用图标更鲜明地展现了西兰花先生，并可适配 Android
的不同图标形状和主题色。

#### العربية

يوفر السيد بروكلي الآن واجهتين كاملتين باليابانية والمجرية. ويمكن اختيار
المجرية للتعرّف على الكلام والردود المنطوقة عندما يدعمها المزوّد. يعكس رمز
التطبيق الجديد شخصية السيد بروكلي بوضوح أكبر ويتكيف مع أشكال الرموز وسمات
Android.

#### 日本語

ミスター・ブロッコリーに、日本語とハンガリー語の完全なインターフェイスを追加しました。
対応プロバイダーでは、ハンガリー語を音声認識と読み上げにも選択できます。新しい
アプリアイコンは個性がより伝わるデザインになり、Android のアイコン形状や
テーマカラーにも対応します。

#### Magyar

A Brokkoli úr mostantól teljes japán és magyar felülettel is használható. A
magyar nyelv a beszédfelismeréshez és a felolvasott válaszokhoz is
kiválasztható, ha a szolgáltató támogatja. Az új alkalmazásikon jobban kifejezi
Brokkoli úr karakterét, és igazodik az Android ikonformáihoz és témáihoz.

## 2.5.1 - 2026-07-28

### Added

- Added complete interfaces for Hindi, Spanish, French, Italian, European
  Portuguese, Brazilian Portuguese, Russian, Simplified Chinese, and Arabic.
- Made every interface language independently selectable for speech
  recognition and spoken replies. Japanese remains available as an additional
  speech-only language.
- Added a gentle local cue before Drive Session automatically starts listening
  for the next turn.

### Changed

- Spoken replies now begin with the first complete paragraph, prefetch following
  paragraphs, and leave a natural pause between them.
- Interface, recognition, and spoken-reply languages now use one consistent,
  capability-aware language system without tying one choice to another.
- Drive Session now waits for playback to finish before automatically reopening
  the microphone.
- OpenAI and xAI web search now require current, grounded search results instead
  of accepting answers based only on model memory.

### Fixed

- Pausing a spoken reply now pauses the complete stream rather than allowing the
  next generated paragraph to start.
- Stabilized the response-timing border so it remains clearly visible and begins
  at the top center of the voice control.
- Prevented unsupported speech languages from being sent to provider routes.
  User-configured fallback routes remain explicit and preserve their chosen
  order.
- Improved right-to-left layout behavior throughout the Arabic interface.

### Store release notes

#### English

Mr Broccoli now offers Hindi, Spanish, French, Italian, Portuguese, Brazilian
Portuguese, Russian, Simplified Chinese, and Arabic interfaces. Every interface
language can also be selected independently for speech recognition and replies.
Spoken responses now have natural paragraph pauses, Drive Session resumes
listening automatically with a gentle cue, and web search requires current
grounded results.

#### Deutsch

Mr. Brokkoli bietet jetzt Oberflächen auf Hindi, Spanisch, Französisch,
Italienisch, Portugiesisch, brasilianischem Portugiesisch, Russisch,
vereinfachtem Chinesisch und Arabisch. Alle Oberflächensprachen können
unabhängig für Spracherkennung und Antworten gewählt werden. Gesprochene
Antworten haben natürlichere Pausen, der Fahrmodus hört automatisch weiter zu
und die Websuche nutzt aktuelle Quellen.

#### Українська

Пан Броколі тепер має інтерфейси гінді, іспанською, французькою, італійською,
португальською, бразильською португальською, російською, спрощеною китайською
та арабською. Мову розпізнавання й озвучення можна вибирати незалежно від мови
інтерфейсу. Озвучення отримало природні паузи, режим водіння автоматично
відновлює слухання, а вебпошук використовує актуальні джерела.

#### हिन्दी

मिस्टर ब्रोकली अब हिंदी, स्पेनिश, फ़्रेंच, इतालवी, पुर्तगाली, ब्राज़ीलियाई
पुर्तगाली, रूसी, सरलीकृत चीनी और अरबी इंटरफ़ेस देता है। इंटरफ़ेस, वाक् पहचान
और बोले गए जवाबों की भाषा अलग-अलग चुनी जा सकती है। बोले गए जवाबों में अब
स्वाभाविक अनुच्छेद विराम हैं, ड्राइव मोड हल्की ध्वनि के साथ अपने आप फिर सुनता
है और वेब खोज ताज़ा स्रोतों का उपयोग करती है।

#### Español

Mr. Brócoli ahora ofrece interfaces en hindi, español, francés, italiano,
portugués, portugués de Brasil, ruso, chino simplificado y árabe. Los idiomas
de la interfaz, el reconocimiento de voz y las respuestas habladas se eligen
por separado. Las respuestas tienen pausas naturales, el modo de conducción
reanuda la escucha con una señal suave y la búsqueda web usa fuentes actuales.

#### Français

M. Brocoli propose désormais des interfaces en hindi, espagnol, français,
italien, portugais, portugais brésilien, russe, chinois simplifié et arabe. Les
langues de l’interface, de la reconnaissance vocale et des réponses parlées se
choisissent séparément. La lecture bénéficie de pauses naturelles, le mode
conduite reprend l’écoute avec un signal discret et la recherche web utilise
des sources actuelles.

#### Italiano

Sig. Broccoli ora offre interfacce in hindi, spagnolo, francese, italiano,
portoghese, portoghese brasiliano, russo, cinese semplificato e arabo. Le
lingue dell’interfaccia, del riconoscimento vocale e delle risposte parlate
possono essere scelte separatamente. La lettura ha pause naturali, la modalità
Guida riprende l’ascolto con un segnale delicato e la ricerca web usa fonti
aggiornate.

#### Português

O Sr. Brócolo oferece agora interfaces em hindi, espanhol, francês, italiano,
português, português do Brasil, russo, chinês simplificado e árabe. Os idiomas
da interface, do reconhecimento de voz e das respostas faladas podem ser
escolhidos separadamente. A leitura tem pausas naturais, o modo de condução
retoma a escuta com um sinal suave e a pesquisa web utiliza fontes atuais.

#### Português (Brasil)

O Sr. Brócolis agora oferece interfaces em hindi, espanhol, francês, italiano,
português, português brasileiro, russo, chinês simplificado e árabe. Os idiomas
da interface, do reconhecimento de voz e das respostas faladas podem ser
escolhidos separadamente. A leitura ganhou pausas naturais, o modo de direção
volta a ouvir com um sinal suave e a pesquisa na web usa fontes atuais.

#### Русский

Мистер Брокколи теперь поддерживает интерфейс на хинди, испанском, французском,
итальянском, португальском, бразильском португальском, русском, упрощённом
китайском и арабском языках. Языки интерфейса, распознавания и озвучивания
выбираются отдельно. В речи появились естественные паузы, режим вождения сам
возобновляет прослушивание, а веб-поиск использует актуальные источники.

#### 简体中文

西兰花先生现已提供印地语、西班牙语、法语、意大利语、葡萄牙语、巴西葡萄牙语、
俄语、简体中文和阿拉伯语界面。界面语言、语音识别语言和朗读语言可以分别选择。
语音回复现在会在段落之间自然停顿；驾驶模式会以柔和提示音自动恢复聆听；网页
搜索会使用最新的可靠来源。

#### العربية

يوفر السيد بروكلي الآن واجهات بالهندية والإسبانية والفرنسية والإيطالية
والبرتغالية والبرتغالية البرازيلية والروسية والصينية المبسطة والعربية. يمكن
اختيار لغة الواجهة والتعرّف على الكلام والردود المنطوقة بشكل مستقل. أصبحت
الردود تتضمن فواصل طبيعية، ويستأنف وضع القيادة الاستماع تلقائيًا بتنبيه هادئ،
ويستخدم بحث الويب مصادر حديثة.

## 2.5.0 - 2026-07-28

### Added

- Added a complete Ukrainian interface, including settings, provider guidance,
  accessibility labels, and the localized app name **Пан Броколі**.
- Added a visual recording-capacity indicator to show how much speaking time
  remains.
- Added an adaptive border timeline that shows when a spoken response is
  expected and turns red when the response takes longer than estimated.

### Changed

- Redesigned the main voice control so recording, processing, interruption,
  pausing, and resuming all use the same prominent button.
- Replaced technical timing text with clearer phase guidance for recording,
  transcribing, thinking, searching, voice conversion, and speaking.
- Simplified Drive Session with explicit controls to pause or resume automatic
  continuation and repeat the last reply.
- Removed unnecessary synthesized voice cues from Drive Session.

### Fixed

- Fixed recording sessions ending immediately on some physical Android devices.
- Prevented Drive Session from automatically reopening the microphone after a
  failed or cancelled response.
- Made the recording-capacity indicator continue correctly across interface
  updates and layout changes.

### Store release notes

#### English

Mr Broccoli's voice controls have been redesigned for clearer, simpler
conversations. Recording now shows the available speaking time, and an animated
border indicates when a spoken response is expected. Drive Session gains clear
controls to pause or resume automatic continuation and repeat the last reply.
This release also improves Android recording reliability and adds a complete
Ukrainian interface.

#### Deutsch

Die Sprachsteuerung von Mr. Brokkoli wurde für klarere, einfachere Gespräche
überarbeitet. Beim Aufnehmen wird jetzt die verfügbare Sprechzeit angezeigt,
und ein animierter Rahmen zeigt, wann eine gesprochene Antwort zu erwarten ist.
Der Fahrmodus bietet klare Funktionen zum Pausieren und Fortsetzen der
Automatik sowie zum Wiederholen der letzten Antwort. Außerdem verbessert dieses
Update die Aufnahme unter Android und ergänzt eine ukrainische Oberfläche.

#### Українська

Голосове керування Пана Броколі стало простішим і зрозумілішим. Під час запису
тепер видно доступний час, а анімована рамка показує, коли очікується голосова
відповідь. У режимі водіння можна призупинити або відновити автоматичне
продовження та повторити останню відповідь. Також покращено надійність запису
на Android і додано повний український інтерфейс.
