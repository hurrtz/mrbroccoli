import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Switch as NativeSwitch,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import {
  Card,
  Icon,
  Input,
  List,
  Picker,
  Radio,
} from "@ant-design/react-native";
import Feather from "@expo/vector-icons/Feather";
import type { IconNames } from "@ant-design/react-native/lib/icon";

import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";

import { AntSettingsInfoButton } from "./AntSettingsInfoButton";
import { styles } from "./styles";

const AntCardBody = Card.Body as React.ComponentType<
  React.ComponentProps<typeof Card.Body> & {
    children?: React.ReactNode;
  }
>;

export type AntPickerOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function AntSettingsCard({
  children,
  contentStyle,
  footer,
  headerExtra,
  style,
  title,
}: {
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  footer?: React.ReactNode;
  headerExtra?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  title?: React.ReactNode;
}) {
  const { colors } = useTheme();
  const titleNode =
    typeof title === "string" ? (
      <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
    ) : (
      title
    );
  const cardChildren: React.ReactElement[] = [];

  if (titleNode) {
    cardChildren.push(
      <Card.Header
        key="header"
        title={titleNode}
        extra={headerExtra}
        styles={{
          headerWrap: styles.cardHeader,
          headerContentWrap: styles.cardHeaderContent,
          headerExtraWrap: styles.cardHeaderExtra,
        }}
      />,
    );
  }
  cardChildren.push(
    <AntCardBody
      key="body"
      style={[styles.cardContent, contentStyle]}
      styles={{
        body: {
          backgroundColor: "transparent",
          borderColor: colors.border,
          borderTopWidth: titleNode ? StyleSheet.hairlineWidth : 0,
        },
      }}
    >
      {children}
    </AntCardBody>,
  );
  if (footer) {
    cardChildren.push(
      <Card.Footer
        key="footer"
        content={<View />}
        extra={<View style={styles.cardFooterActions}>{footer}</View>}
        style={[styles.cardFooter, { borderTopColor: colors.border }]}
        styles={{
          footerWrap: styles.cardFooterWrap,
        }}
      />,
    );
  }

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
      {cardChildren}
    </Card>
  );
}

