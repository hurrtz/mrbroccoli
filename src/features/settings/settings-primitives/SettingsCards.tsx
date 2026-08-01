import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  PhosphorIcon,
  type IconSize,
  type PhosphorIconName,
} from "../../../design-system/PhosphorIcon";
import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";

import { AntSettingsInfoButton } from "../AntSettingsInfoButton";
import { styles } from "../styles";

const localStyles = StyleSheet.create({
  selectionLabel: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
  selectionRow: {
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});

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

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {titleNode ? (
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderContent}>{titleNode}</View>
          {headerExtra ? (
            <View style={styles.cardHeaderExtra}>{headerExtra}</View>
          ) : null}
        </View>
      ) : null}
      <View
        style={[
          styles.cardContent,
          contentStyle,
          {
            borderColor: colors.border,
            borderTopWidth: titleNode ? StyleSheet.hairlineWidth : 0,
          },
        ]}
      >
        {children}
      </View>
      {footer ? (
        <View
          style={[
            styles.cardFooter,
            styles.cardFooterWrap,
            { borderTopColor: colors.border },
          ]}
        >
          <View style={styles.cardFooterActions}>{footer}</View>
        </View>
      ) : null}
    </View>
  );
}

export function AntDisclosureCard({
  children,
  contentStyle,
  expanded,
  footer,
  header,
  headerPressFeedback = true,
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
  headerPressFeedback?: boolean;
  headerExtra?: React.ReactNode;
  onToggle: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  toggleAccessibilityLabel?: string;
}) {
  const { colors } = useTheme();

  return (
    <View testID={testID}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderContent}>
            <Pressable
              testID={testID ? `${testID}-header-control` : undefined}
              accessibilityRole="button"
              accessibilityState={{ expanded }}
              style={({ pressed }) => [
                styles.disclosureHeader,
                pressed && headerPressFeedback ? styles.pressedControl : null,
              ]}
              onPress={onToggle}
            >
              <View style={styles.disclosureHeaderContent}>{header}</View>
            </Pressable>
          </View>
          <View style={styles.cardHeaderExtra}>
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
                <PhosphorIcon
                  name={expanded ? "up" : "down"}
                  size="control"
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>
        </View>
        {expanded ? (
          <View
            style={[
              styles.cardContent,
              contentStyle,
              {
                borderColor: colors.border,
                borderTopWidth: StyleSheet.hairlineWidth,
              },
            ]}
          >
            {children}
          </View>
        ) : null}
        {footer ? (
          <View
            style={[
              styles.cardFooter,
              styles.cardFooterWrap,
              { borderTopColor: colors.border },
            ]}
          >
            {footer}
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function AntButtonLabel({
  color,
  icon,
  iconSize = "compact",
  label,
}: {
  color: string;
  icon: PhosphorIconName;
  iconSize?: IconSize;
  label: string;
}) {
  return (
    <View style={styles.buttonLabelRow}>
      <PhosphorIcon name={icon} size={iconSize} color={color} />
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
  testID,
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
  testID?: string;
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
      <View testID={testID} style={styles.radioList}>
        {options.map((option, index) => {
          const selected = option.value === value;
          const disabled = option.disabled === true;

          return (
            <Pressable
              key={option.value}
              testID={testID ? `${testID}-${option.value}` : undefined}
              disabled={disabled}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected, disabled }}
              style={({ pressed }) => [
                localStyles.selectionRow,
                {
                  backgroundColor: pressed
                    ? colors.surfaceAlt
                    : colors.surfaceElevated,
                  borderBottomColor: colors.border,
                  borderBottomWidth:
                    index === options.length - 1 ? 0 : StyleSheet.hairlineWidth,
                  opacity: disabled ? 0.55 : 1,
                },
              ]}
            >
              <Text
                style={[
                  localStyles.selectionLabel,
                  { color: disabled ? colors.textMuted : colors.text },
                ]}
              >
                {option.label}
              </Text>
              <PhosphorIcon
                name={selected ? "radio-selected" : "radio-unselected"}
                size="control"
                color={selected ? colors.accent : colors.textMuted}
              />
            </Pressable>
          );
        })}
      </View>
    </AntSettingsCard>
  );
}
