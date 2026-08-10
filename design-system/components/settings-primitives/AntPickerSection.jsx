import React from "react";
import { AntSettingsCard } from "./AntSettingsCard";
import { AntPickerRows } from "./AntPickerRows";

/** A titled card wrapping a group of picker rows. */
export function AntPickerSection({ title, children, helperText, headerExtra }) {
  return (
    <AntSettingsCard title={title} headerExtra={headerExtra} fullBleed>
      <AntPickerRows helperText={helperText}>{children}</AntPickerRows>
    </AntSettingsCard>
  );
}
