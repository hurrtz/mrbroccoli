import React from "react";
import { Text, TextInput } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import type { Message } from "../../types";
import { styles } from "./styles";

export function MessageText({
  message,
  selectable,
}: {
  message: Message;
  selectable: boolean;
}) {
  const { colors } = useTheme();

  if (!message.content.trim()) {
    return null;
  }

  return selectable ? (
    <TextInput
      value={message.content}
      multiline
      readOnly
      scrollEnabled={false}
      selectionColor={colors.accent}
      testID={`selectable-message-${message.id}`}
      style={[styles.content, styles.selectableContent, { color: colors.text }]}
    />
  ) : (
    <Text style={[styles.content, { color: colors.text }]}>
      {message.content}
    </Text>
  );
}
