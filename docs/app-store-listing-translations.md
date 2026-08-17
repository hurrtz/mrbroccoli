# App Store listing translations

Store listing copy for every registered locale. The description body is the
same text as `google-play-listing-translations.md`; the subtitle, promotional
text and keywords are Apple-only fields with no Play equivalent.

The app name is `Mr Broccoli` in every locale (30-character limit).
Promotional text can be changed without submitting a new build, so it is the
right field for anything time-sensitive.

The heading tag is the App Store localization code, which is not the same as
the Play code — Apple uses `ja`, `it`, `ru`, `cs`, `sv` where Play uses
`ja-JP`, `it-IT`, `ru-RU`, `cs-CZ`, `sv-SE`. Confirm a tag against the
localization list in App Store Connect before adding a language.

> **Positioning.** Mr Broccoli is a bring-your-own-key app for people who
> already hold provider accounts. Optional local speech recognition and voices
> are real secondary routes, but response generation is BYOK-only. Lead with
> the keys and never imply that the app includes AI usage.
>
> **Rules for editing this file.**
>
> - Never state a price. The stores render it themselves and it goes stale;
>   Google Play also restricts price and promotional text in listing assets.
> - Never claim a ranking, award or superiority, and never present AI output as
>   medical, legal or financial advice.
> - Say plainly that the purchase does not include AI usage. This is what stops
>   one-star reviews from buyers who expected included inference.
> - Feature names must match the shipped UI for that language, not the English.
>   `Drive Session`, `Council` and `API key` are translated in
>   `src/i18n/locales/` and `src/i18n/workspaceTranslations.ts`; look them up
>   before writing copy for a language rather than translating from English.
> - Keep the locale set and its order identical to the preceding file.
> - The heading tag is the folder name the export step uses. Correcting a store
>   locale code is an edit here, not a code change.
> - Run `npm run listing:verify` after editing.
> - Non-English copy has not been reviewed by native speakers.

| Field | Limit |
| --- | --- |
| Subtitle | 30 characters |
| Promotional text | 170 characters |
| Keywords | 100 characters |
| Description | 4000 characters |

## English (`en-US`)

### Subtitle

```text
Your keys. Your models.
```

### Promotional text

```text
Talk to the models you already pay for. Add your API keys, choose exactly who answers, and listen to the reply. No server of ours in between.
```

### Keywords

```text
AI,voice,assistant,API,OpenAI,Anthropic,Claude,GPT,Gemini,chat,speech,offline,private,BYOK
```

### Description

```text
Mr Broccoli is a voice-first AI app for people who already have their own provider accounts. Add your keys, choose exactly which model answers, and listen to the reply. Nothing routes through a server of ours, because there isn't one.

BEFORE YOU BUY
Mr Broccoli is built around your own API keys from OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter or Alibaba Qwen. Your purchase gives you the app. It does not include AI usage — your provider bills you directly for what you use.

TALK, DON'T TYPE
• Speak, type or attach an image
• Answers are read aloud, starting as soon as the first paragraph is ready
• Skip by paragraph, pause, resume or restart playback
• Drive Session for hands-free turns: it waits until you finish, counts down, sends, speaks the answer and listens again
• Speech recognition using the system, an on-device model or your provider

CHOOSE WHO ANSWERS
• Save up to four routes — provider, exact model and reasoning effort
• Switch between them mid-conversation without losing context
• The home screen says who answers next and at what effort
• Every answer records the route that actually produced it, including any fallback

TUNE EACH CONVERSATION
• Length: brief, normal or thorough
• Tone: professional, casual, nerdy, concise, Socratic or ELI5
• Your own model and speech-delivery instructions
• A specific voice per conversation
Set defaults globally, override them per conversation.

YOUR CONVERSATIONS
• Kept in a local database on your device
• Search, pin, archive, rename, share or delete
• Fold and expand entries in one continuous transcript
• Branch from any message to try another direction without losing the original
• Lock individual conversations behind a password or biometrics

MORE WHEN YOU WANT IT
• Web search grounding, with sources attached to the answer
• Council: several models answer, review each other, then one synthesises
• Image prompts to compatible models
• Optional recall from your past conversations, entirely on the device

PRIVACY
• No Mr Broccoli account and no Mr Broccoli server
• Requests go straight from your device to the provider you chose
• API keys stay in the operating system's secure storage — never in backups, logs or exports
• A hosted provider still receives the request you send it

YOURS TO KEEP
• Full backups as readable JSON or passphrase-encrypted AES-256-GCM
• Markdown archives to read anywhere or hand to another AI
• Importing never overwrites what is already there

19 languages, including Arabic and Urdu right-to-left. Interface, dictation and answer language are set independently. Screen reader, large text, contrast and reduced-motion support throughout.

WHAT IT DOESN'T DO
No cloud account, no cross-device sync, no hosted inference, no included credits, no silent switching of your chosen model or voice, and no autonomous actions on your behalf. AI output is not medical, legal or financial advice.

No subscription. Because there is no account system, a purchase on one store does not unlock the app on the other.
```

## German (`de-DE`)

### Subtitle

```text
Deine Schlüssel, deine Modelle
```

### Promotional text

```text
Sprich mit den Modellen, für die du ohnehin zahlst. API-Schlüssel hinterlegen, genau das Modell wählen, das antworten soll, und zuhören. Kein Server von uns dazwischen.
```

### Keywords

```text
KI,Sprache,Assistent,API,OpenAI,Anthropic,Claude,GPT,Gemini,Chat,Diktat,offline,privat
```

### Description

```text
Mr Broccoli ist eine sprachgesteuerte KI-App für Menschen, die bereits eigene Provider-Konten nutzen. Hinterlege deine API-Schlüssel, wähle genau das Modell aus, das antworten soll, und hör dir die Antwort an. Nichts läuft über einen Server von uns — es gibt keinen.

VOR DEM KAUF
Mr Broccoli ist für deine eigenen API-Schlüssel gebaut: OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter oder Alibaba Qwen. Mit dem Kauf erhältst du die App. Die KI-Nutzung ist nicht enthalten — dein Provider rechnet direkt mit dir ab.

SPRECHEN STATT TIPPEN
• Sprechen, tippen oder ein Bild anhängen
• Antworten werden vorgelesen, sobald der erste Absatz fertig ist
• Absatzweise springen, pausieren, fortsetzen oder neu starten
• Fahrmodus für freihändige Gespräche: wartet, bis du fertig bist, zählt herunter, sendet, spricht die Antwort und hört wieder zu
• Spracherkennung über das System, ein Modell auf dem Gerät oder deinen Provider

WER ANTWORTET
• Bis zu vier Routen speichern — Provider, exaktes Modell und Denktiefe
• Mitten im Gespräch wechseln, ohne den Kontext zu verlieren
• Der Startbildschirm zeigt, wer als Nächstes antwortet und mit welcher Denktiefe
• Jede Antwort hält fest, welche Route sie wirklich erzeugt hat, inklusive Fallback

JEDES GESPRÄCH EINSTELLEN
• Länge: kurz, normal oder ausführlich
• Ton: professionell, locker, nerdig, knapp, sokratisch oder ELI5
• Eigene Modell- und Sprechanweisungen
• Eine eigene Stimme pro Gespräch
Global vorgeben, pro Gespräch überschreiben.

DEINE GESPRÄCHE
• Liegen in einer lokalen Datenbank auf deinem Gerät
• Suchen, anpinnen, archivieren, umbenennen, teilen oder löschen
• Einträge im fortlaufenden Transkript ein- und ausklappen
• Ab jeder Nachricht verzweigen und eine andere Richtung ausprobieren, ohne das Original zu verlieren
• Einzelne Gespräche mit Passwort oder Biometrie sperren

WENN DU MEHR WILLST
• Websuche mit Quellenangaben an der Antwort
• Rat: mehrere Modelle antworten, prüfen sich gegenseitig, eines fasst zusammen
• Bildanfragen an kompatible Modelle
• Optionaler Rückgriff auf frühere Gespräche, komplett auf dem Gerät

PRIVATSPHÄRE
• Kein Mr-Broccoli-Konto und kein Mr-Broccoli-Server
• Anfragen gehen direkt von deinem Gerät zum gewählten Provider
• API-Schlüssel bleiben im sicheren Speicher des Betriebssystems — nie in Backups, Logs oder Exporten
• Ein gehosteter Provider erhält die Anfrage, die du ihm schickst

DEINE DATEN BLEIBEN DEINE
• Vollständige Backups als lesbares JSON oder mit Passphrase verschlüsselt (AES-256-GCM)
• Markdown-Archive zum Lesen oder zur Übergabe an eine andere KI
• Ein Import überschreibt nie, was schon da ist

19 Sprachen, darunter Arabisch und Urdu von rechts nach links. Oberfläche, Diktat und Antwortsprache lassen sich unabhängig einstellen. Screenreader, große Schrift, Kontrast und reduzierte Bewegung werden durchgehend unterstützt.

WAS DIE APP NICHT MACHT
Kein Cloud-Konto, keine Geräte-Synchronisierung, keine gehostete KI, kein Guthaben inklusive, kein stiller Wechsel von Modell oder Stimme und keine selbstständigen Aktionen in deinem Namen. KI-Antworten sind keine medizinische, rechtliche oder finanzielle Beratung.

Kein Abo. Da es kein Konto-System gibt, schaltet ein Kauf in einem Store die App im anderen nicht frei.
```

## Ukrainian (`uk`)

### Subtitle

```text
Ваші ключі, ваші моделі
```

### Promotional text

```text
Говоріть із моделями, за які вже платите. Додайте свої ключі API, оберіть, хто саме відповідає, і слухайте. Без наших серверів посередині.
```

### Keywords

```text
ШІ,голос,асистент,API,OpenAI,Anthropic,Claude,GPT,Gemini,чат,диктування,офлайн
```

### Description

