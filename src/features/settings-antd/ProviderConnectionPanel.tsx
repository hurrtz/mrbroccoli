import React from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  ActivityIndicator,
  Button,
  Collapse,
  Icon,
  Input,
  List,
} from "@ant-design/react-native";
import type { IconNames } from "@ant-design/react-native/lib/icon";

import { getCatalogProviderEntry } from "../../catalog";
import {
  getCatalogProviderIdForAppProvider,
} from "../../catalog/appProviders";
import {
  PROVIDER_API_KEY_URLS,
  PROVIDER_LABELS,
  getProviderApiKeyHint,
  getProviderApiKeyPlaceholder,
} from "../../constants/models";
import { antButtonTypography } from "../../design-system/antTypography";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type {
  Provider,
  ProviderCapability,
} from "../../types";
import {
  formatQwenApiCredential,
  parseQwenApiCredential,
  QWEN_API_REGIONS,
  type QwenApiRegion,
} from "../../utils/qwenRegion";
import type {
  ProviderHealthState,
  ProviderValidationState,
  TextInputFocusHandler,
} from "../settings-core/types";

import {
  AntButtonLabel,
  AntPickerRow,
  AntPickerSection,
} from "./AntSettingsPrimitives";
import { styles } from "./styles";

export function getCapabilityLabel(
  capability: ProviderCapability,
  t: ReturnType<typeof useLocalization>["t"],
) {
  switch (capability) {
    case "llm":
      return "LLM";
    case "tts":
      return "TTS";
    case "stt":
      return "STT";
    case "search":
      return t("webSearch");
    case "voices":
      return t("providerCapability_voices");
  }
}

export function getStatusMeta(
  healthState: ProviderHealthState,
  t: ReturnType<typeof useLocalization>["t"],
  colors: ReturnType<typeof useTheme>["colors"],
): {
  label: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  icon: IconNames | null;
} {
  switch (healthState) {
    case "failing":
      return {
        label: t("providerStatusInvalid"),
        backgroundColor: `${colors.danger}18`,
        borderColor: `${colors.danger}66`,
        textColor: colors.danger,
        icon: "exclamation-circle",
      };
    case "validating":
      return {
        label: t("providerStatusTesting"),
        backgroundColor: colors.surfaceAlt,
        borderColor: colors.borderStrong,
        textColor: colors.accent,
        icon: null,
      };
    case "healthy":
      return {
        label: t("providerStatusWorking"),
        backgroundColor: `${colors.success}18`,
        borderColor: `${colors.success}88`,
        textColor: colors.success,
        icon: "check-circle",
      };
    case "configured":
      return {
        label: t("providerStatusNotTested"),
        backgroundColor: colors.surface,
        borderColor: colors.borderStrong,
        textColor: colors.textSecondary,
        icon: null,
      };
    default:
      return {
        label: t("providerStatusNotSetup"),
        backgroundColor: colors.surface,
        borderColor: colors.border,
        textColor: colors.textMuted,
        icon: "minus-circle",
      };
  }
}

