import React from "react";

/** Grouped content on its own paper inside an introduction step. */
export interface IntroPanelProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface IntroPanelDividerProps {
  style?: React.CSSProperties;
}

export function IntroPanel(props: IntroPanelProps): JSX.Element;
export function IntroPanelDivider(props: IntroPanelDividerProps): JSX.Element;