```text
Mr Broccoli — голосовий застосунок зі ШІ для тих, хто вже має власні акаунти в провайдерів. Додайте свої ключі, оберіть, яка саме модель відповість, і послухайте відповідь. Нічого не проходить через наш сервер, бо його просто немає.

ПЕРЕД ПОКУПКОЮ
Mr Broccoli побудований навколо ваших власних ключів API від OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter або Alibaba Qwen. Купівля надає вам доступ до застосунку. Використання ШІ до неї не входить — провайдер виставляє рахунок безпосередньо вам за те, що ви витратили.

ГОВОРІТЬ, А НЕ ДРУКУЙТЕ
• Говоріть, друкуйте або додайте зображення
• Відповіді читаються вголос, щойно готовий перший абзац
• Переходьте абзацами, ставте на паузу, продовжуйте або починайте заново
• Режим водіння для розмов без рук: чекає, поки ви договорите, відлічує, надсилає, промовляє відповідь і знову слухає
• Розпізнавання мовлення системою, моделлю на пристрої або вашим провайдером

ХТО ВІДПОВІДАЄ
• Збережіть до чотирьох маршрутів — провайдер, точна модель і глибина міркування
• Перемикайтеся посеред розмови, не втрачаючи контексту
• Головний екран показує, хто відповість наступним і з якою глибиною
• Кожна відповідь фіксує маршрут, який її справді створив, разом із запасним

НАЛАШТУЙТЕ КОЖНУ РОЗМОВУ
• Довжина: стисло, звичайно або докладно
• Тон: професійний, невимушений, нердовий, лаконічний, сократівський або ELI5
• Власні вказівки для моделі та для озвучення
• Окремий голос для кожної розмови
Задайте загальні значення й перевизначайте їх у конкретних розмовах.

ВАШІ РОЗМОВИ
• Зберігаються в локальній базі даних на вашому пристрої
• Шукайте, закріплюйте, архівуйте, перейменовуйте, діліться або видаляйте
• Згортайте й розгортайте записи в суцільній розшифровці
• Розгалужуйтеся від будь-якого повідомлення, щоб спробувати інший напрям, не втративши початковий
• Блокуйте окремі розмови паролем або біометрією

КОЛИ ПОТРІБНО БІЛЬШЕ
• Пошук у вебі з джерелами, доданими до відповіді
• Рада: кілька моделей відповідають, перевіряють одна одну, а одна підсумовує
• Запити із зображенням до сумісних моделей
• Необов'язкове звернення до попередніх розмов, повністю на пристрої

ПРИВАТНІСТЬ
• Немає акаунта Mr Broccoli і немає сервера Mr Broccoli
• Запити йдуть прямо з вашого пристрою до обраного провайдера
• Ключі API лишаються в захищеному сховищі системи — ніколи в резервних копіях, журналах чи експортах
• Хмарний провайдер, звісно, отримує надісланий йому запит

ЩО ЛИШАЄТЬСЯ ВАШИМ
• Повні резервні копії в читабельному JSON або зашифровані парольною фразою (AES-256-GCM)
• Архіви в Markdown — читати будь-де або передати іншому ШІ
• Імпорт ніколи не перезаписує те, що вже є

19 мов, зокрема арабська й урду справа наліво. Мова інтерфейсу, диктування й відповіді налаштовуються окремо. Підтримка зчитувача екрана, великого тексту, контрасту та зменшеного руху.

ЧОГО ЗАСТОСУНОК НЕ РОБИТЬ
Немає хмарного акаунта, немає синхронізації між пристроями, немає розміщеного нами ШІ, немає включених кредитів, немає тихої підміни обраної моделі чи голосу і немає самостійних дій від вашого імені. Відповіді ШІ не є медичною, юридичною чи фінансовою консультацією.

Без підписки. Оскільки системи акаунтів немає, покупка в одному магазині не відкриває застосунок в іншому.
```

## Hindi (`hi`)

### Subtitle

```text
आपकी कुंजियाँ, आपके मॉडल
```

### Promotional text

```text
जिन मॉडलों का पैसा आप पहले से दे रहे हैं, उनसे बोलकर बात करें। अपनी API कुंजियाँ जोड़ें, तय करें कौन जवाब देगा, और सुनें। बीच में हमारा कोई सर्वर नहीं।
```

### Keywords

```text
AI,आवाज़,सहायक,API,OpenAI,Anthropic,Claude,GPT,Gemini,चैट,डिक्टेशन,ऑफ़लाइन,निजी
```

### Description

```text
Mr Broccoli आवाज़-आधारित AI ऐप है, उन लोगों के लिए जिनके पास पहले से अपने प्रोवाइडर खाते हैं। अपनी कुंजियाँ जोड़ें, ठीक वही मॉडल चुनें जो जवाब दे, और जवाब सुनें। कुछ भी हमारे सर्वर से होकर नहीं जाता, क्योंकि ऐसा कोई सर्वर है ही नहीं।

खरीदने से पहले
Mr Broccoli आपकी अपनी API कुंजियों के इर्द-गिर्द बना है — OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter या Alibaba Qwen। आपकी खरीद से आपको ऐप मिलता है। इसमें AI का उपयोग शामिल नहीं है — जितना आप इस्तेमाल करेंगे, उसका बिल आपका प्रोवाइडर सीधे आपको भेजेगा।

टाइप नहीं, बोलिए
• बोलें, टाइप करें या तस्वीर जोड़ें
• पहला पैराग्राफ़ तैयार होते ही जवाब पढ़कर सुनाया जाता है
• पैराग्राफ़ दर पैराग्राफ़ आगे-पीछे जाएँ, रोकें, फिर से शुरू करें
• हाथ खाली रखकर बात करने के लिए ड्राइव सत्र: आपके बोलना खत्म करने का इंतज़ार करता है, गिनती करता है, भेजता है, जवाब बोलता है और फिर सुनने लगता है
• वाक् पहचान सिस्टम से, डिवाइस पर मौजूद मॉडल से या आपके प्रोवाइडर से

कौन जवाब देगा
• चार रास्ते तक सहेजें — प्रोवाइडर, सटीक मॉडल और सोचने की गहराई
• बातचीत के बीच में बदलें, संदर्भ खोए बिना
• होम स्क्रीन बताती है कि अगला जवाब कौन और किस गहराई से देगा
• हर जवाब उस रास्ते को दर्ज करता है जिसने उसे सचमुच बनाया, फ़ॉलबैक समेत

हर बातचीत अपने हिसाब से
• लंबाई: संक्षिप्त, सामान्य या विस्तृत
• लहज़ा: पेशेवर, अनौपचारिक, नर्डी, कसा हुआ, सुकराती या ELI5
• मॉडल और बोलने के अपने निर्देश
• हर बातचीत के लिए अलग आवाज़
वैश्विक डिफ़ॉल्ट तय करें और बातचीत के हिसाब से बदलें।

आपकी बातचीत
• आपके डिवाइस पर लोकल डेटाबेस में रहती है
• खोजें, पिन करें, संग्रह करें, नाम बदलें, साझा करें या मिटाएँ
• लगातार चलने वाले ट्रांसक्रिप्ट में प्रविष्टियाँ समेटें और खोलें
• किसी भी संदेश से शाखा बनाकर दूसरी दिशा आज़माएँ, मूल खोए बिना
• अलग-अलग बातचीत को पासवर्ड या बायोमेट्रिक से लॉक करें

जब और चाहिए
• वेब खोज, स्रोत जवाब के साथ जुड़े हुए
• परिषद: कई मॉडल जवाब देते हैं, एक-दूसरे को परखते हैं, फिर एक सार तैयार करता है
• संगत मॉडलों को तस्वीर के साथ सवाल
• पुरानी बातचीत से वैकल्पिक संदर्भ, पूरी तरह डिवाइस पर

निजता
• न Mr Broccoli खाता, न Mr Broccoli सर्वर
• अनुरोध आपके डिवाइस से सीधे आपके चुने प्रोवाइडर को जाते हैं
• API कुंजियाँ सिस्टम के सुरक्षित भंडारण में रहती हैं — बैकअप, लॉग या निर्यात में कभी नहीं
• होस्टेड प्रोवाइडर को वह अनुरोध ज़रूर मिलता है जो आप उसे भेजते हैं

जो आपका रहता है
• पूरा बैकअप — पढ़ने योग्य JSON या पासफ़्रेज़ से एन्क्रिप्टेड (AES-256-GCM)
• Markdown संग्रह, कहीं भी पढ़ें या किसी दूसरे AI को सौंपें
• आयात पहले से मौजूद चीज़ों को कभी नहीं मिटाता

19 भाषाएँ, जिनमें दाएँ से बाएँ लिखी जाने वाली अरबी और उर्दू शामिल हैं। इंटरफ़ेस, डिक्टेशन और जवाब की भाषा अलग-अलग सेट होती है। स्क्रीन रीडर, बड़े अक्षर, कंट्रास्ट और कम एनिमेशन का पूरा समर्थन।

यह क्या नहीं करता
कोई क्लाउड खाता नहीं, डिवाइसों के बीच सिंक नहीं, हमारी होस्ट की गई AI नहीं, कोई क्रेडिट शामिल नहीं, आपके चुने मॉडल या आवाज़ की चुपचाप अदला-बदली नहीं, और आपकी ओर से अपने आप कोई काम नहीं। AI के जवाब चिकित्सा, कानूनी या वित्तीय सलाह नहीं हैं।

कोई सदस्यता नहीं। खाता व्यवस्था न होने के कारण, एक स्टोर पर की गई खरीद दूसरे स्टोर पर ऐप नहीं खोलती।
```

## Spanish (`es-ES`)

### Subtitle

```text
Tus claves. Tus modelos.
```

### Promotional text

```text
Habla con los modelos que ya pagas. Añade tus claves API, elige exactamente quién responde y escucha la respuesta. Sin ningún servidor nuestro por medio.
```

### Keywords

```text
IA,voz,asistente,API,OpenAI,Anthropic,Claude,GPT,Gemini,chat,dictado,offline,privado
```

### Description

