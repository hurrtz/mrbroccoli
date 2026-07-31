import type {
  SpeechLanguage,
  TtsBackendMode,
} from "../../../types";
import type {
  SpeechDiagnosticSource,
  SpeechDiagnosticsContext,
} from "../../speech/diagnostics";
import type { RunVoicePipelineParams } from "../types";

export interface CreateVoicePipelineTtsQueueParams {
  turnId?: string;
  abortSignal?: AbortSignal;
  callbacks: RunVoicePipelineParams["callbacks"];
  diagnosticsSource?: SpeechDiagnosticSource;
  language: RunVoicePipelineParams["language"];
  replyPlayback: RunVoicePipelineParams["replyPlayback"];
  spokenRepliesEnabled?: RunVoicePipelineParams["spokenRepliesEnabled"];
  ttsApiKey?: string;
  kokoroVoices?: RunVoicePipelineParams["kokoroVoices"];
  ttsFallbackRoutes?: RunVoicePipelineParams["ttsFallbackRoutes"];
  ttsListenLanguages?: RunVoicePipelineParams["ttsListenLanguages"];
  ttsMode: RunVoicePipelineParams["ttsMode"];
  ttsModel?: string;
  ttsProvider?: RunVoicePipelineParams["ttsProvider"];
  ttsVoice: string;
  ttsInstructions?: string;
}

export type AudioDiagnostics = NonNullable<
  Parameters<RunVoicePipelineParams["callbacks"]["onAudioReady"]>[1]
>;

export type TtsSynthesisResult =
  | {
      kind: "audio";
      route: "kokoro" | "provider";
      audio: string;
      diagnostics: AudioDiagnostics;
    }
  | {
      kind: "native";
      route: "native";
      diagnostics: SpeechDiagnosticsContext;
      voice?: string;
    };

export type RouteAttemptResult =
  | { kind: "success"; result: TtsSynthesisResult }
  | { kind: "error"; error: Error };

export type TtsChunkContext = {
  previousText?: string;
  nextText?: string;
};

export type DiagnosticsForRoute = (
  route: TtsBackendMode,
  text: string,
  speechLanguage: SpeechLanguage,
) => SpeechDiagnosticsContext;
