import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { usePremiumEntitlement } from "../context/PremiumEntitlementContext";
import { Modal } from "../design-system/NativeControls";
import { PhosphorIcon } from "../design-system/PhosphorIcon";
import { useLocalization } from "../i18n";
import { recordDebugLogEvent } from "../services/debugLogCapture";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";

export function PremiumUpgradeModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const premium = usePremiumEntitlement();
  const wasVisibleRef = React.useRef(false);
  React.useEffect(() => {
    if (visible && !wasVisibleRef.current) {
      recordDebugLogEvent({
        event: "premium-upgrade-dialog-presented",
        payload: {
          busy: premium.busy,
          connected: premium.storeConnected,
          productAvailable: Boolean(premium.storeProduct),
          productLoading: premium.storeProductLoading,
          status: premium.status,
        },
      });
    }
    wasVisibleRef.current = visible;
  }, [
    premium.busy,
    premium.status,
    premium.storeConnected,
    premium.storeProduct,
    premium.storeProductLoading,
    visible,
  ]);
  const errorText =
    premium.error === "pending"
      ? t("premiumErrorPending")
      : premium.error === "store-unavailable"
        ? t("premiumErrorUnavailable")
        : premium.error === "purchase-failed"
          ? t("premiumErrorFailed")
          : null;
  const purchaseLabel = premium.displayPrice
    ? t("premiumBuyPrice", { price: premium.displayPrice })
    : t("premiumBuy");
  const purchaseUnavailable =
    !premium.storeProductLoading && !premium.storeProduct;
  const benefits = [
    { icon: "key" as const, label: t("premiumBenefitProviders") },
    { icon: "redo" as const, label: t("premiumBenefitModes") },
    { icon: "global" as const, label: t("premiumBenefitTools") },
    { icon: "folder-open" as const, label: t("premiumBenefitKnowledge") },
  ];

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      maskClosable={!premium.busy}
      title={t("upgradeToPremium")}
      footer={[
        ...(premium.isPremium
          ? []
          : [
              {
                text: purchaseLabel,
                loading: premium.busy || premium.storeProductLoading,
                disabled:
                  premium.busy ||
                  premium.storeProductLoading ||
                  !premium.storeProduct,
                onPress: () => void premium.purchasePremium(),
              },
              ...(purchaseUnavailable
                ? [
                    {
                      text: t("retry"),
                      disabled: premium.busy,
                      onPress: () => void premium.refreshPremium(),
                    },
                  ]
                : []),
              {
                text: t("restorePurchase"),
                disabled: premium.busy,
                onPress: () => void premium.restorePremium(),
              },
            ]),
        { text: t("done"), disabled: premium.busy, onPress: onClose },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroRow}>
          <PhosphorIcon
            name={premium.isPremium ? "check-circle" : "thunderbolt"}
            size="feature"
            color={premium.isPremium ? colors.success : colors.accent}
          />
          <Text style={[styles.heroText, { color: colors.text }]}>
            {premium.isPremium ? t("premiumUnlocked") : t("premium")}
          </Text>
        </View>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          {t("premiumDescription")}
        </Text>
        <View style={styles.benefits}>
          {benefits.map((benefit) => (
            <View key={benefit.icon} style={styles.benefitRow}>
              <PhosphorIcon
                name={benefit.icon}
                size="control"
                color={colors.accent}
              />
              <Text style={[styles.benefitText, { color: colors.text }]}>
                {benefit.label}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={[
            styles.valueCard,
            { backgroundColor: colors.accentSoft, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.valueText, { color: colors.text }]}>
            {t("premiumPurchaseValue")}
          </Text>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            {t("premiumFreeKeepsWorking")}
          </Text>
        </View>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          {t("premiumRestoreHint")}
        </Text>
        {errorText ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.error, { color: colors.danger }]}
          >
            {errorText}
          </Text>
        ) : null}
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: { maxHeight: 520 },
  content: { gap: 14 },
  heroRow: { alignItems: "center", flexDirection: "row", gap: 12 },
  heroText: { fontFamily: fonts.headline, fontSize: 22, lineHeight: 28 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  benefits: { gap: 12 },
  benefitRow: { alignItems: "center", flexDirection: "row", gap: 12 },
  benefitText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  valueCard: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
    padding: 14,
  },
  valueText: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
  hint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  error: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
});
