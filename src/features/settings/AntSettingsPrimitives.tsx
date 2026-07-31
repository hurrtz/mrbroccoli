import React from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch as NativeSwitch,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { Card, Input, List, Radio } from "@ant-design/react-native";

import { APP_MODAL_ORIENTATIONS } from "../../constants/layout";
import {
  AntIcon,
  type AntIconName,
  type AntIconSize,
} from "../../design-system/AntIcon";
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
  const cardChildren: React.ReactElement[] = [
    <Card.Header
      key="header"
      title={
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
            <AntIcon
              name={expanded ? "up" : "down"}
              size="control"
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
  iconSize = "compact",
  label,
}: {
  color: string;
  icon: AntIconName;
  iconSize?: AntIconSize;
  label: string;
}) {
  return (
    <View style={styles.buttonLabelRow}>
      <AntIcon name={icon} size={iconSize} color={color} />
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
        <Radio.Group
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
        >
          {options.map((option, index) => (
            <View
              key={option.value}
              testID={testID ? `${testID}-${option.value}` : undefined}
            >
              <Radio.RadioItem
                value={option.value}
                disabled={option.disabled}
                styles={{
                  Item: {
                    backgroundColor: colors.surfaceElevated,
                    minHeight: 46,
                  },
                  Line: {
                    borderBottomWidth:
                      index === options.length - 1
                        ? 0
                        : StyleSheet.hairlineWidth,
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
            </View>
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
  standalone = false,
  testID,
}: {
  label?: string;
  value: string;
  options: readonly AntPickerOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  standalone?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [pickerVisible, setPickerVisible] = React.useState(false);
  const selectedLabel =
    options.find((option) => option.value === value)?.label ??
    (options.length === 1 ? options[0].label : value);
  const hasSingleOption = options.length === 1;
  const showStaticValueOnly = hasSingleOption && label === undefined;
  const disclosureIcon =
    !disabled && !hasSingleOption ? (
      <AntIcon name="down" size="compact" color={colors.textMuted} />
    ) : null;
  const pickerIsInteractive = !hasSingleOption;
  const renderRow = (onPress?: () => void) => {
    const rowContent = (
      <View
        testID={testID ? `${testID}-content` : undefined}
        style={styles.pickerRowContent}
      >
        {showStaticValueOnly ? null : (
          <Text
            numberOfLines={1}
            style={[
              styles.pickerRowLabel,
              { color: disabled ? colors.textMuted : colors.text },
            ]}
          >
            {label ?? selectedLabel}
          </Text>
        )}
        {label || showStaticValueOnly ? (
          <View style={styles.pickerValueRow}>
            <Text
              testID={testID ? `${testID}-value` : undefined}
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
        )}
      </View>
    );
    const rowStyle = [
      pickerIsInteractive ? styles.pickerItem : styles.pickerStaticItem,
      standalone && pickerIsInteractive ? styles.pickerItemStandalone : null,
      {
        backgroundColor: pickerIsInteractive
          ? colors.surface
          : colors.surfaceElevated,
        borderColor: colors.border,
      },
    ];

    if (!pickerIsInteractive) {
      return (
        <View testID={testID} style={rowStyle}>
          {rowContent}
        </View>
      );
    }

    return (
      <Pressable
        testID={testID}
        accessibilityLabel={
          label ? `${label}. ${selectedLabel}` : selectedLabel
        }
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: pickerVisible }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          rowStyle,
          pressed ? styles.pressedControl : null,
        ]}
      >
        {rowContent}
      </Pressable>
    );
  };

  if (hasSingleOption) {
    return renderRow();
  }

  return (
    <>
      {renderRow(() => setPickerVisible(true))}
      <Modal
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
        statusBarTranslucent
        supportedOrientations={APP_MODAL_ORIENTATIONS}
        transparent
        visible={pickerVisible}
      >
        <View
          testID={testID ? `${testID}-modal` : undefined}
          accessibilityViewIsModal
          style={styles.pickerModalOverlay}
        >
          <Pressable
            accessibilityLabel={t("dismiss")}
            accessibilityRole="button"
            onPress={() => setPickerVisible(false)}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.overlay },
            ]}
          />
          <View
            style={[
              styles.pickerModalCard,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                shadowColor: colors.glow,
              },
            ]}
          >
            <View
              style={[
                styles.pickerModalHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <Text
                accessibilityRole="header"
                style={[styles.pickerModalTitle, { color: colors.text }]}
              >
                {label ?? selectedLabel}
              </Text>
              <Pressable
                testID={testID ? `${testID}-close` : undefined}
                accessibilityLabel={t("dismiss")}
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setPickerVisible(false)}
                style={({ pressed }) => [
                  styles.pickerModalClose,
                  pressed ? styles.pressedControl : null,
                ]}
              >
                <AntIcon
                  name="close"
                  size="control"
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(option) => option.value}
              contentContainerStyle={styles.pickerModalList}
              renderItem={({ item: option }) => {
                const selected = option.value === value;
                return (
                  <Pressable
                    testID={
                      testID
                        ? `${testID}-option-${option.value.replace(
                            /[^a-zA-Z0-9_-]+/g,
                            "-",
                          )}`
                        : undefined
                    }
                    accessibilityLabel={option.label}
                    accessibilityRole="radio"
                    accessibilityState={{
                      checked: selected,
                      disabled: option.disabled,
                    }}
                    disabled={option.disabled}
                    onPress={() => {
                      onChange(option.value);
                      setPickerVisible(false);
                    }}
                    style={({ pressed }) => [
                      styles.pickerModalOption,
                      {
                        backgroundColor: selected
                          ? colors.accentSoft
                          : colors.surface,
                        borderColor: selected
                          ? colors.borderStrong
                          : colors.border,
                        opacity: option.disabled ? 0.5 : 1,
                      },
                      pressed ? styles.pressedControl : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.pickerModalOptionText,
                        {
                          color: option.disabled
                            ? colors.textMuted
                            : colors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selected ? (
                      <AntIcon
                        name="check"
                        size="control"
                        color={colors.accent}
                      />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
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
        accessibilityLabel={label}
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

export function AntNumberInputRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const { colors } = useTheme();
  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const parsed = Number(draft);
    if (Number.isSafeInteger(parsed) && parsed >= 1) {
      onChange(parsed);
      setDraft(String(parsed));
      return;
    }
    setDraft(String(value));
  };

  return (
    <View style={styles.numberInputRow}>
      <Text style={[styles.switchLabel, { color: colors.text }]}>{label}</Text>
      <TextInput
        testID="settings-number-input"
        accessibilityLabel={label}
        keyboardType="number-pad"
        inputMode="numeric"
        returnKeyType="done"
        selectTextOnFocus
        value={draft}
        onBlur={commit}
        onChangeText={(nextValue) => setDraft(nextValue.replace(/[^0-9]/g, ""))}
        onSubmitEditing={commit}
        style={[
          styles.numberInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
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
