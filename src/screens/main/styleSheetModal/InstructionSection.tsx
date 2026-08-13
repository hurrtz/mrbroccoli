import React from "react";
import { Text, TextInput, View } from "react-native";
import { useTheme } from "../../../theme/ThemeContext";
import { styles } from "../styles";

interface InstructionSectionProps {
  description: string;
  editable?: boolean;
  label: string;
  landscape: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  inputTestID: string;
  sectionTestID: string;
  value: string;
}

export function InstructionSection({
  description,
  editable = true,
  label,
  landscape,
  onChange,
  placeholder,
  inputTestID,
  sectionTestID,
  value,
}: InstructionSectionProps) {
  const { colors } = useTheme();

  return (
    <View
      testID={sectionTestID}
      style={[
        styles.styleSheetGroup,
        landscape ? styles.styleSheetGroupLandscape : null,
      ]}
    >
      <Text
        style={[styles.styleSheetGroupLabel, { color: colors.textMuted }]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.styleSheetDescription,
          { color: editable ? colors.textSecondary : colors.textMuted },
        ]}
      >
        {description}
      </Text>
      {/* When the route cannot take instructions, the explanatory line above
          carries it alone — a dead ghost textarea only invites typing into
          a field that does nothing. */}
      {editable ? (
        <TextInput
          testID={inputTestID}
          value={value}
          onChangeText={onChange}
          multiline
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          textAlignVertical="top"
          style={[
            styles.styleSheetInstructionInput,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />
      ) : null}
    </View>
  );
}
