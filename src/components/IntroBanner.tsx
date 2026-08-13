import React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { PhosphorIcon } from "../design-system/PhosphorIcon";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { introBannerTheme, introRadius } from "./introFlow/introTheme";
import { fonts } from "../theme/typography";
import type { TranslateFn } from "../screens/main/shared";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

interface IntroBannerProps {
  compact?: boolean;
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
 * a first launch, in either theme. The walkthrough it opens is spoken, and the
 * play glyph in a hairline circle is the affordance that says so.
 *
 * The whole card opens the introduction; the play circle is drawn, not a
 * separate target. Dismissal is a distinct 44 point target -- someone reaching
 * to get rid of it should not land inside the flow. The slow sheen is shared
 * vocabulary with the Premium band: the product's two invitation surfaces, and
 * nothing else animates as ornament.
 */
export function IntroBanner({
  compact = false,
  onDismiss,
  onOpen,
  showDismiss,
  t,
  visible,
}: IntroBannerProps) {
  const reduceMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  const sheen = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (reduceMotion) {
      sheen.stopAnimation();
      sheen.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(1_980),
        Animated.timing(sheen, {
          toValue: 1,
          duration: 1_080,
          useNativeDriver: true,
        }),
        Animated.delay(540),
        Animated.timing(sheen, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, sheen]);

  if (!visible) {
    return null;
  }

  const sheenNode = !reduceMotion ? (
    <AnimatedGradient
      pointerEvents="none"
      colors={["transparent", introBannerTheme.sheen, "transparent"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.sheen,
        {
          transform: [
            { skewX: "-18deg" },
            {
              translateX: sheen.interpolate({
                inputRange: [0, 1],
                outputRange: [-120, width + 120],
              }),
            },
          ],
        },
      ]}
    />
  ) : null;

  const trailing = showDismiss ? (
    <Pressable
      accessibilityLabel={t("introBannerDismiss")}
      accessibilityRole="button"
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
  ) : (
    <PhosphorIcon
      color={introBannerTheme.dismiss}
      name="right"
      size="inline"
    />
  );

  if (compact) {
    return (
      <Pressable
        accessibilityLabel={t("introBannerTitle")}
        accessibilityRole="button"
        onPress={onOpen}
        style={({ pressed }) => [
          styles.compactShadow,
          { opacity: pressed ? 0.9 : 1 },
        ]}
        testID="intro-banner"
      >
        <LinearGradient
          colors={[introBannerTheme.gradientStart, introBannerTheme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.compactCard,
            showDismiss ? styles.compactCardWithDismiss : null,
          ]}
          testID="intro-banner-surface"
        >
          {sheenNode}
          <View style={styles.compactPlayRing}>
            <PhosphorIcon
              color={introBannerTheme.text}
              name="play"
              size="inline"
            />
          </View>
          <Text numberOfLines={1} style={styles.compactTitle}>
            {t("introBannerTitle")}
          </Text>
          {trailing}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityHint={t("introBannerBody")}
      accessibilityLabel={t("introBannerTitle")}
      accessibilityRole="button"
      onPress={onOpen}
      style={({ pressed }) => [styles.shadow, { opacity: pressed ? 0.9 : 1 }]}
      testID="intro-banner"
    >
      <LinearGradient
        colors={[introBannerTheme.gradientStart, introBannerTheme.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
        testID="intro-banner-surface"
      >
        {sheenNode}
        <View style={styles.playTarget}>
          <View style={styles.playRing} testID="intro-banner-play-ring">
            <PhosphorIcon
              color={introBannerTheme.text}
              name="play"
              size="control"
            />
          </View>
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>{t("introBannerTitle")}</Text>
          <Text style={styles.body}>{t("introBannerBody")}</Text>
        </View>
        {trailing}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    color: introBannerTheme.textSecondary,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  card: {
    alignItems: "center",
    borderRadius: introRadius.panel,
    flexDirection: "row",
    gap: 13,
    overflow: "hidden",
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  compactCard: {
    alignItems: "center",
    borderRadius: introRadius.control,
    flexDirection: "row",
    gap: 10,
    minHeight: 48,
    overflow: "hidden",
    paddingHorizontal: 14,
  },
  compactCardWithDismiss: {
    paddingEnd: 6,
  },
  compactPlayRing: {
    alignItems: "center",
    borderColor: introBannerTheme.playRing,
    borderRadius: introRadius.pill,
    borderWidth: 1,
    flexShrink: 0,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  compactShadow: {
    elevation: 4,
    marginBottom: 8,
    shadowColor: introBannerTheme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 14,
  },
  compactTitle: {
    color: introBannerTheme.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 19,
    minWidth: 0,
  },
  dismiss: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    margin: -2,
    width: 44,
  },
  playRing: {
    alignItems: "center",
    borderColor: introBannerTheme.playRing,
    borderRadius: introRadius.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  playTarget: {
    alignItems: "center",
    flexShrink: 0,
    height: 44,
    justifyContent: "center",
    margin: -2,
    width: 44,
  },
  shadow: {
    elevation: 6,
    marginBottom: 12,
    shadowColor: introBannerTheme.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  sheen: {
    bottom: 0,
    left: 0,
    position: "absolute",
    top: 0,
    width: 100,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: introBannerTheme.text,
    fontFamily: fonts.display,
    fontSize: 15,
    lineHeight: 20,
  },
});
