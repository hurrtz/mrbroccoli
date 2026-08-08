import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PhosphorIcon } from "../design-system/PhosphorIcon";
import { introRadius, introTheme } from "./introFlow/introTheme";
import { fonts, textStyles } from "../theme/typography";
import type { TranslateFn } from "../screens/main/shared";

interface IntroBannerProps {
  onDismiss: () => void;
  onOpen: () => void;
  t: TranslateFn;
  visible: boolean;
}

/**
 * First-run invitation above the workspace.
 *
 * It replaces the setup wizards that used to block the screen, so its job is
 * to be noticed and then let go of. The workspace is warm white with green
 * accents; this card is deliberately dark, which makes it the one thing on a
 * first launch that clearly is not part of the furniture.
 *
 * The whole card opens the introduction. Dismissal is a distinct, smaller
 * target -- someone reaching to get rid of it should not land inside the flow.
 */
export function IntroBanner({
  onDismiss,
  onOpen,
  t,
  visible,
}: IntroBannerProps) {
  if (!visible) {
    return null;
  }

  return (
    <Pressable
      accessibilityHint={t("introBannerBody")}
      accessibilityLabel={t("introBannerTitle")}
      accessibilityRole="button"
      onPress={onOpen}
      style={({ pressed }) => [
        styles.card,
        { transform: [{ scale: pressed ? 0.99 : 1 }] },
      ]}
      testID="intro-banner"
    >
      <View accessible={false} style={styles.glow} />

      <View style={styles.row}>
        <View style={styles.mark}>
          <PhosphorIcon
            color={introTheme.onAccent}
            name="audio"
            size="navigation"
          />
        </View>

        <View style={styles.text}>
          <Text style={styles.title}>{t("introBannerTitle")}</Text>
          <Text style={styles.body}>{t("introBannerBody")}</Text>
        </View>

        <Pressable
          accessibilityLabel={t("introBannerDismiss")}
          accessibilityRole="button"
          hitSlop={10}
          onPress={onDismiss}
          style={styles.dismiss}
          testID="intro-banner-dismiss"
        >
          <PhosphorIcon
            color={introTheme.textMuted}
            name="close"
            size="compact"
          />
        </Pressable>
      </View>

      <View style={styles.action} testID="intro-banner-open">
        <Text style={styles.actionLabel}>{t("introBannerAction")}</Text>
        <PhosphorIcon color={introTheme.onAccent} name="right" size="compact" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: introTheme.accent,
    borderRadius: introRadius.pill,
    flexDirection: "row",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 16,
  },
  actionLabel: {
    color: introTheme.onAccent,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },
  body: {
    color: introTheme.textSecondary,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
  },
  card: {
    backgroundColor: introTheme.canvas,
    borderColor: introTheme.borderStrong,
    borderRadius: introRadius.panel,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 14,
    marginBottom: 12,
    overflow: "hidden",
    padding: 18,
  },
  dismiss: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    marginRight: -6,
    marginTop: -6,
    width: 32,
  },
  // A soft accent bloom behind the mark, echoing the reference input's inner
  // light. Decorative only, so it stays out of the accessibility tree.
  glow: {
    backgroundColor: introTheme.accentSoft,
    borderRadius: 999,
    height: 160,
    left: -40,
    position: "absolute",
    top: -70,
    width: 160,
  },
  mark: {
    alignItems: "center",
    backgroundColor: introTheme.accent,
    borderRadius: introRadius.control,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 14,
  },
  text: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...textStyles.sectionTitle,
    color: introTheme.text,
    fontSize: 20,
    lineHeight: 26,
  },
});