```text
Mr Broccoli es una app de IA por voz para quienes ya tienen sus propias cuentas de proveedor. Añade tus claves, elige exactamente qué modelo responde y escucha la respuesta. Nada pasa por un servidor nuestro, porque no existe.

ANTES DE COMPRAR
Mr Broccoli está construida en torno a tus propias claves API de OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter o Alibaba Qwen. Con la compra obtienes la app. No incluye el uso de IA: tu proveedor te factura directamente lo que consumes.

HABLA, NO ESCRIBAS
• Habla, escribe o adjunta una imagen
• Las respuestas se leen en voz alta en cuanto está listo el primer párrafo
• Salta por párrafos, pausa, reanuda o reinicia la reproducción
• Sesión de conducción para turnos con manos libres: espera a que termines, hace la cuenta atrás, envía, dice la respuesta y vuelve a escuchar
• Reconocimiento de voz del sistema, de un modelo en el dispositivo o de tu proveedor

QUIÉN RESPONDE
• Guarda hasta cuatro rutas: proveedor, modelo exacto y nivel de razonamiento
• Cambia a mitad de conversación sin perder el contexto
• La pantalla de inicio indica quién responde y con qué nivel
• Cada respuesta registra la ruta que realmente la produjo, incluidos los reintentos

AJUSTA CADA CONVERSACIÓN
• Longitud: breve, normal o exhaustiva
• Tono: profesional, informal, friki, conciso, socrático o ELI5
• Tus propias instrucciones de modelo y de locución
• Una voz concreta por conversación
Define valores globales y sobrescríbelos en cada conversación.

TUS CONVERSACIONES
• Guardadas en una base de datos local en tu dispositivo
• Busca, fija, archiva, renombra, comparte o elimina
• Pliega y despliega entradas en una transcripción continua
• Ramifica desde cualquier mensaje para probar otro camino sin perder el original
• Bloquea conversaciones concretas con contraseña o biometría

CUANDO QUIERAS MÁS
• Búsqueda web, con las fuentes adjuntas a la respuesta
• Consejo: varios modelos responden, se revisan entre sí y uno sintetiza
• Peticiones con imagen a modelos compatibles
• Recuerdo opcional de conversaciones anteriores, todo en el dispositivo

PRIVACIDAD
• Sin cuenta de Mr Broccoli y sin servidor de Mr Broccoli
• Las peticiones van directas de tu dispositivo al proveedor que elijas
• Las claves API se quedan en el almacenamiento seguro del sistema: nunca en copias, registros ni exportaciones
• Un proveedor alojado sí recibe la petición que le envías

LO QUE SIGUE SIENDO TUYO
• Copias completas en JSON legible o cifradas con contraseña (AES-256-GCM)
• Archivos Markdown para leer donde quieras o pasar a otra IA
• Importar nunca sobrescribe lo que ya está

19 idiomas, con árabe y urdu de derecha a izquierda. El idioma de la interfaz, el dictado y la respuesta se configuran por separado. Compatible con lector de pantalla, texto grande, contraste y movimiento reducido.

LO QUE NO HACE
Sin cuenta en la nube, sin sincronización entre dispositivos, sin IA alojada por nosotros, sin créditos incluidos, sin cambios silenciosos de tu modelo o tu voz y sin acciones autónomas en tu nombre. Las respuestas de la IA no son asesoramiento médico, legal ni financiero.

Sin suscripción. Como no hay sistema de cuentas, comprar en una tienda no desbloquea la app en la otra.
```

## French (`fr-FR`)

### Subtitle

```text
Vos clés. Vos modèles.
```

### Promotional text

```text
Parlez aux modèles que vous payez déjà. Ajoutez vos clés API, choisissez exactement qui répond, puis écoutez. Aucun serveur à nous entre les deux.
```

### Keywords

```text
IA,vocal,assistant,API,OpenAI,Anthropic,Claude,GPT,Gemini,chat,dictée,hors ligne,privé
```

### Description

```text
Mr Broccoli est une application d'IA vocale pour celles et ceux qui possèdent déjà leurs propres comptes fournisseurs. Ajoutez vos clés, choisissez exactement quel modèle répond, et écoutez la réponse. Rien ne transite par un serveur à nous, parce qu'il n'y en a aucun.

AVANT D'ACHETER
Mr Broccoli est conçue autour de vos propres clés API : OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter ou Alibaba Qwen. Votre achat vous donne accès à l'app. Il n'inclut pas l'usage de l'IA — votre fournisseur vous facture directement ce que vous consommez.

PARLEZ, N'ÉCRIVEZ PLUS
• Parlez, écrivez ou joignez une image
• Les réponses sont lues à voix haute dès que le premier paragraphe est prêt
• Avancez paragraphe par paragraphe, mettez en pause, reprenez ou recommencez
• Séance de conduite pour les échanges mains libres : elle attend que vous ayez fini, décompte, envoie, énonce la réponse et se remet à écouter
• Reconnaissance vocale via le système, un modèle sur l'appareil ou votre fournisseur

QUI RÉPOND
• Enregistrez jusqu'à quatre routes — fournisseur, modèle exact et effort de raisonnement
• Changez en pleine conversation sans perdre le contexte
• L'écran d'accueil indique qui répond ensuite et avec quel effort
• Chaque réponse conserve la route qui l'a réellement produite, y compris les replis

RÉGLEZ CHAQUE CONVERSATION
• Longueur : brève, normale ou approfondie
• Ton : professionnel, décontracté, geek, concis, socratique ou ELI5
• Vos propres instructions de modèle et de diction
• Une voix spécifique par conversation
Définissez des valeurs par défaut, remplacez-les conversation par conversation.

VOS CONVERSATIONS
• Conservées dans une base de données locale sur votre appareil
• Recherchez, épinglez, archivez, renommez, partagez ou supprimez
• Repliez et dépliez les entrées d'une transcription continue
• Bifurquez depuis n'importe quel message pour explorer une autre piste sans perdre l'original
• Verrouillez certaines conversations par mot de passe ou biométrie

QUAND VOUS EN VOULEZ PLUS
• Recherche web, avec les sources jointes à la réponse
• Conseil : plusieurs modèles répondent, se relisent, puis un seul fait la synthèse
• Requêtes avec image vers les modèles compatibles
• Rappel facultatif de vos conversations passées, entièrement sur l'appareil

CONFIDENTIALITÉ
• Aucun compte Mr Broccoli et aucun serveur Mr Broccoli
• Les requêtes partent directement de votre appareil vers le fournisseur choisi
• Les clés API restent dans le stockage sécurisé du système — jamais dans les sauvegardes, journaux ou exports
• Un fournisseur hébergé reçoit bien la requête que vous lui envoyez

CE QUI RESTE À VOUS
• Sauvegardes complètes en JSON lisible ou chiffrées par phrase secrète (AES-256-GCM)
• Archives Markdown à lire partout ou à confier à une autre IA
• Un import n'écrase jamais ce qui existe déjà

19 langues, dont l'arabe et l'ourdou de droite à gauche. Langue de l'interface, de la dictée et de la réponse se règlent séparément. Lecteur d'écran, grands caractères, contraste et animations réduites pris en charge partout.

CE QU'ELLE NE FAIT PAS
Pas de compte cloud, pas de synchronisation entre appareils, pas d'IA hébergée par nous, pas de crédits inclus, aucun changement silencieux de votre modèle ou de votre voix, et aucune action autonome en votre nom. Les réponses de l'IA ne constituent pas un avis médical, juridique ou financier.

Sans abonnement. Faute de système de comptes, un achat sur une boutique ne débloque pas l'application sur l'autre.
```

## Italian (`it`)

### Subtitle

```text
Le tue chiavi, i tuoi modelli
```

### Promotional text

```text
Parla con i modelli che già paghi. Aggiungi le tue chiavi API, scegli esattamente chi risponde e ascolta. Nessun nostro server in mezzo.
```

### Keywords

```text
IA,voce,assistente,API,OpenAI,Anthropic,Claude,GPT,Gemini,chat,dettatura,offline,privato
```

### Description

```text
Mr Broccoli è un'app di IA vocale per chi ha già i propri account presso i provider. Aggiungi le tue chiavi, scegli esattamente quale modello risponde e ascolta la risposta. Niente passa da un nostro server, perché non ne esiste uno.

PRIMA DI ACQUISTARE
Mr Broccoli è costruita attorno alle tue chiavi API di OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter o Alibaba Qwen. Con l'acquisto ottieni l'app. Non include l'uso dell'IA: è il tuo provider a fatturarti direttamente quello che consumi.

PARLA, NON SCRIVERE
• Parla, scrivi o allega un'immagine
• Le risposte vengono lette ad alta voce appena il primo paragrafo è pronto
• Salta di paragrafo, metti in pausa, riprendi o ricomincia
• Sessione di guida per turni a mani libere: aspetta che tu finisca, fa il conto alla rovescia, invia, pronuncia la risposta e torna in ascolto
• Riconoscimento vocale di sistema, con un modello sul dispositivo o tramite il tuo provider

CHI RISPONDE
• Salva fino a quattro rotte: provider, modello esatto e livello di ragionamento
• Cambia a metà conversazione senza perdere il contesto
• La schermata iniziale dice chi risponde e con quale livello
• Ogni risposta registra la rotta che l'ha davvero prodotta, ripieghi compresi

REGOLA OGNI CONVERSAZIONE
• Lunghezza: breve, normale o approfondita
• Tono: professionale, informale, nerd, conciso, socratico o ELI5
• Istruzioni tue per il modello e per la lettura
• Una voce specifica per conversazione
Imposta i valori globali e sovrascrivili per singola conversazione.

LE TUE CONVERSAZIONI
• Conservate in un database locale sul dispositivo
• Cerca, fissa, archivia, rinomina, condividi o elimina
• Comprimi ed espandi le voci di una trascrizione continua
• Dirama da qualsiasi messaggio per provare un'altra strada senza perdere l'originale
• Blocca singole conversazioni con password o biometria

QUANDO VUOI DI PIÙ
• Ricerca sul web, con le fonti allegate alla risposta
• Consiglio: più modelli rispondono, si rileggono a vicenda, poi uno sintetizza
• Richieste con immagine ai modelli compatibili
• Richiamo facoltativo delle conversazioni passate, interamente sul dispositivo

PRIVACY
• Nessun account Mr Broccoli e nessun server Mr Broccoli
• Le richieste vanno dal tuo dispositivo direttamente al provider scelto
• Le chiavi API restano nell'archivio sicuro del sistema: mai in backup, log o esportazioni
• Un provider ospitato riceve comunque la richiesta che gli invii

QUELLO CHE RESTA TUO
• Backup completi in JSON leggibile o cifrati con passphrase (AES-256-GCM)
• Archivi Markdown da leggere ovunque o da passare a un'altra IA
• L'importazione non sovrascrive mai quello che c'è già

19 lingue, con arabo e urdu da destra a sinistra. Lingua dell'interfaccia, della dettatura e della risposta si impostano separatamente. Supporto per screen reader, testo grande, contrasto e movimento ridotto.

QUELLO CHE NON FA
Nessun account cloud, nessuna sincronizzazione tra dispositivi, nessuna IA ospitata da noi, nessun credito incluso, nessun cambio silenzioso del modello o della voce e nessuna azione autonoma per tuo conto. Le risposte dell'IA non sono consulenza medica, legale o finanziaria.

Nessun abbonamento. Non esistendo un sistema di account, un acquisto su uno store non sblocca l'app sull'altro.
```

## Portuguese (`pt-PT`)

