import Feather from "@expo/vector-icons/Feather";
import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureDetector,
  GestureType,
  TouchableOpacity as GestureTouchableOpacity,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Colors } from "../../../theme/colors";
import { InputMode } from "../../../types";
import { TranslateFn } from "../shared";
import { PAGE_GAP, voiceTextInputPagerStyles as styles } from "./styles";
import { InputSurface } from "./types";
import type { useInputSurfaceGesture } from "./useInputSurfaceGesture";

interface InputSurfacePagesProps {
  activeSurface: InputSurface;
  colors: Colors;
  disabled: boolean;
  inputMode: InputMode;
  isActive: boolean;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onSubmitTextMessage: () => void;
  onTextFocusChange: (focused: boolean) => void;
  onTextMessageChange: (text: string) => void;
  pageWidth: number;
  panGesture: GestureType;
  promptBlockedActionLabel: string | null;
  promptBlockedProgress: number | null;
  statusLabel: string;
  submissionDisabled: boolean;
  t: TranslateFn;
  textFocused: boolean;
  textInputGesture: GestureType;
  textInputRef: React.RefObject<TextInput | null>;
  textMessage: string;
  textSubmitDisabled: boolean;
  trackAnimatedStyle: ReturnType<
    typeof useInputSurfaceGesture
  >["trackAnimatedStyle"];
}

function VoiceInputSurface({
  colors,
  disabled,
  inputMode,
  onPress,
  onPressIn,
  onPressOut,
  promptBlockedActionLabel,
  promptBlockedProgress,
  statusLabel,
  submissionDisabled,
}: Pick<
  InputSurfacePagesProps,
  | "colors"
  | "disabled"
  | "inputMode"
  | "onPress"
  | "onPressIn"
  | "onPressOut"
  | "promptBlockedActionLabel"
  | "promptBlockedProgress"
  | "statusLabel"
  | "submissionDisabled"
>) {
  const actionDisabled = disabled || submissionDisabled;

  return (
    <GestureTouchableOpacity
      testID="voice-input-surface"
      accessibilityLabel={promptBlockedActionLabel ?? statusLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: actionDisabled }}
      accessibilityValue={
        promptBlockedProgress !== null
          ? {
              min: 0,
              max: 100,
              now: Math.round(promptBlockedProgress * 100),
            }
          : undefined
      }
      activeOpacity={0.84}
      disabled={actionDisabled}
      onPress={inputMode === "push-to-talk" ? undefined : onPress}
      onPressIn={inputMode === "push-to-talk" ? onPressIn : undefined}
      onPressOut={inputMode === "push-to-talk" ? onPressOut : undefined}
      style={[
        styles.voiceSurface,
        {
          backgroundColor: actionDisabled
            ? colors.surfaceAlt
            : colors.activeControl,
          borderColor: actionDisabled
            ? colors.border
            : colors.activeControl,
        },
      ]}
    >
      {promptBlockedActionLabel ? (
        <Text
          testID="voice-input-blocked-status"
          numberOfLines={1}
          style={[styles.blockedActionLabel, { color: colors.textMuted }]}
        >
          {promptBlockedActionLabel}
        </Text>
      ) : (
        <View
          testID="voice-input-icon"
          style={[
            styles.voiceIcon,
            {
              backgroundColor: actionDisabled
                ? colors.surfaceElevated
                : colors.activeControlIconBackground,
            },
          ]}
        >
          <Feather
            name="mic"
            size={22}
            color={
              actionDisabled ? colors.textMuted : colors.activeControlIcon
            }
          />
        </View>
      )}
    </GestureTouchableOpacity>
  );
}

