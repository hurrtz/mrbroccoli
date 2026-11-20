import { PROVIDER_LABELS } from "../../constants/models";
import { PipelinePhase } from "../../hooks/useVoicePipeline";
import {
  Conversation,
  Message,
  Provider,
  Settings,
  VoicePhaseProgress,
  VoiceVisualPhase,
} from "../../types";
import type { SpeechTransfer } from "../../hooks/voicePipeline/types";
import type { ReplayPhase } from "../../hooks/useVoicePipeline";
import { getOrbActivity, getStatusDisplayData } from "./statusSelectors";
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
  replyProvider?: Provider | null;
  replayPhase?: ReplayPhase;
  speechTransfer?: SpeechTransfer | null;
  phaseProgress?: VoicePhaseProgress | null;
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
  replyProvider,
  replayPhase = "idle",
  speechTransfer,
  phaseProgress,
  visualPhaseOverride = null,
}: GetMainScreenViewModelParams) {
  const providerLabel = PROVIDER_LABELS[provider];
  const waitingForPlayback =
    pipelinePhase === "speaking" ||
    (pipelinePhase === "idle" && replayPhase !== "idle");
  const runtimeVisualPhase: VoiceVisualPhase = isRecording
    ? "recording"
    : player.isActivelyPlaying || player.isPlaybackPaused
      ? "speaking"
      : waitingForPlayback
        ? "synthesizing"
        : pipelinePhase;
  const visualPhase = visualPhaseOverride ?? runtimeVisualPhase;
  const isActive = visualPhase !== "idle";
  const phaseProvider =
    phaseProgress?.phase === visualPhase ? phaseProgress.provider : undefined;
  const configuredSpeechInput =
    settings.sttMode === "provider" ? settings.sttProvider : "device";

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
    activity: getOrbActivity({
      phase: visualPhase,
      paused: player.isPlaybackPaused,
      streaming: Boolean(streamingText),
      replyProvider: replyProvider ?? phaseProvider ?? provider,
      searchProvider: phaseProvider ?? settings.webSearchProvider,
      speechInputProvider: phaseProvider === undefined
        ? configuredSpeechInput
        : phaseProvider ?? "device",
      speechOutputProvider: speechTransfer?.provider,
      speechTransfer: speechTransfer?.stage,
      t,
    }),
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
