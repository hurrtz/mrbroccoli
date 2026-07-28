import { MutableRefObject } from "react";

import { PipelinePhase } from "../../../hooks/useVoicePipeline";
import type { ReplayPhase } from "../../../hooks/useVoicePipeline";
import { Provider, Settings } from "../../../types";
import type { SpeechDiagnosticsContext } from "../../../services/speech/diagnostics";

import { ShowToastFn, TranslateFn } from "../shared";

export interface AudioPlayerController {
  isActivelyPlaying?: boolean;
  isPlaybackPaused: boolean;
  isPlaying: boolean;
  enqueueAudio: (
    uri: string,
    diagnostics?: SpeechDiagnosticsContext,
  ) => void;
  pausePlayback: () => Promise<boolean>;
  resetCancellation: () => void;
  resumePlayback: () => Promise<boolean>;
  speakText: (text: string) => void;
  stopPlayback: () => Promise<void>;
  waitForDrain: () => Promise<void>;
  waitForPlaybackRouteSettle: () => Promise<void>;
}

export interface AudioRecorderController {
  clearLastError: () => void;
  ensurePermissions: () => Promise<void>;
  lastError: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
}

export interface NativeSpeechRecognizerController {
  abortRecognition: () => Promise<void>;
  clearLastError: () => void;
  ensurePermissions: () => Promise<void>;
  isAvailable: boolean;
  lastError: string | null;
  startRecognition: () => Promise<void>;
  stopRecognition: () => Promise<string | null>;
}

export interface UseVoiceSessionControllerParams {
  abortRef: MutableRefObject<AbortController | null>;
  availableSttProviders: Provider[];
  availableTtsProviders: Provider[];
  completedReplyVersion: number;
  handleVoiceCaptureDone: (params: {
    audioUri?: string;
    transcriptionOverride?: string;
  }) => Promise<void>;
  isBusy: boolean;
  isRecording: boolean;
  lastCompletedReplyRef: MutableRefObject<string>;
  mainSurfaceVisible: boolean;
  nativeStt: NativeSpeechRecognizerController;
  playReplyText: (text: string) => Promise<void>;
  player: AudioPlayerController;
  providerApiKey: string;
  providerLabel: string;
  recorder: AudioRecorderController;
  replayPhase: ReplayPhase;
  setPipelinePhase: (phase: PipelinePhase) => void;
  setStreamingText: (text: string) => void;
  settings: Pick<
    Settings,
    | "inputMode"
    | "spokenRepliesEnabled"
    | "sttMode"
    | "ttsMode"
    | "providerSttModels"
  >;
  showToast: ShowToastFn;
  sttApiKey: string;
  sttProvider: Provider | null;
  t: TranslateFn;
  ttsApiKey: string;
  ttsProvider: Provider | null;
  stopReplay: () => Promise<void>;
}
