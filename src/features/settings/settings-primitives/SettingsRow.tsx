import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type AccessibilityProps,
} from "react-native";

import {
  PhosphorIcon,
  type PhosphorIconName,
} from "../../../design-system/PhosphorIcon";
import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";

export function SettingsRow({
  accent = false,
  accessibilityHint,
  accessibilityLabel,
  control,
  danger = false,
  disabled = false,
  icon,
  label,
  last = false,
  onPress,
  testID,
  value,
}: {
  accent?: boolean;
  accessibilityHint?: string;
  accessibilityLabel?: string;
  control?: React.ReactNode | null;
  danger?: boolean;
  disabled?: boolean;
  icon?: PhosphorIconName;
  label: string;
  last?: boolean;
  onPress?: () => void;
  testID?: string;
  value?: string;
}) {
  const { colors } = useTheme();
  const { isRtl } = useLocalization();
  const labelColor = danger
    ? colors.danger
    : accent
      ? colors.accent
      : colors.text;
  const iconColor = danger
    ? colors.danger
    : accent
      ? colors.accent
      : colors.textSecondary;
  const accessibilityRole: AccessibilityProps["accessibilityRole"] = "button";

  const content = (
    <>
      {icon ? (
        <PhosphorIcon name={icon} size="compact" color={iconColor} />
      ) : null}
      <Text numberOfLines={1} style={[styles.label, { color: labelColor }]}>
        {label}
      </Text>
      {value ? (
        <Text
          numberOfLines={1}
          style={[styles.value, { color: colors.textSecondary }]}
        >
          {value}
        </Text>
      ) : null}
      {control !== undefined ? (
        control
      ) : (
        <PhosphorIcon
          name={isRtl ? "left" : "right"}
          size="inline"
          color={colors.textMuted}
        />
      )}
    </>
  );

  if (!onPress) {
    return (
      <View
        testID={testID}
        style={[
          styles.row,
          { borderBottomColor: colors.border },
          last ? styles.last : null,
          disabled ? styles.disabled : null,
        ]}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border },
        last ? styles.last : null,
        pressed ? { backgroundColor: colors.surfaceAlt } : null,
        disabled ? styles.disabled : null,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  last: {
    borderBottomWidth: 0,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
  },
  value: {
    maxWidth: "44%",
    flexShrink: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "right",
  },
});
