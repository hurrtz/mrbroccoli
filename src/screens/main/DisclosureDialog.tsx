import React from "react";
import { StyleSheet, Text } from "react-native";

import { Modal } from "../../design-system/NativeControls";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";

export function DisclosureDialog({
  cancelLabel,
  confirmLabel,
  message,
  onCancel,
  onConfirm,
  testID,
  title,
  visible,
}: {
  cancelLabel: string;
  confirmLabel: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  testID: string;
  title: string;
  visible: boolean;
}) {
  const { colors } = useTheme();

  return (
    <Modal
      footer={[
        { text: cancelLabel, onPress: onCancel },
        { text: confirmLabel, onPress: onConfirm, tone: "success" },
      ]}
      maskClosable={false}
      onClose={onCancel}
      title={title}
      visible={visible}
    >
      <Text
        style={[styles.message, { color: colors.textSecondary }]}
        testID={testID}
      >
        {message}
      </Text>
    </Modal>
  );
}

const styles = StyleSheet.create({
  message: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
});
