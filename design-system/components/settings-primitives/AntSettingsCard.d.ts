import React from "react";

/** The quiet card every settings page is built from: hairline border, 16 radius, optional heading. */
export interface AntSettingsCardProps {
  title?: React.ReactNode;
  /** Trailing header slot — normally the info button. */
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Drop content padding so rows can run edge to edge. */
  fullBleed?: boolean;
  style?: React.CSSProperties;
}

export declare function AntSettingsCard(props: AntSettingsCardProps): JSX.Element;
