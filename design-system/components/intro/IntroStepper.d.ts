import React from "react";

/** Dots for the steps, a dash for the current one. Every marker is tappable. */
export interface IntroStepperProps {
  count: number;
  index?: number;
  onSelect?: (index: number) => void;
  style?: React.CSSProperties;
}

export function IntroStepper(props: IntroStepperProps): JSX.Element;
