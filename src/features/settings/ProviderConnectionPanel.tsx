import React from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, List } from "../../design-system/NativeControls";

import { getCatalogProviderEntry } from "../../catalog";
import { getCatalogProviderIdForAppProvider } from "../../catalog/appProviders";
import { APP_MODAL_ORIENTATIONS } from "../../constants/layout";
import {
  PROVIDER_LABELS,
  getProviderApiKeyHint,
  getProviderApiKeyPlaceholder,
} from "../../constants/models";
import { IconButton } from "../../design-system/IconButton";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type { Provider, ProviderCapability } from "../../types";
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
import type { ProviderCircuitState } from "../../services/providerResilience";

import {
  AntButtonLabel,
  AntPickerRow,
  AntPickerRows,
  AntSettingsCard,
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
} {
  switch (healthState) {
    case "failing":
      return {
        label: t("providerStatusInvalid"),
        backgroundColor: `${colors.danger}18`,
        borderColor: `${colors.danger}66`,
        textColor: colors.danger,
      };
    case "validating":
      return {
        label: t("providerStatusTesting"),
        backgroundColor: colors.surfaceAlt,
        borderColor: colors.borderStrong,
        textColor: colors.accent,
      };
    case "healthy":
      return {
        label: t("providerStatusWorking"),
        backgroundColor: `${colors.success}18`,
        borderColor: `${colors.success}88`,
        textColor: colors.success,
      };
    case "configured":
      return {
        label: t("providerStatusNotTested"),
        backgroundColor: colors.surface,
        borderColor: colors.borderStrong,
        textColor: colors.textSecondary,
      };
    default:
      return {
        label: t("providerStatusNotSetup"),
        backgroundColor: colors.surface,
        borderColor: colors.border,
        textColor: colors.textMuted,
      };
  }
}

