# Changelog

This file records user-visible changes to Mr Broccoli.

Each released version also includes localized store notes. These summaries are
kept within Google Play's 500-character limit per language and can also be used
for Apple's **What's New in This Version** field.

## Unreleased

No user-visible changes yet.

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
