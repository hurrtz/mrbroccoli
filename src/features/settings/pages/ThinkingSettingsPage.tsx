import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { MIN_RESPONSE_MODES } from "../../../constants/providers/defaults";
import { PROVIDER_LABELS } from "../../../constants/models";
import { Input } from "../../../design-system/NativeControls";
import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import { useLocalization } from "../../../i18n";
import { useRuntimeCapabilityOverrides } from "../../../hooks/useRuntimeCapabilityOverrides";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type {
  Provider,
  ResponseMode,
  ResponseModeConfig,
  ResponseModeRoute,
  Settings,
} from "../../../types";
import {
  getModelEffortOptionLabel,
  getModelEffortOptions,
  getResponseModeRouteEffortLabel,
  normalizeResponseModeRouteEffort,
} from "../../../utils/modelEffort";
import {
  getAvailableResponseModes,
  getDefaultModelForProvider,
  getProviderLlmModelOptions,
} from "../../../utils/responseModes";
import type { TextInputFocusHandler } from "../../settings-core/types";
import {
  getResponseLengthOptions,
  getResponseToneOptions,
} from "../../settings-core/helpers";

import { RouteOptionRow } from "../settings-primitives/RouteOptionRow";
import { SettingsGroup } from "../settings-primitives/SettingsGroup";
import { SettingsChoiceRow } from "../settings-primitives/SettingsChoiceRow";
import { SettingsRow } from "../settings-primitives/SettingsRow";
import { SettingsSheet } from "../settings-primitives/SettingsSheet";
import { Switch } from "../../../design-system/Switch";
import { styles } from "../styles";

type SlotSheetView = "slot" | "provider" | "model";
type ThinkingSheet =
  | { kind: "slot"; modeId: ResponseMode; view: SlotSheetView }
  | { kind: "add" }
  | { kind: "council" }
  | { kind: "prompt" }
  | null;

function modeLabel(mode: ResponseModeConfig) {
  return mode.route.model;
}

