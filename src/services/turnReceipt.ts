import type {
  AppLanguage,
  MessageTurnReceipt,
  Provider,
  SttBackendMode,
  TtsBackendMode,
} from "../types";
import type {
  WebSearchMode,
  WebSearchProvider,
} from "../constants/webSearch";
import {
  getModelEffortConfig,
  getModelEffortOptionLabel,
  getModelEffortTransportParam,
  getModelEffortTransportValue,
} from "../utils/modelEffort";

const EFFORT_TRANSPORT_PARAMETERS: Record<string, string> = {
  "anthropic-output-effort": "output_config.effort",
  "deepseek-thinking-effort": "reasoning_effort",
  "gemini-thinking-budget":
    "generationConfig.thinkingConfig.thinkingBudget",
  "gemini-thinking-level":
    "generationConfig.thinkingConfig.thinkingLevel",
  "qwen-enable-thinking": "enable_thinking",
  "reasoning-effort": "reasoning_effort",
};

interface CreateTurnReceiptParams {
  startedAtMs: number;
  inputSource: "voice" | "text";
  sttMode: SttBackendMode;
  sttProvider?: Provider | null;
  sttModel?: string;
  provider: Provider;
  model: string;
  modelEffort?: string;
  language: AppLanguage;
  spokenRepliesEnabled: boolean;
  ttsMode: TtsBackendMode;
  ttsProvider?: Provider | null;
  ttsModel?: string;
  ttsVoice: string;
  webSearchMode: WebSearchMode;
  webSearchProvider?: WebSearchProvider | null;
}

export function createTurnReceipt({
  startedAtMs,
  inputSource,
  sttMode,
  sttProvider,
  sttModel,
  provider,
  model,
  modelEffort,
  language,
  spokenRepliesEnabled,
  ttsMode,
  ttsProvider,
  ttsModel,
  ttsVoice,
  webSearchMode,
  webSearchProvider,
}: CreateTurnReceiptParams): MessageTurnReceipt {
  const effortConfig = getModelEffortConfig(provider, model);
  const effortOption = effortConfig?.options.find(
    (option) => option.id === modelEffort,
  );
  const effortTransportKey = getModelEffortTransportParam(provider, model);
  const effortTransportValue = getModelEffortTransportValue(
    provider,
    model,
    modelEffort,
  );

  return {
    version: 1,
    startedAt: new Date(startedAtMs).toISOString(),
    input: {
      source: inputSource,
      mode: sttMode,
      provider: sttMode === "provider" ? sttProvider : null,
      model: sttMode === "provider" ? sttModel : undefined,
    },
    requestedRoute: {
      provider,
      model,
    },
    actualRoute: {
      provider,
      model,
    },
    effort:
      modelEffort && effortOption
        ? {
            selected: modelEffort,
            label: getModelEffortOptionLabel(effortOption, language),
            transportParameter: effortTransportKey
              ? EFFORT_TRANSPORT_PARAMETERS[effortTransportKey] ??
                effortTransportKey
              : undefined,
            transportValue: effortTransportValue,
            semantics: "provider-native",
          }
        : undefined,
    webSearch: {
      mode: webSearchMode,
      provider: webSearchProvider,
      requested: false,
      ready: false,
      used: false,
      fellBack: false,
      decisionReason: "not-evaluated",
    },
    speechOutput: {
      enabled: spokenRepliesEnabled,
      requestedMode: spokenRepliesEnabled ? ttsMode : "off",
      actualMode: spokenRepliesEnabled ? ttsMode : "off",
      provider:
        spokenRepliesEnabled && ttsMode === "provider" ? ttsProvider : null,
      model:
        spokenRepliesEnabled && ttsMode === "provider"
          ? ttsModel
          : undefined,
      voice: spokenRepliesEnabled ? ttsVoice : undefined,
      fellBack: false,
    },
    context: {
      existingSummaryReused: false,
      summaryUpdateRequested: false,
      summaryUpdated: false,
      fallbackUsed: false,
      messagesAvailable: 0,
      messagesSent: 0,
      messagesSummarized: 0,
    },
    timing: {},
  };
}
