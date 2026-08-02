import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { usePremiumEntitlement } from "../context/PremiumEntitlementContext";
import { Modal } from "../design-system/NativeControls";
import { PhosphorIcon } from "../design-system/PhosphorIcon";
import { useLocalization } from "../i18n";
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
                loading: premium.busy,
                disabled: premium.busy,
                onPress: () => void premium.purchasePremium(),
              },
              {
                text: t("restorePurchase"),
                disabled: premium.busy,
                onPress: () => void premium.restorePremium(),
              },
            ]),
        { text: t("done"), disabled: premium.busy, onPress: onClose },
      ]}
    >
      <View style={styles.content}>
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: { gap: 14 },
  heroRow: { alignItems: "center", flexDirection: "row", gap: 12 },
  heroText: { fontFamily: fonts.headline, fontSize: 22, lineHeight: 28 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  hint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  error: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
});
