import React from "react";
import { AntPickerRow, AntPickerSection, Text, View, darkColors, fonts } from "mrbroccoli";

// AntPickerSection is AntSettingsCard + AntPickerRows + an optional info
// button, wired together (ListeningSettingsPage, SpeakingSettingsPage,
// SearchSettingsPage). It needs the dark app canvas the same as its parts do.
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

const descriptionText = {
  fontFamily: fonts.body,
  fontSize: 14,
  lineHeight: 20,
} as const;

// Title + rows + helperText, no description — ListeningSettingsPage's
// recognition-language section (no info button since there's no description).
export const RecognitionLanguage = () => (
  <Canvas>
    <AntPickerSection
      title="Recognition language"
      helperText="Choose a language to improve recognition, or leave it automatic for device or provider detection."
    >
      <AntPickerRow
        testID="stt-language-picker"
        value="auto"
        options={[
          { value: "auto", label: "Automatic" },
          { value: "en", label: "English" },
          { value: "de", label: "German" },
          { value: "es", label: "Spanish" },
          { value: "fr", label: "French" },
          { value: "ja", label: "Japanese" },
        ]}
        onChange={() => {}}
      />
    </AntPickerSection>
  </Canvas>
);

// Title + description (renders the info button) + two rows, no helperText —
// SpeakingSettingsPage's TTS provider section.
export const TtsProviderWithDescription = () => (
  <Canvas>
    <AntPickerSection
      title="TTS Provider"
      description={
        <View style={{ gap: 12 }}>
          <Text style={[descriptionText, { color: darkColors.textSecondary }]}>
            Only enabled providers with spoken-reply support appear here.
          </Text>
          <Text style={[descriptionText, { color: darkColors.textSecondary }]}>
            Language coverage: 32 languages.
          </Text>
        </View>
      }
    >
      <AntPickerRow
        testID="tts-provider-picker"
        label="TTS Provider"
        value="elevenlabs"
        options={[
          { value: "openai", label: "OpenAI" },
          { value: "elevenlabs", label: "ElevenLabs" },
          { value: "gemini", label: "Google Gemini" },
          { value: "xai", label: "xAI" },
        ]}
        onChange={() => {}}
      />
      <AntPickerRow
        label="Model"
        value="eleven_flash_v2_5"
        options={[
          { value: "eleven_flash_v2_5", label: "Eleven Flash v2.5" },
          { value: "eleven_multilingual_v2", label: "Eleven Multilingual v2" },
          { value: "eleven_v3", label: "Eleven v3" },
        ]}
        onChange={() => {}}
      />
    </AntPickerSection>
  </Canvas>
);

// Title + description + rows + helperText together — the on-device model
// section, which always carries a helper hint alongside its static row.
export const LocalSpeechModelWithHelper = () => (
  <Canvas>
    <AntPickerSection
      title="Local speech recognition"
      description="Runs entirely on this device — nothing is sent to a provider. Only models that fit this phone's capabilities are offered."
      helperText="Manage downloads and rerun the device check from On-device AI in settings."
    >
      <AntPickerRow
        testID="settings-model-local-stt"
        label="Model"
        value="whisper-small"
        options={[{ value: "whisper-small", label: "Whisper Small" }]}
        onChange={() => {}}
      />
    </AntPickerSection>
  </Canvas>
);
