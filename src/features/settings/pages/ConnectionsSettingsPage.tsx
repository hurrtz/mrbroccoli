import React from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getAppProviderForCatalogProviderId } from "../../../catalog/appProviders";
import type { CatalogProviderId } from "../../../catalog";
import { ProviderIcon } from "../../../components/ProviderIcon";
import { APP_MODAL_ORIENTATIONS } from "../../../constants/layout";
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
import { PremiumBand } from "../settings-primitives/PremiumBand";
import { RouteOptionRow } from "../settings-primitives/RouteOptionRow";
import { SettingsGroup } from "../settings-primitives/SettingsGroup";
import { styles } from "../styles";

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
  const insets = useSafeAreaInsets();
  const [visibleApiKey, setVisibleApiKey] = React.useState(false);

  React.useEffect(() => {
    setVisibleApiKey(false);
  }, [provider]);

  if (!provider) {
    return null;
  }

  const capabilities = getProviderCapabilities(provider);

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      supportedOrientations={APP_MODAL_ORIENTATIONS}
      transparent
      visible
    >
      <View
        testID={`provider-connection-sheet-${provider}`}
        accessibilityViewIsModal
        style={localStyles.overlay}
      >
        <Pressable
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
        />
        <View
          style={[
            localStyles.sheet,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              paddingBottom: Math.max(16, insets.bottom),
            },
          ]}
        >
          <View
            style={[
              localStyles.handle,
              { backgroundColor: colors.borderStrong },
            ]}
          />
          <View style={localStyles.sheetHeader}>
            <ProviderIcon
              provider={provider}
              color={colors.text}
              size="control"
            />
            <View style={localStyles.sheetTitleCopy}>
              <Text
                accessibilityRole="header"
                style={[localStyles.sheetTitle, { color: colors.text }]}
              >
                {PROVIDER_LABELS[provider]}
              </Text>
              <Text
                style={[localStyles.sheetMeta, { color: colors.textMuted }]}
              >
                {capabilities
                  .map((capability) => getCapabilityLabel(capability, t))
                  .join(" · ")}
              </Text>
            </View>
            <ProviderHealthPill
              provider={provider}
              state={actions.getProviderHealthState(provider)}
              testID={`provider-sheet-health-${provider}`}
            />
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
            <IconButton
              icon="close"
              testID={`provider-connection-close-${provider}`}
              accessibilityLabel={t("dismiss")}
              onPress={onClose}
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
        </View>
      </View>
    </Modal>
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
  isPremium,
  onOpenPremium,
  onTextInputFocus,
  onUpdateApiKey,
  onValidateAll,
  onValidateCapability,
  settings,
}: {
  settings: Settings;
  focusProvider?: Provider;
  focusCatalogProviderId?: CatalogProviderId;
  isPremium: boolean;
  onOpenPremium: () => void;
} & ProviderActions) {
  const { t } = useLocalization();
  const preferredFocusProvider =
    focusProvider ??
    (focusCatalogProviderId
      ? getAppProviderForCatalogProviderId(focusCatalogProviderId)
      : null);
  const [selectedProvider, setSelectedProvider] =
    React.useState<Provider | null>(isPremium ? preferredFocusProvider : null);
  const [aboutProvider, setAboutProvider] = React.useState<Provider | null>(
    null,
  );

  React.useEffect(() => {
    if (isPremium && preferredFocusProvider) {
      setSelectedProvider(preferredFocusProvider);
    }
  }, [isPremium, preferredFocusProvider]);

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
        footer={t("settingsConnectionsSummary")}
      >
        {providers.map((provider, index) => {
          const capabilities = getProviderCapabilities(provider);
          const last = index === providers.length - 1 && isPremium;

          return isPremium ? (
            <ProviderRow
              key={provider}
              capabilities={capabilities}
              healthState={getProviderHealthState(provider)}
              last={last}
              provider={provider}
              onPress={() => setSelectedProvider(provider)}
            />
          ) : (
            <RouteOptionRow
              key={provider}
              testID={`provider-card-${provider}`}
              label={PROVIDER_LABELS[provider]}
              locked
              meta={capabilities
                .map((capability) => getCapabilityLabel(capability, t))
                .join(" · ")}
              onSelect={() => undefined}
            />
          );
        })}
        {!isPremium ? (
          <PremiumBand
            actionLabel={t("upgradeToPremium")}
            copy={t("premiumBenefitProviders")}
            onPress={onOpenPremium}
            premiumLabel={t("premium")}
          />
        ) : null}
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
    minHeight: 26,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  healthText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "88%",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    overflow: "hidden",
  },
  handle: {
    width: 38,
    height: 4,
    marginTop: 10,
    borderRadius: 2,
    alignSelf: "center",
  },
  sheetHeader: {
    minHeight: 58,
    paddingLeft: 18,
    paddingRight: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sheetTitleCopy: {
    flex: 1,
    minWidth: 0,
  },
  sheetTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 22,
  },
  sheetMeta: {
    marginTop: 1,
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.4,
  },
  sheetContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 24,
  },
});
