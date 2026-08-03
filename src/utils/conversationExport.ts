import type {
  AppLanguage,
  Conversation,
  ConversationArtifactKind,
  Message,
} from "../types";
import { getProviderLabel, getProviderModelName } from "../constants/models";
import { translate } from "../i18n";
import type { TranslationKey } from "../i18n";
export { formatConversationForAiHandoff } from "../services/conversationArchiveFormat";

function formatSpeakerLabel(message: Message, language: AppLanguage) {
  if (message.role === "user") {
    return translate(language, "you");
  }

  if (message.provider && message.model) {
    return `${getProviderLabel(message.provider)} · ${getProviderModelName(
      message.provider,
      message.model,
    )}`;
  }

  if (message.provider) {
    return getProviderLabel(message.provider);
  }

  if (message.model) {
    return message.model;
  }

  return translate(language, "assistant");
}

export function formatMessageForCopy(message: Message, language: AppLanguage) {
  const imagePlaceholder = message.attachments?.length
    ? translate(language, "conversationImagePlaceholder", {
        count: message.attachments.length,
      })
    : "";
  return [
    formatSpeakerLabel(message, language),
    imagePlaceholder,
    message.content.trim(),
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatConversationForCopy(
  conversation: Conversation,
  language: AppLanguage,
) {
  const title =
    conversation.title.trim() || translate(language, "untitledConversation");
  const body = conversation.messages
    .map((message) => formatMessageForCopy(message, language))
    .join("\n\n");
  const artifactTranslationKeys = {
    decision: "artifactDecision",
    idea: "artifactIdea",
    assumption: "artifactAssumption",
    counterargument: "artifactCounterargument",
    question: "artifactQuestion",
    hypothesis: "artifactHypothesis",
    action: "artifactAction",
  } satisfies Record<ConversationArtifactKind, TranslationKey>;
  const artifacts = conversation.artifacts?.length
    ? [
        translate(language, "savedInsights"),
        ...conversation.artifacts.map(
          (artifact) =>
            `${translate(language, artifactTranslationKeys[artifact.kind])}: ${artifact.text.trim()}`,
        ),
      ].join("\n")
    : "";

  return [
    translate(language, "conversationExportHeader", { title }),
    artifacts,
    body,
  ]
    .filter(Boolean)
    .join("\n\n");
}
