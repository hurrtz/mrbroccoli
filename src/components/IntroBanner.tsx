import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PhosphorIcon } from "../design-system/PhosphorIcon";
import { introBannerTheme, introRadius } from "./introFlow/introTheme";
import { fonts } from "../theme/typography";
import type { TranslateFn } from "../screens/main/shared";

interface IntroBannerProps {
  onDismiss: () => void;
  onOpen: () => void;
  showDismiss: boolean;
  t: TranslateFn;
  visible: boolean;
}

/**
 * First-run invitation above the workspace.
 *
 * It replaces the setup wizards that used to block the screen, so its job is
 * to be noticed and then let go of. It is the one surface that does not follow
 * the app's palette: violet makes it unmistakably not part of the furniture on
 * a first launch, in either theme.
 *
 * The whole card opens the introduction. Dismissal is a distinct, smaller
 * target -- someone reaching to get rid of it should not land inside the flow.
 */
export function IntroBanner({
  onDismiss,
  onOpen,
  showDismiss,
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
        <View style={styles.text}>
          <Text style={styles.title}>{t("introBannerTitle")}</Text>
          <Text style={styles.body}>{t("introBannerBody")}</Text>
        </View>

        {/* Dismissal only appears once the invitation has been taken up at
            least once. Offering an exit before the card has been read makes
            getting rid of it the easiest thing on a first launch. */}
        {showDismiss ? (
          <Pressable
            accessibilityLabel={t("introBannerDismiss")}
            accessibilityRole="button"
            hitSlop={10}
            onPress={onDismiss}
            style={styles.dismiss}
            testID="intro-banner-dismiss"
          >
            <PhosphorIcon
              color={introBannerTheme.dismiss}
              name="close"
              size="compact"
            />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.actionRow}>
        <View style={styles.action} testID="intro-banner-open">
          <Text style={styles.actionLabel}>{t("introBannerAction")}</Text>
          <PhosphorIcon
            color={introBannerTheme.onAction}
            name="right"
            size="compact"
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    backgroundColor: introBannerTheme.action,
    borderRadius: introRadius.pill,
    flexDirection: "row",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 16,
  },
  actionLabel: {
    color: introBannerTheme.onAction,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },
  actionRow: {
    alignItems: "flex-end",
  },
  body: {
    color: introBannerTheme.textSecondary,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
  },
  card: {
    backgroundColor: introBannerTheme.canvas,
    borderRadius: introRadius.panel,
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
  // A soft bloom lifting the flat violet. Decorative only, so it stays out of
  // the accessibility tree.
  glow: {
    backgroundColor: introBannerTheme.glow,
    borderRadius: 999,
    height: 180,
    left: -50,
    position: "absolute",
    top: -80,
    width: 180,
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
  // Set in the body face rather than the display face: the app title sits
  // directly above in the display face, and two special faces stacked read as
  // competing headings.
  title: {
    color: introBannerTheme.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    lineHeight: 24,
  },
});
