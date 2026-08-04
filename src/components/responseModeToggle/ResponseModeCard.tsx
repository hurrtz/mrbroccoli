import React from "react";
import { Pressable, Text, View } from "react-native";
import { PROVIDER_LABELS, getProviderModelName } from "../../constants/models";
import { getLocalModel } from "../../constants/localModels";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { ResponseMode, ResponseModeConfig } from "../../types";
import { getResponseModeRouteEffortLabel } from "../../utils/modelEffort";
import { ProviderIcon } from "../ProviderIcon";
import { getResponseModeCardModelLabels } from "./modelLabels";
import { responseModeToggleStyles as styles } from "./styles";

export interface ResponseModeCardProps {
  compact: boolean;
  detailedLayout: boolean;
  enlargeThreeCardIcons: boolean;
  mode: ResponseModeConfig;
  onMeasureModel: (measurementKey: string, lineCount: number) => void;
  onSelect: (mode: ResponseMode) => void;
  ready: boolean;
  selected: ResponseMode;
  singleMode: boolean;
  threeCardPortrait: boolean;
  threeCardPortraitOneLine: boolean;
}

interface CardContentProps {
  active: boolean;
  activeForeground: string;
  compact: boolean;
  effortLabel: string;
  highlighted: boolean;
  id: ResponseMode;
  local: boolean;
  modelLabel: string;
  modelMeasurementKey: string;
  onMeasureModel: (measurementKey: string, lineCount: number) => void;
  provider: ResponseModeConfig["route"]["provider"];
  secondaryForeground: string;
  singleMode: boolean;
  threeCardPortrait: boolean;
  threeCardPortraitOneLine: boolean;
}

function ProviderMark({
  activeForeground,
  compact,
  detailedLayout,
  enlargeThreeCardIcons,
  highlighted,
  id,
  local,
  provider,
  singleMode,
}: Pick<
  ResponseModeCardProps,
  "compact" | "detailedLayout" | "enlargeThreeCardIcons" | "singleMode"
> & {
  activeForeground: string;
  highlighted: boolean;
  id: ResponseMode;
  local: boolean;
  provider: ResponseModeConfig["route"]["provider"];
}) {
  const { colors } = useTheme();
  const size = detailedLayout
    ? singleMode
      ? "hero"
      : "feature"
    : enlargeThreeCardIcons
      ? "feature"
      : "navigation";

  return (
    <View
      testID={`response-mode-provider-${id}`}
      style={[
        styles.providerRow,
        compact ? styles.providerRowCompact : null,
        detailedLayout ? styles.providerRowDetailedPortrait : null,
        enlargeThreeCardIcons ? styles.providerRowThreeCardOneLine : null,
        detailedLayout && singleMode
          ? styles.providerRowDetailedPortraitSingle
          : null,
      ]}
    >
      {local ? (
        <PhosphorIcon
          name="cpu"
          color={highlighted ? activeForeground : colors.textSecondary}
          size={size}
        />
      ) : (
        <ProviderIcon
          provider={provider}
          color={highlighted ? activeForeground : colors.textSecondary}
          size={size}
        />
      )}
    </View>
  );
}

