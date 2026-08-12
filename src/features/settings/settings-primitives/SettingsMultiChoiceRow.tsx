import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { APP_MODAL_ORIENTATIONS } from "../../../constants/layout";
import { IconButton } from "../../../design-system/IconButton";
import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";

import type { SettingsChoiceOption } from "./SettingsChoiceRow";
import { SettingsRow } from "./SettingsRow";

export function SettingsMultiChoiceRow<T extends string>({
  icon,
  label,
  last = false,
  onToggle,
  options,
  testID,
  values,
}: {
  icon?: React.ComponentProps<typeof SettingsRow>["icon"];
  label: string;
  last?: boolean;
  onToggle: (value: T) => void;
  options: readonly SettingsChoiceOption<T>[];
  testID?: string;
  values: readonly T[];
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = React.useState(false);
  const selectedLabels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label);
  const summary =
    selectedLabels.length <= 2
      ? selectedLabels.join(", ")
      : `${selectedLabels.slice(0, 2).join(", ")} +${selectedLabels.length - 2}`;

  return (
    <>
      <SettingsRow
        testID={testID}
        accessibilityLabel={`${label}. ${summary}`}
        icon={icon}
        label={label}
        last={last}
        value={summary}
        onPress={() => setVisible(true)}
      />
      <Modal
        animationType="slide"
        onRequestClose={() => setVisible(false)}
        statusBarTranslucent
        supportedOrientations={APP_MODAL_ORIENTATIONS}
        transparent
        visible={visible}
      >
        <View
          testID={testID ? `${testID}-sheet` : undefined}
          accessibilityViewIsModal
          style={styles.overlay}
        >
          <Pressable
            accessible={false}
            onPress={() => setVisible(false)}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.overlay },
            ]}
          />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                paddingBottom: Math.max(18, insets.bottom + 10),
              },
            ]}
          >
            <View
              style={[styles.handle, { backgroundColor: colors.borderStrong }]}
            />
            <View style={styles.header}>
              <Text
                accessibilityRole="header"
                style={[styles.title, { color: colors.text }]}
              >
                {label}
              </Text>
              <IconButton
                icon="close"
                accessibilityLabel={t("done")}
                onPress={() => setVisible(false)}
              />
            </View>
            <FlatList
              data={[...options]}
              keyExtractor={(option) => option.value}
              contentContainerStyle={styles.list}
              renderItem={({ item: option, index }) => {
                const checked = values.includes(option.value);
                return (
                  <Pressable
                    testID={
                      testID
                        ? `${testID}-option-${option.value.replace(
                            /[^a-zA-Z0-9_-]+/g,
                            "-",
                          )}`
                        : undefined
                    }
                    accessibilityLabel={option.label}
                    accessibilityRole="checkbox"
                    accessibilityState={{
                      checked,
                      disabled: option.disabled,
                    }}
                    disabled={option.disabled}
                    onPress={() => onToggle(option.value)}
                    style={({ pressed }) => [
                      styles.option,
                      {
                        borderBottomColor: colors.border,
                        opacity: option.disabled ? 0.45 : 1,
                      },
                      index === options.length - 1 ? styles.last : null,
                      pressed ? { backgroundColor: colors.surfaceAlt } : null,
                    ]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: checked
                            ? colors.accent
                            : "transparent",
                          borderColor: checked
                            ? colors.accent
                            : colors.borderStrong,
                        },
                      ]}
                    >
                      {checked ? (
                        <PhosphorIcon
                          name="check"
                          size="inline"
                          color={colors.onActiveControl}
                        />
                      ) : null}
                    </View>
                    <View style={styles.optionCopy}>
                      <Text
                        style={[styles.optionLabel, { color: colors.text }]}
                      >
                        {option.label}
                      </Text>
                      {option.supporting ? (
                        <Text
                          style={[
                            styles.optionSupporting,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {option.supporting}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "78%",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    overflow: "hidden",
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
  },
  header: {
    minHeight: 54,
    paddingLeft: 18,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 22,
  },
  list: {
    paddingHorizontal: 18,
  },
  option: {
    minHeight: 52,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  last: {
    borderBottomWidth: 0,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  optionCopy: {
    flex: 1,
    minWidth: 0,
  },
  optionLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
  },
  optionSupporting: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
});
