import React from "react";
import { AntPickerRow, AntPickerRows, View, darkColors } from "mrbroccoli";

// Settings rows sit on the app canvas inside a settings page, not on the white
// preview page — without it the grouped surface has nothing to read against.
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

// AntPickerRows is a container: it renders whatever AntPickerRow children it
// is given onto one grouped surface, with optional helper text underneath.
// Alone it has nothing to draw, which is why the unauthored card came up
// blank — the true render is the composition.

export const RouteSettings = () => (
  <Canvas>
    <AntPickerRows>
    <AntPickerRow
      testID="picker-provider"
      label="Provider"
      value="anthropic"
      options={[
        { value: "anthropic", label: "Anthropic" },
        { value: "openai", label: "OpenAI" },
        { value: "gemini", label: "Google Gemini" },
        { value: "mistral", label: "Mistral" },
      ]}
      onChange={() => {}}
    />
    <AntPickerRow
      testID="picker-model"
      label="Model"
      value="claude-opus-5"
      options={[
        { value: "claude-opus-5", label: "Claude Opus 5" },
        { value: "claude-sonnet-5", label: "Claude Sonnet 5" },
      ]}
      onChange={() => {}}
    />
    </AntPickerRows>
  </Canvas>
);

export const WithHelperText = () => (
  <Canvas>
    <AntPickerRows helperText="Speech recognition runs on the device by default. A provider route is only used when the system recognizer is unavailable.">
    <AntPickerRow
      testID="picker-stt-mode"
      label="Speech to text"
      value="native"
      options={[
        { value: "native", label: "Device recognizer" },
        { value: "provider", label: "Provider route" },
      ]}
      onChange={() => {}}
    />
    </AntPickerRows>
  </Canvas>
);

export const DisabledAndSingleOption = () => (
  <Canvas>
    <AntPickerRows helperText="Only one voice is available for the selected model.">
    <AntPickerRow
      testID="picker-voice"
      label="Voice"
      value="alloy"
      options={[{ value: "alloy", label: "Alloy" }]}
      onChange={() => {}}
    />
    <AntPickerRow
      testID="picker-effort"
      label="Reasoning effort"
      value="standard"
      disabled
      options={[
        { value: "standard", label: "Standard" },
        { value: "extended", label: "Extended" },
      ]}
      onChange={() => {}}
    />
    </AntPickerRows>
  </Canvas>
);
