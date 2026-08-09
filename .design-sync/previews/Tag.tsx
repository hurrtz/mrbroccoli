import React from "react";
import { Tag, Text, View, darkColors, fonts, textStyles } from "mrbroccoli";

// Tag has no built-in text/wrap styling (NativeControls.tsx) — every caller
// supplies activeWrap/activeText/normalWrap/normalText. This ports the app's
// one real call site, the capability filter row in ConnectionsSettingsPage,
// built from darkColors and the same font families as textStyles.

const Canvas = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      width: "100%",
      gap: 16,
    }}
  >
    {children}
  </View>
);

const tagStyles = {
  normalWrap: { backgroundColor: darkColors.surface, borderColor: darkColors.border },
  normalText: { color: darkColors.textSecondary, fontFamily: fonts.body },
  activeWrap: { backgroundColor: darkColors.accentSoft, borderColor: darkColors.accent },
  activeText: { color: darkColors.accent, fontFamily: fonts.bodyMedium },
};

const FILTERS = ["All", "LLM", "TTS", "STT", "Web search", "Voices"];

// Canonical use: a horizontal filter row with one selection active, exactly
// as ConnectionsSettingsPage composes it.
export const CapabilityFilters = () => {
  const [selected, setSelected] = React.useState("LLM");
  return (
    <Canvas>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {FILTERS.map((label) => (
          <Tag
            key={label}
            selected={selected === label}
            onChange={() => setSelected(label)}
            styles={tagStyles}
          >
            {label}
          </Tag>
        ))}
      </View>
    </Canvas>
  );
};

// The same pair of states isolated and captioned for an unambiguous read.
export const SelectedVsUnselected = () => (
  <Canvas>
    <View style={{ flexDirection: "row", gap: 20 }}>
      <View style={{ alignItems: "center", gap: 8 }}>
        <Tag selected={false} onChange={() => {}} styles={tagStyles}>
          Anthropic
        </Tag>
        <Text style={{ ...textStyles.caption, color: darkColors.textMuted }}>
          Unselected
        </Text>
      </View>
      <View style={{ alignItems: "center", gap: 8 }}>
        <Tag selected onChange={() => {}} styles={tagStyles}>
          Anthropic
        </Tag>
        <Text style={{ ...textStyles.caption, color: darkColors.textMuted }}>Selected</Text>
      </View>
    </View>
  </Canvas>
);