function DetailedModelDetails({
  active,
  activeForeground,
  effortLabel,
  highlighted,
  id,
  local,
  modelLabel,
  provider,
  secondaryForeground,
  singleMode,
}: CardContentProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const labels = local
    ? { family: t("settingsOnDevice"), name: modelLabel }
    : getResponseModeCardModelLabels(provider, modelLabel);

  return (
    <>
      <View
        testID={`response-mode-details-${id}`}
        style={[
          styles.modelDetails,
          singleMode ? styles.modelDetailsSingle : null,
        ]}
      >
        <Text
          testID={`response-mode-family-${id}`}
          style={[
            styles.modelFamily,
            singleMode ? styles.modelFamilySingle : null,
            { color: secondaryForeground },
            highlighted ? styles.highlightedMetadata : null,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {labels.family}
        </Text>
        <Text
          testID={`response-mode-model-${id}`}
          style={[
            styles.modelText,
            styles.modelTextDetailedPortrait,
            singleMode ? styles.modelTextDetailedPortraitSingle : null,
            {
              color: highlighted
                ? activeForeground
                : active
                  ? colors.text
                  : colors.textSecondary,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {labels.name}
        </Text>
        {!singleMode ? (
          <Text
            testID={`response-mode-effort-${id}`}
            style={[
              styles.modelEffort,
              { color: secondaryForeground },
              highlighted ? styles.highlightedMetadata : null,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {t("effortValue", { effort: effortLabel })}
          </Text>
        ) : null}
      </View>
      {singleMode ? (
        <View
          testID={`response-mode-effort-slot-${id}`}
          style={styles.modelEffortSingleSlot}
        >
          <Text
            testID={`response-mode-effort-label-${id}`}
            style={[
              styles.modelEffortSingleLabel,
              { color: secondaryForeground },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {t("effort")}
          </Text>
          <Text
            testID={`response-mode-effort-${id}`}
            style={[
              styles.modelEffortSingleValue,
              { color: secondaryForeground },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {effortLabel}
          </Text>
        </View>
      ) : null}
    </>
  );
}

function DenseModelDetails({
  active,
  activeForeground,
  compact,
  highlighted,
  id,
  modelLabel,
  modelMeasurementKey,
  onMeasureModel,
  threeCardPortrait,
  threeCardPortraitOneLine,
}: CardContentProps) {
  const { colors } = useTheme();

  return (
    <>
      <View
        testID={`response-mode-model-slot-${id}`}
        style={[
          styles.modelTextSlot,
          compact ? styles.modelTextSlotCompact : null,
          threeCardPortraitOneLine
            ? styles.modelTextSlotThreeCardOneLine
            : null,
        ]}
      >
        <Text
          testID={`response-mode-model-${id}`}
          style={[
            styles.modelText,
            compact ? styles.modelTextCompact : null,
            styles.modelTextDensePortrait,
            {
              color: highlighted
                ? activeForeground
                : active
                  ? colors.text
                  : colors.textSecondary,
            },
          ]}
          numberOfLines={2}
          onTextLayout={
            threeCardPortrait
              ? ({ nativeEvent }) =>
                  onMeasureModel(modelMeasurementKey, nativeEvent.lines.length)
              : undefined
          }
        >
          {modelLabel}
        </Text>
      </View>
      {compact ? <View style={styles.optionTrailingSpacerCompact} /> : null}
    </>
  );
}

export function ResponseModeCard({
  compact,
  detailedLayout,
  enlargeThreeCardIcons,
  mode: { id, route },
  onMeasureModel,
  onSelect,
  ready,
  selected,
  singleMode,
  threeCardPortrait,
  threeCardPortraitOneLine,
}: ResponseModeCardProps) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const active = id === selected;
  const highlighted = active && !singleMode;
  const activeForeground = colors.onActiveControl;
  const local = route.runtime === "local" && Boolean(route.localModelId);
  const localModel =
    local && route.localModelId ? getLocalModel(route.localModelId) : null;
  const modelLabel = local
    ? t(
        localModel?.capability === "llm" &&
          localModel.responseProfile === "thorough"
          ? "freeHomeThoroughMode"
          : "freeHomeQuickMode",
      )
    : getProviderModelName(route.provider, route.model);
  const routeLabel = local
    ? t("settingsOnDevice")
    : PROVIDER_LABELS[route.provider];
  const modelMeasurementKey = `${id}:${local ? "local" : route.provider}:${
    route.localModelId ?? route.model
  }`;
  const effortLabel =
    getResponseModeRouteEffortLabel(route, language) ?? t("fixed");
  const secondaryForeground = highlighted
    ? activeForeground
    : colors.textSecondary;
  const disabled = !ready || singleMode;
  const contentProps: CardContentProps = {
    active,
    activeForeground,
    compact,
    effortLabel,
    highlighted,
    id,
    local,
    modelLabel,
    modelMeasurementKey,
    onMeasureModel,
    provider: route.provider,
    secondaryForeground,
    singleMode,
    threeCardPortrait,
    threeCardPortraitOneLine,
  };

  return (
    <Pressable
      testID={`response-mode-option-${id}`}
      style={({ pressed }) => [
        styles.option,
        compact ? styles.optionCompactStack : styles.optionRow,
        compact ? styles.optionCompact : null,
        detailedLayout ? styles.optionDetailedPortrait : null,
        singleMode ? styles.optionSingle : null,
        compact && singleMode ? styles.optionSingleCompact : null,
        !ready ? styles.optionDisabled : null,
        highlighted
          ? {
              backgroundColor: colors.activeControl,
              borderColor: colors.activeControl,
            }
          : {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.inactiveControlBorder,
            },
        pressed && !disabled ? styles.optionPressed : null,
      ]}
      disabled={disabled}
      onPress={disabled ? undefined : () => onSelect(id)}
      accessibilityRole="button"
      accessibilityLabel={t("useResponseMode", {
        mode: local ? modelLabel : `${routeLabel}. ${modelLabel}`,
      })}
      accessibilityState={{ disabled, selected: active }}
    >
      <View
        testID={`response-mode-option-inner-${id}`}
        style={[
          styles.optionInner,
          compact ? styles.optionInnerCompact : null,
          detailedLayout ? styles.optionInnerDetailedPortrait : null,
          singleMode ? styles.optionInnerSingle : null,
          compact && singleMode ? styles.optionInnerSingleCompact : null,
          threeCardPortraitOneLine ? styles.optionInnerThreeCardOneLine : null,
        ]}
      >
        <View
          testID={`response-mode-option-content-${id}`}
          style={[
            styles.optionContent,
            compact ? styles.optionContentCompact : null,
            detailedLayout ? styles.optionContentDetailedPortrait : null,
            detailedLayout && singleMode
              ? styles.optionContentDetailedPortraitSingle
              : null,
            threeCardPortraitOneLine
              ? styles.optionContentThreeCardOneLine
              : null,
          ]}
        >
          {local ? (
            <Text
              testID={`response-mode-model-${id}`}
              style={[
                styles.localModeLabel,
                {
                  color: highlighted ? activeForeground : colors.text,
                },
              ]}
            >
              {modelLabel}
            </Text>
          ) : (
            <>
              <ProviderMark
                activeForeground={activeForeground}
                compact={compact}
                detailedLayout={detailedLayout}
                enlargeThreeCardIcons={enlargeThreeCardIcons}
                highlighted={highlighted}
                id={id}
                local={local}
                provider={route.provider}
                singleMode={singleMode}
              />
              {detailedLayout ? (
                <DetailedModelDetails {...contentProps} />
              ) : (
                <DenseModelDetails {...contentProps} />
              )}
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}
