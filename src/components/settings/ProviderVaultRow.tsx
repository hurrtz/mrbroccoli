import React from "react";
import {
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { getCatalogProviderIdForAppProvider } from "../../catalog/appProviders";
import { getCatalogProviderEntry } from "../../catalog";
import {
  PROVIDER_API_KEY_URLS,
  PROVIDER_LABELS,
  getProviderApiKeyHint,
  getProviderApiKeyPlaceholder,
} from "../../constants/models";
import { useLocalization } from "../../i18n";
import type { Provider, ProviderCapability } from "../../types";
import { useTheme } from "../../theme/ThemeContext";
import {
  formatQwenApiCredential,
  parseQwenApiCredential,
  QWEN_API_REGIONS,
  type QwenApiRegion,
} from "../../utils/qwenRegion";
import { Picker } from "../Picker";
import { ProviderIcon } from "../ProviderIcon";

import { styles } from "./styles";
import {
  getProviderCapabilities,
} from "./providerSupport";
import type {
  ProviderHealthState,
  ProviderValidationState,
  TextInputFocusHandler,
} from "./types";

function getCapabilityLabel(
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

function getStatusMeta(
  healthState: ProviderHealthState,
  t: ReturnType<typeof useLocalization>["t"],
  colors: ReturnType<typeof useTheme>["colors"],
) {
  switch (healthState) {
    case "failing":
      return {
        label: t("providerStatusInvalid"),
        backgroundColor: `${colors.danger}18`,
        borderColor: `${colors.danger}55`,
        textColor: colors.danger,
        icon: "alert-triangle" as const,
      };
    case "validating":
      return {
        label: t("providerStatusTesting"),
        backgroundColor: colors.surface,
        borderColor: colors.borderStrong,
        textColor: colors.accent,
        icon: "loader" as const,
      };
    case "healthy":
      return {
        label: t("providerStatusWorking"),
        backgroundColor: `${colors.success}22`,
        borderColor: `${colors.success}99`,
        textColor: colors.success,
        icon: "check-circle" as const,
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
        icon: "minus" as const,
      };
  }
}

function ProviderAboutAccordion({ provider }: { provider: Provider }) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const appName = t("appName");
  const [open, setOpen] = React.useState(false);
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
    <View style={styles.inlineAccordion}>
      <TouchableOpacity
        style={[
          styles.inlineAccordionButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        activeOpacity={0.85}
        onPress={() => setOpen((previous) => !previous)}
      >
        <Text style={[styles.inlineAccordionTitle, { color: colors.text }]}>
          {t("aboutThisProvider")}
        </Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {open ? (
        <View
          style={[
            styles.inlineAccordionBody,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {summaryLines.map((line) => (
            <Text
              key={line}
              style={[styles.sectionHint, { color: colors.textMuted }]}
            >
              {line}
            </Text>
          ))}
          {activeModels.length > 0 ? (
            <View style={styles.inlineAccordionList}>
              {activeModels.map((line) => (
                <Text
                  key={line}
                  style={[styles.sectionHint, { color: colors.textSecondary }]}
                >
                  {line}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function ProviderVaultRow({
  provider,
  expanded,
  visibleApiKey,
  healthState,
  getCapabilityHealthState,
  getValidationState,
  canValidateCapability,
  apiKey,
  onToggleExpanded,
  onToggleApiKeyVisibility,
  onUpdateApiKey,
  onTextInputFocus,
  onValidateCapability,
  onValidateAll,
}: {
  provider: Provider;
  expanded: boolean;
  visibleApiKey: boolean;
  healthState: ProviderHealthState;
  getCapabilityHealthState: (
    capability: ProviderCapability,
  ) => ProviderHealthState;
  getValidationState: (
    capability: ProviderCapability,
  ) => ProviderValidationState;
  canValidateCapability: (capability: ProviderCapability) => boolean;
  apiKey: string;
  onToggleExpanded: () => void;
  onToggleApiKeyVisibility: () => void;
  onUpdateApiKey: (provider: Provider, apiKey: string) => void;
  onTextInputFocus: TextInputFocusHandler;
  onValidateCapability: (capability: ProviderCapability) => Promise<void>;
  onValidateAll: () => Promise<void>;
}) {
  const { colors } = useTheme();
  const { t, language } = useLocalization();
  const capabilities = getProviderCapabilities(provider);
  const statusMeta = getStatusMeta(healthState, t, colors);
  const isConnected = healthState === "healthy";
  const isFailing = healthState === "failing";
  const showStatusPill = healthState === "validating";
  const showStatusIcon = healthState === "healthy" || healthState === "failing";
  const secureApiKey = !!apiKey.trim() && !visibleApiKey;
  const canValidateAnyCapability = capabilities.some(canValidateCapability);
  const isValidatingAnyCapability = capabilities.some(
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
    <View
      testID={`provider-vault-row-${provider}`}
      style={[
        styles.providerVaultRow,
        {
          backgroundColor: isConnected
            ? `${colors.success}22`
            : isFailing
              ? `${colors.danger}12`
              : colors.surfaceElevated,
          borderColor: isConnected
            ? `${colors.success}99`
            : isFailing
              ? `${colors.danger}55`
              : colors.border,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.providerVaultHeader}
        activeOpacity={0.85}
        onPress={onToggleExpanded}
        accessibilityRole="button"
        accessibilityLabel={`${PROVIDER_LABELS[provider]}, ${capabilities
          .map((capability) => getCapabilityLabel(capability, t))
          .join(", ")}, ${statusMeta.label}`}
      >
        <View style={styles.providerVaultHeaderCopy}>
          <View style={styles.providerVaultHeaderMain}>
            <View
              style={[
                styles.providerVaultIconWrap,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <ProviderIcon provider={provider} color={colors.text} />
            </View>
            <View style={styles.providerVaultLabelBlock}>
              <Text style={[styles.providerVaultTitle, { color: colors.text }]}>
                {PROVIDER_LABELS[provider]}
              </Text>
              <View style={styles.providerCapabilityRow}>
                {capabilities.map((capability) => {
                  const capabilityStatus = getStatusMeta(
                    getCapabilityHealthState(capability),
                    t,
                    colors,
                  );

                  return (
                    <View
                      key={`${provider}:${capability}`}
                      testID={`provider-capability-pill-${provider}-${capability}`}
                      style={[
                        styles.providerCapabilityPill,
                        {
                          backgroundColor: capabilityStatus.backgroundColor,
                          borderColor: capabilityStatus.borderColor,
                        },
                      ]}
                      accessibilityLabel={`${getCapabilityLabel(
                        capability,
                        t,
                      )}: ${capabilityStatus.label}`}
                    >
                      <View
                        style={[
                          styles.providerCapabilityDot,
                          { backgroundColor: capabilityStatus.textColor },
                        ]}
                      />
                      <Text
                        style={[
                          styles.providerCapabilityPillText,
                          { color: capabilityStatus.textColor },
                        ]}
                      >
                        {getCapabilityLabel(capability, t)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.providerVaultHeaderMeta}>
          {showStatusPill ? (
            <View
              style={[
                styles.providerStatusPill,
                {
                  backgroundColor: statusMeta.backgroundColor,
                  borderColor: statusMeta.borderColor,
                },
              ]}
            >
              {statusMeta.icon ? (
                <Feather
                  name={statusMeta.icon}
                  size={12}
                  color={statusMeta.textColor}
                />
              ) : null}
              <Text
                style={[styles.providerStatusText, { color: statusMeta.textColor }]}
              >
                {statusMeta.label}
              </Text>
            </View>
          ) : null}
          {showStatusIcon && statusMeta.icon ? (
            <Feather
              name={statusMeta.icon}
              size={16}
              color={statusMeta.textColor}
            />
          ) : null}
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.providerVaultExpanded}>
          {provider === "openrouter" ? (
            <View
              style={[
                styles.openRouterOnboardingCard,
                {
                  backgroundColor: colors.accentSoft,
                  borderColor: colors.accent,
                },
              ]}
            >
              <View style={styles.openRouterOnboardingTitleRow}>
                <Feather name="shuffle" size={15} color={colors.accent} />
                <Text
                  style={[
                    styles.openRouterOnboardingTitle,
                    { color: colors.text },
                  ]}
                >
                  {t("openRouterOnboardingTitle")}
                </Text>
              </View>
              <Text
                style={[
                  styles.openRouterOnboardingText,
                  { color: colors.textSecondary },
                ]}
              >
                {t("openRouterOnboardingDescription")}
              </Text>
              <Text
                style={[
                  styles.openRouterOnboardingRoute,
                  { color: colors.textMuted },
                ]}
              >
                {t("openRouterOnboardingRoute")}
              </Text>
            </View>
          ) : null}
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            {getProviderApiKeyHint(provider, language)}
          </Text>

          <View style={styles.apiKeyInputRow}>
            <TextInput
              value={displayedApiKey}
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
              contextMenuHidden={false}
              secureTextEntry={secureApiKey}
              placeholder={getProviderApiKeyPlaceholder(provider, language)}
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.accent}
              style={[
                styles.apiKeyInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />
            <TouchableOpacity
              style={[
                styles.apiKeyVisibilityButton,
                { backgroundColor: colors.surfaceElevated },
              ]}
              onPress={onToggleApiKeyVisibility}
              accessibilityRole="button"
              accessibilityLabel={
                secureApiKey ? t("showKey") : t("hideKey")
              }
            >
              <Feather
                name={secureApiKey ? "eye" : "eye-off"}
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {qwenCredentials ? (
            <>
              <Picker
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
              <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
                {qwenCredentials.region === "us"
                  ? t("qwenRegionUsSpeechHint")
                  : t("qwenRegionHint")}
              </Text>
            </>
          ) : null}

          <View style={styles.providerVaultActionRow}>
            <TouchableOpacity
              style={[
                styles.providerVaultActionButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
                (!apiKey.trim() || !canValidateAnyCapability) &&
                  styles.previewButtonDisabled,
              ]}
              activeOpacity={0.85}
              disabled={
                !apiKey.trim() ||
                !canValidateAnyCapability ||
                isValidatingAnyCapability
              }
              onPress={() => {
                void onValidateAll();
              }}
            >
              <Feather
                name={isValidatingAnyCapability ? "loader" : "check-circle"}
                size={14}
                color={colors.accent}
              />
              <Text
                style={[
                  styles.providerVaultActionButtonText,
                  { color: colors.text },
                ]}
              >
                {t("testAllCapabilities")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.providerVaultActionButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => {
                void Linking.openURL(PROVIDER_API_KEY_URLS[provider]);
              }}
            >
              <Feather name="external-link" size={14} color={colors.accent} />
              <Text
                style={[
                  styles.providerVaultActionButtonText,
                  { color: colors.text },
                ]}
              >
                {provider === "openrouter"
                  ? t("openRouterKeys")
                  : t("createApiKey")}
              </Text>
            </TouchableOpacity>
          </View>

          {apiKey.trim() && !canValidateAnyCapability ? (
            <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
              {t("providerValidationUnavailable")}
            </Text>
          ) : null}

          <View style={styles.providerCapabilityMatrix}>
            {capabilities.map((capability) => {
              const validationState = getValidationState(capability);
              const capabilityHealth = getCapabilityHealthState(capability);
              const capabilityStatus = getStatusMeta(
                capabilityHealth,
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
                <View
                  key={`${provider}:check:${capability}`}
                  testID={`provider-capability-row-${provider}-${capability}`}
                  style={[
                    styles.providerCapabilityCheckRow,
                    {
                      backgroundColor: capabilityStatus.backgroundColor,
                      borderColor: capabilityStatus.borderColor,
                    },
                  ]}
                >
                  <View style={styles.providerCapabilityCheckCopy}>
                    <View style={styles.providerCapabilityCheckHeader}>
                      <Text
                        style={[
                          styles.providerCapabilityCheckLabel,
                          { color: colors.text },
                        ]}
                      >
                        {getCapabilityLabel(capability, t)}
                      </Text>
                      {capability === "voices" ? (
                        <Text
                          style={[
                            styles.providerCapabilityOptional,
                            { color: colors.textMuted },
                          ]}
                        >
                          {t("optional")}
                        </Text>
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.providerCapabilityCheckStatus,
                        { color: capabilityStatus.textColor },
                      ]}
                    >
                      {capabilityStatus.label}
                    </Text>
                    {message ? (
                      <Text
                        style={[
                          styles.providerCapabilityCheckMessage,
                          {
                            color:
                              validationState.status === "error"
                                ? colors.danger
                                : colors.textMuted,
                          },
                        ]}
                      >
                        {message}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.providerCapabilityTestButton,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                      (!canValidate || isValidating) &&
                        styles.previewButtonDisabled,
                    ]}
                    activeOpacity={0.85}
                    disabled={!canValidate || isValidating}
                    onPress={() => {
                      void onValidateCapability(capability);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={t("testProviderCapability", {
                      capability: getCapabilityLabel(capability, t),
                    })}
                  >
                    <Feather
                      name={isValidating ? "loader" : "play"}
                      size={13}
                      color={colors.accent}
                    />
                    <Text
                      style={[
                        styles.providerCapabilityTestText,
                        { color: colors.accent },
                      ]}
                    >
                      {t("test")}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          <ProviderAboutAccordion provider={provider} />
        </View>
      ) : null}
    </View>
  );
}
