import { PROVIDER_LABELS } from "../../constants/models";
import { PipelinePhase } from "../../hooks/useVoicePipeline";
import {
  Conversation,
  Message,
  Provider,
  Settings,
  VoiceVisualPhase,
} from "../../types";
import { getStatusDisplayData } from "./statusSelectors";
import { TranslateFn } from "./shared";
import { getConversationUsageDisplayData } from "./usageSelectors";

interface AudioSignalState {
  isActivelyPlaying: boolean;
  isPlaybackPaused: boolean;
  isPlaying: boolean;
}

interface GetMainScreenViewModelParams {
  activeConversation: Conversation | null;
  isRecording: boolean;
  model: string;
  pipelinePhase: PipelinePhase;
  player: AudioSignalState;
  provider: Provider;
  settings: Settings;
  streamingText: string;
  t: TranslateFn;
  ttsProvider: Provider | null;
  visualPhaseOverride?: VoiceVisualPhase | null;
}

export function getActiveCouncilModelPosition(
  completedModels: number,
  totalModels: number,
) {
  if (totalModels <= 0) {
    return 0;
  }

  return Math.min(Math.max(completedModels + 1, 1), totalModels);
}

export function getMainScreenViewModel({
  activeConversation,
  isRecording,
  model,
  pipelinePhase,
  player,
  provider,
  settings,
  streamingText,
  t,
  ttsProvider,
  visualPhaseOverride = null,
}: GetMainScreenViewModelParams) {
  const providerLabel = PROVIDER_LABELS[provider];
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
    isActive,
    lastAssistantReply,
    messages,
    statusDisplay,
    usageDisplay: getConversationUsageDisplayData({
      conversation: activeConversation,
      showUsageStats: settings.showUsageStats,
      t,
    }),
    visualPhase,
  };
}
