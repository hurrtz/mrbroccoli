import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Checkbox, List, Modal } from "@ant-design/react-native";
import Feather from "@expo/vector-icons/Feather";

import {
  getTtsListenLanguageLabel,
  TTS_LISTEN_LANGUAGE_OPTIONS,
} from "../../constants/localTts";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type { TtsListenLanguage } from "../../types";

import { AntSettingsInfoButton } from "./AntSettingsInfoButton";
import { AntSettingsCard } from "./AntSettingsPrimitives";
import { styles } from "./styles";

export function AntListenLanguageSelector({
  selectedLanguages,
  onToggleLanguage,
}: {
  selectedLanguages: TtsListenLanguage[];
  onToggleLanguage: (language: TtsListenLanguage) => void;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <AntSettingsCard
        title={t("listenLanguages")}
        headerExtra={
          <AntSettingsInfoButton
            accessibilityLabel={t("aboutSetting", {
              setting: t("listenLanguages"),
            })}
            title={t("listenLanguages")}
          >
            {t("listenLanguagesHint")}
          </AntSettingsInfoButton>
        }
        contentStyle={styles.fullBleedCardContent}
      >
        <List
          style={styles.pickerList}
          styles={{
            List: {
              backgroundColor: colors.surfaceElevated,
            },
            Body: {
              borderTopWidth: 0,
              paddingVertical: 8,
            },
            BodyBottomLine: {
              height: 0,
              backgroundColor: "transparent",
            },
          }}
        >
          <List.Item
            extra={
              <View style={styles.pickerValueRow}>
                <Text
                  numberOfLines={1}
                  style={[styles.pickerValue, { color: colors.textSecondary }]}
                >
                  {t("listenLanguagesSelected", {
                    count: selectedLanguages.length,
                  })}
                </Text>
                <Feather
                  name="chevron-down"
                  size={17}
                  color={colors.textMuted}
                />
              </View>
            }
            onPress={() => setVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={t("listenLanguages")}
            style={[styles.pickerItem, { borderColor: colors.border }]}
            styles={{
              Item: {
                backgroundColor: colors.surface,
              },
              Line: {
                minHeight: 46,
                paddingVertical: 10,
                borderBottomWidth: 0,
              },
              Content: {
                color: colors.text,
                fontFamily: fonts.body,
                fontSize: 15,
              },
              Extra: {
                maxWidth: "68%",
                paddingLeft: 8,
              },
            }}
          >
            {t("selection")}
          </List.Item>
        </List>
      </AntSettingsCard>

      {visible ? (
        <Modal
          visible
          transparent
          maskClosable
          title={t("listenLanguages")}
          onClose={() => setVisible(false)}
          footer={[
            {
              text: t("done"),
              style: {
                color: colors.accent,
                fontFamily: fonts.bodyMedium,
              },
              onPress: () => setVisible(false),
            },
          ]}
          styles={{
            header: {
              color: colors.text,
              fontFamily: fonts.bodyMedium,
            },
            buttonText: {
              fontFamily: fonts.bodyMedium,
            },
          }}
        >
          <View>
            {TTS_LISTEN_LANGUAGE_OPTIONS.map((entry, index) => (
              <Checkbox.CheckboxItem
                key={entry}
                checked={selectedLanguages.includes(entry)}
                right
                onPress={() => onToggleLanguage(entry)}
                styles={{
                  Item: {
                    backgroundColor: colors.surface,
                    minHeight: 46,
                  },
                  Line: {
                    borderBottomWidth:
                      index === TTS_LISTEN_LANGUAGE_OPTIONS.length - 1
                        ? 0
                        : StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                  Content: {
                    color: colors.text,
                    fontFamily: fonts.body,
                    fontSize: 15,
                  },
                }}
              >
                {getTtsListenLanguageLabel(entry, language)}
              </Checkbox.CheckboxItem>
            ))}
          </View>
        </Modal>
      ) : null}
    </>
  );
}
