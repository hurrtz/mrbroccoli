import React from "react";

/** A hairline rule with a word set into it, marking what follows as optional. */
export interface IntroDividerProps {
  label: string;
  style?: React.CSSProperties;
}

export function IntroDivider(props: IntroDividerProps): JSX.Element;
