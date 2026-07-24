import type { Provider } from "../types";

import {
  fetchElevenLabsVoices,
  type ElevenLabsVoice,
} from "./elevenLabsVoices";
import { fetchMistralVoices, type MistralVoice } from "./mistralVoices";
import { fetchXaiVoices, type XaiVoice } from "./xaiVoices";

export type ProviderVoice = ElevenLabsVoice | MistralVoice | XaiVoice;
export type ProviderVoiceDirectoryStatus =
  | "idle"
  | "loading"
  | "refreshing"
  | "ready"
  | "error";

export const PROVIDER_VOICE_DIRECTORY_PROVIDERS = [
  "xai",
  "mistral",
  "elevenlabs",
] as const satisfies readonly Provider[];

export function providerHasVoiceDirectory(
  provider: Provider,
): provider is (typeof PROVIDER_VOICE_DIRECTORY_PROVIDERS)[number] {
  return PROVIDER_VOICE_DIRECTORY_PROVIDERS.includes(
    provider as (typeof PROVIDER_VOICE_DIRECTORY_PROVIDERS)[number],
  );
}

export async function fetchProviderVoices(params: {
  provider: Provider;
  apiKey: string;
  signal?: AbortSignal;
}): Promise<ProviderVoice[]> {
  switch (params.provider) {
    case "xai":
      return fetchXaiVoices(params);
    case "mistral":
      return fetchMistralVoices(params);
    case "elevenlabs":
      return fetchElevenLabsVoices(params);
    default:
      return [];
  }
}

export interface ProviderVoiceDirectoryState {
  voices: ProviderVoice[];
  status: ProviderVoiceDirectoryStatus;
  error: Error | null;
  refresh: () => Promise<ProviderVoice[]>;
}

export type ProviderVoiceDirectories = Partial<
  Record<Provider, ProviderVoiceDirectoryState>
>;