### Subtitle

```text
As suas chaves e modelos
```

### Promotional text

```text
Fale com os modelos que já paga. Adicione as suas chaves API, escolha exactamente quem responde e ouça. Sem nenhum servidor nosso pelo meio.
```

### Keywords

```text
IA,voz,assistente,API,OpenAI,Anthropic,Claude,GPT,Gemini,chat,ditado,offline,privado
```

### Description

```text
O Mr Broccoli é uma app de IA por voz para quem já tem contas próprias nos fornecedores. Adicione as suas chaves, escolha exactamente que modelo responde e oiça a resposta. Nada passa por um servidor nosso, porque não existe nenhum.

ANTES DE COMPRAR
O Mr Broccoli foi feito à volta das suas próprias chaves API da OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter ou Alibaba Qwen. A compra dá-lhe acesso à aplicação. Não inclui a utilização de IA — o seu fornecedor cobra-lhe directamente o que consumir.

FALE, EM VEZ DE ESCREVER
• Fale, escreva ou anexe uma imagem
• As respostas são lidas em voz alta assim que o primeiro parágrafo estiver pronto
• Salte por parágrafos, faça pausa, retome ou recomece
• Sessão Drive para turnos em mãos-livres: espera que termine, faz a contagem decrescente, envia, diz a resposta e volta a ouvir
• Reconhecimento de voz do sistema, de um modelo no dispositivo ou do seu fornecedor

QUEM RESPONDE
• Guarde até quatro rotas: fornecedor, modelo exacto e nível de raciocínio
• Mude a meio da conversa sem perder o contexto
• O ecrã inicial indica quem responde a seguir e com que nível
• Cada resposta regista a rota que realmente a produziu, incluindo recursos alternativos

AFINE CADA CONVERSA
• Extensão: breve, normal ou aprofundada
• Tom: profissional, descontraído, nerd, conciso, socrático ou ELI5
• Instruções suas para o modelo e para a locução
• Uma voz específica por conversa
Defina valores globais e substitua-os conversa a conversa.

AS SUAS CONVERSAS
• Guardadas numa base de dados local no seu dispositivo
• Pesquise, fixe, arquive, mude o nome, partilhe ou elimine
• Recolha e expanda entradas numa transcrição contínua
• Ramifique a partir de qualquer mensagem para tentar outro caminho sem perder o original
• Bloqueie conversas específicas com palavra-passe ou biometria

QUANDO QUISER MAIS
• Pesquisa web, com as fontes anexadas à resposta
• Conselho: vários modelos respondem, revêem-se entre si e um faz a síntese
• Pedidos com imagem para modelos compatíveis
• Recurso opcional a conversas anteriores, inteiramente no dispositivo

PRIVACIDADE
• Sem conta Mr Broccoli e sem servidor Mr Broccoli
• Os pedidos vão do seu dispositivo directamente para o fornecedor escolhido
• As chaves API ficam no armazenamento seguro do sistema — nunca em cópias, registos ou exportações
• Um fornecedor alojado recebe de facto o pedido que lhe envia

O QUE CONTINUA A SER SEU
• Cópias completas em JSON legível ou cifradas com frase-passe (AES-256-GCM)
• Arquivos Markdown para ler onde quiser ou entregar a outra IA
• Importar nunca substitui o que já lá está

19 idiomas, com árabe e urdu da direita para a esquerda. O idioma da interface, do ditado e da resposta definem-se em separado. Suporte para leitor de ecrã, texto grande, contraste e movimento reduzido.

O QUE NÃO FAZ
Sem conta na nuvem, sem sincronização entre dispositivos, sem IA alojada por nós, sem créditos incluídos, sem trocas silenciosas do seu modelo ou da sua voz e sem acções autónomas em seu nome. As respostas da IA não são aconselhamento médico, jurídico ou financeiro.

Sem subscrição. Como não há sistema de contas, comprar numa loja não desbloqueia a app na outra.
```

## Brazilian Portuguese (`pt-BR`)

### Subtitle

```text
Suas chaves, seus modelos
```

### Promotional text

```text
Converse com os modelos que você já paga. Adicione suas chaves API, escolha exatamente quem responde e ouça. Sem nenhum servidor nosso no meio.
```

### Keywords

```text
IA,voz,assistente,API,OpenAI,Anthropic,Claude,GPT,Gemini,chat,ditado,offline,privado
```

### Description

```text
O Mr Broccoli é um app de IA por voz para quem já tem as próprias contas nos provedores. Adicione suas chaves, escolha exatamente qual modelo responde e ouça a resposta. Nada passa por um servidor nosso, porque não existe nenhum.

ANTES DE COMPRAR
O Mr Broccoli foi feito em torno das suas próprias chaves API da OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter ou Alibaba Qwen. A compra dá a você o app. Ela não inclui o uso de IA — seu provedor cobra diretamente de você o que consumir.

FALE, EM VEZ DE DIGITAR
• Fale, digite ou anexe uma imagem
• As respostas são lidas em voz alta assim que o primeiro parágrafo fica pronto
• Pule por parágrafos, pause, retome ou recomece
• Sessão do Drive para turnos com as mãos livres: espera você terminar, faz a contagem regressiva, envia, fala a resposta e volta a ouvir
• Reconhecimento de voz do sistema, de um modelo no aparelho ou do seu provedor

QUEM RESPONDE
• Salve até quatro rotas: provedor, modelo exato e nível de raciocínio
• Troque no meio da conversa sem perder o contexto
• A tela inicial mostra quem responde e com qual nível
• Cada resposta registra a rota que realmente a produziu, inclusive as alternativas

AJUSTE CADA CONVERSA
• Tamanho: breve, normal ou detalhado
• Tom: profissional, descontraído, nerd, conciso, socrático ou ELI5
• Suas próprias instruções de modelo e de locução
• Uma voz específica por conversa
Defina padrões globais e substitua conversa a conversa.

SUAS CONVERSAS
• Guardadas em um banco de dados local no seu aparelho
• Busque, fixe, arquive, renomeie, compartilhe ou exclua
• Recolha e expanda entradas em uma transcrição contínua
• Ramifique a partir de qualquer mensagem para tentar outro caminho sem perder o original
• Bloqueie conversas específicas com senha ou biometria

QUANDO QUISER MAIS
• Busca na web, com as fontes anexadas à resposta
• Conselho: vários modelos respondem, revisam uns aos outros e um faz a síntese
• Pedidos com imagem para modelos compatíveis
• Retomada opcional de conversas anteriores, inteiramente no aparelho

PRIVACIDADE
• Sem conta Mr Broccoli e sem servidor Mr Broccoli
• Os pedidos vão do seu aparelho direto para o provedor escolhido
• As chaves API ficam no armazenamento seguro do sistema — nunca em backups, logs ou exportações
• Um provedor hospedado de fato recebe o pedido que você manda

O QUE CONTINUA SENDO SEU
• Backups completos em JSON legível ou criptografados com senha (AES-256-GCM)
• Arquivos Markdown para ler onde quiser ou entregar a outra IA
• Importar nunca sobrescreve o que já está lá

19 idiomas, com árabe e urdu da direita para a esquerda. O idioma da interface, do ditado e da resposta são definidos separadamente. Suporte a leitor de tela, texto grande, contraste e movimento reduzido.

O QUE ELE NÃO FAZ
Sem conta na nuvem, sem sincronização entre aparelhos, sem IA hospedada por nós, sem créditos inclusos, sem trocas silenciosas do seu modelo ou da sua voz e sem ações autônomas em seu nome. As respostas da IA não são orientação médica, jurídica ou financeira.

Sem assinatura. Como não há sistema de contas, comprar em uma loja não libera o app na outra.
```

## Russian (`ru`)

### Subtitle

```text
Ваши ключи, ваши модели
```

### Promotional text

```text
Говорите с моделями, за которые уже платите. Добавьте свои ключи API, выберите, кто именно отвечает, и слушайте. Без наших серверов посередине.
```

### Keywords

```text
ИИ,голос,ассистент,API,OpenAI,Anthropic,Claude,GPT,Gemini,чат,диктовка,офлайн
```

### Description

```text
Mr Broccoli — голосовое ИИ-приложение для тех, у кого уже есть собственные аккаунты у провайдеров. Добавьте свои ключи, выберите, какая именно модель ответит, и послушайте ответ. Ничего не проходит через наш сервер, потому что его просто нет.

ПЕРЕД ПОКУПКОЙ
Mr Broccoli построен вокруг ваших собственных ключей API от OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter или Alibaba Qwen. Покупка даёт вам доступ к приложению. Использование ИИ в неё не входит — провайдер выставляет вам счёт напрямую за то, что вы потратили.

ГОВОРИТЕ, А НЕ ПЕЧАТАЙТЕ
• Говорите, печатайте или прикрепите изображение
• Ответы читаются вслух, как только готов первый абзац
• Переходите по абзацам, ставьте на паузу, продолжайте или начинайте заново
• Сеанс вождения для разговоров без рук: ждёт, пока вы закончите, отсчитывает, отправляет, произносит ответ и снова слушает
• Распознавание речи системой, моделью на устройстве или вашим провайдером

КТО ОТВЕЧАЕТ
• Сохраните до четырёх маршрутов — провайдер, точная модель и глубина рассуждения
• Переключайтесь посреди разговора, не теряя контекст
• Главный экран показывает, кто ответит следующим и с какой глубиной
• Каждый ответ фиксирует маршрут, который его действительно создал, включая запасной

НАСТРОЙТЕ КАЖДЫЙ РАЗГОВОР
• Длина: кратко, обычно или подробно
• Тон: профессиональный, непринуждённый, нердовский, лаконичный, сократовский или ELI5
• Собственные инструкции для модели и для озвучивания
• Отдельный голос для каждого разговора
Задайте общие значения и переопределяйте их в конкретных разговорах.

ВАШИ РАЗГОВОРЫ
• Хранятся в локальной базе данных на вашем устройстве
• Ищите, закрепляйте, архивируйте, переименовывайте, делитесь или удаляйте
• Сворачивайте и разворачивайте записи в сплошной расшифровке
• Ветвитесь от любого сообщения, чтобы попробовать другое направление, не теряя исходное
• Блокируйте отдельные разговоры паролем или биометрией

КОГДА НУЖНО БОЛЬШЕ
• Веб-поиск с источниками, прикреплёнными к ответу
• Совет: несколько моделей отвечают, проверяют друг друга, затем одна обобщает
• Запросы с изображением к совместимым моделям
• Необязательное обращение к прошлым разговорам, полностью на устройстве

ПРИВАТНОСТЬ
• Нет аккаунта Mr Broccoli и нет сервера Mr Broccoli
• Запросы идут прямо с вашего устройства к выбранному провайдеру
• Ключи API остаются в защищённом хранилище системы — никогда в резервных копиях, журналах или экспортах
• Облачный провайдер, разумеется, получает отправленный ему запрос

ЧТО ОСТАЁТСЯ ВАШИМ
• Полные резервные копии в читаемом JSON или зашифрованные парольной фразой (AES-256-GCM)
• Архивы в Markdown — читать где угодно или передать другому ИИ
• Импорт никогда не перезаписывает то, что уже есть

19 языков, включая арабский и урду справа налево. Язык интерфейса, диктовки и ответа настраиваются отдельно. Поддержка экранного диктора, крупного текста, контраста и уменьшенного движения.

ЧЕГО ПРИЛОЖЕНИЕ НЕ ДЕЛАЕТ
Нет облачного аккаунта, нет синхронизации между устройствами, нет размещённого нами ИИ, нет включённых кредитов, нет тихой подмены выбранной модели или голоса и нет самостоятельных действий от вашего имени. Ответы ИИ не являются медицинской, юридической или финансовой консультацией.

Без подписки. Поскольку системы аккаунтов нет, покупка в одном магазине не открывает приложение в другом.
```

