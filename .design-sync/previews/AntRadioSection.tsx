import React from "react";
import { AntRadioSection, View, darkColors } from "mrbroccoli";

// AntRadioSection renders its own full AntSettingsCard (title as the card
// header, an info headerExtra appears automatically once any option carries
// a description or helperText is set) — always over the app canvas.
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

// Canonical use: AppSettingsPage.tsx's theme picker. Plain options, no
// descriptions, no helperText — the card shows only its title, no info
// action.
export const ThemeMode = () => (
  <Canvas>
    <AntRadioSection
      testID="app-theme"
      label="Theme"
      options={[
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" },
      ]}
      value="dark"
      onChange={() => {}}
    />
  </Canvas>
);

// Disabled option: ports ListeningSettingsPage.tsx's speech-to-text backend
// picker verbatim, including the real condition — on-device is disabled until
// a local model is downloaded. Per-option descriptions also trigger the info
// headerExtra.
export const SpeechToTextWithDisabledOption = () => (
  <Canvas>
    <AntRadioSection
      label="Speech to Text"
      options={[
        {
          value: "native",
          label: "System Recognition",
          description:
            "Use the operating system's speech recognizer. Depending on device settings, recognition may run on-device or through the system service. No provider key is required.",
        },
        {
          value: "provider",
          label: "Provider",
          description:
            "Use a configured external service to transcribe your voice before it is sent to the reply route.",
        },
        {
          value: "local",
          label: "On-device",
          description: "Runs fully offline once the model is downloaded.",
          disabled: true,
        },
      ]}
      value="native"
      onChange={() => {}}
    />
  </Canvas>
);

// helperText: ports AppSettingsPage.tsx's debug-log-button toggle verbatim.
// helperText appears inside the same info modal as any per-option
// descriptions, appended after them.
export const DebugLogButtonWithHelperText = () => (
  <Canvas>
    <AntRadioSection
      testID="settings-debug-log-button"
      label="Debug Log Button"
      options={[
        {
          value: "hide",
          label: "Hide",
          description:
            "Keep the home-screen LOG button hidden unless a capture is already running.",
        },
        {
          value: "show",
          label: "Show",
          description:
            "Show the home-screen LOG button for starting and stopping debug captures.",
        },
      ]}
      value="show"
      onChange={() => {}}
      helperText="How to use the button: toggling it on will start capturing logs. Toggling it off will stop capturing logs and move the captured ones into the clipboard."
    />
  </Canvas>
);
