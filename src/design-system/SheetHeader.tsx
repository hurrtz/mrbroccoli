import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import { IconButton } from "./IconButton";

/**
 * Shared bottom-sheet chrome. In portrait the 44pt grabber target owns both
 * tap-to-close and the parent Modal's pull-down responder. Landscape sheets
 * become centred dialogs, so they retain a conventional labelled close action.
 */
export function SheetHeader({
  closeAccessibilityLabel,
  onClose,
  subtitle,
  testID,
  title,
}: {
  closeAccessibilityLabel: string;
  onClose: () => void;
  subtitle?: string | null;
  testID?: string;
  title: string;
}) {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const isPortrait = height > width;

  return (
    <View
      style={[styles.header, !isPortrait ? styles.dialogHeader : null]}
      testID={testID}
    >
      {isPortrait ? (
        <Pressable
          accessibilityLabel={closeAccessibilityLabel}
          accessibilityRole="button"
          onPress={onClose}
          style={styles.grabberTarget}
          testID={testID ? `${testID}-handle` : undefined}
        >
          <View
            style={[styles.grabber, { backgroundColor: colors.borderStrong }]}
          />
        </Pressable>
      ) : null}

      <View style={styles.copy}>
        <Text
          accessibilityRole="header"
          ellipsizeMode="tail"
          numberOfLines={1}
          style={[styles.title, { color: colors.text }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={2}
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {!isPortrait ? (
        <IconButton
          accessibilityLabel={closeAccessibilityLabel}
          icon="close"
          onPress={onClose}
          style={styles.close}
          testID={testID ? `${testID}-close` : undefined}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 78,
    paddingBottom: 12,
    paddingHorizontal: 60,
    position: "relative",
  },
  dialogHeader: {
    minHeight: 56,
    paddingBottom: 10,
    paddingTop: 10,
  },
  grabberTarget: {
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    minHeight: 44,
    paddingTop: 9,
  },
  grabber: {
    borderRadius: 2,
    height: 4,
    width: 38,
  },
  copy: {
    alignItems: "center",
    gap: 4,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: 17,
    fontWeight: "400",
    letterSpacing: -0.2,
    lineHeight: 22,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  close: {
    position: "absolute",
    right: 4,
    top: 6,
  },
});
