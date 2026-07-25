import { PipelinePhase } from "../../hooks/useVoicePipeline";
import { InputMode, VoiceVisualPhase } from "../../types";

import { TranslateFn } from "./shared";

export interface StatusDisplayData {
  actionLabel: string;
  statusTitle: string;
  statusDetail: string;
  messageCountLabel: string | null;
}

export function getVisualPhaseActionLabel(params: {
  driveSessionActive?: boolean;
  inputMode: InputMode;
  playbackPaused?: boolean;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
}) {
  const {
    driveSessionActive = false,
    inputMode,
    playbackPaused = false,
    t,
    visualPhase,
  } = params;

  if (inputMode === "drive-session") {
    if (visualPhase === "recording") {
      return t("tapToSendDriveTurn");
    }

    if (visualPhase !== "idle") {
      return t("tapToInterruptDriveReply");
    }

    return driveSessionActive
      ? t("continueDriveSession")
      : t("startDriveSession");
  }

  return playbackPaused && visualPhase === "speaking"
    ? t("paused")
    : visualPhase === "recording"
    ? inputMode === "toggle-to-talk"
      ? t("tapAgainToSend")
      : t("listening")
    : visualPhase === "transcribing"
      ? t("parsing")
      : visualPhase === "thinking-briefly"
        ? t("thinking")
        : visualPhase === "searching"
          ? t("webSearch")
          : visualPhase === "synthesizing"
            ? t("voiceOutput")
            : visualPhase === "thinking"
              ? t("thinking")
              : visualPhase === "speaking"
                ? t("speaking")
                : inputMode === "push-to-talk"
                  ? t("holdToSpeak")
                  : t("tapToSpeak");
}

export function getStatusDisplayData(params: {
  driveSessionActive?: boolean;
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
    driveSessionActive = false,
    inputMode,
    messageCount,
    playbackPaused = false,
    pipelinePhase,
    providerLabel,
    t,
    ttsProviderLabel,
    visualPhase,
  } = params;

  const messageCountLabel =
    messageCount > 0 ? t("messageCount", { count: messageCount }) : null;
  const actionLabel = getVisualPhaseActionLabel({
    driveSessionActive,
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
                    : inputMode === "drive-session" && driveSessionActive
                      ? t("driveSessionReady")
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
                    : inputMode === "drive-session" && driveSessionActive
                      ? t("driveSessionReadyDescription")
                      : (messageCountLabel ?? t("freshSession"));

  return {
    actionLabel,
    statusTitle,
    statusDetail,
    messageCountLabel,
  };
}
