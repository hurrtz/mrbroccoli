import type { TranslationParams } from "./types";

const en = {
  freeEdition: "Private Offline · Free",
  premiumPurchaseValue:
    "One-time purchase. No subscription and no token markup; models and voices run on your own keys, billed by your providers — none are included.",
  premiumFreeKeepsWorking:
    "Free remains usable: offline conversations, history, backups, and manual export stay available.",
  premiumBenefitProviders:
    "Use your cloud providers and their higher-quality models",
  premiumCouncilBandCopy:
    "Model Council deliberates across your own provider keys.",
  premiumPromptBandCopy:
    "Shape the system prompt for your own provider models.",
  premiumBenefitModes:
    "Switch response modes and run multi-model Model Council deliberation",
  premiumBenefitTools: "Add web search, images, and cloud Drive sessions",
  premiumBenefitKnowledge:
    "Use past-session knowledge and the portable Markdown archive",
  freeOfflineLanguagesStep: "Choose your language",
  freeOfflineModelsStep: "Your best setup",
  freeOfflineStartStep: "3 · Start talking",
  freeOfflineSystemVoiceNote:
    "No single downloaded voice covers this language set, so replies use the phone’s language-aware system voice. Listening and thinking stay local.",
  freeOfflineStart: "Start",
  freeOfflinePremiumEscape: "Have provider API keys? Unlock Premium instead",
  settingsGroupConversation: "Conversation",
  settingsGroupVoiceModels: "Voice",
  speakingPlayback: "Playback",
  startSpeaking: "Start speaking",
  whoSpeaks: "Who speaks",
  archivedConversations: "Archived conversations",
  modelStorageTitle: ({ size }: TranslationParams) =>
    `Storage · ${size} in models`,
  modelStorageFooter:
    "Download, test and choice live in Thinking, Listening and Speaking; this list only frees space.",
  noDownloadedModels: "No downloaded models",
  automaticSetup: "Automatic setup",
  appearance: "Appearance",
  homeScreen: "Home screen",
  diagnostics: "Diagnostics",
  usageStatsInTranscripts: "Usage stats in transcripts",
  settingsGroupPrivacyApp: "Privacy & app",
  webSearchNobody: "Nobody",
  answeringModels: "Answering models",
  answeringModelsFooter:
    "Up to four; the home screen switches who answers the next turn. A model you don't have yet is downloaded or connected right here.",
  answeringModelSheetHint: "Switchable from the home screen byline.",
  whoListens: "Who listens",
  whoListensFooter:
    "One choice across every runtime. A radio unlocks only after a viable test — testing is the egg, and it cracks when a model fails. Removing an installed model is a swipe. Provider routes appear once connected under Connections.",
  whoSpeaksFooter:
    "One choice across every runtime. On-device downloads happen right here; provider routes appear once their key is connected under Connections.",
  whoSearches: "Who searches",
  whoSearchesFooter:
    "Search runs inside an answer when the model decides it needs the web. Providers appear once connected under Connections.",
  connectionsProviderFooter:
    "Keys stay in the device keychain and are sent only to their own provider.",
};

type EditionTranslations = typeof en;
const define = (value: EditionTranslations) => value;

