# App Store release notes — 4.2.0

"What's New in This Version" text for App Store Connect, one block per app
language. Locale codes and order follow `app-store-listing-translations.md`.
Apple allows 4,000 characters per locale; every block stays well below that.
Feature names use each language's shipped UI strings (`Hands free`, `Council`,
`Web`, `Image`, `Model Council`, `System Recognition`, `Full reply first`,
`Settings`). Non-English copy has not been reviewed by native speakers.

Covers every user-visible iOS change since 4.1.0. Android-only changes are
omitted.

## English (`en-US`)

```text
Mr Broccoli 4.2 brings the newest AI models, better speech, and a long list of reliability fixes.

NEW MODELS
• GPT-6 Astra, GPT-6 Sol and GPT-6 Luna, with every supported reasoning effort up to Max.
• Claude Opus 5.5, Claude Opus 5 and Claude Fable 5.1.
• Grok 4.7 and Grok 4.6.
• Gemini 3.8 Flash and Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash and Qwen 3.7 Flash, with model-specific reasoning controls.
• DeepSeek V4.1 Flash, which now also understands images. DeepSeek models add a Low reasoning setting.
• OpenRouter adds current versions of GPT-6 Astra, Sol and Luna, Claude Opus 5.5, Opus 5 and Fable 5.1, Grok 4.7 and 4.6, Gemini 3.8 Flash, Qwen 3.8 Max, and DeepSeek V4 Pro and V4.1 Flash.

SPEECH
• GPT Transcribe is the new default for OpenAI speech input, and Gemini 3.5 Transcribe adds word-for-word transcription.
• New Gemini 3.8 Flash and Flash-Lite voices for spoken replies.
• Long dictation now keeps every sentence, not just the last one.
• System Recognition can be chosen whenever iOS offers it, even when strict offline recognition is unavailable.
• Full reply first pauses between paragraphs again, and cancelling reliably stops any queued audio.
• Voice previews can now replace a paused spoken reply.
• Voices saved for a conversation stay selected when a provider updates its models, and OpenAI's older voice models only show voices they support.

WORKSPACE
• A cleaner voice and text layout: the arrows, voice orb and composer sit on one line, Image and Hands free move to the edges, and Council and Web stay centred. The composer and send button stay visible on small screens and with the keyboard open.
• Adding an answering model no longer leaves Settings unresponsive.

RELIABILITY AND PRIVACY
• Starting a second recording or Hands free no longer stops a recording already in progress.
• Web search keeps usable results, rejects empty answers and cancels stalled responses. Gemini and xAI search no longer ask the provider to store your requests.
• Model Council now credits the provider and model that actually answered.
• Backup restores and conversation branches report failed saves instead of claiming success.
• Locked conversations stay locked if the app goes to the background while one is loading.
• The app recovers from temporary storage start-up problems without a restart.
• A damaged settings file no longer hides your saved API keys.
• Slow requests always end with a clear timeout message.

CHANGES
• Qwen speech input and output are removed ahead of Alibaba retiring them on October 10. Qwen chat and search are unchanged, and saved Qwen voices switch to your device's built-in speech.
• Google now limits Gemini 2.5 to accounts that already used it, so it is no longer offered for new choices. Existing selections keep working, and older Gemini 2.5 voices move to Gemini 3.8 with the same voice.
• OpenAI Realtime models are hidden until they are fully supported. Saved selections move to GPT-5.6 Sol or GPT-5.4 mini.
• The ElevenLabs built-in fallback voice is now correctly named Janet.
```

## German (`de-DE`)

```text
Mr Broccoli 4.2 bringt die neuesten KI-Modelle, bessere Sprachfunktionen und viele Zuverlässigkeitsverbesserungen.

NEUE MODELLE
• GPT-6 Astra, GPT-6 Sol und GPT-6 Luna mit allen unterstützten Denkstufen bis Max.
• Claude Opus 5.5, Claude Opus 5 und Claude Fable 5.1.
• Grok 4.7 und Grok 4.6.
• Gemini 3.8 Flash und Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash und Qwen 3.7 Flash mit modellspezifischer Denksteuerung.
• DeepSeek V4.1 Flash versteht jetzt auch Bilder. DeepSeek-Modelle erhalten die Denkstufe Niedrig.
• OpenRouter bietet aktuelle Versionen von GPT-6 Astra, Sol und Luna, Claude Opus 5.5, Opus 5 und Fable 5.1, Grok 4.7 und 4.6, Gemini 3.8 Flash, Qwen 3.8 Max sowie DeepSeek V4 Pro und V4.1 Flash.

SPRACHE
• GPT Transcribe ist die neue Standard-Spracheingabe für OpenAI, und Gemini 3.5 Transcribe transkribiert wortgetreu.
• Neue Stimmen von Gemini 3.8 Flash und Flash-Lite für gesprochene Antworten.
• Lange Diktate behalten jetzt jeden Satz, nicht nur den letzten.
• Systemerkennung lässt sich wählen, sobald iOS sie anbietet – auch ohne strikte Offline-Erkennung.
• Komplette Antwort zuerst pausiert wieder zwischen Absätzen, und Abbrechen stoppt zuverlässig jede wartende Audioausgabe.
• Stimmvorschauen können jetzt eine pausierte gesprochene Antwort ersetzen.
• Für eine Unterhaltung gespeicherte Stimmen bleiben erhalten, wenn ein Anbieter seine Modelle aktualisiert, und ältere OpenAI-Sprachmodelle zeigen nur unterstützte Stimmen.

ARBEITSBEREICH
• Ein aufgeräumteres Sprach- und Textlayout: Pfeile, Sprach-Orb und Eingabefeld liegen auf einer Linie, Bild und Freihändig rücken an die Ränder, Rat und Web bleiben mittig. Eingabefeld und Senden-Taste bleiben auf kleinen Bildschirmen und bei geöffneter Tastatur sichtbar.
• Das Hinzufügen eines Antwortmodells lässt die Einstellungen nicht mehr hängen.

ZUVERLÄSSIGKEIT UND DATENSCHUTZ
• Eine zweite Aufnahme oder Freihändig beendet keine laufende Aufnahme mehr.
• Die Websuche behält brauchbare Ergebnisse, verwirft leere Antworten und bricht hängende Antworten ab. Gemini- und xAI-Suchen bitten den Anbieter nicht mehr, deine Anfragen zu speichern.
• Der Modellrat nennt jetzt Anbieter und Modell, die tatsächlich geantwortet haben.
• Backup-Wiederherstellungen und Gesprächszweige melden fehlgeschlagene Speichervorgänge, statt Erfolg zu melden.
• Gesperrte Unterhaltungen bleiben gesperrt, wenn die App beim Laden in den Hintergrund wechselt.
• Die App erholt sich ohne Neustart von vorübergehenden Speicherproblemen beim Start.
• Eine beschädigte Einstellungsdatei versteckt deine gespeicherten API-Schlüssel nicht mehr.
• Langsame Anfragen enden immer mit einer klaren Zeitüberschreitungsmeldung.

ÄNDERUNGEN
• Qwen-Spracheingabe und -ausgabe entfallen, bevor Alibaba sie am 10. Oktober einstellt. Qwen-Chat und -Suche bleiben unverändert; gespeicherte Qwen-Stimmen wechseln zur integrierten Sprachausgabe deines Geräts.
• Google beschränkt Gemini 2.5 jetzt auf Konten, die es bereits genutzt haben, daher wird es nicht mehr neu angeboten. Bestehende Auswahlen funktionieren weiter, und ältere Gemini-2.5-Stimmen wechseln mit derselben Stimme zu Gemini 3.8.
• OpenAI-Realtime-Modelle sind ausgeblendet, bis sie vollständig unterstützt werden. Gespeicherte Auswahlen wechseln zu GPT-5.6 Sol oder GPT-5.4 mini.
• Die integrierte Ersatzstimme von ElevenLabs heißt jetzt korrekt Janet.
```

## Ukrainian (`uk`)

```text
Mr Broccoli 4.2 додає найновіші моделі ШІ, покращене мовлення та багато виправлень надійності.

НОВІ МОДЕЛІ
• GPT-6 Astra, GPT-6 Sol і GPT-6 Luna з усіма підтримуваними рівнями міркування аж до Max.
• Claude Opus 5.5, Claude Opus 5 і Claude Fable 5.1.
• Grok 4.7 і Grok 4.6.
• Gemini 3.8 Flash і Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash і Qwen 3.7 Flash з керуванням міркуванням для кожної моделі.
• DeepSeek V4.1 Flash тепер розуміє й зображення. Моделі DeepSeek отримали низький рівень міркування.
• OpenRouter додає актуальні версії GPT-6 Astra, Sol і Luna, Claude Opus 5.5, Opus 5 і Fable 5.1, Grok 4.7 і 4.6, Gemini 3.8 Flash, Qwen 3.8 Max, а також DeepSeek V4 Pro і V4.1 Flash.

МОВЛЕННЯ
• GPT Transcribe — новий стандарт для голосового введення OpenAI, а Gemini 3.5 Transcribe розпізнає мовлення дослівно.
• Нові голоси Gemini 3.8 Flash і Flash-Lite для озвучених відповідей.
• Довге диктування тепер зберігає кожне речення, а не лише останнє.
• Системне розпізнавання можна вибрати щоразу, коли його пропонує iOS, навіть без суворого офлайн-режиму.
• «Спочатку повна відповідь» знову робить паузи між абзацами, а скасування надійно зупиняє все аудіо в черзі.
• Попередній перегляд голосу тепер може замінити призупинену озвучену відповідь.
• Голоси, збережені для розмови, лишаються вибраними, коли постачальник оновлює моделі, а старіші голосові моделі OpenAI показують лише підтримувані голоси.

РОБОЧИЙ ПРОСТІР
• Охайніше розташування голосу й тексту: стрілки, голосова сфера та поле введення стоять в одному рядку, «Фото» та «Без рук» переміщено до країв, «Рада» та «Веб» лишаються по центру. Поле введення й кнопка надсилання видимі на малих екранах і з відкритою клавіатурою.
• Додавання моделі для відповідей більше не блокує Налаштування.

НАДІЙНІСТЬ І ПРИВАТНІСТЬ
• Запуск другого запису або режиму «Без рук» більше не зупиняє вже активний запис.
• Вебпошук зберігає корисні результати, відкидає порожні відповіді й скасовує завислі. Пошук Gemini і xAI більше не просить постачальника зберігати ваші запити.
• «Рада моделей» тепер вказує постачальника й модель, які справді відповіли.
• Відновлення з резервної копії та гілки розмов повідомляють про невдале збереження замість хибного успіху.
• Заблоковані розмови лишаються заблокованими, якщо застосунок переходить у фон під час завантаження.
• Застосунок відновлюється після тимчасових проблем зі сховищем під час запуску без перезапуску.
• Пошкоджений файл налаштувань більше не приховує збережені API-ключі.
• Повільні запити завжди завершуються зрозумілим повідомленням про тайм-аут.

ЗМІНИ
• Голосове введення й озвучення Qwen вимкнено до того, як Alibaba припинить їх 10 жовтня. Чат і пошук Qwen не змінилися, а збережені голоси Qwen переходять на вбудоване мовлення пристрою.
• Google тепер обмежує Gemini 2.5 обліковими записами, які вже ним користувалися, тому для нового вибору він більше не пропонується. Наявні вибори працюють, а старіші голоси Gemini 2.5 переходять на Gemini 3.8 з тим самим голосом.
• Моделі OpenAI Realtime приховано до повної підтримки. Збережені вибори переходять на GPT-5.6 Sol або GPT-5.4 mini.
• Вбудований резервний голос ElevenLabs тепер правильно називається Janet.
```

