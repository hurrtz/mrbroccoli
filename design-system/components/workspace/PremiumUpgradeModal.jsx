import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { Modal } from "../overlays/Modal";

/** The Premium sheet. Benefits are a plain icon list; the price sits on the action. */
export function PremiumUpgradeModal({ visible, onClose, isPremium = false, price, benefits = [], description, valueNote, freeNote, inline = false }) {
  const footer = isPremium
    ? [{ text: "Done", onPress: onClose }]
    : [
        { text: price ? "Buy for " + price : "Buy", onPress: onClose, tone: "success" },
        { text: "Restore purchase", onPress: onClose },
        { text: "Done", onPress: onClose },
      ];
  return (
    <Modal visible={visible} onClose={onClose} layout="sheet" title={isPremium ? "Premium" : "Upgrade to Premium"} footer={footer} inline={inline}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <PhosphorIcon name={isPremium ? "check-circle" : "thunderbolt"} size="feature" color={isPremium ? "var(--mb-color-success)" : "var(--mb-color-accent)"} />
        <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 20, color: "var(--mb-color-text)" }}>{isPremium ? "Premium unlocked" : "Premium"}</span>
      </div>
      {description ? <p style={{ margin: 0, fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "22px", color: "var(--mb-color-text-secondary)" }}>{description}</p> : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {benefits.map((benefit) => (
          <div key={benefit.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PhosphorIcon name={benefit.icon} size="control" color="var(--mb-color-accent)" />
            <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 15, color: "var(--mb-color-text)" }}>{benefit.label}</span>
          </div>
        ))}
      </div>
      {valueNote ? (
        <div style={{ padding: 14, borderRadius: "var(--mb-radius-card)", background: "var(--mb-color-accent-soft)", border: "1px solid var(--mb-color-border)", display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "22px", color: "var(--mb-color-text)" }}>{valueNote}</span>
          {freeNote ? <span style={{ fontFamily: "var(--mb-text-supporting-family)", fontSize: 13, lineHeight: "19px", color: "var(--mb-color-text-secondary)" }}>{freeNote}</span> : null}
        </div>
      ) : null}
    </Modal>
  );
}
