# Changelog

This file records user-visible changes to Mr Broccoli.

Each released version also includes localized store notes. These summaries are
kept within Google Play's 500-character limit per language and can also be used
for Apple's **What's New in This Version** field. Beginning with version 2.5.3,
the complete Play Store translations are kept in a dedicated file under
`docs/`.

## Unreleased

### Added

- Added readable and passphrase-encrypted app-data backups for portable
  settings and complete conversation history. Provider API keys, diagnostics,
  caches, audio, and downloaded models are never included.
- Added non-destructive backup restore: existing data and API keys remain in
  place, identical conversations are skipped, and ID conflicts are restored as
  separate copies.

### Changed

- Display the current release version on the Settings overview.
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
