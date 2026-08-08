import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { APP_LANGUAGES, getAppLocale } from "../../i18n/localeRegistry";
import type { AppLanguage } from "../../i18n/localeRegistry";
import type { TranslateFn } from "../../screens/main/shared";
import { fonts } from "../../theme/typography";
import { getIntroClip } from "./introClips";
import { introRadius, introTheme } from "./introTheme";
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
          style={styles.select}
          testID="intro-voice-select"
        >
          <Text numberOfLines={1} style={styles.selectLabel}>
            {getAppLocale(selected).nativeName}
          </Text>
          <PhosphorIcon color={introTheme.textMuted} name="down" size="compact" />
        </Pressable>

        <Pressable
          accessibilityLabel={playing ? t("introHearStop") : t("introHearPlay")}
          accessibilityRole="button"
          onPress={toggle}
          style={({ pressed }) => [styles.play, { opacity: pressed ? 0.82 : 1 }]}
          testID="intro-voice-play"
        >
          <PhosphorIcon
            color={introTheme.onAccent}
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
        <View style={styles.sheet} testID="intro-voice-options">
          <Text style={styles.sheetTitle}>{t("introVoicePickerTitle")}</Text>
          <ScrollView contentContainerStyle={styles.sheetList}>
            {APP_LANGUAGES.map((option) => {
              const active = option === selected;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  key={option}
                  onPress={() => handleSelect(option)}
                  style={[styles.option, active ? styles.optionActive : null]}
                  testID={`intro-voice-option-${option}`}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      active ? styles.optionLabelActive : null,
                    ]}
                  >
                    {getAppLocale(option).nativeName}
                  </Text>
                  {active ? (
                    <PhosphorIcon
                      color={introTheme.sand}
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
  optionActive: {
    // The reference input fills a chosen control edge to edge rather than
    // marking it; that is what makes the selection readable at a glance.
    backgroundColor: introTheme.sandSoft,
    borderColor: introTheme.sandBorder,
    borderWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: {
    color: introTheme.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  optionLabelActive: {
    color: introTheme.sand,
    fontFamily: fonts.bodyMedium,
  },
  play: {
    alignItems: "center",
    backgroundColor: introTheme.accent,
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
    backgroundColor: introTheme.sandSoft,
    borderColor: introTheme.sandBorder,
    borderRadius: introRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: 18,
  },
  selectLabel: {
    color: introTheme.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
  },
  sheet: {
    backgroundColor: introTheme.panel,
    borderColor: introTheme.border,
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
    color: introTheme.text,
    fontFamily: fonts.display,
    fontSize: 15,
    marginBottom: 8,
    paddingHorizontal: 18,
  },
});
