import type { TranslationParams } from "./types";

const en = {
  aiSharingTitle: "AI sharing",
  aiSharingSettingsDescription:
    "Choose what each provider can receive. Your choices are saved on this device.",
  aiSharingNoProviders: "Providers appear here when you connect or use them.",
  aiSharingRequestTitle: "Share with AI providers?",
  aiSharingRequestDescription:
    "Choose what to share. I’ll remember your choices on this device. You can change them any time in AI sharing.",
  aiSharingDecline: "Don’t allow",
  aiSharingAsk: "Ask next time",
  aiSharingNotYetAllowed: "Not yet allowed",
  aiSharingAllowed: "Allowed",
  aiSharingBlocked: "Blocked",
  aiSharingChangeInSettings:
    "You can change your choices at any time in AI sharing.",
  aiSharingPrompt: "Chat messages",
  aiSharingPromptDetail:
    "Sends what you type or dictate and your chat instructions so the provider can answer.",
  aiSharingHistory: "Chat history",
  aiSharingHistoryDetail:
    "Lets the provider use messages and replies it has already seen in this chat, or a summary of them, as context for later replies.",
  aiSharingEarlierDetail:
    "Allow this provider to use earlier text from this chat as context for future replies. Images need separate permission.",
  aiSharingImages: "Images",
  aiSharingImagesDetail:
    "Sends the images included in a message so the provider can use them to answer.",
  aiSharingCouncil: "Council drafts",
  aiSharingCouncilDetail:
    "Council members receive your question and exchange draft answers. The final provider uses their findings to answer.",
  aiSharingTranscription: "Voice recordings",
  aiSharingTranscriptionDetail:
    "Sends your recording so the provider can turn your speech into text.",
  aiSharingSpeech: "Spoken replies",
  aiSharingSpeechDetail:
    "Sends the reply or preview text and any voice instructions so the provider can generate audio.",
  aiSharingSearch: "Web search",
  aiSharingSearchDetail:
    "Sends your question as a search query. A chat summary can be included if you allow history.",
  aiSharingTitleGeneration: "Chat titles",
  aiSharingTitleGenerationDetail:
    "For an automatic title, the provider receives your first message. When you request a title yourself, it can also use chat text you’ve shared with it.",
  aiSharingKnowledge: "Excerpts from other chats",
  aiSharingKnowledgeDetail:
    "Sends relevant passages from your other chats to help answer your question.",
  aiSharingCouncilMembers: ({ providers }: TranslationParams) =>
    `Drafts are shared with ${providers}.`,
  aiSharingCouncilFinal: ({ provider }: TranslationParams) =>
    `${provider} receives the Council’s findings to write the final answer.`,
  aiSharingPromptBlocked: ({ provider }: TranslationParams) =>
    `To send a message to ${provider}, allow chat messages in AI sharing.`,
  aiSharingOpenSettings: "Open AI sharing",
  aiSharingBoundaryNotice: ({ provider }: TranslationParams) =>
    `${provider} starts here. Earlier messages stay private from this provider.`,
  aiSharingShareEarlier: ({ provider }: TranslationParams) =>
    `Share earlier messages with ${provider}`,
  aiSharingRememberImages: ({ provider }: TranslationParams) =>
    `Always allow images I attach to be sent to ${provider}`,
  aiSharingSendOnce: "Send once",
  aiSharingContinue: "Allow and continue",
  aiSharingRequestedHistory: "Earlier messages in this chat",
  aiSharingRememberedScopes:
    "I’ll remember your choices on this device. Permission for images applies to this send unless you choose otherwise.",
  aiSharingPrivacyPolicy: "Privacy policy",
  aiSharingOpenRouterHost: ({ host }: TranslationParams) =>
    `OpenRouter forwards this request to ${host} to run the selected model.`,
  aiSharingScopeBlocked: ({ provider, scope }: TranslationParams) =>
    `Sharing with ${provider} is turned off for “${scope}”.`,
};

