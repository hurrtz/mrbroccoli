import type { TranslationDictionary } from "../types";

export const hi = {
  appName: "मिस्टर ब्रोकली",
  retry: "पुन: प्रयास करें",
  dismiss: "बंद करें",
  done: "हो गया",
  aboutSetting: ({ setting }) => `${setting} के बारे में`,
  unavailable: "अनुपलब्ध",
  selection: "चयन",
  chooseCompatibleProviderFirst: "पहले एक संगत प्रदाता चुनें",
  settings: "सेटिंग्स",
  all: "सभी",
  firstRun: "पहला लॉन्च",
  instructions: "निर्देश",
  providers: "प्रदाता",
  webSearch: "वेब खोज",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "रनटाइम तैयारी",
  settingsReadinessThink: "सोचना",
  settingsReadinessListen: "सुनना",
  settingsReadinessSpeak: "बोलना",
  settingsReadinessSearch: "खोज",
  settingsReadinessReady: "तैयार",
  settingsReadinessNeedsAttention: "ध्यान",
  settingsReadinessBroken: "टूटा हुआ",
  settingsReadinessOff: "बंद",
  settingsConnections: "कनेक्शन",
  settingsThinking: "सोच",
  settingsListening: "सुनना",
  settingsSpeaking: "बोला जा रहा है",
  settingsSearch: "खोज",
  settingsAppDiagnostics: "ऐप और डायग्नोस्टिक्स",
  settingsGuidedSetup: "निर्देशित सेटअप",
  settingsGuidedSetupSummary:
    "कनेक्शन की समीक्षा करें और संपूर्ण ध्वनि मार्ग का परीक्षण करें।",
  setupGuideShowInSettings: "सेटिंग्स में निर्देशित सेटअप दिखाएं",
  setupGuideShowInSettingsSummary:
    "सेटिंग्स अवलोकन पर निर्देशित सेटअप शॉर्टकट दिखाएँ या छिपाएँ।",
  settingsConnectionsSummary: "प्रदाता कुंजियाँ, सत्यापन और क्षमताएँ।",
  settingsThinkingSummary: "होम कार्ड, मॉडल, प्रयास और सिस्टम प्रॉम्प्ट।",
  settingsListeningSummary: "इनपुट मोड और स्पीच-टू-टेक्स्ट रूटिंग।",
  settingsSpeakingSummary: "बोले गए उत्तर, प्लेबैक, आवाजें और पूर्वावलोकन।",
  settingsSearchSummary: "वेब खोज प्रदाता और खोज गुणवत्ता नियंत्रण।",
  settingsAppDiagnosticsSummary:
    "थीम, भाषा, उपयोग, डिबग लॉग और हाल की गतिविधि।",
  settingsBackToOverview: "सिंहावलोकन पर वापस जाएँ",
  settingsOpenSection: ({ section }) => `${section} खोलें`,
  theme: "थीम",
  language: "भाषा",
  recognitionLanguage: "पहचान की भाषा",
  recognitionLanguageHint:
    "बेहतर पहचान के लिए भाषा चुनें, या डिवाइस अथवा प्रदाता को अपने आप पहचानने दें।",
  automaticLanguage: "स्वचालित",
  usageStats: "उपयोग आँकड़े",
  model: "मॉडल",
  effort: "सोचने का स्तर",
  effortValue: ({ effort }) => `स्तर: ${effort}`,
  modelEffortNone: "कोई नहीं",
  modelEffortMinimal: "न्यूनतम",
  modelEffortLow: "कम",
  modelEffortMedium: "मध्यम",
  modelEffortHigh: "उच्च",
  modelEffortExtraHigh: "बहुत उच्च",
  modelEffortMax: "अधिकतम",
  modelEffortDynamic: "गतिशील",
  modelEffortDisabled: "बंद",
  modelEffortEnabled: "चालू",
  fixed: "तय",
  english: "अंग्रेज़ी",
  german: "जर्मन",
  ukrainian: "यूक्रेनी",
  hindi: "हिन्दी",
  spanish: "स्पेनिश",
  french: "फ़्रेंच",
  italian: "इतालवी",
  portuguese: "पुर्तगाली",
  portugueseBrazil: "पुर्तगाली (ब्राज़ील)",
  russian: "रूसी",
  simplifiedChinese: "सरलीकृत चीनी",
  arabic: "अरबी",
  japanese: "जापानी",
  kokoroAmericanFemaleVoice: ({ name }) =>
    `${name} · अमेरिकी अंग्रेज़ी, महिला आवाज़`,
  kokoroBritishFemaleVoice: ({ name }) =>
    `${name} · ब्रिटिश अंग्रेज़ी, महिला आवाज़`,
  kokoroChineseFemaleVoice: ({ index }) => `चीनी, महिला आवाज़ ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `चीनी, पुरुष आवाज़ ${index}`,
  light: "लाइट",
  dark: "डार्क",
  system: "सिस्टम",
  languageCoverage: ({ note }) => `भाषा कवरेज: ${note}`,
  recordingLimits: ({ note }) => `रिकॉर्डिंग सीमाएँ: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `मूल्य: ${summary}`,
  replyGenerationAction: "उत्तर पीढ़ी",
  speechTranscriptionAction: "भाषण प्रतिलेखन",
  instructionsTabDescription:
    "किसी भी प्रदाता के अनुरोध को देखने से पहले सहायक को संचालित करने वाले छिपे हुए मार्गदर्शन को आकार दें।",
  providersTabDescription:
    "डिवाइस पर बाह्य-सेवा क्रेडेंशियल संग्रहीत करें और उन प्रतिक्रिया मोड को कॉन्फ़िगर करें जिनका आप उपयोग करना चाहते हैं।",
  webSearchTabDescription:
    "उत्तरों से पहले वैकल्पिक लाइव वेब संदर्भ कॉन्फ़िगर करें।",
  responseModes: "मॉडल चयन",
  aboutModelSelection: "मॉडल चयन के बारे में",
  modelSelectionInfo:
    "प्रत्येक मॉडल कार्ड होम स्क्रीन पर एक विकल्प बन जाता है। इसके प्रदाता, मॉडल और वैकल्पिक प्रयास स्तर को कॉन्फ़िगर करें, फिर यह चुनने के लिए कार्ड स्विच करें कि कौन सा मॉडल अगला उत्तर देगा।",
  responseModeItemTitle: ({ index }) => `मॉडल ${index}`,
  addResponseMode: "मॉडल जोड़ें",
  removeResponseMode: "मॉडल हटाएँ",
  responseModesNoConfiguredProviders:
    "पहले क्रेडेंशियल जोड़ें. रूट नियंत्रण तब तक छिपे रहते हैं जब तक कि कम से कम एक संगत सेवा कॉन्फ़िगर न हो जाए।",
  useResponseMode: ({ mode }) => `${mode} का प्रयोग करें`,
  chooseResponseModel: "एक मॉडल चुनें",
  responseModelCount: ({ count }) => `${count} मॉडल उपलब्ध हैं`,
  sttTabDescription:
    "नियंत्रित करें कि भाषण कैसे कैप्चर किया जाता है और कौन सा बैकएंड मॉडल तक पहुंचने से पहले ऑडियो को टेक्स्ट में बदल देता है।",
  ttsTabDescription:
    "नियंत्रित करें कि उत्तर कब बोलना शुरू करें और कौन सा बैकएंड बोले गए आउटपुट को संभालता है।",
  brief: "संक्षिप्त",
  briefDescription:
    "उत्तर कड़ा रखें. उपयोगकर्ता को पूर्ण उत्तर देने के लिए आवश्यक न्यूनतम संख्या में वाक्यों का उपयोग करें।",
  normal: "सामान्य",
  normalDescription:
    "एक संतुलित प्रतिक्रिया अवधि का लक्ष्य रखें। उत्तर को लंबा खींचे बिना महत्वपूर्ण बिंदुओं को कवर करें।",
  thorough: "अच्छी तरह",
  thoroughDescription:
    "गहराई तक जाएं और व्यापक बनें। बारीकियाँ, विवरण, समझौता और वह तर्क शामिल करें जो मायने रखता है।",
  professional: "पेशेवर",
  professionalDescription:
    "किसी ग्राहक को जानकारी देने वाले वरिष्ठ सलाहकार की तरह बोलें। सटीक भाषा, कोई गाली-गलौज नहीं, नपी-तुली और आधिकारिक।",
  casual: "अनौपचारिक",
  casualDescription:
    "कॉफ़ी शॉप में एक स्मार्ट मित्र की तरह बोलें। निश्चिंत, स्वाभाविक, संवादी। संकुचन ठीक हैं, स्पर्श रेखाएँ ठीक हैं।",
  nerdy: "बेवकूफ",
  nerdyDescription:
    "एक उत्साही विशेषज्ञ की तरह बोलें जो गहराई तक जाना पसंद करता है। तकनीकी शब्दावली का स्वतंत्र रूप से उपयोग करें, विवरणों के बारे में जानें, मान लें कि उपयोगकर्ता जानकारी रख सकता है।",
  concise: "संक्षिप्त",
  conciseDescription:
    "पूर्ण होते हुए भी यथासंभव संक्षिप्त रहें। कोई प्रस्तावना नहीं, कोई पूरक नहीं, बस उत्तर। टेलीग्राम शैली में सोचें.",
  socratic: "सुकराती",
  socraticDescription:
    "उपयोगकर्ता की सोच को चुनौती दें. प्रति-प्रश्न पूछें, वैकल्पिक दृष्टिकोण प्रस्तुत करें, केवल उन्होंने जो कहा उसकी पुष्टि न करें। एक झगड़ालू भागीदार बनें, हां-मशीन नहीं।",
  eli5: "ELI5",
  eli5Description:
    "हर चीज़ को यथासंभव सरलता से समझाएँ। उपमाओं, रोजमर्रा की भाषा, शून्य शब्दजाल का प्रयोग करें। किसी भी विषय पर कोई पूर्व ज्ञान न मानें।",
  useProvider: ({ provider }) => `${provider} का प्रयोग करें`,
  createApiKey: "साख",
  apiKey: "API कुंजी",
  aboutThisProvider: "इस प्रदाता के बारे में",
  openRouterOnboardingTitle: "एक कुंजी, एकाधिक प्रदाता",
  openRouterOnboardingDescription:
    "एक समर्पित OpenRouter कुंजी बनाएं, इसे नीचे चिपकाएं, और किसी भी सीधे कनेक्शन को बदले बिना कई प्रदाताओं से स्नैपशॉट-समर्थित मॉडल का उपयोग करें।",
  openRouterOnboardingRoute:
    "अनुरोध पथ: यह डिवाइस → OpenRouter → चयनित अपस्ट्रीम प्रदाता",
  openRouterKeys: "OpenRouter कुंजियाँ",
  providerStatusInvalid: "अमान्य",
  providerStatusTesting: "परीक्षण",
  providerStatusConfigured: "कॉन्फ़िगर किया गया",
  providerStatusWorking: "कार्यरत",
  providerStatusNotTested: "परीक्षण नहीं किया गया",
  providerStatusNotSetup: "सेट अप नहीं",
  expandProvider: ({ provider }) => `विस्तृत करें${provider}`,
  collapseProvider: ({ provider }) => `संक्षिप्त करें ${provider}`,
  testProviderKey: "परीक्षण कुंजी",
  testAllCapabilities: "सभी का परीक्षण करें",
  apiTest: "API परीक्षण",
  testProviderCapability: ({ capability }) => `परीक्षण ${capability}`,
  test: "परीक्षा",
  optional: "वैकल्पिक",
  providerCapability_llm: "जवाब",
  providerCapability_stt: "भाषण इनपुट",
  providerCapability_tts: "ध्वनि आउटपुट",
  providerCapability_search: "वेब खोज",
  providerCapability_voices: "आवाज पुस्तकालय",
  providerValidationUnavailable:
    "इस प्रदाता के लिए लाइव सत्यापन अभी तक वायर्ड नहीं किया गया है। कुंजी को यहां सहेजें और वास्तविक उपयोग के दौरान इसे सत्यापित करें।",
  providerNeedsAttention: "ध्यान देने की जरूरत है",
  catalogProviderLimitsSummary: ({ summary }) => `सीमाएँ: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `क्षेत्र: ${summary}`,
  validatingKey: "सत्यापन किया जा रहा है...",
  showKey: "कुंजी दिखाएँ",
  hideKey: "कुंजी छिपाएँ",
  assistantInstructions: "सहायक निर्देश",
  systemPrompt: "सिस्टम प्रॉम्प्ट",
  aboutSystemPrompt: "सिस्टम प्रॉम्प्ट के बारे में",
  assistantInstructionsIntro:
    "प्रत्येक उत्तर से पहले मॉडल को प्राप्त छिपे हुए मार्गदर्शन को आकार दें।",
  baseInstructions: "आधार निर्देश",
  assistantInstructionsPlaceholder: "परिभाषित करें कि सहायक को कैसा व्यवहार करना चाहिए।",
  assistantInstructionsHint:
    "इसे हमेशा चयनित प्रतिक्रिया लंबाई और टोन से पहले जोड़ा जाता है।",
  adaptiveLength: "अनुकूली लंबाई",
  responseTone: "प्रतिक्रिया स्वर",
  homeStyleChipLabel: ({ tone, length }) => `शैली — ${tone} · ${length}`,
  styleSheetTitle: "वार्तालाप सेटिंग",
  styleSheetSubtitle: "केवल इस बातचीत के लिए उत्तर और भाषण तैयार करें।",
  openStyleSheet: "वार्तालाप सेटिंग खोलें",
  conversationThinkingInstructions: "सोच निर्देश",
  conversationThinkingInstructionsDescription:
    "इस वार्तालाप के लिए वैश्विक सिस्टम संकेत के बाद निर्देश जोड़ें।",
  conversationThinkingInstructionsPlaceholder:
    "उदाहरण के लिए: मेरी धारणाओं को चुनौती दें और ठोस उदाहरणों का उपयोग करें।",
  ttsInstructions: "भाषण वितरण निर्देश",
  ttsInstructionsDescription:
    "संगत भाषण मॉडल द्वारा उपयोग किए जाने वाले स्वर, गति, उच्चारण या वितरण का मार्गदर्शन करें।",
  conversationTtsInstructionsDescription:
    "इस वार्तालाप के लिए वैश्विक भाषण निर्देशों के बाद डिलीवरी निर्देश जोड़ें।",
  ttsInstructionsPlaceholder:
    "उदाहरण के लिए: गर्मजोशी से, स्पष्ट रूप से और आराम से बोलें।",
  ttsInstructionsUnsupported:
    "वर्तमान भाषण मार्ग वितरण निर्देशों का समर्थन नहीं करता.",
  conversationVoiceDescription: ({ route }) =>
    `इस बातचीत में ${route} द्वारा इस्तेमाल की गई आवाज़ चुनें।`,
  scrollToLatest: "नवीनतम संदेश तक स्क्रॉल करें",
  conversationTitleGenerate: "स्वतः-उत्पन्न शीर्षक",
  conversationTitleGenerating: "शीर्षक जनरेट किया जा रहा है...",
  conversationTitleGenerated: "बातचीत का नाम बदल दिया गया.",
  conversationTitleNeedsContent:
    "शीर्षक बनाने से पहले बातचीत शुरू करें.",
  conversationTitleNeedsProvider:
    "शीर्षक बनाने से पहले चयनित मॉडल को कॉन्फ़िगर करें।",
  conversationTitleGenerationFailed: "वार्तालाप शीर्षक उत्पन्न नहीं किया जा सका.",
  conversationTitleGenerationTimedOut:
    "शीर्षक निर्माण में बहुत अधिक समय लगा. कृपया पुन: प्रयास करें।",
  inputMode: "इनपुट मोड",
  voiceInput: "ध्वनि इनपुट",
  pushToTalk: "बात करने के लिए धक्का",
  pushToTalkDescription:
    "बोलते समय मुख्य बटन दबाए रखें, फिर भेजने के लिए छोड़ दें।",
  toggleToTalk: "बात करने के लिए टॉगल करें",
  toggleToTalkDescription:
    "रिकॉर्डिंग शुरू करने के लिए एक बार टैप करें और जब आपका काम पूरा हो जाए तो दोबारा टैप करें।",
  driveSession: "ड्राइव सत्र",
  driveSessionDescription:
    "जब स्वचालित निरंतरता चालू होती है, तो प्रत्येक बोले गए उत्तर के बाद रिकॉर्डिंग शुरू हो जाती है। जब आपका बोलना समाप्त हो जाए तो मुख्य बटन पर टैप करें।",
  stopDriveSession: "स्वतः रोकें",
  repeatDriveReply: "अंतिम बार दोहराएँ",
  continueDriveSession: "ऑटो फिर से शुरू करें",
  speechToText: "भाषण से पाठ तक",
  appNative: "सिस्टम पहचान",
  nativeSttDescription:
    "ऑपरेटिंग सिस्टम के वाक् पहचानकर्ता का उपयोग करें. डिवाइस सेटिंग्स के आधार पर, पहचान डिवाइस पर या सिस्टम सेवा के माध्यम से चल सकती है। किसी प्रदाता कुंजी की आवश्यकता नहीं है.",
  provider: "प्रदाता",
  webSearchProvider: "वेब खोज प्रदाता",
  webSearchProviderMissingHint:
    "यहां वेब ग्राउंडिंग को सक्षम करने के लिए क्रेडेंशियल्स में कम से कम एक खोज-सक्षम सेवा कॉन्फ़िगर करें।",
  webSearchModelHint: ({ model }) =>
    `लाइव वेब ग्राउंडिंग के लिए पर्दे के पीछे ${model} का उपयोग करता है।`,
  webSearchHomeHint:
    "इस थ्रेड के लिए वेब ग्राउंडिंग को चालू या बंद करने के लिए होम-स्क्रीन टॉगल का उपयोग करें।",
  settingsWebSearchCompactHint:
    "मुख्य मॉडल के उत्तरों से पहले वैकल्पिक रूप से ताजा वेब संदर्भ जोड़ें।",
  webSearchAdvanced: "उन्नत खोज नियंत्रण",
  expandAdvancedSearch: "उन्नत खोज नियंत्रणों का विस्तार करें",
  collapseAdvancedSearch: "उन्नत खोज नियंत्रणों को संक्षिप्त करें",
  webSearchSetupNeeded: "लाइव वेब खोज का उपयोग करने के लिए क्रेडेंशियल जोड़ें।",
  webSearchEnabledDescription:
    "मॉडल के उत्तर देने से पहले ताज़ा वेब संदर्भ जोड़ा जाता है।",
  webSearchDisabledDescription:
    "जब वर्तमान तथ्य महत्वपूर्ण हों तो इस थ्रेड के लिए लाइव वेब संदर्भ का उपयोग करें।",
  webSearchQualityControls: "खोज गुणवत्ता",
  webSearchSearchMode: "खोज मोड",
  webSearchSearchModeQuick: "जल्दी",
  webSearchSearchModeBalanced: "संतुलित",
  webSearchSearchModeDeep: "गहरा",
  webSearchDepth: "गहराई खोजें",
  webSearchDepthStandard: "मानक",
  webSearchDepthDeep: "गहरा",
  webSearchResultCount: "परिणाम गणना",
  webSearchQualityHint: ({ provider }) =>
    `ये नियंत्रण ट्यून करते हैं कि कैसे ${provider} उत्तर से पहले ताज़ा संदर्भ एकत्र करता है।`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} अभी तक इस ऐप में अतिरिक्त खोज-गुणवत्ता नियंत्रण प्रदर्शित नहीं करता है।`,
  setWebSearchMode: ({ mode }) => `वेब खोज मोड को ${mode} पर सेट करें`,
  openWebSearchSettings: "वेब खोज सेटिंग खोलें",
  providerSttDescription:
    "उत्तर मार्ग पर भेजने से पहले अपनी आवाज को ट्रांसक्राइब करने के लिए कॉन्फ़िगर की गई बाहरी सेवा का उपयोग करें।",
  sttProvider: "STT प्रदाता",
  sttProviderEnabledHint:
    "केवल ट्रांसक्रिप्शन समर्थन वाले सक्षम प्रदाता ही यहां दिखाई देते हैं।",
  sttProviderMissingHint:
    "STT समर्थन वाली किसी सेवा को चुनने के लिए उसके क्रेडेंशियल यहां जोड़ें।",
  nativeSttHint:
    "सिस्टम पहचान आपके प्रदाता कुंजियों से स्वतंत्र रूप से काम करती है और इसे डिवाइस पर या ऑपरेटिंग सिस्टम की वाक् सेवा द्वारा संसाधित किया जा सकता है।",
  replyPlayback: "उत्तर प्लेबैक",
  sentencesArrive: "पैराग्राफ आते हैं",
  sentencesArriveDescription:
    "पूरा पैराग्राफ तैयार होते ही बोलना शुरू करें।",
  fullReplyFirst: "पूर्ण उत्तर पहले",
  fullReplyFirstDescription:
    "पहले संपूर्ण उत्तर तैयार करें, फिर उसे एक बार में चलाएँ।",
  textToSpeech: "भाषण के पाठ",
  spokenReplies: "मौखिक उत्तर",
  spokenRepliesEnabledDescription:
    "ध्वनि मार्ग उपलब्ध होने पर सहायक उत्तरों को ज़ोर से पढ़ें।",
  spokenRepliesDisabledDescription:
    "अभी उत्तरों को केवल टेक्स्ट के रूप में रखें। आपका पसंदीदा TTS मार्ग बाद के लिए सहेजा जाता है।",
  nativeTtsDescription:
    "बोले गए उत्तरों और ध्वनि पूर्वावलोकन के लिए डिवाइस वाक् इंजन का उपयोग करें।",
  kokoroTtsDescription:
    "इस डिवाइस पर पूरी तरह से अधिक प्राकृतिक तंत्रिका आवाज का उपयोग करें। स्पोकन-रिप्लाई टेक्स्ट को स्थानीय रूप से संश्लेषित किया जाता है, जिसमें कोई स्पीच-प्रदाता कुंजी या उपयोग शुल्क नहीं होता है।",
  kokoroVoices: "Kokoro ऑन-डिवाइस आवाज़ें",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `बहुभाषी मॉडल लगभग ${size} MB डाउनलोड करता है और इंस्टॉलेशन के बाद लगभग ${installedSize} MB लेता है।`,
  kokoroModel: "Kokoro बहुभाषी मॉडल",
  kokoroChecking: "ऑन-डिवाइस मॉडल की जाँच की जा रही है...",
  kokoroDownloading: ({ progress }) => `डाउनलोड हो रहा है... ${progress}%`,
  kokoroExtracting: ({ progress }) => `इंस्टाल किया जा रहा है… ${progress}%`,
  kokoroVerifying: "ध्वनि इंजन का सत्यापन किया जा रहा है...",
  kokoroInstalled: "इस डिवाइस पर इंस्टॉल और तैयार है.",
  kokoroNotInstalled: "वैकल्पिक डाउनलोड. किसी प्रदाता कुंजी की आवश्यकता नहीं है.",
  kokoroLanguageFallback:
    "Kokoro वर्तमान में यहां अंग्रेजी और सरलीकृत चीनी भाषा बोलता है। अन्य चयनित उत्तर भाषाओं के लिए, एक स्पष्ट फ़ॉलबैक रूट जोड़ें अन्यथा भाषण एक त्रुटि के साथ बंद हो जाएगा।",
  kokoroRemoveTitle: "Kokoro मॉडल निकालें?",
  kokoroRemoveBody: ({ installedSize }) =>
    `इससे लगभग ${installedSize} एमबी खाली हो जाती है। आप किसी भी समय मॉडल को दोबारा डाउनलोड कर सकते हैं।`,
  removeKokoroModel: "Kokoro मॉडल निकालें",
  downloadKokoroModel: "Kokoro मॉडल डाउनलोड करें",
  kokoroFallbackNeeded: ({ languages }) =>
    `इसके लिए एक स्पष्ट फ़ॉलबैक मार्ग आवश्यक है: ${languages}।`,
  kokoroNoSelectedLanguages:
    "Kokoro आवाज को कॉन्फ़िगर करने के लिए भाषाएँ सुनें के अंतर्गत अंग्रेजी या सरलीकृत चीनी का चयन करें।",
  expandVoiceSettings: ({ language }) => `${language} ध्वनि सेटिंग विस्तृत करें`,
  collapseVoiceSettings: ({ language }) =>
    `${language} ध्वनि सेटिंग संक्षिप्त करें`,
  remove: "निकालना",
  voiceOutputDescription:
    "बोले गए उत्तरों के लिए वाक् इंजन, सुनने की भाषाएँ और ध्वनि पूर्वावलोकन चुनें।",
  localTts: "स्थानीय",
  localTtsDescription:
    "बोले गए उत्तरों के लिए मिलान वाली डाउनलोड की गई स्थानीय आवाज़ का उपयोग करें।",
  providerTtsDescription:
    "बोले गए उत्तरों के लिए चयनित कॉन्फ़िगर सेवा का उपयोग करें।",
  ttsFallbackRoutes: "फ़ॉलबैक मार्ग",
  ttsFallbackRoutesHint:
    "वैकल्पिक। केवल वही मार्ग जोड़ें जो आप चाहते हैं, उसी क्रम में जिस क्रम में उन्हें आज़माया जाना चाहिए। एक बार जब रूट बोलना शुरू कर देता है, तो मिस्टर ब्रोकली शेष उत्तर के लिए उस पर रहता है।",
  ttsFallbackNone:
    "कोई फ़ॉलबैक कॉन्फ़िगर नहीं किया गया है. इसके बजाय ध्वनि विफलता दिखाई जाएगी.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `${route} फ़ॉलबैक जोड़ें`,
  removeFallbackRoute: ({ route }) => `${route} फ़ॉलबैक हटाएँ`,
  moveFallbackEarlier: ({ route }) => `${route} को पहले ले जाएँ`,
  moveFallbackLater: ({ route }) => `बाद में ${route} ले जाएँ`,
  ttsProvider: "TTS प्रदाता",
  ttsProviderEnabledHint:
    "केवल बोले गए-उत्तर समर्थन वाले सक्षम प्रदाता ही यहां दिखाई देते हैं।",
  ttsProviderMissingHint:
    "TTS समर्थन वाली किसी सेवा को चुनने के लिए उसके क्रेडेंशियल यहां जोड़ें।",
  localTtsOrderHint:
    "केवल स्पष्ट रूप से कॉन्फ़िगर किए गए फ़ॉलबैक मार्गों का प्रयास किया जाता है।",
  providerTtsOrderHint:
    "केवल स्पष्ट रूप से कॉन्फ़िगर किए गए फ़ॉलबैक मार्गों का प्रयास किया जाता है।",
  nativeTtsHint:
    "नेटिव TTS सिस्टम वॉयस स्टैक का उपयोग करता है और इसके लिए प्रदाता कुंजी की आवश्यकता नहीं होती है।",
  localTtsLanguageCoverageHint:
    "स्थानीय पैक में वर्तमान में अंग्रेजी, जर्मन, सरलीकृत चीनी, स्पेनिश, पुर्तगाली, हिंदी, फ्रेंच और इतालवी शामिल हैं।",
  ttsVoice: "TTS आवाज",
  refresh: "ताज़ा करना",
  providerVoiceDirectory: ({ provider }) => `${provider} वॉयस लाइब्रेरी`,
  refreshProviderVoices: ({ provider }) => `${provider} आवाजें ताज़ा करें`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} ${Number(count) === 1 ? "आवाज़" : "आवाज"} ${provider} से उपलब्ध है।`,
  providerVoicesLoadFailed:
    "आवाज़ें ताज़ा नहीं की जा सकीं. आपका वर्तमान चयन अपरिवर्तित है; आप अभी भी मैन्युअल रूप से वॉयस आईडी दर्ज कर सकते हैं।",
  providerVoicesLoadFailedWithFallback:
    "खाता आवाजें लोड नहीं की जा सकीं. अंतर्निहित आवाज उपलब्ध रहती है।",
  providerVoicesErrorDetail: ({ detail }) => `कारण: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "ElevenLabs में, इस API कुंजी को संपादित करें और वॉयस → पढ़ें सक्षम करें, फिर यहां रीफ्रेश करें।",
  providerVoicesLoadingHint: ({ provider }) =>
    `मिस्टर ब्रोकली ${provider} से उपलब्ध आवाज़ों को स्वचालित रूप से लोड करता है।`,
  providerVoiceId: "वॉयस आईडी",
  providerVoiceIdPlaceholder: "वॉइस आईडी दर्ज करें",
  providerVoiceIdFallbackHint:
    "जब वॉयस लाइब्रेरी लोड नहीं की जा सकती तो मैन्युअल प्रविष्टि उपलब्ध रहती है।",
  providerVoiceIdRequired: ({ provider }) =>
    `स्पीच आउटपुट का उपयोग करने से पहले ${provider} वॉयस लाइब्रेरी को रीफ्रेश करें या वॉयस आईडी दर्ज करें।`,
  qwenSpeechUnavailableInUs:
    "मिस्टर ब्रोकली के वर्तमान Qwen भाषण मार्ग अमेरिकी क्षेत्र में उपलब्ध नहीं हैं। Qwen भाषण के लिए सिंगापुर या बीजिंग चुनें।",
  qwenApiRegion: "Qwen API क्षेत्र",
  qwenRegionSingapore: "सिंगापुर",
  qwenRegionUs: "यूएस (वर्जीनिया)",
  qwenRegionBeijing: "चीन (बीजिंग)",
  qwenRegionHint:
    "चयनित क्षेत्र को उस क्षेत्र से मेल खाना चाहिए जिसमें यह API कुंजी बनाई गई थी।",
  qwenRegionUsSpeechHint:
    "यूएस-क्षेत्र कुंजियाँ यहां चैट और वेब खोज का समर्थन करती हैं। मिस्टर ब्रोकली के वर्तमान Qwen STT और TTS मार्गों के लिए सिंगापुर या बीजिंग कुंजी की आवश्यकता होती है।",
  providerDefaultVoiceHint:
    "यह प्रदाता वर्तमान में पूर्वावलोकन और बोले गए उत्तरों के लिए अपनी डिफ़ॉल्ट आवाज़ का उपयोग करता है।",
  listenLanguages: "भाषाएँ सुनें",
  listenLanguagesHint:
    "वह उत्तर भाषाएँ चुनें जिन्हें आप अच्छा सुनना चाहते हैं। स्पीच आउटपुट को रूट करते समय मिस्टर ब्रोकली उन्हें इसी क्रम में आज़माता है।",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 भाषा चयनित" : `${count} भाषाएँ चयनित`,
  localVoicePacks: "स्थानीय वॉयस पैक",
  localVoicePacksHint:
    "प्रत्येक भाषा अपनी स्थानीय आवाज़ रखती है। उस भाषा के लिए अपनी इच्छित आवाज़ चुनें, फिर केवल वही पैक डाउनलोड करें जिनकी आप वास्तव में परवाह करते हैं।",
  localVoiceForLanguage: ({ languageLabel }) => `${languageLabel} के लिए आवाज`,
  providerVoicePreviews: "प्रदाता ध्वनि पूर्वावलोकन",
  providerVoicePreviewsHint:
    "प्रत्येक उत्तर भाषा के लिए एक अलग पूर्वावलोकन पाठ के साथ यहां वर्तमान में चयनित TTS मार्ग का परीक्षण करें।",
  nativeVoicePreviewSection: "मूल आवाज पूर्वावलोकन",
  nativeVoicePreviewSectionHint:
    "यह फ़ोन के अंतर्निर्मित स्पीच सिंथेसाइज़र के माध्यम से सीधे बोलता है ताकि आप इसकी तुलना कॉन्फ़िगर किए गए प्रदाता की आवाज़ों से कर सकें।",
  nativeVoiceUnavailable:
    "इस डिवाइस ने पूर्वावलोकन के लिए किसी भी मूल सिस्टम आवाज़ की सूचना नहीं दी।",
  speechDiagnostics: "हाल की भाषण गतिविधि",
  speechDiagnosticsHint:
    "नवीनतम भाषण अनुरोध, उनके द्वारा मांगे गए मार्ग, वास्तव में उनके द्वारा उपयोग किए गए मार्ग और किसी भी फ़ॉलबैक कारण को दिखाता है।",
  clearSpeechDiagnostics: "हाल की भाषण गतिविधि साफ़ करें",
  speechDiagnosticsEmpty:
    "अभी तक कोई हालिया भाषण अनुरोध नहीं। यहां रूटिंग विवरण देखने के लिए किसी आवाज का पूर्वावलोकन करें या उत्तर चलाएं।",
  clearSpeechDiagnosticsConfirmationTitle: "हाल की भाषण गतिविधि साफ़ करें?",
  clearSpeechDiagnosticsConfirmationMessage:
    "यह कैप्चर किए गए सभी स्पीच-रूटिंग डायग्नोस्टिक्स को हटा देता है। इस एक्शन को वापस नहीं किया जा सकता।",
  speechDiagnosticSourceConversation: "बातचीत का जवाब",
  speechDiagnosticSourceRepeat: "उत्तर दोहराएँ",
  speechDiagnosticSourcePreview: "ध्वनि पूर्वावलोकन",
  speechDiagnosticSourceUnknown: "भाषण अनुरोध",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `अनुरोधित: ${requested} -> वास्तविक: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `नवीनतम चरण: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `भाषा: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `प्रदाता: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `आवाज़: ${voice}`,
  localTtsPackReady: "इस डिवाइस पर इंस्टॉल किया गया.",
  localTtsPackBroken:
    "डाउनलोड किया गया, लेकिन यह आवाज़ इस डिवाइस पर स्थानीय सत्यापन में विफल रही। इसे पुनः डाउनलोड करें या कोई अन्य आवाज़ चुनें।",
  localTtsPackMissing:
    "अभी तक स्थापित नहीं किया गया है. जब तक आप इसे डाउनलोड नहीं करेंगे तब तक क्लाउड TTS या सिस्टम वॉयस का उपयोग किया जाएगा।",
  localTtsUnsupportedLanguageFallback:
    "इस भाषा के लिए कोई स्थानीय पैक अभी तक उपलब्ध नहीं है। क्लाउड TTS या सिस्टम वॉयस इसे संभाल लेगा।",
  downloadingLocalTtsPack: ({ progress }) =>
    `स्थानीय पैक डाउनलोड हो रहा है... ${progress}%`,
  download: "डाउनलोड करना",
  downloadingShort: "लोड हो रहा है...",
  voicePreviewText: "ध्वनि पूर्वावलोकन पाठ",
  voicePreviewPlaceholder: "इस आवाज़ को सुनने के लिए एक वाक्यांश टाइप करें.",
  voicePreviewHint:
    "भाषा मॉडल पर कुछ भी भेजे बिना वर्तमान में चयनित उत्तर वॉयस बैकएंड का उपयोग करता है।",
  previewVoice: "आवाज़ का पूर्वावलोकन करें",
  generatingPreview: "पूर्वावलोकन उत्पन्न हो रहा है...",
  playingPreview: "पूर्वावलोकन चल रहा है...",
  systemVoice: "सिस्टम आवाज",
  spokenRepliesOff: "केवल पाठ करें",
  noTtsProvider: "कोई TTS प्रदाता नहीं",
  nothingToCopyYet: "अभी तक कॉपी करने के लिए कुछ भी नहीं है.",
  couldntCopyText: "उस पाठ की प्रतिलिपि नहीं बनाई जा सकी.",
  nothingToShareYet: "अभी साझा करने के लिए कुछ भी नहीं है.",
  couldntShareText: "वह पाठ साझा नहीं किया जा सका.",
  couldntReplayReply: "वह उत्तर दोबारा नहीं चलाया जा सका.",
  replyFailed: "उत्तर विफल",
  retryReply: "उत्तर पुनः प्रयास करें",
  replyFailedHint: "आप पुनः प्रयास करने से पहले उपरोक्त कोई अन्य मॉडल चुन सकते हैं।",
  spokenReplyFailed: "उत्तर सहेज लिया गया, लेकिन बोला नहीं जा सका.",
  retrySpeech: "भाषण पुनः प्रयास करें",
  openSpeakingSettings: "बोलने की सेटिंग",
  messageCopied: "संदेश कॉपी किया गया.",
  noConversationToCopyYet: "कॉपी करने के लिए अभी कोई बातचीत नहीं है.",
  noConversationToShareYet: "साझा करने के लिए अभी तक कोई बातचीत नहीं है.",
  noReplyToRepeatYet: "पुनः चलाने के लिए अभी तक कोई उत्तर नहीं।",
  threadCopied: "थ्रेड कॉपी किया गया.",
  threadRenamed: "थ्रेड का नाम बदला गया.",
  threadPinned: "धागा पिन किया गया.",
  threadUnpinned: "थ्रेड अनपिन किया गया.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `इस मार्ग का उपयोग करने से पहले सेटिंग्स में ${provider} के लिए क्रेडेंशियल जोड़ें।`,
  configureCredentialsBeforeVoiceSession:
    "वॉयस सेशन शुरू करने से पहले सेटिंग्स में क्रेडेंशियल जोड़ें।",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `${provider} के लिए, प्रदाता आधार URL और API कुंजी को https://your-endpoint.example.com|your-api-key के रूप में दर्ज करें।`,
  speechRecognitionUnavailableOnDevice:
    "इस डिवाइस पर वाक् पहचान उपलब्ध नहीं है.",
  debugLogLabel: "लकड़ी का लट्ठा",
  debugLogCaptureStarted: "डिबग लॉगिंग प्रारंभ हुई.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `डीबग लॉग को ${fileName} के रूप में सहेजा गया और क्लिपबोर्ड (${entryCount} प्रविष्टियाँ) पर कॉपी किया गया।`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `डीबग लॉग को ${fileName} (${entryCount} प्रविष्टियों) के रूप में सहेजा गया।`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `पिछला डिबग लॉग ${fileName} पुनर्प्राप्त किया और इसे क्लिपबोर्ड (${entryCount} प्रविष्टियाँ) पर कॉपी किया।`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `पिछला डिबग लॉग ${fileName} (${entryCount} प्रविष्टियाँ) पुनर्प्राप्त किया गया।`,
  debugLogCaptureFailed: "डिबग लॉग सहेजा नहीं जा सका.",
  chooseSttBeforeVoiceSession:
    "वॉयस सेशन शुरू करने से पहले सेटिंग्स में कॉन्फ़िगर किया गया STT रूट चुनें।",
  chooseTtsBeforeSpokenReplies:
    "बोले गए उत्तरों का उपयोग करने से पहले सेटिंग्स में कॉन्फ़िगर किया गया TTS रूट चुनें।",
  stopSessionBeforeReplay:
    "अंतिम उत्तर पुनः चलाने से पहले सक्रिय ध्वनि सत्र रोकें।",
  couldntCatchThatTryAgain: "उसे पकड़ नहीं सका, पुनः प्रयास करें।",
  couldntStartVoiceInput: "ध्वनि इनपुट प्रारंभ नहीं किया जा सका.",
  couldntProcessVoiceInput: "ध्वनि इनपुट संसाधित नहीं किया जा सका.",
  maxRecordingLengthReached:
    "रिकॉर्डिंग की अधिकतम अवधि पूरी हो गई है - जो मेरे पास है उसे भेज रहा हूँ।",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `वह रिकॉर्डिंग ${provider} वाक्-से-पाठ (अधिकतम ${limit}) के लिए बहुत लंबी है। एक छोटा संदेश आज़माएँ, या स्पीच-टू-टेक्स्ट को सिस्टम रिकग्निशन पर स्विच करें।`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `इस मार्ग का उपयोग करने से पहले सेटिंग्स में ${provider} के लिए क्रेडेंशियल जोड़ें।`,
  stopSessionBeforePreview:
    "किसी आवाज का पूर्वावलोकन करने से पहले सक्रिय आवाज सत्र बंद कर दें।",
  chooseTtsToPreviewVoices:
    "आवाज़ों का पूर्वावलोकन करने के लिए सेटिंग्स में कॉन्फ़िगर किया गया TTS रूट चुनें।",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `पहले चयनित ${languageLabel} लोकल वॉयस डाउनलोड करें।`,
  couldntPreviewVoice: "आवाज का पूर्वावलोकन नहीं किया जा सका.",
  spokenRepliesDisabled: "सेटिंग्स में बोले गए उत्तर बंद हैं।",
  providerVoiceFallback:
    "कॉन्फ़िगर किया गया ध्वनि मार्ग विफल रहा. इस उत्तर को फ़ॉलबैक आवाज़ में बदल दिया गया।",
  localVoiceFallback:
    "स्थानीय आवाज़ अनुपलब्ध थी. इस उत्तर को फ़ॉलबैक आवाज़ में बदल दिया गया।",
  localTtsPackInstalled: ({ languageLabel }) =>
    `${languageLabel} स्थानीय वॉयस पैक स्थापित।`,
  localTtsPackInstallFailed: "स्थानीय वॉयस पैक स्थापित नहीं किया जा सका.",
  clear: "स्पष्ट",
  voiceOutput: "आवाज आउटपुट",
  currentSetup: "मौजूदा सेटअप",
  listeningToYourVoice: "आपकी आवाज़ सुन रहा हूँ",
  parsingYourVoiceInput: "अपनी आवाज़ को टेक्स्ट में बदलना",
  preparingRequest: "आपका अनुरोध तैयार किया जा रहा है",
  searchingTheWeb: "ताज़ा संदर्भ के लिए वेब पर खोज कर रहा हूँ",
  waitingForProvider: ({ provider }) => `${provider} की प्रतीक्षा है`,
  preparingVoiceWithProvider: ({ provider }) =>
    `${provider} के साथ आवाज तैयार करना`,
  deepThinkingReassurance: "अच्छे उत्तरों में कुछ समय लगता है...",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "आपसे वापस बात कर रहा हूँ",
  freshSession: "ताज़ा सत्र",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 संदेश" : `${count} संदेश`,
  speechInputRoute: ({ route }) => `भाषण: ${route}`,
  replyModelRoute: ({ route }) => `उत्तर मॉडल: ${route}`,
  voiceOutputRoute: ({ route }) => `आवाज़ बाहर: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `फ़ॉलबैक वॉइस आउट: ${route}`,
  conversation: "बातचीत",
  conversationActions: "वार्तालाप क्रियाएँ",
  statusDetails: "स्थिति विवरण",
  persistenceFailure:
    "मिस्टर ब्रोकली इस डिवाइस पर डेटा सहेज नहीं सका। ऐप खुला रखें और पुनः प्रयास करें; पुनरारंभ के बाद हाल के परिवर्तन खो सकते हैं।",
  show: "दिखाओ",
  showTranscript: "प्रतिलेख दिखाएँ",
  hide: "छिपाना",
  copyThread: "थ्रेड कॉपी करें",
  shareThread: "धागा साझा करें",
  repeatReply: "उत्तर दोहराएँ",
  renameThread: "थ्रेड का नाम बदलें",
  renameThreadHint:
    "इस वार्तालाप को एक शीर्षक दें जिसे आप बाद में तुरंत पा सकें।",
  threadTitle: "थ्रेड शीर्षक",
  noTranscriptYet: "अभी तक कोई प्रतिलेख नहीं",
  previewTranscriptEmptyDescription:
    "आरंभ करने के लिए ध्वनि या पाठ का उपयोग करें. आपकी बातचीत यहां दिखाई देगी.",
  noConversationYet: "अभी तक कोई बातचीत नहीं हुई",
  expandedTranscriptEmptyDescription:
    "आरंभ करने के लिए ध्वनि या पाठ का उपयोग करें. जब आप मुख्य मंच पर लौटना चाहें तो इस स्क्रीन को बंद कर दें।",
  transcriptSelectionHint:
    "किसी भी संदेश पाठ को सीधे चुनें, या नीचे दिए गए व्यक्तिगत संदेशों को साझा करें और कॉपी करें।",
  textMessagePlaceholder: "एक संदेश टाइप करें",
  sendTextMessage: "मेसेज भेजें",
  showVoiceInput: "ध्वनि इनपुट दिखाएँ",
  showTextInput: "टेक्स्ट इनपुट दिखाएँ",
  usageStatsHiddenDescription: "टोकन अनुमान को प्रतिलेख UI से बाहर रखें।",
  usageStatsVisibleDescription:
    "उत्तरों और बातचीत के योग के लिए अनुमानित टोकन उपयोग दिखाएं।",
  debugLogButton: "डिबग लॉग बटन",
  debugLogButtonHiddenDescription:
    "होम-स्क्रीन लॉग बटन को तब तक छिपा कर रखें जब तक कोई कैप्चर पहले से ही न चल रहा हो।",
  debugLogButtonVisibleDescription:
    "डिबग कैप्चर शुरू करने और रोकने के लिए होम-स्क्रीन लॉग बटन दिखाएं।",
  debugLogButtonUsageDescription:
    "बटन का उपयोग कैसे करें: इसे चालू करने से लॉग कैप्चर करना शुरू हो जाएगा। इसे टॉगल करने से लॉग कैप्चर करना बंद हो जाएगा और कैप्चर किए गए लॉग क्लिपबोर्ड में चले जाएंगे।",
  estimatedUsageTitle: "अनुमानित उपयोग",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} उत्तर · ${summaries} मेमोरी अपडेट`,
  estimatedUsageConversationScope:
    "योग में इस वार्तालाप के अंदर उपयोग किए गए प्रत्येक मार्ग और मॉडल शामिल हैं।",
  estimatedPromptTokens: ({ count }) => `संकेत: ${count}`,
  estimatedReplyTokens: ({ count }) => `उत्तर: ${count}`,
  estimatedTotalTokens: ({ count }) => `कुल: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `ईएसटी। ${prompt} अंदर · ${completion} बाहर · ${total} कुल`,
  searchQuery: "प्रश्न खोजना",
  expandWebSearchDetails: "वेब खोज विवरण दिखाएँ",
  collapseWebSearchDetails: "वेब खोज विवरण छिपाएँ",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "स्रोत" : "सूत्रों का कहना है"}`,
  sources: "सूत्रों का कहना है",
  openSourceLink: ({ source }) => `खुला स्रोत: ${source}`,
  turnReceipt: "विवरण पलटें",
  expandTurnReceipt: "बारी विवरण दिखाएँ",
  collapseTurnReceipt: "मोड़ विवरण छिपाएँ",
  turnReceiptDirect: "प्रत्यक्ष",
  turnReceiptRequested: "अनुरोधित उत्तर मार्ग",
  turnReceiptActual: "वास्तविक उत्तर मार्ग",
  turnReceiptEffort: "तर्क नियंत्रण",
  turnReceiptProviderNative: "प्रदाता-मूल",
  turnReceiptInput: "इनपुट मार्ग",
  turnReceiptSearch: "वेब खोज",
  turnReceiptVoice: "ध्वनि आउटपुट",
  turnReceiptContext: "प्रसंग",
  turnReceiptTiming: "समय",
  turnReceiptFallback: "फ़ॉलबैक कारण",
  turnReceiptVoiceInput: "आवाज़",
  turnReceiptTypedInput: "लिखे गए",
  turnReceiptSystemSpeech: "सिस्टम वाक् पहचान",
  turnReceiptSystemVoice: "सिस्टम आवाज",
  turnReceiptSystemVoiceFallback: "सिस्टम आवाज · फ़ॉलबैक",
  turnReceiptOff: "बंद",
  turnReceiptNotConfigured: "चालू · कॉन्फ़िगर नहीं किया गया",
  turnReceiptFallbackWithoutSearch: "लाइव खोज के बिना जारी रखा गया",
  turnReceiptNotUsed: "उपयोग नहीं किया",
  turnReceiptSummaryReused: "सहेजा गया सारांश पुन: उपयोग किया गया",
  turnReceiptSummaryUpdated: "सारांश अद्यतन किया गया",
  turnReceiptContextFallback: "हालिया-संदेश फ़ॉलबैक",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `गेटवे ने ${original} से ${compressed} संदेशों को संपीड़ित किया`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} पूर्व संदेश भेजे गए · ${summarized} नया सारांशित${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "प्रसंग",
  turnReceiptTimingSearch: "खोज",
  turnReceiptTimingModel: "नमूना",
  turnReceiptTimingFirstSpeech: "पहला भाषण",
  turnReceiptTimingTotal: "कुल",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} टोकन`,
  unknownUsageRoute: "अज्ञात मार्ग",
  setupGuideConnectProviderTitle: "क्रेडेंशियल कॉन्फ़िगर करें",
  setupGuideConnectProviderDescription:
    "सेटिंग्स में क्रेडेंशियल जोड़ें, फिर वे मार्ग चुनें जिनका आप उपयोग करना चाहते हैं।",
  idle: "निठल्ला",
  yourConversationAppearsHere: "आपकी बातचीत यहां दिखाई देती है",
  defaultTranscriptEmptyDescription:
    "आरंभ करने के लिए ध्वनि या पाठ का उपयोग करें. मिस्टर ब्रोकली थ्रेड रखेगा और यहां प्रतिक्रिया देगा।",
  delete: "मिटाना",
  deleteConversationConfirmationTitle: ({ title }) => `"${title}" हटाएं?`,
  deleteConversationConfirmationMessage:
    "यह वार्तालाप और उसके सभी संदेशों को स्थायी रूप से हटा देता है। इस एक्शन को वापस नहीं किया जा सकता।",
  memory: "याद",
  conversations: "बात चिट",
  drawerSubtitle: "लाइव धागों के बीच कूदें या एक नया कमरा शुरू करें।",
  newSession: "नया सत्र",
  noSavedConversationsYet: "अभी तक कोई सहेजी गई बातचीत नहीं",
  drawerEmptyDescription:
    "मुख्य दृश्य से बोलना प्रारंभ करें और मिस्टर ब्रोकली स्वचालित रूप से एक सत्र बनाएगा।",
  setupGuideTitle: "ऐप कॉन्फ़िगर करें",
  setupGuideSubtitle: "सेटिंग्स में क्रेडेंशियल जोड़ें और मार्ग चुनें।",
  fastestStartPreset: "न्यूनतम सेटअप",
  fastestStartDescription:
    "जहां उपलब्ध हो वहां डिवाइस स्पीच का उपयोग करें और केवल वही उत्तर मार्ग कॉन्फ़िगर करें जिसकी आपको आवश्यकता है।",
  fullVoicePreset: "विन्यस्त आवाज",
  fullVoiceDescription:
    "जब आप उत्तर, प्रतिलेखन और बोले गए आउटपुट को चुनते हैं तो उनके लिए कॉन्फ़िगर की गई सेवाओं का उपयोग करें।",
  setupGuideNote:
    "हम आगे सेटिंग्स खोलेंगे ताकि आप क्रेडेंशियल पेस्ट और सत्यापित कर सकें।",
  useThisSetup: "इस सेटअप का उपयोग करें",
  notNow: "अभी नहीं",
  setupGuideIntroTitle: "मिस्टर ब्रोकली कैसे काम करता है",
  setupGuideIntroBody:
    "मिस्टर ब्रोकली रिक्त प्रारंभ होता है। आपके द्वारा पहले से उपयोग की जाने वाली बाहरी सेवाओं के लिए क्रेडेंशियल जोड़ें, फिर चुनें कि उत्तर, भाषण इनपुट, बोले गए आउटपुट और वैकल्पिक वेब संदर्भ को कैसे रूट किया जाए।",
  setupGuideIntroNote:
    "सेटअप के बाद, बातचीत शुरू करने और रोकने के लिए मुख्य ध्वनि नियंत्रण का उपयोग करें। वर्तमान प्रतिलेख होम स्क्रीन पर उपलब्ध रहता है, और प्रत्येक मार्ग को बाद में सेटिंग्स में बदला जा सकता है।",
  setupGuideProviderTitle: "क्रेडेंशियल जोड़ें",
  setupGuideProviderBody:
    "वह बाहरी सेवा चुनें जिसे आप कॉन्फ़िगर करना चाहते हैं, फिर उत्तर पहुंच के साथ क्रेडेंशियल पेस्ट करें।",
  setupGuideProviderPickerLabel: "उत्तर सेवा",
  setupGuideSelectProvider: "एक प्रदाता चुनें",
  setupGuideSelectProviderFirst: "पहले एक प्रदाता चुनें.",
  setupGuideApiKeyLabel: "API कुंजी",
  setupGuideApiKeyPlaceholder: "क्रेडेंशियल चिपकाएँ",
  setupGuideContinue: "जारी रखना",
  setupGuideOpenSettings: "खुली सेटिंग",
  setupGuideBack: "पीछे",
  setupGuideValidateKey: "सत्यापित कुंजी",
  setupGuideApiKeyRequiredOrCancel:
    "जारी रखने या सेटअप गाइड को रद्द करने के लिए API कुंजी जोड़ें।",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "एक प्रदाता चुनें और सेटअप गाइड को जारी रखने या रद्द करने के लिए एक API कुंजी जोड़ें।",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `ये ${provider} क्रेडेंशियल उत्तर अनुरोधों की अनुमति नहीं देते हैं।`,
  setupGuideKokoroTitle: "डिवाइस पर प्राकृतिक आवाज़ जोड़ें",
  setupGuideKokoroBody: ({ size }) =>
    `वैकल्पिक: भाषण प्रदाता या उपयोग शुल्क के बिना कहीं अधिक प्राकृतिक मौखिक उत्तरों के लिए Kokoro (लगभग ${size} MB) डाउनलोड करें।`,
  setupGuideKokoroLanguageNote:
    "यह मॉडल वर्तमान में अंग्रेजी और सरलीकृत चीनी भाषा बोलती है। बाद में आप जो भी फ़ॉलबैक रूट चाहते हैं उसे स्पीकिंग सेटिंग में कॉन्फ़िगर करें।",
  setupGuideKokoroDownload: "Kokoro डाउनलोड करें",
  setupGuideUseKokoro: "बोले गए उत्तरों के लिए Kokoro का उपयोग करें",
  setupGuideUseKokoroSummary:
    "जब भी उत्तर भाषा समर्थित हो तो फ़ोन पर संश्लेषण रखें।",
  setupGuideSkipKokoro: "अभी के लिए छोड़ दे",
  setupGuideVoiceTestTitle: "अपने सेटअप का परीक्षण करें",
  setupGuideVoiceTestBody:
    "एक छोटा सा वाक्य बोलो. स्वीकार्य वॉयस रूट उपलब्ध होने पर मिस्टर ब्रोकली माइक्रोफोन एक्सेस, ट्रांसक्रिप्शन, कॉन्फ़िगर रिप्लाई रूट और स्पोकन आउटपुट का परीक्षण करेगा।",
  setupGuideVoiceTestNoInputBody:
    "इस सेटअप के साथ वॉयस इनपुट उपलब्ध नहीं है। पता लगाए गए मार्गों की समीक्षा करना जारी रखें, फिर यदि आवश्यक हो तो बाद में भाषण सेटिंग्स समायोजित करें।",
  setupGuideVoiceTestTextOnlyNote:
    "यह परीक्षण केवल पाठ्य ही रहता है क्योंकि कोई स्वीकार्य मौखिक ध्वनि मार्ग अभी तक तैयार नहीं है।",
  setupGuideVoiceTestStart: "परीक्षण प्रारंभ करें",
  setupGuideVoiceTestStop: "रिकॉर्डिंग बंद करें",
  setupGuideVoiceTestRetry: "दोबारा दौड़ें",
  setupGuideVoiceTestTranscribing: "प्रतिलेखन...",
  setupGuideVoiceTestThinking: "उत्तर का परीक्षण किया जा रहा है...",
  setupGuideVoiceTestSynthesizing: "आवाज तैयार की जा रही है...",
  setupGuideVoiceTestSpeaking: "उत्तर चल रहा है...",
  setupGuideVoiceTestTranscript: "प्रतिलिपि",
  setupGuideVoiceTestReply: "जवाब",
  setupGuideVoiceTestReset: "इस परिणाम को साफ़ करें",
  setupGuideVoiceInputUnavailable:
    "इस डिवाइस पर इस सेटअप के लिए वॉयस इनपुट उपलब्ध नहीं है।",
  setupGuideSummaryTitle: "सेटअप पूर्ण",
  setupGuideSummaryBody:
    "यहां वह मार्ग है जिसका उपयोग मिस्टर ब्रोकली आपके वर्तमान कॉन्फ़िगरेशन के साथ करेगा।",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "भाषण से पाठ",
  setupGuideSummaryTts: "भाषण के पाठ",
  setupGuideSummaryWebSearch: "वेब खोज",
  setupGuideRouteProviderLlm: ({ provider }) => `${provider} के माध्यम से सक्षम किया गया`,
  setupGuideRouteOnDeviceStt: "सिस्टम वाक् पहचान के माध्यम से सक्षम",
  setupGuideRouteProviderStt: ({ provider }) =>
    `${provider} वाक् प्रतिलेखन के माध्यम से सक्षम`,
  setupGuideRouteProviderTts: ({ provider }) => `${provider} ध्वनि के माध्यम से सक्षम`,
  setupGuideRouteKokoroTts: "Kokoro ऑन-डिवाइस वॉयस के माध्यम से सक्षम",
  setupGuideRouteLocalTts: "स्थानीय वॉयस पैक के माध्यम से सक्षम",
  setupGuideRouteUnavailable: "उपलब्ध नहीं है",
  setupGuideRouteOff: "बंद",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `${provider} के माध्यम से उपलब्ध, वर्तमान में बंद`,
  setupGuideSummaryTextOnlyNote:
    "मौखिक उत्तर फिलहाल बंद हैं। जब तक आप किसी प्रदाता या स्थानीय आवाज को सक्षम नहीं करते तब तक उत्तर टेक्स्ट में ही रहते हैं।",
  setupGuideFinish: "हो गया",
  searchConversationsPlaceholder: "शीर्षक, मॉडल और संदेश पाठ खोजें",
  noMatchingConversations: "कोई मेल खाती बातचीत नहीं",
  noMatchingConversationsDescription:
    "प्रतिलेख से भिन्न शीर्षक, मार्ग, मॉडल या वाक्यांश आज़माएँ।",
  memoryModalTitle: "वार्तालाप स्मृति",
  memoryModalDescription:
    "यह कॉम्पैक्ट सारांश है मिस्टर ब्रोकली एक बार थ्रेड को पुराने मोड़ों को संपीड़ित करने के लिए पर्याप्त लंबा हो जाने पर आगे बढ़ाता है।",
  memorySummary: "सारांश सहेजा गया",
  memorySummaryEmpty:
    "अभी तक कोई कॉम्पैक्ट मेमोरी नहीं है. एक बार जब यह धागा लंबा हो जाएगा, तो पुराने मोड़ों को यहां संक्षेप में प्रस्तुत किया जाएगा।",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 सारांशित मोड़" : `${count} संक्षेपित मोड़`,
  copyMemory: "मेमोरी कॉपी करें",
  forgetMemory: "स्मृति भूल जाओ",
  memoryCopied: "मेमोरी कॉपी की गई.",
  memoryCleared: "वार्तालाप स्मृति साफ़ की गई.",
  noConversationToManageYet: "अभी तक कोई वार्तालाप स्मृति उपलब्ध नहीं है.",
  noProviderYet: "अभी तक कोई प्रदाता नहीं",
  noModelYet: "अभी तक कोई मॉडल नहीं",
  startedAt: "शुरू कर दिया",
  endedAt: "समाप्त",
  pinned: "पिन की गई",
  copy: "प्रतिलिपि",
  share: "शेयर करना",
  rename: "नाम बदलें",
  pin: "नत्थी करना",
  unpin: "अनपिन",
  save: "बचाना",
  cancel: "रद्द करना",
  stop: "रुकना",
  pause: "विराम",
  resume: "फिर शुरू करना",
  paused: "रुका हुआ",
  listening: "सुनना",
  parsing: "प्रतिलेखन",
  searching: "खोज रहे हैं",
  converting: "परिवर्तित",
  webSearchAction: "वेब खोज",
  thinking: "सोच",
  speaking: "बोला जा रहा है",
  pleaseWait: "कृपया प्रतीक्षा करें",
  yourTurn: "आपकी बारी",
  keepPressing: "दबाते रहो",
  tapWhenDone: "पूरा होने पर टैप करें",
  speechPaused: "वाणी रुकी हुई है",
  pausePlaybackUnavailable:
    "इस ध्वनि मार्ग को रोका नहीं जा सकता. इसे रोकें या प्रदाता वॉयस आउटपुट पर स्विच करें।",
  holdToSpeak: "बोलने के लिए रुकें",
  tapToSpeak: "बोलने के लिए टैप करें",
  tapAgainToSend: "भेजने के लिए फिर से टैप करें",
  waitingForReply: "जवाब का इंतज़ार",
  parsingYourVoice: "अपनी आवाज़ को पार्स करना",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} सेटिंग्स में कॉन्फ़िगर नहीं है.`,
  providerNetworkError: ({ provider, action }) =>
    `${action} के लिए ${provider} तक नहीं पहुंच सका। कनेक्शन की जाँच करें और पुनः प्रयास करें।`,
  providerAuthError: ({ provider, action }) =>
    `${provider} ने ${action} के क्रेडेंशियल्स को अस्वीकार कर दिया। API कुंजी और अनुमतियाँ जाँचें।`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} अभी दर सीमित ${action} है। थोड़ी देर में पुनः प्रयास करें.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} को ${action} के लिए पर्याप्त API क्रेडिट की आवश्यकता है। खाते की शेष राशि और कुंजी की व्यय सीमा की जाँच करें।`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} को ${action} के दौरान बहुत अधिक समय लगा। पुनः प्रयास करें।`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} को ${action} के दौरान एक अस्थायी समस्या हुई। शीघ्र ही पुनः प्रयास करें.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} बिना कोई उत्तर दिए समाप्त हो गया। पुनः प्रयास करें।`,
  providerIncompleteReplyError: ({ provider }) =>
    `${provider} का उत्तर पूरा होने से पहले ही समाप्त हो गया। पुनः प्रयास करें।`,
  providerContextTooLong: ({ provider }) =>
    `${provider} ने उत्तर अस्वीकार कर दिया क्योंकि बातचीत बहुत लंबी हो गई। एक नया थ्रेड शुरू करें या अनुरोध को छोटा करें।`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} ने ${action} अनुरोध अस्वीकार कर दिया: ${detail}`
      : `${provider} ने ${action} अनुरोध को अस्वीकार कर दिया।`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} ने वेब खोज चलाए बिना प्रतिक्रिया लौटा दी।`,
  providerValidationSuccess: ({ provider }) => `${provider} उपयोग के लिए तैयार है।`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} काम कर रहा है.`,
  providerValidationFailed: "प्रदाता सत्यापन विफल रहा.",
  webSearchFallback:
    "वेब खोज अनुपलब्ध थी, इसलिए उत्तर लाइव वेब संदर्भ के बिना जारी रहा।",
  noBase64EncoderAvailable: "कोई बेस64 एनकोडर उपलब्ध नहीं है।",
  noBase64DecoderAvailable: "कोई बेस64 डिकोडर उपलब्ध नहीं है।",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS को <key>|<region> प्रारूप में Azure स्पीच क्रेडेंशियल की आवश्यकता है, उदाहरण के लिए abc123|westeurope, या संयुक्त Azure प्रारूप <endpoint>|<api-key>|<key>|<region>।",
  googleCloudSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT को <project-id>|<access-token>|<location>, या संयुक्त Gemini प्रारूप <Gemini API key>|<project-id>|<access-token>|<location> प्रारूप में Google Cloud Speech क्रेडेंशियल की आवश्यकता है।`,
  bytedanceSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT को <app-key>|<access-key> प्रारूप में Doubao भाषण क्रेडेंशियल की आवश्यकता है, वैकल्पिक रूप से <app-key>|<access-key>|<resource-id>, या संयुक्त प्रारूप <ark-api-key>|<app-key>|<access-key>|<resource-id>.`,
  nativeTtsDoesNotSynthesizeAudioFiles:
    "नेटिव TTS ऑडियो फ़ाइलों को संश्लेषित नहीं करता है।",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `${languageLabel} के लिए कोई स्थानीय या क्लाउड वॉयस रूट तैयार नहीं है।`,
  chooseTextToSpeechProviderInSettings:
    "सेटिंग्स में टेक्स्ट-टू-स्पीच प्रदाता चुनें।",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS अभी समर्थित नहीं है.`,
  ttsError: ({ provider, status, errorText }) =>
    `${provider} TTS त्रुटि (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `${provider} भाषण आउटपुट ने उत्तर को अस्वीकार कर दिया क्योंकि यह बहुत लंबा था।`,
  ttsTimeout: ({ provider }) => `${provider} भाषण आउटपुट में बहुत अधिक समय लगा।`,
  sttTimeout: ({ provider }) =>
    `${provider} भाषण प्रतिलेखन में बहुत अधिक समय लगा।`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} केवल ${limit} तक की रिकॉर्डिंग स्वीकार करता है। एक छोटी क्लिप का उपयोग करें या STT मॉडल स्विच करें।`,
  voiceInputCaptureIncomplete:
    "वॉइस इनपुट साफ़-साफ़ कैप्चर नहीं किया जा सका. कृपया पुन: प्रयास करें।",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS ने ऑडियो वापस नहीं किया।`,
  nativeSttHandledInApp: "सिस्टम STT को सीधे ऐप में नियंत्रित किया जाता है।",
  chooseSpeechToTextProviderInSettings:
    "सेटिंग्स में वाक्-से-पाठ प्रदाता चुनें।",
  sttNotSupportedYet: ({ provider }) => `${provider} STT अभी समर्थित नहीं है.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} अभी तक वायर्ड नहीं हुआ है।`,
  you: "आप",
  assistant: "सहायक",
  untitledConversation: "शीर्षकहीन बातचीत",
  conversationExportHeader: ({ title }) => `बातचीत: ${title}`,
  speechRecognitionPermissionNotGranted:
    "वाक् पहचान अनुमति नहीं दी गई.",
  speechRecognitionUnavailableForDeviceLanguage:
    "वर्तमान डिवाइस भाषा के लिए वाक् पहचान उपलब्ध नहीं है।",
  nativeSpeechRecognitionNeedsNetwork:
    "मूल वाक् पहचान को अभी नेटवर्क एक्सेस की आवश्यकता है।",
  noSpeechDetected: "कोई भाषण नहीं मिला.",
  nativeSpeechRecognitionFailed: "मूल वाक् पहचान विफल रही.",
  couldntStartNativeSpeechRecognition:
    "मूल वाक् पहचान प्रारंभ नहीं की जा सकी.",
  microphonePermissionNotGranted: "माइक्रोफ़ोन की अनुमति नहीं दी गई",
} satisfies TranslationDictionary;
