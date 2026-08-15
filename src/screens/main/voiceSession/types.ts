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
  enqueueAudio: (uri: string, diagnostics?: SpeechDiagnosticsContext) => void;
  pausePlayback: () => Promise<boolean>;
  resetCancellation: () => void;
  resumePlayback: () => Promise<boolean>;
  speakText: (text: string) => void;
  stopPlayback: () => Promise<void>;
  usesNativeAudioQueue?: boolean;
  waitForDrain: () => Promise<void>;
  waitForPlaybackRouteSettle: () => Promise<void>;
}

export interface AudioRecorderController {
  ambientInputMetering?: number | null;
  ambientMonitoring?: boolean;
  audioRoute?: string | null;
  clearLastError: () => void;
  ensurePermissions: () => Promise<void>;
  inputMetering?: number | null;
  inputMeteringSampleId?: number;
  lastError: string | null;
  startAmbientMonitoring?: () => Promise<boolean>;
  startRecording: () => Promise<void>;
  stopAmbientMonitoring?: () => Promise<boolean>;
  stopRecording: () => Promise<string | null>;
}

export interface NativeSpeechRecognizerController {
  abortRecognition: () => Promise<void>;
  clearLastError: () => void;
  ensurePermissions: () => Promise<void>;
  isAvailable: boolean;
  inputMetering?: number | null;
  inputMeteringSampleId?: number;
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
  preserveInterruptedReply?: () => void;
  player: AudioPlayerController;
  promptSubmissionBlockMessage?: string | null;
  providerApiKey: string;
  providerLabel: string;
  recorder: AudioRecorderController;
  replayPhase: ReplayPhase;
  setPipelinePhase: (phase: PipelinePhase) => void;
  setStreamingText: (text: string) => void;
  settings: Pick<
    Settings,
    | "activeResponseMode"
    | "inputMode"
    | "localSttModelId"
    | "localTtsModelId"
    | "responseModes"
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
