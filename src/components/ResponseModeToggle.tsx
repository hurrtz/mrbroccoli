import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PROVIDER_LABELS, getProviderModelName } from "../constants/models";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import { ResponseMode, ResponseModeSelections } from "../types";
import { getResponseModeIds } from "../utils/responseModes";
import { ProviderIcon } from "./ProviderIcon";

interface ResponseModeToggleProps {
  compact?: boolean;
  selected: ResponseMode;
  onSelect: (mode: ResponseMode) => void;
  modes: ResponseModeSelections;
  readyModes?: ResponseMode[];
}

export function ResponseModeToggle({
  compact = false,
  selected,
  onSelect,
  modes,
  readyModes = getResponseModeIds(modes),
}: ResponseModeToggleProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const singleMode = modes.length === 1;
  const denseCompact = compact && modes.length === 4;

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
        const accessibilityRouteLabel = `${providerLabel}. ${modelLabel}`;
        return (
          <Pressable
            key={id}
            testID={`response-mode-option-${id}`}
            style={[
              styles.option,
              compact ? styles.optionCompactStack : styles.optionRow,
              compact ? styles.optionCompact : null,
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
                denseCompact ? styles.optionInnerCompactDense : null,
                singleMode ? styles.optionInnerSingle : null,
                compact && singleMode ? styles.optionInnerSingleCompact : null,
              ]}
            >
              <View
                style={[
                  styles.optionContent,
                  compact ? styles.optionContentCompact : null,
                ]}
              >
                <View
                  style={[
                    styles.providerRow,
                    compact ? styles.providerRowCompact : null,
                    denseCompact ? styles.providerRowCompactDense : null,
                  ]}
                >
                  <ProviderIcon
                    provider={route.provider}
                    color={
                      highlighted ? activeForeground : colors.textSecondary
                    }
                    size={denseCompact ? 22 : compact ? 26 : 24}
                  />
                </View>

                <View
                  testID={`response-mode-model-slot-${id}`}
                  style={[
                    styles.modelTextSlot,
                    compact ? styles.modelTextSlotCompact : null,
                  ]}
                >
                  <Text
                    testID={`response-mode-model-${id}`}
                    style={[
                      styles.modelText,
                      compact ? styles.modelTextCompact : null,
                      {
                        color: highlighted
                          ? activeForeground
                          : active
                            ? colors.text
                            : colors.textSecondary,
                      },
                    ]}
                    numberOfLines={singleMode ? 1 : 2}
                  >
                    {modelLabel}
                  </Text>
                </View>
                {compact ? (
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
  optionCompactDense: {
    minHeight: 46,
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
  optionInnerCompactDense: {
    minHeight: 46,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  optionInnerSingle: {
    minHeight: 80,
  },
  optionInnerSingleCompact: {
    minHeight: 68,
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
  optionTrailingSpacerCompact: {
    width: 32,
    flexShrink: 0,
  },
  optionTrailingSpacerCompactDense: {
    width: 28,
  },
});