export function ProviderAboutModal({
  provider,
  visible,
  onClose,
}: {
  provider: Provider | null;
  visible: boolean;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const appName = t("appName");
  const catalogEntry = provider
    ? getCatalogProviderEntry(getCatalogProviderIdForAppProvider(provider))
    : null;

  if (!provider || !catalogEntry) {
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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      supportedOrientations={APP_MODAL_ORIENTATIONS}
      onRequestClose={onClose}
    >
      <SafeAreaView
        testID="provider-about-modal"
        edges={["top", "right", "bottom", "left"]}
        accessibilityViewIsModal
        style={[
          styles.providerAboutModal,
          { backgroundColor: colors.background },
        ]}
      >
        <View
          style={[
            styles.providerAboutHeader,
            { borderBottomColor: colors.border },
          ]}
        >
          <Text
            accessibilityRole="header"
            style={[styles.providerAboutTitle, { color: colors.text }]}
          >
            {`${PROVIDER_LABELS[provider]} · ${t("aboutThisProvider")}`}
          </Text>
          <IconButton
            accessibilityLabel={t("dismiss")}
            iconNode={
              <PhosphorIcon
                name="close"
                size="control"
                color={colors.textSecondary}
              />
            }
            onPress={onClose}
          />
        </View>
        <ScrollView
          testID="provider-about-scroll"
          style={styles.providerAboutScroll}
          contentContainerStyle={styles.providerAboutContent}
          showsVerticalScrollIndicator
        >
          {[...summaryLines, ...activeModels].map((line) => (
            <Text
              key={line}
              style={[
                styles.providerAboutText,
                { color: colors.textSecondary },
              ]}
            >
              {line}
            </Text>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export function ProviderConnectionPanel({
  provider,
  visibleApiKey,
  capabilities,
  getCapabilityHealthState,
  getCircuitState,
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
  getCircuitState: (
    capability: ProviderCapability,
  ) => ProviderCircuitState | null;
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
        <AntSettingsCard
          style={{
            backgroundColor: colors.accentSoft,
            borderColor: colors.accent,
          }}
        >
          <Text style={[styles.connectionSectionTitle, { color: colors.text }]}>
            {t("openRouterOnboardingTitle")}
          </Text>
          <Text
            style={[styles.connectionBodyText, { color: colors.textSecondary }]}
          >
            {t("openRouterOnboardingDescription")}
          </Text>
          <Text
            style={[styles.connectionBodyText, { color: colors.textMuted }]}
          >
            {t("openRouterOnboardingRoute")}
          </Text>
        </AntSettingsCard>
      ) : null}

      <View
        testID={`provider-api-key-section-${provider}`}
        style={styles.connectionSection}
      >
        <Text style={[styles.connectionSectionTitle, { color: colors.text }]}>
          {t("apiKey")}
        </Text>
        <Text
          style={[styles.connectionBodyText, { color: colors.textSecondary }]}
        >
          {getProviderApiKeyHint(provider, language)}
        </Text>
        <View
          testID={
            Platform.OS === "ios"
              ? `provider-api-key-input-${provider}`
              : undefined
          }
          collapsable={false}
        >
          <Input
            testID={
              Platform.OS === "ios"
                ? undefined
                : `provider-api-key-input-${provider}`
            }
            value={displayedApiKey}
            accessibilityLabel={`${t("apiKey")}: ${PROVIDER_LABELS[provider]}`}
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
            inputStyle={{
              color: colors.text,
              fontFamily: fonts.body,
              fontSize: 15,
              lineHeight: 21,
              paddingHorizontal: 12,
            }}
            suffix={
              <Pressable
                style={({ pressed }) => [
                  styles.inputSuffix,
                  pressed ? styles.pressedControl : null,
                ]}
                onPress={onToggleApiKeyVisibility}
                accessibilityRole="button"
                accessibilityLabel={secureApiKey ? t("showKey") : t("hideKey")}
              >
                <PhosphorIcon
                  name={secureApiKey ? "eye" : "eye-invisible"}
                  size="control"
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
                minHeight: 46,
              },
            }}
          />
        </View>
        {qwenCredentials ? (
          <View style={styles.connectionFullBleed}>
            <AntPickerRows
              helperTextStyle={styles.connectionImprintText}
              helperText={
                qwenCredentials.region === "us"
                  ? t("qwenRegionUsSpeechHint")
                  : t("qwenRegionHint")
              }
            >
              <AntPickerRow
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
            </AntPickerRows>
          </View>
        ) : null}
      </View>

      <View
        testID={`provider-api-test-section-${provider}`}
        style={styles.connectionSection}
      >
        <View
          testID={`provider-api-test-header-${provider}`}
          style={styles.connectionSectionHeader}
        >
          <Text style={[styles.connectionSectionTitle, { color: colors.text }]}>
            {t("apiTest")}
          </Text>
          <Button
            testID={`provider-test-all-${provider}`}
            type="primary"
            size="small"
            loading={isValidatingAny}
            disabled={!apiKey.trim() || !canValidateAny || isValidatingAny}
            style={styles.compactButton}
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
        </View>

        {apiKey.trim() && !canValidateAny ? (
          <Text
            style={[styles.connectionBodyText, { color: colors.textSecondary }]}
          >
            {t("providerValidationUnavailable")}
          </Text>
        ) : null}

        <View style={styles.connectionFullBleed}>
          <List
            testID={`provider-capability-list-${provider}`}
            style={styles.validationList}
            styles={{
              List: {
                backgroundColor: colors.surfaceElevated,
              },
              Body: {
                borderTopWidth: 0,
              },
              BodyBottomLine: {
                height: 0,
                backgroundColor: "transparent",
              },
            }}
          >
            {capabilities.map((capability) => {
              const validationState = getValidationState(capability);
              const circuitState = getCircuitState(capability);
              const status = getStatusMeta(
                circuitState ? "failing" : getCapabilityHealthState(capability),
                t,
                colors,
              );
              const canValidate = canValidateCapability(capability);
              const isValidating = validationState.status === "validating";
              const disabled = !canValidate || isValidatingAny;
              const message =
                circuitState?.message ??
                (validationState.status === "success" ||
                validationState.status === "error"
                  ? validationState.message
                  : null);

              return (
                <List.Item
                  key={`${provider}:check:${capability}`}
                  testID={`provider-capability-row-${provider}-${capability}`}
                  multipleLine
                  disabled={disabled}
                  onPress={() => {
                    if (!disabled) {
                      void onValidateCapability(capability);
                    }
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={
                    circuitState
                      ? t("retry")
                      : t("testProviderCapability", {
                          capability: getCapabilityLabel(capability, t),
                        })
                  }
                  extra={
                    <View style={styles.validationAction}>
                      {isValidating ? (
                        <ActivityIndicator size="small" color={colors.accent} />
                      ) : (
                        <PhosphorIcon
                          name={circuitState ? "reload" : "play-circle"}
                          size="control"
                          color={disabled ? colors.textMuted : colors.accent}
                        />
                      )}
                    </View>
                  }
                  styles={{
                    Item: {
                      backgroundColor: status.backgroundColor,
                    },
                    Line: {
                      borderBottomWidth: 0,
                    },
                    Content: {
                      color: colors.text,
                      fontFamily: fonts.bodyMedium,
                      fontSize: 15,
                      fontWeight: "500",
                    },
                  }}
                >
                  {`${getCapabilityLabel(capability, t)}${
                    capability === "voices" ? ` · ${t("optional")}` : ""
                  }`}
                  <List.Item.Brief
                    wrap
                    style={[
                      styles.connectionImprintText,
                      {
                        color:
                          validationState.status === "error"
                            ? colors.danger
                            : status.textColor,
                      },
                    ]}
                  >
                    <Text
                      accessibilityLiveRegion="polite"
                      style={[
                        styles.connectionImprintText,
                        {
                          color:
                            validationState.status === "error"
                              ? colors.danger
                              : status.textColor,
                        },
                      ]}
                    >
                      {message ? `${status.label} · ${message}` : status.label}
                    </Text>
                  </List.Item.Brief>
                </List.Item>
              );
            })}
          </List>
        </View>
      </View>
    </View>
  );
}
