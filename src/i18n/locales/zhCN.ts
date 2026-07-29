import type { TranslationDictionary } from "../types";

export const zhCN = {
  appName: "西兰花先生",
  retry: "重试",
  dismiss: "关闭",
  done: "完成",
  aboutSetting: ({ setting }) => `关于${setting}`,
  unavailable: "不可用",
  selection: "选择",
  chooseCompatibleProviderFirst: "首先选择兼容的提供商",
  settings: "设置",
  all: "全部",
  firstRun: "首次运行",
  instructions: "说明",
  providers: "提供商",
  webSearch: "网页搜索",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "运行时准备情况",
  settingsReadinessThink: "思考",
  settingsReadinessListen: "听",
  settingsReadinessSpeak: "说话",
  settingsReadinessSearch: "搜索",
  settingsReadinessReady: "准备好",
  settingsReadinessNeedsAttention: "注意力",
  settingsReadinessBroken: "破碎的",
  settingsReadinessOff: "离开",
  settingsConnections: "连接",
  settingsThinking: "思维",
  settingsListening: "听力",
  settingsSpeaking: "请讲",
  settingsSearch: "搜索",
  settingsAppDiagnostics: "应用程序和诊断",
  settingsGuidedSetup: "引导式设置",
  settingsGuidedSetupSummary:
    "检查连接并测试完整的语音路由。",
  setupGuideShowInSettings: "在“设置”中显示引导设置",
  setupGuideShowInSettingsSummary:
    "在设置概览中显示或隐藏引导设置快捷方式。",
  settingsConnectionsSummary: "提供者密钥、验证和功能。",
  settingsThinkingSummary: "主卡、模型、功夫、系统提示。",
  settingsListeningSummary: "输入模式和语音到文本路由。",
  settingsSpeakingSummary: "语音回复、播放、语音和预览。",
  settingsSearchSummary: "网络搜索提供商和搜索质量控制。",
  settingsAppDiagnosticsSummary:
    "主题、语言、用法、调试日志和最近的活动。",
  settingsBackToOverview: "返回概览",
  settingsOpenSection: ({ section }) => `打开${section}`,
  theme: "主题",
  language: "语言",
  recognitionLanguage: "识别语言",
  recognitionLanguageHint:
    "选择语言以提高识别准确度，或让设备或提供商自动检测。",
  automaticLanguage: "自动",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} 未正式支持此语音路由使用${language}。`,
  usageStats: "使用统计",
  model: "模型",
  effort: "努力",
  effortValue: ({ effort }) => `努力：${effort}`,
  modelEffortNone: "无",
  modelEffortMinimal: "最低",
  modelEffortLow: "低",
  modelEffortMedium: "中",
  modelEffortHigh: "高",
  modelEffortExtraHigh: "很高",
  modelEffortMax: "最高",
  modelEffortDynamic: "动态",
  modelEffortDisabled: "已关闭",
  modelEffortEnabled: "已开启",
  fixed: "固定的",
  english: "英语",
  german: "德语",
  ukrainian: "乌克兰",
  hindi: "印地语",
  spanish: "西班牙语",
  french: "法语",
  italian: "意大利语",
  portuguese: "葡萄牙语",
  portugueseBrazil: "葡萄牙语（巴西）",
  russian: "俄语",
  simplifiedChinese: "简体中文",
  arabic: "阿拉伯语",
  japanese: "日语",
  hungarian: "匈牙利语",
  czech: "捷克语",
  polish: "波兰语",
  turkish: "土耳其语",
  kokoroAmericanFemaleVoice: ({ name }) => `${name} · 美式英语，女声`,
  kokoroBritishFemaleVoice: ({ name }) => `${name} · 英式英语，女声`,
  kokoroChineseFemaleVoice: ({ index }) => `中文女声 ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `中文男声 ${index}`,
  light: "浅色",
  dark: "深色",
  system: "系统",
  languageCoverage: ({ note }) => `语言覆盖范围：${note}`,
  recordingLimits: ({ note }) => `记录限制：${note}`,
  catalogProviderPricingSummary: ({ summary }) => `价格：${summary}`,
  replyGenerationAction: "回复生成",
  speechTranscriptionAction: "语音转录",
  instructionsTabDescription:
    "在任何提供者看到请求之前，制定隐藏的指导来指导助理。",
  providersTabDescription:
    "在设备上存储外部服务凭据并配置您要使用的响应模式。",
  webSearchTabDescription:
    "在回复之前配置可选的实时 Web 上下文。",
  responseModes: "选型",
  aboutModelSelection: "关于选型",
  modelSelectionInfo:
    "每个模型卡都成为主屏幕上的一个选择。配置其提供商、模型和可选的工作级别，然后切换卡以选择下一个答案的模型。",
  responseModeItemTitle: ({ index }) => `型号 ${index}`,
  addResponseMode: "添加型号",
  removeResponseMode: "删除模型",
  responseModesNoConfiguredProviders:
    "首先添加凭据。在至少配置一项兼容服务之前，路由控制将保持隐藏状态。",
  useResponseMode: ({ mode }) => `使用${mode}`,
  chooseResponseModel: "选择型号",
  responseModelCount: ({ count }) => `${count} 型号可供选择`,
  sttTabDescription:
    "控制如何捕获语音以及哪个后端在音频到达模型之前将其转换为文本。",
  ttsTabDescription:
    "控制回复何时开始说话以及哪个后端处理语音输出。",
  brief: "简短的",
  briefDescription:
    "保持答案紧凑。使用完整回答用户所需的最少句子数。",
  normal: "普通的",
  normalDescription:
    "争取平衡的响应长度。涵盖要点而不拖拉答案。",
  thorough: "彻底",
  thoroughDescription:
    "深入、全面。包括细微差别、细节、权衡和重要的推理。",
  professional: "专业的",
  professionalDescription:
    "像高级顾问一样向客户介绍情况。语言准确，没有俚语，有分寸且具有权威性。",
  casual: "随意的",
  casualDescription:
    "在咖啡店里像聪明的朋友一样说话。轻松、自然、健谈。收缩很好，切线也很好。",
  nerdy: "书呆子",
  nerdyDescription:
    "像一位热爱深入研究的热情专家一样说话。自由使用技术术语，研究细节，假设用户可以跟上。",
  concise: "简洁的",
  conciseDescription:
    "在保持完整的同时尽可能简短。没有序言，没有填充物，只有答案。想想电报风格。",
  socratic: "苏格拉底式",
  socraticDescription:
    "挑战用户的思维。提出反问题，提供替代观点，而不仅仅是证实他们所说的话。做一个陪练伙伴，而不是一个唯唯诺诺的机器。",
  eli5: "ELI5",
  eli5Description:
    "尽可能简单地解释一切。使用类比、日常语言、零行话。假设对任何主题都没有先验知识。",
  useProvider: ({ provider }) => `使用${provider}`,
  createApiKey: "证书",
  apiKey: "API 密钥",
  aboutThisProvider: "关于该提供商",
  openRouterOnboardingTitle: "一键多个提供商",
  openRouterOnboardingDescription:
    "创建专用的 OpenRouter 密钥，将其粘贴到下面，并使用来自多个提供商的快照支持模型，而无需替换任何直接连接。",
  openRouterOnboardingRoute:
    "请求路径：本设备→OpenRouter→选择的上游提供商",
  openRouterKeys: "OpenRouter 键",
  providerStatusInvalid: "无效的",
  providerStatusTesting: "测试",
  providerStatusConfigured: "已配置",
  providerStatusWorking: "在职的",
  providerStatusNotTested: "未测试",
  providerStatusNotSetup: "未设置",
  expandProvider: ({ provider }) => `展开 ${provider}`,
  collapseProvider: ({ provider }) => `折叠 ${provider}`,
  testProviderKey: "测试键",
  testAllCapabilities: "测试全部",
  apiTest: "API测试",
  testProviderCapability: ({ capability }) => `测试${capability}`,
  test: "测试",
  optional: "选修的",
  providerCapability_llm: "回复",
  providerCapability_stt: "语音输入",
  providerCapability_tts: "语音输出",
  providerCapability_search: "网页搜索",
  providerCapability_voices: "语音库",
  providerValidationUnavailable:
    "该提供商尚未连接实时验证。将密钥保存在此处，并在实际使用时进行验证。",
  providerNeedsAttention: "需要注意",
  catalogProviderLimitsSummary: ({ summary }) => `限制：${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `区域：${summary}`,
  validatingKey: "正在验证...",
  showKey: "显示密钥",
  hideKey: "隐藏键",
  assistantInstructions: "辅助说明",
  systemPrompt: "系统提示",
  aboutSystemPrompt: "关于系统提示",
  assistantInstructionsIntro:
    "塑造模型在每次回复之前收到的隐藏指导。",
  baseInstructions: "基本说明",
  assistantInstructionsPlaceholder: "定义助理应该如何表现。",
  assistantInstructionsHint:
    "这始终位于所选响应长度和语气之前。",
  adaptiveLength: "自适应长度",
  responseTone: "响应音",
  homeStyleChipLabel: ({ tone, length }) => `风格 — ${tone} · ${length}`,
  styleSheetTitle: "对话设置",
  styleSheetSubtitle: "仅针对此对话形成回复和演讲。",
  openStyleSheet: "打开对话设置",
  conversationThinkingInstructions: "思维指令",
  conversationThinkingInstructionsDescription:
    "在全局系统提示此对话后添加说明。",
  conversationThinkingInstructionsPlaceholder:
    "例如：挑战我的假设并使用具体的例子。",
  ttsInstructions: "演讲交付说明",
  ttsInstructionsDescription:
    "指导兼容语音模型使用的语气、语速、口音或表达方式。",
  conversationTtsInstructionsDescription:
    "在该对话的全局语音指令之后添加传递指令。",
  ttsInstructionsPlaceholder:
    "例如： 说话热情、清晰、语速轻松。",
  ttsInstructionsUnsupported:
    "目前语音路由不支持下发指令。",
  conversationVoiceDescription: ({ route }) =>
    `选择 ${route} 在此对话中使用的语音。`,
  scrollToLatest: "滚动到最新消息",
  conversationTitleGenerate: "自动生成标题",
  conversationTitleGenerating: "正在生成标题...",
  conversationTitleGenerated: "对话已重命名。",
  conversationTitleNeedsContent:
    "在生成标题之前开始对话。",
  conversationTitleNeedsProvider:
    "在生成标题之前配置所选模型。",
  conversationTitleGenerationFailed: "无法生成对话标题。",
  conversationTitleGenerationTimedOut:
    "标题生成花费了太长时间。请再试一次。",
  inputMode: "输入方式",
  voiceInput: "语音输入",
  pushToTalk: "一键通",
  pushToTalkDescription:
    "说话时按住主按钮，然后松开即可发送。",
  toggleToTalk: "切换通话",
  toggleToTalkDescription:
    "点击一次开始录制，完成后再次点击。",
  driveSession: "驾驶会议",
  driveSessionDescription:
    "当自动继续打开时，录音会在每次口头回复后开始。说完后点击主按钮。",
  stopDriveSession: "暂停自动",
  repeatDriveReply: "重复最后一次",
  continueDriveSession: "自动恢复",
  speechToText: "语音转文字",
  appNative: "系统识别",
  nativeSttDescription:
    "使用操作系统的语音识别器。根据设备设置，识别可以在设备上运行或通过系统服务运行。不需要提供商密钥。",
  provider: "提供者",
  webSearchProvider: "网络搜索提供商",
  webSearchProviderMissingHint:
    "在凭据中配置至少一项支持搜索的服务，以在此处启用网络接地。",
  webSearchModelHint: ({ model }) =>
    `在幕后使用 ${model} 进行实时网络接地。`,
  webSearchHomeHint:
    "使用主屏幕切换按钮打开或关闭该线程的网络接地。",
  settingsWebSearchCompactHint:
    "可以选择在主模型回复之前添加新的 Web 上下文。",
  webSearchAdvanced: "高级搜索控件",
  expandAdvancedSearch: "扩展高级搜索控件",
  collapseAdvancedSearch: "折叠高级搜索控件",
  webSearchSetupNeeded: "添加凭据以使用实时网络搜索。",
  webSearchEnabledDescription:
    "在模型回复之前添加新的 Web 上下文。",
  webSearchDisabledDescription:
    "当当前事实很重要时，请使用此线程的实时网络上下文。",
  webSearchQualityControls: "搜索质量",
  webSearchSearchMode: "搜索模式",
  webSearchSearchModeQuick: "快的",
  webSearchSearchModeBalanced: "均衡",
  webSearchSearchModeDeep: "深的",
  webSearchDepth: "搜索深度",
  webSearchDepthStandard: "标准",
  webSearchDepthDeep: "深的",
  webSearchResultCount: "结果计数",
  webSearchQualityHint: ({ provider }) =>
    `这些控件调整 ${provider} 在回复之前收集新上下文的方式。`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} 尚未在此应用程序中公开额外的搜索质量控件。`,
  setWebSearchMode: ({ mode }) => `将网页搜索模式设置为 ${mode}`,
  openWebSearchSettings: "打开网络搜索设置",
  providerSttDescription:
    "在将语音发送到回复路由之前，使用配置的外部服务转录您的语音。",
  sttProvider: "STT 提供商",
  sttProviderEnabledHint:
    "此处仅显示具有转录支持的已启用提供商。",
  sttProviderMissingHint:
    "添加支持 STT 的服务的凭据以在此处选择它。",
  nativeSttHint:
    "系统识别的工作独立于您的提供商密钥，并且可以在设备上或通过操作系统的语音服务进行处理。",
  replyPlayback: "回复回放",
  sentencesArrive: "段落到达",
  sentencesArriveDescription:
    "完整的段落准备好后就开始说话。",
  fullReplyFirst: "先完整回复",
  fullReplyFirstDescription:
    "首先生成整个答案，然后一次性播放。",
  textToSpeech: "文字转语音",
  spokenReplies: "口头回复",
  spokenRepliesEnabledDescription:
    "当语音路线可用时，大声朗读助手的回复。",
  spokenRepliesDisabledDescription:
    "目前仅保留文本回复。您的首选 TTS 路线将保存下来供以后使用。",
  nativeTtsDescription:
    "使用设备语音引擎进行语音回复和语音预览。",
  kokoroTtsDescription:
    "完全在此设备上使用更加自然的神经语音。语音回复文本在本地合成，无需语音提供者密钥或使用费。",
  kokoroVoices: "Kokoro 设备上的语音",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `多语言模型下载约${size} MB，安装后占用约${installedSize} MB。`,
  kokoroModel: "Kokoro 多语言模型",
  kokoroChecking: "检查设备上的型号...",
  kokoroDownloading: ({ progress }) => `正在下载...${progress}%`,
  kokoroExtracting: ({ progress }) => `正在安装...${progress}%`,
  kokoroVerifying: "验证语音引擎...",
  kokoroInstalled: "已在此设备上安装并准备就绪。",
  kokoroNotInstalled: "可选下载。无需提供商密钥。",
  kokoroLanguageFallback:
    "Kokoro 目前在这里说英语和简体中文。对于其他选定的回复语言，请添加明确的后备路由，否则语音将因错误而停止。",
  kokoroRemoveTitle: "删除Kokoro模型？",
  kokoroRemoveBody: ({ installedSize }) =>
    `这会释放大约 ${installedSize} MB。您可以随时再次下载模型。`,
  removeKokoroModel: "删除Kokoro模型",
  downloadKokoroModel: "下载Kokoro模型",
  kokoroFallbackNeeded: ({ languages }) =>
    `需要显式回退路由：${languages}。`,
  kokoroNoSelectedLanguages:
    "在“收听语言”下选择“英语”或“简体中文”以配置 Kokoro 语音。",
  expandVoiceSettings: ({ language }) => `展开${language}语音设置`,
  collapseVoiceSettings: ({ language }) =>
    `折叠${language}语音设置`,
  remove: "消除",
  voiceOutputDescription:
    "选择语音引擎、聆听语言和语音预览以进行口头回复。",
  localTts: "当地的",
  localTtsDescription:
    "使用匹配的下载本地语音进行语音回复。",
  providerTtsDescription:
    "使用选定的配置服务进行语音回复。",
  ttsFallbackRoutes: "后备路线",
  ttsFallbackRoutesHint:
    "选修的。仅添加您想要的路线，按照应尝试的顺序。一旦路由开始说话，西兰花先生 就会保留在该路由上以完成其余的回复。",
  ttsFallbackNone:
    "未配置后备。相反，将显示语音故障。",
  ttsFallbackPosition: ({ position, route }) => `${position}。 ${route}`,
  addFallbackRoute: ({ route }) => `添加 ${route} 后备`,
  removeFallbackRoute: ({ route }) => `删除 ${route} 后备`,
  moveFallbackEarlier: ({ route }) => `提前移动 ${route}`,
  moveFallbackLater: ({ route }) => `稍后移动 ${route}`,
  ttsProvider: "TTS 提供商",
  ttsProviderEnabledHint:
    "此处仅显示具有语音回复支持的启用提供商。",
  ttsProviderMissingHint:
    "添加支持 TTS 的服务的凭据以在此处选择它。",
  localTtsOrderHint:
    "仅尝试显式配置的后备路由。",
  providerTtsOrderHint:
    "仅尝试显式配置的后备路由。",
  nativeTtsHint:
    "本机 TTS 使用系统语音堆栈，不需要提供商密钥。",
  localTtsLanguageCoverageHint:
    "本地包目前涵盖英语、德语、简体中文、西班牙语、葡萄牙语、印地语、法语和意大利语。",
  ttsVoice: "TTS 语音",
  refresh: "刷新",
  providerVoiceDirectory: ({ provider }) => `${provider} 语音库`,
  refreshProviderVoices: ({ provider }) => `刷新${provider}语音`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} ${Number(count) === 1 ? "嗓音" : "声音"} 可从 ${provider} 获得。`,
  providerVoicesLoadFailed:
    "声音无法刷新。您当前的选择不变；您仍然可以手动输入语音 ID。",
  providerVoicesLoadFailedWithFallback:
    "无法加载帐户声音。内置语音仍然可用。",
  providerVoicesErrorDetail: ({ detail }) => `原因：${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "在 ElevenLabs 中，编辑此 API 键并启用 Voices → Read，然后在此处刷新。",
  providerVoicesLoadingHint: ({ provider }) =>
    `西兰花先生 自动从 ${provider} 加载可用语音。`,
  providerVoiceId: "语音识别",
  providerVoiceIdPlaceholder: "输入语音 ID",
  providerVoiceIdFallbackHint:
    "当语音库无法加载时，手动输入仍然可用。",
  providerVoiceIdRequired: ({ provider }) =>
    `使用语音输出前，请刷新${provider}语音库或输入语音ID。`,
  qwenSpeechUnavailableInUs:
    "西兰花先生目前的Qwen语音路由在美国地区不可用。选择新加坡或北京进行Qwen演讲。",
  qwenApiRegion: "Qwen API 区域",
  qwenRegionSingapore: "新加坡",
  qwenRegionUs: "美国（弗吉尼亚州）",
  qwenRegionBeijing: "中国（北京）",
  qwenRegionHint:
    "所选区域必须与创建此 API 密钥的区域匹配。",
  qwenRegionUsSpeechHint:
    "美国区域按键支持此处的聊天和网络搜索。 西兰花先生目前的Qwen、STT和TTS航线需要新加坡或北京钥匙。",
  providerDefaultVoiceHint:
    "该提供商当前使用其默认语音进行预览和语音回复。",
  listenLanguages: "听语言",
  listenLanguagesHint:
    "选择您希望听起来不错的回复语言。 西兰花先生 在路由语音输出时按此顺序尝试它们。",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "已选择 1 种语言" : `${count} 选择的语言`,
  localVoicePacks: "本地语音包",
  localVoicePacksHint:
    "每种语言都有自己的本地语音。选择您想要的该语言的语音，然后仅下载您真正关心的包。",
  localVoiceForLanguage: ({ languageLabel }) => `${languageLabel} 的语音`,
  providerVoicePreviews: "提供商语音预览",
  providerVoicePreviewsHint:
    "此处测试当前选择的 TTS 路由，并为每种回复语言提供单独的预览文本。",
  nativeVoicePreviewSection: "原生语音预览",
  nativeVoicePreviewSectionHint:
    "它直接通过手机的内置语音合成器说话，因此您可以将其与配置的提供商声音进行比较。",
  nativeVoiceUnavailable:
    "此设备未报告任何本机系统语音以进行预览。",
  speechDiagnostics: "最近的演讲活动",
  speechDiagnosticsHint:
    "显示最新的语音请求、他们请求的路线、他们实际使用的路线以及任何后备原因。",
  clearSpeechDiagnostics: "清除最近的言语活动",
  speechDiagnosticsEmpty:
    "还没有最近的演讲请求。预览语音或播放回复以在此处查看路由详细信息。",
  clearSpeechDiagnosticsConfirmationTitle: "清除最近的演讲活动？",
  clearSpeechDiagnosticsConfirmationMessage:
    "这将删除所有捕获的语音路由诊断。此操作无法撤消。",
  speechDiagnosticSourceConversation: "对话回复",
  speechDiagnosticSourceRepeat: "重复回复",
  speechDiagnosticSourcePreview: "语音预览",
  speechDiagnosticSourceUnknown: "发言请求",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `请求：${requested} -> 实际：${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `最新阶段：${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `语言：${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `提供商：${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `语音：${voice}`,
  localTtsPackReady: "安装在此设备上。",
  localTtsPackBroken:
    "已下载，但该语音在此设备上未通过本地验证。重新下载或选择其他声音。",
  localTtsPackMissing:
    "尚未安装。云TTS或系统语音将一直使用，直到您下载为止。",
  localTtsUnsupportedLanguageFallback:
    "该语言尚无可用的本地包。云端TTS或系统语音处理。",
  downloadingLocalTtsPack: ({ progress }) =>
    `正在下载本地包...${progress}%`,
  download: "下载",
  downloadingShort: "加载中...",
  voicePreviewText: "语音预览文本",
  voicePreviewPlaceholder: "输入一个短语即可听到此声音。",
  voicePreviewHint:
    "使用当前选择的回复语音后端，而不向语言模型发送任何内容。",
  previewVoice: "预览语音",
  generatingPreview: "正在生成预览...",
  playingPreview: "正在播放预览...",
  systemVoice: "系统声音",
  spokenRepliesOff: "仅文本",
  noTtsProvider: "没有 TTS 提供商",
  nothingToCopyYet: "还没有什么可复制的。",
  couldntCopyText: "无法复制该文本。",
  nothingToShareYet: "还没有什么可分享的。",
  couldntShareText: "无法分享该文本。",
  couldntReplayReply: "无法重播该回复。",
  replyFailed: "回复失败",
  retryReply: "重试回复",
  replyFailedHint: "您可以在重试之前选择上面的其他型号。",
  spokenReplyFailed: "回复已保存，但无法说出。",
  retrySpeech: "重试演讲",
  openSpeakingSettings: "说话设置",
  messageCopied: "消息已复制。",
  noConversationToCopyYet: "尚无可复制的对话。",
  noConversationToShareYet: "尚无对话可分享。",
  noReplyToRepeatYet: "尚未回复重播。",
  threadCopied: "线程已复制。",
  threadRenamed: "线程已重命名。",
  threadPinned: "线程已固定。",
  threadUnpinned: "线程未固定。",
  addProviderKeyToUseProvider: ({ provider }) =>
    `使用此路由之前，请在“设置”中添加 ${provider} 的凭据。`,
  configureCredentialsBeforeVoiceSession:
    "在开始语音会话之前在“设置”中添加凭据。",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `对于 ${provider}，输入提供商基本 URL 和 API 密钥：https://your-endpoint.example.com|your-api-key。`,
  speechRecognitionUnavailableOnDevice:
    "此设备上无法进行语音识别。",
  debugLogLabel: "日志",
  debugLogCaptureStarted: "调试日志记录已开始。",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `调试日志保存为 ${fileName} 并复制到剪贴板（${entryCount} 条目）。`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `调试日志保存为 ${fileName}（${entryCount} 条目）。`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `恢复以前的调试日志 ${fileName} 并将其复制到剪贴板（${entryCount} 条目）。`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `恢复了以前的调试日志 ${fileName}（${entryCount} 条目）。`,
  debugLogCaptureFailed: "无法保存调试日志。",
  chooseSttBeforeVoiceSession:
    "在开始语音会话之前，在“设置”中选择已配置的 STT 路由。",
  chooseTtsBeforeSpokenReplies:
    "使用语音回复之前，请在“设置”中选择已配置的 TTS 路由。",
  stopSessionBeforeReplay:
    "在重播上次回复之前停止活动语音会话。",
  couldntCatchThatTryAgain: "无法捕捉到，请重试。",
  couldntStartVoiceInput: "无法启动语音输入。",
  couldntProcessVoiceInput: "无法处理语音输入。",
  maxRecordingLengthReached:
    "已达到最大录音长度 — 发送我所拥有的内容。",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `对于 ${provider} 语音转文本（最大 ${limit}）来说，该录音太长。尝试较短的消息，或将语音转文本切换为系统识别。`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `使用此路由之前，请在“设置”中添加 ${provider} 的凭据。`,
  stopSessionBeforePreview:
    "在预览语音之前停止活动语音会话。",
  chooseTtsToPreviewVoices:
    "在“设置”中选择一条已配置的TTS路由来预览语音。",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `先下载选择的${languageLabel}本地语音。`,
  couldntPreviewVoice: "无法预览语音。",
  spokenRepliesDisabled: "“设置”中的语音回复已关闭。",
  providerVoiceFallback:
    "配置语音路由失败。将此回复切换为后备语音。",
  localVoiceFallback:
    "无法使用本地语音。将此回复切换为后备语音。",
  localTtsPackInstalled: ({ languageLabel }) =>
    `${languageLabel} 本地语音包已安装。`,
  localTtsPackInstallFailed: "无法安装本地语音包。",
  clear: "清除",
  voiceOutput: "语音输出",
  currentSetup: "当前设置",
  listeningToYourVoice: "聆听你的声音",
  parsingYourVoiceInput: "将你的声音变成文字",
  preparingRequest: "准备您的请求",
  searchingTheWeb: "在网络上搜索新的上下文",
  waitingForProvider: ({ provider }) => `等待${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `使用 ${provider} 准备语音`,
  deepThinkingReassurance: "好的答案需要一点时间……",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "跟你回话",
  freshSession: "新鲜会议",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 条消息" : `${count} 消息`,
  speechInputRoute: ({ route }) => `演讲于：${route}`,
  replyModelRoute: ({ route }) => `回复型号：${route}`,
  voiceOutputRoute: ({ route }) => `语音输出：${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `后备语音输出：${route}`,
  conversation: "对话",
  conversationActions: "对话动作",
  statusDetails: "状态详情",
  persistenceFailure:
    "西兰花先生 无法在此设备上保存数据。保持应用程序打开并重试；重启后最近的更改可能会丢失。",
  show: "展示",
  showTranscript: "显示成绩单",
  hide: "隐藏",
  copyThread: "复制主题",
  shareThread: "分享主题",
  repeatReply: "重复回复",
  renameThread: "重命名线程",
  renameThreadHint:
    "为该对话指定一个您稍后可以快速找到的标题。",
  threadTitle: "话题标题",
  noTranscriptYet: "还没有成绩单",
  previewTranscriptEmptyDescription:
    "使用语音或文本开始。您的对话将出现在这里。",
  noConversationYet: "还没有对话",
  expandedTranscriptEmptyDescription:
    "使用语音或文本开始。当您想返回主舞台时，请关闭此屏幕。",
  transcriptSelectionHint:
    "直接选择任何消息文本，或共享并复制下面的单个消息。",
  textMessagePlaceholder: "输入消息",
  sendTextMessage: "发送消息",
  showVoiceInput: "显示语音输入",
  showTextInput: "显示文本输入",
  usageStatsHiddenDescription: "将令牌估计保留在记录 UI 之外。",
  usageStatsVisibleDescription:
    "显示回复和对话总数的估计令牌使用情况。",
  debugLogButton: "调试日志按钮",
  debugLogButtonHiddenDescription:
    "除非捕获已在运行，否则请将主屏幕“日志”按钮保持隐藏。",
  debugLogButtonVisibleDescription:
    "显示用于启动和停止调试捕获的主屏幕“日志”按钮。",
  debugLogButtonUsageDescription:
    "如何使用该按钮：将其打开将开始捕获日志。将其关闭将停止捕获日志并将捕获的日志移动到剪贴板中。",
  estimatedUsageTitle: "预计使用量",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} 回复 · ${summaries} 内存更新`,
  estimatedUsageConversationScope:
    "总计包括此对话中使用的每条路线和模型。",
  estimatedPromptTokens: ({ count }) => `提示符：${count}`,
  estimatedReplyTokens: ({ count }) => `回复: ${count}`,
  estimatedTotalTokens: ({ count }) => `总计：${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `预计。 ${prompt} 输入 · ${completion} 输出 · ${total} 总计`,
  searchQuery: "搜索查询",
  expandWebSearchDetails: "显示网络搜索详细信息",
  collapseWebSearchDetails: "隐藏网络搜索详细信息",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "来源" : "来源"}`,
  sources: "来源",
  openSourceLink: ({ source }) => `开源：${source}`,
  turnReceipt: "转动细节",
  expandTurnReceipt: "显示回合详情",
  collapseTurnReceipt: "隐藏回合详情",
  turnReceiptDirect: "直接的",
  turnReceiptRequested: "请求的回复路由",
  turnReceiptActual: "实际回复路径",
  turnReceiptEffort: "推理控制",
  turnReceiptProviderNative: "本地提供者",
  turnReceiptInput: "输入路线",
  turnReceiptSearch: "网页搜索",
  turnReceiptVoice: "语音输出",
  turnReceiptContext: "语境",
  turnReceiptTiming: "定时",
  turnReceiptFallback: "回退原因",
  turnReceiptVoiceInput: "嗓音",
  turnReceiptTypedInput: "打字的",
  turnReceiptSystemSpeech: "系统语音识别",
  turnReceiptSystemVoice: "系统声音",
  turnReceiptSystemVoiceFallback: "系统语音·回退",
  turnReceiptOff: "离开",
  turnReceiptNotConfigured: "亮 · 未配置",
  turnReceiptFallbackWithoutSearch: "继续，不进行实时搜索",
  turnReceiptNotUsed: "未使用",
  turnReceiptSummaryReused: "保存的摘要可重复使用",
  turnReceiptSummaryUpdated: "摘要已更新",
  turnReceiptContextFallback: "最近消息回退",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `网关将 ${original} 消息压缩为 ${compressed} 消息`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} 先前发送的消息 · ${summarized} 新汇总${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "语境",
  turnReceiptTimingSearch: "搜索",
  turnReceiptTimingModel: "模型",
  turnReceiptTimingFirstSpeech: "第一次演讲",
  turnReceiptTimingTotal: "全部的",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} 代币`,
  unknownUsageRoute: "未知路线",
  setupGuideConnectProviderTitle: "配置凭据",
  setupGuideConnectProviderDescription:
    "在“设置”中添加凭据，然后选择您要使用的路由。",
  idle: "闲置的",
  yourConversationAppearsHere: "您的对话出现在这里",
  defaultTranscriptEmptyDescription:
    "使用语音或文本开始。 西兰花先生 将保留该线程并在此回复。",
  delete: "删除",
  deleteConversationConfirmationTitle: ({ title }) => `删除“${title}”？`,
  deleteConversationConfirmationMessage:
    "这将永久删除对话及其所有消息。此操作无法撤消。",
  memory: "记忆",
  conversations: "对话",
  drawerSubtitle: "在活动线程之间跳转或开始一个新房间。",
  newSession: "新会议",
  noSavedConversationsYet: "尚未保存对话",
  drawerEmptyDescription:
    "从主视图开始说话，西兰花先生 将自动建立会话。",
  setupGuideTitle: "配置应用程序",
  setupGuideSubtitle: "添加凭据并在“设置”中选择路由。",
  fastestStartPreset: "最少的设置",
  fastestStartDescription:
    "在可用的情况下使用设备语音并仅配置您需要的回复路由。",
  fullVoicePreset: "配置语音",
  fullVoiceDescription:
    "当您选择回复、转录和语音输出时，可使用已配置的服务。",
  setupGuideNote:
    "接下来我们将打开“设置”，以便您可以粘贴和验证凭据。",
  useThisSetup: "使用此设置",
  notNow: "现在不要",
  setupGuideIntroTitle: "西兰花先生 的工作原理",
  setupGuideIntroBody:
    "西兰花先生 开始为空白。为您已使用的外部服务添加凭据，然后选择回复、语音输入、语音输出和可选 Web 上下文的路由方式。",
  setupGuideIntroNote:
    "设置后，使用主语音控制来开始和停止对话。当前的成绩单在主屏幕上保持可用，并且以后可以在“设置”中更改每条路线。",
  setupGuideProviderTitle: "添加凭证",
  setupGuideProviderBody:
    "选择您要配置的外部服务，然后粘贴具有回复访问权限的凭据。",
  setupGuideProviderPickerLabel: "回复服务",
  setupGuideSelectProvider: "选择提供商",
  setupGuideSelectProviderFirst: "首先选择提供商。",
  setupGuideApiKeyLabel: "API 密钥",
  setupGuideApiKeyPlaceholder: "粘贴凭证",
  setupGuideContinue: "继续",
  setupGuideOpenSettings: "打开设置",
  setupGuideBack: "后退",
  setupGuideValidateKey: "验证密钥",
  setupGuideApiKeyRequiredOrCancel:
    "添加 API 键以继续，或取消设置指南。",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "选择提供商并添加 API 密钥以继续，或取消设置指南。",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `这些 ${provider} 凭证不允许回复请求。`,
  setupGuideKokoroTitle: "添加自然的设备语音",
  setupGuideKokoroBody: ({ size }) =>
    `可选：下载 Kokoro（大约 ${size} MB）以获得更自然的语音回复，无需语音提供商或使用费用。`,
  setupGuideKokoroLanguageNote:
    "该模型目前支持英语和简体中文。稍后在语音设置中配置您想要的任何后备路由。",
  setupGuideKokoroDownload: "下载Kokoro",
  setupGuideUseKokoro: "使用 Kokoro 进行语音回复",
  setupGuideUseKokoroSummary:
    "只要支持回复语言，就在手机上保持合成。",
  setupGuideSkipKokoro: "暂时跳过",
  setupGuideVoiceTestTitle: "测试您的设置",
  setupGuideVoiceTestBody:
    "说一个简短的句子。当可接受的语音路由可用时，西兰花先生 将测试麦克风访问、转录、配置的回复路由和语音输出。",
  setupGuideVoiceTestNoInputBody:
    "此设置无法使用语音输入。继续检查检测到的路线，然后根据需要调整语音设置。",
  setupGuideVoiceTestTextOnlyNote:
    "此测试仅保留文本，因为尚未准备好可接受的语音路由。",
  setupGuideVoiceTestStart: "开始测试",
  setupGuideVoiceTestStop: "停止录音",
  setupGuideVoiceTestRetry: "再次运行",
  setupGuideVoiceTestTranscribing: "正在抄写…",
  setupGuideVoiceTestThinking: "测试回复...",
  setupGuideVoiceTestSynthesizing: "正在准备语音...",
  setupGuideVoiceTestSpeaking: "正在播放回复...",
  setupGuideVoiceTestTranscript: "成绩单",
  setupGuideVoiceTestReply: "回复",
  setupGuideVoiceTestReset: "清除此结果",
  setupGuideVoiceInputUnavailable:
    "此设备上的此设置无法使用语音输入。",
  setupGuideSummaryTitle: "设置完成",
  setupGuideSummaryBody:
    "这是 西兰花先生 将与您当前配置一起使用的路线。",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "语音转文字",
  setupGuideSummaryTts: "文字转语音",
  setupGuideSummaryWebSearch: "网页搜索",
  setupGuideRouteProviderLlm: ({ provider }) => `通过 ${provider} 启用`,
  setupGuideRouteOnDeviceStt: "通过系统语音识别启用",
  setupGuideRouteProviderStt: ({ provider }) =>
    `通过 ${provider} 语音转录启用`,
  setupGuideRouteProviderTts: ({ provider }) => `通过 ${provider} 语音启用`,
  setupGuideRouteKokoroTts: "通过 Kokoro 设备上语音启用",
  setupGuideRouteLocalTts: "通过本地语音包启用",
  setupGuideRouteUnavailable: "无法使用",
  setupGuideRouteOff: "离开",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `通过 ${provider} 提供，目前关闭`,
  setupGuideSummaryTextOnlyNote:
    "语音回复暂时关闭。在您启用提供商或本地语音之前，回复将以文本形式保留。",
  setupGuideFinish: "完毕",
  searchConversationsPlaceholder: "搜索标题、型号和消息文本",
  noMatchingConversations: "没有匹配的对话",
  noMatchingConversationsDescription:
    "尝试使用文字记录中不同的标题、路线、模型或短语。",
  memoryModalTitle: "对话记忆",
  memoryModalDescription:
    "一旦线程变得足够长以压缩较旧的回合，这是 西兰花先生 的紧凑摘要。",
  memorySummary: "已保存摘要",
  memorySummaryEmpty:
    "还没有紧凑型内存。一旦这条线变得更长，旧的回合将在这里总结。",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 总结回合" : `${count} 汇总转弯`,
  copyMemory: "复制内存",
  forgetMemory: "忘记记忆",
  memoryCopied: "内存已复制。",
  memoryCleared: "对话记忆已清除。",
  noConversationToManageYet: "尚无可用的对话记忆。",
  noProviderYet: "还没有提供商",
  noModelYet: "还没有型号",
  startedAt: "开始",
  endedAt: "结束",
  pinned: "已固定",
  copy: "复制",
  share: "分享",
  rename: "重命名",
  pin: "别针",
  unpin: "取消固定",
  save: "节省",
  cancel: "取消",
  stop: "停止",
  pause: "暂停",
  resume: "恢复",
  paused: "已暂停",
  listening: "听力",
  parsing: "抄写",
  searching: "搜寻中",
  converting: "转换",
  webSearchAction: "网络搜索",
  thinking: "思维",
  speaking: "请讲",
  pleaseWait: "请稍等",
  yourTurn: "轮到你了",
  keepPressing: "继续按",
  tapWhenDone: "完成后点击",
  speechPaused: "演讲暂停",
  pausePlaybackUnavailable:
    "此语音路线无法暂停。停止它或切换到提供商语音输出。",
  holdToSpeak: "按住说话",
  tapToSpeak: "点击即可说话",
  tapAgainToSend: "再次点击即可发送",
  waitingForReply: "等待回复",
  parsingYourVoice: "解析你的声音",
  providerConfiguredInSettings: ({ provider }) =>
    `设置中未配置 ${provider}。`,
  providerNetworkError: ({ provider, action }) =>
    `无法到达 ${action} 的 ${provider}。检查连接并重试。`,
  providerAuthError: ({ provider, action }) =>
    `${provider} 拒绝了 ${action} 的凭据。检查 API 密钥和权限。`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} 现在是速率限制 ${action}。稍后再试一次。`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} 需要足够的 API 信用来用于 ${action}。检查账户余额和密钥的支出限额。`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} 在 ${action} 期间花费的时间太长。再试一次。`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} 在 ${action} 期间出现临时问题。稍后再试。`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} 没有回复就结束了。再试一次。`,
  providerIncompleteReplyError: ({ provider }) =>
    `${provider}的回复还没说完就结束了。再试一次。`,
  providerContextTooLong: ({ provider }) =>
    `${provider} 拒绝回复，因为对话时间太长。启动新线程或缩短请求。`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} 拒绝了 ${action} 请求：${detail}`
      : `${provider} 拒绝了 ${action} 请求。`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} 在没有运行网络搜索的情况下返回了响应。`,
  providerValidationSuccess: ({ provider }) => `${provider} 即可使用。`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} 正在工作。`,
  providerValidationFailed: "提供商验证失败。",
  webSearchFallback:
    "网络搜索不可用，因此在没有实时网络上下文的情况下继续回复。",
  noBase64EncoderAvailable: "没有可用的 Base64 编码器。",
  noBase64DecoderAvailable: "没有可用的 Base64 解码器。",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS 需要 <key>|<region> 格式的 Azure 语音凭据，例如 abc123|westeurope，或组合的 Azure 格式 <endpoint>|<api-key>|<key>|<region>。",
  googleCloudSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT 需要 Google Cloud Speech 凭证，格式为 <project-id>|<access-token>|<location>，或组合的 Gemini 格式 <Gemini API key>|<project-id>|<access-token>|<location>。`,
  bytedanceSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT 需要 Doubao 格式为 <app-key>|<access-key> 的语音凭证，可选 <app-key>|<access-key>|<resource-id> 或组合格式<ark-api-key>|<app-key>|<access-key>|<resource-id>。`,
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Native TTS 不合成音频文件。",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `${languageLabel}本地或云语音路由均未准备好。`,
  chooseTextToSpeechProviderInSettings:
    "在“设置”中选择文本转语音提供商。",
  ttsNotSupportedYet: ({ provider }) => `尚不支持 ${provider} TTS。`,
  ttsError: ({ provider, status, errorText }) =>
    `${provider} TTS 错误（${status}）：${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `${provider} 语音输出拒绝回复，因为回复太长。`,
  ttsTimeout: ({ provider }) => `${provider} 语音输出时间过长。`,
  sttTimeout: ({ provider }) =>
    `${provider} 语音转录时间过长。`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} 仅接受最大 ${limit} 的录音。使用较短的夹子或切换STT型号。`,
  voiceInputCaptureIncomplete:
    "无法清晰地捕获语音输入。请再试一次。",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS 未返回音频。`,
  nativeSttHandledInApp: "系统 STT 直接在应用程序中处理。",
  chooseSpeechToTextProviderInSettings:
    "在“设置”中选择语音转文本提供商。",
  sttNotSupportedYet: ({ provider }) => `尚不支持 ${provider} STT。`,
  providerNotWiredUpYet: ({ provider }) => `${provider} 尚未接线。`,
  you: "你",
  assistant: "助手",
  untitledConversation: "无标题对话",
  conversationExportHeader: ({ title }) => `对话：${title}`,
  speechRecognitionPermissionNotGranted:
    "未授予语音识别权限。",
  speechRecognitionUnavailableForDeviceLanguage:
    "当前设备语言无法使用语音识别。",
  nativeSpeechRecognitionNeedsNetwork:
    "本机语音识别现在需要网络访问。",
  noSpeechDetected: "未检测到任何语音。",
  nativeSpeechRecognitionFailed: "本机语音识别失败。",
  couldntStartNativeSpeechRecognition:
    "无法启动本机语音识别。",
  microphonePermissionNotGranted: "未授予麦克风权限",
} satisfies TranslationDictionary;
