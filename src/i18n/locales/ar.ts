import type { TranslationDictionary } from "../types";

export const ar = {
  appName: "السيد بروكلي",
  retry: "أعد المحاولة",
  dismiss: "إغلاق",
  done: "تم",
  aboutSetting: ({ setting }) => `حول ${setting}`,
  unavailable: "غير متاح",
  selection: "اختيار",
  chooseCompatibleProviderFirst: "اختر مزودًا متوافقًا أولاً",
  settings: "الإعدادات",
  all: "الكل",
  firstRun: "التشغيل لأول مرة",
  instructions: "تعليمات",
  providers: "مزودو الخدمة",
  webSearch: "بحث الويب",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "الاستعداد لوقت التشغيل",
  settingsReadinessThink: "يفكر",
  settingsReadinessListen: "يستمع",
  settingsReadinessSpeak: "يتكلم",
  settingsReadinessSearch: "يبحث",
  settingsReadinessReady: "مستعد",
  settingsReadinessNeedsAttention: "انتباه",
  settingsReadinessBroken: "مكسور",
  settingsReadinessOff: "عن",
  settingsConnections: "اتصالات",
  settingsThinking: "التفكير",
  settingsListening: "الاستماع",
  settingsSpeaking: "تكلم",
  settingsSearch: "يبحث",
  settingsAppDiagnostics: "التطبيق والتشخيص",
  settingsGuidedSetup: "الإعداد الموجه",
  settingsGuidedSetupSummary:
    "قم بمراجعة الاتصالات واختبار المسار الصوتي الكامل.",
  setupGuideShowInSettings: "إظهار الإعداد الموجه في الإعدادات",
  setupGuideShowInSettingsSummary:
    "قم بإظهار أو إخفاء اختصار الإعداد الموجه في نظرة عامة على الإعدادات.",
  settingsConnectionsSummary: "مفاتيح الموفر والتحقق من الصحة والقدرات.",
  settingsThinkingSummary: "البطاقات الرئيسية والنماذج والجهد وموجه النظام.",
  settingsListeningSummary: "وضع الإدخال وتوجيه الكلام إلى النص.",
  settingsSpeakingSummary: "الردود المنطوقة، والتشغيل، والأصوات، والمعاينات.",
  settingsSearchSummary: "مزود بحث الويب وضوابط جودة البحث.",
  settingsAppDiagnosticsSummary:
    "الموضوع واللغة والاستخدام وسجلات التصحيح والنشاط الحديث.",
  settingsBackToOverview: "العودة إلى النظرة العامة",
  settingsOpenSection: ({ section }) => `افتح ${section}`,
  theme: "سمة",
  language: "لغة",
  recognitionLanguage: "لغة التعرّف",
  recognitionLanguageHint:
    "اختر لغة لتحسين التعرّف، أو اترك للجهاز أو المزوّد اكتشافها تلقائياً.",
  automaticLanguage: "تلقائي",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} لا يدعم ${language} رسمياً في مسار الصوت هذا.`,
  usageStats: "إحصائيات الاستخدام",
  model: "نموذج",
  effort: "جهد",
  effortValue: ({ effort }) => `الجهد: ${effort}`,
  modelEffortNone: "بلا",
  modelEffortMinimal: "أدنى",
  modelEffortLow: "منخفض",
  modelEffortMedium: "متوسط",
  modelEffortHigh: "مرتفع",
  modelEffortExtraHigh: "مرتفع جدًا",
  modelEffortMax: "أقصى",
  modelEffortDynamic: "ديناميكي",
  modelEffortDisabled: "متوقف",
  modelEffortEnabled: "مفعّل",
  fixed: "مُثَبَّت",
  english: "إنجليزي",
  german: "الألمانية",
  ukrainian: "الأوكرانية",
  hindi: "الهندية",
  spanish: "الأسبانية",
  french: "فرنسي",
  italian: "ايطالي",
  portuguese: "البرتغالية",
  portugueseBrazil: "البرتغالية (البرازيل)",
  russian: "الروسية",
  simplifiedChinese: "الصينية المبسطة",
  arabic: "العربية",
  japanese: "اليابانية",
  kokoroAmericanFemaleVoice: ({ name }) =>
    `${name} · إنجليزية أمريكية، صوت أنثوي`,
  kokoroBritishFemaleVoice: ({ name }) =>
    `${name} · إنجليزية بريطانية، صوت أنثوي`,
  kokoroChineseFemaleVoice: ({ index }) => `صينية، صوت أنثوي ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `صينية، صوت ذكوري ${index}`,
  light: "فاتح",
  dark: "داكن",
  system: "النظام",
  languageCoverage: ({ note }) => `التغطية اللغوية: ${note}`,
  recordingLimits: ({ note }) => `حدود التسجيل: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `الأسعار: ${summary}`,
  replyGenerationAction: "جيل الرد",
  speechTranscriptionAction: "نسخ الكلام",
  instructionsTabDescription:
    "قم بتشكيل التوجيه المخفي الذي يوجه المساعد قبل أن يرى أي مزود الطلب.",
  providersTabDescription:
    "قم بتخزين بيانات اعتماد الخدمة الخارجية على الجهاز وقم بتكوين أوضاع الاستجابة التي تريد استخدامها.",
  webSearchTabDescription:
    "قم بتكوين سياق الويب المباشر الاختياري قبل الردود.",
  responseModes: "اختيار النموذج",
  aboutModelSelection: "حول اختيار النموذج",
  modelSelectionInfo:
    "تصبح كل بطاقة نموذجية خيارًا على الشاشة الرئيسية. قم بتكوين الموفر والنموذج ومستوى الجهد الاختياري، ثم قم بتبديل البطاقات لاختيار النموذج الذي يجيب بعد ذلك.",
  responseModeItemTitle: ({ index }) => `الموديل ${index}`,
  addResponseMode: "إضافة نموذج",
  removeResponseMode: "إزالة النموذج",
  responseModesNoConfiguredProviders:
    "أضف بيانات الاعتماد أولاً. تظل عناصر التحكم في المسار مخفية حتى يتم تكوين خدمة متوافقة واحدة على الأقل.",
  useResponseMode: ({ mode }) => `استخدم ${mode}`,
  chooseResponseModel: "اختر نموذجًا",
  responseModelCount: ({ count }) => `موديلات ${count} متوفرة`,
  sttTabDescription:
    "التحكم في كيفية التقاط الكلام وأي واجهة خلفية تحول الصوت إلى نص قبل أن يصل إلى النموذج.",
  ttsTabDescription:
    "التحكم عندما تبدأ الردود في التحدث وأي واجهة خلفية تتعامل مع الإخراج المنطوق.",
  brief: "مختصر",
  briefDescription:
    "احتفظ بالإجابة بقوة. استخدم الحد الأدنى لعدد الجمل اللازمة للإجابة الكاملة على المستخدم.",
  normal: "طبيعي",
  normalDescription:
    "تهدف إلى طول استجابة متوازنة. قم بتغطية النقاط المهمة دون سحب الإجابة.",
  thorough: "شامل",
  thoroughDescription:
    "تعمق وكن شاملاً. قم بتضمين الفروق الدقيقة والتفاصيل والمقايضات والمنطق الذي يهم.",
  professional: "احترافي",
  professionalDescription:
    "تحدث كمستشار كبير يطلع العميل. لغة دقيقة، خالية من العامية، ومدروسة وموثوقة.",
  casual: "غير رسمي",
  casualDescription:
    "تحدث كصديق ذكي في المقهى. مريح وطبيعي ومحادث. التقلصات جيدة، والظلال جيدة.",
  nerdy: "نردي",
  nerdyDescription:
    "تحدث كخبير متحمس يحب التعمق. استخدم المصطلحات التقنية بحرية، واطلع على التفاصيل، وافترض أن المستخدم قادر على مواكبة ذلك.",
  concise: "موجز",
  conciseDescription:
    "كن مختصرًا قدر الإمكان بينما لا تزال مكتملًا. لا ديباجة ولا حشو، فقط الجواب. فكر في أسلوب البرقية.",
  socratic: "سقراطي",
  socraticDescription:
    "تحدي تفكير المستخدم. اطرح أسئلة مضادة، وقدم وجهات نظر بديلة، ولا تؤكد فقط ما قالوه. كن شريكًا في السجال، وليس آلة الموافقة.",
  eli5: "ELI5",
  eli5Description:
    "اشرح كل شيء ببساطة قدر الإمكان. استخدم القياسات، اللغة اليومية، صفر المصطلحات. لا تفترض أي معرفة مسبقة بأي موضوع.",
  useProvider: ({ provider }) => `استخدم ${provider}`,
  createApiKey: "أوراق اعتماد",
  apiKey: "مفتاح API",
  aboutThisProvider: "حول هذا المزود",
  openRouterOnboardingTitle: "مفتاح واحد، ومقدمو خدمات متعددون",
  openRouterOnboardingDescription:
    "قم بإنشاء مفتاح OpenRouter مخصص، والصقه أدناه، واستخدم النماذج المدعومة باللقطة من العديد من موفري الخدمة دون استبدال أي اتصال مباشر.",
  openRouterOnboardingRoute:
    "مسار الطلب: هذا الجهاز → OpenRouter → الموفر الرئيسي المحدد",
  openRouterKeys: "مفاتيح OpenRouter",
  providerStatusInvalid: "غير صالح",
  providerStatusTesting: "اختبار",
  providerStatusConfigured: "تم تكوينه",
  providerStatusWorking: "عمل",
  providerStatusNotTested: "لم يتم اختباره",
  providerStatusNotSetup: "لم يتم إعداده",
  expandProvider: ({ provider }) => `قم بتوسيع ${provider}`,
  collapseProvider: ({ provider }) => `طي ${provider}`,
  testProviderKey: "مفتاح الاختبار",
  testAllCapabilities: "اختبار الكل",
  apiTest: "اختبار API",
  testProviderCapability: ({ capability }) => `اختبار ${capability}`,
  test: "امتحان",
  optional: "خياري",
  providerCapability_llm: "الردود",
  providerCapability_stt: "إدخال الكلام",
  providerCapability_tts: "إخراج الصوت",
  providerCapability_search: "البحث على شبكة الإنترنت",
  providerCapability_voices: "مكتبة صوتية",
  providerValidationUnavailable:
    "التحقق المباشر ليس سلكيًا لهذا المزود حتى الآن. احفظ المفتاح هنا وتحقق منه أثناء الاستخدام الفعلي.",
  providerNeedsAttention: "يحتاج إلى الاهتمام",
  catalogProviderLimitsSummary: ({ summary }) => `الحدود: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `المنطقة: ${summary}`,
  validatingKey: "جارٍ التحقق...",
  showKey: "إظهار المفتاح",
  hideKey: "إخفاء المفتاح",
  assistantInstructions: "تعليمات مساعد",
  systemPrompt: "موجه النظام",
  aboutSystemPrompt: "حول موجه النظام",
  assistantInstructionsIntro:
    "قم بتشكيل التوجيه المخفي الذي يتلقاه النموذج قبل كل رد.",
  baseInstructions: "تعليمات أساسية",
  assistantInstructionsPlaceholder: "حدد كيف يجب أن يتصرف المساعد.",
  assistantInstructionsHint:
    "يتم دائمًا إضافة ذلك قبل طول الاستجابة المحددة ونغمتها.",
  adaptiveLength: "الطول التكيفي",
  responseTone: "نغمة الاستجابة",
  homeStyleChipLabel: ({ tone, length }) => `النمط - ${tone} · ${length}`,
  styleSheetTitle: "إعدادات المحادثة",
  styleSheetSubtitle: "شكل الردود والكلام لهذه المحادثة فقط.",
  openStyleSheet: "افتح إعدادات المحادثة",
  conversationThinkingInstructions: "تعليمات التفكير",
  conversationThinkingInstructionsDescription:
    "أضف تعليمات بعد مطالبة النظام العالمي بهذه المحادثة.",
  conversationThinkingInstructionsPlaceholder:
    "على سبيل المثال: تحدي افتراضاتي واستخدام أمثلة ملموسة.",
  ttsInstructions: "تعليمات تسليم الكلام",
  ttsInstructionsDescription:
    "قم بتوجيه النغمة أو الوتيرة أو اللهجة أو الإلقاء الذي تستخدمه نماذج الكلام المتوافقة.",
  conversationTtsInstructionsDescription:
    "أضف تعليمات التسليم بعد تعليمات الكلام العامة لهذه المحادثة.",
  ttsInstructionsPlaceholder:
    "على سبيل المثال: تحدث بحرارة ووضوح وبوتيرة مريحة.",
  ttsInstructionsUnsupported:
    "مسار الكلام الحالي لا يدعم تعليمات التسليم.",
  conversationVoiceDescription: ({ route }) =>
    `اختر الصوت الذي يستخدمه ${route} في هذه المحادثة.`,
  scrollToLatest: "قم بالتمرير إلى أحدث رسالة",
  conversationTitleGenerate: "إنشاء عنوان تلقائيًا",
  conversationTitleGenerating: "جارٍ إنشاء العنوان…",
  conversationTitleGenerated: "تمت إعادة تسمية المحادثة.",
  conversationTitleNeedsContent:
    "ابدأ محادثة قبل إنشاء عنوان.",
  conversationTitleNeedsProvider:
    "قم بتكوين النموذج المحدد قبل إنشاء عنوان.",
  conversationTitleGenerationFailed: "تعذر إنشاء عنوان للمحادثة.",
  conversationTitleGenerationTimedOut:
    "استغرق إنشاء العنوان وقتًا طويلاً. يرجى المحاولة مرة أخرى.",
  inputMode: "وضع الإدخال",
  voiceInput: "الإدخال الصوتي",
  pushToTalk: "اضغط للتحدث",
  pushToTalkDescription:
    "اضغط مع الاستمرار على الزر الرئيسي أثناء التحدث، ثم حرره للإرسال.",
  toggleToTalk: "التبديل إلى التحدث",
  toggleToTalkDescription:
    "انقر مرة واحدة لبدء التسجيل ثم انقر مرة أخرى عند الانتهاء.",
  driveSession: "جلسة القيادة",
  driveSessionDescription:
    "عند تشغيل المتابعة التلقائية، يبدأ التسجيل بعد كل رد منطوق. اضغط على الزر الرئيسي عند الانتهاء من التحدث.",
  stopDriveSession: "وقفة تلقائية",
  repeatDriveReply: "كرر الأخير",
  continueDriveSession: "استئناف تلقائي",
  speechToText: "الكلام إلى النص",
  appNative: "التعرف على النظام",
  nativeSttDescription:
    "استخدم أداة التعرف على الكلام الخاصة بنظام التشغيل. اعتمادًا على إعدادات الجهاز، قد يتم تشغيل التعرف على الجهاز أو من خلال خدمة النظام. لا يوجد مفتاح موفر مطلوب.",
  provider: "مزود",
  webSearchProvider: "مزود بحث الويب",
  webSearchProviderMissingHint:
    "قم بتكوين خدمة واحدة على الأقل قادرة على البحث في بيانات الاعتماد لتمكين التأريض على الويب هنا.",
  webSearchModelHint: ({ model }) =>
    `يستخدم ${model} خلف الكواليس للتأريض المباشر للويب.`,
  webSearchHomeHint:
    "استخدم مفتاح تبديل الشاشة الرئيسية لتشغيل أو إيقاف تشغيل التأريض للويب لهذا الموضوع.",
  settingsWebSearchCompactHint:
    "يمكنك بشكل اختياري إضافة سياق الويب الجديد قبل أن يرد النموذج الرئيسي.",
  webSearchAdvanced: "ضوابط البحث المتقدمة",
  expandAdvancedSearch: "قم بتوسيع عناصر التحكم في البحث المتقدم",
  collapseAdvancedSearch: "طي عناصر التحكم في البحث المتقدم",
  webSearchSetupNeeded: "أضف بيانات اعتماد لاستخدام بحث الويب المباشر.",
  webSearchEnabledDescription:
    "تتم إضافة سياق ويب جديد قبل أن يرد النموذج.",
  webSearchDisabledDescription:
    "استخدم سياق الويب المباشر لهذا الموضوع عندما تكون الحقائق الحالية مهمة.",
  webSearchQualityControls: "جودة البحث",
  webSearchSearchMode: "وضع البحث",
  webSearchSearchModeQuick: "سريع",
  webSearchSearchModeBalanced: "متوازن",
  webSearchSearchModeDeep: "عميق",
  webSearchDepth: "عمق البحث",
  webSearchDepthStandard: "معيار",
  webSearchDepthDeep: "عميق",
  webSearchResultCount: "عدد النتائج",
  webSearchQualityHint: ({ provider }) =>
    `تقوم عناصر التحكم هذه بضبط كيفية قيام ${provider} بجمع سياق جديد قبل الرد.`,
  webSearchNoExtraControls: ({ provider }) =>
    `لا يكشف ${provider} عن عناصر تحكم إضافية في جودة البحث في هذا التطبيق حتى الآن.`,
  setWebSearchMode: ({ mode }) => `اضبط وضع بحث الويب على ${mode}`,
  openWebSearchSettings: "افتح إعدادات بحث الويب",
  providerSttDescription:
    "استخدم خدمة خارجية تم تكوينها لنسخ صوتك قبل إرساله إلى مسار الرد.",
  sttProvider: "مزود STT",
  sttProviderEnabledHint:
    "يظهر هنا فقط الموفرون الممكّنون الذين لديهم دعم النسخ.",
  sttProviderMissingHint:
    "أضف بيانات اعتماد لخدمة تدعم STT لاختيارها هنا.",
  nativeSttHint:
    "يعمل التعرف على النظام بشكل مستقل عن مفاتيح الموفر لديك ويمكن معالجته على الجهاز أو عن طريق خدمة الكلام الخاصة بنظام التشغيل.",
  replyPlayback: "تشغيل الرد",
  sentencesArrive: "وصول الفقرات",
  sentencesArriveDescription:
    "ابدأ التحدث بمجرد أن تصبح الفقرة الكاملة جاهزة.",
  fullReplyFirst: "الرد الكامل أولا",
  fullReplyFirstDescription:
    "قم بتوليد الإجابة بأكملها أولاً، ثم قم بتشغيلها في تمريرة واحدة.",
  textToSpeech: "تحويل النص إلى كلام",
  spokenReplies: "الردود المنطوقة",
  spokenRepliesEnabledDescription:
    "اقرأ ردود المساعد بصوت عالٍ عندما يتوفر مسار صوتي.",
  spokenRepliesDisabledDescription:
    "احتفظ بالردود نصية فقط في الوقت الحالي. يظل مسار TTS المفضل لديك محفوظًا لوقت لاحق.",
  nativeTtsDescription:
    "استخدم محرك الكلام الخاص بالجهاز للردود المنطوقة ومعاينة الصوت.",
  kokoroTtsDescription:
    "استخدم صوتًا عصبيًا أكثر طبيعية تمامًا على هذا الجهاز. يتم تركيب نص الرد المنطوق محليًا، بدون مفتاح موفر الكلام أو رسوم الاستخدام.",
  kokoroVoices: "Kokoro الأصوات الموجودة على الجهاز",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `يتم تنزيل النموذج متعدد اللغات بحوالي ${size} ميغابايت ويشغل حوالي ${installedSize} ميغابايت بعد التثبيت.`,
  kokoroModel: "Kokoro نموذج متعدد اللغات",
  kokoroChecking: "جارٍ التحقق من الطراز الموجود على الجهاز…",
  kokoroDownloading: ({ progress }) => `جاري التحميل…${progress}%`,
  kokoroExtracting: ({ progress }) => `جارٍ التثبيت… ${progress}%`,
  kokoroVerifying: "جارٍ التحقق من المحرك الصوتي...",
  kokoroInstalled: "مثبت وجاهز على هذا الجهاز.",
  kokoroNotInstalled: "تحميل اختياري. لا يوجد مفتاح موفر مطلوب.",
  kokoroLanguageFallback:
    "يتحدث Kokoro حاليًا اللغة الإنجليزية والصينية المبسطة هنا. بالنسبة إلى لغات الرد المحددة الأخرى، أضف مسارًا احتياطيًا صريحًا وإلا سيتوقف الكلام مع حدوث خطأ.",
  kokoroRemoveTitle: "إزالة نموذج Kokoro؟",
  kokoroRemoveBody: ({ installedSize }) =>
    `يؤدي هذا إلى تحرير حوالي ${installedSize} ميغابايت. يمكنك تنزيل النموذج مرة أخرى في أي وقت.`,
  removeKokoroModel: "قم بإزالة نموذج Kokoro",
  downloadKokoroModel: "قم بتنزيل نموذج Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `مطلوب مسار احتياطي واضح لـ: ${languages}.`,
  kokoroNoSelectedLanguages:
    "حدد اللغة الإنجليزية أو الصينية المبسطة ضمن لغات الاستماع لتكوين صوت Kokoro.",
  expandVoiceSettings: ({ language }) => `قم بتوسيع إعدادات الصوت ${language}`,
  collapseVoiceSettings: ({ language }) =>
    `طي إعدادات الصوت ${language}`,
  remove: "يزيل",
  voiceOutputDescription:
    "اختر محرك الكلام ولغات الاستماع والمعاينات الصوتية للردود المنطوقة.",
  localTts: "محلي",
  localTtsDescription:
    "استخدم صوتًا محليًا مطابقًا تم تنزيله للردود المنطوقة.",
  providerTtsDescription:
    "استخدم الخدمة المحددة التي تم تكوينها للردود المنطوقة.",
  ttsFallbackRoutes: "الطرق الاحتياطية",
  ttsFallbackRoutesHint:
    "خياري. قم بإضافة المسارات التي تريدها فقط، بالترتيب الذي يجب تجربتها به. بمجرد أن يبدأ المسار في التحدث، يظل السيد بروكلي عليه لبقية الرد.",
  ttsFallbackNone:
    "لم يتم تكوين أي احتياطي. سيتم عرض فشل صوتي بدلاً من ذلك.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `إضافة احتياطي ${route}`,
  removeFallbackRoute: ({ route }) => `إزالة ${route} الاحتياطية`,
  moveFallbackEarlier: ({ route }) => `انقل ${route} مسبقًا`,
  moveFallbackLater: ({ route }) => `انقل ${route} لاحقًا`,
  ttsProvider: "مزود TTS",
  ttsProviderEnabledHint:
    "يظهر هنا فقط الموفرون الممكّنون الذين يتمتعون بدعم الرد المنطوق.",
  ttsProviderMissingHint:
    "أضف بيانات اعتماد لخدمة تدعم TTS لاختيارها هنا.",
  localTtsOrderHint:
    "تتم محاولة المسارات الاحتياطية التي تم تكوينها بشكل صريح فقط.",
  providerTtsOrderHint:
    "تتم محاولة المسارات الاحتياطية التي تم تكوينها بشكل صريح فقط.",
  nativeTtsHint:
    "يستخدم TTS الأصلي المكدس الصوتي للنظام ولا يتطلب مفتاح موفر.",
  localTtsLanguageCoverageHint:
    "تغطي الحزم المحلية حاليًا اللغة الإنجليزية والألمانية والصينية المبسطة والإسبانية والبرتغالية والهندية والفرنسية والإيطالية.",
  ttsVoice: "صوت TTS",
  refresh: "ينعش",
  providerVoiceDirectory: ({ provider }) => `المكتبة الصوتية ${provider}`,
  refreshProviderVoices: ({ provider }) => `تحديث أصوات ${provider}`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} ${Number(count) === 1 ? "صوت" : "أصوات"} متاح من ${provider}.`,
  providerVoicesLoadFailed:
    "لا يمكن تحديث الأصوات. اختيارك الحالي لم يتغير؛ لا يزال بإمكانك إدخال معرف صوتي يدويًا.",
  providerVoicesLoadFailedWithFallback:
    "لا يمكن تحميل أصوات الحساب. يظل الصوت المدمج متاحًا.",
  providerVoicesErrorDetail: ({ detail }) => `السبب: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "في ElevenLabs، قم بتحرير مفتاح API هذا وقم بتمكين الأصوات → قراءة، ثم قم بالتحديث هنا.",
  providerVoicesLoadingHint: ({ provider }) =>
    `يقوم السيد بروكلي بتحميل الأصوات المتاحة تلقائيًا من ${provider}.`,
  providerVoiceId: "الهوية الصوتية",
  providerVoiceIdPlaceholder: "أدخل معرفًا صوتيًا",
  providerVoiceIdFallbackHint:
    "يظل الإدخال اليدوي متاحًا عندما لا يمكن تحميل المكتبة الصوتية.",
  providerVoiceIdRequired: ({ provider }) =>
    `قم بتحديث مكتبة الصوت ${provider} أو أدخل معرفًا صوتيًا قبل استخدام إخراج الكلام.`,
  qwenSpeechUnavailableInUs:
    "مسارات الكلام Qwen الحالية لـ السيد بروكلي غير متوفرة في منطقة الولايات المتحدة. اختر سنغافورة أو بكين لخطاب Qwen.",
  qwenApiRegion: "منطقة Qwen API",
  qwenRegionSingapore: "سنغافورة",
  qwenRegionUs: "الولايات المتحدة (فرجينيا)",
  qwenRegionBeijing: "الصين (بكين)",
  qwenRegionHint:
    "يجب أن تتطابق المنطقة المحددة مع المنطقة التي تم إنشاء مفتاح API فيها.",
  qwenRegionUsSpeechHint:
    "تدعم مفاتيح منطقة الولايات المتحدة الدردشة والبحث على الويب هنا. تتطلب مسارات السيد بروكلي الحالية Qwen STT وTTS مفتاح سنغافورة أو بكين.",
  providerDefaultVoiceHint:
    "يستخدم هذا الموفر حاليًا صوته الافتراضي للمعاينة والردود المنطوقة.",
  listenLanguages: "الاستماع اللغات",
  listenLanguagesHint:
    "اختر لغات الرد التي تريدها أن تبدو جيدة. يقوم السيد بروكلي بتجربتها بهذا الترتيب عند توجيه إخراج الكلام.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "تم اختيار لغة واحدة" : `تم تحديد اللغات ${count}`,
  localVoicePacks: "حزم الصوت المحلية",
  localVoicePacksHint:
    "تحتفظ كل لغة بصوتها المحلي الخاص. اختر الصوت الذي تريده لتلك اللغة، ثم قم بتنزيل الحزم التي تهمك فقط.",
  localVoiceForLanguage: ({ languageLabel }) => `صوت لـ ${languageLabel}`,
  providerVoicePreviews: "معاينة صوت الموفر",
  providerVoicePreviewsHint:
    "اختبر مسار TTS المحدد حاليًا هنا مع نص معاينة منفصل لكل لغة رد.",
  nativeVoicePreviewSection: "معاينة الصوت الأصلي",
  nativeVoicePreviewSectionHint:
    "يتحدث هذا مباشرة من خلال مُركِّب الكلام المدمج في الهاتف حتى تتمكن من مقارنته بأصوات الموفر التي تم تكوينها.",
  nativeVoiceUnavailable:
    "لم يُبلغ هذا الجهاز عن أي أصوات للنظام الأصلي للمعاينة.",
  speechDiagnostics: "نشاط الكلام الأخير",
  speechDiagnosticsHint:
    "يعرض أحدث طلبات الكلام، والمسار الذي طلبته، والمسار الذي استخدمته بالفعل، وأي سبب احتياطي.",
  clearSpeechDiagnostics: "مسح نشاط الكلام الأخير",
  speechDiagnosticsEmpty:
    "لا توجد طلبات الكلام الأخيرة حتى الآن. قم بمعاينة الصوت أو تشغيل الرد لرؤية تفاصيل التوجيه هنا.",
  clearSpeechDiagnosticsConfirmationTitle: "هل تريد محو نشاط الكلام الأخير؟",
  clearSpeechDiagnosticsConfirmationMessage:
    "يؤدي هذا إلى إزالة كافة تشخيصات توجيه الكلام التي تم التقاطها. لا يمكن التراجع عن هذا الإجراء.",
  speechDiagnosticSourceConversation: "رد المحادثة",
  speechDiagnosticSourceRepeat: "كرر الرد",
  speechDiagnosticSourcePreview: "معاينة الصوت",
  speechDiagnosticSourceUnknown: "طلب الكلام",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `المطلوب: ${requested} -> الفعلي: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `المرحلة الأخيرة: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `اللغة: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `المزود: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `الصوت: ${voice}`,
  localTtsPackReady: "تم تثبيته على هذا الجهاز",
  localTtsPackBroken:
    "تم التنزيل، لكن هذا الصوت فشل في التحقق المحلي على هذا الجهاز. أعد تنزيله أو اختر صوتًا آخر.",
  localTtsPackMissing:
    "لم يتم تثبيته بعد. سيتم استخدام Cloud TTS أو صوت النظام حتى تقوم بتنزيله.",
  localTtsUnsupportedLanguageFallback:
    "الحزمة المحلية غير متوفرة بعد لهذه اللغة. Cloud TTS أو سيتعامل معها صوت النظام.",
  downloadingLocalTtsPack: ({ progress }) =>
    `جارٍ تنزيل الحزمة المحلية... ${progress}%`,
  download: "تحميل",
  downloadingShort: "تحميل...",
  voicePreviewText: "نص معاينة الصوت",
  voicePreviewPlaceholder: "اكتب عبارة لسماع هذا الصوت.",
  voicePreviewHint:
    "يستخدم الواجهة الصوتية للرد المحددة حاليًا دون إرسال أي شيء إلى نموذج اللغة.",
  previewVoice: "معاينة الصوت",
  generatingPreview: "جارٍ إنشاء المعاينة...",
  playingPreview: "جارٍ تشغيل المعاينة...",
  systemVoice: "صوت النظام",
  spokenRepliesOff: "النص فقط",
  noTtsProvider: "لا يوجد مزود TTS",
  nothingToCopyYet: "لا يوجد شيء لنسخه بعد.",
  couldntCopyText: "تعذر نسخ هذا النص.",
  nothingToShareYet: "لا شيء للمشاركة بعد.",
  couldntShareText: "تعذرت مشاركة هذا النص.",
  couldntReplayReply: "تعذرت إعادة تشغيل هذا الرد.",
  replyFailed: "فشل الرد",
  retryReply: "أعد محاولة الرد",
  replyFailedHint: "يمكنك اختيار نموذج آخر أعلاه قبل إعادة المحاولة.",
  spokenReplyFailed: "تم حفظ الرد، لكن تعذر نطقه.",
  retrySpeech: "أعد محاولة الكلام",
  openSpeakingSettings: "إعدادات التحدث",
  messageCopied: "تم نسخ الرسالة.",
  noConversationToCopyYet: "لا توجد محادثة لنسخها بعد.",
  noConversationToShareYet: "لا توجد محادثة للمشاركة بعد.",
  noReplyToRepeatYet: "لا يوجد رد على الإعادة حتى الآن.",
  threadCopied: "تم نسخ الموضوع.",
  threadRenamed: "تمت إعادة تسمية الموضوع.",
  threadPinned: "تم تثبيت الموضوع.",
  threadUnpinned: "تم إلغاء تثبيت الموضوع.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `أضف بيانات اعتماد ${provider} في الإعدادات قبل استخدام هذا المسار.`,
  configureCredentialsBeforeVoiceSession:
    "أضف بيانات الاعتماد في الإعدادات قبل بدء الجلسة الصوتية.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `بالنسبة إلى ${provider}، أدخل عنوان URL الأساسي للموفر ومفتاح API كـ https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "التعرف على الكلام غير متوفر على هذا الجهاز.",
  debugLogLabel: "سجل",
  debugLogCaptureStarted: "بدأ تسجيل التصحيح.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `تم حفظ سجل التصحيح باسم ${fileName} ونسخه إلى الحافظة (إدخالات ${entryCount}).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `تم حفظ سجل التصحيح باسم ${fileName} (إدخالات ${entryCount}).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `تم استرداد سجل التصحيح السابق ${fileName} ونسخه إلى الحافظة (إدخالات ${entryCount}).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `تم استرداد سجل التصحيح السابق ${fileName} (إدخالات ${entryCount}).`,
  debugLogCaptureFailed: "تعذر حفظ سجل التصحيح.",
  chooseSttBeforeVoiceSession:
    "اختر مسار STT الذي تم تكوينه في الإعدادات قبل بدء جلسة صوتية.",
  chooseTtsBeforeSpokenReplies:
    "اختر مسار TTS الذي تم تكوينه في الإعدادات قبل استخدام الردود المنطوقة.",
  stopSessionBeforeReplay:
    "أوقف جلسة الصوت النشطة قبل إعادة تشغيل الرد الأخير.",
  couldntCatchThatTryAgain: "لم أتمكن من التقاط ذلك، حاول مرة أخرى.",
  couldntStartVoiceInput: "تعذر بدء الإدخال الصوتي.",
  couldntProcessVoiceInput: "تعذرت معالجة الإدخال الصوتي.",
  maxRecordingLengthReached:
    "تم الوصول إلى الحد الأقصى لطول التسجيل — أرسل ما لدي.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `هذا التسجيل طويل جدًا بالنسبة لتحويل الكلام إلى نص ${provider} (الحد الأقصى ${limit}). حاول إرسال رسالة أقصر، أو قم بتبديل تحويل الكلام إلى نص إلى التعرف على النظام.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `أضف بيانات اعتماد ${provider} في الإعدادات قبل استخدام هذا المسار.`,
  stopSessionBeforePreview:
    "أوقف جلسة الصوت النشطة قبل معاينة الصوت.",
  chooseTtsToPreviewVoices:
    "اختر مسار TTS الذي تم تكوينه في الإعدادات لمعاينة الأصوات.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `قم بتنزيل الصوت المحلي ${languageLabel} المحدد أولاً.`,
  couldntPreviewVoice: "تعذرت معاينة الصوت.",
  spokenRepliesDisabled: "يتم إيقاف الردود المنطوقة في الإعدادات.",
  providerVoiceFallback:
    "فشل المسار الصوتي الذي تم تكوينه. تم تحويل هذا الرد إلى صوت احتياطي.",
  localVoiceFallback:
    "الصوت المحلي لم يكن متاحا. تم تحويل هذا الرد إلى صوت احتياطي.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `تم تثبيت حزمة الصوت المحلية ${languageLabel}.`,
  localTtsPackInstallFailed: "تعذر تثبيت حزمة الصوت المحلية.",
  clear: "واضح",
  voiceOutput: "إخراج الصوت",
  currentSetup: "الإعداد الحالي",
  listeningToYourVoice: "الاستماع إلى صوتك",
  parsingYourVoiceInput: "تحويل صوتك إلى نص",
  preparingRequest: "جارٍ تحضير طلبك",
  searchingTheWeb: "البحث في الويب عن سياق جديد",
  waitingForProvider: ({ provider }) => `في انتظار ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `تحضير الصوت ببرنامج ${provider}`,
  deepThinkingReassurance: "الإجابات الجيدة تستغرق لحظة...",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "التحدث إليك مرة أخرى",
  freshSession: "جلسة جديدة",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 رسالة" : `رسائل ${count}`,
  speechInputRoute: ({ route }) => `الكلام في: ${route}`,
  replyModelRoute: ({ route }) => `نموذج الرد: ${route}`,
  voiceOutputRoute: ({ route }) => `الصوت الخارجي: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `الصوت الاحتياطي: ${route}`,
  conversation: "محادثة",
  conversationActions: "إجراءات المحادثة",
  statusDetails: "تفاصيل الحالة",
  persistenceFailure:
    "تعذر على السيد بروكلي حفظ البيانات على هذا الجهاز. أبقِ التطبيق مفتوحًا وحاول مرة أخرى؛ قد يتم فقدان التغييرات الأخيرة بعد إعادة التشغيل.",
  show: "يعرض",
  showTranscript: "إظهار النص",
  hide: "يخفي",
  copyThread: "نسخ الموضوع",
  shareThread: "مشاركة الموضوع",
  repeatReply: "كرر الرد",
  renameThread: "إعادة تسمية الموضوع",
  renameThreadHint:
    "أعط هذه المحادثة عنوانًا يمكنك العثور عليه سريعًا لاحقًا.",
  threadTitle: "عنوان الموضوع",
  noTranscriptYet: "لا يوجد نسخة بعد",
  previewTranscriptEmptyDescription:
    "استخدم الصوت أو النص للبدء. ستظهر محادثتك هنا.",
  noConversationYet: "لا توجد محادثة بعد",
  expandedTranscriptEmptyDescription:
    "استخدم الصوت أو النص للبدء. أغلق هذه الشاشة عندما تريد العودة إلى المسرح الرئيسي.",
  transcriptSelectionHint:
    "حدد أي نص رسالة مباشرة، أو قم بمشاركة ونسخ الرسائل الفردية أدناه.",
  textMessagePlaceholder: "اكتب رسالة",
  sendTextMessage: "أرسل رسالة",
  showVoiceInput: "إظهار الإدخال الصوتي",
  showTextInput: "إظهار إدخال النص",
  usageStatsHiddenDescription: "احتفظ بتقديرات الرموز المميزة خارج النص UI.",
  usageStatsVisibleDescription:
    "إظهار الاستخدام المقدر للرمز المميز للردود وإجماليات المحادثات.",
  debugLogButton: "زر سجل التصحيح",
  debugLogButtonHiddenDescription:
    "احتفظ بزر السجل الموجود على الشاشة الرئيسية مخفيًا ما لم تكن عملية الالتقاط قيد التشغيل بالفعل.",
  debugLogButtonVisibleDescription:
    "أظهر زر السجل على الشاشة الرئيسية لبدء عمليات التقاط تصحيح الأخطاء وإيقافها.",
  debugLogButtonUsageDescription:
    "كيفية استخدام الزر: سيؤدي تشغيله إلى البدء في التقاط السجلات. سيؤدي إيقاف تشغيله إلى إيقاف التقاط السجلات ونقل السجلات الملتقطة إلى الحافظة.",
  estimatedUsageTitle: "الاستخدام المقدر",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `ردود ${replies} · تحديثات الذاكرة ${summaries}`,
  estimatedUsageConversationScope:
    "تتضمن الإجماليات كل مسار ونموذج مستخدم داخل هذه المحادثة.",
  estimatedPromptTokens: ({ count }) => `مستعجل: ${count}`,
  estimatedReplyTokens: ({ count }) => `الرد: ${count}`,
  estimatedTotalTokens: ({ count }) => `الإجمالي: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `EST. ${prompt} داخل · ${completion} خارج · إجمالي ${total}`,
  searchQuery: "استعلام البحث",
  expandWebSearchDetails: "عرض تفاصيل بحث الويب",
  collapseWebSearchDetails: "إخفاء تفاصيل بحث الويب",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "مصدر" : "مصادر"}`,
  sources: "مصادر",
  openSourceLink: ({ source }) => `المصدر المفتوح: ${source}`,
  turnReceipt: "بدوره التفاصيل",
  expandTurnReceipt: "إظهار تفاصيل المنعطف",
  collapseTurnReceipt: "إخفاء تفاصيل المنعطف",
  turnReceiptDirect: "مباشر",
  turnReceiptRequested: "مسار الرد المطلوب",
  turnReceiptActual: "طريق الرد الفعلي",
  turnReceiptEffort: "السيطرة المنطقية",
  turnReceiptProviderNative: "مزود الأصلي",
  turnReceiptInput: "طريق الإدخال",
  turnReceiptSearch: "البحث على شبكة الإنترنت",
  turnReceiptVoice: "إخراج الصوت",
  turnReceiptContext: "سياق",
  turnReceiptTiming: "توقيت",
  turnReceiptFallback: "سبب تراجعي",
  turnReceiptVoiceInput: "صوت",
  turnReceiptTypedInput: "كتبته",
  turnReceiptSystemSpeech: "التعرف على كلام النظام",
  turnReceiptSystemVoice: "صوت النظام",
  turnReceiptSystemVoiceFallback: "صوت النظام · احتياطي",
  turnReceiptOff: "عن",
  turnReceiptNotConfigured: "على · لم يتم تكوينه",
  turnReceiptFallbackWithoutSearch: "تابع دون البحث المباشر",
  turnReceiptNotUsed: "غير مستخدم",
  turnReceiptSummaryReused: "إعادة استخدام الملخص المحفوظ",
  turnReceiptSummaryUpdated: "تم تحديث الملخص",
  turnReceiptContextFallback: "احتياطي الرسالة الأخيرة",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `تم ضغط البوابة ${original} إلى رسائل ${compressed}`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `تم إرسال الرسائل السابقة ${sent}/${total} · ملخص ${summarized} حديثًا${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "سياق",
  turnReceiptTimingSearch: "يبحث",
  turnReceiptTimingModel: "نموذج",
  turnReceiptTimingFirstSpeech: "الكلام الأول",
  turnReceiptTimingTotal: "المجموع",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `الرموز المميزة ${tokens}`,
  unknownUsageRoute: "طريق غير معروف",
  setupGuideConnectProviderTitle: "تكوين بيانات الاعتماد",
  setupGuideConnectProviderDescription:
    "أضف بيانات الاعتماد في الإعدادات، ثم اختر المسارات التي تريد استخدامها.",
  idle: "عاطل",
  yourConversationAppearsHere: "تظهر محادثتك هنا",
  defaultTranscriptEmptyDescription:
    "استخدم الصوت أو النص للبدء. سيحتفظ السيد بروكلي بالموضوع ويرد هنا.",
  delete: "يمسح",
  deleteConversationConfirmationTitle: ({ title }) => `هل تريد حذف "${title}"؟`,
  deleteConversationConfirmationMessage:
    "يؤدي هذا إلى حذف المحادثة وجميع رسائلها نهائيًا. لا يمكن التراجع عن هذا الإجراء.",
  memory: "ذاكرة",
  conversations: "المحادثات",
  drawerSubtitle: "انتقل بين المواضيع الحية أو ابدأ غرفة جديدة.",
  newSession: "جلسة جديدة",
  noSavedConversationsYet: "لا توجد محادثات محفوظة حتى الآن",
  drawerEmptyDescription:
    "ابدأ التحدث من العرض الرئيسي وسيقوم السيد بروكلي بإنشاء جلسة تلقائيًا.",
  setupGuideTitle: "قم بتكوين التطبيق",
  setupGuideSubtitle: "أضف بيانات الاعتماد واختر الطرق في الإعدادات.",
  fastestStartPreset: "الحد الأدنى من الإعداد",
  fastestStartDescription:
    "استخدم كلام الجهاز حيثما كان ذلك متاحًا وقم بتكوين مسار الرد الذي تحتاجه فقط.",
  fullVoicePreset: "صوت تم تكوينه",
  fullVoiceDescription:
    "استخدم الخدمات التي تم تكوينها للردود والتحويل الصوتي والمخرجات المنطوقة عندما تختارها.",
  setupGuideNote:
    "سنفتح الإعدادات بعد ذلك حتى تتمكن من لصق بيانات الاعتماد والتحقق من صحتها.",
  useThisSetup: "استخدم هذا الإعداد",
  notNow: "ليس الآن",
  setupGuideIntroTitle: "كيف يعمل السيد بروكلي",
  setupGuideIntroBody:
    "يبدأ السيد بروكلي فارغًا. أضف بيانات اعتماد للخدمات الخارجية التي تستخدمها بالفعل، ثم اختر كيفية توجيه الردود وإدخال الكلام والمخرجات المنطوقة وسياق الويب الاختياري.",
  setupGuideIntroNote:
    "بعد الإعداد، استخدم التحكم الصوتي الرئيسي لبدء المحادثة وإيقافها. يظل النص الحالي متاحًا على الشاشة الرئيسية، ويمكن تغيير كل مسار لاحقًا في الإعدادات.",
  setupGuideProviderTitle: "إضافة بيانات الاعتماد",
  setupGuideProviderBody:
    "اختر الخدمة الخارجية التي تريد تكوينها، ثم الصق بيانات الاعتماد مع إمكانية الوصول للرد.",
  setupGuideProviderPickerLabel: "خدمة الرد",
  setupGuideSelectProvider: "حدد مزودًا",
  setupGuideSelectProviderFirst: "حدد مزودًا أولاً.",
  setupGuideApiKeyLabel: "مفتاح API",
  setupGuideApiKeyPlaceholder: "لصق بيانات الاعتماد",
  setupGuideContinue: "يكمل",
  setupGuideOpenSettings: "افتح الإعدادات",
  setupGuideBack: "خلف",
  setupGuideValidateKey: "التحقق من صحة المفتاح",
  setupGuideApiKeyRequiredOrCancel:
    "أضف مفتاح API للمتابعة أو قم بإلغاء دليل الإعداد.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "اختر موفرًا وأضف مفتاح API للمتابعة أو قم بإلغاء دليل الإعداد.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `لا تسمح بيانات اعتماد ${provider} هذه بطلبات الرد.`,
  setupGuideKokoroTitle: "أضف صوتًا طبيعيًا على الجهاز",
  setupGuideKokoroBody: ({ size }) =>
    `اختياري: قم بتنزيل Kokoro (حوالي ${size} ميغابايت) للحصول على ردود منطوقة أكثر طبيعية بدون موفر الكلام أو رسوم الاستخدام.`,
  setupGuideKokoroLanguageNote:
    "يتحدث هذا النموذج حاليًا اللغة الإنجليزية والصينية المبسطة. قم بتكوين أي مسارات احتياطية تريدها لاحقًا في إعدادات التحدث.",
  setupGuideKokoroDownload: "تحميل Kokoro",
  setupGuideUseKokoro: "استخدم Kokoro للردود المنطوقة",
  setupGuideUseKokoroSummary:
    "احتفظ بالتوليف على الهاتف عندما تكون لغة الرد مدعومة.",
  setupGuideSkipKokoro: "تخطي الآن",
  setupGuideVoiceTestTitle: "اختبار الإعداد الخاص بك",
  setupGuideVoiceTestBody:
    "قل جملة قصيرة. سيختبر السيد بروكلي الوصول إلى الميكروفون والنسخ ومسار الرد الذي تم تكوينه والإخراج المنطوق عند توفر مسار صوتي مقبول.",
  setupGuideVoiceTestNoInputBody:
    "الإدخال الصوتي غير متاح مع هذا الإعداد. استمر في مراجعة المسارات المكتشفة، ثم اضبط إعدادات الكلام لاحقًا إذا لزم الأمر.",
  setupGuideVoiceTestTextOnlyNote:
    "يظل هذا الاختبار نصيًا فقط لأنه لا يوجد طريق صوتي منطوق مقبول جاهز حتى الآن.",
  setupGuideVoiceTestStart: "ابدأ الاختبار",
  setupGuideVoiceTestStop: "توقف عن التسجيل",
  setupGuideVoiceTestRetry: "تشغيل مرة أخرى",
  setupGuideVoiceTestTranscribing: "جارٍ النسخ…",
  setupGuideVoiceTestThinking: "الرد التجريبي...",
  setupGuideVoiceTestSynthesizing: "جارٍ تحضير الصوت…",
  setupGuideVoiceTestSpeaking: "جارٍ تشغيل الرد...",
  setupGuideVoiceTestTranscript: "نص",
  setupGuideVoiceTestReply: "رد",
  setupGuideVoiceTestReset: "مسح هذه النتيجة",
  setupGuideVoiceInputUnavailable:
    "الإدخال الصوتي غير متاح لهذا الإعداد على هذا الجهاز.",
  setupGuideSummaryTitle: "اكتمل الإعداد",
  setupGuideSummaryBody:
    "هذا هو المسار الذي سيستخدمه السيد بروكلي مع التكوين الحالي الخاص بك.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "الكلام إلى النص",
  setupGuideSummaryTts: "تحويل النص إلى كلام",
  setupGuideSummaryWebSearch: "البحث على شبكة الإنترنت",
  setupGuideRouteProviderLlm: ({ provider }) => `تم التمكين عبر ${provider}`,
  setupGuideRouteOnDeviceStt: "تم التمكين عبر نظام التعرف على الكلام",
  setupGuideRouteProviderStt: ({ provider }) =>
    `تم التمكين عبر نسخ الكلام ${provider}`,
  setupGuideRouteProviderTts: ({ provider }) => `تم التمكين عبر صوت ${provider}`,
  setupGuideRouteKokoroTts: "تم التمكين عبر الصوت الموجود على الجهاز Kokoro",
  setupGuideRouteLocalTts: "تم تمكينه عبر حزمة الصوت المحلية",
  setupGuideRouteUnavailable: "غير متوفر",
  setupGuideRouteOff: "عن",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `متاح عبر ${provider}، متوقف حاليًا`,
  setupGuideSummaryTextOnlyNote:
    "الردود المنطوقة متوقفة حاليًا. تظل الردود في شكل نص حتى تقوم بتمكين موفر الخدمة أو الصوت المحلي.",
  setupGuideFinish: "منتهي",
  searchConversationsPlaceholder: "البحث في العناوين والنماذج ونص الرسالة",
  noMatchingConversations: "لا توجد محادثات مطابقة",
  noMatchingConversationsDescription:
    "جرّب عنوانًا أو مسارًا أو نموذجًا أو عبارة مختلفة من النص.",
  memoryModalTitle: "ذاكرة المحادثة",
  memoryModalDescription:
    "هذا هو الملخص المضغوط الذي يتم تنفيذه بواسطة السيد بروكلي بمجرد أن يصبح الخيط طويلًا بما يكفي لضغط المنعطفات القديمة.",
  memorySummary: "الملخص المحفوظ",
  memorySummaryEmpty:
    "لا توجد ذاكرة مدمجة حتى الآن. بمجرد أن يصبح هذا الموضوع أطول، سيتم تلخيص المنعطفات القديمة هنا.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 دورة ملخصة" : `${count} تلخيص المنعطفات`,
  copyMemory: "نسخ الذاكرة",
  forgetMemory: "ننسى الذاكرة",
  memoryCopied: "تم نسخ الذاكرة.",
  memoryCleared: "تم مسح ذاكرة المحادثة.",
  noConversationToManageYet: "لا توجد ذاكرة محادثة متاحة بعد.",
  noProviderYet: "لا يوجد مزود حتى الآن",
  noModelYet: "لا يوجد نموذج بعد",
  startedAt: "بدأت",
  endedAt: "انتهى",
  pinned: "مثبت",
  copy: "ينسخ",
  share: "يشارك",
  rename: "إعادة تسمية",
  pin: "دبوس",
  unpin: "إزالة التثبيت",
  save: "يحفظ",
  cancel: "يلغي",
  stop: "قف",
  pause: "يوقف",
  resume: "سيرة ذاتية",
  paused: "متوقف مؤقتًا",
  listening: "الاستماع",
  parsing: "النسخ",
  searching: "البحث",
  converting: "تحويل",
  webSearchAction: "البحث على شبكة الإنترنت",
  thinking: "التفكير",
  speaking: "تكلم",
  pleaseWait: "انتظر من فضلك",
  yourTurn: "دورك",
  keepPressing: "استمر في الضغط",
  tapWhenDone: "اضغط عند الانتهاء",
  speechPaused: "تم إيقاف الكلام مؤقتًا",
  pausePlaybackUnavailable:
    "لا يمكن إيقاف هذا المسار الصوتي مؤقتًا. أوقفه أو قم بالتبديل إلى الإخراج الصوتي للموفر.",
  holdToSpeak: "عقد للتحدث",
  tapToSpeak: "انقر للتحدث",
  tapAgainToSend: "اضغط مرة أخرى للإرسال",
  waitingForReply: "في انتظار الرد",
  parsingYourVoice: "تحليل صوتك",
  providerConfiguredInSettings: ({ provider }) =>
    `لم يتم تكوين ${provider} في الإعدادات.`,
  providerNetworkError: ({ provider, action }) =>
    `تعذر الوصول إلى ${provider} لـ ${action}. تحقق من الاتصال وحاول مرة أخرى.`,
  providerAuthError: ({ provider, action }) =>
    `رفض ${provider} بيانات اعتماد ${action}. تحقق من مفتاح API والأذونات.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} يحد من معدل ${action} في الوقت الحالي. حاول مرة أخرى بعد قليل.`,
  providerCreditsRequired: ({ provider, action }) =>
    `يحتاج ${provider} إلى رصيد API كافٍ لـ ${action}. تحقق من رصيد الحساب والحد الأقصى لإنفاق المفتاح.`,
  providerTimeoutError: ({ provider, action }) =>
    `استغرق ${provider} وقتًا طويلاً أثناء ${action}. حاول ثانية.`,
  providerTemporaryError: ({ provider, action }) =>
    `واجه ${provider} مشكلة مؤقتة أثناء ${action}. حاول مرة أخرى قريبا.`,
  providerEmptyReplyError: ({ provider }) =>
    `انتهى ${provider} دون إرجاع الرد. حاول ثانية.`,
  providerIncompleteReplyError: ({ provider }) =>
    `انتهى رد ${provider} قبل أن يكتمل. حاول ثانية.`,
  providerContextTooLong: ({ provider }) =>
    `رفض ${provider} الرد لأن المحادثة أصبحت طويلة جدًا. ابدأ موضوعًا جديدًا أو اختصر الطلب.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `رفض ${provider} طلب ${action}: ${detail}`
      : `رفض ${provider} طلب ${action}.`,
  providerWebSearchNotRun: ({ provider }) =>
    `قام ${provider} بإرجاع استجابة دون تشغيل بحث الويب.`,
  providerValidationSuccess: ({ provider }) => `${provider} جاهز للاستخدام.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} يعمل.`,
  providerValidationFailed: "فشل التحقق من صحة الموفر.",
  webSearchFallback:
    "لم يكن بحث الويب متاحًا، لذلك استمر الرد بدون سياق الويب المباشر.",
  noBase64EncoderAvailable: "لا يتوفر برنامج ترميز base64.",
  noBase64DecoderAvailable: "لا يوجد وحدة فك ترميز Base64 متاحة.",
  azureSpeechApiKeyFormat:
    "يحتاج Microsoft Azure TTS إلى بيانات اعتماد Azure Speech بتنسيق <key>|<region>، على سبيل المثال abc123|westeurope، أو تنسيق Azure المدمج <endpoint>|<api-key>|<key>|<region>.",
  googleCloudSpeechCredentialFormat: ({ provider }) =>
    `يحتاج ${provider} STT إلى بيانات اعتماد Google Cloud Speech بالتنسيق <project-id>|<access-token>|<location>، أو بتنسيق Gemini المدمج <Gemini API key>|<project-id>|<access-token>|<location>.`,
  bytedanceSpeechCredentialFormat: ({ provider }) =>
    `يحتاج ${provider} STT إلى Doubao بيانات اعتماد الكلام بالتنسيق <app-key>|<access-key>، أو اختياريًا <app-key>|<access-key>|<resource-id>، أو التنسيق المدمج <ark-api-key>|<app-key>|<access-key>|<resource-id>.`,
  nativeTtsDoesNotSynthesizeAudioFiles:
    "لا يقوم TTS الأصلي بتجميع الملفات الصوتية.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `لا يوجد مسار صوتي محلي أو سحابي جاهز لـ ${languageLabel}.`,
  chooseTextToSpeechProviderInSettings:
    "اختر موفر خدمة تحويل النص إلى كلام في الإعدادات.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS غير مدعوم حتى الآن.`,
  ttsError: ({ provider, status, errorText }) =>
    `خطأ ${provider} TTS (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `رفض إخراج الكلام ${provider} الرد لأنه كان طويلًا جدًا.`,
  ttsTimeout: ({ provider }) => `استغرق إخراج الكلام ${provider} وقتًا طويلاً.`,
  sttTimeout: ({ provider }) =>
    `استغرق نسخ الكلام ${provider} وقتًا طويلاً.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} يقبل فقط التسجيلات التي تصل إلى ${limit}. استخدم مقطعًا أقصر أو قم بتبديل موديلات STT.`,
  voiceInputCaptureIncomplete:
    "لا يمكن التقاط الإدخال الصوتي بشكل واضح. يرجى المحاولة مرة أخرى.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS لم يُرجع الصوت.`,
  nativeSttHandledInApp: "يتم التعامل مع نظام STT مباشرة في التطبيق.",
  chooseSpeechToTextProviderInSettings:
    "اختر موفر خدمة تحويل الكلام إلى نص في الإعدادات.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT غير مدعوم حتى الآن.`,
  providerNotWiredUpYet: ({ provider }) => `لم يتم توصيل ${provider} بعد.`,
  you: "أنت",
  assistant: "مساعد",
  untitledConversation: "محادثة بلا عنوان",
  conversationExportHeader: ({ title }) => `المحادثة: ${title}`,
  speechRecognitionPermissionNotGranted:
    "لم يتم منح إذن التعرف على الكلام.",
  speechRecognitionUnavailableForDeviceLanguage:
    "التعرف على الكلام غير متاح للغة الجهاز الحالية.",
  nativeSpeechRecognitionNeedsNetwork:
    "يحتاج التعرف على الكلام الأصلي إلى الوصول إلى الشبكة الآن.",
  noSpeechDetected: "لم يتم اكتشاف أي كلام.",
  nativeSpeechRecognitionFailed: "فشل التعرف على الكلام الأصلي.",
  couldntStartNativeSpeechRecognition:
    "تعذر بدء التعرف على الكلام الأصلي.",
  microphonePermissionNotGranted: "لم يتم منح إذن الميكروفون",
} satisfies TranslationDictionary;