## Hindi (`hi`)

```text
Mr Broccoli 4.2 नवीनतम AI मॉडल, बेहतर स्पीच और कई विश्वसनीयता सुधार लाता है।

नए मॉडल
• GPT-6 Astra, GPT-6 Sol और GPT-6 Luna, Max तक हर समर्थित reasoning स्तर के साथ।
• Claude Opus 5.5, Claude Opus 5 और Claude Fable 5.1।
• Grok 4.7 और Grok 4.6।
• Gemini 3.8 Flash और Gemini 3.7 Flash।
• Qwen 3.8 Max, Qwen 3.8 Flash और Qwen 3.7 Flash, हर मॉडल के अपने reasoning नियंत्रणों के साथ।
• DeepSeek V4.1 Flash अब इमेज भी समझता है। DeepSeek मॉडल में Low reasoning स्तर जोड़ा गया है।
• OpenRouter में GPT-6 Astra, Sol और Luna, Claude Opus 5.5, Opus 5 और Fable 5.1, Grok 4.7 और 4.6, Gemini 3.8 Flash, Qwen 3.8 Max तथा DeepSeek V4 Pro और V4.1 Flash के नवीनतम संस्करण जोड़े गए हैं।

स्पीच
• OpenAI स्पीच इनपुट के लिए GPT Transcribe नया डिफ़ॉल्ट है, और Gemini 3.5 Transcribe शब्दशः ट्रांसक्रिप्शन करता है।
• बोले गए उत्तरों के लिए Gemini 3.8 Flash और Flash-Lite की नई आवाज़ें।
• लंबा डिक्टेशन अब हर वाक्य रखता है, सिर्फ़ आख़िरी नहीं।
• जब भी iOS उपलब्ध कराए, सिस्टम पहचान चुनी जा सकती है, सख़्त ऑफ़लाइन पहचान न होने पर भी।
• पूर्ण उत्तर पहले फिर से अनुच्छेदों के बीच रुकता है, और रद्द करने पर कतार का सारा ऑडियो भरोसेमंद ढंग से रुक जाता है।
• वॉइस प्रीव्यू अब रुके हुए बोले गए उत्तर की जगह ले सकता है।
• किसी बातचीत के लिए सहेजी आवाज़ें प्रदाता के मॉडल अपडेट करने पर भी चुनी रहती हैं, और OpenAI के पुराने वॉइस मॉडल केवल समर्थित आवाज़ें दिखाते हैं।

वर्कस्पेस
• साफ़ वॉइस और टेक्स्ट लेआउट: तीर, वॉइस ऑर्ब और कंपोज़र एक ही पंक्ति में हैं, छवि और हैंड्स-फ़्री किनारों पर चले गए हैं, और परिषद व वेब बीच में रहते हैं। छोटी स्क्रीन पर और कीबोर्ड खुला होने पर भी कंपोज़र और भेजें बटन दिखते रहते हैं।
• उत्तर देने वाला मॉडल जोड़ने से अब सेटिंग्स अटकती नहीं।

विश्वसनीयता और गोपनीयता
• दूसरी रिकॉर्डिंग या हैंड्स-फ़्री शुरू करने से चल रही रिकॉर्डिंग अब नहीं रुकती।
• वेब खोज उपयोगी परिणाम रखती है, खाली उत्तर अस्वीकार करती है और अटके जवाब रद्द करती है। Gemini और xAI खोज अब प्रदाता से आपके अनुरोध सहेजने को नहीं कहतीं।
• मॉडल परिषद अब उसी प्रदाता और मॉडल को श्रेय देती है जिसने वास्तव में उत्तर दिया।
• बैकअप रिस्टोर और बातचीत की शाखाएँ सफलता का दावा करने के बजाय असफल सेव की सूचना देती हैं।
• लोड होते समय ऐप बैकग्राउंड में जाए तो भी लॉक की गई बातचीत लॉक रहती है।
• ऐप स्टार्ट-अप पर अस्थायी स्टोरेज समस्याओं से बिना रीस्टार्ट उबर जाता है।
• ख़राब सेटिंग्स फ़ाइल अब आपकी सहेजी API कुंजियाँ नहीं छिपाती।
• धीमे अनुरोध हमेशा एक स्पष्ट टाइमआउट संदेश के साथ समाप्त होते हैं।

बदलाव
• Alibaba के 10 अक्टूबर को बंद करने से पहले Qwen स्पीच इनपुट और आउटपुट हटा दिए गए हैं। Qwen चैट और खोज पहले जैसी हैं, और सहेजी Qwen आवाज़ें आपके डिवाइस की बिल्ट-इन स्पीच पर चली जाती हैं।
• Google अब Gemini 2.5 को केवल उन खातों तक सीमित करता है जिन्होंने इसे पहले उपयोग किया है, इसलिए यह नए चयन के लिए नहीं दिखता। मौजूदा चयन काम करते रहते हैं, और पुरानी Gemini 2.5 आवाज़ें उसी आवाज़ के साथ Gemini 3.8 पर चली जाती हैं।
• OpenAI Realtime मॉडल पूरी तरह समर्थित होने तक छिपे हैं। सहेजे चयन GPT-5.6 Sol या GPT-5.4 mini पर चले जाते हैं।
• ElevenLabs की बिल्ट-इन फ़ॉलबैक आवाज़ का नाम अब सही रूप से Janet है।
```

## Spanish (`es-ES`)

```text
Mr Broccoli 4.2 trae los modelos de IA más recientes, mejor voz y una larga lista de mejoras de fiabilidad.

NUEVOS MODELOS
• GPT-6 Astra, GPT-6 Sol y GPT-6 Luna, con todos los niveles de razonamiento compatibles hasta Max.
• Claude Opus 5.5, Claude Opus 5 y Claude Fable 5.1.
• Grok 4.7 y Grok 4.6.
• Gemini 3.8 Flash y Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash y Qwen 3.7 Flash, con controles de razonamiento propios de cada modelo.
• DeepSeek V4.1 Flash, que ahora también entiende imágenes. Los modelos DeepSeek añaden el nivel de razonamiento Bajo.
• OpenRouter añade versiones actuales de GPT-6 Astra, Sol y Luna, Claude Opus 5.5, Opus 5 y Fable 5.1, Grok 4.7 y 4.6, Gemini 3.8 Flash, Qwen 3.8 Max y DeepSeek V4 Pro y V4.1 Flash.

VOZ
• GPT Transcribe es la nueva opción predeterminada para la entrada de voz de OpenAI, y Gemini 3.5 Transcribe transcribe palabra por palabra.
• Nuevas voces de Gemini 3.8 Flash y Flash-Lite para las respuestas habladas.
• El dictado largo conserva ahora cada frase, no solo la última.
• El Reconocimiento del sistema puede elegirse siempre que iOS lo ofrezca, aunque no haya reconocimiento sin conexión estricto.
• Respuesta completa primero vuelve a hacer pausas entre párrafos, y cancelar detiene de forma fiable todo el audio en cola.
• Las vistas previas de voz ya pueden sustituir una respuesta hablada en pausa.
• Las voces guardadas para una conversación se mantienen cuando un proveedor actualiza sus modelos, y los modelos de voz antiguos de OpenAI solo muestran las voces compatibles.

ESPACIO DE TRABAJO
• Un diseño de voz y texto más limpio: las flechas, el orbe de voz y el editor quedan en una línea, Imagen y Manos libres pasan a los bordes, y Consejo y Web siguen centrados. El editor y el botón de enviar siguen visibles en pantallas pequeñas y con el teclado abierto.
• Añadir un modelo de respuesta ya no bloquea los Ajustes.

FIABILIDAD Y PRIVACIDAD
• Iniciar una segunda grabación o Manos libres ya no detiene una grabación en curso.
• La búsqueda web conserva los resultados útiles, rechaza respuestas vacías y cancela las respuestas bloqueadas. Las búsquedas de Gemini y xAI ya no piden al proveedor que guarde tus solicitudes.
• El Consejo de modelos indica ahora el proveedor y el modelo que respondieron realmente.
• Las restauraciones de copias y las ramas de conversación informan de los guardados fallidos en lugar de indicar éxito.
• Las conversaciones bloqueadas siguen bloqueadas si la app pasa a segundo plano mientras se cargan.
• La app se recupera sin reiniciarse de problemas temporales de almacenamiento al arrancar.
• Un archivo de ajustes dañado ya no oculta tus claves API guardadas.
• Las solicitudes lentas siempre terminan con un mensaje claro de tiempo de espera agotado.

CAMBIOS
• La entrada y salida de voz de Qwen se retiran antes de que Alibaba las cierre el 10 de octubre. El chat y la búsqueda de Qwen no cambian, y las voces de Qwen guardadas pasan a la voz integrada del dispositivo.
• Google limita ahora Gemini 2.5 a las cuentas que ya lo usaban, por lo que ya no se ofrece para nuevas selecciones. Las selecciones existentes siguen funcionando, y las voces antiguas de Gemini 2.5 pasan a Gemini 3.8 con la misma voz.
• Los modelos OpenAI Realtime quedan ocultos hasta que sean totalmente compatibles. Las selecciones guardadas pasan a GPT-5.6 Sol o GPT-5.4 mini.
• La voz de respaldo integrada de ElevenLabs se llama ahora correctamente Janet.
```

