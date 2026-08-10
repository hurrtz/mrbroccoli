import React from "react";

export interface AntDisclosureCardProps {
  /** The header content — usually a title plus a summary line. */
  header: React.ReactNode;
  headerExtra?: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  toggleAccessibilityLabel?: string;
  style?: React.CSSProperties;
}

export declare function AntDisclosureCard(props: AntDisclosureCardProps): JSX.Element;
