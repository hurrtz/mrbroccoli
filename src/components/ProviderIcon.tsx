import React from "react";
import { Text } from "react-native";
import type { SvgProps } from "react-native-svg";
import AlibabaQwenIcon from "../../assets/providers/alibaba-qwen-dashscope.svg";
import AnthropicIcon from "../../assets/providers/anthropic.svg";
import DeepSeekIcon from "../../assets/providers/deepseek.svg";
import ElevenLabsIcon from "../../assets/providers/elevenlabs.svg";
import GoogleIcon from "../../assets/providers/google-vertex-ai-studio.svg";
import MistralIcon from "../../assets/providers/mistral-ai.svg";
import OpenAIIcon from "../../assets/providers/openai.svg";
import OpenRouterIcon from "../../assets/providers/openrouter.svg";
import XaiIcon from "../../assets/providers/xai.svg";
import {
  resolveAntIconSize,
  type AntIconSize,
} from "../design-system/AntIcon";
import { Provider } from "../types";

const PROVIDER_ICON_COMPONENTS: Record<
  string,
  React.ComponentType<SvgProps>
> = {
  "alibaba-qwen-dashscope": AlibabaQwenIcon,
  anthropic: AnthropicIcon,
  deepseek: DeepSeekIcon,
  elevenlabs: ElevenLabsIcon,
  gemini: GoogleIcon,
  "google-vertex-ai-studio": GoogleIcon,
  mistral: MistralIcon,
  "mistral-ai": MistralIcon,
  openai: OpenAIIcon,
  openrouter: OpenRouterIcon,
  xai: XaiIcon,
};

const PROVIDER_ICON_SIZES: Record<string, { width: number; height: number }> = {
  openai: { width: 24, height: 24 },
  openrouter: { width: 27, height: 20 },
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
  size?: AntIconSize;
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
  const targetSize = resolveAntIconSize(requestedSize ?? "navigation");

  if (!Icon) {
    return (
      <Text
        style={{
          color,
          fontSize: Math.max(12, targetSize / 2),
          fontWeight: "700",
          letterSpacing: 0.8,
        }}
      >
        {getFallbackProviderGlyph(label ?? provider)}
      </Text>
    );
  }

  const sourceSize = PROVIDER_ICON_SIZES[provider] ?? {
    width: 24,
    height: 24,
  };
  const scale = targetSize / Math.max(sourceSize.width, sourceSize.height);
  const size = {
    width: sourceSize.width * scale,
    height: sourceSize.height * scale,
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
