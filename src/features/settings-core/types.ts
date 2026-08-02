import React from "react";
import * as Speech from "expo-speech";
import { TextInput } from "react-native";

import type { CatalogProviderId } from "../../catalog/types";
import type { ProviderVoiceDirectories } from "../../services/providerVoiceDirectory";
import type { KokoroModelController } from "../../hooks/useKokoroModel";
import type {
  AppDataBackup,
  AppDataBackupRestoreResult,
} from "../../services/appDataBackup";
import type { ConversationArchiveController } from "../../hooks/useConversationArchive";
import {
  Provider,
  ProviderCapability,
  ProviderValidationResult,
  ResponseMode,
  ResponseModeRoute,
  Settings,
  TtsListenLanguage,
  VoicePreviewRequest,
} from "../../types";

export interface SettingsModalProps {
  visible: boolean;
  isPremium: boolean;
  settings: Settings;
  kokoroModel: KokoroModelController;
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
  onUpdateProviderValidationResult: (
    provider: Provider,
    capability: ProviderCapability,
    result: ProviderValidationResult,
  ) => void;
  onPreviewVoice: (
    request: VoicePreviewRequest,
    callbacks?: {
      onPlaybackStarted?: () => void;
    },
  ) => Promise<void>;
  onStopPreviewVoice: () => Promise<void>;
  onValidateProviderCapability: (
    provider: Provider,
    capability: ProviderCapability,
  ) => Promise<void>;
  onOpenSetupGuide?: () => void;
  onOpenPremium: () => void;
  onOpenOfflineSetup: () => void;
  conversationArchive: ConversationArchiveController;
  onCreateAppDataBackup: () => Promise<AppDataBackup>;
  onRestoreAppDataBackup: (
    backup: AppDataBackup,
  ) => Promise<AppDataBackupRestoreResult>;
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
  | "local"
  | "search"
  | "data"
  | "app";

export const PREMIUM_SETTINGS_PAGES = [
  "connections",
  "thinking",
  "listening",
  "speaking",
  "search",
] as const satisfies readonly SettingsPage[];

export function isPremiumSettingsPage(page: SettingsPage) {
  return (PREMIUM_SETTINGS_PAGES as readonly SettingsPage[]).includes(page);
}

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

export type ProviderCapabilityValidationStates = Partial<
  Record<ProviderCapability, ProviderValidationState>
>;

export type ProviderValidationStates = Partial<
  Record<Provider, ProviderCapabilityValidationStates>
>;

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
