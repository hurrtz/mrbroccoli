import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ProviderIcon } from "../components/ProviderIcon";
import type { Provider } from "../types";
import { fonts } from "../theme/typography";
import { useTheme } from "../theme/ThemeContext";
import { PhosphorIcon } from "./PhosphorIcon";

export function WorkspaceHeader({
  council = false,
  effort,
  modelAccessibilityLabel,
  modelName,
  onOpenSettings,
  onSwitchRoute,
  provider,
  running = false,
  settingsAccessibilityLabel,
  summary,
  switchable,
}: {
  council?: boolean;
  effort?: string;
  modelAccessibilityLabel: string;
  modelName: string;
  onOpenSettings: () => void;
  onSwitchRoute: () => void;
  provider: Provider;
  running?: boolean;
  settingsAccessibilityLabel: string;
  summary: string;
  switchable: boolean;
}) {
  const { colors } = useTheme();
  const disabled = running && !council;

  return (
    <View
      accessibilityLiveRegion={running ? "polite" : undefined}
      role={running ? "status" : undefined}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        disabled ? styles.disabled : null,
      ]}
      testID="workspace-header"
    >
      <Pressable
        accessibilityLabel={running ? undefined : modelAccessibilityLabel}
        accessibilityRole={!running && switchable ? "button" : undefined}
        disabled={running || !switchable}
        onPress={!running && switchable ? onSwitchRoute : undefined}
        style={({ pressed }) => [
          styles.row,
          council ? styles.reportingRow : null,
          pressed && !running && switchable
            ? { backgroundColor: colors.surfaceAlt }
            : null,
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
        {effort && !council ? (
          <Text
            numberOfLines={1}
            style={[styles.effort, { color: colors.textSecondary }]}
            testID="workspace-header-effort"
          >
            {effort}
          </Text>
        ) : null}
        {council ? null : <View style={styles.spacer} />}
        {switchable && !council ? (
          <PhosphorIcon color={colors.textMuted} name="down" size="compact" />
        ) : null}
      </Pressable>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.divider, { backgroundColor: colors.border }]}
      />
      <Pressable
        accessibilityLabel={running ? undefined : settingsAccessibilityLabel}
        accessibilityRole={running ? undefined : "button"}
        disabled={running}
        onPress={running ? undefined : onOpenSettings}
        style={({ pressed }) => [
          styles.row,
          council ? styles.reportingRow : null,
          pressed && !running ? { backgroundColor: colors.surfaceAlt } : null,
        ]}
        testID="workspace-header-settings"
      >
        <Text
          numberOfLines={1}
          style={[
            styles.summary,
            council ? styles.reportingSummary : null,
            { color: colors.textSecondary },
          ]}
        >
          {summary}
        </Text>
        {council ? null : (
          <PhosphorIcon
            color={colors.textMuted}
            name="control"
            size="compact"
          />
        )}
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
  disabled: {
    opacity: 0.38,
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
  reportingRow: {
    justifyContent: "center",
  },
  reportingSummary: {
    flex: 0,
    textAlign: "center",
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
