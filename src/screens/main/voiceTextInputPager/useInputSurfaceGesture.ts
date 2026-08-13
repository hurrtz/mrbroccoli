import React from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { InputSurface } from "./types";

const SURFACE_INDEX: Record<InputSurface, number> = {
  voice: 0,
  text: 1,
};

interface UseInputSurfaceGestureParams {
  activeSurface: InputSurface;
  applySurface: (surface: InputSurface, focusText: boolean) => void;
  pageStride: number;
}

export function useInputSurfaceGesture({
  activeSurface,
  applySurface,
  pageStride,
}: UseInputSurfaceGestureParams) {
  const reducedMotion = useReducedMotion();
  const pageStrideShared = useSharedValue(pageStride);
  const trackTranslateX = useSharedValue(0);
  const gestureStartX = useSharedValue(0);
  const activeSurfaceIndex = useSharedValue(0);
  const textInputGesture = React.useMemo(
    () => Gesture.Native().disallowInterruption(false),
    [],
  );

  const selectSurface = React.useCallback(
    (surface: InputSurface) => {
      const targetX = -SURFACE_INDEX[surface] * pageStride;
      if (reducedMotion) {
        trackTranslateX.value = targetX;
        applySurface(surface, surface === "text");
        return;
      }

      trackTranslateX.value = withTiming(
        targetX,
        { duration: 220 },
        (finished) => {
          if (finished) {
            runOnJS(applySurface)(surface, surface === "text");
          }
        },
      );
    },
    [applySurface, pageStride, reducedMotion, trackTranslateX],
  );

  React.useEffect(() => {
    pageStrideShared.value = pageStride;
    activeSurfaceIndex.value = SURFACE_INDEX[activeSurface];
    trackTranslateX.value = -SURFACE_INDEX[activeSurface] * pageStride;
  }, [
    activeSurface,
    activeSurfaceIndex,
    pageStride,
    pageStrideShared,
    trackTranslateX,
  ]);

  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-12, 12])
        .failOffsetY([-14, 14])
        .simultaneousWithExternalGesture(textInputGesture)
        .onStart(() => {
          gestureStartX.value = trackTranslateX.value;
        })
        .onUpdate((event) => {
          const nextX = gestureStartX.value + event.translationX;
          trackTranslateX.value = Math.max(
            -pageStrideShared.value,
            Math.min(0, nextX),
          );
        })
        .onEnd((event) => {
          const projectedX = trackTranslateX.value + event.velocityX * 0.12;
          const nextSurface: InputSurface =
            projectedX <= -pageStrideShared.value / 2 ? "text" : "voice";
          const targetX = -SURFACE_INDEX[nextSurface] * pageStrideShared.value;

          if (reducedMotion) {
            trackTranslateX.value = targetX;
            runOnJS(applySurface)(nextSurface, false);
            return;
          }

          trackTranslateX.value = withTiming(
            targetX,
            { duration: 220 },
            (finished) => {
              if (finished) {
                runOnJS(applySurface)(nextSurface, false);
              }
            },
          );
        })
        .onFinalize((_event, success) => {
          if (success) {
            return;
          }

          const targetX =
            -activeSurfaceIndex.value * pageStrideShared.value;
          trackTranslateX.value = reducedMotion
            ? targetX
            : withTiming(targetX, { duration: 220 });
        }),
    [
      activeSurfaceIndex,
      applySurface,
      gestureStartX,
      pageStrideShared,
      reducedMotion,
      textInputGesture,
      trackTranslateX,
    ],
  );

  const trackAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: trackTranslateX.value }],
  }));

  return {
    panGesture,
    selectSurface,
    textInputGesture,
    trackAnimatedStyle,
  };
}
