import {
  getResponseLengthOptions,
  getResponseToneOptions,
} from "../../features/settings-core/helpers";
import type {
  AssistantResponseLength,
  AssistantResponseTone,
} from "../../types";
import type { TranslateFn } from "./shared";

/**
 * The conversation's settings as one line of noun phrases.
 *
 * **Decision:** middots, no trailing stop, and nothing that is not set. A
 * sentence with a gap in it ("Casual ·  · Heart") reads as a bug; a shorter
 * sentence just says less.
 */
export function getConversationSettingsSummary({
  responseLength,
  responseTone,
  t,
  voiceLabel,
}: {
  responseLength?: AssistantResponseLength;
  responseTone?: AssistantResponseTone;
  t: TranslateFn;
  voiceLabel?: string | null;
}): string {
  const tone = responseTone
    ? getResponseToneOptions(t).find((option) => option.value === responseTone)
        ?.label
    : undefined;
  const length = responseLength
    ? getResponseLengthOptions(t).find(
        (option) => option.value === responseLength,
      )?.label
    : undefined;

  return [tone, length, voiceLabel?.trim() || undefined]
    .filter((part): part is string => Boolean(part))
    .join(" · ");
}
