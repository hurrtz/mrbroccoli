import React from "react";
import {
  ActivityIndicator,
  Modal as ReactNativeModal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { APP_MODAL_ORIENTATIONS } from "../constants/layout";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";

interface ButtonProps extends Omit<PressableProps, "style"> {
  activeStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  loading?: boolean;
  size?: "small" | "large";
  style?: StyleProp<ViewStyle>;
  type?: "ghost" | "primary" | "warning";
}

export function Button({
  activeStyle,
  children,
  disabled,
  loading = false,
  size,
  style,
  type = "ghost",
  ...pressableProps
}: ButtonProps) {
  const { colors } = useTheme();
  const unavailable = disabled || loading;
  const backgroundColor =
    type === "primary"
      ? colors.accent
      : type === "warning"
        ? colors.danger
        : "transparent";
  const borderColor =
    type === "ghost" ? colors.border : backgroundColor;

  return (
    <Pressable
      {...pressableProps}
      accessibilityRole={pressableProps.accessibilityRole ?? "button"}
      accessibilityState={{
        ...pressableProps.accessibilityState,
        busy: loading,
        disabled: unavailable,
      }}
      disabled={unavailable}
      style={({ pressed }) => [
        controlStyles.button,
        size === "small" ? controlStyles.smallButton : null,
        { backgroundColor, borderColor },
        style,
        pressed && !unavailable ? activeStyle ?? controlStyles.pressed : null,
        unavailable ? controlStyles.disabled : null,
      ]}
    >
      <View style={controlStyles.buttonContent}>
        {loading ? (
          <ActivityIndicator
            testID="native-control-loading"
            size="small"
            color={type === "ghost" ? colors.accent : colors.onActiveControl}
          />
        ) : null}
        {children}
      </View>
    </Pressable>
  );
}

interface InputStyles {
  container?: StyleProp<ViewStyle>;
}

interface InputProps extends Omit<TextInputProps, "editable" | "style"> {
  allowClear?: boolean | { clearIcon?: React.ReactNode };
  disabled?: boolean;
  inputStyle?: StyleProp<TextStyle>;
  styles?: InputStyles;
  suffix?: React.ReactNode;
  type?: "password" | "text";
}

function NativeInput({
  allowClear,
  disabled = false,
  inputStyle,
  styles: inputStyles,
  suffix,
  type = "text",
  value,
  onChangeText,
  ...textInputProps
}: InputProps) {
  const { colors } = useTheme();
  const clearIcon = typeof allowClear === "object" ? allowClear.clearIcon : null;
  const showClear = Boolean(allowClear && value);

  return (
    <View
      style={[
        controlStyles.inputContainer,
        { backgroundColor: colors.surface, borderColor: colors.border },
        inputStyles?.container,
        disabled ? controlStyles.disabled : null,
      ]}
    >
      <TextInput
        {...textInputProps}
        value={value}
        editable={!disabled}
        secureTextEntry={type === "password"}
        onChangeText={onChangeText}
        style={[controlStyles.input, { color: colors.text }, inputStyle]}
      />
      {showClear ? (
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => onChangeText?.("")}
          style={controlStyles.inputAction}
        >
          {clearIcon ?? <Text style={{ color: colors.textMuted }}>×</Text>}
        </Pressable>
      ) : null}
      {suffix ? <View style={controlStyles.inputAction}>{suffix}</View> : null}
    </View>
  );
}

interface TextAreaProps extends InputProps {
  rows?: number;
}

function NativeTextArea({ rows = 5, ...props }: TextAreaProps) {
  return (
    <NativeInput
      {...props}
      multiline
      numberOfLines={rows}
      textAlignVertical="top"
    />
  );
}

export const Input = Object.assign(NativeInput, {
  TextArea: NativeTextArea,
});

interface ListStyles {
  Body?: StyleProp<ViewStyle>;
  BodyBottomLine?: StyleProp<ViewStyle>;
  List?: StyleProp<ViewStyle>;
}

interface ListProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  styles?: ListStyles;
  testID?: string;
}

function NativeList({ children, style, styles, testID }: ListProps) {
  return (
    <View testID={testID} style={[style, styles?.List, styles?.Body]}>
      {children}
    </View>
  );
}

interface ListItemStyles {
  Content?: StyleProp<TextStyle>;
  Extra?: StyleProp<ViewStyle>;
  Item?: StyleProp<ViewStyle>;
  Line?: StyleProp<ViewStyle>;
}

interface ListItemProps extends Omit<PressableProps, "children" | "style"> {
  children?: React.ReactNode;
  extra?: React.ReactNode;
  multipleLine?: boolean;
  style?: StyleProp<ViewStyle>;
  styles?: ListItemStyles;
  thumb?: React.ReactNode;
  wrap?: boolean;
}

function ListItemBrief({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  wrap?: boolean;
}) {
  return <Text style={style}>{children}</Text>;
}

