import { useRef, useState } from "react";

import { useReplyReplayController } from "./voicePipeline/useReplyReplayController";
import { useVoiceCaptureHandler } from "./voicePipeline/useVoiceCaptureHandler";
import { useVoiceLiveActivity } from "./voicePipeline/useVoiceLiveActivity";
import type { CouncilProgress } from "../services/ulraMode";
import type { VoicePhaseProgress } from "../types";
import type {
  PipelinePhase,
  UseVoicePipelineParams,
  UseVoicePipelineResult,
} from "./voicePipeline/types";

export type { PipelinePhase, ReplayPhase } from "./voicePipeline/types";
export type { CouncilProgress } from "../services/ulraMode";
export type {
  UseVoicePipelineParams,
  UseVoicePipelineResult,
  VoiceCaptureRequest,
} from "./voicePipeline/types";

export function useVoicePipeline(
  params: UseVoicePipelineParams,
): UseVoicePipelineResult {
  const [pipelinePhase, setPipelinePhase] = useState<PipelinePhase>("idle");
  const [streamingText, setStreamingText] = useState("");
  const [phaseProgress, setPhaseProgress] = useState<VoicePhaseProgress | null>(
    null,
  );
  const [councilProgress, setCouncilProgress] =
    useState<CouncilProgress | null>(null);
  const [completedReplyVersion, setCompletedReplyVersion] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const lastCompletedReplyRef = useRef("");
  const isBusy = pipelinePhase !== "idle";

  useVoiceLiveActivity({
    isRecording: params.isRecording,
    phaseProgress,
    pipelinePhase,
    spokenRepliesEnabled: params.spokenRepliesEnabled,
    t: params.t,
  });

  const {
    replayPhase,
    activeReplayMessageId,
    playReplyText,
    stopReplay,
    handleRepeatLastReply,
  } = useReplyReplayController({
    isBusy,
    isRecording: params.isRecording,
    language: params.language,
    lastCompletedReplyRef,
    player: params.player,
    selectedTtsModel: params.selectedTtsModel,
    selectedTtsVoice: params.selectedTtsVoice,
    localTtsModelId: params.localTtsModelId,
    kokoroVoices: params.kokoroVoices,
    ttsFallbackRoutes: params.ttsFallbackRoutes,
    ttsInstructions: params.ttsInstructions,
    showToast: params.showToast,
    t: params.t,
    ttsApiKey: params.ttsApiKey,
    ttsListenLanguages: params.ttsListenLanguages,
    ttsMode: params.ttsMode,
    spokenRepliesEnabled: params.spokenRepliesEnabled,
    ttsProvider: params.ttsProvider,
  });

  const { handleVoiceCaptureDone } = useVoiceCaptureHandler({
    ...params,
    abortRef,
    handleRepeatLastReply,
    lastCompletedReplyRef,
    onReplyCompleted: () => setCompletedReplyVersion((version) => version + 1),
    setCouncilProgress,
    setPhaseProgress,
    setPipelinePhase,
    setStreamingText,
  });

  return {
    councilProgress,
    pipelinePhase,
    setPipelinePhase,
    streamingText,
    setStreamingText,
    phaseProgress,
    completedReplyVersion,
    abortRef,
    lastCompletedReplyRef,
    replayPhase,
    activeReplayMessageId,
    playReplyText,
    handleRepeatLastReply,
    stopReplay,
    handleVoiceCaptureDone,
  };
}
