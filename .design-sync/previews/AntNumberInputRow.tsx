import React from "react";
import {
  AntNumberInputRow,
  AntSettingsCard,
  AntSwitchRow,
  Text,
  View,
  darkColors,
  fonts,
} from "mrbroccoli";

// AntNumberInputRow has no min/max props of its own — ThinkingSettingsPage's
// only call site pairs it with the Model Council switch above and a helper
// line below in one AntSettingsCard, and the low/high bound story lives in
// that surrounding copy (a call-count estimate, then a warning past the
// threshold). Reproducing the whole card is what makes a bare number+label
// row legible rather than a floating input.
const Canvas = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      width: "100%",
      maxWidth: 520,
    }}
  >
    {children}
  </View>
);

const helperText = {
  fontFamily: fonts.body,
  fontSize: 13,
  lineHeight: 19,
} as const;

const warningText = {
  fontFamily: fonts.body,
  fontSize: 13,
  lineHeight: 19,
} as const;

// Low end of the range: the shipped default of 2 rounds, no warning.
export const ReviewRoundsTypical = () => (
  <Canvas>
    <AntSettingsCard>
      <AntSwitchRow
        label="Show Model Council on the home screen"
        description="Allow multi-model deliberation when at least two home-screen models are ready."
        value={true}
        onChange={() => {}}
      />
      <AntNumberInputRow label="Review rounds" value={2} onChange={() => {}} />
      <Text style={[helperText, { color: darkColors.textSecondary }]}>
        Up to 7 model calls per message with the current setup.
      </Text>
    </AntSettingsCard>
  </Canvas>
);

// High end: past the 3-round threshold, the inline warning appears.
export const ReviewRoundsHighWithWarning = () => (
  <Canvas>
    <AntSettingsCard>
      <AntSwitchRow
        label="Show Model Council on the home screen"
        description="Allow multi-model deliberation when at least two home-screen models are ready."
        value={true}
        onChange={() => {}}
      />
      <AntNumberInputRow label="Review rounds" value={5} onChange={() => {}} />
      <Text style={[helperText, { color: darkColors.textSecondary }]}>
        Up to 13 model calls per message with the current setup.
      </Text>
      <Text
        accessibilityRole="alert"
        style={[warningText, { color: darkColors.danger }]}
      >
        More than 4 models or 3 rounds can take a long time, consume many
        tokens, and hit provider context or rate limits. This is a warning
        only.
      </Text>
    </AntSettingsCard>
  </Canvas>
);
