import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PROVIDER_LABELS, getProviderModelName } from "../constants/models";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import { Provider, ResponseMode, ResponseModeSelections } from "../types";
import { getResponseModeRouteEffortLabel } from "../utils/modelEffort";
import { getResponseModeIds } from "../utils/responseModes";
import { ProviderIcon } from "./ProviderIcon";

interface ResponseModeToggleProps {
  compact?: boolean;
  selected: ResponseMode;
  onSelect: (mode: ResponseMode) => void;
  modes: ResponseModeSelections;
  readyModes?: ResponseMode[];
}

type ModelLineMeasurements = Record<string, number>;

const MODEL_FAMILY_PATTERNS: Array<{
  family: string;
  pattern: RegExp;
}> = [
  { family: "Gemini", pattern: /^Gemini\s+(.+)$/i },
  { family: "Claude", pattern: /^Claude\s+(.+)$/i },
  { family: "GPT", pattern: /^GPT[-\s]+(.+)$/i },
  { family: "Grok", pattern: /^Grok\s+(.+)$/i },
  { family: "DeepSeek", pattern: /^DeepSeek[-\s]+(.+)$/i },
  { family: "Qwen", pattern: /^Qwen[-\s]*(.+)$/i },
  { family: "Kimi", pattern: /^Kimi\s+(.+)$/i },
  { family: "Moonshot", pattern: /^Moonshot\s+(.+)$/i },
  { family: "Doubao", pattern: /^Doubao\s+(.+)$/i },
  { family: "Mistral", pattern: /^Mistral\s+(.+)$/i },
  { family: "Ministral", pattern: /^Ministral\s+(.+)$/i },
  { family: "Magistral", pattern: /^Magistral\s+(.+)$/i },
  { family: "Devstral", pattern: /^Devstral\s+(.+)$/i },
  { family: "Voxtral", pattern: /^Voxtral\s+(.+)$/i },
];

