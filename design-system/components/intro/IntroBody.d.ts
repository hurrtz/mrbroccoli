import React from "react";

/** The paragraph under an IntroTitle. */
export interface IntroBodyProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function IntroBody(props: IntroBodyProps): JSX.Element;
