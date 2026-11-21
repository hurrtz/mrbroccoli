import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";

import {
  PROVIDER_LABELS,
  PROVIDER_LLM_SUPPORT,
  PROVIDER_MODELS,
  PROVIDER_ORDER,
  PROVIDER_STT_SUPPORT,
  PROVIDER_TTS_SUPPORT,
} from "../../../constants/models";
import { isWebSearchProvider } from "../../../constants/webSearch";
import { useLocalization } from "../../../i18n";
import {
  AI_SHARING_PURPOSES,
  getSystemSpeechName,
  setAiSharingPermission,
  setSystemSpeechPermission,
  type AiSharingPurpose,
} from "../../../services/aiSharing";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type { Provider, Settings } from "../../../types";
import { modelSupportsImageInput } from "../../../utils/imageInputCapabilities";
import {
  AI_SHARING_COPY,
  useAiSharingSnapshot,
} from "../aiSharingPresentation";
import { SettingsChoiceRow } from "../settings-primitives/SettingsChoiceRow";
import { SettingsGroup } from "../settings-primitives/SettingsGroup";
import { SettingsRow } from "../settings-primitives/SettingsRow";

function supportsPurpose(provider: Provider, purpose: AiSharingPurpose) {
  switch (purpose) {
    case "transcription":
      return PROVIDER_STT_SUPPORT[provider] === "provider";
    case "speech":
      return PROVIDER_TTS_SUPPORT[provider] === "provider";
    case "search":
      return isWebSearchProvider(provider);
    case "images":
      return PROVIDER_MODELS[provider].some(({ id }) =>
        modelSupportsImageInput(provider, id),
      );
    default:
      return PROVIDER_LLM_SUPPORT[provider] === "provider";
  }
}

function PermissionChoice({
  decision,
  last,
  name,
  onChange,
  purpose,
  testID,
}: {
  decision?: "ask" | "allowed" | "denied";
  last: boolean;
  name: string;
  onChange: (allowed: boolean | null) => void;
  purpose: AiSharingPurpose;
  testID: string;
}) {
  const { t } = useLocalization();
  const [label, detail] = AI_SHARING_COPY[purpose];
  return (
    <SettingsChoiceRow
      label={t(label)}
      title={`${name} · ${t(label)}`}
      supporting={t(detail)}
      last={last}
      value={decision ?? "ask"}
      valueLabel={decision === undefined ? t("aiSharingNotYetAllowed") : undefined}
      options={[
        { value: "ask", label: t("aiSharingAsk") },
        {
          value: "allowed",
          label: t("aiSharingAllowed"),
          supporting: t(detail),
        },
        { value: "denied", label: t("aiSharingBlocked") },
      ]}
      onChange={(choice) =>
        onChange(choice === "ask" ? null : choice === "allowed")
      }
      testID={testID}
    />
  );
}

export function AiSharingSettingsPage({ settings }: { settings: Settings }) {
  const { colors } = useTheme();
  const { isRtl, language, t } = useLocalization();
  const { permissions, ready, systemSpeech } = useAiSharingSnapshot();
  const systems = Object.entries(systemSpeech ?? {});
  const [error, setError] = React.useState(false);
  const providers = PROVIDER_ORDER.filter(
    (provider) => settings.apiKeys[provider]?.trim() || permissions[provider],
  );
  function save(promise: Promise<void>) {
    setError(false);
    void promise.catch(() => setError(true));
  }
  return (
    <View style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {t("aiSharingSettingsDescription")}
      </Text>
      {error ? (
        <Text
          accessibilityRole="alert"
          style={[styles.description, { color: colors.danger }]}
        >
          {t("persistenceFailure")}
        </Text>
      ) : null}
      {ready && !providers.length && !systems.length ? (
        <SettingsGroup>
          <SettingsRow
            icon="lock"
            label={t("aiSharingNoProviders")}
            control={null}
            last
          />
        </SettingsGroup>
      ) : null}
      {ready &&
        providers.map((provider) => {
          const name = PROVIDER_LABELS[provider];
          const purposes = AI_SHARING_PURPOSES.filter(
            (purpose) =>
              permissions[provider]?.[purpose] ||
              supportsPurpose(provider, purpose),
          );
          return (
            <SettingsGroup
              key={provider}
              title={name}
              testID={`ai-sharing-provider-${provider}`}
            >
              {purposes.map((purpose, index) => (
                <PermissionChoice
                  key={purpose}
                  name={name}
                  purpose={purpose}
                  last={index === purposes.length - 1}
                  decision={permissions[provider]?.[purpose]}
                  onChange={(allowed) =>
                    save(setAiSharingPermission(provider, purpose, allowed))
                  }
                  testID={`ai-sharing-setting-${provider}-${purpose}`}
                />
              ))}
            </SettingsGroup>
          );
        })}
      {ready &&
        systems.map(([id, decision]) => (
          <SettingsGroup key={id} title={getSystemSpeechName(id)}>
            <PermissionChoice
              name={getSystemSpeechName(id)}
              purpose="transcription"
              last
              decision={decision}
              onChange={(allowed) =>
                save(setSystemSpeechPermission(id, allowed))
              }
              testID={`ai-sharing-system-${id}`}
            />
          </SettingsGroup>
        ))}
      <SettingsGroup>
        <SettingsRow
          icon="safety-certificate"
          label={t("aiSharingPrivacyPolicy")}
          last
          onPress={() => {
            void Linking.openURL(
              language === "de"
                ? "https://tobiaswinkler.berlin/mrbroccoli/datenschutz"
                : "https://tobiaswinkler.berlin/privacy.html",
            );
          }}
        />
      </SettingsGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    marginHorizontal: 14,
    marginTop: 10,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
});
