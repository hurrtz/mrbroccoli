import React from "react";
import {
  Platform,
  StyleSheet,
  Switch as NativeSwitch,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";

import { styles } from "../styles";

export function AntSwitchRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.switchRow}>
      <View style={styles.switchCopy}>
        <Text style={[styles.switchLabel, { color: colors.text }]}>
          {label}
        </Text>
        {description ? (
          <Text style={[styles.helperText, { color: colors.textSecondary }]}
          >
            {description}
          </Text>
        ) : null}
      </View>
      <NativeSwitch
        accessibilityLabel={label}
        value={value}
        trackColor={{
          false: colors.borderStrong,
          true: Platform.OS === "android" ? colors.accentSoft : colors.accent,
        }}
        thumbColor={
          Platform.OS === "android"
            ? value
              ? colors.accent
              : colors.surface
            : undefined
        }
        ios_backgroundColor={colors.borderStrong}
        onValueChange={onChange}
      />
    </View>
  );
}

export function AntNumberInputRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const { colors } = useTheme();
  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const parsed = Number(draft);
    if (Number.isSafeInteger(parsed) && parsed >= 1) {
      onChange(parsed);
      setDraft(String(parsed));
      return;
    }
    setDraft(String(value));
  };

  return (
    <View style={styles.numberInputRow}>
      <Text style={[styles.switchLabel, { color: colors.text }]}>{label}</Text>
      <TextInput
        testID="settings-number-input"
        accessibilityLabel={label}
        keyboardType="number-pad"
        inputMode="numeric"
        returnKeyType="done"
        selectTextOnFocus
        value={draft}
        onBlur={commit}
        onChangeText={(nextValue) => setDraft(nextValue.replace(/[^0-9]/g, ""))}
        onSubmitEditing={commit}
        style={[
          styles.numberInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
      />
    </View>
  );
}

export function AntTextArea({
  value,
  placeholder,
  onChange,
  onFocus,
  disabled = false,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onFocus?: React.ComponentProps<typeof TextInput>["onFocus"];
  disabled?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      selectionColor={colors.accent}
      multiline
      numberOfLines={5}
      editable={!disabled}
      onChangeText={onChange}
      onFocus={onFocus}
      textAlignVertical="top"
      style={[
        {
          backgroundColor: colors.surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          borderRadius: 10,
          minHeight: 128,
          maxHeight: 128,
          color: colors.text,
          fontFamily: fonts.body,
          fontSize: 15,
          lineHeight: 21,
          paddingHorizontal: 12,
          paddingVertical: 12,
        },
        disabled ? { opacity: 0.55 } : null,
      ]}
    />
  );
}