export function getResponseModeCardModelLabels(
  provider: Provider,
  modelLabel: string,
) {
  const upstreamParts = modelLabel
    .split(/\s+·\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const compactLabel = upstreamParts.at(-1) ?? modelLabel;

  for (const { family, pattern } of MODEL_FAMILY_PATTERNS) {
    const match = compactLabel.match(pattern);
    if (match?.[1]) {
      return {
        family,
        name:
          family === "Qwen"
            ? match[1].replace("-", " ")
            : match[1],
      };
    }
  }

  const [firstWord, ...remainingWords] = compactLabel.split(/\s+/);
  if (remainingWords.length > 0) {
    return {
      family: firstWord,
      name: remainingWords.join(" "),
    };
  }

  return {
    family: PROVIDER_LABELS[provider],
    name: compactLabel,
  };
}

export function ResponseModeToggle({
  compact = false,
  selected,
  onSelect,
  modes,
  readyModes = getResponseModeIds(modes),
}: ResponseModeToggleProps) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const singleMode = modes.length === 1;
  const denseCompact = compact && modes.length === 4;
  const detailedLayout = modes.length <= 2;
  const denseLayout = modes.length >= 3;
  const threeCardPortrait = !compact && modes.length === 3;
  const threeCardCompact = compact && modes.length === 3;
  const detailedPortraitIconSize = singleMode ? 42 : 34;
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
      setModelLineMeasurements((current) => {
        if (current[measurementKey] === normalizedLineCount) {
          return current;
        }

        return {
          ...current,
          [measurementKey]: normalizedLineCount,
        };
      });
    },
    [],
  );

  return (
    <View
      testID="response-mode-list"
      style={[
        styles.container,
        compact ? styles.containerCompact : null,
        denseCompact ? styles.containerCompactDense : null,
      ]}
    >
      {modes.map(({ id, route }) => {
        const active = id === selected;
        const highlighted = active && !singleMode;
        const ready = readyModes.includes(id);
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
        const accessibilityRouteLabel = `${providerLabel}. ${modelLabel}`;
        return (
          <Pressable
            key={id}
            testID={`response-mode-option-${id}`}
            style={[
              styles.option,
              compact ? styles.optionCompactStack : styles.optionRow,
              compact ? styles.optionCompact : null,
              detailedLayout ? styles.optionDetailedPortrait : null,
              denseCompact ? styles.optionCompactDense : null,
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
            ]}
            disabled={!ready || singleMode}
            onPress={!ready || singleMode ? undefined : () => onSelect(id)}
            accessibilityRole="button"
            accessibilityLabel={`${t("useResponseMode", {
              mode: accessibilityRouteLabel,
            })}`}
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
                denseCompact ? styles.optionInnerCompactDense : null,
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
                  detailedLayout
                    ? styles.optionContentDetailedPortrait
                    : null,
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
                    detailedLayout
                      ? styles.providerRowDetailedPortrait
                      : null,
                    enlargeThreeCardIcons
                      ? styles.providerRowThreeCardOneLine
                      : null,
                    detailedLayout && singleMode
                      ? styles.providerRowDetailedPortraitSingle
                      : null,
                    denseCompact ? styles.providerRowCompactDense : null,
                  ]}
                >
                  <ProviderIcon
                    provider={route.provider}
                    color={
                      highlighted ? activeForeground : colors.textSecondary
                    }
                    size={
                      denseCompact
                        ? 22
                        : detailedLayout
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
                      key={threeCardPortrait ? modelMeasurementKey : undefined}
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
                              recordModelLineCount(
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
                  <View
                    style={[
                      styles.optionTrailingSpacerCompact,
                      denseCompact
                        ? styles.optionTrailingSpacerCompactDense
                        : null,
                    ]}
                  />
                ) : null}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 6,
  },
  containerCompact: {
    flexDirection: "column",
    gap: 5,
  },
  containerCompactDense: {
    gap: 4,
  },
  option: {
    minHeight: 82,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    alignSelf: "stretch",
  },
  optionRow: {
    flex: 1,
    minWidth: 0,
  },
  optionCompact: {
    minHeight: 54,
  },
  optionDetailedPortrait: {
    minHeight: 82,
  },
  optionCompactDense: {
    minHeight: 40,
  },
  optionCompactStack: {
    width: "100%",
    flexShrink: 0,
  },
  optionSingle: {
    minHeight: 80,
  },
  optionSingleCompact: {
    minHeight: 68,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionInner: {
    flex: 1,
    minHeight: 82,
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 9,
  },
  optionInnerCompact: {
    minHeight: 54,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  optionInnerDetailedPortrait: {
    minHeight: 82,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  optionInnerCompactDense: {
    minHeight: 40,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  optionInnerSingle: {
    minHeight: 80,
  },
  optionInnerSingleCompact: {
    minHeight: 68,
  },
  optionInnerThreeCardOneLine: {
    paddingVertical: 0,
  },
  optionContent: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  optionContentCompact: {
    flexDirection: "row",
  },
  optionContentDetailedPortrait: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
  },
  optionContentDetailedPortraitSingle: {
    justifyContent: "center",
  },
  optionContentThreeCardOneLine: {
    justifyContent: "space-evenly",
    gap: 0,
  },
  providerRow: {
    minHeight: 24,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  providerRowCompact: {
    width: 32,
    minHeight: 26,
    flexShrink: 0,
  },
  providerRowDetailedPortrait: {
    width: 40,
    minHeight: 34,
    flexShrink: 0,
  },
  providerRowDetailedPortraitSingle: {
    width: 48,
    minHeight: 42,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  providerRowThreeCardOneLine: {
    minHeight: 32,
  },
  providerRowCompactDense: {
    width: 28,
    minHeight: 22,
  },
  modelTextSlot: {
    height: 30,
    width: "100%",
    justifyContent: "flex-start",
  },
  modelTextSlotCompact: {
    flex: 1,
    width: "auto",
    height: 30,
    justifyContent: "center",
  },
  modelTextSlotThreeCardOneLine: {
    height: 15,
    transform: [{ translateY: -2 }],
  },
  modelText: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: fonts.display,
    textAlign: "center",
  },
  modelTextCompact: {
    fontSize: 12,
    lineHeight: 15,
  },
  modelTextDensePortrait: {
    fontFamily: fonts.body,
    fontWeight: "400",
  },
  modelDetails: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 1,
  },
  modelDetailsSingle: {
    flex: 0,
    flexShrink: 1,
    maxWidth: 240,
    alignItems: "center",
  },
  modelFamily: {
    fontSize: 10,
    lineHeight: 13,
    fontFamily: fonts.body,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  modelFamilySingle: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.7,
  },
  modelTextDetailedPortrait: {
    width: "100%",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "left",
  },
  modelTextDetailedPortraitSingle: {
    width: "auto",
    maxWidth: "100%",
    fontSize: 16,
    lineHeight: 21,
    fontFamily: fonts.displayHeavy,
    textAlign: "center",
  },
  modelEffort: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: fonts.body,
  },
  modelEffortSingleSlot: {
    position: "absolute",
    right: 3,
    top: 0,
    bottom: 0,
    width: 112,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  modelEffortSingleLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontFamily: fonts.body,
    fontWeight: "500",
    letterSpacing: 0.7,
    textTransform: "uppercase",
    maxWidth: "100%",
    textAlign: "right",
    opacity: 0.72,
  },
  modelEffortSingleValue: {
    fontSize: 11,
    lineHeight: 15,
    fontFamily: fonts.body,
    maxWidth: "100%",
    textAlign: "right",
    opacity: 0.78,
  },
  highlightedMetadata: {
    opacity: 0.82,
  },
  optionTrailingSpacerCompact: {
    width: 32,
    flexShrink: 0,
  },
  optionTrailingSpacerCompactDense: {
    width: 28,
  },
});
