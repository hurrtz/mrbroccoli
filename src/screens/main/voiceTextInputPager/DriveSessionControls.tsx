import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../theme/colors";
import { TranslateFn } from "../shared";
import { voiceTextInputPagerStyles as styles } from "./styles";

interface DriveSessionControlsProps {
  autoContinueEnabled: boolean;
  canRepeat: boolean;
  colors: Colors;
  countdownSeconds?: number | null;
  disabled: boolean;
  onContinue?: () => void | Promise<void>;
  onRepeat?: () => void | Promise<void>;
  onStop?: () => void | Promise<void>;
  t: TranslateFn;
}

/**
 * Drive Session's two on-screen controls: Repeat last, and one fixed-position
 * Pause/Resume toggle whose accent fill means the loop is live. Positions
 * never swap -- a driver aims by muscle memory -- and a disabled control dims
 * rather than disappears. The silence countdown appears as a chip above the
 * toggle it is about to fire.
 */
export function DriveSessionControls({
  autoContinueEnabled,
  canRepeat,
  colors,
  countdownSeconds = null,
  disabled,
  onContinue,
  onRepeat,
  onStop,
  t,
}: DriveSessionControlsProps) {
  const running = autoContinueEnabled;
  const repeatDisabled = disabled || !canRepeat;
  const showCountdown = running && countdownSeconds !== null;

  return (
    <View testID="drive-session-controls" style={styles.driveControls}>
      {showCountdown ? (
        <View
          style={[
            styles.driveCountdownChip,
            { backgroundColor: colors.accentSoft },
          ]}
          testID="drive-session-countdown"
        >
          <Text
            style={[styles.driveCountdownLabel, { color: colors.text }]}
            numberOfLines={1}
          >
            {t("driveSendsIn", { seconds: countdownSeconds })}
          </Text>
        </View>
      ) : null}

      <View style={styles.driveControlRow}>
        <TouchableOpacity
          testID="drive-session-repeat"
          accessibilityLabel={t("repeatDriveReply")}
          accessibilityRole="button"
          accessibilityState={{ disabled: repeatDisabled }}
          activeOpacity={0.72}
          disabled={repeatDisabled}
          onPress={() => {
            void onRepeat?.();
          }}
          style={[
            styles.driveControl,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              opacity: repeatDisabled ? 0.45 : 1,
            },
          ]}
        >
          <PhosphorIcon name="redo" size="compact" color={colors.text} />
          <Text style={[styles.driveControlLabel, { color: colors.text }]}>
            {t("repeatDriveReply")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="drive-session-toggle"
          accessibilityLabel={
            running ? t("stopDriveSession") : t("continueDriveSession")
          }
          accessibilityRole="button"
          accessibilityState={{ disabled, selected: running }}
          activeOpacity={0.72}
          disabled={disabled}
          onPress={() => {
            void (running ? onStop?.() : onContinue?.());
          }}
          style={[
            styles.driveControl,
            running
              ? {
                  backgroundColor: colors.accent,
                  borderColor: colors.accent,
                }
              : {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
            { opacity: disabled ? 0.45 : 1 },
          ]}
        >
          <PhosphorIcon
            name={running ? "pause" : "play"}
            size="compact"
            color={running ? colors.onAccent : colors.text}
          />
          <Text
            style={[
              styles.driveControlLabel,
              { color: running ? colors.onAccent : colors.text },
            ]}
          >
            {running ? t("stopDriveSession") : t("continueDriveSession")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