## French (`fr-FR`)

```text
Mr Broccoli 4.2 apporte les modèles d’IA les plus récents, une meilleure voix et de nombreuses améliorations de fiabilité.

NOUVEAUX MODÈLES
• GPT-6 Astra, GPT-6 Sol et GPT-6 Luna, avec tous les niveaux de raisonnement pris en charge jusqu’à Max.
• Claude Opus 5.5, Claude Opus 5 et Claude Fable 5.1.
• Grok 4.7 et Grok 4.6.
• Gemini 3.8 Flash et Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash et Qwen 3.7 Flash, avec des réglages de raisonnement propres à chaque modèle.
• DeepSeek V4.1 Flash, qui comprend désormais aussi les images. Les modèles DeepSeek ajoutent le niveau de raisonnement Faible.
• OpenRouter ajoute les versions actuelles de GPT-6 Astra, Sol et Luna, Claude Opus 5.5, Opus 5 et Fable 5.1, Grok 4.7 et 4.6, Gemini 3.8 Flash, Qwen 3.8 Max, ainsi que DeepSeek V4 Pro et V4.1 Flash.

PAROLE
• GPT Transcribe devient l’option par défaut pour la saisie vocale OpenAI, et Gemini 3.5 Transcribe transcrit mot pour mot.
• Nouvelles voix Gemini 3.8 Flash et Flash-Lite pour les réponses parlées.
• Les longues dictées conservent désormais chaque phrase, pas seulement la dernière.
• La Reconnaissance du système peut être choisie dès qu’iOS la propose, même sans reconnaissance hors ligne stricte.
• Réponse complète en premier marque à nouveau des pauses entre les paragraphes, et l’annulation arrête de façon fiable tout l’audio en attente.
• Les aperçus de voix peuvent désormais remplacer une réponse parlée en pause.
• Les voix enregistrées pour une conversation restent sélectionnées quand un fournisseur met à jour ses modèles, et les anciens modèles vocaux d’OpenAI n’affichent que les voix compatibles.

ESPACE DE TRAVAIL
• Une disposition voix et texte plus claire : les flèches, l’orbe vocal et la zone de saisie sont sur une même ligne, Image et Mains libres passent sur les bords, Conseil et Web restent au centre. La zone de saisie et le bouton d’envoi restent visibles sur les petits écrans et clavier ouvert.
• Ajouter un modèle de réponse ne bloque plus les Paramètres.

FIABILITÉ ET CONFIDENTIALITÉ
• Lancer un deuxième enregistrement ou Mains libres n’arrête plus un enregistrement en cours.
• La recherche web conserve les résultats utiles, rejette les réponses vides et annule les réponses bloquées. Les recherches Gemini et xAI ne demandent plus au fournisseur de stocker vos requêtes.
• Le Conseil des modèles crédite désormais le fournisseur et le modèle qui ont réellement répondu.
• Les restaurations de sauvegarde et les branches de conversation signalent les enregistrements échoués au lieu d’annoncer un succès.
• Les conversations verrouillées restent verrouillées si l’app passe en arrière-plan pendant leur chargement.
• L’app se remet sans redémarrage de problèmes de stockage temporaires au démarrage.
• Un fichier de paramètres endommagé ne masque plus vos clés API enregistrées.
• Les requêtes lentes se terminent toujours par un message de délai dépassé clair.

CHANGEMENTS
• La saisie et la synthèse vocales de Qwen sont retirées avant leur arrêt par Alibaba le 10 octobre. Le chat et la recherche Qwen ne changent pas, et les voix Qwen enregistrées passent à la voix intégrée de l’appareil.
• Google limite désormais Gemini 2.5 aux comptes qui l’utilisaient déjà ; il n’est donc plus proposé pour de nouveaux choix. Les sélections existantes continuent de fonctionner, et les anciennes voix Gemini 2.5 passent à Gemini 3.8 avec la même voix.
• Les modèles OpenAI Realtime sont masqués jusqu’à leur prise en charge complète. Les sélections enregistrées passent à GPT-5.6 Sol ou GPT-5.4 mini.
• La voix de secours intégrée d’ElevenLabs s’appelle désormais correctement Janet.
```

## Italian (`it`)

```text
Mr Broccoli 4.2 porta i modelli di IA più recenti, una voce migliore e molti miglioramenti di affidabilità.

NUOVI MODELLI
• GPT-6 Astra, GPT-6 Sol e GPT-6 Luna, con tutti i livelli di ragionamento supportati fino a Max.
• Claude Opus 5.5, Claude Opus 5 e Claude Fable 5.1.
• Grok 4.7 e Grok 4.6.
• Gemini 3.8 Flash e Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash e Qwen 3.7 Flash, con controlli di ragionamento specifici per ogni modello.
• DeepSeek V4.1 Flash, che ora comprende anche le immagini. I modelli DeepSeek aggiungono il livello di ragionamento Basso.
• OpenRouter aggiunge le versioni attuali di GPT-6 Astra, Sol e Luna, Claude Opus 5.5, Opus 5 e Fable 5.1, Grok 4.7 e 4.6, Gemini 3.8 Flash, Qwen 3.8 Max e DeepSeek V4 Pro e V4.1 Flash.

VOCE
• GPT Transcribe è il nuovo predefinito per l’input vocale di OpenAI, e Gemini 3.5 Transcribe trascrive parola per parola.
• Nuove voci Gemini 3.8 Flash e Flash-Lite per le risposte parlate.
• La dettatura lunga ora conserva ogni frase, non solo l’ultima.
• Il Riconoscimento del sistema si può scegliere ogni volta che iOS lo offre, anche senza riconoscimento offline rigoroso.
• Prima la risposta completa torna a fare pause tra i paragrafi, e l’annullamento ferma in modo affidabile tutto l’audio in coda.
• Le anteprime vocali ora possono sostituire una risposta parlata in pausa.
• Le voci salvate per una conversazione restano selezionate quando un fornitore aggiorna i modelli, e i vecchi modelli vocali di OpenAI mostrano solo le voci supportate.

AREA DI LAVORO
• Un layout voce e testo più pulito: frecce, sfera vocale e campo di testo stanno su una sola riga, Immagine e Vivavoce vanno ai bordi, Consiglio e Web restano al centro. Il campo di testo e il pulsante di invio restano visibili sugli schermi piccoli e con la tastiera aperta.
• Aggiungere un modello di risposta non blocca più le Impostazioni.

AFFIDABILITÀ E PRIVACY
• Avviare una seconda registrazione o il Vivavoce non interrompe più una registrazione in corso.
• La ricerca web conserva i risultati utili, scarta le risposte vuote e annulla quelle bloccate. Le ricerche Gemini e xAI non chiedono più al fornitore di conservare le tue richieste.
• Il Consiglio dei modelli ora indica il fornitore e il modello che hanno risposto davvero.
• I ripristini dei backup e i rami delle conversazioni segnalano i salvataggi non riusciti invece di dichiarare successo.
• Le conversazioni bloccate restano bloccate se l’app passa in background durante il caricamento.
• L’app si riprende senza riavvio da problemi temporanei di archiviazione all’avvio.
• Un file delle impostazioni danneggiato non nasconde più le chiavi API salvate.
• Le richieste lente terminano sempre con un messaggio chiaro di tempo scaduto.

MODIFICHE
• L’input e l’output vocale di Qwen vengono rimossi prima che Alibaba li dismetta il 10 ottobre. Chat e ricerca Qwen non cambiano, e le voci Qwen salvate passano alla voce integrata del dispositivo.
• Google ora limita Gemini 2.5 agli account che lo usavano già, quindi non viene più proposto per nuove scelte. Le selezioni esistenti continuano a funzionare, e le vecchie voci Gemini 2.5 passano a Gemini 3.8 con la stessa voce.
• I modelli OpenAI Realtime sono nascosti finché non saranno pienamente supportati. Le selezioni salvate passano a GPT-5.6 Sol o GPT-5.4 mini.
• La voce di riserva integrata di ElevenLabs ora si chiama correttamente Janet.
```

## Portuguese (`pt-PT`)

