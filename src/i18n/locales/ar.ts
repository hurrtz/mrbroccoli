import type { TranslationDictionary } from "../types";
import { dataBackupTranslations } from "../dataBackupTranslations";
import { conversationKnowledgeTranslations } from "../conversationKnowledgeTranslations";
import { conversationIntegrityTranslations } from "../conversationIntegrityTranslations";
import { conversationArtifactTranslations } from "../conversationArtifactTranslations";
import { interruptionTranslations } from "../interruptionTranslations";
import { ulraAuditTranslations } from "../ulraAuditTranslations";
import { imagePromptTranslations } from "../imagePromptTranslations";
import { memoryEditTranslations } from "../memoryEditTranslations";
import { onDeviceTranslations } from "../onDeviceTranslations";
import { onboardingTranslations } from "../onboardingTranslations";
import { introTranslations } from "../introTranslations";
import { premiumTranslations } from "../premiumTranslations";
import { transcriptEditTranslations } from "../transcriptEditTranslations";
import { autoSetupTranslations } from "../autoSetupTranslations";
import { workspaceTranslations } from "../workspaceTranslations";

export const ar = {
  ...conversationArtifactTranslations.ar,
  ...interruptionTranslations.ar,
  ...ulraAuditTranslations.ar,
  ...dataBackupTranslations.ar,
  ...conversationKnowledgeTranslations.ar,
  ...conversationIntegrityTranslations.ar,
  ...imagePromptTranslations.ar,
  ...memoryEditTranslations.ar,
  ...onDeviceTranslations.ar,
  ...onboardingTranslations.ar,
  ...introTranslations.ar,
  ...premiumTranslations.ar,
  ...transcriptEditTranslations.ar,
  ...workspaceTranslations.ar,
  ...autoSetupTranslations.ar,
  appName: "السيد بروكلي",
  retry: "أعد المحاولة",
  dismiss: "إغلاق",
  done: "تم",
  aboutSetting: ({ setting }) => `حول ${setting}`,
  unavailable: "غير متاح",
  selection: "اختيار",
  chooseCompatibleProviderFirst: "اختر مزوّدًا متوافقًا أولاً",
  settings: "الإعدادات",
  settingsReleaseVersion: ({ version }) => `الإصدار ${version}`,
  all: "الكل",
  firstRun: "التشغيل لأول مرة",
  instructions: "تعليمات",
  providers: "المزوّدون",
  webSearch: "بحث الويب",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "الاستعداد لوقت التشغيل",
  settingsReadinessThink: "التفكير",
  settingsReadinessListen: "الاستماع",
  settingsReadinessSpeak: "التحدث",
  settingsReadinessSearch: "البحث",
  settingsReadinessReady: "مستعد",
  settingsReadinessNeedsAttention: "انتباه",
  settingsReadinessBroken: "معطّل",
  settingsReadinessOff: "متوقف",
  settingsConnections: "اتصالات",
  settingsThinking: "التفكير",
  settingsListening: "الاستماع",
  settingsSpeaking: "التحدث",
  settingsSearch: "البحث",
  settingsAppDiagnostics: "التطبيق والتشخيص",
  settingsGuidedSetup: "الإعداد الموجه",
  settingsGuidedSetupSummary:
    "قم بمراجعة الاتصالات واختبار المسار الصوتي الكامل.",
  setupGuideShowInSettings: "إظهار الإعداد الموجه في الإعدادات",
  setupGuideShowInSettingsSummary:
    "قم بإظهار أو إخفاء اختصار الإعداد الموجه في نظرة عامة على الإعدادات.",
  settingsConnectionsSummary: "مفاتيح المزوّدين والتحقق من الصحة والقدرات.",
  settingsThinkingSummary: "البطاقات الرئيسية والنماذج والجهد وموجه النظام.",
  settingsListeningSummary: "وضع الإدخال وتوجيه الكلام إلى النص.",
  settingsSpeakingSummary: "الردود المنطوقة، والتشغيل، والأصوات، والمعاينات.",
  settingsSearchSummary: "مزوّد بحث الويب وضوابط جودة البحث.",
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
  english: "الإنجليزية",
  german: "الألمانية",
  ukrainian: "الأوكرانية",
  hindi: "الهندية",
  spanish: "الإسبانية",
  french: "الفرنسية",
  italian: "الإيطالية",
  portuguese: "البرتغالية",
  portugueseBrazil: "البرتغالية (البرازيل)",
  russian: "الروسية",
  simplifiedChinese: "الصينية المبسطة",
  arabic: "العربية",
  japanese: "اليابانية",
  hungarian: "المجرية",
  czech: "التشيكية",
  polish: "البولندية",
  turkish: "التركية",
  swedish: "السويدية",
  urdu: "الأردية",
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
  replyGenerationAction: "توليد الرد",
  speechTranscriptionAction: "نسخ الكلام",
  speechSynthesisAction: "توليد الكلام",
  instructionsTabDescription:
    "قم بتشكيل التوجيه المخفي الذي يوجه المساعد قبل أن يطّلع أي مزوّد على الطلب.",
  providersTabDescription:
    "قم بتخزين بيانات اعتماد الخدمة الخارجية على الجهاز وقم بتكوين أوضاع الاستجابة التي تريد استخدامها.",
  webSearchTabDescription:
    "قم بتكوين سياق الويب المباشر الاختياري قبل الردود.",
  responseModes: "اختيار النموذج",
  aboutModelSelection: "حول اختيار النموذج",
  modelSelectionInfo:
    "تصبح كل بطاقة نموذج خيارًا على الشاشة الرئيسية. قم بتكوين المزوّد والنموذج ومستوى الجهد الاختياري، ثم بدّل البطاقات لاختيار النموذج الذي يجيب بعد ذلك.",
  responseModeItemTitle: ({ index }) => `النموذج ${index}`,
  addResponseMode: "إضافة نموذج",
  removeResponseMode: "إزالة النموذج",
  responseModesNoConfiguredProviders:
    "أضف بيانات الاعتماد أولاً. تظل عناصر التحكم في المسار مخفية حتى يتم تكوين خدمة متوافقة واحدة على الأقل.",
  useResponseMode: ({ mode }) => `استخدم ${mode}`,
  chooseResponseModel: "اختر نموذجًا",
  responseModelCount: ({ count }) => `${count} نماذج متوفرة`,
  ulraMode: "الوضع الفائق",
  ulraModeHomeLabel: "إظهار الوضع الفائق على الشاشة الرئيسية",
  ulraModeSettingsDescription:
    "يتيح التشاور بين عدة نماذج عندما يكون نموذجان على الأقل من نماذج الشاشة الرئيسية جاهزين.",
  ulraModeInfo:
    "يسأل الوضع الفائق أولاً كل نموذج جاهز على الشاشة الرئيسية بشكل مستقل. وفي كل جولة مراجعة، تتحدى النماذج أحدث موقف لكل مشارك، وتتوقف الجولات غير المستخدمة بعد تقارب صريح بالإجماع. ويجمع النموذج المحدد الإجابة النهائية من الجولات الناجحة، مع الاحتفاظ دائمًا بأحدث موقف لكل نموذج. تتم مشاركة محتوى التشاور مع جميع المزوّدين المشاركين.",
  ulraModeRounds: "جولات المراجعة",
  ulraModeCallEstimate: ({ count }) =>
    `حتى ${count} استدعاءً للنماذج لكل رسالة بالإعداد الحالي.`,
  ulraModeThresholdWarning:
    "قد يستغرق استخدام أكثر من 4 نماذج أو 3 جولات وقتًا طويلاً جدًا، ويستهلك رموزًا كثيرة، ويبلغ حدود السياق أو معدل الطلبات لدى المزوّدين. هذا تحذير فقط.",
  ulraModeFirstUseTitle: "هل تريد تفعيل الوضع الفائق؟",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `باستخدام ${models} نماذج وما يصل إلى ${rounds} جولات مراجعة، قد تنفذ الرسالة الواحدة حتى ${calls} استدعاءً للنماذج. قد تستغرق وقتًا أطول بكثير، وتكلف أكثر، وتشارك التشاور مع جميع المزوّدين المشاركين.`,
  ulraModeHighRiskTitle: "تشغيل كبير للوضع الفائق",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `قد تنفذ ${models} نماذج و${rounds} جولات مراجعة ما يصل إلى ${calls} استدعاءً للنماذج. قد يستغرق ذلك وقتًا طويلاً جدًا، ويستخدم رموزًا كثيرة، ويبلغ حدود المزوّدين. هل تريد المتابعة رغم ذلك؟`,
  ulraModeEnableAction: "تفعيل",
  ulraModeNeedsTwoModels:
    "يتطلب الوضع الفائق نموذجين جاهزين على الأقل في الشاشة الرئيسية.",
  ulraModeAllModelsFailed:
    "فشلت جميع نماذج الوضع الفائق قبل أن يمكن توليف رد.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `فشل ${failed} من استدعاءات النماذج الداخلية؛ استخدم الرد النهائي ${succeeded} مساهمات ناجحة.`,
  sttTabDescription:
    "التحكم في كيفية التقاط الكلام وأي واجهة خلفية تحول الصوت إلى نص قبل أن يصل إلى النموذج.",
  ttsTabDescription:
    "التحكم عندما تبدأ الردود في التحدث وأي واجهة خلفية تتعامل مع الإخراج المنطوق.",
  brief: "مختصر",
  briefDescription:
    "اجعل الإجابة محكمة. استخدم أقل عدد من الجمل اللازم للإجابة الكاملة على المستخدم.",
  normal: "طبيعي",
  normalDescription:
    "استهدف طولًا متوازنًا للرد. غطِّ النقاط المهمة دون إطالة الإجابة.",
  thorough: "شامل",
  thoroughDescription:
    "تعمق وكن شاملاً. قم بتضمين الفروق الدقيقة والتفاصيل والمقايضات والمنطق الذي يهم.",
  professional: "احترافي",
  professionalDescription:
    "تحدث كمستشار كبير يطلع العميل. لغة دقيقة، خالية من العامية، ومدروسة وموثوقة.",
  casual: "غير رسمي",
  casualDescription:
    "تحدث كصديق ذكي في المقهى: بأسلوب مريح وطبيعي وعفوي. لا بأس بالعبارات العامية المختصرة ولا بالاستطرادات.",
  nerdy: "مهووس بالمعرفة",
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
    "اشرح كل شيء بأبسط صورة ممكنة. استخدم التشبيهات واللغة اليومية دون أي مصطلحات متخصصة، ولا تفترض أي معرفة مسبقة بأي موضوع.",
  useProvider: ({ provider }) => `استخدم ${provider}`,
  createApiKey: "بيانات الاعتماد",
  apiKey: "مفتاح API",
  aboutThisProvider: "حول هذا المزوّد",
  openRouterOnboardingTitle: "مفتاح واحد، ومزوّدون متعددون",
  openRouterOnboardingDescription:
    "أنشئ مفتاح OpenRouter مخصصًا، والصقه أدناه، واستخدم نماذج اللقطات الثابتة من عدة مزوّدين دون استبدال أي اتصال مباشر.",
  openRouterOnboardingRoute:
    "مسار الطلب: هذا الجهاز → OpenRouter → المزوّد الأصلي المحدد",
  openRouterKeys: "مفاتيح OpenRouter",
  providerStatusInvalid: "غير صالح",
  providerStatusTesting: "اختبار",
  providerStatusConfigured: "تم تكوينه",
  providerStatusWorking: "يعمل",
  providerStatusNotTested: "لم يتم اختباره",
  providerStatusNotSetup: "لم يتم إعداده",
  expandProvider: ({ provider }) => `قم بتوسيع ${provider}`,
  collapseProvider: ({ provider }) => `طي ${provider}`,
  testProviderKey: "اختبار المفتاح",
  testAllCapabilities: "اختبار الكل",
  apiTest: "اختبار API",
  testProviderCapability: ({ capability }) => `اختبار ${capability}`,
  test: "اختبار",
  optional: "خياري",
  providerCapability_llm: "الردود",
  providerCapability_stt: "إدخال الكلام",
  providerCapability_tts: "إخراج الصوت",
  providerCapability_search: "البحث على شبكة الإنترنت",
  providerCapability_voices: "مكتبة صوتية",
  providerValidationUnavailable:
    "التحقق المباشر غير متوفر لهذا المزوّد بعد. احفظ المفتاح هنا وتحقق منه أثناء الاستخدام الفعلي.",
  providerNeedsAttention: "يحتاج إلى الاهتمام",
  catalogProviderLimitsSummary: ({ summary }) => `الحدود: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `المنطقة: ${summary}`,
  validatingKey: "جارٍ التحقق...",
  showKey: "إظهار المفتاح",
  hideKey: "إخفاء المفتاح",
  assistantInstructions: "تعليمات المساعد",
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
    "أضف تعليمات تأتي بعد موجّه النظام العام لهذه المحادثة.",
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
  stopDriveSession: "إيقاف مؤقت للوضع التلقائي",
  repeatDriveReply: "كرر الأخير",
  continueDriveSession: "استئناف الوضع التلقائي",
  driveSendsIn: ({ seconds }) => `الإرسال بعد ${seconds}…`,
  speechToText: "الكلام إلى النص",
  appNative: "تعرّف النظام على الكلام",
  nativeSttDescription:
    "استخدم أداة التعرف على الكلام الخاصة بنظام التشغيل.",
  provider: "مزوّد",
  webSearchProvider: "مزوّد بحث الويب",
  webSearchProviderMissingHint:
    "قم بتكوين خدمة واحدة على الأقل قادرة على البحث في بيانات الاعتماد لتمكين الاستناد إلى الويب هنا.",
  webSearchModelHint: ({ model }) =>
    `يستخدم ${model} خلف الكواليس للاستناد المباشر إلى الويب.`,
  webSearchHomeHint:
    "استخدم مفتاح تبديل الشاشة الرئيسية لتشغيل الاستناد إلى الويب أو إيقافه لهذا الموضوع.",
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
  webSearchNobodyDescription:
    "لا طلبات ويب. يجيب مما يعرفه النموذج.",
  webSearchQualityControls: "جودة البحث",
  webSearchSearchMode: "وضع البحث",
  webSearchSearchModeQuick: "سريع",
  webSearchSearchModeBalanced: "متوازن",
  webSearchSearchModeDeep: "عميق",
  webSearchDepth: "عمق البحث",
  webSearchDepthStandard: "قياسي",
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
  sttProvider: "مزوّد STT",
  sttProviderEnabledHint:
    "يظهر هنا فقط المزوّدون المفعّلون الذين يدعمون النسخ.",
  sttProviderMissingHint:
    "أضف بيانات اعتماد لخدمة تدعم STT لاختيارها هنا.",
  nativeSttHint:
    "يعمل تعرّف النظام على الكلام بشكل مستقل عن مفاتيح المزوّدين لديك، وقد تتم معالجته على الجهاز أو عن طريق خدمة الكلام الخاصة بنظام التشغيل.",
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
    "استخدم صوتًا عصبيًا أكثر طبيعية تمامًا على هذا الجهاز. يتم تركيب نص الرد المنطوق محليًا، بدون مفتاح مزوّد كلام أو رسوم استخدام.",
  kokoroVoices: "أصوات Kokoro على الجهاز",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `يتم تنزيل النموذج متعدد اللغات بحوالي ${size} ميغابايت ويشغل حوالي ${installedSize} ميغابايت بعد التثبيت.`,
  kokoroModel: "نموذج Kokoro متعدد اللغات",
  kokoroChecking: "جارٍ التحقق من النموذج الموجود على الجهاز…",
  kokoroDownloading: ({ progress }) => `جاري التحميل…${progress}%`,
  kokoroExtracting: ({ progress }) => `جارٍ التثبيت… ${progress}%`,
  kokoroVerifying: "جارٍ التحقق من المحرك الصوتي...",
  kokoroInstalled: "مثبت وجاهز على هذا الجهاز.",
  kokoroNotInstalled:
    "قم بتنزيل النموذج والتحقق منه قبل اختيار Kokoro أو استخدامه. لا حاجة إلى مفتاح مزوّد.",
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
  remove: "إزالة",
  voiceOutputDescription:
    "اختر محرك الكلام ولغات الاستماع والمعاينات الصوتية للردود المنطوقة.",
  localTts: "محلي",
  localTtsDescription:
    "استخدم صوتًا محليًا مطابقًا تم تنزيله للردود المنطوقة.",
  providerTtsDescription:
    "استخدم الخدمة المحددة التي تم تكوينها للردود المنطوقة.",
  ttsFallbackRoutes: "الطرق الاحتياطية",
  ttsFallbackRoutesHint:
    "خياري. قم بإضافة المسارات التي تريدها فقط، بالترتيب الذي يجب تجربتها به. بمجرد أن يبدأ المسار في التحدث، يظل Mr Broccoli عليه لبقية الرد.",
  ttsFallbackNone:
    "لم يتم تكوين أي احتياطي. سيتم عرض فشل صوتي بدلاً من ذلك.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `إضافة احتياطي ${route}`,
  removeFallbackRoute: ({ route }) => `إزالة ${route} الاحتياطية`,
  moveFallbackEarlier: ({ route }) => `انقل ${route} إلى موضع أبكر`,
  moveFallbackLater: ({ route }) => `انقل ${route} إلى موضع لاحق`,
  ttsProvider: "مزوّد TTS",
  ttsProviderEnabledHint:
    "يظهر هنا فقط المزوّدون المفعّلون الذين يدعمون الرد المنطوق.",
  ttsProviderMissingHint:
    "أضف بيانات اعتماد لخدمة تدعم TTS لاختيارها هنا.",
  localTtsOrderHint:
    "تتم محاولة المسارات الاحتياطية التي تم تكوينها بشكل صريح فقط.",
  providerTtsOrderHint:
    "تتم محاولة المسارات الاحتياطية التي تم تكوينها بشكل صريح فقط.",
  nativeTtsHint:
    "يستخدم TTS الأصلي المكدس الصوتي للنظام ولا يتطلب مفتاح مزوّد.",
  localTtsLanguageCoverageHint:
    "تغطي الحزم المحلية حاليًا اللغة الإنجليزية والألمانية والصينية المبسطة والإسبانية والبرتغالية والهندية والفرنسية والإيطالية.",
  ttsVoice: "صوت TTS",
  refresh: "تحديث",
  providerVoiceDirectory: ({ provider }) => `مكتبة أصوات ${provider}`,
  refreshProviderVoices: ({ provider }) => `تحديث أصوات ${provider}`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} ${Number(count) === 1 ? "صوت" : "أصوات"} متاح من ${provider}.`,
  providerVoicesLoadFailed:
    "لا يمكن تحديث الأصوات. اختيارك الحالي لم يتغير؛ لا يزال بإمكانك إدخال معرف صوتي يدويًا.",
  providerVoicesLoadFailedWithFallback:
    "لا يمكن تحميل أصوات الحساب. يظل الصوت المدمج متاحًا.",
  providerVoicesErrorDetail: ({ detail }) => `السبب: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "في ElevenLabs، قم بتحرير مفتاح API هذا وفعّل الأصوات ← قراءة، ثم قم بالتحديث هنا.",
  providerVoicesLoadingHint: ({ provider }) =>
    `يقوم Mr Broccoli بتحميل الأصوات المتاحة تلقائيًا من ${provider}.`,
  providerVoiceId: "معرّف الصوت",
  providerVoiceIdPlaceholder: "أدخل معرفًا صوتيًا",
  providerVoiceIdFallbackHint:
    "يظل الإدخال اليدوي متاحًا عندما لا يمكن تحميل مكتبة الأصوات.",
  providerVoiceIdRequired: ({ provider }) =>
    `قم بتحديث مكتبة أصوات ${provider} أو أدخل معرّف صوت قبل استخدام إخراج الكلام.`,
  qwenSpeechUnavailableInUs:
    "مسارات كلام Qwen الحالية في Mr Broccoli غير متوفرة في منطقة الولايات المتحدة. اختر سنغافورة أو بكين لكلام Qwen.",
  qwenApiRegion: "منطقة Qwen API",
  qwenRegionSingapore: "سنغافورة",
  qwenRegionUs: "الولايات المتحدة (فرجينيا)",
  qwenRegionBeijing: "الصين (بكين)",
  qwenRegionHint:
    "يجب أن تتطابق المنطقة المحددة مع المنطقة التي تم إنشاء مفتاح API فيها.",
  qwenRegionUsSpeechHint:
    "تدعم مفاتيح منطقة الولايات المتحدة الدردشة وبحث الويب هنا. تتطلب مسارات Qwen STT وTTS الحالية في Mr Broccoli مفتاح سنغافورة أو بكين.",
  providerDefaultVoiceHint:
    "يستخدم هذا المزوّد حاليًا صوته الافتراضي للمعاينة والردود المنطوقة.",
  listenLanguages: "لغات الاستماع",
  listenLanguagesHint:
    "اختر لغات الرد التي تريدها أن تبدو جيدة. يقوم Mr Broccoli بتجربتها بهذا الترتيب عند توجيه إخراج الكلام.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "تم اختيار لغة واحدة" : `تم تحديد ${count} لغات`,
  localVoicePacks: "حزم الصوت المحلية",
  localVoicePacksHint:
    "تحتفظ كل لغة بصوتها المحلي الخاص. اختر الصوت الذي تريده لتلك اللغة، ثم قم بتنزيل الحزم التي تهمك فقط.",
  localVoiceForLanguage: ({ languageLabel }) => `صوت لـ ${languageLabel}`,
  providerVoicePreviews: "معاينات أصوات المزوّدين",
  providerVoicePreviewsHint:
    "اختبر مسار TTS المحدد حاليًا هنا مع نص معاينة منفصل لكل لغة رد.",
  nativeVoicePreviewSection: "معاينة الصوت الأصلي",
  nativeVoicePreviewSectionHint:
    "يتحدث هذا مباشرة من خلال مُركِّب الكلام المدمج في الهاتف حتى تتمكن من مقارنته بأصوات المزوّدين التي تم تكوينها.",
  nativeVoiceUnavailable:
    "لم يُبلغ هذا الجهاز عن أي أصوات للنظام الأصلي للمعاينة.",
  runtimeCompatibilityOverrides: "توافق وقت التشغيل",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `تم تعطيل ${count} من تكوينات النماذج أو الإعدادات التي أكد المزوّد عدم توفرها على هذا الجهاز فقط. يتجاوزها Mr Broccoli تلقائيًا.`,
  clearRuntimeCompatibilityOverrides: "مسح توافق وقت التشغيل",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "هل تريد مسح توافق وقت التشغيل؟",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "يمكن تجربة التكوينات المعطلة سابقًا من جديد. قد يرفضها المزوّد مرة أخرى.",
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
    `المطلوب: ${requested} ← الفعلي: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `المرحلة الأخيرة: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `اللغة: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `المزوّد: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `الصوت: ${voice}`,
  localTtsPackReady: "تم تثبيته على هذا الجهاز",
  localTtsPackBroken:
    "تم التنزيل، لكن هذا الصوت فشل في التحقق المحلي على هذا الجهاز. أعد تنزيله أو اختر صوتًا آخر.",
  localTtsPackMissing:
    "لم يتم تثبيته بعد. سيتم استخدام Cloud TTS أو صوت النظام حتى تقوم بتنزيله.",
  localTtsUnsupportedLanguageFallback:
    "الحزمة المحلية غير متوفرة بعد لهذه اللغة. سيتولى TTS السحابي أو صوت النظام التعامل معها.",
  downloadingLocalTtsPack: ({ progress }) =>
    `جارٍ تنزيل الحزمة المحلية... ${progress}%`,
  download: "تنزيل",
  downloadingShort: "جارٍ التحميل...",
  voicePreviewText: "نص معاينة الصوت",
  voicePreviewPlaceholder: "اكتب عبارة لسماع هذا الصوت.",
  voicePreviewHint:
    "يستخدم الواجهة الصوتية للرد المحددة حاليًا دون إرسال أي شيء إلى نموذج اللغة.",
  previewVoice: "معاينة الصوت",
  generatingPreview: "جارٍ إنشاء المعاينة...",
  playingPreview: "جارٍ تشغيل المعاينة...",
  systemVoice: "صوت النظام",
  spokenRepliesOff: "النص فقط",
  noTtsProvider: "لا يوجد مزوّد TTS",
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
    `بالنسبة إلى ${provider}، أدخل عنوان URL الأساسي للمزوّد ومفتاح API كـ https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "التعرف على الكلام غير متوفر على هذا الجهاز.",
  debugLogLabel: "سجل",
  debugLogCaptureStarted: "بدأ تسجيل التصحيح.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `تم حفظ سجل التصحيح باسم ${fileName} ونسخه إلى الحافظة (${entryCount} إدخالات).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `تم حفظ سجل التصحيح باسم ${fileName} (${entryCount} إدخالات).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `تم استرداد سجل التصحيح السابق ${fileName} ونسخه إلى الحافظة (${entryCount} إدخالات).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `تم استرداد سجل التصحيح السابق ${fileName} (${entryCount} إدخالات).`,
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
  clear: "مسح",
  voiceOutput: "إخراج الصوت",
  speechReplayCache: "ذاكرة إعادة تشغيل الكلام",
  speechReplayCacheDescription:
    "يظل الكلام الذي ينشئه المزوّد على هذا الجهاز لمدة تصل إلى 14 يومًا، لذلك لا تستهلك إعادة الرد رصيدًا صوتيًا مرة أخرى.",
  clearSpeechReplayCache: "مسح ذاكرة الكلام",
  speechReplayCacheCleared: "تم حذف ملفات الكلام المخزنة.",
  speechReplayCacheClearFailed: "تعذر مسح ذاكرة الكلام.",
  currentSetup: "الإعداد الحالي",
  listeningToYourVoice: "الاستماع إلى صوتك",
  parsingYourVoiceInput: "تحويل صوتك إلى نص",
  preparingRequest: "جارٍ تحضير طلبك",
  searchingTheWeb: "البحث في الويب عن سياق جديد",
  waitingForProvider: ({ provider }) => `في انتظار ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `تحضير الصوت عبر ${provider}`,
  deepThinkingReassurance: "الإجابات الجيدة تستغرق لحظة...",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "جارٍ الرد عليك صوتيًا",
  freshSession: "جلسة جديدة",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "رسالة واحدة" : `${count} رسائل`,
  speechInputRoute: ({ route }) => `إدخال الكلام: ${route}`,
  replyModelRoute: ({ route }) => `نموذج الرد: ${route}`,
  voiceOutputRoute: ({ route }) => `إخراج الصوت: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `الصوت الاحتياطي: ${route}`,
  conversation: "محادثة",
  conversationActions: "إجراءات المحادثة",
  statusDetails: "تفاصيل الحالة",
  persistenceFailure:
    "تعذر على Mr Broccoli حفظ البيانات على هذا الجهاز. أبقِ التطبيق مفتوحًا وحاول مرة أخرى؛ قد يتم فقدان التغييرات الأخيرة بعد إعادة التشغيل.",
  show: "عرض",
  showTranscript: "إظهار النص",
  hide: "إخفاء",
  copyThread: "نسخ الموضوع",
  shareThread: "مشاركة الموضوع",
  reportResponse: "الإبلاغ عن هذا الرد",
  reportResponseIntro: "بلاغ عن رد ذكاء اصطناعي من Mr Broccoli. راجع المحتوى أدناه، وصِف المشكلة، ثم أرسل هذا البلاغ إلى المطوّر.",
  repeatReply: "كرر الرد",
  renameThread: "إعادة تسمية الموضوع",
  renameThreadHint:
    "أعط هذه المحادثة عنوانًا يمكنك العثور عليه سريعًا لاحقًا.",
  threadTitle: "عنوان الموضوع",
  noTranscriptYet: "لا يوجد نص بعد",
  previewTranscriptEmptyDescription:
    "استخدم الصوت أو النص للبدء. ستظهر محادثتك هنا.",
  noConversationYet: "لا توجد محادثة بعد",
  expandedTranscriptEmptyDescription:
    "استخدم الصوت أو النص للبدء. أغلق هذه الشاشة عندما تريد العودة إلى الشاشة الرئيسية.",
  transcriptSelectionHint:
    "حدد أي نص رسالة مباشرة، أو قم بمشاركة ونسخ الرسائل الفردية أدناه.",
  textMessagePlaceholder: "اكتب رسالة",
  sendTextMessage: "أرسل رسالة",
  showVoiceInput: "إظهار الإدخال الصوتي",
  showTextInput: "إظهار إدخال النص",
  usageStatsHiddenDescription:
    "أبقِ تقديرات الرموز المميزة خارج واجهة نص المحادثة.",
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
    `${replies} ردود · ${summaries} تحديثات للذاكرة`,
  estimatedUsageConversationScope:
    "تتضمن الإجماليات كل مسار ونموذج مستخدم داخل هذه المحادثة.",
  estimatedPromptTokens: ({ count }) => `الموجّه: ${count}`,
  estimatedReplyTokens: ({ count }) => `الرد: ${count}`,
  estimatedTotalTokens: ({ count }) => `الإجمالي: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `تقديري: ${prompt} إدخال · ${completion} إخراج · ${total} الإجمالي`,
  searchQuery: "استعلام البحث",
  expandWebSearchDetails: "عرض تفاصيل بحث الويب",
  collapseWebSearchDetails: "إخفاء تفاصيل بحث الويب",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "مصدر" : "مصادر"}`,
  sources: "مصادر",
  openSourceLink: ({ source }) => `فتح المصدر: ${source}`,
  turnReceipt: "تفاصيل الدور",
  expandTurnReceipt: "إظهار تفاصيل الدور",
  collapseTurnReceipt: "إخفاء تفاصيل الدور",
  turnReceiptDirect: "مباشر",
  turnReceiptRequested: "مسار الرد المطلوب",
  turnReceiptActual: "مسار الرد الفعلي",
  turnReceiptEffort: "التحكم في الاستدلال",
  turnReceiptProviderNative: "أصلي لدى المزوّد",
  turnReceiptInput: "مسار الإدخال",
  turnReceiptSearch: "البحث على شبكة الإنترنت",
  turnReceiptVoice: "إخراج الصوت",
  turnReceiptContext: "سياق",
  turnReceiptTiming: "توقيت",
  turnReceiptFallback: "سبب اللجوء إلى الاحتياطي",
  turnReceiptVoiceInput: "صوت",
  turnReceiptTypedInput: "مكتوب",
  turnReceiptSystemSpeech: "تعرّف النظام على الكلام",
  turnReceiptSystemVoice: "صوت النظام",
  turnReceiptSystemVoiceFallback: "صوت النظام · احتياطي",
  turnReceiptOff: "متوقف",
  turnReceiptNotConfigured: "مفعّل · غير مكوّن",
  turnReceiptFallbackWithoutSearch: "تمت المتابعة دون البحث المباشر",
  turnReceiptNotUsed: "غير مستخدم",
  turnReceiptSummaryReused: "إعادة استخدام الملخص المحفوظ",
  turnReceiptSummaryUpdated: "تم تحديث الملخص",
  turnReceiptContextFallback: "احتياطي الرسالة الأخيرة",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `ضغطت البوابة ${original} إلى ${compressed} رسائل`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `تم إرسال ${sent}/${total} من الرسائل السابقة · تم تلخيص ${summarized} حديثًا${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "سياق",
  turnReceiptTimingSearch: "البحث",
  turnReceiptTimingModel: "نموذج",
  turnReceiptTimingFirstSpeech: "الكلام الأول",
  turnReceiptTimingTotal: "المجموع",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} رمزًا مميزًا`,
  unknownUsageRoute: "مسار غير معروف",
  setupGuideConnectProviderTitle: "تكوين بيانات الاعتماد",
  setupGuideConnectProviderDescription:
    "أضف بيانات الاعتماد في الإعدادات، ثم اختر المسارات التي تريد استخدامها.",
  idle: "خامل",
  yourConversationAppearsHere: "تظهر محادثتك هنا",
  defaultTranscriptEmptyDescription:
    "استخدم الصوت أو النص للبدء. سيحتفظ Mr Broccoli بالموضوع ويرد هنا.",
  delete: "حذف",
  deleteConversationConfirmationTitle: ({ title }) => `هل تريد حذف "${title}"؟`,
  deleteConversationConfirmationMessage:
    "يؤدي هذا إلى حذف المحادثة وجميع رسائلها نهائيًا. لا يمكن التراجع عن هذا الإجراء.",
  memory: "ذاكرة",
  conversations: "المحادثات",
  drawerSubtitle: "انتقل بين المواضيع الحية أو ابدأ غرفة جديدة.",
  newSession: "جلسة جديدة",
  noSavedConversationsYet: "لا توجد محادثات محفوظة حتى الآن",
  drawerEmptyDescription:
    "ابدأ التحدث من العرض الرئيسي وسيقوم Mr Broccoli بإنشاء جلسة تلقائيًا.",
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
  setupGuideIntroTitle: "كيف يعمل Mr Broccoli",
  setupGuideIntroBody:
    "يبدأ Mr Broccoli فارغًا. أضف بيانات اعتماد للخدمات الخارجية التي تستخدمها بالفعل، ثم اختر كيفية توجيه الردود وإدخال الكلام والمخرجات المنطوقة وسياق الويب الاختياري.",
  setupGuideIntroNote:
    "بعد الإعداد، استخدم التحكم الصوتي الرئيسي لبدء المحادثة وإيقافها. يظل النص الحالي متاحًا على الشاشة الرئيسية، ويمكن تغيير كل مسار لاحقًا في الإعدادات.",
  setupGuideProviderTitle: "إضافة بيانات الاعتماد",
  setupGuideProviderBody:
    "اختر الخدمة الخارجية التي تريد تكوينها، ثم الصق بيانات الاعتماد مع إمكانية الوصول للرد.",
  setupGuideProviderPickerLabel: "خدمة الرد",
  setupGuideSelectProvider: "حدد مزوّدًا",
  setupGuideSelectProviderFirst: "حدد مزوّدًا أولاً.",
  setupGuideApiKeyLabel: "مفتاح API",
  setupGuideApiKeyPlaceholder: "لصق بيانات الاعتماد",
  setupGuideContinue: "متابعة",
  setupGuideOpenSettings: "افتح الإعدادات",
  setupGuideBack: "رجوع",
  setupGuideValidateKey: "التحقق من صحة المفتاح",
  setupGuideApiKeyRequiredOrCancel:
    "أضف مفتاح API للمتابعة أو قم بإلغاء دليل الإعداد.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "اختر مزوّدًا وأضف مفتاح API للمتابعة أو قم بإلغاء دليل الإعداد.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `لا تسمح بيانات اعتماد ${provider} هذه بطلبات الرد.`,
  setupGuideKokoroTitle: "أضف صوتًا طبيعيًا على الجهاز",
  setupGuideKokoroBody: ({ size }) =>
    `اختياري: قم بتنزيل Kokoro (حوالي ${size} ميغابايت) للحصول على ردود منطوقة أكثر طبيعية بدون مزوّد كلام أو رسوم استخدام.`,
  setupGuideKokoroLanguageNote:
    "يتحدث هذا النموذج حاليًا اللغة الإنجليزية والصينية المبسطة. قم بتكوين أي مسارات احتياطية تريدها لاحقًا في إعدادات التحدث.",
  setupGuideKokoroDownload: "تنزيل Kokoro",
  setupGuideUseKokoro: "استخدم Kokoro للردود المنطوقة",
  setupGuideUseKokoroSummary:
    "احتفظ بالتوليف على الهاتف عندما تكون لغة الرد مدعومة.",
  setupGuideSkipKokoro: "تخطي الآن",
  setupGuideVoiceTestTitle: "اختبار الإعداد الخاص بك",
  setupGuideVoiceTestBody:
    "قل جملة قصيرة. سيختبر Mr Broccoli الوصول إلى الميكروفون والنسخ ومسار الرد الذي تم تكوينه والإخراج المنطوق عند توفر مسار صوتي مقبول.",
  setupGuideVoiceTestNoInputBody:
    "الإدخال الصوتي غير متاح مع هذا الإعداد. استمر في مراجعة المسارات المكتشفة، ثم اضبط إعدادات الكلام لاحقًا إذا لزم الأمر.",
  setupGuideVoiceTestTextOnlyNote:
    "يظل هذا الاختبار نصيًا فقط لأنه لا يوجد مسار صوتي منطوق مقبول جاهز حتى الآن.",
  setupGuideVoiceTestStart: "ابدأ الاختبار",
  setupGuideVoiceTestStop: "توقف عن التسجيل",
  setupGuideVoiceTestRetry: "تشغيل مرة أخرى",
  setupGuideVoiceTestTranscribing: "جارٍ النسخ…",
  setupGuideVoiceTestThinking: "جارٍ اختبار الرد…",
  setupGuideVoiceTestSynthesizing: "جارٍ تحضير الصوت…",
  setupGuideVoiceTestSpeaking: "جارٍ تشغيل الرد...",
  setupGuideVoiceTestTranscript: "نص",
  setupGuideVoiceTestReply: "رد",
  setupGuideVoiceTestReset: "مسح هذه النتيجة",
  setupGuideVoiceInputUnavailable:
    "الإدخال الصوتي غير متاح لهذا الإعداد على هذا الجهاز.",
  setupGuideSummaryTitle: "اكتمل الإعداد",
  setupGuideSummaryBody:
    "هذا هو المسار الذي سيستخدمه Mr Broccoli مع التكوين الحالي الخاص بك.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "الكلام إلى النص",
  setupGuideSummaryTts: "تحويل النص إلى كلام",
  setupGuideSummaryWebSearch: "البحث على شبكة الإنترنت",
  setupGuideRouteProviderLlm: ({ provider }) => `تم التمكين عبر ${provider}`,
  setupGuideRouteOnDeviceStt: "تم التمكين عبر تعرّف النظام على الكلام",
  setupGuideRouteProviderStt: ({ provider }) =>
    `تم التمكين عبر نسخ الكلام لدى ${provider}`,
  setupGuideRouteProviderTts: ({ provider }) => `تم التمكين عبر صوت ${provider}`,
  setupGuideRouteKokoroTts: "تم التمكين عبر صوت Kokoro على الجهاز",
  setupGuideRouteLocalTts: "تم تمكينه عبر حزمة الصوت المحلية",
  setupGuideRouteUnavailable: "غير متوفر",
  setupGuideRouteOff: "متوقف",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `متاح عبر ${provider}، متوقف حاليًا`,
  setupGuideSummaryTextOnlyNote:
    "الردود المنطوقة متوقفة حاليًا. تظل الردود في شكل نص حتى تقوم بتمكين مزوّد أو صوت محلي.",
  setupGuideFinish: "تم",
  searchConversationsPlaceholder: "البحث في العناوين والنماذج ونص الرسالة",
  noMatchingConversations: "لا توجد محادثات مطابقة",
  noMatchingConversationsDescription:
    "جرّب عنوانًا أو مسارًا أو نموذجًا أو عبارة مختلفة من النص.",
  memoryModalTitle: "ذاكرة المحادثة",
  memoryModalDescription:
    "هذا هو الملخص المضغوط الذي يحمله Mr Broccoli معه بمجرد أن يصبح الموضوع طويلًا بما يكفي لضغط الأدوار القديمة.",
  memorySummary: "الملخص المحفوظ",
  memorySummaryEmpty:
    "لا توجد ذاكرة مضغوطة حتى الآن. بمجرد أن يصبح هذا الموضوع أطول، سيتم تلخيص الأدوار القديمة هنا.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "دور واحد ملخّص" : `${count} أدوار ملخّصة`,
  copyMemory: "نسخ الذاكرة",
  forgetMemory: "نسيان الذاكرة",
  memoryCopied: "تم نسخ الذاكرة.",
  memoryCleared: "تم مسح ذاكرة المحادثة.",
  noConversationToManageYet: "لا توجد ذاكرة محادثة متاحة بعد.",
  noProviderYet: "لا يوجد مزوّد حتى الآن",
  noModelYet: "لا يوجد نموذج بعد",
  startedAt: "بدأت",
  endedAt: "انتهت",
  pinned: "مثبت",
  copy: "نسخ",
  share: "مشاركة",
  rename: "إعادة تسمية",
  pin: "تثبيت",
  unpin: "إزالة التثبيت",
  save: "حفظ",
  cancel: "إلغاء",
  stop: "إيقاف",
  pause: "إيقاف مؤقت",
  resume: "استئناف",
  paused: "متوقف مؤقتًا",
  listening: "الاستماع",
  parsing: "النسخ",
  searching: "البحث",
  converting: "تحويل",
  webSearchAction: "البحث على شبكة الإنترنت",
  thinking: "التفكير",
  speaking: "التحدث",
  pleaseWait: "انتظر من فضلك",
  yourTurn: "دورك",
  keepPressing: "استمر في الضغط",
  tapWhenDone: "اضغط عند الانتهاء",
  speechPaused: "تم إيقاف الكلام مؤقتًا",
  pausePlaybackUnavailable:
    "لا يمكن إيقاف هذا المسار الصوتي مؤقتًا. أوقفه أو قم بالتبديل إلى الإخراج الصوتي للمزوّد.",
  holdToSpeak: "اضغط مطولًا للتحدث",
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
  providerValidationFailed: "فشل التحقق من صحة المزوّد.",
  webSearchFallback:
    "لم يكن بحث الويب متاحًا، لذلك استمر الرد بدون سياق الويب المباشر.",
  noBase64EncoderAvailable: "لا يتوفر برنامج ترميز base64.",
  noBase64DecoderAvailable: "لا يوجد وحدة فك ترميز Base64 متاحة.",
  azureSpeechApiKeyFormat:
    "يحتاج Microsoft Azure TTS إلى بيانات اعتماد Azure Speech بتنسيق <key>|<region>، على سبيل المثال abc123|westeurope، أو تنسيق Azure المدمج <endpoint>|<api-key>|<key>|<region>.",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "لا يقوم TTS الأصلي بتوليف ملفات صوتية.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `لا يوجد مسار صوتي محلي أو سحابي جاهز لـ ${languageLabel}.`,
  chooseTextToSpeechProviderInSettings:
    "اختر مزوّد خدمة تحويل النص إلى كلام في الإعدادات.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS غير مدعوم حتى الآن.`,
  ttsError: ({ provider, status, errorText }) =>
    `خطأ ${provider} TTS (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `رفض إخراج الكلام ${provider} الرد لأنه كان طويلًا جدًا.`,
  ttsTimeout: ({ provider }) => `استغرق إخراج الكلام ${provider} وقتًا طويلاً.`,
  sttTimeout: ({ provider }) =>
    `استغرق نسخ الكلام ${provider} وقتًا طويلاً.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} يقبل فقط التسجيلات التي تصل إلى ${limit}. استخدم مقطعًا أقصر أو بدّل نماذج STT.`,
  voiceInputCaptureIncomplete:
    "لا يمكن التقاط الإدخال الصوتي بشكل واضح. يرجى المحاولة مرة أخرى.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS لم يُرجع الصوت.`,
  nativeSttHandledInApp: "يتم التعامل مع نظام STT مباشرة في التطبيق.",
  chooseSpeechToTextProviderInSettings:
    "اختر مزوّد خدمة تحويل الكلام إلى نص في الإعدادات.",
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
