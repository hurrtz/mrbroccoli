import React from "react";
import { Pressable, Text, View } from "react-native";

import { getAppProviderForCatalogProviderId } from "../../catalog/appProviders";
import type { CatalogProviderId } from "../../catalog";
import { PROVIDER_LABELS } from "../../constants/models";
import { useLocalization } from "../../i18n";
import type {
  Provider,
  ProviderCapability,
  Settings,
} from "../../types";
import { useTheme } from "../../theme/ThemeContext";

import { ProviderVaultRow } from "./ProviderVaultRow";
import { styles } from "./styles";
import {
  getProviderCapabilities,
} from "./providerSupport";
import type {
  ProviderHealthState,
  ProviderValidationState,
  TextInputFocusHandler,
} from "./types";

type CapabilityFilter = "all" | ProviderCapability;

export function ApiKeysSection({
  settings,
  focusProvider,
  focusCatalogProviderId,
  getProviderHealthState,
  getProviderCapabilityHealthState,
  getProviderValidationState,
  canValidateCapability,
  onValidateCapability,
  onValidateAll,
  onUpdateApiKey,
  onTextInputFocus,
}: {
  settings: Settings;
  focusProvider?: Provider;
  focusCatalogProviderId?: CatalogProviderId;
  getProviderHealthState: (provider: Provider) => ProviderHealthState;
  getProviderCapabilityHealthState: (
    provider: Provider,
    capability: ProviderCapability,
  ) => ProviderHealthState;
  getProviderValidationState: (
    provider: Provider,
    capability: ProviderCapability,
  ) => ProviderValidationState;
  canValidateCapability: (
    provider: Provider,
    capability: ProviderCapability,
  ) => boolean;
  onValidateCapability: (
    provider: Provider,
    capability: ProviderCapability,
  ) => Promise<void>;
  onValidateAll: (provider: Provider) => Promise<void>;
  onUpdateApiKey: (provider: Provider, apiKey: string) => void;
  onTextInputFocus: TextInputFocusHandler;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [filter, setFilter] = React.useState<CapabilityFilter>("all");
  const [expandedProvider, setExpandedProvider] = React.useState<Provider | null>(
    focusProvider ??
      (focusCatalogProviderId
        ? getAppProviderForCatalogProviderId(focusCatalogProviderId)
        : null),
  );
  const [visibleApiKeys, setVisibleApiKeys] = React.useState<
    Partial<Record<Provider, boolean>>
  >({});
  const preferredFocusProvider =
    focusProvider ??
    (focusCatalogProviderId
      ? getAppProviderForCatalogProviderId(focusCatalogProviderId)
      : null);

  React.useEffect(() => {
    if (preferredFocusProvider) {
      setExpandedProvider(preferredFocusProvider);
    }
  }, [preferredFocusProvider]);

  const rows = React.useMemo(
    () =>
      Object.keys(settings.apiKeys)
        .map((provider) => provider as Provider)
        .filter(
          (provider) =>
            filter === "all" ||
            getProviderCapabilities(provider).includes(filter),
        )
        .sort((left, right) =>
          PROVIDER_LABELS[left].localeCompare(PROVIDER_LABELS[right]),
        ),
    [filter, settings.apiKeys],
  );

  const capabilityFilters: { value: CapabilityFilter; label: string }[] = [
    { value: "all", label: t("all") },
    { value: "llm", label: "LLM" },
    { value: "tts", label: "TTS" },
    { value: "stt", label: "STT" },
    { value: "search", label: t("webSearch") },
    { value: "voices", label: t("providerCapability_voices") },
  ];

  return (
    <View style={styles.tabPane}>
      <View style={styles.filterChipRow}>
        {capabilityFilters.map((option) => {
          const active = filter === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => setFilter(option.value)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? colors.accentSoft : colors.surface,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: active ? colors.accent : colors.textSecondary },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.providerVaultList}>
        {rows.map((provider) => (
          <ProviderVaultRow
            key={provider}
            provider={provider}
            expanded={expandedProvider === provider}
            visibleApiKey={!!visibleApiKeys[provider]}
            healthState={getProviderHealthState(provider)}
            getCapabilityHealthState={(capability) =>
              getProviderCapabilityHealthState(provider, capability)
            }
            getValidationState={(capability) =>
              getProviderValidationState(provider, capability)
            }
            canValidateCapability={(capability) =>
              canValidateCapability(provider, capability)
            }
            apiKey={settings.apiKeys[provider]}
            onToggleExpanded={() =>
              setExpandedProvider((previous) =>
                previous === provider ? null : provider,
              )
            }
            onToggleApiKeyVisibility={() =>
              setVisibleApiKeys((previous) => ({
                ...previous,
                [provider]: !previous[provider],
              }))
            }
            onUpdateApiKey={onUpdateApiKey}
            onTextInputFocus={onTextInputFocus}
            onValidateCapability={(capability) =>
              onValidateCapability(provider, capability)
            }
            onValidateAll={() => onValidateAll(provider)}
          />
        ))}
      </View>
    </View>
  );
}
