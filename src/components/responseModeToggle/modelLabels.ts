import { PROVIDER_LABELS } from "../../constants/models";
import { Provider } from "../../types";

const MODEL_FAMILY_PATTERNS: Array<{
  family: string;
  pattern: RegExp;
}> = [
  { family: "Gemini", pattern: /^Gemini\s+(.+)$/i },
  { family: "Claude", pattern: /^Claude\s+(.+)$/i },
  { family: "GPT", pattern: /^GPT[-\s]+(.+)$/i },
  { family: "Grok", pattern: /^Grok\s+(.+)$/i },
  { family: "DeepSeek", pattern: /^DeepSeek[-\s]+(.+)$/i },
  { family: "Qwen", pattern: /^Qwen[-\s]*(.+)$/i },
  { family: "Kimi", pattern: /^Kimi\s+(.+)$/i },
  { family: "Moonshot", pattern: /^Moonshot\s+(.+)$/i },
  { family: "Mistral", pattern: /^Mistral\s+(.+)$/i },
  { family: "Ministral", pattern: /^Ministral\s+(.+)$/i },
  { family: "Magistral", pattern: /^Magistral\s+(.+)$/i },
  { family: "Devstral", pattern: /^Devstral\s+(.+)$/i },
  { family: "Voxtral", pattern: /^Voxtral\s+(.+)$/i },
];

export function getResponseModeCardModelLabels(
  provider: Provider,
  modelLabel: string,
) {
  const upstreamParts = modelLabel
    .split(/\s+·\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const compactLabel = upstreamParts.at(-1) ?? modelLabel;

  for (const { family, pattern } of MODEL_FAMILY_PATTERNS) {
    const match = compactLabel.match(pattern);
    if (match?.[1]) {
      return {
        family,
        name:
          family === "Qwen" ? match[1].replace("-", " ") : match[1],
      };
    }
  }

  const [firstWord, ...remainingWords] = compactLabel.split(/\s+/);
  if (remainingWords.length > 0) {
    return {
      family: firstWord,
      name: remainingWords.join(" "),
    };
  }

  return {
    family: PROVIDER_LABELS[provider],
    name: compactLabel,
  };
}
