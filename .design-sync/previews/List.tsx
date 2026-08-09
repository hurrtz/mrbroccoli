import React from "react";
import { List, PhosphorIcon, Text, View, darkColors, textStyles } from "mrbroccoli";

// `List` is `Object.assign(NativeList, { Item })`, and `List.Item` has
// `List.Item.Brief` for a secondary line. NativeList/NativeListItem apply no
// background, divider, or radius themselves (NativeControls.tsx) — every real
// call site (AntSettingsOverview, ProviderConnectionPanel) supplies
// `styles.Item` per row instead of a shared divider, so rows read as discrete
// rounded cards rather than a bordered table. The honest preview is the
// composed list, not an empty container.

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

const thumbStyle = {
  width: 40,
  height: 40,
  borderRadius: 10,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  backgroundColor: darkColors.surfaceAlt,
};

// Ported from AntSettingsOverview: icon thumb, title + Brief description,
// chevron `extra`, each row its own tinted rounded card.
const HOME_ROWS: {
  key: string;
  icon: "message" | "key" | "sound" | "safety-certificate";
  title: string;
  summary: string;
  emphasize?: boolean;
}[] = [
  {
    key: "conversations",
    icon: "message",
    title: "Conversations",
    summary: "Search, rename, and export past chats",
  },
  {
    key: "connections",
    icon: "key",
    title: "Providers & connections",
    summary: "Anthropic, OpenAI, and seven more routes",
  },
  {
    key: "speaking",
    icon: "sound",
    title: "Voice & speech",
    summary: "Recognition, playback voice, and on-device speech",
    emphasize: true,
  },
  {
    key: "privacy",
    icon: "safety-certificate",
    title: "Data & privacy",
    summary: "Backups, exports, and local storage",
  },
];

export const SettingsHome = () => (
  <Canvas>
    <List style={{ gap: 10 }}>
      {HOME_ROWS.map((row) => (
        <List.Item
          key={row.key}
          multipleLine
          wrap
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel={`Open ${row.title}`}
          thumb={
            <View
              style={[
                thumbStyle,
                row.emphasize ? { backgroundColor: darkColors.accentSoft } : null,
              ]}
            >
              <PhosphorIcon
                name={row.icon}
                size="prominent"
                color={row.emphasize ? darkColors.accent : darkColors.text}
              />
            </View>
          }
          extra={<PhosphorIcon name="right" size="control" color={darkColors.textMuted} />}
          styles={{
            Item: {
              backgroundColor: row.emphasize
                ? darkColors.accentSoft
                : darkColors.surfaceElevated,
              borderRadius: 14,
            },
            Line: { borderBottomWidth: 0, paddingVertical: 12 },
            Content: {
              color: darkColors.text,
              fontFamily: textStyles.subsectionTitle.fontFamily,
              fontSize: 16,
              fontWeight: "600",
            },
          }}
        >
          {row.title}
          <List.Item.Brief
            wrap
            style={{
              color: darkColors.textSecondary,
              fontFamily: textStyles.supporting.fontFamily,
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            {row.summary}
          </List.Item.Brief>
        </List.Item>
      ))}
    </List>
  </Canvas>
);

// Ported from ProviderConnectionPanel's capability validation list: no
// thumb, an `extra` action/status glyph, and the row's own tint carrying
// success/pending/error/disabled state instead of a divider.
const STATUS_ROWS: {
  key: string;
  label: string;
  message: string;
  tone: "success" | "pending" | "error" | "disabled";
}[] = [
  {
    key: "llm",
    label: "Text replies",
    message: "Connected · verified just now",
    tone: "success",
  },
  {
    key: "stt",
    label: "Speech recognition",
    message: "Checking connection…",
    tone: "pending",
  },
  {
    key: "tts",
    label: "Speech playback",
    message: "Failed · invalid API key",
    tone: "error",
  },
  {
    key: "voices",
    label: "Voice directory",
    message: "Not offered by this provider",
    tone: "disabled",
  },
];

const STATUS_TINT: Record<string, string> = {
  success: darkColors.accentSoft,
  pending: darkColors.surfaceElevated,
  error: "rgba(248, 113, 113, 0.14)",
  disabled: darkColors.surfaceElevated,
};

const STATUS_TEXT: Record<string, string> = {
  success: darkColors.accent,
  pending: darkColors.textSecondary,
  error: darkColors.danger,
  disabled: darkColors.textMuted,
};

export const ValidationStatus = () => (
  <Canvas>
    <List style={{ gap: 10 }}>
      {STATUS_ROWS.map((row) => {
        const disabled = row.tone === "disabled";
        return (
          <List.Item
            key={row.key}
            multipleLine
            disabled={disabled}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel={disabled ? "Not available" : `Test ${row.label}`}
            extra={
              <PhosphorIcon
                name={row.tone === "pending" ? "loading" : "play-circle"}
                size="control"
                color={disabled ? darkColors.textMuted : darkColors.accent}
              />
            }
            styles={{
              Item: { backgroundColor: STATUS_TINT[row.tone], borderRadius: 14 },
              Line: { borderBottomWidth: 0, paddingVertical: 12 },
              Content: {
                color: darkColors.text,
                fontFamily: textStyles.subsectionTitle.fontFamily,
                fontSize: 15,
                fontWeight: "500",
              },
            }}
          >
            {row.label}
            <List.Item.Brief
              wrap
              style={{
                color: STATUS_TEXT[row.tone],
                fontFamily: textStyles.supporting.fontFamily,
                fontSize: 13,
                lineHeight: 19,
              }}
            >
              {row.message}
            </List.Item.Brief>
          </List.Item>
        );
      })}
    </List>
  </Canvas>
);

// Ported from AntListenLanguageSelector: a single-line row used to open a
// picker, no thumb or Brief, `extra` combining a value summary with a
// chevron.
export const PickerTrigger = () => (
  <Canvas>
    <List>
      <List.Item
        onPress={() => {}}
        accessibilityRole="button"
        accessibilityLabel="Listen languages"
        extra={
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text
              style={{
                color: darkColors.textSecondary,
                fontFamily: textStyles.body.fontFamily,
                fontSize: 15,
              }}
            >
              2 selected
            </Text>
            <PhosphorIcon name="down" size="compact" color={darkColors.textMuted} />
          </View>
        }
        styles={{
          Item: { backgroundColor: darkColors.surfaceElevated, borderRadius: 14 },
          Line: { minHeight: 46, paddingVertical: 10, borderBottomWidth: 0 },
          Content: {
            color: darkColors.text,
            fontFamily: textStyles.body.fontFamily,
            fontSize: 15,
          },
          Extra: { maxWidth: "68%", paddingLeft: 8 },
        }}
      >
        Listen languages
      </List.Item>
    </List>
  </Canvas>
);
