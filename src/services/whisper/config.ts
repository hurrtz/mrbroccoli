import type { Provider } from "../../types";
import {
  RUNTIME_PROVIDER_MANIFEST,
  RuntimeSttTransport,
} from "../../constants/providers/runtimeManifest";

export type MultipartTranscriptionConfig = {
  kind: "multipart";
  endpoint: string;
  defaultModel: string;
};

export type OpenAiAudioInputTranscriptionConfig = {
  kind: "openai-audio-input";
  endpoint: string;
  defaultModel: string;
};

export type BytedanceBigmodelFlashTranscriptionConfig = {
  kind: "bytedance-bigmodel-flash";
  endpoint: string;
  defaultModel: string;
};

export type GoogleCloudSpeechV2TranscriptionConfig = {
  kind: "google-cloud-speech-v2";
  defaultModel: string;
};

export type GoogleSpeechTranscriptionConfig = {
  kind: "google-speech";
  endpointBase: string;
  defaultModel: string;
  cloudDefaultModel: string;
};

export type XaiRestSttTranscriptionConfig = {
  kind: "xai-stt-rest";
  endpoint: string;
  defaultModel: string;
};

export type ProviderSttConfig =
  | MultipartTranscriptionConfig
  | OpenAiAudioInputTranscriptionConfig
  | BytedanceBigmodelFlashTranscriptionConfig
  | GoogleSpeechTranscriptionConfig
  | GoogleCloudSpeechV2TranscriptionConfig
  | XaiRestSttTranscriptionConfig;

export const STT_TIMEOUT_MS = 60000;
export const OPENAI_STT_TIMEOUT_MS = 45000;

export function getProviderSttTimeoutMs(provider: Provider) {
  switch (provider) {
    case "openai":
      return OPENAI_STT_TIMEOUT_MS;
    default:
      return STT_TIMEOUT_MS;
  }
}

function buildConfigForTransport(params: {
  provider: Provider;
  transport: RuntimeSttTransport;
  endpoint?: string;
  endpointBase?: string;
  defaultModel: string;
}): ProviderSttConfig | null {
  switch (params.transport) {
    case "multipart":
      return params.endpoint
        ? {
            kind: "multipart",
            endpoint: params.endpoint,
            defaultModel: params.defaultModel,
          }
        : null;
    case "bytedance-bigmodel-flash":
      return params.endpoint
        ? {
            kind: "bytedance-bigmodel-flash",
            endpoint: params.endpoint,
            defaultModel: params.defaultModel,
          }
        : null;
    case "google-cloud-speech-v2":
      return {
        kind: "google-cloud-speech-v2",
        defaultModel: params.defaultModel,
      };
    case "google-speech":
      return params.endpointBase
        ? {
            kind: "google-speech",
            endpointBase: params.endpointBase,
            defaultModel: params.defaultModel,
            cloudDefaultModel: "chirp_3",
          }
        : null;
    case "openai-audio-input":
      return params.endpoint
        ? {
            kind: "openai-audio-input",
            endpoint: params.endpoint,
            defaultModel: params.defaultModel,
          }
        : null;
    case "xai-stt-rest":
      return params.endpoint
        ? {
            kind: "xai-stt-rest",
            endpoint: params.endpoint,
            defaultModel: params.defaultModel,
          }
        : null;
    default:
      return null;
  }
}

export function getProviderSttConfig(
  provider: Provider,
  model: string,
): ProviderSttConfig | null {
  const manifest = RUNTIME_PROVIDER_MANIFEST[provider];

  if (!manifest || manifest.stt.support !== "provider") {
    return null;
  }

  const transport = manifest.stt.transport;
  const defaultModel = manifest.stt.defaultModel ?? model;
  const endpoint = manifest.stt.endpoint;
  const endpointBase = manifest.stt.endpointBase;

  if (!defaultModel) {
    return null;
  }

  return buildConfigForTransport({
    provider,
    transport,
    endpoint,
    endpointBase,
    defaultModel,
  });
}