function AnsweringModelRow({
  index,
  last,
  meta,
  mode,
  onPress,
}: {
  index: number;
  last: boolean;
  meta: string;
  mode: ResponseModeConfig;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { isRtl, t } = useLocalization();

  return (
    <Pressable
      testID={`thinking-slot-${mode.id}`}
      accessibilityLabel={`${t("responseModeItemTitle", { index })}. ${modeLabel(mode)}. ${meta}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        pageStyles.slotRow,
        { borderBottomColor: colors.border },
        last ? pageStyles.last : null,
        pressed ? { backgroundColor: colors.surfaceAlt } : null,
      ]}
    >
      <View
        style={[pageStyles.slotNumber, { borderColor: colors.borderStrong }]}
      >
        <Text
          style={[pageStyles.slotNumberText, { color: colors.textSecondary }]}
        >
          {index}
        </Text>
      </View>
      <View style={pageStyles.slotCopy}>
        <Text
          numberOfLines={1}
          style={[pageStyles.slotLabel, { color: colors.text }]}
        >
          {modeLabel(mode)}
        </Text>
        <Text style={[pageStyles.slotMeta, { color: colors.textMuted }]}>
          {meta}
        </Text>
      </View>
      <PhosphorIcon
        name={isRtl ? "left" : "right"}
        size="inline"
        color={colors.textMuted}
      />
    </Pressable>
  );
}

function EffortChips({
  mode,
  onChange,
}: {
  mode: ResponseModeConfig;
  onChange: (route: ResponseModeRoute) => void;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const options = getModelEffortOptions(mode.route.provider, mode.route.model);
  if (!options.length) {
    return null;
  }

  return (
    <View style={pageStyles.effortSection}>
      <Text style={[pageStyles.sheetCaption, { color: colors.textMuted }]}>
        {t("effort")}
      </Text>
      <View accessibilityRole="radiogroup" style={pageStyles.chips}>
        {options.map((option) => {
          const selected = option.id === mode.route.effort;
          return (
            <Pressable
              key={option.id}
              testID={`thinking-effort-${option.id}`}
              accessibilityLabel={getModelEffortOptionLabel(option, language)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() =>
                onChange(
                  normalizeResponseModeRouteEffort({
                    ...mode.route,
                    effort: option.id,
                  }),
                )
              }
              style={({ pressed }) => [
                pageStyles.chipTarget,
                pressed ? pageStyles.pressed : null,
              ]}
            >
              <View
                style={[
                  pageStyles.chip,
                  {
                    backgroundColor: selected
                      ? colors.accentSoft
                      : colors.surface,
                    borderColor: selected ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    pageStyles.chipText,
                    { color: selected ? colors.text : colors.textSecondary },
                  ]}
                >
                  {getModelEffortOptionLabel(option, language)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ProviderRows({
  onChoose,
  selectableProviders,
  selectedProvider,
}: {
  onChoose: (provider: Provider) => void;
  selectableProviders: readonly Provider[];
  selectedProvider?: Provider;
}) {
  const { t } = useLocalization();
  return (
    <SettingsGroup
      testID="thinking-provider-routes"
      title={t("provider")}
      footer={t("responseModesNoConfiguredProviders")}
    >
      {selectableProviders.map((provider, index) => (
        <RouteOptionRow
          key={provider}
          testID={`thinking-provider-${provider}`}
          label={PROVIDER_LABELS[provider]}
          last={index === selectableProviders.length - 1}
          meta={t("provider")}
          onSelect={() => onChoose(provider)}
          selected={selectedProvider === provider}
        />
      ))}
    </SettingsGroup>
  );
}

export function ThinkingSettingsPage({
  llmProviders,
  onAddResponseMode,
  onRemoveResponseMode,
  onTextInputFocus,
  onUpdate,
  onUpdateResponseModeRoute,
  settings,
}: {
  llmProviders: Provider[];
  onAddResponseMode: () => void;
  onRemoveResponseMode: (mode: ResponseMode) => void;
  onTextInputFocus?: TextInputFocusHandler;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onUpdateResponseModeRoute: (
    mode: ResponseMode,
    route: ResponseModeRoute,
  ) => void;
  settings: Settings;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  useRuntimeCapabilityOverrides();
  const [sheet, setSheet] = React.useState<ThinkingSheet>(null);
  const pendingProviderAdd = React.useRef<{
    ids: Set<ResponseMode>;
    route: ResponseModeRoute;
  } | null>(null);
  const visibleModes = settings.responseModes;
  const currentMode =
    sheet?.kind === "slot"
      ? settings.responseModes.find(({ id }) => id === sheet.modeId)
      : undefined;
  const readyModelCount = getAvailableResponseModes(settings).length;
  const canRemove = visibleModes.length > MIN_RESPONSE_MODES;
  const responseLengthOptions = React.useMemo(
    () =>
      getResponseLengthOptions(t).map(({ description, ...option }) => ({
        ...option,
        supporting: description,
      })),
    [t],
  );
  const responseToneOptions = React.useMemo(
    () =>
      getResponseToneOptions(t).map(({ description, ...option }) => ({
        ...option,
        supporting: description,
      })),
    [t],
  );

  React.useEffect(() => {
    const pending = pendingProviderAdd.current;
    if (!pending) {
      return;
    }
    const added = settings.responseModes.find(({ id }) => !pending.ids.has(id));
    if (!added) {
      return;
    }
    onUpdateResponseModeRoute(added.id, pending.route);
    setSheet({ kind: "slot", modeId: added.id, view: "slot" });
    pendingProviderAdd.current = null;
  }, [onUpdateResponseModeRoute, settings.responseModes]);

  React.useEffect(() => {
    if (sheet?.kind === "slot" && !currentMode) {
      setSheet(null);
    }
  }, [currentMode, sheet]);

  const addProviderRoute = (provider: Provider) => {
    pendingProviderAdd.current = {
      ids: new Set(settings.responseModes.map(({ id }) => id)),
      route: normalizeResponseModeRouteEffort({
        provider,
        model: getDefaultModelForProvider(provider),
      }),
    };
    onAddResponseMode();
  };

  const slotMeta = (mode: ResponseModeConfig) => {
    const route = mode.route;
    const effort = getResponseModeRouteEffortLabel(route, language);
    return [PROVIDER_LABELS[route.provider], effort]
      .filter(Boolean)
      .join(" · ");
  };

  const slotTitle = currentMode
    ? t("responseModeItemTitle", {
        index:
          visibleModes.findIndex(({ id }) => id === currentMode.id) + 1 || 1,
      })
    : t("addResponseMode");

  return (
    <View testID="thinking-settings-page" style={styles.sectionPageStack}>
      <SettingsGroup
        testID="model-selection-section"
        title={t("answeringModels")}
        footer={t("answeringModelsFooter")}
      >
        {visibleModes.map((mode, index) => (
          <AnsweringModelRow
            key={mode.id}
            index={index + 1}
            last={false}
            meta={slotMeta(mode)}
            mode={mode}
            onPress={() =>
              setSheet({ kind: "slot", modeId: mode.id, view: "slot" })
            }
          />
        ))}
        <SettingsRow
          testID="thinking-add-model"
          accent
          control={null}
          icon="plus"
          label={t("addResponseMode")}
          last
          onPress={() => setSheet({ kind: "add" })}
        />
      </SettingsGroup>

      <SettingsGroup
        testID="conversation-defaults-section"
        title={t("conversationDefaultsTitle")}
        footer={t("conversationDefaultsDescription")}
      >
        <SettingsChoiceRow
          testID="thinking-default-response-length"
          label={t("adaptiveLength")}
          onChange={(responseLength) => onUpdate({ responseLength })}
          options={responseLengthOptions}
          value={settings.responseLength}
        />
        <SettingsChoiceRow
          testID="thinking-default-response-tone"
          label={t("responseTone")}
          last
          onChange={(responseTone) => onUpdate({ responseTone })}
          options={responseToneOptions}
          value={settings.responseTone}
        />
      </SettingsGroup>

      <SettingsGroup
        testID="ulra-mode-settings-section"
        title={t("ulraMode")}
        footer={t("ulraModeSettingsDescription")}
      >
        <SettingsRow
          testID="thinking-council-row"
          icon="council"
          label={t("ulraMode")}
          last
          onPress={() => setSheet({ kind: "council" })}
          value={
            settings.ulraModeEnabled
              ? t("settingsReadinessReady")
              : t("settingsReadinessOff")
          }
        />
      </SettingsGroup>

      <SettingsGroup title={t("systemPrompt")}>
        <SettingsRow
          testID="thinking-system-prompt-row"
          icon="file-text"
          label={t("systemPrompt")}
          last
          onPress={() => setSheet({ kind: "prompt" })}
        />
      </SettingsGroup>

      <SettingsSheet
        testID="thinking-slot-sheet"
        title={slotTitle}
        visible={sheet?.kind === "slot"}
        onClose={() => setSheet(null)}
      >
        {currentMode && sheet?.kind === "slot" && sheet.view === "slot" ? (
          <>
            <Text style={[pageStyles.sheetHint, { color: colors.textMuted }]}>
              {t("answeringModelSheetHint")}
            </Text>
            <SettingsGroup>
              <SettingsRow
                testID="thinking-slot-provider"
                label={t("provider")}
                value={
                  PROVIDER_LABELS[currentMode.route.provider]
                }
                onPress={() => setSheet({ ...sheet, view: "provider" })}
              />
              <SettingsRow
                testID="thinking-slot-model"
                label={t("model")}
                last
                value={currentMode.route.model}
                onPress={() => setSheet({ ...sheet, view: "model" })}
              />
            </SettingsGroup>
            <EffortChips
              mode={currentMode}
              onChange={(route) =>
                onUpdateResponseModeRoute(currentMode.id, route)
              }
            />
            {canRemove ? (
              <SettingsGroup>
                <SettingsRow
                  testID="thinking-remove-model"
                  danger
                  control={null}
                  icon="delete"
                  label={t("removeResponseMode")}
                  last
                  onPress={() => {
                    onRemoveResponseMode(currentMode.id);
                    setSheet(null);
                  }}
                />
              </SettingsGroup>
            ) : null}
          </>
        ) : null}
        {currentMode && sheet?.kind === "slot" && sheet.view === "provider" ? (
          <>
            <SettingsRow
              icon="left"
              label={slotTitle}
              control={null}
              onPress={() => setSheet({ ...sheet, view: "slot" })}
            />
            <ProviderRows
              onChoose={(provider) => {
                onUpdateResponseModeRoute(
                  currentMode.id,
                  normalizeResponseModeRouteEffort({
                    provider,
                    model: getDefaultModelForProvider(provider),
                  }),
                );
                setSheet({ ...sheet, view: "slot" });
              }}
              selectableProviders={llmProviders}
              selectedProvider={currentMode.route.provider}
            />
          </>
        ) : null}
        {currentMode && sheet?.kind === "slot" && sheet.view === "model" ? (
          <>
            <SettingsRow
              icon="left"
              label={slotTitle}
              control={null}
              onPress={() => setSheet({ ...sheet, view: "slot" })}
            />
            <SettingsGroup
              title={PROVIDER_LABELS[currentMode.route.provider]}
            >
                {getProviderLlmModelOptions(currentMode.route.provider).map(
                  (model, index, models) => (
                    <RouteOptionRow
                      key={model.id}
                      label={model.name}
                      last={index === models.length - 1}
                      onSelect={() => {
                        onUpdateResponseModeRoute(
                          currentMode.id,
                          normalizeResponseModeRouteEffort({
                            provider: currentMode.route.provider,
                            model: model.id,
                          }),
                        );
                        setSheet({ ...sheet, view: "slot" });
                      }}
                      selected={currentMode.route.model === model.id}
                    />
                  ),
                )}
            </SettingsGroup>
          </>
        ) : null}
      </SettingsSheet>

      <SettingsSheet
        testID="thinking-add-sheet"
        title={t("addResponseMode")}
        visible={sheet?.kind === "add"}
        onClose={() => setSheet(null)}
      >
        <ProviderRows
          onChoose={addProviderRoute}
          selectableProviders={llmProviders}
        />
      </SettingsSheet>

      <SettingsSheet
        testID="thinking-council-sheet"
        title={t("ulraMode")}
        visible={sheet?.kind === "council"}
        onClose={() => setSheet(null)}
      >
        <Text style={[pageStyles.sheetHint, { color: colors.textMuted }]}>
          {t("ulraModeInfo")}
        </Text>
        <SettingsGroup>
          <SettingsRow
            control={
              <Switch
                label={t("ulraModeHomeLabel")}
                value={settings.ulraModeEnabled}
                onChange={(value) =>
                  onUpdate({
                    ulraModeEnabled: value,
                    ...(value ? {} : { ulraModeActive: false }),
                  })
                }
              />
            }
            label={t("ulraModeHomeLabel")}
            last
          />
        </SettingsGroup>
        {settings.ulraModeEnabled ? (
          <View style={pageStyles.effortSection}>
            <Text
              style={[pageStyles.sheetCaption, { color: colors.textMuted }]}
            >
              {t("councilRounds")}
            </Text>
            <View accessibilityRole="radiogroup" style={pageStyles.chips}>
              {[1, 2, 3, 4, 5].map((rounds) => {
                const selected = settings.ulraModeRounds + 1 === rounds;
                return (
                  <Pressable
                    key={rounds}
                    testID={`thinking-council-rounds-${rounds}`}
                    accessibilityLabel={`${t("councilRounds")}: ${rounds}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    onPress={() => onUpdate({ ulraModeRounds: rounds - 1 })}
                    style={({ pressed }) => [
                      pageStyles.chipTarget,
                      pressed ? pageStyles.pressed : null,
                    ]}
                  >
                    <View
                      style={[
                        pageStyles.chip,
                        {
                          backgroundColor: selected
                            ? colors.accentSoft
                            : colors.surface,
                          borderColor: selected ? colors.accent : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[pageStyles.chipText, { color: colors.text }]}
                      >
                        {rounds}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <Text
              style={[pageStyles.sheetHint, { color: colors.textSecondary }]}
            >
              {t("ulraModeCallEstimate", {
                count: readyModelCount * (settings.ulraModeRounds + 1) + 1,
              })}
            </Text>
            {readyModelCount > 4 || settings.ulraModeRounds + 1 > 4 ? (
              <Text
                testID="ulra-mode-threshold-warning"
                accessibilityRole="alert"
                style={[pageStyles.warning, { color: colors.danger }]}
              >
                {t("ulraModeThresholdWarning")}
              </Text>
            ) : null}
          </View>
        ) : null}
      </SettingsSheet>

      <SettingsSheet
        testID="thinking-system-prompt-sheet"
        title={t("systemPrompt")}
        visible={sheet?.kind === "prompt"}
        onClose={() => setSheet(null)}
      >
        <Text style={[pageStyles.sheetHint, { color: colors.textMuted }]}>
          {t("assistantInstructionsIntro")}
        </Text>
        <Input.TextArea
          testID="system-prompt-editor"
          value={settings.assistantInstructions}
          placeholder={t("assistantInstructionsPlaceholder")}
          placeholderTextColor={colors.textMuted}
          onFocus={onTextInputFocus}
          onChangeText={(assistantInstructions) =>
            onUpdate({ assistantInstructions })
          }
          rows={7}
          styles={{ container: pageStyles.promptInput }}
        />
      </SettingsSheet>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  slotRow: {
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  last: {
    borderBottomWidth: 0,
  },
  slotNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  slotNumberText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 14,
  },
  slotCopy: {
    flex: 1,
    minWidth: 0,
  },
  slotLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
  },
  slotMeta: {
    marginTop: 2,
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.4,
  },
  sheetHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
  sheetCaption: {
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  effortSection: {
    paddingTop: 14,
  },
  chips: {
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  chipTarget: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    minHeight: 34,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.68,
  },
  warning: {
    marginTop: 8,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
  },
  promptInput: {
    marginTop: 12,
    minHeight: 168,
  },
});
