import {
  getProviderSttModelOptions,
  getProviderTtsModelOptions,
  getProviderModelName,
  getSttModelLabel,
  getTtsModelLabel,
  getTtsVoiceLabel,
  PROVIDER_LABELS,
} from "../../constants/models";
import { PipelinePhase } from "../../hooks/useVoicePipeline";
import {
  AppLanguage,
  Conversation,
  Message,
  Provider,
  Settings,
  TtsListenLanguage,
  VoiceVisualPhase,
} from "../../types";
import { getStatusDisplayData } from "./statusSelectors";
import { TranslateFn } from "./shared";
import { getConversationUsageDisplayData } from "./usageSelectors";
import { hasProviderCredentialForCapability } from "../../utils/providerCredentials";
import { getTtsFallbackRoutes } from "../../constants/ttsFallback";

interface AudioSignalState {
  isActivelyPlaying: boolean;
  isPlaybackPaused: boolean;
  isPlaying: boolean;
}

interface GetMainScreenViewModelParams {
  activeConversation: Conversation | null;
  availableTtsProviders: Provider[];
  isRecording: boolean;
  language: AppLanguage;
  model: string;
  pipelinePhase: PipelinePhase;
  player: AudioSignalState;
  provider: Provider;
  selectedSttModel: string;
  selectedTtsModel: string;
  selectedTtsVoice: string;
  settings: Settings;
  streamingText: string;
  sttProvider: Provider | null;
  t: TranslateFn;
  ttsApiKey: string;
  ttsProvider: Provider | null;
}

export function getMainScreenViewModel({
  activeConversation,
  availableTtsProviders,
  isRecording,
  language,
  model,
  pipelinePhase,
  player,
  provider,
  selectedSttModel,
  selectedTtsModel,
  selectedTtsVoice,
  settings,
  streamingText,
  sttProvider,
  t,
  ttsApiKey,
  ttsProvider,
}: GetMainScreenViewModelParams) {
  const providerLabel = PROVIDER_LABELS[provider];
  const modelLabel = getProviderModelName(provider, model);
  const routeModelLabel = hasProviderCredentialForCapability(
    provider,
    settings.apiKeys[provider],
    "llm",
  )
    ? `${providerLabel} · ${modelLabel}`
    : t("noProviderYet");
  const sttStatusLabel =
    settings.sttMode === "native"
      ? t("appNative")
      : sttProvider
        ? `${PROVIDER_LABELS[sttProvider]}${
            getProviderSttModelOptions(sttProvider).length > 1 &&
            selectedSttModel
              ? ` · ${getSttModelLabel(sttProvider, selectedSttModel)}`
              : ""
          }`
        : t("noProviderYet");

  const ttsStatusLabel =
    !settings.spokenRepliesEnabled
      ? t("spokenRepliesOff")
      : settings.ttsMode === "native"
        ? t("systemVoice")
        : settings.ttsMode === "kokoro"
          ? `Kokoro · ${settings.kokoroVoices.en}`
        : ttsProvider
          ? `${PROVIDER_LABELS[ttsProvider]}${
              getProviderTtsModelOptions(ttsProvider).length > 1 &&
              selectedTtsModel
                ? ` · ${getTtsModelLabel(ttsProvider, selectedTtsModel)}`
                : ""
            } · ${getTtsVoiceLabel(ttsProvider, selectedTtsVoice, language)}`
          : t("noTtsProvider");

  const fallbackTtsRoutes = getTtsFallbackRoutes(
    settings.ttsFallbackPolicy,
    settings.ttsMode,
  );
  const fallbackTtsStatusLabel =
    !settings.spokenRepliesEnabled || fallbackTtsRoutes.length === 0
      ? null
      : fallbackTtsRoutes
          .map((route) =>
            route === "kokoro"
              ? "Kokoro"
              : route === "provider"
                ? ttsProvider
                  ? PROVIDER_LABELS[ttsProvider]
                  : t("provider")
                : t("systemVoice"),
          )
          .join(" → ");

  const visualPhase: VoiceVisualPhase = isRecording
    ? "recording"
    : pipelinePhase === "transcribing"
      ? "transcribing"
      : pipelinePhase === "thinking-briefly"
        ? "thinking-briefly"
        : pipelinePhase === "searching"
          ? "searching"
          : player.isActivelyPlaying ||
              (player.isPlaybackPaused && pipelinePhase === "speaking")
            ? "speaking"
            : pipelinePhase === "speaking"
              ? "synthesizing"
              : pipelinePhase === "synthesizing"
                ? "synthesizing"
                : pipelinePhase === "thinking"
                  ? "thinking"
                  : "idle";
  const isActive = visualPhase !== "idle";

  const baseMessages = activeConversation?.messages || [];
  const lastAssistantReply =
    [...baseMessages]
      .reverse()
      .find((message) => message.role === "assistant" && message.content.trim())
      ?.content.trim() || "";
  const messages: Message[] = streamingText
    ? [
        ...baseMessages,
        {
          id: "streaming",
          role: "assistant",
          content: streamingText,
          model,
          provider,
          timestamp: new Date().toISOString(),
        },
      ]
    : baseMessages;

  const statusDisplay = getStatusDisplayData({
    inputMode: settings.inputMode,
    messageCount: messages.length,
    playbackPaused: player.isPlaybackPaused,
    pipelinePhase,
    providerLabel,
    t,
    ttsProviderLabel: ttsProvider ? PROVIDER_LABELS[ttsProvider] : providerLabel,
    visualPhase,
  });

  return {
    activeConversationTitle:
      activeConversation?.title.trim() || t("untitledConversation"),
    fallbackTtsStatusLabel,
    isActive,
    lastAssistantReply,
    messages,
    routeModelLabel,
    statusDisplay,
    sttStatusLabel,
    ttsStatusLabel,
    usageDisplay: getConversationUsageDisplayData({
      conversation: activeConversation,
      showUsageStats: settings.showUsageStats,
      t,
    }),
    visualPhase,
  };
}
