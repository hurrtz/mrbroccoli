import { useEffect, useMemo, useRef, useState } from "react";

import { PROVIDER_LABELS } from "../../constants/models";
import {
  AI_SHARING_COPY,
  getSharingRecipientName,
} from "../../features/settings/aiSharingPresentation";
import {
  getSystemSpeechName,
  hasUnsharedAiHistory,
  loadAiSharingHistory,
  shareAiSharingHistory,
  type AiSharingNeed,
  type AiSharingSnapshot,
} from "../../services/aiSharing";
import type { Conversation, Provider } from "../../types";
import type { ShowToastFn, TranslateFn } from "./shared";

export interface ComposerSharingNotice {
  message: string;
  action: string;
  onPress: () => void;
}

export function useAiSharingComposerNotice({
  conversation,
  council,
  hasImages,
  model,
  onOpenSettings,
  provider,
  recipients,
  blockedSystemSpeech,
  sharing,
  showToast,
  sttProvider,
  t,
}: {
  conversation: Conversation | null;
  blockedSystemSpeech?: string | null;
  council: boolean;
  hasImages: boolean;
  model: string;
  onOpenSettings: () => void;
  provider: Provider;
  recipients: readonly { provider: Provider }[];
  sharing: AiSharingSnapshot;
  showToast: ShowToastFn;
  sttProvider?: Provider | null;
  t: TranslateFn;
}) {
  const id = conversation?.id;
  const [loadedId, setLoadedId] = useState<string>();
  const busy = useRef(false);

  useEffect(() => {
    if (!id) return;
    let current = true;
    void loadAiSharingHistory(id)
      .then(() => {
        if (current) setLoadedId(id);
      })
      .catch(() => {
        if (current) setLoadedId(undefined);
      });
    return () => {
      current = false;
    };
  }, [id]);

  const blocked = (need: AiSharingNeed) =>
    sharing.permissions[need.provider]?.[need.purpose] === "denied";
  const settingsNotice = (need: AiSharingNeed): ComposerSharingNotice => ({
    message:
      need.purpose === "prompt"
        ? t("aiSharingPromptBlocked", {
            provider: PROVIDER_LABELS[need.provider],
          })
        : t("aiSharingScopeBlocked", {
            provider: PROVIDER_LABELS[need.provider],
            scope: t(AI_SHARING_COPY[need.purpose][0]),
          }),
    action: t("aiSharingOpenSettings"),
    onPress: onOpenSettings,
  });
  const required = recipients.flatMap(
    ({ provider: recipient }): AiSharingNeed[] => [
      { provider: recipient, purpose: "prompt" },
      ...(council
        ? [{ provider: recipient, purpose: "council" as const }]
        : []),
    ],
  );
  const denied = required.find(blocked);
  const deniedImage = recipients
    .map(({ provider }): AiSharingNeed => ({ provider, purpose: "images" }))
    .find(blocked);
  const blockedChat = denied ? settingsNotice(denied) : null;
  const blockedImages = deniedImage ? settingsNotice(deniedImage) : null;
  const audio = sttProvider
    ? { provider: sttProvider, purpose: "transcription" as const }
    : null;
  const unshared = useMemo(() => {
    return (
      conversation &&
      sharing.ready &&
      loadedId === conversation.id &&
      hasUnsharedAiHistory(
        conversation.id,
        conversation.messages,
        provider,
        model,
      )
    );
  }, [conversation, loadedId, model, provider, sharing]);
  let historyNotice: ComposerSharingNotice | null = null;
  if (conversation && unshared) {
    const name = getSharingRecipientName(provider, model);
    historyNotice = blocked({ provider, purpose: "history" })
      ? settingsNotice({ provider, purpose: "history" })
      : {
          message: t("aiSharingBoundaryNotice", { provider: name }),
          action: t("aiSharingShareEarlier", { provider: name }),
          onPress: () => {
            if (busy.current) return;
            busy.current = true;
            void shareAiSharingHistory(
              conversation.id,
              conversation.messages,
              provider,
              model,
            )
              .catch(() =>
                showToast(t("persistenceFailure"), undefined, "danger"),
              )
              .finally(() => {
                busy.current = false;
              });
          },
        };
  }

  return {
    blockedChat,
    blockedImages,
    blockedPrompt: blockedChat ?? (hasImages ? blockedImages : null),
    blockedAudio:
      audio && blocked(audio)
        ? settingsNotice(audio)
        : blockedSystemSpeech &&
            sharing.systemSpeech?.[blockedSystemSpeech] === "denied"
          ? {
              message: t("aiSharingScopeBlocked", {
                provider: getSystemSpeechName(blockedSystemSpeech),
                scope: t("aiSharingTranscription"),
              }),
              action: t("aiSharingOpenSettings"),
              onPress: onOpenSettings,
            }
          : null,
    historyNotice,
  };
}
