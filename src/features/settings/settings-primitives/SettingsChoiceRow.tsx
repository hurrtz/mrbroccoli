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

import { SettingsRow } from "./SettingsRow";

export type SettingsChoiceOption<T extends string = string> = {
  value: T;
  label: string;
  supporting?: string;
  disabled?: boolean;
};

export function SettingsChoiceRow<T extends string>({
  icon,
  label,
  last = false,
  onChange,
  options,
  testID,
  value,
}: {
  icon?: React.ComponentProps<typeof SettingsRow>["icon"];
  label: string;
  last?: boolean;
  onChange: (value: T) => void;
  options: readonly SettingsChoiceOption<T>[];
  testID?: string;
  value: T;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = React.useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <>
      <SettingsRow
        testID={testID}
        accessibilityLabel={`${label}. ${selected?.label ?? value}`}
        icon={icon}
        label={label}
        last={last}
        value={selected?.label ?? value}
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
                accessibilityLabel={t("dismiss")}
                onPress={() => setVisible(false)}
              />
            </View>
            <FlatList
              data={[...options]}
              keyExtractor={(option) => option.value}
              contentContainerStyle={styles.list}
              renderItem={({ item: option, index }) => {
                const checked = option.value === value;
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
                    accessibilityRole="radio"
                    accessibilityState={{
                      checked,
                      disabled: option.disabled,
                    }}
                    disabled={option.disabled}
                    onPress={() => {
                      onChange(option.value);
                      setVisible(false);
                    }}
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
                        styles.radio,
                        {
                          borderColor: checked
                            ? colors.accent
                            : colors.borderStrong,
                        },
                      ]}
                    >
                      {checked ? (
                        <View
                          style={[
                            styles.radioDot,
                            { backgroundColor: colors.accent },
                          ]}
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
                    {checked ? (
                      <PhosphorIcon
                        name="check"
                        size="compact"
                        color={colors.accent}
                      />
                    ) : null}
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
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
