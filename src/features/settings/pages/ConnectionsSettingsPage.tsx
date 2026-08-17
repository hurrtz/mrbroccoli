import React from "react";
import {
  Keyboard,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getAppProviderForCatalogProviderId } from "../../../catalog/appProviders";
import type { CatalogProviderId } from "../../../catalog";
import { ProviderIcon } from "../../../components/ProviderIcon";
import {
  PROVIDER_API_KEY_URLS,
  PROVIDER_LABELS,
  PROVIDER_ORDER,
} from "../../../constants/models";
import { IconButton } from "../../../design-system/IconButton";
import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import { useLocalization } from "../../../i18n";
import type { ProviderCircuitState } from "../../../services/providerResilience";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type { Provider, ProviderCapability, Settings } from "../../../types";
import { getProviderCapabilities } from "../../settings-core/providerSupport";
import type {
  ProviderHealthState,
  ProviderValidationState,
  TextInputFocusHandler,
} from "../../settings-core/types";

import {
  getCapabilityLabel,
  getStatusMeta,
  ProviderAboutModal,
  ProviderConnectionPanel,
} from "../ProviderConnectionPanel";
import { SettingsGroup } from "../settings-primitives/SettingsGroup";
import { SettingsSheet } from "../settings-primitives/SettingsSheet";
import { styles } from "../styles";

const IOS_KEYBOARD_DISMISS_FALLBACK_MS = 1_000;

type ProviderActions = {
  canValidateCapability: (
    provider: Provider,
    capability: ProviderCapability,
  ) => boolean;
  getProviderCapabilityHealthState: (
    provider: Provider,
    capability: ProviderCapability,
  ) => ProviderHealthState;
  getProviderCircuitState: (
    provider: Provider,
    capability: ProviderCapability,
  ) => ProviderCircuitState | null;
  getProviderHealthState: (provider: Provider) => ProviderHealthState;
  getProviderValidationState: (
    provider: Provider,
    capability: ProviderCapability,
  ) => ProviderValidationState;
  onTextInputFocus: TextInputFocusHandler;
  onUpdateApiKey: (provider: Provider, apiKey: string) => void;
  onValidateAll: (provider: Provider) => Promise<void>;
  onValidateCapability: (
    provider: Provider,
    capability: ProviderCapability,
  ) => Promise<void>;
};

