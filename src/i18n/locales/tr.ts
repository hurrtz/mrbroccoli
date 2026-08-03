import type { TranslationDictionary } from "../types";
import { dataBackupTranslations } from "../dataBackupTranslations";
import { conversationKnowledgeTranslations } from "../conversationKnowledgeTranslations";
import { conversationIntegrityTranslations } from "../conversationIntegrityTranslations";
import { imagePromptTranslations } from "../imagePromptTranslations";
import { onDeviceTranslations } from "../onDeviceTranslations";
import { premiumTranslations } from "../premiumTranslations";

export const tr = {
  ...dataBackupTranslations.tr,
  ...conversationKnowledgeTranslations.tr,
  ...conversationIntegrityTranslations.tr,
  ...imagePromptTranslations.tr,
  ...onDeviceTranslations.tr,
  ...premiumTranslations.tr,
  appName: "Bay Brokoli",
  retry: "Yeniden dene",
  dismiss: "Reddet",
  done: "Tamam",
  aboutSetting: ({ setting }) => `${setting} Hakkında`,
  unavailable: "Kullanılamıyor",
  selection: "Seçim",
  chooseCompatibleProviderFirst: "Önce uyumlu bir sağlayıcı seçin",
  settings: "Ayarlar",
  settingsReleaseVersion: ({ version }) => `Sürüm ${version}`,
  all: "Hepsi",
  firstRun: "İlk Çalıştırma",
  instructions: "Talimatlar",
  providers: "Sağlayıcılar",
  webSearch: "Web Araması",
  stt: "STT",
  tts: "TTS",
  ui: "kullanıcı arayüzü",
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
    "Bağlantıları inceleyin ve ses yolunun tamamını test edin.",
  setupGuideShowInSettings: "Ayarlar'da rehberli kurulumu göster",
  setupGuideShowInSettingsSummary:
    "Ayarlara genel bakışta rehberli kurulum kısayolunu gösterin veya gizleyin.",
  settingsConnectionsSummary: "Sağlayıcı anahtarları, doğrulama ve yetenekler.",
  settingsThinkingSummary: "Ev kartları, modeller, çaba ve sistem istemi.",
  settingsListeningSummary: "Giriş modu ve konuşmayı metne yönlendirme.",
  settingsSpeakingSummary: "Sözlü yanıtlar, oynatma, sesler ve önizlemeler.",
  settingsSearchSummary: "Web arama sağlayıcısı ve arama kalite kontrolleri.",
  settingsAppDiagnosticsSummary:
    "Tema, dil, kullanım, hata ayıklama günlükleri ve son etkinlikler.",
  settingsBackToOverview: "Genel bakışa geri dön",
  settingsOpenSection: ({ section }) => `${section}'yi açın`,
  theme: "Tema",
  language: "Dil",
  recognitionLanguage: "Tanıma dili",
  recognitionLanguageHint:
    "Tanıma işlemini geliştirmek için bir dil seçin veya cihaz ya da sağlayıcı tespiti için otomatik olarak bırakın.",
  automaticLanguage: "Otomatik",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider}, bu konuşma yolu için ${language}'yi resmi olarak desteklemiyor.`,
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
    "Herhangi bir sağlayıcı talebi görmeden önce asistanı yönlendiren gizli kılavuzu şekillendirin.",
  providersTabDescription:
    "Harici hizmet kimlik bilgilerini cihazda saklayın ve kullanmak istediğiniz yanıt modlarını yapılandırın.",
  webSearchTabDescription:
    "Yanıtlardan önce isteğe bağlı canlı web içeriğini yapılandırın.",
  responseModes: "Model Seçimi",
  aboutModelSelection: "Model seçimi hakkında",
  modelSelectionInfo:
    "Her model kartı ana ekranda bir seçim haline gelir. Sağlayıcısını, modelini ve isteğe bağlı efor düzeyini yapılandırın, ardından hangi modelin yanıt vereceğini seçmek için kartları değiştirin.",
  responseModeItemTitle: ({ index }) => `Model ${index}`,
  addResponseMode: "Model ekle",
  removeResponseMode: "Modeli kaldır",
  responseModesNoConfiguredProviders:
    "Önce kimlik bilgilerini ekleyin. Rota kontrolleri, en az bir uyumlu hizmet yapılandırılana kadar gizli kalır.",
  useResponseMode: ({ mode }) => `${mode}'yi kullanın`,
  chooseResponseModel: "Bir model seçin",
  responseModelCount: ({ count }) => `${count} modelleri mevcut`,
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
    "Konuşmanın nasıl yakalandığını ve modele ulaşmadan önce hangi arka ucun sesi metne dönüştürdüğünü kontrol edin.",
  ttsTabDescription:
    "Yanıtların ne zaman konuşmaya başlayacağını ve sözlü çıktıyı hangi arka ucun işleyeceğini kontrol edin.",
  brief: "Kısa",
  briefDescription:
    "Cevabı sıkı tutun. Kullanıcıya tam olarak cevap vermek için gereken minimum cümle sayısını kullanın.",
  normal: "Normal",
  normalDescription:
    "Dengeli bir yanıt uzunluğunu hedefleyin. Cevabı uzatmadan önemli noktaları ele alın.",
  thorough: "Kapsamlı",
  thoroughDescription:
    "Derinlere inin ve kapsamlı olun. Nüansları, ayrıntıları, ödünleşimleri ve önemli olan mantığı ekleyin.",
  professional: "Profesyonel",
  professionalDescription:
    "Müşteriye brifing veren kıdemli bir danışman gibi konuşun. Kesin bir dil, argo yok, ölçülü ve otoriter.",
  casual: "gündelik",
  casualDescription:
    "Kafedeki akıllı bir arkadaş gibi konuşun. Rahat, doğal, konuşkan. Kasılmalar iyi, teğetler iyi.",
  nerdy: "İnek",
  nerdyDescription:
    "Derinlere inmeyi seven coşkulu bir uzman gibi konuşun. Teknik terminolojiyi özgürce kullanın, ayrıntılar hakkında bilgi edinin, kullanıcının gelişmeleri takip edebileceğini varsayın.",
  concise: "Kısa",
  conciseDescription:
    "Hala eksiksizken mümkün olduğunca kısa olun. Önsöz yok, dolgu yok, sadece cevap. Telgraf stilini düşünün.",
  socratic: "Sokratik",
  socraticDescription:
    "Kullanıcının düşüncesine meydan okuyun. Karşı sorular sorun, alternatif bakış açıları sunun, sadece söylediklerini onaylamayın. Bir evet makinesi değil, tartışma ortağı olun.",
  eli5: "ELI5",
  eli5Description:
    "Her şeyi olabildiğince basit bir şekilde açıklayın. Analojiler, günlük dil ve sıfır jargon kullanın. Herhangi bir konu hakkında önceden bilgi sahibi olmadığınızı varsayın.",
  useProvider: ({ provider }) => `${provider}'yi kullanın`,
  createApiKey: "Kimlik bilgileri",
  apiKey: "API anahtarı",
  aboutThisProvider: "Bu sağlayıcı hakkında",
  openRouterOnboardingTitle: "Tek anahtar, birden fazla sağlayıcı",
  openRouterOnboardingDescription:
    "Özel bir OpenRouter anahtarı oluşturun, aşağıya yapıştırın ve herhangi bir doğrudan bağlantıyı değiştirmeden çeşitli sağlayıcıların anlık görüntü destekli modellerini kullanın.",
  openRouterOnboardingRoute:
    "Talep yolu: bu cihaz → OpenRouter → seçilen yukarı akış sağlayıcısı",
  openRouterKeys: "OpenRouter tuşları",
  providerStatusInvalid: "Geçersiz",
  providerStatusTesting: "Test etme",
  providerStatusConfigured: "Yapılandırılmış",
  providerStatusWorking: "Çalışma",
  providerStatusNotTested: "Test edilmedi",
  providerStatusNotSetup: "Kurulmadı",
  expandProvider: ({ provider }) => `${provider}'yi genişletin`,
  collapseProvider: ({ provider }) => `${provider}'yi daralt`,
  testProviderKey: "Test anahtarı",
  testAllCapabilities: "Tümünü test et",
  apiTest: "API testi",
  testProviderCapability: ({ capability }) => `${capability}'yi test edin`,
  test: "testi",
  optional: "İsteğe bağlı",
  providerCapability_llm: "Yanıtlar",
  providerCapability_stt: "Konuşma girişi",
  providerCapability_tts: "Ses çıkışı",
  providerCapability_search: "Web araması",
  providerCapability_voices: "Ses kitaplığı",
  providerValidationUnavailable:
    "Bu sağlayıcı için canlı doğrulama henüz sağlanmadı. Anahtarı buraya kaydedin ve gerçek kullanım sırasında doğrulayın.",
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
    "Modelin her yanıttan önce aldığı gizli rehberliği şekillendirin.",
  baseInstructions: "Temel Talimatlar",
  assistantInstructionsPlaceholder:
    "Asistanın nasıl davranması gerektiğini tanımlayın.",
  assistantInstructionsHint:
    "Bu her zaman seçilen yanıt uzunluğu ve tonun önüne eklenir.",
  adaptiveLength: "Uyarlanabilir Uzunluk",
  responseTone: "Tepki Tonu",
  homeStyleChipLabel: ({ tone, length }) => `Stil — ${tone} · ${length}`,
  styleSheetTitle: "Konuşma ayarları",
  styleSheetSubtitle:
    "Yalnızca bu görüşme için yanıtları ve konuşmayı şekillendirin.",
  openStyleSheet: "Konuşma ayarlarını aç",
  conversationThinkingInstructions: "Düşünme talimatları",
  conversationThinkingInstructionsDescription:
    "Bu görüşme için genel sistem isteminden sonra talimatları ekleyin.",
  conversationThinkingInstructionsPlaceholder:
    "Örneğin: Varsayımlarıma meydan okuyun ve somut örnekler kullanın.",
  ttsInstructions: "Konuşma iletimi talimatları",
  ttsInstructionsDescription:
    "Uyumlu konuşma modellerinin kullandığı tonu, tempoyu, aksanı veya konuşmayı yönlendirin.",
  conversationTtsInstructionsDescription:
    "Bu görüşme için genel konuşma talimatlarının sonrasına teslimat talimatlarını ekleyin.",
  ttsInstructionsPlaceholder:
    "Örneğin: Sıcak, net ve rahat bir tempoda konuşun.",
  ttsInstructionsUnsupported:
    "Mevcut konuşma rotası iletim talimatlarını desteklemiyor.",
  conversationVoiceDescription: ({ route }) =>
    `Bu görüşmede ${route} tarafından kullanılan sesi seçin.`,
  scrollToLatest: "En son mesaja ilerleyin",
  conversationTitleGenerate: "Başlığı otomatik oluştur",
  conversationTitleGenerating: "Başlık oluşturuluyor…",
  conversationTitleGenerated: "Görüşme yeniden adlandırıldı.",
  conversationTitleNeedsContent:
    "Bir başlık oluşturmadan önce bir konuşma başlatın.",
  conversationTitleNeedsProvider:
    "Bir başlık oluşturmadan önce seçilen modeli yapılandırın.",
  conversationTitleGenerationFailed: "Konuşma başlığı oluşturulamadı.",
  conversationTitleGenerationTimedOut:
    "Başlık oluşturma çok uzun sürdü. Lütfen tekrar deneyin.",
  inputMode: "Giriş Modu",
  voiceInput: "Ses Girişi",
  pushToTalk: "Bas Konuş",
  pushToTalkDescription:
    "Konuşurken ana düğmeyi basılı tutun, ardından göndermek için bırakın.",
  toggleToTalk: "Konuşmaya Geç",
  toggleToTalkDescription:
    "Kaydı başlatmak için bir kez dokunun ve işiniz bittiğinde tekrar dokunun.",
  driveSession: "Sürüş Oturumu",
  driveSessionDescription:
    "Otomatik devam etme açıkken, kayıt her sözlü yanıttan sonra başlar. Konuşmanız bittiğinde ana düğmeye dokunun.",
  stopDriveSession: "Otomatik duraklat",
  repeatDriveReply: "Sonuncuyu tekrarla",
  continueDriveSession: "Otomatik devam ettir",
  speechToText: "Metne Konuşma",
  appNative: "Sistem Tanıma",
  nativeSttDescription:
    "İşletim sisteminin konuşma tanıyıcısını kullanın. Cihaz ayarlarına bağlı olarak tanıma, cihaz üzerinde veya sistem hizmeti aracılığıyla çalıştırılabilir. Sağlayıcı anahtarı gerekmez.",
  provider: "sağlayıcı",
  webSearchProvider: "Web Arama Sağlayıcısı",
  webSearchProviderMissingHint:
    "Burada web topraklamayı etkinleştirmek için Kimlik Bilgileri'nde en az bir arama özellikli hizmeti yapılandırın.",
  webSearchModelHint: ({ model }) =>
    `Canlı web topraklaması için perde arkasında ${model}'yi kullanır.`,
  webSearchHomeHint:
    "Bu konu için web topraklamasını açmak veya kapatmak için ana ekran geçişini kullanın.",
  settingsWebSearchCompactHint:
    "İsteğe bağlı olarak, ana model yanıt vermeden önce yeni web bağlamını başına ekleyin.",
  webSearchAdvanced: "Gelişmiş Arama Kontrolleri",
  expandAdvancedSearch: "Gelişmiş arama kontrollerini genişletin",
  collapseAdvancedSearch: "Gelişmiş arama kontrollerini daralt",
  webSearchSetupNeeded:
    "Canlı web aramasını kullanmak için kimlik bilgileri ekleyin.",
  webSearchEnabledDescription:
    "Model yanıt vermeden önce yeni web içeriği eklenir.",
  webSearchDisabledDescription:
    "Güncel gerçekler önemli olduğunda bu başlık için canlı web içeriğini kullanın.",
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
  setWebSearchMode: ({ mode }) => `Web arama modunu ${mode} olarak ayarlayın`,
  openWebSearchSettings: "Web arama ayarlarını aç",
  providerSttDescription:
    "Sesinizi yanıt yoluna gönderilmeden önce yazıya dönüştürmek için yapılandırılmış bir harici hizmet kullanın.",
  sttProvider: "STT Sağlayıcısı",
  sttProviderEnabledHint:
    "Burada yalnızca transkripsiyon desteğine sahip etkin sağlayıcılar görünür.",
  sttProviderMissingHint:
    "Burada seçmek için STT desteği olan bir hizmete ilişkin kimlik bilgilerini ekleyin.",
  nativeSttHint:
    "Sistem tanıma, sağlayıcı anahtarlarınızdan bağımsız olarak çalışır ve cihaz üzerinde veya işletim sisteminin konuşma hizmeti tarafından işlenebilir.",
  replyPlayback: "Yanıtla Oynatma",
  sentencesArrive: "Paragraflar Geliyor",
  sentencesArriveDescription:
    "Tam bir paragraf hazır olur olmaz konuşmaya başlayın.",
  fullReplyFirst: "Önce Tam Yanıt",
  fullReplyFirstDescription:
    "Önce cevabın tamamını oluşturun, ardından tek geçişte oynatın.",
  textToSpeech: "Metinden Konuşmaya",
  spokenReplies: "Sözlü Yanıtlar",
  spokenRepliesEnabledDescription:
    "Bir ses rotası mevcut olduğunda okuma asistanının yanıtlarını yüksek sesle okuyun.",
  spokenRepliesDisabledDescription:
    "Yanıtları şimdilik yalnızca metin halinde tutun. Tercih ettiğiniz TTS rotası daha sonra kullanılmak üzere kayıtlı kalır.",
  nativeTtsDescription:
    "Sözlü yanıtlar ve ses önizlemesi için cihazın konuşma motorunu kullanın.",
  kokoroTtsDescription:
    "Bu cihazda tamamen çok daha doğal bir sinir sesi kullanın. Sözlü yanıt metni, konuşma sağlayıcı anahtarı veya kullanım ücreti olmaksızın yerel olarak sentezlenir.",
  kokoroVoices: "Kokoro Cihaz İçi Sesler",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `Çok dilli model yaklaşık ${size} MB indirir ve kurulumdan sonra yaklaşık ${installedSize} MB'yi kaplar.`,
  kokoroModel: "Kokoro çok dilli model",
  kokoroChecking: "Cihaz modeli kontrol ediliyor…",
  kokoroDownloading: ({ progress }) => `İndiriliyor... ${progress}%`,
  kokoroExtracting: ({ progress }) => `Yükleniyor… ${progress}%`,
  kokoroVerifying: "Ses motoru doğrulanıyor…",
  kokoroInstalled: "Bu cihaza yüklendi ve hazır.",
  kokoroNotInstalled: "İsteğe bağlı indirme. Sağlayıcı anahtarı gerekmez.",
  kokoroLanguageFallback:
    "Kokoro şu anda burada İngilizce ve Basitleştirilmiş Çince konuşmaktadır. Seçilen diğer yanıt dilleri için açık bir geri dönüş yolu ekleyin, aksi takdirde konuşma bir hatayla duracaktır.",
  kokoroRemoveTitle: "Kokoro modeli kaldırılsın mı?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Bu, yaklaşık ${installedSize} MB'yi serbest bırakır. Modeli istediğiniz zaman tekrar indirebilirsiniz.`,
  removeKokoroModel: "Kokoro modelini kaldırın",
  downloadKokoroModel: "Kokoro modelini indirin",
  kokoroFallbackNeeded: ({ languages }) =>
    `Aşağıdakiler için açık bir geri dönüş rotası gereklidir: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Kokoro sesini yapılandırmak için Dinleme Dilleri altında İngilizce veya Basitleştirilmiş Çince'yi seçin.",
  expandVoiceSettings: ({ language }) =>
    `${language} ses ayarlarını genişletin`,
  collapseVoiceSettings: ({ language }) => `${language} ses ayarlarını daralt`,
  remove: "Kaldır",
  voiceOutputDescription:
    "Sözlü yanıtlar için konuşma motorunu, dinleme dillerini ve ses önizlemelerini seçin.",
  localTts: "Yerel",
  localTtsDescription:
    "Sözlü yanıtlar için eşleşen, indirilmiş bir yerel ses kullanın.",
  providerTtsDescription:
    "Sözlü yanıtlar için seçilen yapılandırılmış hizmeti kullanın.",
  ttsFallbackRoutes: "Geri dönüş rotaları",
  ttsFallbackRoutesHint:
    "İsteğe bağlı. Yalnızca istediğiniz rotaları, denenmeleri gereken sıraya göre ekleyin. Rota konuşmaya başladığında Bay Brokoli yanıtın geri kalanı boyunca rota üzerinde kalır.",
  ttsFallbackNone:
    "Hiçbir geri dönüş yapılandırılmadı. Bunun yerine bir ses hatası gösterilecektir.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `${route} yedek ekle`,
  removeFallbackRoute: ({ route }) => `${route} yedeğini kaldır`,
  moveFallbackEarlier: ({ route }) => `${route}'yi daha erkene taşı`,
  moveFallbackLater: ({ route }) => `${route}'yi daha sonra taşı`,
  ttsProvider: "TTS Sağlayıcısı",
  ttsProviderEnabledHint:
    "Burada yalnızca sesli yanıt desteğine sahip etkin sağlayıcılar görünür.",
  ttsProviderMissingHint:
    "Burada seçmek için TTS desteğine sahip bir hizmete ilişkin kimlik bilgilerini ekleyin.",
  localTtsOrderHint:
    "Yalnızca açıkça yapılandırılmış geri dönüş yolları denenir.",
  providerTtsOrderHint:
    "Yalnızca açıkça yapılandırılmış geri dönüş yolları denenir.",
  nativeTtsHint:
    "Yerel TTS, sistem ses yığınını kullanır ve sağlayıcı anahtarı gerektirmez.",
  localTtsLanguageCoverageHint:
    "Yerel paketler şu anda İngilizce, Almanca, Basitleştirilmiş Çince, İspanyolca, Portekizce, Hintçe, Fransızca ve İtalyancayı kapsamaktadır.",
  ttsVoice: "TTS Sesi",
  refresh: "Yenile",
  providerVoiceDirectory: ({ provider }) => `${provider} ses kitaplığı`,
  refreshProviderVoices: ({ provider }) => `${provider} seslerini yenile`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${provider} üzerinden ${count} ses kullanılabilir`,
  providerVoicesLoadFailed:
    "Sesler yenilenemedi. Mevcut seçiminiz değişmedi; yine de manuel olarak bir ses kimliği girebilirsiniz.",
  providerVoicesLoadFailedWithFallback:
    "Hesap sesleri yüklenemedi. Dahili ses kullanılabilir durumda kalır.",
  providerVoicesErrorDetail: ({ detail }) => `Sebep: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "ElevenLabs'de bu API anahtarını düzenleyin ve Sesler → Oku'yu etkinleştirin, ardından burayı yenileyin.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Bay Brokoli, mevcut sesleri ${provider}'den otomatik olarak yükler.`,
  providerVoiceId: "Ses Kimliği",
  providerVoiceIdPlaceholder: "Bir ses kimliği girin",
  providerVoiceIdFallbackHint:
    "Ses kitaplığı yüklenemediğinde manuel giriş kullanılabilir durumda kalır.",
  providerVoiceIdRequired: ({ provider }) =>
    `Konuşma çıkışını kullanmadan önce ${provider} ses kitaplığını yenileyin veya bir ses kimliği girin.`,
  qwenSpeechUnavailableInUs:
    "Bay Brokoli'nin mevcut Qwen konuşma yolları ABD bölgesinde mevcut değildir. Qwen konuşması için Singapur veya Pekin'i seçin.",
  qwenApiRegion: "Qwen API Bölgesi",
  qwenRegionSingapore: "Singapur",
  qwenRegionUs: "ABD (Virginia)",
  qwenRegionBeijing: "Çin (Pekin)",
  qwenRegionHint:
    "Seçilen bölge, bu API anahtarının oluşturulduğu bölgeyle eşleşmelidir.",
  qwenRegionUsSpeechHint:
    "ABD bölgesi anahtarları burada sohbeti ve web aramasını destekler. Bay Brokoli'nin mevcut Qwen STT ve TTS rotaları, Singapur veya Pekin anahtarı gerektirir.",
  providerDefaultVoiceHint:
    "Bu sağlayıcı şu anda önizleme ve sesli yanıtlar için varsayılan sesini kullanıyor.",
  listenLanguages: "Dilleri Dinle",
  listenLanguagesHint:
    "Kulağa hoş gelmesini istediğiniz yanıt dillerini seçin. Bay Brokoli, konuşma çıkışını yönlendirirken bunları bu sırayla dener.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 dil seçildi" : `${count} dilleri seçildi`,
  localVoicePacks: "Yerel Ses Paketleri",
  localVoicePacksHint:
    "Her dil kendi yerel sesini korur. O dil için istediğiniz sesi seçin ve ardından yalnızca gerçekten önemsediğiniz paketleri indirin.",
  localVoiceForLanguage: ({ languageLabel }) => `${languageLabel} için Ses`,
  providerVoicePreviews: "Sağlayıcı Ses Önizlemeleri",
  providerVoicePreviewsHint:
    "Şu anda seçili olan TTS rotasını her yanıt dili için ayrı bir önizleme metniyle burada test edin.",
  nativeVoicePreviewSection: "Yerel Ses Önizlemesi",
  nativeVoicePreviewSectionHint:
    "Bu, doğrudan telefonun yerleşik konuşma sentezleyicisi aracılığıyla konuşur, böylece onu yapılandırılmış sağlayıcı sesleriyle karşılaştırabilirsiniz.",
  nativeVoiceUnavailable:
    "Bu cihaz, önizleme için herhangi bir yerel sistem sesini bildirmedi.",
  runtimeCompatibilityOverrides: "Çalışma zamanı uyumluluğu",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `Sağlayıcının kullanılamadığını doğruladığı ${count} model veya ayar yapılandırması yalnızca bu cihazda devre dışı. Bay Brokoli bunları otomatik olarak atlar.`,
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
    "Henüz yeni konuşma isteği yok. Burada yönlendirme ayrıntılarını görmek için bir sesi önizleyin veya bir yanıtı oynatın.",
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
    "İndirildi, ancak bu ses bu cihazda yerel doğrulamada başarısız oldu. Yeniden indirin veya başka bir ses seçin.",
  localTtsPackMissing:
    "Henüz kurulmadı. Siz indirene kadar Cloud TTS veya sistem sesi kullanılacaktır.",
  localTtsUnsupportedLanguageFallback:
    "Bu dil için henüz yerel bir paket mevcut değil. Cloud TTS veya sistem sesi bunu halledecektir.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Yerel paket indiriliyor... ${progress}%`,
  download: "İndir",
  downloadingShort: "Yükleniyor...",
  voicePreviewText: "Ses Önizleme Metni",
  voicePreviewPlaceholder: "Bu sesi duymak için bir cümle yazın.",
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
    "Tekrar denemeden önce yukarıdan başka bir model seçebilirsiniz.",
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
    `Bu rotayı kullanmadan önce Ayarlar'da ${provider} için kimlik bilgilerini ekleyin.`,
  configureCredentialsBeforeVoiceSession:
    "Sesli oturum başlatmadan önce Ayarlar'a kimlik bilgilerini ekleyin.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `${provider} için sağlayıcı temel URL'sini ve API anahtarını https://uç noktanız.example.com|api-anahtarınız olarak girin.`,
  speechRecognitionUnavailableOnDevice:
    "Bu cihazda konuşma tanıma kullanılamıyor.",
  debugLogLabel: "GÜNLÜK",
  debugLogCaptureStarted: "Hata ayıklama günlüğü başlatıldı.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Hata ayıklama günlüğü ${fileName} olarak kaydedildi ve panoya kopyalandı (${entryCount} girişleri).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Hata ayıklama günlüğü ${fileName} (${entryCount} girişleri) olarak kaydedildi.`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Önceki hata ayıklama günlüğü ${fileName} kurtarıldı ve panoya kopyalandı (${entryCount} girişleri).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Önceki hata ayıklama günlüğü ${fileName} (${entryCount} girişleri) kurtarıldı.`,
  debugLogCaptureFailed: "Hata ayıklama günlüğü kaydedilemedi.",
  chooseSttBeforeVoiceSession:
    "Sesli oturum başlatmadan önce Ayarlar'da yapılandırılmış bir STT rotası seçin.",
  chooseTtsBeforeSpokenReplies:
    "Sözlü yanıtları kullanmadan önce Ayarlar'da yapılandırılmış bir TTS rotası seçin.",
  stopSessionBeforeReplay:
    "Son yanıtı tekrar oynatmadan önce aktif ses oturumunu durdurun.",
  couldntCatchThatTryAgain: "Yakalanamadı, tekrar deneyin.",
  couldntStartVoiceInput: "Ses girişi başlatılamadı.",
  couldntProcessVoiceInput: "Ses girişi işlenemedi.",
  maxRecordingLengthReached:
    "Maksimum kayıt uzunluğuna ulaşıldı — elimdekileri gönderiyorum.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Bu kayıt, ${provider} konuşmayı metne dönüştürme için çok uzun (maks. ${limit}). Daha kısa bir mesaj deneyin veya Konuşmayı Metne Dönüştürme özelliğini Sistem Tanıma olarak değiştirin.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Bu rotayı kullanmadan önce Ayarlar'da ${provider} için kimlik bilgilerini ekleyin.`,
  stopSessionBeforePreview:
    "Bir sesi önizlemeden önce aktif ses oturumunu durdurun.",
  chooseTtsToPreviewVoices:
    "Sesleri önizlemek için Ayarlar'da yapılandırılmış bir TTS rotası seçin.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Önce seçilen ${languageLabel} yerel sesi indirin.`,
  couldntPreviewVoice: "Sesin önizlemesi yapılamadı.",
  spokenRepliesDisabled: "Sözlü yanıtlar Ayarlar'da kapatılmıştır.",
  providerVoiceFallback:
    "Yapılandırılmış ses rotası başarısız oldu. Bu yanıtı yedek ses olarak değiştirdik.",
  localVoiceFallback:
    "Yerel ses kullanılamıyor. Bu yanıtı yedek ses olarak değiştirdik.",
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
  currentSetup: "Mevcut Kurulum",
  listeningToYourVoice: "Sesini dinlemek",
  parsingYourVoiceInput: "Sesini metne dönüştürme",
  preparingRequest: "Talebiniz hazırlanıyor",
  searchingTheWeb: "Web'de yeni bağlam arama",
  waitingForProvider: ({ provider }) => `${provider} bekleniyor`,
  preparingVoiceWithProvider: ({ provider }) =>
    `${provider} ile ses hazırlanıyor`,
  deepThinkingReassurance: "İyi yanıtlar biraz zaman alır…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}'ler`,
  speakingBackToYou: "Sana karşılık vermek",
  freshSession: "Taze oturum",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 mesaj" : `${count} mesaj`,
  speechInputRoute: ({ route }) => `Konuşma yeri: ${route}`,
  replyModelRoute: ({ route }) => `Yanıt modeli: ${route}`,
  voiceOutputRoute: ({ route }) => `Ses çıkışı: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Yedek ses çıkışı: ${route}`,
  conversation: "Konuşma",
  conversationActions: "Konuşma eylemleri",
  statusDetails: "Durum ayrıntıları",
  persistenceFailure:
    "Bay Brokoli bu cihaza veri kaydedemedi. Uygulamayı açık tutun ve tekrar deneyin; yeniden başlatmanın ardından son değişiklikler kaybolabilir.",
  show: "Göster",
  showTranscript: "Konuşma metnini göster",
  hide: "Gizle",
  copyThread: "Konuyu Kopyala",
  shareThread: "Konuyu Paylaş",
  repeatReply: "Yanıtı Tekrarla",
  renameThread: "Konuyu Yeniden Adlandır",
  renameThreadHint:
    "Bu konuşmaya daha sonra hızlıca bulabileceğiniz bir başlık verin.",
  threadTitle: "Konu başlığı",
  noTranscriptYet: "Henüz transkript yok",
  previewTranscriptEmptyDescription:
    "Başlamak için ses veya metin kullanın. Konuşmanız burada görünecek.",
  noConversationYet: "Henüz konuşma yok",
  expandedTranscriptEmptyDescription:
    "Başlamak için ses veya metin kullanın. Ana sahneye dönmek istediğinizde bu ekranı kapatın.",
  transcriptSelectionHint:
    "Herhangi bir mesaj metnini doğrudan seçin veya aşağıda tek tek mesajları paylaşıp kopyalayın.",
  textMessagePlaceholder: "Bir mesaj yazın",
  sendTextMessage: "Mesaj gönder",
  showVoiceInput: "Ses girişini göster",
  showTextInput: "Metin girişini göster",
  usageStatsHiddenDescription:
    "Belirteç tahminlerini transkript kullanıcı arayüzünün dışında tutun.",
  usageStatsVisibleDescription:
    "Yanıtlar ve görüşme toplamları için tahmini jeton kullanımını gösterin.",
  debugLogButton: "Hata Ayıklama Günlüğü Düğmesi",
  debugLogButtonHiddenDescription:
    "Halihazırda bir yakalama işlemi yapılmadığı sürece ana ekrandaki LOG düğmesini gizli tutun.",
  debugLogButtonVisibleDescription:
    "Hata ayıklama yakalamalarını başlatmak ve durdurmak için ana ekranda LOG düğmesini gösterin.",
  debugLogButtonUsageDescription:
    "Düğme nasıl kullanılır: düğmeyi açmak, günlükleri yakalamaya başlayacaktır. Bunu kapatmak, günlüklerin yakalanmasını durduracak ve yakalananların panoya taşınmasına neden olacaktır.",
  estimatedUsageTitle: "Tahmini Kullanım",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} yanıtları · ${summaries} bellek güncellemeleri`,
  estimatedUsageConversationScope:
    "Toplamlar, bu görüşmede kullanılan her rotayı ve modeli içerir.",
  estimatedPromptTokens: ({ count }) => `Komut istemi: ${count}`,
  estimatedReplyTokens: ({ count }) => `Cevap: ${count}`,
  estimatedTotalTokens: ({ count }) => `Toplam: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Tahmini ${prompt} giriş · ${completion} çıkış · ${total} toplam`,
  searchQuery: "Arama sorgusu",
  expandWebSearchDetails: "Web arama ayrıntılarını göster",
  collapseWebSearchDetails: "Web arama ayrıntılarını gizle",
  webSearchSourceCount: ({ count }) => `${count} kaynak`,
  sources: "Kaynaklar",
  openSourceLink: ({ source }) => `Açık kaynak: ${source}`,
  turnReceipt: "Dönüş ayrıntıları",
  expandTurnReceipt: "Dönüş ayrıntılarını göster",
  collapseTurnReceipt: "Dönüş ayrıntılarını gizle",
  turnReceiptDirect: "Doğrudan",
  turnReceiptRequested: "İstenilen yanıt yolu",
  turnReceiptActual: "Gerçek cevap rotası",
  turnReceiptEffort: "Muhakeme kontrolü",
  turnReceiptProviderNative: "sağlayıcı-yerel",
  turnReceiptInput: "Giriş rotası",
  turnReceiptSearch: "Web araması",
  turnReceiptVoice: "Ses çıkışı",
  turnReceiptContext: "Bağlam",
  turnReceiptTiming: "Zamanlama",
  turnReceiptFallback: "Geri çekilme nedeni",
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
    `ağ geçidi ${original}'yi ${compressed} iletilerine sıkıştırdı`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} gönderilen önceki mesajlar · ${summarized} yeni özetlenen${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "bağlam",
  turnReceiptTimingSearch: "arama",
  turnReceiptTimingModel: "modeli",
  turnReceiptTimingFirstSpeech: "ilk konuşma",
  turnReceiptTimingTotal: "toplam",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} jetonları`,
  unknownUsageRoute: "Bilinmeyen rota",
  setupGuideConnectProviderTitle: "Kimlik bilgilerini yapılandırın",
  setupGuideConnectProviderDescription:
    "Ayarlar'da kimlik bilgilerini ekleyin, ardından kullanmak istediğiniz rotaları seçin.",
  idle: "Boşta",
  yourConversationAppearsHere: "Konuşmanız burada görünüyor",
  defaultTranscriptEmptyDescription:
    "Başlamak için ses veya metin kullanın. Bay Brokoli ileti dizisini tutacak ve burada yanıt verecek.",
  delete: "Sil",
  deleteConversationConfirmationTitle: ({ title }) => `“${title}” silinsin mi?`,
  deleteConversationConfirmationMessage:
    "Bu, görüşmeyi ve tüm mesajlarını kalıcı olarak siler. Bu eylem geri alınamaz.",
  memory: "Bellek",
  conversations: "Konuşmalar",
  drawerSubtitle:
    "Canlı başlıklar arasında geçiş yapın veya yeni bir oda başlatın.",
  newSession: "Yeni Oturum",
  noSavedConversationsYet: "Henüz kayıtlı görüşme yok",
  drawerEmptyDescription:
    "Ana görünümden konuşmaya başladığınızda Bay Brokoli otomatik olarak bir oturum oluşturacaktır.",
  setupGuideTitle: "Uygulamayı yapılandırın",
  setupGuideSubtitle:
    "Kimlik bilgilerini ekleyin ve Ayarlar'da rotaları seçin.",
  fastestStartPreset: "Minimum kurulum",
  fastestStartDescription:
    "Mümkün olduğunda cihaz konuşmasını kullanın ve yalnızca ihtiyacınız olan yanıt yolunu yapılandırın.",
  fullVoicePreset: "Yapılandırılmış ses",
  fullVoiceDescription:
    "Yanıtlar, transkripsiyon ve sözlü çıktı için yapılandırılmış hizmetleri seçtiğinizde kullanın.",
  setupGuideNote:
    "Kimlik bilgilerini yapıştırıp doğrulayabilmeniz için daha sonra Ayarlar'ı açacağız.",
  useThisSetup: "Bu kurulumu kullan",
  notNow: "Şimdi değil",
  setupGuideIntroTitle: "Bay Brokoli nasıl çalışır?",
  setupGuideIntroBody:
    "Bay Brokoli boş başlar. Halihazırda kullanmakta olduğunuz harici hizmetler için kimlik bilgilerini ekleyin, ardından yanıtların, konuşma girişinin, sözlü çıkışın ve isteğe bağlı web içeriğinin nasıl yönlendirileceğini seçin.",
  setupGuideIntroNote:
    "Kurulumdan sonra konuşmayı başlatmak ve durdurmak için ana ses kontrolünü kullanın. Geçerli transkript ana ekranda kalır ve her rota daha sonra Ayarlar'dan değiştirilebilir.",
  setupGuideProviderTitle: "Kimlik Bilgilerini Ekle",
  setupGuideProviderBody:
    "Yapılandırmak istediğiniz harici hizmeti seçin, ardından kimlik bilgilerini yanıt erişimiyle birlikte yapıştırın.",
  setupGuideProviderPickerLabel: "Yanıt hizmeti",
  setupGuideSelectProvider: "Bir sağlayıcı seçin",
  setupGuideSelectProviderFirst: "Önce bir sağlayıcı seçin.",
  setupGuideApiKeyLabel: "API anahtarı",
  setupGuideApiKeyPlaceholder: "Kimlik bilgilerini yapıştır",
  setupGuideContinue: "Devam et",
  setupGuideOpenSettings: "Ayarları Aç",
  setupGuideBack: "Geri",
  setupGuideValidateKey: "Anahtarı doğrula",
  setupGuideApiKeyRequiredOrCancel:
    "Devam etmek için bir API anahtarı ekleyin veya kurulum kılavuzunu iptal edin.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Devam etmek için bir sağlayıcı seçin ve bir API anahtarı ekleyin veya kurulum kılavuzunu iptal edin.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Bu ${provider} kimlik bilgileri yanıt isteklerine izin vermiyor.`,
  setupGuideKokoroTitle: "Doğal Cihaz İçi Ses Ekleme",
  setupGuideKokoroBody: ({ size }) =>
    `İsteğe bağlı: Konuşma sağlayıcısı veya kullanım ücreti olmadan çok daha doğal sözlü yanıtlar için Kokoro'yi (yaklaşık ${size} MB) indirin.`,
  setupGuideKokoroLanguageNote:
    "Bu model şu anda İngilizce ve Basitleştirilmiş Çince konuşmaktadır. İstediğiniz geri dönüş rotalarını daha sonra Konuşma ayarlarında yapılandırın.",
  setupGuideKokoroDownload: "Kokoro'yi indirin",
  setupGuideUseKokoro: "Sözlü yanıtlar için Kokoro'yi kullanın",
  setupGuideUseKokoroSummary:
    "Cevap dili desteklendiğinde sentezi telefonda tutun.",
  setupGuideSkipKokoro: "Şimdilik atla",
  setupGuideVoiceTestTitle: "Kurulumunuzu Test Edin",
  setupGuideVoiceTestBody:
    "Kısa bir cümle söyleyin. Bay Brokoli, kabul edilebilir bir ses yolu mevcut olduğunda mikrofon erişimini, transkripsiyonu, yapılandırılmış yanıt yolunu ve sözlü çıkışı test edecektir.",
  setupGuideVoiceTestNoInputBody:
    "Bu kurulumda ses girişi kullanılamaz. Algılanan rotaları incelemeye devam edin, ardından gerekirse konuşma ayarlarını daha sonra yapın.",
  setupGuideVoiceTestTextOnlyNote:
    "Henüz kabul edilebilir bir sözlü ses yolu hazır olmadığından bu test yalnızca metin olarak kalır.",
  setupGuideVoiceTestStart: "Testi başlat",
  setupGuideVoiceTestStop: "Kaydı durdur",
  setupGuideVoiceTestRetry: "Tekrar koş",
  setupGuideVoiceTestTranscribing: "Metne dönüştürülüyor…",
  setupGuideVoiceTestThinking: "Yanıt test ediliyor…",
  setupGuideVoiceTestSynthesizing: "Ses hazırlanıyor…",
  setupGuideVoiceTestSpeaking: "Yanıt oynatılıyor…",
  setupGuideVoiceTestTranscript: "Transkript",
  setupGuideVoiceTestReply: "Yanıtla",
  setupGuideVoiceTestReset: "Bu sonucu temizle",
  setupGuideVoiceInputUnavailable:
    "Bu cihazda bu kurulum için ses girişi mevcut değil.",
  setupGuideSummaryTitle: "Kurulum Tamamlandı",
  setupGuideSummaryBody:
    "İşte Bay Brokoli'nin mevcut yapılandırmanızla kullanacağı rota.",
  setupGuideSummaryLlm: "Yüksek Lisans",
  setupGuideSummaryStt: "Metne konuşma",
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
    `${provider} aracılığıyla edinilebilir, şu anda kapalı`,
  setupGuideSummaryTextOnlyNote:
    "Sözlü yanıtlar şimdilik kapalı. Bir sağlayıcıyı veya yerel sesi etkinleştirene kadar yanıtlar metinde kalır.",
  setupGuideFinish: "Bitti",
  searchConversationsPlaceholder:
    "Başlıkları, modelleri ve mesaj metnini arayın",
  noMatchingConversations: "Eşleşen görüşme yok",
  noMatchingConversationsDescription:
    "Transkriptten farklı bir başlık, rota, model veya ifade deneyin.",
  memoryModalTitle: "Konuşma belleği",
  memoryModalDescription:
    "Bu, bir iş parçacığı eski dönüşleri sıkıştıracak kadar uzun olduğunda Bay Brokoli'nin ileriye doğru taşıdığı kısa özettir.",
  memorySummary: "Kaydedilen özet",
  memorySummaryEmpty:
    "Henüz kompakt bellek yok. Bu konu uzadıkça eski dönüşler burada özetlenecektir.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 özetlenmiş tur" : `${count} özetlenmiş tur`,
  copyMemory: "Belleği kopyala",
  forgetMemory: "Hafızayı unut",
  memoryCopied: "Bellek kopyalandı.",
  memoryCleared: "Konuşma belleği temizlendi.",
  noConversationToManageYet: "Henüz konuşma belleği yok.",
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
  speaking: "konuşma",
  pleaseWait: "Lütfen bekleyin",
  yourTurn: "Sıra sende",
  keepPressing: "Basmaya devam et",
  tapWhenDone: "İşiniz bittiğinde dokunun",
  speechPaused: "Konuşma duraklatıldı",
  pausePlaybackUnavailable:
    "Bu ses rotası duraklatılamaz. Durdurun veya sağlayıcı ses çıkışına geçin.",
  holdToSpeak: "Konuşmak için basılı tutun",
  tapToSpeak: "Konuşmak için dokunun",
  tapAgainToSend: "Göndermek için tekrar dokunun",
  waitingForReply: "Cevap bekliyorum",
  parsingYourVoice: "Sesiniz ayrıştırılıyor",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} Ayarlar'da yapılandırılmamış.`,
  providerNetworkError: ({ provider, action }) =>
    `${action} için ${provider}'ye ulaşılamadı. Bağlantıyı kontrol edip tekrar deneyin.`,
  providerAuthError: ({ provider, action }) =>
    `${provider}, ${action} kimlik bilgilerini reddetti. API anahtarını ve izinlerini kontrol edin.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} şu anda ${action} hız sınırlayıcıdır. Birazdan tekrar deneyin.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider}, ${action} için yeterli API kredisine ihtiyaç duyar. Hesap bakiyesini ve anahtarın harcama limitini kontrol edin.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider}, ${action} sırasında çok uzun sürdü. Tekrar deneyin.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider}, ${action} sırasında geçici bir sorunla karşılaştı. Kısa süre sonra tekrar deneyin.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} yanıt vermeden bitirdi. Tekrar deneyin.`,
  providerIncompleteReplyError: ({ provider }) =>
    `${provider}'nin yanıtı tamamlanmadan sona erdi. Tekrar deneyin.`,
  providerContextTooLong: ({ provider }) =>
    `${provider}, görüşme çok uzun sürdüğü için yanıtı reddetti. Yeni bir konu başlatın veya isteği kısaltın.`,
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
    "Yerel TTS, ses dosyalarını sentezlemez.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `${languageLabel} için hazır yerel veya bulut ses rotası yok.`,
  chooseTextToSpeechProviderInSettings:
    "Ayarlar'da bir metin-konuşma sağlayıcısı seçin.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS henüz desteklenmiyor.`,
  ttsError: ({ provider, status, errorText }) =>
    `${provider} TTS hatası (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `${provider} konuşma çıktısı, yanıt çok uzun olduğu için reddedildi.`,
  ttsTimeout: ({ provider }) => `${provider} konuşma çıkışı çok uzun sürdü.`,
  sttTimeout: ({ provider }) =>
    `${provider} konuşmanın transkripsiyonu çok uzun sürdü.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} yalnızca ${limit}'ye kadar olan kayıtları kabul eder. Daha kısa bir klip kullanın veya STT modellerini değiştirin.`,
  voiceInputCaptureIncomplete:
    "Ses girişi net bir şekilde yakalanamadı. Lütfen tekrar deneyin.",
  ttsDidNotReturnAudio: ({ provider }) => `${provider} TTS ses döndürmedi.`,
  nativeSttHandledInApp: "Sistem STT'si doğrudan uygulamada gerçekleştirilir.",
  chooseSpeechToTextProviderInSettings:
    "Ayarlar'da konuşmayı metne dönüştürme sağlayıcısını seçin.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT henüz desteklenmiyor.`,
  providerNotWiredUpYet: ({ provider }) =>
    `${provider} henüz kablo bağlantısı yapılmadı.`,
  you: "sen",
  assistant: "Asistan",
  untitledConversation: "Başlıksız görüşme",
  conversationExportHeader: ({ title }) => `Konuşma: ${title}`,
  speechRecognitionPermissionNotGranted: "Konuşma tanıma izni verilmedi.",
  speechRecognitionUnavailableForDeviceLanguage:
    "Geçerli cihaz dilinde konuşma tanıma özelliği mevcut değil.",
  nativeSpeechRecognitionNeedsNetwork:
    "Yerel konuşma tanımanın şu anda ağ erişimine ihtiyacı var.",
  noSpeechDetected: "Hiçbir konuşma algılanmadı.",
  nativeSpeechRecognitionFailed: "Yerel konuşma tanıma başarısız oldu.",
  couldntStartNativeSpeechRecognition: "Yerel konuşma tanıma başlatılamadı.",
  microphonePermissionNotGranted: "Mikrofon izni verilmedi",
} satisfies TranslationDictionary;
