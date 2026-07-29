import * as FileSystem from "expo-file-system/legacy";
import { getCatalogConstraintsForAppProvider } from "../catalog/appProviders";
import { getStrictestCatalogMaxConstraint } from "../catalog";
import { PROVIDER_LABELS, getSttModelLabel } from "../constants/models";
import { translate } from "../i18n";
import { AppLanguage, Provider, SttBackendMode } from "../types";
import type { SttLanguage } from "../types";
import { providerSupportsSttLanguage } from "../constants/providerSpeechLanguages";
import { getTtsListenLanguageLabel } from "../constants/localTts";
import {
  parseQwenApiCredential,
  qwenRegionSupportsAppSpeech,
  resolveQwenApiEndpoint,
} from "../utils/qwenRegion";
import { getProviderSttConfig } from "./whisper/config";
import { createSttRecordingTooLargeError } from "./whisper/errors";
import { waitForRecordedFileReady } from "./whisper/recordedFileReady";
import {
  transcribeWithBytedanceBigmodelFlashProvider,
  transcribeWithGoogleCloudSpeechV2Provider,
  transcribeWithGoogleSpeechProvider,
  transcribeWithMultipartProvider,
  transcribeWithOpenAiAudioInputProvider,
  transcribeWithXaiRestSttProvider,
} from "./whisper/providers";
import { getProviderModelCandidates } from "./providerModelCandidates";
import { executeProviderModelRequest } from "./providerResilience";

function isRemoteAudioSource(fileUri: string) {
  return /^(https?:\/\/|oss:\/\/)/i.test(fileUri);
}

async function assertSttUploadFitsCatalogLimits(params: {
  fileUri: string;
  provider: Provider;
  modelId: string;
  language: AppLanguage;
  speechLanguage?: SttLanguage;
}) {
  const constraints = getCatalogConstraintsForAppProvider(
    params.provider,
    params.modelId,
    "stt",
  );
  const fileSizeLimit = getStrictestCatalogMaxConstraint(
    constraints,
    "file_size_bytes",
  );

  if (!fileSizeLimit) {
    return;
  }

  const info = await FileSystem.getInfoAsync(params.fileUri);
  const size =
    "size" in info && typeof info.size === "number" ? info.size : null;

  if (!info.exists || size === null || size <= fileSizeLimit.value) {
    return;
  }

  throw createSttRecordingTooLargeError({
    provider: params.provider,
    model: getSttModelLabel(params.provider, params.modelId),
    maxBytes: fileSizeLimit.value,
    language: params.language,
  });
}

export async function transcribeAudio(params: {
  fileUri: string;
  mode: SttBackendMode;
  provider?: Provider | null;
  providerModel?: string;
  apiKey?: string;
  language: AppLanguage;
  speechLanguage?: SttLanguage;
  abortSignal?: AbortSignal;
  onModelResolved?: (model: string) => void;
}): Promise<string | null> {
  const {
    fileUri,
    mode,
    provider,
    providerModel,
    apiKey,
    language,
    speechLanguage = "auto",
    abortSignal,
    onModelResolved,
  } = params;

  if (mode === "native") {
    throw new Error(translate(language, "nativeSttHandledInApp"));
  }

  if (!provider) {
    throw new Error(
      translate(language, "chooseSpeechToTextProviderInSettings"),
    );
  }

  if (
    speechLanguage !== "auto" &&
    !providerSupportsSttLanguage(provider, speechLanguage)
  ) {
    throw new Error(
      translate(language, "speechLanguageUnsupportedByProvider", {
        provider: PROVIDER_LABELS[provider],
        language: getTtsListenLanguageLabel(speechLanguage, language),
      }),
    );
  }

  const remoteAudioSource = isRemoteAudioSource(fileUri);

  if (!remoteAudioSource) {
    await waitForRecordedFileReady(fileUri, language, abortSignal);
  }

  const candidateModels = getProviderModelCandidates({
    capability: "stt",
    provider,
    requestedModel: providerModel,
  });
  const result = await executeProviderModelRequest({
    abortSignal,
    candidateModels,
    capability: "stt",
    provider,
    request: async (resolvedModel) => {
      let config = getProviderSttConfig(provider, resolvedModel);

      if (!config) {
        throw new Error(
          translate(language, "sttNotSupportedYet", {
            provider: PROVIDER_LABELS[provider],
          }),
        );
      }

      if (provider === "alibaba-qwen-dashscope") {
        const region = parseQwenApiCredential(apiKey ?? "").region;

        if (!qwenRegionSupportsAppSpeech(region)) {
          throw new Error(translate(language, "qwenSpeechUnavailableInUs"));
        }

        if ("endpoint" in config) {
          config = {
            ...config,
            endpoint: resolveQwenApiEndpoint(config.endpoint, apiKey ?? ""),
          };
        }
      }

      if (!remoteAudioSource) {
        await assertSttUploadFitsCatalogLimits({
          fileUri,
          provider,
          modelId: resolvedModel,
          language,
        });
      }

      if (config.kind === "openai-audio-input") {
        return transcribeWithOpenAiAudioInputProvider({
          abortSignal,
          apiKey,
          config,
          fileUri,
          language,
          speechLanguage,
          provider,
          providerModel: resolvedModel,
        });
      }

      if (config.kind === "bytedance-bigmodel-flash") {
        return transcribeWithBytedanceBigmodelFlashProvider({
          abortSignal,
          apiKey,
          config,
          fileUri,
          language,
          speechLanguage,
          provider,
          providerModel: resolvedModel,
        });
      }

      if (config.kind === "google-cloud-speech-v2") {
        return transcribeWithGoogleCloudSpeechV2Provider({
          abortSignal,
          apiKey,
          config,
          fileUri,
          language,
          speechLanguage,
          provider,
          providerModel: resolvedModel,
        });
      }

      if (config.kind === "google-speech") {
        return transcribeWithGoogleSpeechProvider({
          abortSignal,
          apiKey,
          config,
          fileUri,
          language,
          speechLanguage,
          provider,
          providerModel: resolvedModel,
        });
      }

      if (config.kind === "xai-stt-rest") {
        return transcribeWithXaiRestSttProvider({
          abortSignal,
          apiKey,
          config,
          fileUri,
          language,
          speechLanguage,
          provider,
          providerModel: resolvedModel,
        });
      }

      return transcribeWithMultipartProvider({
        abortSignal,
        apiKey,
        config,
        fileUri,
        language,
        speechLanguage,
        provider,
        providerModel: resolvedModel,
      });
    },
  });

  onModelResolved?.(result.actualModel);
  return result.value;
}