function ProviderHealthPill({
  provider,
  state,
  testID = `provider-health-${provider}`,
}: {
  provider: Provider;
  state: ProviderHealthState;
  testID?: string;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const status = getStatusMeta(state, t, colors);

  return (
    <View
      testID={testID}
      accessible
      accessibilityLabel={status.label}
      style={[
        localStyles.healthPill,
        {
          backgroundColor: status.backgroundColor,
          borderColor: status.borderColor,
        },
      ]}
    >
      <Text style={[localStyles.healthText, { color: status.textColor }]}>
        {status.label}
      </Text>
    </View>
  );
}

function ProviderRow({
  capabilities,
  healthState,
  last,
  onPress,
  provider,
}: {
  capabilities: ProviderCapability[];
  healthState: ProviderHealthState;
  last: boolean;
  onPress: () => void;
  provider: Provider;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const capabilityLabel = capabilities
    .map((capability) => getCapabilityLabel(capability, t))
    .join(" · ");
  const status = getStatusMeta(healthState, t, colors);

  return (
    <View
      testID={`provider-card-${provider}`}
      style={[
        localStyles.providerRowWrap,
        { borderBottomColor: colors.border },
        last ? localStyles.last : null,
      ]}
    >
      <Pressable
        testID={`provider-card-${provider}-header-control`}
        accessibilityLabel={`${PROVIDER_LABELS[provider]}, ${capabilityLabel}, ${status.label}`}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          localStyles.providerRow,
          pressed ? { backgroundColor: colors.surfaceAlt } : null,
        ]}
      >
        <View testID={`provider-vault-row-${provider}`}>
          <ProviderIcon
            provider={provider}
            color={colors.text}
            size="control"
          />
        </View>
        <View style={localStyles.providerCopy}>
          <Text
            numberOfLines={1}
            style={[localStyles.providerName, { color: colors.text }]}
          >
            {PROVIDER_LABELS[provider]}
          </Text>
          <Text
            numberOfLines={1}
            style={[localStyles.providerMeta, { color: colors.textMuted }]}
          >
            {capabilityLabel}
          </Text>
        </View>
        <ProviderHealthPill provider={provider} state={healthState} />
        <PhosphorIcon name="right" size="inline" color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

function ProviderConnectionSheet({
  actions,
  apiKey,
  onClose,
  onOpenAbout,
  provider,
}: {
  actions: ProviderActions;
  apiKey: string;
  onClose: () => void;
  onOpenAbout: () => void;
  provider: Provider | null;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [visibleApiKey, setVisibleApiKey] = React.useState(false);
  const closingRef = React.useRef(false);
  const keyboardHideSubscriptionRef = React.useRef<{
    remove: () => void;
  } | null>(null);
  const closeFallbackRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(() => {
    setVisibleApiKey(false);
  }, [provider]);

  const finishClose = React.useCallback(() => {
    if (!closingRef.current) {
      return;
    }

    closingRef.current = false;
    keyboardHideSubscriptionRef.current?.remove();
    keyboardHideSubscriptionRef.current = null;
    if (closeFallbackRef.current !== null) {
      clearTimeout(closeFallbackRef.current);
      closeFallbackRef.current = null;
    }
    onClose();
  }, [onClose]);

  const handleClose = React.useCallback(() => {
    if (closingRef.current) {
      return;
    }

    if (Platform.OS !== "ios" || !Keyboard.isVisible()) {
      Keyboard.dismiss();
      onClose();
      return;
    }

    closingRef.current = true;
    keyboardHideSubscriptionRef.current = Keyboard.addListener(
      "keyboardDidHide",
      finishClose,
    );
    closeFallbackRef.current = setTimeout(
      finishClose,
      IOS_KEYBOARD_DISMISS_FALLBACK_MS,
    );
    Keyboard.dismiss();
  }, [finishClose, onClose]);

  React.useEffect(
    () => () => {
      closingRef.current = false;
      keyboardHideSubscriptionRef.current?.remove();
      keyboardHideSubscriptionRef.current = null;
      if (closeFallbackRef.current !== null) {
        clearTimeout(closeFallbackRef.current);
        closeFallbackRef.current = null;
      }
    },
    [],
  );

  if (!provider) {
    return null;
  }

  const capabilities = getProviderCapabilities(provider);

  return (
    <SettingsSheet
      contentStyle={localStyles.sheetBody}
      keyboardAvoiding
      maxHeight="88%"
      onClose={handleClose}
      scrollable={false}
      subtitle={capabilities
        .map((capability) => getCapabilityLabel(capability, t))
        .join(" · ")}
      testID={`provider-connection-sheet-${provider}`}
      title={PROVIDER_LABELS[provider]}
      visible
    >
      <View style={localStyles.sheetActions}>
        <ProviderIcon provider={provider} color={colors.text} size="control" />
        <ProviderHealthPill
          provider={provider}
          state={actions.getProviderHealthState(provider)}
          testID={`provider-sheet-health-${provider}`}
        />
        <View style={localStyles.sheetActionSpacer} />
        <IconButton
          icon="key"
          accessibilityLabel={`${t(
            provider === "openrouter" ? "openRouterKeys" : "createApiKey",
          )}: ${PROVIDER_LABELS[provider]}`}
          onPress={() => {
            void Linking.openURL(PROVIDER_API_KEY_URLS[provider]);
          }}
        />
        <IconButton
          icon="info-circle"
          accessibilityLabel={`${t("aboutThisProvider")}: ${
            PROVIDER_LABELS[provider]
          }`}
          onPress={onOpenAbout}
        />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={localStyles.sheetContent}
      >
        <ProviderConnectionPanel
          provider={provider}
          visibleApiKey={visibleApiKey}
          capabilities={capabilities}
          getCapabilityHealthState={(capability) =>
            actions.getProviderCapabilityHealthState(provider, capability)
          }
          getCircuitState={(capability) =>
            actions.getProviderCircuitState(provider, capability)
          }
          getValidationState={(capability) =>
            actions.getProviderValidationState(provider, capability)
          }
          canValidateCapability={(capability) =>
            actions.canValidateCapability(provider, capability)
          }
          apiKey={apiKey}
          onToggleApiKeyVisibility={() =>
            setVisibleApiKey((current) => !current)
          }
          onUpdateApiKey={actions.onUpdateApiKey}
          onTextInputFocus={actions.onTextInputFocus}
          onValidateCapability={(capability) =>
            actions.onValidateCapability(provider, capability)
          }
          onValidateAll={() => actions.onValidateAll(provider)}
        />
      </ScrollView>
    </SettingsSheet>
  );
}

export function ConnectionsSettingsPage({
  canValidateCapability,
  focusCatalogProviderId,
  focusProvider,
  getProviderCapabilityHealthState,
  getProviderCircuitState,
  getProviderHealthState,
  getProviderValidationState,
  onTextInputFocus,
  onUpdateApiKey,
  onValidateAll,
  onValidateCapability,
  settings,
}: {
  settings: Settings;
  focusProvider?: Provider;
  focusCatalogProviderId?: CatalogProviderId;
} & ProviderActions) {
  const { t } = useLocalization();
  const preferredFocusProvider =
    focusProvider ??
    (focusCatalogProviderId
      ? getAppProviderForCatalogProviderId(focusCatalogProviderId)
      : null);
  const [selectedProvider, setSelectedProvider] =
    React.useState<Provider | null>(preferredFocusProvider);
  const [aboutProvider, setAboutProvider] = React.useState<Provider | null>(
    null,
  );

  React.useEffect(() => {
    if (preferredFocusProvider) {
      setSelectedProvider(preferredFocusProvider);
    }
  }, [preferredFocusProvider]);

  const providers = PROVIDER_ORDER.filter((provider) =>
    Object.hasOwn(settings.apiKeys, provider),
  );
  const actions: ProviderActions = {
    canValidateCapability,
    getProviderCapabilityHealthState,
    getProviderCircuitState,
    getProviderHealthState,
    getProviderValidationState,
    onTextInputFocus,
    onUpdateApiKey,
    onValidateAll,
    onValidateCapability,
  };

  return (
    <View testID="connections-settings-page" style={styles.sectionPageStack}>
      <SettingsGroup
        title={t("providers")}
        footer={t("connectionsProviderFooter")}
      >
        {providers.map((provider, index) => {
          const capabilities = getProviderCapabilities(provider);
          const last = index === providers.length - 1;

          return (
            <ProviderRow
              key={provider}
              capabilities={capabilities}
              healthState={getProviderHealthState(provider)}
              last={last}
              provider={provider}
              onPress={() => setSelectedProvider(provider)}
            />
          );
        })}
      </SettingsGroup>

      <ProviderConnectionSheet
        actions={actions}
        apiKey={selectedProvider ? settings.apiKeys[selectedProvider] : ""}
        onClose={() => setSelectedProvider(null)}
        onOpenAbout={() => setAboutProvider(selectedProvider)}
        provider={selectedProvider}
      />
      <ProviderAboutModal
        provider={aboutProvider}
        visible={aboutProvider !== null}
        onClose={() => setAboutProvider(null)}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  providerRowWrap: {
    minHeight: 60,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  providerRow: {
    minHeight: 60,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  last: {
    borderBottomWidth: 0,
  },
  providerCopy: {
    flex: 1,
    minWidth: 0,
  },
  providerName: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
  },
  providerMeta: {
    marginTop: 2,
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.4,
  },
  healthPill: {
    flexShrink: 0,
    minHeight: 25,
    paddingHorizontal: 15,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  healthText: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  sheetBody: {
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  sheetActions: {
    minHeight: 52,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sheetActionSpacer: {
    flex: 1,
  },
  sheetContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 24,
  },
});
