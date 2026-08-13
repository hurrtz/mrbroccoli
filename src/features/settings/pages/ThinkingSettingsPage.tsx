import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  MAX_RESPONSE_MODES,
  MIN_RESPONSE_MODES,
} from "../../../constants/providers/defaults";
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
import type { LocalModelSettingsController } from "../../settings-core/useLocalModelSettings";
import type { TextInputFocusHandler } from "../../settings-core/types";

import {
  LocalModelAction,
  getLocalModelMeta,
  isLocalModelViable,
} from "../settings-primitives/LocalModelRouteGroup";
import { PremiumBand } from "../settings-primitives/PremiumBand";
import { RouteOptionRow } from "../settings-primitives/RouteOptionRow";
import { SettingsGroup } from "../settings-primitives/SettingsGroup";
import { SettingsRow } from "../settings-primitives/SettingsRow";
import { SettingsSheet } from "../settings-primitives/SettingsSheet";
import { SettingsSwitch } from "../settings-primitives/SettingsSwitch";
import { styles } from "../styles";

type SlotSheetView = "slot" | "provider" | "model";
type ThinkingSheet =
  | { kind: "slot"; modeId: ResponseMode; view: SlotSheetView }
  | { kind: "add" }
  | { kind: "council" }
  | { kind: "prompt" }
  | null;
type CompatibleLocalModel =
  LocalModelSettingsController["compatibleModels"][number];
type CompatibleLocalLlm = Extract<CompatibleLocalModel, { capability: "llm" }>;

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
  if (mode.route.runtime === "local") {
    return null;
  }
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

function LocalLlmRows({
  currentMode,
  isPremium,
  localModels,
  onChoose,
}: {
  currentMode?: ResponseModeConfig;
  isPremium: boolean;
  localModels: LocalModelSettingsController;
  onChoose: (model: CompatibleLocalLlm) => void;
}) {
  const { t } = useLocalization();
  const candidates = localModels.compatibleModels.filter(
    (model): model is CompatibleLocalLlm => {
      if (model.capability !== "llm") {
        return false;
      }
      if (
        isPremium ||
        !currentMode?.route.localModelId ||
        currentMode.route.runtime !== "local"
      ) {
        return true;
      }
      const current = localModels.compatibleModels.find(
        (candidate) => candidate.id === currentMode.route.localModelId,
      );
      return (
        current?.capability === "llm" &&
        current.responseProfile === model.responseProfile
      );
    },
  );

  return (
    <SettingsGroup
      testID="thinking-local-models"
      title={t("onDeviceThinkingModels")}
      footer={localModels.probeError ?? t("onDevicePerformanceCaution")}
    >
      {candidates.map((model, index) => {
        const busy = localModels.busy?.modelId === model.id;
        const installed = localModels.installs[model.id]?.verified === true;
        return (
          <RouteOptionRow
            key={model.id}
            testID={`thinking-local-model-${model.id}`}
            action={
              <LocalModelAction localModels={localModels} model={model} />
            }
            disabled={!isLocalModelViable(model, localModels) || busy}
            label={model.name}
            last={index === candidates.length - 1}
            meta={getLocalModelMeta(model, localModels, t)}
            onRemove={
              installed && !busy
                ? () => void localModels.removeModel(model)
                : undefined
            }
            onSelect={() => onChoose(model)}
            removeLabel={`${t("remove")}: ${model.name}`}
            selected={currentMode?.route.localModelId === model.id}
          />
        );
      })}
    </SettingsGroup>
  );
}

