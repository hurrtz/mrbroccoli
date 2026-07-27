import React from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";

import { Tag } from "@ant-design/react-native";
import Feather from "@expo/vector-icons/Feather";

import { getAppProviderForCatalogProviderId } from "../../../catalog/appProviders";
import type { CatalogProviderId } from "../../../catalog";
import { ProviderIcon } from "../../../components/ProviderIcon";
import {
  PROVIDER_API_KEY_URLS,
  PROVIDER_LABELS,
} from "../../../constants/models";
import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type { Provider, ProviderCapability, Settings } from "../../../types";
import { getProviderCapabilities } from "../../settings-core/providerSupport";
import type {
  ProviderHealthState,
  ProviderValidationState,
  TextInputFocusHandler,
} from "../../settings-core/types";

import {
  getCapabilityLabel,
  getStatusMeta,
  ProviderAboutModal,
  ProviderConnectionPanel,
} from "../ProviderConnectionPanel";
import { AntDisclosureCard } from "../AntSettingsPrimitives";
import { styles } from "../styles";

type CapabilityFilter = "all" | ProviderCapability;

export function ConnectionsSettingsPage({
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
  const preferredFocusProvider =
    focusProvider ??
    (focusCatalogProviderId
      ? getAppProviderForCatalogProviderId(focusCatalogProviderId)
      : null);
  const [filter, setFilter] = React.useState<CapabilityFilter>("all");
  const [expandedProvider, setExpandedProvider] =
    React.useState<Provider | null>(preferredFocusProvider);
  const [aboutProvider, setAboutProvider] = React.useState<Provider | null>(
    null,
  );
  const [visibleApiKeys, setVisibleApiKeys] = React.useState<
    Partial<Record<Provider, boolean>>
  >({});

  React.useEffect(() => {
    if (preferredFocusProvider) {
      setExpandedProvider(preferredFocusProvider);
    }
  }, [preferredFocusProvider]);

  const providers = React.useMemo(
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
  const filters: { value: CapabilityFilter; label: string }[] = [
    { value: "all", label: t("all") },
    { value: "llm", label: "LLM" },
    { value: "tts", label: "TTS" },
    { value: "stt", label: "STT" },
    { value: "search", label: t("webSearch") },
    { value: "voices", label: t("providerCapability_voices") },
  ];
  return (
    <View style={styles.pageStack}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {filters.map((option) => {
          const selected = filter === option.value;
          return (
            <Tag
              key={option.value}
              selected={selected}
              onChange={() => setFilter(option.value)}
              styles={{
                normalWrap: {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
                normalText: {
                  color: colors.textSecondary,
                  fontFamily: fonts.body,
                },
                activeWrap: {
                  backgroundColor: colors.accentSoft,
                  borderColor: colors.accent,
                },
                activeText: {
                  color: colors.accent,
                  fontFamily: fonts.bodyMedium,
                },
              }}
            >
              {option.label}
            </Tag>
          );
        })}
      </ScrollView>

      <View style={styles.providerCards}>
        {providers.map((provider) => {
          const capabilities = getProviderCapabilities(provider);
          const healthState = getProviderHealthState(provider);
          const status = getStatusMeta(healthState, t, colors);
          const expanded = expandedProvider === provider;
          const allCapabilitiesHealthy =
            capabilities.length > 0 &&
            capabilities.every(
              (capability) =>
                getProviderCapabilityHealthState(provider, capability) ===
                "healthy",
            );

          return (
            <AntDisclosureCard
              key={provider}
              testID={`provider-card-${provider}`}
              expanded={expanded}
              style={
                allCapabilitiesHealthy
                  ? {
                      backgroundColor: `${colors.success}1F`,
                      borderColor: `${colors.success}88`,
                    }
                  : undefined
              }
              toggleAccessibilityLabel={
                expanded
                  ? t("collapseProvider", {
                      provider: PROVIDER_LABELS[provider],
                    })
                  : t("expandProvider", {
                      provider: PROVIDER_LABELS[provider],
                    })
              }
              onToggle={() =>
                setExpandedProvider((current) =>
                  current === provider ? null : provider,
                )
              }
              header={
                <View
                  testID={`provider-vault-row-${provider}`}
                  style={styles.providerHeader}
                  accessibilityLabel={`${PROVIDER_LABELS[provider]}, ${capabilities
                    .map((capability) => getCapabilityLabel(capability, t))
                    .join(", ")}, ${status.label}`}
                >
                  <View
                    style={[
                      styles.providerIcon,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <ProviderIcon provider={provider} color={colors.text} />
                  </View>
                  <Text style={[styles.providerName, { color: colors.text }]}>
                    {PROVIDER_LABELS[provider]}
                  </Text>
                </View>
              }
              headerExtra={
                <View style={styles.providerHeaderActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.providerHeaderAction,
                      pressed ? styles.pressedControl : null,
                    ]}
                    onPress={() => {
                      void Linking.openURL(PROVIDER_API_KEY_URLS[provider]);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`${t(
                      provider === "openrouter"
                        ? "openRouterKeys"
                        : "createApiKey",
                    )}: ${PROVIDER_LABELS[provider]}`}
                  >
                    <Feather
                      name="key"
                      size={18}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.providerHeaderAction,
                      pressed ? styles.pressedControl : null,
                    ]}
                    onPress={() => setAboutProvider(provider)}
                    accessibilityRole="button"
                    accessibilityLabel={`${t("aboutThisProvider")}: ${
                      PROVIDER_LABELS[provider]
                    }`}
                  >
                    <Feather
                      name="info"
                      size={19}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </View>
              }
              footer={
                allCapabilitiesHealthy ? undefined : (
                  <View
                    testID={`provider-capability-footer-${provider}`}
                    style={styles.capabilityRow}
                  >
                    {capabilities.map((capability) => {
                      const capabilityStatus = getStatusMeta(
                        getProviderCapabilityHealthState(provider, capability),
                        t,
                        colors,
                      );
                      return (
                        <View
                          key={`${provider}:${capability}`}
                          testID={`provider-capability-pill-${provider}-${capability}`}
                          accessible
                          accessibilityRole="text"
                          accessibilityLabel={`${getCapabilityLabel(
                            capability,
                            t,
                          )}: ${capabilityStatus.label}`}
                          style={styles.capabilityTag}
                        >
                          <View
                            style={[
                              styles.capabilityTagBody,
                              {
                                backgroundColor:
                                  capabilityStatus.backgroundColor,
                                borderColor: capabilityStatus.borderColor,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.capabilityTagText,
                                { color: capabilityStatus.textColor },
                              ]}
                            >
                              {getCapabilityLabel(capability, t)}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )
              }
            >
              <ProviderConnectionPanel
                provider={provider}
                visibleApiKey={!!visibleApiKeys[provider]}
                capabilities={capabilities}
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
            </AntDisclosureCard>
          );
        })}
      </View>

      <ProviderAboutModal
        provider={aboutProvider}
        visible={aboutProvider !== null}
        onClose={() => setAboutProvider(null)}
      />
    </View>
  );
}
