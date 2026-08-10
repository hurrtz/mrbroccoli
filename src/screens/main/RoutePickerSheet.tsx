import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getLocalModel } from "../../constants/localModels";
import {
  getProviderModelName,
  PROVIDER_LABELS,
} from "../../constants/models";
import { Modal } from "../../design-system/NativeControls";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { ProviderIcon } from "../../components/ProviderIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type {
  ResponseMode,
  ResponseModeConfig,
  ResponseModeSelections,
} from "../../types";
import { getResponseModeRouteEffortLabel } from "../../utils/modelEffort";

import type { TranslateFn } from "./shared";

function RouteRow({
  active,
  mode,
  onSelect,
  ready,
}: {
  active: boolean;
  mode: ResponseModeConfig;
  onSelect: (mode: ResponseMode) => void;
  ready: boolean;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const route = mode.route;
  const local = route.runtime === "local" && Boolean(route.localModelId);
  const providerLabel = local
    ? t("settingsOnDevice")
    : PROVIDER_LABELS[route.provider];
  const modelName = local
    ? getLocalModel(route.localModelId!).name
    : getProviderModelName(route.provider, route.model);
  const effortLabel = getResponseModeRouteEffortLabel(route, language);

  return (
    <Pressable
      accessibilityLabel={
        effortLabel
          ? `${providerLabel}. ${modelName}. ${effortLabel}`
          : `${providerLabel}. ${modelName}`
      }
      accessibilityRole="radio"
      accessibilityState={{ checked: active, disabled: !ready }}
      disabled={!ready}
      onPress={() => onSelect(mode.id)}
      style={[
        styles.row,
        {
          backgroundColor: active ? colors.accentSoft : colors.surface,
          borderColor: active ? colors.borderStrong : colors.border,
        },
        !ready ? styles.rowUnready : null,
      ]}
      testID={`route-picker-row-${mode.id}`}
    >
      {local ? (
        <PhosphorIcon color={colors.text} name="cpu" size="feature" />
      ) : (
        <ProviderIcon
          color={colors.text}
          provider={route.provider}
          size="feature"
        />
      )}
      <View style={styles.copy}>
        <Text
          numberOfLines={1}
          style={[styles.provider, { color: colors.textSecondary }]}
        >
          {providerLabel}
        </Text>
        <Text numberOfLines={1} style={[styles.model, { color: colors.text }]}>
          {modelName}
        </Text>
        {effortLabel ? (
          <Text
            numberOfLines={1}
            style={[styles.effort, { color: colors.textMuted }]}
          >
            {effortLabel}
          </Text>
        ) : null}
      </View>
      {active ? (
        <PhosphorIcon color={colors.accent} name="check" size="control" />
      ) : null}
    </Pressable>
  );
}

/** The sheet the byline opens: pick who answers the next turn. */
export function RoutePickerSheet({
  modes,
  onClose,
  onSelect,
  readyModes,
  selected,
  t,
  visible,
}: {
  modes: ResponseModeSelections;
  onClose: () => void;
  onSelect: (mode: ResponseMode) => void;
  readyModes: ResponseMode[];
  selected: ResponseMode;
  t: TranslateFn;
  visible: boolean;
}) {
  return (
    <Modal
      footer={[{ text: t("done"), onPress: onClose }]}
      layout="sheet"
      onClose={onClose}
      title={t("workspaceRoutePickerTitle")}
      visible={visible}
    >
      <View style={styles.list} testID="route-picker-list">
        {modes.map((mode) => (
          <RouteRow
            active={mode.id === selected}
            key={mode.id}
            mode={mode}
            onSelect={(picked) => {
              onSelect(picked);
              onClose();
            }}
            ready={readyModes.includes(mode.id)}
          />
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 60,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowUnready: {
    opacity: 0.45,
  },
  copy: {
    flex: 1,
    gap: 1,
    minWidth: 0,
  },
  provider: {
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.6,
    lineHeight: 13,
    textTransform: "uppercase",
  },
  model: {
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  effort: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
  },
});
