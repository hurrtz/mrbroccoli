import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { APP_LANGUAGES, getAppLocale } from "../../i18n/localeRegistry";
import type { AppLanguage } from "../../i18n/localeRegistry";
import type { TranslateFn } from "../../screens/main/shared";
import { fonts } from "../../theme/typography";
import { getIntroClip } from "./introClips";
import { introRadius, useIntroTheme } from "./introTheme";
import { useIntroPlayback } from "./useIntroPlayback";

interface IntroVoicePickerProps {
  language: AppLanguage;
  t: TranslateFn;
}

/**
 * Language picker plus a play control for the bundled examples.
 *
 * This is the evidence behind the claim that speech is worth setting up:
 * rather than asserting the app sounds good, it lets someone hear it, in any
 * language, before committing to anything. Every clip ships with the app, so
 * this works offline and on first launch.
 *
 * The default is the user's own interface language, which the app already
 * derives from the store the install came from, falling back to English.
 */
export function IntroVoicePicker({ language, t }: IntroVoicePickerProps) {
  const theme = useIntroTheme();
  const [selected, setSelected] = React.useState<AppLanguage>(language);
  const [pickerOpen, setPickerOpen] = React.useState(false);

  // Switching language mid-clip would leave two voices racing, so selecting a
  // new one stops the current player first.
  const { playing, stop, toggle } = useIntroPlayback(getIntroClip(selected));

  const handleSelect = React.useCallback(
    (next: AppLanguage) => {
      stop();
      setSelected(next);
      setPickerOpen(false);
    },
    [stop],
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          accessibilityHint={t("introVoicePickerHint")}
          accessibilityLabel={getAppLocale(selected).nativeName}
          accessibilityRole="button"
          onPress={() => setPickerOpen(true)}
          style={[
            styles.select,
            {
              backgroundColor: theme.sandSoft,
              borderColor: theme.sandBorder,
            },
          ]}
          testID="intro-voice-select"
        >
          <Text numberOfLines={1} style={[styles.selectLabel, { color: theme.text }]}>
            {getAppLocale(selected).nativeName}
          </Text>
          <PhosphorIcon color={theme.textMuted} name="down" size="compact" />
        </Pressable>

        <Pressable
          accessibilityLabel={playing ? t("introHearStop") : t("introHearPlay")}
          accessibilityRole="button"
          onPress={toggle}
          style={({ pressed }) => [
            styles.play,
            { backgroundColor: theme.accent, opacity: pressed ? 0.82 : 1 },
          ]}
          testID="intro-voice-play"
        >
          <PhosphorIcon
            color={theme.onAccent}
            name={playing ? "pause" : "audio"}
            size="control"
          />
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
        transparent
        visible={pickerOpen}
      >
        <Pressable
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={() => setPickerOpen(false)}
          style={styles.backdrop}
        />
        <View
          style={[
            styles.sheet,
            { backgroundColor: theme.panel, borderColor: theme.border },
          ]}
          testID="intro-voice-options"
        >
          <Text style={[styles.sheetTitle, { color: theme.text }]}>{t("introVoicePickerTitle")}</Text>
          <ScrollView contentContainerStyle={styles.sheetList}>
            {APP_LANGUAGES.map((option) => {
              const active = option === selected;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  key={option}
                  onPress={() => handleSelect(option)}
                  style={[
                    styles.option,
                    active
                      ? {
                          backgroundColor: theme.sandSoft,
                          borderColor: theme.sandBorder,
                          borderWidth: StyleSheet.hairlineWidth,
                        }
                      : null,
                  ]}
                  testID={`intro-voice-option-${option}`}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: theme.textSecondary },
                      active
                        ? { color: theme.sand, fontFamily: fonts.bodyMedium }
                        : null,
                    ]}
                  >
                    {getAppLocale(option).nativeName}
                  </Text>
                  {active ? (
                    <PhosphorIcon
                      color={theme.sand}
                      name="check"
                      size="compact"
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(6, 8, 11, 0.72)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  container: {
    gap: 10,
  },
  option: {
    alignItems: "center",
    borderRadius: introRadius.control,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: 16,
  },
  // A chosen option fills edge to edge rather than being marked, which is what
  // makes the selection readable at a glance.
  optionLabel: {
    fontFamily: fonts.body,
    fontSize: 16,
  },
  play: {
    alignItems: "center",
    borderRadius: introRadius.pill,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  select: {
    alignItems: "center",
    borderRadius: introRadius.control,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: 18,
  },
  selectLabel: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
  },
  sheet: {
    borderRadius: introRadius.panel,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 24,
    marginVertical: "auto",
    maxHeight: "70%",
    paddingBottom: 10,
    paddingTop: 18,
  },
  sheetList: {
    paddingHorizontal: 8,
  },
  sheetTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    marginBottom: 8,
    paddingHorizontal: 18,
  },
});