function TextInputSurface({
  colors,
  disabled,
  onSubmitTextMessage,
  onTextFocusChange,
  onTextMessageChange,
  promptBlockedActionLabel,
  promptBlockedProgress,
  t,
  textFocused,
  textInputGesture,
  textInputRef,
  textMessage,
  textSubmitDisabled,
}: Pick<
  InputSurfacePagesProps,
  | "colors"
  | "disabled"
  | "onSubmitTextMessage"
  | "onTextFocusChange"
  | "onTextMessageChange"
  | "promptBlockedActionLabel"
  | "promptBlockedProgress"
  | "t"
  | "textFocused"
  | "textInputGesture"
  | "textInputRef"
  | "textMessage"
  | "textSubmitDisabled"
>) {
  return (
    <View
      testID="text-input-surface"
      style={[
        styles.textSurface,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: textFocused ? colors.accent : colors.borderStrong,
          shadowColor: textFocused ? colors.glowStrong : colors.glow,
        },
      ]}
    >
      <View style={styles.textInputWrap}>
        <GestureDetector gesture={textInputGesture}>
          <TextInput
            ref={textInputRef}
            testID="voice-text-input"
            value={textMessage}
            onBlur={() => onTextFocusChange(false)}
            onChangeText={onTextMessageChange}
            onFocus={() => onTextFocusChange(true)}
            placeholder={t("textMessagePlaceholder")}
            placeholderTextColor={colors.textMuted}
            editable={!disabled}
            multiline
            returnKeyType="send"
            submitBehavior="submit"
            onSubmitEditing={onSubmitTextMessage}
            style={[styles.textInput, { color: colors.text }]}
          />
        </GestureDetector>
      </View>
      <TouchableOpacity
        testID="voice-text-primary-action"
        accessibilityLabel={
          promptBlockedActionLabel ?? t("sendTextMessage")
        }
        accessibilityRole="button"
        accessibilityState={{ disabled: textSubmitDisabled }}
        accessibilityValue={
          promptBlockedProgress !== null
            ? {
                min: 0,
                max: 100,
                now: Math.round(promptBlockedProgress * 100),
              }
            : undefined
        }
        disabled={textSubmitDisabled}
        onPress={onSubmitTextMessage}
        activeOpacity={0.8}
        style={[
          styles.sendButton,
          promptBlockedActionLabel ? styles.sendButtonBlockedStatus : null,
          {
            backgroundColor: textSubmitDisabled
              ? colors.surfaceAlt
              : colors.bubbleUser,
          },
        ]}
      >
        {promptBlockedActionLabel ? (
          <Text
            testID="text-input-blocked-status"
            numberOfLines={1}
            style={[styles.blockedActionLabel, { color: colors.textMuted }]}
          >
            {promptBlockedActionLabel}
          </Text>
        ) : (
          <Feather
            name="arrow-up"
            size={19}
            color={
              textSubmitDisabled ? colors.textMuted : colors.onPrimary
            }
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

export function InputSurfacePages(props: InputSurfacePagesProps) {
  const {
    activeSurface,
    isActive,
    pageWidth,
    panGesture,
    trackAnimatedStyle,
  } = props;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        testID="voice-text-input-pager"
        accessibilityElementsHidden={isActive}
        importantForAccessibility={
          isActive ? "no-hide-descendants" : "auto"
        }
        pointerEvents={isActive ? "none" : "auto"}
        style={[
          styles.track,
          { width: pageWidth * 2 + PAGE_GAP },
          trackAnimatedStyle,
          isActive ? styles.trackCovered : null,
        ]}
      >
        <View
          accessibilityElementsHidden={activeSurface !== "voice"}
          importantForAccessibility={
            activeSurface === "voice" ? "yes" : "no-hide-descendants"
          }
          style={[styles.page, { width: pageWidth }]}
        >
          <VoiceInputSurface {...props} />
        </View>

        <View
          accessibilityElementsHidden={activeSurface !== "text"}
          importantForAccessibility={
            activeSurface === "text" ? "yes" : "no-hide-descendants"
          }
          style={[styles.page, { width: pageWidth }]}
        >
          <TextInputSurface {...props} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
