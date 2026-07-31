import type { TranslationValue } from "../types";
import { dataBackupTranslations } from "../dataBackupTranslations";

export const en = {
  ...dataBackupTranslations.en,
  appName: "Mr Broccoli",
  retry: "Retry",
  dismiss: "Dismiss",
  done: "Done",
  aboutSetting: ({ setting }) => `About ${setting}`,
  unavailable: "Unavailable",
  selection: "Selection",
  chooseCompatibleProviderFirst: "Choose a compatible provider first",
  settings: "Settings",
  settingsReleaseVersion: ({ version }) => `Version ${version}`,
  all: "All",
  firstRun: "First Run",
  instructions: "Instructions",
  providers: "Providers",
  webSearch: "Web Search",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "Runtime Readiness",
  settingsReadinessThink: "Think",
  settingsReadinessListen: "Listen",
  settingsReadinessSpeak: "Speak",
  settingsReadinessSearch: "Search",
  settingsReadinessReady: "Ready",
  settingsReadinessNeedsAttention: "Attention",
  settingsReadinessBroken: "Broken",
  settingsReadinessOff: "Off",
  settingsConnections: "Connections",
  settingsThinking: "Thinking",
  settingsListening: "Listening",
  settingsSpeaking: "Speaking",
  settingsSearch: "Search",
  settingsAppDiagnostics: "App & diagnostics",
  settingsGuidedSetup: "Guided setup",
  settingsGuidedSetupSummary:
    "Review connections and test the complete voice route.",
  setupGuideShowInSettings: "Show guided setup in Settings",
  setupGuideShowInSettingsSummary:
    "Show or hide the guided setup shortcut on the Settings overview.",
  settingsConnectionsSummary: "Provider keys, validation, and capabilities.",
  settingsThinkingSummary: "Home cards, models, effort, and system prompt.",
  settingsListeningSummary: "Input mode and speech-to-text routing.",
  settingsSpeakingSummary: "Spoken replies, playback, voices, and previews.",
  settingsSearchSummary: "Web search provider and search quality controls.",
  settingsAppDiagnosticsSummary:
    "Theme, language, usage, debug logs, and recent activity.",
  settingsBackToOverview: "Back to overview",
  settingsOpenSection: ({ section }) => `Open ${section}`,
  theme: "Theme",
  language: "Language",
  recognitionLanguage: "Recognition language",
  recognitionLanguageHint:
    "Choose a language to improve recognition, or leave it automatic for device or provider detection.",
  automaticLanguage: "Automatic",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} does not officially support ${language} for this speech route.`,
  usageStats: "Usage Stats",
  model: "Model",
  effort: "Effort",
  effortValue: ({ effort }) => `Effort: ${effort}`,
  modelEffortNone: "None",
  modelEffortMinimal: "Minimal",
  modelEffortLow: "Low",
  modelEffortMedium: "Medium",
  modelEffortHigh: "High",
  modelEffortExtraHigh: "Extra high",
  modelEffortMax: "Max",
  modelEffortDynamic: "Dynamic",
  modelEffortDisabled: "Disabled",
  modelEffortEnabled: "Enabled",
  fixed: "Fixed",
  english: "English",
  german: "German",
  ukrainian: "Ukrainian",
  hindi: "Hindi",
  spanish: "Spanish",
  french: "French",
  italian: "Italian",
  portuguese: "Portuguese",
  portugueseBrazil: "Portuguese (Brazil)",
  russian: "Russian",
  simplifiedChinese: "Simplified Chinese",
  arabic: "Arabic",
  japanese: "Japanese",
  hungarian: "Hungarian",
  czech: "Czech",
  polish: "Polish",
  turkish: "Turkish",
  swedish: "Swedish",
  urdu: "Urdu",
  kokoroAmericanFemaleVoice: ({ name }) => `${name} · American female`,
  kokoroBritishFemaleVoice: ({ name }) => `${name} · British female`,
  kokoroChineseFemaleVoice: ({ index }) => `Chinese female ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `Chinese male ${index}`,
  light: "Light",
  dark: "Dark",
  system: "System",
  languageCoverage: ({ note }) => `Language coverage: ${note}`,
  recordingLimits: ({ note }) => `Recording limits: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Pricing: ${summary}`,
  replyGenerationAction: "reply generation",
  speechTranscriptionAction: "speech transcription",
  speechSynthesisAction: "speech synthesis",
  instructionsTabDescription:
    "Shape the hidden guidance that steers the assistant before any provider sees the request.",
  providersTabDescription:
    "Store external-service credentials on-device and configure the response modes you want to use.",
  webSearchTabDescription:
    "Configure optional live web context before replies.",
  responseModes: "Model Selection",
  aboutModelSelection: "About model selection",
  modelSelectionInfo:
    "Each model card becomes a choice on the home screen. Configure its provider, model, and optional effort level, then switch cards to choose which model answers next.",
  responseModeItemTitle: ({ index }) => `Model ${index}`,
  addResponseMode: "Add model",
  removeResponseMode: "Remove model",
  responseModesNoConfiguredProviders:
    "Add credentials first. Route controls stay hidden until at least one compatible service is configured.",
  useResponseMode: ({ mode }) => `Use ${mode}`,
  chooseResponseModel: "Choose a model",
  responseModelCount: ({ count }) => `${count} models available`,
  ulraMode: "Uber Mode",
  ulraModeHomeLabel: "Show Uber Mode on the home screen",
  ulraModeSettingsDescription:
    "Allow multi-model deliberation when at least two home-screen models are ready.",
  ulraModeInfo:
    "Uber Mode asks every ready home-screen model independently, then lets each model review all earlier answers for every round. The selected model synthesizes the final response. The deliberation is shared with every provider involved.",
  ulraModeRounds: "Review rounds",
  ulraModeCallEstimate: ({ count }) =>
    `About ${count} model calls per message with the current setup.`,
  ulraModeThresholdWarning:
    "More than 4 models or 3 rounds can take a long time, consume many tokens, and hit provider context or rate limits. This is a warning only.",
  ulraModeFirstUseTitle: "Enable Uber Mode?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `With ${models} models and ${rounds} review rounds, one message can make about ${calls} model calls. It may take much longer, cost significantly more, and share the deliberation with every provider involved.`,
  ulraModeHighRiskTitle: "Large Uber Mode run",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} models and ${rounds} review rounds can make about ${calls} model calls. This may take a very long time, use many tokens, and hit provider limits. Continue anyway?`,
  ulraModeEnableAction: "Enable",
  ulraModeNeedsTwoModels:
    "Uber Mode needs at least two ready home-screen models.",
  ulraModeAllModelsFailed:
    "Every Uber Mode model failed before a response could be synthesized.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} private model calls failed; the final answer used ${succeeded} successful contributions.`,
  sttTabDescription:
    "Control how speech is captured and which backend turns audio into text before it reaches the model.",
  ttsTabDescription:
    "Control when replies start speaking and which backend handles spoken output.",
  brief: "Brief",
  briefDescription:
    "Keep the answer tight. Use the minimum number of sentences needed to fully answer the user.",
  normal: "Normal",
  normalDescription:
    "Aim for a balanced response length. Cover the important points without dragging the answer out.",
  thorough: "Thorough",
  thoroughDescription:
    "Go deep and be comprehensive. Include nuance, detail, tradeoffs, and the reasoning that matters.",
  professional: "Professional",
  professionalDescription:
    "Speak like a senior consultant briefing a client. Precise language, no slang, measured and authoritative.",
  casual: "Casual",
  casualDescription:
    "Speak like a smart friend at a coffee shop. Relaxed, natural, conversational. Contractions are fine, tangents are fine.",
  nerdy: "Nerdy",
  nerdyDescription:
    "Speak like an enthusiastic expert who loves going deep. Use technical terminology freely, geek out about details, assume the user can keep up.",
  concise: "Concise",
  conciseDescription:
    "Be as brief as possible while still being complete. No preamble, no filler, just the answer. Think telegram style.",
  socratic: "Socratic",
  socraticDescription:
    "Challenge the user's thinking. Ask counter-questions, offer alternative perspectives, don't just confirm what they said. Be a sparring partner, not a yes-machine.",
  eli5: "ELI5",
  eli5Description:
    "Explain everything as simply as possible. Use analogies, everyday language, zero jargon. Assume no prior knowledge on any topic.",
  useProvider: ({ provider }) => `Use ${provider}`,
  createApiKey: "Credentials",
  apiKey: "API key",
  aboutThisProvider: "About this provider",
  openRouterOnboardingTitle: "One key, multiple providers",
  openRouterOnboardingDescription:
    "Create a dedicated OpenRouter key, paste it below, and use snapshot-backed models from several providers without replacing any direct connection.",
  openRouterOnboardingRoute:
    "Request path: this device → OpenRouter → selected upstream provider",
  openRouterKeys: "OpenRouter keys",
  providerStatusInvalid: "Invalid",
  providerStatusTesting: "Testing",
  providerStatusConfigured: "Configured",
  providerStatusWorking: "Working",
  providerStatusNotTested: "Not tested",
  providerStatusNotSetup: "Not set up",
  expandProvider: ({ provider }) => `Expand ${provider}`,
  collapseProvider: ({ provider }) => `Collapse ${provider}`,
  testProviderKey: "Test key",
  testAllCapabilities: "Test all",
  apiTest: "API test",
  testProviderCapability: ({ capability }) => `Test ${capability}`,
  test: "Test",
  optional: "Optional",
  providerCapability_llm: "Replies",
  providerCapability_stt: "Speech input",
  providerCapability_tts: "Voice output",
  providerCapability_search: "Web search",
  providerCapability_voices: "Voice library",
  providerValidationUnavailable:
    "Live validation is not wired for this provider yet. Save the key here and verify it during actual use.",
  providerNeedsAttention: "needs attention",
  catalogProviderLimitsSummary: ({ summary }) => `Limits: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Region: ${summary}`,
  validatingKey: "Validating...",
  showKey: "Show key",
  hideKey: "Hide key",
  assistantInstructions: "Assistant Instructions",
  systemPrompt: "System Prompt",
  aboutSystemPrompt: "About the system prompt",
  assistantInstructionsIntro:
    "Shape the hidden guidance the model receives before every reply.",
  baseInstructions: "Base Instructions",
  assistantInstructionsPlaceholder: "Define how the assistant should behave.",
  assistantInstructionsHint:
    "This is always prepended before the selected response length and tone.",
  adaptiveLength: "Adaptive Length",
  responseTone: "Response Tone",
  homeStyleChipLabel: ({ tone, length }) => `Style — ${tone} · ${length}`,
  styleSheetTitle: "Conversation settings",
  styleSheetSubtitle: "Shape replies and speech for this conversation only.",
  openStyleSheet: "Open conversation settings",
  conversationThinkingInstructions: "Thinking instructions",
  conversationThinkingInstructionsDescription:
    "Add instructions after the global system prompt for this conversation.",
  conversationThinkingInstructionsPlaceholder:
    "For example: Challenge my assumptions and use concrete examples.",
  ttsInstructions: "Speech delivery instructions",
  ttsInstructionsDescription:
    "Guide the tone, pace, accent, or delivery used by compatible speech models.",
  conversationTtsInstructionsDescription:
    "Add delivery instructions after the global speech instructions for this conversation.",
  ttsInstructionsPlaceholder:
    "For example: Speak warmly, clearly, and at a relaxed pace.",
  ttsInstructionsUnsupported:
    "The current speech route does not support delivery instructions.",
  conversationVoiceDescription: ({ route }) =>
    `Choose the voice used by ${route} in this conversation.`,
  scrollToLatest: "Scroll to latest message",
  conversationTitleGenerate: "Auto-generate title",
  conversationTitleGenerating: "Generating title…",
  conversationTitleGenerated: "Conversation renamed.",
  conversationTitleNeedsContent:
    "Start a conversation before generating a title.",
  conversationTitleNeedsProvider:
    "Configure the selected model before generating a title.",
  conversationTitleGenerationFailed: "Couldn’t generate a conversation title.",
  conversationTitleGenerationTimedOut:
    "Title generation took too long. Please try again.",
  inputMode: "Input Mode",
  voiceInput: "Voice Input",
  pushToTalk: "Push to Talk",
  pushToTalkDescription:
    "Hold the main button while speaking, then release to send.",
  toggleToTalk: "Toggle to Talk",
  toggleToTalkDescription:
    "Tap once to start recording and tap again when you are done.",
  driveSession: "Drive Session",
  driveSessionDescription:
    "When automatic continuation is on, recording starts after each spoken reply. Tap the main button when you are done speaking.",
  stopDriveSession: "Pause auto",
  repeatDriveReply: "Repeat last",
  continueDriveSession: "Resume auto",
  speechToText: "Speech to Text",
  appNative: "System Recognition",
  nativeSttDescription:
    "Use the operating system's speech recognizer. Depending on device settings, recognition may run on-device or through the system service. No provider key is required.",
  provider: "Provider",
  webSearchProvider: "Web Search Provider",
  webSearchProviderMissingHint:
    "Configure at least one search-capable service in Credentials to enable web grounding here.",
  webSearchModelHint: ({ model }) =>
    `Uses ${model} behind the scenes for live web grounding.`,
  webSearchHomeHint:
    "Use the home-screen toggle to switch web grounding on or off for this thread.",
  settingsWebSearchCompactHint:
    "Optionally prepend fresh web context before the main model replies.",
  webSearchAdvanced: "Advanced Search Controls",
  expandAdvancedSearch: "Expand advanced search controls",
  collapseAdvancedSearch: "Collapse advanced search controls",
  webSearchSetupNeeded: "Add credentials to use live web search.",
  webSearchEnabledDescription:
    "Fresh web context is added before the model replies.",
  webSearchDisabledDescription:
    "Use live web context for this thread when current facts matter.",
  webSearchQualityControls: "Search Quality",
  webSearchSearchMode: "Search Mode",
  webSearchSearchModeQuick: "Quick",
  webSearchSearchModeBalanced: "Balanced",
  webSearchSearchModeDeep: "Deep",
  webSearchDepth: "Search Depth",
  webSearchDepthStandard: "Standard",
  webSearchDepthDeep: "Deep",
  webSearchResultCount: "Result Count",
  webSearchQualityHint: ({ provider }) =>
    `These controls tune how ${provider} gathers fresh context before the reply.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} does not expose extra search-quality controls in this app yet.`,
  setWebSearchMode: ({ mode }) => `Set web search mode to ${mode}`,
  openWebSearchSettings: "Open web search settings",
  providerSttDescription:
    "Use a configured external service to transcribe your voice before it is sent to the reply route.",
  sttProvider: "STT Provider",
  sttProviderEnabledHint:
    "Only enabled providers with transcription support appear here.",
  sttProviderMissingHint:
    "Add credentials for a service with STT support to choose it here.",
  nativeSttHint:
    "System recognition works independently of your provider keys and may be processed on-device or by the operating system's speech service.",
  replyPlayback: "Reply Playback",
  sentencesArrive: "Paragraphs Arrive",
  sentencesArriveDescription:
    "Start speaking as soon as a complete paragraph is ready.",
  fullReplyFirst: "Full Reply First",
  fullReplyFirstDescription:
    "Generate the entire answer first, then play it in one pass.",
  textToSpeech: "Text to Speech",
  spokenReplies: "Spoken Replies",
  spokenRepliesEnabledDescription:
    "Read assistant replies aloud when a voice route is available.",
  spokenRepliesDisabledDescription:
    "Keep replies text-only for now. Your preferred TTS route stays saved for later.",
  nativeTtsDescription:
    "Use the device speech engine for spoken replies and voice preview.",
  kokoroTtsDescription:
    "Use a much more natural neural voice entirely on this device. Spoken-reply text is synthesized locally, with no speech-provider key or usage charge.",
  kokoroVoices: "Kokoro On-device Voices",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `The multilingual model downloads about ${size} MB and occupies about ${installedSize} MB after installation.`,
  kokoroModel: "Kokoro multilingual model",
  kokoroChecking: "Checking the on-device model…",
  kokoroDownloading: ({ progress }) => `Downloading… ${progress}%`,
  kokoroExtracting: ({ progress }) => `Installing… ${progress}%`,
  kokoroVerifying: "Verifying the voice engine…",
  kokoroInstalled: "Installed and ready on this device.",
  kokoroNotInstalled:
    "Download and verify the model before selecting or using Kokoro. No provider key is required.",
  kokoroLanguageFallback:
    "Kokoro currently speaks English and Simplified Chinese here. For other selected reply languages, add an explicit fallback route or speech will stop with an error.",
  kokoroRemoveTitle: "Remove the Kokoro model?",
  kokoroRemoveBody: ({ installedSize }) =>
    `This frees about ${installedSize} MB. You can download the model again at any time.`,
  removeKokoroModel: "Remove the Kokoro model",
  downloadKokoroModel: "Download the Kokoro model",
  kokoroFallbackNeeded: ({ languages }) =>
    `An explicit fallback route is required for: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Select English or Simplified Chinese under Listen Languages to configure a Kokoro voice.",
  expandVoiceSettings: ({ language }) => `Expand ${language} voice settings`,
  collapseVoiceSettings: ({ language }) =>
    `Collapse ${language} voice settings`,
  remove: "Remove",
  voiceOutputDescription:
    "Pick the speech engine, listening languages, and voice previews for spoken replies.",
  localTts: "Local",
  localTtsDescription:
    "Use a matching downloaded local voice for spoken replies.",
  providerTtsDescription:
    "Use the selected configured service for spoken replies.",
  ttsFallbackRoutes: "Fallback routes",
  ttsFallbackRoutesHint:
    "Optional. Add only the routes you want, in the order they should be tried. Once a route starts speaking, Mr Broccoli stays on it for the rest of the reply.",
  ttsFallbackNone:
    "No fallback is configured. A voice failure will be shown instead.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Add ${route} fallback`,
  removeFallbackRoute: ({ route }) => `Remove ${route} fallback`,
  moveFallbackEarlier: ({ route }) => `Move ${route} earlier`,
  moveFallbackLater: ({ route }) => `Move ${route} later`,
  ttsProvider: "TTS Provider",
  ttsProviderEnabledHint:
    "Only enabled providers with spoken-reply support appear here.",
  ttsProviderMissingHint:
    "Add credentials for a service with TTS support to choose it here.",
  localTtsOrderHint:
    "Only explicitly configured fallback routes are attempted.",
  providerTtsOrderHint:
    "Only explicitly configured fallback routes are attempted.",
  nativeTtsHint:
    "Native TTS uses the system voice stack and does not require a provider key.",
  localTtsLanguageCoverageHint:
    "Local packs currently cover English, German, Simplified Chinese, Spanish, Portuguese, Hindi, French, and Italian.",
  ttsVoice: "TTS Voice",
  refresh: "Refresh",
  providerVoiceDirectory: ({ provider }) => `${provider} voice library`,
  refreshProviderVoices: ({ provider }) => `Refresh ${provider} voices`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} ${Number(count) === 1 ? "voice" : "voices"} available from ${provider}.`,
  providerVoicesLoadFailed:
    "Voices could not be refreshed. Your current selection is unchanged; you can still enter a voice ID manually.",
  providerVoicesLoadFailedWithFallback:
    "Account voices could not be loaded. The built-in voice remains available.",
  providerVoicesErrorDetail: ({ detail }) => `Reason: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "In ElevenLabs, edit this API key and enable Voices → Read, then refresh here.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Mr Broccoli loads available voices automatically from ${provider}.`,
  providerVoiceId: "Voice ID",
  providerVoiceIdPlaceholder: "Enter a voice ID",
  providerVoiceIdFallbackHint:
    "Manual entry remains available when the voice library cannot be loaded.",
  providerVoiceIdRequired: ({ provider }) =>
    `Refresh the ${provider} voice library or enter a voice ID before using speech output.`,
  qwenSpeechUnavailableInUs:
    "Mr Broccoli's current Qwen speech routes are not available in the US region. Choose Singapore or Beijing for Qwen speech.",
  qwenApiRegion: "Qwen API Region",
  qwenRegionSingapore: "Singapore",
  qwenRegionUs: "US (Virginia)",
  qwenRegionBeijing: "China (Beijing)",
  qwenRegionHint:
    "The selected region must match the region in which this API key was created.",
  qwenRegionUsSpeechHint:
    "US-region keys support chat and web search here. Mr Broccoli's current Qwen STT and TTS routes require a Singapore or Beijing key.",
  providerDefaultVoiceHint:
    "This provider currently uses its default voice for preview and spoken replies.",
  listenLanguages: "Listen Languages",
  listenLanguagesHint:
    "Pick the reply languages you want to sound good. Mr Broccoli tries them in this order when routing speech output.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 language selected" : `${count} languages selected`,
  localVoicePacks: "Local Voice Packs",
  localVoicePacksHint:
    "Each language keeps its own local voice. Choose the voice you want for that language, then download only the packs you actually care about.",
  localVoiceForLanguage: ({ languageLabel }) => `Voice for ${languageLabel}`,
  providerVoicePreviews: "Provider Voice Previews",
  providerVoicePreviewsHint:
    "Test the currently selected TTS route here with a separate preview text for each reply language.",
  nativeVoicePreviewSection: "Native Voice Preview",
  nativeVoicePreviewSectionHint:
    "This speaks directly through the phone's built-in speech synthesizer so you can compare it with configured provider voices.",
  nativeVoiceUnavailable:
    "This device did not report any native system voices for preview.",
  runtimeCompatibilityOverrides: "Runtime compatibility",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `${count} provider-confirmed unavailable model or setting configurations are disabled only on this device. Mr Broccoli routes around them automatically.`,
  clearRuntimeCompatibilityOverrides: "Clear runtime compatibility",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "Clear runtime compatibility?",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "Previously disabled configurations can be tried again. A provider may reject them again.",
  speechDiagnostics: "Recent Speech Activity",
  speechDiagnosticsHint:
    "Shows the latest speech requests, the route they asked for, the route they actually used, and any fallback reason.",
  clearSpeechDiagnostics: "Clear recent speech activity",
  speechDiagnosticsEmpty:
    "No recent speech requests yet. Preview a voice or play a reply to see routing details here.",
  clearSpeechDiagnosticsConfirmationTitle: "Clear recent speech activity?",
  clearSpeechDiagnosticsConfirmationMessage:
    "This removes all captured speech-routing diagnostics. This action cannot be undone.",
  speechDiagnosticSourceConversation: "Conversation reply",
  speechDiagnosticSourceRepeat: "Repeat reply",
  speechDiagnosticSourcePreview: "Voice preview",
  speechDiagnosticSourceUnknown: "Speech request",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Requested: ${requested} -> Actual: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Latest stage: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Language: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Provider: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Voice: ${voice}`,
  localTtsPackReady: "Installed on this device.",
  localTtsPackBroken:
    "Downloaded, but this voice failed local verification on this device. Re-download it or choose another voice.",
  localTtsPackMissing:
    "Not installed yet. Cloud TTS or the system voice will be used until you download it.",
  localTtsUnsupportedLanguageFallback:
    "A local pack is not available yet for this language. Cloud TTS or the system voice will handle it.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Downloading local pack... ${progress}%`,
  download: "Download",
  downloadingShort: "Loading...",
  voicePreviewText: "Voice Preview Text",
  voicePreviewPlaceholder: "Type a phrase to hear this voice.",
  voicePreviewHint:
    "Uses the currently selected reply voice backend without sending anything to the language model.",
  previewVoice: "Preview Voice",
  generatingPreview: "Generating Preview...",
  playingPreview: "Playing Preview...",
  systemVoice: "System voice",
  spokenRepliesOff: "Text only",
  noTtsProvider: "No TTS provider",
  nothingToCopyYet: "Nothing to copy yet.",
  couldntCopyText: "Couldn't copy that text.",
  nothingToShareYet: "Nothing to share yet.",
  couldntShareText: "Couldn't share that text.",
  couldntReplayReply: "Couldn't replay that reply.",
  replyFailed: "Reply failed",
  retryReply: "Retry reply",
  replyFailedHint: "You can choose another model above before retrying.",
  spokenReplyFailed: "The reply was saved, but it could not be spoken.",
  retrySpeech: "Retry speech",
  openSpeakingSettings: "Speaking settings",
  messageCopied: "Message copied.",
  noConversationToCopyYet: "No conversation to copy yet.",
  noConversationToShareYet: "No conversation to share yet.",
  noReplyToRepeatYet: "No reply to replay yet.",
  threadCopied: "Thread copied.",
  threadRenamed: "Thread renamed.",
  threadPinned: "Thread pinned.",
  threadUnpinned: "Thread unpinned.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Add credentials for ${provider} in Settings before using this route.`,
  configureCredentialsBeforeVoiceSession:
    "Add credentials in Settings before starting a voice session.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `For ${provider}, enter the provider base URL and API key as https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "Speech recognition is unavailable on this device.",
  debugLogLabel: "LOG",
  debugLogCaptureStarted: "Debug logging started.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Debug log saved as ${fileName} and copied to the clipboard (${entryCount} entries).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Debug log saved as ${fileName} (${entryCount} entries).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Recovered previous debug log ${fileName} and copied it to the clipboard (${entryCount} entries).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Recovered previous debug log ${fileName} (${entryCount} entries).`,
  debugLogCaptureFailed: "Couldn't save the debug log.",
  chooseSttBeforeVoiceSession:
    "Choose a configured STT route in Settings before starting a voice session.",
  chooseTtsBeforeSpokenReplies:
    "Choose a configured TTS route in Settings before using spoken replies.",
  stopSessionBeforeReplay:
    "Stop the active voice session before replaying the last reply.",
  couldntCatchThatTryAgain: "Couldn't catch that, try again.",
  couldntStartVoiceInput: "Couldn't start voice input.",
  couldntProcessVoiceInput: "Couldn't process voice input.",
  maxRecordingLengthReached:
    "Maximum recording length reached — sending what I have.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `That recording is too long for ${provider} speech-to-text (max ${limit}). Try a shorter message, or switch Speech-to-Text to System Recognition.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Add credentials for ${provider} in Settings before using this route.`,
  stopSessionBeforePreview:
    "Stop the active voice session before previewing a voice.",
  chooseTtsToPreviewVoices:
    "Choose a configured TTS route in Settings to preview voices.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Download the selected ${languageLabel} local voice first.`,
  couldntPreviewVoice: "Couldn't preview voice.",
  spokenRepliesDisabled: "Spoken replies are turned off in Settings.",
  providerVoiceFallback:
    "Configured voice route failed. Switched this reply to a fallback voice.",
  localVoiceFallback:
    "Local voice was unavailable. Switched this reply to a fallback voice.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `${languageLabel} local voice pack installed.`,
  localTtsPackInstallFailed: "Couldn't install the local voice pack.",
  clear: "Clear",
  voiceOutput: "Voice Output",
  speechReplayCache: "Speech replay cache",
  speechReplayCacheDescription:
    "Provider-generated speech stays on this device for up to 14 days, so repeating a reply does not spend speech credits again.",
  clearSpeechReplayCache: "Clear speech cache",
  speechReplayCacheCleared: "The cached speech files were removed.",
  speechReplayCacheClearFailed: "The speech cache could not be cleared.",
  currentSetup: "Current Setup",
  listeningToYourVoice: "Listening to your voice",
  parsingYourVoiceInput: "Turning your voice into text",
  preparingRequest: "Preparing your request",
  searchingTheWeb: "Searching the web for fresh context",
  waitingForProvider: ({ provider }) => `Waiting for ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Preparing voice with ${provider}`,
  deepThinkingReassurance: "Good answers take a moment…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "Speaking back to you",
  freshSession: "Fresh session",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 message" : `${count} messages`,
  speechInputRoute: ({ route }) => `Speech in: ${route}`,
  replyModelRoute: ({ route }) => `Reply model: ${route}`,
  voiceOutputRoute: ({ route }) => `Voice out: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Fallback voice out: ${route}`,
  conversation: "Conversation",
  conversationActions: "Conversation actions",
  statusDetails: "Status details",
  persistenceFailure:
    "Mr Broccoli couldn't save data on this device. Keep the app open and try again; recent changes may be lost after restart.",
  show: "Show",
  showTranscript: "Show transcript",
  hide: "Hide",
  copyThread: "Copy Thread",
  shareThread: "Share Thread",
  repeatReply: "Repeat Reply",
  renameThread: "Rename Thread",
  renameThreadHint:
    "Give this conversation a title you can find quickly later.",
  threadTitle: "Thread title",
  noTranscriptYet: "No transcript yet",
  previewTranscriptEmptyDescription:
    "Use voice or text to begin. Your conversation will appear here.",
  noConversationYet: "No conversation yet",
  expandedTranscriptEmptyDescription:
    "Use voice or text to begin. Close this screen when you want to return to the main stage.",
  transcriptSelectionHint:
    "Select any message text directly, or share and copy individual messages below.",
  textMessagePlaceholder: "Type a message",
  sendTextMessage: "Send message",
  showVoiceInput: "Show voice input",
  showTextInput: "Show text input",
  usageStatsHiddenDescription: "Keep token estimates out of the transcript UI.",
  usageStatsVisibleDescription:
    "Show estimated token usage for replies and conversation totals.",
  debugLogButton: "Debug Log Button",
  debugLogButtonHiddenDescription:
    "Keep the home-screen LOG button hidden unless a capture is already running.",
  debugLogButtonVisibleDescription:
    "Show the home-screen LOG button for starting and stopping debug captures.",
  debugLogButtonUsageDescription:
    "How to use the button: toggling it on will start capturing logs. Toggling it off will stop capturing logs and move the captured ones into the clipboard.",
  estimatedUsageTitle: "Estimated Usage",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} replies · ${summaries} memory updates`,
  estimatedUsageConversationScope:
    "Totals include every route and model used inside this conversation.",
  estimatedPromptTokens: ({ count }) => `Prompt: ${count}`,
  estimatedReplyTokens: ({ count }) => `Reply: ${count}`,
  estimatedTotalTokens: ({ count }) => `Total: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Est. ${prompt} in · ${completion} out · ${total} total`,
  searchQuery: "Search query",
  expandWebSearchDetails: "Show web search details",
  collapseWebSearchDetails: "Hide web search details",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "source" : "sources"}`,
  sources: "Sources",
  openSourceLink: ({ source }) => `Open source: ${source}`,
  turnReceipt: "Turn details",
  expandTurnReceipt: "Show turn details",
  collapseTurnReceipt: "Hide turn details",
  turnReceiptDirect: "Direct",
  turnReceiptRequested: "Requested reply route",
  turnReceiptActual: "Actual reply route",
  turnReceiptEffort: "Reasoning control",
  turnReceiptProviderNative: "provider-native",
  turnReceiptInput: "Input route",
  turnReceiptSearch: "Web search",
  turnReceiptVoice: "Voice output",
  turnReceiptContext: "Context",
  turnReceiptTiming: "Timing",
  turnReceiptFallback: "Fallback reason",
  turnReceiptVoiceInput: "Voice",
  turnReceiptTypedInput: "Typed",
  turnReceiptSystemSpeech: "System speech recognition",
  turnReceiptSystemVoice: "System voice",
  turnReceiptSystemVoiceFallback: "System voice · fallback",
  turnReceiptOff: "Off",
  turnReceiptNotConfigured: "On · not configured",
  turnReceiptFallbackWithoutSearch: "Continued without live search",
  turnReceiptNotUsed: "Not used",
  turnReceiptSummaryReused: "saved summary reused",
  turnReceiptSummaryUpdated: "summary updated",
  turnReceiptContextFallback: "recent-message fallback",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `gateway compressed ${original} to ${compressed} messages`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} prior messages sent · ${summarized} newly summarized${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "context",
  turnReceiptTimingSearch: "search",
  turnReceiptTimingModel: "model",
  turnReceiptTimingFirstSpeech: "first speech",
  turnReceiptTimingTotal: "total",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} tokens`,
  unknownUsageRoute: "Unknown route",
  setupGuideConnectProviderTitle: "Configure credentials",
  setupGuideConnectProviderDescription:
    "Add credentials in Settings, then choose the routes you want to use.",
  idle: "Idle",
  yourConversationAppearsHere: "Your conversation appears here",
  defaultTranscriptEmptyDescription:
    "Use voice or text to begin. Mr Broccoli will keep the thread and respond here.",
  delete: "Delete",
  deleteConversationConfirmationTitle: ({ title }) => `Delete “${title}”?`,
  deleteConversationConfirmationMessage:
    "This permanently deletes the conversation and all its messages. This action cannot be undone.",
  memory: "Memory",
  conversations: "Conversations",
  drawerSubtitle: "Jump between live threads or start a fresh room.",
  newSession: "New Session",
  noSavedConversationsYet: "No saved conversations yet",
  drawerEmptyDescription:
    "Start speaking from the main view and Mr Broccoli will build a session automatically.",
  setupGuideTitle: "Configure the app",
  setupGuideSubtitle: "Add credentials and choose routes in Settings.",
  fastestStartPreset: "Minimal setup",
  fastestStartDescription:
    "Use device speech where available and configure only the reply route you need.",
  fullVoicePreset: "Configured voice",
  fullVoiceDescription:
    "Use configured services for replies, transcription, and spoken output when you choose them.",
  setupGuideNote:
    "We will open Settings next so you can paste and validate credentials.",
  useThisSetup: "Use this setup",
  notNow: "Not now",
  setupGuideIntroTitle: "How Mr Broccoli works",
  setupGuideIntroBody:
    "Mr Broccoli starts blank. Add credentials for external services you already use, then choose how replies, speech input, spoken output, and optional web context are routed.",
  setupGuideIntroNote:
    "After setup, use the main voice control to start and stop a conversation. The current transcript stays available on the home screen, and every route can be changed later in Settings.",
  setupGuideProviderTitle: "Add Credentials",
  setupGuideProviderBody:
    "Choose the external service you want to configure, then paste credentials with reply access.",
  setupGuideProviderPickerLabel: "Reply service",
  setupGuideSelectProvider: "Select a provider",
  setupGuideSelectProviderFirst: "Select a provider first.",
  setupGuideApiKeyLabel: "API key",
  setupGuideApiKeyPlaceholder: "Paste credentials",
  setupGuideContinue: "Continue",
  setupGuideOpenSettings: "Open Settings",
  setupGuideBack: "Back",
  setupGuideValidateKey: "Validate key",
  setupGuideApiKeyRequiredOrCancel:
    "Add an API key to continue, or cancel the setup guide.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Choose a provider and add an API key to continue, or cancel the setup guide.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `These ${provider} credentials do not allow reply requests.`,
  setupGuideKokoroTitle: "Add a Natural On-device Voice",
  setupGuideKokoroBody: ({ size }) =>
    `Optional: download Kokoro (about ${size} MB) for far more natural spoken replies without a speech provider or usage charges.`,
  setupGuideKokoroLanguageNote:
    "This model currently speaks English and Simplified Chinese. Configure any fallback routes you want later in Speaking settings.",
  setupGuideKokoroDownload: "Download Kokoro",
  setupGuideUseKokoro: "Use Kokoro for spoken replies",
  setupGuideUseKokoroSummary:
    "Keep synthesis on the phone whenever the reply language is supported.",
  setupGuideSkipKokoro: "Skip for now",
  setupGuideVoiceTestTitle: "Test Your Setup",
  setupGuideVoiceTestBody:
    "Say a short sentence. Mr Broccoli will test microphone access, transcription, the configured reply route, and spoken output when an acceptable voice route is available.",
  setupGuideVoiceTestNoInputBody:
    "Voice input is not available with this setup. Continue to review the detected routes, then adjust speech settings later if needed.",
  setupGuideVoiceTestTextOnlyNote:
    "This test stays text-only because no acceptable spoken voice route is ready yet.",
  setupGuideVoiceTestStart: "Start test",
  setupGuideVoiceTestStop: "Stop recording",
  setupGuideVoiceTestRetry: "Run again",
  setupGuideVoiceTestTranscribing: "Transcribing…",
  setupGuideVoiceTestThinking: "Testing reply…",
  setupGuideVoiceTestSynthesizing: "Preparing voice…",
  setupGuideVoiceTestSpeaking: "Playing reply…",
  setupGuideVoiceTestTranscript: "Transcript",
  setupGuideVoiceTestReply: "Reply",
  setupGuideVoiceTestReset: "Clear this result",
  setupGuideVoiceInputUnavailable:
    "Voice input is not available for this setup on this device.",
  setupGuideSummaryTitle: "Setup Complete",
  setupGuideSummaryBody:
    "Here is the route Mr Broccoli will use with your current configuration.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Speech to text",
  setupGuideSummaryTts: "Text to speech",
  setupGuideSummaryWebSearch: "Web search",
  setupGuideRouteProviderLlm: ({ provider }) => `Enabled via ${provider}`,
  setupGuideRouteOnDeviceStt: "Enabled via system speech recognition",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Enabled via ${provider} speech transcription`,
  setupGuideRouteProviderTts: ({ provider }) => `Enabled via ${provider} voice`,
  setupGuideRouteKokoroTts: "Enabled via Kokoro on-device voice",
  setupGuideRouteLocalTts: "Enabled via local voice pack",
  setupGuideRouteUnavailable: "Not available",
  setupGuideRouteOff: "Off",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Available via ${provider}, currently off`,
  setupGuideSummaryTextOnlyNote:
    "Spoken replies are off for now. Replies stay in text until you enable a provider or local voice.",
  setupGuideFinish: "Done",
  searchConversationsPlaceholder: "Search titles, models, and message text",
  noMatchingConversations: "No matching conversations",
  noMatchingConversationsDescription:
    "Try a different title, route, model, or phrase from the transcript.",
  memoryModalTitle: "Conversation memory",
  memoryModalDescription:
    "This is the compact summary Mr Broccoli carries forward once a thread gets long enough to compress older turns.",
  memorySummary: "Saved summary",
  memorySummaryEmpty:
    "No compact memory yet. Once this thread gets longer, older turns will be summarized here.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 summarized turn" : `${count} summarized turns`,
  copyMemory: "Copy memory",
  forgetMemory: "Forget memory",
  memoryCopied: "Memory copied.",
  memoryCleared: "Conversation memory cleared.",
  noConversationToManageYet: "No conversation memory available yet.",
  noProviderYet: "No provider yet",
  noModelYet: "No model yet",
  startedAt: "Started",
  endedAt: "Ended",
  pinned: "Pinned",
  copy: "Copy",
  share: "Share",
  rename: "Rename",
  pin: "Pin",
  unpin: "Unpin",
  save: "Save",
  cancel: "Cancel",
  stop: "Stop",
  pause: "Pause",
  resume: "Resume",
  paused: "Paused",
  listening: "Listening",
  parsing: "Transcribing",
  searching: "Searching",
  converting: "Converting",
  webSearchAction: "web search",
  thinking: "Thinking",
  speaking: "Speaking",
  pleaseWait: "Please wait",
  yourTurn: "Your turn",
  keepPressing: "Keep pressing",
  tapWhenDone: "Tap when done",
  speechPaused: "Speech is paused",
  pausePlaybackUnavailable:
    "This voice route can't be paused. Stop it or switch to provider voice output.",
  holdToSpeak: "Hold to speak",
  tapToSpeak: "Tap to speak",
  tapAgainToSend: "Tap again to send",
  waitingForReply: "Waiting for reply",
  parsingYourVoice: "Parsing your voice",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} is not configured in Settings.`,
  providerNetworkError: ({ provider, action }) =>
    `Couldn't reach ${provider} for ${action}. Check the connection and try again.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} rejected the credentials for ${action}. Check the API key and permissions.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} is rate limiting ${action} right now. Try again in a moment.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} needs sufficient API credit for ${action}. Check the account balance and the key's spending limit.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} took too long during ${action}. Try again.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} had a temporary problem during ${action}. Try again shortly.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} finished without returning a reply. Try again.`,
  providerIncompleteReplyError: ({ provider }) =>
    `${provider}'s reply ended before it was complete. Try again.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} rejected the reply because the conversation got too long. Start a fresh thread or shorten the request.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} rejected the ${action} request: ${detail}`
      : `${provider} rejected the ${action} request.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} returned a response without running web search.`,
  providerValidationSuccess: ({ provider }) => `${provider} is ready to use.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} is working.`,
  providerValidationFailed: "Provider validation failed.",
  webSearchFallback:
    "Web search was unavailable, so the reply continued without live web context.",
  noBase64EncoderAvailable: "No base64 encoder available.",
  noBase64DecoderAvailable: "No base64 decoder available.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS needs Azure Speech credentials in the format <key>|<region>, for example abc123|westeurope, or the combined Azure format <endpoint>|<api-key>|<key>|<region>.",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Native TTS does not synthesize audio files.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `No local or cloud voice route is ready for ${languageLabel}.`,
  chooseTextToSpeechProviderInSettings:
    "Choose a text-to-speech provider in Settings.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS is not supported yet.`,
  ttsError: ({ provider, status, errorText }) =>
    `${provider} TTS error (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `${provider} speech output rejected the reply because it was too long.`,
  ttsTimeout: ({ provider }) => `${provider} speech output took too long.`,
  sttTimeout: ({ provider }) =>
    `${provider} speech transcription took too long.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} only accepts recordings up to ${limit}. Use a shorter clip or switch STT models.`,
  voiceInputCaptureIncomplete:
    "Voice input could not be captured cleanly. Please try again.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS did not return audio.`,
  nativeSttHandledInApp: "System STT is handled directly in the app.",
  chooseSpeechToTextProviderInSettings:
    "Choose a speech-to-text provider in Settings.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT is not supported yet.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} is not wired up yet.`,
  you: "You",
  assistant: "Assistant",
  untitledConversation: "Untitled conversation",
  conversationExportHeader: ({ title }) => `Conversation: ${title}`,
  speechRecognitionPermissionNotGranted:
    "Speech recognition permission not granted.",
  speechRecognitionUnavailableForDeviceLanguage:
    "Speech recognition is not available for the current device language.",
  nativeSpeechRecognitionNeedsNetwork:
    "Native speech recognition needs network access right now.",
  noSpeechDetected: "No speech was detected.",
  nativeSpeechRecognitionFailed: "Native speech recognition failed.",
  couldntStartNativeSpeechRecognition:
    "Couldn't start native speech recognition.",
  microphonePermissionNotGranted: "Microphone permission not granted",
} as const satisfies Record<string, TranslationValue>;
