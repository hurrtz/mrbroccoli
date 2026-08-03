import type { TranslationParams } from "./types";

const en = {
  onboardingAdvancedOptions: "Advanced options",
  onboardingDeviceDetails: "Phone details",
  onboardingMatchingModels: "Matching the best local models…",
  onboardingLikely: "Likely to work",
  onboardingNotRecommended: "Not recommended for this phone",
  onboardingSelectedAutomatically: "Selected automatically",
  onboardingQuickModel: "Quick responses",
  onboardingThoroughModel: "Thorough reasoning",
  onboardingQuickOnly: "Quick only",
  onboardingEstimatedTime: ({ eta }: TranslationParams) =>
    `Estimated setup time · ${eta}`,
  onboardingProgress: ({ percent, eta }: TranslationParams) =>
    `${percent}% · about ${eta} remaining`,
  onboardingStepsRemaining: ({ remaining, count }: TranslationParams) =>
    `${remaining} of ${count} steps remaining`,
  onboardingModelCaution:
    "Larger models can respond more slowly, use more memory, and warm the phone during long sessions. The device test must pass before use.",
};

type OnboardingTranslations = typeof en;
const define = (value: OnboardingTranslations) => value;

export const onboardingTranslations = {
  en,
  de: define({
    onboardingAdvancedOptions: "Erweiterte Optionen",
    onboardingDeviceDetails: "Smartphone-Details",
    onboardingMatchingModels: "Die besten lokalen Modelle werden ermittelt…",
    onboardingLikely: "Funktioniert voraussichtlich",
    onboardingNotRecommended: "Für dieses Smartphone nicht empfohlen",
    onboardingSelectedAutomatically: "Automatisch ausgewählt",
    onboardingQuickModel: "Schnelle Antworten",
    onboardingThoroughModel: "Gründliches Denken",
    onboardingQuickOnly: "Nur schnell",
    onboardingEstimatedTime: ({ eta }) => `Geschätzte Einrichtung · ${eta}`,
    onboardingProgress: ({ percent, eta }) => `${percent} % · noch etwa ${eta}`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `${remaining} von ${count} Schritten verbleiben`,
    onboardingModelCaution:
      "Größere Modelle können langsamer antworten, mehr Speicher nutzen und das Smartphone bei langen Sitzungen erwärmen. Vor der Nutzung muss der Gerätetest bestehen.",
  }),
  uk: define({
    onboardingAdvancedOptions: "Розширені параметри",
    onboardingDeviceDetails: "Дані телефона",
    onboardingMatchingModels: "Підбираємо найкращі локальні моделі…",
    onboardingLikely: "Імовірно працюватиме",
    onboardingNotRecommended: "Не рекомендовано для цього телефона",
    onboardingSelectedAutomatically: "Вибрано автоматично",
    onboardingQuickModel: "Швидкі відповіді",
    onboardingThoroughModel: "Ретельне міркування",
    onboardingQuickOnly: "Лише швидкі відповіді",
    onboardingEstimatedTime: ({ eta }) => `Орієнтовне налаштування · ${eta}`,
    onboardingProgress: ({ percent, eta }) =>
      `${percent}% · залишилося близько ${eta}`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `Залишилося кроків: ${remaining} із ${count}`,
    onboardingModelCaution:
      "Більші моделі можуть відповідати повільніше, використовувати більше пам’яті й нагрівати телефон під час довгих сесій. Перед використанням тест пристрою має пройти успішно.",
  }),
  hi: define({
    onboardingAdvancedOptions: "उन्नत विकल्प",
    onboardingDeviceDetails: "फ़ोन का विवरण",
    onboardingMatchingModels: "सबसे अच्छे स्थानीय मॉडल मिलाए जा रहे हैं…",
    onboardingLikely: "चलने की संभावना है",
    onboardingNotRecommended: "इस फ़ोन के लिए अनुशंसित नहीं",
    onboardingSelectedAutomatically: "अपने आप चुना गया",
    onboardingQuickModel: "त्वरित उत्तर",
    onboardingThoroughModel: "गहन तर्क",
    onboardingQuickOnly: "केवल त्वरित",
    onboardingEstimatedTime: ({ eta }) => `अनुमानित सेटअप समय · ${eta}`,
    onboardingProgress: ({ percent, eta }) => `${percent}% · लगभग ${eta} शेष`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `${count} में से ${remaining} चरण शेष`,
    onboardingModelCaution:
      "बड़े मॉडल धीमे उत्तर दे सकते हैं, अधिक मेमोरी ले सकते हैं और लंबे सत्र में फ़ोन गर्म कर सकते हैं। उपयोग से पहले डिवाइस परीक्षण पास होना चाहिए।",
  }),
  es: define({
    onboardingAdvancedOptions: "Opciones avanzadas",
    onboardingDeviceDetails: "Datos del teléfono",
    onboardingMatchingModels: "Buscando los mejores modelos locales…",
    onboardingLikely: "Es probable que funcione",
    onboardingNotRecommended: "No recomendado para este teléfono",
    onboardingSelectedAutomatically: "Seleccionado automáticamente",
    onboardingQuickModel: "Respuestas rápidas",
    onboardingThoroughModel: "Razonamiento exhaustivo",
    onboardingQuickOnly: "Solo rápido",
    onboardingEstimatedTime: ({ eta }) => `Tiempo estimado · ${eta}`,
    onboardingProgress: ({ percent, eta }) =>
      `${percent}% · quedan unos ${eta}`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `Quedan ${remaining} de ${count} pasos`,
    onboardingModelCaution:
      "Los modelos grandes pueden responder más despacio, usar más memoria y calentar el teléfono en sesiones largas. Deben superar la prueba del dispositivo antes de usarlos.",
  }),
  fr: define({
    onboardingAdvancedOptions: "Options avancées",
    onboardingDeviceDetails: "Caractéristiques du téléphone",
    onboardingMatchingModels: "Recherche des meilleurs modèles locaux…",
    onboardingLikely: "Devrait fonctionner",
    onboardingNotRecommended: "Non recommandé pour ce téléphone",
    onboardingSelectedAutomatically: "Sélectionné automatiquement",
    onboardingQuickModel: "Réponses rapides",
    onboardingThoroughModel: "Raisonnement approfondi",
    onboardingQuickOnly: "Rapide uniquement",
    onboardingEstimatedTime: ({ eta }) => `Durée estimée · ${eta}`,
    onboardingProgress: ({ percent, eta }) =>
      `${percent} % · environ ${eta} restantes`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `${remaining} étapes sur ${count} restantes`,
    onboardingModelCaution:
      "Les grands modèles peuvent répondre plus lentement, utiliser plus de mémoire et chauffer le téléphone pendant les longues sessions. Le test de l’appareil doit réussir avant utilisation.",
  }),
  it: define({
    onboardingAdvancedOptions: "Opzioni avanzate",
    onboardingDeviceDetails: "Dettagli del telefono",
    onboardingMatchingModels: "Ricerca dei migliori modelli locali…",
    onboardingLikely: "Probabile funzionamento",
    onboardingNotRecommended: "Non consigliato per questo telefono",
    onboardingSelectedAutomatically: "Selezionato automaticamente",
    onboardingQuickModel: "Risposte rapide",
    onboardingThoroughModel: "Ragionamento approfondito",
    onboardingQuickOnly: "Solo rapido",
    onboardingEstimatedTime: ({ eta }) => `Tempo stimato · ${eta}`,
    onboardingProgress: ({ percent, eta }) =>
      `${percent}% · circa ${eta} rimanenti`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `${remaining} passaggi su ${count} rimanenti`,
    onboardingModelCaution:
      "I modelli più grandi possono rispondere più lentamente, usare più memoria e scaldare il telefono durante sessioni lunghe. Il test del dispositivo deve riuscire prima dell’uso.",
  }),
  pt: define({
    onboardingAdvancedOptions: "Opções avançadas",
    onboardingDeviceDetails: "Detalhes do telemóvel",
    onboardingMatchingModels: "A escolher os melhores modelos locais…",
    onboardingLikely: "Provavelmente funciona",
    onboardingNotRecommended: "Não recomendado para este telemóvel",
    onboardingSelectedAutomatically: "Selecionado automaticamente",
    onboardingQuickModel: "Respostas rápidas",
    onboardingThoroughModel: "Raciocínio aprofundado",
    onboardingQuickOnly: "Apenas rápido",
    onboardingEstimatedTime: ({ eta }) => `Tempo estimado · ${eta}`,
    onboardingProgress: ({ percent, eta }) =>
      `${percent}% · cerca de ${eta} restantes`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `Faltam ${remaining} de ${count} passos`,
    onboardingModelCaution:
      "Os modelos maiores podem responder mais devagar, usar mais memória e aquecer o telemóvel em sessões longas. O teste do dispositivo tem de passar antes da utilização.",
  }),
  ptBR: define({
    onboardingAdvancedOptions: "Opções avançadas",
    onboardingDeviceDetails: "Detalhes do celular",
    onboardingMatchingModels: "Escolhendo os melhores modelos locais…",
    onboardingLikely: "Provavelmente funciona",
    onboardingNotRecommended: "Não recomendado para este celular",
    onboardingSelectedAutomatically: "Selecionado automaticamente",
    onboardingQuickModel: "Respostas rápidas",
    onboardingThoroughModel: "Raciocínio aprofundado",
    onboardingQuickOnly: "Somente rápido",
    onboardingEstimatedTime: ({ eta }) => `Tempo estimado · ${eta}`,
    onboardingProgress: ({ percent, eta }) =>
      `${percent}% · cerca de ${eta} restantes`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `Restam ${remaining} de ${count} etapas`,
    onboardingModelCaution:
      "Modelos maiores podem responder mais devagar, usar mais memória e aquecer o celular em sessões longas. O teste do dispositivo precisa passar antes do uso.",
  }),
  ru: define({
    onboardingAdvancedOptions: "Расширенные параметры",
    onboardingDeviceDetails: "Характеристики телефона",
    onboardingMatchingModels: "Подбираем лучшие локальные модели…",
    onboardingLikely: "Скорее всего, будет работать",
    onboardingNotRecommended: "Не рекомендуется для этого телефона",
    onboardingSelectedAutomatically: "Выбрано автоматически",
    onboardingQuickModel: "Быстрые ответы",
    onboardingThoroughModel: "Тщательное рассуждение",
    onboardingQuickOnly: "Только быстрые ответы",
    onboardingEstimatedTime: ({ eta }) => `Оценка настройки · ${eta}`,
    onboardingProgress: ({ percent, eta }) =>
      `${percent}% · осталось около ${eta}`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `Осталось шагов: ${remaining} из ${count}`,
    onboardingModelCaution:
      "Большие модели могут отвечать медленнее, использовать больше памяти и нагревать телефон при долгой работе. Перед использованием тест устройства должен пройти успешно.",
  }),
  "zh-CN": define({
    onboardingAdvancedOptions: "高级选项",
    onboardingDeviceDetails: "手机详情",
    onboardingMatchingModels: "正在匹配最佳本地模型…",
    onboardingLikely: "预计可以运行",
    onboardingNotRecommended: "不建议在此手机上使用",
    onboardingSelectedAutomatically: "已自动选择",
    onboardingQuickModel: "快速回答",
    onboardingThoroughModel: "深入推理",
    onboardingQuickOnly: "仅快速回答",
    onboardingEstimatedTime: ({ eta }) => `预计设置时间 · ${eta}`,
    onboardingProgress: ({ percent, eta }) => `${percent}% · 约剩余 ${eta}`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `还剩 ${remaining}/${count} 个步骤`,
    onboardingModelCaution:
      "较大的模型可能回答更慢、占用更多内存，并在长时间使用时使手机发热。使用前必须通过设备测试。",
  }),
  ar: define({
    onboardingAdvancedOptions: "خيارات متقدمة",
    onboardingDeviceDetails: "تفاصيل الهاتف",
    onboardingMatchingModels: "جارٍ اختيار أفضل النماذج المحلية…",
    onboardingLikely: "مرجح أن يعمل",
    onboardingNotRecommended: "غير موصى به لهذا الهاتف",
    onboardingSelectedAutomatically: "تم اختياره تلقائيًا",
    onboardingQuickModel: "ردود سريعة",
    onboardingThoroughModel: "استدلال متعمق",
    onboardingQuickOnly: "سريع فقط",
    onboardingEstimatedTime: ({ eta }) => `الوقت التقديري · ${eta}`,
    onboardingProgress: ({ percent, eta }) => `${percent}% · متبقٍ نحو ${eta}`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `متبقي ${remaining} من ${count} خطوات`,
    onboardingModelCaution:
      "قد تستجيب النماذج الأكبر ببطء وتستخدم ذاكرة أكثر وتُسخّن الهاتف في الجلسات الطويلة. يجب اجتياز اختبار الجهاز قبل الاستخدام.",
  }),
  ja: define({
    onboardingAdvancedOptions: "詳細オプション",
    onboardingDeviceDetails: "端末情報",
    onboardingMatchingModels: "最適なローカルモデルを選択中…",
    onboardingLikely: "動作する見込み",
    onboardingNotRecommended: "この端末には非推奨",
    onboardingSelectedAutomatically: "自動選択",
    onboardingQuickModel: "すばやい応答",
    onboardingThoroughModel: "綿密な推論",
    onboardingQuickOnly: "すばやい応答のみ",
    onboardingEstimatedTime: ({ eta }) => `推定セットアップ時間 · ${eta}`,
    onboardingProgress: ({ percent, eta }) => `${percent}% · 残り約 ${eta}`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `残り ${remaining}/${count} ステップ`,
    onboardingModelCaution:
      "大きなモデルは応答が遅く、メモリ使用量が増え、長時間の利用で端末が熱くなることがあります。利用前に端末テストへの合格が必要です。",
  }),
  hu: define({
    onboardingAdvancedOptions: "Speciális beállítások",
    onboardingDeviceDetails: "Telefon adatai",
    onboardingMatchingModels: "A legjobb helyi modellek kiválasztása…",
    onboardingLikely: "Várhatóan működik",
    onboardingNotRecommended: "Ehhez a telefonhoz nem ajánlott",
    onboardingSelectedAutomatically: "Automatikusan kiválasztva",
    onboardingQuickModel: "Gyors válaszok",
    onboardingThoroughModel: "Alapos érvelés",
    onboardingQuickOnly: "Csak gyors",
    onboardingEstimatedTime: ({ eta }) => `Becsült beállítási idő · ${eta}`,
    onboardingProgress: ({ percent, eta }) =>
      `${percent}% · körülbelül ${eta} van hátra`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `${remaining}/${count} lépés van hátra`,
    onboardingModelCaution:
      "A nagyobb modellek lassabban válaszolhatnak, több memóriát használhatnak és hosszú munkamenetben melegíthetik a telefont. Használat előtt át kell menniük az eszközteszten.",
  }),
  cs: define({
    onboardingAdvancedOptions: "Pokročilé možnosti",
    onboardingDeviceDetails: "Údaje telefonu",
    onboardingMatchingModels: "Vybíráme nejlepší místní modely…",
    onboardingLikely: "Pravděpodobně bude fungovat",
    onboardingNotRecommended: "Pro tento telefon se nedoporučuje",
    onboardingSelectedAutomatically: "Vybráno automaticky",
    onboardingQuickModel: "Rychlé odpovědi",
    onboardingThoroughModel: "Důkladné uvažování",
    onboardingQuickOnly: "Pouze rychlé",
    onboardingEstimatedTime: ({ eta }) => `Odhad nastavení · ${eta}`,
    onboardingProgress: ({ percent, eta }) => `${percent} % · zbývá asi ${eta}`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `Zbývá ${remaining} z ${count} kroků`,
    onboardingModelCaution:
      "Větší modely mohou odpovídat pomaleji, využívat více paměti a při dlouhých relacích zahřívat telefon. Před použitím musí projít testem zařízení.",
  }),
  pl: define({
    onboardingAdvancedOptions: "Opcje zaawansowane",
    onboardingDeviceDetails: "Dane telefonu",
    onboardingMatchingModels: "Dobieranie najlepszych modeli lokalnych…",
    onboardingLikely: "Prawdopodobnie zadziała",
    onboardingNotRecommended: "Niezalecane dla tego telefonu",
    onboardingSelectedAutomatically: "Wybrano automatycznie",
    onboardingQuickModel: "Szybkie odpowiedzi",
    onboardingThoroughModel: "Dokładne rozumowanie",
    onboardingQuickOnly: "Tylko szybkie",
    onboardingEstimatedTime: ({ eta }) => `Szacowany czas · ${eta}`,
    onboardingProgress: ({ percent, eta }) =>
      `${percent}% · pozostało około ${eta}`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `Pozostało ${remaining} z ${count} kroków`,
    onboardingModelCaution:
      "Większe modele mogą odpowiadać wolniej, zużywać więcej pamięci i nagrzewać telefon podczas długich sesji. Przed użyciem muszą przejść test urządzenia.",
  }),
  tr: define({
    onboardingAdvancedOptions: "Gelişmiş seçenekler",
    onboardingDeviceDetails: "Telefon ayrıntıları",
    onboardingMatchingModels: "En iyi yerel modeller eşleştiriliyor…",
    onboardingLikely: "Muhtemelen çalışır",
    onboardingNotRecommended: "Bu telefon için önerilmez",
    onboardingSelectedAutomatically: "Otomatik seçildi",
    onboardingQuickModel: "Hızlı yanıtlar",
    onboardingThoroughModel: "Ayrıntılı akıl yürütme",
    onboardingQuickOnly: "Yalnızca hızlı",
    onboardingEstimatedTime: ({ eta }) => `Tahmini kurulum · ${eta}`,
    onboardingProgress: ({ percent, eta }) =>
      `%${percent} · yaklaşık ${eta} kaldı`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `${count} adımdan ${remaining} kaldı`,
    onboardingModelCaution:
      "Daha büyük modeller daha yavaş yanıt verebilir, daha fazla bellek kullanabilir ve uzun oturumlarda telefonu ısıtabilir. Kullanımdan önce cihaz testini geçmelidir.",
  }),
  sv: define({
    onboardingAdvancedOptions: "Avancerade alternativ",
    onboardingDeviceDetails: "Telefoninformation",
    onboardingMatchingModels: "Matchar de bästa lokala modellerna…",
    onboardingLikely: "Fungerar sannolikt",
    onboardingNotRecommended: "Rekommenderas inte för den här telefonen",
    onboardingSelectedAutomatically: "Vald automatiskt",
    onboardingQuickModel: "Snabba svar",
    onboardingThoroughModel: "Grundligt resonemang",
    onboardingQuickOnly: "Endast snabb",
    onboardingEstimatedTime: ({ eta }) => `Beräknad tid · ${eta}`,
    onboardingProgress: ({ percent, eta }) =>
      `${percent} % · ungefär ${eta} kvar`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `${remaining} av ${count} steg återstår`,
    onboardingModelCaution:
      "Större modeller kan svara långsammare, använda mer minne och värma telefonen under långa sessioner. Enhetstestet måste godkännas före användning.",
  }),
  ur: define({
    onboardingAdvancedOptions: "اعلیٰ اختیارات",
    onboardingDeviceDetails: "فون کی تفصیلات",
    onboardingMatchingModels: "بہترین مقامی ماڈلز منتخب کیے جا رہے ہیں…",
    onboardingLikely: "چلنے کا امکان ہے",
    onboardingNotRecommended: "اس فون کے لیے تجویز نہیں",
    onboardingSelectedAutomatically: "خودکار طور پر منتخب",
    onboardingQuickModel: "فوری جوابات",
    onboardingThoroughModel: "تفصیلی استدلال",
    onboardingQuickOnly: "صرف فوری",
    onboardingEstimatedTime: ({ eta }) => `اندازاً سیٹ اپ وقت · ${eta}`,
    onboardingProgress: ({ percent, eta }) =>
      `${percent}% · تقریباً ${eta} باقی`,
    onboardingStepsRemaining: ({ remaining, count }) =>
      `${count} میں سے ${remaining} مراحل باقی`,
    onboardingModelCaution:
      "بڑے ماڈلز آہستہ جواب دے سکتے ہیں، زیادہ میموری استعمال کر سکتے ہیں اور طویل سیشن میں فون گرم کر سکتے ہیں۔ استعمال سے پہلے ڈیوائس ٹیسٹ پاس ہونا ضروری ہے۔",
  }),
} as const;