```text
O Mr Broccoli 4.2 traz os modelos de IA mais recentes, melhor voz e muitas melhorias de fiabilidade.

NOVOS MODELOS
• GPT-6 Astra, GPT-6 Sol e GPT-6 Luna, com todos os níveis de raciocínio suportados até Max.
• Claude Opus 5.5, Claude Opus 5 e Claude Fable 5.1.
• Grok 4.7 e Grok 4.6.
• Gemini 3.8 Flash e Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash e Qwen 3.7 Flash, com controlos de raciocínio próprios de cada modelo.
• DeepSeek V4.1 Flash, que agora também compreende imagens. Os modelos DeepSeek ganham o nível de raciocínio Baixo.
• O OpenRouter adiciona versões atuais de GPT-6 Astra, Sol e Luna, Claude Opus 5.5, Opus 5 e Fable 5.1, Grok 4.7 e 4.6, Gemini 3.8 Flash, Qwen 3.8 Max e DeepSeek V4 Pro e V4.1 Flash.

VOZ
• O GPT Transcribe passa a ser a predefinição para a entrada de voz da OpenAI, e o Gemini 3.5 Transcribe transcreve palavra a palavra.
• Novas vozes Gemini 3.8 Flash e Flash-Lite para respostas faladas.
• Os ditados longos mantêm agora cada frase, e não só a última.
• O Reconhecimento do Sistema pode ser escolhido sempre que o iOS o disponibiliza, mesmo sem reconhecimento offline estrito.
• Resposta completa primeiro volta a fazer pausas entre parágrafos, e cancelar para de forma fiável todo o áudio em fila.
• As pré-visualizações de voz podem agora substituir uma resposta falada em pausa.
• As vozes guardadas para uma conversa mantêm-se quando um fornecedor atualiza os modelos, e os modelos de voz antigos da OpenAI só mostram vozes compatíveis.

ESPAÇO DE TRABALHO
• Um esquema de voz e texto mais limpo: setas, orbe de voz e editor ficam numa linha, Imagem e Mãos livres passam para as margens, e Conselho e Web ficam ao centro. O editor e o botão de envio ficam visíveis em ecrãs pequenos e com o teclado aberto.
• Adicionar um modelo de resposta já não bloqueia as Definições.

FIABILIDADE E PRIVACIDADE
• Iniciar uma segunda gravação ou Mãos livres já não para uma gravação em curso.
• A pesquisa na Web mantém resultados úteis, rejeita respostas vazias e cancela respostas bloqueadas. As pesquisas Gemini e xAI já não pedem ao fornecedor que guarde os seus pedidos.
• O Conselho de Modelos indica agora o fornecedor e o modelo que responderam de facto.
• Os restauros de cópias de segurança e os ramos de conversa assinalam gravações falhadas em vez de indicar sucesso.
• As conversas bloqueadas mantêm-se bloqueadas se a app passar para segundo plano durante o carregamento.
• A app recupera sem reiniciar de problemas temporários de armazenamento no arranque.
• Um ficheiro de definições danificado já não esconde as chaves API guardadas.
• Os pedidos lentos terminam sempre com uma mensagem clara de tempo esgotado.

ALTERAÇÕES
• A entrada e saída de voz do Qwen são removidas antes de a Alibaba as encerrar a 10 de outubro. O chat e a pesquisa Qwen não mudam, e as vozes Qwen guardadas passam para a voz integrada do dispositivo.
• A Google limita agora o Gemini 2.5 às contas que já o usavam, por isso deixa de ser oferecido para novas escolhas. As seleções existentes continuam a funcionar, e as vozes antigas do Gemini 2.5 passam para o Gemini 3.8 com a mesma voz.
• Os modelos OpenAI Realtime estão ocultos até serem totalmente suportados. As seleções guardadas passam para GPT-5.6 Sol ou GPT-5.4 mini.
• A voz de recurso integrada da ElevenLabs chama-se agora corretamente Janet.
```

## Brazilian Portuguese (`pt-BR`)

```text
O Mr Broccoli 4.2 traz os modelos de IA mais recentes, voz melhor e muitas melhorias de confiabilidade.

NOVOS MODELOS
• GPT-6 Astra, GPT-6 Sol e GPT-6 Luna, com todos os níveis de raciocínio compatíveis até Max.
• Claude Opus 5.5, Claude Opus 5 e Claude Fable 5.1.
• Grok 4.7 e Grok 4.6.
• Gemini 3.8 Flash e Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash e Qwen 3.7 Flash, com controles de raciocínio próprios de cada modelo.
• DeepSeek V4.1 Flash, que agora também entende imagens. Os modelos DeepSeek ganham o nível de raciocínio Baixo.
• O OpenRouter adiciona versões atuais de GPT-6 Astra, Sol e Luna, Claude Opus 5.5, Opus 5 e Fable 5.1, Grok 4.7 e 4.6, Gemini 3.8 Flash, Qwen 3.8 Max e DeepSeek V4 Pro e V4.1 Flash.

VOZ
• O GPT Transcribe é o novo padrão para a entrada de voz da OpenAI, e o Gemini 3.5 Transcribe transcreve palavra por palavra.
• Novas vozes Gemini 3.8 Flash e Flash-Lite para respostas faladas.
• Ditados longos agora mantêm cada frase, não só a última.
• O Reconhecimento do Sistema pode ser escolhido sempre que o iOS oferecer, mesmo sem reconhecimento offline estrito.
• Resposta completa primeiro volta a pausar entre parágrafos, e cancelar interrompe de forma confiável todo o áudio na fila.
• As prévias de voz agora podem substituir uma resposta falada pausada.
• As vozes salvas para uma conversa continuam selecionadas quando um provedor atualiza os modelos, e os modelos de voz antigos da OpenAI só mostram vozes compatíveis.

ÁREA DE TRABALHO
• Um layout de voz e texto mais limpo: setas, orbe de voz e campo de texto ficam em uma linha, Imagem e Mãos livres vão para as bordas, e Conselho e Web ficam no centro. O campo de texto e o botão de enviar continuam visíveis em telas pequenas e com o teclado aberto.
• Adicionar um modelo de resposta não trava mais as Configurações.

CONFIABILIDADE E PRIVACIDADE
• Iniciar uma segunda gravação ou o Mãos livres não interrompe mais uma gravação em andamento.
• A busca na Web mantém resultados úteis, rejeita respostas vazias e cancela respostas travadas. As buscas do Gemini e do xAI não pedem mais ao provedor para armazenar suas solicitações.
• O Conselho de Modelos agora credita o provedor e o modelo que realmente responderam.
• Restaurações de backup e ramificações de conversa informam falhas ao salvar em vez de indicar sucesso.
• Conversas bloqueadas continuam bloqueadas se o app for para segundo plano durante o carregamento.
• O app se recupera sem reiniciar de problemas temporários de armazenamento na inicialização.
• Um arquivo de configurações danificado não esconde mais suas chaves de API salvas.
• Solicitações lentas sempre terminam com uma mensagem clara de tempo esgotado.

MUDANÇAS
• A entrada e a saída de voz do Qwen foram removidas antes de a Alibaba desativá-las em 10 de outubro. O chat e a busca do Qwen não mudam, e as vozes do Qwen salvas passam para a voz integrada do seu dispositivo.
• O Google agora limita o Gemini 2.5 às contas que já o usavam, então ele não é mais oferecido para novas escolhas. As seleções existentes continuam funcionando, e as vozes antigas do Gemini 2.5 passam para o Gemini 3.8 com a mesma voz.
• Os modelos OpenAI Realtime ficam ocultos até terem suporte completo. As seleções salvas passam para GPT-5.6 Sol ou GPT-5.4 mini.
• A voz reserva integrada da ElevenLabs agora se chama corretamente Janet.
```

## Russian (`ru`)

```text
Mr Broccoli 4.2 добавляет новейшие модели ИИ, улучшенную речь и множество исправлений надёжности.

НОВЫЕ МОДЕЛИ
• GPT-6 Astra, GPT-6 Sol и GPT-6 Luna со всеми поддерживаемыми уровнями рассуждения вплоть до Max.
• Claude Opus 5.5, Claude Opus 5 и Claude Fable 5.1.
• Grok 4.7 и Grok 4.6.
• Gemini 3.8 Flash и Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash и Qwen 3.7 Flash с настройками рассуждения для каждой модели.
• DeepSeek V4.1 Flash теперь понимает и изображения. Модели DeepSeek получили низкий уровень рассуждения.
• В OpenRouter добавлены актуальные версии GPT-6 Astra, Sol и Luna, Claude Opus 5.5, Opus 5 и Fable 5.1, Grok 4.7 и 4.6, Gemini 3.8 Flash, Qwen 3.8 Max, а также DeepSeek V4 Pro и V4.1 Flash.

РЕЧЬ
• GPT Transcribe — новый вариант по умолчанию для голосового ввода OpenAI, а Gemini 3.5 Transcribe распознаёт речь дословно.
• Новые голоса Gemini 3.8 Flash и Flash-Lite для озвученных ответов.
• Длинная диктовка теперь сохраняет каждое предложение, а не только последнее.
• Системное распознавание можно выбрать всегда, когда его предлагает iOS, даже без строгого офлайн-режима.
• «Полный ответ сначала» снова делает паузы между абзацами, а отмена надёжно останавливает всё аудио в очереди.
• Предпрослушивание голоса теперь может заменить приостановленный озвученный ответ.
• Голоса, сохранённые для разговора, остаются выбранными при обновлении моделей поставщиком, а старые голосовые модели OpenAI показывают только поддерживаемые голоса.

РАБОЧАЯ ОБЛАСТЬ
• Более аккуратная раскладка голоса и текста: стрелки, голосовая сфера и поле ввода стоят в одной строке, «Фото» и «Без рук» переехали к краям, «Совет» и «Веб» остаются по центру. Поле ввода и кнопка отправки видны на маленьких экранах и при открытой клавиатуре.
• Добавление модели для ответов больше не блокирует Настройки.

НАДЁЖНОСТЬ И КОНФИДЕНЦИАЛЬНОСТЬ
• Запуск второй записи или режима «Без рук» больше не останавливает уже идущую запись.
• Веб-поиск сохраняет полезные результаты, отклоняет пустые ответы и отменяет зависшие. Поиск Gemini и xAI больше не просит поставщика сохранять ваши запросы.
• «Совет моделей» теперь указывает поставщика и модель, которые действительно ответили.
• Восстановление из резервной копии и ветки разговоров сообщают о неудачном сохранении вместо ложного успеха.
• Заблокированные разговоры остаются заблокированными, если приложение уходит в фон во время загрузки.
• Приложение восстанавливается после временных проблем с хранилищем при запуске без перезапуска.
• Повреждённый файл настроек больше не скрывает сохранённые API-ключи.
• Медленные запросы всегда завершаются понятным сообщением о тайм-ауте.

ИЗМЕНЕНИЯ
• Голосовой ввод и озвучивание Qwen удалены до того, как Alibaba отключит их 10 октября. Чат и поиск Qwen не изменились, а сохранённые голоса Qwen переходят на встроенную речь устройства.
• Google теперь ограничивает Gemini 2.5 аккаунтами, которые уже им пользовались, поэтому для нового выбора он больше не предлагается. Существующий выбор продолжает работать, а старые голоса Gemini 2.5 переходят на Gemini 3.8 с тем же голосом.
• Модели OpenAI Realtime скрыты до полной поддержки. Сохранённый выбор переходит на GPT-5.6 Sol или GPT-5.4 mini.
• Встроенный резервный голос ElevenLabs теперь правильно называется Janet.
```

