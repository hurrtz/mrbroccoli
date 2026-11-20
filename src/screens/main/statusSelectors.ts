import { PipelinePhase } from "../../hooks/useVoicePipeline";
import type { SpeechTransferStage } from "../../services/voicePipeline/types";
import { InputMode, Provider, VoiceVisualPhase } from "../../types";

import { TranslateFn } from "./shared";

export interface OrbActivity {
  label: string;
  provider?: Provider | "device" | null;
}

export function getOrbActivity({
  phase,
  paused,
  streaming,
  replyProvider,
  searchProvider,
  speechInputProvider,
  speechOutputProvider,
  speechTransfer,
  t,
}: {
  phase: VoiceVisualPhase;
  paused: boolean;
  streaming: boolean;
  replyProvider: Provider;
  searchProvider?: Provider | null;
  speechInputProvider?: OrbActivity["provider"];
  speechOutputProvider?: Provider | null;
  speechTransfer?: SpeechTransferStage | null;
  t: TranslateFn;
}): OrbActivity {
  switch (phase) {
    case "recording":
      return { label: t("orbRecording") };
    case "transcribing":
      return { label: t("orbTranscribing"), provider: speechInputProvider };
    case "searching":
      return { label: t("orbSearching"), provider: searchProvider };
    case "thinking-briefly":
      return { label: t("orbReceivingPrompt"), provider: replyProvider };
    case "thinking":
      return streaming
        ? { label: t("orbAnswering"), provider: replyProvider }
        : { label: t("orbReceivingReply") };
    case "synthesizing":
      if (speechOutputProvider && speechTransfer) {
        return {
          label: t(
            speechTransfer === "sending-text" ? "orbReceivingText" : "orbSendingAudio",
          ),
          provider: speechOutputProvider,
        };
      }
      return { label: t("orbPreparingSpeech") };
    case "speaking":
      return { label: t(paused ? "orbPaused" : "orbPlaying") };
    case "idle":
      return { label: t("orbReady") };
  }
}

export interface StatusDisplayData {
  actionLabel: string;
  statusTitle: string;
  statusDetail: string;
  messageCountLabel: string | null;
}

function getVisualPhaseActionLabel(params: {
  inputMode: InputMode;
  playbackPaused?: boolean;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
}) {
  const {
    inputMode,
    playbackPaused = false,
    t,
    visualPhase,
  } = params;

  if (visualPhase === "speaking") {
    return playbackPaused ? t("resume") : t("pause");
  }

  if (visualPhase === "recording") {
    return inputMode === "push-to-talk"
      ? t("keepPressing")
      : t("tapAgainToSend");
  }

  if (visualPhase !== "idle") {
    return t("stop");
  }

  return inputMode === "push-to-talk"
    ? t("holdToSpeak")
    : t("tapToSpeak");
}

export function getStatusDisplayData(params: {
  inputMode: InputMode;
  messageCount: number;
  playbackPaused?: boolean;
  pipelinePhase: PipelinePhase;
  providerLabel: string;
  t: TranslateFn;
  ttsProviderLabel: string;
  visualPhase: VoiceVisualPhase;
}): StatusDisplayData {
  const {
    inputMode,
    messageCount,
    playbackPaused = false,
    providerLabel,
    t,
    ttsProviderLabel,
    visualPhase,
  } = params;

  const messageCountLabel =
    messageCount > 0 ? t("messageCount", { count: messageCount }) : null;
  const actionLabel = getVisualPhaseActionLabel({
    inputMode,
    playbackPaused,
    t,
    visualPhase,
  });
  const statusTitle =
    playbackPaused && visualPhase === "speaking"
      ? t("paused")
      : visualPhase === "recording"
        ? t("listening")
        : visualPhase === "searching"
          ? t("webSearch")
          : visualPhase === "speaking"
            ? t("speaking")
            : visualPhase === "synthesizing"
              ? t("voiceOutput")
              : visualPhase === "transcribing"
                ? t("parsing")
                : visualPhase === "thinking-briefly"
                  ? t("thinking")
                  : visualPhase === "thinking"
                    ? t("thinking")
                    : t("idle");
  const statusDetail =
    playbackPaused && visualPhase === "speaking"
      ? t("speechPaused")
      : visualPhase === "recording"
        ? t("listeningToYourVoice")
        : visualPhase === "searching"
          ? t("searchingTheWeb")
          : visualPhase === "speaking"
            ? t("speakingBackToYou")
            : visualPhase === "synthesizing"
              ? t("preparingVoiceWithProvider", {
                  provider: ttsProviderLabel,
                })
              : visualPhase === "transcribing"
                ? t("parsingYourVoiceInput")
                : visualPhase === "thinking-briefly"
                  ? t("preparingRequest")
                  : visualPhase === "thinking"
                    ? t("waitingForProvider", { provider: providerLabel })
                    : (messageCountLabel ?? t("freshSession"));

  return {
    actionLabel,
    statusTitle,
    statusDetail,
    messageCountLabel,
  };
}
