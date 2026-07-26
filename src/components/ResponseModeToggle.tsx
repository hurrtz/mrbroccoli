import React from "react";
import Feather from "@expo/vector-icons/Feather";
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_MODAL_ORIENTATIONS } from "../constants/layout";
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

  if (modes.length >= 4) {
    return (
      <ResponseModeOverflowSelector
        compact={compact}
        modes={modes}
        onSelect={onSelect}
        readyModes={readyModes}
        selected={selected}
      />
    );
  }

  return (
    <View
      testID="response-mode-list"
      style={[
        styles.container,
        compact ? styles.containerCompact : null,
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
                  <View style={styles.optionTrailingSpacerCompact} />
                ) : null}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function ResponseModeOverflowSelector({
  compact,
  modes,
  onSelect,
  readyModes,
  selected,
}: {
  compact: boolean;
  modes: ResponseModeSelections;
  onSelect: (mode: ResponseMode) => void;
  readyModes: ResponseMode[];
  selected: ResponseMode;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const { height } = useWindowDimensions();
  const [open, setOpen] = React.useState(false);
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const sheetTranslateY = React.useRef(new Animated.Value(height)).current;
  const activeMode =
    modes.find(({ id }) => id === selected) ?? modes[0];

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const entranceAnimation = Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    entranceAnimation.start();

    return () => entranceAnimation.stop();
  }, [backdropOpacity, open, sheetTranslateY]);

  const openSheet = React.useCallback(() => {
    backdropOpacity.stopAnimation();
    sheetTranslateY.stopAnimation();
    backdropOpacity.setValue(0);
    sheetTranslateY.setValue(height);
    setOpen(true);
  }, [backdropOpacity, height, sheetTranslateY]);

  const closeSheet = React.useCallback(() => {
    backdropOpacity.stopAnimation();
    sheetTranslateY.stopAnimation();

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: height,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setOpen(false);
      }
    });
  }, [backdropOpacity, height, sheetTranslateY]);

  if (!activeMode) {
    return null;
  }

  const activeModelLabel = getProviderModelName(
    activeMode.route.provider,
    activeMode.route.model,
  );
  const activeCompactLabel = getResponseModeCardModelLabels(
    activeMode.route.provider,
    activeModelLabel,
  );
  const activeEffortLabel =
    getResponseModeRouteEffortLabel(activeMode.route, language) ?? t("fixed");

  return (
    <>
      <Pressable
        testID="response-mode-overflow-selector"
        accessibilityLabel={`${t("chooseResponseModel")}. ${activeModelLabel}`}
        accessibilityRole="button"
        onPress={openSheet}
        style={[
          styles.overflowSelector,
          compact ? styles.overflowSelectorCompact : null,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.inactiveControlBorder,
          },
        ]}
      >
        <View
          style={[
            styles.overflowSelectorProvider,
            compact ? styles.overflowSelectorProviderCompact : null,
          ]}
        >
          <ProviderIcon
            provider={activeMode.route.provider}
            color={colors.textSecondary}
            size={compact ? 36 : 42}
          />
        </View>
        <View style={styles.overflowSelectorModel}>
          <Text
            style={[
              styles.modelFamily,
              styles.modelFamilySingle,
              { color: colors.textSecondary },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activeCompactLabel.family}
          </Text>
          <Text
            style={[
              styles.modelText,
              styles.modelTextDetailedPortraitSingle,
              styles.overflowSelectorModelName,
              compact ? styles.overflowSelectorModelNameCompact : null,
              { color: colors.text },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activeCompactLabel.name}
          </Text>
        </View>
        <View
          style={[
            styles.overflowSelectorEffort,
            compact ? styles.overflowSelectorEffortCompact : null,
          ]}
        >
          <Text
            style={[
              styles.modelEffortSingleLabel,
              { color: colors.textSecondary },
            ]}
            numberOfLines={1}
          >
            {t("effort")}
          </Text>
          <Text
            style={[
              styles.modelEffortSingleValue,
              { color: colors.textSecondary },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activeEffortLabel}
          </Text>
        </View>
        <Feather
          name="chevron-down"
          size={compact ? 17 : 18}
          color={colors.textSecondary}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="none"
        supportedOrientations={APP_MODAL_ORIENTATIONS}
        statusBarTranslucent
        onRequestClose={closeSheet}
      >
        <View style={styles.overflowModalRoot}>
          <Animated.View
            testID="response-mode-overflow-backdrop-motion"
            style={[
              styles.overflowBackdrop,
              {
                backgroundColor: colors.overlay,
                opacity: backdropOpacity,
              },
            ]}
          >
            <Pressable
              testID="response-mode-overflow-backdrop"
              accessibilityLabel={t("dismiss")}
              accessibilityRole="button"
              onPress={closeSheet}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Animated.View
            testID="response-mode-overflow-sheet-motion"
            style={[
              styles.overflowSheetMotion,
              compact ? styles.overflowSheetMotionCompact : null,
              {
                transform: [{ translateY: sheetTranslateY }],
              },
            ]}
          >
            <SafeAreaView
              testID="response-mode-overflow-sheet"
              edges={["bottom"]}
              accessibilityViewIsModal
              style={[
                styles.overflowSheet,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  shadowColor: colors.glow,
                },
              ]}
            >
              <View
                style={[
                  styles.overflowSheetHandle,
                  { backgroundColor: colors.borderStrong },
                ]}
              />
              <View style={styles.overflowSheetHeader}>
                <View style={styles.overflowSheetHeaderCopy}>
                  <Text
                    accessibilityRole="header"
                    style={[styles.overflowSheetTitle, { color: colors.text }]}
                  >
                    {t("chooseResponseModel")}
                  </Text>
                  <Text
                    style={[
                      styles.overflowSheetSubtitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {t("responseModelCount", { count: modes.length })}
                  </Text>
                </View>
                <Pressable
                  testID="response-mode-overflow-close"
                  accessibilityLabel={t("dismiss")}
                  accessibilityRole="button"
                  hitSlop={10}
                  onPress={closeSheet}
                  style={styles.overflowSheetClose}
                >
                  <Feather name="x" size={20} color={colors.textSecondary} />
                </Pressable>
              </View>

              <FlatList
                testID="response-mode-overflow-list"
                data={modes}
                keyExtractor={({ id }) => id}
                style={styles.overflowList}
                contentContainerStyle={styles.overflowListContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const active = item.id === selected;
                  const ready = readyModes.includes(item.id);
                  const modelLabel = getProviderModelName(
                    item.route.provider,
                    item.route.model,
                  );
                  const effortLabel =
                    getResponseModeRouteEffortLabel(item.route, language) ??
                    t("fixed");

                  return (
                    <Pressable
                      testID={`response-mode-overflow-option-${item.id}`}
                      accessibilityLabel={`${t("useResponseMode", {
                        mode: `${PROVIDER_LABELS[item.route.provider]}. ${modelLabel}`,
                      })}`}
                      accessibilityRole="button"
                      accessibilityState={{
                        disabled: !ready,
                        selected: active,
                      }}
                      disabled={!ready}
                      onPress={() => {
                        onSelect(item.id);
                        closeSheet();
                      }}
                      style={[
                        styles.overflowOption,
                        {
                          backgroundColor: active
                            ? colors.accentSoft
                            : colors.surfaceElevated,
                          borderColor: active
                            ? colors.accent
                            : colors.border,
                          opacity: ready ? 1 : 0.5,
                        },
                      ]}
                    >
                      <View style={styles.overflowOptionProvider}>
                        <ProviderIcon
                          provider={item.route.provider}
                          color={
                            active ? colors.accent : colors.textSecondary
                          }
                          size={30}
                        />
                      </View>
                      <View style={styles.overflowOptionModel}>
                        <Text
                          style={[
                            styles.overflowOptionProviderLabel,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {PROVIDER_LABELS[item.route.provider]}
                        </Text>
                        <Text
                          style={[
                            styles.overflowOptionModelName,
                            { color: colors.text },
                          ]}
                        >
                          {modelLabel}
                        </Text>
                      </View>
                      <View style={styles.overflowOptionEffort}>
                        <Text
                          style={[
                            styles.modelEffortSingleLabel,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {t("effort")}
                        </Text>
                        <Text
                          style={[
                            styles.modelEffortSingleValue,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {effortLabel}
                        </Text>
                      </View>
                      <View style={styles.overflowOptionCheck}>
                        {active ? (
                          <Feather
                            name="check"
                            size={19}
                            color={colors.accent}
                          />
                        ) : null}
                      </View>
                    </Pressable>
                  );
                }}
              />
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </>
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
    justifyContent: "flex-start",
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
    flexShrink: 0,
  },
  providerRowThreeCardOneLine: {
    minHeight: 32,
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
    flex: 1,
    flexShrink: 1,
    maxWidth: 240,
    alignItems: "flex-start",
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
    width: "100%",
    maxWidth: "100%",
    fontSize: 16,
    lineHeight: 21,
    fontFamily: fonts.displayHeavy,
    textAlign: "left",
  },
  modelEffort: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: fonts.body,
  },
  modelEffortSingleSlot: {
    width: 64,
    flexShrink: 0,
    alignSelf: "stretch",
    marginLeft: 6,
    marginRight: 3,
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
  overflowSelector: {
    width: "100%",
    minHeight: 80,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    overflow: "hidden",
  },
  overflowSelectorCompact: {
    minHeight: 68,
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  overflowSelectorProvider: {
    width: 48,
    minHeight: 42,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  overflowSelectorProviderCompact: {
    width: 40,
    minHeight: 36,
  },
  overflowSelectorModel: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  overflowSelectorModelName: {
    width: "100%",
  },
  overflowSelectorModelNameCompact: {
    fontSize: 15,
    lineHeight: 20,
  },
  overflowSelectorEffort: {
    width: 56,
    flexShrink: 0,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  overflowSelectorEffortCompact: {
    width: 48,
  },
  overflowModalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overflowBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  overflowSheetMotion: {
    width: "100%",
    maxWidth: 680,
    maxHeight: "78%",
    alignSelf: "center",
  },
  overflowSheetMotionCompact: {
    maxHeight: "88%",
  },
  overflowSheet: {
    width: "100%",
    flexShrink: 1,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 8,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 18,
    overflow: "hidden",
  },
  overflowSheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    opacity: 0.72,
  },
  overflowSheetHeader: {
    minHeight: 70,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  overflowSheetHeaderCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  overflowSheetTitle: {
    fontSize: 19,
    lineHeight: 24,
    fontFamily: fonts.displayHeavy,
  },
  overflowSheetSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.body,
  },
  overflowSheetClose: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  overflowList: {
    flexGrow: 0,
    flexShrink: 1,
  },
  overflowListContent: {
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  overflowOption: {
    width: "100%",
    minHeight: 72,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  overflowOptionProvider: {
    width: 34,
    minHeight: 30,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  overflowOptionModel: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  overflowOptionProviderLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontFamily: fonts.body,
    fontWeight: "600",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  overflowOptionModelName: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.display,
  },
  overflowOptionEffort: {
    width: 68,
    flexShrink: 0,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  overflowOptionCheck: {
    width: 20,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
