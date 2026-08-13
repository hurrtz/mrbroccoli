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
  VoiceVisualPhase,
} from "../../types";
import { getStatusDisplayData } from "./statusSelectors";
import { TranslateFn } from "./shared";
import { getConversationUsageDisplayData } from "./usageSelectors";
import { hasProviderCredentialForCapability } from "../../utils/providerCredentials";
import { getTtsFallbackRoutes } from "../../constants/ttsFallback";
import { getLocalModel } from "../../constants/localModels";
import { getResponseModeRoute } from "../../utils/responseModes";

interface AudioSignalState {
  isActivelyPlaying: boolean;
  isPlaybackPaused: boolean;
  isPlaying: boolean;
}

interface GetMainScreenViewModelParams {
  activeConversation: Conversation | null;
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
  ttsProvider: Provider | null;
  visualPhaseOverride?: VoiceVisualPhase | null;
}

export function formatRelativeAge(
  timestamp: string | null | undefined,
  language: AppLanguage,
  nowMs = Date.now(),
): string | null {
  if (!timestamp) {
    return null;
  }

  const timestampMs = Date.parse(timestamp);
  if (!Number.isFinite(timestampMs)) {
    return null;
  }

  const deltaSeconds = (timestampMs - nowMs) / 1_000;
  const absoluteSeconds = Math.abs(deltaSeconds);
  const [divisor, unit]: [number, Intl.RelativeTimeFormatUnit] =
    absoluteSeconds < 60
      ? [1, "second"]
      : absoluteSeconds < 60 * 60
        ? [60, "minute"]
        : absoluteSeconds < 24 * 60 * 60
          ? [60 * 60, "hour"]
          : absoluteSeconds < 7 * 24 * 60 * 60
            ? [24 * 60 * 60, "day"]
            : absoluteSeconds < 35 * 24 * 60 * 60
              ? [7 * 24 * 60 * 60, "week"]
              : absoluteSeconds < 365 * 24 * 60 * 60
                ? [30 * 24 * 60 * 60, "month"]
                : [365 * 24 * 60 * 60, "year"];

  if (typeof Intl.RelativeTimeFormat === "function") {
    return new Intl.RelativeTimeFormat(language, {
      numeric: "auto",
      style: "short",
    }).format(Math.round(deltaSeconds / divisor), unit);
  }

  const date = new Date(timestampMs);
  const now = new Date(nowMs);
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const isSameYear = date.getFullYear() === now.getFullYear();

  try {
    return new Intl.DateTimeFormat(
      language,
      isSameDay
        ? { hour: "numeric", minute: "2-digit" }
        : {
            day: "numeric",
            month: "short",
            ...(isSameYear ? {} : { year: "numeric" as const }),
          },
    ).format(date);
  } catch {
    return date.toISOString().slice(0, 16).replace("T", " ");
  }
}

export function getMainScreenViewModel({
  activeConversation,
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
  ttsProvider,
  visualPhaseOverride = null,
}: GetMainScreenViewModelParams) {
  const responseRoute = getResponseModeRoute(settings);
  const localLlmModel =
    responseRoute.runtime === "local" && responseRoute.localModelId
      ? getLocalModel(responseRoute.localModelId)
      : null;
  const providerLabel = localLlmModel
    ? t("settingsOnDevice")
    : PROVIDER_LABELS[provider];
  const modelLabel =
    localLlmModel?.name ?? getProviderModelName(provider, model);
  const routeModelLabel = localLlmModel
    ? `${providerLabel} · ${modelLabel}`
    : hasProviderCredentialForCapability(
          provider,
          settings.apiKeys[provider],
          "llm",
        )
      ? `${providerLabel} · ${modelLabel}`
      : t("noProviderYet");
  const sttStatusLabel =
    settings.sttMode === "native"
      ? t("appNative")
      : settings.sttMode === "local"
        ? settings.localSttModelId
          ? `${t("settingsOnDevice")} · ${getLocalModel(settings.localSttModelId).name}`
          : t("noProviderYet")
        : sttProvider
          ? `${PROVIDER_LABELS[sttProvider]}${
              getProviderSttModelOptions(sttProvider).length > 1 &&
              selectedSttModel
                ? ` · ${getSttModelLabel(sttProvider, selectedSttModel)}`
                : ""
            }`
          : t("noProviderYet");

  const ttsStatusLabel = !settings.spokenRepliesEnabled
    ? t("spokenRepliesOff")
    : settings.ttsMode === "native"
      ? t("systemVoice")
      : settings.ttsMode === "kokoro"
        ? `Kokoro · ${settings.kokoroVoices.en}`
        : settings.ttsMode === "local"
          ? settings.localTtsModelId
            ? `${t("settingsOnDevice")} · ${getLocalModel(settings.localTtsModelId).name}`
            : t("noTtsProvider")
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

  const runtimeVisualPhase: VoiceVisualPhase = isRecording
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
  const visualPhase = visualPhaseOverride ?? runtimeVisualPhase;
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
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant" && message.content.trim());
  const lastAssistantAge = formatRelativeAge(
    lastAssistantMessage?.timestamp,
    language,
  );
  const lastAssistantModel =
    lastAssistantMessage?.provider && lastAssistantMessage.model
      ? getProviderModelName(
          lastAssistantMessage.provider,
          lastAssistantMessage.model,
        )
      : null;
  const transcriptHandleMeta = [lastAssistantModel, lastAssistantAge]
    .filter(Boolean)
    .join(" · ");
  const conversationAge = formatRelativeAge(
    activeConversation?.updatedAt,
    language,
  );
  const activeConversationTitle =
    activeConversation?.title.trim() || t("untitledConversation");

  const statusDisplay = getStatusDisplayData({
    inputMode: settings.inputMode,
    messageCount: messages.length,
    playbackPaused: player.isPlaybackPaused,
    pipelinePhase,
    providerLabel,
    t,
    ttsProviderLabel: ttsProvider
      ? PROVIDER_LABELS[ttsProvider]
      : providerLabel,
    visualPhase,
  });

  return {
    activeConversationTitle,
    conversationStatusDetail: conversationAge
      ? `${activeConversationTitle} · ${conversationAge}`
      : activeConversationTitle,
    fallbackTtsStatusLabel,
    isActive,
    lastAssistantReply,
    messages,
    routeModelLabel,
    statusDisplay,
    sttStatusLabel,
    ttsStatusLabel,
    transcriptHandleMeta: transcriptHandleMeta || null,
    usageDisplay: getConversationUsageDisplayData({
      conversation: activeConversation,
      showUsageStats: settings.showUsageStats,
      t,
    }),
    visualPhase,
  };
}