export function AntDisclosureCard({
  children,
  contentStyle,
  expanded,
  footer,
  header,
  headerExtra,
  onToggle,
  style,
  testID,
  toggleAccessibilityLabel,
}: {
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  expanded: boolean;
  footer?: React.ReactNode;
  header: React.ReactNode;
  headerExtra?: React.ReactNode;
  onToggle: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  toggleAccessibilityLabel?: string;
}) {
  const { colors } = useTheme();
  const cardChildren: React.ReactElement[] = [
    <Card.Header
      key="header"
      title={
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          style={({ pressed }) => [
            styles.disclosureHeader,
            pressed ? styles.pressedControl : null,
          ]}
          onPress={onToggle}
        >
          <View style={styles.disclosureHeaderContent}>{header}</View>
        </Pressable>
      }
      extra={
        <View style={styles.disclosureHeaderActions}>
          {headerExtra}
          <Pressable
            accessibilityLabel={toggleAccessibilityLabel}
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            hitSlop={8}
            onPress={onToggle}
            style={({ pressed }) => [
              styles.disclosureToggle,
              pressed ? styles.pressedControl : null,
            ]}
          >
            <Feather
              name={expanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      }
      styles={{
        headerWrap: styles.cardHeader,
        headerContentWrap: styles.cardHeaderContent,
        headerExtraWrap: styles.cardHeaderExtra,
      }}
    />,
  ];

  if (expanded) {
    cardChildren.push(
      <AntCardBody
        key="body"
        style={[styles.cardContent, contentStyle]}
        styles={{
          body: {
            backgroundColor: "transparent",
            borderColor: colors.border,
            borderTopWidth: StyleSheet.hairlineWidth,
          },
        }}
      >
        {children}
      </AntCardBody>,
    );
  }
  if (footer) {
    cardChildren.push(
      <Card.Footer
        key="footer"
        content={footer}
        style={[styles.cardFooter, { borderTopColor: colors.border }]}
        styles={{
          footerWrap: styles.cardFooterWrap,
        }}
      />,
    );
  }

  return (
    <View testID={testID}>
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
        {cardChildren}
      </Card>
    </View>
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
  extra,
}: {
  title: string;
  description?: React.ReactNode;
  extra?: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.sectionIntro}>
      <View style={styles.sectionIntroHeader}>
        <Text
          accessibilityRole="header"
          style={[
            styles.sectionTitle,
            styles.sectionIntroTitle,
            { color: colors.text },
          ]}
        >
          {title}
        </Text>
        {extra}
      </View>
      {description ? (
        <Text
          style={[styles.sectionDescription, { color: colors.textSecondary }]}
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
  const { t } = useLocalization();
  const describedOptions = options.filter((option) => option.description);
  const hasInfo = describedOptions.length > 0 || Boolean(helperText);

  return (
    <AntSettingsCard
      title={label}
      headerExtra={
        hasInfo ? (
          <AntSettingsInfoButton
            accessibilityLabel={t("aboutSetting", { setting: label })}
            title={label}
          >
            <View style={styles.infoModalContent}>
              {describedOptions.map((option) => (
                <View key={option.value} style={styles.infoModalOption}>
                  <Text
                    style={[
                      styles.infoModalOptionLabel,
                      { color: colors.text },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[styles.helperText, { color: colors.textSecondary }]}
                  >
                    {option.description}
                  </Text>
                </View>
              ))}
              {helperText ? (
                <Text
                  style={[styles.helperText, { color: colors.textSecondary }]}
                >
                  {helperText}
                </Text>
              ) : null}
            </View>
          </AntSettingsInfoButton>
        ) : null
      }
      contentStyle={styles.fullBleedCardContent}
    >
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
    </AntSettingsCard>
  );
}

export function AntPickerRow({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label?: string;
  value: string;
  options: AntPickerOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  const selectedLabel =
    options.find((option) => option.value === value)?.label ??
    (options.length === 1 ? options[0].label : value);
  const hasSingleOption = options.length === 1;
  const disclosureIcon =
    !disabled && !hasSingleOption ? (
      <Feather name="chevron-down" size={17} color={colors.textMuted} />
    ) : null;
  const pickerIsInteractive = !hasSingleOption;
  const renderRow = (onPress?: () => void) => (
    <List.Item
      extra={
        label ? (
          <View style={styles.pickerValueRow}>
            <Text
              numberOfLines={1}
              style={[
                styles.pickerValue,
                {
                  color: disabled ? colors.textMuted : colors.textSecondary,
                },
              ]}
            >
              {selectedLabel}
            </Text>
            {disclosureIcon}
          </View>
        ) : (
          disclosureIcon
        )
      }
      disabled={disabled || hasSingleOption}
      onPress={onPress}
      style={
        pickerIsInteractive
          ? [styles.pickerItem, { borderColor: colors.border }]
          : styles.pickerStaticItem
      }
      styles={{
        Item: {
          backgroundColor: pickerIsInteractive
            ? colors.surface
            : colors.surfaceElevated,
        },
        Line: {
          borderBottomWidth: 0,
          minHeight: 46,
          paddingVertical: 10,
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
      {label ?? selectedLabel}
    </List.Item>
  );

  if (hasSingleOption) {
    return renderRow();
  }

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
      {({ toggle }) => renderRow(toggle)}
    </Picker>
  );
}

export function AntPickerRows({
  children,
  helperText,
  helperTextStyle,
}: {
  children: React.ReactNode;
  helperText?: React.ReactNode;
  helperTextStyle?: StyleProp<TextStyle>;
}) {
  const { colors } = useTheme();
  const pickerRows = React.Children.toArray(children).filter(
    React.isValidElement,
  );

  return (
    <>
      <List
        style={styles.pickerList}
        styles={{
          List: {
            backgroundColor: colors.surfaceElevated,
          },
          Body: {
            borderTopWidth: 0,
            gap: 8,
            paddingVertical: 8,
          },
          BodyBottomLine: {
            height: 0,
            backgroundColor: "transparent",
          },
        }}
      >
        {pickerRows}
      </List>
      {helperText ? (
        <View style={styles.pickerHelper}>
          {typeof helperText === "string" ? (
            <Text
              style={[
                styles.helperText,
                helperTextStyle,
                { color: colors.textSecondary },
              ]}
            >
              {helperText}
            </Text>
          ) : (
            helperText
          )}
        </View>
      ) : null}
    </>
  );
}

export function AntPickerSection({
  children,
  description,
  helperText,
  title,
}: {
  children: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  title?: string;
}) {
  const { t } = useLocalization();

  return (
    <AntSettingsCard
      title={title}
      headerExtra={
        title && description ? (
          <AntSettingsInfoButton
            accessibilityLabel={t("aboutSetting", { setting: title })}
            title={title}
          >
            {description}
          </AntSettingsInfoButton>
        ) : null
      }
      contentStyle={styles.fullBleedCardContent}
    >
      <AntPickerRows helperText={helperText}>{children}</AntPickerRows>
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
      <NativeSwitch
        value={value}
        trackColor={{
          false: colors.borderStrong,
          true: Platform.OS === "android" ? colors.accentSoft : colors.accent,
        }}
        thumbColor={
          Platform.OS === "android"
            ? value
              ? colors.accent
              : colors.surface
            : undefined
        }
        ios_backgroundColor={colors.borderStrong}
        onValueChange={onChange}
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
      disabled={disabled}
      onChangeText={onChange}
      onFocus={onFocus}
      inputStyle={{
        color: colors.text,
        fontFamily: fonts.body,
        fontSize: 15,
        lineHeight: 21,
        paddingHorizontal: 12,
      }}
      styles={{
        container: {
          backgroundColor: colors.surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          borderRadius: 10,
          minHeight: 128,
          maxHeight: 128,
        },
      }}
    />
  );
}
