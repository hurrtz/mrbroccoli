export interface ModelInfo {
  id: string;
  name: string;
  releaseDate?: string;
  effort?: ModelEffortConfig;
}

export interface ModelEffortOption {
  id: string;
  label: string;
  localizedLabels?: Partial<Record<"de", string>>;
  transportValue?: string;
}

export interface ModelEffortConfig {
  options: ModelEffortOption[];
  defaultOptionId?: string;
  transportParam:
    | "anthropic-output-effort"
    | "gemini-thinking-budget"
    | "gemini-thinking-level"
    | "deepseek-thinking-effort"
    | "qwen-enable-thinking"
    | "reasoning-effort";
}

export interface TtsVoiceOption {
  id: string;
  label: string;
}

export interface ProviderConfig {
  label: string;
  shortLabel: string;
  apiKeyPlaceholder: string;
  apiKeyHint: string;
  apiKeyUrl: string;
  sttSupport: "none" | "provider";
  ttsSupport: "none" | "provider";
  sttLanguageNote?: string;
  ttsLanguageNote?: string;
  models: ModelInfo[];
}