## Simplified Chinese (`zh-Hans`)

```text
Mr Broccoli 4.2 带来最新的 AI 模型、更好的语音体验，以及大量可靠性改进。

新模型
• GPT-6 Astra、GPT-6 Sol 和 GPT-6 Luna，支持最高到 Max 的所有推理强度。
• Claude Opus 5.5、Claude Opus 5 和 Claude Fable 5.1。
• Grok 4.7 和 Grok 4.6。
• Gemini 3.8 Flash 和 Gemini 3.7 Flash。
• Qwen 3.8 Max、Qwen 3.8 Flash 和 Qwen 3.7 Flash，并提供各模型专属的推理控制。
• DeepSeek V4.1 Flash 现在也能理解图片。DeepSeek 模型新增“低”推理强度。
• OpenRouter 新增 GPT-6 Astra、Sol 和 Luna，Claude Opus 5.5、Opus 5 和 Fable 5.1，Grok 4.7 和 4.6，Gemini 3.8 Flash，Qwen 3.8 Max，以及 DeepSeek V4 Pro 和 V4.1 Flash 的最新版本。

语音
• GPT Transcribe 成为 OpenAI 语音输入的新默认选项，Gemini 3.5 Transcribe 支持逐字转写。
• 新增 Gemini 3.8 Flash 和 Flash-Lite 语音，用于朗读回复。
• 长时间听写现在会保留每一句话，而不只是最后一句。
• 只要 iOS 提供，就可以选择系统识别，即使无法进行严格的离线识别。
• 先完整回复模式再次在段落之间停顿，取消时会可靠地停止所有排队的音频。
• 语音预览现在可以替换已暂停的朗读回复。
• 为对话保存的语音在服务商更新模型后仍保持选中，OpenAI 的旧语音模型只显示其支持的语音。

工作区
• 更简洁的语音与文字布局：箭头、语音球和输入框位于同一行，图片和免提移到两侧，评议会和网络保持居中。在小屏幕上或键盘打开时，输入框和发送按钮依然可见。
• 添加回答模型不会再让设置失去响应。

可靠性与隐私
• 开始第二段录音或免提不会再中断正在进行的录音。
• 网络搜索会保留可用结果、拒绝空回答并取消卡住的响应。Gemini 和 xAI 搜索不再要求服务商存储你的请求。
• 模型委员会现在会标明实际作答的服务商和模型。
• 备份恢复和对话分支会报告保存失败，而不是误报成功。
• 加载时如果应用进入后台，已锁定的对话仍保持锁定。
• 应用可在启动时从临时存储问题中恢复，无需重启。
• 损坏的设置文件不会再隐藏你已保存的 API 密钥。
• 较慢的请求总会以清晰的超时提示结束。

变更
• Qwen 语音输入和输出已在阿里巴巴于 10 月 10 日停用前移除。Qwen 聊天和搜索保持不变，已保存的 Qwen 语音将改用设备自带的语音。
• Google 现已将 Gemini 2.5 限制为曾使用过它的账号，因此不再作为新选项提供。已有的选择仍可继续使用，旧的 Gemini 2.5 语音会以相同音色迁移到 Gemini 3.8。
• OpenAI Realtime 模型在完全支持之前暂时隐藏。已保存的选择会改为 GPT-5.6 Sol 或 GPT-5.4 mini。
• ElevenLabs 内置备用语音现已正确命名为 Janet。
```

## Arabic (`ar-SA`)

```text
يقدّم Mr Broccoli 4.2 أحدث نماذج الذكاء الاصطناعي، وتحسينات في الكلام، وقائمة طويلة من إصلاحات الموثوقية.

نماذج جديدة
• GPT-6 Astra وGPT-6 Sol وGPT-6 Luna، مع جميع مستويات التفكير المدعومة حتى Max.
• Claude Opus 5.5 وClaude Opus 5 وClaude Fable 5.1.
• Grok 4.7 وGrok 4.6.
• Gemini 3.8 Flash وGemini 3.7 Flash.
• Qwen 3.8 Max وQwen 3.8 Flash وQwen 3.7 Flash، مع عناصر تحكم بالتفكير خاصة بكل نموذج.
• DeepSeek V4.1 Flash الذي يفهم الصور الآن أيضًا. وتضيف نماذج DeepSeek مستوى تفكير منخفضًا.
• يضيف OpenRouter الإصدارات الحالية من GPT-6 Astra وSol وLuna، وClaude Opus 5.5 وOpus 5 وFable 5.1، وGrok 4.7 و4.6، وGemini 3.8 Flash، وQwen 3.8 Max، وDeepSeek V4 Pro وV4.1 Flash.

الكلام
• أصبح GPT Transcribe الخيار الافتراضي الجديد لإدخال الكلام من OpenAI، ويضيف Gemini 3.5 Transcribe نسخًا حرفيًا للكلام.
• أصوات جديدة من Gemini 3.8 Flash وFlash-Lite للردود المنطوقة.
• يحتفظ الإملاء الطويل الآن بكل جملة، لا بالجملة الأخيرة فقط.
• يمكن اختيار تعرّف النظام على الكلام كلما أتاحه iOS، حتى عند عدم توفر التعرّف دون اتصال بشكل صارم.
• يعود وضع «الرد الكامل أولا» إلى التوقف بين الفقرات، ويوقف الإلغاء كل الصوت المنتظر بشكل موثوق.
• يمكن لمعاينة الصوت الآن أن تحل محل رد منطوق متوقف مؤقتًا.
• تبقى الأصوات المحفوظة لمحادثة ما محددة عندما يحدّث المزوّد نماذجه، ولا تعرض نماذج الصوت الأقدم من OpenAI إلا الأصوات التي تدعمها.

مساحة العمل
• تخطيط أوضح للصوت والنص: الأسهم وكرة الصوت ومربع الكتابة في سطر واحد، وانتقلت «صورة» و«بدون استخدام اليدين» إلى الأطراف، وبقي «المجلس» و«ويب» في الوسط. يبقى مربع الكتابة وزر الإرسال ظاهرين على الشاشات الصغيرة ومع فتح لوحة المفاتيح.
• لم تعد إضافة نموذج للرد تجعل الإعدادات لا تستجيب.

الموثوقية والخصوصية
• لم يعد بدء تسجيل ثانٍ أو وضع «بدون استخدام اليدين» يوقف تسجيلًا جاريًا.
• يحتفظ البحث على الويب بالنتائج المفيدة، ويرفض الإجابات الفارغة، ويلغي الردود المتوقفة. ولم تعد عمليات بحث Gemini وxAI تطلب من المزوّد تخزين طلباتك.
• ينسب «مجلس النماذج» الآن الرد إلى المزوّد والنموذج اللذين أجابا فعلًا.
• تُبلغ استعادة النسخ الاحتياطية وفروع المحادثات عن فشل الحفظ بدل ادعاء النجاح.
• تبقى المحادثات المقفلة مقفلة إذا انتقل التطبيق إلى الخلفية أثناء تحميلها.
• يتعافى التطبيق من مشكلات التخزين المؤقتة عند التشغيل دون إعادة تشغيل.
• لم يعد ملف الإعدادات التالف يخفي مفاتيح API المحفوظة.
• تنتهي الطلبات البطيئة دائمًا برسالة واضحة عن انتهاء المهلة.

تغييرات
• أُزيل إدخال الكلام وإخراجه من Qwen قبل أن توقفهما Alibaba في 10 أكتوبر. تبقى محادثة Qwen وبحثه دون تغيير، وتنتقل أصوات Qwen المحفوظة إلى الكلام المدمج في جهازك.
• تقصر Google الآن Gemini 2.5 على الحسابات التي استخدمته من قبل، لذلك لم يعد متاحًا للاختيارات الجديدة. تستمر الاختيارات الحالية في العمل، وتنتقل أصوات Gemini 2.5 الأقدم إلى Gemini 3.8 بالصوت نفسه.
• نماذج OpenAI Realtime مخفية حتى تُدعم بالكامل. تنتقل الاختيارات المحفوظة إلى GPT-5.6 Sol أو GPT-5.4 mini.
• أصبح اسم الصوت الاحتياطي المدمج من ElevenLabs الآن Janet بشكل صحيح.
```

## Japanese (`ja`)

