import type { TranslationDictionary } from "../types";
import { dataBackupTranslations } from "../dataBackupTranslations";
import { conversationKnowledgeTranslations } from "../conversationKnowledgeTranslations";
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

export const ur = {
  ...conversationArtifactTranslations.ur,
  ...interruptionTranslations.ur,
  ...ulraAuditTranslations.ur,
  ...dataBackupTranslations.ur,
  ...conversationKnowledgeTranslations.ur,
  ...imagePromptTranslations.ur,
  ...memoryEditTranslations.ur,
  ...onDeviceTranslations.ur,
  ...onboardingTranslations.ur,
  ...introTranslations.ur,
  ...premiumTranslations.ur,
  ...transcriptEditTranslations.ur,
  ...workspaceTranslations.ur,
  ...autoSetupTranslations.ur,
  appName: "مسٹر بروکلی",
  retry: "دوبارہ کوشش کریں۔",
  dismiss: "بند کریں",
  done: "مکمل",
  aboutSetting: ({ setting }) => `${setting} کے بارے میں`,
  unavailable: "دستیاب نہیں۔",
  selection: "انتخاب",
  chooseCompatibleProviderFirst: "پہلے ایک ہم آہنگ فراہم کنندہ کا انتخاب کریں۔",
  settings: "ترتیبات",
  settingsReleaseVersion: ({ version }) => `ورژن ${version}`,
  all: "تمام",
  firstRun: "پہلا رن",
  instructions: "ہدایات",
  providers: "فراہم کرنے والے",
  webSearch: "ویب تلاش",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "رن ٹائم تیاری",
  settingsReadinessThink: "سوچنا",
  settingsReadinessListen: "سننا",
  settingsReadinessSpeak: "بولنا",
  settingsReadinessSearch: "تلاش کریں۔",
  settingsReadinessReady: "تیار",
  settingsReadinessNeedsAttention: "توجہ",
  settingsReadinessBroken: "مسئلہ",
  settingsReadinessOff: "آف",
  settingsConnections: "کنکشنز",
  settingsThinking: "سوچنا",
  settingsListening: "سننا",
  settingsSpeaking: "بولنا",
  settingsSearch: "تلاش کریں۔",
  settingsAppDiagnostics: "ایپ اور تشخیص",
  settingsGuidedSetup: "گائیڈڈ سیٹ اپ",
  settingsGuidedSetupSummary:
    "کنکشن کا جائزہ لیں اور آواز کے مکمل راستے کی جانچ کریں۔",
  setupGuideShowInSettings: "سیٹنگز میں گائیڈڈ سیٹ اپ دکھائیں۔",
  setupGuideShowInSettingsSummary:
    "سیٹنگز کے جائزہ پر گائیڈڈ سیٹ اپ شارٹ کٹ دکھائیں یا چھپائیں۔",
  settingsConnectionsSummary: "فراہم کنندہ کی کلیدیں، توثیق، اور صلاحیتیں۔",
  settingsThinkingSummary: "ہوم کارڈز، ماڈلز، کوشش، اور سسٹم پرامپٹ۔",
  settingsListeningSummary: "ان پٹ موڈ اور اسپیچ ٹو ٹیکسٹ روٹنگ۔",
  settingsSpeakingSummary: "بولے گئے جوابات، پلے بیک، آوازیں، اور پیش نظارہ۔",
  settingsSearchSummary: "ویب تلاش فراہم کنندہ اور تلاش کے معیار کے کنٹرول۔",
  settingsAppDiagnosticsSummary:
    "تھیم، زبان، استعمال، ڈیبگ لاگز، اور حالیہ سرگرمی۔",
  settingsBackToOverview: "جائزہ پر واپس جائیں۔",
  settingsOpenSection: ({ section }) => `${section} کھولیں۔`,
  theme: "تھیم",
  language: "زبان",
  recognitionLanguage: "پہچان کی زبان",
  recognitionLanguageHint:
    "شناخت کو بہتر بنانے کے لیے زبان کا انتخاب کریں، یا اسے آلہ یا فراہم کنندہ کا پتہ لگانے کے لیے خودکار چھوڑ دیں۔",
  automaticLanguage: "خودکار",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} اس تقریر کے راستے کے لیے باضابطہ طور پر ${language} کی حمایت نہیں کرتا ہے۔`,
  usageStats: "استعمال کے اعدادوشمار",
  model: "ماڈل",
  effort: "کوشش",
  effortValue: ({ effort }) => `کوشش: ${effort}`,
  modelEffortNone: "کوئی نہیں۔",
  modelEffortMinimal: "کم سے کم",
  modelEffortLow: "کم",
  modelEffortMedium: "درمیانہ",
  modelEffortHigh: "اعلیٰ",
  modelEffortExtraHigh: "اضافی اعلیٰ",
  modelEffortMax: "زیادہ سے زیادہ",
  modelEffortDynamic: "متحرک",
  modelEffortDisabled: "غیر فعال",
  modelEffortEnabled: "فعال",
  fixed: "مقررہ",
  english: "انگریزی",
  german: "جرمن",
  ukrainian: "یوکرینی",
  hindi: "ہندی",
  spanish: "ہسپانوی",
  french: "فرانسیسی",
  italian: "اطالوی",
  portuguese: "پرتگالی",
  portugueseBrazil: "پرتگالی (برازیل)",
  russian: "روسی",
  simplifiedChinese: "سادہ چینی",
  arabic: "عربی",
  japanese: "جاپانی",
  hungarian: "ہنگری",
  czech: "چیک",
  polish: "پولش",
  turkish: "ترکی",
  swedish: "سویڈش",
  urdu: "اردو",
  kokoroAmericanFemaleVoice: ({ name }) => `${name} · امریکی خاتون`,
  kokoroBritishFemaleVoice: ({ name }) => `${name} · برطانوی خاتون`,
  kokoroChineseFemaleVoice: ({ index }) => `چینی خاتون ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `چینی مرد ${index}`,
  light: "روشن",
  dark: "گہرا",
  system: "سسٹم",
  languageCoverage: ({ note }) => `زبان کی کوریج: ${note}`,
  recordingLimits: ({ note }) => `ریکارڈنگ کی حدود: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `قیمت کا تعین: ${summary}`,
  replyGenerationAction: "جواب تیار کرنا",
  speechTranscriptionAction: "تقریر کی نقل",
  speechSynthesisAction: "تقریر کی ترکیب",
  instructionsTabDescription:
    "کسی بھی فراہم کنندہ کی درخواست کو دیکھنے سے پہلے اس پوشیدہ رہنمائی کو شکل دیں جو اسسٹنٹ کو چلاتی ہے۔",
  providersTabDescription:
    "بیرونی سروس کی اسناد کو ڈیوائس پر اسٹور کریں اور جوابی طریقوں کو ترتیب دیں جنہیں آپ استعمال کرنا چاہتے ہیں۔",
  webSearchTabDescription:
    "جوابات سے پہلے اختیاری لائیو ویب سیاق و سباق کو ترتیب دیں۔",
  responseModes: "ماڈل کا انتخاب",
  aboutModelSelection: "ماڈل کے انتخاب کے بارے میں",
  modelSelectionInfo:
    "ہر ماڈل کارڈ ہوم اسکرین پر ایک انتخاب بن جاتا ہے۔ اس کے فراہم کنندہ، ماڈل، اور اختیاری کوشش کی سطح کو کنفیگر کریں، پھر یہ منتخب کرنے کے لیے کارڈز سوئچ کریں کہ اگلا کون سا ماڈل جواب دیتا ہے۔",
  responseModeItemTitle: ({ index }) => `ماڈل ${index}`,
  addResponseMode: "ماڈل شامل کریں۔",
  removeResponseMode: "ماڈل کو ہٹا دیں۔",
  responseModesNoConfiguredProviders:
    "پہلے اسناد شامل کریں۔ روٹ کنٹرولز اس وقت تک پوشیدہ رہتے ہیں جب تک کہ کم از کم ایک ہم آہنگ سروس کنفیگر نہ ہو جائے۔",
  useResponseMode: ({ mode }) => `${mode} استعمال کریں۔`,
  chooseResponseModel: "ایک ماڈل منتخب کریں۔",
  responseModelCount: ({ count }) => `${count} ماڈل دستیاب ہیں۔`,
  ulraMode: "اعلیٰ موڈ",
  ulraModeHomeLabel: "ہوم اسکرین پر اعلیٰ موڈ دکھائیں",
  ulraModeSettingsDescription:
    "جب ہوم اسکرین کے کم از کم دو ماڈل تیار ہوں تو متعدد ماڈلز کے درمیان غور و فکر کی اجازت دیتا ہے۔",
  ulraModeInfo:
    "اعلیٰ موڈ پہلے ہوم اسکرین کے ہر تیار ماڈل سے الگ الگ جواب لیتا ہے۔ ہر جائزہ مرحلے میں ماڈلز ہر شریک کی تازہ ترین رائے کو تنقیدی طور پر پرکھتے ہیں؛ واضح متفقہ ہم آہنگی کے بعد باقی مراحل چھوڑ دیے جاتے ہیں۔ منتخب ماڈل ہر ماڈل کی تازہ ترین رائے کو ہمیشہ برقرار رکھتے ہوئے کامیاب مراحل سے آخری جواب تیار کرتا ہے۔ غور و فکر تمام شامل فراہم کنندگان کے ساتھ شیئر کیا جاتا ہے۔",
  ulraModeRounds: "جائزہ مراحل",
  ulraModeCallEstimate: ({ count }) =>
    `موجودہ ترتیب کے ساتھ فی پیغام زیادہ سے زیادہ ${count} ماڈل کالز۔`,
  ulraModeThresholdWarning:
    "4 سے زیادہ ماڈل یا 3 سے زیادہ مراحل بہت وقت لے سکتے ہیں، بہت سے ٹوکن استعمال کر سکتے ہیں اور فراہم کنندہ کی سیاق یا رفتار کی حدود تک پہنچ سکتے ہیں۔ یہ صرف ایک انتباہ ہے۔",
  ulraModeFirstUseTitle: "اعلیٰ موڈ فعال کریں؟",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `${models} ماڈلز اور زیادہ سے زیادہ ${rounds} جائزہ مراحل کے ساتھ ایک پیغام زیادہ سے زیادہ ${calls} ماڈل کالز کر سکتا ہے۔ اس میں بہت زیادہ وقت اور لاگت لگ سکتی ہے اور غور و فکر تمام شامل فراہم کنندگان کے ساتھ شیئر ہوگا۔`,
  ulraModeHighRiskTitle: "بڑا اعلیٰ موڈ رن",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} ماڈلز اور ${rounds} جائزہ مراحل زیادہ سے زیادہ ${calls} ماڈل کالز کر سکتے ہیں۔ اس میں بہت وقت لگ سکتا ہے، بہت سے ٹوکن استعمال ہو سکتے ہیں اور فراہم کنندہ کی حدود پوری ہو سکتی ہیں۔ پھر بھی جاری رکھیں؟`,
  ulraModeEnableAction: "فعال کریں",
  ulraModeNeedsTwoModels:
    "اعلیٰ موڈ کے لیے ہوم اسکرین پر کم از کم دو تیار ماڈلز درکار ہیں۔",
  ulraModeAllModelsFailed:
    "جواب تیار ہونے سے پہلے اعلیٰ موڈ کے تمام ماڈلز ناکام ہو گئے۔",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} اندرونی ماڈل کالز ناکام ہوئیں؛ حتمی جواب میں ${succeeded} کامیاب آرا استعمال ہوئیں۔`,
  sttTabDescription:
    "کنٹرول کریں کہ تقریر کیسے کیپچر کی جاتی ہے اور کون سا بیک اینڈ آڈیو کو ماڈل تک پہنچنے سے پہلے ٹیکسٹ میں بدل دیتا ہے۔",
  ttsTabDescription:
    "کنٹرول کریں کہ جواب کب بولنا شروع کریں اور کون سا بیک اینڈ بولا ہوا آؤٹ پٹ ہینڈل کرتا ہے۔",
  brief: "مختصر",
  briefDescription:
    "جواب کو مختصر رکھیں۔ صارف کو مکمل جواب دینے کے لیے کم سے کم جملے استعمال کریں۔",
  normal: "نارمل",
  normalDescription:
    "جواب کی متوازن لمبائی رکھیں۔ جواب کو بلاوجہ کھینچے بغیر اہم نکات کا احاطہ کریں۔",
  thorough: "مکمل",
  thoroughDescription:
    "گہرائی میں جائیں اور جامع بنیں۔ باریکیاں، تفصیل، فائدے نقصان کے موازنے اور اہم استدلال شامل کریں۔",
  professional: "پیشہ ورانہ",
  professionalDescription:
    "کسی سینئر کنسلٹنٹ کی طرح بات کریں جیسے کسی کلائنٹ کو بریفنگ دے رہے ہوں۔ قطعی زبان، کوئی بول چال نہیں، ماپا اور مستند۔",
  casual: "آرام دہ اور پرسکون",
  casualDescription:
    "کافی شاپ میں کسی سمجھ دار دوست کی طرح بات کریں۔ پرسکون، فطری، بات چیت والا انداز۔ بے تکلف مخففات ٹھیک ہیں، موضوع سے ہلکی سی ہٹ بھی ٹھیک ہے۔",
  nerdy: "نرڈی",
  nerdyDescription:
    "ایک پرجوش ماہر کی طرح بات کریں جو گہرائی میں جانا پسند کرتا ہے۔ تکنیکی اصطلاحات کھل کر استعمال کریں، تفصیلات میں شوق سے جائیں، اور فرض کریں کہ صارف آپ کے ساتھ چل سکتا ہے۔",
  concise: "اختصار",
  conciseDescription:
    "مکمل ہوتے ہوئے بھی جتنا ممکن ہو مختصر رہیں۔ کوئی تمہید نہیں، کوئی بھرتی نہیں، صرف جواب۔ ٹیلیگرام جیسا انداز اپنائیں۔",
  socratic: "سقراطی",
  socraticDescription:
    "صارف کی سوچ کو چیلنج کریں۔ جوابی سوالات پوچھیں، متبادل نقطہ نظر پیش کریں، صرف ان کی بات کی تصدیق نہ کریں۔ فکری مقابلے کے ساتھی بنیں، ہر بات پر ہاں کہنے والی مشین نہیں۔",
  eli5: "ELI5",
  eli5Description:
    "ہر چیز کو جتنا آسان ہو سکے بیان کریں۔ تشبیہیں اور روزمرہ زبان استعمال کریں، اصطلاحی زبان بالکل نہیں۔ کسی بھی موضوع پر پیشگی علم فرض نہ کریں۔",
  useProvider: ({ provider }) => `${provider} استعمال کریں۔`,
  createApiKey: "اسناد",
  apiKey: "API کلید",
  aboutThisProvider: "اس فراہم کنندہ کے بارے میں",
  openRouterOnboardingTitle: "ایک کلید، متعدد فراہم کنندگان",
  openRouterOnboardingDescription:
    "ایک وقف شدہ OpenRouter کلید بنائیں، اسے نیچے چسپاں کریں، اور کسی بھی براہ راست کنکشن کو تبدیل کیے بغیر کئی فراہم کنندگان کے اسنیپ شاٹ سے حمایت یافتہ ماڈل استعمال کریں۔",
  openRouterOnboardingRoute:
    "درخواست کا راستہ: یہ آلہ → OpenRouter → منتخب کردہ اپ اسٹریم فراہم کنندہ",
  openRouterKeys: "OpenRouter کلیدیں",
  providerStatusInvalid: "غلط",
  providerStatusTesting: "ٹیسٹنگ",
  providerStatusConfigured: "تشکیل شدہ",
  providerStatusWorking: "کام کر رہا ہے",
  providerStatusNotTested: "ٹیسٹ نہیں کیا گیا۔",
  providerStatusNotSetup: "سیٹ اپ نہیں",
  expandProvider: ({ provider }) => `${provider} کو پھیلائیں۔`,
  collapseProvider: ({ provider }) => `${provider} کو سکیڑیں۔`,
  testProviderKey: "کلید ٹیسٹ کریں",
  testAllCapabilities: "سب کی جانچ کریں۔",
  apiTest: "API ٹیسٹ",
  testProviderCapability: ({ capability }) => `${capability} ٹیسٹ کریں۔`,
  test: "ٹیسٹ",
  optional: "اختیاری",
  providerCapability_llm: "جوابات",
  providerCapability_stt: "اسپیچ ان پٹ",
  providerCapability_tts: "وائس آؤٹ پٹ",
  providerCapability_search: "ویب تلاش",
  providerCapability_voices: "وائس لائبریری",
  providerValidationUnavailable:
    "لائیو توثیق اس فراہم کنندہ کے لیے ابھی تک وائرڈ نہیں ہے۔ کلید کو یہاں محفوظ کریں اور اصل استعمال کے دوران اس کی تصدیق کریں۔",
  providerNeedsAttention: "توجہ درکار ہے",
  catalogProviderLimitsSummary: ({ summary }) => `حدود: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `علاقہ: ${summary}`,
  validatingKey: "تصدیق کر رہا ہے...",
  showKey: "کلید دکھائیں۔",
  hideKey: "کلید چھپائیں۔",
  assistantInstructions: "معاون ہدایات",
  systemPrompt: "سسٹم پرامپٹ",
  aboutSystemPrompt: "سسٹم پرامپٹ کے بارے میں",
  assistantInstructionsIntro:
    "ہر جواب سے پہلے ماڈل کو ملنے والی پوشیدہ رہنمائی کی شکل دیں۔",
  baseInstructions: "بنیادی ہدایات",
  assistantInstructionsPlaceholder:
    "وضاحت کریں کہ اسسٹنٹ کو کیسا برتاؤ کرنا چاہیے۔",
  assistantInstructionsHint:
    "یہ ہمیشہ منتخب ردعمل کی لمبائی اور لہجے سے پہلے پیش کیا جاتا ہے۔",
  adaptiveLength: "انکولی لمبائی",
  responseTone: "رسپانس ٹون",
  homeStyleChipLabel: ({ tone, length }) => `انداز — ${tone} · ${length}`,
  styleSheetTitle: "بات چیت کی ترتیبات",
  styleSheetSubtitle: "صرف اس گفتگو کے لیے جوابات اور تقریر کی شکل دیں۔",
  openStyleSheet: "گفتگو کی ترتیبات کھولیں۔",
  conversationThinkingInstructions: "سوچنے کی ہدایات",
  conversationThinkingInstructionsDescription:
    "اس گفتگو کے لیے گلوبل سسٹم پرامپٹ کے بعد ہدایات شامل کریں۔",
  conversationThinkingInstructionsPlaceholder:
    "مثال کے طور پر: میرے مفروضوں کو چیلنج کریں اور ٹھوس مثالیں استعمال کریں۔",
  ttsInstructions: "تقریر کی ترسیل کی ہدایات",
  ttsInstructionsDescription:
    "ہم آہنگ تقریری ماڈلز کے ذریعے استعمال ہونے والے لہجے، رفتار، لہجے یا ترسیل کی رہنمائی کریں۔",
  conversationTtsInstructionsDescription:
    "اس گفتگو کے لیے عالمی تقریری ہدایات کے بعد ترسیل کی ہدایات شامل کریں۔",
  ttsInstructionsPlaceholder:
    "مثال کے طور پر: گرمجوشی سے، واضح طور پر، اور آرام دہ رفتار سے بات کریں۔",
  ttsInstructionsUnsupported:
    "موجودہ تقریر کا راستہ ترسیل کی ہدایات کو سپورٹ نہیں کرتا ہے۔",
  conversationVoiceDescription: ({ route }) =>
    `اس گفتگو میں ${route} کے ذریعے استعمال ہونے والی آواز کا انتخاب کریں۔`,
  scrollToLatest: "تازہ ترین پیغام تک سکرول کریں۔",
  conversationTitleGenerate: "خودکار عنوان بنائیں",
  conversationTitleGenerating: "عنوان تیار کیا جا رہا ہے…",
  conversationTitleGenerated: "گفتگو کا نام تبدیل کر دیا گیا۔",
  conversationTitleNeedsContent: "عنوان بنانے سے پہلے بات چیت شروع کریں۔",
  conversationTitleNeedsProvider:
    "ٹائٹل بنانے سے پہلے منتخب ماڈل کو کنفیگر کریں۔",
  conversationTitleGenerationFailed: "گفتگو کا عنوان نہیں بنایا جا سکا۔",
  conversationTitleGenerationTimedOut:
    "عنوان بنانے میں کافی وقت لگا۔ براہ کرم دوبارہ کوشش کریں۔",
  inputMode: "ان پٹ موڈ",
  voiceInput: "وائس ان پٹ",
  pushToTalk: "بات کرنے کے لیے پش کریں۔",
  pushToTalkDescription:
    "بولتے وقت مین بٹن کو تھامیں، پھر بھیجنے کے لیے چھوڑ دیں۔",
  toggleToTalk: "ٹاک ٹوگل کریں۔",
  toggleToTalkDescription:
    "ریکارڈنگ شروع کرنے کے لیے ایک بار تھپتھپائیں اور مکمل ہونے پر دوبارہ ٹیپ کریں۔",
  driveSession: "ڈرائیو سیشن",
  driveSessionDescription:
    "جب خودکار تسلسل آن ہوتا ہے تو ہر بولے گئے جواب کے بعد ریکارڈنگ شروع ہوتی ہے۔ جب آپ بولنا ختم کر لیں تو مین بٹن کو تھپتھپائیں۔",
  stopDriveSession: "آٹو موقوف کریں۔",
  repeatDriveReply: "آخری دہرائیں۔",
  continueDriveSession: "آٹو دوبارہ شروع کریں۔",
  driveSendsIn: ({ seconds }) => `${seconds} میں بھیجا جائے گا…`,
  speechToText: "تقریر سے متن",
  appNative: "سسٹم کی پہچان",
  nativeSttDescription:
    "آپریٹنگ سسٹم کا اسپیچ شناخت کنندہ استعمال کریں۔",
  provider: "فراہم کرنے والا",
  webSearchProvider: "ویب سرچ فراہم کنندہ",
  webSearchProviderMissingHint:
    "یہاں ویب گراؤنڈنگ کو فعال کرنے کے لیے اسناد میں کم از کم ایک تلاش کے قابل سروس کو ترتیب دیں۔",
  webSearchModelHint: ({ model }) =>
    `لائیو ویب گراؤنڈنگ کے لیے پردے کے پیچھے ${model} استعمال کرتا ہے۔`,
  webSearchHomeHint:
    "اس تھریڈ کے لیے ویب گراؤنڈنگ کو آن یا آف کرنے کے لیے ہوم اسکرین ٹوگل کا استعمال کریں۔",
  settingsWebSearchCompactHint:
    "مرکزی ماڈل کے جوابات سے پہلے اختیاری طور پر تازہ ویب سیاق و سباق کو پیش کریں۔",
  webSearchAdvanced: "اعلیٰ درجے کی تلاش کے کنٹرولز",
  expandAdvancedSearch: "اعلیٰ درجے کی تلاش کے کنٹرول کو پھیلائیں۔",
  collapseAdvancedSearch: "اعلیٰ درجے کی تلاش کے کنٹرول کو سمیٹیں۔",
  webSearchSetupNeeded: "لائیو ویب سرچ استعمال کرنے کے لیے اسناد شامل کریں۔",
  webSearchEnabledDescription:
    "ماڈل کے جواب دینے سے پہلے تازہ ویب سیاق و سباق شامل کیا جاتا ہے۔",
  webSearchDisabledDescription:
    "اس تھریڈ کے لیے لائیو ویب سیاق و سباق استعمال کریں جب موجودہ حقائق اہم ہوں۔",
  webSearchNobodyDescription:
    "کوئی ویب درخواست نہیں۔ وہ ماڈل کے علم سے جواب دیتا ہے۔",
  webSearchQualityControls: "تلاش کا معیار",
  webSearchSearchMode: "سرچ موڈ",
  webSearchSearchModeQuick: "جلدی",
  webSearchSearchModeBalanced: "متوازن",
  webSearchSearchModeDeep: "گہرا",
  webSearchDepth: "تلاش کی گہرائی",
  webSearchDepthStandard: "معیاری",
  webSearchDepthDeep: "گہرا",
  webSearchResultCount: "نتائج کی گنتی",
  webSearchQualityHint: ({ provider }) =>
    `یہ کنٹرول ٹیون کرتے ہیں کہ کس طرح ${provider} جواب سے پہلے تازہ سیاق و سباق جمع کرتا ہے۔`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} ابھی تک اس ایپ میں اضافی تلاش کے معیار کے کنٹرول کو ظاہر نہیں کرتا ہے۔`,
  setWebSearchMode: ({ mode }) => `ویب سرچ موڈ کو ${mode} پر سیٹ کریں۔`,
  openWebSearchSettings: "ویب تلاش کی ترتیبات کھولیں۔",
  providerSttDescription:
    "جوابی راستے پر بھیجے جانے سے پہلے اپنی آواز کو نقل کرنے کے لیے کنفیگر کردہ بیرونی سروس کا استعمال کریں۔",
  sttProvider: "ایس ٹی ٹی فراہم کنندہ",
  sttProviderEnabledHint:
    "ٹرانسکرپشن سپورٹ کے ساتھ صرف فعال فراہم کنندگان یہاں ظاہر ہوتے ہیں۔",
  sttProviderMissingHint:
    "STT سپورٹ کے ساتھ کسی سروس کو یہاں منتخب کرنے کے لیے اسناد شامل کریں۔",
  nativeSttHint:
    "سسٹم کی شناخت آپ کے فراہم کنندگان کی کلیدوں سے آزادانہ طور پر کام کرتی ہے اور اس پر آلہ پر یا آپریٹنگ سسٹم کی اسپیچ سروس کے ذریعے کارروائی کی جا سکتی ہے۔",
  replyPlayback: "جواب کا پلے بیک",
  sentencesArrive: "پیراگراف آتے ہی",
  sentencesArriveDescription: "مکمل پیراگراف تیار ہوتے ہی بولنا شروع کریں۔",
  fullReplyFirst: "پہلے مکمل جواب",
  fullReplyFirstDescription:
    "پہلے پورا جواب تیار کریں، پھر اسے ایک پاس میں چلائیں۔",
  textToSpeech: "ٹیکسٹ ٹو اسپیچ",
  spokenReplies: "بولے گئے جوابات",
  spokenRepliesEnabledDescription:
    "صوتی راستہ دستیاب ہونے پر اسسٹنٹ کے جوابات بلند آواز میں پڑھیں۔",
  spokenRepliesDisabledDescription:
    "ابھی کے لیے صرف ٹیکسٹ جوابات رکھیں۔ آپ کا پسندیدہ TTS راستہ بعد کے لیے محفوظ رہتا ہے۔",
  nativeTtsDescription:
    "بولے گئے جوابات اور آواز کے پیش نظارہ کے لیے ڈیوائس اسپیچ انجن کا استعمال کریں۔",
  kokoroTtsDescription:
    "اسی ڈیوائس پر مکمل طور پر کہیں زیادہ قدرتی نیورل آواز استعمال کریں۔ بولے جانے والے جواب کا متن مقامی طور پر تیار ہوتا ہے، بغیر کسی اسپیچ فراہم کنندہ کی کلید یا استعمال کے چارج کے۔",
  kokoroVoices: "Kokoro آن ڈیوائس آوازیں۔",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `کثیر لسانی ماڈل تقریباً ${size} MB ڈاؤن لوڈ کرتا ہے اور انسٹالیشن کے بعد تقریباً ${installedSize} MB جگہ لیتا ہے۔`,
  kokoroModel: "Kokoro کثیر لسانی ماڈل",
  kokoroChecking: "آن ڈیوائس ماڈل کو چیک کیا جا رہا ہے…",
  kokoroDownloading: ({ progress }) => `ڈاؤن لوڈ ہو رہا ہے… ${progress}%`,
  kokoroExtracting: ({ progress }) => `انسٹال ہو رہا ہے… ${progress}%`,
  kokoroVerifying: "صوتی انجن کی تصدیق ہو رہی ہے…",
  kokoroInstalled: "اس ڈیوائس پر انسٹال اور تیار ہے۔",
  kokoroNotInstalled:
    "Kokoro منتخب یا استعمال کرنے سے پہلے ماڈل ڈاؤن لوڈ اور اس کی تصدیق کریں۔ فراہم کنندہ کلید کی ضرورت نہیں ہے۔",
  kokoroLanguageFallback:
    "Kokoro فی الحال یہاں انگریزی اور سادہ چینی بولتا ہے۔ دیگر منتخب جوابی زبانوں کے لیے ایک واضح فال بیک روٹ شامل کریں، ورنہ تقریر ایک خرابی کے ساتھ رک جائے گی۔",
  kokoroRemoveTitle: "Kokoro ماڈل کو ہٹائیں؟",
  kokoroRemoveBody: ({ installedSize }) =>
    `یہ تقریباً ${installedSize} MB کو آزاد کرتا ہے۔ آپ کسی بھی وقت ماڈل کو دوبارہ ڈاؤن لوڈ کر سکتے ہیں۔`,
  removeKokoroModel: "Kokoro ماڈل کو ہٹا دیں۔",
  downloadKokoroModel: "Kokoro ماڈل ڈاؤن لوڈ کریں۔",
  kokoroFallbackNeeded: ({ languages }) =>
    `اس کے لیے ایک واضح فال بیک روٹ درکار ہے: ${languages}۔`,
  kokoroNoSelectedLanguages:
    "Kokoro آواز کو ترتیب دینے کے لیے «سننے کی زبانیں» کے تحت انگریزی یا سادہ چینی منتخب کریں۔",
  expandVoiceSettings: ({ language }) =>
    `${language} آواز کی ترتیبات کو پھیلائیں۔`,
  collapseVoiceSettings: ({ language }) =>
    `${language} آواز کی ترتیبات کو سکیڑیں۔`,
  remove: "ہٹا دیں۔",
  voiceOutputDescription:
    "بولے جانے والے جوابات کے لیے اسپیچ انجن، سننے کی زبانیں اور آواز کے پیش نظارے چنیں۔",
  localTts: "مقامی",
  localTtsDescription:
    "بولے گئے جوابات کے لیے مماثل ڈاؤن لوڈ کردہ مقامی آواز کا استعمال کریں۔",
  providerTtsDescription:
    "بولے گئے جوابات کے لیے منتخب کنفیگر کردہ سروس استعمال کریں۔",
  ttsFallbackRoutes: "فال بیک کے راستے",
  ttsFallbackRoutesHint:
    "اختیاری۔ صرف وہی راستے شامل کریں جو آپ چاہتے ہیں، اسی ترتیب میں جس سے انہیں آزمایا جانا چاہیے۔ ایک بار جب کوئی راستہ بولنا شروع کر دے، Mr Broccoli باقی جواب کے لیے اسی پر رہتا ہے۔",
  ttsFallbackNone:
    "کوئی فال بیک کنفیگر نہیں ہے۔ اس کے بجائے آواز کی ناکامی دکھائی جائے گی۔",
  ttsFallbackPosition: ({ position, route }) => `${position} ${route}`,
  addFallbackRoute: ({ route }) => `${route} فال بیک شامل کریں۔`,
  removeFallbackRoute: ({ route }) => `${route} فال بیک کو ہٹا دیں۔`,
  moveFallbackEarlier: ({ route }) => `${route} پہلے منتقل کریں۔`,
  moveFallbackLater: ({ route }) => `${route} کو بعد میں منتقل کریں۔`,
  ttsProvider: "ٹی ٹی ایس فراہم کنندہ",
  ttsProviderEnabledHint:
    "یہاں صرف فعال فراہم کنندگان دکھائی دیتے ہیں جن میں بولے جانے والے جواب کی حمایت ہے۔",
  ttsProviderMissingHint:
    "TTS سپورٹ والی سروس کے لیے اسناد شامل کریں تاکہ اسے یہاں منتخب کریں۔",
  localTtsOrderHint:
    "صرف واضح طور پر تشکیل شدہ فال بیک روٹس کی کوشش کی جاتی ہے۔",
  providerTtsOrderHint:
    "صرف واضح طور پر تشکیل شدہ فال بیک روٹس کی کوشش کی جاتی ہے۔",
  nativeTtsHint:
    "سسٹم TTS ڈیوائس کی وائس اسٹیک استعمال کرتا ہے اور اسے فراہم کنندہ کلید کی ضرورت نہیں ہے۔",
  localTtsLanguageCoverageHint:
    "مقامی پیک میں فی الحال انگریزی، جرمن، سادہ چینی، ہسپانوی، پرتگالی، ہندی، فرانسیسی اور اطالوی شامل ہیں۔",
  ttsVoice: "ٹی ٹی ایس وائس",
  refresh: "ریفریش کریں۔",
  providerVoiceDirectory: ({ provider }) => `${provider} وائس لائبریری`,
  refreshProviderVoices: ({ provider }) => `${provider} آوازیں تازہ کریں۔`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${provider} سے ${count} آوازیں دستیاب ہیں`,
  providerVoicesLoadFailed:
    "آوازیں تازہ نہیں کی جا سکیں۔ آپ کا موجودہ انتخاب برقرار ہے؛ آپ اب بھی دستی طور پر وائس ID درج کر سکتے ہیں۔",
  providerVoicesLoadFailedWithFallback:
    "اکاؤنٹ کی آوازیں لوڈ نہیں ہو سکیں۔ بلٹ ان آواز دستیاب رہتی ہے۔",
  providerVoicesErrorDetail: ({ detail }) => `وجہ: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "ElevenLabs میں، اس API کلید میں ترمیم کریں اور Voices → Read کو فعال کریں، پھر یہاں ریفریش کریں۔",
  providerVoicesLoadingHint: ({ provider }) =>
    `Mr Broccoli دستیاب آوازوں کو ${provider} سے خود بخود لوڈ کرتا ہے۔`,
  providerVoiceId: "وائس آئی ڈی",
  providerVoiceIdPlaceholder: "وائس ID درج کریں۔",
  providerVoiceIdFallbackHint:
    "وائس لائبریری لوڈ نہ ہونے پر دستی اندراج دستیاب رہتا ہے۔",
  providerVoiceIdRequired: ({ provider }) =>
    `اسپیچ آؤٹ پٹ استعمال کرنے سے پہلے ${provider} وائس لائبریری کو ریفریش کریں یا وائس ID درج کریں۔`,
  qwenSpeechUnavailableInUs:
    "Mr Broccoli کے موجودہ Qwen تقریر کے راستے امریکی خطے میں دستیاب نہیں ہیں۔ Qwen تقریر کے لیے سنگاپور یا بیجنگ کا انتخاب کریں۔",
  qwenApiRegion: "Qwen API علاقہ",
  qwenRegionSingapore: "سنگاپور",
  qwenRegionUs: "US (ورجینیا)",
  qwenRegionBeijing: "چین (بیجنگ)",
  qwenRegionHint:
    "منتخب شدہ علاقہ اس خطے سے مماثل ہونا چاہیے جس میں یہ API کلید بنائی گئی تھی۔",
  qwenRegionUsSpeechHint:
    "یو ایس ریجن کیز یہاں چیٹ اور ویب سرچ کو سپورٹ کرتی ہیں۔ Mr Broccoli کے موجودہ Qwen STT اور TTS روٹس کے لیے سنگاپور یا بیجنگ کلید درکار ہے۔",
  providerDefaultVoiceHint:
    "یہ فراہم کنندہ فی الحال پیش نظارہ اور بولے گئے جوابات کے لیے اپنی ڈیفالٹ آواز استعمال کرتا ہے۔",
  listenLanguages: "سننے کی زبانیں",
  listenLanguagesHint:
    "وہ جوابی زبانیں چنیں جن کی آواز آپ اچھی چاہتے ہیں۔ اسپیچ آؤٹ پٹ کو روٹ کرتے وقت Mr Broccoli انہیں اسی ترتیب میں آزماتا ہے۔",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 زبان منتخب کی گئی۔" : `${count} زبانیں منتخب کی گئیں۔`,
  localVoicePacks: "مقامی وائس پیک",
  localVoicePacksHint:
    "ہر زبان اپنی مقامی آواز رکھتی ہے۔ اس زبان کے لیے اپنی مطلوبہ آواز کا انتخاب کریں، پھر صرف وہی پیک ڈاؤن لوڈ کریں جن کی آپ کو واقعی ضرورت ہے۔",
  localVoiceForLanguage: ({ languageLabel }) => `${languageLabel} کے لیے آواز`,
  providerVoicePreviews: "فراہم کنندہ کی آواز کے پیش نظارے",
  providerVoicePreviewsHint:
    "ہر جوابی زبان کے لیے ایک علیحدہ پیش نظارہ متن کے ساتھ یہاں فی الحال منتخب کردہ TTS روٹ کی جانچ کریں۔",
  nativeVoicePreviewSection: "سسٹم آواز کا پیش نظارہ",
  nativeVoicePreviewSectionHint:
    "یہ فون کے بلٹ ان اسپیچ سنتھیسائزر کے ذریعے براہ راست بولتا ہے تاکہ آپ اس کا موازنہ فراہم کنندہ کی تشکیل شدہ آوازوں سے کر سکیں۔",
  nativeVoiceUnavailable:
    "اس ڈیوائس نے پیش نظارہ کے لیے سسٹم کی کوئی آواز دستیاب نہیں بتائی۔",
  runtimeCompatibilityOverrides: "رن ٹائم مطابقت",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `فراہم کنندہ کی جانب سے غیر دستیاب قرار دی گئی ${count} ماڈل یا ترتیب کنفیگریشنز صرف اس ڈیوائس پر بند ہیں۔ Mr Broccoli خودکار طور پر ان سے بچتا ہے۔`,
  clearRuntimeCompatibilityOverrides: "رن ٹائم مطابقت صاف کریں",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "رن ٹائم مطابقت صاف کریں؟",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "پہلے بند کی گئی کنفیگریشنز دوبارہ آزمائی جا سکیں گی۔ فراہم کنندہ انہیں دوبارہ مسترد کر سکتا ہے۔",
  speechDiagnostics: "حالیہ تقریری سرگرمی",
  speechDiagnosticsHint:
    "تقریر کی تازہ ترین درخواستیں، وہ راستہ جو انہوں نے مانگا تھا، وہ راستہ جو انہوں نے اصل میں استعمال کیا تھا، اور فال بیک کی کوئی وجہ دکھاتا ہے۔",
  clearSpeechDiagnostics: "حالیہ تقریری سرگرمی کو صاف کریں۔",
  speechDiagnosticsEmpty:
    "ابھی تک کوئی حالیہ تقریر کی درخواستیں نہیں ہیں۔ روٹنگ کی تفصیلات یہاں دیکھنے کے لیے آواز کا پیش منظر دیکھیں یا جواب چلائیں۔",
  clearSpeechDiagnosticsConfirmationTitle: "تقریر کی حالیہ سرگرمی صاف کریں؟",
  clearSpeechDiagnosticsConfirmationMessage:
    "یہ تمام کیپچر کردہ اسپیچ روٹنگ کی تشخیص کو ہٹا دیتا ہے۔ اس کارروائی کو کالعدم نہیں کیا جا سکتا۔",
  speechDiagnosticSourceConversation: "گفتگو کا جواب",
  speechDiagnosticSourceRepeat: "دہرایا گیا جواب",
  speechDiagnosticSourcePreview: "صوتی پیش نظارہ",
  speechDiagnosticSourceUnknown: "تقریر کی درخواست",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `درخواست کردہ: ${requested} ← اصل: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `تازہ ترین مرحلہ: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) => `زبان: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `فراہم کنندہ: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `آواز: ${voice}`,
  localTtsPackReady: "اس ڈیوائس پر انسٹال ہے۔",
  localTtsPackBroken:
    "ڈاؤن لوڈ ہو گیا، لیکن یہ آواز اس آلہ پر مقامی تصدیق میں ناکام ہو گئی۔ اسے دوبارہ ڈاؤن لوڈ کریں یا کوئی اور آواز منتخب کریں۔",
  localTtsPackMissing:
    "ابھی تک انسٹال نہیں ہوا۔ کلاؤڈ TTS یا سسٹم کی آواز اس وقت تک استعمال کی جائے گی جب تک آپ اسے ڈاؤن لوڈ نہیں کرتے ہیں۔",
  localTtsUnsupportedLanguageFallback:
    "اس زبان کے لیے ابھی تک مقامی پیک دستیاب نہیں ہے۔ کلاؤڈ TTS یا سسٹم کی آواز اسے سنبھالے گی۔",
  downloadingLocalTtsPack: ({ progress }) =>
    `مقامی پیک ڈاؤن لوڈ ہو رہا ہے... ${progress}%`,
  download: "ڈاؤن لوڈ کریں۔",
  downloadingShort: "لوڈ ہو رہا ہے...",
  voicePreviewText: "صوتی پیش نظارہ متن",
  voicePreviewPlaceholder: "اس آواز کو سننے کے لیے ایک جملہ ٹائپ کریں۔",
  voicePreviewHint:
    "زبان کے ماڈل کو کچھ بھیجے بغیر فی الحال منتخب کردہ جوابی آواز کا بیک اینڈ استعمال کرتا ہے۔",
  previewVoice: "پیش نظارہ آواز",
  generatingPreview: "پیش منظر تیار ہو رہا ہے...",
  playingPreview: "پیش منظر چل رہا ہے...",
  systemVoice: "سسٹم کی آواز",
  spokenRepliesOff: "صرف متن",
  noTtsProvider: "کوئی TTS فراہم کنندہ نہیں۔",
  nothingToCopyYet: "ابھی تک کاپی کرنے کے لیے کچھ نہیں ہے۔",
  couldntCopyText: "اس متن کو کاپی نہیں کیا جا سکا۔",
  nothingToShareYet: "ابھی تک اشتراک کرنے کے لیے کچھ نہیں ہے۔",
  couldntShareText: "اس متن کا اشتراک نہیں ہو سکا۔",
  couldntReplayReply: "اس جواب کو دوبارہ نہیں چلایا جا سکا۔",
  replyFailed: "جواب ناکام ہو گیا۔",
  retryReply: "جواب کی دوبارہ کوشش کریں۔",
  replyFailedHint:
    "دوبارہ کوشش کرنے سے پہلے آپ اوپر کوئی دوسرا ماڈل منتخب کر سکتے ہیں۔",
  spokenReplyFailed: "جواب محفوظ ہو گیا، لیکن اسے بولا نہیں جا سکا۔",
  retrySpeech: "تقریر کی دوبارہ کوشش کریں۔",
  openSpeakingSettings: "بولنے کی ترتیبات",
  messageCopied: "پیغام کاپی ہو گیا۔",
  noConversationToCopyYet: "کاپی کرنے کے لیے ابھی تک کوئی گفتگو نہیں ہے۔",
  noConversationToShareYet: "اشتراک کرنے کے لیے ابھی تک کوئی بات چیت نہیں ہے۔",
  noReplyToRepeatYet: "دوبارہ چلانے کے لیے ابھی کوئی جواب نہیں ہے۔",
  threadCopied: "تھریڈ کاپی ہو گیا۔",
  threadRenamed: "تھریڈ کا نام تبدیل کر دیا گیا۔",
  threadPinned: "تھریڈ پن کر دیا گیا۔",
  threadUnpinned: "تھریڈ سے پن ہٹا دیا گیا۔",
  addProviderKeyToUseProvider: ({ provider }) =>
    `اس راستے کو استعمال کرنے سے پہلے ترتیبات میں ${provider} کے لیے اسناد شامل کریں۔`,
  configureCredentialsBeforeVoiceSession:
    "صوتی سیشن شروع کرنے سے پہلے ترتیبات میں اسناد شامل کریں۔",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `${provider} کے لیے، فراہم کنندہ کا بنیادی URL اور API کلید بطور https://your-endpoint.example.com|your-api-key درج کریں۔`,
  speechRecognitionUnavailableOnDevice:
    "اس ڈیوائس پر اسپیچ ریکگنیشن دستیاب نہیں ہے۔",
  debugLogLabel: "LOG",
  debugLogCaptureStarted: "ڈیبگ لاگنگ شروع ہو گئی۔",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `ڈیبگ لاگ کو ${fileName} کے بطور محفوظ کیا گیا اور کلپ بورڈ میں کاپی کیا گیا (${entryCount} اندراجات)۔`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `ڈیبگ لاگ کو ${fileName} (${entryCount} اندراجات) کے بطور محفوظ کیا گیا۔`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `گزشتہ ڈیبگ لاگ ${fileName} کو بازیافت کیا اور اسے کلپ بورڈ (${entryCount} اندراجات) میں کاپی کیا۔`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `پچھلے ڈیبگ لاگ کو بازیافت کیا گیا ${fileName} (${entryCount} اندراجات)۔`,
  debugLogCaptureFailed: "ڈیبگ لاگ کو محفوظ نہیں کیا جا سکا۔",
  chooseSttBeforeVoiceSession:
    "صوتی سیشن شروع کرنے سے پہلے ترتیبات میں ایک ترتیب شدہ STT روٹ کا انتخاب کریں۔",
  chooseTtsBeforeSpokenReplies:
    "بولے گئے جوابات استعمال کرنے سے پہلے سیٹنگز میں کنفیگرڈ TTS روٹ کا انتخاب کریں۔",
  stopSessionBeforeReplay:
    "آخری جواب کو دوبارہ چلانے سے پہلے فعال صوتی سیشن کو روک دیں۔",
  couldntCatchThatTryAgain: "بات سمجھ نہیں آئی، دوبارہ کوشش کریں۔",
  couldntStartVoiceInput: "صوتی ان پٹ شروع نہیں ہو سکا۔",
  couldntProcessVoiceInput: "صوتی ان پٹ پر کارروائی نہیں ہو سکی۔",
  maxRecordingLengthReached:
    "ریکارڈنگ کی زیادہ سے زیادہ لمبائی مکمل ہو گئی — جو کچھ سن لیا ہے وہ بھیجا جا رہا ہے۔",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `وہ ریکارڈنگ ${provider} اسپیچ ٹو ٹیکسٹ (زیادہ سے زیادہ ${limit}) کے لیے بہت لمبی ہے۔ ایک چھوٹا پیغام آزمائیں، یا اسپیچ ٹو ٹیکسٹ کو سسٹم ریکگنیشن میں تبدیل کریں۔`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `اس راستے کو استعمال کرنے سے پہلے ترتیبات میں ${provider} کے لیے اسناد شامل کریں۔`,
  stopSessionBeforePreview:
    "آواز کا پیش منظر دیکھنے سے پہلے ایکٹو وائس سیشن کو روک دیں۔",
  chooseTtsToPreviewVoices:
    "آوازوں کا پیش نظارہ کرنے کے لیے ترتیبات میں ترتیب شدہ TTS روٹ کا انتخاب کریں۔",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `پہلے منتخب کردہ ${languageLabel} مقامی آواز کو ڈاؤن لوڈ کریں۔`,
  couldntPreviewVoice: "آواز کا پیش نظارہ نہیں کیا جا سکا۔",
  spokenRepliesDisabled: "بولے گئے جوابات ترتیبات میں بند ہیں۔",
  providerVoiceFallback:
    "کنفیگر کردہ صوتی راستہ ناکام ہو گیا۔ اس جواب کو فال بیک آواز میں تبدیل کر دیا۔",
  localVoiceFallback:
    "مقامی آواز دستیاب نہیں تھی۔ اس جواب کو فال بیک آواز میں تبدیل کر دیا۔",
  localTtsPackInstalled: ({ languageLabel }) =>
    `${languageLabel} لوکل وائس پیک انسٹال ہوا۔`,
  localTtsPackInstallFailed: "مقامی وائس پیک کو انسٹال نہیں کیا جا سکا۔",
  clear: "صاف",
  voiceOutput: "وائس آؤٹ پٹ",
  speechReplayCache: "تقریر دوبارہ چلانے کا کیش",
  speechReplayCacheDescription:
    "فراہم کنندہ کی بنائی ہوئی آواز اس ڈیوائس پر 14 دن تک رہتی ہے، اس لیے جواب دوبارہ چلانے پر مزید اسپیچ کریڈٹس خرچ نہیں ہوتے۔",
  clearSpeechReplayCache: "اسپیچ کیش صاف کریں",
  speechReplayCacheCleared: "کیش شدہ اسپیچ فائلیں حذف کر دی گئیں۔",
  speechReplayCacheClearFailed: "اسپیچ کیش صاف نہیں ہو سکا۔",
  currentSetup: "موجودہ سیٹ اپ",
  listeningToYourVoice: "آپ کی آواز سننا",
  parsingYourVoiceInput: "آپ کی آواز کو متن میں بدلا جا رہا ہے",
  preparingRequest: "آپ کی درخواست کی تیاری",
  searchingTheWeb: "تازہ سیاق و سباق کے لیے ویب پر تلاش کرنا",
  waitingForProvider: ({ provider }) => `${provider} کا انتظار ہے۔`,
  preparingVoiceWithProvider: ({ provider }) =>
    `${provider} کے ساتھ آواز کی تیاری`,
  deepThinkingReassurance: "اچھے جوابات میں کچھ دیر لگتی ہے…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "آپ کو جواب سنایا جا رہا ہے",
  freshSession: "تازہ سیشن",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 پیغام" : `${count} پیغامات`,
  speechInputRoute: ({ route }) => `تقریر اِن پٹ: ${route}`,
  replyModelRoute: ({ route }) => `جوابی ماڈل: ${route}`,
  voiceOutputRoute: ({ route }) => `آواز آؤٹ پٹ: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `فال بیک آواز آؤٹ پٹ: ${route}`,
  conversation: "بات چیت",
  conversationActions: "بات چیت کے اعمال",
  statusDetails: "حیثیت کی تفصیلات",
  persistenceFailure:
    "Mr Broccoli اس آلہ پر ڈیٹا محفوظ نہیں کر سکا۔ ایپ کو کھلا رکھیں اور دوبارہ کوشش کریں۔ دوبارہ شروع کرنے کے بعد حالیہ تبدیلیاں ضائع ہو سکتی ہیں۔",
  show: "دکھائیں۔",
  showTranscript: "نقل دکھائیں۔",
  hide: "چھپائیں",
  copyThread: "تھریڈ کاپی کریں۔",
  shareThread: "تھریڈ شیئر کریں۔",
  reportResponse: "اس جواب کی اطلاع دیں",
  reportResponseIntro: "Mr Broccoli سے AI جواب کی رپورٹ۔ نیچے دیا گیا مواد دیکھیں، مسئلہ بیان کریں اور یہ رپورٹ ڈویلپر کو بھیجیں۔",
  repeatReply: "جواب دہرائیں۔",
  renameThread: "تھریڈ کا نام تبدیل کریں۔",
  renameThreadHint:
    "اس گفتگو کو ایک ایسا عنوان دیں جسے آپ بعد میں جلد تلاش کر سکیں۔",
  threadTitle: "تھریڈ کا عنوان",
  noTranscriptYet: "ابھی تک کوئی نقل نہیں۔",
  previewTranscriptEmptyDescription:
    "شروع کرنے کے لیے آواز یا متن کا استعمال کریں۔ آپ کی گفتگو یہاں ظاہر ہوگی۔",
  noConversationYet: "ابھی تک کوئی بات چیت نہیں ہوئی۔",
  expandedTranscriptEmptyDescription:
    "شروع کرنے کے لیے آواز یا متن کا استعمال کریں۔ جب آپ مرکزی مرحلے پر واپس آنا چاہیں تو اس اسکرین کو بند کریں۔",
  transcriptSelectionHint:
    "کسی بھی پیغام کا متن براہ راست منتخب کریں، یا ذیل میں انفرادی پیغامات کا اشتراک اور کاپی کریں۔",
  textMessagePlaceholder: "ایک پیغام ٹائپ کریں۔",
  sendTextMessage: "پیغام بھیجیں۔",
  showVoiceInput: "صوتی ان پٹ دکھائیں۔",
  showTextInput: "ٹیکسٹ ان پٹ دکھائیں۔",
  usageStatsHiddenDescription: "ٹوکن تخمینوں کو ٹرانسکرپٹ UI سے باہر رکھیں۔",
  usageStatsVisibleDescription:
    "جوابات اور گفتگو کے کل کے لیے ٹوکن کا تخمینہ استعمال دکھائیں۔",
  debugLogButton: "ڈیبگ لاگ بٹن",
  debugLogButtonHiddenDescription:
    "ہوم اسکرین LOG بٹن کو پوشیدہ رکھیں جب تک کہ کوئی کیپچر پہلے سے چل رہا ہو۔",
  debugLogButtonVisibleDescription:
    "ڈیبگ کیپچرز شروع کرنے اور روکنے کے لیے ہوم اسکرین LOG بٹن دکھائیں۔",
  debugLogButtonUsageDescription:
    "بٹن کا استعمال کیسے کریں: اسے آن کرنے سے لاگز کیپچر ہونا شروع ہو جاتے ہیں۔ اسے آف کرنے سے کیپچر رک جاتا ہے اور کیپچر شدہ لاگز کلپ بورڈ میں منتقل ہو جاتے ہیں۔",
  estimatedUsageTitle: "تخمینی استعمال",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} جوابات · ${summaries} میموری اپ ڈیٹس`,
  estimatedUsageConversationScope:
    "ٹوٹل میں اس گفتگو کے اندر استعمال ہونے والا ہر راستہ اور ماڈل شامل ہے۔",
  estimatedPromptTokens: ({ count }) => `پرامپٹ: ${count}`,
  estimatedReplyTokens: ({ count }) => `جواب: ${count}`,
  estimatedTotalTokens: ({ count }) => `کل: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `تخمینہ ${prompt} اِن · ${completion} آؤٹ · ${total} کل`,
  searchQuery: "تلاش کا استفسار",
  expandWebSearchDetails: "ویب تلاش کی تفصیلات دکھائیں۔",
  collapseWebSearchDetails: "ویب تلاش کی تفصیلات چھپائیں۔",
  webSearchSourceCount: ({ count }) => `${count} ذرائع`,
  sources: "ذرائع",
  openSourceLink: ({ source }) => `ماخذ کھولیں: ${source}`,
  turnReceipt: "باری کی تفصیلات",
  expandTurnReceipt: "باری کی تفصیلات دکھائیں۔",
  collapseTurnReceipt: "باری کی تفصیلات چھپائیں۔",
  turnReceiptDirect: "براہ راست",
  turnReceiptRequested: "درخواست کردہ جوابی راستہ",
  turnReceiptActual: "اصل جواب کا راستہ",
  turnReceiptEffort: "استدلال کنٹرول",
  turnReceiptProviderNative: "فراہم کنندہ مقامی",
  turnReceiptInput: "ان پٹ روٹ",
  turnReceiptSearch: "ویب تلاش",
  turnReceiptVoice: "وائس آؤٹ پٹ",
  turnReceiptContext: "سیاق و سباق",
  turnReceiptTiming: "ٹائمنگ",
  turnReceiptFallback: "فال بیک وجہ",
  turnReceiptVoiceInput: "آواز",
  turnReceiptTypedInput: "ٹائپ شدہ",
  turnReceiptSystemSpeech: "سسٹم اسپیچ ریکگنیشن",
  turnReceiptSystemVoice: "سسٹم کی آواز",
  turnReceiptSystemVoiceFallback: "سسٹم کی آواز · فال بیک",
  turnReceiptOff: "آف",
  turnReceiptNotConfigured: "آن · کنفیگر نہیں ہے۔",
  turnReceiptFallbackWithoutSearch: "لائیو تلاش کے بغیر جاری رکھا",
  turnReceiptNotUsed: "استعمال نہیں کیا گیا۔",
  turnReceiptSummaryReused: "محفوظ کردہ خلاصہ دوبارہ استعمال کیا گیا۔",
  turnReceiptSummaryUpdated: "خلاصہ اپ ڈیٹ",
  turnReceiptContextFallback: "حالیہ پیغام کا فال بیک",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `گیٹ وے نے ${original} پیغامات کو ${compressed} میں سکیڑ دیا`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} سابقہ پیغامات بھیجے گئے · ${summarized} نئے خلاصہ شدہ${state}`,
  turnReceiptTimingStt: "ایس ٹی ٹی",
  turnReceiptTimingContext: "سیاق و سباق",
  turnReceiptTimingSearch: "تلاش کریں",
  turnReceiptTimingModel: "ماڈل",
  turnReceiptTimingFirstSpeech: "پہلی تقریر",
  turnReceiptTimingTotal: "کل",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} ٹوکنز`,
  unknownUsageRoute: "نامعلوم راستہ",
  setupGuideConnectProviderTitle: "اسناد کو ترتیب دیں۔",
  setupGuideConnectProviderDescription:
    "ترتیبات میں اسناد شامل کریں، پھر وہ راستے منتخب کریں جنہیں آپ استعمال کرنا چاہتے ہیں۔",
  idle: "فارغ",
  yourConversationAppearsHere: "آپ کی گفتگو یہاں ظاہر ہوتی ہے۔",
  defaultTranscriptEmptyDescription:
    "شروع کرنے کے لیے آواز یا متن کا استعمال کریں۔ Mr Broccoli تھریڈ کو برقرار رکھے گا اور یہاں جواب دے گا۔",
  delete: "حذف کریں۔",
  deleteConversationConfirmationTitle: ({ title }) => `"${title}" کو حذف کریں؟`,
  deleteConversationConfirmationMessage:
    "یہ بات چیت اور اس کے تمام پیغامات کو مستقل طور پر حذف کر دیتا ہے۔ اس کارروائی کو کالعدم نہیں کیا جا سکتا۔",
  memory: "یادداشت",
  conversations: "بات چیت",
  drawerSubtitle:
    "لائیو تھریڈز کے درمیان چھلانگ لگائیں یا ایک تازہ کمرہ شروع کریں۔",
  newSession: "نیا سیشن",
  noSavedConversationsYet: "ابھی تک کوئی محفوظ شدہ گفتگو نہیں ہے۔",
  drawerEmptyDescription:
    "مین ویو سے بولنا شروع کریں اور Mr Broccoli خود بخود ایک سیشن بنائے گا۔",
  setupGuideTitle: "ایپ کو کنفیگر کریں۔",
  setupGuideSubtitle: "اسناد شامل کریں اور ترتیبات میں راستے منتخب کریں۔",
  fastestStartPreset: "کم سے کم سیٹ اپ",
  fastestStartDescription:
    "ڈیوائس اسپیچ کا استعمال کریں جہاں دستیاب ہو اور صرف وہی جوابی راستہ ترتیب دیں جس کی آپ کو ضرورت ہے۔",
  fullVoicePreset: "ترتیب شدہ آواز",
  fullVoiceDescription:
    "جب آپ ان کا انتخاب کرتے ہیں تو جوابات، ٹرانسکرپشن، اور بولے جانے والے آؤٹ پٹ کے لیے ترتیب شدہ خدمات کا استعمال کریں۔",
  setupGuideNote:
    "اب ہم ترتیبات کھولیں گے تاکہ آپ اسناد پیسٹ کر کے ان کی توثیق کر سکیں۔",
  useThisSetup: "اس سیٹ اپ کو استعمال کریں۔",
  notNow: "ابھی نہیں۔",
  setupGuideIntroTitle: "Mr Broccoli کیسے کام کرتا ہے۔",
  setupGuideIntroBody:
    "Mr Broccoli خالی شروع ہوتا ہے۔ بیرونی خدمات کے لیے اسناد شامل کریں جو آپ پہلے سے استعمال کرتے ہیں، پھر منتخب کریں کہ جوابات، اسپیچ ان پٹ، بولی جانے والی آؤٹ پٹ، اور اختیاری ویب سیاق و سباق کو کیسے روٹ کیا جاتا ہے۔",
  setupGuideIntroNote:
    "سیٹ اپ کے بعد، بات چیت شروع کرنے اور روکنے کے لیے مین وائس کنٹرول کا استعمال کریں۔ موجودہ ٹرانسکرپٹ ہوم اسکرین پر دستیاب رہتی ہے، اور ہر راستے کو بعد میں ترتیبات میں تبدیل کیا جا سکتا ہے۔",
  setupGuideProviderTitle: "اسناد شامل کریں۔",
  setupGuideProviderBody:
    "وہ بیرونی سروس منتخب کریں جسے آپ کنفیگر کرنا چاہتے ہیں، پھر جوابی رسائی کے ساتھ اسناد پیسٹ کریں۔",
  setupGuideProviderPickerLabel: "جوابی خدمت",
  setupGuideSelectProvider: "ایک فراہم کنندہ کو منتخب کریں۔",
  setupGuideSelectProviderFirst: "پہلے فراہم کنندہ کو منتخب کریں۔",
  setupGuideApiKeyLabel: "API کلید",
  setupGuideApiKeyPlaceholder: "اسناد چسپاں کریں۔",
  setupGuideContinue: "جاری رکھیں",
  setupGuideOpenSettings: "ترتیبات کھولیں۔",
  setupGuideBack: "پیچھے",
  setupGuideValidateKey: "کلید کی توثیق کریں۔",
  setupGuideApiKeyRequiredOrCancel:
    "جاری رکھنے کے لیے ایک API کلید شامل کریں، یا سیٹ اپ گائیڈ کو منسوخ کریں۔",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "ایک فراہم کنندہ کا انتخاب کریں اور جاری رکھنے کے لیے ایک API کلید شامل کریں، یا سیٹ اپ گائیڈ کو منسوخ کریں۔",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `یہ ${provider} اسناد جوابی درخواستوں کی اجازت نہیں دیتے ہیں۔`,
  setupGuideKokoroTitle: "ایک قدرتی آن ڈیوائس آواز شامل کریں۔",
  setupGuideKokoroBody: ({ size }) =>
    `اختیاری: Kokoro ڈاؤن لوڈ کریں (تقریباً ${size} MB) اسپیچ فراہم کنندہ یا استعمال کے چارجز کے بغیر کہیں زیادہ فطری بولے جانے والے جوابات کے لیے۔`,
  setupGuideKokoroLanguageNote:
    "یہ ماڈل فی الحال انگریزی اور سادہ چینی بولتا ہے۔ جو فال بیک روٹس آپ چاہتے ہیں انہیں بعد میں بولنے کی ترتیبات میں کنفیگر کر لیں۔",
  setupGuideKokoroDownload: "Kokoro ڈاؤن لوڈ کریں۔",
  setupGuideUseKokoro: "بولے گئے جوابات کے لیے Kokoro استعمال کریں۔",
  setupGuideUseKokoroSummary:
    "جب بھی جوابی زبان سپورٹ ہو، آواز کی تیاری فون پر ہی رکھیں۔",
  setupGuideSkipKokoro: "ابھی کے لیے چھوڑ دیں۔",
  setupGuideVoiceTestTitle: "اپنے سیٹ اپ کی جانچ کریں۔",
  setupGuideVoiceTestBody:
    "ایک مختصر جملہ کہیں۔ Mr Broccoli قابل قبول صوتی راستہ دستیاب ہونے پر مائیکروفون تک رسائی، ٹرانسکرپشن، ترتیب شدہ جوابی راستے، اور بولے جانے والے آؤٹ پٹ کی جانچ کرے گا۔",
  setupGuideVoiceTestNoInputBody:
    "اس سیٹ اپ کے ساتھ صوتی ان پٹ دستیاب نہیں ہے۔ پتہ چلنے والے راستوں کا جائزہ لینا جاری رکھیں، پھر ضرورت پڑنے پر بعد میں تقریر کی ترتیبات کو ایڈجسٹ کریں۔",
  setupGuideVoiceTestTextOnlyNote:
    "یہ ٹیسٹ صرف ٹیکسٹ ہی رہتا ہے کیونکہ ابھی تک کوئی قابل قبول بولی جانے والا صوتی راستہ تیار نہیں ہے۔",
  setupGuideVoiceTestStart: "ٹیسٹ شروع کریں۔",
  setupGuideVoiceTestStop: "ریکارڈنگ بند کریں",
  setupGuideVoiceTestRetry: "دوبارہ چلائیں۔",
  setupGuideVoiceTestTranscribing: "نقل ہو رہا ہے…",
  setupGuideVoiceTestThinking: "جواب کی جانچ ہو رہی ہے…",
  setupGuideVoiceTestSynthesizing: "آواز تیار ہو رہی ہے…",
  setupGuideVoiceTestSpeaking: "جواب چل رہا ہے…",
  setupGuideVoiceTestTranscript: "نقل",
  setupGuideVoiceTestReply: "جواب",
  setupGuideVoiceTestReset: "اس نتیجہ کو صاف کریں۔",
  setupGuideVoiceInputUnavailable:
    "اس آلہ پر اس سیٹ اپ کے لیے صوتی ان پٹ دستیاب نہیں ہے۔",
  setupGuideSummaryTitle: "سیٹ اپ مکمل",
  setupGuideSummaryBody:
    "یہ وہ راستہ ہے جو Mr Broccoli آپ کی موجودہ ترتیب کے ساتھ استعمال کرے گا۔",
  setupGuideSummaryLlm: "ایل ایل ایم",
  setupGuideSummaryStt: "تقریر سے متن",
  setupGuideSummaryTts: "متن سے تقریر",
  setupGuideSummaryWebSearch: "ویب تلاش",
  setupGuideRouteProviderLlm: ({ provider }) =>
    `${provider} کے ذریعے فعال کیا گیا۔`,
  setupGuideRouteOnDeviceStt: "سسٹم اسپیچ ریکگنیشن کے ذریعے فعال کیا گیا۔",
  setupGuideRouteProviderStt: ({ provider }) =>
    `${provider} اسپیچ ٹرانسکرپشن کے ذریعے فعال کیا گیا۔`,
  setupGuideRouteProviderTts: ({ provider }) =>
    `${provider} آواز کے ذریعے فعال کیا گیا۔`,
  setupGuideRouteKokoroTts: "Kokoro آن ڈیوائس آواز کے ذریعے فعال کیا گیا۔",
  setupGuideRouteLocalTts: "مقامی وائس پیک کے ذریعے فعال کیا گیا۔",
  setupGuideRouteUnavailable: "دستیاب نہیں۔",
  setupGuideRouteOff: "آف",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `${provider} کے ذریعے دستیاب، فی الحال آف ہے۔`,
  setupGuideSummaryTextOnlyNote:
    "بولے گئے جوابات فی الحال بند ہیں۔ جوابات اس وقت تک متن میں رہتے ہیں جب تک کہ آپ فراہم کنندہ یا مقامی آواز کو فعال نہیں کرتے ہیں۔",
  setupGuideFinish: "ہو گیا",
  searchConversationsPlaceholder: "عنوانات، ماڈلز اور پیغام کا متن تلاش کریں۔",
  noMatchingConversations: "کوئی مماثل گفتگو نہیں ہے۔",
  noMatchingConversationsDescription:
    "ٹرانسکرپٹ سے کوئی مختلف عنوان، راستہ، ماڈل یا جملہ آزمائیں۔",
  memoryModalTitle: "گفتگو کی یادداشت",
  memoryModalDescription:
    "یہ وہ مختصر خلاصہ ہے جو Mr Broccoli آگے لے کر چلتا ہے جب کوئی تھریڈ اتنا لمبا ہو جائے کہ پرانی باریوں کو سکیڑنا پڑے۔",
  memorySummary: "محفوظ کردہ خلاصہ",
  memorySummaryEmpty:
    "ابھی تک کوئی مختصر یادداشت نہیں ہے۔ جب یہ تھریڈ لمبا ہو جائے گا تو پرانی باریوں کا خلاصہ یہاں بنے گا۔",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 خلاصہ شدہ باری" : `${count} خلاصہ شدہ باریاں`,
  copyMemory: "میموری کاپی کریں۔",
  forgetMemory: "یادداشت بھول جائیں",
  memoryCopied: "میموری کاپی کر لی گئی۔",
  memoryCleared: "گفتگو کی یادداشت صاف ہو گئی۔",
  noConversationToManageYet: "ابھی تک بات چیت کی کوئی میموری دستیاب نہیں ہے۔",
  noProviderYet: "ابھی تک کوئی فراہم کنندہ نہیں ہے۔",
  noModelYet: "ابھی تک کوئی ماڈل نہیں۔",
  startedAt: "آغاز",
  endedAt: "اختتام",
  pinned: "پن لگا ہوا",
  copy: "کاپی",
  share: "شیئر کریں۔",
  rename: "نام تبدیل کریں۔",
  pin: "پن",
  unpin: "پن کھول دیں۔",
  save: "محفوظ کریں۔",
  cancel: "منسوخ کریں۔",
  stop: "روکیں",
  pause: "توقف",
  resume: "دوبارہ شروع کریں۔",
  paused: "روک دیا گیا",
  listening: "سن رہا ہے۔",
  parsing: "نقل ہو رہی ہے",
  searching: "تلاش کر رہا ہے۔",
  converting: "تبدیل کیا جا رہا ہے",
  webSearchAction: "ویب تلاش",
  thinking: "سوچ رہا ہے",
  speaking: "بول رہا ہے۔",
  pleaseWait: "برائے مہربانی انتظار کریں۔",
  yourTurn: "آپ کی باری",
  keepPressing: "دباتے رہیں",
  tapWhenDone: "ہو جانے پر تھپتھپائیں۔",
  speechPaused: "تقریر موقوف ہے۔",
  pausePlaybackUnavailable:
    "اس صوتی راستے کو موقوف نہیں کیا جا سکتا۔ اسے بند کریں یا فراہم کنندہ کے وائس آؤٹ پٹ پر سوئچ کریں۔",
  holdToSpeak: "بولنے کے لیے دبائے رکھیں",
  tapToSpeak: "بولنے کے لیے تھپتھپائیں۔",
  tapAgainToSend: "بھیجنے کے لیے دوبارہ تھپتھپائیں۔",
  waitingForReply: "جواب کا انتظار ہے۔",
  parsingYourVoice: "آپ کی آواز کو متن میں بدلا جا رہا ہے",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} ترتیبات میں کنفیگر نہیں ہے۔`,
  providerNetworkError: ({ provider, action }) =>
    `${action} کے لیے ${provider} تک نہیں پہنچ سکا۔ کنکشن چیک کریں اور دوبارہ کوشش کریں۔`,
  providerAuthError: ({ provider, action }) =>
    `${provider} نے ${action} کے لیے اسناد کو مسترد کر دیا۔ API کلید اور اجازتیں چیک کریں۔`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} ابھی ${action} کی شرح کو محدود کر رہا ہے۔ ایک لمحے میں دوبارہ کوشش کریں۔`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} کو ${action} کے لیے کافی API کریڈٹ درکار ہے۔ اکاؤنٹ بیلنس اور کلید کے خرچ کی حد چیک کریں۔`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} کو ${action} کے دوران بہت زیادہ وقت لگ گیا۔ دوبارہ کوشش کریں۔`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} کو ${action} کے دوران عارضی مسئلہ پیش آیا۔ تھوڑی دیر میں دوبارہ کوشش کریں۔`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} جواب واپس کیے بغیر ختم ہوگیا۔ دوبارہ کوشش کریں۔`,
  providerIncompleteReplyError: ({ provider }) =>
    `${provider} کا جواب مکمل ہونے سے پہلے ہی ختم ہو گیا۔ دوبارہ کوشش کریں۔`,
  providerContextTooLong: ({ provider }) =>
    `${provider} نے جواب مسترد کر دیا کیونکہ بات چیت بہت لمبی ہو گئی تھی۔ ایک نیا تھریڈ شروع کریں یا درخواست مختصر کریں۔`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} نے ${action} درخواست کو مسترد کر دیا: ${detail}`
      : `${provider} نے ${action} درخواست کو مسترد کر دیا۔`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} نے ویب تلاش کو چلائے بغیر جواب واپس کیا۔`,
  providerValidationSuccess: ({ provider }) =>
    `${provider} استعمال کے لیے تیار ہے۔`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} کام کر رہا ہے۔`,
  providerValidationFailed: "فراہم کنندہ کی توثیق ناکام ہوگئی۔",
  webSearchFallback:
    "ویب تلاش دستیاب نہیں تھی، اس لیے جواب لائیو ویب سیاق و سباق کے بغیر جاری رہا۔",
  noBase64EncoderAvailable: "کوئی base64 انکوڈر دستیاب نہیں ہے۔",
  noBase64DecoderAvailable: "کوئی base64 ڈیکوڈر دستیاب نہیں ہے۔",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS کو <key>|<region> فارمیٹ میں Azure اسپیچ کی اسناد کی ضرورت ہے، مثال کے طور پر abc123|westeurope، یا مشترکہ Azure فارمیٹ <endpoint>|<api-key>|<key>|<region>۔",
  nativeTtsDoesNotSynthesizeAudioFiles: "سسٹم TTS آڈیو فائلیں نہیں بناتا۔",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `${languageLabel} کے لیے کوئی مقامی یا کلاؤڈ وائس روٹ تیار نہیں ہے۔`,
  chooseTextToSpeechProviderInSettings:
    "سیٹنگز میں ٹیکسٹ ٹو اسپیچ فراہم کنندہ کا انتخاب کریں۔",
  ttsNotSupportedYet: ({ provider }) =>
    `${provider} TTS ابھی سپورٹ نہیں ہے۔`,
  ttsError: ({ provider, status, errorText }) =>
    `${provider} TTS ایرر (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `${provider} اسپیچ آؤٹ پٹ نے جواب کو مسترد کر دیا کیونکہ یہ بہت لمبا تھا۔`,
  ttsTimeout: ({ provider }) =>
    `${provider} اسپیچ آؤٹ پٹ نے بہت زیادہ وقت لیا۔`,
  sttTimeout: ({ provider }) =>
    `${provider} اسپیچ ٹرانسکرپشن نے بہت زیادہ وقت لیا۔`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} صرف ${limit} تک کی ریکارڈنگ قبول کرتا ہے۔ ایک چھوٹا کلپ استعمال کریں یا STT ماڈلز کو تبدیل کریں۔`,
  voiceInputCaptureIncomplete:
    "صوتی ان پٹ کو صاف طور پر کیپچر نہیں کیا جا سکا۔ براہ کرم دوبارہ کوشش کریں۔",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS نے آڈیو واپس نہیں کیا۔`,
  nativeSttHandledInApp: "سسٹم STT کو براہ راست ایپ میں ہینڈل کیا جاتا ہے۔",
  chooseSpeechToTextProviderInSettings:
    "ترتیبات میں اسپیچ ٹو ٹیکسٹ فراہم کنندہ کا انتخاب کریں۔",
  sttNotSupportedYet: ({ provider }) =>
    `${provider} STT ابھی سپورٹ نہیں ہے۔`,
  providerNotWiredUpYet: ({ provider }) =>
    `${provider} ابھی تک وائرڈ نہیں ہوا ہے۔`,
  you: "آپ",
  assistant: "اسسٹنٹ",
  untitledConversation: "بلا عنوان گفتگو",
  conversationExportHeader: ({ title }) => `گفتگو: ${title}`,
  speechRecognitionPermissionNotGranted: "تقریر کی شناخت کی اجازت نہیں دی گئی۔",
  speechRecognitionUnavailableForDeviceLanguage:
    "موجودہ آلہ کی زبان کے لیے تقریر کی شناخت دستیاب نہیں ہے۔",
  nativeSpeechRecognitionNeedsNetwork:
    "سسٹم تقریر کی شناخت کو ابھی نیٹ ورک تک رسائی درکار ہے۔",
  noSpeechDetected: "کوئی تقریر نہیں ملی۔",
  nativeSpeechRecognitionFailed: "سسٹم تقریر کی شناخت ناکام ہو گئی۔",
  couldntStartNativeSpeechRecognition:
    "سسٹم اسپیچ شناخت شروع نہیں کی جا سکی۔",
  microphonePermissionNotGranted: "مائیکروفون کی اجازت نہیں دی گئی۔",
} satisfies TranslationDictionary;
