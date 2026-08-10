import React from "react";

export interface RouteBylineProps {
  /** Provider id for the brand mark. Ignored when local is true. */
  provider?: string;
  providerLabel?: string;
  /** The curated model name. For a local route: "On device · Qwen 2.5 1.5B". */
  modelName: string;
  /** Current effort. "Normal" for a model that exposes no effort control. */
  effort?: string;
  /** This model's own effort scale, low to high. Fewer than two values hides the dots. */
  effortLevels?: string[];
  /** An on-device route: shows the cpu glyph instead of a provider mark. */
  local?: boolean;
  /** false when only one model is configured — drops the caret and the press target. */
  switchable?: boolean;
  onPress?: () => void;
  assetBase?: string;
  style?: React.CSSProperties;
}

export declare function RouteByline(props: RouteBylineProps): JSX.Element;
