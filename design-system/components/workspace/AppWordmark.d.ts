import React from "react";

export interface AppWordmarkProps {
  /** Localised app name. Never abbreviate it to an initial. */
  name?: string;
  color?: string;
  /** The pill treatment used when the top bar is short. */
  compact?: boolean;
  style?: React.CSSProperties;
}

export declare function AppWordmark(props: AppWordmarkProps): JSX.Element;
