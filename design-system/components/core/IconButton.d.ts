import React from "react";
import type { IconSize, PhosphorIconName } from "./PhosphorIcon";

export interface IconButtonProps {
  icon?: PhosphorIconName;
  /** Use for the provider brand marks, which are not Phosphor glyphs. */
  iconNode?: React.ReactNode;
  iconSize?: IconSize;
  iconColor?: string;
  /** Selected state: accent-soft fill and an accent hairline. */
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  /** Required — an icon-only control has no visible label. */
  accessibilityLabel: string;
  style?: React.CSSProperties;
}

export declare function IconButton(props: IconButtonProps): JSX.Element;
