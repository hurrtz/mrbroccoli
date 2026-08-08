import type { TranslationParams } from "./types";

const performanceTranslations = {
  en: {
    onDevicePerformanceMeasured: "Measured on this phone",
    onDevicePerformanceCalibrated: "Estimated from tests on this phone",
    onDevicePerformanceEstimated: "Estimated from phone specifications",
    onDevicePerformanceStrong: "Strong fit",
    onDevicePerformanceClose: "Close fit; test before using",
    onDevicePerformanceLoad: ({ load }: TranslationParams) => `${load} ms load`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× RAM headroom`,
    onDevicePerformanceCaution:
      "Predictions are estimates. The model test is short and cannot guarantee sustained speed, heat, or battery use.",
  },
  de: {
    onDevicePerformanceMeasured: "Auf diesem Smartphone gemessen",
    onDevicePerformanceCalibrated: "Aus Tests auf diesem Smartphone geschätzt",
    onDevicePerformanceEstimated: "Aus den Gerätedaten geschätzt",
    onDevicePerformanceStrong: "Sehr gut geeignet",
    onDevicePerformanceClose: "Knapp geeignet; vor Verwendung testen",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} ms Ladezeit`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× RAM-Reserve`,
    onDevicePerformanceCaution:
      "Prognosen sind Schätzungen. Der Modelltest ist kurz und garantiert weder Dauergeschwindigkeit noch Wärme- oder Akkuverhalten.",
  },
  uk: {
    onDevicePerformanceMeasured: "Виміряно на цьому телефоні",
    onDevicePerformanceCalibrated: "Оцінено за тестами на цьому телефоні",
    onDevicePerformanceEstimated: "Оцінено за характеристиками телефону",
    onDevicePerformanceStrong: "Добре підходить",
    onDevicePerformanceClose: "На межі; перевірте перед використанням",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} мс завантаження`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× запасу ОЗП`,
    onDevicePerformanceCaution:
      "Прогнози є орієнтовними. Короткий тест моделі не гарантує тривалої швидкості, нагрівання чи витрати батареї.",
  },
  hi: {
    onDevicePerformanceMeasured: "इस फ़ोन पर मापा गया",
    onDevicePerformanceCalibrated: "इस फ़ोन के परीक्षणों से अनुमानित",
    onDevicePerformanceEstimated: "फ़ोन की विशेषताओं से अनुमानित",
    onDevicePerformanceStrong: "बहुत उपयुक्त",
    onDevicePerformanceClose: "सीमित उपयुक्तता; उपयोग से पहले जाँचें",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} मि.से. लोड`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× RAM गुंजाइश`,
    onDevicePerformanceCaution:
      "अनुमान केवल मार्गदर्शन हैं। छोटा मॉडल परीक्षण लंबे समय की गति, गर्मी या बैटरी उपयोग की गारंटी नहीं देता।",
  },
  es: {
    onDevicePerformanceMeasured: "Medido en este teléfono",
    onDevicePerformanceCalibrated:
      "Estimado a partir de pruebas en este teléfono",
    onDevicePerformanceEstimated:
      "Estimado a partir de las especificaciones del teléfono",
    onDevicePerformanceStrong: "Muy adecuado",
    onDevicePerformanceClose: "Ajustado; pruébalo antes de usarlo",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} ms de carga`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× de margen de RAM`,
    onDevicePerformanceCaution:
      "Las predicciones son estimaciones. La prueba del modelo es breve y no garantiza la velocidad sostenida, el calor ni el uso de batería.",
  },
  fr: {
    onDevicePerformanceMeasured: "Mesuré sur ce téléphone",
    onDevicePerformanceCalibrated: "Estimé à partir de tests sur ce téléphone",
    onDevicePerformanceEstimated:
      "Estimé à partir des caractéristiques du téléphone",
    onDevicePerformanceStrong: "Très bien adapté",
    onDevicePerformanceClose: "Limite ; testez avant utilisation",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} ms de chargement`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× de marge RAM`,
    onDevicePerformanceCaution:
      "Les prédictions sont des estimations. Le test du modèle est bref et ne garantit ni la vitesse prolongée, ni la chauffe, ni l’autonomie.",
  },
  it: {
    onDevicePerformanceMeasured: "Misurato su questo telefono",
    onDevicePerformanceCalibrated:
      "Stimato dai test eseguiti su questo telefono",
    onDevicePerformanceEstimated: "Stimato dalle specifiche del telefono",
    onDevicePerformanceStrong: "Molto adatto",
    onDevicePerformanceClose: "Al limite; prova prima dell’uso",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} ms di caricamento`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× di margine RAM`,
    onDevicePerformanceCaution:
      "Le previsioni sono stime. Il test del modello è breve e non garantisce velocità prolungata, calore o consumo della batteria.",
  },
  pt: {
    onDevicePerformanceMeasured: "Medido neste telemóvel",
    onDevicePerformanceCalibrated:
      "Estimado a partir de testes neste telemóvel",
    onDevicePerformanceEstimated:
      "Estimado a partir das especificações do telemóvel",
    onDevicePerformanceStrong: "Muito adequado",
    onDevicePerformanceClose: "No limite; teste antes de usar",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} ms de carregamento`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× de margem de RAM`,
    onDevicePerformanceCaution:
      "As previsões são estimativas. O teste do modelo é breve e não garante velocidade prolongada, aquecimento ou consumo da bateria.",
  },
  ptBR: {
    onDevicePerformanceMeasured: "Medido neste celular",
    onDevicePerformanceCalibrated: "Estimado a partir de testes neste celular",
    onDevicePerformanceEstimated:
      "Estimado a partir das especificações do celular",
    onDevicePerformanceStrong: "Muito adequado",
    onDevicePerformanceClose: "No limite; teste antes de usar",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} ms de carregamento`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× de margem de RAM`,
    onDevicePerformanceCaution:
      "As previsões são estimativas. O teste do modelo é breve e não garante velocidade contínua, aquecimento ou consumo de bateria.",
  },
  ru: {
    onDevicePerformanceMeasured: "Измерено на этом телефоне",
    onDevicePerformanceCalibrated: "Оценено по тестам на этом телефоне",
    onDevicePerformanceEstimated: "Оценено по характеристикам телефона",
    onDevicePerformanceStrong: "Хорошо подходит",
    onDevicePerformanceClose: "На пределе; проверьте перед использованием",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} мс загрузки`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× запаса ОЗУ`,
    onDevicePerformanceCaution:
      "Прогнозы являются оценочными. Короткий тест модели не гарантирует длительную скорость, нагрев или расход батареи.",
  },
  "zh-CN": {
    onDevicePerformanceMeasured: "在此手机上实测",
    onDevicePerformanceCalibrated: "根据此手机上的测试估算",
    onDevicePerformanceEstimated: "根据手机规格估算",
    onDevicePerformanceStrong: "非常适合",
    onDevicePerformanceClose: "勉强适合；使用前请测试",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} 毫秒加载`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× 内存余量`,
    onDevicePerformanceCaution:
      "预测仅为估算。模型测试时间较短，不能保证持续速度、发热或电池消耗。",
  },
  ar: {
    onDevicePerformanceMeasured: "مقاس على هذا الهاتف",
    onDevicePerformanceCalibrated: "مقدّر من اختبارات على هذا الهاتف",
    onDevicePerformanceEstimated: "مقدّر من مواصفات الهاتف",
    onDevicePerformanceStrong: "ملائم جدًا",
    onDevicePerformanceClose: "ملاءمة محدودة؛ اختبره قبل الاستخدام",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} مللي ثانية للتحميل`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× هامش ذاكرة`,
    onDevicePerformanceCaution:
      "التوقعات تقديرية. اختبار النموذج قصير ولا يضمن السرعة المستمرة أو الحرارة أو استهلاك البطارية.",
  },
  ja: {
    onDevicePerformanceMeasured: "この端末で測定",
    onDevicePerformanceCalibrated: "この端末のテスト結果から推定",
    onDevicePerformanceEstimated: "端末仕様から推定",
    onDevicePerformanceStrong: "非常に適しています",
    onDevicePerformanceClose: "余裕が少ないため使用前にテストしてください",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `読み込み ${load} ms`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `RAM 余裕 ${headroom}×`,
    onDevicePerformanceCaution:
      "予測は目安です。モデルテストは短時間のため、持続速度、発熱、バッテリー消費は保証できません。",
  },
  hu: {
    onDevicePerformanceMeasured: "Ezen a telefonon mérve",
    onDevicePerformanceCalibrated: "A telefon tesztjeiből becsülve",
    onDevicePerformanceEstimated: "A telefon adataiból becsülve",
    onDevicePerformanceStrong: "Nagyon jó illeszkedés",
    onDevicePerformanceClose: "Határeset; használat előtt tesztelje",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} ms betöltés`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× RAM-tartalék`,
    onDevicePerformanceCaution:
      "Az előrejelzések becslések. A rövid modellteszt nem garantálja a tartós sebességet, hőmérsékletet vagy akkumulátor-használatot.",
  },
  cs: {
    onDevicePerformanceMeasured: "Změřeno na tomto telefonu",
    onDevicePerformanceCalibrated: "Odhadnuto z testů na tomto telefonu",
    onDevicePerformanceEstimated: "Odhadnuto z parametrů telefonu",
    onDevicePerformanceStrong: "Velmi vhodné",
    onDevicePerformanceClose: "Na hranici; před použitím otestujte",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} ms načítání`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× rezerva RAM`,
    onDevicePerformanceCaution:
      "Předpovědi jsou pouze odhady. Krátký test modelu nezaručuje trvalou rychlost, zahřívání ani spotřebu baterie.",
  },
  pl: {
    onDevicePerformanceMeasured: "Zmierzono na tym telefonie",
    onDevicePerformanceCalibrated: "Oszacowano z testów na tym telefonie",
    onDevicePerformanceEstimated: "Oszacowano ze specyfikacji telefonu",
    onDevicePerformanceStrong: "Bardzo dobre dopasowanie",
    onDevicePerformanceClose: "Na granicy; przetestuj przed użyciem",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} ms ładowania`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× zapasu RAM`,
    onDevicePerformanceCaution:
      "Prognozy są szacunkowe. Krótki test modelu nie gwarantuje stałej szybkości, temperatury ani zużycia baterii.",
  },
  tr: {
    onDevicePerformanceMeasured: "Bu telefonda ölçüldü",
    onDevicePerformanceCalibrated: "Bu telefondaki testlerden tahmin edildi",
    onDevicePerformanceEstimated: "Telefon özelliklerinden tahmin edildi",
    onDevicePerformanceStrong: "Çok uygun",
    onDevicePerformanceClose: "Sınırda; kullanmadan önce test edin",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} ms yükleme`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× RAM payı`,
    onDevicePerformanceCaution:
      "Tahminler yaklaşık değerlerdir. Kısa model testi sürekli hızı, ısınmayı veya pil kullanımını garanti etmez.",
  },
  sv: {
    onDevicePerformanceMeasured: "Uppmätt på den här telefonen",
    onDevicePerformanceCalibrated:
      "Uppskattat från tester på den här telefonen",
    onDevicePerformanceEstimated: "Uppskattat från telefonens specifikationer",
    onDevicePerformanceStrong: "Passar mycket bra",
    onDevicePerformanceClose: "På gränsen; testa före användning",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} ms inläsning`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× RAM-marginal`,
    onDevicePerformanceCaution:
      "Prognoser är uppskattningar. Det korta modelltestet garanterar inte varaktig hastighet, värme eller batterianvändning.",
  },
  ur: {
    onDevicePerformanceMeasured: "اس فون پر ناپا گیا",
    onDevicePerformanceCalibrated: "اس فون کے ٹیسٹ سے اندازہ لگایا گیا",
    onDevicePerformanceEstimated: "فون کی خصوصیات سے اندازہ لگایا گیا",
    onDevicePerformanceStrong: "بہت موزوں",
    onDevicePerformanceClose: "حد کے قریب؛ استعمال سے پہلے جانچیں",
    onDevicePerformanceLoad: ({ load }: TranslationParams) =>
      `${load} ملی سیکنڈ لوڈ`,
    onDevicePerformanceHeadroom: ({ headroom }: TranslationParams) =>
      `${headroom}× ریم گنجائش`,
    onDevicePerformanceCaution:
      "پیش گوئیاں اندازے ہیں۔ مختصر ماڈل ٹیسٹ مسلسل رفتار، حرارت یا بیٹری استعمال کی ضمانت نہیں دیتا۔",
  },
};

const en = {
  ...performanceTranslations.en,
  settingsOnDevice: "On-device AI",
  settingsOnDeviceSummary:
    "Private local models, device checks, downloads, and tests.",
  onDeviceIntro:
    "Choose languages once, then Mr Broccoli only offers local listening, thinking, and speaking models that fit this phone.",
  onDeviceLanguages: "Conversation languages",
  onDeviceLanguagesHint:
    "Every selected local model must support all of these languages. This choice also updates listening and spoken-reply languages.",
  onDeviceTestDevice: "Test this device again",
  onDeviceTestingDevice: "Testing this device…",
  onDeviceDownloadCancelled: "Download cancelled.",
  onDeviceDeviceReady: "Device check complete",
  onDeviceDeviceSummary: ({ memory, storage }: TranslationParams) =>
    `${memory} RAM · ${storage} free`,
  onDeviceNoCompatibleModels:
    "No local model in the curated catalogue supports every selected language and fits this device.",
  onDeviceThinkingModels: "Local responses",
  onDeviceListeningModels: "Local speech recognition",
  onDeviceSpeakingModels: "Local voices",
  onDeviceUse: "Use",
  onDeviceInUse: "In use",
  onDeviceViable: "Test passed",
  onDeviceBelowTarget: "Works, but slower than recommended",
  onDeviceTestFailed: "Test failed",
  onDeviceNotTested: "Not tested yet",
  chooseOnDeviceSttModel:
    "Choose an on-device speech recognition model in Settings.",
  chooseOnDeviceTtsModel: "Choose an on-device speech model in Settings.",
};

type OnDeviceTranslations = typeof en;
const define = (value: OnDeviceTranslations) => value;

export const onDeviceTranslations = {
  en,
  de: define({
    ...performanceTranslations.de,
    settingsOnDevice: "KI auf dem Gerät",
    settingsOnDeviceSummary:
      "Private lokale Modelle, Geräteprüfung, Downloads und Tests.",
    onDeviceIntro:
      "Wähle Sprachen einmal aus. Mr Broccoli bietet danach nur lokale Modelle zum Hören, Denken und Sprechen an, die zu diesem Smartphone passen.",
    onDeviceLanguages: "Gesprächssprachen",
    onDeviceLanguagesHint:
      "Jedes lokale Modell muss alle ausgewählten Sprachen unterstützen. Die Auswahl aktualisiert auch Erkennung und Sprachausgabe.",
    onDeviceTestDevice: "Gerät erneut testen",
    onDeviceTestingDevice: "Gerät wird getestet…",
    onDeviceDownloadCancelled: "تم إلغاء التنزيل.",
    onDeviceDeviceReady: "Geräteprüfung abgeschlossen",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} frei`,
    onDeviceNoCompatibleModels:
      "Kein lokales Modell im geprüften Katalog unterstützt alle ausgewählten Sprachen und passt zu diesem Gerät.",
    onDeviceThinkingModels: "Lokale Antworten",
    onDeviceListeningModels: "Lokale Spracherkennung",
    onDeviceSpeakingModels: "Lokale Stimmen",
    onDeviceUse: "Verwenden",
    onDeviceInUse: "Wird verwendet",
    onDeviceViable: "Test bestanden",
    onDeviceBelowTarget: "Funktioniert, aber langsamer als empfohlen",
    onDeviceTestFailed: "Test fehlgeschlagen",
    onDeviceNotTested: "Noch nicht getestet",
    chooseOnDeviceSttModel:
      "Wähle in den Einstellungen ein Modell zur Spracherkennung auf dem Gerät aus.",
    chooseOnDeviceTtsModel:
      "Wähle in den Einstellungen ein Modell zur Sprachausgabe auf dem Gerät aus.",
  }),
  uk: define({
    ...performanceTranslations.uk,
    settingsOnDevice: "ШІ на пристрої",
    settingsOnDeviceSummary:
      "Приватні локальні моделі, перевірка пристрою, завантаження й тести.",
    onDeviceIntro:
      "Виберіть мови один раз, і Mr Broccoli запропонує лише локальні моделі для слухання, мислення та мовлення, які підходять цьому телефону.",
    onDeviceLanguages: "Мови розмови",
    onDeviceLanguagesHint:
      "Кожна локальна модель має підтримувати всі вибрані мови. Вибір також оновлює мови розпізнавання та озвучення.",
    onDeviceTestDevice: "Перевірити пристрій знову",
    onDeviceTestingDevice: "Перевірка пристрою…",
    onDeviceDownloadCancelled: "Stahování zrušeno.",
    onDeviceDeviceReady: "Перевірку пристрою завершено",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} ОЗП · ${storage} вільно`,
    onDeviceNoCompatibleModels:
      "У перевіреному каталозі немає локальної моделі, яка підтримує всі вибрані мови й підходить цьому пристрою.",
    onDeviceThinkingModels: "Локальні відповіді",
    onDeviceListeningModels: "Локальне розпізнавання мовлення",
    onDeviceSpeakingModels: "Локальні голоси",
    onDeviceUse: "Використовувати",
    onDeviceInUse: "Використовується",
    onDeviceViable: "Тест пройдено",
    onDeviceBelowTarget: "Працює, але повільніше за рекомендоване",
    onDeviceTestFailed: "Тест не пройдено",
    onDeviceNotTested: "Ще не перевірено",
    chooseOnDeviceSttModel:
      "Виберіть у налаштуваннях модель розпізнавання мовлення на пристрої.",
    chooseOnDeviceTtsModel:
      "Виберіть у налаштуваннях модель мовлення на пристрої.",
  }),
  hi: define({
    ...performanceTranslations.hi,
    settingsOnDevice: "डिवाइस पर AI",
    settingsOnDeviceSummary:
      "निजी स्थानीय मॉडल, डिवाइस जाँच, डाउनलोड और परीक्षण।",
    onDeviceIntro:
      "भाषाएँ एक बार चुनें। फिर Mr Broccoli केवल इसी फ़ोन पर चल सकने वाले स्थानीय सुनने, सोचने और बोलने के मॉडल दिखाएगा।",
    onDeviceLanguages: "बातचीत की भाषाएँ",
    onDeviceLanguagesHint:
      "हर स्थानीय मॉडल को चुनी हुई सभी भाषाओं का समर्थन करना होगा। यह चयन सुनने और बोले गए उत्तरों की भाषाएँ भी बदलता है।",
    onDeviceTestDevice: "इस डिवाइस को फिर जाँचें",
    onDeviceTestingDevice: "डिवाइस की जाँच हो रही है…",
    onDeviceDownloadCancelled: "Download abgebrochen.",
    onDeviceDeviceReady: "डिवाइस जाँच पूरी हुई",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} खाली`,
    onDeviceNoCompatibleModels:
      "चुनी हुई सभी भाषाओं और इस डिवाइस के लिए कोई उपयुक्त स्थानीय मॉडल नहीं है।",
    onDeviceThinkingModels: "स्थानीय उत्तर",
    onDeviceListeningModels: "स्थानीय वाक् पहचान",
    onDeviceSpeakingModels: "स्थानीय आवाज़ें",
    onDeviceUse: "उपयोग करें",
    onDeviceInUse: "उपयोग में",
    onDeviceViable: "परीक्षण सफल",
    onDeviceBelowTarget: "चलता है, लेकिन सुझाई गति से धीमा",
    onDeviceTestFailed: "परीक्षण विफल",
    onDeviceNotTested: "अभी परीक्षण नहीं हुआ",
    chooseOnDeviceSttModel:
      "सेटिंग्स में डिवाइस पर चलने वाला वाक् पहचान मॉडल चुनें।",
    chooseOnDeviceTtsModel: "सेटिंग्स में डिवाइस पर चलने वाला वाक् मॉडल चुनें।",
  }),
  es: define({
    ...performanceTranslations.es,
    settingsOnDevice: "IA en el dispositivo",
    settingsOnDeviceSummary:
      "Modelos locales privados, comprobación del dispositivo, descargas y pruebas.",
    onDeviceIntro:
      "Elige los idiomas una vez y Mr Broccoli solo ofrecerá modelos locales de escucha, razonamiento y voz que funcionen en este teléfono.",
    onDeviceLanguages: "Idiomas de conversación",
    onDeviceLanguagesHint:
      "Cada modelo local debe admitir todos estos idiomas. La selección también actualiza los idiomas de reconocimiento y respuesta hablada.",
    onDeviceTestDevice: "Volver a probar el dispositivo",
    onDeviceTestingDevice: "Probando el dispositivo…",
    onDeviceDownloadCancelled: "Descarga cancelada.",
    onDeviceDeviceReady: "Comprobación completada",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} libres`,
    onDeviceNoCompatibleModels:
      "Ningún modelo local del catálogo verificado admite todos los idiomas elegidos y funciona en este dispositivo.",
    onDeviceThinkingModels: "Respuestas locales",
    onDeviceListeningModels: "Reconocimiento de voz local",
    onDeviceSpeakingModels: "Voces locales",
    onDeviceUse: "Usar",
    onDeviceInUse: "En uso",
    onDeviceViable: "Prueba superada",
    onDeviceBelowTarget: "Funciona, pero más lento de lo recomendado",
    onDeviceTestFailed: "Prueba fallida",
    onDeviceNotTested: "Aún sin probar",
    chooseOnDeviceSttModel:
      "Elige en Ajustes un modelo de reconocimiento de voz en el dispositivo.",
    chooseOnDeviceTtsModel:
      "Elige en Ajustes un modelo de voz en el dispositivo.",
  }),
  fr: define({
    ...performanceTranslations.fr,
    settingsOnDevice: "IA sur l’appareil",
    settingsOnDeviceSummary:
      "Modèles locaux privés, contrôle de l’appareil, téléchargements et tests.",
    onDeviceIntro:
      "Choisissez les langues une fois. Mr Broccoli ne proposera ensuite que les modèles locaux d’écoute, de réflexion et de voix adaptés à ce téléphone.",
    onDeviceLanguages: "Langues de conversation",
    onDeviceLanguagesHint:
      "Chaque modèle local doit prendre en charge toutes ces langues. Ce choix met aussi à jour les langues d’écoute et des réponses vocales.",
    onDeviceTestDevice: "Retester cet appareil",
    onDeviceTestingDevice: "Test de l’appareil…",
    onDeviceDownloadCancelled: "Téléchargement annulé.",
    onDeviceDeviceReady: "Contrôle de l’appareil terminé",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} disponibles`,
    onDeviceNoCompatibleModels:
      "Aucun modèle local du catalogue vérifié ne prend en charge toutes les langues choisies tout en étant adapté à cet appareil.",
    onDeviceThinkingModels: "Réponses locales",
    onDeviceListeningModels: "Reconnaissance vocale locale",
    onDeviceSpeakingModels: "Voix locales",
    onDeviceUse: "Utiliser",
    onDeviceInUse: "Utilisé",
    onDeviceViable: "Test réussi",
    onDeviceBelowTarget: "Fonctionne, mais plus lentement que recommandé",
    onDeviceTestFailed: "Échec du test",
    onDeviceNotTested: "Pas encore testé",
    chooseOnDeviceSttModel:
      "Choisissez dans Paramètres un modèle de reconnaissance vocale sur l’appareil.",
    chooseOnDeviceTtsModel:
      "Choisissez dans Paramètres un modèle vocal sur l’appareil.",
  }),
  it: define({
    ...performanceTranslations.it,
    settingsOnDevice: "IA sul dispositivo",
    settingsOnDeviceSummary:
      "Modelli locali privati, verifica del dispositivo, download e test.",
    onDeviceIntro:
      "Scegli le lingue una volta: Mr Broccoli offrirà solo modelli locali di ascolto, ragionamento e voce adatti a questo telefono.",
    onDeviceLanguages: "Lingue della conversazione",
    onDeviceLanguagesHint:
      "Ogni modello locale deve supportare tutte le lingue selezionate. La scelta aggiorna anche le lingue di ascolto e risposta vocale.",
    onDeviceTestDevice: "Verifica di nuovo il dispositivo",
    onDeviceTestingDevice: "Verifica del dispositivo…",
    onDeviceDownloadCancelled: "डाउनलोड रद्द किया गया।",
    onDeviceDeviceReady: "Verifica del dispositivo completata",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} liberi`,
    onDeviceNoCompatibleModels:
      "Nessun modello locale del catalogo curato supporta tutte le lingue selezionate ed è adatto a questo dispositivo.",
    onDeviceThinkingModels: "Risposte locali",
    onDeviceListeningModels: "Riconoscimento vocale locale",
    onDeviceSpeakingModels: "Voci locali",
    onDeviceUse: "Usa",
    onDeviceInUse: "In uso",
    onDeviceViable: "Test superato",
    onDeviceBelowTarget: "Funziona, ma più lentamente del consigliato",
    onDeviceTestFailed: "Test non riuscito",
    onDeviceNotTested: "Non ancora testato",
    chooseOnDeviceSttModel:
      "Scegli nelle impostazioni un modello di riconoscimento vocale sul dispositivo.",
    chooseOnDeviceTtsModel:
      "Scegli nelle impostazioni un modello vocale sul dispositivo.",
  }),
  pt: define({
    ...performanceTranslations.pt,
    settingsOnDevice: "IA no dispositivo",
    settingsOnDeviceSummary:
      "Modelos locais privados, verificação do dispositivo, transferências e testes.",
    onDeviceIntro:
      "Escolha os idiomas uma vez. O Mr Broccoli só mostrará modelos locais de escuta, raciocínio e voz adequados a este telemóvel.",
    onDeviceLanguages: "Idiomas da conversa",
    onDeviceLanguagesHint:
      "Cada modelo local tem de suportar todos os idiomas escolhidos. A seleção também atualiza os idiomas de escuta e resposta falada.",
    onDeviceTestDevice: "Testar novamente este dispositivo",
    onDeviceTestingDevice: "A testar o dispositivo…",
    onDeviceDownloadCancelled: "A letöltés megszakítva.",
    onDeviceDeviceReady: "Verificação do dispositivo concluída",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} livres`,
    onDeviceNoCompatibleModels:
      "Nenhum modelo local do catálogo verificado suporta todos os idiomas escolhidos e cabe neste dispositivo.",
    onDeviceThinkingModels: "Respostas locais",
    onDeviceListeningModels: "Reconhecimento de voz local",
    onDeviceSpeakingModels: "Vozes locais",
    onDeviceUse: "Usar",
    onDeviceInUse: "Em uso",
    onDeviceViable: "Teste aprovado",
    onDeviceBelowTarget: "Funciona, mas é mais lento do que o recomendado",
    onDeviceTestFailed: "Teste falhou",
    onDeviceNotTested: "Ainda não testado",
    chooseOnDeviceSttModel:
      "Escolha um modelo de reconhecimento de voz no dispositivo em Definições.",
    chooseOnDeviceTtsModel:
      "Escolha um modelo de voz no dispositivo em Definições.",
  }),
  ptBR: define({
    ...performanceTranslations.ptBR,
    settingsOnDevice: "IA no dispositivo",
    settingsOnDeviceSummary:
      "Modelos locais privados, verificação do dispositivo, downloads e testes.",
    onDeviceIntro:
      "Escolha os idiomas uma vez. O Mr Broccoli só mostrará modelos locais de escuta, raciocínio e voz adequados a este celular.",
    onDeviceLanguages: "Idiomas da conversa",
    onDeviceLanguagesHint:
      "Cada modelo local deve aceitar todos os idiomas escolhidos. A seleção também atualiza os idiomas de escuta e resposta falada.",
    onDeviceTestDevice: "Testar este dispositivo novamente",
    onDeviceTestingDevice: "Testando o dispositivo…",
    onDeviceDownloadCancelled: "Download annullato.",
    onDeviceDeviceReady: "Verificação do dispositivo concluída",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} livres`,
    onDeviceNoCompatibleModels:
      "Nenhum modelo local do catálogo verificado aceita todos os idiomas escolhidos e cabe neste dispositivo.",
    onDeviceThinkingModels: "Respostas locais",
    onDeviceListeningModels: "Reconhecimento de voz local",
    onDeviceSpeakingModels: "Vozes locais",
    onDeviceUse: "Usar",
    onDeviceInUse: "Em uso",
    onDeviceViable: "Teste aprovado",
    onDeviceBelowTarget: "Funciona, mas é mais lento que o recomendado",
    onDeviceTestFailed: "Teste falhou",
    onDeviceNotTested: "Ainda não testado",
    chooseOnDeviceSttModel:
      "Escolha nas configurações um modelo de reconhecimento de voz no dispositivo.",
    chooseOnDeviceTtsModel:
      "Escolha nas configurações um modelo de voz no dispositivo.",
  }),
  ru: define({
    ...performanceTranslations.ru,
    settingsOnDevice: "ИИ на устройстве",
    settingsOnDeviceSummary:
      "Приватные локальные модели, проверка устройства, загрузки и тесты.",
    onDeviceIntro:
      "Выберите языки один раз, и Mr Broccoli предложит только подходящие этому телефону локальные модели для распознавания, ответов и озвучивания.",
    onDeviceLanguages: "Языки разговора",
    onDeviceLanguagesHint:
      "Каждая локальная модель должна поддерживать все выбранные языки. Выбор также обновляет языки распознавания и голосовых ответов.",
    onDeviceTestDevice: "Проверить устройство снова",
    onDeviceTestingDevice: "Проверка устройства…",
    onDeviceDownloadCancelled: "ダウンロードを取り消しました。",
    onDeviceDeviceReady: "Проверка устройства завершена",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} ОЗУ · ${storage} свободно`,
    onDeviceNoCompatibleModels:
      "В проверенном каталоге нет локальной модели, которая поддерживает все выбранные языки и подходит этому устройству.",
    onDeviceThinkingModels: "Локальные ответы",
    onDeviceListeningModels: "Локальное распознавание речи",
    onDeviceSpeakingModels: "Локальные голоса",
    onDeviceUse: "Использовать",
    onDeviceInUse: "Используется",
    onDeviceViable: "Тест пройден",
    onDeviceBelowTarget: "Работает, но медленнее рекомендованного",
    onDeviceTestFailed: "Тест не пройден",
    onDeviceNotTested: "Ещё не проверено",
    chooseOnDeviceSttModel:
      "Выберите в настройках модель распознавания речи на устройстве.",
    chooseOnDeviceTtsModel:
      "Выберите в настройках модель озвучивания на устройстве.",
  }),
  "zh-CN": define({
    ...performanceTranslations["zh-CN"],
    settingsOnDevice: "设备端 AI",
    settingsOnDeviceSummary: "私密本地模型、设备检测、下载与测试。",
    onDeviceIntro:
      "只需选择一次语言，Mr Broccoli就只会提供适合此手机的本地听写、推理和语音模型。",
    onDeviceLanguages: "对话语言",
    onDeviceLanguagesHint:
      "每个本地模型都必须支持所有所选语言。此选择也会更新听写和语音回复语言。",
    onDeviceTestDevice: "重新测试此设备",
    onDeviceTestingDevice: "正在测试设备…",
    onDeviceDownloadCancelled: "Pobieranie anulowane.",
    onDeviceDeviceReady: "设备检测完成",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} 内存 · ${storage} 可用`,
    onDeviceNoCompatibleModels:
      "经审核的目录中没有同时支持所有所选语言且适合此设备的本地模型。",
    onDeviceThinkingModels: "本地回复",
    onDeviceListeningModels: "本地语音识别",
    onDeviceSpeakingModels: "本地语音",
    onDeviceUse: "使用",
    onDeviceInUse: "使用中",
    onDeviceViable: "测试通过",
    onDeviceBelowTarget: "可以运行，但速度低于建议值",
    onDeviceTestFailed: "测试失败",
    onDeviceNotTested: "尚未测试",
    chooseOnDeviceSttModel: "请在设置中选择设备端语音识别模型。",
    chooseOnDeviceTtsModel: "请在设置中选择设备端语音模型。",
  }),
  ar: define({
    ...performanceTranslations.ar,
    settingsOnDevice: "ذكاء اصطناعي على الجهاز",
    settingsOnDeviceSummary:
      "نماذج محلية خاصة وفحص الجهاز والتنزيلات والاختبارات.",
    onDeviceIntro:
      "اختر اللغات مرة واحدة، وسيعرض Mr Broccoli فقط نماذج الاستماع والتفكير والصوت المحلية المناسبة لهذا الهاتف.",
    onDeviceLanguages: "لغات المحادثة",
    onDeviceLanguagesHint:
      "يجب أن يدعم كل نموذج محلي جميع اللغات المحددة. يحدّث هذا الاختيار أيضًا لغات الاستماع والردود المنطوقة.",
    onDeviceTestDevice: "اختبار هذا الجهاز مجددًا",
    onDeviceTestingDevice: "جارٍ اختبار الجهاز…",
    onDeviceDownloadCancelled: "Transferência cancelada.",
    onDeviceDeviceReady: "اكتمل فحص الجهاز",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} ذاكرة · ${storage} متاحة`,
    onDeviceNoCompatibleModels:
      "لا يوجد نموذج محلي في الكتالوج المراجع يدعم كل اللغات المحددة ويناسب هذا الجهاز.",
    onDeviceThinkingModels: "ردود محلية",
    onDeviceListeningModels: "تعرّف محلي على الكلام",
    onDeviceSpeakingModels: "أصوات محلية",
    onDeviceUse: "استخدام",
    onDeviceInUse: "قيد الاستخدام",
    onDeviceViable: "نجح الاختبار",
    onDeviceBelowTarget: "يعمل، لكنه أبطأ من الموصى به",
    onDeviceTestFailed: "فشل الاختبار",
    onDeviceNotTested: "لم يُختبر بعد",
    chooseOnDeviceSttModel:
      "اختر نموذج تعرّف على الكلام يعمل على الجهاز من الإعدادات.",
    chooseOnDeviceTtsModel: "اختر نموذج كلام يعمل على الجهاز من الإعدادات.",
  }),
  ja: define({
    ...performanceTranslations.ja,
    settingsOnDevice: "オンデバイス AI",
    settingsOnDeviceSummary:
      "プライベートなローカルモデル、端末チェック、ダウンロード、テスト。",
    onDeviceIntro:
      "言語を一度選ぶと、Mr Broccoliはこの端末に適したローカルの音声認識・推論・音声モデルだけを表示します。",
    onDeviceLanguages: "会話の言語",
    onDeviceLanguagesHint:
      "各ローカルモデルは選択したすべての言語に対応する必要があります。この選択は音声認識と読み上げの言語にも反映されます。",
    onDeviceTestDevice: "この端末を再テスト",
    onDeviceTestingDevice: "端末をテスト中…",
    onDeviceDownloadCancelled: "Download cancelado.",
    onDeviceDeviceReady: "端末チェック完了",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM・空き ${storage}`,
    onDeviceNoCompatibleModels:
      "選択したすべての言語に対応し、この端末で動作するローカルモデルは審査済みカタログにありません。",
    onDeviceThinkingModels: "ローカル応答",
    onDeviceListeningModels: "ローカル音声認識",
    onDeviceSpeakingModels: "ローカル音声",
    onDeviceUse: "使用",
    onDeviceInUse: "使用中",
    onDeviceViable: "テスト合格",
    onDeviceBelowTarget: "動作しますが、推奨速度を下回ります",
    onDeviceTestFailed: "テスト失敗",
    onDeviceNotTested: "未テスト",
    chooseOnDeviceSttModel:
      "設定でオンデバイス音声認識モデルを選択してください。",
    chooseOnDeviceTtsModel: "設定でオンデバイス音声モデルを選択してください。",
  }),
  hu: define({
    ...performanceTranslations.hu,
    settingsOnDevice: "Eszközön futó MI",
    settingsOnDeviceSummary:
      "Privát helyi modellek, eszközellenőrzés, letöltések és tesztek.",
    onDeviceIntro:
      "Válaszd ki egyszer a nyelveket, és Mr Broccoli csak az ezen a telefonon futó helyi hallási, gondolkodási és beszédmodelleket kínálja fel.",
    onDeviceLanguages: "Beszélgetési nyelvek",
    onDeviceLanguagesHint:
      "Minden helyi modellnek támogatnia kell az összes kiválasztott nyelvet. Ez a felismerés és a felolvasás nyelveit is frissíti.",
    onDeviceTestDevice: "Eszköz újbóli tesztelése",
    onDeviceTestingDevice: "Eszköz tesztelése…",
    onDeviceDownloadCancelled: "Загрузка отменена.",
    onDeviceDeviceReady: "Eszközellenőrzés kész",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} szabad`,
    onDeviceNoCompatibleModels:
      "Az ellenőrzött katalógusban nincs minden kiválasztott nyelvet támogató, ezen az eszközön futó helyi modell.",
    onDeviceThinkingModels: "Helyi válaszok",
    onDeviceListeningModels: "Helyi beszédfelismerés",
    onDeviceSpeakingModels: "Helyi hangok",
    onDeviceUse: "Használat",
    onDeviceInUse: "Használatban",
    onDeviceViable: "Teszt sikeres",
    onDeviceBelowTarget: "Működik, de az ajánlottnál lassabb",
    onDeviceTestFailed: "Teszt sikertelen",
    onDeviceNotTested: "Még nincs tesztelve",
    chooseOnDeviceSttModel:
      "Válassz egy eszközön futó beszédfelismerési modellt a Beállításokban.",
    chooseOnDeviceTtsModel:
      "Válassz egy eszközön futó beszédmodellt a Beállításokban.",
  }),
  cs: define({
    ...performanceTranslations.cs,
    settingsOnDevice: "AI v zařízení",
    settingsOnDeviceSummary:
      "Soukromé místní modely, kontrola zařízení, stahování a testy.",
    onDeviceIntro:
      "Vyberte jazyky jednou a Mr Broccoli nabídne jen místní modely poslechu, uvažování a hlasu vhodné pro tento telefon.",
    onDeviceLanguages: "Jazyky konverzace",
    onDeviceLanguagesHint:
      "Každý místní model musí podporovat všechny vybrané jazyky. Volba upraví také jazyky rozpoznávání a mluvených odpovědí.",
    onDeviceTestDevice: "Otestovat zařízení znovu",
    onDeviceTestingDevice: "Testování zařízení…",
    onDeviceDownloadCancelled: "Nedladdningen avbröts.",
    onDeviceDeviceReady: "Kontrola zařízení dokončena",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} volné`,
    onDeviceNoCompatibleModels:
      "V prověřeném katalogu není místní model, který podporuje všechny vybrané jazyky a hodí se pro toto zařízení.",
    onDeviceThinkingModels: "Místní odpovědi",
    onDeviceListeningModels: "Místní rozpoznávání řeči",
    onDeviceSpeakingModels: "Místní hlasy",
    onDeviceUse: "Použít",
    onDeviceInUse: "Používá se",
    onDeviceViable: "Test úspěšný",
    onDeviceBelowTarget: "Funguje, ale pomaleji než doporučeno",
    onDeviceTestFailed: "Test selhal",
    onDeviceNotTested: "Zatím netestováno",
    chooseOnDeviceSttModel:
      "V nastavení vyberte model rozpoznávání řeči v zařízení.",
    chooseOnDeviceTtsModel: "V nastavení vyberte hlasový model v zařízení.",
  }),
  pl: define({
    ...performanceTranslations.pl,
    settingsOnDevice: "AI na urządzeniu",
    settingsOnDeviceSummary:
      "Prywatne modele lokalne, kontrola urządzenia, pobieranie i testy.",
    onDeviceIntro:
      "Wybierz języki raz, a Mr Broccoli pokaże tylko lokalne modele słuchania, rozumowania i głosu odpowiednie dla tego telefonu.",
    onDeviceLanguages: "Języki rozmowy",
    onDeviceLanguagesHint:
      "Każdy model lokalny musi obsługiwać wszystkie wybrane języki. Wybór aktualizuje też języki rozpoznawania i odpowiedzi głosowych.",
    onDeviceTestDevice: "Przetestuj urządzenie ponownie",
    onDeviceTestingDevice: "Testowanie urządzenia…",
    onDeviceDownloadCancelled: "İndirme iptal edildi.",
    onDeviceDeviceReady: "Kontrola urządzenia zakończona",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} wolne`,
    onDeviceNoCompatibleModels:
      "W sprawdzonym katalogu nie ma lokalnego modelu obsługującego wszystkie wybrane języki i pasującego do tego urządzenia.",
    onDeviceThinkingModels: "Odpowiedzi lokalne",
    onDeviceListeningModels: "Lokalne rozpoznawanie mowy",
    onDeviceSpeakingModels: "Lokalne głosy",
    onDeviceUse: "Użyj",
    onDeviceInUse: "W użyciu",
    onDeviceViable: "Test zaliczony",
    onDeviceBelowTarget: "Działa, ale wolniej niż zalecane",
    onDeviceTestFailed: "Test nieudany",
    onDeviceNotTested: "Jeszcze nie testowano",
    chooseOnDeviceSttModel:
      "W Ustawieniach wybierz model rozpoznawania mowy na urządzeniu.",
    chooseOnDeviceTtsModel: "W Ustawieniach wybierz model mowy na urządzeniu.",
  }),
  tr: define({
    ...performanceTranslations.tr,
    settingsOnDevice: "Cihaz içi yapay zekâ",
    settingsOnDeviceSummary:
      "Özel yerel modeller, cihaz kontrolü, indirmeler ve testler.",
    onDeviceIntro:
      "Dilleri bir kez seçin; Mr Broccoli yalnızca bu telefona uygun yerel dinleme, düşünme ve ses modellerini sunar.",
    onDeviceLanguages: "Konuşma dilleri",
    onDeviceLanguagesHint:
      "Her yerel model seçilen tüm dilleri desteklemelidir. Bu seçim dinleme ve sesli yanıt dillerini de günceller.",
    onDeviceTestDevice: "Bu cihazı yeniden test et",
    onDeviceTestingDevice: "Cihaz test ediliyor…",
    onDeviceDownloadCancelled: "Завантаження скасовано.",
    onDeviceDeviceReady: "Cihaz kontrolü tamamlandı",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} boş`,
    onDeviceNoCompatibleModels:
      "İncelenmiş katalogda seçilen tüm dilleri destekleyen ve bu cihaza uygun yerel model yok.",
    onDeviceThinkingModels: "Yerel yanıtlar",
    onDeviceListeningModels: "Yerel konuşma tanıma",
    onDeviceSpeakingModels: "Yerel sesler",
    onDeviceUse: "Kullan",
    onDeviceInUse: "Kullanımda",
    onDeviceViable: "Test başarılı",
    onDeviceBelowTarget: "Çalışıyor, ancak önerilenden yavaş",
    onDeviceTestFailed: "Test başarısız",
    onDeviceNotTested: "Henüz test edilmedi",
    chooseOnDeviceSttModel:
      "Ayarlar’dan cihaz içi bir konuşma tanıma modeli seçin.",
    chooseOnDeviceTtsModel: "Ayarlar’dan cihaz içi bir konuşma modeli seçin.",
  }),
  sv: define({
    ...performanceTranslations.sv,
    settingsOnDevice: "AI på enheten",
    settingsOnDeviceSummary:
      "Privata lokala modeller, enhetskontroll, hämtningar och tester.",
    onDeviceIntro:
      "Välj språk en gång. Mr Broccoli visar sedan bara lokala modeller för lyssning, resonemang och tal som passar den här telefonen.",
    onDeviceLanguages: "Samtalsspråk",
    onDeviceLanguagesHint:
      "Varje lokal modell måste stödja alla valda språk. Valet uppdaterar även språk för igenkänning och talade svar.",
    onDeviceTestDevice: "Testa enheten igen",
    onDeviceTestingDevice: "Testar enheten…",
    onDeviceDownloadCancelled: "ڈاؤن لوڈ منسوخ کر دیا گیا۔",
    onDeviceDeviceReady: "Enhetskontrollen är klar",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} ledigt`,
    onDeviceNoCompatibleModels:
      "Ingen lokal modell i den granskade katalogen stöder alla valda språk och passar den här enheten.",
    onDeviceThinkingModels: "Lokala svar",
    onDeviceListeningModels: "Lokal taligenkänning",
    onDeviceSpeakingModels: "Lokala röster",
    onDeviceUse: "Använd",
    onDeviceInUse: "Används",
    onDeviceViable: "Test godkänt",
    onDeviceBelowTarget: "Fungerar, men långsammare än rekommenderat",
    onDeviceTestFailed: "Testet misslyckades",
    onDeviceNotTested: "Inte testad än",
    chooseOnDeviceSttModel:
      "Välj en taligenkänningsmodell på enheten i Inställningar.",
    chooseOnDeviceTtsModel: "Välj en talmodell på enheten i Inställningar.",
  }),
  ur: define({
    ...performanceTranslations.ur,
    settingsOnDevice: "ڈیوائس پر AI",
    settingsOnDeviceSummary: "نجی مقامی ماڈلز، ڈیوائس جانچ، ڈاؤن لوڈ اور ٹیسٹ۔",
    onDeviceIntro:
      "زبانیں ایک بار منتخب کریں، پھر Mr Broccoli صرف اسی فون کے لیے موزوں مقامی سننے، سوچنے اور بولنے کے ماڈلز دکھائے گا۔",
    onDeviceLanguages: "گفتگو کی زبانیں",
    onDeviceLanguagesHint:
      "ہر مقامی ماڈل کو منتخب تمام زبانوں کی معاونت کرنی ہوگی۔ یہ انتخاب سننے اور بولے گئے جواب کی زبانیں بھی بدلتا ہے۔",
    onDeviceTestDevice: "اس ڈیوائس کو دوبارہ جانچیں",
    onDeviceTestingDevice: "ڈیوائس کی جانچ جاری ہے…",
    onDeviceDownloadCancelled: "下载已取消。",
    onDeviceDeviceReady: "ڈیوائس کی جانچ مکمل",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} ریم · ${storage} خالی`,
    onDeviceNoCompatibleModels:
      "جائزہ شدہ فہرست میں کوئی مقامی ماڈل تمام منتخب زبانوں کی معاونت اور اس ڈیوائس پر چلنے کی صلاحیت نہیں رکھتا۔",
    onDeviceThinkingModels: "مقامی جوابات",
    onDeviceListeningModels: "مقامی آواز شناخت",
    onDeviceSpeakingModels: "مقامی آوازیں",
    onDeviceUse: "استعمال کریں",
    onDeviceInUse: "استعمال میں",
    onDeviceViable: "ٹیسٹ کامیاب",
    onDeviceBelowTarget: "چلتا ہے، مگر تجویز سے سست",
    onDeviceTestFailed: "ٹیسٹ ناکام",
    onDeviceNotTested: "ابھی جانچا نہیں گیا",
    chooseOnDeviceSttModel:
      "ترتیبات میں ڈیوائس پر چلنے والا تقریر شناخت ماڈل منتخب کریں۔",
    chooseOnDeviceTtsModel:
      "ترتیبات میں ڈیوائس پر چلنے والا تقریر ماڈل منتخب کریں۔",
  }),
} as const;