```text
Mr Broccoli 4.2 では、最新の AI モデル、改善された音声機能、そして多数の信頼性向上をお届けします。

新しいモデル
• GPT-6 Astra、GPT-6 Sol、GPT-6 Luna。Max までのすべての推論レベルに対応。
• Claude Opus 5.5、Claude Opus 5、Claude Fable 5.1。
• Grok 4.7 と Grok 4.6。
• Gemini 3.8 Flash と Gemini 3.7 Flash。
• Qwen 3.8 Max、Qwen 3.8 Flash、Qwen 3.7 Flash。モデルごとの推論設定に対応。
• DeepSeek V4.1 Flash は画像も理解できるようになりました。DeepSeek モデルに「低」の推論レベルを追加。
• OpenRouter に GPT-6 Astra・Sol・Luna、Claude Opus 5.5・Opus 5・Fable 5.1、Grok 4.7・4.6、Gemini 3.8 Flash、Qwen 3.8 Max、DeepSeek V4 Pro・V4.1 Flash の最新版を追加。

音声
• OpenAI の音声入力は GPT Transcribe が新しい標準になり、Gemini 3.5 Transcribe で逐語的な文字起こしができます。
• 読み上げ用に Gemini 3.8 Flash と Flash-Lite の新しい音声を追加。
• 長い音声入力でも、最後の文だけでなくすべての文を保持します。
• iOS が提供していれば、厳密なオフライン認識が使えない場合でもシステム認識を選べます。
• 「全文を生成してから」で段落間の間が再び入るようになり、キャンセルするとキュー内の音声を確実に停止します。
• 一時停止中の読み上げを音声プレビューで置き換えられるようになりました。
• 会話ごとに保存した音声は、プロバイダがモデルを更新しても選択されたままです。OpenAI の旧音声モデルでは対応する音声だけが表示されます。

ワークスペース
• すっきりした音声・テキストのレイアウト：矢印、音声オーブ、入力欄が一列に並び、「画像」と「ハンズフリー」は端へ、「評議会」と「ウェブ」は中央に配置。小さな画面やキーボード表示中も、入力欄と送信ボタンが見えたままです。
• 回答モデルを追加しても設定が応答しなくなることはありません。

信頼性とプライバシー
• 2 回目の録音やハンズフリーを開始しても、進行中の録音が止まらなくなりました。
• ウェブ検索は有用な結果を保持し、空の回答を除外し、止まった応答をキャンセルします。Gemini と xAI の検索は、リクエストの保存をプロバイダに求めなくなりました。
• モデル評議会は、実際に回答したプロバイダとモデルを表示します。
• バックアップの復元や会話の分岐で保存に失敗した場合、成功と表示せずに失敗を知らせます。
• 読み込み中にアプリがバックグラウンドに移っても、ロックした会話はロックされたままです。
• 起動時の一時的なストレージの問題から、再起動せずに復旧します。
• 設定ファイルが破損しても、保存済みの API キーが見えなくなることはありません。
• 時間のかかるリクエストは、必ず分かりやすいタイムアウトのメッセージで終了します。

変更点
• Alibaba が 10 月 10 日に提供を終了する前に、Qwen の音声入力と読み上げを削除しました。Qwen のチャットと検索は変わらず、保存済みの Qwen 音声はデバイス内蔵の音声に切り替わります。
• Google が Gemini 2.5 を利用実績のあるアカウントに限定したため、新しい選択肢としては表示されなくなりました。既存の選択はそのまま使え、旧 Gemini 2.5 の音声は同じ声のまま Gemini 3.8 に移行します。
• OpenAI Realtime モデルは完全に対応するまで非表示です。保存済みの選択は GPT-5.6 Sol または GPT-5.4 mini に移行します。
• ElevenLabs の内蔵フォールバック音声は、正しく Janet と表示されるようになりました。
```

## Hungarian (`hu`)

```text
A Mr Broccoli 4.2 a legújabb MI-modelleket, jobb beszédfunkciókat és számos megbízhatósági javítást hoz.

ÚJ MODELLEK
• GPT-6 Astra, GPT-6 Sol és GPT-6 Luna, minden támogatott gondolkodási szinttel egészen Maxig.
• Claude Opus 5.5, Claude Opus 5 és Claude Fable 5.1.
• Grok 4.7 és Grok 4.6.
• Gemini 3.8 Flash és Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash és Qwen 3.7 Flash, modellenkénti gondolkodásvezérléssel.
• A DeepSeek V4.1 Flash mostantól képeket is értelmez. A DeepSeek modellek alacsony gondolkodási szintet kapnak.
• Az OpenRouter a GPT-6 Astra, Sol és Luna, a Claude Opus 5.5, Opus 5 és Fable 5.1, a Grok 4.7 és 4.6, a Gemini 3.8 Flash, a Qwen 3.8 Max, valamint a DeepSeek V4 Pro és V4.1 Flash aktuális változatait hozza.

BESZÉD
• Az OpenAI hangbevitelének új alapértelmezése a GPT Transcribe, a Gemini 3.5 Transcribe pedig szó szerint ír át.
• Új Gemini 3.8 Flash és Flash-Lite hangok a felolvasott válaszokhoz.
• A hosszú diktálás mostantól minden mondatot megőriz, nem csak az utolsót.
• A Rendszerfelismerés választható, amikor az iOS kínálja, akkor is, ha a szigorú offline felismerés nem érhető el.
• Az Előbb a teljes válasz mód ismét szünetet tart a bekezdések között, a megszakítás pedig megbízhatóan leállít minden várakozó hangot.
• A hangelőnézet mostantól lecserélhet egy szüneteltetett felolvasott választ.
• A beszélgetéshez mentett hangok megmaradnak, amikor egy szolgáltató frissíti a modelljeit, és az OpenAI régebbi hangmodelljei csak a támogatott hangokat mutatják.

MUNKATERÜLET
• Letisztultabb hang- és szövegelrendezés: a nyilak, a hanggömb és a szövegmező egy sorban vannak, a Kép és a Kihangosítás a szélekre kerül, a Tanács és a Web középen marad. A szövegmező és a küldés gomb kis képernyőn és nyitott billentyűzetnél is látható marad.
• Egy válaszmodell hozzáadása többé nem fagyasztja le a Beállításokat.

MEGBÍZHATÓSÁG ÉS ADATVÉDELEM
• Egy második felvétel vagy a Kihangosítás indítása már nem állítja le a folyamatban lévő felvételt.
• A webes keresés megtartja a hasznos találatokat, elveti az üres válaszokat, és megszakítja az elakadt válaszokat. A Gemini és az xAI keresése már nem kéri a szolgáltatótól a kérések tárolását.
• A Modelltanács mostantól a ténylegesen válaszoló szolgáltatót és modellt tünteti fel.
• A biztonsági mentés visszaállítása és a beszélgetés-elágazások jelzik a sikertelen mentést, ahelyett hogy sikert jelentenének.
• A zárolt beszélgetések zárolva maradnak, ha az alkalmazás betöltés közben a háttérbe kerül.
• Az alkalmazás újraindítás nélkül helyreáll az indításkori átmeneti tárolási hibákból.
• Egy sérült beállításfájl többé nem rejti el a mentett API-kulcsokat.
• A lassú kérések mindig egyértelmű időtúllépési üzenettel érnek véget.

VÁLTOZÁSOK
• A Qwen hangbevitele és felolvasása megszűnik, mielőtt az Alibaba október 10-én leállítja. A Qwen csevegés és keresés változatlan, a mentett Qwen-hangok az eszköz beépített beszédére váltanak.
• A Google a Gemini 2.5-öt mostantól csak a korábban használó fiókok számára teszi elérhetővé, ezért új választásként már nem jelenik meg. A meglévő választások tovább működnek, a régebbi Gemini 2.5 hangok pedig ugyanazzal a hanggal a Gemini 3.8-ra váltanak.
• Az OpenAI Realtime modellek rejtve maradnak a teljes támogatásig. A mentett választások GPT-5.6 Sol-ra vagy GPT-5.4 mini-re váltanak.
• Az ElevenLabs beépített tartalékhangjának neve mostantól helyesen Janet.
```

## Czech (`cs`)

```text
Mr Broccoli 4.2 přináší nejnovější modely AI, lepší práci s řečí a dlouhý seznam oprav spolehlivosti.

NOVÉ MODELY
• GPT-6 Astra, GPT-6 Sol a GPT-6 Luna se všemi podporovanými úrovněmi uvažování až po Max.
• Claude Opus 5.5, Claude Opus 5 a Claude Fable 5.1.
• Grok 4.7 a Grok 4.6.
• Gemini 3.8 Flash a Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash a Qwen 3.7 Flash s nastavením uvažování pro každý model.
• DeepSeek V4.1 Flash nyní rozumí i obrázkům. Modely DeepSeek získávají nízkou úroveň uvažování.
• OpenRouter přidává aktuální verze GPT-6 Astra, Sol a Luna, Claude Opus 5.5, Opus 5 a Fable 5.1, Grok 4.7 a 4.6, Gemini 3.8 Flash, Qwen 3.8 Max a DeepSeek V4 Pro a V4.1 Flash.

ŘEČ
• GPT Transcribe je nová výchozí volba pro hlasový vstup OpenAI a Gemini 3.5 Transcribe přepisuje doslovně.
• Nové hlasy Gemini 3.8 Flash a Flash-Lite pro mluvené odpovědi.
• Dlouhé diktování nyní zachová každou větu, nejen tu poslední.
• Rozpoznávání systému lze zvolit, kdykoli ho iOS nabízí, i bez striktního offline rozpoznávání.
• Režim Nejprve úplná odpověď opět dělá pauzy mezi odstavci a zrušení spolehlivě zastaví veškerý zvuk ve frontě.
• Náhled hlasu nyní může nahradit pozastavenou mluvenou odpověď.
• Hlasy uložené pro konverzaci zůstanou vybrané, i když poskytovatel aktualizuje modely, a starší hlasové modely OpenAI zobrazují jen podporované hlasy.

PRACOVNÍ PROSTOR
• Přehlednější rozvržení hlasu a textu: šipky, hlasová koule a pole pro psaní jsou v jednom řádku, Obrázek a Bez rukou se přesunuly k okrajům, Rada a Web zůstávají uprostřed. Pole pro psaní a tlačítko odeslat zůstávají viditelné na malých displejích i s otevřenou klávesnicí.
• Přidání modelu pro odpovědi už nezablokuje Nastavení.

SPOLEHLIVOST A SOUKROMÍ
• Spuštění druhého nahrávání nebo režimu Bez rukou už nezastaví probíhající nahrávání.
• Vyhledávání na webu uchová použitelné výsledky, odmítne prázdné odpovědi a zruší zaseknuté odpovědi. Vyhledávání Gemini a xAI už po poskytovateli nežádá ukládání vašich požadavků.
• Rada modelů nyní uvádí poskytovatele a model, které skutečně odpověděly.
• Obnovení zálohy a větve konverzací hlásí neúspěšné uložení místo tvrzení o úspěchu.
• Zamčené konverzace zůstanou zamčené, i když aplikace během načítání přejde na pozadí.
• Aplikace se bez restartu zotaví z dočasných potíží s úložištěm při spuštění.
• Poškozený soubor nastavení už neskryje uložené klíče API.
• Pomalé požadavky vždy skončí srozumitelnou zprávou o vypršení časového limitu.

ZMĚNY
• Hlasový vstup a výstup Qwen byly odstraněny dříve, než je Alibaba 10. října ukončí. Chat a vyhledávání Qwen se nemění a uložené hlasy Qwen přejdou na vestavěnou řeč zařízení.
• Google nyní omezuje Gemini 2.5 na účty, které ho již používaly, a proto se už nenabízí pro nové volby. Stávající volby dál fungují a starší hlasy Gemini 2.5 přejdou na Gemini 3.8 se stejným hlasem.
• Modely OpenAI Realtime jsou skryté, dokud nebudou plně podporovány. Uložené volby přejdou na GPT-5.6 Sol nebo GPT-5.4 mini.
• Vestavěný záložní hlas ElevenLabs se nyní správně jmenuje Janet.
```