function ProviderAbout({
  provider,
}: {
  provider: Provider;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [expandedSection, setExpandedSection] = React.useState<string | null>(
    null,
  );
  const appName = t("appName");
  const catalogEntry = getCatalogProviderEntry(
    getCatalogProviderIdForAppProvider(provider),
  );

  if (!catalogEntry) {
    return null;
  }

  const summaryLines = [
    catalogEntry.provider.summaries.integrationNotes,
    catalogEntry.provider.summaries.pricing
      ? t("catalogProviderPricingSummary", {
          summary: catalogEntry.provider.summaries.pricing,
        })
      : null,
    catalogEntry.provider.summaries.limits
      ? t("catalogProviderLimitsSummary", {
          summary: catalogEntry.provider.summaries.limits,
        })
      : null,
    catalogEntry.provider.summaries.region
      ? t("catalogProviderRegionSummary", {
          summary: catalogEntry.provider.summaries.region,
        })
      : null,
  ]
    .filter(Boolean)
    .map((line) => String(line).replaceAll("Mr Broccoli", appName));
  const activeModels = [
    catalogEntry.provider.summaries.activeModels.llm
      ? `LLM: ${catalogEntry.provider.summaries.activeModels.llm}`
      : null,
    catalogEntry.provider.summaries.activeModels.stt
      ? `STT: ${catalogEntry.provider.summaries.activeModels.stt}`
      : null,
    catalogEntry.provider.summaries.activeModels.tts
      ? `TTS: ${catalogEntry.provider.summaries.activeModels.tts}`
      : null,
  ].filter(Boolean) as string[];

  return (
    <Collapse
      accordion
      activeKey={expandedSection}
      onChange={(key) =>
        setExpandedSection((key as string | null) ?? null)
      }
      styles={{
        Item: {
          backgroundColor: colors.surface,
        },
        Content: {
          color: colors.text,
          fontFamily: fonts.bodyMedium,
          fontSize: 14,
          fontWeight: "600",
        },
      }}
    >
      <Collapse.Panel key="about" title={t("aboutThisProvider")}>
        <View>
          <View style={styles.accordionBody}>
            {[...summaryLines, ...activeModels].map((line) => (
              <Text
                key={line}
                style={[styles.helperText, { color: colors.textSecondary }]}
              >
                {line}
              </Text>
            ))}
          </View>
        </View>
      </Collapse.Panel>
    </Collapse>
  );
}

export function ProviderConnectionPanel({
  provider,
  visibleApiKey,
  capabilities,
  getCapabilityHealthState,
  getValidationState,
  canValidateCapability,
  apiKey,
  onToggleApiKeyVisibility,
  onUpdateApiKey,
  onTextInputFocus,
  onValidateCapability,
  onValidateAll,
}: {
  provider: Provider;
  visibleApiKey: boolean;
  capabilities: ProviderCapability[];
  getCapabilityHealthState: (
    capability: ProviderCapability,
  ) => ProviderHealthState;
  getValidationState: (
    capability: ProviderCapability,
  ) => ProviderValidationState;
  canValidateCapability: (capability: ProviderCapability) => boolean;
  apiKey: string;
  onToggleApiKeyVisibility: () => void;
  onUpdateApiKey: (provider: Provider, apiKey: string) => void;
  onTextInputFocus: TextInputFocusHandler;
  onValidateCapability: (capability: ProviderCapability) => Promise<void>;
  onValidateAll: () => Promise<void>;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const secureApiKey = apiKey.trim().length > 0 && !visibleApiKey;
  const canValidateAny = capabilities.some(canValidateCapability);
  const isValidatingAny = capabilities.some(
    (capability) => getValidationState(capability).status === "validating",
  );
  const qwenCredentials =
    provider === "alibaba-qwen-dashscope"
      ? parseQwenApiCredential(apiKey)
      : null;
  const displayedApiKey = qwenCredentials?.apiKey ?? apiKey;
  const qwenRegionOptions = QWEN_API_REGIONS.map((region) => ({
    value: region,
    label:
      region === "singapore"
        ? t("qwenRegionSingapore")
        : region === "us"
          ? t("qwenRegionUs")
          : t("qwenRegionBeijing"),
  }));

  return (
    <View style={styles.connectionPanel}>
      {provider === "openrouter" ? (
        <View
          style={[
            styles.onboardingCard,
            {
              backgroundColor: colors.accentSoft,
              borderColor: colors.accent,
            },
          ]}
        >
          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            {t("openRouterOnboardingTitle")}
          </Text>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t("openRouterOnboardingDescription")}
          </Text>
          <Text style={[styles.helperText, { color: colors.textMuted }]}>
            {t("openRouterOnboardingRoute")}
          </Text>
        </View>
      ) : null}

      <Text style={[styles.helperText, { color: colors.textSecondary }]}>
        {getProviderApiKeyHint(provider, language)}
      </Text>
      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
        {t("apiKey")}
      </Text>
      <Input
        value={displayedApiKey}
        type={secureApiKey ? "password" : "text"}
        onChangeText={(value) =>
          onUpdateApiKey(
            provider,
            qwenCredentials
              ? formatQwenApiCredential(value, qwenCredentials.region)
              : value,
          )
        }
        onFocus={onTextInputFocus}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        textContentType="none"
        importantForAutofill="no"
        spellCheck={false}
        placeholder={getProviderApiKeyPlaceholder(provider, language)}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.accent}
        inputStyle={{ color: colors.text, fontFamily: fonts.body }}
        suffix={
          <Pressable
            style={styles.inputSuffix}
            onPress={onToggleApiKeyVisibility}
            accessibilityRole="button"
            accessibilityLabel={secureApiKey ? t("showKey") : t("hideKey")}
          >
            <Icon
              name={secureApiKey ? "eye" : "eye-invisible"}
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
        }
        styles={{
          container: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
          },
        }}
      />

      {qwenCredentials ? (
        <AntPickerSection
          helperText={
            qwenCredentials.region === "us"
              ? t("qwenRegionUsSpeechHint")
              : t("qwenRegionHint")
          }
        >
          <AntPickerRow
            label={t("qwenApiRegion")}
            value={qwenCredentials.region}
            options={qwenRegionOptions}
            onChange={(value) =>
              onUpdateApiKey(
                provider,
                formatQwenApiCredential(
                  qwenCredentials.apiKey,
                  value as QwenApiRegion,
                ),
              )
            }
          />
        </AntPickerSection>
      ) : null}

      <View style={styles.buttonRow}>
        <Button
          type="primary"
          size="small"
          loading={isValidatingAny}
          disabled={
            !apiKey.trim() || !canValidateAny || isValidatingAny
          }
          style={styles.compactButton}
          styles={antButtonTypography}
          onPress={() => {
            void onValidateAll();
          }}
        >
          <AntButtonLabel
            color={colors.onActiveControl}
            icon="check-circle"
            label={t("testAllCapabilities")}
          />
        </Button>
        <Button
          type="ghost"
          size="small"
          style={StyleSheet.flatten([
            styles.compactButton,
            { borderColor: colors.border },
          ])}
          styles={antButtonTypography}
          onPress={() => {
            void Linking.openURL(PROVIDER_API_KEY_URLS[provider]);
          }}
        >
          <AntButtonLabel
            color={colors.accent}
            icon="export"
            label={
            provider === "openrouter"
              ? t("openRouterKeys")
              : t("createApiKey")
            }
          />
        </Button>
      </View>

      {apiKey.trim() && !canValidateAny ? (
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {t("providerValidationUnavailable")}
        </Text>
      ) : null}

      <List
        style={[
          styles.validationList,
          { borderColor: colors.border },
        ]}
      >
        {capabilities.map((capability) => {
          const validationState = getValidationState(capability);
          const status = getStatusMeta(
            getCapabilityHealthState(capability),
            t,
            colors,
          );
          const canValidate = canValidateCapability(capability);
          const isValidating = validationState.status === "validating";
          const message =
            validationState.status === "success" ||
            validationState.status === "error"
              ? validationState.message
              : null;

          return (
            <List.Item
              key={`${provider}:check:${capability}`}
              testID={`provider-capability-row-${provider}-${capability}`}
              multipleLine
              extra={
                <Button
                  size="small"
                  type="ghost"
                  loading={isValidating}
                  disabled={!canValidate || isValidating}
                  style={StyleSheet.flatten([
                    styles.compactButton,
                    { borderColor: colors.border },
                  ])}
                  styles={antButtonTypography}
                  onPress={() => {
                    void onValidateCapability(capability);
                  }}
                  accessibilityLabel={t("testProviderCapability", {
                    capability: getCapabilityLabel(capability, t),
                  })}
                >
                  <AntButtonLabel
                    color={colors.accent}
                    icon="play-circle"
                    iconSize={14}
                    label={t("test")}
                  />
                </Button>
              }
              styles={{
                Item: {
                  backgroundColor: status.backgroundColor,
                },
                Content: {
                  color: colors.text,
                  fontFamily: fonts.bodyMedium,
                  fontSize: 14,
                  fontWeight: "600",
                },
              }}
            >
              {`${getCapabilityLabel(capability, t)}${
                capability === "voices" ? ` · ${t("optional")}` : ""
              }`}
              <List.Item.Brief
                wrap
                style={{
                  color:
                    validationState.status === "error"
                      ? colors.danger
                      : status.textColor,
                  fontFamily: fonts.body,
                }}
              >
                {message ? `${status.label} · ${message}` : status.label}
              </List.Item.Brief>
            </List.Item>
          );
        })}
      </List>

      <ProviderAbout provider={provider} />
    </View>
  );
}