export const aiSharingTranslations = {
  en,
  de: {
    aiSharingTitle: "KI-Freigaben",
    aiSharingSettingsDescription:
      "Lege fest, was die einzelnen Anbieter erhalten dürfen. Deine Auswahl wird auf diesem Gerät gespeichert.",
    aiSharingNoProviders:
      "Hier erscheinen Anbieter, sobald du sie verbindest oder verwendest.",
    aiSharingRequestTitle: "Daten mit KI-Anbietern teilen?",
    aiSharingRequestDescription:
      "Wähle aus, was du teilen möchtest. Ich merke mir deine Auswahl auf diesem Gerät. Unter „KI-Freigaben“ kannst du sie jederzeit ändern.",
    aiSharingDecline: "Nicht erlauben",
    aiSharingAsk: "Beim nächsten Mal fragen",
    aiSharingNotYetAllowed: "Noch nicht freigegeben",
    aiSharingAllowed: "Erlaubt",
    aiSharingBlocked: "Gesperrt",
    aiSharingChangeInSettings:
      "Du kannst deine Auswahl jederzeit unter „KI-Freigaben“ ändern.",
    aiSharingPrompt: "Chatnachrichten",
    aiSharingPromptDetail:
      "Deine eingegebene oder diktierte Nachricht und deine Chat-Anweisungen gehen an den Anbieter, damit er antworten kann.",
    aiSharingHistory: "Chatverlauf",
    aiSharingHistoryDetail:
      "Der Anbieter darf Nachrichten und Antworten, die er in diesem Chat bereits kennt, oder eine Zusammenfassung davon für spätere Antworten verwenden.",
    aiSharingEarlierDetail:
      "Der Anbieter darf frühere Texte aus diesem Chat für künftige Antworten verwenden. Für Bilder braucht er eine eigene Freigabe.",
    aiSharingImages: "Bilder",
    aiSharingImagesDetail:
      "Der Anbieter erhält die Bilder in deiner Nachricht, damit er sie bei seiner Antwort berücksichtigen kann.",
    aiSharingCouncil: "Entwürfe des Councils",
    aiSharingCouncilDetail:
      "Die Mitglieder des Councils erhalten deine Frage und tauschen Antwortentwürfe aus. Aus ihren Ergebnissen erstellt der abschließende Anbieter die Antwort.",
    aiSharingTranscription: "Sprachaufnahmen",
    aiSharingTranscriptionDetail:
      "Der Anbieter erhält deine Aufnahme, um das Gesprochene in Text umzuwandeln.",
    aiSharingSpeech: "Gesprochene Antworten",
    aiSharingSpeechDetail:
      "Der Anbieter erhält den Antwort- oder Vorschautext und gegebenenfalls deine Sprechanweisungen, um daraus Audio zu erzeugen.",
    aiSharingSearch: "Websuche",
    aiSharingSearchDetail:
      "Deine Frage wird als Suchanfrage gesendet. Wenn du den Chatverlauf freigibst, kann eine Zusammenfassung mitgesendet werden.",
    aiSharingTitleGeneration: "Chattitel",
    aiSharingTitleGenerationDetail:
      "Für einen automatischen Titel erhält der Anbieter deine erste Nachricht. Wenn du selbst einen Titel anforderst, kann er auch bereits freigegebenen Chattext verwenden.",
    aiSharingKnowledge: "Auszüge aus anderen Chats",
    aiSharingKnowledgeDetail:
      "Passende Textstellen aus deinen anderen Chats helfen dem Anbieter, deine Frage zu beantworten.",
    aiSharingCouncilMembers: ({ providers }) =>
      `Die Antwortentwürfe gehen an ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} erhält die Ergebnisse des Councils und formuliert die endgültige Antwort.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `Gib unter „KI-Freigaben“ die Chatnachrichten für ${provider} frei, um eine Nachricht zu senden.`,
    aiSharingOpenSettings: "KI-Freigaben öffnen",
    aiSharingBoundaryNotice: ({ provider }) =>
      `Für ${provider} beginnt der Chat hier. Frühere Nachrichten bleiben vor diesem Anbieter verborgen.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Frühere Nachrichten mit ${provider} teilen`,
    aiSharingRememberImages: ({ provider }) =>
      `Angehängte Bilder immer für ${provider} freigeben`,
    aiSharingSendOnce: "Einmal senden",
    aiSharingContinue: "Erlauben und fortfahren",
    aiSharingRequestedHistory: "Frühere Nachrichten in diesem Chat",
    aiSharingRememberedScopes:
      "Ich merke mir deine Auswahl auf diesem Gerät. Die Freigabe für Bilder gilt nur für dieses Senden, sofern du nichts anderes auswählst.",
    aiSharingPrivacyPolicy: "Datenschutzerklärung",
    aiSharingOpenRouterHost: ({ host }) =>
      `OpenRouter leitet diese Anfrage an ${host} weiter, wo das gewählte Modell ausgeführt wird.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `Für ${provider} ist die Freigabe „${scope}“ gesperrt.`,
  },
  uk: {
    aiSharingTitle: "Доступ для ШІ",
    aiSharingSettingsDescription:
      "Обери, що може отримувати кожен провайдер. Твій вибір зберігається на цьому пристрої.",
    aiSharingNoProviders:
      "Тут з’являться провайдери, які ти під’єднаєш або використаєш.",
    aiSharingRequestTitle: "Поділитися даними з провайдерами ШІ?",
    aiSharingRequestDescription:
      "Обери, чим хочеш поділитися. Я запам’ятаю твій вибір на цьому пристрої. Його можна будь-коли змінити в розділі «Доступ для ШІ».",
    aiSharingDecline: "Не дозволяти",
    aiSharingAsk: "Запитати наступного разу",
    aiSharingNotYetAllowed: "Ще не дозволено",
    aiSharingAllowed: "Дозволено",
    aiSharingBlocked: "Заблоковано",
    aiSharingChangeInSettings:
      "Ти можеш будь-коли змінити свій вибір у розділі «Доступ для ШІ».",
    aiSharingPrompt: "Повідомлення чату",
    aiSharingPromptDetail:
      "Провайдер отримає твоє введене або продиктоване повідомлення та інструкції для чату, щоб дати відповідь.",
    aiSharingHistory: "Історія чату",
    aiSharingHistoryDetail:
      "Провайдер зможе враховувати в наступних відповідях уже відомі йому повідомлення й відповіді з цього чату або їхній підсумок.",
    aiSharingEarlierDetail:
      "Дозволь цьому провайдеру використовувати попередній текст цього чату для майбутніх відповідей. Для зображень потрібен окремий дозвіл.",
    aiSharingImages: "Зображення",
    aiSharingImagesDetail:
      "Провайдер отримає зображення з повідомлення, щоб врахувати їх у відповіді.",
    aiSharingCouncil: "Чернетки Ради",
    aiSharingCouncilDetail:
      "Учасники Ради отримають твоє запитання й обміняються чернетками відповідей. На основі їхніх висновків обраний провайдер підготує остаточну відповідь.",
    aiSharingTranscription: "Голосові записи",
    aiSharingTranscriptionDetail:
      "Провайдер отримає запис твого голосу, щоб перетворити мовлення на текст.",
    aiSharingSpeech: "Озвучення відповідей",
    aiSharingSpeechDetail:
      "Провайдер отримає текст відповіді або зразка голосу та вказівки щодо озвучення, якщо вони є, щоб створити аудіо.",
    aiSharingSearch: "Пошук в інтернеті",
    aiSharingSearchDetail:
      "Твоє запитання буде надіслано як пошуковий запит. Якщо ти відкриєш доступ до історії, можна буде додати підсумок чату.",
    aiSharingTitleGeneration: "Назви чатів",
    aiSharingTitleGenerationDetail:
      "Для автоматичної назви провайдер отримає твоє перше повідомлення. Якщо ти самостійно запитаєш назву, він також зможе використати текст чату, яким ти з ним поділився.",
    aiSharingKnowledge: "Уривки з інших чатів",
    aiSharingKnowledgeDetail:
      "Провайдер отримає доречні уривки з інших твоїх чатів, щоб відповісти на запитання.",
    aiSharingCouncilMembers: ({ providers }) =>
      `Одержувачі чернеток — ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} отримає висновки Ради й підготує остаточну відповідь.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `Щоб надіслати повідомлення до ${provider}, дозволь доступ до повідомлень у розділі «Доступ для ШІ».`,
    aiSharingOpenSettings: "Відкрити доступ для ШІ",
    aiSharingBoundaryNotice: ({ provider }) =>
      `Для ${provider} чат починається тут. Попередні повідомлення приховані від цього провайдера.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Поділитися попередніми повідомленнями з ${provider}`,
    aiSharingRememberImages: ({ provider }) =>
      `Завжди дозволяти надсилання прикріплених зображень до ${provider}`,
    aiSharingSendOnce: "Надіслати один раз",
    aiSharingContinue: "Дозволити й продовжити",
    aiSharingRequestedHistory: "Попередні повідомлення цього чату",
    aiSharingRememberedScopes:
      "Я запам’ятаю твій вибір на цьому пристрої. Дозвіл на зображення діє лише цього разу, якщо ти не вибереш інше.",
    aiSharingPrivacyPolicy: "Політика конфіденційності",
    aiSharingOpenRouterHost: ({ host }) =>
      `OpenRouter пересилає цей запит до ${host} для запуску вибраної моделі.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `Для ${provider} вимкнено доступ до категорії «${scope}».`,
  },
  hi: {
    aiSharingTitle: "एआई के साथ साझाकरण",
    aiSharingSettingsDescription:
      "चुनें कि किस प्रदाता को क्या भेजा जा सकता है। आपकी पसंद इसी डिवाइस पर सहेजी जाती है।",
    aiSharingNoProviders:
      "आप जिन प्रदाताओं को जोड़ते हैं या इस्तेमाल करते हैं, वे यहाँ दिखाई देंगे।",
    aiSharingRequestTitle: "एआई प्रदाताओं के साथ डेटा साझा करें?",
    aiSharingRequestDescription:
      "चुनें कि आप क्या साझा करना चाहते हैं। मैं आपकी पसंद इस डिवाइस पर याद रखूँगा। आप इसे कभी भी “एआई के साथ साझाकरण” में बदल सकते हैं।",
    aiSharingDecline: "अनुमति न दें",
    aiSharingAsk: "अगली बार पूछें",
    aiSharingNotYetAllowed: "अभी अनुमति नहीं दी गई",
    aiSharingAllowed: "अनुमति है",
    aiSharingBlocked: "अनुमति नहीं है",
    aiSharingChangeInSettings:
      "आप कभी भी «एआई के साथ साझाकरण» में अपनी पसंद बदल सकते हैं।",
    aiSharingPrompt: "चैट संदेश",
    aiSharingPromptDetail:
      "प्रदाता को आपका लिखा या बोलकर दर्ज किया गया संदेश और चैट के निर्देश भेजे जाते हैं ताकि वह जवाब दे सके।",
    aiSharingHistory: "चैट का इतिहास",
    aiSharingHistoryDetail:
      "प्रदाता आगे जवाब देते समय इस चैट के वे संदेश और जवाब इस्तेमाल कर सकता है जो वह पहले देख चुका है, या उनका सारांश।",
    aiSharingEarlierDetail:
      "इस प्रदाता को आगे जवाब देते समय इस चैट के पिछले संदेशों का टेक्स्ट इस्तेमाल करने दें। चित्रों के लिए अलग अनुमति चाहिए।",
    aiSharingImages: "चित्र",
    aiSharingImagesDetail:
      "प्रदाता को संदेश में शामिल चित्र भेजे जाते हैं ताकि वह उन्हें देखकर जवाब दे सके।",
    aiSharingCouncil: "परिषद के मसौदे",
    aiSharingCouncilDetail:
      "परिषद के सदस्यों को आपका सवाल मिलता है और वे जवाबों के मसौदे आपस में साझा करते हैं। अंतिम जवाब देने वाला प्रदाता उनके निष्कर्षों का इस्तेमाल करता है।",
    aiSharingTranscription: "आवाज़ की रिकॉर्डिंग",
    aiSharingTranscriptionDetail:
      "प्रदाता को आपकी रिकॉर्डिंग भेजी जाती है ताकि वह आपकी बात को टेक्स्ट में बदल सके।",
    aiSharingSpeech: "जवाब पढ़कर सुनाना",
    aiSharingSpeechDetail:
      "ऑडियो बनाने के लिए प्रदाता को जवाब या आवाज़ के नमूने का टेक्स्ट और आवाज़ से जुड़े आपके निर्देश, यदि कोई हों, भेजे जाते हैं।",
    aiSharingSearch: "वेब खोज",
    aiSharingSearchDetail:
      "आपका सवाल खोज के लिए भेजा जाता है। इतिहास साझा करने की अनुमति देने पर चैट का सारांश भी भेजा जा सकता है।",
    aiSharingTitleGeneration: "चैट के शीर्षक",
    aiSharingTitleGenerationDetail:
      "अपने आप शीर्षक बनाने के लिए प्रदाता को आपका पहला संदेश मिलता है। अगर आप खुद शीर्षक माँगते हैं, तो वह चैट का वह टेक्स्ट भी इस्तेमाल कर सकता है जिसे आपने उसके साथ साझा किया है।",
    aiSharingKnowledge: "अन्य चैट के अंश",
    aiSharingKnowledgeDetail:
      "प्रदाता को आपकी दूसरी चैट के प्रासंगिक अंश भेजे जाते हैं ताकि वह आपके सवाल का जवाब दे सके।",
    aiSharingCouncilMembers: ({ providers }) =>
      `मसौदे इन प्रदाताओं के साथ साझा किए जाते हैं: ${providers}।`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} को परिषद के निष्कर्ष भेजे जाते हैं ताकि वह अंतिम जवाब लिख सके।`,
    aiSharingPromptBlocked: ({ provider }) =>
      `${provider} को संदेश भेजने के लिए «एआई के साथ साझाकरण» में चैट संदेशों की अनुमति दें।`,
    aiSharingOpenSettings: "एआई साझाकरण खोलें",
    aiSharingBoundaryNotice: ({ provider }) =>
      `${provider} के लिए चैट यहीं से शुरू होती है। इस प्रदाता को पिछले संदेश नहीं दिखेंगे।`,
    aiSharingShareEarlier: ({ provider }) =>
      `${provider} के साथ पिछले संदेश साझा करें`,
    aiSharingRememberImages: ({ provider }) =>
      `मेरे जोड़े गए चित्र ${provider} को भेजने की हमेशा अनुमति दें`,
    aiSharingSendOnce: "एक बार भेजें",
    aiSharingContinue: "अनुमति दें और आगे बढ़ें",
    aiSharingRequestedHistory: "इस चैट के पिछले संदेश",
    aiSharingRememberedScopes:
      "मैं आपकी पसंद इस डिवाइस पर याद रखूँगा। जब तक आप कोई और विकल्प न चुनें, चित्र भेजने की अनुमति केवल इस बार के लिए होगी।",
    aiSharingPrivacyPolicy: "गोपनीयता नीति",
    aiSharingOpenRouterHost: ({ host }) =>
      `चुने गए मॉडल को चलाने के लिए OpenRouter यह अनुरोध ${host} को भेजता है।`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `${provider} के लिए “${scope}” साझा करने की अनुमति बंद है।`,
  },
  es: {
    aiSharingTitle: "Datos compartidos con la IA",
    aiSharingSettingsDescription:
      "Elige qué puede recibir cada proveedor. Tus preferencias se guardan en este dispositivo.",
    aiSharingNoProviders:
      "Los proveedores aparecerán aquí cuando los conectes o los uses.",
    aiSharingRequestTitle: "¿Compartir datos con proveedores de IA?",
    aiSharingRequestDescription:
      "Elige qué compartir. Recordaré tus preferencias en este dispositivo. Puedes cambiarlas en cualquier momento en «Datos compartidos con la IA».",
    aiSharingDecline: "No permitir",
    aiSharingAsk: "Preguntar la próxima vez",
    aiSharingNotYetAllowed: "Aún sin permiso",
    aiSharingAllowed: "Permitido",
    aiSharingBlocked: "Bloqueado",
    aiSharingChangeInSettings:
      "Puedes cambiar tus preferencias en cualquier momento en «Datos compartidos con la IA».",
    aiSharingPrompt: "Mensajes del chat",
    aiSharingPromptDetail:
      "Se envían tu mensaje escrito o dictado y tus instrucciones del chat para que el proveedor pueda responder.",
    aiSharingHistory: "Historial del chat",
    aiSharingHistoryDetail:
      "Permite al proveedor usar como contexto para futuras respuestas los mensajes y las respuestas que ya ha visto en este chat, o un resumen de ellos.",
    aiSharingEarlierDetail:
      "Permite al proveedor usar el texto anterior de este chat como contexto para futuras respuestas. Las imágenes requieren un permiso aparte.",
    aiSharingImages: "Imágenes",
    aiSharingImagesDetail:
      "El proveedor recibe las imágenes incluidas en el mensaje para tenerlas en cuenta al responder.",
    aiSharingCouncil: "Borradores del Consejo",
    aiSharingCouncilDetail:
      "Los miembros del Consejo reciben tu pregunta e intercambian borradores. El proveedor que redacta la respuesta final utiliza sus conclusiones.",
    aiSharingTranscription: "Grabaciones de voz",
    aiSharingTranscriptionDetail:
      "Se envía tu grabación para que el proveedor transcriba tus palabras.",
    aiSharingSpeech: "Respuestas en voz alta",
    aiSharingSpeechDetail:
      "El proveedor recibe el texto de la respuesta o de la muestra de voz y las instrucciones de voz que hayas indicado para generar el audio.",
    aiSharingSearch: "Búsqueda web",
    aiSharingSearchDetail:
      "Tu pregunta se envía como consulta de búsqueda. Si permites compartir el historial, se puede incluir un resumen del chat.",
    aiSharingTitleGeneration: "Títulos de chats",
    aiSharingTitleGenerationDetail:
      "Para generar un título automático, el proveedor recibe tu primer mensaje. Si tú pides un título, también puede usar el texto del chat que hayas compartido con él.",
    aiSharingKnowledge: "Fragmentos de otros chats",
    aiSharingKnowledgeDetail:
      "Se envían fragmentos relevantes de tus otros chats para ayudar al proveedor a responder a tu pregunta.",
    aiSharingCouncilMembers: ({ providers }) =>
      `Los borradores se comparten con ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} recibe las conclusiones del Consejo para redactar la respuesta final.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `Para enviar un mensaje a ${provider}, permite compartir los mensajes en «Datos compartidos con la IA».`,
    aiSharingOpenSettings: "Abrir datos compartidos con la IA",
    aiSharingBoundaryNotice: ({ provider }) =>
      `Para ${provider}, el chat empieza aquí. Los mensajes anteriores quedan ocultos para este proveedor.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Compartir mensajes anteriores con ${provider}`,
    aiSharingRememberImages: ({ provider }) =>
      `Permitir siempre que se envíen a ${provider} las imágenes que adjunte`,
    aiSharingSendOnce: "Enviar una vez",
    aiSharingContinue: "Permitir y continuar",
    aiSharingRequestedHistory: "Mensajes anteriores de este chat",
    aiSharingRememberedScopes:
      "Recordaré tus preferencias en este dispositivo. El permiso para las imágenes solo se aplica a este envío, salvo que elijas otra opción.",
    aiSharingPrivacyPolicy: "Política de privacidad",
    aiSharingOpenRouterHost: ({ host }) =>
      `OpenRouter reenvía esta solicitud a ${host} para ejecutar el modelo seleccionado.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `El permiso de ${provider} para «${scope}» está desactivado.`,
  },
  fr: {
    aiSharingTitle: "Partage avec l’IA",
    aiSharingSettingsDescription:
      "Choisis ce que chaque fournisseur peut recevoir. Tes choix sont enregistrés sur cet appareil.",
    aiSharingNoProviders:
      "Les fournisseurs apparaissent ici dès que tu les connectes ou les utilises.",
    aiSharingRequestTitle: "Partager des données avec des fournisseurs d’IA ?",
    aiSharingRequestDescription:
      "Choisis ce que tu veux partager. Je mémoriserai tes choix sur cet appareil. Tu pourras les modifier à tout moment dans « Partage avec l’IA ».",
    aiSharingDecline: "Ne pas autoriser",
    aiSharingAsk: "Demander la prochaine fois",
    aiSharingNotYetAllowed: "Pas encore autorisé",
    aiSharingAllowed: "Autorisé",
    aiSharingBlocked: "Bloqué",
    aiSharingChangeInSettings:
      "Tu peux modifier tes choix à tout moment dans « Partage avec l’IA ».",
    aiSharingPrompt: "Messages de la discussion",
    aiSharingPromptDetail:
      "Le fournisseur reçoit ton message écrit ou dicté et tes consignes pour cette discussion afin de pouvoir te répondre.",
    aiSharingHistory: "Historique de la discussion",
    aiSharingHistoryDetail:
      "Le fournisseur peut s’appuyer sur les messages et réponses qu’il a déjà vus dans cette discussion, ou sur leur résumé, pour ses prochaines réponses.",
    aiSharingEarlierDetail:
      "Autorise ce fournisseur à utiliser le texte antérieur de cette discussion pour ses prochaines réponses. Les images nécessitent une autorisation distincte.",
    aiSharingImages: "Images",
    aiSharingImagesDetail:
      "Le fournisseur reçoit les images incluses dans le message pour en tenir compte dans sa réponse.",
    aiSharingCouncil: "Brouillons du Conseil",
    aiSharingCouncilDetail:
      "Les membres du Conseil reçoivent ta question et échangent leurs brouillons. Le fournisseur chargé de la réponse finale s’appuie sur leurs conclusions.",
    aiSharingTranscription: "Enregistrements vocaux",
    aiSharingTranscriptionDetail:
      "Le fournisseur reçoit ton enregistrement pour transcrire tes paroles.",
    aiSharingSpeech: "Lecture à voix haute",
    aiSharingSpeechDetail:
      "Le fournisseur reçoit le texte de la réponse ou de l’aperçu vocal et tes éventuelles consignes de lecture pour produire l’audio.",
    aiSharingSearch: "Recherche en ligne",
    aiSharingSearchDetail:
      "Ta question est envoyée comme requête de recherche. Si tu autorises le partage de l’historique, un résumé de la discussion peut y être joint.",
    aiSharingTitleGeneration: "Titres des discussions",
    aiSharingTitleGenerationDetail:
      "Pour proposer un titre automatique, le fournisseur reçoit ton premier message. Si tu demandes toi-même un titre, il peut aussi utiliser le texte de la discussion que tu as partagé avec lui.",
    aiSharingKnowledge: "Extraits d’autres discussions",
    aiSharingKnowledgeDetail:
      "Le fournisseur reçoit des passages pertinents de tes autres discussions pour répondre à ta question.",
    aiSharingCouncilMembers: ({ providers }) =>
      `Les brouillons sont partagés avec ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} reçoit les conclusions du Conseil pour rédiger la réponse finale.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `Pour envoyer un message à ${provider}, autorise le partage des messages dans « Partage avec l’IA ».`,
    aiSharingOpenSettings: "Ouvrir le partage avec l’IA",
    aiSharingBoundaryNotice: ({ provider }) =>
      `Pour ${provider}, la discussion commence ici. Ce fournisseur ne voit pas les messages précédents.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Partager les messages précédents avec ${provider}`,
    aiSharingRememberImages: ({ provider }) =>
      `Toujours autoriser l’envoi des images que je joins à ${provider}`,
    aiSharingSendOnce: "Envoyer une fois",
    aiSharingContinue: "Autoriser et continuer",
    aiSharingRequestedHistory: "Messages précédents de cette discussion",
    aiSharingRememberedScopes:
      "Je mémoriserai tes choix sur cet appareil. Sauf indication contraire de ta part, l’autorisation pour les images vaut uniquement pour cet envoi.",
    aiSharingPrivacyPolicy: "Politique de confidentialité",
    aiSharingOpenRouterHost: ({ host }) =>
      `OpenRouter transmet cette demande à ${host} pour exécuter le modèle choisi.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `Le partage avec ${provider} est désactivé pour « ${scope} ».`,
  },
  it: {
    aiSharingTitle: "Condivisione con l’IA",
    aiSharingSettingsDescription:
      "Scegli cosa può ricevere ogni fornitore. Le tue preferenze vengono salvate su questo dispositivo.",
    aiSharingNoProviders:
      "I fornitori compaiono qui quando li colleghi o li usi.",
    aiSharingRequestTitle: "Condividere i dati con i fornitori di IA?",
    aiSharingRequestDescription:
      "Scegli cosa condividere. Ricorderò le tue scelte su questo dispositivo. Puoi cambiarle in qualsiasi momento in «Condivisione con l’IA».",
    aiSharingDecline: "Non consentire",
    aiSharingAsk: "Chiedi la prossima volta",
    aiSharingNotYetAllowed: "Non ancora autorizzato",
    aiSharingAllowed: "Consentito",
    aiSharingBlocked: "Bloccato",
    aiSharingChangeInSettings:
      "Puoi modificare le tue scelte in qualsiasi momento in «Condivisione con l’IA».",
    aiSharingPrompt: "Messaggi della chat",
    aiSharingPromptDetail:
      "Il fornitore riceve il messaggio scritto o dettato e le istruzioni della chat per poterti rispondere.",
    aiSharingHistory: "Cronologia della chat",
    aiSharingHistoryDetail:
      "Il fornitore può usare come contesto per le prossime risposte i messaggi e le risposte che ha già visto in questa chat o un loro riepilogo.",
    aiSharingEarlierDetail:
      "Consenti a questo fornitore di usare il testo precedente di questa chat come contesto per le prossime risposte. Per le immagini serve un’autorizzazione separata.",
    aiSharingImages: "Immagini",
    aiSharingImagesDetail:
      "Il fornitore riceve le immagini incluse nel messaggio per tenerne conto nella risposta.",
    aiSharingCouncil: "Bozze del Consiglio",
    aiSharingCouncilDetail:
      "I membri del Consiglio ricevono la tua domanda e si scambiano bozze di risposta. Il fornitore incaricato della risposta finale usa le loro conclusioni.",
    aiSharingTranscription: "Registrazioni vocali",
    aiSharingTranscriptionDetail:
      "Il fornitore riceve la tua registrazione per trascrivere ciò che hai detto.",
    aiSharingSpeech: "Lettura ad alta voce",
    aiSharingSpeechDetail:
      "Il fornitore riceve il testo della risposta o dell’anteprima vocale e le eventuali istruzioni sulla voce per generare l’audio.",
    aiSharingSearch: "Ricerca sul web",
    aiSharingSearchDetail:
      "La tua domanda viene inviata come ricerca. Se consenti di condividere la cronologia, si può includere un riepilogo della chat.",
    aiSharingTitleGeneration: "Titoli delle chat",
    aiSharingTitleGenerationDetail:
      "Per un titolo automatico, il fornitore riceve il tuo primo messaggio. Se richiedi tu un titolo, può usare anche il testo della chat che hai condiviso con lui.",
    aiSharingKnowledge: "Estratti da altre chat",
    aiSharingKnowledgeDetail:
      "Il fornitore riceve passaggi pertinenti delle tue altre chat per rispondere alla tua domanda.",
    aiSharingCouncilMembers: ({ providers }) =>
      `Le bozze vengono condivise con ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} riceve le conclusioni del Consiglio per scrivere la risposta finale.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `Per inviare un messaggio a ${provider}, autorizza i messaggi della chat in «Condivisione con l’IA».`,
    aiSharingOpenSettings: "Apri la condivisione con l’IA",
    aiSharingBoundaryNotice: ({ provider }) =>
      `Per ${provider} la chat inizia qui. Questo fornitore non vede i messaggi precedenti.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Condividi i messaggi precedenti con ${provider}`,
    aiSharingRememberImages: ({ provider }) =>
      `Consenti sempre di inviare a ${provider} le immagini che allego`,
    aiSharingSendOnce: "Invia una volta",
    aiSharingContinue: "Consenti e continua",
    aiSharingRequestedHistory: "Messaggi precedenti di questa chat",
    aiSharingRememberedScopes:
      "Ricorderò le tue scelte su questo dispositivo. Salvo una tua diversa scelta, il permesso per le immagini vale solo per questo invio.",
    aiSharingPrivacyPolicy: "Informativa sulla privacy",
    aiSharingOpenRouterHost: ({ host }) =>
      `OpenRouter inoltra questa richiesta a ${host} per eseguire il modello selezionato.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `La condivisione con ${provider} è disattivata per «${scope}».`,
  },
  pt: {
    aiSharingTitle: "Partilha com IA",
    aiSharingSettingsDescription:
      "Escolhe o que cada fornecedor pode receber. As tuas escolhas ficam guardadas neste dispositivo.",
    aiSharingNoProviders:
      "Os fornecedores aparecem aqui quando os ligares ou utilizares.",
    aiSharingRequestTitle: "Partilhar dados com fornecedores de IA?",
    aiSharingRequestDescription:
      "Escolhe o que queres partilhar. Vou guardar as tuas escolhas neste dispositivo. Podes alterá-las a qualquer momento em «Partilha com IA».",
    aiSharingDecline: "Não permitir",
    aiSharingAsk: "Perguntar da próxima vez",
    aiSharingNotYetAllowed: "Ainda sem permissão",
    aiSharingAllowed: "Permitido",
    aiSharingBlocked: "Bloqueado",
    aiSharingChangeInSettings:
      "Podes alterar as tuas escolhas a qualquer momento em «Partilha com IA».",
    aiSharingPrompt: "Mensagens da conversa",
    aiSharingPromptDetail:
      "O fornecedor recebe a mensagem que escreveste ou ditaste e as instruções da conversa para te poder responder.",
    aiSharingHistory: "Histórico da conversa",
    aiSharingHistoryDetail:
      "Permite ao fornecedor usar nas próximas respostas as mensagens e respostas que já viu nesta conversa, ou um resumo delas, como contexto.",
    aiSharingEarlierDetail:
      "Permite a este fornecedor usar o texto anterior desta conversa como contexto para respostas futuras. As imagens precisam de uma autorização separada.",
    aiSharingImages: "Imagens",
    aiSharingImagesDetail:
      "O fornecedor recebe as imagens incluídas na mensagem para as ter em conta na resposta.",
    aiSharingCouncil: "Rascunhos do Conselho",
    aiSharingCouncilDetail:
      "Os membros do Conselho recebem a tua pergunta e partilham entre si rascunhos de respostas. O fornecedor que escreve a resposta final usa as conclusões do grupo.",
    aiSharingTranscription: "Gravações de voz",
    aiSharingTranscriptionDetail:
      "O fornecedor recebe a tua gravação para transcrever o que disseste.",
    aiSharingSpeech: "Leitura em voz alta",
    aiSharingSpeechDetail:
      "O fornecedor recebe o texto da resposta ou da amostra de voz e as tuas eventuais instruções de voz para gerar o áudio.",
    aiSharingSearch: "Pesquisa na Web",
    aiSharingSearchDetail:
      "A tua pergunta é enviada como pesquisa. Se permitires partilhar o histórico, pode ser incluído um resumo da conversa.",
    aiSharingTitleGeneration: "Títulos das conversas",
    aiSharingTitleGenerationDetail:
      "Para sugerir um título automático, o fornecedor recebe a tua primeira mensagem. Se pedires um título manualmente, também pode usar o texto da conversa que partilhaste com ele.",
    aiSharingKnowledge: "Excertos de outras conversas",
    aiSharingKnowledgeDetail:
      "O fornecedor recebe excertos relevantes das tuas outras conversas para responder à tua pergunta.",
    aiSharingCouncilMembers: ({ providers }) =>
      `Os rascunhos são partilhados com ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} recebe as conclusões do Conselho para escrever a resposta final.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `Para enviares uma mensagem a ${provider}, permite partilhar mensagens em «Partilha com IA».`,
    aiSharingOpenSettings: "Abrir a partilha com IA",
    aiSharingBoundaryNotice: ({ provider }) =>
      `Para ${provider}, a conversa começa aqui. As mensagens anteriores ficam ocultas a este fornecedor.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Partilhar mensagens anteriores com ${provider}`,
    aiSharingRememberImages: ({ provider }) =>
      `Permitir sempre o envio das imagens que anexo a ${provider}`,
    aiSharingSendOnce: "Enviar uma vez",
    aiSharingContinue: "Permitir e continuar",
    aiSharingRequestedHistory: "Mensagens anteriores desta conversa",
    aiSharingRememberedScopes:
      "Vou guardar as tuas escolhas neste dispositivo. A permissão para as imagens vale apenas para este envio, salvo se escolheres outra opção.",
    aiSharingPrivacyPolicy: "Política de privacidade",
    aiSharingOpenRouterHost: ({ host }) =>
      `O OpenRouter encaminha este pedido para ${host} para executar o modelo selecionado.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `A partilha com ${provider} está desativada para «${scope}».`,
  },
  ptBR: {
    aiSharingTitle: "Compartilhamento com IA",
    aiSharingSettingsDescription:
      "Escolha o que cada provedor pode receber. Suas escolhas ficam salvas neste dispositivo.",
    aiSharingNoProviders:
      "Os provedores aparecem aqui quando você os conecta ou usa.",
    aiSharingRequestTitle: "Compartilhar dados com provedores de IA?",
    aiSharingRequestDescription:
      "Escolha o que quer compartilhar. Vou lembrar suas escolhas neste dispositivo. Você pode mudá-las a qualquer momento em “Compartilhamento com IA”.",
    aiSharingDecline: "Não permitir",
    aiSharingAsk: "Perguntar na próxima vez",
    aiSharingNotYetAllowed: "Ainda sem permissão",
    aiSharingAllowed: "Permitido",
    aiSharingBlocked: "Bloqueado",
    aiSharingChangeInSettings:
      "Você pode mudar suas escolhas a qualquer momento em “Compartilhamento com IA”.",
    aiSharingPrompt: "Mensagens da conversa",
    aiSharingPromptDetail:
      "O provedor recebe a mensagem que você escreveu ou ditou e as instruções da conversa para poder responder.",
    aiSharingHistory: "Histórico da conversa",
    aiSharingHistoryDetail:
      "Permite ao provedor usar como contexto para as próximas respostas as mensagens e respostas que ele já viu nesta conversa ou um resumo delas.",
    aiSharingEarlierDetail:
      "Permita que este provedor use o texto anterior desta conversa como contexto para as próximas respostas. As imagens precisam de uma permissão separada.",
    aiSharingImages: "Imagens",
    aiSharingImagesDetail:
      "O provedor recebe as imagens incluídas na mensagem para levá-las em conta na resposta.",
    aiSharingCouncil: "Rascunhos do Conselho",
    aiSharingCouncilDetail:
      "Os membros do Conselho recebem sua pergunta e trocam rascunhos de respostas. O provedor responsável pela resposta final usa as conclusões do grupo.",
    aiSharingTranscription: "Gravações de voz",
    aiSharingTranscriptionDetail:
      "O provedor recebe sua gravação para transcrever o que você disse.",
    aiSharingSpeech: "Leitura em voz alta",
    aiSharingSpeechDetail:
      "O provedor recebe o texto da resposta ou da prévia de voz e as instruções de voz que você tiver definido para gerar o áudio.",
    aiSharingSearch: "Pesquisa na web",
    aiSharingSearchDetail:
      "Sua pergunta é enviada como pesquisa. Se você permitir o compartilhamento do histórico, um resumo da conversa pode ser incluído.",
    aiSharingTitleGeneration: "Títulos das conversas",
    aiSharingTitleGenerationDetail:
      "Para sugerir um título automático, o provedor recebe sua primeira mensagem. Se você pedir um título, ele também poderá usar o texto da conversa que você compartilhou com ele.",
    aiSharingKnowledge: "Trechos de outras conversas",
    aiSharingKnowledgeDetail:
      "O provedor recebe trechos relevantes das suas outras conversas para responder à sua pergunta.",
    aiSharingCouncilMembers: ({ providers }) =>
      `Os rascunhos são compartilhados com ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} recebe as conclusões do Conselho para escrever a resposta final.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `Para enviar uma mensagem a ${provider}, permita o compartilhamento de mensagens em “Compartilhamento com IA”.`,
    aiSharingOpenSettings: "Abrir o compartilhamento com IA",
    aiSharingBoundaryNotice: ({ provider }) =>
      `Para ${provider}, a conversa começa aqui. As mensagens anteriores ficam ocultas para esse provedor.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Compartilhar mensagens anteriores com ${provider}`,
    aiSharingRememberImages: ({ provider }) =>
      `Sempre permitir que as imagens que eu anexar sejam enviadas a ${provider}`,
    aiSharingSendOnce: "Enviar uma vez",
    aiSharingContinue: "Permitir e continuar",
    aiSharingRequestedHistory: "Mensagens anteriores desta conversa",
    aiSharingRememberedScopes:
      "Vou lembrar suas escolhas neste dispositivo. A permissão para as imagens vale apenas para este envio, a menos que você escolha outra opção.",
    aiSharingPrivacyPolicy: "Política de privacidade",
    aiSharingOpenRouterHost: ({ host }) =>
      `O OpenRouter encaminha esta solicitação a ${host} para executar o modelo selecionado.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `O compartilhamento com ${provider} está desativado para “${scope}”.`,
  },
  ru: {
    aiSharingTitle: "Доступ для ИИ",
    aiSharingSettingsDescription:
      "Выбери, что может получать каждый провайдер. Твой выбор сохраняется на этом устройстве.",
    aiSharingNoProviders:
      "Здесь появятся провайдеры, которые ты подключишь или используешь.",
    aiSharingRequestTitle: "Поделиться данными с провайдерами ИИ?",
    aiSharingRequestDescription:
      "Выбери, чем хочешь поделиться. Я запомню твой выбор на этом устройстве. Его можно в любой момент изменить в разделе «Доступ для ИИ».",
    aiSharingDecline: "Не разрешать",
    aiSharingAsk: "Спросить в следующий раз",
    aiSharingNotYetAllowed: "Пока не разрешено",
    aiSharingAllowed: "Разрешено",
    aiSharingBlocked: "Заблокировано",
    aiSharingChangeInSettings:
      "Ты можешь в любой момент изменить свой выбор в разделе «Доступ для ИИ».",
    aiSharingPrompt: "Сообщения чата",
    aiSharingPromptDetail:
      "Провайдер получит твоё набранное или продиктованное сообщение и инструкции для чата, чтобы ответить тебе.",
    aiSharingHistory: "История чата",
    aiSharingHistoryDetail:
      "Провайдер сможет учитывать в следующих ответах уже известные ему сообщения и ответы из этого чата или их краткое содержание.",
    aiSharingEarlierDetail:
      "Разреши этому провайдеру учитывать предыдущий текст этого чата при подготовке будущих ответов. Для изображений нужно отдельное разрешение.",
    aiSharingImages: "Изображения",
    aiSharingImagesDetail:
      "Провайдер получит изображения из сообщения и сможет учесть их в ответе.",
    aiSharingCouncil: "Черновики Совета",
    aiSharingCouncilDetail:
      "Участники Совета получат твой вопрос и обменяются черновиками. Их выводы использует провайдер, который подготовит итоговый ответ.",
    aiSharingTranscription: "Записи голоса",
    aiSharingTranscriptionDetail:
      "Провайдер получит запись и переведёт твою речь в текст.",
    aiSharingSpeech: "Озвучивание ответов",
    aiSharingSpeechDetail:
      "Провайдер получит текст ответа или образца голоса, а также указания по озвучиванию, если они есть, чтобы создать аудио.",
    aiSharingSearch: "Поиск в интернете",
    aiSharingSearchDetail:
      "Твой вопрос отправляется как поисковый запрос. Если ты разрешишь доступ к истории, к нему можно будет добавить краткое содержание чата.",
    aiSharingTitleGeneration: "Названия чатов",
    aiSharingTitleGenerationDetail:
      "Для автоматического названия провайдер получит твоё первое сообщение. Если ты попросишь подобрать название вручную, он также сможет использовать доступный ему текст чата.",
    aiSharingKnowledge: "Отрывки из других чатов",
    aiSharingKnowledgeDetail:
      "Провайдер получит подходящие отрывки из других твоих чатов, чтобы ответить на вопрос.",
    aiSharingCouncilMembers: ({ providers }) =>
      `Получатели черновиков — ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} получит выводы Совета и подготовит итоговый ответ.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `Чтобы отправить сообщение в ${provider}, разреши доступ к сообщениям в разделе «Доступ для ИИ».`,
    aiSharingOpenSettings: "Открыть настройки доступа для ИИ",
    aiSharingBoundaryNotice: ({ provider }) =>
      `Для ${provider} чат начинается здесь. Предыдущие сообщения скрыты от этого провайдера.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Поделиться предыдущими сообщениями с ${provider}`,
    aiSharingRememberImages: ({ provider }) =>
      `Всегда разрешать отправку прикреплённых изображений в ${provider}`,
    aiSharingSendOnce: "Отправить один раз",
    aiSharingContinue: "Разрешить и продолжить",
    aiSharingRequestedHistory: "Предыдущие сообщения в этом чате",
    aiSharingRememberedScopes:
      "Я запомню твой выбор на этом устройстве. Разрешение на изображения действует только для этой отправки, если ты не выберешь другое.",
    aiSharingPrivacyPolicy: "Политика конфиденциальности",
    aiSharingOpenRouterHost: ({ host }) =>
      `OpenRouter пересылает этот запрос в ${host} для запуска выбранной модели.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `Для ${provider} отключён доступ к категории «${scope}».`,
  },
  zhCN: {
    aiSharingTitle: "AI 数据共享",
    aiSharingSettingsDescription:
      "选择每个服务商可以接收哪些数据。你的选择会保存在这台设备上。",
    aiSharingNoProviders: "连接或使用服务商后，即可在此处看到它们。",
    aiSharingRequestTitle: "与 AI 服务商共享数据？",
    aiSharingRequestDescription:
      "选择要共享的内容。我会在这台设备上记住你的选择。你可以随时在“AI 数据共享”中更改设置。",
    aiSharingDecline: "不允许",
    aiSharingAsk: "下次询问",
    aiSharingNotYetAllowed: "尚未授权",
    aiSharingAllowed: "已允许",
    aiSharingBlocked: "已阻止",
    aiSharingChangeInSettings: "你随时可以在“AI 数据共享”中更改选择。",
    aiSharingPrompt: "聊天消息",
    aiSharingPromptDetail:
      "服务商将收到你输入或口述的消息以及聊天指令，以便回答你的问题。",
    aiSharingHistory: "聊天记录",
    aiSharingHistoryDetail:
      "允许服务商在之后回答时，参考它已在本次聊天中见过的消息和回复，或这些内容的摘要。",
    aiSharingEarlierDetail:
      "允许此服务商在之后回答时参考本次聊天之前的文字内容。共享图片需要单独授权。",
    aiSharingImages: "图片",
    aiSharingImagesDetail: "服务商将收到消息中的图片，以便结合图片作答。",
    aiSharingCouncil: "评议会草稿",
    aiSharingCouncilDetail:
      "评议会成员将收到你的问题，并互相分享答案草稿。负责最终答复的服务商将根据成员的意见作答。",
    aiSharingTranscription: "语音录音",
    aiSharingTranscriptionDetail: "服务商将收到你的录音，以便将语音转成文字。",
    aiSharingSpeech: "朗读回复",
    aiSharingSpeechDetail:
      "服务商将收到回复或语音试听的文本，以及你设置的语音指令，以便生成音频。",
    aiSharingSearch: "网页搜索",
    aiSharingSearchDetail:
      "你的问题将作为搜索内容发送。如果你允许共享聊天记录，还可以附上聊天摘要。",
    aiSharingTitleGeneration: "聊天标题",
    aiSharingTitleGenerationDetail:
      "自动生成标题时，服务商将收到你的第一条消息。如果你主动请求生成标题，服务商还可以使用你已与其共享的聊天文本。",
    aiSharingKnowledge: "其他聊天的片段",
    aiSharingKnowledgeDetail:
      "服务商将收到你其他聊天中的相关片段，以便回答你的问题。",
    aiSharingCouncilMembers: ({ providers }) => `草稿将与 ${providers} 共享。`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} 将收到评议会的意见并撰写最终答复。`,
    aiSharingPromptBlocked: ({ provider }) =>
      `如要向 ${provider} 发送消息，请先在“AI 数据共享”中允许共享聊天消息。`,
    aiSharingOpenSettings: "打开 AI 数据共享",
    aiSharingBoundaryNotice: ({ provider }) =>
      `对 ${provider} 而言，聊天从这里开始。该服务商看不到之前的消息。`,
    aiSharingShareEarlier: ({ provider }) => `与 ${provider} 共享之前的消息`,
    aiSharingRememberImages: ({ provider }) =>
      `始终允许将我附上的图片发送给 ${provider}`,
    aiSharingSendOnce: "仅发送一次",
    aiSharingContinue: "允许并继续",
    aiSharingRequestedHistory: "本次聊天之前的消息",
    aiSharingRememberedScopes:
      "我会在这台设备上记住你的选择。除非你另作选择，否则图片授权仅对此次发送有效。",
    aiSharingPrivacyPolicy: "隐私政策",
    aiSharingOpenRouterHost: ({ host }) =>
      `OpenRouter 会将此次请求转发给 ${host}，由其运行所选模型。`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `已关闭与 ${provider} 共享“${scope}”的权限。`,
  },
  ar: {
    aiSharingTitle: "المشاركة مع الذكاء الاصطناعي",
    aiSharingSettingsDescription:
      "اختر البيانات التي يمكن لكل مزوّد تلقّيها. تُحفظ اختياراتك على هذا الجهاز.",
    aiSharingNoProviders: "تظهر المزوّدات هنا عندما تربطها أو تستخدمها.",
    aiSharingRequestTitle:
      "هل تريد مشاركة البيانات مع مزوّدي الذكاء الاصطناعي؟",
    aiSharingRequestDescription:
      "اختر ما تريد مشاركته. سأتذكّر اختياراتك على هذا الجهاز. يمكنك تغييرها في أي وقت من إعدادات المشاركة مع الذكاء الاصطناعي.",
    aiSharingDecline: "عدم السماح",
    aiSharingAsk: "السؤال في المرة القادمة",
    aiSharingNotYetAllowed: "لم يُسمح به بعد",
    aiSharingAllowed: "مسموح",
    aiSharingBlocked: "محظور",
    aiSharingChangeInSettings:
      "يمكنك تغيير اختياراتك في أي وقت من إعدادات المشاركة مع الذكاء الاصطناعي.",
    aiSharingPrompt: "رسائل المحادثة",
    aiSharingPromptDetail:
      "يتلقّى المزوّد رسالتك المكتوبة أو المملاة وتعليمات المحادثة كي يتمكّن من الرد.",
    aiSharingHistory: "سجلّ المحادثة",
    aiSharingHistoryDetail:
      "يمكن للمزوّد الاستعانة بالرسائل والردود التي سبق أن اطّلع عليها في هذه المحادثة، أو بملخّص لها، عند كتابة ردوده اللاحقة.",
    aiSharingEarlierDetail:
      "اسمح لهذا المزوّد بالاستعانة بالنص السابق من هذه المحادثة في ردوده اللاحقة. تتطلّب الصور إذنًا منفصلًا.",
    aiSharingImages: "الصور",
    aiSharingImagesDetail:
      "يتلقّى المزوّد الصور المرفقة بالرسالة ليأخذها في الحسبان عند الرد.",
    aiSharingCouncil: "مسوّدات المجلس",
    aiSharingCouncilDetail:
      "يتلقّى أعضاء المجلس سؤالك ويتبادلون مسوّدات الإجابات. ويستعين المزوّد المكلّف بالإجابة النهائية بخلاصاتهم لكتابة الرد.",
    aiSharingTranscription: "التسجيلات الصوتية",
    aiSharingTranscriptionDetail: "يتلقّى المزوّد تسجيلك ليحوّل كلامك إلى نص.",
    aiSharingSpeech: "قراءة الردود بصوت عالٍ",
    aiSharingSpeechDetail:
      "يتلقّى المزوّد نص الرد أو العيّنة الصوتية وأي تعليمات صوتية حدّدتها، ليحوّل النص إلى صوت.",
    aiSharingSearch: "البحث في الويب",
    aiSharingSearchDetail:
      "يُرسل سؤالك كطلب بحث. وقد يُرفق به ملخّص للمحادثة إذا سمحت بمشاركة السجلّ.",
    aiSharingTitleGeneration: "عناوين المحادثات",
    aiSharingTitleGenerationDetail:
      "لاقتراح عنوان تلقائي، يتلقّى المزوّد رسالتك الأولى. وإذا طلبت منه عنوانًا بنفسك، فيمكنه أيضًا استخدام نص المحادثة الذي شاركته معه.",
    aiSharingKnowledge: "مقتطفات من محادثات أخرى",
    aiSharingKnowledgeDetail:
      "يتلقّى المزوّد مقتطفات ذات صلة من محادثاتك الأخرى لتساعده في الإجابة عن سؤالك.",
    aiSharingCouncilMembers: ({ providers }) =>
      `تُشارَك المسوّدات مع \u2068${providers}\u2069.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `يتلقّى \u2068${provider}\u2069 خلاصة المجلس لكتابة الإجابة النهائية.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `لإرسال رسالة إلى \u2068${provider}\u2069، اسمح بمشاركة رسائل المحادثة في إعدادات المشاركة مع الذكاء الاصطناعي.`,
    aiSharingOpenSettings: "فتح إعدادات المشاركة مع الذكاء الاصطناعي",
    aiSharingBoundaryNotice: ({ provider }) =>
      `تبدأ المحادثة هنا بالنسبة إلى \u2068${provider}\u2069. تبقى الرسائل السابقة مخفية عن هذا المزوّد.`,
    aiSharingShareEarlier: ({ provider }) =>
      `مشاركة الرسائل السابقة مع \u2068${provider}\u2069`,
    aiSharingRememberImages: ({ provider }) =>
      `السماح دائمًا بإرسال الصور التي أرفقها إلى \u2068${provider}\u2069`,
    aiSharingSendOnce: "إرسال مرة واحدة",
    aiSharingContinue: "السماح والمتابعة",
    aiSharingRequestedHistory: "الرسائل السابقة في هذه المحادثة",
    aiSharingRememberedScopes:
      "سأتذكّر اختياراتك على هذا الجهاز. يسري إذن الصور على هذا الإرسال فقط، ما لم تختر خلاف ذلك.",
    aiSharingPrivacyPolicy: "سياسة الخصوصية",
    aiSharingOpenRouterHost: ({ host }) =>
      `يُحيل OpenRouter هذا الطلب إلى \u2068${host}\u2069 لتشغيل النموذج المحدّد.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `المشاركة مع \u2068${provider}\u2069 معطّلة لفئة «\u2068${scope}\u2069».`,
  },
  ja: {
    aiSharingTitle: "AIとのデータ共有",
    aiSharingSettingsDescription:
      "各プロバイダーが受け取れるデータを選べます。設定はこの端末に保存されます。",
    aiSharingNoProviders:
      "接続または利用したプロバイダーがここに表示されます。",
    aiSharingRequestTitle: "AIプロバイダーとデータを共有しますか？",
    aiSharingRequestDescription:
      "共有するデータを選んでください。選択内容はこの端末に保存し、いつでも「AIとのデータ共有」で変更できます。",
    aiSharingDecline: "許可しない",
    aiSharingAsk: "次回確認",
    aiSharingNotYetAllowed: "未許可",
    aiSharingAllowed: "許可済み",
    aiSharingBlocked: "ブロック中",
    aiSharingChangeInSettings:
      "設定はいつでも「AIとのデータ共有」で変更できます。",
    aiSharingPrompt: "チャットのメッセージ",
    aiSharingPromptDetail:
      "プロバイダーが回答するために、入力または音声入力したメッセージとチャットの指示を送信します。",
    aiSharingHistory: "チャット履歴",
    aiSharingHistoryDetail:
      "このチャットでプロバイダーがすでに受け取ったメッセージや回答、またはその要約を、以降の回答の参考にできるようにします。",
    aiSharingEarlierDetail:
      "このプロバイダーが今後の回答でこのチャットの過去のテキストを参照できるようにします。画像の共有には別の許可が必要です。",
    aiSharingImages: "画像",
    aiSharingImagesDetail:
      "プロバイダーが画像を見て回答できるよう、メッセージ内の画像を送信します。",
    aiSharingCouncil: "評議会の回答案",
    aiSharingCouncilDetail:
      "評議会のメンバーに質問を送り、メンバー同士で回答案を共有します。最終回答を担当するプロバイダーは、評議会の検討結果をもとに回答します。",
    aiSharingTranscription: "音声の録音",
    aiSharingTranscriptionDetail:
      "プロバイダーが音声を文字に起こせるよう、録音を送信します。",
    aiSharingSpeech: "回答の読み上げ",
    aiSharingSpeechDetail:
      "プロバイダーが音声を生成できるよう、回答や音声プレビューのテキストと、設定した読み上げ指示を送信します。",
    aiSharingSearch: "ウェブ検索",
    aiSharingSearchDetail:
      "質問を検索クエリとして送信します。履歴の共有を許可している場合は、チャットの要約も含めることがあります。",
    aiSharingTitleGeneration: "チャットのタイトル",
    aiSharingTitleGenerationDetail:
      "自動でタイトルをつける場合は、最初のメッセージを送信します。自分でタイトルをリクエストした場合、プロバイダーはすでに共有を許可したチャットのテキストも使用できます。",
    aiSharingKnowledge: "他のチャットからの抜粋",
    aiSharingKnowledgeDetail:
      "質問への回答に役立つよう、他のチャットから関連する箇所を抜粋して送信します。",
    aiSharingCouncilMembers: ({ providers }) =>
      `回答案の共有先は ${providers} です。`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} が評議会の検討結果を受け取り、最終回答を作成します。`,
    aiSharingPromptBlocked: ({ provider }) =>
      `${provider} にメッセージを送るには、「AIとのデータ共有」でチャットのメッセージの共有を許可してください。`,
    aiSharingOpenSettings: "AIとのデータ共有を開く",
    aiSharingBoundaryNotice: ({ provider }) =>
      `${provider} とのチャットはここから始まります。このプロバイダーには過去のメッセージは表示されません。`,
    aiSharingShareEarlier: ({ provider }) =>
      `過去のメッセージを ${provider} と共有する`,
    aiSharingRememberImages: ({ provider }) =>
      `添付した画像の ${provider} への送信を常に許可する`,
    aiSharingSendOnce: "今回のみ送信",
    aiSharingContinue: "許可して続ける",
    aiSharingRequestedHistory: "このチャットの過去のメッセージ",
    aiSharingRememberedScopes:
      "選択内容はこの端末に保存します。画像の共有は、別の設定を選ばない限り今回の送信でのみ許可されます。",
    aiSharingPrivacyPolicy: "プライバシーポリシー",
    aiSharingOpenRouterHost: ({ host }) =>
      `選択したモデルを実行するため、OpenRouter はこのリクエストを ${host} に転送します。`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `${provider} との「${scope}」の共有はオフです。`,
  },
  hu: {
    aiSharingTitle: "Adatmegosztás az MI-vel",
    aiSharingSettingsDescription:
      "Válaszd ki, melyik szolgáltató milyen adatokat kaphat meg. A beállításaidat ezen az eszközön mentem.",
    aiSharingNoProviders:
      "Itt azok a szolgáltatók jelennek meg, amelyeket csatlakoztatsz vagy használsz.",
    aiSharingRequestTitle: "Megosztod az adatokat az MI-szolgáltatókkal?",
    aiSharingRequestDescription:
      "Válaszd ki, mit osztasz meg. Ezen az eszközön megjegyzem a döntéseidet. Bármikor módosíthatod őket az „Adatmegosztás az MI-vel” menüben.",
    aiSharingDecline: "Nem engedélyezem",
    aiSharingAsk: "Rákérdezés legközelebb",
    aiSharingNotYetAllowed: "Még nincs engedélyezve",
    aiSharingAllowed: "Engedélyezve",
    aiSharingBlocked: "Letiltva",
    aiSharingChangeInSettings:
      "A döntéseidet bármikor módosíthatod az „Adatmegosztás az MI-vel” menüben.",
    aiSharingPrompt: "Üzenetek",
    aiSharingPromptDetail:
      "A szolgáltató megkapja a begépelt vagy diktált üzenetedet és a beszélgetéshez adott utasításaidat, hogy válaszolhasson.",
    aiSharingHistory: "Beszélgetési előzmények",
    aiSharingHistoryDetail:
      "A szolgáltató a későbbi válaszokhoz felhasználhatja azokat az üzeneteket és válaszokat, amelyeket ebben a beszélgetésben már látott, vagy ezek összefoglalóját.",
    aiSharingEarlierDetail:
      "Engedélyezd, hogy a szolgáltató a későbbi válaszokhoz felhasználja a beszélgetés korábbi szövegét. A képekhez külön engedély szükséges.",
    aiSharingImages: "Képek",
    aiSharingImagesDetail:
      "A szolgáltató megkapja az üzenetben szereplő képeket, hogy figyelembe vehesse őket a válaszában.",
    aiSharingCouncil: "A Tanács választervezetei",
    aiSharingCouncilDetail:
      "A Tanács tagjai megkapják a kérdésedet, és megosztják egymással a választervezeteiket. A végső választ adó szolgáltató az ő megállapításaikra támaszkodik.",
    aiSharingTranscription: "Hangfelvételek",
    aiSharingTranscriptionDetail:
      "A szolgáltató megkapja a felvételt, hogy szöveggé alakítsa, amit mondtál.",
    aiSharingSpeech: "Válaszok felolvasása",
    aiSharingSpeechDetail:
      "A szolgáltató a válasz vagy a hangminta szövegét és az esetleg megadott hangutasításokat kapja meg, hogy hanganyagot készítsen.",
    aiSharingSearch: "Internetes keresés",
    aiSharingSearchDetail:
      "A szolgáltató keresőkérdésként kapja meg a kérdésedet. Ha engedélyezed az előzmények megosztását, a beszélgetés összefoglalóját is megkaphatja.",
    aiSharingTitleGeneration: "Beszélgetéscímek",
    aiSharingTitleGenerationDetail:
      "Az automatikus címadáshoz a szolgáltató az első üzenetedet kapja meg. Ha te kérsz címet, a beszélgetés már megosztott szövegét is használhatja.",
    aiSharingKnowledge: "Részletek más beszélgetésekből",
    aiSharingKnowledgeDetail:
      "A szolgáltató a többi beszélgetésedből is megkapja a kérdésedhez kapcsolódó részleteket, hogy válaszolhasson.",
    aiSharingCouncilMembers: ({ providers }) =>
      `A választervezeteket ezek a szolgáltatók kapják meg: ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `A Tanács megállapításai alapján ${provider} írja meg a végső választ.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `Ha üzenetet küldenél a(z) ${provider} szolgáltatónak, engedélyezd az üzeneteket az „Adatmegosztás az MI-vel” menüben.`,
    aiSharingOpenSettings: "Az MI-adatmegosztás megnyitása",
    aiSharingBoundaryNotice: ({ provider }) =>
      `Ennek a szolgáltatónak itt kezdődik a beszélgetés: ${provider}. A korábbi üzeneteket nem látja.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Korábbi üzenetek megosztása ezzel a szolgáltatóval: ${provider}`,
    aiSharingRememberImages: ({ provider }) =>
      `A csatolt képek küldésének engedélyezése mindig ennek a szolgáltatónak: ${provider}`,
    aiSharingSendOnce: "Küldés egyszer",
    aiSharingContinue: "Engedélyezés és folytatás",
    aiSharingRequestedHistory: "A beszélgetés korábbi üzenetei",
    aiSharingRememberedScopes:
      "Ezen az eszközön megjegyzem a döntéseidet. A képek megosztását csak erre a küldésre engedélyezed, hacsak másképp nem döntesz.",
    aiSharingPrivacyPolicy: "Adatvédelmi tájékoztató",
    aiSharingOpenRouterHost: ({ host }) =>
      `Az OpenRouter a kiválasztott modell futtatásához továbbítja ezt a kérést a következő szolgáltatónak: ${host}.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `A megosztás le van tiltva ennél a szolgáltatónál (${provider}) a következő kategóriában: ${scope}.`,
  },
  cs: {
    aiSharingTitle: "Sdílení s AI",
    aiSharingSettingsDescription:
      "Vyber, co může každý poskytovatel dostávat. Tvoje volby se ukládají na tomto zařízení.",
    aiSharingNoProviders:
      "Poskytovatelé se tu objeví, jakmile je připojíš nebo použiješ.",
    aiSharingRequestTitle: "Sdílet data s poskytovateli AI?",
    aiSharingRequestDescription:
      "Vyber, co chceš sdílet. Tvoje volby si zapamatuji na tomto zařízení. Kdykoli je můžeš změnit v nabídce Sdílení s AI.",
    aiSharingDecline: "Nepovolit",
    aiSharingAsk: "Zeptat se příště",
    aiSharingNotYetAllowed: "Zatím nepovoleno",
    aiSharingAllowed: "Povoleno",
    aiSharingBlocked: "Blokováno",
    aiSharingChangeInSettings:
      "Své volby můžeš kdykoli změnit v nabídce Sdílení s AI.",
    aiSharingPrompt: "Zprávy v chatu",
    aiSharingPromptDetail:
      "Poskytovatel dostane tvou napsanou nebo nadiktovanou zprávu a pokyny pro tento chat, aby ti mohl odpovědět.",
    aiSharingHistory: "Historie chatu",
    aiSharingHistoryDetail:
      "Poskytovatel může v dalších odpovědích vycházet ze zpráv a odpovědí, které už v tomto chatu viděl, nebo z jejich shrnutí.",
    aiSharingEarlierDetail:
      "Povol tomuto poskytovateli použít dřívější text tohoto chatu jako kontext pro další odpovědi. Obrázky vyžadují samostatné povolení.",
    aiSharingImages: "Obrázky",
    aiSharingImagesDetail:
      "Poskytovatel dostane obrázky obsažené ve zprávě, aby je mohl zohlednit v odpovědi.",
    aiSharingCouncil: "Návrhy odpovědí Rady",
    aiSharingCouncilDetail:
      "Členové Rady dostanou tvou otázku a vymění si návrhy odpovědí. Poskytovatel pověřený konečnou odpovědí využije jejich závěry.",
    aiSharingTranscription: "Hlasové nahrávky",
    aiSharingTranscriptionDetail:
      "Poskytovatel dostane tvou nahrávku, aby mohl řeč přepsat na text.",
    aiSharingSpeech: "Předčítání odpovědí",
    aiSharingSpeechDetail:
      "Poskytovatel dostane text odpovědi nebo hlasové ukázky a případné pokyny k přednesu, aby vytvořil zvuk.",
    aiSharingSearch: "Vyhledávání na webu",
    aiSharingSearchDetail:
      "Tvá otázka se odešle jako vyhledávací dotaz. Pokud povolíš sdílení historie, může se přiložit i shrnutí chatu.",
    aiSharingTitleGeneration: "Názvy chatů",
    aiSharingTitleGenerationDetail:
      "Pro automatický název dostane poskytovatel tvou první zprávu. Pokud si název vyžádáš ručně, může použít i text chatu, který s ním už sdílíš.",
    aiSharingKnowledge: "Úryvky z jiných chatů",
    aiSharingKnowledgeDetail:
      "Poskytovatel dostane související úryvky z tvých dalších chatů, které mu pomohou odpovědět na tvou otázku.",
    aiSharingCouncilMembers: ({ providers }) =>
      `Návrhy odpovědí obdrží ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} dostane závěry Rady a napíše konečnou odpověď.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `Pokud chceš odeslat zprávu poskytovateli ${provider}, povol zprávy v nabídce Sdílení s AI.`,
    aiSharingOpenSettings: "Otevřít sdílení s AI",
    aiSharingBoundaryNotice: ({ provider }) =>
      `Pro poskytovatele ${provider} začíná chat tady. Předchozí zprávy mu zůstanou skryté.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Sdílet předchozí zprávy s poskytovatelem ${provider}`,
    aiSharingRememberImages: ({ provider }) =>
      `Vždy povolit odesílání přiložených obrázků poskytovateli ${provider}`,
    aiSharingSendOnce: "Odeslat jednou",
    aiSharingContinue: "Povolit a pokračovat",
    aiSharingRequestedHistory: "Předchozí zprávy v tomto chatu",
    aiSharingRememberedScopes:
      "Tvoje volby si zapamatuji na tomto zařízení. Povolení pro obrázky platí jen pro toto odeslání, pokud nezvolíš jinak.",
    aiSharingPrivacyPolicy: "Zásady ochrany soukromí",
    aiSharingOpenRouterHost: ({ host }) =>
      `OpenRouter přepošle tento požadavek poskytovateli ${host}, aby spustil vybraný model.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `Sdílení s poskytovatelem ${provider} je pro kategorii „${scope}“ vypnuté.`,
  },
  pl: {
    aiSharingTitle: "Udostępnianie dostawcom AI",
    aiSharingSettingsDescription:
      "Wybierz, jakie dane może otrzymywać każdy dostawca. Twoje ustawienia są zapisywane na tym urządzeniu.",
    aiSharingNoProviders:
      "Pojawią się tu dostawcy, których podłączysz lub z których skorzystasz.",
    aiSharingRequestTitle: "Udostępnić dane dostawcom AI?",
    aiSharingRequestDescription:
      "Wybierz, co chcesz udostępnić. Zapamiętam twoje wybory na tym urządzeniu. Możesz je w każdej chwili zmienić w ustawieniach udostępniania dostawcom AI.",
    aiSharingDecline: "Nie zezwalaj",
    aiSharingAsk: "Zapytaj następnym razem",
    aiSharingNotYetAllowed: "Jeszcze bez zgody",
    aiSharingAllowed: "Dozwolone",
    aiSharingBlocked: "Zablokowane",
    aiSharingChangeInSettings:
      "Możesz w każdej chwili zmienić swój wybór w ustawieniach udostępniania dostawcom AI.",
    aiSharingPrompt: "Wiadomości z czatu",
    aiSharingPromptDetail:
      "Dostawca otrzyma wpisaną lub podyktowaną wiadomość oraz instrukcje dla tego czatu, aby móc odpowiedzieć.",
    aiSharingHistory: "Historia czatu",
    aiSharingHistoryDetail:
      "Dostawca może wykorzystać wiadomości i odpowiedzi, które już widział w tym czacie, lub ich podsumowanie jako kontekst kolejnych odpowiedzi.",
    aiSharingEarlierDetail:
      "Pozwól temu dostawcy wykorzystać wcześniejszy tekst tego czatu jako kontekst kolejnych odpowiedzi. Obrazy wymagają osobnej zgody.",
    aiSharingImages: "Obrazy",
    aiSharingImagesDetail:
      "Dostawca otrzyma obrazy dołączone do wiadomości, aby uwzględnić je w odpowiedzi.",
    aiSharingCouncil: "Projekty odpowiedzi Rady",
    aiSharingCouncilDetail:
      "Członkowie Rady otrzymają twoje pytanie i wymienią się projektami odpowiedzi. Dostawca przygotowujący końcową odpowiedź wykorzysta ich wnioski.",
    aiSharingTranscription: "Nagrania głosowe",
    aiSharingTranscriptionDetail:
      "Dostawca otrzyma twoje nagranie, aby zamienić mowę na tekst.",
    aiSharingSpeech: "Odczytywanie odpowiedzi",
    aiSharingSpeechDetail:
      "Dostawca otrzyma tekst odpowiedzi lub próbki głosu oraz ewentualne instrukcje dotyczące głosu, aby przygotować nagranie.",
    aiSharingSearch: "Wyszukiwanie w sieci",
    aiSharingSearchDetail:
      "Twoje pytanie zostanie wysłane jako zapytanie do wyszukiwarki. Jeśli zezwolisz na udostępnianie historii, może do niego dołączyć podsumowanie czatu.",
    aiSharingTitleGeneration: "Tytuły czatów",
    aiSharingTitleGenerationDetail:
      "Aby automatycznie nadać tytuł, dostawca otrzyma pierwszą wiadomość. Jeśli poprosisz o tytuł samodzielnie, może też użyć udostępnionego mu tekstu czatu.",
    aiSharingKnowledge: "Fragmenty innych czatów",
    aiSharingKnowledgeDetail:
      "Dostawca otrzyma trafne fragmenty z twoich innych czatów, które pomogą mu odpowiedzieć na pytanie.",
    aiSharingCouncilMembers: ({ providers }) =>
      `Projekty odpowiedzi otrzymają następujący dostawcy: ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} otrzyma wnioski Rady, aby przygotować końcową odpowiedź.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `Aby wysłać wiadomość do ${provider}, zezwól na wiadomości w ustawieniach udostępniania dostawcom AI.`,
    aiSharingOpenSettings: "Otwórz ustawienia udostępniania",
    aiSharingBoundaryNotice: ({ provider }) =>
      `Dla ${provider} czat zaczyna się tutaj. Wcześniejsze wiadomości pozostaną przed tym dostawcą ukryte.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Udostępnij wcześniejsze wiadomości dostawcy ${provider}`,
    aiSharingRememberImages: ({ provider }) =>
      `Zawsze zezwalaj na wysyłanie załączonych obrazów do ${provider}`,
    aiSharingSendOnce: "Wyślij raz",
    aiSharingContinue: "Zezwól i kontynuuj",
    aiSharingRequestedHistory: "Wcześniejsze wiadomości w tym czacie",
    aiSharingRememberedScopes:
      "Zapamiętam twoje wybory na tym urządzeniu. Zgoda na obrazy dotyczy tylko tej wysyłki, chyba że wybierzesz inaczej.",
    aiSharingPrivacyPolicy: "Polityka prywatności",
    aiSharingOpenRouterHost: ({ host }) =>
      `OpenRouter przekazuje to żądanie do ${host} w celu uruchomienia wybranego modelu.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `Udostępnianie dostawcy ${provider} jest wyłączone dla kategorii „${scope}”.`,
  },
  tr: {
    aiSharingTitle: "Yapay zekâyla paylaşım",
    aiSharingSettingsDescription:
      "Her sağlayıcının hangi verileri alabileceğini seç. Seçimlerin bu cihazda saklanır.",
    aiSharingNoProviders:
      "Bağladığın veya kullandığın sağlayıcılar burada görünür.",
    aiSharingRequestTitle:
      "Veriler yapay zekâ sağlayıcılarıyla paylaşılsın mı?",
    aiSharingRequestDescription:
      "Neyi paylaşacağını seç. Seçimlerini bu cihazda hatırlayacağım. Bunları istediğin zaman Yapay zekâyla paylaşım ayarlarından değiştirebilirsin.",
    aiSharingDecline: "İzin verme",
    aiSharingAsk: "Bir dahaki sefere sor",
    aiSharingNotYetAllowed: "Henüz izin verilmedi",
    aiSharingAllowed: "İzin verildi",
    aiSharingBlocked: "Engellendi",
    aiSharingChangeInSettings:
      "Seçimlerini istediğin zaman Yapay zekâyla paylaşım ayarlarında değiştirebilirsin.",
    aiSharingPrompt: "Sohbet mesajları",
    aiSharingPromptDetail:
      "Sağlayıcının yanıt verebilmesi için yazdığın veya sesle girdiğin mesaj ve sohbet talimatların gönderilir.",
    aiSharingHistory: "Sohbet geçmişi",
    aiSharingHistoryDetail:
      "Sağlayıcı, bu sohbette daha önce gördüğü mesaj ve yanıtları veya bunların özetini sonraki yanıtlarında bağlam olarak kullanabilir.",
    aiSharingEarlierDetail:
      "Bu sağlayıcının sonraki yanıtlarında sohbetin önceki metnini kullanmasına izin ver. Görseller için ayrıca izin gerekir.",
    aiSharingImages: "Görseller",
    aiSharingImagesDetail:
      "Sağlayıcının yanıtında kullanabilmesi için mesaja eklenen görseller gönderilir.",
    aiSharingCouncil: "Konseyin yanıt taslakları",
    aiSharingCouncilDetail:
      "Konsey üyeleri sorunu alır ve yanıt taslaklarını birbirleriyle paylaşır. Son yanıtı yazan sağlayıcı konseyin vardığı sonuçları kullanır.",
    aiSharingTranscription: "Ses kayıtları",
    aiSharingTranscriptionDetail:
      "Sağlayıcının konuşmanı metne dönüştürebilmesi için kaydın gönderilir.",
    aiSharingSpeech: "Sesli yanıtlar",
    aiSharingSpeechDetail:
      "Sağlayıcının ses üretebilmesi için yanıtın veya ses önizlemesinin metni ve varsa seslendirme talimatların gönderilir.",
    aiSharingSearch: "Web araması",
    aiSharingSearchDetail:
      "Sorun arama sorgusu olarak gönderilir. Geçmişin paylaşılmasına izin verirsen sohbetin özeti de eklenebilir.",
    aiSharingTitleGeneration: "Sohbet başlıkları",
    aiSharingTitleGenerationDetail:
      "Otomatik başlık için sağlayıcı ilk mesajını alır. Başlığı kendin istediğinde sağlayıcı, sohbetin kendisiyle paylaşılmış metnini de kullanabilir.",
    aiSharingKnowledge: "Diğer sohbetlerden alıntılar",
    aiSharingKnowledgeDetail:
      "Sağlayıcının sorunu yanıtlamasına yardımcı olmak için diğer sohbetlerinden ilgili bölümler gönderilir.",
    aiSharingCouncilMembers: ({ providers }) =>
      `Taslaklar şu sağlayıcılarla paylaşılır: ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} son yanıtı yazmak için konseyin vardığı sonuçları alır.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `${provider} ile mesajlaşmak için Yapay zekâyla paylaşım ayarlarında sohbet mesajlarına izin ver.`,
    aiSharingOpenSettings: "Yapay zekâyla paylaşım ayarlarını aç",
    aiSharingBoundaryNotice: ({ provider }) =>
      `${provider} için sohbet burada başlar. Bu sağlayıcı önceki mesajları göremez.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Önceki mesajları ${provider} ile paylaş`,
    aiSharingRememberImages: ({ provider }) =>
      `Eklediğim görsellerin ${provider} ile paylaşılmasına her zaman izin ver`,
    aiSharingSendOnce: "Bir kez gönder",
    aiSharingContinue: "İzin ver ve devam et",
    aiSharingRequestedHistory: "Bu sohbetteki önceki mesajlar",
    aiSharingRememberedScopes:
      "Seçimlerini bu cihazda hatırlayacağım. Aksini seçmezsen görsel izni yalnızca bu gönderim için geçerli olur.",
    aiSharingPrivacyPolicy: "Gizlilik politikası",
    aiSharingOpenRouterHost: ({ host }) =>
      `OpenRouter, seçilen modeli çalıştırmak için bu isteği ${host} adlı sağlayıcıya iletir.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `${provider} ile “${scope}” paylaşımı kapalı.`,
  },
  sv: {
    aiSharingTitle: "Delning med AI",
    aiSharingSettingsDescription:
      "Välj vad varje leverantör får ta emot. Dina val sparas på den här enheten.",
    aiSharingNoProviders:
      "De leverantörer du ansluter eller använder visas här.",
    aiSharingRequestTitle: "Dela uppgifter med AI-leverantörer?",
    aiSharingRequestDescription:
      "Välj vad du vill dela. Jag kommer ihåg dina val på den här enheten. Du kan ändra dem när som helst under Delning med AI.",
    aiSharingDecline: "Tillåt inte",
    aiSharingAsk: "Fråga nästa gång",
    aiSharingNotYetAllowed: "Ännu inte tillåtet",
    aiSharingAllowed: "Tillåtet",
    aiSharingBlocked: "Blockerat",
    aiSharingChangeInSettings:
      "Du kan när som helst ändra dina val under Delning med AI.",
    aiSharingPrompt: "Chattmeddelanden",
    aiSharingPromptDetail:
      "Leverantören får ditt skrivna eller dikterade meddelande och dina chattinstruktioner för att kunna svara.",
    aiSharingHistory: "Chatthistorik",
    aiSharingHistoryDetail:
      "Leverantören får använda meddelanden och svar som den redan har sett i chatten, eller en sammanfattning av dem, som underlag för kommande svar.",
    aiSharingEarlierDetail:
      "Låt den här leverantören använda tidigare text från chatten som underlag för kommande svar. Bilder kräver ett separat tillstånd.",
    aiSharingImages: "Bilder",
    aiSharingImagesDetail:
      "Leverantören får bilderna i meddelandet för att kunna ta hänsyn till dem i sitt svar.",
    aiSharingCouncil: "Rådets utkast",
    aiSharingCouncilDetail:
      "Rådets medlemmar får din fråga och delar svarsutkast med varandra. Leverantören som skriver det slutliga svaret utgår från deras slutsatser.",
    aiSharingTranscription: "Röstinspelningar",
    aiSharingTranscriptionDetail:
      "Leverantören får din inspelning för att omvandla ditt tal till text.",
    aiSharingSpeech: "Upplästa svar",
    aiSharingSpeechDetail:
      "Leverantören får texten till svaret eller röstprovet och eventuella röstinstruktioner för att kunna skapa ljudet.",
    aiSharingSearch: "Webbsökning",
    aiSharingSearchDetail:
      "Din fråga skickas som en sökfråga. Om du tillåter delning av historiken kan en sammanfattning av chatten följa med.",
    aiSharingTitleGeneration: "Titlar på chattar",
    aiSharingTitleGenerationDetail:
      "För en automatisk titel får leverantören ditt första meddelande. Om du själv ber om en titel kan leverantören också använda den chatttext du har delat med den.",
    aiSharingKnowledge: "Utdrag ur andra chattar",
    aiSharingKnowledgeDetail:
      "Leverantören får relevanta delar av dina andra chattar som stöd för att besvara din fråga.",
    aiSharingCouncilMembers: ({ providers }) =>
      `Utkasten delas med ${providers}.`,
    aiSharingCouncilFinal: ({ provider }) =>
      `${provider} får rådets slutsatser för att skriva det slutliga svaret.`,
    aiSharingPromptBlocked: ({ provider }) =>
      `För att skicka ett meddelande till ${provider} behöver du tillåta chattmeddelanden under Delning med AI.`,
    aiSharingOpenSettings: "Öppna delning med AI",
    aiSharingBoundaryNotice: ({ provider }) =>
      `För ${provider} börjar chatten här. Den här leverantören ser inga tidigare meddelanden.`,
    aiSharingShareEarlier: ({ provider }) =>
      `Dela tidigare meddelanden med ${provider}`,
    aiSharingRememberImages: ({ provider }) =>
      `Tillåt alltid att bilder jag bifogar skickas till ${provider}`,
    aiSharingSendOnce: "Skicka en gång",
    aiSharingContinue: "Tillåt och fortsätt",
    aiSharingRequestedHistory: "Tidigare meddelanden i den här chatten",
    aiSharingRememberedScopes:
      "Jag kommer ihåg dina val på den här enheten. Tillståndet för bilder gäller bara den här sändningen om du inte väljer något annat.",
    aiSharingPrivacyPolicy: "Integritetspolicy",
    aiSharingOpenRouterHost: ({ host }) =>
      `OpenRouter vidarebefordrar förfrågan till ${host} för att köra den valda modellen.`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `Delning med ${provider} är avstängd för ”${scope}”.`,
  },
  ur: {
    aiSharingTitle: "اے آئی کے ساتھ اشتراک",
    aiSharingSettingsDescription:
      "منتخب کریں کہ ہر فراہم کنندہ کو کیا بھیجا جا سکتا ہے۔ آپ کا انتخاب اسی ڈیوائس پر محفوظ ہوتا ہے۔",
    aiSharingNoProviders:
      "جن فراہم کنندگان کو آپ منسلک یا استعمال کریں گے وہ یہاں دکھائی دیں گے۔",
    aiSharingRequestTitle: "اے آئی فراہم کنندگان کے ساتھ ڈیٹا شیئر کریں؟",
    aiSharingRequestDescription:
      "منتخب کریں کہ آپ کیا شیئر کرنا چاہتے ہیں۔ میں آپ کا انتخاب اسی ڈیوائس پر یاد رکھوں گا۔ آپ اسے کسی بھی وقت ”اے آئی کے ساتھ اشتراک“ میں بدل سکتے ہیں۔",
    aiSharingDecline: "اجازت نہ دیں",
    aiSharingAsk: "اگلی بار پوچھیں",
    aiSharingNotYetAllowed: "ابھی اجازت نہیں دی گئی",
    aiSharingAllowed: "اجازت ہے",
    aiSharingBlocked: "بلاک ہے",
    aiSharingChangeInSettings:
      "آپ کسی بھی وقت ”اے آئی کے ساتھ اشتراک“ میں اپنا انتخاب بدل سکتے ہیں۔",
    aiSharingPrompt: "چیٹ کے پیغامات",
    aiSharingPromptDetail:
      "فراہم کنندہ کو آپ کا لکھا ہوا یا بول کر درج کیا ہوا پیغام اور چیٹ کی ہدایات بھیجی جاتی ہیں تاکہ وہ جواب دے سکے۔",
    aiSharingHistory: "چیٹ کی سرگزشت",
    aiSharingHistoryDetail:
      "فراہم کنندہ آئندہ جوابات کے لیے اس چیٹ کے وہ پیغامات اور جوابات استعمال کر سکتا ہے جو وہ پہلے دیکھ چکا ہے، یا ان کا خلاصہ۔",
    aiSharingEarlierDetail:
      "اس فراہم کنندہ کو آئندہ جوابات کے لیے اس چیٹ کا پچھلا متن استعمال کرنے دیں۔ تصاویر کے لیے الگ اجازت درکار ہے۔",
    aiSharingImages: "تصاویر",
    aiSharingImagesDetail:
      "فراہم کنندہ کو پیغام میں شامل تصاویر بھیجی جاتی ہیں تاکہ وہ انہیں دیکھ کر جواب دے سکے۔",
    aiSharingCouncil: "کونسل کے مسودے",
    aiSharingCouncilDetail:
      "کونسل کے اراکین کو آپ کا سوال ملتا ہے اور وہ جوابات کے مسودے آپس میں شیئر کرتے ہیں۔ حتمی جواب لکھنے والا فراہم کنندہ ان کے نتائج سے مدد لیتا ہے۔",
    aiSharingTranscription: "آواز کی ریکارڈنگ",
    aiSharingTranscriptionDetail:
      "فراہم کنندہ کو آپ کی ریکارڈنگ بھیجی جاتی ہے تاکہ وہ آپ کے بولے ہوئے الفاظ کو متن میں بدل سکے۔",
    aiSharingSpeech: "جوابات پڑھ کر سنانا",
    aiSharingSpeechDetail:
      "آڈیو بنانے کے لیے فراہم کنندہ کو جواب یا آواز کے نمونے کا متن اور آواز کے بارے میں آپ کی دی ہوئی ہدایات بھیجی جاتی ہیں۔",
    aiSharingSearch: "ویب پر تلاش",
    aiSharingSearchDetail:
      "آپ کا سوال تلاش کے لیے بھیجا جاتا ہے۔ اگر آپ سرگزشت شیئر کرنے کی اجازت دیں تو چیٹ کا خلاصہ بھی شامل کیا جا سکتا ہے۔",
    aiSharingTitleGeneration: "چیٹ کے عنوانات",
    aiSharingTitleGenerationDetail:
      "خودکار عنوان بنانے کے لیے فراہم کنندہ کو آپ کا پہلا پیغام بھیجا جاتا ہے۔ اگر آپ خود عنوان مانگیں تو وہ چیٹ کا وہ متن بھی استعمال کر سکتا ہے جو آپ اس کے ساتھ شیئر کر چکے ہیں۔",
    aiSharingKnowledge: "دوسری چیٹس سے اقتباسات",
    aiSharingKnowledgeDetail:
      "فراہم کنندہ کو آپ کی دوسری چیٹس کے متعلقہ اقتباسات بھیجے جاتے ہیں تاکہ وہ آپ کے سوال کا جواب دے سکے۔",
    aiSharingCouncilMembers: ({ providers }) =>
      `مسودے ان فراہم کنندگان کے ساتھ شیئر کیے جاتے ہیں: \u2068${providers}\u2069۔`,
    aiSharingCouncilFinal: ({ provider }) =>
      `حتمی جواب لکھنے کے لیے کونسل کے نتائج \u2068${provider}\u2069 کو بھیجے جاتے ہیں۔`,
    aiSharingPromptBlocked: ({ provider }) =>
      `\u2068${provider}\u2069 کو پیغام بھیجنے کے لیے ”اے آئی کے ساتھ اشتراک“ میں چیٹ کے پیغامات کی اجازت دیں۔`,
    aiSharingOpenSettings: "اے آئی کے ساتھ اشتراک کھولیں",
    aiSharingBoundaryNotice: ({ provider }) =>
      `\u2068${provider}\u2069 کے لیے چیٹ یہاں سے شروع ہوتی ہے۔ اس فراہم کنندہ کو پچھلے پیغامات نظر نہیں آئیں گے۔`,
    aiSharingShareEarlier: ({ provider }) =>
      `پچھلے پیغامات \u2068${provider}\u2069 کے ساتھ شیئر کریں`,
    aiSharingRememberImages: ({ provider }) =>
      `میری منسلک کردہ تصاویر \u2068${provider}\u2069 کو بھیجنے کی ہمیشہ اجازت دیں`,
    aiSharingSendOnce: "ایک بار بھیجیں",
    aiSharingContinue: "اجازت دیں اور جاری رکھیں",
    aiSharingRequestedHistory: "اس چیٹ کے پچھلے پیغامات",
    aiSharingRememberedScopes:
      "میں آپ کا انتخاب اسی ڈیوائس پر یاد رکھوں گا۔ جب تک آپ کوئی اور انتخاب نہ کریں، تصاویر کی اجازت صرف اس بار بھیجنے کے لیے ہے۔",
    aiSharingPrivacyPolicy: "رازداری کی پالیسی",
    aiSharingOpenRouterHost: ({ host }) =>
      `منتخب ماڈل چلانے کے لیے OpenRouter یہ درخواست \u2068${host}\u2069 کو بھیجتا ہے۔`,
    aiSharingScopeBlocked: ({ provider, scope }) =>
      `\u2068${provider}\u2069 کے ساتھ ”\u2068${scope}\u2069“ شیئر کرنے کی اجازت بند ہے۔`,
  },
} satisfies Record<string, typeof en>;
