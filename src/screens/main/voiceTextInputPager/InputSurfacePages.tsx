import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { GestureDetector, GestureType } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import {
  getOrbTransportLayout,
  OrbTransport,
} from "../../../design-system/OrbTransport";
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
  onRestartReply?: () => void;
  onSeekBack?: () => void;
  onSeekForward?: () => void;
  onStopPlayback: () => void;
  onSelectSurface: (direction: "left" | "right") => void;
  onSubmitTextMessage: () => void;
  onTextFocusChange: (focused: boolean) => void;
  onTextMessageChange: (text: string) => void;
  pageWidth: number;
  panGesture: GestureType;
  promptBlockedMessage: string | null;
  rtl: boolean;
  showTransportLabels: boolean;
  stageSize: number;
  statusLabel: string;
  submissionDisabled: boolean;
  t: TranslateFn;
  transportLabels: React.ComponentProps<typeof OrbTransport>["transportLabels"];
  voiceInputUnavailableMessage: string | null;
  textFocused: boolean;
  textInputGesture: GestureType;
  textInputRef: React.RefObject<TextInput | null>;
  textMessage: string;
  textPageStyle: ReturnType<typeof useInputSurfaceGesture>["textPageStyle"];
  textSubmitDisabled: boolean;
  trackAnimatedStyle: ReturnType<
    typeof useInputSurfaceGesture
  >["trackAnimatedStyle"];
  voicePageStyle: ReturnType<typeof useInputSurfaceGesture>["voicePageStyle"];
}

function SurfaceChevron({
  colors,
  direction,
  onPress,
  t,
  target,
}: {
  colors: Colors;
  direction: "left" | "right";
  onPress: () => void;
  t: TranslateFn;
  /** Where this caret leads. On a circular pager both carets on a page lead
      to the same other surface, so the label follows the target, not the
      glyph's direction. */
  target: InputSurface;
}) {
  return (
    <TouchableOpacity
      testID={`pager-chevron-${direction}`}
      accessibilityLabel={t(
        target === "voice" ? "showVoiceInput" : "showTextInput",
      )}
      accessibilityRole="button"
      accessibilityState={{ disabled: false }}
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.surfaceChevron}
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
  onRestartReply,
  onSeekBack,
  onSeekForward,
  onStopPlayback,
  promptBlockedMessage,
  stageSize,
  statusLabel,
  submissionDisabled,
  rtl,
  showTransportLabels,
  transportLabels,
  voiceInputUnavailableMessage,
}: Pick<
  InputSurfacePagesProps,
  | "disabled"
  | "inputMode"
  | "onPress"
  | "onPressIn"
  | "onPressOut"
  | "onRestartReply"
  | "onSeekBack"
  | "onSeekForward"
  | "onStopPlayback"
  | "promptBlockedMessage"
  | "stageSize"
  | "statusLabel"
  | "submissionDisabled"
  | "rtl"
  | "showTransportLabels"
  | "transportLabels"
  | "voiceInputUnavailableMessage"
>) {
  const actionDisabled =
    disabled || Boolean(voiceInputUnavailableMessage) || submissionDisabled;
  // Setup and availability reasons belong beside the orb, never in place of
  // it. The orb remains the stable primary affordance and does not secretly
  // become a setup shortcut when no route is usable.
  const surfaceLabel = voiceInputUnavailableMessage ?? promptBlockedMessage;

  return (
    <View style={styles.orbSlot} testID="voice-input-surface">
      <OrbTransport
        labels={showTransportLabels ?? true}
        onBack={onSeekBack}
        onForward={onSeekForward}
        onRestart={onRestartReply}
        onStop={onStopPlayback}
        phase="idle"
        testID="orb-transport-idle"
        transportLabels={transportLabels}
        voiceOrb={{
          disabled: actionDisabled,
          label: surfaceLabel ?? statusLabel,
          onPress:
            actionDisabled || inputMode === "push-to-talk"
              ? undefined
              : onPress,
          onPressIn:
            actionDisabled || inputMode !== "push-to-talk"
              ? undefined
              : onPressIn,
          onPressOut:
            actionDisabled || inputMode !== "push-to-talk"
              ? undefined
              : onPressOut,
          rtl,
          size: stageSize,
          testID: "voice-orb-idle",
        }}
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
    textPageStyle,
    trackAnimatedStyle,
    voicePageStyle,
  } = props;

  const targetSurface = activeSurface === "voice" ? "text" : "voice";
  const transportLayout = getOrbTransportLayout(
    props.stageSize,
    props.showTransportLabels,
  );
  const chevronCentreOffsetY =
    transportLayout.centreY - transportLayout.height / 2;

  return (
    <View style={styles.pagerShell} testID="voice-text-input-pager-shell">
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
          <Animated.View
            accessibilityElementsHidden={activeSurface !== "voice"}
            importantForAccessibility={
              activeSurface === "voice" ? "yes" : "no-hide-descendants"
            }
            style={[styles.page, { width: pageWidth }, voicePageStyle]}
          >
            <View style={styles.inputSwitchRow}>
              <View style={styles.inputSwitchSurface}>
                <VoiceInputSurface {...props} />
              </View>
            </View>
          </Animated.View>

          <Animated.View
            accessibilityElementsHidden={activeSurface !== "text"}
            importantForAccessibility={
              activeSurface === "text" ? "yes" : "no-hide-descendants"
            }
            style={[styles.page, { width: pageWidth }, textPageStyle]}
          >
            <View style={styles.inputSwitchRow}>
              <View style={styles.inputSwitchSurface}>
                <TextInputSurface {...props} />
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <View
        accessibilityElementsHidden={isActive}
        importantForAccessibility={isActive ? "no-hide-descendants" : "auto"}
        pointerEvents={isActive ? "none" : "box-none"}
        style={[
          styles.chevronLayer,
          { transform: [{ translateY: chevronCentreOffsetY }] },
          isActive ? styles.chevronLayerCovered : null,
        ]}
        testID="pager-chevron-layer"
      >
        <SurfaceChevron
          direction="left"
          colors={props.colors}
          onPress={() => onSelectSurface("left")}
          t={props.t}
          target={targetSurface}
        />
        <View pointerEvents="none" style={styles.chevronSpacer} />
        <SurfaceChevron
          direction="right"
          colors={props.colors}
          onPress={() => onSelectSurface("right")}
          t={props.t}
          target={targetSurface}
        />
      </View>
    </View>
  );
}