function ProviderRows({
  allProviders,
  isPremium,
  onChoose,
  onOpenPremium,
  selectableProviders,
  selectedProvider,
}: {
  allProviders: readonly Provider[];
  isPremium: boolean;
  onChoose: (provider: Provider) => void;
  onOpenPremium: () => void;
  selectableProviders: readonly Provider[];
  selectedProvider?: Provider;
}) {
  const { t } = useLocalization();
  const providers = isPremium ? selectableProviders : allProviders;
  return (
    <SettingsGroup
      testID="thinking-provider-routes"
      title={t("provider")}
      footer={
        isPremium
          ? t("responseModesNoConfiguredProviders")
          : t("premiumDescription")
      }
    >
      {providers.map((provider, index) => (
        <RouteOptionRow
          key={provider}
          testID={`thinking-provider-${provider}`}
          label={PROVIDER_LABELS[provider]}
          locked={!isPremium}
          last={index === providers.length - 1 && isPremium}
          meta={t("provider")}
          onSelect={() => onChoose(provider)}
          selected={selectedProvider === provider}
        />
      ))}
      {!isPremium ? (
        <PremiumBand
          actionLabel={t("upgradeToPremium")}
          copy={t("premiumDescription")}
          onPress={onOpenPremium}
          premiumLabel={t("premium")}
        />
      ) : null}
    </SettingsGroup>
  );
}

