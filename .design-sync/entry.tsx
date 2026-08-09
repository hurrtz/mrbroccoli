// Curated export surface for design-sync. Mr Broccoli ships no library build
// (package.json is private, with no `exports`), so this barrel plays the role
// a published `dist/index.js` would: it names the design-system surface worth
// exporting and nothing else. It re-exports the app's real components — it
// never redefines them.
//
// Keep in sync with `componentSrcMap` in .design-sync/config.json: that map
// pins each name's source file for prop extraction, and a name present in one
// but not the other either loses its `.d.ts` or never reaches the bundle.

// ── Core controls ────────────────────────────────────────────────────────────
export { Button, Input, List, Modal, Tag } from "../src/design-system/NativeControls";
export { IconButton } from "../src/design-system/IconButton";
export { PhosphorIcon } from "../src/design-system/PhosphorIcon";

// ── Settings primitives ──────────────────────────────────────────────────────
export {
  AntSettingsCard,
  AntDisclosureCard,
  AntButtonLabel,
  AntSectionIntro,
  AntRadioSection,
} from "../src/features/settings/settings-primitives/SettingsCards";
export {
  AntSwitchRow,
  AntNumberInputRow,
  AntTextArea,
} from "../src/features/settings/settings-primitives/SettingsFields";
export {
  AntPickerRow,
  AntPickerRows,
  AntPickerSection,
} from "../src/features/settings/settings-primitives/SettingsPickerControls";

// ── App surfaces ─────────────────────────────────────────────────────────────
export { AppWordmark } from "../src/components/AppWordmark";
export { ChatBubble } from "../src/components/ChatBubble";
export { ChatTranscript } from "../src/components/ChatTranscript";
export { ConversationDrawer } from "../src/components/ConversationDrawer";
export { ConversationMemoryModal } from "../src/components/ConversationMemoryModal";
export { IntroBanner } from "../src/components/IntroBanner";
export { LocalModelPerformanceSummary } from "../src/components/LocalModelPerformanceSummary";
export { MessageImageAttachments } from "../src/components/MessageImageAttachments";
export { Picker } from "../src/components/Picker";
export { PremiumUpgradeModal } from "../src/components/PremiumUpgradeModal";
export { ProviderIcon } from "../src/components/ProviderIcon";
export { ResponseModeToggle } from "../src/components/ResponseModeToggle";
export { Toast } from "../src/components/Toast";

// ── Required provider chain ──────────────────────────────────────────────────
// Every component above reads context, and two of the three providers throw
// rather than degrade when missing:
//   ThemeProvider         every control reads colors through useTheme()
//   LocalizationProvider  useLocalization() throws outside it (src/i18n.tsx)
//   SafeAreaProvider      Modal reads useSafeAreaInsets(), which throws too
// cfg.provider nests these for the preview cards; a design built with this
// library needs the same wrapping. Excluded from the component index via
// componentSrcMap — they are infrastructure, not design-system components.
export { ThemeProvider, useTheme } from "../src/theme/ThemeContext";
export { LocalizationProvider } from "../src/i18n";
export { SafeAreaProvider } from "react-native-safe-area-context";
// PremiumUpgradeModal calls usePremiumEntitlement(), which throws outside this
// provider. Its store calls are inert in the browser bundle, so it settles into
// the non-premium state — which is the state the upgrade modal exists to show.
export { PremiumEntitlementProvider } from "../src/context/PremiumEntitlementContext";

// ── Layout primitives ────────────────────────────────────────────────────────
// The components above are content, not layout: a screen built from them still
// needs the same primitives the app composes with. Re-exported (from
// react-native, which this bundle resolves to react-native-web) so a design
// never has to reach outside the library for a row or a label. Also excluded
// from the component index.
export {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";

// ── Design tokens ────────────────────────────────────────────────────────────
// The same palette and type scale the components style themselves with, so
// layout glue can match instead of approximating. Lowercase names are never
// treated as components, so these need no exclusion.
export { lightColors, darkColors } from "../src/theme/colors";
export { fonts, textStyles } from "../src/theme/typography";
