import React from "react";
import {
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { ProviderIcon } from "../components/ProviderIcon";
import type { Provider } from "../types";
import { fonts } from "../theme/typography";
import { useTheme } from "../theme/ThemeContext";
import type { AttachmentPopoverAnchor } from "./AttachmentPopover";
import { PhosphorIcon } from "./PhosphorIcon";

const POPOVER_WIDTH = 252;
const SCREEN_MARGIN = 12;
const TILE_WIDTH = 72;
const MIN_ROUNDS = 1;
const MAX_ROUNDS = 5;

export interface CouncilPopoverModel {
  id: string;
  label: string;
  provider: Provider;
  selected: boolean;
}

function CouncilRoundsSlider({
  accessibilityLabel,
  onChange,
  rounds,
}: {
  accessibilityLabel: string;
  onChange: (rounds: number) => void;
  rounds: number;
}) {
  const { colors } = useTheme();
  const [trackWidth, setTrackWidth] = React.useState(0);
  const updateFromX = React.useCallback(
    (x: number) => {
      if (trackWidth <= 0) {
        return;
      }
      const ratio = Math.max(0, Math.min(1, x / trackWidth));
      onChange(Math.round(ratio * (MAX_ROUNDS - MIN_ROUNDS)) + MIN_ROUNDS);
    },
    [onChange, trackWidth],
  );
  const responder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          Math.abs(gesture.dx) > 2,
        onPanResponderGrant: (event) =>
          updateFromX(event.nativeEvent.locationX),
        onPanResponderMove: (event) =>
          updateFromX(event.nativeEvent.locationX),
        onPanResponderRelease: (event) =>
          updateFromX(event.nativeEvent.locationX),
      }),
    [updateFromX],
  );
  const ratio = (rounds - MIN_ROUNDS) / (MAX_ROUNDS - MIN_ROUNDS);

  return (
    <View style={styles.roundsSection}>
      <View style={styles.roundsHeader}>
        <Text style={[styles.monoLabel, { color: colors.textSecondary }]}>
          {accessibilityLabel}
        </Text>
        <Text style={[styles.monoLabel, { color: colors.accent }]}>
          {rounds}
        </Text>
      </View>
      <Pressable
        accessibilityActions={[{ name: "decrement" }, { name: "increment" }]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="adjustable"
        accessibilityValue={{
          min: MIN_ROUNDS,
          max: MAX_ROUNDS,
          now: rounds,
          text: `${rounds}`,
        }}
        onAccessibilityAction={(event) =>
          onChange(
            event.nativeEvent.actionName === "increment"
              ? Math.min(MAX_ROUNDS, rounds + 1)
              : Math.max(MIN_ROUNDS, rounds - 1),
          )
        }
        onLayout={(event) =>
          setTrackWidth(Math.round(event.nativeEvent.layout.width))
        }
        onPress={(event) => updateFromX(event.nativeEvent.locationX)}
        style={styles.sliderTarget}
        testID="council-rounds-slider"
        {...responder.panHandlers}
      >
        <View
          style={[styles.sliderTrack, { backgroundColor: colors.turnTrack }]}
        >
          <View
            style={[
              styles.sliderFill,
              { backgroundColor: colors.accent, width: `${ratio * 100}%` },
            ]}
          />
          <View
            style={[
              styles.sliderThumb,
              {
                backgroundColor: colors.surface,
                borderColor: colors.accent,
                left: `${ratio * 100}%`,
              },
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
}

export function CouncilPopover({
  anchor,
  costSummary,
  models,
  onChangeRounds,
  onClose,
  onToggleModel,
  rounds,
  roundsLabel,
  visible,
}: {
  anchor: AttachmentPopoverAnchor | null;
  costSummary: string;
  models: CouncilPopoverModel[];
  onChangeRounds: (rounds: number) => void;
  onClose: () => void;
  onToggleModel: (modeId: string) => void;
  rounds: number;
  roundsLabel: string;
  visible: boolean;
}) {
  const { colors } = useTheme();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [panelHeight, setPanelHeight] = React.useState(218);

  if (!visible || !anchor) {
    return null;
  }

  const left = Math.max(
    SCREEN_MARGIN,
    Math.min(
      anchor.x + anchor.width - POPOVER_WIDTH,
      windowWidth - POPOVER_WIDTH - SCREEN_MARGIN,
    ),
  );
  const preferredTop = anchor.y - panelHeight - 10;
  const top =
    preferredTop >= SCREEN_MARGIN
      ? preferredTop
      : Math.min(
          windowHeight - panelHeight - SCREEN_MARGIN,
          anchor.y + anchor.height + 10,
        );

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible
    >
      <View style={styles.overlay} testID="council-popover-overlay">
        <Pressable
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
          testID="council-popover-dismiss"
        />
        <View
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          onLayout={(event) =>
            setPanelHeight(Math.round(event.nativeEvent.layout.height))
          }
          style={[
            styles.panel,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.surfaceRaisedBorder,
              left,
              shadowColor: colors.overlay,
              top,
            },
          ]}
          testID="council-popover"
        >
          <ScrollView
            contentContainerStyle={styles.models}
            horizontal
            showsHorizontalScrollIndicator={false}
            testID="council-model-list"
          >
            {models.map((model) => {
              const tint = model.selected ? colors.accent : colors.textSecondary;
              return (
                <Pressable
                  accessibilityLabel={model.label}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: model.selected }}
                  key={model.id}
                  onPress={() => onToggleModel(model.id)}
                  style={({ pressed }) => [
                    styles.modelTile,
                    {
                      backgroundColor: model.selected
                        ? colors.accentSoft
                        : "transparent",
                      borderColor: model.selected ? colors.accent : colors.border,
                      opacity: pressed ? 0.72 : 1,
                    },
                  ]}
                  testID={`council-model-${model.id}`}
                >
                  <ProviderIcon
                    color={tint}
                    provider={model.provider}
                    size="navigation"
                  />
                  <Text
                    numberOfLines={2}
                    style={[styles.modelLabel, { color: tint }]}
                  >
                    {model.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <CouncilRoundsSlider
            accessibilityLabel={roundsLabel}
            onChange={onChangeRounds}
            rounds={rounds}
          />
          <View style={[styles.band, { backgroundColor: colors.border }]} />
          <View style={styles.costRow}>
            <PhosphorIcon
              color={colors.textMuted}
              name="info-circle"
              size="compact"
              style={styles.infoIcon}
            />
            <Text style={[styles.costText, { color: colors.textSecondary }]}>
              {costSummary}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  band: { height: 6, opacity: 0.55 },
  costRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    paddingBottom: 12,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  costText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 12,
  },
  infoIcon: { marginTop: 1 },
  modelLabel: {
    fontFamily: fonts.body,
    fontSize: 10.5,
    lineHeight: 13,
    textAlign: "center",
  },
  modelTile: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    flexShrink: 0,
    gap: 6,
    minHeight: 72,
    paddingBottom: 8,
    paddingHorizontal: 4,
    paddingTop: 10,
    width: TILE_WIDTH,
  },
  models: { gap: 8, padding: 12 },
  monoLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.65,
    lineHeight: 14,
    textTransform: "uppercase",
  },
  overlay: { flex: 1 },
  panel: {
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 12,
    overflow: "hidden",
    position: "absolute",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 34,
    width: POPOVER_WIDTH,
  },
  roundsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roundsSection: { gap: 3, paddingHorizontal: 14, paddingVertical: 10 },
  sliderFill: {
    borderRadius: 2,
    bottom: 0,
    left: 0,
    position: "absolute",
    top: 0,
  },
  sliderTarget: { justifyContent: "center", minHeight: 44 },
  sliderThumb: {
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    height: 18,
    marginLeft: -9,
    marginTop: -7,
    position: "absolute",
    top: "50%",
    width: 18,
  },
  sliderTrack: { borderRadius: 2, height: 4, position: "relative" },
});
