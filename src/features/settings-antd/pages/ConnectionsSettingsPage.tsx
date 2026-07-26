import React from "react";
import { Text, View } from "react-native";

import {
  ActivityIndicator,
  Collapse,
  Icon,
  Tag,
} from "@ant-design/react-native";

import { getAppProviderForCatalogProviderId } from "../../../catalog/appProviders";
import type { CatalogProviderId } from "../../../catalog";
import { PROVIDER_LABELS } from "../../../constants/models";
import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type {
  Provider,
  ProviderCapability,
  Settings,
} from "../../../types";
import { ProviderIcon } from "../../../components/ProviderIcon";
import { getProviderCapabilities } from "../../settings-core/providerSupport";
import type {
  ProviderHealthState,
  ProviderValidationState,
  TextInputFocusHandler,
} from "../../settings-core/types";

import {
  getCapabilityLabel,
  getStatusMeta,
  ProviderConnectionPanel,
} from "../ProviderConnectionPanel";
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
  const [expandedProvider, setExpandedProvider] = React.useState<
    Provider | null
  >(preferredFocusProvider);
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
      <View style={styles.filterRow}>
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
      </View>

      <Collapse
        accordion
        activeKey={expandedProvider}
        onChange={(key) =>
          setExpandedProvider((key as Provider | null) ?? null)
        }
        styles={{
          List: {
            backgroundColor: colors.surfaceElevated,
          },
          Item: {
            backgroundColor: colors.surfaceElevated,
          },
          Content: {
            color: colors.text,
            fontFamily: fonts.bodyMedium,
          },
          Arrow: {
            color: colors.textSecondary,
          },
        }}
      >
        {providers.map((provider) => {
          const capabilities = getProviderCapabilities(provider);
          const healthState = getProviderHealthState(provider);
          const status = getStatusMeta(healthState, t, colors);

          return (
            <Collapse.Panel
              key={provider}
              title={
                <View
                  testID={`provider-vault-row-${provider}`}
                  style={styles.providerHeader}
                  accessibilityLabel={`${PROVIDER_LABELS[provider]}, ${capabilities
                    .map((capability) =>
                      getCapabilityLabel(capability, t),
                    )
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
                  <View style={styles.providerHeaderCopy}>
                    <View style={styles.providerNameRow}>
                      <Text
                        style={[
                          styles.providerName,
                          { color: colors.text },
                        ]}
                      >
                        {PROVIDER_LABELS[provider]}
                      </Text>
                      {healthState === "validating" ? (
                        <ActivityIndicator
                          size="small"
                          color={colors.accent}
                        />
                      ) : status.icon ? (
                        <Icon
                          name={status.icon}
                          size={15}
                          color={status.textColor}
                        />
                      ) : null}
                      {healthState !== "unconfigured" ? (
                        <Text
                          style={[
                            styles.helperText,
                            { color: status.textColor },
                          ]}
                        >
                          {status.label}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.capabilityRow}>
                      {capabilities.map((capability) => {
                        const capabilityStatus = getStatusMeta(
                          getProviderCapabilityHealthState(
                            provider,
                            capability,
                          ),
                          t,
                          colors,
                        );
                        return (
                          <View
                            key={`${provider}:${capability}`}
                            testID={`provider-capability-pill-${provider}-${capability}`}
                            accessibilityLabel={`${getCapabilityLabel(
                              capability,
                              t,
                            )}: ${capabilityStatus.label}`}
                          >
                            <Tag
                              small
                              styles={{
                                normalWrap: {
                                  backgroundColor:
                                    capabilityStatus.backgroundColor,
                                  borderColor:
                                    capabilityStatus.borderColor,
                                },
                                normalText: {
                                  color: capabilityStatus.textColor,
                                  fontFamily: fonts.body,
                                },
                              }}
                            >
                              {getCapabilityLabel(capability, t)}
                            </Tag>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
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
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </View>
  );
}
