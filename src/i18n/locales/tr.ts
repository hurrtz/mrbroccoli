import type { TranslationDictionary } from "../types";
import { dataBackupTranslations } from "../dataBackupTranslations";
import { conversationKnowledgeTranslations } from "../conversationKnowledgeTranslations";
import { conversationArtifactTranslations } from "../conversationArtifactTranslations";
import { interruptionTranslations } from "../interruptionTranslations";
import { ulraAuditTranslations } from "../ulraAuditTranslations";
import { imagePromptTranslations } from "../imagePromptTranslations";
import { onDeviceTranslations } from "../onDeviceTranslations";
import { localSpeechTranslations } from "../localSpeechTranslations";
import { settingsTranslations } from "../settingsTranslations";
import { transcriptEditTranslations } from "../transcriptEditTranslations";
import { workspaceTranslations } from "../workspaceTranslations";
import { sessionLockTranslations } from "../sessionLockTranslations";

export const tr = {
  ...conversationArtifactTranslations.tr,
  ...interruptionTranslations.tr,
  ...ulraAuditTranslations.tr,
  ...dataBackupTranslations.tr,
  ...conversationKnowledgeTranslations.tr,
  ...imagePromptTranslations.tr,
  ...onDeviceTranslations.tr,
  ...localSpeechTranslations.tr,
  ...settingsTranslations.tr,
  ...transcriptEditTranslations.tr,
  ...workspaceTranslations.tr,
  ...sessionLockTranslations.tr,
  appName: "Bay Brokoli",
  retry: "Yeniden dene",
  dismiss: "Kapat",
  done: "Tamam",
  aboutSetting: ({ setting }) => `${setting} Hakkında`,
  unavailable: "Kullanılamıyor",
  selection: "Seçim",
  chooseCompatibleProviderFirst: "Önce uyumlu bir sağlayıcı seç",
  settings: "Ayarlar",
  settingsReleaseVersion: ({ version }) => `Sürüm ${version}`,
  all: "Hepsi",
  instructions: "Talimatlar",
  providers: "Sağlayıcılar",
  webSearch: "Web Araması",
  stt: "STT",
  tts: "TTS",
  ui: "Arayüz",
  settingsRuntimeReadiness: "Çalışma zamanı hazırlığı",
  settingsReadinessThink: "Düşün",
  settingsReadinessListen: "Dinle",
  settingsReadinessSpeak: "Konuş",
  settingsReadinessSearch: "Ara",
  settingsReadinessReady: "Hazır",
  settingsReadinessNeedsAttention: "Dikkat",
  settingsReadinessBroken: "Sorunlu",
  settingsReadinessOff: "Kapalı",
  settingsConnections: "Bağlantılar",
  settingsThinking: "Düşünme",
  settingsListening: "Dinleme",
  settingsSpeaking: "Konuşma",
  settingsSearch: "Ara",
  settingsAppDiagnostics: "Uygulama ve tanılama",
  settingsGuidedSetup: "Kılavuzlu kurulum",
  settingsGuidedSetupSummary:
    "Bağlantıları incele ve ses yolunun tamamını test et.",
  setupGuideShowInSettings: "Ayarlar'da rehberli kurulumu göster",
  setupGuideShowInSettingsSummary:
    "Ayarlara genel bakışta rehberli kurulum kısayolunu göster veya gizle.",
  settingsConnectionsSummary: "Sağlayıcı anahtarları, doğrulama ve yetenekler.",
  settingsThinkingSummary: "Ev kartları, modeller, çaba ve sistem istemi.",
  settingsListeningSummary: "Giriş modu ve konuşmayı metne yönlendirme.",
  settingsSpeakingSummary: "Sözlü yanıtlar, oynatma, sesler ve önizlemeler.",
  settingsSearchSummary: "Web arama sağlayıcısı ve arama kalite kontrolleri.",
  settingsAppDiagnosticsSummary:
    "Tema, dil, kullanım, hata ayıklama günlükleri ve son etkinlikler.",
  settingsBackToOverview: "Genel bakışa geri dön",
  settingsOpenSection: ({ section }) => `${section} bölümünü aç`,
  theme: "Tema",
  language: "Dil",
  recognitionLanguage: "Tanıma dili",
  recognitionLanguageHint:
    "Tanıma işlemini geliştirmek için bir dil seç veya cihaz ya da sağlayıcı tespiti için otomatik olarak bırak.",
  automaticLanguage: "Otomatik",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider}, bu konuşma yolu için ${language} dilini resmi olarak desteklemiyor.`,
  usageStats: "Kullanım İstatistikleri",
  model: "Model",
  effort: "Çaba",
  effortValue: ({ effort }) => `Çaba: ${effort}`,
  modelEffortNone: "Yok",
  modelEffortMinimal: "Asgari",
  modelEffortLow: "Düşük",
  modelEffortMedium: "Orta",
  modelEffortHigh: "Yüksek",
  modelEffortExtraHigh: "Ekstra yüksek",
  modelEffortMax: "Maksimum",
  modelEffortDynamic: "Dinamik",
  modelEffortDisabled: "Devre dışı",
  modelEffortEnabled: "Etkin",
  fixed: "Sabit",
  english: "İngilizce",
  german: "Almanca",
  ukrainian: "Ukraynaca",
  hindi: "Hintçe",
  spanish: "İspanyolca",
  french: "Fransızca",
  italian: "İtalyanca",
  portuguese: "Portekizce",
  portugueseBrazil: "Portekizce (Brezilya)",
  russian: "Rusça",
  simplifiedChinese: "Basitleştirilmiş Çince",
  arabic: "Arapça",
  japanese: "Japonca",
  hungarian: "Macarca",
  czech: "Çekçe",
  polish: "Lehçe",
  turkish: "Türkçe",
  swedish: "İsveççe",
  urdu: "Urduca",
  kokoroAmericanFemaleVoice: ({ name }) => `${name} · Amerikalı kadın`,
  kokoroBritishFemaleVoice: ({ name }) => `${name} · İngiliz kadın`,
  kokoroChineseFemaleVoice: ({ index }) => `Çinli kadın ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `Çinli erkek ${index}`,
  light: "Açık",
  dark: "Koyu",
  system: "Sistem",
  languageCoverage: ({ note }) => `Dil kapsamı: ${note}`,
  recordingLimits: ({ note }) => `Kayıt sınırları: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Fiyatlandırma: ${summary}`,
  replyGenerationAction: "yanıt oluşturma",
  speechTranscriptionAction: "konuşma transkripsiyonu",
  speechSynthesisAction: "konuşma sentezi",
  instructionsTabDescription:
    "Herhangi bir sağlayıcı talebi görmeden önce asistanı yönlendiren gizli kılavuzu şekillendir.",
  providersTabDescription:
    "Harici hizmet kimlik bilgilerini cihazda sakla ve kullanmak istediğin yanıt modlarını yapılandır.",
  webSearchTabDescription:
    "Yanıtlardan önce isteğe bağlı canlı web içeriğini yapılandır.",
  responseModes: "Model Seçimi",
  aboutModelSelection: "Model seçimi hakkında",
  modelSelectionInfo:
    "Her model kartı ana ekranda bir seçim haline gelir. Sağlayıcısını, modelini ve isteğe bağlı efor düzeyini yapılandır, ardından hangi modelin yanıt vereceğini seçmek için kartları değiştir.",
  responseModeItemTitle: ({ index }) => `Model ${index}`,
  addResponseMode: "Model ekle",
  removeResponseMode: "Modeli kaldır",
  responseModesNoConfiguredProviders:
    "Önce kimlik bilgilerini ekle. Rota kontrolleri, en az bir uyumlu hizmet yapılandırılana kadar gizli kalır.",
  useResponseMode: ({ mode }) => `${mode} seçeneğini kullan`,
  chooseResponseModel: "Bir model seç",
  responseModelCount: ({ count }) => `${count} model mevcut`,
  ulraMode: "Süper Mod",
  ulraModeHomeLabel: "Süper Modu ana ekranda göster",
  ulraModeSettingsDescription:
    "Ana ekrandaki en az iki model hazır olduğunda çok modelli değerlendirmeye izin verir.",
  ulraModeInfo:
    "Süper Mod önce ana ekrandaki her hazır modele ayrı ayrı sorar. Her turda modeller, her katılımcının en son görüşünü eleştirel biçimde sınar; açık ve oybirliğiyle uzlaşma sağlanırsa kalan turlar atlanır. Seçili model, her modelin en son görüşünü daima koruyarak başarılı turlardan nihai yanıtı sentezler. Değerlendirme, ilgili tüm sağlayıcılarla paylaşılır.",
  ulraModeRounds: "İnceleme turları",
  ulraModeCallEstimate: ({ count }) =>
    `Mevcut ayarla mesaj başına en fazla ${count} model çağrısı.`,
  ulraModeThresholdWarning:
    "4'ten fazla model veya 3'ten fazla tur çok uzun sürebilir, çok sayıda token tüketebilir ve sağlayıcıların bağlam ya da hız sınırlarına ulaşabilir. Bu yalnızca bir uyarıdır.",
  ulraModeFirstUseTitle: "Süper Mod etkinleştirilsin mi?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `${models} model ve en fazla ${rounds} inceleme turuyla bir mesaj en fazla ${calls} model çağrısı yapabilir. Çok daha uzun sürebilir, belirgin biçimde daha pahalı olabilir ve değerlendirmeyi ilgili tüm sağlayıcılarla paylaşabilir.`,
  ulraModeHighRiskTitle: "Büyük Süper Mod çalıştırması",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} model ve ${rounds} inceleme turu en fazla ${calls} model çağrısı yapabilir. Bu çok uzun sürebilir, çok sayıda token kullanabilir ve sağlayıcı sınırlarına ulaşabilir. Yine de devam edilsin mi?`,
  ulraModeEnableAction: "Etkinleştir",
  ulraModeNeedsTwoModels:
    "Süper Mod için ana ekranda en az iki hazır model gerekir.",
  ulraModeAllModelsFailed:
    "Bir yanıt sentezlenemeden önce tüm Süper Mod modelleri başarısız oldu.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} dahili model çağrısı başarısız oldu; son yanıt ${succeeded} başarılı katkıyı kullandı.`,
  sttTabDescription:
    "Konuşmanın nasıl yakalandığını ve modele ulaşmadan önce hangi arka ucun sesi metne dönüştürdüğünü kontrol et.",
  ttsTabDescription:
    "Yanıtların ne zaman konuşmaya başlayacağını ve sözlü çıktıyı hangi arka ucun işleyeceğini kontrol et.",
  brief: "Kısa",
  briefDescription:
    "Cevabı sıkı tut. Kullanıcıya tam olarak cevap vermek için gereken minimum cümle sayısını kullan.",
  normal: "Normal",
  normalDescription:
    "Dengeli bir yanıt uzunluğunu hedefle. Cevabı uzatmadan önemli noktaları ele al.",
  thorough: "Kapsamlı",
  thoroughDescription:
    "Derinlere inin ve kapsamlı ol. Nüansları, ayrıntıları, ödünleşimleri ve önemli olan mantığı ekle.",
  professional: "Profesyonel",
  professionalDescription:
    "Müşteriye brifing veren kıdemli bir danışman gibi konuş. Kesin bir dil, argo yok, ölçülü ve otoriter.",
  casual: "Gündelik",
  casualDescription:
    "Kafedeki akıllı bir arkadaş gibi konuş. Rahat, doğal, sohbet havasında. Günlük konuşma kalıpları da konudan sapmalar da sor değil.",
  nerdy: "İnek",
  nerdyDescription:
    "Derinlere inmeyi seven coşkulu bir uzman gibi konuş. Teknik terimleri özgürce kullan, ayrıntılara coşkuyla dal, kullanıcının size ayak uydurabileceğini varsay.",
  concise: "Kısa",
  conciseDescription:
    "Hala eksiksizken mümkün olduğunca kısa ol. Önsöz yok, dolgu yok, sadece cevap. Telgraf stilini düşün.",
  socratic: "Sokratik",
  socraticDescription:
    "Kullanıcının düşüncesine meydan oku. Karşı sorular sor, alternatif bakış açıları sun, sadece söylediklerini onaylama. Bir evet makinesi değil, tartışma ortağı ol.",
  eli5: "ELI5",
  eli5Description:
    "Her şeyi olabildiğince basit bir şekilde açıkla. Analojiler, günlük dil ve sıfır jargon kullan. Herhangi bir konu hakkında önceden bilgi sahibi olmadığını varsay.",
  useProvider: ({ provider }) => `${provider} sağlayıcısını kullan`,
  createApiKey: "Kimlik bilgileri",
  apiKey: "API anahtarı",
  aboutThisProvider: "Bu sağlayıcı hakkında",
  openRouterGatewayTitle: "Tek anahtar, birden fazla sağlayıcı",
  openRouterGatewayDescription:
    "Özel bir OpenRouter anahtarı oluştur, aşağıya yapıştır ve herhangi bir doğrudan bağlantıyı değiştirmeden çeşitli sağlayıcıların anlık görüntü destekli modellerini kullan.",
  openRouterGatewayRoute:
    "Talep yolu: bu cihaz → OpenRouter → seçilen yukarı akış sağlayıcısı",
  openRouterKeys: "OpenRouter anahtarları",
  providerStatusInvalid: "Geçersiz",
  providerStatusTesting: "Test ediliyor",
  providerStatusConfigured: "Yapılandırılmış",
  providerStatusWorking: "Çalışıyor",
  providerStatusNotTested: "Test edilmedi",
  providerStatusNotSetup: "Kurulmadı",
  expandProvider: ({ provider }) => `${provider} bölümünü genişlet`,
  collapseProvider: ({ provider }) => `${provider} bölümünü daralt`,
  testProviderKey: "Anahtarı test et",
  testAllCapabilities: "Tümünü test et",
  apiTest: "API testi",
  testProviderCapability: ({ capability }) => `${capability} özelliğini test et`,
  test: "Test",
  optional: "İsteğe bağlı",
  providerCapability_llm: "Yanıtlar",
  providerCapability_stt: "Konuşma girişi",
  providerCapability_tts: "Ses çıkışı",
  providerCapability_search: "Web araması",
  providerCapability_voices: "Ses kitaplığı",
  providerValidationUnavailable:
    "Bu sağlayıcı için canlı doğrulama henüz sağlanmadı. Anahtarı buraya kaydet ve gerçek kullanım sırasında doğrula.",
  providerNeedsAttention: "dikkat edilmesi gerekiyor",
  catalogProviderLimitsSummary: ({ summary }) => `Limitler: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Bölge: ${summary}`,
  validatingKey: "Doğrulanıyor...",
  showKey: "Anahtarı göster",
  hideKey: "Anahtarı gizle",
  assistantInstructions: "Asistan Talimatları",
  systemPrompt: "Sistem İstemi",
  aboutSystemPrompt: "Sistem istemi hakkında",
  assistantInstructionsIntro:
    "Modelin her yanıttan önce aldığı gizli rehberliği şekillendir.",
  baseInstructions: "Temel Talimatlar",
  assistantInstructionsPlaceholder:
    "Asistanın nasıl davranması gerektiğini tanımla.",
  assistantInstructionsHint:
    "Bu her zaman seçilen yanıt uzunluğu ve tonun önüne eklenir.",
  adaptiveLength: "Uyarlanabilir Uzunluk",
  responseTone: "Yanıt Tonu",
  homeStyleChipLabel: ({ tone, length }) => `Stil — ${tone} · ${length}`,
  styleSheetTitle: "Konuşma ayarları",
  styleSheetSubtitle:
    "Yalnızca bu görüşme için yanıtları ve konuşmayı şekillendir.",
  openStyleSheet: "Konuşma ayarlarını aç",
  conversationThinkingInstructions: "Düşünme talimatları",
  conversationThinkingInstructionsDescription:
    "Bu görüşme için genel sistem isteminden sonra talimatları ekle.",
  conversationThinkingInstructionsPlaceholder:
    "Örneğin: Varsayımlarıma meydan oku ve somut örnekler kullan.",
  ttsInstructions: "Konuşma iletimi talimatları",
  ttsInstructionsDescription:
    "Uyumlu konuşma modellerinin kullandığı tonu, tempoyu, aksanı veya konuşmayı yönlendir.",
  conversationTtsInstructionsDescription:
    "Bu görüşme için genel konuşma talimatlarının sonrasına teslimat talimatlarını ekle.",
  ttsInstructionsPlaceholder:
    "Örneğin: Sıcak, net ve rahat bir tempoda konuş.",
  ttsInstructionsUnsupported:
    "Mevcut konuşma rotası iletim talimatlarını desteklemiyor.",
  conversationVoiceDescription: ({ route }) =>
    `Bu görüşmede ${route} tarafından kullanılan sesi seç.`,
  scrollToLatest: "En son mesaja ilerle",
  conversationTitleGenerate: "Başlığı otomatik oluştur",
  conversationTitleGenerating: "Başlık oluşturuluyor…",
  conversationTitleGenerated: "Görüşme yeniden adlandırıldı.",
  conversationTitleNeedsContent:
    "Bir başlık oluşturmadan önce bir konuşma başlat.",
  conversationTitleNeedsProvider:
    "Bir başlık oluşturmadan önce seçilen modeli yapılandır.",
  conversationTitleGenerationFailed: "Konuşma başlığı oluşturulamadı.",
  conversationTitleGenerationTimedOut:
    "Başlık oluşturma çok uzun sürdü. Lütfen tekrar dene.",
  inputMode: "Giriş Modu",
  voiceInput: "Ses Girişi",
  pushToTalk: "Bas Konuş",
  pushToTalkDescription:
    "Konuşurken ana düğmeyi basılı tut, ardından göndermek için bırak.",
  toggleToTalk: "Konuşmaya Geç",
  toggleToTalkDescription:
    "Kaydı başlatmak için bir kez dokun ve işiniz bittiğinde tekrar dokun.",
  driveSession: "Sürüş Oturumu",
  driveSessionDescription:
    "Otomatik devam etme açıkken, kayıt her sözlü yanıttan sonra başlar. Konuşmanız bittiğinde ana düğmeye dokun.",
  stopDriveSession: "Otomatik duraklat",
  repeatDriveReply: "Sonuncuyu tekrarla",
  continueDriveSession: "Otomatik devam ettir",
  driveSendsIn: ({ seconds }) => `${seconds} saniye içinde gönderilir…`,
  speechToText: "Konuşmadan Metne",
  appNative: "Sistem Tanıma",
  nativeSttDescription:
    "İşletim sisteminin konuşma tanıyıcısını kullan.",
  provider: "Sağlayıcı",
  webSearchProvider: "Web Arama Sağlayıcısı",
  webSearchProviderMissingHint:
    "Burada canlı web bağlamını etkinleştirmek için Kimlik Bilgileri'nde en az bir arama özellikli hizmeti yapılandır.",
  webSearchModelHint: ({ model }) =>
    `Canlı web bağlamı için perde arkasında ${model} modelini kullanır.`,
  webSearchHomeHint:
    "Bu konu için canlı web bağlamını açmak veya kapatmak için ana ekran geçişini kullan.",
  settingsWebSearchCompactHint:
    "İsteğe bağlı olarak, ana model yanıt vermeden önce yeni web bağlamını başına ekle.",
  webSearchAdvanced: "Gelişmiş Arama Kontrolleri",
  expandAdvancedSearch: "Gelişmiş arama kontrollerini genişlet",
  collapseAdvancedSearch: "Gelişmiş arama kontrollerini daralt",
  webSearchSetupNeeded:
    "Canlı web aramasını kullanmak için kimlik bilgileri ekle.",
  webSearchEnabledDescription:
    "Model yanıt vermeden önce yeni web içeriği eklenir.",
  webSearchDisabledDescription:
    "Güncel gerçekler önemli olduğunda bu başlık için canlı web içeriğini kullan.",
  webSearchNobodyDescription:
    "Web isteği yok. Modelin bildikleriyle yanıtlar.",
  webSearchQualityControls: "Arama Kalitesi",
  webSearchSearchMode: "Arama Modu",
  webSearchSearchModeQuick: "Hızlı",
  webSearchSearchModeBalanced: "Dengeli",
  webSearchSearchModeDeep: "Derin",
  webSearchDepth: "Arama Derinliği",
  webSearchDepthStandard: "Standart",
  webSearchDepthDeep: "Derin",
  webSearchResultCount: "Sonuç Sayısı",
  webSearchQualityHint: ({ provider }) =>
    `Bu kontroller, ${provider}'nin yanıttan önce yeni bağlamı nasıl topladığını ayarlar.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} henüz bu uygulamada ekstra arama kalitesi kontrollerini göstermiyor.`,
  setWebSearchMode: ({ mode }) => `Web arama modunu ${mode} olarak ayarla`,
  openWebSearchSettings: "Web arama ayarlarını aç",
  providerSttDescription:
    "Sesinizi yanıt yoluna gönderilmeden önce yazıya dönüştürmek için yapılandırılmış bir harici hizmet kullan.",
  sttProvider: "STT Sağlayıcısı",
  sttProviderEnabledHint:
    "Burada yalnızca transkripsiyon desteğine sahip etkin sağlayıcılar görünür.",
  sttProviderMissingHint:
    "Burada seçmek için STT desteği olan bir hizmete ilişkin kimlik bilgilerini ekle.",
  nativeSttHint:
    "Sistem tanıma, sağlayıcı anahtarlarınızdan bağımsız olarak çalışır ve cihaz üzerinde veya işletim sisteminin konuşma hizmeti tarafından işlenebilir.",
  replyPlayback: "Yanıt Oynatma",
  sentencesArrive: "Paragraflar Geliyor",
  sentencesArriveDescription:
    "Tam bir paragraf hazır olur olmaz konuşmaya başla.",
  fullReplyFirst: "Önce Tam Yanıt",
  fullReplyFirstDescription:
    "Önce cevabın tamamını oluştur, ardından tek geçişte oynat.",
  textToSpeech: "Metinden Konuşmaya",
  spokenReplies: "Sözlü Yanıtlar",
  spokenRepliesEnabledDescription:
    "Bir ses rotası mevcut olduğunda asistan yanıtlarını sesli oku.",
  spokenRepliesDisabledDescription:
    "Yanıtları şimdilik yalnızca metin halinde tut. Tercih ettiğin TTS rotası daha sonra kullanılmak üzere kayıtlı kalır.",
  nativeTtsDescription:
    "Sözlü yanıtlar ve ses önizlemesi için cihazın konuşma motorunu kullan.",
  kokoroTtsDescription:
    "Tamamen bu cihazda çalışan çok daha doğal bir nöral ses kullan. Sözlü yanıt metni, konuşma sağlayıcı anahtarı veya kullanım ücreti olmaksızın yerel olarak sentezlenir.",
  kokoroVoices: "Kokoro Cihaz İçi Sesler",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `Çok dilli model yaklaşık ${size} MB indirir ve kurulumdan sonra yaklaşık ${installedSize} MB yer kaplar.`,
  kokoroModel: "Kokoro çok dilli model",
  kokoroChecking: "Cihaz modeli kontrol ediliyor…",
  kokoroDownloading: ({ progress }) => `İndiriliyor... ${progress}%`,
  kokoroExtracting: ({ progress }) => `Yükleniyor… ${progress}%`,
  kokoroVerifying: "Ses motoru doğrulanıyor…",
  kokoroInstalled: "Bu cihaza yüklendi ve hazır.",
  kokoroNotInstalled:
    "Kokoro'yu seçmeden veya kullanmadan önce modeli indirip doğrula. Sağlayıcı anahtarı gerekmez.",
  kokoroLanguageFallback:
    "Kokoro şu anda burada İngilizce ve Basitleştirilmiş Çince konuşmaktadır. Seçilen diğer yanıt dilleri için açık bir geri dönüş yolu ekle, aksi takdirde konuşma bir hatayla duracaktır.",
  kokoroRemoveTitle: "Kokoro modeli kaldırılsın mı?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Bu, yaklaşık ${installedSize} MB yer açar. Modeli istediğin zaman tekrar indirebilirsin.`,
  removeKokoroModel: "Kokoro modelini kaldır",
  downloadKokoroModel: "Kokoro modelini indir",
  kokoroFallbackNeeded: ({ languages }) =>
    `Aşağıdakiler için açık bir geri dönüş rotası gereklidir: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Kokoro sesini yapılandırmak için Dinleme Dilleri altında İngilizce veya Basitleştirilmiş Çince'yi seç.",
  expandVoiceSettings: ({ language }) =>
    `${language} ses ayarlarını genişlet`,
  collapseVoiceSettings: ({ language }) => `${language} ses ayarlarını daralt`,
  remove: "Kaldır",
  voiceOutputDescription:
    "Sözlü yanıtlar için konuşma motorunu, dinleme dillerini ve ses önizlemelerini seç.",
  localTts: "Yerel",
  localTtsDescription:
    "Sözlü yanıtlar için eşleşen, indirilmiş bir yerel ses kullan.",
  providerTtsDescription:
    "Sözlü yanıtlar için seçilen yapılandırılmış hizmeti kullan.",
  ttsFallbackRoutes: "Geri dönüş rotaları",
  ttsFallbackRoutesHint:
    "İsteğe bağlı. Yalnızca istediğin rotaları, denenmeleri gereken sıraya göre ekle. Rota konuşmaya başladığında yanıtın geri kalanı boyunca rota üzerinde kalırım.",
  ttsFallbackNone:
    "Hiçbir geri dönüş yapılandırılmadı. Bunun yerine bir ses hatası gösterilecektir.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `${route} yedek ekle`,
  removeFallbackRoute: ({ route }) => `${route} yedeğini kaldır`,
  moveFallbackEarlier: ({ route }) => `${route} rotasını daha öne taşı`,
  moveFallbackLater: ({ route }) => `${route} rotasını daha arkaya taşı`,
  ttsProvider: "TTS Sağlayıcısı",
  ttsProviderEnabledHint:
    "Burada yalnızca sesli yanıt desteğine sahip etkin sağlayıcılar görünür.",
  ttsProviderMissingHint:
    "Burada seçmek için TTS desteğine sahip bir hizmete ilişkin kimlik bilgilerini ekle.",
  localTtsOrderHint:
    "Yalnızca açıkça yapılandırılmış geri dönüş yolları denenir.",
  providerTtsOrderHint:
    "Yalnızca açıkça yapılandırılmış geri dönüş yolları denenir.",
  nativeTtsHint:
    "Sistem TTS'si, işletim sisteminin ses yığınını kullanır ve sağlayıcı anahtarı gerektirmez.",
  localTtsLanguageCoverageHint:
    "Yerel paketler şu anda İngilizce, Almanca, Basitleştirilmiş Çince, İspanyolca, Portekizce, Hintçe, Fransızca ve İtalyancayı kapsamaktadır.",
  ttsVoice: "TTS Sesi",
  refresh: "Yenile",
  providerVoiceDirectory: ({ provider }) => `${provider} ses kitaplığı`,
  refreshProviderVoices: ({ provider }) => `${provider} seslerini yenile`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${provider} üzerinden ${count} ses kullanılabilir`,
  providerVoicesLoadFailed:
    "Sesler yenilenemedi. Mevcut seçimin değişmedi; yine de manuel olarak bir ses kimliği girebilirsin.",
  providerVoicesLoadFailedWithFallback:
    "Hesap sesleri yüklenemedi. Dahili ses kullanılabilir durumda kalır.",
  providerVoicesErrorDetail: ({ detail }) => `Sebep: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "ElevenLabs'de bu API anahtarını düzenle ve Sesler → Oku'yu etkinleştir, ardından burayı yenile.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Mevcut sesleri ${provider} hizmetinden otomatik olarak yüklerim.`,
  providerVoiceId: "Ses Kimliği",
  providerVoiceIdPlaceholder: "Bir ses kimliği gir",
  providerVoiceIdFallbackHint:
    "Ses kitaplığı yüklenemediğinde manuel giriş kullanılabilir durumda kalır.",
  providerVoiceIdRequired: ({ provider }) =>
    `Konuşma çıkışını kullanmadan önce ${provider} ses kitaplığını yenile veya bir ses kimliği gir.`,
  qwenSpeechUnavailableInUs:
    "Mevcut Qwen konuşma yollarım ABD bölgesinde kullanılamıyor. Qwen konuşması için Singapur veya Pekin'i seç.",
  qwenApiRegion: "Qwen API Bölgesi",
  qwenRegionSingapore: "Singapur",
  qwenRegionUs: "ABD (Virginia)",
  qwenRegionBeijing: "Çin (Pekin)",
  qwenRegionHint:
    "Seçilen bölge, bu API anahtarının oluşturulduğu bölgeyle eşleşmelidir.",
  qwenRegionUsSpeechHint:
    "ABD bölgesi anahtarları burada sohbeti ve web aramasını destekler. Mevcut Qwen STT ve TTS rotalarım, Singapur veya Pekin anahtarı gerektirir.",
  providerDefaultVoiceHint:
    "Bu sağlayıcı şu anda önizleme ve sesli yanıtlar için varsayılan sesini kullanıyor.",
  listenLanguages: "Dinleme Dilleri",
  listenLanguagesHint:
    "Kulağa hoş gelmesini istediğin yanıt dillerini seç. Konuşma çıkışını yönlendirirken bunları bu sırayla denerim.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 dil seçildi" : `${count} dil seçildi`,
  localVoicePacks: "Yerel Ses Paketleri",
  localVoicePacksHint:
    "Her dil kendi yerel sesini korur. O dil için istediğin sesi seç ve ardından yalnızca gerçekten önemsediğin paketleri indir.",
  localVoiceForLanguage: ({ languageLabel }) => `${languageLabel} için Ses`,
  providerVoicePreviews: "Sağlayıcı Ses Önizlemeleri",
  providerVoicePreviewsHint:
    "Şu anda seçili olan TTS rotasını her yanıt dili için ayrı bir önizleme metniyle burada test et.",
  nativeVoicePreviewSection: "Yerel Ses Önizlemesi",
  nativeVoicePreviewSectionHint:
    "Bu, doğrudan telefonun yerleşik konuşma sentezleyicisi aracılığıyla konuşur, böylece onu yapılandırılmış sağlayıcı sesleriyle karşılaştırabilirsin.",
  nativeVoiceUnavailable:
    "Bu cihaz, önizleme için herhangi bir yerel sistem sesini bildirmedi.",
  runtimeCompatibilityOverrides: "Çalışma zamanı uyumluluğu",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `Sağlayıcının kullanılamadığını doğruladığı ${count} model veya ayar yapılandırması yalnızca bu cihazda devre dışı. Bunları otomatik olarak atlarım.`,
  clearRuntimeCompatibilityOverrides: "Çalışma zamanı uyumluluğunu temizle",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "Çalışma zamanı uyumluluğu temizlensin mi?",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "Daha önce devre dışı bırakılan yapılandırmalar yeniden denenebilir. Sağlayıcı bunları tekrar reddedebilir.",
  speechDiagnostics: "Son Konuşma Etkinliği",
  speechDiagnosticsHint:
    "En son konuşma isteklerini, istedikleri rotayı, fiilen kullandıkları rotayı ve geri dönüş nedenlerini gösterir.",
  clearSpeechDiagnostics: "Son konuşma etkinliğini temizle",
  speechDiagnosticsEmpty:
    "Henüz yeni konuşma isteği yok. Burada yönlendirme ayrıntılarını görmek için bir sesi önizle veya bir yanıtı oynat.",
  clearSpeechDiagnosticsConfirmationTitle:
    "Son konuşma etkinliği temizlensin mi?",
  clearSpeechDiagnosticsConfirmationMessage:
    "Bu, yakalanan tüm konuşma yönlendirme tanılamalarını kaldırır. Bu eylem geri alınamaz.",
  speechDiagnosticSourceConversation: "Konuşma yanıtı",
  speechDiagnosticSourceRepeat: "Yanıtı tekrarla",
  speechDiagnosticSourcePreview: "Ses önizlemesi",
  speechDiagnosticSourceUnknown: "Konuşma isteği",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `İstenen: ${requested} -> Gerçek: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Son aşama: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) => `Dil: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Sağlayıcı: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Ses: ${voice}`,
  localTtsPackReady: "Bu cihazda yüklü.",
  localTtsPackBroken:
    "İndirildi, ancak bu ses bu cihazda yerel doğrulamada başarısız oldu. Yeniden indir veya başka bir ses seç.",
  localTtsPackMissing:
    "Henüz kurulmadı. Siz indirene kadar bulut TTS veya sistem sesi kullanılır.",
  localTtsUnsupportedLanguageFallback:
    "Bu dil için henüz yerel bir paket mevcut değil. Bulut TTS veya sistem sesi bunu üstlenir.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Yerel paket indiriliyor... ${progress}%`,
  download: "İndir",
  downloadingShort: "Yükleniyor...",
  voicePreviewText: "Ses Önizleme Metni",
  voicePreviewPlaceholder: "Bu sesi duymak için bir cümle yaz.",
  voicePreviewHint:
    "Dil modeline herhangi bir şey göndermeden, seçili olan yanıt sesi arka ucunu kullanır.",
  previewVoice: "Sesi Önizle",
  generatingPreview: "Önizleme oluşturuluyor...",
  playingPreview: "Önizleme oynatılıyor...",
  systemVoice: "Sistem sesi",
  spokenRepliesOff: "Yalnızca metin",
  noTtsProvider: "TTS sağlayıcısı yok",
  nothingToCopyYet: "Henüz kopyalanacak bir şey yok.",
  couldntCopyText: "Bu metin kopyalanamadı.",
  nothingToShareYet: "Henüz paylaşılacak bir şey yok.",
  couldntShareText: "Bu metin paylaşılamadı.",
  couldntReplayReply: "Bu yanıt tekrar oynatılamadı.",
  replyFailed: "Yanıt başarısız oldu",
  retryReply: "Yanıtı yeniden dene",
  replyFailedHint:
    "Tekrar denemeden önce yukarıdan başka bir model seçebilirsin.",
  spokenReplyFailed: "Yanıt kaydedildi ancak söylenemedi.",
  retrySpeech: "Konuşmayı yeniden dene",
  openSpeakingSettings: "Konuşma ayarları",
  messageCopied: "Mesaj kopyalandı.",
  noConversationToCopyYet: "Henüz kopyalanacak konuşma yok.",
  noConversationToShareYet: "Henüz paylaşılacak bir konuşma yok.",
  noReplyToRepeatYet: "Tekrar oynatmaya henüz yanıt yok.",
  threadCopied: "Konu kopyalandı.",
  threadRenamed: "Konu yeniden adlandırıldı.",
  threadPinned: "Konu sabitlendi.",
  threadUnpinned: "Konunun sabitlemesi kaldırıldı.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Bu rotayı kullanmadan önce Ayarlar'da ${provider} için kimlik bilgilerini ekle.`,
  configureCredentialsBeforeVoiceSession:
    "Sesli oturum başlatmadan önce Ayarlar'a kimlik bilgilerini ekle.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `${provider} için sağlayıcı temel URL'sini ve API anahtarını https://uc-noktaniz.example.com|api-anahtariniz biçiminde gir.`,
  speechRecognitionUnavailableOnDevice:
    "Bu cihazda konuşma tanıma kullanılamıyor.",
  debugLogLabel: "GÜNLÜK",
  debugLogCaptureStarted: "Hata ayıklama günlüğü başlatıldı.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Hata ayıklama günlüğü ${fileName} olarak kaydedildi ve panoya kopyalandı (${entryCount} giriş).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Hata ayıklama günlüğü ${fileName} (${entryCount} giriş) olarak kaydedildi.`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Önceki hata ayıklama günlüğü ${fileName} kurtarıldı ve panoya kopyalandı (${entryCount} giriş).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Önceki hata ayıklama günlüğü ${fileName} (${entryCount} giriş) kurtarıldı.`,
  debugLogCaptureFailed: "Hata ayıklama günlüğü kaydedilemedi.",
  chooseSttBeforeVoiceSession:
    "Sesli oturum başlatmadan önce Ayarlar'da yapılandırılmış bir STT rotası seç.",
  chooseTtsBeforeSpokenReplies:
    "Sözlü yanıtları kullanmadan önce Ayarlar'da yapılandırılmış bir TTS rotası seç.",
  stopSessionBeforeReplay:
    "Son yanıtı tekrar oynatmadan önce aktif ses oturumunu durdur.",
  couldntCatchThatTryAgain: "Yakalanamadı, tekrar dene.",
  couldntStartVoiceInput: "Ses girişi başlatılamadı.",
  couldntProcessVoiceInput: "Ses girişi işlenemedi.",
  maxRecordingLengthReached:
    "Maksimum kayıt uzunluğuna ulaşıldı — elimdekileri gönderiyorum.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Bu kayıt, ${provider} konuşmayı metne dönüştürme için çok uzun (maks. ${limit}). Daha kısa bir mesaj dene veya Konuşmayı Metne Dönüştürme özelliğini Sistem Tanıma olarak değiştir.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Bu rotayı kullanmadan önce Ayarlar'da ${provider} için kimlik bilgilerini ekle.`,
  stopSessionBeforePreview:
    "Bir sesi önizlemeden önce aktif ses oturumunu durdur.",
  chooseTtsToPreviewVoices:
    "Sesleri önizlemek için Ayarlar'da yapılandırılmış bir TTS rotası seç.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Önce seçilen ${languageLabel} yerel sesi indir.`,
  couldntPreviewVoice: "Sesin önizlemesi yapılamadı.",
  spokenRepliesDisabled: "Sözlü yanıtlar Ayarlar'da kapatılmıştır.",
  providerVoiceFallback:
    "Yapılandırılmış ses rotası başarısız oldu. Bu yanıt için yedek sese geçildi.",
  localVoiceFallback:
    "Yerel ses kullanılamıyor. Bu yanıt için yedek sese geçildi.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `${languageLabel} yerel ses paketi yüklü.`,
  localTtsPackInstallFailed: "Yerel ses paketi yüklenemedi.",
  clear: "Temizle",
  voiceOutput: "Ses Çıkışı",
  speechReplayCache: "Konuşma yeniden oynatma önbelleği",
  speechReplayCacheDescription:
    "Sağlayıcının ürettiği konuşma bu cihazda 14 güne kadar kalır; böylece bir yanıtı tekrar oynatmak yeniden konuşma kredisi harcamaz.",
  clearSpeechReplayCache: "Konuşma önbelleğini temizle",
  speechReplayCacheCleared: "Önbellekteki konuşma dosyaları silindi.",
  speechReplayCacheClearFailed: "Konuşma önbelleği temizlenemedi.",
  listeningToYourVoice: "Sesin dinleniyor",
  parsingYourVoiceInput: "Sesin metne dönüştürülüyor",
  preparingRequest: "Talebin hazırlanıyor",
  searchingTheWeb: "Web'de yeni bağlam aranıyor",
  waitingForProvider: ({ provider }) => `${provider} bekleniyor`,
  preparingVoiceWithProvider: ({ provider }) =>
    `${provider} ile ses hazırlanıyor`,
  deepThinkingReassurance: "İyi yanıtlar biraz zaman alır…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds} sn`,
  speakingBackToYou: "Size sesli yanıt veriliyor",
  freshSession: "Yeni oturum",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 mesaj" : `${count} mesaj`,
  conversation: "Konuşma",
  conversationActions: "Konuşma eylemleri",
  statusDetails: "Durum ayrıntıları",
  persistenceFailure:
    "Bu cihaza veri kaydedemedim. Uygulamayı açık tut ve tekrar dene; yeniden başlatmanın ardından son değişiklikler kaybolabilir.",
  show: "Göster",
  showTranscript: "Konuşma metnini göster",
  hide: "Gizle",
  copyThread: "Konuyu Kopyala",
  shareThread: "Konuyu Paylaş",
  reportResponse: "Bu yanıtı bildir",
  reportResponseIntro: "Mr Broccoli'den yapay zekâ yanıt bildirimi. Aşağıdaki içeriği incele, sorunu açıkla ve bu bildirimi geliştiriciye gönder.",
  repeatReply: "Yanıtı Tekrarla",
  renameThread: "Konuyu Yeniden Adlandır",
  renameThreadHint:
    "Bu konuşmaya daha sonra hızlıca bulabileceğin bir başlık ver.",
  threadTitle: "Konu başlığı",
  noTranscriptYet: "Henüz transkript yok",
  previewTranscriptEmptyDescription:
    "Başlamak için ses veya metin kullan. Konuşmanız burada görünecek.",
  noConversationYet: "Henüz konuşma yok",
  expandedTranscriptEmptyDescription:
    "Başlamak için ses veya metin kullan. Ana sahneye dönmek istediğinde bu ekranı kapat.",
  transcriptSelectionHint:
    "Herhangi bir mesaj metnini doğrudan seç veya aşağıda tek tek mesajları paylaşıp kopyala.",
  textMessagePlaceholder: "Bir mesaj yaz",
  sendTextMessage: "Mesaj gönder",
  showVoiceInput: "Ses girişini göster",
  showTextInput: "Metin girişini göster",
  usageStatsHiddenDescription:
    "Token tahminlerini transkript arayüzünün dışında tut.",
  usageStatsVisibleDescription:
    "Yanıtlar ve görüşme toplamları için tahmini token kullanımını göster.",
  debugLogButton: "Hata Ayıklama Günlüğü Düğmesi",
  debugLogButtonHiddenDescription:
    "Halihazırda bir yakalama işlemi yapılmadığı sürece ana ekrandaki GÜNLÜK düğmesini gizli tut.",
  debugLogButtonVisibleDescription:
    "Hata ayıklama yakalamalarını başlatmak ve durdurmak için ana ekranda GÜNLÜK düğmesini göster.",
  debugLogButtonUsageDescription:
    "Düğme nasıl kullanılır: düğmeyi açmak, günlükleri yakalamaya başlayacaktır. Bunu kapatmak, günlüklerin yakalanmasını durduracak ve yakalananların panoya taşınmasına neden olacaktır.",
  estimatedUsageTitle: "Tahmini Kullanım",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} yanıt · ${summaries} bellek güncellemesi`,
  estimatedUsageConversationScope:
    "Toplamlar, bu görüşmede kullanılan her rotayı ve modeli içerir.",
  estimatedPromptTokens: ({ count }) => `İstem: ${count}`,
  estimatedReplyTokens: ({ count }) => `Yanıt: ${count}`,
  estimatedTotalTokens: ({ count }) => `Toplam: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Tahmini ${prompt} giriş · ${completion} çıkış · ${total} toplam`,
  searchQuery: "Arama sorgusu",
  expandWebSearchDetails: "Web arama ayrıntılarını göster",
  collapseWebSearchDetails: "Web arama ayrıntılarını gizle",
  webSearchSourceCount: ({ count }) => `${count} kaynak`,
  sources: "Kaynaklar",
  openSourceLink: ({ source }) => `Kaynağı aç: ${source}`,
  turnReceipt: "Tur ayrıntıları",
  expandTurnReceipt: "Tur ayrıntılarını göster",
  collapseTurnReceipt: "Tur ayrıntılarını gizle",
  turnReceiptDirect: "Doğrudan",
  turnReceiptRequested: "İstenen yanıt rotası",
  turnReceiptActual: "Gerçek yanıt rotası",
  turnReceiptEffort: "Muhakeme kontrolü",
  turnReceiptProviderNative: "sağlayıcı-yerel",
  turnReceiptInput: "Giriş rotası",
  turnReceiptSearch: "Web araması",
  turnReceiptVoice: "Ses çıkışı",
  turnReceiptContext: "Bağlam",
  turnReceiptTiming: "Zamanlama",
  turnReceiptFallback: "Geri dönüş nedeni",
  turnReceiptVoiceInput: "Ses",
  turnReceiptTypedInput: "Yazıldı",
  turnReceiptSystemSpeech: "Sistem konuşma tanıma",
  turnReceiptSystemVoice: "Sistem sesi",
  turnReceiptSystemVoiceFallback: "Sistem sesi · geri dönüş",
  turnReceiptOff: "Kapalı",
  turnReceiptNotConfigured: "Açık · yapılandırılmadı",
  turnReceiptFallbackWithoutSearch: "Canlı arama olmadan devam edildi",
  turnReceiptNotUsed: "Kullanılmıyor",
  turnReceiptSummaryReused: "kaydedilen özet yeniden kullanıldı",
  turnReceiptSummaryUpdated: "özet güncellendi",
  turnReceiptContextFallback: "son mesaj geri dönüşü",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `ağ geçidi ${original} mesajı ${compressed} mesaja sıkıştırdı`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} önceki mesaj gönderildi · ${summarized} yeni özetlendi${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "bağlam",
  turnReceiptTimingSearch: "arama",
  turnReceiptTimingModel: "model",
  turnReceiptTimingFirstSpeech: "ilk konuşma",
  turnReceiptTimingTotal: "toplam",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} token`,
  unknownUsageRoute: "Bilinmeyen rota",
  setupGuideConnectProviderTitle: "Kimlik bilgilerini yapılandır",
  setupGuideConnectProviderDescription:
    "Ayarlar'da kimlik bilgilerini ekle, ardından kullanmak istediğin rotaları seç.",
  idle: "Boşta",
  yourConversationAppearsHere: "Konuşmanız burada görünüyor",
  defaultTranscriptEmptyDescription:
    "Başlamak için ses veya metin kullan. İleti dizisini tutacağım ve burada yanıt vereceğim.",
  delete: "Sil",
  deleteConversationConfirmationTitle: ({ title }) => `“${title}” silinsin mi?`,
  deleteConversationConfirmationMessage:
    "Bu, görüşmeyi ve tüm mesajlarını kalıcı olarak siler. Bu eylem geri alınamaz.",
  conversations: "Konuşmalar",
  drawerSubtitle:
    "Canlı başlıklar arasında geçiş yap veya yeni bir oda başlat.",
  newSession: "Yeni Oturum",
  noSavedConversationsYet: "Henüz kayıtlı görüşme yok",
  drawerEmptyDescription:
    "Ana görünümden konuşmaya başladığınızda otomatik olarak bir oturum oluştururum.",
  setupGuideTitle: "Uygulamayı yapılandır",
  setupGuideSubtitle:
    "Kimlik bilgilerini ekle ve Ayarlar'da rotaları seç.",
  fastestStartPreset: "Minimum kurulum",
  fastestStartDescription:
    "Mümkün olduğunda cihaz konuşmasını kullan ve yalnızca ihtiyacın olan yanıt yolunu yapılandır.",
  fullVoicePreset: "Yapılandırılmış ses",
  fullVoiceDescription:
    "Yanıtlar, transkripsiyon ve sözlü çıktı için yapılandırılmış hizmetleri seçtiğinizde kullan.",
  setupGuideNote:
    "Kimlik bilgilerini yapıştırıp doğrulayabilmeniz için daha sonra Ayarlar'ı açacağız.",
  useThisSetup: "Bu kurulumu kullan",
  notNow: "Şimdi değil",
  setupGuideIntroTitle: "Nasıl çalışırım?",
  setupGuideIntroBody:
    "Sıfırdan başlıyorum. Halihazırda kullanmakta olduğun harici hizmetler için kimlik bilgilerini ekle, ardından yanıtların, konuşma girişinin, sözlü çıkışın ve isteğe bağlı web içeriğinin nasıl yönlendirileceğini seç.",
  setupGuideIntroNote:
    "Kurulumdan sonra konuşmayı başlatmak ve durdurmak için ana ses kontrolünü kullan. Geçerli transkript ana ekranda kalır ve her rota daha sonra Ayarlar'dan değiştirilebilir.",
  setupGuideProviderTitle: "Kimlik Bilgilerini Ekle",
  setupGuideProviderBody:
    "Yapılandırmak istediğin harici hizmeti seç, ardından kimlik bilgilerini yanıt erişimiyle birlikte yapıştır.",
  setupGuideProviderPickerLabel: "Yanıt hizmeti",
  setupGuideSelectProvider: "Bir sağlayıcı seç",
  setupGuideSelectProviderFirst: "Önce bir sağlayıcı seç.",
  setupGuideApiKeyLabel: "API anahtarı",
  setupGuideApiKeyPlaceholder: "Kimlik bilgilerini yapıştır",
  setupGuideContinue: "Devam et",
  setupGuideOpenSettings: "Ayarları Aç",
  setupGuideBack: "Geri",
  setupGuideValidateKey: "Anahtarı doğrula",
  setupGuideApiKeyRequiredOrCancel:
    "Devam etmek için bir API anahtarı ekle veya kurulum kılavuzunu iptal et.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Devam etmek için bir sağlayıcı seç ve bir API anahtarı ekle veya kurulum kılavuzunu iptal et.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Bu ${provider} kimlik bilgileri yanıt isteklerine izin vermiyor.`,
  setupGuideKokoroTitle: "Doğal Cihaz İçi Ses Ekleme",
  setupGuideKokoroBody: ({ size }) =>
    `İsteğe bağlı: Konuşma sağlayıcısı veya kullanım ücreti olmadan çok daha doğal sözlü yanıtlar için Kokoro'yu (yaklaşık ${size} MB) indir.`,
  setupGuideKokoroLanguageNote:
    "Bu model şu anda İngilizce ve Basitleştirilmiş Çince konuşmaktadır. İstediğin geri dönüş rotalarını daha sonra Konuşma ayarlarında yapılandır.",
  setupGuideKokoroDownload: "Kokoro'yu indir",
  setupGuideUseKokoro: "Sözlü yanıtlar için Kokoro'yu kullan",
  setupGuideUseKokoroSummary:
    "Cevap dili desteklendiğinde sentezi telefonda tut.",
  setupGuideSkipKokoro: "Şimdilik atla",
  setupGuideVoiceTestTitle: "Kurulumunuzu Test Edin",
  setupGuideVoiceTestBody:
    "Kısa bir cümle söyle. Kabul edilebilir bir ses yolu mevcut olduğunda mikrofon erişimini, transkripsiyonu, yapılandırılmış yanıt yolunu ve sözlü çıkışı test edeceğim.",
  setupGuideVoiceTestNoInputBody:
    "Bu kurulumda ses girişi kullanılamaz. Algılanan rotaları incelemeye devam et, ardından gerekirse konuşma ayarlarını daha sonra yap.",
  setupGuideVoiceTestTextOnlyNote:
    "Henüz kabul edilebilir bir sözlü ses yolu hazır olmadığından bu test yalnızca metin olarak kalır.",
  setupGuideVoiceTestStart: "Testi başlat",
  setupGuideVoiceTestStop: "Kaydı durdur",
  setupGuideVoiceTestRetry: "Yeniden çalıştır",
  setupGuideVoiceTestTranscribing: "Metne dönüştürülüyor…",
  setupGuideVoiceTestThinking: "Yanıt test ediliyor…",
  setupGuideVoiceTestSynthesizing: "Ses hazırlanıyor…",
  setupGuideVoiceTestSpeaking: "Yanıt oynatılıyor…",
  setupGuideVoiceTestTranscript: "Transkript",
  setupGuideVoiceTestReply: "Yanıt",
  setupGuideVoiceTestReset: "Bu sonucu temizle",
  setupGuideVoiceInputUnavailable:
    "Bu cihazda bu kurulum için ses girişi mevcut değil.",
  setupGuideSummaryTitle: "Kurulum Tamamlandı",
  setupGuideSummaryBody:
    "İşte mevcut yapılandırmanla kullanacağım rota.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Konuşmadan metne",
  setupGuideSummaryTts: "Metinden konuşmaya",
  setupGuideSummaryWebSearch: "Web araması",
  setupGuideRouteProviderLlm: ({ provider }) =>
    `${provider} aracılığıyla etkinleştirildi`,
  setupGuideRouteOnDeviceStt: "Sistem konuşma tanıma yoluyla etkinleştirildi",
  setupGuideRouteProviderStt: ({ provider }) =>
    `${provider} konuşma transkripsiyonuyla etkinleştirildi`,
  setupGuideRouteProviderTts: ({ provider }) =>
    `${provider} ses aracılığıyla etkinleştirildi`,
  setupGuideRouteKokoroTts: "Kokoro cihaz içi ses aracılığıyla etkinleştirildi",
  setupGuideRouteLocalTts: "Yerel ses paketi aracılığıyla etkinleştirildi",
  setupGuideRouteUnavailable: "Mevcut değil",
  setupGuideRouteOff: "Kapalı",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `${provider} aracılığıyla kullanılabilir, şu anda kapalı`,
  setupGuideSummaryTextOnlyNote:
    "Sözlü yanıtlar şimdilik kapalı. Bir sağlayıcıyı veya yerel sesi etkinleştirene kadar yanıtlar metinde kalır.",
  setupGuideFinish: "Bitti",
  searchConversationsPlaceholder:
    "Başlıkları, modelleri ve mesaj metnini ara",
  noMatchingConversations: "Eşleşen görüşme yok",
  noMatchingConversationsDescription:
    "Transkriptten farklı bir başlık, rota, model veya ifade dene.",
  noProviderYet: "Henüz sağlayıcı yok",
  noModelYet: "Henüz model yok",
  startedAt: "Başlatıldı",
  endedAt: "Sona erdi",
  pinned: "Sabitlendi",
  copy: "Kopyala",
  share: "Paylaş",
  rename: "Yeniden adlandır",
  pin: "Sabitle",
  unpin: "Sabitlemeyi kaldır",
  save: "Kaydet",
  cancel: "İptal",
  stop: "Durdur",
  pause: "Duraklat",
  resume: "Devam et",
  paused: "Duraklatıldı",
  listening: "Dinleme",
  parsing: "Metne dönüştürme",
  searching: "Aranıyor",
  converting: "Dönüştürme",
  webSearchAction: "web araması",
  thinking: "Düşünme",
  speaking: "Konuşma",
  pleaseWait: "Lütfen bekle",
  yourTurn: "Sıra sende",
  keepPressing: "Basmaya devam et",
  tapWhenDone: "İşiniz bittiğinde dokun",
  speechPaused: "Konuşma duraklatıldı",
  pausePlaybackUnavailable:
    "Bu ses rotası duraklatılamaz. Durdur veya sağlayıcı ses çıkışına geç.",
  holdToSpeak: "Konuşmak için basılı tut",
  tapToSpeak: "Konuşmak için dokun",
  tapAgainToSend: "Göndermek için tekrar dokun",
  waitingForReply: "Yanıt bekleniyor",
  parsingYourVoice: "Sesin ayrıştırılıyor",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} Ayarlar'da yapılandırılmamış.`,
  providerNetworkError: ({ provider, action }) =>
    `${action} için ${provider} sağlayıcısına ulaşılamadı. Bağlantıyı kontrol edip tekrar dene.`,
  providerAuthError: ({ provider, action }) =>
    `${provider}, ${action} kimlik bilgilerini reddetti. API anahtarını ve izinlerini kontrol et.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} şu anda ${action} için hız sınırı uyguluyor. Birazdan tekrar dene.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider}, ${action} için yeterli API kredisine ihtiyaç duyar. Hesap bakiyesini ve anahtarın harcama limitini kontrol et.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider}, ${action} sırasında çok uzun sürdü. Tekrar dene.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider}, ${action} sırasında geçici bir sorunla karşılaştı. Kısa süre sonra tekrar dene.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} yanıt vermeden bitirdi. Tekrar dene.`,
  providerIncompleteReplyError: ({ provider }) =>
    `${provider} yanıtı tamamlanmadan sona erdi. Tekrar dene.`,
  providerContextTooLong: ({ provider }) =>
    `${provider}, görüşme çok uzadığı için yanıtı reddetti. Yeni bir konu başlat veya isteği kısalt.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider}, ${action} isteğini reddetti: ${detail}`
      : `${provider}, ${action} isteğini reddetti.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider}, web aramasını çalıştırmadan bir yanıt döndürdü.`,
  providerValidationSuccess: ({ provider }) => `${provider} kullanıma hazır.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} çalışıyor.`,
  providerValidationFailed: "Sağlayıcı doğrulaması başarısız oldu.",
  webSearchFallback:
    "Web araması kullanılamadığından yanıt, canlı web bağlamı olmadan devam etti.",
  noBase64EncoderAvailable: "Base64 kodlayıcı mevcut değil.",
  noBase64DecoderAvailable: "Base64 kod çözücü yok.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS, <key>|<region> biçiminde Azure Konuşma kimlik bilgilerine ihtiyaç duyar; örneğin abc123|westeurope veya birleşik Azure biçimi <endpoint>|<api-key>|<key>|<region>.",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Sistem TTS'si ses dosyalarını sentezlemez.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `${languageLabel} için hazır yerel veya bulut ses rotası yok.`,
  chooseTextToSpeechProviderInSettings:
    "Ayarlar'da bir metin-konuşma sağlayıcısı seç.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS henüz desteklenmiyor.`,
  ttsError: ({ provider, status, errorText }) =>
    `${provider} TTS hatası (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `${provider} konuşma çıkışı, çok uzun olduğu için yanıtı reddetti.`,
  ttsTimeout: ({ provider }) => `${provider} konuşma çıkışı çok uzun sürdü.`,
  sttTimeout: ({ provider }) =>
    `${provider} konuşmanın transkripsiyonu çok uzun sürdü.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} yalnızca ${limit}'ye kadar olan kayıtları kabul eder. Daha kısa bir klip kullan veya STT modellerini değiştir.`,
  voiceInputCaptureIncomplete:
    "Ses girişi net bir şekilde yakalanamadı. Lütfen tekrar dene.",
  ttsDidNotReturnAudio: ({ provider }) => `${provider} TTS ses döndürmedi.`,
  nativeSttHandledInApp: "Sistem STT'si doğrudan uygulamada gerçekleştirilir.",
  chooseSpeechToTextProviderInSettings:
    "Ayarlar'da konuşmayı metne dönüştürme sağlayıcısını seç.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT henüz desteklenmiyor.`,
  providerNotWiredUpYet: ({ provider }) =>
    `${provider} entegrasyonu henüz hazır değil.`,
  you: "Siz",
  assistant: "Asistan",
  untitledConversation: "Başlıksız görüşme",
  conversationExportHeader: ({ title }) => `Konuşma: ${title}`,
  speechRecognitionPermissionNotGranted: "Konuşma tanıma izni verilmedi.",
  speechRecognitionUnavailableForDeviceLanguage:
    "Geçerli cihaz dilinde konuşma tanıma özelliği mevcut değil.",
  nativeSpeechRecognitionNeedsNetwork:
    "Sistem konuşma tanımanın şu anda ağ erişimine ihtiyacı var.",
  noSpeechDetected: "Hiçbir konuşma algılanmadı.",
  nativeSpeechRecognitionFailed: "Sistem konuşma tanıma başarısız oldu.",
  couldntStartNativeSpeechRecognition: "Sistem konuşma tanıma başlatılamadı.",
  microphonePermissionNotGranted: "Mikrofon izni verilmedi",
} satisfies TranslationDictionary;
