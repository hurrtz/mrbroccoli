import React from "react";
import { AntButtonLabel, Button, View, darkColors } from "mrbroccoli";

// AntButtonLabel has no surface of its own — it is the icon+text row Button
// renders as its child (Button never styles children itself; see
// AntPreviewComposer.tsx, ProviderConnectionPanel.tsx, AntTtsSections.tsx).
// Its whole job is picking a colour that reads against the Button `type` it
// sits inside, so every cell here is a real (type, color) pairing from the
// app rather than AntButtonLabel in isolation.
const Canvas = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      width: "100%",
      maxWidth: 520,
      alignItems: "flex-start",
    }}
  >
    {children}
  </View>
);

// Primary surface: colors.onActiveControl, the button fill's own foreground —
// ports the preview-voice button from AntPreviewComposer.tsx.
export const Primary = () => (
  <Canvas>
    <Button type="primary" onPress={() => {}}>
      <AntButtonLabel
        color={darkColors.onActiveControl}
        icon="sound"
        iconSize="compact"
        label="Preview Voice"
      />
    </Button>
  </Canvas>
);

// Ghost surface: colors.accent — ports the "Add model" button from
// ThinkingSettingsPage.tsx (type omitted there too; ghost is Button's
// default).
export const Ghost = () => (
  <Canvas>
    <Button onPress={() => {}}>
      <AntButtonLabel color={darkColors.accent} icon="plus" label="Add model" />
    </Button>
  </Canvas>
);

// Warning surface: colors.onDanger. No real call site pairs a labelled
// AntButtonLabel with type="warning" today — the app's only warning buttons
// are icon-only (AntTtsSections.tsx "remove fallback route") — so this cell
// is a plausible composition, not a ported one. Flagged in learnings.
export const Warning = () => (
  <Canvas>
    <Button type="warning" onPress={() => {}}>
      <AntButtonLabel
        color={darkColors.onDanger}
        icon="delete"
        label="Delete conversation"
      />
    </Button>
  </Canvas>
);

// Loading state: Button renders its ActivityIndicator alongside children, not
// instead of them, so the label stays put — ports the readable-backup export
// button from DataPrivacySettingsPage.tsx (a ghost button whose label uses
// colors.text rather than colors.accent, also a real pattern there).
export const LoadingExport = () => (
  <Canvas>
    <Button loading disabled onPress={() => {}}>
      <AntButtonLabel
        color={darkColors.text}
        icon="export"
        label="Export readable backup"
      />
    </Button>
  </Canvas>
);
