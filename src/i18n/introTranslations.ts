// Copy for the first-run intro banner and its three-step introduction:
// a welcome and voice preview, guided setup, and an ephemeral live voice test.
//
// The blocking setup wizards were removed, so this is what a new user meets
// instead: the real workspace, plus an offer to explain it. The wording sells
// outcomes rather than architecture -- someone who has never heard "STT" or
// "BYOK" has to be able to decide what to do next.
//
// The product name is written "Mr Broccoli" everywhere, never "Mr. Broccoli".
// The period creates an unwanted pause in spoken output, and step three is
// specifically about hearing the app speak.

import type { TranslationParams } from "./types";

const rawIntroTranslations = {
  en: {
    introBannerSetting: "Introduction",
    speechInputUnavailableHint:
      "No speech recognition is set up yet, so type your message instead.",
    introBannerTitle: "Set up Mr Broccoli",
    introBannerBody:
      "A minute of setup gets him thinking, hearing you and speaking back.",
    introBannerDismiss: "Dismiss introduction",
    introTestTurnFailed:
      "The test turn did not finish. Step back, check the setup, and try again.",
    introDialogueOpeningPrompt: "What are you actually for?",
    introDialogueFar:
      "For conversations worth thinking through — spoken naturally, without hiding which AI answers.",
    introDialogueQuestion: "So I can just talk to you?",
    introDialogueNear:
      "Yes. I turn your voice into text, keep the thread together, and speak the reply back.",
    introDialoguePromptThree: "Who does the thinking?",
    introDialogueResponseThree:
      "Whichever model you choose: one on this phone, or a provider you already use.",
    introDialoguePromptFour: "Do my conversations leave this phone?",
    introDialogueResponseFour:
      "They stay on this device. With a hosted model, the context needed to answer goes directly to that provider.",
    introWelcomeQuery: "How does this application work?",
    introDialoguePlayResponse:
      "That answer makes more sense out loud. Tap play and let Mr Broccoli explain it himself.",
    introPlayAnswer: "Play the answer",
    introVoiceNote:
      "Pre-recorded with a partner voice. On this phone, his voice depends on the routes you choose.",
    introSetupTitle: "Don't panic",
    introSetupBody: "One required download and it works.",
    introHeroTitle: "Let's get you started",
    introHeroBody:
      "He measures this phone first — nothing downloads before you have seen the plan.",
    introGlyphListen: "He listens",
    introGlyphThink: "He thinks",
    introGlyphAnswer: "He answers",
    introAutoAction: "Set up automatically",
    introManualSwitch: "Show manual setup",
    introManualTitle: "Manual setup",
    introTagRequired: "Required",
    introTryTitle: "Try it out",
    introTryBody:
      "Your setup is running — ask something and hear how he answers. Not happy? Step back, change it, try again.",
    introHoldToTalk: "Hold to talk",
    introToFirstWord: "to first word",
    introReplay: "Replay",
    introMoreModels: "More models…",
    introNotInstalled: "Not installed",
    introProviderLocked: "A provider you already use",
    introManualPhoneRoute: "Your phone",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Step ${step} of ${total}`,
    introHearStop: "Stop",
    introNext: "Proceed",
    introBack: "Back",
    introOptional: "Optional",
    introVoicePickerTitle: "Choose a language",
    introVoicePickerHint: "Hear the example in another language",

    introWelcomeTitle: "Welcome",
  },
  ar: {
    introBannerSetting: "المقدمة",
    speechInputUnavailableHint:
      "لم يتم إعداد التعرّف على الكلام بعد، لذا اكتب رسالتك بدلًا من ذلك.",
    introBannerTitle: "قم بإعداد Mr Broccoli",
    introBannerBody:
      "دقيقة واحدة من الإعداد تجعله يفكّر ويسمعك ويرد عليك بصوته.",
    introBannerDismiss: "إغلاق المقدمة",
    introTestTurnFailed:
      "لم تكتمل تجربة المحادثة. ارجع خطوة وتحقق من الإعداد وحاول مجددًا.",
    introDialogueOpeningPrompt: "ما الذي صُممت من أجله فعلًا؟",
    introDialogueFar:
      "للمحادثات التي تستحق التفكير — بصوت طبيعي ومن دون إخفاء أي ذكاء اصطناعي يجيب.",
    introDialogueQuestion: "إذًا يمكنني أن أتحدث معك فحسب؟",
    introDialogueNear:
      "نعم. أحوّل صوتك إلى نص، وأحافظ على سياق الحديث، ثم أنطق الرد.",
    introDialoguePromptThree: "ومن الذي يفكّر؟",
    introDialogueResponseThree:
      "النموذج الذي تختاره: نموذج على هذا الهاتف أو مزوّد تستخدمه بالفعل.",
    introDialoguePromptFour: "وهل تغادر محادثاتي هاتفي؟",
    introDialogueResponseFour:
      "تبقى على هذا الجهاز. وإذا اخترت نموذجًا مستضافًا، ينتقل سياق المحادثة اللازم للإجابة مباشرةً إلى ذلك المزوّد.",
    introWelcomeQuery: "كيف يعمل هذا التطبيق فعليًا؟",
    introDialoguePlayResponse:
      "هذه الإجابة أوضح حين تُسمع. اضغط تشغيل ودع Mr Broccoli يشرحها بنفسه.",
    introPlayAnswer: "تشغيل الإجابة",
    introVoiceNote:
      "مسجَّل مسبقًا بصوت شريك. على هذا الهاتف يعتمد صوته على المسارات التي تختارها.",
    introSetupTitle: "لا داعي للقلق",
    introSetupBody: "تنزيل واحد مطلوب ثم يعمل.",
    introHeroTitle: "لنبدأ معًا",
    introHeroBody: "يقيس هذا الهاتف أولًا — لا يُنزَّل شيء قبل أن ترى الخطة.",
    introGlyphListen: "يستمع",
    introGlyphThink: "يفكر",
    introGlyphAnswer: "يجيب",
    introAutoAction: "الإعداد تلقائيًا",
    introManualSwitch: "إظهار الإعداد اليدوي",
    introManualTitle: "الإعداد اليدوي",
    introTagRequired: "مطلوب",
    introTryTitle: "جرّبه بنفسك",
    introTryBody:
      "إعدادك يعمل الآن — اسأل شيئًا واسمع كيف يجيب. غير راضٍ؟ ارجع خطوة وغيّره وجرّب من جديد.",
    introHoldToTalk: "اضغط مطولًا للتحدث",
    introToFirstWord: "حتى أول كلمة",
    introReplay: "إعادة التشغيل",
    introMoreModels: "المزيد من النماذج…",
    introNotInstalled: "غير مثبت",
    introProviderLocked: "مزوّد تستخدمه بالفعل",
    introManualPhoneRoute: "هاتفك",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `الخطوة ${step} من ${total}`,
    introHearStop: "إيقاف",
    introNext: "التالي",
    introBack: "رجوع",
    introOptional: "اختياري",
    introVoicePickerTitle: "اختر لغة",
    introVoicePickerHint: "استمع إلى المثال بلغة أخرى",

    introWelcomeTitle: "مرحبًا بك",
  },
  cs: {
    introBannerSetting: "Úvod",
    speechInputUnavailableHint:
      "Rozpoznávání řeči zatím není nastavené, takže zprávu napiš.",
    introBannerTitle: "Nastavte si Mr Broccoli",
    introBannerBody:
      "Minuta nastavení a začne přemýšlet, poslouchat vás a odpovídat nahlas.",
    introBannerDismiss: "Zavřít úvod",
    introTestTurnFailed:
      "Zkušební otázka se nedokončila. Vraťte se, zkontrolujte nastavení a zkuste to znovu.",
    introDialogueOpeningPrompt: "K čemu tu vlastně jsi?",
    introDialogueFar:
      "K rozhovorům, které stojí za promyšlení — přirozeně nahlas a bez skrývání, která AI odpovídá.",
    introDialogueQuestion: "Takže na tebe můžu prostě mluvit?",
    introDialogueNear:
      "Ano. Převedu hlas na text, udržím souvislosti a odpověď zase přečtu nahlas.",
    introDialoguePromptThree: "Kdo o odpovědi přemýšlí?",
    introDialogueResponseThree:
      "Model, který si vybereš: buď v tomto telefonu, nebo od poskytovatele, kterého už používáš.",
    introDialoguePromptFour: "A opustí moje rozhovory telefon?",
    introDialogueResponseFour:
      "Zůstávají v tomto zařízení. Když zvolíš hostovaný model, potřebný kontext jde přímo danému poskytovateli.",
    introWelcomeQuery: "Jak vlastně tahle aplikace funguje?",
    introDialoguePlayResponse:
      "Tahle odpověď dává větší smysl nahlas. Klepni na přehrát a nech Mr Broccoliho, ať to vysvětlí sám.",
    introPlayAnswer: "Přehrát odpověď",
    introVoiceNote:
      "Předem nahráno partnerským hlasem. Na tomto telefonu jeho hlas závisí na trasách, které zvolíte.",
    introSetupTitle: "Žádná panika",
    introSetupBody: "Jedno povinné stažení a funguje.",
    introHeroTitle: "Pojďme začít",
    introHeroBody:
      "Nejdřív změří tento telefon — nic se nestáhne, dokud neuvidíte plán.",
    introGlyphListen: "Poslouchá",
    introGlyphThink: "Přemýšlí",
    introGlyphAnswer: "Odpovídá",
    introAutoAction: "Nastavit automaticky",
    introManualSwitch: "Zobrazit ruční nastavení",
    introManualTitle: "Ruční nastavení",
    introTagRequired: "Povinné",
    introTryTitle: "Vyzkoušejte si to",
    introTryBody:
      "Vaše nastavení běží — zeptejte se na něco a poslechněte si, jak odpoví. Nespokojeni? Vraťte se, změňte je a zkuste to znovu.",
    introHoldToTalk: "Mluvte s podržením",
    introToFirstWord: "do prvního slova",
    introReplay: "Přehrát znovu",
    introMoreModels: "Další modely…",
    introNotInstalled: "Nenainstalováno",
    introProviderLocked: "Poskytovatel, kterého už používáte",
    introManualPhoneRoute: "Váš telefon",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Krok ${step} z ${total}`,
    introHearStop: "Zastavit",
    introNext: "Další",
    introBack: "Zpět",
    introOptional: "Volitelné",
    introVoicePickerTitle: "Vyber jazyk",
    introVoicePickerHint: "Poslechnout ukázku v jiném jazyce",

    introWelcomeTitle: "Vítej",
  },
  de: {
    introBannerSetting: "Einführung",
    speechInputUnavailableHint:
      "Es ist noch keine Spracherkennung eingerichtet — tippe deine Nachricht stattdessen.",
    introBannerTitle: "Mr Broccoli einrichten",
    introBannerBody:
      "Eine Minute Einrichtung, und er denkt, hört dich und spricht zurück.",
    introBannerDismiss: "Einführung schließen",
    introTestTurnFailed:
      "Der Testdurchlauf wurde nicht fertig. Geh zurück, prüfe die Einrichtung und versuch es erneut.",
    introDialogueOpeningPrompt: "Wofür bist du eigentlich da?",
    introDialogueFar:
      "Für Gespräche, die echtes Nachdenken verdienen – natürlich gesprochen und ohne zu verstecken, welche KI antwortet.",
    introDialogueQuestion: "Ich kann also einfach mit dir sprechen?",
    introDialogueNear:
      "Ja. Ich mache aus deiner Stimme Text, behalte den Gesprächsfaden und spreche die Antwort wieder aus.",
    introDialoguePromptThree: "Wer übernimmt das Denken?",
    introDialogueResponseThree:
      "Das Modell, das du auswählst: eines auf diesem Gerät oder ein Anbieter, den du bereits nutzt.",
    introDialoguePromptFour: "Und verlassen meine Gespräche das Handy?",
    introDialogueResponseFour:
      "Sie bleiben auf diesem Gerät. Bei einem gehosteten Modell geht der nötige Gesprächskontext direkt an diesen Anbieter.",
    introWelcomeQuery: "Wie funktioniert diese App eigentlich?",
    introDialoguePlayResponse:
      "Diese Antwort ergibt gesprochen mehr Sinn. Tippe auf Play und lass Mr Broccoli das selbst erklären.",
    introPlayAnswer: "Antwort abspielen",
    introVoiceNote:
      "Vorab mit einer Partnerstimme aufgenommen. Auf diesem Telefon hängt seine Stimme von den gewählten Routen ab.",
    introSetupTitle: "Keine Panik",
    introSetupBody: "Ein nötiger Download, und es funktioniert.",
    introHeroTitle: "Bringen wir dich an den Start",
    introHeroBody:
      "Er vermisst zuerst dieses Telefon — nichts wird geladen, bevor du den Plan gesehen hast.",
    introGlyphListen: "Er hört",
    introGlyphThink: "Er denkt",
    introGlyphAnswer: "Er antwortet",
    introAutoAction: "Automatisch einrichten",
    introManualSwitch: "Manuelle Einrichtung zeigen",
    introManualTitle: "Manuelle Einrichtung",
    introTagRequired: "Erforderlich",
    introTryTitle: "Probier es aus",
    introTryBody:
      "Deine Einrichtung läuft — frag etwas und hör, wie er antwortet. Nicht zufrieden? Geh zurück, ändere sie und versuch es erneut.",
    introHoldToTalk: "Zum Sprechen halten",
    introToFirstWord: "bis zum ersten Wort",
    introReplay: "Erneut abspielen",
    introMoreModels: "Weitere Modelle…",
    introNotInstalled: "Nicht installiert",
    introProviderLocked: "Ein Anbieter, den du schon nutzt",
    introManualPhoneRoute: "Dein Telefon",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Schritt ${step} von ${total}`,
    introHearStop: "Stopp",
    introNext: "Weiter",
    introBack: "Zurück",
    introOptional: "Optional",
    introVoicePickerTitle: "Sprache wählen",
    introVoicePickerHint: "Das Beispiel in einer anderen Sprache hören",

    introWelcomeTitle: "Willkommen",
  },
  es: {
    introBannerSetting: "Introducción",
    speechInputUnavailableHint:
      "Todavía no hay reconocimiento de voz configurado, así que escribe tu mensaje.",
    introBannerTitle: "Configura Mr Broccoli",
    introBannerBody:
      "Un minuto de configuración y ya piensa, te escucha y te responde con voz.",
    introBannerDismiss: "Cerrar la introducción",
    introTestTurnFailed:
      "La prueba no terminó. Retrocede, revisa la configuración e inténtalo de nuevo.",
    introDialogueOpeningPrompt: "¿Para qué sirves realmente?",
    introDialogueFar:
      "Para conversaciones que merecen pensarse bien, habladas con naturalidad y sin ocultar qué IA responde.",
    introDialogueQuestion: "¿Entonces solo tengo que hablarte?",
    introDialogueNear:
      "Sí. Convierto tu voz en texto, mantengo el hilo y leo la respuesta en voz alta.",
    introDialoguePromptThree: "¿Quién se encarga de pensar?",
    introDialogueResponseThree:
      "El modelo que elijas: uno en este teléfono o un proveedor que ya utilices.",
    introDialoguePromptFour: "¿Y mis conversaciones salen del teléfono?",
    introDialogueResponseFour:
      "Se quedan en este dispositivo. Si eliges un modelo alojado, el contexto necesario va directamente a ese proveedor.",
    introWelcomeQuery: "¿Cómo funciona esta aplicación?",
    introDialoguePlayResponse:
      "Esta respuesta se entiende mejor en voz alta. Pulsa reproducir y deja que Mr Broccoli la explique él mismo.",
    introPlayAnswer: "Reproducir la respuesta",
    introVoiceNote:
      "Pregrabado con una voz asociada. En este teléfono, su voz depende de las rutas que elijas.",
    introSetupTitle: "Que no cunda el pánico",
    introSetupBody: "Una descarga necesaria y funciona.",
    introHeroTitle: "Vamos a empezar",
    introHeroBody:
      "Primero mide este teléfono: no se descarga nada antes de que veas el plan.",
    introGlyphListen: "Escucha",
    introGlyphThink: "Piensa",
    introGlyphAnswer: "Responde",
    introAutoAction: "Configurar automáticamente",
    introManualSwitch: "Mostrar configuración manual",
    introManualTitle: "Configuración manual",
    introTagRequired: "Necesario",
    introTryTitle: "Pruébalo",
    introTryBody:
      "Tu configuración está en marcha: pregunta algo y escucha cómo responde. ¿No te convence? Retrocede, cámbiala y prueba otra vez.",
    introHoldToTalk: "Mantén pulsado para hablar",
    introToFirstWord: "hasta la primera palabra",
    introReplay: "Repetir",
    introMoreModels: "Más modelos…",
    introNotInstalled: "No instalado",
    introProviderLocked: "Un proveedor que ya usas",
    introManualPhoneRoute: "Tu teléfono",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Paso ${step} de ${total}`,
    introHearStop: "Detener",
    introNext: "Siguiente",
    introBack: "Atrás",
    introOptional: "Opcional",
    introVoicePickerTitle: "Elige un idioma",
    introVoicePickerHint: "Escucha el ejemplo en otro idioma",

    introWelcomeTitle: "Te damos la bienvenida",
  },
  fr: {
    introBannerSetting: "Introduction",
    speechInputUnavailableHint:
      "Aucune reconnaissance vocale n'est encore configurée, écris ton message à la place.",
    introBannerTitle: "Configurez Mr Broccoli",
    introBannerBody:
      "Une minute de configuration et il pense, vous écoute et vous répond à voix haute.",
    introBannerDismiss: "Fermer l'introduction",
    introTestTurnFailed:
      "Le tour d'essai ne s'est pas terminé. Revenez en arrière, vérifiez la configuration et réessayez.",
    introDialogueOpeningPrompt: "À quoi servez-vous, au juste ?",
    introDialogueFar:
      "Aux conversations qui méritent réflexion — à l’oral, naturellement, sans cacher quelle IA répond.",
    introDialogueQuestion: "Je peux donc simplement vous parler ?",
    introDialogueNear:
      "Oui. Je transforme votre voix en texte, je garde le fil et je lis la réponse à voix haute.",
    introDialoguePromptThree: "Qui se charge de réfléchir ?",
    introDialogueResponseThree:
      "Le modèle que vous choisissez : un modèle sur ce téléphone ou un fournisseur que vous utilisez déjà.",
    introDialoguePromptFour:
      "Et mes conversations quittent-elles le téléphone ?",
    introDialogueResponseFour:
      "Elles restent sur cet appareil. Avec un modèle hébergé, le contexte nécessaire va directement à ce fournisseur.",
    introWelcomeQuery: "Comment fonctionne cette application ?",
    introDialoguePlayResponse:
      "Cette réponse est plus claire à l’oral. Appuyez sur lecture et laissez Mr Broccoli l’expliquer lui-même.",
    introPlayAnswer: "Écouter la réponse",
    introVoiceNote:
      "Préenregistré avec une voix partenaire. Sur ce téléphone, sa voix dépend des routes que vous choisissez.",
    introSetupTitle: "Pas de panique",
    introSetupBody: "Un seul téléchargement nécessaire et ça fonctionne.",
    introHeroTitle: "Commençons",
    introHeroBody:
      "Il mesure d'abord ce téléphone — rien ne se télécharge avant que vous ayez vu le plan.",
    introGlyphListen: "Il écoute",
    introGlyphThink: "Il réfléchit",
    introGlyphAnswer: "Il répond",
    introAutoAction: "Configurer automatiquement",
    introManualSwitch: "Afficher la configuration manuelle",
    introManualTitle: "Configuration manuelle",
    introTagRequired: "Requis",
    introTryTitle: "Essayez-le",
    introTryBody:
      "Votre configuration tourne — posez une question et écoutez sa réponse. Pas convaincu ? Revenez en arrière, modifiez-la et réessayez.",
    introHoldToTalk: "Maintenez pour parler",
    introToFirstWord: "jusqu'au premier mot",
    introReplay: "Réécouter",
    introMoreModels: "Plus de modèles…",
    introNotInstalled: "Non installé",
    introProviderLocked: "Un fournisseur que vous utilisez déjà",
    introManualPhoneRoute: "Votre téléphone",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Étape ${step} sur ${total}`,
    introHearStop: "Arrêter",
    introNext: "Suivant",
    introBack: "Retour",
    introOptional: "Facultatif",
    introVoicePickerTitle: "Choisis une langue",
    introVoicePickerHint: "Écouter l'exemple dans une autre langue",

    introWelcomeTitle: "Bienvenue",
  },
  hi: {
    introBannerSetting: "परिचय",
    speechInputUnavailableHint:
      "अभी कोई वाक् पहचान सेट नहीं है, इसलिए अपना संदेश टाइप करें।",
    introBannerTitle: "Mr Broccoli सेट करें",
    introBannerBody:
      "एक मिनट के सेटअप से वह सोचने, आपको सुनने और बोलकर जवाब देने लगता है।",
    introBannerDismiss: "परिचय बंद करें",
    introTestTurnFailed:
      "परीक्षण पूरा नहीं हुआ। पीछे जाएँ, सेटअप जाँचें और फिर आज़माएँ।",
    introDialogueOpeningPrompt: "असल में तुम्हारा काम क्या है?",
    introDialogueFar:
      "ऐसी बातचीत के लिए जिस पर सोचने की ज़रूरत हो—स्वाभाविक ढंग से बोलकर, और यह छिपाए बिना कि कौन-सा AI जवाब दे रहा है।",
    introDialogueQuestion: "तो मैं बस तुमसे बोल सकता हूँ?",
    introDialogueNear:
      "हाँ। मैं तुम्हारी आवाज़ को टेक्स्ट में बदलता हूँ, बातचीत का संदर्भ बनाए रखता हूँ और जवाब बोलकर सुनाता हूँ।",
    introDialoguePromptThree: "सोचता कौन है?",
    introDialogueResponseThree:
      "वह मॉडल जिसे तुम चुनते हो: इस फ़ोन पर चलने वाला या तुम्हारा पहले से इस्तेमाल किया हुआ प्रदाता।",
    introDialoguePromptFour: "और क्या मेरी बातचीत फ़ोन से बाहर जाती है?",
    introDialogueResponseFour:
      "वह इसी डिवाइस पर रहती है। होस्ट किया गया मॉडल चुनने पर जवाब के लिए ज़रूरी संदर्भ सीधे उसी प्रदाता को जाता है।",
    introWelcomeQuery: "यह ऐप असल में काम कैसे करता है?",
    introDialoguePlayResponse:
      "यह जवाब सुनने पर ज़्यादा साफ़ होगा। प्ले दबाओ और Mr Broccoli को खुद समझाने दो।",
    introPlayAnswer: "जवाब सुनें",
    introVoiceNote:
      "एक साझेदार आवाज़ में पहले से रिकॉर्ड किया गया। इस फ़ोन पर उसकी आवाज़ आपके चुने रास्तों पर निर्भर करती है।",
    introSetupTitle: "घबराइए नहीं",
    introSetupBody: "एक ज़रूरी डाउनलोड और यह काम करने लगता है।",
    introHeroTitle: "चलिए शुरू करते हैं",
    introHeroBody:
      "वह पहले इस फ़ोन को परखता है — योजना देखने से पहले कुछ भी डाउनलोड नहीं होता।",
    introGlyphListen: "वह सुनता है",
    introGlyphThink: "वह सोचता है",
    introGlyphAnswer: "वह जवाब देता है",
    introAutoAction: "अपने आप सेट करें",
    introManualSwitch: "मैन्युअल सेटअप दिखाएँ",
    introManualTitle: "मैन्युअल सेटअप",
    introTagRequired: "आवश्यक",
    introTryTitle: "आज़माकर देखें",
    introTryBody:
      "आपका सेटअप चल रहा है — कुछ पूछें और सुनें कि वह कैसे जवाब देता है। पसंद नहीं आया? पीछे जाएँ, बदलें और फिर आज़माएँ।",
    introHoldToTalk: "बोलने के लिए दबाए रखें",
    introToFirstWord: "पहले शब्द तक",
    introReplay: "फिर सुनें",
    introMoreModels: "और मॉडल…",
    introNotInstalled: "इंस्टॉल नहीं है",
    introProviderLocked: "एक प्रोवाइडर जिसे आप पहले से इस्तेमाल करते हैं",
    introManualPhoneRoute: "आपका फ़ोन",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `चरण ${step} / ${total}`,
    introHearStop: "रोकें",
    introNext: "आगे",
    introBack: "पीछे",
    introOptional: "वैकल्पिक",
    introVoicePickerTitle: "भाषा चुनें",
    introVoicePickerHint: "उदाहरण किसी और भाषा में सुनें",

    introWelcomeTitle: "आपका स्वागत है",
  },
  hu: {
    introBannerSetting: "Bevezető",
    speechInputUnavailableHint:
      "Még nincs beszédfelismerés beállítva, ezért gépeld be az üzenetet.",
    introBannerTitle: "Mr Broccoli beállítása",
    introBannerBody:
      "Egy perc beállítás, és már gondolkodik, hall téged és hangosan válaszol.",
    introBannerDismiss: "Bevezető bezárása",
    introTestTurnFailed:
      "A próbakör nem fejeződött be. Lépj vissza, ellenőrizd a beállítást, és próbáld újra.",
    introDialogueOpeningPrompt: "Tulajdonképpen mire vagy való?",
    introDialogueFar:
      "Olyan beszélgetésekre, amelyeket érdemes végiggondolni — természetes szóban, anélkül hogy elrejteném, melyik MI válaszol.",
    introDialogueQuestion: "Tehát egyszerűen beszélhetek hozzád?",
    introDialogueNear:
      "Igen. A hangodat szöveggé alakítom, követem a beszélgetést, majd felolvasom a választ.",
    introDialoguePromptThree: "Ki végzi a gondolkodást?",
    introDialogueResponseThree:
      "Az általad választott modell: egy ezen a telefonon futó modell vagy egy már használt szolgáltató.",
    introDialoguePromptFour: "És a beszélgetéseim elhagyják a telefont?",
    introDialogueResponseFour:
      "Ezen az eszközön maradnak. Hosztolt modellnél a válaszhoz szükséges kontextus közvetlenül ahhoz a szolgáltatóhoz kerül.",
    introWelcomeQuery: "Hogyan működik ez az alkalmazás?",
    introDialoguePlayResponse:
      "Ez a válasz hangosan érthetőbb. Nyomd meg a lejátszást, és hagyd, hogy Mr Broccoli maga magyarázza el.",
    introPlayAnswer: "Válasz lejátszása",
    introVoiceNote:
      "Előre felvéve egy partnerhanggal. Ezen a telefonon a hangja a választott útvonalaktól függ.",
    introSetupTitle: "Semmi pánik",
    introSetupBody: "Egyetlen szükséges letöltés, és működik.",
    introHeroTitle: "Vágjunk bele",
    introHeroBody:
      "Először felméri ezt a telefont — semmi sem töltődik le, amíg nem láttad a tervet.",
    introGlyphListen: "Hallgat",
    introGlyphThink: "Gondolkodik",
    introGlyphAnswer: "Válaszol",
    introAutoAction: "Automatikus beállítás",
    introManualSwitch: "Kézi beállítás megjelenítése",
    introManualTitle: "Kézi beállítás",
    introTagRequired: "Kötelező",
    introTryTitle: "Próbáld ki",
    introTryBody:
      "A beállításod fut — kérdezz valamit, és hallgasd meg, hogyan válaszol. Nem tetszik? Lépj vissza, változtass rajta, és próbáld újra.",
    introHoldToTalk: "Tartsd nyomva a beszédhez",
    introToFirstWord: "az első szóig",
    introReplay: "Újra lejátszás",
    introMoreModels: "További modellek…",
    introNotInstalled: "Nincs telepítve",
    introProviderLocked: "Egy szolgáltató, amit már használsz",
    introManualPhoneRoute: "A telefonod",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `${step}. lépés a(z) ${total}-ból`,
    introHearStop: "Leállítás",
    introNext: "Tovább",
    introBack: "Vissza",
    introOptional: "Nem kötelező",
    introVoicePickerTitle: "Válassz nyelvet",
    introVoicePickerHint: "Hallgasd meg a példát másik nyelven",

    introWelcomeTitle: "Üdv",
  },
  it: {
    introBannerSetting: "Introduzione",
    speechInputUnavailableHint:
      "Non è ancora configurato il riconoscimento vocale, quindi scrivi il messaggio.",
    introBannerTitle: "Configura Mr Broccoli",
    introBannerBody:
      "Un minuto di configurazione e lui pensa, ti ascolta e ti risponde a voce.",
    introBannerDismiss: "Chiudi l'introduzione",
    introTestTurnFailed:
      "La prova non è terminata. Torna indietro, controlla la configurazione e riprova.",
    introDialogueOpeningPrompt: "A cosa servi, davvero?",
    introDialogueFar:
      "A conversazioni che meritano di essere ragionate, parlate con naturalezza e senza nascondere quale IA risponde.",
    introDialogueQuestion: "Quindi posso semplicemente parlarti?",
    introDialogueNear:
      "Sì. Trasformo la tua voce in testo, tengo il filo e leggo la risposta ad alta voce.",
    introDialoguePromptThree: "Chi si occupa di pensare?",
    introDialogueResponseThree:
      "Il modello che scegli: uno su questo telefono o un provider che usi già.",
    introDialoguePromptFour: "E le mie conversazioni lasciano il telefono?",
    introDialogueResponseFour:
      "Restano su questo dispositivo. Se scegli un modello ospitato, il contesto necessario va direttamente a quel provider.",
    introWelcomeQuery: "Come funziona questa app?",
    introDialoguePlayResponse:
      "Questa risposta è più chiara a voce. Tocca Play e lascia che Mr Broccoli la spieghi da sé.",
    introPlayAnswer: "Riproduci la risposta",
    introVoiceNote:
      "Preregistrato con una voce partner. Su questo telefono la sua voce dipende dalle rotte che scegli.",
    introSetupTitle: "Niente panico",
    introSetupBody: "Un solo download necessario e funziona.",
    introHeroTitle: "Iniziamo",
    introHeroBody:
      "Prima misura questo telefono: non scarica nulla prima che tu abbia visto il piano.",
    introGlyphListen: "Ascolta",
    introGlyphThink: "Pensa",
    introGlyphAnswer: "Risponde",
    introAutoAction: "Configura automaticamente",
    introManualSwitch: "Mostra configurazione manuale",
    introManualTitle: "Configurazione manuale",
    introTagRequired: "Necessario",
    introTryTitle: "Provalo",
    introTryBody:
      "La tua configurazione è attiva: chiedi qualcosa e ascolta come risponde. Non ti convince? Torna indietro, cambiala e riprova.",
    introHoldToTalk: "Tieni premuto per parlare",
    introToFirstWord: "alla prima parola",
    introReplay: "Riascolta",
    introMoreModels: "Altri modelli…",
    introNotInstalled: "Non installato",
    introProviderLocked: "Un provider che usi già",
    introManualPhoneRoute: "Il tuo telefono",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Passo ${step} di ${total}`,
    introHearStop: "Ferma",
    introNext: "Avanti",
    introBack: "Indietro",
    introOptional: "Facoltativo",
    introVoicePickerTitle: "Scegli una lingua",
    introVoicePickerHint: "Ascolta l'esempio in un'altra lingua",

    introWelcomeTitle: "Benvenuto",
  },
  ja: {
    introBannerSetting: "はじめに",
    speechInputUnavailableHint:
      "音声認識がまだ設定されていないので、メッセージを入力してください。",
    introBannerTitle: "Mr Broccoli をセットアップ",
    introBannerBody:
      "1分のセットアップで、考え、聞き取り、声で答えるようになります。",
    introBannerDismiss: "紹介を閉じる",
    introTestTurnFailed:
      "テストが完了しませんでした。前に戻り、設定を確認してからもう一度お試しください。",
    introDialogueOpeningPrompt: "そもそも、何のためのアプリなの？",
    introDialogueFar:
      "じっくり考える価値のある会話のためです。自然に話せて、どのAIが答えたかも隠しません。",
    introDialogueQuestion: "じゃあ、普通に話しかければいい？",
    introDialogueNear:
      "はい。声を文字にし、会話の流れを保ち、答えを音声で返します。",
    introDialoguePromptThree: "考えるのは誰？",
    introDialogueResponseThree:
      "あなたが選んだモデルです。この端末上のモデルでも、普段使っているプロバイダーでもかまいません。",
    introDialoguePromptFour: "会話は端末の外に出る？",
    introDialogueResponseFour:
      "会話はこの端末に残ります。ホスト型モデルを選んだ場合だけ、回答に必要な文脈がそのプロバイダーへ直接送られます。",
    introWelcomeQuery: "このアプリは実際どうやって動いているの？",
    introDialoguePlayResponse:
      "その答えは、声で聞くほうが分かりやすいです。再生をタップして、Mr Broccoli自身の説明を聞いてください。",
    introPlayAnswer: "答えを再生",
    introVoiceNote:
      "パートナーの音声で事前録音されています。この電話での声は、選んだルートによって変わります。",
    introSetupTitle: "心配いりません",
    introSetupBody: "必要なダウンロードは1つだけで、すぐ使えます。",
    introHeroTitle: "はじめましょう",
    introHeroBody:
      "まずこの電話を計測します。プランを確認するまで何もダウンロードされません。",
    introGlyphListen: "聞く",
    introGlyphThink: "考える",
    introGlyphAnswer: "答える",
    introAutoAction: "自動でセットアップ",
    introManualSwitch: "手動セットアップを表示",
    introManualTitle: "手動セットアップ",
    introTagRequired: "必須",
    introTryTitle: "試してみましょう",
    introTryBody:
      "セットアップは動いています。何か聞いて、どう答えるか確かめてください。気に入らなければ、戻って変更し、もう一度試せます。",
    introHoldToTalk: "押しながら話す",
    introToFirstWord: "最初の一言まで",
    introReplay: "もう一度再生",
    introMoreModels: "その他のモデル…",
    introNotInstalled: "未インストール",
    introProviderLocked: "すでに使っているプロバイダー",
    introManualPhoneRoute: "この電話",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `ステップ ${step} / ${total}`,
    introHearStop: "停止",
    introNext: "次へ",
    introBack: "戻る",
    introOptional: "任意",
    introVoicePickerTitle: "言語を選ぶ",
    introVoicePickerHint: "別の言語で例を聞く",

    introWelcomeTitle: "ようこそ",
  },
  pl: {
    introBannerSetting: "Wprowadzenie",
    speechInputUnavailableHint:
      "Rozpoznawanie mowy nie jest jeszcze skonfigurowane, więc napisz wiadomość.",
    introBannerTitle: "Skonfiguruj Mr Broccoli",
    introBannerBody:
      "Minuta konfiguracji i już myśli, słucha cię i odpowiada na głos.",
    introBannerDismiss: "Zamknij wprowadzenie",
    introTestTurnFailed:
      "Próba nie została ukończona. Cofnij się, sprawdź konfigurację i spróbuj ponownie.",
    introDialogueOpeningPrompt: "Do czego właściwie służysz?",
    introDialogueFar:
      "Do rozmów, które warto dobrze przemyśleć — prowadzonych naturalnie i bez ukrywania, która AI odpowiada.",
    introDialogueQuestion: "Czyli mogę po prostu do ciebie mówić?",
    introDialogueNear:
      "Tak. Zamieniam głos na tekst, pilnuję wątku rozmowy i odczytuję odpowiedź.",
    introDialoguePromptThree: "Kto odpowiada za myślenie?",
    introDialogueResponseThree:
      "Wybrany przez ciebie model: działający na tym telefonie albo od dostawcy, z którego już korzystasz.",
    introDialoguePromptFour: "A czy moje rozmowy opuszczają telefon?",
    introDialogueResponseFour:
      "Zostają na tym urządzeniu. Gdy wybierzesz model hostowany, potrzebny kontekst trafia bezpośrednio do jego dostawcy.",
    introWelcomeQuery: "Jak właściwie działa ta aplikacja?",
    introDialoguePlayResponse:
      "Tę odpowiedź łatwiej zrozumieć na głos. Naciśnij odtwarzanie i pozwól Mr Broccoli wyjaśnić ją samemu.",
    introPlayAnswer: "Odtwórz odpowiedź",
    introVoiceNote:
      "Nagrane wcześniej głosem partnera. Na tym telefonie jego głos zależy od wybranych tras.",
    introSetupTitle: "Bez paniki",
    introSetupBody: "Jedno wymagane pobranie i działa.",
    introHeroTitle: "Zaczynajmy",
    introHeroBody:
      "Najpierw mierzy ten telefon — nic się nie pobierze, zanim nie zobaczysz planu.",
    introGlyphListen: "Słucha",
    introGlyphThink: "Myśli",
    introGlyphAnswer: "Odpowiada",
    introAutoAction: "Skonfiguruj automatycznie",
    introManualSwitch: "Pokaż konfigurację ręczną",
    introManualTitle: "Konfiguracja ręczna",
    introTagRequired: "Wymagane",
    introTryTitle: "Wypróbuj",
    introTryBody:
      "Twoja konfiguracja działa — zapytaj o coś i posłuchaj, jak odpowiada. Nie podoba się? Cofnij się, zmień ją i spróbuj ponownie.",
    introHoldToTalk: "Przytrzymaj, aby mówić",
    introToFirstWord: "do pierwszego słowa",
    introReplay: "Odtwórz ponownie",
    introMoreModels: "Więcej modeli…",
    introNotInstalled: "Nie zainstalowano",
    introProviderLocked: "Dostawca, z którego już korzystasz",
    introManualPhoneRoute: "Twój telefon",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Krok ${step} z ${total}`,
    introHearStop: "Zatrzymaj",
    introNext: "Dalej",
    introBack: "Wstecz",
    introOptional: "Opcjonalne",
    introVoicePickerTitle: "Wybierz język",
    introVoicePickerHint: "Posłuchaj przykładu w innym języku",

    introWelcomeTitle: "Witaj",
  },
  pt: {
    introBannerSetting: "Introdução",
    speechInputUnavailableHint:
      "Ainda não há reconhecimento de voz configurado, por isso escreve a tua mensagem.",
    introBannerTitle: "Configure o Mr Broccoli",
    introBannerBody:
      "Um minuto de configuração e ele passa a pensar, a ouvi-lo e a responder em voz alta.",
    introBannerDismiss: "Fechar a introdução",
    introTestTurnFailed:
      "O teste não terminou. Volte atrás, verifique a configuração e tente novamente.",
    introDialogueOpeningPrompt: "Afinal, para que serves?",
    introDialogueFar:
      "Para conversas que merecem ser bem pensadas, faladas com naturalidade e sem esconder qual IA responde.",
    introDialogueQuestion: "Então posso simplesmente falar contigo?",
    introDialogueNear:
      "Sim. Transformo a tua voz em texto, mantenho o fio da conversa e leio a resposta em voz alta.",
    introDialoguePromptThree: "Quem trata de pensar?",
    introDialogueResponseThree:
      "O modelo que escolheres: um neste telemóvel ou um fornecedor que já uses.",
    introDialoguePromptFour: "E as minhas conversas saem do telemóvel?",
    introDialogueResponseFour:
      "Ficam neste dispositivo. Se escolheres um modelo alojado, o contexto necessário segue diretamente para esse fornecedor.",
    introWelcomeQuery: "Como funciona esta aplicação?",
    introDialoguePlayResponse:
      "Esta resposta percebe-se melhor em voz alta. Toca em reproduzir e deixa o Mr Broccoli explicá-la por si.",
    introPlayAnswer: "Reproduzir a resposta",
    introVoiceNote:
      "Pré-gravado com uma voz parceira. Neste telemóvel, a voz dele depende das rotas que escolher.",
    introSetupTitle: "Sem pânico",
    introSetupBody: "Uma transferência necessária e funciona.",
    introHeroTitle: "Vamos começar",
    introHeroBody:
      "Primeiro mede este telemóvel — nada é transferido antes de ver o plano.",
    introGlyphListen: "Ele ouve",
    introGlyphThink: "Ele pensa",
    introGlyphAnswer: "Ele responde",
    introAutoAction: "Configurar automaticamente",
    introManualSwitch: "Mostrar configuração manual",
    introManualTitle: "Configuração manual",
    introTagRequired: "Necessário",
    introTryTitle: "Experimente",
    introTryBody:
      "A sua configuração está a funcionar — pergunte algo e ouça como responde. Não gostou? Volte atrás, altere-a e tente de novo.",
    introHoldToTalk: "Mantenha premido para falar",
    introToFirstWord: "até à primeira palavra",
    introReplay: "Repetir",
    introMoreModels: "Mais modelos…",
    introNotInstalled: "Não instalado",
    introProviderLocked: "Um fornecedor que já utiliza",
    introManualPhoneRoute: "O seu telemóvel",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Passo ${step} de ${total}`,
    introHearStop: "Parar",
    introNext: "Seguinte",
    introBack: "Voltar",
    introOptional: "Opcional",
    introVoicePickerTitle: "Escolhe um idioma",
    introVoicePickerHint: "Ouvir o exemplo noutro idioma",

    introWelcomeTitle: "Bem-vindo",
  },
  ptBR: {
    introBannerSetting: "Introdução",
    speechInputUnavailableHint:
      "Ainda não há reconhecimento de voz configurado, então digite sua mensagem.",
    introBannerTitle: "Configure o Mr Broccoli",
    introBannerBody:
      "Um minuto de configuração e ele pensa, ouve você e responde em voz alta.",
    introBannerDismiss: "Fechar a introdução",
    introTestTurnFailed:
      "O teste não terminou. Volte, verifique a configuração e tente de novo.",
    introDialogueOpeningPrompt: "Afinal, para que você serve?",
    introDialogueFar:
      "Para conversas que merecem ser bem pensadas, faladas com naturalidade e sem esconder qual IA responde.",
    introDialogueQuestion: "Então eu posso simplesmente falar com você?",
    introDialogueNear:
      "Sim. Transformo sua voz em texto, mantenho o fio da conversa e leio a resposta em voz alta.",
    introDialoguePromptThree: "Quem faz a parte de pensar?",
    introDialogueResponseThree:
      "O modelo que você escolher: um neste celular ou um provedor que você já usa.",
    introDialoguePromptFour: "E as minhas conversas saem do celular?",
    introDialogueResponseFour:
      "Elas ficam neste dispositivo. Se você escolher um modelo hospedado, o contexto necessário vai direto para esse provedor.",
    introWelcomeQuery: "Como funciona esse aplicativo?",
    introDialoguePlayResponse:
      "Essa resposta fica mais clara em voz alta. Toque em reproduzir e deixe o Mr Broccoli explicar por conta própria.",
    introPlayAnswer: "Reproduzir a resposta",
    introVoiceNote:
      "Pré-gravado com uma voz parceira. Neste telefone, a voz dele depende das rotas que você escolher.",
    introSetupTitle: "Sem pânico",
    introSetupBody: "Um download necessário e funciona.",
    introHeroTitle: "Vamos começar",
    introHeroBody:
      "Primeiro ele mede este telefone — nada é baixado antes de você ver o plano.",
    introGlyphListen: "Ele ouve",
    introGlyphThink: "Ele pensa",
    introGlyphAnswer: "Ele responde",
    introAutoAction: "Configurar automaticamente",
    introManualSwitch: "Mostrar configuração manual",
    introManualTitle: "Configuração manual",
    introTagRequired: "Necessário",
    introTryTitle: "Experimente",
    introTryBody:
      "Sua configuração está rodando — pergunte algo e ouça como ele responde. Não gostou? Volte, mude e tente de novo.",
    introHoldToTalk: "Segure para falar",
    introToFirstWord: "até a primeira palavra",
    introReplay: "Repetir",
    introMoreModels: "Mais modelos…",
    introNotInstalled: "Não instalado",
    introProviderLocked: "Um provedor que você já usa",
    introManualPhoneRoute: "Seu telefone",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Etapa ${step} de ${total}`,
    introHearStop: "Parar",
    introNext: "Avançar",
    introBack: "Voltar",
    introOptional: "Opcional",
    introVoicePickerTitle: "Escolha um idioma",
    introVoicePickerHint: "Ouvir o exemplo em outro idioma",

    introWelcomeTitle: "Boas-vindas",
  },
  ru: {
    introBannerSetting: "Знакомство",
    speechInputUnavailableHint:
      "Распознавание речи ещё не настроено, поэтому напечатай сообщение.",
    introBannerTitle: "Настройте Mr Broccoli",
    introBannerBody:
      "Минута настройки — и он думает, слышит вас и отвечает вслух.",
    introBannerDismiss: "Закрыть знакомство",
    introTestTurnFailed:
      "Пробный ход не завершился. Вернитесь, проверьте настройку и попробуйте снова.",
    introDialogueOpeningPrompt: "Для чего ты вообще нужен?",
    introDialogueFar:
      "Для разговоров, которые стоит обдумать, — естественных и без попыток скрыть, какой ИИ отвечает.",
    introDialogueQuestion: "То есть я могу просто говорить с тобой?",
    introDialogueNear:
      "Да. Я превращаю голос в текст, сохраняю нить разговора и озвучиваю ответ.",
    introDialoguePromptThree: "А кто думает над ответом?",
    introDialogueResponseThree:
      "Выбранная тобой модель: на этом телефоне или у провайдера, которым ты уже пользуешься.",
    introDialoguePromptFour: "Мои разговоры покидают телефон?",
    introDialogueResponseFour:
      "Они остаются на этом устройстве. Если выбрана облачная модель, нужный контекст идёт прямо её провайдеру.",
    introWelcomeQuery: "Как вообще работает это приложение?",
    introDialoguePlayResponse:
      "Этот ответ понятнее на слух. Нажми воспроизведение, и Mr Broccoli всё объяснит сам.",
    introPlayAnswer: "Воспроизвести ответ",
    introVoiceNote:
      "Записано заранее партнёрским голосом. На этом телефоне его голос зависит от выбранных маршрутов.",
    introSetupTitle: "Без паники",
    introSetupBody: "Одна обязательная загрузка — и всё работает.",
    introHeroTitle: "Давайте начнём",
    introHeroBody:
      "Сначала он измеряет этот телефон — ничего не загружается, пока вы не увидите план.",
    introGlyphListen: "Он слушает",
    introGlyphThink: "Он думает",
    introGlyphAnswer: "Он отвечает",
    introAutoAction: "Настроить автоматически",
    introManualSwitch: "Показать ручную настройку",
    introManualTitle: "Ручная настройка",
    introTagRequired: "Обязательно",
    introTryTitle: "Попробуйте",
    introTryBody:
      "Ваша настройка работает — спросите что-нибудь и послушайте, как он отвечает. Не нравится? Вернитесь, измените её и попробуйте снова.",
    introHoldToTalk: "Удерживайте, чтобы говорить",
    introToFirstWord: "до первого слова",
    introReplay: "Повторить",
    introMoreModels: "Другие модели…",
    introNotInstalled: "Не установлено",
    introProviderLocked: "Провайдер, которым вы уже пользуетесь",
    introManualPhoneRoute: "Ваш телефон",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Шаг ${step} из ${total}`,
    introHearStop: "Стоп",
    introNext: "Далее",
    introBack: "Назад",
    introOptional: "Необязательно",
    introVoicePickerTitle: "Выбери язык",
    introVoicePickerHint: "Послушать пример на другом языке",

    introWelcomeTitle: "Добро пожаловать",
  },
  sv: {
    introBannerSetting: "Introduktion",
    speechInputUnavailableHint:
      "Ingen taligenkänning är inställd än, så skriv ditt meddelande i stället.",
    introBannerTitle: "Ställ in Mr Broccoli",
    introBannerBody:
      "En minuts installation och han tänker, hör dig och svarar högt.",
    introBannerDismiss: "Stäng introduktionen",
    introTestTurnFailed:
      "Testet slutfördes inte. Gå tillbaka, kontrollera installationen och försök igen.",
    introDialogueOpeningPrompt: "Vad är du egentligen till för?",
    introDialogueFar:
      "För samtal som är värda att tänka igenom — naturligt talade, utan att dölja vilken AI som svarar.",
    introDialogueQuestion: "Så jag kan bara prata med dig?",
    introDialogueNear:
      "Ja. Jag gör om din röst till text, håller ihop tråden och läser upp svaret.",
    introDialoguePromptThree: "Vem står för tänkandet?",
    introDialogueResponseThree:
      "Modellen du väljer: en på den här telefonen eller en leverantör du redan använder.",
    introDialoguePromptFour: "Och lämnar mina samtal telefonen?",
    introDialogueResponseFour:
      "De stannar på den här enheten. Med en värdbaserad modell går sammanhanget som behövs direkt till den leverantören.",
    introWelcomeQuery: "Hur fungerar den här appen egentligen?",
    introDialoguePlayResponse:
      "Det svaret är lättare att förstå när du hör det. Tryck på spela och låt Mr Broccoli förklara själv.",
    introPlayAnswer: "Spela upp svaret",
    introVoiceNote:
      "Förinspelat med en partnerröst. På den här telefonen beror hans röst på de vägar du väljer.",
    introSetupTitle: "Ingen panik",
    introSetupBody: "En nödvändig nedladdning och det fungerar.",
    introHeroTitle: "Nu sätter vi igång",
    introHeroBody:
      "Han mäter den här telefonen först — inget laddas ner innan du har sett planen.",
    introGlyphListen: "Han lyssnar",
    introGlyphThink: "Han tänker",
    introGlyphAnswer: "Han svarar",
    introAutoAction: "Ställ in automatiskt",
    introManualSwitch: "Visa manuell installation",
    introManualTitle: "Manuell installation",
    introTagRequired: "Krävs",
    introTryTitle: "Prova själv",
    introTryBody:
      "Din installation är igång — fråga något och hör hur han svarar. Inte nöjd? Gå tillbaka, ändra och försök igen.",
    introHoldToTalk: "Håll för att tala",
    introToFirstWord: "till första ordet",
    introReplay: "Spela igen",
    introMoreModels: "Fler modeller…",
    introNotInstalled: "Inte installerad",
    introProviderLocked: "En leverantör du redan använder",
    introManualPhoneRoute: "Din telefon",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Steg ${step} av ${total}`,
    introHearStop: "Stoppa",
    introNext: "Nästa",
    introBack: "Tillbaka",
    introOptional: "Valfritt",
    introVoicePickerTitle: "Välj ett språk",
    introVoicePickerHint: "Hör exemplet på ett annat språk",

    introWelcomeTitle: "Välkommen",
  },
  tr: {
    introBannerSetting: "Tanıtım",
    speechInputUnavailableHint:
      "Henüz konuşma tanıma ayarlanmadı, bu yüzden mesajını yaz.",
    introBannerTitle: "Mr Broccoli kurulumu",
    introBannerBody:
      "Bir dakikalık kurulumla düşünmeye, sizi duymaya ve sesli yanıt vermeye başlar.",
    introBannerDismiss: "Tanıtımı kapat",
    introTestTurnFailed:
      "Deneme turu tamamlanmadı. Geri dön, kurulumu kontrol et ve yeniden dene.",
    introDialogueOpeningPrompt: "Aslında ne işe yarıyorsun?",
    introDialogueFar:
      "Üzerine düşünmeye değer sohbetler için — doğal biçimde konuşarak ve hangi yapay zekânın yanıtladığını gizlemeden.",
    introDialogueQuestion: "Yani seninle sadece konuşmam yeterli mi?",
    introDialogueNear:
      "Evet. Sesini metne çevirir, sohbetin bağlamını korur ve yanıtı sesli okurum.",
    introDialoguePromptThree: "Düşünme işini kim yapıyor?",
    introDialogueResponseThree:
      "Senin seçtiğin model: bu telefondaki bir model ya da zaten kullandığın bir sağlayıcı.",
    introDialoguePromptFour: "Peki sohbetlerim telefondan çıkıyor mu?",
    introDialogueResponseFour:
      "Bu cihazda kalırlar. Barındırılan bir model seçersen yanıt için gereken bağlam doğrudan o sağlayıcıya gider.",
    introWelcomeQuery: "Bu uygulama aslında nasıl çalışıyor?",
    introDialoguePlayResponse:
      "Bu yanıt sesli duyulunca daha anlamlı. Oynata dokun ve Mr Broccoli'nin kendini anlatmasına izin ver.",
    introPlayAnswer: "Yanıtı çal",
    introVoiceNote:
      "Bir iş ortağı sesiyle önceden kaydedildi. Bu telefonda sesi, seçtiğin yollara bağlıdır.",
    introSetupTitle: "Panik yok",
    introSetupBody: "Gerekli tek bir indirme ve çalışıyor.",
    introHeroTitle: "Haydi başlayalım",
    introHeroBody:
      "Önce bu telefonu ölçer — planı görmeden hiçbir şey indirilmez.",
    introGlyphListen: "Dinler",
    introGlyphThink: "Düşünür",
    introGlyphAnswer: "Yanıtlar",
    introAutoAction: "Otomatik olarak kur",
    introManualSwitch: "Manuel kurulumu göster",
    introManualTitle: "Manuel kurulum",
    introTagRequired: "Gerekli",
    introTryTitle: "Deneyin",
    introTryBody:
      "Kurulumun çalışıyor — bir şey sor ve nasıl yanıtladığını dinle. Memnun kalmadın mı? Geri dön, değiştir, yeniden dene.",
    introHoldToTalk: "Konuşmak için basılı tut",
    introToFirstWord: "ilk kelimeye kadar",
    introReplay: "Yeniden çal",
    introMoreModels: "Daha fazla model…",
    introNotInstalled: "Yüklü değil",
    introProviderLocked: "Zaten kullandığın bir sağlayıcı",
    introManualPhoneRoute: "Telefonun",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Adım ${step} / ${total}`,
    introHearStop: "Durdur",
    introNext: "İleri",
    introBack: "Geri",
    introOptional: "İsteğe bağlı",
    introVoicePickerTitle: "Bir dil seç",
    introVoicePickerHint: "Örneği başka bir dilde dinle",

    introWelcomeTitle: "Hoş geldin",
  },
  uk: {
    introBannerSetting: "Знайомство",
    speechInputUnavailableHint:
      "Розпізнавання мовлення ще не налаштовано, тож надрукуй повідомлення.",
    introBannerTitle: "Налаштуйте Mr Broccoli",
    introBannerBody:
      "Хвилина налаштування — і він думає, чує вас і відповідає вголос.",
    introBannerDismiss: "Закрити знайомство",
    introTestTurnFailed:
      "Пробний хід не завершився. Поверніться, перевірте налаштування і спробуйте ще раз.",
    introDialogueOpeningPrompt: "Для чого ти взагалі потрібен?",
    introDialogueFar:
      "Для розмов, які варто обдумати, — природних і без приховування того, який ШІ відповідає.",
    introDialogueQuestion: "Тобто я можу просто говорити з тобою?",
    introDialogueNear:
      "Так. Я перетворюю голос на текст, зберігаю хід розмови й озвучую відповідь.",
    introDialoguePromptThree: "А хто думає над відповіддю?",
    introDialogueResponseThree:
      "Обрана тобою модель: на цьому телефоні або від провайдера, яким ти вже користуєшся.",
    introDialoguePromptFour: "Мої розмови залишають телефон?",
    introDialogueResponseFour:
      "Вони зберігаються на цьому пристрої. Якщо обрати хмарну модель, потрібний контекст надходить прямо її провайдеру.",
    introWelcomeQuery: "Як узагалі працює цей застосунок?",
    introDialoguePlayResponse:
      "Цю відповідь краще почути. Натисни відтворення, і Mr Broccoli пояснить усе сам.",
    introPlayAnswer: "Відтворити відповідь",
    introVoiceNote:
      "Записано заздалегідь партнерським голосом. На цьому телефоні його голос залежить від обраних маршрутів.",
    introSetupTitle: "Без паніки",
    introSetupBody: "Одне обов'язкове завантаження — і все працює.",
    introHeroTitle: "Почнімо",
    introHeroBody:
      "Спершу він вимірює цей телефон — нічого не завантажується, доки ви не побачите план.",
    introGlyphListen: "Він слухає",
    introGlyphThink: "Він думає",
    introGlyphAnswer: "Він відповідає",
    introAutoAction: "Налаштувати автоматично",
    introManualSwitch: "Показати ручне налаштування",
    introManualTitle: "Ручне налаштування",
    introTagRequired: "Обов'язково",
    introTryTitle: "Спробуйте",
    introTryBody:
      "Ваше налаштування працює — запитайте щось і послухайте, як він відповідає. Не подобається? Поверніться, змініть його і спробуйте ще раз.",
    introHoldToTalk: "Утримуйте, щоб говорити",
    introToFirstWord: "до першого слова",
    introReplay: "Повторити",
    introMoreModels: "Інші моделі…",
    introNotInstalled: "Не встановлено",
    introProviderLocked: "Провайдер, яким ви вже користуєтесь",
    introManualPhoneRoute: "Ваш телефон",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Крок ${step} з ${total}`,
    introHearStop: "Зупинити",
    introNext: "Далі",
    introBack: "Назад",
    introOptional: "Необовʼязково",
    introVoicePickerTitle: "Обери мову",
    introVoicePickerHint: "Послухати приклад іншою мовою",

    introWelcomeTitle: "Вітаємо",
  },
  ur: {
    introBannerSetting: "تعارف",
    speechInputUnavailableHint:
      "ابھی تقریر کی شناخت ترتیب نہیں دی گئی، اس لیے اپنا پیغام لکھیں۔",
    introBannerTitle: "Mr Broccoli سیٹ اپ کریں",
    introBannerBody:
      "ایک منٹ کے سیٹ اپ سے وہ سوچنے، آپ کو سننے اور بول کر جواب دینے لگتا ہے۔",
    introBannerDismiss: "تعارف بند کریں",
    introTestTurnFailed:
      "آزمائشی سوال مکمل نہیں ہوا۔ پیچھے جائیں، سیٹ اپ جانچیں اور دوبارہ کوشش کریں۔",
    introDialogueOpeningPrompt: "اصل میں تم کس کام کے لیے ہو؟",
    introDialogueFar:
      "ایسی گفتگو کے لیے جس پر غور کرنا بنتا ہو—قدرتی انداز میں، اور یہ چھپائے بغیر کہ کون سی AI جواب دے رہی ہے۔",
    introDialogueQuestion: "تو میں بس تم سے بات کر سکتا ہوں؟",
    introDialogueNear:
      "ہاں۔ میں تمہاری آواز کو متن میں بدلتا ہوں، گفتگو کا سلسلہ قائم رکھتا ہوں اور جواب بول کر سناتا ہوں۔",
    introDialoguePromptThree: "سوچنے کا کام کون کرتا ہے؟",
    introDialogueResponseThree:
      "تمہارا منتخب کیا ہوا ماڈل: اس فون پر موجود یا کوئی فراہم کنندہ جسے تم پہلے سے استعمال کرتے ہو۔",
    introDialoguePromptFour: "اور کیا میری گفتگو فون سے باہر جاتی ہے؟",
    introDialogueResponseFour:
      "وہ اسی ڈیوائس پر رہتی ہے۔ ہوسٹڈ ماڈل چننے پر جواب کے لیے ضروری سیاق براہِ راست اسی فراہم کنندہ کو جاتا ہے۔",
    introWelcomeQuery: "یہ ایپ اصل میں کام کیسے کرتی ہے؟",
    introDialoguePlayResponse:
      "یہ جواب سن کر زیادہ واضح ہوگا۔ پلے دباؤ اور Mr Broccoli کو خود سمجھانے دو۔",
    introPlayAnswer: "جواب سنیں",
    introVoiceNote:
      "ایک ساتھی آواز میں پہلے سے ریکارڈ شدہ۔ اس فون پر اس کی آواز آپ کے چنے ہوئے راستوں پر منحصر ہے۔",
    introSetupTitle: "گھبرائیں نہیں",
    introSetupBody: "ایک ضروری ڈاؤن لوڈ اور یہ کام کرنے لگتی ہے۔",
    introHeroTitle: "آئیے شروع کریں",
    introHeroBody:
      "وہ پہلے اس فون کو جانچتا ہے — منصوبہ دیکھنے سے پہلے کچھ ڈاؤن لوڈ نہیں ہوتا۔",
    introGlyphListen: "وہ سنتا ہے",
    introGlyphThink: "وہ سوچتا ہے",
    introGlyphAnswer: "وہ جواب دیتا ہے",
    introAutoAction: "خودکار طور پر سیٹ کریں",
    introManualSwitch: "دستی سیٹ اپ دکھائیں",
    introManualTitle: "دستی سیٹ اپ",
    introTagRequired: "ضروری",
    introTryTitle: "آزما کر دیکھیں",
    introTryBody:
      "آپ کا سیٹ اپ چل رہا ہے — کچھ پوچھیں اور سنیں کہ وہ کیسے جواب دیتا ہے۔ پسند نہیں آیا؟ پیچھے جائیں، بدلیں اور دوبارہ آزمائیں۔",
    introHoldToTalk: "بولنے کے لیے دبائے رکھیں",
    introToFirstWord: "پہلے لفظ تک",
    introReplay: "دوبارہ سنیں",
    introMoreModels: "مزید ماڈلز…",
    introNotInstalled: "انسٹال نہیں ہے",
    introProviderLocked: "ایک فراہم کنندہ جو آپ پہلے سے استعمال کرتے ہیں",
    introManualPhoneRoute: "آپ کا فون",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `مرحلہ ${step} از ${total}`,
    introHearStop: "روکیں",
    introNext: "آگے",
    introBack: "پیچھے",
    introOptional: "اختیاری",
    introVoicePickerTitle: "زبان منتخب کریں",
    introVoicePickerHint: "مثال کسی اور زبان میں سنیں",

    introWelcomeTitle: "خوش آمدید",
  },
  "zh-CN": {
    introBannerSetting: "介绍",
    speechInputUnavailableHint: "还没有设置语音识别，请改用打字。",
    introBannerTitle: "设置 Mr Broccoli",
    introBannerBody: "一分钟设置，他就能思考、听懂你并开口回答。",
    introBannerDismiss: "关闭介绍",
    introTestTurnFailed: "测试没有完成。请退回上一步，检查设置后再试一次。",
    introDialogueOpeningPrompt: "你到底是用来做什么的？",
    introDialogueFar:
      "用来进行值得认真思考的对话——自然地说出来，也不隐藏究竟是哪一个 AI 在回答。",
    introDialogueQuestion: "所以我直接和你说话就行？",
    introDialogueNear:
      "对。我把你的语音转成文字，延续对话上下文，再把回答读给你听。",
    introDialoguePromptThree: "真正负责思考的是谁？",
    introDialogueResponseThree:
      "由你选择的模型：可以是这台手机上的模型，也可以是你已经在用的服务商。",
    introDialoguePromptFour: "那我的对话会离开手机吗？",
    introDialogueResponseFour:
      "对话保存在这台设备上。如果选择托管模型，回答所需的上下文会直接发送给该服务商。",
    introWelcomeQuery: "这个应用到底是怎么运作的？",
    introDialoguePlayResponse:
      "这个问题用声音回答更容易理解。点按播放，让 Mr Broccoli 亲自解释。",
    introPlayAnswer: "播放回答",
    introVoiceNote:
      "由合作伙伴的声音预先录制。在这部手机上，他的声音取决于你选择的路线。",
    introSetupTitle: "别担心",
    introSetupBody: "只需一次必要下载，即可使用。",
    introHeroTitle: "让我们开始吧",
    introHeroBody: "他会先测量这部手机——在你看到方案之前不会下载任何内容。",
    introGlyphListen: "他会听",
    introGlyphThink: "他会想",
    introGlyphAnswer: "他会答",
    introAutoAction: "自动设置",
    introManualSwitch: "显示手动设置",
    introManualTitle: "手动设置",
    introTagRequired: "必需",
    introTryTitle: "试一试",
    introTryBody:
      "你的设置已经在运行——问点什么，听听他怎么回答。不满意？退回上一步，改一改，再试一次。",
    introHoldToTalk: "按住说话",
    introToFirstWord: "到第一个词",
    introReplay: "重播",
    introMoreModels: "更多模型…",
    introNotInstalled: "未安装",
    introProviderLocked: "你已在使用的提供商",
    introManualPhoneRoute: "你的手机",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `第 ${step} 步，共 ${total} 步`,
    introHearStop: "停止",
    introNext: "下一步",
    introBack: "上一步",
    introOptional: "可选",
    introVoicePickerTitle: "选择语言",
    introVoicePickerHint: "用其他语言听这段示例",

    introWelcomeTitle: "欢迎",
  },
} as const;

export const introTranslations = rawIntroTranslations;
