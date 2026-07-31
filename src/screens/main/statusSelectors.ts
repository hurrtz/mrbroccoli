import { PipelinePhase } from "../../hooks/useVoicePipeline";
import { InputMode, VoiceVisualPhase } from "../../types";

import { TranslateFn } from "./shared";

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
