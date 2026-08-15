import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { Button, Input, Modal } from "../../design-system/NativeControls";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { textStyles } from "../../theme/typography";

export type SessionLockModalMode = "lock" | "remove" | "unlock";

export function SessionLockModal({
  deviceAuthAvailable,
  mode,
  onClose,
  onDeviceAuth,
  onSubmitPassword,
  visible,
}: {
  deviceAuthAvailable: boolean;
  mode: SessionLockModalMode;
  onClose: () => void;
  onDeviceAuth: () => Promise<boolean>;
  onSubmitPassword: (password: string) => Promise<boolean>;
  visible: boolean;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [password, setPassword] = React.useState("");
  const [confirmation, setConfirmation] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [passwordFieldFocused, setPasswordFieldFocused] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      setPassword("");
      setConfirmation("");
      setError(null);
      setPasswordFieldFocused(false);
      setLoading(false);
    }
  }, [mode, visible]);

  const title =
    mode === "lock"
      ? t("sessionLockTitle")
      : mode === "remove"
        ? t("sessionRemoveLockTitle")
        : t("sessionUnlockTitle");
  const description =
    mode === "lock"
      ? t("sessionLockDescription")
      : mode === "remove"
        ? t("sessionRemoveLockDescription")
        : t("sessionUnlockDescription");
  const actionLabel =
    mode === "lock"
      ? t("sessionSetLock")
      : mode === "remove"
        ? t("sessionRemoveLock")
        : t("sessionUnlock");
  const compactForIosKeyboard = Platform.OS === "ios" && passwordFieldFocused;

  const submitPassword = async () => {
    if (mode === "lock" && password.length < 6) {
      setError(t("sessionLockPasswordTooShort"));
      return;
    }
    if (mode === "lock" && password !== confirmation) {
      setError(t("sessionLockPasswordsDoNotMatch"));
      return;
    }
    if (!password) {
      setError(t("sessionLockPasswordTooShort"));
      return;
    }

    setError(null);
    setLoading(true);
    try {
      if (await onSubmitPassword(password)) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const submitDeviceAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      if (await onDeviceAuth()) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      footer={[
        { text: t("cancel"), onPress: onClose, disabled: loading },
        {
          text: actionLabel,
          onPress: () => void submitPassword(),
          loading,
        },
      ]}
      keyboardAvoiding
      maskClosable={false}
      onClose={onClose}
      title={title}
      visible={visible}
    >
      <View style={lockStyles.body}>
        {compactForIosKeyboard ? null : (
          <Text
            style={[lockStyles.description, { color: colors.textSecondary }]}
          >
            {description}
          </Text>
        )}
        <Input
          accessibilityLabel={t("sessionLockPassword")}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setPassword}
          onFocus={() => setPasswordFieldFocused(true)}
          inputStyle={lockStyles.passwordInput}
          placeholder={t("sessionLockPassword")}
          type="password"
          value={password}
        />
        {mode === "lock" ? (
          <Input
            accessibilityLabel={t("sessionLockConfirmPassword")}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setConfirmation}
            onFocus={() => setPasswordFieldFocused(true)}
            inputStyle={lockStyles.passwordInput}
            placeholder={t("sessionLockConfirmPassword")}
            type="password"
            value={confirmation}
          />
        ) : null}
        {error ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[lockStyles.error, { color: colors.danger }]}
          >
            {error}
          </Text>
        ) : null}
        {mode !== "lock" && deviceAuthAvailable ? (
          <Button
            disabled={loading}
            onPress={() => void submitDeviceAuth()}
            style={lockStyles.deviceAuthButton}
          >
            <PhosphorIcon color={colors.accent} name="lock" size="compact" />
            <Text style={[lockStyles.deviceAuthText, { color: colors.accent }]}>
              {t("sessionUseDeviceAuth")}
            </Text>
          </Button>
        ) : null}
      </View>
    </Modal>
  );
}

const lockStyles = StyleSheet.create({
  body: { gap: 12 },
  description: textStyles.body,
  deviceAuthButton: { minHeight: 48 },
  deviceAuthText: textStyles.action,
  error: textStyles.caption,
  passwordInput: { paddingHorizontal: 12 },
});