function NativeListItem({
  children,
  disabled,
  extra,
  onPress,
  style,
  styles,
  thumb,
  ...pressableProps
}: ListItemProps) {
  const childNodes = React.Children.toArray(children);
  const briefNodes = childNodes.filter(
    (child) => React.isValidElement(child) && child.type === ListItemBrief,
  );
  const contentNodes = childNodes.filter(
    (child) => !(React.isValidElement(child) && child.type === ListItemBrief),
  );
  const content = (
    <View style={controlStyles.listContent}>
      {contentNodes.length > 0 ? (
        <Text style={styles?.Content}>{contentNodes}</Text>
      ) : null}
      {briefNodes}
    </View>
  );
  const row = (
    <View style={[controlStyles.listLine, styles?.Line]}>
      {thumb}
      {content}
      {extra ? <View style={styles?.Extra}>{extra}</View> : null}
    </View>
  );

  if (!onPress) {
    return <View style={[styles?.Item, style]}>{row}</View>;
  }

  return (
    <Pressable
      {...pressableProps}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles?.Item,
        style,
        pressed ? controlStyles.pressed : null,
        disabled ? controlStyles.disabled : null,
      ]}
    >
      {row}
    </Pressable>
  );
}

const ListItem = Object.assign(NativeListItem, { Brief: ListItemBrief });
export const List = Object.assign(NativeList, { Item: ListItem });

export interface DialogAction {
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  style?: StyleProp<TextStyle>;
  text: string;
}

interface DialogProps {
  children?: React.ReactNode;
  footer?: DialogAction[];
  maskClosable?: boolean;
  modalType?: string;
  onClose?: () => void;
  styles?: {
    buttonText?: StyleProp<TextStyle>;
    header?: StyleProp<TextStyle>;
  };
  title?: React.ReactNode;
  transparent?: boolean;
  visible: boolean;
}

export function Modal({
  children,
  footer = [],
  maskClosable = true,
  onClose,
  styles,
  title,
  visible,
}: DialogProps) {
  const { colors } = useTheme();

  return (
    <ReactNativeModal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      supportedOrientations={APP_MODAL_ORIENTATIONS}
      transparent
      visible={visible}
    >
      <View
        accessibilityViewIsModal
        style={[controlStyles.dialogOverlay, { backgroundColor: colors.overlay }]}
      >
        {maskClosable ? (
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <View
          style={[
            controlStyles.dialogCard,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              shadowColor: colors.glow,
            },
          ]}
        >
          {title ? (
            typeof title === "string" ? (
              <Text
                accessibilityRole="header"
                style={[
                  controlStyles.dialogTitle,
                  { color: colors.text },
                  styles?.header,
                ]}
              >
                {title}
              </Text>
            ) : (
              title
            )
          ) : null}
          <View style={controlStyles.dialogBody}>{children}</View>
          {footer.length > 0 ? (
            <View style={controlStyles.dialogFooter}>
              {footer.map((action, index) => (
                <Pressable
                  key={`${action.text}:${index}`}
                  accessibilityRole="button"
                  accessibilityState={{
                    busy: action.loading,
                    disabled: action.disabled || action.loading,
                  }}
                  disabled={action.disabled || action.loading}
                  onPress={action.onPress}
                  style={({ pressed }) => [
                    controlStyles.dialogAction,
                    pressed && !action.disabled && !action.loading
                      ? controlStyles.pressed
                      : null,
                    action.disabled || action.loading
                      ? controlStyles.disabled
                      : null,
                  ]}
                >
                  {action.loading ? (
                    <ActivityIndicator
                      testID="native-dialog-action-loading"
                      size="small"
                      color={colors.accent}
                    />
                  ) : null}
                  <Text
                    style={[
                      controlStyles.dialogActionText,
                      { color: colors.accent },
                      styles?.buttonText,
                      action.style,
                    ]}
                  >
                    {action.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </ReactNativeModal>
  );
}

interface TagProps {
  children: React.ReactNode;
  onChange: () => void;
  selected: boolean;
  styles?: {
    activeText?: StyleProp<TextStyle>;
    activeWrap?: StyleProp<ViewStyle>;
    normalText?: StyleProp<TextStyle>;
    normalWrap?: StyleProp<ViewStyle>;
  };
}

export function Tag({ children, onChange, selected, styles }: TagProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onChange}
      style={({ pressed }) => [
        controlStyles.tag,
        selected ? styles?.activeWrap : styles?.normalWrap,
        pressed ? controlStyles.pressed : null,
      ]}
    >
      <Text style={selected ? styles?.activeText : styles?.normalText}>
        {children}
      </Text>
    </Pressable>
  );
}

const controlStyles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  dialogAction: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  dialogActionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
  },
  dialogBody: {
    gap: 12,
  },
  dialogCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 12,
    gap: 16,
    maxHeight: "82%",
    maxWidth: 560,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    width: "88%",
  },
  dialogFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
  },
  dialogOverlay: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  dialogTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    lineHeight: 24,
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    minHeight: 44,
    paddingVertical: 10,
  },
  inputAction: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  inputContainer: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    minHeight: 46,
  },
  listContent: {
    flex: 1,
    gap: 3,
  },
  listLine: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pressed: {
    opacity: 0.72,
  },
  smallButton: {
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tag: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
