import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../../theme/ThemeContext";
import { styles } from "../styles";

interface StyleChoice<Value extends string> {
  value: Value;
  label: string;
  description: string;
}

interface StyleChoiceGroupProps<Value extends string> {
  landscape: boolean;
  label: string;
  onChange: (value: Value) => void;
  options: StyleChoice<Value>[];
  testID: string;
  value: Value;
}

export function StyleChoiceGroup<Value extends string>({
  landscape,
  label,
  onChange,
  options,
  testID,
  value,
}: StyleChoiceGroupProps<Value>) {
  const { colors } = useTheme();
  const activeOption = options.find((option) => option.value === value);

  return (
    <View
      testID={testID}
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
      <View
        testID={`${testID}-control`}
        style={[
          styles.styleSheetChoiceRow,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: colors.border,
          },
        ]}
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <Pressable
              key={option.value}
              testID={`${testID}-${option.value}`}
              style={({ pressed }) => [
                styles.styleSheetChoice,
                {
                  backgroundColor: active
                    ? colors.accentSoft
                    : "transparent",
                  borderColor: active ? colors.accent : "transparent",
                },
                pressed ? styles.styleSheetControlPressed : null,
              ]}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
            >
              <Text
                style={[
                  styles.styleSheetChoiceText,
                  {
                    color: active ? colors.text : colors.textSecondary,
                  },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {activeOption ? (
        <Text
          style={[
            styles.styleSheetDescription,
            { color: colors.textMuted },
          ]}
        >
          {activeOption.description}
        </Text>
      ) : null}
    </View>
  );
}
