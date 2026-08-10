import React from "react";

/** Step heading inside the introduction. Centred, headline face, 27/33. */
export interface IntroTitleProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function IntroTitle(props: IntroTitleProps): JSX.Element;
