import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import { VoiceOrb } from "../../../design-system/VoiceOrb";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { GestureDetector, GestureType } from "react-native-gesture-handler";
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
  onResolvePromptBlock?: () => void;
  onSubmitTextMessage: () => void;
  onTextFocusChange: (focused: boolean) => void;
  onTextMessageChange: (text: string) => void;
  pageWidth: number;
  panGesture: GestureType;
  promptBlockedActionEnabled: boolean;
  promptBlockedActionLabel: string | null;
  promptBlockedProgress: number | null;
  statusLabel: string;
  submissionDisabled: boolean;
  t: TranslateFn;
  /**
   * Set when nothing can hear the user. Unlike `submissionDisabled`, this
   * retires only the voice control: the whole point of the message is to send
   * the user to the composer, so typing has to stay live behind it.
   */
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

function VoiceInputSurface({
  colors,
  disabled,
  inputMode,
  onPress,
  onPressIn,
  onPressOut,
  onResolvePromptBlock,
  promptBlockedActionEnabled,
  promptBlockedActionLabel,
  promptBlockedProgress,
  statusLabel,
  submissionDisabled,
  voiceInputUnavailableMessage,
}: Pick<
  InputSurfacePagesProps,
  | "colors"
  | "disabled"
  | "inputMode"
  | "onPress"
  | "onPressIn"
  | "onPressOut"
  | "onResolvePromptBlock"
  | "promptBlockedActionEnabled"
  | "promptBlockedActionLabel"
  | "promptBlockedProgress"
  | "statusLabel"
  | "submissionDisabled"
  | "voiceInputUnavailableMessage"
>) {
  const canResolvePromptBlock =
    promptBlockedActionEnabled && Boolean(onResolvePromptBlock);
  const actionDisabled =
    disabled ||
    Boolean(voiceInputUnavailableMessage) ||
    (submissionDisabled && !canResolvePromptBlock);
  const handlePress = canResolvePromptBlock ? onResolvePromptBlock : onPress;
  // A resolvable block keeps its own call to action; the unavailable message
  // only fills the control when there is nothing else to say there.
  const surfaceLabel =
    promptBlockedActionLabel ?? voiceInputUnavailableMessage;

  const holdToTalk = inputMode === "push-to-talk" && !canResolvePromptBlock;

  return (
    <View style={styles.voiceSurface} testID="voice-input-page">
      {/* The orb is the control itself rather than a glyph inside a bar, so it
          takes the press handlers directly. Push-to-talk holds it; every other
          input mode taps it. */}
      <VoiceOrb
        accessibilityValue={
          promptBlockedProgress !== null
            ? { max: 100, min: 0, now: Math.round(promptBlockedProgress * 100) }
            : undefined
        }
        disabled={actionDisabled}
        label={surfaceLabel ?? statusLabel}
        onPress={holdToTalk ? undefined : handlePress}
        onPressIn={holdToTalk ? onPressIn : undefined}
        onPressOut={holdToTalk ? onPressOut : undefined}
        phase="idle"
        testID="voice-input-surface"
      />
      {surfaceLabel ? (
        <Text
          testID="voice-input-blocked-status"
          accessibilityLiveRegion="polite"
          numberOfLines={2}
          style={[
            styles.blockedActionLabel,
            { color: canResolvePromptBlock ? colors.accent : colors.textMuted },
          ]}
        >
          {surfaceLabel}
        </Text>
      ) : null}
    </View>
  );
}

function TextInputSurface({
  colors,
  disabled,
  onSubmitTextMessage,
  onTextFocusChange,
  onTextMessageChange,
  onResolvePromptBlock,
  promptBlockedActionEnabled,
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
  | "onResolvePromptBlock"
  | "promptBlockedActionEnabled"
  | "promptBlockedActionLabel"
  | "promptBlockedProgress"
  | "t"
  | "textFocused"
  | "textInputGesture"
  | "textInputRef"
  | "textMessage"
  | "textSubmitDisabled"
>) {
  const canResolvePromptBlock =
    promptBlockedActionEnabled && Boolean(onResolvePromptBlock);
  const primaryActionDisabled =
    disabled || (textSubmitDisabled && !canResolvePromptBlock);

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
        accessibilityLabel={promptBlockedActionLabel ?? t("sendTextMessage")}
        accessibilityRole="button"
        accessibilityState={{ disabled: primaryActionDisabled }}
        accessibilityValue={
          promptBlockedProgress !== null
            ? {
                min: 0,
                max: 100,
                now: Math.round(promptBlockedProgress * 100),
              }
            : undefined
        }
        disabled={primaryActionDisabled}
        onPress={
          canResolvePromptBlock ? onResolvePromptBlock : onSubmitTextMessage
        }
        activeOpacity={0.8}
        style={[
          styles.sendButton,
          promptBlockedActionLabel ? styles.sendButtonBlockedStatus : null,
          {
            backgroundColor: primaryActionDisabled
              ? colors.surfaceAlt
              : colors.bubbleUser,
          },
        ]}
      >
        {promptBlockedActionLabel ? (
          <Text
            testID="text-input-blocked-status"
            accessibilityLiveRegion="polite"
            numberOfLines={1}
            style={[
              styles.blockedActionLabel,
              {
                color: canResolvePromptBlock
                  ? colors.onPrimary
                  : colors.textMuted,
              },
            ]}
          >
            {promptBlockedActionLabel}
          </Text>
        ) : (
          <PhosphorIcon
            name="arrow-up"
            size="control"
            color={primaryActionDisabled ? colors.textMuted : colors.onPrimary}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

export function InputSurfacePages(props: InputSurfacePagesProps) {
  const { activeSurface, isActive, pageWidth, panGesture, trackAnimatedStyle } =
    props;

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
