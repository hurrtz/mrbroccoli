import React from "react";

export interface AntSectionIntroProps {
  title: string;
  /** A noun phrase, ending in a full stop. "Input mode and speech-to-text routing." */
  description?: React.ReactNode;
  extra?: React.ReactNode;
}

export declare function AntSectionIntro(props: AntSectionIntroProps): JSX.Element;
