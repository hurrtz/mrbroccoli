import React from "react";
import {
  AntButtonLabel,
  AntPickerRow,
  AntSettingsCard,
  AntSwitchRow,
  Button,
  IconButton,
  Text,
  View,
  darkColors,
  fonts,
} from "mrbroccoli";

// Every settings page stacks these cards on the app canvas
// (styles.pageStack / styles.sectionPageStack over darkColors.background),
// never directly on white — see AntSettingsOverview.tsx and every page under
// src/features/settings/pages/. Without the canvas, surfaceElevated barely
// separates from the preview page.
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

// Titled card with body content: ports the on-device model card from
// OnDeviceSettingsPage.tsx (renderModel) — title is the model name, a muted
// meta line underneath, then a row of small buttons whose Text colour carries
// the intent (accent = neutral action, onActiveControl on primary = the
// affirmative action, danger = destructive).
export const TitledCardWithContent = () => (
  <Canvas>
    <AntSettingsCard title="Qwen3 1.7B">
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 13,
          lineHeight: 19,
          color: darkColors.textMuted,
        }}
      >
        1.8 GB · Apache-2.0
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Button size="small" onPress={() => {}}>
          <Text style={{ color: darkColors.accent }}>Test</Text>
        </Button>
        <Button size="small" type="primary" onPress={() => {}}>
          <Text style={{ color: darkColors.onActiveControl }}>Use</Text>
        </Button>
        <Button size="small" onPress={() => {}}>
          <Text style={{ color: darkColors.danger }}>Remove</Text>
        </Button>
      </View>
    </AntSettingsCard>
  </Canvas>
);

// Card with headerExtra: ports the per-model card from ThinkingSettingsPage.tsx
// — a delete IconButton next to the title, and full-bleed AntPickerRow content
// (contentStyle strips the card's own padding so the rows run edge to edge,
// exactly as styles.fullBleedCardContent does there).
export const CardWithHeaderExtra = () => (
  <Canvas>
    <AntSettingsCard
      title="Model 2"
      headerExtra={
        <IconButton
          accessibilityLabel="Remove model"
          icon="delete"
          iconColor={darkColors.danger}
          onPress={() => {}}
        />
      }
      contentStyle={{ paddingHorizontal: 0, paddingVertical: 0, gap: 0 }}
    >
      <AntPickerRow
        testID="settings-model-provider-2"
        label="Provider"
        value="anthropic"
        options={[
          { value: "anthropic", label: "Anthropic" },
          { value: "openai", label: "OpenAI" },
          { value: "gemini", label: "Google Gemini" },
        ]}
        onChange={() => {}}
      />
      <AntPickerRow
        label="Model"
        value="claude-opus-5"
        options={[
          { value: "claude-opus-5", label: "Claude Opus 5" },
          { value: "claude-sonnet-5", label: "Claude Sonnet 5" },
        ]}
        onChange={() => {}}
      />
    </AntSettingsCard>
  </Canvas>
);

// Card with footer actions. No real call site passes AntSettingsCard's own
// `footer` prop today — only AntDisclosureCard's footer is used in the app
// (ConnectionsSettingsPage.tsx). This composition is therefore invented, not
// ported, but it stays grounded in real copy and layout: styles.cardFooter /
// cardFooterActions (flex-end) match the "Test all" affirmative action button
// ProviderConnectionPanel.tsx places inline; here it is the card's footer
// instead. Flagged in learnings.
export const CardWithFooterActions = () => (
  <Canvas>
    <AntSettingsCard
      title="Anthropic"
      footer={
        <Button type="primary" size="small" onPress={() => {}}>
          <AntButtonLabel
            color={darkColors.onActiveControl}
            icon="check-circle"
            label="Test all"
          />
        </Button>
      }
    >
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 15,
          lineHeight: 21,
          fontWeight: "400",
          color: darkColors.success,
        }}
      >
        Working
      </Text>
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 15,
          lineHeight: 21,
          color: darkColors.textSecondary,
        }}
      >
        sk-ant-••••••4f2a
      </Text>
    </AntSettingsCard>
  </Canvas>
);

// Untitled card: title is optional and most cards in the app never set it —
// ports SpeakingSettingsPage.tsx's bare `<AntSettingsCard>` wrapping a single
// AntSwitchRow. No header row renders at all, only the content area.
export const UntitledCard = () => (
  <Canvas>
    <AntSettingsCard>
      <AntSwitchRow label="Spoken Replies" value onChange={() => {}} />
    </AntSettingsCard>
  </Canvas>
);
