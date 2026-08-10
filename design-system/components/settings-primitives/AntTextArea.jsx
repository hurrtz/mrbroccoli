import React from "react";
import { TextArea } from "../core/TextArea";

/** The settings-page multi-line field. Same box as TextArea, card-aware defaults. */
export function AntTextArea({ value, placeholder, onChange, disabled = false }) {
  return <TextArea value={value} placeholder={placeholder} onChange={onChange} disabled={disabled} />;
}
