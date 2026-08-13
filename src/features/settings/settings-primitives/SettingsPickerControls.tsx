import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";

import { APP_MODAL_ORIENTATIONS } from "../../../constants/layout";
import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import { useLocalization } from "../../../i18n";
import { recordDebugLogEvent } from "../../../services/debugLogCapture";
import { useTheme } from "../../../theme/ThemeContext";

import { AntSettingsInfoButton } from "../AntSettingsInfoButton";
import { styles } from "../styles";
import { AntSettingsCard } from "./SettingsCards";

export type AntPickerOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function AntPickerRow({
  label,
  value,
  options,
  onChange,
  disabled = false,
  standalone = false,
  testID,
}: {
  label?: string;
  value: string;
  options: readonly AntPickerOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  standalone?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [pickerVisible, setPickerVisible] = React.useState(false);
  const controlId = testID ?? "settings-picker-unidentified";
  const selectedLabel =
    options.find((option) => option.value === value)?.label ??
    (options.length === 1 ? options[0].label : value);
  const hasSingleOption = options.length === 1;
  const showStaticValueOnly = hasSingleOption && label === undefined;
  const disclosureIcon =
    !disabled && !hasSingleOption ? (
      <PhosphorIcon name="down" size="compact" color={colors.textMuted} />
    ) : null;
  const pickerIsInteractive = !hasSingleOption;
  const closePicker = React.useCallback(
    (reason: "back" | "close" | "overlay" | "selection") => {
      recordDebugLogEvent({
        event: "settings-picker-dismissed",
        payload: { controlId, reason },
      });
      setPickerVisible(false);
    },
    [controlId],
  );
  const renderRow = (onPress?: () => void) => {
    const rowContent = (
      <View
        testID={testID ? `${testID}-content` : undefined}
        style={styles.pickerRowContent}
      >
        {showStaticValueOnly ? null : (
          <Text
            numberOfLines={1}
            style={[
              styles.pickerRowLabel,
              { color: disabled ? colors.textMuted : colors.text },
            ]}
          >
            {label ?? selectedLabel}
          </Text>
        )}
        {label || showStaticValueOnly ? (
          <View style={styles.pickerValueRow}>
            <Text
              testID={testID ? `${testID}-value` : undefined}
              numberOfLines={1}
              style={[
                styles.pickerValue,
                {
                  color: disabled ? colors.textMuted : colors.textSecondary,
                },
              ]}
            >
              {selectedLabel}
            </Text>
            {disclosureIcon}
          </View>
        ) : (
          disclosureIcon
        )}
      </View>
    );
    const rowStyle = [
      pickerIsInteractive ? styles.pickerItem : styles.pickerStaticItem,
      standalone && pickerIsInteractive ? styles.pickerItemStandalone : null,
      {
        backgroundColor: pickerIsInteractive
          ? colors.surface
          : colors.surfaceElevated,
        borderColor: colors.border,
      },
    ];

    if (!pickerIsInteractive) {
      return (
        <View testID={testID} style={rowStyle}>
          {rowContent}
        </View>
      );
    }

    return (
      <Pressable
        testID={testID}
        accessibilityLabel={
          label ? `${label}. ${selectedLabel}` : selectedLabel
        }
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: pickerVisible }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          rowStyle,
          pressed ? styles.pressedControl : null,
        ]}
      >
        {rowContent}
      </Pressable>
    );
  };

  if (hasSingleOption) {
    return renderRow();
  }

  return (
    <>
      {renderRow(() => {
        recordDebugLogEvent({
          event: "settings-picker-open-requested",
          payload: {
            controlId,
            disabled,
            optionCount: options.length,
            selectedValue: value,
          },
        });
        setPickerVisible(true);
      })}
      <Modal
        animationType="fade"
        onDismiss={() => {
          recordDebugLogEvent({
            event: "settings-picker-native-dismissed",
            payload: { controlId },
          });
        }}
        onRequestClose={() => closePicker("back")}
        onShow={() => {
          recordDebugLogEvent({
            event: "settings-picker-presented",
            payload: { controlId, optionCount: options.length },
          });
        }}
        statusBarTranslucent
        supportedOrientations={APP_MODAL_ORIENTATIONS}
        transparent
        visible={pickerVisible}
      >
        <View
          testID={testID ? `${testID}-modal` : undefined}
          accessibilityViewIsModal
          style={styles.pickerModalOverlay}
        >
          <Pressable
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no"
            onPress={() => closePicker("overlay")}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.overlay },
            ]}
          />
          <View
            style={[
              styles.pickerModalCard,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                shadowColor: colors.glow,
              },
            ]}
          >
            <View
              style={[
                styles.pickerModalHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <Text
                accessibilityRole="header"
                style={[styles.pickerModalTitle, { color: colors.text }]}
              >
                {label ?? selectedLabel}
              </Text>
              <Pressable
                testID={testID ? `${testID}-close` : undefined}
                accessibilityLabel={t("dismiss")}
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => closePicker("close")}
                style={({ pressed }) => [
                  styles.pickerModalClose,
                  pressed ? styles.pressedControl : null,
                ]}
              >
                <PhosphorIcon
                  name="close"
                  size="control"
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(option) => option.value}
              contentContainerStyle={styles.pickerModalList}
              renderItem={({ item: option }) => {
                const selected = option.value === value;
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
                      checked: selected,
                      disabled: option.disabled,
                    }}
                    disabled={option.disabled}
                    onPress={() => {
                      recordDebugLogEvent({
                        event: "settings-picker-option-selected",
                        payload: {
                          controlId,
                          optionIndex: options.findIndex(
                            (entry) => entry.value === option.value,
                          ),
                          selectedValue: option.value,
                        },
                      });
                      onChange(option.value);
                      closePicker("selection");
                    }}
                    style={({ pressed }) => [
                      styles.pickerModalOption,
                      {
                        backgroundColor: selected
                          ? colors.accentSoft
                          : colors.surface,
                        borderColor: selected
                          ? colors.borderStrong
                          : colors.border,
                        opacity: option.disabled ? 0.5 : 1,
                      },
                      pressed ? styles.pressedControl : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.pickerModalOptionText,
                        {
                          color: option.disabled
                            ? colors.textMuted
                            : colors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selected ? (
                      <PhosphorIcon
                        name="check"
                        size="control"
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

export function AntPickerRows({
  children,
  helperText,
  helperTextStyle,
}: {
  children: React.ReactNode;
  helperText?: React.ReactNode;
  helperTextStyle?: StyleProp<TextStyle>;
}) {
  const { colors } = useTheme();
  const pickerRows = React.Children.toArray(children).filter(
    React.isValidElement,
  );

  return (
    <>
      <View
        style={[
          styles.pickerList,
          {
            backgroundColor: colors.surfaceElevated,
            gap: 8,
            paddingVertical: 8,
          },
        ]}
      >
        {pickerRows}
      </View>
      {helperText ? (
        <View style={styles.pickerHelper}>
          {typeof helperText === "string" ? (
            <Text
              style={[
                styles.helperText,
                helperTextStyle,
                { color: colors.textSecondary },
              ]}
            >
              {helperText}
            </Text>
          ) : (
            helperText
          )}
        </View>
      ) : null}
    </>
  );
}

export function AntPickerSection({
  children,
  description,
  helperText,
  title,
}: {
  children: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  title?: string;
}) {
  const { t } = useLocalization();

  return (
    <AntSettingsCard
      title={title}
      headerExtra={
        title && description ? (
          <AntSettingsInfoButton
            accessibilityLabel={t("aboutSetting", { setting: title })}
            title={title}
          >
            {description}
          </AntSettingsInfoButton>
        ) : null
      }
      contentStyle={styles.fullBleedCardContent}
    >
      <AntPickerRows helperText={helperText}>{children}</AntPickerRows>
    </AntSettingsCard>
  );
}
