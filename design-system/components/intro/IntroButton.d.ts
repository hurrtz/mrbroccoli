import React from "react";
import type { PhosphorIconName } from "../core/PhosphorIcon";

/** An action inside an introduction step. 52pt tall, cornered like the app's own buttons. */
export interface IntroButtonProps {
  label: string;
  icon?: PhosphorIconName;
  /** primary for the app's own path, premium for a paid one, secondary for a detour. */
  tone?: "primary" | "secondary" | "premium";
  onPress?: () => void;
  style?: React.CSSProperties;
}

export function IntroButton(props: IntroButtonProps): JSX.Element;
