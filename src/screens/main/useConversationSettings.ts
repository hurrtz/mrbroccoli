import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  AssistantResponseLength,
  AssistantResponseTone,
  Conversation,
  ConversationSettings,
  Provider,
} from "../../types";

interface UseConversationSettingsParams {
  activeConversation: Conversation | null;
  globalAssistantInstructions: string;
  globalResponseLength: AssistantResponseLength;
  globalResponseTone: AssistantResponseTone;
  globalTtsInstructions: string;
  globalTtsVoice: string;
  ttsModel: string;
  ttsProvider: Provider | null;
  updateConversationSettings: (
    partial: Partial<ConversationSettings>,
  ) => Conversation | null;
}

export function useConversationSettings({
  activeConversation,
  globalAssistantInstructions,
  globalResponseLength,
  globalResponseTone,
  globalTtsInstructions,
  globalTtsVoice,
  ttsModel,
  ttsProvider,
  updateConversationSettings,
}: UseConversationSettingsParams) {
  const [pendingSettings, setPendingSettings] =
    useState<ConversationSettings>({});

  useEffect(() => {
    setPendingSettings({});
  }, [activeConversation?.id]);

  const overrides = activeConversation?.settings ?? pendingSettings;
  const responseLength = overrides.responseLength ?? globalResponseLength;
  const responseTone = overrides.responseTone ?? globalResponseTone;
  const llmInstructions = overrides.llmInstructions ?? "";
  const ttsInstructions = overrides.ttsInstructions ?? "";
  const assistantInstructions = [
    globalAssistantInstructions.trim(),
    llmInstructions.trim(),
  ]
    .filter(Boolean)
    .join("\n\n");
  const effectiveTtsInstructions = [
    globalTtsInstructions.trim(),
    ttsInstructions.trim(),
  ]
    .filter(Boolean)
    .join("\n\n");
  const selectedTtsVoice =
    overrides.ttsVoice &&
    overrides.ttsVoice.provider === ttsProvider &&
    overrides.ttsVoice.model === ttsModel
      ? overrides.ttsVoice.voice
      : globalTtsVoice;

  const applySettings = useCallback(
    (partial: Partial<ConversationSettings>) => {
      if (activeConversation) {
        updateConversationSettings(partial);
        return;
      }

      setPendingSettings((current) => ({
        ...current,
        ...partial,
      }));
    },
    [activeConversation, updateConversationSettings],
  );

  const updateResponseSettings = useCallback(
    (
      partial:
        | { responseLength: AssistantResponseLength }
        | { responseTone: AssistantResponseTone },
    ) => {
      applySettings(partial);
    },
    [applySettings],
  );

  const updateTtsVoice = useCallback(
    (voice: string) => {
      if (!ttsProvider) {
        return;
      }

      applySettings({
        ttsVoice: {
          provider: ttsProvider,
          model: ttsModel,
          voice,
        },
      });
    },
    [applySettings, ttsModel, ttsProvider],
  );

  const updateLlmInstructions = useCallback(
    (instructions: string) => {
      applySettings({ llmInstructions: instructions });
    },
    [applySettings],
  );

  const updateTtsInstructions = useCallback(
    (instructions: string) => {
      applySettings({ ttsInstructions: instructions });
    },
    [applySettings],
  );

  const initialConversationSettings = useMemo(
    () =>
      !activeConversation && Object.keys(pendingSettings).length > 0
        ? pendingSettings
        : undefined,
    [activeConversation, pendingSettings],
  );

  return {
    assistantInstructions,
    initialConversationSettings,
    llmInstructions,
    responseLength,
    responseTone,
    selectedTtsVoice,
    ttsInstructions,
    effectiveTtsInstructions,
    updateLlmInstructions,
    updateResponseSettings,
    updateTtsInstructions,
    updateTtsVoice,
  };
}
