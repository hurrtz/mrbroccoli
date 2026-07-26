import React from "react";
import {
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import {
  Icon,
  Card,
  Input,
  List,
  Picker,
  Radio,
  Switch,
} from "@ant-design/react-native";
import type { IconNames } from "@ant-design/react-native/lib/icon";

import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";

import { styles } from "./styles";

export type AntPickerOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function AntSettingsCard({
  children,
  contentStyle,
  style,
}: {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();

  return (
    <Card
      style={StyleSheet.flatten([
        styles.card,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
        },
        style,
      ])}
    >
      <View style={[styles.cardContent, contentStyle]}>{children}</View>
    </Card>
  );
}

export function AntButtonLabel({
  color,
  icon,
  iconSize = 15,
  label,
}: {
  color: string;
  icon: IconNames;
  iconSize?: number;
  label: string;
}) {
  return (
    <View style={styles.buttonLabelRow}>
      <Icon name={icon} size={iconSize} color={color} />
      <Text style={[styles.buttonLabelText, { color }]}>{label}</Text>
    </View>
  );
}

export function AntSectionIntro({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.sectionIntro}>
      <Text
        accessibilityRole="header"
        style={[styles.sectionTitle, { color: colors.text }]}
      >
        {title}
      </Text>
      {description ? (
        <Text
          style={[
            styles.sectionDescription,
            { color: colors.textSecondary },
          ]}
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
}

export function AntRadioSection<T extends string>({
  label,
  options,
  value,
  onChange,
  helperText,
}: {
  label: string;
  options: {
    value: T;
    label: string;
    description?: string;
    disabled?: boolean;
  }[];
  value: T;
  onChange: (value: T) => void;
  helperText?: string;
}) {
  const { colors } = useTheme();
  const activeOption = options.find((option) => option.value === value);

  return (
    <AntSettingsCard>
      <Text
        accessibilityRole="header"
        style={[styles.fieldLabel, { color: colors.text }]}
      >
        {label}
      </Text>
      <View style={styles.radioList}>
        <Radio.Group
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
        >
          {options.map((option, index) => (
            <Radio.RadioItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              styles={{
                Item: {
                  backgroundColor: colors.surfaceElevated,
                  minHeight: 46,
                },
                Line: {
                  borderBottomWidth:
                    index === options.length - 1 ? 0 : StyleSheet.hairlineWidth,
                },
                Content: {
                  color: colors.text,
                  fontSize: 15,
                },
                radioItemContent: {
                  color: colors.text,
                  fontFamily: fonts.body,
                  fontSize: 15,
                },
                radioItemContentDisable: {
                  color: colors.textMuted,
                },
              }}
            >
              {option.label}
            </Radio.RadioItem>
          ))}
        </Radio.Group>
      </View>
      {activeOption?.description ? (
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {activeOption.description}
        </Text>
      ) : null}
      {helperText ? (
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {helperText}
        </Text>
      ) : null}
    </AntSettingsCard>
  );
}

export function AntPickerRow({
  label,
  value,
  options,
  onChange,
  disabled = false,
  hideDivider = false,
}: {
  label: string;
  value: string;
  options: AntPickerOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  hideDivider?: boolean;
}) {
  const { colors } = useTheme();
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;

  return (
    <Picker
      data={options.map((option) => ({
        label: option.label,
        value: option.value,
      }))}
      cols={1}
      value={value ? [value] : []}
      disabled={disabled}
      styles={{
        actionText: {
          fontFamily: fonts.bodyMedium,
        },
        okText: {
          fontFamily: fonts.bodyMedium,
        },
        dismissText: {
          fontFamily: fonts.bodyMedium,
        },
        title: {
          fontFamily: fonts.body,
        },
        itemStyle: {
          fontFamily: fonts.body,
        },
        itemActiveStyle: {
          fontFamily: fonts.bodyMedium,
        },
      }}
      onOk={(nextValue) => {
        if (nextValue[0] !== undefined) {
          onChange(String(nextValue[0]));
        }
      }}
    >
      <List.Item
        arrow="horizontal"
        extra={selectedLabel}
        disabled={disabled}
        style={styles.pickerItem}
        styles={{
          Item: {
            backgroundColor: colors.surfaceElevated,
          },
          Line: {
            borderBottomWidth: hideDivider ? 0 : StyleSheet.hairlineWidth,
          },
          Content: {
            color: colors.text,
            fontFamily: fonts.body,
            fontSize: 15,
          },
          Extra: {
            color: disabled ? colors.textMuted : colors.textSecondary,
            fontFamily: fonts.body,
            fontSize: 14,
          },
          Arrow: {
            color: colors.textMuted,
          },
        }}
      >
        {label}
      </List.Item>
    </Picker>
  );
}

export function AntPickerSection({
  children,
  helperText,
}: {
  children: React.ReactNode;
  helperText?: React.ReactNode;
}) {
  const { colors } = useTheme();
  const pickerRows = React.Children.toArray(children).filter(
    React.isValidElement,
  ) as React.ReactElement<{ hideDivider?: boolean }>[];

  return (
    <AntSettingsCard contentStyle={styles.fullBleedCardContent}>
      <List
        style={styles.pickerList}
        styles={{
          List: {
            backgroundColor: colors.surfaceElevated,
          },
          Body: {
            borderTopWidth: 0,
          },
          BodyBottomLine: {
            borderBottomWidth: 0,
          },
        }}
      >
        {pickerRows.map((child, index) =>
          React.cloneElement(child, {
            hideDivider:
              helperText === undefined &&
              index === pickerRows.length - 1,
          }),
        )}
      </List>
      {helperText ? (
        <View
          style={[
            styles.pickerHelper,
            { borderTopColor: colors.border },
          ]}
        >
          {typeof helperText === "string" ? (
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              {helperText}
            </Text>
          ) : (
            helperText
          )}
        </View>
      ) : null}
    </AntSettingsCard>
  );
}

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
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {description}
          </Text>
        ) : null}
      </View>
      <Switch
        checked={value}
        color={colors.accent}
        onChange={onChange}
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
  onFocus?: React.ComponentProps<typeof Input.TextArea>["onFocus"];
  disabled?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <Input.TextArea
      value={value}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      selectionColor={colors.accent}
      rows={5}
      autoSize={{ minRows: 4, maxRows: 8 }}
      disabled={disabled}
      onChangeText={onChange}
      onFocus={onFocus}
      style={styles.textArea}
      inputStyle={{
        color: colors.text,
        fontFamily: fonts.body,
        fontSize: 15,
        lineHeight: 21,
      }}
      styles={{
        container: {
          backgroundColor: colors.surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          borderRadius: 10,
        },
      }}
    />
  );
}
