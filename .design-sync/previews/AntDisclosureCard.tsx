import React from "react";
import {
  AntButtonLabel,
  AntDisclosureCard,
  AntPickerRow,
  AntPickerRows,
  Button,
  IconButton,
  Input,
  PhosphorIcon,
  ProviderIcon,
  Text,
  View,
  darkColors,
  fonts,
  textStyles,
} from "mrbroccoli";

// Disclosure cards stack on the app canvas exactly like AntSettingsCard, over
// darkColors.background — see ConnectionsSettingsPage.tsx (styles.pageStack)
// and SearchSettingsPage.tsx.
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

// getStatusMeta()'s real healthy/failing colour formula from
// ProviderConnectionPanel.tsx, applied to the capability pills
// ConnectionsSettingsPage.tsx renders as AntDisclosureCard's `footer` — the
// only real call site for that prop.
const CapabilityPill = ({
  label,
  tone,
}: {
  label: string;
  tone: "healthy" | "attention";
}) => {
  const color = tone === "healthy" ? darkColors.success : darkColors.danger;
  return (
    <View
      style={{
        height: 25,
        justifyContent: "center",
        borderRadius: 3,
        borderWidth: 0.5,
        paddingHorizontal: 15,
        backgroundColor: `${color}18`,
        borderColor: `${color}88`,
      }}
    >
      <Text style={{ fontFamily: fonts.body, fontSize: 12, color }}>
        {label}
      </Text>
    </View>
  );
};

const ProviderCardHeader = () => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
    <View
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: darkColors.surface,
        borderWidth: 1,
        borderColor: darkColors.border,
      }}
    >
      <ProviderIcon provider="anthropic" label="Anthropic" color={darkColors.text} />
    </View>
    <Text
      style={{
        fontFamily: fonts.display,
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "600",
        color: darkColors.text,
      }}
    >
      Anthropic
    </Text>
  </View>
);

const ProviderCardHeaderExtra = () => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
    <IconButton
      accessibilityLabel="Credentials: Anthropic"
      icon="key"
      onPress={() => {}}
    />
    <IconButton
      accessibilityLabel="About this provider: Anthropic"
      icon="info-circle"
      onPress={() => {}}
    />
  </View>
);

const ProviderCardFooter = () => (
  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
    <CapabilityPill label="LLM" tone="healthy" />
    <CapabilityPill label="TTS" tone="attention" />
  </View>
);

// The connection panel a provider card reveals when expanded
// (ProviderConnectionPanel.tsx): a masked API key Input plus a primary
// "Test all" action, both real call-site compositions relocated here since
// ProviderConnectionPanel itself is not part of the design-sync surface.
const ProviderPanelPreview = () => (
  <View style={{ gap: 20, paddingHorizontal: 16, paddingVertical: 14 }}>
    <View style={{ gap: 8 }}>
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 16,
          lineHeight: 22,
          fontWeight: "600",
          color: darkColors.text,
        }}
      >
        API key
      </Text>
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 15,
          lineHeight: 21,
          color: darkColors.textSecondary,
        }}
      >
        Starts with sk-ant- and is created in your Anthropic console.
      </Text>
      <Input
        value="sk-ant-api03-9fQ2mLwc4b7v0aP4f2a"
        accessibilityLabel="API key: Anthropic"
        type="password"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={() => {}}
        placeholderTextColor={darkColors.textMuted}
        selectionColor={darkColors.accent}
        inputStyle={{
          color: darkColors.text,
          fontFamily: fonts.body,
          fontSize: 15,
          lineHeight: 21,
          paddingHorizontal: 12,
        }}
        suffix={
          <PhosphorIcon
            name="eye"
            size="control"
            color={darkColors.textSecondary}
          />
        }
        styles={{
          container: {
            backgroundColor: darkColors.surface,
            borderWidth: 1,
            borderColor: darkColors.border,
            borderRadius: 10,
            minHeight: 46,
          },
        }}
      />
    </View>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        minHeight: 34,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 16,
          lineHeight: 22,
          fontWeight: "600",
          color: darkColors.text,
        }}
      >
        API test
      </Text>
      <Button type="primary" size="small" onPress={() => {}}>
        <AntButtonLabel
          color={darkColors.onActiveControl}
          icon="check-circle"
          label="Test all"
        />
      </Button>
    </View>
  </View>
);

// Collapsed: RENDER_THIN's root cause. Header and footer both render while
// collapsed (footer is unconditional in the component, independent of
// `expanded`) but children stay hidden — ports the provider card from
// ConnectionsSettingsPage.tsx at rest.
export const ProviderCardCollapsed = () => (
  <Canvas>
    <AntDisclosureCard
      testID="provider-card-anthropic"
      expanded={false}
      onToggle={() => {}}
      toggleAccessibilityLabel="Expand Anthropic"
      header={<ProviderCardHeader />}
      headerExtra={<ProviderCardHeaderExtra />}
      footer={<ProviderCardFooter />}
    >
      <ProviderPanelPreview />
    </AntDisclosureCard>
  </Canvas>
);