export function ThinkingSettingsPage({
  allLlmProviders,
  isPremium,
  llmProviders,
  localModels,
  onAddResponseMode,
  onOpenPremium,
  onRemoveResponseMode,
  onTextInputFocus,
  onUpdate,
  onUpdateResponseModeRoute,
  settings,
}: {
  allLlmProviders: Provider[];
  isPremium: boolean;
  llmProviders: Provider[];
  localModels: LocalModelSettingsController;
  onAddResponseMode: () => void;
  onOpenPremium: () => void;
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
  const visibleModes = React.useMemo(
    () =>
      isPremium
        ? settings.responseModes
        : settings.responseModes.filter(
            ({ route }) =>
              route.runtime === "local" && Boolean(route.localModelId),
          ),
    [isPremium, settings.responseModes],
  );
  const currentMode =
    sheet?.kind === "slot"
      ? settings.responseModes.find(({ id }) => id === sheet.modeId)
      : undefined;
  const readyModelCount = getAvailableResponseModes(settings).length;
  const canAdd = visibleModes.length < MAX_RESPONSE_MODES;
  const canRemove = visibleModes.length > MIN_RESPONSE_MODES;

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
    if (settings.responseModes.length >= MAX_RESPONSE_MODES) {
      return;
    }
    pendingProviderAdd.current = {
      ids: new Set(settings.responseModes.map(({ id }) => id)),
      route: normalizeResponseModeRouteEffort({
        provider,
        model: getDefaultModelForProvider(provider),
      }),
    };
    onAddResponseMode();
  };

  const chooseLocalModel = (model: CompatibleLocalLlm) => {
    if (currentMode && isPremium) {
      onUpdateResponseModeRoute(currentMode.id, {
        runtime: "local",
        localModelId: model.id,
        provider: settings.lastProvider,
        model: model.name,
      });
    } else {
      localModels.selectModel(model);
    }
    setSheet(null);
  };

  const slotMeta = (mode: ResponseModeConfig) => {
    const route = mode.route;
    const effort = getResponseModeRouteEffortLabel(route, language);
    return [
      route.runtime === "local"
        ? t("settingsOnDevice")
        : PROVIDER_LABELS[route.provider],
      effort,
    ]
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
        title={t("responseModes")}
        footer={t("modelSelectionInfo")}
      >
        {visibleModes.map((mode, index) => (
          <AnsweringModelRow
            key={mode.id}
            index={index + 1}
            last={!canAdd && index === visibleModes.length - 1}
            meta={slotMeta(mode)}
            mode={mode}
            onPress={() =>
              setSheet({ kind: "slot", modeId: mode.id, view: "slot" })
            }
          />
        ))}
        {canAdd ? (
          <SettingsRow
            testID="thinking-add-model"
            accent
            control={null}
            icon="plus"
            label={t("addResponseMode")}
            last
            onPress={() => setSheet({ kind: "add" })}
          />
        ) : null}
      </SettingsGroup>

      <SettingsGroup
        testID="ulra-mode-settings-section"
        title={t("ulraMode")}
        footer={t("ulraModeSettingsDescription")}
      >
        <SettingsRow
          testID="thinking-council-row"
          control={
            !isPremium ? (
              <PhosphorIcon
                name="lock"
                size="compact"
                color={colors.textMuted}
              />
            ) : undefined
          }
          icon="council"
          label={t("ulraMode")}
          last={isPremium}
          onPress={
            isPremium ? () => setSheet({ kind: "council" }) : onOpenPremium
          }
          value={
            settings.ulraModeEnabled
              ? t("settingsReadinessReady")
              : t("settingsReadinessOff")
          }
        />
        {!isPremium ? (
          <PremiumBand
            actionLabel={t("upgradeToPremium")}
            copy={t("premiumDescription")}
            onPress={onOpenPremium}
            premiumLabel={t("premium")}
          />
        ) : null}
      </SettingsGroup>

      <SettingsGroup title={t("systemPrompt")}>
        <SettingsRow
          testID="thinking-system-prompt-row"
          control={
            !isPremium ? (
              <PhosphorIcon
                name="lock"
                size="compact"
                color={colors.textMuted}
              />
            ) : undefined
          }
          icon="file-text"
          label={t("systemPrompt")}
          last={isPremium}
          onPress={
            isPremium ? () => setSheet({ kind: "prompt" }) : onOpenPremium
          }
        />
        {!isPremium ? (
          <PremiumBand
            actionLabel={t("upgradeToPremium")}
            copy={t("premiumDescription")}
            onPress={onOpenPremium}
            premiumLabel={t("premium")}
          />
        ) : null}
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
              {t("modelSelectionInfo")}
            </Text>
            <SettingsGroup>
              <SettingsRow
                testID="thinking-slot-provider"
                label={t("provider")}
                value={
                  currentMode.route.runtime === "local"
                    ? t("settingsOnDevice")
                    : PROVIDER_LABELS[currentMode.route.provider]
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
            <SettingsGroup title={t("onDeviceThinkingModels")}>
              <RouteOptionRow
                label={t("settingsOnDevice")}
                last
                meta={t("onDevicePerformanceMeasured")}
                onSelect={() => setSheet({ ...sheet, view: "model" })}
                selected={currentMode.route.runtime === "local"}
              />
            </SettingsGroup>
            <ProviderRows
              allProviders={allLlmProviders}
              isPremium={isPremium}
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
              onOpenPremium={onOpenPremium}
              selectableProviders={llmProviders}
              selectedProvider={
                currentMode.route.runtime === "local"
                  ? undefined
                  : currentMode.route.provider
              }
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
            {currentMode.route.runtime === "local" ? (
              <LocalLlmRows
                currentMode={currentMode}
                isPremium={isPremium}
                localModels={localModels}
                onChoose={chooseLocalModel}
              />
            ) : (
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
            )}
          </>
        ) : null}
      </SettingsSheet>

      <SettingsSheet
        testID="thinking-add-sheet"
        title={t("addResponseMode")}
        visible={sheet?.kind === "add"}
        onClose={() => setSheet(null)}
      >
        <LocalLlmRows
          isPremium={isPremium}
          localModels={localModels}
          onChoose={chooseLocalModel}
        />
        <ProviderRows
          allProviders={allLlmProviders}
          isPremium={isPremium}
          onChoose={addProviderRoute}
          onOpenPremium={onOpenPremium}
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
              <SettingsSwitch
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
              {t("ulraModeRounds")}
            </Text>
            <View accessibilityRole="radiogroup" style={pageStyles.chips}>
              {[1, 2, 3, 4, 5].map((rounds) => {
                const selected = settings.ulraModeRounds === rounds;
                return (
                  <Pressable
                    key={rounds}
                    testID={`thinking-council-rounds-${rounds}`}
                    accessibilityLabel={`${t("ulraModeRounds")}: ${rounds}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    onPress={() => onUpdate({ ulraModeRounds: rounds })}
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
            {readyModelCount > 4 || settings.ulraModeRounds > 3 ? (
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
