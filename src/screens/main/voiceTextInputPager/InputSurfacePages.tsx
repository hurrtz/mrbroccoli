import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { GestureDetector, GestureType } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { VoiceOrb } from "../../../design-system/VoiceOrb";
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
  onSelectSurface: (surface: InputSurface) => void;
  onSubmitTextMessage: () => void;
  onTextFocusChange: (focused: boolean) => void;
  onTextMessageChange: (text: string) => void;
  pageWidth: number;
  panGesture: GestureType;
  promptBlockedMessage: string | null;
  stageSize: number;
  statusLabel: string;
  submissionDisabled: boolean;
  t: TranslateFn;
  voiceInputUnavailableMessage: string | null;
  textFocused: boolean;
  textInputGesture: GestureType;
  textInputRef: React.RefObject<TextInput | null>;
  textMessage: string;
  textSubmitDisabled: boolean;
  trackAnimatedStyle: ReturnType<
    typeof useInputSurfaceGesture
  >["trackAnimatedStyle"];
}

function SurfaceChevron({
  colors,
  direction,
  disabled,
  onPress,
  t,
}: {
  colors: Colors;
  direction: "left" | "right";
  disabled: boolean;
  onPress: () => void;
  t: TranslateFn;
}) {
  const showVoice = direction === "left";

  return (
    <TouchableOpacity
      testID={showVoice ? "show-voice-input" : "show-text-input"}
      accessibilityLabel={t(showVoice ? "showVoiceInput" : "showTextInput")}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.surfaceChevron,
        disabled ? styles.surfaceChevronDisabled : null,
      ]}
    >
      <PhosphorIcon
        name={direction}
        size="control"
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );
}

function VoiceInputSurface({
  disabled,
  inputMode,
  onPress,
  onPressIn,
  onPressOut,
  promptBlockedMessage,
  stageSize,
  statusLabel,
  submissionDisabled,
  voiceInputUnavailableMessage,
}: Pick<
  InputSurfacePagesProps,
  | "disabled"
  | "inputMode"
  | "onPress"
  | "onPressIn"
  | "onPressOut"
  | "promptBlockedMessage"
  | "stageSize"
  | "statusLabel"
  | "submissionDisabled"
  | "voiceInputUnavailableMessage"
>) {
  const actionDisabled =
    disabled || Boolean(voiceInputUnavailableMessage) || submissionDisabled;
  // Setup and availability reasons belong beside the orb, never in place of
  // it. The orb remains the stable primary affordance and does not secretly
  // become an introduction shortcut when no route is usable.
  const surfaceLabel = voiceInputUnavailableMessage ?? promptBlockedMessage;

  return (
    <View style={styles.orbSlot} testID="voice-input-surface">
      <VoiceOrb
        disabled={actionDisabled}
        label={surfaceLabel ?? statusLabel}
        onPress={
          actionDisabled || inputMode === "push-to-talk" ? undefined : onPress
        }
        onPressIn={
          actionDisabled || inputMode !== "push-to-talk" ? undefined : onPressIn
        }
        onPressOut={
          actionDisabled || inputMode !== "push-to-talk" ? undefined : onPressOut
        }
        size={stageSize}
        testID="voice-orb-idle"
      />
    </View>
  );
}

function TextInputSurface({
  colors,
  disabled,
  onSubmitTextMessage,
  onTextFocusChange,
  onTextMessageChange,
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
  | "t"
  | "textFocused"
  | "textInputGesture"
  | "textInputRef"
  | "textMessage"
  | "textSubmitDisabled"
>) {
  const primaryActionDisabled = disabled || textSubmitDisabled;

  return (
    <View
      testID="text-input-surface"
      style={[
        styles.textSurface,
        {
          backgroundColor: colors.surfaceElevated,
          // Green at rest, not only on focus: this is the other half of the
          // primary action, and the voice control it pages between is green
          // whenever it can be used. A neutral outline left the composer
          // looking secondary to a control the user may never reach, and it is
          // the composer that carries the workspace when voice cannot.
          borderColor: textFocused ? colors.activeControl : colors.accent,
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
        accessibilityLabel={t("sendTextMessage")}
        accessibilityRole="button"
        accessibilityState={{ disabled: primaryActionDisabled }}
        disabled={primaryActionDisabled}
        onPress={onSubmitTextMessage}
        activeOpacity={0.8}
        style={[
          styles.sendButton,
          {
            backgroundColor: primaryActionDisabled
              ? colors.surfaceAlt
              : colors.accent,
          },
        ]}
      >
        <PhosphorIcon
          name="arrow-up"
          size="control"
          color={
            primaryActionDisabled ? colors.textMuted : colors.onActiveControl
          }
        />
      </TouchableOpacity>
    </View>
  );
}

export function InputSurfacePages(props: InputSurfacePagesProps) {
  const {
    activeSurface,
    isActive,
    onSelectSurface,
    pageWidth,
    panGesture,
    trackAnimatedStyle,
  } = props;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        testID="voice-text-input-pager"
        accessibilityElementsHidden={isActive}
        importantForAccessibility={isActive ? "no-hide-descendants" : "auto"}
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
          <View style={styles.inputSwitchRow}>
            <SurfaceChevron
              direction="left"
              colors={props.colors}
              disabled
              onPress={() => onSelectSurface("voice")}
              t={props.t}
            />
            <View style={styles.inputSwitchSurface}>
              <VoiceInputSurface {...props} />
            </View>
            <SurfaceChevron
              direction="right"
              colors={props.colors}
              disabled={isActive || props.disabled}
              onPress={() => onSelectSurface("text")}
              t={props.t}
            />
          </View>
        </View>

        <View
          accessibilityElementsHidden={activeSurface !== "text"}
          importantForAccessibility={
            activeSurface === "text" ? "yes" : "no-hide-descendants"
          }
          style={[styles.page, { width: pageWidth }]}
        >
          <View style={styles.inputSwitchRow}>
            <SurfaceChevron
              direction="left"
              colors={props.colors}
              disabled={isActive || props.disabled}
              onPress={() => onSelectSurface("voice")}
              t={props.t}
            />
            <View style={styles.inputSwitchSurface}>
              <TextInputSurface {...props} />
            </View>
            <SurfaceChevron
              direction="right"
              colors={props.colors}
              disabled
              onPress={() => onSelectSurface("text")}
              t={props.t}
            />
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
