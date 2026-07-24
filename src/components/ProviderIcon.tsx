import React from "react";
import { Text } from "react-native";
import type { SvgProps } from "react-native-svg";
import AlibabaQwenIcon from "../../assets/providers/alibaba-qwen-dashscope.svg";
import AnthropicIcon from "../../assets/providers/anthropic.svg";
import ByteDanceIcon from "../../assets/providers/bytedance-doubao-seed.svg";
import DeepSeekIcon from "../../assets/providers/deepseek.svg";
import ElevenLabsIcon from "../../assets/providers/elevenlabs.svg";
import GoogleIcon from "../../assets/providers/google-vertex-ai-studio.svg";
import MistralIcon from "../../assets/providers/mistral-ai.svg";
import MoonshotIcon from "../../assets/providers/moonshot-ai-kimi.svg";
import OpenAIIcon from "../../assets/providers/openai.svg";
import PerplexityIcon from "../../assets/providers/perplexity.svg";
import XaiIcon from "../../assets/providers/xai.svg";
import { Provider } from "../types";

const PROVIDER_ICON_COMPONENTS: Record<
  string,
  React.ComponentType<SvgProps>
> = {
  "alibaba-qwen-dashscope": AlibabaQwenIcon,
  anthropic: AnthropicIcon,
  "bytedance-doubao-seed": ByteDanceIcon,
  deepseek: DeepSeekIcon,
  elevenlabs: ElevenLabsIcon,
  gemini: GoogleIcon,
  "google-vertex-ai-studio": GoogleIcon,
  mistral: MistralIcon,
  "mistral-ai": MistralIcon,
  "moonshot-ai-kimi": MoonshotIcon,
  openai: OpenAIIcon,
  perplexity: PerplexityIcon,
  xai: XaiIcon,
};

const PROVIDER_ICON_SIZES: Record<string, { width: number; height: number }> = {
  openai: { width: 24, height: 24 },
  anthropic: { width: 24, height: 24 },
  gemini: { width: 24, height: 24 },
  "google-vertex-ai-studio": { width: 24, height: 24 },
  deepseek: { width: 24, height: 24 },
  elevenlabs: { width: 24, height: 24 },
  mistral: { width: 24, height: 24 },
  "mistral-ai": { width: 24, height: 24 },
  xai: { width: 24, height: 24 },
};

interface ProviderIconProps {
  provider: Provider | string;
  color: string;
  label?: string;
  size?: number;
}

function getFallbackProviderGlyph(value: string) {
  const parts = value
    .split(/[^a-zA-Z0-9]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  const normalized = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return normalized.slice(0, 2) || "AI";
}

export function ProviderIcon({
  provider,
  color,
  label,
  size: requestedSize,
}: ProviderIconProps) {
  const Icon = PROVIDER_ICON_COMPONENTS[provider];

  if (!Icon) {
    return (
      <Text
        style={{
          color,
          fontSize: 12,
          fontWeight: "700",
          letterSpacing: 0.8,
        }}
      >
        {getFallbackProviderGlyph(label ?? provider)}
      </Text>
    );
  }

  const size = requestedSize
    ? { width: requestedSize, height: requestedSize }
    : PROVIDER_ICON_SIZES[provider] ?? {
        width: 24,
        height: 24,
      };

  return (
    <Icon
      width={size.width}
      height={size.height}
      color={color}
      fill={color}
      accessible={false}
      testID={`provider-icon-${provider}`}
    />
  );
}
