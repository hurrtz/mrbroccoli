import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PhosphorIcon } from "../design-system/PhosphorIcon";
import type { Colors } from "../theme/colors";
import type { TranslateFn } from "../screens/main/shared";

interface IntroBannerProps {
  colors: Colors;
  onDismiss: () => void;
  onOpen: () => void;
  t: TranslateFn;
  visible: boolean;
}

/**
 * First-run strip above the workspace.
 *
 * It replaces the setup wizards that used to block the screen. A new user now
 * sees the real app immediately and is offered an explanation rather than
 * required to complete one, so this must stay dismissible and must never cover
 * the controls beneath it.
 */
export function IntroBanner({
  colors,
  onDismiss,
  onOpen,
  t,
  visible,
}: IntroBannerProps) {
  if (!visible) {
    return null;
  }

  return (
    <View
      accessibilityRole="summary"
      style={[
        styles.container,
        { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
      ]}
      testID="intro-banner"
    >
      <Pressable
        accessibilityHint={t("introBannerBody")}
        accessibilityLabel={t("introBannerTitle")}
        accessibilityRole="button"
        onPress={onOpen}
        style={styles.content}
        testID="intro-banner-open"
      >
        <View style={styles.text}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("introBannerTitle")}
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {t("introBannerBody")}
          </Text>
        </View>
        <Text style={[styles.action, { color: colors.accent }]}>
          {t("introBannerAction")}
        </Text>
      </Pressable>
      <Pressable
        accessibilityLabel={t("introBannerDismiss")}
        accessibilityRole="button"
        hitSlop={8}
        onPress={onDismiss}
        style={styles.dismiss}
        testID="intro-banner-dismiss"
      >
        <PhosphorIcon color={colors.textMuted} name="close" size="control" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    fontSize: 14,
    fontWeight: "600",
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
  },
  container: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    marginBottom: 12,
    paddingLeft: 14,
    paddingRight: 4,
  },
  content: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 12,
    // The row itself carries the 44pt minimum; the close button keeps its own.
    minHeight: 44,
    paddingVertical: 10,
  },
  dismiss: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
  },
});
