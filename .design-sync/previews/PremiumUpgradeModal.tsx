import React from "react";
import { PremiumUpgradeModal } from "mrbroccoli";

// Real call site: src/screens/main/MainScreenPresentation.tsx renders
// <PremiumUpgradeModal {...premiumUpgrade} /> unconditionally, letting
// `visible` gate the sheet.
//
// BLOCKER (see .design-sync/learnings/workspace.md): PremiumUpgradeModal
// calls usePremiumEntitlement() (src/context/PremiumEntitlementContext.tsx)
// unconditionally on every render, before the `visible` check. That hook
// throws synchronously ("usePremiumEntitlement must be used within
// PremiumEntitlementProvider") unless a <PremiumEntitlementProvider> ancestor
// exists. This harness's provider chain (config.json `provider`) is
// ThemeProvider > LocalizationProvider > SafeAreaProvider only -- no premium
// context -- and PremiumEntitlementProvider itself isn't part of the curated
// "mrbroccoli" export surface (entry.tsx), so it cannot be supplied from a
// preview file even if this file were allowed to add providers. This is a
// config-level gap, not something fixable from `.design-sync/previews/`.
//
// Also worth noting for whoever picks this up: every bit of this component's
// real visual variance (free vs. premium, busy, store error, price) comes
// from that context, not from props -- PremiumUpgradeModal only takes
// `visible`/`onClose`. So even once the provider is wired in, showing more
// than one meaningful state will need a way to seed that context's value
// (e.g. a design-sync-only mock PremiumEntitlementProvider), since the real
// provider talks to expo-iap and the platform store.
//
// Authored open anyway per the brief. This also needs
// {"cardMode":"single","viewport":"390x844"} (recorded in learnings; this
// preview file cannot set it).

export const Default = () => (
  <PremiumUpgradeModal visible onClose={() => {}} />
);
