import { useEffect, useSyncExternalStore } from "react";

import { PROVIDER_LABELS } from "../../constants/models";
import { getOpenRouterHost } from "../../constants/providers/openRouterHosts";
import type { Provider } from "../../types";
import type { TranslationKey } from "../../i18n";
import {
  getAiSharingSnapshot,
  hydrateAiSharing,
  subscribeAiSharing,
  type AiSharingPurpose,
} from "../../services/aiSharing";

export const AI_SHARING_COPY = {
  prompt: ["aiSharingPrompt", "aiSharingPromptDetail"],
  history: ["aiSharingHistory", "aiSharingHistoryDetail"],
  images: ["aiSharingImages", "aiSharingImagesDetail"],
  transcription: ["aiSharingTranscription", "aiSharingTranscriptionDetail"],
  speech: ["aiSharingSpeech", "aiSharingSpeechDetail"],
  search: ["aiSharingSearch", "aiSharingSearchDetail"],
  council: ["aiSharingCouncil", "aiSharingCouncilDetail"],
  titles: ["aiSharingTitleGeneration", "aiSharingTitleGenerationDetail"],
  knowledge: ["aiSharingKnowledge", "aiSharingKnowledgeDetail"],
} as const satisfies Record<
  AiSharingPurpose,
  readonly [TranslationKey, TranslationKey]
>;

export function getSharingRecipientName(provider: Provider, model?: string) {
  const name = PROVIDER_LABELS[provider];
  const host = provider === "openrouter" && getOpenRouterHost(model);
  return host ? `${name} (${host.label})` : name;
}

export function useAiSharingSnapshot() {
  const snapshot = useSyncExternalStore(
    subscribeAiSharing,
    getAiSharingSnapshot,
  );
  useEffect(() => {
    void hydrateAiSharing().catch(() => {
      // The request service keeps sharing blocked if local choices cannot load.
    });
  }, []);
  return snapshot;
}
