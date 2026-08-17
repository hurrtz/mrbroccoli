import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import type { VoiceVisualPhase } from "../types";
import { OrbSatellite } from "./OrbSatellite";
import { VoiceOrb } from "./VoiceOrb";

const ORBIT_REACH = 34;
const DIAGONAL = Math.sin(Math.PI / 4);
// The diagonal control starts 22pt above its orbit centre, then needs the
// 44pt target, 5pt label gap, and up to two 12pt label lines. Reserving the
// complete 51pt tail keeps translated Restart and Stop labels inside the
// pager viewport instead of relying on overflow past the measured footprint.
const LABELLED_VERTICAL_ALLOWANCE = 51;

export interface OrbTransportLayout {
  centreX: number;
  centreY: number;
  height: number;
  radius: number;
  width: number;
}

export function getOrbTransportLayout(
  orbSize: number,
  labels: boolean,
): OrbTransportLayout {
  const radius = orbSize / 2 + ORBIT_REACH;
  const horizontalAllowance = labels ? 32 : 22;
  const verticalAllowance = labels ? LABELLED_VERTICAL_ALLOWANCE : 22;
  const width = Math.round(2 * (radius + horizontalAllowance));
  const height = Math.round(
    orbSize / 2 + Math.max(orbSize / 2, DIAGONAL * radius + verticalAllowance),
  );

  return {
    centreX: width / 2,
    centreY: orbSize / 2,
    height,
    radius,
    width,
  };
}

export function fitOrbTransportSize(params: {
  availableHeight: number;
  availableWidth: number;
  labels: boolean;
  maximum: number;
  minimum?: number;
}) {
  const minimum = Math.min(params.minimum ?? 96, params.maximum);
  let candidate = Math.floor(params.maximum);

  while (candidate > minimum) {
    const layout = getOrbTransportLayout(candidate, params.labels);
    if (
      layout.width <= params.availableWidth &&
      layout.height <= params.availableHeight
    ) {
      return candidate;
    }
    candidate -= 1;
  }

  return minimum;
}

interface OrbTransportLabels {
  back: string;
  forward: string;
  restart: string;
  stop: string;
}

interface OrbTransportProps {
  labels: boolean;
  onBack?: () => void;
  onForward?: () => void;
  onRestart?: () => void;
  onStop: () => void;
  phase: VoiceVisualPhase;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  transportLabels: OrbTransportLabels;
  voiceOrb: React.ComponentProps<typeof VoiceOrb>;
}

export function OrbTransport({
  labels,
  onBack,
  onForward,
  onRestart,
  onStop,
  phase,
  style,
  testID = "orb-transport",
  transportLabels,
  voiceOrb,
}: OrbTransportProps) {
  const layout = getOrbTransportLayout(voiceOrb.size ?? 196, labels);
  const keyWidth = labels ? 64 : 44;
  const showControls = phase !== "idle";
  const speaking = phase === "speaking";
  const controls = [
    {
      id: "restart",
      angle: 135,
      icon: "reload" as const,
      label: transportLabels.restart,
      disabled: !speaking || !onRestart,
      onPress: onRestart,
    },
    {
      id: "back",
      angle: 180,
      icon: "arrow-left" as const,
      label: transportLabels.back,
      disabled: !speaking || !onBack,
      onPress: onBack,
    },
    {
      id: "forward",
      angle: 0,
      icon: "arrow-right" as const,
      label: transportLabels.forward,
      disabled: !speaking || !onForward,
      onPress: onForward,
    },
    {
      id: "stop",
      angle: 45,
      icon: "stop" as const,
      label: transportLabels.stop,
      disabled: false,
      onPress: onStop,
      tone: "danger" as const,
    },
  ];

  return (
    <View
      style={[
        styles.root,
        { height: layout.height, width: layout.width },
        style,
      ]}
      testID={testID}
    >
      <VoiceOrb
        {...voiceOrb}
        phase={phase}
        style={[
          styles.orb,
          {
            left: layout.centreX - (voiceOrb.size ?? 196) / 2,
            top: 0,
          },
          voiceOrb.style,
        ]}
      />
      {showControls
        ? controls.map((control) => {
            const radians = (control.angle * Math.PI) / 180;
            return (
              <OrbSatellite
                key={control.id}
                accessibilityLabel={control.label}
                compact={!labels}
                disabled={control.disabled}
                icon={control.icon}
                label={control.label}
                onPress={control.onPress}
                style={[
                  styles.control,
                  {
                    left:
                      layout.centreX +
                      Math.cos(radians) * layout.radius -
                      keyWidth / 2,
                    top:
                      layout.centreY + Math.sin(radians) * layout.radius - 22,
                  },
                ]}
                testID={`orb-transport-${control.id}`}
                tone={control.tone}
              />
            );
          })
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    position: "absolute",
  },
  orb: {
    position: "absolute",
  },
  root: {
    flexShrink: 0,
    position: "relative",
  },
});