## Simplified Chinese (`zh-Hans`)

### Subtitle

```text
你的密钥，你的模型
```

### Promotional text

```text
和你已经在付费的模型说话。填入 API 密钥，指定由谁回答，然后听。中间没有我们的服务器。
```

### Keywords

```text
AI,人工智能,语音,助手,API,OpenAI,Anthropic,Claude,GPT,Gemini,聊天,听写,离线,隐私
```

### Description

```text
Mr Broccoli 是一款语音优先的 AI 应用，面向已经拥有自己服务商账号的人。填入密钥，指定由哪个模型回答，然后听答案。没有任何内容经过我们的服务器，因为我们根本没有服务器。

购买前请注意
Mr Broccoli 围绕你自己的 API 密钥构建，支持 OpenAI、Anthropic、Google Gemini、xAI、Mistral、DeepSeek、OpenRouter 和阿里云通义千问。购买后即可使用本 App，但不包含 AI 使用量——用了多少由服务商直接向你收费。

用说的，别用打的
• 说话、打字，或附上一张图片
• 第一段一写好就开始朗读
• 按段落跳转、暂停、继续或重头播放
• 驾驶会话用于免提对话：等你说完、倒计时、发送、念出答案，然后重新聆听
• 语音识别可用系统、本机模型或你的服务商

由谁回答
• 最多保存四条路线——服务商、具体模型和推理力度
• 对话中途切换，不丢上下文
• 主屏会告诉你下一轮由谁回答、用什么力度
• 每个答案都会记录真正产生它的路线，包括任何回退

逐个对话调校
• 长度：简短、正常或详尽
• 语气：专业、随意、书呆子、精炼、苏格拉底式或 ELI5
• 你自己的模型指令和朗读指令
• 每个对话单独指定声音
先设全局默认值，再按对话覆盖。

你的对话
• 保存在本机的本地数据库中
• 搜索、置顶、归档、重命名、分享或删除
• 在连续的文字记录中折叠和展开条目
• 从任意消息分支，试另一个方向而不丢掉原来的
• 用密码或生物识别锁住单个对话

想要更多时
• 联网搜索，来源附在答案上
• 评议会：多个模型作答、互相审阅，再由一个汇总
• 向兼容模型发送带图片的提问
• 可选调取以往对话，全部在本机完成

隐私
• 没有 Mr Broccoli 账号，也没有 Mr Broccoli 服务器
• 请求从你的设备直接发往你选定的服务商
• API 密钥留在操作系统的安全存储中——绝不出现在备份、日志或导出文件里
• 云端服务商当然会收到你发给它的请求

始终属于你
• 完整备份，可选可读 JSON 或口令加密（AES-256-GCM）
• Markdown 存档，随处可读，也可交给别的 AI
• 导入绝不覆盖已有内容

19 种语言，含从右到左的阿拉伯语和乌尔都语。界面、听写和回答语言可分别设置。全面支持屏幕阅读器、大字体、对比度和减弱动态效果。

不做的事
没有云账号，不跨设备同步，不由我们托管 AI，不附赠额度，不悄悄更换你选的模型或声音，也不代你自行行动。AI 的回答不构成医疗、法律或财务建议。

没有订阅。由于没有账号体系，在一个商店购买不会解锁另一个商店的应用。
```

## Arabic (`ar-SA`)

### Subtitle

```text
مفاتيحك ونماذجك
```

### Promotional text

```text
تحدّث إلى النماذج التي تدفع مقابلها أصلاً. أضف مفاتيح API، وحدّد من يجيب بالضبط، ثم استمع. لا خادم لنا في الطريق.
```

### Keywords

```text
ذكاء اصطناعي,صوت,مساعد,API,OpenAI,Anthropic,Claude,GPT,Gemini,محادثة,إملاء,بدون إنترنت
```

### Description

```text
Mr Broccoli تطبيق ذكاء اصطناعي يعتمد على الصوت، لمن لديهم بالفعل حسابات خاصة بهم لدى المزوّدين. أضف مفاتيحك، واختر بالضبط النموذج الذي يجيب، ثم استمع إلى الرد. لا شيء يمر عبر خادم لنا، ببساطة لأنه غير موجود.

قبل الشراء
بُني Mr Broccoli حول مفاتيح API الخاصة بك من OpenAI وAnthropic وGoogle Gemini وxAI وMistral وDeepSeek وOpenRouter وAlibaba Qwen. يمنحك الشراء التطبيق. وهو لا يشمل استخدام الذكاء الاصطناعي؛ فالمزوّد يحاسبك مباشرة على ما تستهلكه.

تحدّث بدل الكتابة
• تحدّث أو اكتب أو أرفق صورة
• تُقرأ الإجابات بصوت مسموع فور جاهزية الفقرة الأولى
• تنقّل بين الفقرات، أوقف مؤقتاً، استأنف أو ابدأ من جديد
• جلسة القيادة للمحادثة دون استخدام اليدين: تنتظر حتى تنتهي، تعد تنازلياً، ترسل، تنطق الإجابة ثم تعود للاستماع
• التعرّف على الكلام عبر النظام أو نموذج على الجهاز أو مزوّدك

من يجيب
• احفظ حتى أربعة مسارات: المزوّد والنموذج الدقيق وعمق التفكير
• بدّل بينها في منتصف المحادثة دون فقدان السياق
• تعرض الشاشة الرئيسية من سيجيب في الدور التالي وبأي عمق
• كل إجابة تسجّل المسار الذي أنتجها فعلاً، بما في ذلك أي مسار احتياطي

اضبط كل محادثة
• الطول: موجز أو عادي أو مفصّل
• الأسلوب: مهني، عفوي، تقني، مقتضب، سقراطي أو ELI5
• تعليماتك الخاصة للنموذج وللإلقاء
• صوت محدد لكل محادثة
حدّد قيماً عامة، ثم تجاوزها في كل محادثة على حدة.

محادثاتك
• محفوظة في قاعدة بيانات محلية على جهازك
• ابحث، ثبّت، أرشف، أعد التسمية، شارك أو احذف
• اطوِ العناصر وافردها داخل نص متصل
• تفرّع من أي رسالة لتجربة اتجاه آخر دون فقدان الأصل
• اقفل محادثات بعينها بكلمة مرور أو ببصمة

عندما تريد المزيد
• بحث في الويب، مع إرفاق المصادر بالإجابة
• المجلس: عدة نماذج تجيب، تراجع بعضها بعضاً، ثم يلخّص واحد منها
• طلبات مصحوبة بصورة إلى النماذج المتوافقة
• استدعاء اختياري لمحادثاتك السابقة، بالكامل على الجهاز

الخصوصية
• لا حساب لـ Mr Broccoli ولا خادم لـ Mr Broccoli
• تنتقل الطلبات مباشرة من جهازك إلى المزوّد الذي اخترته
• تبقى مفاتيح API في التخزين الآمن لنظام التشغيل، ولا تظهر أبداً في النسخ الاحتياطية أو السجلات أو التصدير
• المزوّد المستضاف يتلقى بالطبع الطلب الذي ترسله إليه

ما يبقى لك
• نسخ احتياطية كاملة بصيغة JSON مقروءة أو مشفّرة بعبارة مرور (AES-256-GCM)
• أرشيف Markdown تقرأه في أي مكان أو تسلّمه لذكاء اصطناعي آخر
• الاستيراد لا يستبدل أبداً ما هو موجود

19 لغة، من بينها العربية والأردية من اليمين إلى اليسار. تُضبط لغة الواجهة والإملاء والإجابة كل على حدة. دعم كامل لقارئ الشاشة والنص الكبير والتباين وتقليل الحركة.

ما لا يفعله
لا حساب سحابي، ولا مزامنة بين الأجهزة، ولا ذكاء اصطناعي نستضيفه نحن، ولا رصيد مضمّن، ولا تبديل صامت للنموذج أو الصوت الذي اخترته، ولا تصرفات تلقائية نيابة عنك. إجابات الذكاء الاصطناعي ليست استشارة طبية أو قانونية أو مالية.

بلا اشتراك. ولعدم وجود نظام حسابات، فإن الشراء من متجر لا يفتح التطبيق في المتجر الآخر.
```

## Japanese (`ja`)

### Subtitle

```text
あなたの鍵、あなたのモデル
```

### Promotional text

```text
すでに料金を払っているモデルと、声で話す。APIキーを登録し、どのモデルが答えるかを選んで、聞くだけ。当社のサーバーは一切介在しません。
```

### Keywords

```text
AI,音声,アシスタント,API,OpenAI,Anthropic,Claude,GPT,Gemini,チャット,音声入力,オフライン
```

### Description

