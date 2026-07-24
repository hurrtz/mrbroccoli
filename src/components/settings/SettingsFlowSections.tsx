import React from "react";
import {
  Linking,
  Pressable,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Feather from "@expo/vector-icons/Feather";

import {
  getAppProviderForCatalogProviderId,
  getCatalogProviderIdForAppProvider,
} from "../../catalog/appProviders";
import {
  getCatalogProviderEntry,
  type CatalogProviderId,
} from "../../catalog";
import {
  PROVIDER_API_KEY_URLS,
  PROVIDER_LABELS,
  getProviderApiKeyHint,
  getProviderApiKeyPlaceholder,
  providerTtsModelSupportsInstructions,
} from "../../constants/models";
import {
  WEB_SEARCH_DEPTH_VALUES,
  WEB_SEARCH_RESULT_LIMIT_VALUES,
  WEB_SEARCH_SEARCH_MODE_VALUES,
  getWebSearchProviderControlSupport,
  normalizeWebSearchProviderSettings,
  type WebSearchProvider,
  type WebSearchProviderSettings,
} from "../../constants/webSearch";
import { useLocalization } from "../../i18n";
import type {
  InputMode,
  Provider,
  ReplyPlayback,
  ResponseMode,
  ResponseModeRoute,
  Settings,
  SttBackendMode,
  TtsBackendMode,
  TtsListenLanguage,
} from "../../types";
import type { ProviderVoiceDirectories } from "../../services/providerVoiceDirectory";
import { useTheme } from "../../theme/ThemeContext";
import {
  formatQwenApiCredential,
  parseQwenApiCredential,
  QWEN_API_REGIONS,
  type QwenApiRegion,
} from "../../utils/qwenRegion";
import { Picker } from "../Picker";
import { ProviderIcon } from "../ProviderIcon";

import {
  ListenLanguageSelector,
  PickerSection,
  RadioGroup,
} from "./shared";
import { styles } from "./styles";
import {
  getProviderCapabilities,
  type ProviderCapability,
} from "./providerSupport";
import { ResponseModesSection } from "./ProvidersSections";
import {
  NativeVoicePreviewSection,
  ProviderVoicePreviewSection,
} from "./TtsSections";
import type {
  PreviewButtonPhase,
  ProviderHealthState,
  ProviderPreviewTexts,
  ProviderValidationState,
  TextInputFocusHandler,
} from "./types";

type CapabilityFilter = "all" | ProviderCapability;

function buildProviderPickerOptions(
  providers: Provider[],
  selectedProvider: Provider | null | undefined,
  missingLabel: string,
) {
  const options = [...providers];

  if (selectedProvider && !options.includes(selectedProvider)) {
    options.push(selectedProvider);
  }

  return options.map((provider) => ({
    value: provider,
    label: providers.includes(provider)
      ? PROVIDER_LABELS[provider]
      : `${PROVIDER_LABELS[provider]} · ${missingLabel}`,
  }));
}

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
        label: t("providerStatusConfigured"),
        backgroundColor: `${colors.success}22`,
        borderColor: `${colors.success}99`,
        textColor: colors.success,
        icon: "check-circle" as const,
      };
    case "configured":
      return {
        label: t("providerStatusConfigured"),
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
  ].filter(Boolean) as string[];
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