// Expanded: the same provider card toggled open, revealing the connection
// panel as children. Compare directly against ProviderCardCollapsed above —
// this pairing is the component's whole reason to exist.
export const ProviderCardExpanded = () => (
  <Canvas>
    <AntDisclosureCard
      testID="provider-card-anthropic"
      expanded
      onToggle={() => {}}
      toggleAccessibilityLabel="Collapse Anthropic"
      header={<ProviderCardHeader />}
      headerExtra={<ProviderCardHeaderExtra />}
      footer={<ProviderCardFooter />}
    >
      <ProviderPanelPreview />
    </AntDisclosureCard>
  </Canvas>
);

// A second, differently-shaped real composition: the web-search advanced
// controls disclosure from SearchSettingsPage.tsx — plain text header, an
// info headerExtra, no footer, full-bleed AntPickerRow content.
export const AdvancedSearchExpanded = () => (
  <Canvas>
    <AntDisclosureCard
      expanded
      onToggle={() => {}}
      toggleAccessibilityLabel="Collapse advanced search controls"
      header={
        <Text
          style={{
            fontFamily: fonts.display,
            fontSize: 15,
            lineHeight: 21,
            fontWeight: "600",
            color: darkColors.text,
          }}
        >
          Advanced Search Controls
        </Text>
      }
      headerExtra={
        <IconButton
          accessibilityLabel="About Advanced Search Controls"
          icon="info-circle"
          onPress={() => {}}
        />
      }
      contentStyle={{ paddingHorizontal: 0, paddingVertical: 0, gap: 0 }}
    >
      <AntPickerRows>
        <AntPickerRow
          label="Result Count"
          value="5"
          options={[
            { value: "3", label: "3" },
            { value: "5", label: "5" },
            { value: "8", label: "8" },
          ]}
          onChange={() => {}}
        />
        <AntPickerRow
          label="Search Depth"
          value="standard"
          options={[
            { value: "standard", label: "Standard" },
            { value: "deep", label: "Deep" },
          ]}
          onChange={() => {}}
        />
      </AntPickerRows>
    </AntDisclosureCard>
  </Canvas>
);

// A third real shape with no headerExtra at all: the per-language voice card
// from AntKokoroVoiceSection.tsx / AntProviderVoiceSection.tsx — a two-line
// header (language, then the selected voice as a caption underneath) and a
// single AntPickerRow as content. Collapsed/expanded pair.
const LanguageVoiceHeader = () => (
  <View style={{ flex: 1, gap: 2 }}>
    <Text
      style={{
        fontFamily: fonts.display,
        fontSize: 15,
        lineHeight: 21,
        fontWeight: "600",
        color: darkColors.text,
      }}
    >
      English
    </Text>
    <Text
      numberOfLines={1}
      style={{ ...textStyles.caption, color: darkColors.textSecondary }}
    >
      Maple · American female
    </Text>
  </View>
);

export const LanguageVoiceCollapsed = () => (
  <Canvas>
    <AntDisclosureCard
      testID="kokoro-language-card-en"
      expanded={false}
      onToggle={() => {}}
      toggleAccessibilityLabel="Expand voice settings for English"
      header={<LanguageVoiceHeader />}
      contentStyle={{ paddingHorizontal: 0, paddingVertical: 0, gap: 0 }}
    >
      <AntPickerRows>
        <AntPickerRow
          label="Voice"
          value="af_maple"
          options={[
            { value: "af_maple", label: "Maple · American female" },
            { value: "af_sol", label: "Sol · American female" },
            { value: "bf_vale", label: "Vale · British female" },
          ]}
          onChange={() => {}}
        />
      </AntPickerRows>
    </AntDisclosureCard>
  </Canvas>
);

export const LanguageVoiceExpanded = () => (
  <Canvas>
    <AntDisclosureCard
      testID="kokoro-language-card-en"
      expanded
      onToggle={() => {}}
      toggleAccessibilityLabel="Collapse voice settings for English"
      header={<LanguageVoiceHeader />}
      contentStyle={{ paddingHorizontal: 0, paddingVertical: 0, gap: 0 }}
    >
      <AntPickerRows>
        <AntPickerRow
          label="Voice"
          value="af_maple"
          options={[
            { value: "af_maple", label: "Maple · American female" },
            { value: "af_sol", label: "Sol · American female" },
            { value: "bf_vale", label: "Vale · British female" },
          ]}
          onChange={() => {}}
        />
      </AntPickerRows>
    </AntDisclosureCard>
  </Canvas>
);
