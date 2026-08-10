import React from "react";
import type { PhosphorIconName } from "../core/PhosphorIcon";

/** A fact or benefit inside an IntroPanel, with a leading glyph. */
export interface IntroPointProps {
  icon: PhosphorIconName;
  title: string;
  /** Optional second line. Omit for a bare statement. */
  body?: string;
  /** accent for what is required, neutral for what is not, premium for paid capability. */
  tone?: "accent" | "neutral" | "premium";
  style?: React.CSSProperties;
}

export function IntroPoint(props: IntroPointProps): JSX.Element;
