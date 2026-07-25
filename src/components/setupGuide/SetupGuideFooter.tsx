import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useLocalization } from "../../i18n";
import type {
  SetupGuideResolvedRoutes,
  SetupGuideStep,
  SetupGuideValidationState,
} from "../../screens/main/setupGuideSupport";
import { useTheme } from "../../theme/ThemeContext";
import type { Provider } from "../../types";
import type { KokoroModelController } from "../../hooks/useKokoroModel";
import { getVoiceTestActionLabel } from "./shared";
import { styles } from "./styles";
import type { SetupGuideVoiceTestState } from "./types";

interface SetupGuideFooterProps {
  step: SetupGuideStep;
  selectedProvider: Provider | null;
  selectedProviderApiKey: string;
  currentValidationState: SetupGuideValidationState;
  resolvedRoutes: SetupGuideResolvedRoutes;
  voiceTest: SetupGuideVoiceTestState;
  kokoroModel: KokoroModelController;
  useKokoro: boolean;
  onDismiss: () => void;
  onBack: () => void;
  onContinueFromIntro: () => void;
  onValidateProviderKey: () => void;
  onContinueFromProvider: () => void;
  onContinueFromKokoro: () => void;
  onVoiceTestAction: () => void;
  onContinueFromVoiceTest: () => void;
  onFinish: () => void;
  onOpenSettings: () => void;
}

function KokoroFooter({
  kokoroModel,
  useKokoro,
  onBack,
  onContinueFromKokoro,
}: Pick<
  SetupGuideFooterProps,
  "kokoroModel" | "useKokoro" | "onBack" | "onContinueFromKokoro"
>) {
  const { t } = useLocalization();

  return (
    <>
      <SecondaryButton label={t("setupGuideBack")} onPress={onBack} />
      <PrimaryButton
        label={
          useKokoro
            ? t("setupGuideContinue")
            : t("setupGuideSkipKokoro")
        }
        disabled={kokoroModel.busy !== null}
        onPress={onContinueFromKokoro}
      />
    </>
  );
}

function SecondaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.secondaryButton,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text
        style={[styles.secondaryButtonText, { color: colors.textSecondary }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        style={[
          styles.primaryButton,
          { backgroundColor: colors.bubbleUser },
          disabled ? styles.primaryButtonDisabled : null,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[styles.primaryButtonText, { color: colors.onPrimary }]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function IntroFooter({
  onDismiss,
  onContinueFromIntro,
}: Pick<SetupGuideFooterProps, "onDismiss" | "onContinueFromIntro">) {
  const { t } = useLocalization();

  return (
    <>
      <SecondaryButton label={t("notNow")} onPress={onDismiss} />
      <PrimaryButton
        label={t("setupGuideContinue")}
        onPress={onContinueFromIntro}
      />
    </>
  );
}

function ProviderFooter({
  selectedProvider,
  selectedProviderApiKey,
  currentValidationState,
  onBack,
  onValidateProviderKey,
  onContinueFromProvider,
}: Pick<
  SetupGuideFooterProps,
  | "selectedProvider"
  | "selectedProviderApiKey"
  | "currentValidationState"
  | "onBack"
  | "onValidateProviderKey"
  | "onContinueFromProvider"
>) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const isProviderApiKeyMissing = selectedProviderApiKey.trim().length === 0;
  const canValidateProvider =
    Boolean(selectedProvider) && !isProviderApiKeyMissing;
  const canContinueFromProvider = currentValidationState.status === "success";
  const isValidatingProviderKey =
    currentValidationState.status === "validating";
  const shouldShowFooterValidationPrompt =
    currentValidationState.status === "error" &&
    Boolean(currentValidationState.message) &&
    (!selectedProvider || isProviderApiKeyMissing);

  return (
    <View style={styles.providerFooterStack}>
      {shouldShowFooterValidationPrompt ? (
        <View
          style={[
            styles.footerErrorBanner,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.danger,
            },
          ]}
        >
          <Text style={[styles.footerErrorText, { color: colors.danger }]}>
            {currentValidationState.message}
          </Text>
        </View>
      ) : null}
      <View style={styles.footerButtonRow}>
        <SecondaryButton label={t("setupGuideBack")} onPress={onBack} />
        <View style={styles.primaryButtonWrapper}>
          {canContinueFromProvider ? (
            <PrimaryButton
              label={t("setupGuideContinue")}
              onPress={onContinueFromProvider}
            />
          ) : (
            <PrimaryButton
              label={
                isValidatingProviderKey
                  ? t("validatingKey")
                  : t("setupGuideValidateKey")
              }
              disabled={!canValidateProvider || isValidatingProviderKey}
              onPress={onValidateProviderKey}
            />
          )}
        </View>
      </View>
    </View>
  );
}

function VoiceTestFooter({
  resolvedRoutes,
  voiceTest,
  onBack,
  onVoiceTestAction,
  onContinueFromVoiceTest,
}: Pick<
  SetupGuideFooterProps,
  | "resolvedRoutes"
  | "voiceTest"
  | "onBack"
  | "onVoiceTestAction"
  | "onContinueFromVoiceTest"
>) {
  const { t } = useLocalization();
  const canContinue = !resolvedRoutes.stt.enabled || voiceTest.hasCompleted;

  return (
    <>
      <SecondaryButton label={t("setupGuideBack")} onPress={onBack} />
      {canContinue ? (
        <PrimaryButton
          label={t("setupGuideContinue")}
          onPress={onContinueFromVoiceTest}
        />
      ) : (
        <PrimaryButton
          label={getVoiceTestActionLabel(t, voiceTest.phase)}
          disabled={voiceTest.isBusy}
          onPress={onVoiceTestAction}
        />
      )}
    </>
  );
}

function SummaryFooter({
  onOpenSettings,
  onFinish,
}: Pick<SetupGuideFooterProps, "onOpenSettings" | "onFinish">) {
  const { t } = useLocalization();

  return (
    <>
      <SecondaryButton label={t("settings")} onPress={onOpenSettings} />
      <PrimaryButton label={t("setupGuideFinish")} onPress={onFinish} />
    </>
  );
}

export function SetupGuideFooter(props: SetupGuideFooterProps) {
  return (
    <View style={styles.footer}>
      {props.step === "intro" ? <IntroFooter {...props} /> : null}
      {props.step === "provider" ? <ProviderFooter {...props} /> : null}
      {props.step === "kokoro" ? <KokoroFooter {...props} /> : null}
      {props.step === "voice-test" ? <VoiceTestFooter {...props} /> : null}
      {props.step === "summary" ? <SummaryFooter {...props} /> : null}
    </View>
  );
}