export const editionTranslations = {
  en,
  de: define({
    freeEdition: "Privat & offline · Kostenlos",
    premiumPurchaseValue:
      "Einmaliger Kauf. Kein Abo und kein Token-Aufschlag; Modelle und Stimmen laufen über deine eigenen Schlüssel und werden direkt von deinen Anbietern abgerechnet — enthalten ist keines davon.",
    premiumFreeKeepsWorking:
      "Kostenlos bleibt nutzbar: Offline-Gespräche, Verlauf, Backups und manueller Export bleiben verfügbar.",
    premiumBenefitProviders:
      "Nutze deine Cloud-Anbieter und deren hochwertigere Modelle",
    premiumCouncilBandCopy:
      "Der Modellrat berät über deine eigenen Anbieterschlüssel.",
    premiumPromptBandCopy:
      "Gestalte den System-Prompt für deine eigenen Anbieter-Modelle.",
    premiumBenefitModes:
      "Wechsle Antwortmodi und starte eine Übermodus-Beratung mit mehreren Modellen",
    premiumBenefitTools:
      "Nutze Websuche, Bilder und Cloud-Sitzungen im Drive-Modus",
    premiumBenefitKnowledge:
      "Nutze Wissen aus früheren Sitzungen und das portable Markdown-Archiv",
    freeOfflineLanguagesStep: "Wähle deine Sprache",
    freeOfflineModelsStep: "Deine beste Einrichtung",
    freeOfflineStartStep: "3 · Gespräch starten",
    freeOfflineSystemVoiceNote:
      "Keine einzelne heruntergeladene Stimme deckt diese Sprachen ab. Antworten verwenden deshalb die sprachabhängige Systemstimme des Smartphones; Hören und Denken bleiben lokal.",
    freeOfflineStart: "Start",
    freeOfflinePremiumEscape:
      "Anbieter-API-Schlüssel vorhanden? Stattdessen Premium freischalten",
    settingsGroupConversation: "Gespräch",
    settingsGroupVoiceModels: "Stimme",
    speakingPlayback: "Wiedergabe",
    startSpeaking: "Sprachausgabe starten",
    whoSpeaks: "Wer spricht",
    archivedConversations: "Archivierte Gespräche",
    modelStorageTitle: ({ size }) => `Speicher · ${size} in Modellen`,
    modelStorageFooter:
      "Download, Test und Auswahl erfolgen unter Denken, Hören und Sprechen; diese Liste gibt nur Speicher frei.",
    noDownloadedModels: "Keine heruntergeladenen Modelle",
    automaticSetup: "Automatische Einrichtung",
    appearance: "Darstellung",
    homeScreen: "Startbildschirm",
    diagnostics: "Diagnose",
    usageStatsInTranscripts: "Nutzungsstatistik in Transkripten",
    settingsGroupPrivacyApp: "Datenschutz & App",
    webSearchNobody: "Niemand",
    answeringModels: "Antwortende Modelle",
    answeringModelsFooter:
      "Bis zu vier; auf dem Startbildschirm wechselst du, wer als Nächstes antwortet. Ein fehlendes Modell wird direkt hier heruntergeladen oder verbunden.",
    answeringModelSheetHint:
      "Über die Zeile auf dem Startbildschirm wechselbar.",
    whoListens: "Wer hört zu",
    whoListensFooter:
      "Eine Auswahl für jede Laufzeit. Sie wird erst nach einem erfolgreichen Test freigeschaltet; bei einem Fehler bekommt das Test-Ei einen Riss. Installierte Modelle lassen sich per Wisch entfernen. Anbieter-Routen erscheinen nach der Verbindung unter Verbindungen.",
    whoSpeaksFooter:
      "Eine Auswahl für jede Laufzeit. Downloads auf dem Gerät erfolgen direkt hier; Anbieter-Routen erscheinen, sobald ihr Schlüssel unter Verbindungen hinterlegt ist.",
    whoSearches: "Wer sucht",
    whoSearchesFooter:
      "Die Suche läuft innerhalb einer Antwort, wenn das Modell das Web benötigt. Anbieter erscheinen nach der Verbindung unter Verbindungen.",
    connectionsProviderFooter:
      "Schlüssel bleiben im Geräteschlüsselbund und werden nur an den jeweiligen Anbieter gesendet.",
  }),
  uk: define({
    freeEdition: "Приватно й офлайн · Безкоштовно",
    premiumPurchaseValue:
      "Одноразова покупка. Без підписки й націнки на токени; моделі й голоси працюють через ваші власні ключі, і за використання ви платите безпосередньо своїм провайдерам — нічого з цього не входить у ціну.",
    premiumFreeKeepsWorking:
      "Безкоштовна версія залишається корисною: офлайн-розмови, історія, резервні копії та ручний експорт доступні.",
    premiumBenefitProviders:
      "Використовуйте своїх хмарних провайдерів і їхні якісніші моделі",
    premiumCouncilBandCopy:
      "Рада моделей радиться через ваші власні ключі провайдерів.",
    premiumPromptBandCopy:
      "Формуйте системний промпт для моделей ваших провайдерів.",
    premiumBenefitModes:
      "Перемикайте режими відповідей і запускайте обговорення в Суперрежимі з кількома моделями",
    premiumBenefitTools: "Додайте вебпошук, зображення та хмарні сесії Drive",
    premiumBenefitKnowledge:
      "Використовуйте знання минулих сесій і переносний Markdown-архів",
    freeOfflineLanguagesStep: "Виберіть свою мову",
    freeOfflineModelsStep: "Найкраще налаштування для вас",
    freeOfflineStartStep: "3 · Почніть розмову",
    freeOfflineSystemVoiceNote:
      "Жоден завантажений голос не охоплює всі ці мови, тому відповіді використовують системний голос телефону для відповідної мови. Слухання й мислення залишаються локальними.",
    freeOfflineStart: "Почати",
    freeOfflinePremiumEscape: "Маєте API-ключі провайдера? Розблокуйте Premium",
    settingsGroupConversation: "Розмова",
    settingsGroupVoiceModels: "Голос",
    speakingPlayback: "Відтворення",
    startSpeaking: "Почати озвучення",
    whoSpeaks: "Хто говорить",
    archivedConversations: "Архівовані розмови",
    modelStorageTitle: ({ size }) => `Сховище · ${size} у моделях`,
    modelStorageFooter:
      "Завантаження, тестування й вибір доступні в розділах Мислення, Слухання та Мовлення; цей список лише звільняє місце.",
    noDownloadedModels: "Немає завантажених моделей",
    automaticSetup: "Автоматичне налаштування",
    appearance: "Вигляд",
    homeScreen: "Головний екран",
    diagnostics: "Діагностика",
    usageStatsInTranscripts: "Статистика використання в транскриптах",
    settingsGroupPrivacyApp: "Приватність і застосунок",
    webSearchNobody: "Ніхто",
    answeringModels: "Моделі, що відповідають",
    answeringModelsFooter:
      "До чотирьох; на головному екрані можна змінити, хто відповість наступним. Відсутню модель можна завантажити або підключити тут.",
    answeringModelSheetHint:
      "Перемикається через рядок на головному екрані.",
    whoListens: "Хто слухає",
    whoListensFooter:
      "Один вибір для всіх середовищ. Вибір відкривається лише після успішної перевірки; якщо модель не працює, тестове яйце тріскається. Встановлену модель можна видалити свайпом. Маршрути провайдерів з’являються після підключення в розділі «Підключення».",
    whoSpeaksFooter:
      "Один вибір для всіх середовищ. Моделі на пристрої завантажуються тут; маршрути провайдерів з’являються після додавання ключа в розділі «Підключення».",
    whoSearches: "Хто шукає",
    whoSearchesFooter:
      "Пошук виконується всередині відповіді, коли моделі потрібен веб. Провайдери з’являються після підключення в розділі «Підключення».",
    connectionsProviderFooter:
      "Ключі зберігаються у сховищі ключів пристрою й надсилаються лише відповідному провайдеру.",
  }),
  hi: define({
    freeEdition: "निजी ऑफ़लाइन · मुफ़्त",
    premiumPurchaseValue:
      "एक बार की खरीद। कोई सदस्यता या टोकन पर अतिरिक्त शुल्क नहीं; मॉडल और आवाज़ें आपकी अपनी कुंजियों पर चलती हैं और उनका बिल आपके प्रदाता देते हैं — इनमें से कुछ भी शामिल नहीं है।",
    premiumFreeKeepsWorking:
      "मुफ़्त संस्करण उपयोगी रहता है: ऑफ़लाइन बातचीत, इतिहास, बैकअप और मैन्युअल निर्यात उपलब्ध रहते हैं।",
    premiumBenefitProviders:
      "अपने क्लाउड प्रदाता और उनके बेहतर मॉडल इस्तेमाल करें",
    premiumCouncilBandCopy:
      "मॉडल काउंसिल आपकी अपनी प्रोवाइडर कुंजियों से विचार-विमर्श करती है।",
    premiumPromptBandCopy:
      "अपने प्रोवाइडर मॉडलों के लिए सिस्टम प्रॉम्प्ट तैयार करें।",
    premiumBenefitModes:
      "उत्तर मोड बदलें और कई मॉडलों वाला सर्वोच्च मोड विचार-विमर्श चलाएँ",
    premiumBenefitTools: "वेब खोज, चित्र और क्लाउड Drive सत्र जोड़ें",
    premiumBenefitKnowledge:
      "पिछले सत्रों की जानकारी और पोर्टेबल Markdown संग्रह इस्तेमाल करें",
    freeOfflineLanguagesStep: "अपनी भाषा चुनें",
    freeOfflineModelsStep: "आपके लिए सबसे अच्छा सेटअप",
    freeOfflineStartStep: "3 · बातचीत शुरू करें",
    freeOfflineSystemVoiceNote:
      "एक डाउनलोड की गई आवाज़ इन सभी भाषाओं को नहीं संभालती, इसलिए उत्तर फ़ोन की भाषा-अनुकूल सिस्टम आवाज़ इस्तेमाल करेंगे। सुनना और सोचना स्थानीय रहेगा।",
    freeOfflineStart: "शुरू करें",
    freeOfflinePremiumEscape:
      "प्रदाता API कुंजियाँ हैं? इसके बजाय प्रीमियम अनलॉक करें",
    settingsGroupConversation: "बातचीत",
    settingsGroupVoiceModels: "आवाज़",
    speakingPlayback: "प्लेबैक",
    startSpeaking: "बोलना शुरू करें",
    whoSpeaks: "कौन बोलता है",
    archivedConversations: "संग्रहीत बातचीत",
    modelStorageTitle: ({ size }) => `स्टोरेज · मॉडल में ${size}`,
    modelStorageFooter:
      "डाउनलोड, जाँच और चयन सोचने, सुनने और बोलने में होते हैं; यह सूची केवल जगह खाली करती है।",
    noDownloadedModels: "कोई डाउनलोड किया गया मॉडल नहीं",
    automaticSetup: "स्वचालित सेटअप",
    appearance: "दिखावट",
    homeScreen: "होम स्क्रीन",
    diagnostics: "निदान",
    usageStatsInTranscripts: "ट्रांसक्रिप्ट में उपयोग आँकड़े",
    settingsGroupPrivacyApp: "गोपनीयता और ऐप",
    webSearchNobody: "कोई नहीं",
    answeringModels: "उत्तर देने वाले मॉडल",
    answeringModelsFooter:
      "अधिकतम चार; होम स्क्रीन से तय करें कि अगला उत्तर कौन देगा। जो मॉडल अभी नहीं है, उसे यहीं डाउनलोड या कनेक्ट करें।",
    answeringModelSheetHint: "होम स्क्रीन की बाइलाइन से बदला जा सकता है।",
    whoListens: "कौन सुनता है",
    whoListensFooter:
      "हर रनटाइम के लिए एक चयन। सफल जाँच के बाद ही रेडियो खुलता है; मॉडल विफल हो तो जाँच वाला अंडा चटक जाता है। इंस्टॉल मॉडल को स्वाइप से हटाएँ। प्रदाता रूट कनेक्शन में जुड़ने के बाद दिखते हैं।",
    whoSpeaksFooter:
      "हर रनटाइम के लिए एक चयन। ऑन-डिवाइस डाउनलोड यहीं होते हैं; प्रदाता रूट की कनेक्शन में जुड़ने के बाद दिखते हैं।",
    whoSearches: "कौन खोजता है",
    whoSearchesFooter:
      "जब मॉडल को वेब की ज़रूरत होती है, खोज उत्तर के भीतर चलती है। प्रदाता कनेक्शन में जुड़ने के बाद दिखते हैं।",
    connectionsProviderFooter:
      "कुंजियाँ डिवाइस की कीचेन में रहती हैं और केवल अपने प्रदाता को भेजी जाती हैं।",
  }),
  es: define({
    freeEdition: "Privado sin conexión · Gratis",
    premiumPurchaseValue:
      "Compra única. Sin suscripción ni recargo por tokens; los modelos y las voces funcionan con tus propias claves y los facturan tus proveedores directamente — ninguno está incluido.",
    premiumFreeKeepsWorking:
      "La versión gratuita sigue siendo útil: conserva conversaciones sin conexión, historial, copias de seguridad y exportación manual.",
    premiumBenefitProviders:
      "Usa tus proveedores en la nube y sus modelos de mayor calidad",
    premiumCouncilBandCopy:
      "El Consejo de Modelos delibera con tus propias claves de proveedor.",
    premiumPromptBandCopy:
      "Da forma al prompt del sistema para tus propios modelos de proveedor.",
    premiumBenefitModes:
      "Cambia de modo de respuesta y ejecuta deliberaciones del Modo supremo con varios modelos",
    premiumBenefitTools:
      "Añade búsqueda web, imágenes y sesiones Drive en la nube",
    premiumBenefitKnowledge:
      "Usa conocimiento de sesiones anteriores y el archivo Markdown portátil",
    freeOfflineLanguagesStep: "Elige tu idioma",
    freeOfflineModelsStep: "Tu mejor configuración",
    freeOfflineStartStep: "3 · Empieza a hablar",
    freeOfflineSystemVoiceNote:
      "Ninguna voz descargada cubre todos estos idiomas, así que las respuestas usan la voz del sistema adecuada para cada idioma. La escucha y el razonamiento siguen siendo locales.",
    freeOfflineStart: "Empezar",
    freeOfflinePremiumEscape:
      "¿Tienes claves API de proveedor? Desbloquea Premium",
    settingsGroupConversation: "Conversación",
    settingsGroupVoiceModels: "Voz",
    speakingPlayback: "Reproducción",
    startSpeaking: "Empezar a hablar",
    whoSpeaks: "Quién habla",
    archivedConversations: "Conversaciones archivadas",
    modelStorageTitle: ({ size }) => `Almacenamiento · ${size} en modelos`,
    modelStorageFooter:
      "La descarga, la prueba y la elección están en Pensamiento, Escucha y Habla; esta lista solo libera espacio.",
    noDownloadedModels: "No hay modelos descargados",
    automaticSetup: "Configuración automática",
    appearance: "Apariencia",
    homeScreen: "Pantalla de inicio",
    diagnostics: "Diagnóstico",
    usageStatsInTranscripts: "Estadísticas de uso en transcripciones",
    settingsGroupPrivacyApp: "Privacidad y app",
    webSearchNobody: "Nadie",
    answeringModels: "Modelos que responden",
    answeringModelsFooter:
      "Hasta cuatro; desde la pantalla de inicio eliges quién responde el siguiente turno. Los modelos que aún no tengas se descargan o conectan aquí.",
    answeringModelSheetHint:
      "Se puede cambiar desde la línea de ruta de la pantalla de inicio.",
    whoListens: "Quién escucha",
    whoListensFooter:
      "Una opción para todos los entornos. La selección solo se desbloquea tras una prueba válida; si el modelo falla, el huevo de prueba se agrieta. Desliza para eliminar un modelo instalado. Las rutas de proveedores aparecen al conectarlas en Conexiones.",
    whoSpeaksFooter:
      "Una opción para todos los entornos. Las descargas en el dispositivo se hacen aquí; las rutas de proveedores aparecen cuando conectas su clave en Conexiones.",
    whoSearches: "Quién busca",
    whoSearchesFooter:
      "La búsqueda se ejecuta dentro de una respuesta cuando el modelo necesita la web. Los proveedores aparecen al conectarlos en Conexiones.",
    connectionsProviderFooter:
      "Las claves permanecen en el llavero del dispositivo y solo se envían a su proveedor.",
  }),
  fr: define({
    freeEdition: "Privé hors ligne · Gratuit",
    premiumPurchaseValue:
      "Achat unique. Sans abonnement ni marge sur les jetons ; les modèles et les voix utilisent vos propres clés et sont facturés directement par vos fournisseurs — aucun n’est inclus.",
    premiumFreeKeepsWorking:
      "La version gratuite reste utile : conversations hors ligne, historique, sauvegardes et export manuel restent disponibles.",
    premiumBenefitProviders:
      "Utilisez vos fournisseurs cloud et leurs modèles de meilleure qualité",
    premiumCouncilBandCopy:
      "Le Conseil des modèles délibère avec vos propres clés de fournisseur.",
    premiumPromptBandCopy:
      "Façonnez le prompt système pour vos propres modèles de fournisseur.",
    premiumBenefitModes:
      "Changez de mode de réponse et lancez une délibération Mode suprême multimodèle",
    premiumBenefitTools:
      "Ajoutez recherche web, images et sessions Drive dans le cloud",
    premiumBenefitKnowledge:
      "Utilisez les connaissances passées et l’archive Markdown portable",
    freeOfflineLanguagesStep: "Choisissez votre langue",
    freeOfflineModelsStep: "Votre meilleure configuration",
    freeOfflineStartStep: "3 · Commencez à parler",
    freeOfflineSystemVoiceNote:
      "Aucune voix téléchargée ne couvre toutes ces langues. Les réponses utilisent donc la voix système adaptée à chaque langue ; l’écoute et la réflexion restent locales.",
    freeOfflineStart: "Démarrer",
    freeOfflinePremiumEscape:
      "Des clés API fournisseur ? Débloquez plutôt Premium",
    settingsGroupConversation: "Conversation",
    settingsGroupVoiceModels: "Voix",
    speakingPlayback: "Lecture",
    startSpeaking: "Commencer à parler",
    whoSpeaks: "Qui parle",
    archivedConversations: "Conversations archivées",
    modelStorageTitle: ({ size }) => `Stockage · ${size} de modèles`,
    modelStorageFooter:
      "Le téléchargement, le test et le choix se font dans Réflexion, Écoute et Parole ; cette liste ne sert qu’à libérer de l’espace.",
    noDownloadedModels: "Aucun modèle téléchargé",
    automaticSetup: "Configuration automatique",
    appearance: "Apparence",
    homeScreen: "Écran d’accueil",
    diagnostics: "Diagnostic",
    usageStatsInTranscripts: "Statistiques d’usage dans les transcriptions",
    settingsGroupPrivacyApp: "Confidentialité et app",
    webSearchNobody: "Personne",
    answeringModels: "Modèles qui répondent",
    answeringModelsFooter:
      "Jusqu’à quatre ; l’écran d’accueil choisit qui répond au prochain tour. Un modèle manquant se télécharge ou se connecte ici.",
    answeringModelSheetHint:
      "Modifiable depuis la ligne de routage de l’écran d’accueil.",
    whoListens: "Qui écoute",
    whoListensFooter:
      "Un seul choix pour tous les environnements. La sélection ne s’active qu’après un test concluant ; si le modèle échoue, l’œuf de test se fissure. Balayez pour supprimer un modèle installé. Les routes fournisseur apparaissent après connexion dans Connexions.",
    whoSpeaksFooter:
      "Un seul choix pour tous les environnements. Les téléchargements sur l’appareil se font ici ; les routes fournisseur apparaissent dès que leur clé est connectée dans Connexions.",
    whoSearches: "Qui cherche",
    whoSearchesFooter:
      "La recherche s’exécute dans une réponse quand le modèle a besoin du Web. Les fournisseurs apparaissent après connexion dans Connexions.",
    connectionsProviderFooter:
      "Les clés restent dans le trousseau de l’appareil et ne sont envoyées qu’à leur propre fournisseur.",
  }),
  it: define({
    freeEdition: "Privato offline · Gratis",
    premiumPurchaseValue:
      "Acquisto una tantum. Nessun abbonamento o ricarico sui token; modelli e voci usano le tue chiavi e sono fatturati direttamente dai tuoi provider — nessuno è incluso.",
    premiumFreeKeepsWorking:
      "La versione gratuita resta utilizzabile: conversazioni offline, cronologia, backup ed esportazione manuale rimangono disponibili.",
    premiumBenefitProviders:
      "Usa i tuoi provider cloud e i loro modelli di qualità superiore",
    premiumCouncilBandCopy:
      "Il Consiglio dei modelli delibera con le tue chiavi provider.",
    premiumPromptBandCopy:
      "Modella il prompt di sistema per i tuoi modelli provider.",
    premiumBenefitModes:
      "Cambia modalità di risposta e avvia deliberazioni della Modalità suprema multimodello",
    premiumBenefitTools:
      "Aggiungi ricerca web, immagini e sessioni Drive nel cloud",
    premiumBenefitKnowledge:
      "Usa la conoscenza delle sessioni passate e l’archivio Markdown portatile",
    freeOfflineLanguagesStep: "Scegli la tua lingua",
    freeOfflineModelsStep: "La configurazione migliore per te",
    freeOfflineStartStep: "3 · Inizia a parlare",
    freeOfflineSystemVoiceNote:
      "Nessuna voce scaricata copre tutte queste lingue, quindi le risposte usano la voce di sistema adatta alla lingua. Ascolto e ragionamento restano locali.",
    freeOfflineStart: "Inizia",
    freeOfflinePremiumEscape: "Hai chiavi API del provider? Sblocca Premium",
    settingsGroupConversation: "Conversazione",
    settingsGroupVoiceModels: "Voce",
    speakingPlayback: "Riproduzione",
    startSpeaking: "Inizia a parlare",
    whoSpeaks: "Chi parla",
    archivedConversations: "Conversazioni archiviate",
    modelStorageTitle: ({ size }) => `Spazio · ${size} nei modelli`,
    modelStorageFooter:
      "Download, test e scelta si trovano in Pensiero, Ascolto e Voce; questo elenco serve solo a liberare spazio.",
    noDownloadedModels: "Nessun modello scaricato",
    automaticSetup: "Configurazione automatica",
    appearance: "Aspetto",
    homeScreen: "Schermata iniziale",
    diagnostics: "Diagnostica",
    usageStatsInTranscripts: "Statistiche d’uso nelle trascrizioni",
    settingsGroupPrivacyApp: "Privacy e app",
    webSearchNobody: "Nessuno",
    answeringModels: "Modelli che rispondono",
    answeringModelsFooter:
      "Fino a quattro; dalla schermata Home scegli chi risponde al prossimo turno. Un modello mancante viene scaricato o collegato qui.",
    answeringModelSheetHint:
      "Selezionabile dalla riga di instradamento nella schermata Home.",
    whoListens: "Chi ascolta",
    whoListensFooter:
      "Una scelta per ogni ambiente. La selezione si sblocca solo dopo un test valido; se il modello fallisce, l’uovo di test si incrina. Scorri per rimuovere un modello installato. Le route dei provider appaiono dopo il collegamento in Connessioni.",
    whoSpeaksFooter:
      "Una scelta per ogni ambiente. I download sul dispositivo avvengono qui; le route dei provider appaiono quando la loro chiave è collegata in Connessioni.",
    whoSearches: "Chi cerca",
    whoSearchesFooter:
      "La ricerca avviene all’interno di una risposta quando il modello necessita del Web. I provider appaiono dopo il collegamento in Connessioni.",
    connectionsProviderFooter:
      "Le chiavi restano nel portachiavi del dispositivo e vengono inviate solo al rispettivo provider.",
  }),
  pt: define({
    freeEdition: "Privado offline · Grátis",
    premiumPurchaseValue:
      "Compra única. Sem subscrição nem margem sobre tokens; os modelos e as vozes usam as suas próprias chaves e são faturados diretamente pelos seus fornecedores — nenhum está incluído.",
    premiumFreeKeepsWorking:
      "A versão gratuita continua útil: conversas offline, histórico, cópias de segurança e exportação manual permanecem disponíveis.",
    premiumBenefitProviders:
      "Use os seus fornecedores cloud e os respetivos modelos de maior qualidade",
    premiumCouncilBandCopy:
      "O Conselho de Modelos delibera com as suas próprias chaves de fornecedor.",
    premiumPromptBandCopy:
      "Molde o prompt de sistema para os seus próprios modelos de fornecedor.",
    premiumBenefitModes:
      "Alterne modos de resposta e execute deliberações do Modo Supremo com vários modelos",
    premiumBenefitTools:
      "Adicione pesquisa web, imagens e sessões Drive na cloud",
    premiumBenefitKnowledge:
      "Use conhecimento de sessões anteriores e o arquivo Markdown portátil",
    freeOfflineLanguagesStep: "Escolha o seu idioma",
    freeOfflineModelsStep: "A melhor configuração para si",
    freeOfflineStartStep: "3 · Comece a falar",
    freeOfflineSystemVoiceNote:
      "Nenhuma voz transferida abrange todos estes idiomas, por isso as respostas usam a voz do sistema adequada ao idioma. A audição e o raciocínio continuam locais.",
    freeOfflineStart: "Começar",
    freeOfflinePremiumEscape: "Tem chaves de API? Desbloqueie o Premium",
    settingsGroupConversation: "Conversa",
    settingsGroupVoiceModels: "Voz",
    speakingPlayback: "Reprodução",
    startSpeaking: "Começar a falar",
    whoSpeaks: "Quem fala",
    archivedConversations: "Conversas arquivadas",
    modelStorageTitle: ({ size }) => `Armazenamento · ${size} em modelos`,
    modelStorageFooter:
      "Transferência, teste e escolha estão em Pensar, Ouvir e Falar; esta lista apenas liberta espaço.",
    noDownloadedModels: "Sem modelos transferidos",
    automaticSetup: "Configuração automática",
    appearance: "Aspeto",
    homeScreen: "Ecrã inicial",
    diagnostics: "Diagnóstico",
    usageStatsInTranscripts: "Estatísticas de utilização nas transcrições",
    settingsGroupPrivacyApp: "Privacidade e app",
    webSearchNobody: "Ninguém",
    answeringModels: "Modelos que respondem",
    answeringModelsFooter:
      "Até quatro; no ecrã inicial escolhe quem responde a seguir. Um modelo em falta é transferido ou ligado aqui.",
    answeringModelSheetHint:
      "Pode ser alterado na linha de encaminhamento do ecrã inicial.",
    whoListens: "Quem ouve",
    whoListensFooter:
      "Uma escolha para todos os ambientes. A seleção só fica disponível após um teste válido; se o modelo falhar, o ovo de teste racha. Deslize para remover um modelo instalado. As rotas dos fornecedores aparecem depois da ligação em Ligações.",
    whoSpeaksFooter:
      "Uma escolha para todos os ambientes. As transferências no dispositivo acontecem aqui; as rotas dos fornecedores aparecem quando a chave é ligada em Ligações.",
    whoSearches: "Quem pesquisa",
    whoSearchesFooter:
      "A pesquisa ocorre dentro da resposta quando o modelo precisa da Web. Os fornecedores aparecem depois da ligação em Ligações.",
    connectionsProviderFooter:
      "As chaves ficam no porta-chaves do dispositivo e só são enviadas ao respetivo fornecedor.",
  }),
  ptBR: define({
    freeEdition: "Privado offline · Grátis",
    premiumPurchaseValue:
      "Compra única. Sem assinatura nem acréscimo sobre tokens; os modelos e as vozes usam as suas próprias chaves e são cobrados diretamente pelos seus provedores — nenhum está incluído.",
    premiumFreeKeepsWorking:
      "A versão grátis continua útil: conversas offline, histórico, backups e exportação manual permanecem disponíveis.",
    premiumBenefitProviders:
      "Use seus provedores em nuvem e os modelos de maior qualidade deles",
    premiumCouncilBandCopy:
      "O Conselho de Modelos delibera com as suas próprias chaves de provedor.",
    premiumPromptBandCopy:
      "Molde o prompt de sistema para os seus próprios modelos de provedor.",
    premiumBenefitModes:
      "Alterne modos de resposta e execute deliberações do Modo Supremo com vários modelos",
    premiumBenefitTools:
      "Adicione pesquisa na web, imagens e sessões Drive na nuvem",
    premiumBenefitKnowledge:
      "Use conhecimento de sessões anteriores e o arquivo Markdown portátil",
    freeOfflineLanguagesStep: "Escolha seu idioma",
    freeOfflineModelsStep: "A melhor configuração para você",
    freeOfflineStartStep: "3 · Comece a falar",
    freeOfflineSystemVoiceNote:
      "Nenhuma voz baixada cobre todos esses idiomas, então as respostas usam a voz do sistema adequada ao idioma. A escuta e o raciocínio continuam locais.",
    freeOfflineStart: "Começar",
    freeOfflinePremiumEscape: "Tem chaves de API? Desbloqueie o Premium",
    settingsGroupConversation: "Conversa",
    settingsGroupVoiceModels: "Voz",
    speakingPlayback: "Reprodução",
    startSpeaking: "Começar a falar",
    whoSpeaks: "Quem fala",
    archivedConversations: "Conversas arquivadas",
    modelStorageTitle: ({ size }) => `Armazenamento · ${size} em modelos`,
    modelStorageFooter:
      "Download, teste e escolha ficam em Pensar, Ouvir e Falar; esta lista apenas libera espaço.",
    noDownloadedModels: "Nenhum modelo baixado",
    automaticSetup: "Configuração automática",
    appearance: "Aparência",
    homeScreen: "Tela inicial",
    diagnostics: "Diagnóstico",
    usageStatsInTranscripts: "Estatísticas de uso nas transcrições",
    settingsGroupPrivacyApp: "Privacidade e app",
    webSearchNobody: "Ninguém",
    answeringModels: "Modelos que respondem",
    answeringModelsFooter:
      "Até quatro; na tela inicial você escolhe quem responde o próximo turno. Um modelo que ainda não existe é baixado ou conectado aqui.",
    answeringModelSheetHint:
      "Pode ser alterado pela linha de rota da tela inicial.",
    whoListens: "Quem ouve",
    whoListensFooter:
      "Uma escolha para todos os ambientes. A seleção só é liberada após um teste válido; se o modelo falhar, o ovo de teste racha. Deslize para remover um modelo instalado. As rotas dos provedores aparecem depois da conexão em Conexões.",
    whoSpeaksFooter:
      "Uma escolha para todos os ambientes. Os downloads no dispositivo acontecem aqui; as rotas dos provedores aparecem quando a chave é conectada em Conexões.",
    whoSearches: "Quem pesquisa",
    whoSearchesFooter:
      "A pesquisa acontece dentro da resposta quando o modelo precisa da Web. Os provedores aparecem depois da conexão em Conexões.",
    connectionsProviderFooter:
      "As chaves ficam no chaveiro do dispositivo e só são enviadas ao respectivo provedor.",
  }),
  ru: define({
    freeEdition: "Приватно и офлайн · Бесплатно",
    premiumPurchaseValue:
      "Разовая покупка. Без подписки и наценки на токены; модели и голоса работают через ваши собственные ключи и оплачиваются напрямую вашим провайдерам — ничего из этого не входит в цену.",
    premiumFreeKeepsWorking:
      "Бесплатная версия остаётся полезной: офлайн-разговоры, история, резервные копии и ручной экспорт доступны.",
    premiumBenefitProviders:
      "Используйте своих облачных провайдеров и их более качественные модели",
    premiumCouncilBandCopy:
      "Совет моделей совещается через ваши собственные ключи провайдеров.",
    premiumPromptBandCopy:
      "Настройте системный промпт для моделей ваших провайдеров.",
    premiumBenefitModes:
      "Переключайте режимы ответа и запускайте обсуждения в Суперрежиме для нескольких моделей",
    premiumBenefitTools:
      "Добавьте веб-поиск, изображения и облачные сеансы Drive",
    premiumBenefitKnowledge:
      "Используйте знания прошлых сеансов и переносимый Markdown-архив",
    freeOfflineLanguagesStep: "Выберите свой язык",
    freeOfflineModelsStep: "Лучшая конфигурация для вас",
    freeOfflineStartStep: "3 · Начните разговор",
    freeOfflineSystemVoiceNote:
      "Ни один загруженный голос не охватывает все эти языки, поэтому ответы используют системный голос телефона для нужного языка. Прослушивание и мышление остаются локальными.",
    freeOfflineStart: "Начать",
    freeOfflinePremiumEscape:
      "Есть API-ключи провайдера? Разблокируйте Premium",
    settingsGroupConversation: "Разговор",
    settingsGroupVoiceModels: "Голос",
    speakingPlayback: "Воспроизведение",
    startSpeaking: "Начать озвучивание",
    whoSpeaks: "Кто говорит",
    archivedConversations: "Архивированные разговоры",
    modelStorageTitle: ({ size }) => `Хранилище · ${size} в моделях`,
    modelStorageFooter:
      "Загрузка, проверка и выбор находятся в разделах Мышление, Слушание и Речь; этот список только освобождает место.",
    noDownloadedModels: "Нет загруженных моделей",
    automaticSetup: "Автоматическая настройка",
    appearance: "Оформление",
    homeScreen: "Главный экран",
    diagnostics: "Диагностика",
    usageStatsInTranscripts: "Статистика использования в расшифровках",
    settingsGroupPrivacyApp: "Конфиденциальность и приложение",
    webSearchNobody: "Никто",
    answeringModels: "Модели, которые отвечают",
    answeringModelsFooter:
      "До четырёх; на главном экране можно выбрать, кто ответит следующим. Недостающую модель можно скачать или подключить здесь.",
    answeringModelSheetHint:
      "Переключается через строку маршрута на главном экране.",
    whoListens: "Кто слушает",
    whoListensFooter:
      "Один выбор для всех сред. Выбор доступен только после успешной проверки; при сбое модели тестовое яйцо трескается. Установленную модель можно удалить свайпом. Маршруты провайдеров появляются после подключения в разделе «Подключения».",
    whoSpeaksFooter:
      "Один выбор для всех сред. Модели для устройства скачиваются здесь; маршруты провайдеров появляются после добавления ключа в разделе «Подключения».",
    whoSearches: "Кто ищет",
    whoSearchesFooter:
      "Поиск выполняется внутри ответа, когда модели нужен Интернет. Провайдеры появляются после подключения в разделе «Подключения».",
    connectionsProviderFooter:
      "Ключи остаются в связке ключей устройства и отправляются только соответствующему провайдеру.",
  }),
  "zh-CN": define({
    freeEdition: "私密离线 · 免费",
    premiumPurchaseValue:
      "一次购买，无订阅、无 Token 加价；模型和语音使用你自己的密钥，由提供商直接计费——均不包含在内。",
    premiumFreeKeepsWorking:
      "免费版仍可完整使用：离线对话、历史记录、备份和手动导出均会保留。",
    premiumBenefitProviders: "使用你的云端提供商及其更高质量的模型",
    premiumCouncilBandCopy:
      "模型议会使用你自己的提供商密钥进行商议。",
    premiumPromptBandCopy:
      "为你自己的提供商模型定制系统提示词。",
    premiumBenefitModes: "切换回复模式并运行多模型终极模式推演",
    premiumBenefitTools: "加入网页搜索、图片和云端 Drive 会话",
    premiumBenefitKnowledge: "使用过往对话知识和可携带的 Markdown 档案",
    freeOfflineLanguagesStep: "选择你的语言",
    freeOfflineModelsStep: "最适合你的配置",
    freeOfflineStartStep: "3 · 开始对话",
    freeOfflineSystemVoiceNote:
      "没有一个已下载语音覆盖全部所选语言，因此回复会使用手机对应语言的系统语音。聆听和思考仍在本地完成。",
    freeOfflineStart: "开始",
    freeOfflinePremiumEscape: "已有服务商 API 密钥？改为解锁 Premium",
    settingsGroupConversation: "对话",
    settingsGroupVoiceModels: "语音",
    speakingPlayback: "播放",
    startSpeaking: "开始朗读",
    whoSpeaks: "谁来朗读",
    archivedConversations: "已归档的对话",
    modelStorageTitle: ({ size }) => `存储空间 · 模型占用 ${size}`,
    modelStorageFooter:
      "下载、测试和选择位于思考、聆听与朗读中；此列表只用于释放空间。",
    noDownloadedModels: "没有已下载的模型",
    automaticSetup: "自动设置",
    appearance: "外观",
    homeScreen: "主屏幕",
    diagnostics: "诊断",
    usageStatsInTranscripts: "转录中的使用统计",
    settingsGroupPrivacyApp: "隐私与应用",
    webSearchNobody: "无人",
    answeringModels: "回答模型",
    answeringModelsFooter:
      "最多四个；可在主屏幕切换下一轮由谁回答。尚未拥有的模型可直接在这里下载或连接。",
    answeringModelSheetHint: "可从主屏幕的路线栏切换。",
    whoListens: "谁来聆听",
    whoListensFooter:
      "所有运行环境共用一个选择。只有通过可用性测试后才能选择；模型失败时，测试蛋会裂开。已安装模型可滑动移除。提供商路线在“连接”中接入后出现。",
    whoSpeaksFooter:
      "所有运行环境共用一个选择。设备端模型直接在这里下载；提供商路线在“连接”中加入密钥后出现。",
    whoSearches: "谁来搜索",
    whoSearchesFooter:
      "当模型需要网页时，搜索会在回答过程中运行。提供商在“连接”中接入后出现。",
    connectionsProviderFooter:
      "密钥保留在设备钥匙串中，并且只发送给对应的提供商。",
  }),
  ar: define({
    freeEdition: "خاص بلا اتصال · مجاني",
    premiumPurchaseValue:
      "شراء لمرة واحدة. بلا اشتراك أو هامش على الرموز؛ تعمل النماذج والأصوات بمفاتيحك الخاصة ويحاسبك مزودوك عليها مباشرة — لا شيء منها مضمّن.",
    premiumFreeKeepsWorking:
      "يبقى الإصدار المجاني مفيدًا: تظل المحادثات بلا اتصال والسجل والنسخ الاحتياطية والتصدير اليدوي متاحة.",
    premiumBenefitProviders: "استخدم مزودي السحابة لديك ونماذجهم الأعلى جودة",
    premiumCouncilBandCopy:
      "مجلس النماذج يتداول عبر مفاتيح المزودين الخاصة بك.",
    premiumPromptBandCopy:
      "صِغ موجه النظام لنماذج مزوديك الخاصة.",
    premiumBenefitModes:
      "بدّل أوضاع الرد وشغّل مداولات الوضع الفائق بين عدة نماذج",
    premiumBenefitTools: "أضف بحث الويب والصور وجلسات Drive السحابية",
    premiumBenefitKnowledge:
      "استخدم معرفة الجلسات السابقة وأرشيف Markdown القابل للنقل",
    freeOfflineLanguagesStep: "اختر لغتك",
    freeOfflineModelsStep: "أفضل إعداد لك",
    freeOfflineStartStep: "3 · ابدأ الحديث",
    freeOfflineSystemVoiceNote:
      "لا يغطي صوت منزّل واحد كل هذه اللغات، لذا تستخدم الردود صوت النظام المناسب للغة على الهاتف. يبقى الاستماع والتفكير محليين.",
    freeOfflineStart: "ابدأ",
    freeOfflinePremiumEscape:
      "لديك مفاتيح API لمزوّد؟ افتح Premium بدلاً من ذلك",
    settingsGroupConversation: "المحادثة",
    settingsGroupVoiceModels: "الصوت",
    speakingPlayback: "التشغيل",
    startSpeaking: "بدء التحدث",
    whoSpeaks: "من يتحدث",
    archivedConversations: "المحادثات المؤرشفة",
    modelStorageTitle: ({ size }) => `التخزين · ${size} في النماذج`,
    modelStorageFooter:
      "يتم التنزيل والاختبار والاختيار في التفكير والاستماع والتحدث؛ هذه القائمة تحرر المساحة فقط.",
    noDownloadedModels: "لا توجد نماذج منزلة",
    automaticSetup: "الإعداد التلقائي",
    appearance: "المظهر",
    homeScreen: "الشاشة الرئيسية",
    diagnostics: "التشخيصات",
    usageStatsInTranscripts: "إحصاءات الاستخدام في النصوص",
    settingsGroupPrivacyApp: "الخصوصية والتطبيق",
    webSearchNobody: "لا أحد",
    answeringModels: "نماذج الإجابة",
    answeringModelsFooter:
      "حتى أربعة؛ من الشاشة الرئيسية تختار من يجيب في الدور التالي. يُنزّل النموذج غير المتوفر أو يُوصل هنا مباشرة.",
    answeringModelSheetHint:
      "يمكن تبديله من سطر المسار في الشاشة الرئيسية.",
    whoListens: "من يستمع",
    whoListensFooter:
      "اختيار واحد لكل بيئات التشغيل. لا يتاح الاختيار إلا بعد اختبار ناجح؛ وعند فشل النموذج تتشقق بيضة الاختبار. اسحب لإزالة نموذج مثبت. تظهر مسارات المزودين بعد توصيلها في الاتصالات.",
    whoSpeaksFooter:
      "اختيار واحد لكل بيئات التشغيل. تتم تنزيلات الجهاز هنا؛ وتظهر مسارات المزودين عند توصيل مفاتيحها في الاتصالات.",
    whoSearches: "من يبحث",
    whoSearchesFooter:
      "يعمل البحث داخل الإجابة عندما يحتاج النموذج إلى الويب. يظهر المزودون بعد توصيلهم في الاتصالات.",
    connectionsProviderFooter:
      "تبقى المفاتيح في سلسلة مفاتيح الجهاز ولا تُرسل إلا إلى مزودها.",
  }),
  ja: define({
    freeEdition: "プライベート・オフライン · 無料",
    premiumPurchaseValue:
      "買い切りです。サブスクリプションやトークンへの上乗せはありません。モデルと音声はご自身のキーで動作し、利用料は各プロバイダーから直接請求されます — いずれも購入には含まれません。",
    premiumFreeKeepsWorking:
      "無料版も使い続けられます。オフライン会話、履歴、バックアップ、手動エクスポートは利用可能です。",
    premiumBenefitProviders: "お使いのクラウドプロバイダーと高品質モデルを利用",
    premiumCouncilBandCopy:
      "モデル評議会は、あなた自身のプロバイダーキーで審議します。",
    premiumPromptBandCopy:
      "自分のプロバイダーモデル向けにシステムプロンプトを調整できます。",
    premiumBenefitModes:
      "応答モードを切り替え、複数モデルの究極モード検討を実行",
    premiumBenefitTools: "ウェブ検索、画像、クラウド Drive セッションを追加",
    premiumBenefitKnowledge:
      "過去セッションの知識と持ち運べる Markdown アーカイブを利用",
    freeOfflineLanguagesStep: "言語を選ぶ",
    freeOfflineModelsStep: "あなたに最適なセットアップ",
    freeOfflineStartStep: "3 · 会話を始める",
    freeOfflineSystemVoiceNote:
      "選択したすべての言語を扱える単一のダウンロード音声がないため、返信には言語対応のシステム音声を使います。聞き取りと思考はローカルのままです。",
    freeOfflineStart: "開始",
    freeOfflinePremiumEscape:
      "プロバイダーの API キーをお持ちですか？Premium を解放",
    settingsGroupConversation: "会話",
    settingsGroupVoiceModels: "音声",
    speakingPlayback: "再生",
    startSpeaking: "読み上げを開始",
    whoSpeaks: "読み上げる音声",
    archivedConversations: "アーカイブ済みの会話",
    modelStorageTitle: ({ size }) => `ストレージ · モデル ${size}`,
    modelStorageFooter:
      "ダウンロード、テスト、選択は「思考」「聞き取り」「読み上げ」で行います。この一覧は空き容量を増やすためだけのものです。",
    noDownloadedModels: "ダウンロード済みモデルはありません",
    automaticSetup: "自動セットアップ",
    appearance: "外観",
    homeScreen: "ホーム画面",
    diagnostics: "診断",
    usageStatsInTranscripts: "文字起こしに利用統計を表示",
    settingsGroupPrivacyApp: "プライバシーとアプリ",
    webSearchNobody: "誰も選ばない",
    answeringModels: "回答するモデル",
    answeringModelsFooter:
      "最大4つ。ホーム画面で次の応答を担当するモデルを切り替えます。未導入のモデルはここでダウンロードまたは接続できます。",
    answeringModelSheetHint:
      "ホーム画面のルート表示から切り替えられます。",
    whoListens: "聞き取る方法",
    whoListensFooter:
      "すべての実行環境から1つを選びます。利用可能なテストに合格すると選択でき、失敗時はテストの卵にひびが入ります。インストール済みモデルはスワイプで削除できます。プロバイダー経路は「接続」で設定すると表示されます。",
    whoSpeaksFooter:
      "すべての実行環境から1つを選びます。端末上のダウンロードはここで行い、プロバイダー経路は「接続」でキーを設定すると表示されます。",
    whoSearches: "検索する方法",
    whoSearchesFooter:
      "モデルがウェブを必要と判断すると、回答の中で検索が実行されます。プロバイダーは「接続」で設定すると表示されます。",
    connectionsProviderFooter:
      "キーは端末のキーチェーンに保存され、対応するプロバイダーにのみ送信されます。",
  }),
  hu: define({
    freeEdition: "Privát offline · Ingyenes",
    premiumPurchaseValue:
      "Egyszeri vásárlás. Nincs előfizetés vagy tokenfelár; a modellek és hangok az Ön saját kulcsaival futnak, és közvetlenül a szolgáltatói számlázzák őket — egyik sincs benne az árban.",
    premiumFreeKeepsWorking:
      "Az ingyenes változat használható marad: az offline beszélgetések, előzmények, mentések és kézi export elérhetők.",
    premiumBenefitProviders:
      "Használja saját felhőszolgáltatóit és jobb minőségű modelljeiket",
    premiumCouncilBandCopy:
      "A Modelltanács a saját szolgáltatói kulcsaiddal tanácskozik.",
    premiumPromptBandCopy:
      "Alakítsd a rendszerpromptot a saját szolgáltatói modelljeidhez.",
    premiumBenefitModes:
      "Váltson válaszmódot, és indítson többmodelles Szuper mód-mérlegelést",
    premiumBenefitTools:
      "Adjon hozzá webes keresést, képeket és felhős Drive-munkameneteket",
    premiumBenefitKnowledge:
      "Használja a korábbi munkamenetek tudását és a hordozható Markdown-archívumot",
    freeOfflineLanguagesStep: "Válassza ki a nyelvét",
    freeOfflineModelsStep: "Az Ön legjobb beállítása",
    freeOfflineStartStep: "3 · Kezdjen beszélgetni",
    freeOfflineSystemVoiceNote:
      "Egyetlen letöltött hang sem fedi le az összes nyelvet, ezért a válaszok a telefon nyelvhez illő rendszerhangját használják. A hallás és gondolkodás helyben marad.",
    freeOfflineStart: "Indítás",
    freeOfflinePremiumEscape:
      "Van szolgáltatói API-kulcsa? Oldja fel inkább a Premiumot",
    settingsGroupConversation: "Beszélgetés",
    settingsGroupVoiceModels: "Hang",
    speakingPlayback: "Lejátszás",
    startSpeaking: "Beszéd indítása",
    whoSpeaks: "Ki beszél",
    archivedConversations: "Archivált beszélgetések",
    modelStorageTitle: ({ size }) => `Tárhely · ${size} modell`,
    modelStorageFooter:
      "A letöltés, tesztelés és választás a Gondolkodás, Hallgatás és Beszéd alatt található; ez a lista csak helyet szabadít fel.",
    noDownloadedModels: "Nincsenek letöltött modellek",
    automaticSetup: "Automatikus beállítás",
    appearance: "Megjelenés",
    homeScreen: "Kezdőképernyő",
    diagnostics: "Diagnosztika",
    usageStatsInTranscripts: "Használati statisztika az átiratokban",
    settingsGroupPrivacyApp: "Adatvédelem és alkalmazás",
    webSearchNobody: "Senki",
    answeringModels: "Válaszoló modellek",
    answeringModelsFooter:
      "Legfeljebb négy; a kezdőképernyőn váltható, ki válaszoljon legközelebb. A hiányzó modell itt tölthető le vagy kapcsolható össze.",
    answeringModelSheetHint:
      "A kezdőképernyő útvonal-sorából váltható.",
    whoListens: "Ki hallgat",
    whoListensFooter:
      "Egy választás minden futtatási környezethez. A választás csak sikeres teszt után nyílik meg; hiba esetén a teszttojás megreped. A telepített modell csúsztatással törölhető. A szolgáltatói útvonalak a Kapcsolatok alatt jelennek meg csatlakoztatás után.",
    whoSpeaksFooter:
      "Egy választás minden futtatási környezethez. Az eszközre töltés itt történik; a szolgáltatói útvonalak a kulcs Kapcsolatok alatti hozzáadása után jelennek meg.",
    whoSearches: "Ki keres",
    whoSearchesFooter:
      "A keresés a válaszon belül fut, amikor a modellnek szüksége van a webre. A szolgáltatók a Kapcsolatok alatt jelennek meg csatlakoztatás után.",
    connectionsProviderFooter:
      "A kulcsok az eszköz kulcstartójában maradnak, és csak a saját szolgáltatójukhoz kerülnek.",
  }),
  cs: define({
    freeEdition: "Soukromě offline · Zdarma",
    premiumPurchaseValue:
      "Jednorázový nákup. Bez předplatného a přirážky za tokeny; modely a hlasy běží na vašich vlastních klíčích a účtují je přímo vaši poskytovatelé — žádné nejsou v ceně.",
    premiumFreeKeepsWorking:
      "Bezplatná verze zůstává užitečná: offline konverzace, historie, zálohy a ruční export zůstávají dostupné.",
    premiumBenefitProviders:
      "Používejte své cloudové poskytovatele a jejich kvalitnější modely",
    premiumCouncilBandCopy:
      "Rada modelů rokuje přes vaše vlastní klíče poskytovatelů.",
    premiumPromptBandCopy:
      "Upravte systémový prompt pro modely vašich poskytovatelů.",
    premiumBenefitModes:
      "Přepínejte režimy odpovědí a spusťte poradu více modelů v Superrežimu",
    premiumBenefitTools:
      "Přidejte vyhledávání na webu, obrázky a cloudové relace Drive",
    premiumBenefitKnowledge:
      "Používejte znalosti minulých relací a přenosný archiv Markdown",
    freeOfflineLanguagesStep: "Vyberte svůj jazyk",
    freeOfflineModelsStep: "Nejlepší nastavení pro vás",
    freeOfflineStartStep: "3 · Začněte mluvit",
    freeOfflineSystemVoiceNote:
      "Jeden stažený hlas nepokrývá všechny tyto jazyky, proto odpovědi používají systémový hlas telefonu pro daný jazyk. Poslech a myšlení zůstávají místní.",
    freeOfflineStart: "Začít",
    freeOfflinePremiumEscape: "Máte API klíče poskytovatele? Odemkněte Premium",
    settingsGroupConversation: "Konverzace",
    settingsGroupVoiceModels: "Hlas",
    speakingPlayback: "Přehrávání",
    startSpeaking: "Začít mluvit",
    whoSpeaks: "Kdo mluví",
    archivedConversations: "Archivované konverzace",
    modelStorageTitle: ({ size }) => `Úložiště · ${size} v modelech`,
    modelStorageFooter:
      "Stahování, testování a výběr jsou v částech Myšlení, Poslech a Mluvení; tento seznam pouze uvolňuje místo.",
    noDownloadedModels: "Žádné stažené modely",
    automaticSetup: "Automatické nastavení",
    appearance: "Vzhled",
    homeScreen: "Domovská obrazovka",
    diagnostics: "Diagnostika",
    usageStatsInTranscripts: "Statistiky využití v přepisech",
    settingsGroupPrivacyApp: "Soukromí a aplikace",
    webSearchNobody: "Nikdo",
    answeringModels: "Odpovídající modely",
    answeringModelsFooter:
      "Až čtyři; na domovské obrazovce lze přepnout, kdo odpoví jako další. Chybějící model se stáhne nebo připojí přímo zde.",
    answeringModelSheetHint:
      "Lze přepnout z řádku trasy na domovské obrazovce.",
    whoListens: "Kdo poslouchá",
    whoListensFooter:
      "Jedna volba pro všechna prostředí. Výběr se odemkne až po úspěšném testu; při selhání modelu testovací vejce praskne. Nainstalovaný model odstraníte přejetím. Trasy poskytovatelů se objeví po připojení v části Připojení.",
    whoSpeaksFooter:
      "Jedna volba pro všechna prostředí. Stahování do zařízení probíhá zde; trasy poskytovatelů se objeví po přidání klíče v části Připojení.",
    whoSearches: "Kdo hledá",
    whoSearchesFooter:
      "Vyhledávání běží uvnitř odpovědi, když model potřebuje web. Poskytovatelé se objeví po připojení v části Připojení.",
    connectionsProviderFooter:
      "Klíče zůstávají v klíčence zařízení a odesílají se pouze příslušnému poskytovateli.",
  }),
  pl: define({
    freeEdition: "Prywatnie offline · Bezpłatnie",
    premiumPurchaseValue:
      "Jednorazowy zakup. Bez subskrypcji i narzutu na tokeny; modele i głosy działają na Twoich własnych kluczach i rozliczają je bezpośrednio Twoi dostawcy — żaden nie jest wliczony.",
    premiumFreeKeepsWorking:
      "Wersja bezpłatna pozostaje użyteczna: rozmowy offline, historia, kopie zapasowe i ręczny eksport są nadal dostępne.",
    premiumBenefitProviders:
      "Korzystaj z własnych dostawców chmurowych i ich lepszych modeli",
    premiumCouncilBandCopy:
      "Rada modeli obraduje na twoich własnych kluczach dostawców.",
    premiumPromptBandCopy:
      "Kształtuj prompt systemowy dla modeli twoich dostawców.",
    premiumBenefitModes:
      "Przełączaj tryby odpowiedzi i uruchamiaj narady Supertrybu wielu modeli",
    premiumBenefitTools:
      "Dodaj wyszukiwanie w sieci, obrazy i chmurowe sesje Drive",
    premiumBenefitKnowledge:
      "Korzystaj z wiedzy z poprzednich sesji i przenośnego archiwum Markdown",
    freeOfflineLanguagesStep: "Wybierz swój język",
    freeOfflineModelsStep: "Najlepsza konfiguracja dla Ciebie",
    freeOfflineStartStep: "3 · Zacznij rozmawiać",
    freeOfflineSystemVoiceNote:
      "Żaden pobrany głos nie obsługuje wszystkich tych języków, więc odpowiedzi użyją odpowiedniego głosu systemowego telefonu. Słuchanie i myślenie pozostają lokalne.",
    freeOfflineStart: "Rozpocznij",
    freeOfflinePremiumEscape: "Masz klucze API dostawcy? Odblokuj Premium",
    settingsGroupConversation: "Rozmowa",
    settingsGroupVoiceModels: "Głos",
    speakingPlayback: "Odtwarzanie",
    startSpeaking: "Zacznij mówić",
    whoSpeaks: "Kto mówi",
    archivedConversations: "Zarchiwizowane rozmowy",
    modelStorageTitle: ({ size }) => `Pamięć · ${size} w modelach`,
    modelStorageFooter:
      "Pobieranie, testowanie i wybór są w sekcjach Myślenie, Słuchanie i Mówienie; ta lista tylko zwalnia miejsce.",
    noDownloadedModels: "Brak pobranych modeli",
    automaticSetup: "Automatyczna konfiguracja",
    appearance: "Wygląd",
    homeScreen: "Ekran główny",
    diagnostics: "Diagnostyka",
    usageStatsInTranscripts: "Statystyki użycia w transkrypcjach",
    settingsGroupPrivacyApp: "Prywatność i aplikacja",
    webSearchNobody: "Nikt",
    answeringModels: "Modele odpowiadające",
    answeringModelsFooter:
      "Maksymalnie cztery; na ekranie głównym wybierasz, kto odpowie następny. Brakujący model można pobrać lub połączyć tutaj.",
    answeringModelSheetHint:
      "Można przełączyć z wiersza trasy na ekranie głównym.",
    whoListens: "Kto słucha",
    whoListensFooter:
      "Jeden wybór dla wszystkich środowisk. Wybór odblokowuje się dopiero po udanym teście; po awarii modelu jajko testowe pęka. Zainstalowany model usuwa się przesunięciem. Trasy dostawców pojawiają się po połączeniu w sekcji Połączenia.",
    whoSpeaksFooter:
      "Jeden wybór dla wszystkich środowisk. Pobieranie na urządzenie odbywa się tutaj; trasy dostawców pojawiają się po dodaniu klucza w sekcji Połączenia.",
    whoSearches: "Kto wyszukuje",
    whoSearchesFooter:
      "Wyszukiwanie działa wewnątrz odpowiedzi, gdy model potrzebuje sieci. Dostawcy pojawiają się po połączeniu w sekcji Połączenia.",
    connectionsProviderFooter:
      "Klucze pozostają w pęku kluczy urządzenia i są wysyłane wyłącznie do właściwego dostawcy.",
  }),
  tr: define({
    freeEdition: "Özel çevrimdışı · Ücretsiz",
    premiumPurchaseValue:
      "Tek seferlik satın alma. Abonelik veya token fiyatına ek ücret yoktur; modeller ve sesler kendi anahtarlarınızla çalışır ve doğrudan sağlayıcılarınızca faturalandırılır — hiçbiri dahil değildir.",
    premiumFreeKeepsWorking:
      "Ücretsiz sürüm kullanılabilir kalır: çevrimdışı konuşmalar, geçmiş, yedekler ve elle dışa aktarma sunulur.",
    premiumBenefitProviders:
      "Kendi bulut sağlayıcılarınızı ve daha kaliteli modellerini kullanın",
    premiumCouncilBandCopy:
      "Model Konseyi kendi sağlayıcı anahtarlarınla müzakere eder.",
    premiumPromptBandCopy:
      "Kendi sağlayıcı modellerin için sistem istemini biçimlendir.",
    premiumBenefitModes:
      "Yanıt modlarını değiştirin ve çok modelli Süper Mod değerlendirmesi çalıştırın",
    premiumBenefitTools:
      "Web araması, görseller ve bulut Drive oturumları ekleyin",
    premiumBenefitKnowledge:
      "Geçmiş oturum bilgisini ve taşınabilir Markdown arşivini kullanın",
    freeOfflineLanguagesStep: "Dilinizi seçin",
    freeOfflineModelsStep: "Sizin için en iyi kurulum",
    freeOfflineStartStep: "3 · Konuşmaya başlayın",
    freeOfflineSystemVoiceNote:
      "Tek bir indirilen ses bu dillerin tümünü kapsamıyor; bu nedenle yanıtlar telefonun dile uygun sistem sesini kullanır. Dinleme ve düşünme yerel kalır.",
    freeOfflineStart: "Başlat",
    freeOfflinePremiumEscape:
      "Sağlayıcı API anahtarlarınız var mı? Bunun yerine Premium'un kilidini açın",
    settingsGroupConversation: "Konuşma",
    settingsGroupVoiceModels: "Ses",
    speakingPlayback: "Oynatma",
    startSpeaking: "Konuşmaya başla",
    whoSpeaks: "Kim konuşuyor",
    archivedConversations: "Arşivlenmiş konuşmalar",
    modelStorageTitle: ({ size }) => `Depolama · modellerde ${size}`,
    modelStorageFooter:
      "İndirme, test ve seçim Düşünme, Dinleme ve Konuşma bölümlerindedir; bu liste yalnızca alan açar.",
    noDownloadedModels: "İndirilmiş model yok",
    automaticSetup: "Otomatik kurulum",
    appearance: "Görünüm",
    homeScreen: "Ana ekran",
    diagnostics: "Tanılama",
    usageStatsInTranscripts: "Dökümlerde kullanım istatistikleri",
    settingsGroupPrivacyApp: "Gizlilik ve uygulama",
    webSearchNobody: "Hiç kimse",
    answeringModels: "Yanıtlayan modeller",
    answeringModelsFooter:
      "En fazla dört; sıradaki yanıtı kimin vereceği ana ekrandan değiştirilir. Eksik bir model burada indirilir veya bağlanır.",
    answeringModelSheetHint:
      "Ana ekrandaki rota satırından değiştirilebilir.",
    whoListens: "Kim dinliyor",
    whoListensFooter:
      "Tüm çalışma ortamları için tek seçim. Seçim yalnızca başarılı bir testten sonra açılır; model başarısız olursa test yumurtası çatlar. Yüklü modeli kaydırarak kaldırın. Sağlayıcı rotaları Bağlantılar altında bağlandıktan sonra görünür.",
    whoSpeaksFooter:
      "Tüm çalışma ortamları için tek seçim. Cihaza indirmeler burada yapılır; sağlayıcı rotaları anahtarları Bağlantılar altında bağlandığında görünür.",
    whoSearches: "Kim arıyor",
    whoSearchesFooter:
      "Model web'e ihtiyaç duyduğunda arama yanıtın içinde çalışır. Sağlayıcılar Bağlantılar altında bağlandıktan sonra görünür.",
    connectionsProviderFooter:
      "Anahtarlar cihazın anahtar zincirinde kalır ve yalnızca kendi sağlayıcısına gönderilir.",
  }),
  sv: define({
    freeEdition: "Privat offline · Gratis",
    premiumPurchaseValue:
      "Engångsköp. Ingen prenumeration eller tokenpåslag; modeller och röster körs med dina egna nycklar och faktureras direkt av dina leverantörer — inget ingår.",
    premiumFreeKeepsWorking:
      "Gratisversionen förblir användbar: offline-samtal, historik, säkerhetskopior och manuell export finns kvar.",
    premiumBenefitProviders:
      "Använd dina molnleverantörer och deras modeller av högre kvalitet",
    premiumCouncilBandCopy:
      "Modellrådet överlägger med dina egna leverantörsnycklar.",
    premiumPromptBandCopy:
      "Utforma systemprompten för dina egna leverantörsmodeller.",
    premiumBenefitModes:
      "Växla svarsläge och kör Superläge-överläggning med flera modeller",
    premiumBenefitTools:
      "Lägg till webbsökning, bilder och Drive-sessioner i molnet",
    premiumBenefitKnowledge:
      "Använd kunskap från tidigare sessioner och det portabla Markdown-arkivet",
    freeOfflineLanguagesStep: "Välj ditt språk",
    freeOfflineModelsStep: "Den bästa konfigurationen för dig",
    freeOfflineStartStep: "3 · Börja prata",
    freeOfflineSystemVoiceNote:
      "Ingen enskild hämtad röst täcker alla språken, så svaren använder telefonens språkanpassade systemröst. Lyssnande och tänkande förblir lokalt.",
    freeOfflineStart: "Starta",
    freeOfflinePremiumEscape: "Har du API-nycklar? Lås upp Premium i stället",
    settingsGroupConversation: "Samtal",
    settingsGroupVoiceModels: "Röst",
    speakingPlayback: "Uppspelning",
    startSpeaking: "Börja tala",
    whoSpeaks: "Vem talar",
    archivedConversations: "Arkiverade konversationer",
    modelStorageTitle: ({ size }) => `Lagring · ${size} i modeller`,
    modelStorageFooter:
      "Hämtning, test och val finns under Tänkande, Lyssnande och Tal; den här listan frigör bara utrymme.",
    noDownloadedModels: "Inga hämtade modeller",
    automaticSetup: "Automatisk konfiguration",
    appearance: "Utseende",
    homeScreen: "Startskärm",
    diagnostics: "Diagnostik",
    usageStatsInTranscripts: "Användningsstatistik i transkript",
    settingsGroupPrivacyApp: "Integritet och app",
    webSearchNobody: "Ingen",
    answeringModels: "Svarande modeller",
    answeringModelsFooter:
      "Upp till fyra; på startskärmen byter du vem som svarar nästa gång. En modell du saknar hämtas eller ansluts här.",
    answeringModelSheetHint:
      "Kan bytas från ruttraden på startskärmen.",
    whoListens: "Vem lyssnar",
    whoListensFooter:
      "Ett val för alla körmiljöer. Valet låses upp först efter ett godkänt test; om modellen misslyckas spricker testägget. Ta bort en installerad modell med en svepning. Leverantörsrutter visas när de anslutits under Anslutningar.",
    whoSpeaksFooter:
      "Ett val för alla körmiljöer. Hämtningar på enheten sker här; leverantörsrutter visas när deras nyckel anslutits under Anslutningar.",
    whoSearches: "Vem söker",
    whoSearchesFooter:
      "Sökningen körs inuti ett svar när modellen behöver webben. Leverantörer visas när de anslutits under Anslutningar.",
    connectionsProviderFooter:
      "Nycklarna stannar i enhetens nyckelring och skickas bara till sin egen leverantör.",
  }),
  ur: define({
    freeEdition: "نجی آف لائن · مفت",
    premiumPurchaseValue:
      "ایک بار کی خریداری۔ کوئی سبسکرپشن یا ٹوکن پر اضافی قیمت نہیں؛ ماڈل اور آوازیں آپ کی اپنی کلیدوں پر چلتی ہیں اور ان کی قیمت آپ کے فراہم کنندگان براہ راست وصول کرتے ہیں — ان میں سے کچھ بھی شامل نہیں۔",
    premiumFreeKeepsWorking:
      "مفت ورژن کارآمد رہتا ہے: آف لائن گفتگو، تاریخ، بیک اپ اور دستی برآمد دستیاب رہتے ہیں۔",
    premiumBenefitProviders:
      "اپنے کلاؤڈ فراہم کنندگان اور ان کے بہتر معیار کے ماڈل استعمال کریں",
    premiumCouncilBandCopy:
      "ماڈل کونسل آپ کی اپنی فراہم کنندہ کلیدوں سے مشاورت کرتی ہے۔",
    premiumPromptBandCopy:
      "اپنے فراہم کنندہ ماڈلز کے لیے سسٹم پرامپٹ ترتیب دیں۔",
    premiumBenefitModes:
      "جوابی موڈ بدلیں اور متعدد ماڈلز کی اعلیٰ موڈ مشاورت چلائیں",
    premiumBenefitTools: "ویب تلاش، تصاویر اور کلاؤڈ Drive سیشن شامل کریں",
    premiumBenefitKnowledge:
      "پچھلے سیشن کا علم اور قابل منتقلی Markdown آرکائیو استعمال کریں",
    freeOfflineLanguagesStep: "اپنی زبان منتخب کریں",
    freeOfflineModelsStep: "آپ کے لیے بہترین سیٹ اپ",
    freeOfflineStartStep: "3 · گفتگو شروع کریں",
    freeOfflineSystemVoiceNote:
      "کوئی ایک ڈاؤن لوڈ شدہ آواز ان تمام زبانوں کا احاطہ نہیں کرتی، اس لیے جوابات فون کی زبان کے مطابق سسٹم آواز استعمال کرتے ہیں۔ سننا اور سوچنا مقامی رہتا ہے۔",
    freeOfflineStart: "شروع کریں",
    freeOfflinePremiumEscape:
      "فراہم کنندہ کی API کلیدیں ہیں؟ اس کے بجائے Premium کھولیں",
    settingsGroupConversation: "گفتگو",
    settingsGroupVoiceModels: "آواز",
    speakingPlayback: "پلے بیک",
    startSpeaking: "بولنا شروع کریں",
    whoSpeaks: "کون بولتا ہے",
    archivedConversations: "محفوظ شدہ گفتگو",
    modelStorageTitle: ({ size }) => `اسٹوریج · ماڈلز میں ${size}`,
    modelStorageFooter:
      "ڈاؤن لوڈ، جانچ اور انتخاب سوچنے، سننے اور بولنے میں ہوتے ہیں؛ یہ فہرست صرف جگہ خالی کرتی ہے۔",
    noDownloadedModels: "کوئی ڈاؤن لوڈ شدہ ماڈل نہیں",
    automaticSetup: "خودکار سیٹ اپ",
    appearance: "ظاہری شکل",
    homeScreen: "ہوم اسکرین",
    diagnostics: "تشخیص",
    usageStatsInTranscripts: "نقل میں استعمال کے اعداد و شمار",
    settingsGroupPrivacyApp: "رازداری اور ایپ",
    webSearchNobody: "کوئی نہیں",
    answeringModels: "جواب دینے والے ماڈلز",
    answeringModelsFooter:
      "زیادہ سے زیادہ چار؛ ہوم اسکرین سے بدلیں کہ اگلا جواب کون دے۔ جو ماڈل موجود نہ ہو اسے یہیں ڈاؤن لوڈ یا مربوط کریں۔",
    answeringModelSheetHint:
      "ہوم اسکرین کی روٹ سطر سے تبدیل کیا جا سکتا ہے۔",
    whoListens: "کون سنتا ہے",
    whoListensFooter:
      "ہر رن ٹائم کے لیے ایک انتخاب۔ کامیاب جانچ کے بعد ہی انتخاب کھلتا ہے؛ ماڈل ناکام ہو تو جانچ کا انڈا چٹخ جاتا ہے۔ نصب ماڈل کو سوائپ سے ہٹائیں۔ فراہم کنندہ روٹس کنکشنز میں مربوط ہونے کے بعد دکھتے ہیں۔",
    whoSpeaksFooter:
      "ہر رن ٹائم کے لیے ایک انتخاب۔ آن ڈیوائس ڈاؤن لوڈ یہیں ہوتے ہیں؛ فراہم کنندہ روٹس کیز کنکشنز میں مربوط ہونے کے بعد دکھتے ہیں۔",
    whoSearches: "کون تلاش کرتا ہے",
    whoSearchesFooter:
      "جب ماڈل کو ویب کی ضرورت ہو تو تلاش جواب کے اندر چلتی ہے۔ فراہم کنندگان کنکشنز میں مربوط ہونے کے بعد دکھتے ہیں۔",
    connectionsProviderFooter:
      "کلیدیں ڈیوائس کی کی چین میں رہتی ہیں اور صرف اپنے فراہم کنندہ کو بھیجی جاتی ہیں۔",
  }),
} as const;
