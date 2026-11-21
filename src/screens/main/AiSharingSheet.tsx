import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ProviderIcon } from "../../components/ProviderIcon";
import { getOpenRouterHosts } from "../../constants/providers/openRouterHosts";
import { PROVIDER_LABELS } from "../../constants/models";
import { Modal } from "../../design-system/NativeControls";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { SheetHeader } from "../../design-system/SheetHeader";
import { Switch } from "../../design-system/Switch";
import {
  AI_SHARING_COPY,
  getSharingRecipientName,
} from "../../features/settings/aiSharingPresentation";
import { SettingsGroup } from "../../features/settings/settings-primitives/SettingsGroup";
import { SettingsRow } from "../../features/settings/settings-primitives/SettingsRow";
import { useLocalization } from "../../i18n";
import {
  getSystemSpeechName,
  needKey,
  resolveAiSharing,
  uniqueNeeds,
  type AiSharingNeed,
  type AiSharingPending,
  type AiSharingPermissions,
} from "../../services/aiSharing";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type { Provider } from "../../types";

export function AiSharingSheet({
  pending,
  permissions,
}: {
  pending: AiSharingPending;
  permissions: AiSharingPermissions;
}) {
  const { isRtl, t } = useLocalization();
  const { colors } = useTheme();
  const [optional, setOptional] = React.useState<AiSharingNeed[]>([]);
  const [rememberImages, setRememberImages] = React.useState<Provider[]>([]);
  const [saving, setSaving] = React.useState(false);
  const { request } = pending;
  const openRouterHosts = getOpenRouterHosts(request.openRouterModels);
  const choices = new Set(pending.optional.map(needKey));
  const selected = new Set(optional.map(needKey));
  const disclosed = uniqueNeeds([
    ...request.required,
    ...(request.optional ?? []).filter(
      (need) =>
        choices.has(needKey(need)) ||
        permissions[need.provider]?.[need.purpose] === "allowed",
    ),
  ]);
  const providers = [...new Set(disclosed.map(({ provider }) => provider))];
  const photoRecipients = pending.missingRequired
    .filter(({ purpose }) => purpose === "images")
    .map(({ provider }) => provider);
  function finish(allow: boolean) {
    setSaving(true);
    void resolveAiSharing(
      pending.id,
      allow ? { optional, rememberImages } : null,
    );
  }
  const cancel = () => finish(false);
  const cancelLabel =
    request.systemSpeech ||
    (!request.council &&
      !request.imageCount &&
      !request.shareEarlier &&
      pending.missingRequired.some(({ purpose }) => purpose === "prompt"))
      ? t("aiSharingDecline")
      : t("cancel");
  const confirmLabel = request.shareEarlier
    ? t("aiSharingShareEarlier", {
        provider: getSharingRecipientName(
          request.required[0].provider,
          request.openRouterModels?.[0],
        ),
      })
    : photoRecipients.length && !rememberImages.length
      ? t("aiSharingSendOnce")
      : t("aiSharingContinue");
  return (
    <Modal
      aboveModals
      cardStyle={{ direction: isRtl ? "rtl" : "ltr" }}
      layout="sheet"
      visible
      maskClosable={false}
      onClose={cancel}
      title={
        <SheetHeader
          testID="ai-sharing-header"
          closeAccessibilityLabel={cancelLabel}
          onClose={cancel}
          title={t(
            request.shareEarlier
              ? "aiSharingRequestedHistory"
              : "aiSharingRequestTitle",
          )}
        />
      }
      footer={[
        { text: cancelLabel, onPress: cancel, disabled: saving },
        {
          text: confirmLabel,
          onPress: () => finish(true),
          loading: saving,
          tone: "success",
        },
      ]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        testID="ai-sharing-consent"
      >
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          {t(
            photoRecipients.length
              ? "aiSharingRememberedScopes"
              : "aiSharingRequestDescription",
          )}
        </Text>
        {request.council ? (
          <View style={styles.council}>
            <Text style={[styles.body, { color: colors.text }]}>
              {t("aiSharingCouncilMembers", {
                providers: [...new Set(request.council.providers)]
                  .map((provider) => PROVIDER_LABELS[provider])
                  .join(", "),
              })}
            </Text>
            <Text style={[styles.body, { color: colors.textSecondary }]}>
              {t("aiSharingCouncilFinal", {
                provider: getSharingRecipientName(
                  request.council.synthesisProvider,
                  request.council.synthesisModel,
                ),
              })}
            </Text>
          </View>
        ) : null}
        {request.systemSpeech ? (
          <View style={styles.recipient}>
            <View
              style={styles.providerTitle}
              accessible
              accessibilityRole="header"
            >
              <PhosphorIcon name="audio" size="control" color={colors.text} />
              <Text style={[styles.name, { color: colors.text }]}>
                {getSystemSpeechName(request.systemSpeech)}
              </Text>
            </View>
            <SettingsGroup style={styles.rows}>
              <SettingsRow
                label={t("aiSharingTranscription")}
                supporting={t("aiSharingTranscriptionDetail")}
                supportingLines={0}
                control={null}
                last
              />
            </SettingsGroup>
          </View>
        ) : null}
        {providers.map((provider) => {
          const name = PROVIDER_LABELS[provider];
          const rows = disclosed.filter((need) => need.provider === provider);
          const askRemember = photoRecipients.includes(provider);
          return (
            <View key={provider} style={styles.recipient}>
              <View
                style={styles.providerTitle}
                accessibilityRole="header"
                accessible
                accessibilityLabel={name}
                testID={`ai-sharing-recipient-${provider}`}
              >
                <ProviderIcon
                  provider={provider}
                  size="control"
                  color={colors.text}
                />
                <Text style={[styles.name, { color: colors.text }]}>
                  {name}
                </Text>
              </View>
              {provider === "openrouter" && openRouterHosts.length ? (
                <Text style={[styles.body, { color: colors.textSecondary }]}>
                  {t("aiSharingOpenRouterHost", {
                    host: openRouterHosts.map((host) => host.label).join(", "),
                  })}
                </Text>
              ) : null}
              <SettingsGroup style={styles.rows}>
                {rows.map((need, index) => {
                  const key = needKey(need);
                  const [label, scopeDetail] = AI_SHARING_COPY[need.purpose];
                  const detail =
                    request.shareEarlier && need.purpose === "history"
                      ? "aiSharingEarlierDetail"
                      : scopeDetail;
                  const optionalHere = choices.has(key);
                  return (
                    <SettingsRow
                      key={key}
                      label={t(label)}
                      supporting={t(detail)}
                      supportingLines={0}
                      last={index === rows.length - 1 && !askRemember}
                      control={
                        optionalHere ? (
                          <Switch
                            disabled={saving}
                            testID={`ai-sharing-optional-${provider}-${need.purpose}`}
                            label={`${name}. ${t(label)}. ${t(detail)}`}
                            value={selected.has(key)}
                            onChange={(checked) =>
                              setOptional((previous) =>
                                checked
                                  ? [...previous, need]
                                  : previous.filter(
                                      (item) => needKey(item) !== key,
                                    ),
                              )
                            }
                          />
                        ) : null
                      }
                    />
                  );
                })}
                {askRemember ? (
                  <SettingsRow
                    label={t("aiSharingRememberImages", { provider: name })}
                    last
                    control={
                      <Switch
                        disabled={saving}
                        testID={`ai-sharing-remember-images-${provider}`}
                        label={t("aiSharingRememberImages", { provider: name })}
                        value={rememberImages.includes(provider)}
                        onChange={(checked) =>
                          setRememberImages((previous) =>
                            checked
                              ? [...previous, provider]
                              : previous.filter((item) => item !== provider),
                          )
                        }
                      />
                    }
                  />
                ) : null}
              </SettingsGroup>
            </View>
          );
        })}
        {photoRecipients.length ? (
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {t("aiSharingChangeInSettings")}
          </Text>
        ) : null}
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: { gap: 14, paddingBottom: 12 },
  council: { gap: 4 },
  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  recipient: { gap: 6 },
  providerTitle: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
    flexShrink: 1,
  },
  rows: { paddingTop: 0 },
});
