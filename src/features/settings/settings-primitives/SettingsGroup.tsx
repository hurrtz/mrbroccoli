import React from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";

export function SettingsGroup({
  children,
  footer,
  style,
  testID,
  title,
}: {
  children?: React.ReactNode;
  footer?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  title?: string;
}) {
  const { colors } = useTheme();

  return (
    <View testID={testID} style={[styles.group, style]}>
      {title ? (
        <Text style={[styles.title, { color: colors.textMuted }]}>{title}</Text>
      ) : null}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {children}
      </View>
      {footer ? (
        <Text style={[styles.footer, { color: colors.textMuted }]}>
          {footer}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    paddingTop: 14,
  },
  title: {
    marginBottom: 6,
    marginHorizontal: 14,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  footer: {
    marginTop: 6,
    marginHorizontal: 14,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
});