## Polish (`pl`)

```text
Mr Broccoli 4.2 wprowadza najnowsze modele AI, lepszą obsługę mowy i długą listę poprawek niezawodności.

NOWE MODELE
• GPT-6 Astra, GPT-6 Sol i GPT-6 Luna ze wszystkimi obsługiwanymi poziomami rozumowania aż do Max.
• Claude Opus 5.5, Claude Opus 5 i Claude Fable 5.1.
• Grok 4.7 i Grok 4.6.
• Gemini 3.8 Flash i Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash i Qwen 3.7 Flash z ustawieniami rozumowania dla każdego modelu.
• DeepSeek V4.1 Flash rozumie teraz także obrazy. Modele DeepSeek otrzymują niski poziom rozumowania.
• OpenRouter dodaje aktualne wersje GPT-6 Astra, Sol i Luna, Claude Opus 5.5, Opus 5 i Fable 5.1, Grok 4.7 i 4.6, Gemini 3.8 Flash, Qwen 3.8 Max oraz DeepSeek V4 Pro i V4.1 Flash.

MOWA
• GPT Transcribe to nowe ustawienie domyślne dla wprowadzania głosowego OpenAI, a Gemini 3.5 Transcribe transkrybuje słowo w słowo.
• Nowe głosy Gemini 3.8 Flash i Flash-Lite do odczytywanych odpowiedzi.
• Długie dyktowanie zachowuje teraz każde zdanie, a nie tylko ostatnie.
• Rozpoznawanie systemowe można wybrać zawsze, gdy iOS je oferuje, nawet bez ścisłego rozpoznawania offline.
• Tryb Najpierw pełna odpowiedź znów robi pauzy między akapitami, a anulowanie niezawodnie zatrzymuje cały dźwięk w kolejce.
• Podgląd głosu może teraz zastąpić wstrzymaną odczytywaną odpowiedź.
• Głosy zapisane dla rozmowy pozostają wybrane, gdy dostawca aktualizuje modele, a starsze modele głosowe OpenAI pokazują tylko obsługiwane głosy.

OBSZAR ROBOCZY
• Czytelniejszy układ głosu i tekstu: strzałki, kula głosowa i pole tekstowe są w jednej linii, Obraz i Bez użycia rąk trafiają na krawędzie, a Rada i Sieć zostają pośrodku. Pole tekstowe i przycisk wysyłania pozostają widoczne na małych ekranach i przy otwartej klawiaturze.
• Dodanie modelu odpowiedzi nie blokuje już Ustawień.

NIEZAWODNOŚĆ I PRYWATNOŚĆ
• Uruchomienie drugiego nagrania lub trybu Bez użycia rąk nie zatrzymuje już trwającego nagrania.
• Wyszukiwanie w sieci zachowuje przydatne wyniki, odrzuca puste odpowiedzi i anuluje zawieszone. Wyszukiwania Gemini i xAI nie proszą już dostawcy o przechowywanie Twoich zapytań.
• Rada modeli wskazuje teraz dostawcę i model, które faktycznie odpowiedziały.
• Przywracanie kopii zapasowych i gałęzie rozmów zgłaszają nieudane zapisy zamiast zgłaszać sukces.
• Zablokowane rozmowy pozostają zablokowane, jeśli aplikacja przejdzie w tło podczas ich wczytywania.
• Aplikacja bez ponownego uruchomienia radzi sobie z chwilowymi problemami z pamięcią przy starcie.
• Uszkodzony plik ustawień nie ukrywa już zapisanych kluczy API.
• Powolne żądania zawsze kończą się czytelnym komunikatem o przekroczeniu czasu.

ZMIANY
• Wprowadzanie i odczytywanie mowy Qwen zostało usunięte, zanim Alibaba wyłączy je 10 października. Czat i wyszukiwanie Qwen się nie zmieniają, a zapisane głosy Qwen przechodzą na wbudowaną mowę urządzenia.
• Google ogranicza teraz Gemini 2.5 do kont, które już z niego korzystały, dlatego nie jest on już oferowany przy nowych wyborach. Istniejące wybory nadal działają, a starsze głosy Gemini 2.5 przechodzą na Gemini 3.8 z tym samym głosem.
• Modele OpenAI Realtime są ukryte do czasu pełnej obsługi. Zapisane wybory przechodzą na GPT-5.6 Sol lub GPT-5.4 mini.
• Wbudowany zapasowy głos ElevenLabs nazywa się teraz poprawnie Janet.
```

## Turkish (`tr`)

```text
Mr Broccoli 4.2 en yeni yapay zekâ modellerini, daha iyi konuşma özelliklerini ve uzun bir güvenilirlik iyileştirmeleri listesini getiriyor.

YENİ MODELLER
• GPT-6 Astra, GPT-6 Sol ve GPT-6 Luna; Max'e kadar desteklenen tüm akıl yürütme düzeyleriyle.
• Claude Opus 5.5, Claude Opus 5 ve Claude Fable 5.1.
• Grok 4.7 ve Grok 4.6.
• Gemini 3.8 Flash ve Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash ve Qwen 3.7 Flash; modele özel akıl yürütme ayarlarıyla.
• DeepSeek V4.1 Flash artık görselleri de anlıyor. DeepSeek modellerine Düşük akıl yürütme düzeyi eklendi.
• OpenRouter; GPT-6 Astra, Sol ve Luna, Claude Opus 5.5, Opus 5 ve Fable 5.1, Grok 4.7 ve 4.6, Gemini 3.8 Flash, Qwen 3.8 Max ile DeepSeek V4 Pro ve V4.1 Flash'ın güncel sürümlerini ekliyor.

KONUŞMA
• OpenAI sesli girişi için yeni varsayılan GPT Transcribe; Gemini 3.5 Transcribe ise kelimesi kelimesine metne dönüştürüyor.
• Sesli yanıtlar için yeni Gemini 3.8 Flash ve Flash-Lite sesleri.
• Uzun dikte artık yalnızca son cümleyi değil, her cümleyi koruyor.
• Sistem Tanıma, iOS sunduğu her durumda, katı çevrimdışı tanıma olmasa bile seçilebiliyor.
• Önce Tam Yanıt modu paragraflar arasında yeniden duraklıyor ve iptal etmek kuyruktaki tüm sesi güvenilir biçimde durduruyor.
• Ses önizlemesi artık duraklatılmış sesli yanıtın yerini alabiliyor.
• Bir sohbet için kaydedilen sesler, sağlayıcı modellerini güncellediğinde seçili kalıyor; OpenAI'ın eski ses modelleri yalnızca desteklenen sesleri gösteriyor.

ÇALIŞMA ALANI
• Daha sade bir ses ve metin düzeni: oklar, ses küresi ve yazma alanı tek satırda; Görsel ve Eller serbest kenarlara taşındı, Konsey ve Web ortada kaldı. Yazma alanı ve gönder düğmesi küçük ekranlarda ve klavye açıkken görünür kalıyor.
• Yanıt modeli eklemek artık Ayarlar'ı kilitlemiyor.

GÜVENİLİRLİK VE GİZLİLİK
• İkinci bir kayıt ya da Eller serbest başlatmak artık devam eden kaydı durdurmuyor.
• Web araması kullanışlı sonuçları koruyor, boş yanıtları reddediyor ve takılan yanıtları iptal ediyor. Gemini ve xAI aramaları artık sağlayıcıdan isteklerinizi saklamasını istemiyor.
• Model Konseyi artık gerçekten yanıt veren sağlayıcıyı ve modeli gösteriyor.
• Yedekten geri yükleme ve sohbet dalları, başarı bildirmek yerine başarısız kayıtları bildiriyor.
• Uygulama yüklenirken arka plana geçse de kilitli sohbetler kilitli kalıyor.
• Uygulama, açılıştaki geçici depolama sorunlarından yeniden başlatma gerekmeden toparlanıyor.
• Bozuk bir ayar dosyası artık kayıtlı API anahtarlarınızı gizlemiyor.
• Yavaş istekler her zaman net bir zaman aşımı mesajıyla sonlanıyor.

DEĞİŞİKLİKLER
• Qwen sesli giriş ve çıkışı, Alibaba 10 Ekim'de kapatmadan önce kaldırıldı. Qwen sohbeti ve araması değişmedi; kayıtlı Qwen sesleri cihazınızın yerleşik konuşmasına geçiyor.
• Google artık Gemini 2.5'i yalnızca daha önce kullanan hesaplarla sınırlıyor; bu yüzden yeni seçimlerde sunulmuyor. Mevcut seçimler çalışmaya devam ediyor ve eski Gemini 2.5 sesleri aynı sesle Gemini 3.8'e geçiyor.
• OpenAI Realtime modelleri tam olarak desteklenene kadar gizli. Kayıtlı seçimler GPT-5.6 Sol veya GPT-5.4 mini'ye geçiyor.
• ElevenLabs'in yerleşik yedek sesinin adı artık doğru şekilde Janet.
```

