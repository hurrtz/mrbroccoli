import React, { useState } from "react";
import {
  type StyleProp,
  View,
  type ViewStyle,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { PhosphorIcon } from "../design-system/PhosphorIcon";
import { APP_MODAL_ORIENTATIONS } from "../constants/layout";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { textStyles } from "../theme/typography";

interface PickerProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  testID?: string;
  disabled?: boolean;
  dropdownLabel?: string;
  hideDropdownLabel?: boolean;
  hideLabel?: boolean;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Picker({
  label,
  value,
  options,
  onChange,
  testID,
  disabled = false,
  dropdownLabel,
  hideDropdownLabel = false,
  hideLabel = false,
  placeholder,
  containerStyle,
}: PickerProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={[styles.section, containerStyle]}>
      {hideLabel ? null : (
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        testID={testID}
        style={[
          styles.dropdown,
          {
            backgroundColor: disabled ? colors.surface : colors.surfaceElevated,
            borderColor: colors.border,
            shadowColor: colors.glow,
            opacity: disabled ? 0.55 : 1,
          },
        ]}
        accessibilityLabel={`${label}. ${
          disabled
            ? t("chooseCompatibleProviderFirst")
            : selected?.label || placeholder || label
        }`}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        onPress={() => {
          if (!disabled) {
            setOpen(true);
          }
        }}
        disabled={disabled}
      >
        <View style={styles.dropdownText}>
          {hideDropdownLabel ? null : (
            <Text
              style={[styles.dropdownLabel, { color: colors.textSecondary }]}
            >
              {disabled ? t("unavailable") : dropdownLabel || t("selection")}
            </Text>
          )}
          <Text style={[styles.dropdownValue, { color: colors.text }]}>
            {disabled
              ? t("chooseCompatibleProviderFirst")
              : selected?.label || placeholder || value}
          </Text>
        </View>
        <View
          style={[
            styles.chevronWrap,
            { backgroundColor: colors.accentSoft, borderColor: colors.border },
          ]}
        >
          <PhosphorIcon name="down" size="compact" color={colors.accent} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        supportedOrientations={APP_MODAL_ORIENTATIONS}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay} accessibilityViewIsModal>
          <Pressable
            accessible={false}
            onPress={() => setOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              styles.list,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View
              style={[
                styles.listHeader,
                {
                  borderBottomColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <Text
                accessibilityRole="header"
                style={[styles.listTitle, { color: colors.text }]}
              >
                {label}
              </Text>
              <TouchableOpacity
                accessibilityLabel={t("dismiss")}
                accessibilityRole="button"
                onPress={() => setOpen(false)}
                style={styles.closeButton}
              >
                <PhosphorIcon
                  name="close"
                  size="control"
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        item.value === value
                          ? colors.accentSoft
                          : colors.surface,
                      borderColor:
                        item.value === value
                          ? colors.borderStrong
                          : colors.border,
                    },
                  ]}
                  accessibilityLabel={item.label}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: item.value === value }}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>
                    {item.label}
                  </Text>
                  {item.value === value ? (
                    <PhosphorIcon
                      name="check"
                      size="compact"
                      color={colors.accent}
                    />
                  ) : null}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 14 },
  sectionLabel: {
    ...textStyles.controlLabel,
    marginBottom: 10,
  },
  dropdown: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowOpacity: 0,
    elevation: 0,
  },
  dropdownText: {
    flex: 1,
    gap: 4,
  },
  dropdownLabel: {
    ...textStyles.controlLabel,
    fontSize: 10,
    lineHeight: 14,
  },
  dropdownValue: {
    ...textStyles.controlValue,
  },
  chevronWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  list: {
    width: "80%",
    maxHeight: "60%",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  listTitle: {
    ...textStyles.sectionTitle,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 10,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    ...textStyles.body,
  },
});
