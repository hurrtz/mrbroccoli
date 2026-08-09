import React from "react";
import { ProviderIcon, Text, View, darkColors, textStyles } from "mrbroccoli";

// The nine official brand marks are the deliberate exception to the
// PhosphorIcon rule (AGENTS.md). An unknown provider id falls back to a
// two-letter monogram rather than rendering nothing, so that path is worth a
// cell of its own.

// Brand marks are drawn in the theme's foreground colour, so they need the app
// canvas behind them rather than the white preview page.
const Grid = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 20,
      alignItems: "center",
    }}
  >
    {children}
  </View>
);

const Cell = ({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption: string;
}) => (
  <View style={{ alignItems: "center", gap: 6, minWidth: 72 }}>
    {children}
    <Text style={{ ...textStyles.caption, color: darkColors.textSecondary }}>
      {caption}
    </Text>
  </View>
);

const PROVIDERS: [string, string][] = [
  ["openai", "OpenAI"],
  ["anthropic", "Anthropic"],
  ["gemini", "Gemini"],
  ["openrouter", "OpenRouter"],
  ["xai", "xAI"],
  ["mistral", "Mistral"],
  ["deepseek", "DeepSeek"],
  ["alibaba-qwen-dashscope", "Qwen"],
  ["elevenlabs", "ElevenLabs"],
];

export const AllProviders = () => (
  <Grid>
    {PROVIDERS.map(([provider, label]) => (
      <Cell key={provider} caption={label}>
        <ProviderIcon
          provider={provider}
          label={label}
          color={darkColors.text}
        />
      </Cell>
    ))}
  </Grid>
);

export const Sizes = () => (
  <Grid>
    <Cell caption="compact">
      <ProviderIcon provider="anthropic" size="compact" color={darkColors.text} />
    </Cell>
    <Cell caption="control">
      <ProviderIcon provider="anthropic" size="control" color={darkColors.text} />
    </Cell>
    <Cell caption="navigation">
      <ProviderIcon
        provider="anthropic"
        size="navigation"
        color={darkColors.text}
      />
    </Cell>
    <Cell caption="feature">
      <ProviderIcon provider="anthropic" size="feature" color={darkColors.text} />
    </Cell>
  </Grid>
);

export const UnknownProviderFallback = () => (
  <Grid>
    <Cell caption="Local Model">
      <ProviderIcon
        provider="on-device-kokoro"
        label="Local Model"
        color={darkColors.accent}
      />
    </Cell>
    <Cell caption="unmapped id">
      <ProviderIcon provider="future-provider" color={darkColors.textMuted} />
    </Cell>
  </Grid>
);
