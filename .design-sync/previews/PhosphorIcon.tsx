import React from "react";
import { PhosphorIcon, Text, View, darkColors, textStyles } from "mrbroccoli";

// PhosphorIcon is the app's only glyph entry point (AGENTS.md): every call
// site supplies an explicit theme color (there is no default) and one of the
// seven semantic size tokens rather than a raw pixel size. This preview shows
// the size scale, a representative slice of the icon set (not all 60), and
// the theme colors icons actually get paired with at real call sites.

const Canvas = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      width: "100%",
    }}
  >
    {children}
  </View>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 20,
      alignItems: "flex-end",
    }}
  >
    {children}
  </View>
);

const Cell = ({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption: string;
}) => (
  <View style={{ alignItems: "center", gap: 6, minWidth: 68 }}>
    {children}
    <Text style={{ ...textStyles.caption, color: darkColors.textSecondary }}>
      {caption}
    </Text>
  </View>
);

// The seven ICON_SIZE tokens (PhosphorIcon.tsx), one glyph held constant so
// only the scale changes — mirrors the mic glyph used across recording UI.
export const SizeScale = () => (
  <Canvas>
    <Row>
      <Cell caption="inline · 14">
        <PhosphorIcon name="mic" size="inline" color={darkColors.text} />
      </Cell>
      <Cell caption="compact · 16">
        <PhosphorIcon name="mic" size="compact" color={darkColors.text} />
      </Cell>
      <Cell caption="control · 20">
        <PhosphorIcon name="mic" size="control" color={darkColors.text} />
      </Cell>
      <Cell caption="navigation · 24">
        <PhosphorIcon name="mic" size="navigation" color={darkColors.text} />
      </Cell>
      <Cell caption="prominent · 28">
        <PhosphorIcon name="mic" size="prominent" color={darkColors.text} />
      </Cell>
      <Cell caption="feature · 32">
        <PhosphorIcon name="mic" size="feature" color={darkColors.text} />
      </Cell>
      <Cell caption="hero · 40">
        <PhosphorIcon name="mic" size="hero" color={darkColors.text} />
      </Cell>
    </Row>
  </Canvas>
);

// A representative slice across voice controls, chrome, assistant concepts,
// destructive/utility actions, and security — not an exhaustive dump.
export const RepresentativeGlyphs = () => (
  <Canvas>
    <Row>
      <Cell caption="mic">
        <PhosphorIcon name="mic" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="send">
        <PhosphorIcon name="send" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="stop">
        <PhosphorIcon name="stop" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="pause">
        <PhosphorIcon name="pause" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="play-circle">
        <PhosphorIcon
          name="play-circle"
          size="control"
          color={darkColors.textSecondary}
        />
      </Cell>
      <Cell caption="setting">
        <PhosphorIcon name="setting" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="search">
        <PhosphorIcon name="search" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="menu">
        <PhosphorIcon name="menu" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="close">
        <PhosphorIcon name="close" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="robot">
        <PhosphorIcon name="robot" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="thunderbolt">
        <PhosphorIcon
          name="thunderbolt"
          size="control"
          color={darkColors.textSecondary}
        />
      </Cell>
      <Cell caption="cpu">
        <PhosphorIcon name="cpu" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="delete">
        <PhosphorIcon name="delete" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="lock">
        <PhosphorIcon name="lock" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="key">
        <PhosphorIcon name="key" size="control" color={darkColors.textSecondary} />
      </Cell>
      <Cell caption="global">
        <PhosphorIcon name="global" size="control" color={darkColors.textSecondary} />
      </Cell>
    </Row>
  </Canvas>
);

// The same glyph reads differently depending on the semantic color it is
// paired with at real call sites (active recording, confirmations, destructive
// actions, warnings, inactive/muted states).
export const StatusGlyphs = () => (
  <Canvas>
    <Row>
      <Cell caption="accent · active">
        <PhosphorIcon name="mic" size="prominent" color={darkColors.accent} />
      </Cell>
      <Cell caption="success · confirmed">
        <PhosphorIcon
          name="check-circle"
          size="prominent"
          color={darkColors.success}
        />
      </Cell>
      <Cell caption="danger · destructive">
        <PhosphorIcon name="delete" size="prominent" color={darkColors.danger} />
      </Cell>
      <Cell caption="danger · warning">
        <PhosphorIcon name="warning" size="prominent" color={darkColors.danger} />
      </Cell>
      <Cell caption="muted · inactive">
        <PhosphorIcon name="pause" size="prominent" color={darkColors.textMuted} />
      </Cell>
    </Row>
  </Canvas>
);
