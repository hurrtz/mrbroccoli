repo: hurrtz/mrbroccoli
branch: main

## Last sync

date: 2026-08-09T00:00:00Z

### Updated in this project

- Built the design system from the attached `MrBroccoli/` codebase (v3.2.0).
- Tokens lifted verbatim from `src/theme/colors.ts` and `src/theme/typography.ts`.
- 33 components ported from `src/design-system/`, `src/features/settings/` and `src/components/`.
- Mobile-app UI kit recreated from `src/screens/main/**` and `src/features/settings/pages/**`.

## Screen map

| Screen / artifact | Built from |
| --- | --- |
| `tokens/colors.css` | `src/theme/colors.ts` |
| `tokens/typography.css`, `tokens/fonts.css` | `src/theme/typography.ts`, `ds-bundle/fonts/` |
| `tokens/spacing.css`, `tokens/shape.css`, `tokens/motion.css` | `src/features/settings/styles.ts`, `src/screens/main/styles.ts`, `src/design-system/NativeControls.tsx` |
| `components/core/**` | `src/design-system/NativeControls.tsx`, `IconButton.tsx`, `PhosphorIcon.tsx` |
| `components/list/**` | `src/design-system/NativeControls.tsx` |
| `components/overlays/**` | `src/design-system/NativeControls.tsx`, `src/components/Toast.tsx` |
| `components/settings-primitives/**` | `src/features/settings/settings-primitives/**` |
| `components/workspace/**` | `src/components/AppWordmark.tsx`, `Picker.tsx`, `ResponseModeToggle.tsx`, `IntroBanner.tsx`, `PremiumUpgradeModal.tsx`, `src/screens/main/PhaseAwareVoiceAction.tsx` |
| `components/chat/**` | `src/components/ChatBubble.tsx`, `ChatTranscript.tsx`, `MessageImageAttachments.tsx`, `conversationDrawer/ConversationDrawerItem.tsx` |
| `components/brand/ProviderIcon.jsx` | `src/components/ProviderIcon.tsx`, `assets/providers/` |
| `components/on-device/**` | `src/components/LocalModelPerformanceSummary.tsx` |
| `ui_kits/mobile-app/**` | `src/screens/main/**`, `src/features/settings/pages/**` |
| `readme.md` content and visual sections | `DESIGN.md`, `src/design-system/SPEC.md`, `src/i18n/locales/en.ts` |
