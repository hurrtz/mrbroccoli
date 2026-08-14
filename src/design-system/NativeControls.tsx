import React from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Easing,
  Modal as ReactNativeModal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const borderColor = type === "ghost" ? colors.border : backgroundColor;

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
        pressed && !unavailable ? (activeStyle ?? controlStyles.pressed) : null,
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
  const clearIcon =
    typeof allowClear === "object" ? allowClear.clearIcon : null;
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
  tone?: "default" | "success";
}

const SHEET_MAX_HEIGHT_RATIO = 0.85;
const SHEET_ANIMATION_DURATION = 220;
// Slightly longer than the animation so the real completion callback always
// wins under normal conditions; this only fires if that callback is
// suppressed (app backgrounded mid-animation, native driver interrupted).
const SHEET_ANIMATION_FAILSAFE_DURATION = SHEET_ANIMATION_DURATION + 100;
const SHEET_DRAG_SLOP = 6;
const SHEET_DISMISS_DISTANCE = 96;
const SHEET_DISMISS_VELOCITY = 0.8;

/**
 * A downward move on the sheet's handle claims the drag.
 *
 * **Decision:** the handle owns the gesture; the card does not. A sheet may
 * hold a scroll view, and in a scrolling list a downward drag is how the
 * reader goes back through what was already said — the same motion that
 * closes the sheet. Nothing about the touch distinguishes the two intentions,
 * so the surface has to: pulling the thing the user grabs to open it is what
 * closes it again.
 */
export function shouldClaimSheetDrag({ dx, dy }: { dx: number; dy: number }) {
  return dy > SHEET_DRAG_SLOP && dy > Math.abs(dx);
}

/** Releasing far or fast enough closes; anything else springs back. */
export function shouldDismissSheetDrag({ dy, vy }: { dy: number; vy: number }) {
  return dy > SHEET_DISMISS_DISTANCE || vy > SHEET_DISMISS_VELOCITY;
}

interface DialogProps {
  cardStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  footer?: DialogAction[];
  layout?: "dialog" | "sheet";
  maskClosable?: boolean;
  modalType?: string;
  onClose?: () => void;
  onDismiss?: () => void;
  styles?: {
    buttonText?: StyleProp<TextStyle>;
    header?: StyleProp<TextStyle>;
  };
  title?: React.ReactNode;
  transparent?: boolean;
  visible: boolean;
}

