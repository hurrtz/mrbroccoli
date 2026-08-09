import React from "react";
import { AntPickerRow, AntPickerRows, View, darkColors } from "mrbroccoli";

// AntPickerRow sits on the app canvas, grouped inside AntPickerRows for its
// normal/disabled/single-option states (as in SpeakingSettingsPage and
// ListeningSettingsPage) and bare for its `standalone` state (as in
// AntProviderVoiceSection, which places one flush-edge row directly in a
// section — no grouped list, no card). Either way it needs the dark
// background: the row surface colours read as invisible on a white page.
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

// Normal: interactive row, label + value + disclosure chevron.
export const NormalRow = () => (
  <Canvas>
    <AntPickerRows>
      <AntPickerRow
        testID="tts-provider-picker"
        label="TTS Provider"
        value="elevenlabs"
        options={[
          { value: "openai", label: "OpenAI" },
          { value: "elevenlabs", label: "ElevenLabs" },
          { value: "gemini", label: "Google Gemini" },
          { value: "xai", label: "xAI" },
          { value: "mistral", label: "Mistral" },
        ]}
        onChange={() => {}}
      />
    </AntPickerRows>
  </Canvas>
);

// Disabled: text mutes and the chevron disappears — the row a developer sees
// when the selected provider still needs attention.
export const DisabledRow = () => (
  <Canvas>
    <AntPickerRows helperText="Add an ElevenLabs API key to finish setting up this route.">
      <AntPickerRow
        testID="tts-provider-picker"
        label="TTS Provider"
        value="elevenlabs"
        disabled
        options={[
          { value: "openai", label: "OpenAI" },
          { value: "elevenlabs", label: "ElevenLabs · needs attention" },
        ]}
        onChange={() => {}}
      />
    </AntPickerRows>
  </Canvas>
);

// Single option: renders static (a plain View, not Pressable) with no
// chevron — the on-device model row when only one model is downloaded.
export const SingleOptionRow = () => (
  <Canvas>
    <AntPickerRows>
      <AntPickerRow
        testID="settings-model-local-stt"
        label="Model"
        value="whisper-small"
        options={[{ value: "whisper-small", label: "Whisper Small" }]}
        onChange={() => {}}
      />
    </AntPickerRows>
  </Canvas>
);

// Standalone: no AntPickerRows wrapper, flush edges — used bare inside a
// section, as AntProviderVoiceSection does for its voice picker.
export const StandaloneRow = () => (
  <Canvas>
    <AntPickerRow
      testID="provider-tts-voice-picker-elevenlabs"
      standalone
      label="TTS Voice"
      value="21m00Tcm4TlvDq8ikWAM"
      options={[
        { value: "21m00Tcm4TlvDq8ikWAM", label: "Rachel (built-in)" },
        { value: "domi", label: "Domi" },
        { value: "antoni", label: "Antoni" },
      ]}
      onChange={() => {}}
    />
  </Canvas>
);
