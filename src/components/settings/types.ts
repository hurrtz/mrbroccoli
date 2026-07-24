import React from "react";
import * as Speech from "expo-speech";
import { TextInput } from "react-native";

import type { CatalogProviderId } from "../../catalog/types";
import type { WebSearchProvider } from "../../constants/webSearch";
import type { ProviderVoiceDirectories } from "../../services/providerVoiceDirectory";
import {
  Provider,
  ResponseMode,
  ResponseModeRoute,
  Settings,
  TtsListenLanguage,
  VoicePreviewRequest,
} from "../../types";

export interface SettingsModalProps {
  visible: boolean;
  settings: Settings;
  focusProvider?: Provider;
  focusCatalogProviderId?: CatalogProviderId;
  focusTab?: SettingsTab;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onUpdateResponseModeRoute: (
    mode: ResponseMode,
    route: ResponseModeRoute,
  ) => void;
  onAddResponseMode: () => void;
  onRemoveResponseMode: (mode: ResponseMode) => void;
  onUpdateProviderSttModel: (provider: Provider, model: string) => void;
  onUpdateProviderTtsModel: (provider: Provider, model: string) => void;
  onUpdateProviderTtsVoice: (provider: Provider, voice: string) => void;
  providerVoiceDirectories: ProviderVoiceDirectories;
  onUpdateApiKey: (provider: Provider, apiKey: string) => void;
  onPreviewVoice: (
    request: VoicePreviewRequest,
    callbacks?: {
      onPlaybackStarted?: () => void;
    },
  ) => Promise<void>;
  onStopPreviewVoice: () => Promise<void>;
  onValidateProvider: (provider: Provider) => Promise<void>;
  onValidateWebSearchProvider: (
    provider: WebSearchProvider,
  ) => Promise<void>;
  onOpenSetupGuide?: () => void;
  onClose: () => void;
}

export type SettingsTab =
  | "instructions"
  | "providers"
  | "web"
  | "stt"
  | "tts"
  | "ui";

export type SettingsPage =
  | "overview"
  | "connections"
  | "thinking"
  | "listening"
  | "speaking"
  | "search"
  | "app";

export type TextInputFocusHandler = NonNullable<
  React.ComponentProps<typeof TextInput>["onFocus"]
>;

export type ProviderValidationState = {
  status: "idle" | "validating" | "success" | "error";
  message?: string;
  apiKey?: string;
  configKey?: string;
  model?: string;
};

export type ProviderHealthState =
  | "unconfigured"
  | "configured"
  | "validating"
  | "healthy"
  | "failing";

export type PreviewButtonPhase = "idle" | "generating" | "playing";

export type ProviderPreviewTexts = Record<
  Provider,
  Record<TtsListenLanguage, string>
>;

export type NativeSpeechVoice = Awaited<
  ReturnType<typeof Speech.getAvailableVoicesAsync>
>[number];
