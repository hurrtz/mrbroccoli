import { transcribeAudio } from "../whisper";

interface ResolvePipelineTranscriptionParams {
  abortSignal?: AbortSignal;
  audioUri?: string;
  language: Parameters<typeof transcribeAudio>[0]["language"];
  speechLanguage: Parameters<typeof transcribeAudio>[0]["speechLanguage"];
  sttApiKey?: string;
  sttMode: Parameters<typeof transcribeAudio>[0]["mode"];
  sttModel?: string;
  localSttModelId?: Parameters<typeof transcribeAudio>[0]["localModelId"];
  sttProvider?: Parameters<typeof transcribeAudio>[0]["provider"];
  transcriptionOverride?: string;
  onModelResolved?: (model: string) => void;
}

export async function resolvePipelineTranscription({
  abortSignal,
  audioUri,
  language,
  speechLanguage,
  sttApiKey,
  sttMode,
  sttModel,
  localSttModelId,
  sttProvider,
  transcriptionOverride,
  onModelResolved,
}: ResolvePipelineTranscriptionParams) {
  if (abortSignal?.aborted) {
    return null;
  }

  if (transcriptionOverride?.trim()) {
    return transcriptionOverride.trim();
  }

  if (!audioUri) {
    return null;
  }

  return transcribeAudio({
    fileUri: audioUri,
    mode: sttMode,
    provider: sttProvider,
    providerModel: sttModel,
    localModelId: localSttModelId,
    apiKey: sttApiKey,
    language,
    speechLanguage,
    abortSignal,
    onModelResolved,
  });
}
