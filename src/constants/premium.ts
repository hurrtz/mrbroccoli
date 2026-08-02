export const PREMIUM_PRODUCT_ID =
  "com.tobiaswinkler.app.mrbroccoli.premium.lifetime";

export const PREMIUM_FEATURES = [
  "provider-connections",
  "provider-response-modes",
  "web-search",
  "image-prompts",
  "drive-mode",
  "ulra-mode",
  "past-conversation-knowledge",
  "portable-conversation-archive",
  "advanced-response-settings",
] as const;

export type PremiumFeature = (typeof PREMIUM_FEATURES)[number];
