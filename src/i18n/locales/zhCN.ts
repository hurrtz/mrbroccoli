import type { TranslationDictionary } from "../types";
import { dataBackupTranslations } from "../dataBackupTranslations";
import { conversationKnowledgeTranslations } from "../conversationKnowledgeTranslations";
import { conversationArtifactTranslations } from "../conversationArtifactTranslations";
import { interruptionTranslations } from "../interruptionTranslations";
import { ulraAuditTranslations } from "../ulraAuditTranslations";
import { imagePromptTranslations } from "../imagePromptTranslations";
import { onDeviceTranslations } from "../onDeviceTranslations";
import { onboardingTranslations } from "../onboardingTranslations";
import { introTranslations } from "../introTranslations";
import { premiumTranslations } from "../premiumTranslations";
import { transcriptEditTranslations } from "../transcriptEditTranslations";
import { autoSetupTranslations } from "../autoSetupTranslations";
import { workspaceTranslations } from "../workspaceTranslations";

export const zhCN = {
  ...conversationArtifactTranslations["zh-CN"],
  ...interruptionTranslations["zh-CN"],
  ...ulraAuditTranslations["zh-CN"],
  ...dataBackupTranslations.zhCN,
  ...conversationKnowledgeTranslations.zhCN,
  ...imagePromptTranslations.zhCN,
  ...onDeviceTranslations["zh-CN"],
  ...onboardingTranslations["zh-CN"],
  ...introTranslations["zh-CN"],
  ...premiumTranslations["zh-CN"],
  ...transcriptEditTranslations["zh-CN"],
  ...workspaceTranslations["zh-CN"],
  ...autoSetupTranslations["zh-CN"],
  appName: "西兰花先生",
  retry: "重试",
  dismiss: "关闭",
  done: "完成",
  aboutSetting: ({ setting }) => `关于${setting}`,
  unavailable: "不可用",
  selection: "选择",
  chooseCompatibleProviderFirst: "首先选择兼容的提供商",
  settings: "设置",
  settingsReleaseVersion: ({ version }) => `版本 ${version}`,
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
  settingsReadinessNeedsAttention: "需注意",
  settingsReadinessBroken: "故障",
  settingsReadinessOff: "已关闭",
  settingsConnections: "连接",
  settingsThinking: "思考",
  settingsListening: "聆听",
  settingsSpeaking: "说话",
  settingsSearch: "搜索",
  settingsAppDiagnostics: "应用程序和诊断",
  settingsGuidedSetup: "引导式设置",
  settingsGuidedSetupSummary:
    "检查连接并测试完整的语音路由。",
  setupGuideShowInSettings: "在“设置”中显示引导设置",
  setupGuideShowInSettingsSummary:
    "在设置概览中显示或隐藏引导设置快捷方式。",
  settingsConnectionsSummary: "提供商密钥、验证和功能。",
  settingsThinkingSummary: "主屏幕卡片、模型、努力程度和系统提示。",
  settingsListeningSummary: "输入模式和语音到文本路由。",
  settingsSpeakingSummary: "语音回复、播放、语音和预览。",
  settingsSearchSummary: "网页搜索提供商和搜索质量控制。",
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
  effort: "努力程度",
  effortValue: ({ effort }) => `努力程度：${effort}`,
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
  ukrainian: "乌克兰语",
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
  swedish: "瑞典语",
  urdu: "乌尔都语",
  kokoroAmericanFemaleVoice: ({ name }) => `${name} · 美式英语，女声`,
  kokoroBritishFemaleVoice: ({ name }) => `${name} · 英式英语，女声`,
  kokoroChineseFemaleVoice: ({ index }) => `中文女声 ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `中文男声 ${index}`,
  light: "浅色",
  dark: "深色",
  system: "系统",
  languageCoverage: ({ note }) => `语言覆盖范围：${note}`,
  recordingLimits: ({ note }) => `录音限制：${note}`,
  catalogProviderPricingSummary: ({ summary }) => `价格：${summary}`,
  replyGenerationAction: "回复生成",
  speechTranscriptionAction: "语音转录",
  speechSynthesisAction: "语音合成",
  instructionsTabDescription:
    "在任何提供商看到请求之前，塑造引导助手的隐藏指令。",
  providersTabDescription:
    "在设备上存储外部服务凭据并配置您要使用的响应模式。",
  webSearchTabDescription:
    "在回复之前配置可选的实时 Web 上下文。",
  responseModes: "模型选择",
  aboutModelSelection: "关于模型选择",
  modelSelectionInfo:
    "每张模型卡片都会成为主屏幕上的一个选项。配置其提供商、模型和可选的努力程度，然后切换卡片来选择下一次由哪个模型回答。",
  responseModeItemTitle: ({ index }) => `模型 ${index}`,
  addResponseMode: "添加模型",
  removeResponseMode: "删除模型",
  responseModesNoConfiguredProviders:
    "首先添加凭据。在至少配置一项兼容服务之前，路由控制将保持隐藏状态。",
  useResponseMode: ({ mode }) => `使用${mode}`,
  chooseResponseModel: "选择模型",
  responseModelCount: ({ count }) => `有 ${count} 个模型可选`,
  ulraMode: "终极模式",
  ulraModeHomeLabel: "在主屏幕显示终极模式",
  ulraModeSettingsDescription:
    "当主屏幕上至少有两个模型可用时，允许多个模型共同推演。",
  ulraModeInfo:
    "终极模式会先分别询问主屏幕上每个可用模型。每轮复核时，模型会批判性检验每位参与者的最新观点；明确全体达成一致后会跳过剩余轮次。当前选中的模型会综合成功轮次生成最终回答，并始终保留每个模型的最新观点。推演内容会与所有相关服务提供商共享。",
  ulraModeRounds: "复核轮数",
  ulraModeCallEstimate: ({ count }) =>
    `按当前设置，每条消息最多调用模型 ${count} 次。`,
  ulraModeThresholdWarning:
    "超过 4 个模型或 3 轮复核可能耗时很长、消耗大量令牌，并触及服务提供商的上下文或速率限制。这只是提醒，不会阻止使用。",
  ulraModeFirstUseTitle: "启用终极模式？",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `使用 ${models} 个模型和最多 ${rounds} 轮复核时，一条消息最多可能调用模型 ${calls} 次。所需时间和费用可能大幅增加，推演内容也会与所有相关服务提供商共享。`,
  ulraModeHighRiskTitle: "大型终极模式运行",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} 个模型和 ${rounds} 轮复核最多可能调用模型 ${calls} 次。运行可能耗时很长、使用大量令牌并触及提供商限制。仍要继续吗？`,
  ulraModeEnableAction: "启用",
  ulraModeNeedsTwoModels:
    "终极模式至少需要两个已就绪的主屏幕模型。",
  ulraModeAllModelsFailed:
    "在能够合成回答之前，终极模式的所有模型都失败了。",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} 次内部模型调用失败；最终回答采用了 ${succeeded} 条成功贡献。`,
  sttTabDescription:
    "控制如何捕获语音以及哪个后端在音频到达模型之前将其转换为文本。",
  ttsTabDescription:
    "控制回复何时开始说话以及哪个后端处理语音输出。",
  brief: "简短",
  briefDescription:
    "保持答案紧凑。使用完整回答用户所需的最少句子数。",
  normal: "普通",
  normalDescription:
    "争取平衡的响应长度。涵盖要点而不拖拉答案。",
  thorough: "详尽",
  thoroughDescription:
    "深入、全面。包括细微差别、细节、权衡和重要的推理。",
  professional: "专业",
  professionalDescription:
    "像高级顾问一样向客户介绍情况。语言准确，没有俚语，有分寸且具有权威性。",
  casual: "随意",
  casualDescription:
    "像在咖啡店里和聪明的朋友聊天一样。轻松、自然、口语化。语气随意没关系，偶尔跑题也没关系。",
  nerdy: "极客",
  nerdyDescription:
    "像一位热爱深入研究的热情专家一样说话。自由使用技术术语，研究细节，假设用户可以跟上。",
  concise: "简洁",
  conciseDescription:
    "在保持完整的同时尽可能简短。没有序言，没有填充物，只有答案。想想电报风格。",
  socratic: "苏格拉底式",
  socraticDescription:
    "挑战用户的思维。提出反问题，提供替代观点，而不仅仅是证实他们所说的话。做一个陪练伙伴，而不是一个唯唯诺诺的机器。",
  eli5: "ELI5",
  eli5Description:
    "尽可能简单地解释一切。使用类比、日常语言、零行话。假设对任何主题都没有先验知识。",
  useProvider: ({ provider }) => `使用${provider}`,
  createApiKey: "凭据",
  apiKey: "API 密钥",
  aboutThisProvider: "关于该提供商",
  openRouterOnboardingTitle: "一个密钥，多个提供商",
  openRouterOnboardingDescription:
    "创建专用的 OpenRouter 密钥，将其粘贴到下面，并使用来自多个提供商的快照支持模型，而无需替换任何直接连接。",
  openRouterOnboardingRoute:
    "请求路径：本设备→OpenRouter→选择的上游提供商",
  openRouterKeys: "OpenRouter 密钥",
  providerStatusInvalid: "无效",
  providerStatusTesting: "测试",
  providerStatusConfigured: "已配置",
  providerStatusWorking: "正常",
  providerStatusNotTested: "未测试",
  providerStatusNotSetup: "未设置",
  expandProvider: ({ provider }) => `展开 ${provider}`,
  collapseProvider: ({ provider }) => `折叠 ${provider}`,
  testProviderKey: "测试密钥",
  testAllCapabilities: "测试全部",
  apiTest: "API测试",
  testProviderCapability: ({ capability }) => `测试${capability}`,
  test: "测试",
  optional: "可选",
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
  hideKey: "隐藏密钥",
  assistantInstructions: "助手指令",
  systemPrompt: "系统提示",
  aboutSystemPrompt: "关于系统提示",
  assistantInstructionsIntro:
    "塑造模型在每次回复之前收到的隐藏指导。",
  baseInstructions: "基础指令",
  assistantInstructionsPlaceholder: "定义助手应有的行为。",
  assistantInstructionsHint:
    "这始终位于所选响应长度和语气之前。",
  adaptiveLength: "自适应长度",
  responseTone: "回复语气",
  homeStyleChipLabel: ({ tone, length }) => `风格 — ${tone} · ${length}`,
  styleSheetTitle: "对话设置",
  styleSheetSubtitle: "仅为此对话调整回复与语音。",
  openStyleSheet: "打开对话设置",
  conversationThinkingInstructions: "思维指令",
  conversationThinkingInstructionsDescription:
    "在全局系统提示之后，为此对话添加额外指令。",
  conversationThinkingInstructionsPlaceholder:
    "例如：挑战我的假设并使用具体的例子。",
  ttsInstructions: "朗读风格指令",
  ttsInstructionsDescription:
    "指导兼容语音模型使用的语气、语速、口音或表达方式。",
  conversationTtsInstructionsDescription:
    "在全局朗读指令之后，为此对话添加额外的朗读指令。",
  ttsInstructionsPlaceholder:
    "例如： 说话热情、清晰、语速轻松。",
  ttsInstructionsUnsupported:
    "当前语音路由不支持朗读指令。",
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
  toggleToTalk: "点按切换说话",
  toggleToTalkDescription:
    "点击一次开始录制，完成后再次点击。",
  driveSession: "驾驶会话",
  driveSessionDescription:
    "开启自动继续后，每次语音回复结束时都会自动开始录音。说完后请点击主按钮。",
  stopDriveSession: "暂停自动",
  repeatDriveReply: "重复最后一次",
  continueDriveSession: "恢复自动",
  driveSendsIn: ({ seconds }) => `${seconds} 秒后发送…`,
  speechToText: "语音转文字",
  appNative: "系统识别",
  nativeSttDescription:
    "使用操作系统的语音识别器。",
  provider: "提供商",
  webSearchProvider: "网页搜索提供商",
  webSearchProviderMissingHint:
    "在凭据中配置至少一项支持搜索的服务，即可在此处启用联网检索。",
  webSearchModelHint: ({ model }) =>
    `后台使用 ${model} 获取实时网络信息。`,
  webSearchHomeHint:
    "使用主屏幕开关为此对话打开或关闭联网检索。",
  settingsWebSearchCompactHint:
    "可以选择在主模型回复之前添加新的 Web 上下文。",
  webSearchAdvanced: "高级搜索控件",
  expandAdvancedSearch: "扩展高级搜索控件",
  collapseAdvancedSearch: "折叠高级搜索控件",
  webSearchSetupNeeded: "添加凭据以使用实时网页搜索。",
  webSearchEnabledDescription:
    "在模型回复之前添加新的 Web 上下文。",
  webSearchDisabledDescription:
    "当信息时效性很重要时，可为此对话启用实时网络上下文。",
  webSearchNobodyDescription:
    "不发出网络请求。他凭模型已有的知识回答。",
  webSearchQualityControls: "搜索质量",
  webSearchSearchMode: "搜索模式",
  webSearchSearchModeQuick: "快速",
  webSearchSearchModeBalanced: "均衡",
  webSearchSearchModeDeep: "深入",
  webSearchDepth: "搜索深度",
  webSearchDepthStandard: "标准",
  webSearchDepthDeep: "深度",
  webSearchResultCount: "结果数量",
  webSearchQualityHint: ({ provider }) =>
    `这些控件调整 ${provider} 在回复之前收集新上下文的方式。`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} 尚未在此应用程序中公开额外的搜索质量控件。`,
  setWebSearchMode: ({ mode }) => `将网页搜索模式设置为 ${mode}`,
  openWebSearchSettings: "打开网页搜索设置",
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
  sentencesArrive: "逐段播放",
  sentencesArriveDescription:
    "完整的段落准备好后就开始说话。",
  fullReplyFirst: "先完整回复",
  fullReplyFirstDescription:
    "首先生成整个答案，然后一次性播放。",
  textToSpeech: "文字转语音",
  spokenReplies: "语音回复",
  spokenRepliesEnabledDescription:
    "当有可用的语音路由时，朗读助手的回复。",
  spokenRepliesDisabledDescription:
    "目前仅保留文本回复。您首选的 TTS 路由会保存下来，供以后使用。",
  nativeTtsDescription:
    "使用设备语音引擎进行语音回复和语音预览。",
  kokoroTtsDescription:
    "完全在此设备上使用更加自然的神经语音。语音回复文本在本地合成，无需语音提供商密钥或使用费。",
  kokoroVoices: "Kokoro 设备端语音",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `多语言模型下载约${size} MB，安装后占用约${installedSize} MB。`,
  kokoroModel: "Kokoro 多语言模型",
  kokoroChecking: "正在检查设备端模型…",
  kokoroDownloading: ({ progress }) => `正在下载…${progress}%`,
  kokoroExtracting: ({ progress }) => `正在安装…${progress}%`,
  kokoroVerifying: "正在验证语音引擎…",
  kokoroInstalled: "已在此设备上安装并准备就绪。",
  kokoroNotInstalled:
    "选择或使用 Kokoro 前，请先下载并验证模型。无需提供商密钥。",
  kokoroLanguageFallback:
    "Kokoro 目前在此支持英语和简体中文。对于其他选定的回复语言，请添加明确的回退路由，否则语音将因错误而停止。",
  kokoroRemoveTitle: "删除Kokoro模型？",
  kokoroRemoveBody: ({ installedSize }) =>
    `这会释放大约 ${installedSize} MB。您可以随时再次下载模型。`,
  removeKokoroModel: "删除Kokoro模型",
  downloadKokoroModel: "下载Kokoro模型",
  kokoroFallbackNeeded: ({ languages }) =>
    `以下语言需要明确的回退路由：${languages}。`,
  kokoroNoSelectedLanguages:
    "在“收听语言”下选择“英语”或“简体中文”以配置 Kokoro 语音。",
  expandVoiceSettings: ({ language }) => `展开${language}语音设置`,
  collapseVoiceSettings: ({ language }) =>
    `折叠${language}语音设置`,
  remove: "移除",
  voiceOutputDescription:
    "为语音回复选择语音引擎、收听语言和语音预览。",
  localTts: "本地",
  localTtsDescription:
    "使用已下载的匹配本地语音进行语音回复。",
  providerTtsDescription:
    "使用选定的已配置服务进行语音回复。",
  ttsFallbackRoutes: "回退路由",
  ttsFallbackRoutesHint:
    "可选。仅按期望的尝试顺序添加需要的路由。一旦某条路由开始朗读，Mr Broccoli 将在本条回复中一直使用它。",
  ttsFallbackNone:
    "未配置回退路由。语音失败时将直接显示错误。",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `添加 ${route} 回退路由`,
  removeFallbackRoute: ({ route }) => `删除 ${route} 回退路由`,
  moveFallbackEarlier: ({ route }) => `将 ${route} 前移`,
  moveFallbackLater: ({ route }) => `将 ${route} 后移`,
  ttsProvider: "TTS 提供商",
  ttsProviderEnabledHint:
    "此处仅显示具有语音回复支持的启用提供商。",
  ttsProviderMissingHint:
    "添加支持 TTS 的服务的凭据以在此处选择它。",
  localTtsOrderHint:
    "仅尝试明确配置的回退路由。",
  providerTtsOrderHint:
    "仅尝试明确配置的回退路由。",
  nativeTtsHint:
    "本机 TTS 使用系统语音堆栈，不需要提供商密钥。",
  localTtsLanguageCoverageHint:
    "本地包目前涵盖英语、德语、简体中文、西班牙语、葡萄牙语、印地语、法语和意大利语。",
  ttsVoice: "TTS 语音",
  refresh: "刷新",
  providerVoiceDirectory: ({ provider }) => `${provider} 语音库`,
  refreshProviderVoices: ({ provider }) => `刷新${provider}语音`,
  providerVoicesAvailable: ({ count, provider }) =>
    `可从 ${provider} 获取 ${count} 个语音。`,
  providerVoicesLoadFailed:
    "无法刷新语音列表。您当前的选择不变；您仍然可以手动输入语音 ID。",
  providerVoicesLoadFailedWithFallback:
    "无法加载账户语音。内置语音仍然可用。",
  providerVoicesErrorDetail: ({ detail }) => `原因：${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "在 ElevenLabs 中，编辑此 API 键并启用 Voices → Read，然后在此处刷新。",
  providerVoicesLoadingHint: ({ provider }) =>
    `Mr Broccoli 自动从 ${provider} 加载可用语音。`,
  providerVoiceId: "语音 ID",
  providerVoiceIdPlaceholder: "输入语音 ID",
  providerVoiceIdFallbackHint:
    "当语音库无法加载时，手动输入仍然可用。",
  providerVoiceIdRequired: ({ provider }) =>
    `使用语音输出前，请刷新 ${provider} 语音库或输入语音 ID。`,
  qwenSpeechUnavailableInUs:
    "Mr Broccoli 当前的 Qwen 语音路由在美国区域不可用。请为 Qwen 语音选择新加坡或北京区域。",
  qwenApiRegion: "Qwen API 区域",
  qwenRegionSingapore: "新加坡",
  qwenRegionUs: "美国（弗吉尼亚州）",
  qwenRegionBeijing: "中国（北京）",
  qwenRegionHint:
    "所选区域必须与创建此 API 密钥的区域匹配。",
  qwenRegionUsSpeechHint:
    "美国区域的密钥支持此处的聊天和网页搜索。Mr Broccoli 当前的 Qwen STT 和 TTS 路由需要新加坡或北京区域的密钥。",
  providerDefaultVoiceHint:
    "该提供商当前使用其默认语音进行预览和语音回复。",
  listenLanguages: "收听语言",
  listenLanguagesHint:
    "选择您希望听起来不错的回复语言。 Mr Broccoli 在路由语音输出时按此顺序尝试它们。",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "已选择 1 种语言" : `已选择 ${count} 种语言`,
  localVoicePacks: "本地语音包",
  localVoicePacksHint:
    "每种语言都有自己的本地语音。选择您想要的该语言的语音，然后仅下载您真正关心的包。",
  localVoiceForLanguage: ({ languageLabel }) => `${languageLabel} 的语音`,
  providerVoicePreviews: "提供商语音预览",
  providerVoicePreviewsHint:
    "此处测试当前选择的 TTS 路由，并为每种回复语言提供单独的预览文本。",
  nativeVoicePreviewSection: "原生语音预览",
  nativeVoicePreviewSectionHint:
    "它直接通过手机内置的语音合成器朗读，便于与已配置的提供商语音进行对比。",
  nativeVoiceUnavailable:
    "此设备未报告任何本机系统语音以进行预览。",
  runtimeCompatibilityOverrides: "运行时兼容性",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `有 ${count} 个经提供商确认不可用的模型或设置配置仅在此设备上被停用。Mr Broccoli会自动绕过它们。`,
  clearRuntimeCompatibilityOverrides: "清除运行时兼容性",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "要清除运行时兼容性吗？",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "之前停用的配置将可再次尝试。提供商可能会再次拒绝它们。",
  speechDiagnostics: "最近的语音活动",
  speechDiagnosticsHint:
    "显示最近的语音请求、请求的路由、实际使用的路由以及任何回退原因。",
  clearSpeechDiagnostics: "清除最近的语音活动",
  speechDiagnosticsEmpty:
    "还没有最近的语音请求。预览语音或播放一条回复，即可在此查看路由详情。",
  clearSpeechDiagnosticsConfirmationTitle: "要清除最近的语音活动吗？",
  clearSpeechDiagnosticsConfirmationMessage:
    "这将删除所有捕获的语音路由诊断。此操作无法撤消。",
  speechDiagnosticSourceConversation: "对话回复",
  speechDiagnosticSourceRepeat: "重复回复",
  speechDiagnosticSourcePreview: "语音预览",
  speechDiagnosticSourceUnknown: "语音请求",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `请求：${requested} -> 实际：${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `最新阶段：${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `语言：${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `提供商：${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `语音：${voice}`,
  localTtsPackReady: "安装在此设备上。",
  localTtsPackBroken:
    "已下载，但该语音在此设备上未通过本地验证。请重新下载或选择其他语音。",
  localTtsPackMissing:
    "尚未安装。在您下载之前，将使用云端 TTS 或系统语音。",
  localTtsUnsupportedLanguageFallback:
    "该语言尚无可用的本地语音包。将由云端 TTS 或系统语音处理。",
  downloadingLocalTtsPack: ({ progress }) =>
    `正在下载本地语音包…${progress}%`,
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
  replyFailedHint: "重试前，您可以在上方选择其他模型。",
  spokenReplyFailed: "回复已保存，但无法说出。",
  retrySpeech: "重试语音",
  openSpeakingSettings: "说话设置",
  messageCopied: "消息已复制。",
  noConversationToCopyYet: "尚无可复制的对话。",
  noConversationToShareYet: "尚无对话可分享。",
  noReplyToRepeatYet: "还没有可重播的回复。",
  threadCopied: "对话已复制。",
  threadRenamed: "对话已重命名。",
  threadPinned: "对话已固定。",
  threadUnpinned: "已取消固定对话。",
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
    "已达到最长录音时长——将发送已录到的内容。",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `该录音对 ${provider} 语音转文字来说太长（上限 ${limit}）。请改用较短的消息，或将语音转文字切换为系统识别。`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `使用此路由之前，请在“设置”中添加 ${provider} 的凭据。`,
  stopSessionBeforePreview:
    "在预览语音之前停止活动语音会话。",
  chooseTtsToPreviewVoices:
    "在“设置”中选择一条已配置的 TTS 路由来预览语音。",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `先下载选择的${languageLabel}本地语音。`,
  couldntPreviewVoice: "无法预览语音。",
  spokenRepliesDisabled: "“设置”中的语音回复已关闭。",
  providerVoiceFallback:
    "已配置的语音路由失败，本条回复已切换到回退语音。",
  localVoiceFallback:
    "本地语音不可用，本条回复已切换到回退语音。",
  localTtsPackInstalled: ({ languageLabel }) =>
    `${languageLabel} 本地语音包已安装。`,
  localTtsPackInstallFailed: "无法安装本地语音包。",
  clear: "清除",
  voiceOutput: "语音输出",
  speechReplayCache: "语音重播缓存",
  speechReplayCacheDescription:
    "服务商生成的语音会在此设备上保留最多 14 天，因此重播回复不会再次消耗语音额度。",
  clearSpeechReplayCache: "清除语音缓存",
  speechReplayCacheCleared: "已删除缓存的语音文件。",
  speechReplayCacheClearFailed: "无法清除语音缓存。",
  currentSetup: "当前设置",
  listeningToYourVoice: "正在聆听你的语音",
  parsingYourVoiceInput: "正在将你的语音转成文字",
  preparingRequest: "准备您的请求",
  searchingTheWeb: "在网络上搜索新的上下文",
  waitingForProvider: ({ provider }) => `等待${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `使用 ${provider} 准备语音`,
  deepThinkingReassurance: "好的答案需要一点时间……",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "正在向你朗读回复",
  freshSession: "全新会话",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 条消息" : `${count} 条消息`,
  speechInputRoute: ({ route }) => `语音输入：${route}`,
  replyModelRoute: ({ route }) => `回复模型：${route}`,
  voiceOutputRoute: ({ route }) => `语音输出：${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `回退语音输出：${route}`,
  conversation: "对话",
  conversationActions: "对话动作",
  statusDetails: "状态详情",
  persistenceFailure:
    "Mr Broccoli 无法在此设备上保存数据。保持应用程序打开并重试；重启后最近的更改可能会丢失。",
  show: "显示",
  showTranscript: "显示文字记录",
  hide: "隐藏",
  copyThread: "复制对话",
  shareThread: "分享对话",
  reportResponse: "举报此回答",
  reportResponseIntro: "来自 Mr Broccoli 的 AI 回答举报。请查看以下内容，描述问题，并将此举报发送给开发者。",
  repeatReply: "重复回复",
  renameThread: "重命名对话",
  renameThreadHint:
    "为该对话指定一个您稍后可以快速找到的标题。",
  threadTitle: "对话标题",
  noTranscriptYet: "还没有文字记录",
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
  usageStatsHiddenDescription: "不在文字记录界面中显示令牌估算。",
  usageStatsVisibleDescription:
    "显示单条回复和整段对话的令牌用量估算。",
  debugLogButton: "调试日志按钮",
  debugLogButtonHiddenDescription:
    "除非捕获已在运行，否则请将主屏幕“日志”按钮保持隐藏。",
  debugLogButtonVisibleDescription:
    "显示用于启动和停止调试捕获的主屏幕“日志”按钮。",
  debugLogButtonUsageDescription:
    "如何使用该按钮：将其打开将开始捕获日志。将其关闭将停止捕获日志并将捕获的日志移动到剪贴板中。",
  estimatedUsageTitle: "预计使用量",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} 条回复 · ${summaries} 次记忆更新`,
  estimatedUsageConversationScope:
    "总计包含此对话中使用的每条路由和模型。",
  estimatedPromptTokens: ({ count }) => `提示：${count}`,
  estimatedReplyTokens: ({ count }) => `回复：${count}`,
  estimatedTotalTokens: ({ count }) => `总计：${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `预计 ${prompt} 输入 · ${completion} 输出 · 共 ${total}`,
  searchQuery: "搜索查询",
  expandWebSearchDetails: "显示网页搜索详情",
  collapseWebSearchDetails: "隐藏网页搜索详情",
  webSearchSourceCount: ({ count }) => `${count} 个来源`,
  sources: "来源",
  openSourceLink: ({ source }) => `打开来源：${source}`,
  turnReceipt: "回合详情",
  expandTurnReceipt: "显示回合详情",
  collapseTurnReceipt: "隐藏回合详情",
  turnReceiptDirect: "直连",
  turnReceiptRequested: "请求的回复路由",
  turnReceiptActual: "实际回复路径",
  turnReceiptEffort: "推理控制",
  turnReceiptProviderNative: "提供商原生",
  turnReceiptInput: "输入路由",
  turnReceiptSearch: "网页搜索",
  turnReceiptVoice: "语音输出",
  turnReceiptContext: "上下文",
  turnReceiptTiming: "耗时",
  turnReceiptFallback: "回退原因",
  turnReceiptVoiceInput: "语音",
  turnReceiptTypedInput: "键入",
  turnReceiptSystemSpeech: "系统语音识别",
  turnReceiptSystemVoice: "系统声音",
  turnReceiptSystemVoiceFallback: "系统声音 · 回退",
  turnReceiptOff: "关闭",
  turnReceiptNotConfigured: "开 · 未配置",
  turnReceiptFallbackWithoutSearch: "继续，不进行实时搜索",
  turnReceiptNotUsed: "未使用",
  turnReceiptSummaryReused: "已复用保存的摘要",
  turnReceiptSummaryUpdated: "摘要已更新",
  turnReceiptContextFallback: "最近消息回退",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `网关将 ${original} 条消息压缩为 ${compressed} 条`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `已发送 ${sent}/${total} 条先前消息 · 新总结 ${summarized} 条${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "上下文",
  turnReceiptTimingSearch: "搜索",
  turnReceiptTimingModel: "模型",
  turnReceiptTimingFirstSpeech: "首次发声",
  turnReceiptTimingTotal: "总计",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} 个令牌`,
  unknownUsageRoute: "未知路由",
  setupGuideConnectProviderTitle: "配置凭据",
  setupGuideConnectProviderDescription:
    "在“设置”中添加凭据，然后选择您要使用的路由。",
  idle: "空闲",
  yourConversationAppearsHere: "您的对话出现在这里",
  defaultTranscriptEmptyDescription:
    "使用语音或文本开始对话。Mr Broccoli 会保留这段对话并在此回复。",
  delete: "删除",
  deleteConversationConfirmationTitle: ({ title }) => `删除“${title}”？`,
  deleteConversationConfirmationMessage:
    "这将永久删除对话及其所有消息。此操作无法撤消。",
  conversations: "对话",
  drawerSubtitle: "在进行中的对话之间切换，或开启新会话。",
  newSession: "新会话",
  noSavedConversationsYet: "尚未保存对话",
  drawerEmptyDescription:
    "在主界面开始说话，Mr Broccoli 会自动创建会话。",
  setupGuideTitle: "配置应用程序",
  setupGuideSubtitle: "添加凭据并在“设置”中选择路由。",
  fastestStartPreset: "最简设置",
  fastestStartDescription:
    "在可用时使用设备语音，仅配置您需要的回复路由。",
  fullVoicePreset: "已配置语音",
  fullVoiceDescription:
    "在您选择时，使用已配置的服务进行回复、转录和语音输出。",
  setupGuideNote:
    "接下来我们将打开“设置”，以便您可以粘贴和验证凭据。",
  useThisSetup: "使用此设置",
  notNow: "暂时不用",
  setupGuideIntroTitle: "Mr Broccoli 的工作原理",
  setupGuideIntroBody:
    "Mr Broccoli 初始为空。请为您已在使用的外部服务添加凭据，然后选择回复、语音输入、语音输出和可选网络上下文的路由方式。",
  setupGuideIntroNote:
    "设置完成后，使用主语音控制来开始和停止对话。当前文字记录会保留在主屏幕上，每条路由以后都可以在“设置”中更改。",
  setupGuideProviderTitle: "添加凭据",
  setupGuideProviderBody:
    "选择您要配置的外部服务，然后粘贴具有回复访问权限的凭据。",
  setupGuideProviderPickerLabel: "回复服务",
  setupGuideSelectProvider: "选择提供商",
  setupGuideSelectProviderFirst: "首先选择提供商。",
  setupGuideApiKeyLabel: "API 密钥",
  setupGuideApiKeyPlaceholder: "粘贴凭据",
  setupGuideContinue: "继续",
  setupGuideOpenSettings: "打开设置",
  setupGuideBack: "返回",
  setupGuideValidateKey: "验证密钥",
  setupGuideApiKeyRequiredOrCancel:
    "添加 API 密钥以继续，或取消设置指南。",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "选择提供商并添加 API 密钥以继续，或取消设置指南。",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `这些 ${provider} 凭据不允许回复请求。`,
  setupGuideKokoroTitle: "添加自然的设备语音",
  setupGuideKokoroBody: ({ size }) =>
    `可选：下载 Kokoro（大约 ${size} MB）以获得更自然的语音回复，无需语音提供商或使用费用。`,
  setupGuideKokoroLanguageNote:
    "该模型目前支持英语和简体中文。您可以稍后在“说话”设置中配置需要的回退路由。",
  setupGuideKokoroDownload: "下载Kokoro",
  setupGuideUseKokoro: "使用 Kokoro 进行语音回复",
  setupGuideUseKokoroSummary:
    "只要支持回复语言，就在手机上保持合成。",
  setupGuideSkipKokoro: "暂时跳过",
  setupGuideVoiceTestTitle: "测试您的设置",
  setupGuideVoiceTestBody:
    "说一个简短的句子。当可接受的语音路由可用时，Mr Broccoli 将测试麦克风访问、转录、配置的回复路由和语音输出。",
  setupGuideVoiceTestNoInputBody:
    "此配置无法使用语音输入。请继续查看检测到的路由，之后可按需调整语音设置。",
  setupGuideVoiceTestTextOnlyNote:
    "此测试仅保留文本，因为尚未准备好可接受的语音路由。",
  setupGuideVoiceTestStart: "开始测试",
  setupGuideVoiceTestStop: "停止录音",
  setupGuideVoiceTestRetry: "再次运行",
  setupGuideVoiceTestTranscribing: "正在转录…",
  setupGuideVoiceTestThinking: "正在测试回复…",
  setupGuideVoiceTestSynthesizing: "正在准备语音…",
  setupGuideVoiceTestSpeaking: "正在播放回复…",
  setupGuideVoiceTestTranscript: "文字记录",
  setupGuideVoiceTestReply: "回复",
  setupGuideVoiceTestReset: "清除此结果",
  setupGuideVoiceInputUnavailable:
    "在此设备上，该配置无法使用语音输入。",
  setupGuideSummaryTitle: "设置完成",
  setupGuideSummaryBody:
    "以下是 Mr Broccoli 在您当前配置下将使用的路由。",
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
  setupGuideRouteOff: "已关闭",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `通过 ${provider} 提供，目前关闭`,
  setupGuideSummaryTextOnlyNote:
    "语音回复暂时关闭。在您启用提供商或本地语音之前，回复将以文本形式保留。",
  setupGuideFinish: "完成",
  searchConversationsPlaceholder: "搜索标题、模型和消息文本",
  noMatchingConversations: "没有匹配的对话",
  noMatchingConversationsDescription:
    "换一个标题、路由、模型或文字记录中的其他词句试试。",
  noProviderYet: "还没有提供商",
  noModelYet: "还没有模型",
  startedAt: "开始",
  endedAt: "结束",
  pinned: "已固定",
  copy: "复制",
  share: "分享",
  rename: "重命名",
  pin: "固定",
  unpin: "取消固定",
  save: "保存",
  cancel: "取消",
  stop: "停止",
  pause: "暂停",
  resume: "恢复",
  paused: "已暂停",
  listening: "聆听中",
  parsing: "转录中",
  searching: "搜索中",
  converting: "转换中",
  webSearchAction: "网页搜索",
  thinking: "思考中",
  speaking: "朗读中",
  pleaseWait: "请稍等",
  yourTurn: "轮到你了",
  keepPressing: "继续按",
  tapWhenDone: "完成后点击",
  speechPaused: "语音已暂停",
  pausePlaybackUnavailable:
    "此语音路由无法暂停。请停止播放，或切换到提供商语音输出。",
  holdToSpeak: "按住说话",
  tapToSpeak: "点击即可说话",
  tapAgainToSend: "再次点击即可发送",
  waitingForReply: "等待回复",
  parsingYourVoice: "正在解析你的语音",
  providerConfiguredInSettings: ({ provider }) =>
    `设置中未配置 ${provider}。`,
  providerNetworkError: ({ provider, action }) =>
    `进行${action}时无法连接 ${provider}。请检查网络连接后重试。`,
  providerAuthError: ({ provider, action }) =>
    `${provider} 拒绝了用于${action}的凭据。请检查 API 密钥和权限。`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} 正在对${action}进行限流，请稍后重试。`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} 需要足够的 API 额度才能进行${action}。请检查账户余额和密钥的支出限额。`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} 在${action}期间耗时过长。请重试。`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} 在${action}期间出现临时问题。请稍后重试。`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} 结束时未返回任何回复。请重试。`,
  providerIncompleteReplyError: ({ provider }) =>
    `${provider} 的回复尚未完成就中断了。请重试。`,
  providerContextTooLong: ({ provider }) =>
    `${provider} 拒绝了本次回复，因为对话内容过长。请新建对话或缩短请求。`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} 拒绝了 ${action} 请求：${detail}`
      : `${provider} 拒绝了 ${action} 请求。`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} 未运行网页搜索便返回了响应。`,
  providerValidationSuccess: ({ provider }) =>
    `${provider} 已准备就绪，可以使用。`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} 的${capability}功能正常。`,
  providerValidationFailed: "提供商验证失败。",
  webSearchFallback:
    "网页搜索不可用，因此本次回复在没有实时网络上下文的情况下继续。",
  noBase64EncoderAvailable: "没有可用的 Base64 编码器。",
  noBase64DecoderAvailable: "没有可用的 Base64 解码器。",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS 需要 <key>|<region> 格式的 Azure 语音凭据，例如 abc123|westeurope，或组合的 Azure 格式 <endpoint>|<api-key>|<key>|<region>。",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "本机 TTS 不会合成音频文件。",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `${languageLabel}的本地和云端语音路由均未就绪。`,
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
    `${provider} ${model} 仅接受不超过 ${limit} 的录音。请使用较短的录音，或更换 STT 模型。`,
  voiceInputCaptureIncomplete:
    "无法清晰地捕获语音输入。请再试一次。",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS 未返回音频。`,
  nativeSttHandledInApp: "系统 STT 直接在应用程序中处理。",
  chooseSpeechToTextProviderInSettings:
    "在“设置”中选择语音转文本提供商。",
  sttNotSupportedYet: ({ provider }) => `尚不支持 ${provider} STT。`,
  providerNotWiredUpYet: ({ provider }) => `${provider} 尚未接入。`,
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
