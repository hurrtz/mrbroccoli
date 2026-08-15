import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { Input } from "../../../design-system/NativeControls";
import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";

import { IconAction } from "./IconAction";
import { SettingsSheet } from "./SettingsSheet";

export type VoicePickerOption = {
  value: string;
  label: string;
  meta?: string;
};

export function VoicePickerSheet({
  busyValue,
  directoryStatus,
  onClose,
  onPreview,
  onRefresh,
  onSelect,
  options,
  testID,
  title,
  value,
  visible,
}: {
  busyValue?: string | null;
  directoryStatus?: string | null;
  onClose: () => void;
  onPreview: (voice: string) => void;
  onRefresh?: () => void;
  onSelect: (voice: string) => void;
  options: readonly VoicePickerOption[];
  testID?: string;
  title: string;
  value: string;
  visible: boolean;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (!visible) {
      setQuery("");
    }
  }, [visible]);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredOptions = normalizedQuery
    ? options.filter((option) =>
        `${option.label} ${option.meta ?? ""}`
          .toLocaleLowerCase()
          .includes(normalizedQuery),
      )
    : options;

  return (
    <SettingsSheet
      contentStyle={styles.sheetContent}
      maxHeight="84%"
      onClose={onClose}
      scrollable={false}
      subtitle={t("providerVoicesAvailable", {
        count: options.length,
        provider: title,
      })}
      testID={testID}
      title={title}
      visible={visible}
    >
      {onRefresh ? (
        <View style={styles.toolbar}>
          <IconAction
            icon="reload"
            label={t("refreshProviderVoices", { provider: title })}
            onPress={onRefresh}
            testID={testID ? `${testID}-refresh` : undefined}
          />
        </View>
      ) : null}
      {directoryStatus ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.status, { color: colors.textSecondary }]}
        >
          {directoryStatus}
        </Text>
      ) : null}
      <Input
        testID={testID ? `${testID}-search` : undefined}
        accessibilityLabel={t("ttsVoice")}
        autoCapitalize="none"
        autoCorrect={false}
        allowClear
        onChangeText={setQuery}
        placeholder={t("ttsVoice")}
        placeholderTextColor={colors.textMuted}
        value={query}
        styles={{ container: styles.search }}
      />
      <FlatList
        data={filteredOptions}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(option) => option.value}
        contentContainerStyle={styles.list}
        renderItem={({ item: option, index }) => {
          const checked = option.value === value;
          const busy = option.value === busyValue;
          return (
            <View
              style={[
                styles.option,
                { borderBottomColor: colors.border },
                index === filteredOptions.length - 1 ? styles.last : null,
              ]}
            >
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
                accessibilityState={{ checked }}
                onPress={() => onSelect(option.value)}
                style={({ pressed }) => [
                  styles.choice,
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
                    numberOfLines={1}
                    style={[styles.optionLabel, { color: colors.text }]}
                  >
                    {option.label}
                  </Text>
                  {option.meta ? (
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.optionMeta,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {option.meta}
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
              <IconAction
                icon={busy ? "stop" : "play-circle"}
                label={`${t("previewVoice")}: ${option.label}`}
                onPress={() => onPreview(option.value)}
                testID={
                  testID ? `${testID}-preview-${option.value}` : undefined
                }
              />
            </View>
          );
        }}
      />
    </SettingsSheet>
  );
}

const styles = StyleSheet.create({
  sheetContent: { paddingBottom: 0, paddingHorizontal: 0 },
  toolbar: {
    alignItems: "flex-end",
    paddingHorizontal: 18,
  },
  status: {
    marginHorizontal: 18,
    marginBottom: 8,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
  search: {
    marginHorizontal: 18,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 18,
  },
  option: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  last: {
    borderBottomWidth: 0,
  },
  choice: {
    flex: 1,
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    paddingHorizontal: 2,
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
    paddingVertical: 8,
  },
  optionLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
  },
  optionMeta: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
});
