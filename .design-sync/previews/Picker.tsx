import React from "react";
import { Picker, Text, View, darkColors, textStyles } from "mrbroccoli";

// This is the home-screen picker (src/components/Picker.tsx), not the
// settings AntPickerRow. Its one real call site is
// src/screens/main/styleSheetModal/ConversationVoiceSection.tsx, which hides
// the built-in label and supplies its own heading + description, using
// `dropdownLabel` to show which response route the voice belongs to. Voice
// names/labels are the real Kokoro catalogue (src/constants/kokoro.ts,
// "{name} · American/British female").

const VOICES = [
  { value: "af_maple", label: "Maple · American female" },
  { value: "af_sol", label: "Sol · American female" },
  { value: "bf_vale", label: "Vale · British female" },
];

const Canvas = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      width: "100%",
      maxWidth: 420,
    }}
  >
    {children}
  </View>
);

// General-purpose default: built-in label shown, no dropdownLabel override,
// so the inner micro-label falls back to "Selection" (src/i18n en.ts).
export const Default = () => (
  <Canvas>
    <Picker
      label="TTS Voice"
      value="af_maple"
      options={VOICES}
      onChange={() => {}}
    />
  </Canvas>
);

// Real composition ported from ConversationVoiceSection: the parent renders
// its own heading + description and hides Picker's own label, using
// dropdownLabel to name the response route this voice belongs to.
export const ConversationVoiceOverride = () => (
  <Canvas>
    <View style={{ gap: 4, marginBottom: 14 }}>
      <Text style={{ ...textStyles.subsectionTitle, color: darkColors.text }}>
        TTS Voice
      </Text>
      <Text
        style={{ ...textStyles.caption, color: darkColors.textSecondary }}
      >
        Choose the voice used by Claude Sonnet 5 in this conversation.
      </Text>
    </View>
    <Picker
      label="TTS Voice"
      value="af_sol"
      options={VOICES}
      onChange={() => {}}
      dropdownLabel="Claude Sonnet 5"
      hideLabel
    />
  </Canvas>
);

// Disabled: the selected route has no TTS route configured yet, so the
// control is inert and both the micro-label and value explain why
// (t("chooseCompatibleProviderFirst")).
export const Disabled = () => (
  <Canvas>
    <Picker
      label="TTS Voice"
      value="af_maple"
      options={VOICES}
      onChange={() => {}}
      disabled
    />
  </Canvas>
);