function ProviderVaultRow({
  provider,
  expanded,
  visibleApiKey,
  validationState,
  healthState,
  canValidate,
  apiKey,
  onToggleExpanded,
  onToggleApiKeyVisibility,
  onUpdateApiKey,
  onTextInputFocus,
  onValidate,
}: {
  provider: Provider;
  expanded: boolean;
  visibleApiKey: boolean;
  validationState: ProviderValidationState;
  healthState: ProviderHealthState;
  canValidate: boolean;
  apiKey: string;
  onToggleExpanded: () => void;
  onToggleApiKeyVisibility: () => void;
  onUpdateApiKey: (provider: Provider, apiKey: string) => void;
  onTextInputFocus: TextInputFocusHandler;
  onValidate: (provider: Provider) => Promise<void>;
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
  const showValidationMessage =
    validationState.status === "success" || validationState.status === "error";
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
                {capabilities.map((capability) => (
                  <View
                    key={`${provider}:${capability}`}
                    style={[
                      styles.providerCapabilityPill,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.providerCapabilityPillText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {getCapabilityLabel(capability, t)}
                    </Text>
                  </View>
                ))}
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
                (!apiKey.trim() || !canValidate) && styles.previewButtonDisabled,
              ]}
              activeOpacity={0.85}
              disabled={!apiKey.trim() || !canValidate}
              onPress={() => {
                void onValidate(provider);
              }}
            >
              <Feather
                name={validationState.status === "validating" ? "loader" : "check"}
                size={14}
                color={colors.accent}
              />
              <Text
                style={[
                  styles.providerVaultActionButtonText,
                  { color: colors.text },
                ]}
              >
                {t("testProviderKey")}
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
                {t("createApiKey")}
              </Text>
            </TouchableOpacity>
          </View>

          {apiKey.trim() && !canValidate ? (
            <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
              {t("providerValidationUnavailable")}
            </Text>
          ) : null}

          {showValidationMessage ? (
            <View
              style={[
                styles.validationCard,
                {
                  backgroundColor:
                    validationState.status === "success"
                      ? `${colors.success}22`
                      : `${colors.danger}12`,
                  borderColor:
                    validationState.status === "success"
                      ? `${colors.success}99`
                      : `${colors.danger}55`,
                },
              ]}
            >
              <Text
                style={[
                  styles.validationText,
                  {
                    color:
                      validationState.status === "success"
                        ? colors.success
                        : colors.danger,
                  },
                ]}
              >
                {validationState.message}
              </Text>
            </View>
          ) : null}

          <ProviderAboutAccordion provider={provider} />
        </View>
      ) : null}
    </View>
  );
}

export function ApiKeysSection({
  settings,
  focusProvider,
  focusCatalogProviderId,
  getProviderHealthState,
  getProviderValidationState,
  canValidateProvider,
  onValidateProvider,
  onUpdateApiKey,
  onTextInputFocus,
}: {
  settings: Settings;
  focusProvider?: Provider;
  focusCatalogProviderId?: CatalogProviderId;
  getProviderHealthState: (provider: Provider) => ProviderHealthState;
  getProviderValidationState: (provider: Provider) => ProviderValidationState;
  canValidateProvider: (provider: Provider) => boolean;
  onValidateProvider: (provider: Provider) => Promise<void>;
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
            validationState={getProviderValidationState(provider)}
            healthState={getProviderHealthState(provider)}
            canValidate={canValidateProvider(provider)}
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
            onValidate={onValidateProvider}
          />
        ))}
      </View>
    </View>
  );
}

