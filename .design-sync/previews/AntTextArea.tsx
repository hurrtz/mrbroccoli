import React from "react";
import { AntSettingsCard, AntTextArea, Text, View, darkColors, fonts } from "mrbroccoli";

// AntTextArea appears two ways in the app: bare inside a full-width field
// wrapper (ThinkingSettingsPage's system prompt) and inside an AntSettingsCard
// (SpeakingSettingsPage's speech delivery instructions). Both sit on the dark
// app canvas — its surface/border colours are invisible on the white preview
// page.
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

// Filled: the real default assistant instructions, as a bare field — matches
// ThinkingSettingsPage's system-prompt editor (no card, full-width wrapper).
export const AssistantInstructionsFilled = () => (
  <Canvas>
    <View style={{ width: "100%" }}>
      <AntTextArea
        value="You are a voice assistant. The user is speaking to you and will hear your response read aloud. Respond naturally and conversationally as if talking. Never use markdown, bullet points, numbered lists, headers, or any formatting. Keep responses concise and spoken-friendly."
        placeholder="Define how the assistant should behave."
        onChange={() => {}}
      />
    </View>
  </Canvas>
);

// Empty: placeholder visible, inside the card SpeakingSettingsPage uses for
// speech delivery instructions.
export const SpeechDeliveryEmpty = () => (
  <Canvas>
    <AntSettingsCard title="Speech delivery instructions">
      <AntTextArea
        value=""
        placeholder="For example: Speak warmly, clearly, and at a relaxed pace."
        onChange={() => {}}
      />
    </AntSettingsCard>
  </Canvas>
);

// Disabled: same card, shown when the active speech route does not support
// delivery instructions — the field dims and stops accepting input.
export const SpeechDeliveryDisabled = () => (
  <Canvas>
    <AntSettingsCard title="Speech delivery instructions">
      <Text style={[helperText, { color: darkColors.textSecondary }]}>
        The current speech route does not support delivery instructions.
      </Text>
      <AntTextArea
        value=""
        placeholder="For example: Speak warmly, clearly, and at a relaxed pace."
        disabled
        onChange={() => {}}
      />
    </AntSettingsCard>
  </Canvas>
);
