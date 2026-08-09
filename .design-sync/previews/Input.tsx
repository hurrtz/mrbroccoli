import React from "react";
import {
  Input,
  PhosphorIcon,
  Pressable,
  Text,
  View,
  darkColors,
  textStyles,
} from "mrbroccoli";

// `Input` is `Object.assign(NativeInput, { TextArea })`. NativeControls.tsx
// only themes the container's surface/border — every real call site
// (AntProviderVoiceSection, ProviderConnectionPanel) supplies its own label
// above the field plus `inputStyle` and `styles.container`.

const Canvas = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      width: "100%",
      gap: 14,
    }}
  >
    {children}
  </View>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <View style={{ gap: 8 }}>
    <Text style={{ ...textStyles.supporting, color: darkColors.textSecondary }}>
      {label}
    </Text>
    {children}
  </View>
);

const fieldContainerStyle = {
  backgroundColor: darkColors.surface,
  borderWidth: 1,
  borderColor: darkColors.border,
  borderRadius: 10,
  minHeight: 46,
};

const fieldInputStyle = {
  color: darkColors.text,
  fontFamily: textStyles.body.fontFamily,
  fontSize: 15,
  lineHeight: 21,
  paddingHorizontal: 12,
};

// Canonical text field with the clear affordance, ported from the provider
// TTS voice-id field.
export const TextField = () => {
  const [value, setValue] = React.useState("cedar");
  return (
    <Canvas>
      <Field label="TTS voice ID">
        <Input
          value={value}
          onChangeText={setValue}
          placeholder="e.g. cedar, verse, marin"
          placeholderTextColor={darkColors.textMuted}
          selectionColor={darkColors.accent}
          autoCapitalize="none"
          autoCorrect={false}
          allowClear={{
            clearIcon: (
              <PhosphorIcon name="close" size="inline" color={darkColors.textSecondary} />
            ),
          }}
          inputStyle={fieldInputStyle}
          styles={{ container: fieldContainerStyle }}
        />
      </Field>
    </Canvas>
  );
};

// The `type="password"|"text"` axis, ported from ProviderConnectionPanel's
// API key field: a `suffix` Pressable toggles which one is active. Both ends
// of the toggle are shown together since a single static capture can only
// hold one `useState` value per field.
const ToggleField = ({ revealed }: { revealed: boolean }) => (
  <Input
    value="sk-ant-api03-9fJ2kQd9vX1m5R7c"
    onChangeText={() => {}}
    type={revealed ? "text" : "password"}
    autoCapitalize="none"
    autoCorrect={false}
    autoComplete="off"
    textContentType="none"
    placeholder="sk-ant-..."
    placeholderTextColor={darkColors.textMuted}
    selectionColor={darkColors.accent}
    inputStyle={fieldInputStyle}
    suffix={
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={revealed ? "Hide key" : "Show key"}
        hitSlop={8}
        style={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: 44,
          minWidth: 44,
        }}
      >
        <PhosphorIcon
          name={revealed ? "eye-invisible" : "eye"}
          size="control"
          color={darkColors.textSecondary}
        />
      </Pressable>
    }
    styles={{ container: fieldContainerStyle }}
  />
);

export const PasswordToggle = () => (
  <Canvas>
    <Field label="Anthropic API key · masked">
      <ToggleField revealed={false} />
    </Field>
    <Field label="Anthropic API key · revealed">
      <ToggleField revealed />
    </Field>
  </Canvas>
);

// Input.TextArea, ported from the transcript-correction dialog (rows={8}
// there; trimmed to fit the card).
export const TextArea = () => {
  const [value, setValue] = React.useState(
    "The caller wanted to know if the refund lands back on the original card or as store credit, and I told them it depends on how they originally paid.",
  );
  return (
    <Canvas>
      <Field label="Correct the transcript">
        <Input.TextArea
          rows={5}
          value={value}
          onChangeText={setValue}
          inputStyle={fieldInputStyle}
          styles={{ container: fieldContainerStyle }}
        />
      </Field>
    </Canvas>
  );
};

export const Disabled = () => (
  <Canvas>
    <Field label="Anthropic API key">
      <Input
        value="sk-ant-api03-9fJ2kQd9vX1m5R7c"
        onChangeText={() => {}}
        type="password"
        disabled
        inputStyle={fieldInputStyle}
        styles={{ container: fieldContainerStyle }}
      />
    </Field>
    <Text style={{ ...textStyles.caption, color: darkColors.textMuted }}>
      Locked while a connection check is running
    </Text>
  </Canvas>
);