```text
Mr Broccoli は、すでに各プロバイダのアカウントを持っている人のための音声AIアプリです。キーを登録し、どのモデルが答えるかを正確に選び、返ってきた答えを聞く。当社のサーバーは経由しません。そもそも存在しないからです。

購入前に
Mr Broccoli は、OpenAI、Anthropic、Google Gemini、xAI、Mistral、DeepSeek、OpenRouter、Alibaba Qwen の自分のAPIキーを使う前提で作られています。購入するとアプリを利用できます。AIの利用料は含まれません。使った分はプロバイダから直接請求されます。

打つのではなく、話す
• 話す、打つ、画像を添える
• 最初の段落ができた時点から読み上げを開始
• 段落単位で移動、一時停止、再開、最初から再生
• ハンズフリー用のドライブモード。話し終わるのを待ち、カウントダウンし、送信し、答えを読み上げ、また聞き取りに戻ります
• 音声認識はシステム、端末上のモデル、プロバイダのいずれかで

誰が答えるか
• 経路を4つまで保存 — プロバイダ、正確なモデル、推論の深さ
• 会話の途中でも文脈を保ったまま切り替え
• ホーム画面に、次に誰がどの深さで答えるかを表示
• 各回答には、実際に生成した経路とフォールバックが記録されます

会話ごとに調整
• 長さ：簡潔、標準、詳細
• トーン：プロフェッショナル、カジュアル、ナード、簡潔、ソクラテス式、ELI5
• モデルと読み上げへの独自の指示
• 会話ごとの声
既定値を全体に設定し、会話単位で上書きできます。

あなたの会話
• 端末内のローカルデータベースに保存
• 検索、ピン留め、アーカイブ、名前変更、共有、削除
• 連続した文字起こしの中で各項目を折りたたみ・展開
• 任意のメッセージから分岐し、元を残したまま別の方向を試す
• 個別の会話をパスワードまたは生体認証でロック

もっと必要なときは
• ウェブ検索。出典は回答に添付されます
• 評議会：複数のモデルが答え、互いに検証し、ひとつがまとめます
• 対応モデルへの画像付きリクエスト
• 過去の会話の参照（任意、すべて端末上）

プライバシー
• Mr Broccoli のアカウントもサーバーもありません
• リクエストは端末から、選んだプロバイダへ直接送られます
• APIキーはOSの安全な保管領域に残ります。バックアップ、ログ、書き出しには決して含まれません
• ホスト型プロバイダには当然そのリクエストが届きます。

持ち出せるもの
• 完全バックアップ。読めるJSON、またはパスフレーズ暗号化（AES-256-GCM）
• どこでも読めて、他のAIにも渡せるMarkdownアーカイブ
• 取り込みが既存のデータを上書きすることはありません

アラビア語とウルドゥー語の右横書きを含む19言語。画面表示、音声入力、回答の言語はそれぞれ個別に設定できます。スクリーンリーダー、大きな文字、コントラスト、視差効果の低減に対応。

やらないこと
クラウドアカウントなし、端末間同期なし、当社によるAIホスティングなし、クレジット同梱なし、選んだモデルや声を黙って差し替えることなし、あなたの代わりに勝手に動くこともなし。AIの回答は医療・法律・金融の助言ではありません。

サブスクリプションはありません。アカウント制度がないため、一方のストアでの購入がもう一方でアプリを解除することはありません。
```

## Hungarian (`hu`)

### Subtitle

```text
A te kulcsaid, a te modelljeid
```

### Promotional text

```text
Beszélj azokkal a modellekkel, amikért úgyis fizetsz. Add meg az API-kulcsaidat, válaszd ki, pontosan ki válaszol, és hallgasd meg. Nincs köztünk szerver.
```

### Keywords

```text
MI,AI,hang,asszisztens,API,OpenAI,Anthropic,Claude,GPT,Gemini,chat,diktálás,offline
```

### Description

```text
A Mr Broccoli hangvezérelt MI-alkalmazás azoknak, akiknek már van saját fiókjuk a szolgáltatóknál. Add meg a kulcsaidat, válaszd ki pontosan, melyik modell válaszoljon, és hallgasd meg a választ. Semmi nem megy át a mi szerverünkön, mert nincs ilyen.

VÁSÁRLÁS ELŐTT
A Mr Broccoli a saját API-kulcsaid köré épül: OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter vagy Alibaba Qwen. A vásárlással megkapod az alkalmazást. Az MI-használatot nem tartalmazza — a szolgáltatód közvetlenül számlázza neked, amit elhasználsz.

BESZÉLJ GÉPELÉS HELYETT
• Beszélj, gépelj vagy csatolj képet
• A válaszokat felolvassa, amint az első bekezdés elkészült
• Ugorj bekezdésenként, szüneteltess, folytasd vagy kezdd újra
• Vezetési mód a kihangosított körökhöz: megvárja, míg befejezed, visszaszámol, elküldi, felolvassa a választ és újra figyel
• Beszédfelismerés a rendszerrel, eszközön futó modellel vagy a szolgáltatóddal

KI VÁLASZOL
• Ments el akár négy útvonalat — szolgáltató, pontos modell és gondolkodási mélység
• Válts köztük beszélgetés közben a kontextus elvesztése nélkül
• A főképernyő megmutatja, ki válaszol és milyen mélységgel
• Minden válasz rögzíti a ténylegesen használt útvonalat, a tartalékokkal együtt

ÁLLÍTS BE MINDEN BESZÉLGETÉST
• Hossz: rövid, normál vagy alapos
• Hangnem: profi, laza, nerdes, tömör, szókratészi vagy ELI5
• Saját modell- és felolvasási utasítások
• Külön hang beszélgetésenként
Adj meg globális alapértékeket, és írd felül őket beszélgetésenként.

A BESZÉLGETÉSEID
• Helyi adatbázisban maradnak az eszközödön
• Keress, rögzíts, archiválj, nevezz át, ossz meg vagy törölj
• Csukd össze és nyisd ki a bejegyzéseket egyetlen folyamatos átiratban
• Ágazz el bármelyik üzenettől, hogy más irányt próbálj az eredeti elvesztése nélkül
• Zárj le egyes beszélgetéseket jelszóval vagy biometriával

HA TÖBBET SZERETNÉL
• Webes keresés, a forrásokkal a válasz mellett
• Tanács: több modell válaszol, átnézik egymást, majd egy összegez
• Képes kérések a kompatibilis modelleknek
• Választható visszanyúlás korábbi beszélgetésekhez, teljesen az eszközön

ADATVÉDELEM
• Nincs Mr Broccoli fiók és nincs Mr Broccoli szerver
• A kérések közvetlenül az eszközödről mennek a választott szolgáltatóhoz
• Az API-kulcsok a rendszer biztonságos tárolójában maradnak — soha nem kerülnek mentésbe, naplóba vagy exportba
• A felhős szolgáltató természetesen megkapja a neki küldött kérést

AMI A TIÉD MARAD
• Teljes mentések olvasható JSON-ként vagy jelmondattal titkosítva (AES-256-GCM)
• Markdown-archívumok, bárhol olvashatók vagy átadhatók egy másik MI-nek
• Az importálás soha nem írja felül azt, ami már megvan

19 nyelv, köztük a jobbról balra író arab és urdu. A felület, a diktálás és a válasz nyelve külön állítható. Képernyőolvasó, nagy szöveg, kontraszt és csökkentett mozgás támogatott.

AMIT NEM CSINÁL
Nincs felhőfiók, nincs eszközök közti szinkron, nincs általunk üzemeltetett MI, nincs benne kredit, nincs csendes modell- vagy hangcsere, és nem cselekszik önállóan a nevedben. Az MI válaszai nem minősülnek orvosi, jogi vagy pénzügyi tanácsnak.

Nincs előfizetés. Mivel nincs fiókrendszer, az egyik áruházban vásárolt hozzáférés a másikban nem oldja fel az alkalmazást.
```

## Czech (`cs`)

### Subtitle

```text
Vaše klíče, vaše modely
```

### Promotional text

```text
Mluvte s modely, které už platíte. Přidejte své API klíče, vyberte přesně, kdo odpoví, a poslouchejte. Bez jakéhokoli našeho serveru mezi tím.
```

### Keywords

```text
AI,hlas,asistent,API,OpenAI,Anthropic,Claude,GPT,Gemini,chat,diktování,offline,soukromí
```

### Description

```text
Mr Broccoli je hlasová AI aplikace pro ty, kdo už mají vlastní účty u poskytovatelů. Přidejte své klíče, vyberte přesně ten model, který má odpovědět, a poslechněte si odpověď. Nic neprochází přes náš server, protože žádný nemáme.

NEŽ KOUPÍTE
Mr Broccoli je postavený kolem vašich vlastních API klíčů od OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter nebo Alibaba Qwen. Nákup vám zpřístupní aplikaci. Nezahrnuje využití AI — poskytovatel vám účtuje přímo to, co spotřebujete.

MLUVTE MÍSTO PSANÍ
• Mluvte, pište nebo přiložte obrázek
• Odpovědi se čtou nahlas, jakmile je hotový první odstavec
• Přeskakujte po odstavcích, pozastavte, pokračujte nebo začněte znovu
• Relace řízení pro rozhovory bez rukou: počká, až domluvíte, odpočítá, odešle, přečte odpověď a znovu poslouchá
• Rozpoznávání řeči systémem, modelem v zařízení nebo vaším poskytovatelem

KDO ODPOVÍDÁ
• Uložte až čtyři trasy — poskytovatel, přesný model a míra uvažování
• Přepínejte je uprostřed rozhovoru bez ztráty kontextu
• Úvodní obrazovka ukazuje, kdo odpoví a s jakou mírou
• Každá odpověď zaznamená trasu, která ji skutečně vytvořila, včetně náhradní

NASTAVTE KAŽDÝ ROZHOVOR
• Délka: stručná, normální nebo důkladná
• Tón: profesionální, uvolněný, nerdský, úsporný, sokratovský nebo ELI5
• Vlastní pokyny pro model i pro přednes
• Konkrétní hlas pro daný rozhovor
Nastavte globální výchozí hodnoty a přepište je u jednotlivých rozhovorů.

VAŠE ROZHOVORY
• Uložené v lokální databázi ve vašem zařízení
• Hledejte, připínejte, archivujte, přejmenovávejte, sdílejte nebo mažte
• Sbalujte a rozbalujte položky v souvislém přepisu
• Větvete od libovolné zprávy a zkoušejte jiný směr bez ztráty originálu
• Zamykejte jednotlivé rozhovory heslem nebo biometrií

KDYŽ CHCETE VÍC
• Vyhledávání na webu se zdroji připojenými k odpovědi
• Rada: několik modelů odpoví, vzájemně se zkontrolují a jeden vše shrne
• Dotazy s obrázkem na kompatibilní modely
• Volitelné sáhnutí do dřívějších rozhovorů, celé v zařízení

SOUKROMÍ
• Žádný účet Mr Broccoli a žádný server Mr Broccoli
• Požadavky jdou z vašeho zařízení přímo k vybranému poskytovateli
• API klíče zůstávají v bezpečném úložišti systému — nikdy v zálohách, protokolech ani exportech
• Hostovaný poskytovatel samozřejmě obdrží požadavek, který mu pošlete

CO ZŮSTÁVÁ VAŠE
• Úplné zálohy jako čitelný JSON nebo šifrované heslem (AES-256-GCM)
• Archivy v Markdownu ke čtení kdekoli nebo k předání jiné AI
• Import nikdy nepřepíše to, co už tam je

19 jazyků, včetně arabštiny a urdštiny zprava doleva. Jazyk rozhraní, diktování a odpovědi se nastavují zvlášť. Podpora čtečky obrazovky, velkého textu, kontrastu a omezeného pohybu.

CO NEDĚLÁ
Žádný cloudový účet, žádná synchronizace mezi zařízeními, žádná AI hostovaná námi, žádný zahrnutý kredit, žádné tiché výměny vašeho modelu nebo hlasu a žádné samostatné akce vaším jménem. Odpovědi AI nejsou lékařská, právní ani finanční rada.

Bez předplatného. Protože neexistuje systém účtů, nákup v jednom obchodě neodemkne aplikaci v druhém.
```

