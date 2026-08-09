import React from "react";
import { IconButton, PhosphorIcon, Text, View, darkColors, textStyles } from "mrbroccoli";

// IconButton is the standard icon-only control: a fixed 44x44 touch target
// (MIN_ICON_TOUCH_TARGET) regardless of the glyph's own size. `icon` is the
// common shorthand (MainScreenTopBar); `iconNode` composes a custom-colored
// PhosphorIcon directly, used for info and destructive actions
// (AntSettingsInfoButton, AntKokoroVoiceSection).

const Canvas = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 20,
      alignItems: "flex-start",
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
  <View style={{ alignItems: "center", gap: 6, minWidth: 64 }}>
    {children}
    <Text style={{ ...textStyles.caption, color: darkColors.textSecondary }}>
      {caption}
    </Text>
  </View>
);

// Mirrors MainScreenTopBar: the conversation drawer, the debug-log toggle
// (its `active` state persists highlighted while the log stays open), and
// settings.
export const TopBarActions = () => (
  <Canvas>
    <Cell caption="Conversations">
      <IconButton icon="menu" accessibilityLabel="Open conversations" onPress={() => {}} />
    </Cell>
    <Cell caption="Debug log (off)">
      <IconButton
        icon="bug"
        active={false}
        accessibilityLabel="Show debug log"
        onPress={() => {}}
      />
    </Cell>
    <Cell caption="Debug log (on)">
      <IconButton icon="bug" active accessibilityLabel="Hide debug log" onPress={() => {}} />
    </Cell>
    <Cell caption="Settings">
      <IconButton icon="setting" accessibilityLabel="Open settings" onPress={() => {}} />
    </Cell>
  </Canvas>
);

// `iconNode` overrides the glyph color directly rather than going through
// `iconColor` + `active`, used for the info-circle helper button and
// destructive removal actions.
export const IconNodeComposition = () => (
  <Canvas>
    <Cell caption="About this setting">
      <IconButton
        accessibilityLabel="About Listen languages"
        iconNode={
          <PhosphorIcon name="info-circle" size="control" color={darkColors.textSecondary} />
        }
        onPress={() => {}}
      />
    </Cell>
    <Cell caption="Remove downloaded model">
      <IconButton
        accessibilityLabel="Remove downloaded model"
        iconNode={<PhosphorIcon name="delete" size="control" color={darkColors.danger} />}
        onPress={() => {}}
      />
    </Cell>
  </Canvas>
);

// iconSize scales only the glyph inside the fixed touch target — the box
// itself never grows or shrinks.
export const IconSizes = () => (
  <Canvas>
    <Cell caption="compact">
      <IconButton
        icon="down"
        iconSize="compact"
        accessibilityLabel="Scroll to latest message"
        onPress={() => {}}
      />
    </Cell>
    <Cell caption="control (default)">
      <IconButton
        icon="control"
        iconSize="control"
        accessibilityLabel="Conversation style"
        onPress={() => {}}
      />
    </Cell>
    <Cell caption="navigation">
      <IconButton
        icon="arrow-left"
        iconSize="navigation"
        accessibilityLabel="Back"
        onPress={() => {}}
      />
    </Cell>
  </Canvas>
);

export const Disabled = () => (
  <Canvas>
    <Cell caption="Attach image">
      <IconButton icon="image" accessibilityLabel="Attach an image" onPress={() => {}} />
    </Cell>
    <Cell caption="Attach image (disabled)">
      <IconButton
        icon="image"
        disabled
        accessibilityLabel="Attach an image"
        onPress={() => {}}
      />
    </Cell>
  </Canvas>
);
