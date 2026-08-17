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

/**
 * The pager is a closed circle: any decisive swipe leaves the current
 * surface, so neither direction is ever a dead end. With two pages a circle
 * is a toggle, which is why the direction of the swipe does not matter — only
 * that it was decisive.
 */
export function resolveSwipeSurface({
  activeSurface,
  pageStride,
  projectedTranslation,
}: {
  activeSurface: InputSurface;
  pageStride: number;
  projectedTranslation: number;
}): InputSurface {
  "worklet";
  if (Math.abs(projectedTranslation) < pageStride / 2) {
    return activeSurface;
  }
  return activeSurface === "voice" ? "text" : "voice";
}

/**
 * Where the track lands once the swipe is resolved. Both directions reach the
 * same other surface, so the travel direction is the only thing that says
 * which side that surface should arrive from — landing always on the canonical
 * side would drag the page back under the finger that just pulled it forward.
 */
export function resolveSwipeTarget({
  activeSurface,
  nextSurface,
  pageStride,
  projectedTranslation,
}: {
  activeSurface: InputSurface;
  nextSurface: InputSurface;
  pageStride: number;
  projectedTranslation: number;
}): number {
  "worklet";
  const base = -SURFACE_INDEX[activeSurface] * pageStride;
  if (nextSurface === activeSurface) {
    return base;
  }
  return base + (projectedTranslation > 0 ? pageStride : -pageStride);
}

/**
 * A chevron owns the side the next surface enters from. The target may sit one
 * cycle beyond that surface's canonical position; the page-wrap transforms
 * already draw the incoming surface on that side of the viewport.
 */
export function resolveChevronTarget({
  activeSurface,
  direction,
  pageStride,
}: {
  activeSurface: InputSurface;
  direction: "left" | "right";
  pageStride: number;
}): number {
  const base = -SURFACE_INDEX[activeSurface] * pageStride;
  return base + (direction === "left" ? pageStride : -pageStride);
}

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
    (direction: "left" | "right") => {
      const surface = activeSurface === "voice" ? "text" : "voice";
      const targetX = resolveChevronTarget({
        activeSurface,
        direction,
        pageStride,
      });
      if (reducedMotion) {
        trackTranslateX.value = targetX;
        applySurface(surface, false);
        return;
      }

      trackTranslateX.value = withTiming(
        targetX,
        { duration: 220 },
        (finished) => {
          if (finished) {
            runOnJS(applySurface)(surface, false);
          }
        },
      );
    },
    [
      activeSurface,
      applySurface,
      pageStride,
      reducedMotion,
      trackTranslateX,
    ],
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
          // One page of travel either way from where this page sits. The
          // wrapping side is not clamped away: the finger has to be answered
          // in both directions or the circle is one only in principle.
          const base = -activeSurfaceIndex.value * pageStrideShared.value;
          const nextX = gestureStartX.value + event.translationX;
          trackTranslateX.value = Math.max(
            base - pageStrideShared.value,
            Math.min(base + pageStrideShared.value, nextX),
          );
        })
        .onEnd((event) => {
          const activeSurfaceNow =
            activeSurfaceIndex.value === 0 ? "voice" : "text";
          const projectedTranslation =
            event.translationX + event.velocityX * 0.12;
          const nextSurface = resolveSwipeSurface({
            activeSurface: activeSurfaceNow,
            pageStride: pageStrideShared.value,
            projectedTranslation,
          });
          const targetX = resolveSwipeTarget({
            activeSurface: activeSurfaceNow,
            nextSurface,
            pageStride: pageStrideShared.value,
            projectedTranslation,
          });

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

  // Closing the circle without a third copy of either page: whichever page
  // would sit off the far edge is drawn one whole cycle around, so the surface
  // the finger pulls toward is the one that comes into view. Both offsets read
  // the same track value the card does, so they swap in the same frame and the
  // wrap is never visible.
  const voicePageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          trackTranslateX.value < -pageStrideShared.value
            ? pageStrideShared.value * 2
            : 0,
      },
    ],
  }));
  const textPageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          trackTranslateX.value > 0 ? -pageStrideShared.value * 2 : 0,
      },
    ],
  }));

  return {
    panGesture,
    selectSurface,
    textInputGesture,
    textPageStyle,
    trackAnimatedStyle,
    voicePageStyle,
  };
}