## Polish (`pl`)

### Subtitle

```text
Twoje klucze, twoje modele
```

### Promotional text

```text
Rozmawiaj z modelami, za które i tak płacisz. Dodaj swoje klucze API, wybierz dokładnie, kto odpowiada, i słuchaj. Bez naszego serwera pośrodku.
```

### Keywords

```text
AI,głos,asystent,API,OpenAI,Anthropic,Claude,GPT,Gemini,czat,dyktowanie,offline,prywatnie
```

### Description

```text
Mr Broccoli to głosowa aplikacja AI dla osób, które mają już własne konta u dostawców. Dodaj swoje klucze, wybierz dokładnie ten model, który ma odpowiedzieć, i posłuchaj odpowiedzi. Nic nie przechodzi przez nasz serwer, bo takiego nie ma.

ZANIM KUPISZ
Mr Broccoli jest zbudowany wokół twoich własnych kluczy API od OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter lub Alibaba Qwen. Zakup daje ci dostęp do aplikacji. Nie obejmuje korzystania z AI — dostawca rozlicza cię bezpośrednio za zużycie.

MÓW, NIE PISZ
• Mów, pisz albo dołącz obraz
• Odpowiedzi są czytane na głos, gdy tylko gotowy jest pierwszy akapit
• Przeskakuj akapitami, wstrzymuj, wznawiaj lub zaczynaj od nowa
• Sesja jazdy do rozmów bez użycia rąk: czeka, aż skończysz, odlicza, wysyła, wypowiada odpowiedź i znów słucha
• Rozpoznawanie mowy przez system, model na urządzeniu albo twojego dostawcę

KTO ODPOWIADA
• Zapisz do czterech tras — dostawca, dokładny model i poziom rozumowania
• Zmieniaj je w trakcie rozmowy bez utraty kontekstu
• Ekran główny pokazuje, kto odpowie i na jakim poziomie
• Każda odpowiedź zapisuje trasę, która ją naprawdę wygenerowała, łącznie z awaryjną

USTAW KAŻDĄ ROZMOWĘ
• Długość: zwięzła, normalna lub wyczerpująca
• Ton: profesjonalny, swobodny, nerdowski, zwięzły, sokratejski lub ELI5
• Własne instrukcje dla modelu i dla lektora
• Konkretny głos dla danej rozmowy
Ustaw wartości globalne i nadpisuj je w poszczególnych rozmowach.

TWOJE ROZMOWY
• Trzymane w lokalnej bazie danych na twoim urządzeniu
• Szukaj, przypinaj, archiwizuj, zmieniaj nazwy, udostępniaj lub usuwaj
• Zwijaj i rozwijaj wpisy w ciągłym zapisie
• Rozgałęziaj od dowolnej wiadomości, by sprawdzić inny kierunek bez utraty oryginału
• Blokuj wybrane rozmowy hasłem lub biometrią

GDY POTRZEBUJESZ WIĘCEJ
• Wyszukiwanie w sieci, ze źródłami dołączonymi do odpowiedzi
• Rada: kilka modeli odpowiada, sprawdza się nawzajem, a jeden podsumowuje
• Zapytania z obrazem do zgodnych modeli
• Opcjonalne sięganie do wcześniejszych rozmów, w całości na urządzeniu

PRYWATNOŚĆ
• Brak konta Mr Broccoli i brak serwera Mr Broccoli
• Zapytania idą prosto z twojego urządzenia do wybranego dostawcy
• Klucze API zostają w bezpiecznym magazynie systemu — nigdy w kopiach, logach ani eksportach
• Hostowany dostawca oczywiście dostaje zapytanie, które mu wysyłasz

TO ZOSTAJE TWOJE
• Pełne kopie jako czytelny JSON albo zaszyfrowane hasłem (AES-256-GCM)
• Archiwa Markdown do czytania wszędzie albo przekazania innej AI
• Import nigdy nie nadpisuje tego, co już jest

19 języków, w tym arabski i urdu pisane od prawej do lewej. Język interfejsu, dyktowania i odpowiedzi ustawia się osobno. Obsługa czytnika ekranu, dużego tekstu, kontrastu i ograniczonego ruchu.

CZEGO NIE ROBI
Brak konta w chmurze, brak synchronizacji między urządzeniami, brak AI hostowanej przez nas, brak dołączonych środków, brak cichej zmiany twojego modelu lub głosu i brak samodzielnych działań w twoim imieniu. Odpowiedzi AI nie są poradą medyczną, prawną ani finansową.

Bez subskrypcji. Ponieważ nie ma systemu kont, zakup w jednym sklepie nie odblokowuje aplikacji w drugim.
```

## Turkish (`tr`)

### Subtitle

```text
Anahtarlarınız, modelleriniz
```

### Promotional text

```text
Zaten ödediğiniz modellerle konuşun. API anahtarlarınızı ekleyin, kimin yanıtlayacağını tam olarak seçin ve dinleyin. Arada bize ait bir sunucu yok.
```

### Keywords

```text
yapay zekâ,ses,asistan,API,OpenAI,Anthropic,Claude,GPT,Gemini,sohbet,dikte,çevrimdışı
```

### Description

```text
Mr Broccoli, sağlayıcılarda zaten kendi hesabı olanlar için tasarlanmış sesli bir yapay zekâ uygulamasıdır. Anahtarlarınızı ekleyin, tam olarak hangi modelin yanıtlayacağını seçin ve yanıtı dinleyin. Hiçbir şey bize ait bir sunucudan geçmez, çünkü öyle bir sunucu yok.

SATIN ALMADAN ÖNCE
Mr Broccoli, OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter veya Alibaba Qwen'den aldığınız kendi API anahtarlarınız üzerine kuruludur. Satın aldığınızda uygulamayı kullanabilirsiniz. Yapay zekâ kullanımını içermez — tükettiğinizi sağlayıcınız doğrudan size faturalandırır.

YAZMAK YERİNE KONUŞUN
• Konuşun, yazın ya da bir görsel ekleyin
• Yanıtlar, ilk paragraf hazır olur olmaz sesli okunur
• Paragraf paragraf atlayın, duraklatın, sürdürün veya baştan başlatın
• Eller serbest turlar için Sürüş Oturumu: siz bitirene kadar bekler, geri sayar, gönderir, yanıtı seslendirir ve yeniden dinlemeye geçer
• Sistem, cihazdaki bir model veya sağlayıcınız üzerinden konuşma tanıma

KİM YANITLIYOR
• Dört rotaya kadar kaydedin — sağlayıcı, tam model ve akıl yürütme düzeyi
• Konuşmanın ortasında bağlamı kaybetmeden geçiş yapın
• Ana ekran, sırada kimin ve hangi düzeyde yanıtlayacağını söyler
• Her yanıt, kendisini gerçekten üreten rotayı ve varsa yedeğini kaydeder

HER SOHBETİ AYARLAYIN
• Uzunluk: kısa, normal veya kapsamlı
• Üslup: profesyonel, samimi, meraklı, öz, Sokratik veya ELI5
• Kendi model ve seslendirme yönergeleriniz
• Sohbet başına belirli bir ses
Genel varsayılanları belirleyin, sohbet bazında geçersiz kılın.

SOHBETLERİNİZ
• Cihazınızdaki yerel bir veritabanında tutulur
• Arayın, sabitleyin, arşivleyin, yeniden adlandırın, paylaşın veya silin
• Kesintisiz bir dökümde girdileri katlayın ve açın
• Herhangi bir mesajdan dallanarak özgününü kaybetmeden başka bir yön deneyin
• Belirli sohbetleri parola veya biyometriyle kilitleyin

DAHA FAZLASINI İSTEDİĞİNİZDE
• Web araması, kaynaklar yanıta iliştirilmiş halde
• Konsey: birkaç model yanıtlar, birbirini inceler, biri sentezler
• Uyumlu modellere görselli istekler
• Geçmiş sohbetlerinizden isteğe bağlı hatırlama, tamamen cihaz üzerinde

GİZLİLİK
• Mr Broccoli hesabı yok, Mr Broccoli sunucusu yok
• İstekler cihazınızdan doğrudan seçtiğiniz sağlayıcıya gider
• API anahtarları işletim sisteminin güvenli deposunda kalır — yedeklerde, günlüklerde veya dışa aktarımlarda asla yer almaz
• Bulut sağlayıcı, ona gönderdiğiniz isteği elbette alır

SİZİN KALAN
• Okunabilir JSON veya parola ifadesiyle şifrelenmiş (AES-256-GCM) tam yedekler
• Her yerde okunabilen ya da başka bir yapay zekâya verilebilen Markdown arşivleri
• İçe aktarma, hâlihazırda var olanın üzerine asla yazmaz

Sağdan sola yazılan Arapça ve Urduca dâhil 19 dil. Arayüz, dikte ve yanıt dili ayrı ayrı ayarlanır. Ekran okuyucu, büyük metin, kontrast ve azaltılmış hareket desteklenir.

YAPMADIKLARI
Bulut hesabı yok, cihazlar arası eşitleme yok, bizim barındırdığımız yapay zekâ yok, dâhil kredi yok, seçtiğiniz modelin veya sesin sessizce değiştirilmesi yok ve sizin adınıza özerk eylem yok. Yapay zekâ yanıtları tıbbi, hukuki veya finansal tavsiye değildir.

Abonelik yok. Hesap sistemi bulunmadığından, bir mağazadan yapılan satın alma diğerinde uygulamayı açmaz.
```

