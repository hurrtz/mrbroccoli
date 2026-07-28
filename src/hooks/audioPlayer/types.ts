import { type SpeechDiagnosticsContext } from "../../services/speech/diagnostics";

export type AudioQueueItem = {
  generation: number;
  id: string;
  uri: string;
  diagnostics?: SpeechDiagnosticsContext;
  onPlaybackStarted?: () => void;
};

type NativeSpeechQueueItemBase = {
  generation: number;
  id: string;
};

export type NativeSpeechQueueItem =
  | (NativeSpeechQueueItemBase & {
      kind: "speech";
      text: string;
      voice?: string;
      language?: string;
      diagnostics?: SpeechDiagnosticsContext;
      onPlaybackStarted?: () => void;
    })
  | (NativeSpeechQueueItemBase & {
      kind: "pause";
      durationMs: number;
    });

export type NativeAudioQueueContext = {
  generation: number;
  uri: string;
  diagnostics?: SpeechDiagnosticsContext;
  onPlaybackStarted?: () => void;
};