## Swedish (`sv`)

```text
Mr Broccoli 4.2 ger dig de senaste AI-modellerna, bättre tal och en lång rad tillförlitlighetsförbättringar.

NYA MODELLER
• GPT-6 Astra, GPT-6 Sol och GPT-6 Luna med alla resonemangsnivåer som stöds, upp till Max.
• Claude Opus 5.5, Claude Opus 5 och Claude Fable 5.1.
• Grok 4.7 och Grok 4.6.
• Gemini 3.8 Flash och Gemini 3.7 Flash.
• Qwen 3.8 Max, Qwen 3.8 Flash och Qwen 3.7 Flash med modellspecifika resonemangsinställningar.
• DeepSeek V4.1 Flash förstår nu även bilder. DeepSeek-modellerna får resonemangsnivån Låg.
• OpenRouter lägger till aktuella versioner av GPT-6 Astra, Sol och Luna, Claude Opus 5.5, Opus 5 och Fable 5.1, Grok 4.7 och 4.6, Gemini 3.8 Flash, Qwen 3.8 Max samt DeepSeek V4 Pro och V4.1 Flash.

TAL
• GPT Transcribe är nytt standardval för OpenAI:s röstinmatning, och Gemini 3.5 Transcribe transkriberar ordagrant.
• Nya röster från Gemini 3.8 Flash och Flash-Lite för upplästa svar.
• Lång diktering behåller nu varje mening, inte bara den sista.
• Systemigenkänning kan väljas när iOS erbjuder den, även utan strikt offlineigenkänning.
• Fullständigt svar först pausar åter mellan stycken, och avbryt stoppar pålitligt allt ljud i kön.
• Röstförhandsvisningar kan nu ersätta ett pausat uppläst svar.
• Röster som sparats för en konversation förblir valda när en leverantör uppdaterar sina modeller, och OpenAI:s äldre röstmodeller visar bara röster som stöds.

ARBETSYTA
• En renare röst- och textlayout: pilarna, röstorben och textfältet ligger på en rad, Bild och Handsfree flyttar till kanterna och Råd och Webb stannar i mitten. Textfältet och skicka-knappen syns även på små skärmar och med tangentbordet öppet.
• Att lägga till en svarsmodell låser inte längre Inställningar.

TILLFÖRLITLIGHET OCH INTEGRITET
• En andra inspelning eller Handsfree stoppar inte längre en pågående inspelning.
• Webbsökningen behåller användbara resultat, avvisar tomma svar och avbryter svar som fastnat. Gemini- och xAI-sökningar ber inte längre leverantören att spara dina förfrågningar.
• Modellrådet anger nu den leverantör och modell som faktiskt svarade.
• Återställning av säkerhetskopior och konversationsgrenar rapporterar misslyckade sparningar i stället för att påstå att de lyckades.
• Låsta konversationer förblir låsta om appen går till bakgrunden medan en laddas.
• Appen återhämtar sig utan omstart från tillfälliga lagringsproblem vid start.
• En skadad inställningsfil döljer inte längre dina sparade API-nycklar.
• Långsamma förfrågningar avslutas alltid med ett tydligt meddelande om tidsgräns.

ÄNDRINGAR
• Qwens röstinmatning och uppläsning tas bort innan Alibaba stänger dem den 10 oktober. Qwen-chatt och sökning är oförändrade, och sparade Qwen-röster byter till enhetens inbyggda tal.
• Google begränsar nu Gemini 2.5 till konton som redan använt det, så det erbjuds inte längre för nya val. Befintliga val fungerar fortsatt, och äldre Gemini 2.5-röster flyttas till Gemini 3.8 med samma röst.
• OpenAI Realtime-modeller är dolda tills de stöds fullt ut. Sparade val flyttas till GPT-5.6 Sol eller GPT-5.4 mini.
• ElevenLabs inbyggda reservröst heter nu korrekt Janet.
```

## Urdu (`ur-PK`)

```text
Mr Broccoli 4.2 تازہ ترین AI ماڈلز، بہتر اسپیچ اور قابلِ اعتماد ہونے سے متعلق بہت سی بہتریاں لاتا ہے۔

نئے ماڈلز
• GPT-6 Astra، GPT-6 Sol اور GPT-6 Luna، Max تک ہر معاون reasoning سطح کے ساتھ۔
• Claude Opus 5.5، Claude Opus 5 اور Claude Fable 5.1۔
• Grok 4.7 اور Grok 4.6۔
• Gemini 3.8 Flash اور Gemini 3.7 Flash۔
• Qwen 3.8 Max، Qwen 3.8 Flash اور Qwen 3.7 Flash، ہر ماڈل کے اپنے reasoning کنٹرولز کے ساتھ۔
• DeepSeek V4.1 Flash اب تصاویر بھی سمجھتا ہے۔ DeepSeek ماڈلز میں Low reasoning سطح شامل کی گئی ہے۔
• OpenRouter میں GPT-6 Astra، Sol اور Luna، Claude Opus 5.5، Opus 5 اور Fable 5.1، Grok 4.7 اور 4.6، Gemini 3.8 Flash، Qwen 3.8 Max اور DeepSeek V4 Pro اور V4.1 Flash کے تازہ ترین ورژن شامل کیے گئے ہیں۔

اسپیچ
• OpenAI اسپیچ ان پٹ کے لیے GPT Transcribe نیا ڈیفالٹ ہے، اور Gemini 3.5 Transcribe لفظ بہ لفظ ٹرانسکرپشن کرتا ہے۔
• بولے گئے جوابات کے لیے Gemini 3.8 Flash اور Flash-Lite کی نئی آوازیں۔
• طویل ڈکٹیشن اب صرف آخری نہیں بلکہ ہر جملہ محفوظ رکھتی ہے۔
• جب بھی iOS پیش کرے، سسٹم کی پہچان منتخب کی جا سکتی ہے، سخت آف لائن پہچان دستیاب نہ ہونے پر بھی۔
• پہلے مکمل جواب دوبارہ پیراگرافوں کے درمیان رکتا ہے، اور منسوخ کرنے سے قطار میں موجود ساری آڈیو قابلِ اعتماد طریقے سے رک جاتی ہے۔
• آواز کا پیش منظر اب رکے ہوئے بولے گئے جواب کی جگہ لے سکتا ہے۔
• کسی گفتگو کے لیے محفوظ کی گئی آوازیں فراہم کنندہ کے ماڈلز اپ ڈیٹ کرنے پر بھی منتخب رہتی ہیں، اور OpenAI کے پرانے وائس ماڈلز صرف معاون آوازیں دکھاتے ہیں۔

ورک اسپیس
• صاف ستھری آواز اور متن کی ترتیب: تیر، وائس آرب اور کمپوزر ایک ہی لائن میں ہیں، تصویر اور ہینڈز فری کناروں پر چلے گئے ہیں، اور کونسل اور ویب درمیان میں رہتے ہیں۔ چھوٹی اسکرینوں پر اور کی بورڈ کھلا ہونے پر بھی کمپوزر اور بھیجنے کا بٹن نظر آتے رہتے ہیں۔
• جواب دینے والا ماڈل شامل کرنے سے اب ترتیبات جام نہیں ہوتیں۔

قابلِ اعتماد ہونا اور رازداری
• دوسری ریکارڈنگ یا ہینڈز فری شروع کرنے سے اب جاری ریکارڈنگ نہیں رکتی۔
• ویب تلاش مفید نتائج رکھتی ہے، خالی جوابات مسترد کرتی ہے اور اٹکے ہوئے جوابات منسوخ کرتی ہے۔ Gemini اور xAI تلاش اب فراہم کنندہ سے آپ کی درخواستیں محفوظ کرنے کو نہیں کہتیں۔
• ماڈل کونسل اب اسی فراہم کنندہ اور ماڈل کو کریڈٹ دیتی ہے جس نے واقعی جواب دیا۔
• بیک اپ بحالی اور گفتگو کی شاخیں کامیابی کا دعویٰ کرنے کے بجائے ناکام محفوظ کاری کی اطلاع دیتی ہیں۔
• لوڈ ہوتے وقت ایپ پس منظر میں چلی جائے تب بھی مقفل گفتگو مقفل رہتی ہے۔
• ایپ آغاز پر عارضی اسٹوریج مسائل سے ری اسٹارٹ کے بغیر بحال ہو جاتی ہے۔
• خراب ترتیبات فائل اب آپ کی محفوظ API کلیدیں نہیں چھپاتی۔
• سست درخواستیں ہمیشہ واضح ٹائم آؤٹ پیغام کے ساتھ ختم ہوتی ہیں۔

تبدیلیاں
• Alibaba کے 10 اکتوبر کو بند کرنے سے پہلے Qwen اسپیچ ان پٹ اور آؤٹ پٹ ہٹا دیے گئے ہیں۔ Qwen چیٹ اور تلاش میں کوئی تبدیلی نہیں، اور محفوظ Qwen آوازیں آپ کے آلے کی بلٹ اِن اسپیچ پر منتقل ہو جاتی ہیں۔
• Google اب Gemini 2.5 کو صرف ان اکاؤنٹس تک محدود کرتا ہے جنہوں نے اسے پہلے استعمال کیا ہے، اس لیے یہ نئے انتخاب کے لیے پیش نہیں کیا جاتا۔ موجودہ انتخاب کام کرتے رہتے ہیں، اور پرانی Gemini 2.5 آوازیں اسی آواز کے ساتھ Gemini 3.8 پر منتقل ہو جاتی ہیں۔
• OpenAI Realtime ماڈلز مکمل معاونت تک چھپے ہوئے ہیں۔ محفوظ انتخاب GPT-5.6 Sol یا GPT-5.4 mini پر منتقل ہو جاتے ہیں۔
• ElevenLabs کی بلٹ اِن متبادل آواز کا نام اب درست طور پر Janet ہے۔
```