## Swedish (`sv`)

### Subtitle

```text
Dina nycklar, dina modeller
```

### Promotional text

```text
Prata med modellerna du redan betalar för. Lägg till dina API-nycklar, välj exakt vem som svarar och lyssna. Ingen server hos oss däremellan.
```

### Keywords

```text
AI,röst,assistent,API,OpenAI,Anthropic,Claude,GPT,Gemini,chatt,diktering,offline,privat
```

### Description

```text
Mr Broccoli är en röststyrd AI-app för dig som redan har egna konton hos leverantörerna. Lägg till dina nycklar, välj exakt vilken modell som svarar och lyssna på svaret. Ingenting går via någon server hos oss, för det finns ingen.

INNAN DU KÖPER
Mr Broccoli är byggd kring dina egna API-nycklar från OpenAI, Anthropic, Google Gemini, xAI, Mistral, DeepSeek, OpenRouter eller Alibaba Qwen. Köpet ger dig appen. Det ingår ingen AI-användning — din leverantör fakturerar dig direkt för det du förbrukar.

PRATA I STÄLLET FÖR ATT SKRIVA
• Tala, skriv eller bifoga en bild
• Svaren läses upp så snart första stycket är klart
• Hoppa stycke för stycke, pausa, återuppta eller börja om
• Körläge för handsfree-turer: väntar tills du talat färdigt, räknar ner, skickar, läser upp svaret och lyssnar igen
• Taligenkänning via systemet, en modell på enheten eller din leverantör

VEM SOM SVARAR
• Spara upp till fyra rutter — leverantör, exakt modell och resonemangsnivå
• Byt mitt i samtalet utan att tappa sammanhanget
• Startskärmen visar vem som svarar härnäst och på vilken nivå
• Varje svar registrerar rutten som faktiskt gav det, inklusive reservvägar

STÄLL IN VARJE SAMTAL
• Längd: kort, normal eller grundlig
• Ton: professionell, avslappnad, nördig, koncis, sokratisk eller ELI5
• Egna instruktioner för modell och uppläsning
• En bestämd röst per samtal
Sätt globala standardvärden och åsidosätt dem per samtal.

DINA SAMTAL
• Sparas i en lokal databas på din enhet
• Sök, fäst, arkivera, byt namn, dela eller radera
• Fäll ihop och ut poster i en löpande utskrift
• Förgrena från valfritt meddelande och pröva en annan riktning utan att förlora originalet
• Lås enskilda samtal med lösenord eller biometri

NÄR DU VILL HA MER
• Webbsökning, med källorna bifogade till svaret
• Råd: flera modeller svarar, granskar varandra och en sammanfattar
• Bildfrågor till kompatibla modeller
• Valfri återblick på tidigare samtal, helt på enheten

INTEGRITET
• Inget Mr Broccoli-konto och ingen Mr Broccoli-server
• Förfrågningar går direkt från din enhet till den leverantör du valt
• API-nycklar stannar i systemets säkra lagring — aldrig i säkerhetskopior, loggar eller export
• En hostad leverantör tar förstås emot förfrågan du skickar

DITT FÖRBLIR DITT
• Fullständiga säkerhetskopior som läsbar JSON eller lösenordskrypterade (AES-256-GCM)
• Markdown-arkiv att läsa var som helst eller lämna vidare till en annan AI
• En import skriver aldrig över det som redan finns

19 språk, med arabiska och urdu från höger till vänster. Språk för gränssnitt, diktering och svar ställs in var för sig. Stöd för skärmläsare, stor text, kontrast och reducerad rörelse.

VAD DEN INTE GÖR
Inget molnkonto, ingen synkning mellan enheter, ingen AI hostad av oss, inga inkluderade krediter, inga tysta byten av din modell eller röst och inga självständiga handlingar i ditt namn. AI-svar är inte medicinsk, juridisk eller ekonomisk rådgivning.

Ingen prenumeration. Eftersom det saknas kontosystem låser ett köp i en butik inte upp appen i den andra.
```

## Urdu (`ur-PK`)

### Subtitle

```text
آپ کی کلیدیں، آپ کے ماڈل
```

### Promotional text

```text
جن ماڈلز کے آپ پہلے ہی پیسے دے رہے ہیں، ان سے بول کر بات کریں۔ اپنی API کلیدیں شامل کریں، طے کریں کون جواب دے گا، اور سنیں۔ درمیان میں ہمارا کوئی سرور نہیں۔
```

### Keywords

```text
AI,آواز,معاون,API,OpenAI,Anthropic,Claude,GPT,Gemini,چیٹ,ڈکٹیشن,آف لائن,نجی
```

### Description

```text
Mr Broccoli ایک آواز پر مرکوز AI ایپ ہے، ان لوگوں کے لیے جن کے پاس پہلے ہی اپنے فراہم کنندہ اکاؤنٹس موجود ہیں۔ اپنی کلیدیں شامل کریں، بالکل وہی ماڈل چنیں جو جواب دے، اور جواب سنیں۔ کچھ بھی ہمارے سرور سے ہو کر نہیں گزرتا، کیونکہ ایسا کوئی سرور ہے ہی نہیں۔

خریدنے سے پہلے
Mr Broccoli آپ کی اپنی API کلیدوں کے گرد بنایا گیا ہے: OpenAI، Anthropic، Google Gemini، xAI، Mistral، DeepSeek، OpenRouter یا Alibaba Qwen۔ خریداری سے آپ کو ایپ ملتی ہے۔ اس میں AI کا استعمال شامل نہیں — جتنا آپ استعمال کریں گے، اس کا بل آپ کا فراہم کنندہ براہِ راست آپ کو بھیجے گا۔

لکھنے کے بجائے بولیں
• بولیں، لکھیں یا تصویر منسلک کریں
• پہلا پیراگراف تیار ہوتے ہی جواب پڑھ کر سنایا جاتا ہے
• پیراگراف کے حساب سے آگے پیچھے جائیں، روکیں، جاری رکھیں یا دوبارہ شروع کریں
• ہاتھ آزاد رکھ کر بات کرنے کے لیے ڈرائیو سیشن: آپ کے بولنے کے ختم ہونے کا انتظار کرتا ہے، گنتی کرتا ہے، بھیجتا ہے، جواب بولتا ہے اور پھر سننے لگتا ہے
• تقریر کی شناخت نظام سے، آلے پر موجود ماڈل سے یا آپ کے فراہم کنندہ سے

کون جواب دے گا
• چار راستے تک محفوظ کریں — فراہم کنندہ، عین ماڈل اور سوچ کی گہرائی
• گفتگو کے بیچ میں سیاق کھوئے بغیر بدلیں
• ہوم اسکرین بتاتی ہے کہ اگلا جواب کون اور کس گہرائی سے دے گا
• ہر جواب اُس راستے کو درج کرتا ہے جس نے اسے واقعی بنایا، بشمول متبادل

ہر گفتگو کو ترتیب دیں
• طوالت: مختصر، عام یا تفصیلی
• لہجہ: پیشہ ورانہ، بےتکلف، نرڈی، جامع، سقراطی یا ELI5
• ماڈل اور پڑھنے کے اپنے ہدایات
• ہر گفتگو کے لیے الگ آواز
عمومی اقدار مقرر کریں اور ہر گفتگو میں انہیں بدلیں۔

آپ کی گفتگوئیں
• آپ کے آلے پر مقامی ڈیٹابیس میں رہتی ہیں
• تلاش کریں، پن کریں، محفوظ کریں، نام بدلیں، شیئر کریں یا حذف کریں
• مسلسل ٹرانسکرپٹ میں اندراجات سمیٹیں اور کھولیں
• کسی بھی پیغام سے شاخ بنا کر دوسری سمت آزمائیں، اصل کھوئے بغیر
• انفرادی گفتگو کو پاس ورڈ یا بایومیٹرک سے مقفل کریں

جب مزید چاہیے
• ویب تلاش، ذرائع جواب کے ساتھ منسلک
• کونسل: کئی ماڈل جواب دیتے ہیں، ایک دوسرے کو پرکھتے ہیں، پھر ایک خلاصہ کرتا ہے
• ہم آہنگ ماڈلز کو تصویر کے ساتھ درخواستیں
• پرانی گفتگو سے اختیاری رجوع، مکمل طور پر آلے پر

رازداری
• نہ Mr Broccoli اکاؤنٹ، نہ Mr Broccoli سرور
• درخواستیں آپ کے آلے سے سیدھی آپ کے منتخب فراہم کنندہ کو جاتی ہیں
• API کلیدیں نظام کے محفوظ ذخیرے میں رہتی ہیں — بیک اپ، لاگز یا برآمدات میں کبھی نہیں
• میزبان فراہم کنندہ کو وہ درخواست بلاشبہ ملتی ہے جو آپ اسے بھیجتے ہیں

جو آپ کا رہتا ہے
• مکمل بیک اپ، پڑھنے کے قابل JSON یا پاس فریز سے مخفی (AES-256-GCM)
• Markdown آرکائیوز، کہیں بھی پڑھیں یا کسی دوسرے AI کو دے دیں
• درآمد پہلے سے موجود چیزوں کو کبھی نہیں مٹاتی

19 زبانیں، جن میں دائیں سے بائیں لکھی جانے والی عربی اور اردو شامل ہیں۔ انٹرفیس، ڈکٹیشن اور جواب کی زبان الگ الگ مقرر ہوتی ہے۔ اسکرین ریڈر، بڑا متن، کنٹراسٹ اور کم حرکت کی مکمل معاونت۔

یہ کیا نہیں کرتی
کوئی کلاؤڈ اکاؤنٹ نہیں، آلات کے درمیان ہم آہنگی نہیں، ہماری میزبانی والی AI نہیں، کوئی کریڈٹ شامل نہیں، آپ کے چنے ماڈل یا آواز کی خاموش تبدیلی نہیں، اور آپ کی طرف سے خودمختار کارروائی نہیں۔ AI کے جوابات طبی، قانونی یا مالی مشورہ نہیں ہیں۔

کوئی سبسکرپشن نہیں۔ چونکہ اکاؤنٹ کا نظام نہیں، اس لیے ایک اسٹور پر خریداری دوسرے اسٹور پر ایپ نہیں کھولتی۔
```
