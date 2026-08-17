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
  onDeviceLanguages: "Conversation languages",
  onDeviceLanguagesHint:
    "Every selected local model must support all of these languages. This choice also updates listening and spoken-reply languages.",
  onDeviceTestingDevice: "Testing this device…",
  onDeviceDownloadCancelled: "Download cancelled.",
  onDeviceDownloadServiceTitle: "Downloading a model",
  onDeviceDownloadServiceBody: "Keep this running until it finishes.",
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
    onDeviceLanguages: "Gesprächssprachen",
    onDeviceLanguagesHint:
      "Jedes lokale Modell muss alle ausgewählten Sprachen unterstützen. Die Auswahl aktualisiert auch Erkennung und Sprachausgabe.",
    onDeviceTestingDevice: "Gerät wird getestet…",
    onDeviceDownloadCancelled: "Download abgebrochen.",
    onDeviceDownloadServiceTitle: "Modell wird heruntergeladen",
    onDeviceDownloadServiceBody: "Lass diesen Vorgang laufen, bis er abgeschlossen ist.",
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
    onDeviceLanguages: "Мови розмови",
    onDeviceLanguagesHint:
      "Кожна локальна модель має підтримувати всі вибрані мови. Вибір також оновлює мови розпізнавання та озвучення.",
    onDeviceTestingDevice: "Перевірка пристрою…",
    onDeviceDownloadCancelled: "Завантаження скасовано.",
    onDeviceDownloadServiceTitle: "Завантаження моделі",
    onDeviceDownloadServiceBody: "Не закривайте цей процес, доки він не завершиться.",
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
    onDeviceLanguages: "बातचीत की भाषाएँ",
    onDeviceLanguagesHint:
      "हर स्थानीय मॉडल को चुनी हुई सभी भाषाओं का समर्थन करना होगा। यह चयन सुनने और बोले गए उत्तरों की भाषाएँ भी बदलता है।",
    onDeviceTestingDevice: "डिवाइस की जाँच हो रही है…",
    onDeviceDownloadCancelled: "डाउनलोड रद्द किया गया।",
    onDeviceDownloadServiceTitle: "मॉडल डाउनलोड हो रहा है",
    onDeviceDownloadServiceBody: "इसे पूरा होने तक चलने दें।",
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
    onDeviceLanguages: "Idiomas de conversación",
    onDeviceLanguagesHint:
      "Cada modelo local debe admitir todos estos idiomas. La selección también actualiza los idiomas de reconocimiento y respuesta hablada.",
    onDeviceTestingDevice: "Probando el dispositivo…",
    onDeviceDownloadCancelled: "Descarga cancelada.",
    onDeviceDownloadServiceTitle: "Descargando un modelo",
    onDeviceDownloadServiceBody: "Déjalo en ejecución hasta que termine.",
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
    onDeviceLanguages: "Langues de conversation",
    onDeviceLanguagesHint:
      "Chaque modèle local doit prendre en charge toutes ces langues. Ce choix met aussi à jour les langues d’écoute et des réponses vocales.",
    onDeviceTestingDevice: "Test de l’appareil…",
    onDeviceDownloadCancelled: "Téléchargement annulé.",
    onDeviceDownloadServiceTitle: "Téléchargement d’un modèle",
    onDeviceDownloadServiceBody: "Laissez cette opération se poursuivre jusqu’à la fin.",
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
    onDeviceLanguages: "Lingue della conversazione",
    onDeviceLanguagesHint:
      "Ogni modello locale deve supportare tutte le lingue selezionate. La scelta aggiorna anche le lingue di ascolto e risposta vocale.",
    onDeviceTestingDevice: "Verifica del dispositivo…",
    onDeviceDownloadCancelled: "Download annullato.",
    onDeviceDownloadServiceTitle: "Download di un modello",
    onDeviceDownloadServiceBody: "Lascialo in esecuzione fino al termine.",
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
    onDeviceLanguages: "Idiomas da conversa",
    onDeviceLanguagesHint:
      "Cada modelo local tem de suportar todos os idiomas escolhidos. A seleção também atualiza os idiomas de escuta e resposta falada.",
    onDeviceTestingDevice: "A testar o dispositivo…",
    onDeviceDownloadCancelled: "Transferência cancelada.",
    onDeviceDownloadServiceTitle: "A transferir um modelo",
    onDeviceDownloadServiceBody: "Mantém este processo em execução até terminar.",
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
    onDeviceLanguages: "Idiomas da conversa",
    onDeviceLanguagesHint:
      "Cada modelo local deve aceitar todos os idiomas escolhidos. A seleção também atualiza os idiomas de escuta e resposta falada.",
    onDeviceTestingDevice: "Testando o dispositivo…",
    onDeviceDownloadCancelled: "Download cancelado.",
    onDeviceDownloadServiceTitle: "Baixando um modelo",
    onDeviceDownloadServiceBody: "Mantenha isto em execução até terminar.",
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
    onDeviceLanguages: "Языки разговора",
    onDeviceLanguagesHint:
      "Каждая локальная модель должна поддерживать все выбранные языки. Выбор также обновляет языки распознавания и голосовых ответов.",
    onDeviceTestingDevice: "Проверка устройства…",
    onDeviceDownloadCancelled: "Загрузка отменена.",
    onDeviceDownloadServiceTitle: "Загрузка модели",
    onDeviceDownloadServiceBody: "Не закрывайте этот процесс до завершения.",
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
    onDeviceLanguages: "对话语言",
    onDeviceLanguagesHint:
      "每个本地模型都必须支持所有所选语言。此选择也会更新听写和语音回复语言。",
    onDeviceTestingDevice: "正在测试设备…",
    onDeviceDownloadCancelled: "下载已取消。",
    onDeviceDownloadServiceTitle: "正在下载模型",
    onDeviceDownloadServiceBody: "请保持运行直到完成。",
    onDeviceViable: "测试通过",
    onDeviceBelowTarget: "可以运行，但速度低于建议值",
    onDeviceTestFailed: "测试失败",
    onDeviceNotTested: "尚未测试",
    chooseOnDeviceSttModel: "请在设置中选择设备端语音识别模型。",
    chooseOnDeviceTtsModel: "请在设置中选择设备端语音模型。",
  }),
  ar: define({
    ...performanceTranslations.ar,
    onDeviceLanguages: "لغات المحادثة",
    onDeviceLanguagesHint:
      "يجب أن يدعم كل نموذج محلي جميع اللغات المحددة. يحدّث هذا الاختيار أيضًا لغات الاستماع والردود المنطوقة.",
    onDeviceTestingDevice: "جارٍ اختبار الجهاز…",
    onDeviceDownloadCancelled: "تم إلغاء التنزيل.",
    onDeviceDownloadServiceTitle: "جارٍ تنزيل نموذج",
    onDeviceDownloadServiceBody: "اترك هذه العملية قيد التشغيل حتى تكتمل.",
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
    onDeviceLanguages: "会話の言語",
    onDeviceLanguagesHint:
      "各ローカルモデルは選択したすべての言語に対応する必要があります。この選択は音声認識と読み上げの言語にも反映されます。",
    onDeviceTestingDevice: "端末をテスト中…",
    onDeviceDownloadCancelled: "ダウンロードをキャンセルしました。",
    onDeviceDownloadServiceTitle: "モデルをダウンロード中",
    onDeviceDownloadServiceBody: "完了するまでこのまま実行してください。",
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
    onDeviceLanguages: "Beszélgetési nyelvek",
    onDeviceLanguagesHint:
      "Minden helyi modellnek támogatnia kell az összes kiválasztott nyelvet. Ez a felismerés és a felolvasás nyelveit is frissíti.",
    onDeviceTestingDevice: "Eszköz tesztelése…",
    onDeviceDownloadCancelled: "Letöltés megszakítva.",
    onDeviceDownloadServiceTitle: "Modell letöltése",
    onDeviceDownloadServiceBody: "Hagyd futni, amíg befejeződik.",
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
    onDeviceLanguages: "Jazyky konverzace",
    onDeviceLanguagesHint:
      "Každý místní model musí podporovat všechny vybrané jazyky. Volba upraví také jazyky rozpoznávání a mluvených odpovědí.",
    onDeviceTestingDevice: "Testování zařízení…",
    onDeviceDownloadCancelled: "Stahování zrušeno.",
    onDeviceDownloadServiceTitle: "Stahování modelu",
    onDeviceDownloadServiceBody: "Nechte proces běžet, dokud se nedokončí.",
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
    onDeviceLanguages: "Języki rozmowy",
    onDeviceLanguagesHint:
      "Każdy model lokalny musi obsługiwać wszystkie wybrane języki. Wybór aktualizuje też języki rozpoznawania i odpowiedzi głosowych.",
    onDeviceTestingDevice: "Testowanie urządzenia…",
    onDeviceDownloadCancelled: "Pobieranie anulowane.",
    onDeviceDownloadServiceTitle: "Pobieranie modelu",
    onDeviceDownloadServiceBody: "Pozostaw ten proces uruchomiony do zakończenia.",
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
    onDeviceLanguages: "Konuşma dilleri",
    onDeviceLanguagesHint:
      "Her yerel model seçilen tüm dilleri desteklemelidir. Bu seçim dinleme ve sesli yanıt dillerini de günceller.",
    onDeviceTestingDevice: "Cihaz test ediliyor…",
    onDeviceDownloadCancelled: "İndirme iptal edildi.",
    onDeviceDownloadServiceTitle: "Model indiriliyor",
    onDeviceDownloadServiceBody: "Tamamlanana kadar çalışır durumda bırakın.",
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
    onDeviceLanguages: "Samtalsspråk",
    onDeviceLanguagesHint:
      "Varje lokal modell måste stödja alla valda språk. Valet uppdaterar även språk för igenkänning och talade svar.",
    onDeviceTestingDevice: "Testar enheten…",
    onDeviceDownloadCancelled: "Hämtningen avbröts.",
    onDeviceDownloadServiceTitle: "Hämtar en modell",
    onDeviceDownloadServiceBody: "Låt detta köras tills det är klart.",
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
    onDeviceLanguages: "گفتگو کی زبانیں",
    onDeviceLanguagesHint:
      "ہر مقامی ماڈل کو منتخب تمام زبانوں کی معاونت کرنی ہوگی۔ یہ انتخاب سننے اور بولے گئے جواب کی زبانیں بھی بدلتا ہے۔",
    onDeviceTestingDevice: "ڈیوائس کی جانچ جاری ہے…",
    onDeviceDownloadCancelled: "ڈاؤن لوڈ منسوخ کر دیا گیا۔",
    onDeviceDownloadServiceTitle: "ماڈل ڈاؤن لوڈ ہو رہا ہے",
    onDeviceDownloadServiceBody: "اسے مکمل ہونے تک چلنے دیں۔",
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
