import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";

export function RouteOptionRow({
  action,
  disabled = false,
  label,
  last = false,
  locked = false,
  meta,
  onRemove,
  onSelect,
  removeLabel,
  selected = false,
  sub,
  testID,
}: {
  action?: React.ReactNode;
  disabled?: boolean;
  label: string;
  last?: boolean;
  locked?: boolean;
  meta?: string;
  onRemove?: () => void;
  onSelect?: () => void;
  removeLabel?: string;
  selected?: boolean;
  sub?: React.ReactNode;
  testID?: string;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const unavailable = disabled || locked;
  const resolvedRemoveLabel = removeLabel ?? t("remove");
  const renderRightActions = onRemove
    ? () => (
        <Pressable
          accessibilityLabel={resolvedRemoveLabel}
          accessibilityRole="button"
          onPress={onRemove}
          style={[styles.removeAction, { backgroundColor: colors.dangerFill }]}
        >
          <PhosphorIcon name="delete" size="compact" color={colors.onDanger} />
          <Text style={[styles.removeText, { color: colors.onDanger }]}>
            {resolvedRemoveLabel}
          </Text>
        </Pressable>
      )
    : undefined;

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      enabled={Boolean(onRemove)}
    >
      <View
        testID={testID}
        style={[
          styles.wrapper,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
          last ? styles.last : null,
          locked ? styles.locked : null,
        ]}
      >
        <Pressable
          accessibilityLabel={label}
          accessibilityRole="radio"
          accessibilityState={{ checked: selected, disabled: unavailable }}
          disabled={unavailable || !onSelect}
          onPress={onSelect}
          style={({ pressed }) => [
            styles.main,
            pressed ? { backgroundColor: colors.surfaceAlt } : null,
          ]}
        >
          <View
            style={[
              styles.radio,
              {
                borderColor: selected ? colors.accent : colors.borderStrong,
                opacity: disabled ? 0.4 : 1,
              },
            ]}
          >
            {selected ? (
              <View
                style={[styles.radioDot, { backgroundColor: colors.accent }]}
              />
            ) : null}
          </View>
          <View style={styles.copy}>
            <Text
              numberOfLines={1}
              style={[styles.label, { color: colors.text }]}
            >
              {label}
            </Text>
            {meta ? (
              <Text style={[styles.meta, { color: colors.textMuted }]}>
                {meta}
              </Text>
            ) : null}
          </View>
          {locked ? (
            <PhosphorIcon name="lock" size="compact" color={colors.textMuted} />
          ) : (
            (action ?? null)
          )}
        </Pressable>
        {sub ? <View style={styles.sub}>{sub}</View> : null}
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  last: {
    borderBottomWidth: 0,
  },
  locked: {
    opacity: 0.5,
  },
  main: {
    minHeight: 30,
    marginHorizontal: -14,
    marginVertical: -11,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
  },
  meta: {
    marginTop: 2,
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.4,
  },
  sub: {
    marginTop: 8,
    marginLeft: 32,
  },
  removeAction: {
    width: 96,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  removeText: {
    fontFamily: fonts.display,
    fontSize: 13,
    lineHeight: 17,
  },
});