export function Modal({
  cardStyle,
  children,
  footer = [],
  layout = "dialog",
  maskClosable = true,
  onClose,
  onDismiss,
  styles,
  title,
  visible,
}: DialogProps) {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // A full-width sheet on a landscape window is a wide, short strip, and its
  // top gap eats the height that keeps the footer actions on-screen.
  const isSheet = layout === "sheet" && height > width;
  const sheetMaxHeight = Math.min(
    height * SHEET_MAX_HEIGHT_RATIO,
    height - insets.top,
  );

  const [sheetRendered, setSheetRendered] = React.useState(visible);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const sheetProgress = React.useRef(
    new Animated.Value(visible ? 1 : 0),
  ).current;
  // The grabber's promise is "pull down to close": a downward drag on the
  // handle follows the finger and releases into a close or a spring back.
  // Taps and the content's own scrolling are untouched — the responder lives
  // on the handle alone and only claims after slop.
  const sheetDragY = React.useRef(new Animated.Value(0)).current;
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;
  const reduceMotionRef = React.useRef(reduceMotion);
  reduceMotionRef.current = reduceMotion;
  const settleSheetDrag = React.useCallback(() => {
    if (reduceMotionRef.current) {
      sheetDragY.setValue(0);
      return;
    }
    Animated.spring(sheetDragY, {
      bounciness: 4,
      speed: 20,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, [sheetDragY]);
  const sheetPanResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_event, gesture) =>
        shouldClaimSheetDrag({ dx: gesture.dx, dy: gesture.dy }),
      onPanResponderMove: (_event, gesture) => {
        sheetDragY.setValue(Math.max(0, gesture.dy));
      },
      onPanResponderRelease: (_event, gesture) => {
        if (shouldDismissSheetDrag({ dy: gesture.dy, vy: gesture.vy })) {
          onCloseRef.current?.();
          return;
        }
        settleSheetDrag();
      },
      onPanResponderTerminate: () => {
        settleSheetDrag();
      },
      onPanResponderTerminationRequest: () => false,
    }),
  ).current;

  React.useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active && enabled !== reduceMotionRef.current) {
        reduceMotionRef.current = enabled;
        setReduceMotion(enabled);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    if (!isSheet) {
      // Non-sheet dialogs render directly from `visible`; synchronizing the
      // sheet-only mount state here creates an unnecessary post-render update
      // (and can briefly outlive a dialog that unmounts immediately).
      return;
    }

    if (visible) {
      setSheetRendered(true);
      // A prior drag-dismissal leaves its offset behind; a fresh open
      // starts from the resting position.
      sheetDragY.setValue(0);
    }

    // Reduce motion still has to settle the value, otherwise the deferred
    // unmount would wait for an animation that never runs.
    if (reduceMotion) {
      sheetProgress.setValue(visible ? 1 : 0);
      setSheetRendered(visible);
      return;
    }

    const animation = Animated.timing(sheetProgress, {
      duration: SHEET_ANIMATION_DURATION,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished && !visible) {
        setSheetRendered(false);
      }
    });

    // Failsafe: the completion callback above is the normal unmount path,
    // but it can be suppressed (app backgrounded mid-animation, native
    // driver interrupted). Without this, a suppressed callback leaves
    // sheetRendered stuck true forever: the sheet stays mounted, invisible
    // and off-screen, holding the native modal stack and swallowing the
    // Android back press. Whichever timer fires first wins; the other is a
    // no-op because sheetRendered is already false.
    const failsafeTimer = visible
      ? null
      : setTimeout(() => {
          setSheetRendered(false);
        }, SHEET_ANIMATION_FAILSAFE_DURATION);

    return () => {
      animation.stop();
      if (failsafeTimer) {
        clearTimeout(failsafeTimer);
      }
    };
  }, [isSheet, reduceMotion, sheetDragY, sheetProgress, visible]);

  return (
    <ReactNativeModal
      animationType={isSheet ? "none" : "fade"}
      onDismiss={onDismiss}
      onRequestClose={onClose}
      statusBarTranslucent
      supportedOrientations={APP_MODAL_ORIENTATIONS}
      transparent
      visible={isSheet ? sheetRendered : visible}
    >
      <Animated.View
        testID="native-dialog-overlay"
        accessibilityViewIsModal
        style={[
          controlStyles.dialogOverlay,
          isSheet ? controlStyles.sheetOverlay : null,
          { backgroundColor: colors.overlay },
          isSheet ? { opacity: sheetProgress } : null,
        ]}
      >
        {maskClosable ? (
          // Backdrop-only dismiss layers stay out of the accessibility tree
          // (design-system SPEC); screen-reader users dismiss through the
          // dialog's labeled actions instead of an anonymous button.
          <Pressable
            testID="native-dialog-backdrop"
            accessible={false}
            importantForAccessibility="no"
            onPress={onClose}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <Animated.View
          testID="native-dialog-card"
          style={[
            controlStyles.dialogCard,
            isSheet ? controlStyles.sheetCard : null,
            isSheet ? { maxHeight: sheetMaxHeight } : null,
            // dialogCard's flat padding: 20 pins the footer flush to the
            // window edge; on devices with a home-indicator gesture band
            // (bottom safe-area inset) that leaves the footer actions
            // partly inside it. Only the sheet touches the physical bottom
            // edge, so only the sheet needs the extra clearance.
            isSheet ? { paddingBottom: 20 + insets.bottom } : null,
            isSheet
              ? {
                  transform: [
                    {
                      translateY: Animated.add(
                        sheetProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [sheetMaxHeight, 0],
                        }),
                        sheetDragY,
                      ),
                    },
                  ],
                }
              : null,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              shadowColor: colors.glow,
            },
            cardStyle,
          ]}
        >
          {title ? (
            <View
              testID={isSheet ? "native-sheet-handle" : undefined}
              {...(isSheet ? sheetPanResponder.panHandlers : null)}
            >
              {typeof title === "string" ? (
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
              )}
            </View>
          ) : null}
          <View testID="native-dialog-body" style={controlStyles.dialogBody}>
            {children}
          </View>
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
                    action.tone === "success"
                      ? { backgroundColor: colors.success }
                      : null,
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
                      {
                        color:
                          action.tone === "success"
                            ? colors.onActiveControl
                            : colors.accent,
                      },
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
        </Animated.View>
      </Animated.View>
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
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  // One commit button: the full-width primary action is 48pt on the control
  // radius wherever it appears, dialogs included.
  dialogAction: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  dialogActionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
  },
  dialogBody: {
    // Shrinks before the title and footer so oversized content scrolls inside
    // the capped card instead of pushing the footer actions off-screen.
    flexShrink: 1,
    gap: 12,
  },
  dialogCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 12,
    gap: 16,
    maxHeight: "82%",
    maxWidth: 560,
    overflow: "hidden",
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    width: "88%",
  },
  dialogFooter: {
    gap: 8,
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
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tag: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sheetCard: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Overrides dialogCard's 560pt cap. Set to "100%" rather than undefined,
    // because StyleSheet.create drops undefined values instead of overriding.
    maxWidth: "100%",
    width: "100%",
  },
  sheetOverlay: {
    justifyContent: "flex-end",
    padding: 0,
  },
});
