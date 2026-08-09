import React from "react";
import {
  AntButtonLabel,
  Button,
  PhosphorIcon,
  Text,
  View,
  darkColors,
  textStyles,
} from "mrbroccoli";

// Composition follows the app's own call sites: Button never styles its
// children, so a label is always <AntButtonLabel> (icon + text) or a bare
// <PhosphorIcon> for icon-only actions — see AntPreviewComposer.tsx and
// AntTtsSections.tsx.

// Cards render on a white page, but Mr Broccoli's controls are themed against
// the app canvas (darkColors.background). Ghost buttons are transparent, so
// without the canvas they read as pale text floating on white.
const Row = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      alignItems: "center",
    }}
  >
    {children}
  </View>
);

export const Types = () => (
  <Row>
    <Button type="primary" onPress={() => {}}>
      <AntButtonLabel
        color={darkColors.onActiveControl}
        icon="sound"
        label="Preview voice"
      />
    </Button>
    <Button type="ghost" onPress={() => {}}>
      <AntButtonLabel
        color={darkColors.accent}
        icon="setting"
        label="Open settings"
      />
    </Button>
    <Button type="warning" onPress={() => {}}>
      <AntButtonLabel
        color={darkColors.onDanger}
        icon="delete"
        label="Delete conversation"
      />
    </Button>
  </Row>
);

export const Sizes = () => (
  <Row>
    <Button size="large" type="primary" onPress={() => {}}>
      <AntButtonLabel
        color={darkColors.onActiveControl}
        icon="check"
        label="Save changes"
      />
    </Button>
    <Button size="small" type="ghost" onPress={() => {}}>
      <AntButtonLabel
        color={darkColors.accent}
        icon="copy"
        iconSize="compact"
        label="Copy"
      />
    </Button>
  </Row>
);

export const IconOnly = () => (
  <Row>
    <Button
      size="small"
      type="ghost"
      accessibilityLabel="Move fallback earlier"
      onPress={() => {}}
    >
      <PhosphorIcon name="arrow-up" size="compact" color={darkColors.accent} />
    </Button>
    <Button
      size="small"
      type="ghost"
      accessibilityLabel="Move fallback later"
      onPress={() => {}}
    >
      <PhosphorIcon
        name="arrow-down"
        size="compact"
        color={darkColors.accent}
      />
    </Button>
    <Button
      size="small"
      type="warning"
      accessibilityLabel="Remove fallback route"
      onPress={() => {}}
    >
      <PhosphorIcon name="delete" size="compact" color={darkColors.onDanger} />
    </Button>
  </Row>
);

export const LoadingAndDisabled = () => (
  <Row>
    <Button type="primary" loading onPress={() => {}}>
      <Text style={{ ...textStyles.action, color: darkColors.onActiveControl }}>
        Generating reply
      </Text>
    </Button>
    <Button type="ghost" disabled onPress={() => {}}>
      <AntButtonLabel
        color={darkColors.textMuted}
        icon="sound"
        label="Preview voice"
      />
    </Button>
  </Row>
);
