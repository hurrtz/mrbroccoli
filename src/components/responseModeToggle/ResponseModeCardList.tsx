import React from "react";
import { Pressable, Text, View } from "react-native";
import {
  PROVIDER_LABELS,
  getProviderModelName,
} from "../../constants/models";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import {
  ResponseMode,
  ResponseModeConfig,
  ResponseModeSelections,
} from "../../types";
import { getResponseModeRouteEffortLabel } from "../../utils/modelEffort";
import { ProviderIcon } from "../ProviderIcon";
import { getResponseModeCardModelLabels } from "./modelLabels";
import { responseModeToggleStyles as styles } from "./styles";

type ModelLineMeasurements = Record<string, number>;

interface ResponseModeCardListProps {
  compact: boolean;
  modes: ResponseModeSelections;
  onSelect: (mode: ResponseMode) => void;
  readyModes: ResponseMode[];
  selected: ResponseMode;
}

interface ResponseModeCardProps {
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

function ResponseModeCard({
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
  const providerLabel = PROVIDER_LABELS[route.provider];
  const modelLabel = getProviderModelName(route.provider, route.model);
  const compactModelLabel = getResponseModeCardModelLabels(
    route.provider,
    modelLabel,
  );
  const modelMeasurementKey = `${id}:${route.provider}:${route.model}`;
  const effortLabel =
    getResponseModeRouteEffortLabel(route, language) ?? t("fixed");
  const secondaryForeground = highlighted
    ? activeForeground
    : colors.textSecondary;
  const detailedPortraitIconSize = singleMode ? 42 : 34;
  const denseLayout = !detailedLayout;

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
        pressed && ready && !singleMode ? styles.optionPressed : null,
      ]}
      disabled={!ready || singleMode}
      onPress={!ready || singleMode ? undefined : () => onSelect(id)}
      accessibilityRole="button"
      accessibilityLabel={t("useResponseMode", {
        mode: `${providerLabel}. ${modelLabel}`,
      })}
      accessibilityState={{
        disabled: !ready || singleMode,
        selected: active,
      }}
    >
      <View
        testID={`response-mode-option-inner-${id}`}
        style={[
          styles.optionInner,
          compact ? styles.optionInnerCompact : null,
          detailedLayout ? styles.optionInnerDetailedPortrait : null,
          singleMode ? styles.optionInnerSingle : null,
          compact && singleMode ? styles.optionInnerSingleCompact : null,
          threeCardPortraitOneLine
            ? styles.optionInnerThreeCardOneLine
            : null,
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
          <View
            testID={`response-mode-provider-${id}`}
            style={[
              styles.providerRow,
              compact ? styles.providerRowCompact : null,
              detailedLayout ? styles.providerRowDetailedPortrait : null,
              enlargeThreeCardIcons
                ? styles.providerRowThreeCardOneLine
                : null,
              detailedLayout && singleMode
                ? styles.providerRowDetailedPortraitSingle
                : null,
            ]}
          >
            <ProviderIcon
              provider={route.provider}
              color={
                highlighted ? activeForeground : colors.textSecondary
              }
              size={
                detailedLayout
                  ? detailedPortraitIconSize
                  : enlargeThreeCardIcons
                    ? 32
                    : compact
                      ? 26
                      : 24
              }
            />
          </View>

          {detailedLayout ? (
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
                {compactModelLabel.family}
              </Text>
              <Text
                testID={`response-mode-model-${id}`}
                style={[
                  styles.modelText,
                  styles.modelTextDetailedPortrait,
                  singleMode
                    ? styles.modelTextDetailedPortraitSingle
                    : null,
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
                {compactModelLabel.name}
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
          ) : (
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
                  denseLayout ? styles.modelTextDensePortrait : null,
                  {
                    color: highlighted
                      ? activeForeground
                      : active
                        ? colors.text
                        : colors.textSecondary,
                  },
                ]}
                numberOfLines={singleMode ? 1 : 2}
                onTextLayout={
                  threeCardPortrait
                    ? ({ nativeEvent }) =>
                        onMeasureModel(
                          modelMeasurementKey,
                          nativeEvent.lines.length,
                        )
                    : undefined
                }
              >
                {modelLabel}
              </Text>
            </View>
          )}
          {detailedLayout && singleMode ? (
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
          {compact && !detailedLayout ? (
            <View style={styles.optionTrailingSpacerCompact} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export function ResponseModeCardList({
  compact,
  modes,
  onSelect,
  readyModes,
  selected,
}: ResponseModeCardListProps) {
  const singleMode = modes.length === 1;
  const detailedLayout = modes.length <= 2;
  const threeCardPortrait = !compact && modes.length === 3;
  const threeCardCompact = compact && modes.length === 3;
  const [modelLineMeasurements, setModelLineMeasurements] =
    React.useState<ModelLineMeasurements>({});
  const threeCardPortraitOneLine =
    threeCardPortrait &&
    modes.every(
      ({ id, route }) =>
        modelLineMeasurements[
          `${id}:${route.provider}:${route.model}`
        ] === 1,
    );
  const enlargeThreeCardIcons =
    threeCardCompact || threeCardPortraitOneLine;

  const recordModelLineCount = React.useCallback(
    (measurementKey: string, lineCount: number) => {
      const normalizedLineCount = lineCount > 1 ? 2 : 1;
      setModelLineMeasurements((current) =>
        current[measurementKey] === normalizedLineCount
          ? current
          : {
              ...current,
              [measurementKey]: normalizedLineCount,
            },
      );
    },
    [],
  );

  return (
    <View
      testID="response-mode-list"
      style={[
        styles.container,
        compact ? styles.containerCompact : null,
      ]}
    >
      {modes.map((mode) => (
        <ResponseModeCard
          key={mode.id}
          compact={compact}
          detailedLayout={detailedLayout}
          enlargeThreeCardIcons={enlargeThreeCardIcons}
          mode={mode}
          onMeasureModel={recordModelLineCount}
          onSelect={onSelect}
          ready={readyModes.includes(mode.id)}
          selected={selected}
          singleMode={singleMode}
          threeCardPortrait={threeCardPortrait}
          threeCardPortraitOneLine={threeCardPortraitOneLine}
        />
      ))}
    </View>
  );
}
