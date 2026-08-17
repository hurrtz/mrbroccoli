import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { fonts } from "../theme/typography";
import { useTheme } from "../theme/ThemeContext";
import {
  MIN_ICON_TOUCH_TARGET,
  PhosphorIcon,
  type PhosphorIconName,
} from "./PhosphorIcon";

const DECK_LAYERS = [
  { size: 26, left: 10, top: 0, opacity: 0.5 },
  { size: 29, left: 5, top: 4, opacity: 0.75 },
  { size: 32, left: 0, top: 8, opacity: 1 },
] as const;

function AttachmentDeck({ thumbnails }: { thumbnails: string[] }) {
  const shown = thumbnails.slice(0, 3);
  const layers = DECK_LAYERS.slice(DECK_LAYERS.length - shown.length);
  const { colors } = useTheme();

  return (
    <View style={styles.deck} testID="orb-satellite-image-deck">
      {layers.map((layer, index) => {
        const uri = shown[layers.length - 1 - index];
        return (
          <Image
            key={`${uri}-${layer.size}`}
            source={{ uri }}
            style={[
              styles.deckImage,
              {
                borderColor: colors.border,
                height: layer.size,
                left: layer.left,
                opacity: layer.opacity,
                top: layer.top,
                width: layer.size,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

/**
 * A 44pt control with a quiet label beneath it, sitting under the orb.
 * The target is borderless at rest. Toggles carry state through a filled,
 * accent-coloured glyph and matching label; the only container is the brief
 * accent-soft press feedback under the user's finger.
 */
export function OrbSatellite({
  icon,
  label,
  accessibilityLabel,
  kind = "action",
  active = false,
  compact = false,
  disabled = false,
  tone = "neutral",
  thumbnails,
  onPress,
  style,
  testID,
}: {
  icon: PhosphorIconName;
  /** Shown under the control, translated by the caller. One or two words. */
  label: string;
  /** Accessible name when the visible label is too terse. */
  accessibilityLabel?: string;
  /** Momentary action, or a switch that stays on. Defaults to action. */
  kind?: "action" | "toggle";
  /** Only meaningful for toggles. */
  active?: boolean;
  /** Icon-only, for a column with no room for labels. The name stays spoken. */
  compact?: boolean;
  /** Briefly unavailable, such as during an active turn. Absent when never usable. */
  disabled?: boolean;
  /** Transport verbs tint their glyph and label only — never a fill or border. */
  tone?: "neutral" | "danger" | "success";
  /** Replaces the image glyph with up to three pending attachment previews. */
  thumbnails?: string[];
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();
  const toggle = kind === "toggle";
  const on = toggle && active;
  const toneInk =
    tone === "danger"
      ? colors.danger
      : tone === "success"
        ? colors.success
        : null;
  const tint = toneInk ?? (on ? colors.accent : colors.textSecondary);

  return (
    <View style={[styles.column, compact ? styles.columnCompact : null, style]}>
      <Pressable
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole={toggle ? "switch" : "button"}
        accessibilityState={
          toggle ? { checked: !!active, disabled } : { disabled }
        }
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.well,
          pressed && !disabled ? { backgroundColor: colors.accentSoft } : null,
          disabled ? styles.disabled : null,
        ]}
        testID={testID ?? `orb-satellite-${icon}`}
      >
        {thumbnails?.length ? (
          <AttachmentDeck thumbnails={thumbnails} />
        ) : (
          <PhosphorIcon
            color={tint}
            name={icon}
            size="control"
            weight={on ? "fill" : "regular"}
          />
        )}
      </Pressable>
      {compact ? null : (
        <Text numberOfLines={2} style={[styles.label, { color: tint }]}>
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: "center",
    gap: 5,
    width: 64,
  },
  columnCompact: {
    width: MIN_ICON_TOUCH_TARGET,
  },
  well: {
    alignItems: "center",
    borderRadius: 12,
    height: MIN_ICON_TOUCH_TARGET,
    justifyContent: "center",
    width: MIN_ICON_TOUCH_TARGET,
  },
  deck: {
    height: 40,
    position: "relative",
    width: 36,
  },
  deckImage: {
    borderRadius: 7,
    borderWidth: StyleSheet.hairlineWidth,
    position: "absolute",
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.75,
    lineHeight: 12,
    textAlign: "center",
    textTransform: "uppercase",
  },
  disabled: {
    opacity: 0.38,
  },
});
