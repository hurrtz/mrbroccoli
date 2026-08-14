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
    introDialogueFar:
      "Broccoli comes from the Italian broccolo — the flowering crest of a cabbage.",
    introDialogueQuestion: "And you can hear me and talk back?",
    introDialogueNear:
      "I listen, think and speak — with whatever engines you give me.",
    introWelcomeQuery: "How does this application work?",
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
    introNext: "Next",
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
    introDialogueFar:
      "كلمة بروكلي تأتي من الإيطالية broccolo — القمة المزهرة للكرنب.",
    introDialogueQuestion: "وهل يمكنك سماعي والرد عليّ؟",
    introDialogueNear: "أستمع وأفكر وأتحدث — بأي محركات تمنحها لي.",
    introWelcomeQuery: "كيف يعمل هذا التطبيق فعليًا؟",
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
    introDialogueFar:
      "Brokolice pochází z italského broccolo — kvetoucí vrcholek zelí.",
    introDialogueQuestion: "A ty mě slyšíš a umíš odpovědět nahlas?",
    introDialogueNear:
      "Poslouchám, přemýšlím a mluvím — s motory, které mi dáte.",
    introWelcomeQuery: "Jak vlastně tahle aplikace funguje?",
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
    introDialogueFar:
      "Brokkoli kommt vom italienischen broccolo — dem blühenden Spross eines Kohls.",
    introDialogueQuestion: "Und du kannst mich hören und antworten?",
    introDialogueNear:
      "Ich höre, denke und spreche — mit den Antrieben, die du mir gibst.",
    introWelcomeQuery: "Wie funktioniert diese App eigentlich?",
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
    introDialogueFar:
      "Brócoli viene del italiano broccolo: el brote florido de una col.",
    introDialogueQuestion: "¿Y puedes oírme y responderme?",
    introDialogueNear:
      "Escucho, pienso y hablo, con los motores que tú me des.",
    introWelcomeQuery: "¿Cómo funciona esta aplicación?",
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
    introDialogueFar:
      "Brocoli vient de l'italien broccolo — la pousse fleurie d'un chou.",
    introDialogueQuestion: "Et vous pouvez m'entendre et me répondre ?",
    introDialogueNear:
      "J'écoute, je réfléchis et je parle — avec les moteurs que vous me donnez.",
    introWelcomeQuery: "Comment fonctionne cette application ?",
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
    introDialogueFar:
      "ब्रोकली इतालवी शब्द broccolo से आया है — गोभी की फूलदार कोंपल।",
    introDialogueQuestion: "और तुम मुझे सुन सकते हो और जवाब दे सकते हो?",
    introDialogueNear:
      "मैं सुनता हूँ, सोचता हूँ और बोलता हूँ — उन इंजनों से जो आप मुझे देते हैं।",
    introWelcomeQuery: "यह ऐप असल में काम कैसे करता है?",
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
    introDialogueFar:
      "A brokkoli az olasz broccolo szóból ered — a káposzta virágzó hajtása.",
    introDialogueQuestion: "És hallasz engem, és tudsz válaszolni?",
    introDialogueNear:
      "Hallgatok, gondolkodom és beszélek — azokkal a motorokkal, amiket adsz nekem.",
    introWelcomeQuery: "Hogyan működik ez az alkalmazás?",
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
    introDialogueFar:
      "Broccoli viene da broccolo: la cima fiorita di un cavolo.",
    introDialogueQuestion: "E puoi sentirmi e rispondermi?",
    introDialogueNear: "Ascolto, penso e parlo, con i motori che mi dai tu.",
    introWelcomeQuery: "Come funziona questa app?",
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
    introDialogueFar:
      "ブロッコリーはイタリア語の broccolo に由来します。キャベツの花芽のことです。",
    introDialogueQuestion: "私の声が聞こえて、返事もできるの？",
    introDialogueNear:
      "聞いて、考えて、話します。エンジンはあなたが選んだものを使います。",
    introWelcomeQuery: "このアプリは実際どうやって動いているの？",
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
    introDialogueFar:
      "Brokuł pochodzi od włoskiego broccolo — kwitnącego pędu kapusty.",
    introDialogueQuestion: "I słyszysz mnie, i umiesz odpowiedzieć?",
    introDialogueNear: "Słucham, myślę i mówię — silnikami, które mi dasz.",
    introWelcomeQuery: "Jak właściwie działa ta aplikacja?",
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
    introDialogueFar:
      "Brócolo vem do italiano broccolo — o rebento florido de uma couve.",
    introDialogueQuestion: "E consegues ouvir-me e responder?",
    introDialogueNear: "Ouço, penso e falo — com os motores que me deres.",
    introWelcomeQuery: "Como funciona esta aplicação?",
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
    introDialogueFar:
      "Brócolis vem do italiano broccolo — o broto florido de um repolho.",
    introDialogueQuestion: "E você consegue me ouvir e responder?",
    introDialogueNear:
      "Eu ouço, penso e falo — com os motores que você me der.",
    introWelcomeQuery: "Como funciona esse aplicativo?",
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
    introDialogueFar:
      "Слово брокколи происходит от итальянского broccolo — цветущий побег капусты.",
    introDialogueQuestion: "И ты можешь меня слышать и отвечать?",
    introDialogueNear:
      "Я слушаю, думаю и говорю — теми движками, которые вы мне дадите.",
    introWelcomeQuery: "Как вообще работает это приложение?",
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
    introDialogueFar:
      "Broccoli kommer från italienskans broccolo — kålens blommande skott.",
    introDialogueQuestion: "Och du kan höra mig och svara?",
    introDialogueNear:
      "Jag lyssnar, tänker och talar — med de motorer du ger mig.",
    introWelcomeQuery: "Hur fungerar den här appen egentligen?",
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
    introDialogueFar:
      "Brokoli, İtalyanca broccolo sözcüğünden gelir — lahananın çiçekli filizi.",
    introDialogueQuestion: "Peki beni duyup cevap verebiliyor musun?",
    introDialogueNear:
      "Dinlerim, düşünürüm ve konuşurum — bana verdiğin motorlarla.",
    introWelcomeQuery: "Bu uygulama aslında nasıl çalışıyor?",
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
    introDialogueFar:
      "Слово броколі походить від італійського broccolo — квітучий пагін капусти.",
    introDialogueQuestion: "І ти можеш мене чути й відповідати?",
    introDialogueNear:
      "Я слухаю, думаю й говорю — тими рушіями, які ви мені дасте.",
    introWelcomeQuery: "Як узагалі працює цей застосунок?",
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
    introDialogueFar:
      "بروکلی اطالوی لفظ broccolo سے آیا ہے — گوبھی کی پھولدار کونپل۔",
    introDialogueQuestion: "اور تم مجھے سن کر جواب دے سکتے ہو؟",
    introDialogueNear:
      "میں سنتا ہوں، سوچتا ہوں اور بولتا ہوں — ان انجنوں سے جو آپ مجھے دیں۔",
    introWelcomeQuery: "یہ ایپ اصل میں کام کیسے کرتی ہے؟",
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
    introDialogueFar: "西兰花一词源自意大利语 broccolo——卷心菜开花的嫩芽。",
    introDialogueQuestion: "那你能听到我说话并回答我吗？",
    introDialogueNear: "我能听、能想、能说——用你为我选择的引擎。",
    introWelcomeQuery: "这个应用到底是怎么运作的？",
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
