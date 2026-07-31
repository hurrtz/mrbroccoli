import React from "react";
import { ScrollView, Text, View } from "react-native";

import { Modal } from "@ant-design/react-native";
import { AntIcon } from "../../design-system/AntIcon";

import { AntIconButton } from "../../design-system/AntIconButton";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";

import { styles } from "./styles";

export function AntSettingsInfoButton({
  accessibilityLabel,
  children,
  title,
}: {
  accessibilityLabel: string;
  children: React.ReactNode;
  title: string;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <AntIconButton
        accessibilityLabel={accessibilityLabel}
        iconNode={
          <AntIcon
            name="info-circle"
            size="control"
            color={colors.textSecondary}
          />
        }
        onPress={() => setVisible(true)}
      />

      {visible ? (
        <Modal
          visible
          transparent
          maskClosable
          modalType="modal"
          title={title}
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
          <ScrollView
            style={styles.infoModalScroll}
            contentContainerStyle={styles.infoModalContent}
            showsVerticalScrollIndicator={false}
          >
            {typeof children === "string" ? (
              <Text
                style={[styles.helperText, { color: colors.textSecondary }]}
              >
                {children}
              </Text>
            ) : (
              <View>{children}</View>
            )}
          </ScrollView>
        </Modal>
      ) : null}
    </>
  );
}
