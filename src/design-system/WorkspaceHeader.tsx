import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ProviderIcon } from "../components/ProviderIcon";
import type { Provider } from "../types";
import { fonts } from "../theme/typography";
import { useTheme } from "../theme/ThemeContext";
import { PhosphorIcon } from "./PhosphorIcon";

export function WorkspaceHeader({
  effort,
  modelAccessibilityLabel,
  modelName,
  onOpenSettings,
  onSwitchRoute,
  provider,
  settingsAccessibilityLabel,
  summary,
  switchable,
}: {
  effort?: string;
  modelAccessibilityLabel: string;
  modelName: string;
  onOpenSettings: () => void;
  onSwitchRoute: () => void;
  provider: Provider;
  settingsAccessibilityLabel: string;
  summary: string;
  switchable: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      testID="workspace-header"
    >
      <Pressable
        accessibilityLabel={modelAccessibilityLabel}
        accessibilityRole={switchable ? "button" : undefined}
        disabled={!switchable}
        onPress={switchable ? onSwitchRoute : undefined}
        style={({ pressed }) => [
          styles.row,
          pressed && switchable ? { backgroundColor: colors.surfaceAlt } : null,
        ]}
        testID="workspace-header-model"
      >
        <View style={styles.providerIcon}>
          <ProviderIcon
            color={colors.text}
            provider={provider}
            size="control"
          />
        </View>
        <Text
          numberOfLines={1}
          style={[styles.model, { color: colors.text }]}
          testID="workspace-header-model-name"
        >
          {modelName}
        </Text>
        {effort ? (
          <Text
            numberOfLines={1}
            style={[styles.effort, { color: colors.textSecondary }]}
            testID="workspace-header-effort"
          >
            {effort}
          </Text>
        ) : null}
        <View style={styles.spacer} />
        {switchable ? (
          <PhosphorIcon color={colors.textMuted} name="down" size="compact" />
        ) : null}
      </Pressable>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.divider, { backgroundColor: colors.border }]}
      />
      <Pressable
        accessibilityLabel={settingsAccessibilityLabel}
        accessibilityRole="button"
        onPress={onOpenSettings}
        style={({ pressed }) => [
          styles.row,
          pressed ? { backgroundColor: colors.surfaceAlt } : null,
        ]}
        testID="workspace-header-settings"
      >
        <Text
          numberOfLines={1}
          style={[styles.summary, { color: colors.textSecondary }]}
        >
          {summary}
        </Text>
        <PhosphorIcon color={colors.textMuted} name="control" size="compact" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 12,
  },
  effort: {
    flexShrink: 0,
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.75,
    lineHeight: 12,
    textTransform: "uppercase",
  },
  model: {
    flexShrink: 1,
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    minWidth: 0,
  },
  providerIcon: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  spacer: {
    flex: 1,
  },
  summary: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    minWidth: 0,
  },
});
