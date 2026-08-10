import React from "react";

/** The nineteen interface languages, in locale-registry order. */
export const INTRO_LANGUAGES: string[];

/** Language select plus a play control for the bundled speech examples. */
export interface IntroVoicePickerProps {
  /** Native names, in the order the picker should list them. */
  languages?: string[];
  value?: string;
  onChange?: (language: string) => void;
  playing?: boolean;
  onTogglePlay?: () => void;
  style?: React.CSSProperties;
}

export function IntroVoicePicker(props: IntroVoicePickerProps): JSX.Element;