export function ThinkingSection({
  settings,
  llmProviders,
  onUpdate,
  onUpdateResponseModeRoute,
  onAddResponseMode,
  onRemoveResponseMode,
}: {
  settings: Settings;
  llmProviders: Provider[];
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onUpdateResponseModeRoute: (
    mode: ResponseMode,
    route: ResponseModeRoute,
  ) => void;
  onAddResponseMode: () => void;
  onRemoveResponseMode: (mode: ResponseMode) => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [systemPromptOpen, setSystemPromptOpen] = React.useState(false);

  return (
    <View style={styles.tabPane}>
      <ResponseModesSection
        settings={settings}
        enabledProviders={llmProviders}
        onUpdateResponseModeRoute={onUpdateResponseModeRoute}
        onAddResponseMode={onAddResponseMode}
        onRemoveResponseMode={onRemoveResponseMode}
      />

      <View style={styles.inlineAccordion}>
        <TouchableOpacity
          style={[
            styles.inlineAccordionButton,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          activeOpacity={0.85}
          onPress={() => setSystemPromptOpen((previous) => !previous)}
        >
          <Text style={[styles.inlineAccordionTitle, { color: colors.text }]}>
            {t("systemPrompt")}
          </Text>
          <Feather
            name={systemPromptOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {systemPromptOpen ? (
          <View
            style={[
              styles.promptCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
              {t("assistantInstructionsIntro")}
            </Text>
            <TextInput
              value={settings.assistantInstructions}
              onChangeText={(value) => onUpdate({ assistantInstructions: value })}
              multiline
              placeholder={t("assistantInstructionsPlaceholder")}
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.accent}
              style={[
                styles.promptInput,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function SearchSection({
  settings,
  searchProviders,
  onUpdate,
}: {
  settings: Settings;
  searchProviders: WebSearchProvider[];
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [advancedSearchOpen, setAdvancedSearchOpen] = React.useState(false);
  const selectableSearchProviders = searchProviders;
  const selectedWebSearchProvider =
    settings.webSearchProvider ?? selectableSearchProviders[0] ?? null;
  const webSearchPickerOptions = buildProviderPickerOptions(
    selectableSearchProviders,
    selectedWebSearchProvider,
    t("providerNeedsAttention"),
  );
  const selectedProviderSettings = selectedWebSearchProvider
    ? normalizeWebSearchProviderSettings(
        selectedWebSearchProvider,
        settings.webSearchProviderSettings[selectedWebSearchProvider],
      )
    : null;
  const controlSupport = selectedWebSearchProvider
    ? getWebSearchProviderControlSupport(selectedWebSearchProvider)
    : {
        resultLimit: false,
        depth: false,
        searchMode: false,
      };

  const updateWebSearchProviderSettings = React.useCallback(
    (partial: Partial<WebSearchProviderSettings>) => {
      onUpdate({
        webSearchProviderSettings: {
          ...settings.webSearchProviderSettings,
          ...(selectedWebSearchProvider && selectedProviderSettings
            ? {
                [selectedWebSearchProvider]: {
                  ...selectedProviderSettings,
                  ...partial,
                },
              }
            : {}),
        },
      });
    },
    [
      onUpdate,
      selectedProviderSettings,
      selectedWebSearchProvider,
      settings.webSearchProviderSettings,
    ],
  );

  return (
    <View style={styles.tabPane}>
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.inlineSwitchCopy}>
          <Text
            accessibilityRole="header"
            style={[styles.settingsSectionTitle, { color: colors.text }]}
          >
            {t("webSearch")}
          </Text>
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            {t("settingsWebSearchCompactHint")}
          </Text>
        </View>

        {selectableSearchProviders.length > 0 ? (
          <>
            {selectedWebSearchProvider ? (
              <Picker
                label={t("webSearchProvider")}
                value={selectedWebSearchProvider}
                options={webSearchPickerOptions}
                disabled={webSearchPickerOptions.length === 0}
                containerStyle={styles.webSearchProviderPicker}
                onChange={(value) =>
                  onUpdate({ webSearchProvider: value as WebSearchProvider })
                }
              />
            ) : null}

            {webSearchPickerOptions.length === 0 ? (
              <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
                {t("webSearchProviderMissingHint")}
              </Text>
            ) : null}

            {controlSupport.resultLimit ||
            controlSupport.depth ||
            controlSupport.searchMode ? (
              <View style={styles.inlineAccordion}>
                <TouchableOpacity
                  style={[
                    styles.inlineAccordionButton,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setAdvancedSearchOpen((previous) => !previous)}
                >
                  <Text
                    style={[styles.inlineAccordionTitle, { color: colors.text }]}
                  >
                    {t("webSearchAdvanced")}
                  </Text>
                  <Feather
                    name={advancedSearchOpen ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>

                {advancedSearchOpen && selectedProviderSettings ? (
                  <View
                    style={[
                      styles.inlineAccordionBody,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    {controlSupport.resultLimit ? (
                      <Picker
                        label={t("webSearchResultCount")}
                        value={String(selectedProviderSettings.resultLimit)}
                        options={WEB_SEARCH_RESULT_LIMIT_VALUES.map((value) => ({
                          value: String(value),
                          label: `${value}`,
                        }))}
                        onChange={(value) =>
                          updateWebSearchProviderSettings({
                            resultLimit: Number(value) as 3 | 5 | 8,
                          })
                        }
                      />
                    ) : null}
                    {controlSupport.depth ? (
                      <Picker
                        label={t("webSearchDepth")}
                        value={selectedProviderSettings.depth}
                        options={WEB_SEARCH_DEPTH_VALUES.map((value) => ({
                          value,
                          label:
                            value === "deep"
                              ? t("webSearchDepthDeep")
                              : t("webSearchDepthStandard"),
                        }))}
                        onChange={(value) =>
                          updateWebSearchProviderSettings({
                            depth: value as WebSearchProviderSettings["depth"],
                          })
                        }
                      />
                    ) : null}
                    {controlSupport.searchMode ? (
                      <Picker
                        label={t("webSearchSearchMode")}
                        value={selectedProviderSettings.searchMode}
                        options={WEB_SEARCH_SEARCH_MODE_VALUES.map((value) => ({
                          value,
                          label:
                            value === "quick"
                              ? t("webSearchSearchModeQuick")
                              : value === "deep"
                                ? t("webSearchSearchModeDeep")
                                : t("webSearchSearchModeBalanced"),
                        }))}
                        onChange={(value) =>
                          updateWebSearchProviderSettings({
                            searchMode:
                              value as WebSearchProviderSettings["searchMode"],
                          })
                        }
                      />
                    ) : null}
                  </View>
                ) : null}
              </View>
            ) : null}
          </>
        ) : (
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            {t("webSearchSetupNeeded")}
          </Text>
        )}
      </View>
    </View>
  );
}

export function ListeningSection({
  settings,
  selectableSttProviders,
  selectedSttProviderModelOptions,
  selectedSttProviderModel,
  sttLanguageNote,
  sttLimitNote,
  onUpdate,
  onUpdateProviderSttModel,
}: {
  settings: Settings;
  selectableSttProviders: Provider[];
  selectedSttProviderModelOptions: { id: string; name: string }[];
  selectedSttProviderModel: string;
  sttLanguageNote: string | null;
  sttLimitNote: string | null;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onUpdateProviderSttModel: (provider: Provider, model: string) => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const sttProviderOptions = buildProviderPickerOptions(
    selectableSttProviders,
    settings.sttProvider,
    t("providerNeedsAttention"),
  );

  return (
    <View style={styles.tabPane}>
      <View style={styles.settingsSubsectionIntro}>
        <Text
          accessibilityRole="header"
          style={[styles.settingsSectionTitle, { color: colors.text }]}
        >
          {t("voiceInput")}
        </Text>
        <Text
          style={[
            styles.settingsSectionDescription,
            { color: colors.textSecondary },
          ]}
        >
          {t("voiceInputDescription")}
        </Text>
      </View>

      <View style={styles.settingsSubsectionStack}>
        <RadioGroup<InputMode>
          label={t("inputMode")}
          options={[
            {
              value: "push-to-talk",
              label: t("pushToTalk"),
              description: t("pushToTalkDescription"),
            },
            {
              value: "toggle-to-talk",
              label: t("toggleToTalk"),
              description: t("toggleToTalkDescription"),
            },
          ]}
          value={settings.inputMode}
          onChange={(value) => onUpdate({ inputMode: value })}
        />

        <RadioGroup<SttBackendMode>
          label={t("speechToText")}
          options={[
            {
              value: "native",
              label: t("appNative"),
              description: t("nativeSttDescription"),
            },
            {
              value: "provider",
              label: t("provider"),
              description: t("providerSttDescription"),
            },
          ]}
          value={settings.sttMode}
          onChange={(value) => onUpdate({ sttMode: value })}
        />

        {settings.sttMode === "provider" ? (
          <PickerSection>
            <Picker
              label={t("sttProvider")}
              value={settings.sttProvider ?? ""}
              options={sttProviderOptions}
              disabled={sttProviderOptions.length === 0}
              onChange={(value) => onUpdate({ sttProvider: value as Provider })}
            />
            {settings.sttProvider && selectedSttProviderModelOptions.length > 1 ? (
              <Picker
                label={t("model")}
                value={selectedSttProviderModel}
                options={selectedSttProviderModelOptions.map((model) => ({
                  value: model.id,
                  label: model.name,
                }))}
                onChange={(value) =>
                  onUpdateProviderSttModel(settings.sttProvider!, value)
                }
              />
            ) : null}
            {sttLanguageNote ? (
              <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
                {t("languageCoverage", { note: sttLanguageNote })}
              </Text>
            ) : null}
            {sttLimitNote ? (
              <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
                {t("recordingLimits", { note: sttLimitNote })}
              </Text>
            ) : null}
          </PickerSection>
        ) : null}
      </View>
    </View>
  );
}

export function SpeakingSection({
  settings,
  selectableTtsProviders,
  ttsLanguageNote,
  selectedPreviewProvider,
  selectedPreviewProviderModelOptions,
  selectedPreviewProviderModel,
  providerPreviewTexts,
  activePreview,
  nativeVoiceOptions,
  selectedNativeVoice,
  nativePreviewText,
  onUpdate,
  onUpdateProviderTtsModel,
  onUpdateProviderTtsVoice,
  providerVoiceDirectories,
  onStopPreviewVoice,
  onSetProviderPreviewText,
  onSetNativePreviewText,
  onPreviewProviderVoice,
  onPreviewNativeVoice,
  onSelectNativeVoice,
  onTextInputFocus,
  onToggleListenLanguage,
}: {
  settings: Settings;
  selectableTtsProviders: Provider[];
  ttsLanguageNote: string | null;
  selectedPreviewProvider: Provider | null;
  selectedPreviewProviderModelOptions: { id: string; name: string }[];
  selectedPreviewProviderModel: string;
  providerPreviewTexts: ProviderPreviewTexts;
  activePreview: { id: string; phase: PreviewButtonPhase } | null;
  nativeVoiceOptions: { value: string; label: string }[];
  selectedNativeVoice: string;
  nativePreviewText: string;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onUpdateProviderTtsModel: (provider: Provider, model: string) => void;
  onUpdateProviderTtsVoice: (provider: Provider, voice: string) => void;
  providerVoiceDirectories: ProviderVoiceDirectories;
  onStopPreviewVoice: () => Promise<void>;
  onSetProviderPreviewText: (
    provider: Provider,
    language: TtsListenLanguage,
    text: string,
  ) => void;
  onSetNativePreviewText: (text: string) => void;
  onPreviewProviderVoice: (
    provider: Provider,
    previewLanguage: TtsListenLanguage,
  ) => Promise<void>;
  onPreviewNativeVoice: () => Promise<void>;
  onSelectNativeVoice: (voiceId: string) => void;
  onTextInputFocus: TextInputFocusHandler;
  onToggleListenLanguage: (language: TtsListenLanguage) => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const ttsProviderOptions = buildProviderPickerOptions(
    selectableTtsProviders,
    settings.ttsProvider,
    t("providerNeedsAttention"),
  );
  const ttsInstructionsSupported =
    selectedPreviewProvider !== null &&
    providerTtsModelSupportsInstructions(
      selectedPreviewProvider,
      selectedPreviewProviderModel,
    );

  return (
    <View style={styles.tabPane}>
      <View style={styles.settingsSubsectionIntro}>
        <Text
          accessibilityRole="header"
          style={[styles.settingsSectionTitle, { color: colors.text }]}
        >
          {t("voiceOutput")}
        </Text>
        <Text
          style={[
            styles.settingsSectionDescription,
            { color: colors.textSecondary },
          ]}
        >
          {t("voiceOutputDescription")}
        </Text>
      </View>

      <View style={styles.settingsSubsectionStack}>
        <View style={styles.inlineSwitchRow}>
          <View style={styles.inlineSwitchCopy}>
            <Text
              accessibilityRole="header"
              style={[styles.groupLabel, { color: colors.text }]}
            >
              {t("spokenReplies")}
            </Text>
            <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
              {settings.spokenRepliesEnabled
                ? t("spokenRepliesEnabledDescription")
                : t("spokenRepliesDisabledDescription")}
            </Text>
          </View>
          <Switch
            value={settings.spokenRepliesEnabled}
            onValueChange={(value) => onUpdate({ spokenRepliesEnabled: value })}
            trackColor={{
              false: colors.border,
              true: colors.accent,
            }}
            thumbColor={colors.surface}
          />
        </View>

        <ListenLanguageSelector
          selectedLanguages={settings.ttsListenLanguages}
          onToggleLanguage={onToggleListenLanguage}
        />

        <RadioGroup<ReplyPlayback>
          label={t("replyPlayback")}
          options={[
            {
              value: "stream",
              label: t("sentencesArrive"),
              description: t("sentencesArriveDescription"),
            },
            {
              value: "wait",
              label: t("fullReplyFirst"),
              description: t("fullReplyFirstDescription"),
            },
          ]}
          value={settings.replyPlayback}
          onChange={(value) => onUpdate({ replyPlayback: value })}
        />

        <RadioGroup<TtsBackendMode>
          label={t("textToSpeech")}
          options={[
            {
              value: "native",
              label: t("systemVoice"),
              description: t("nativeTtsDescription"),
            },
            {
              value: "provider",
              label: t("provider"),
              description: t("providerTtsDescription"),
            },
          ]}
          value={settings.ttsMode}
          onChange={(value) => onUpdate({ ttsMode: value })}
        />

        {settings.ttsMode === "provider" ? (
          <>
            <PickerSection>
              <Picker
                label={t("ttsProvider")}
                value={settings.ttsProvider ?? ""}
                options={ttsProviderOptions}
                disabled={ttsProviderOptions.length === 0}
                onChange={(value) => onUpdate({ ttsProvider: value as Provider })}
              />
              {selectedPreviewProvider &&
              selectedPreviewProviderModelOptions.length > 1 ? (
                <Picker
                  label={t("model")}
                  value={selectedPreviewProviderModel}
                  options={selectedPreviewProviderModelOptions.map((model) => ({
                    value: model.id,
                    label: model.name,
                  }))}
                  onChange={(value) =>
                    onUpdateProviderTtsModel(selectedPreviewProvider, value)
                  }
                />
              ) : null}
              {ttsLanguageNote ? (
                <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
                  {t("languageCoverage", { note: ttsLanguageNote })}
                </Text>
              ) : null}
            </PickerSection>

            <View style={styles.settingsSubsectionStack}>
              <Text style={[styles.groupLabel, { color: colors.text }]}>
                {t("ttsInstructions")}
              </Text>
              <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
                {t(
                  ttsInstructionsSupported
                    ? "ttsInstructionsDescription"
                    : "ttsInstructionsUnsupported",
                )}
              </Text>
              <TextInput
                value={settings.ttsInstructions}
                onChangeText={(value) => onUpdate({ ttsInstructions: value })}
                editable={ttsInstructionsSupported}
                multiline
                placeholder={t("ttsInstructionsPlaceholder")}
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.accent}
                textAlignVertical="top"
                onFocus={onTextInputFocus}
                style={[
                  styles.promptInput,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                    color: colors.text,
                    opacity: ttsInstructionsSupported ? 1 : 0.55,
                  },
                ]}
              />
            </View>

            <ProviderVoicePreviewSection
              provider={selectedPreviewProvider}
              selectedLanguages={settings.ttsListenLanguages}
              settings={settings}
              previewTexts={providerPreviewTexts}
              activePreview={activePreview}
              onSetPreviewText={onSetProviderPreviewText}
              onPreviewProvider={onPreviewProviderVoice}
              onStopPreview={onStopPreviewVoice}
              onUpdateProviderTtsVoice={onUpdateProviderTtsVoice}
              providerVoiceDirectories={providerVoiceDirectories}
              onTextInputFocus={onTextInputFocus}
            />
          </>
        ) : null}

        {settings.ttsMode === "native" ? (
          <NativeVoicePreviewSection
            voiceOptions={nativeVoiceOptions}
            selectedVoice={selectedNativeVoice}
            previewText={nativePreviewText}
            activePreview={activePreview}
            onSelectVoice={onSelectNativeVoice}
            onSetPreviewText={onSetNativePreviewText}
            onPreview={onPreviewNativeVoice}
            onStopPreview={onStopPreviewVoice}
            onTextInputFocus={onTextInputFocus}
          />
        ) : null}

      </View>
    </View>
  );
}
