repo: hurrtz/mrbroccoli
branch: main

## Last sync

date: 2026-08-10

### Updated in this project
- Introduction redesigned to three steps (welcome with stored intro session, "Don’t panic" setup, ephemeral test with gated Done); IntroFlow, intro kit and intro.md rebuilt; banner and persona-pronoun rules already recorded.

- Added automatic on-device setup: `AutoSetupCard`, `AutoSetupPlanRow`, `InstallProgress`, `BackgroundTaskBar`.
- `IntroFlow` gained an `auto` step — `INTRO_STEPS` is seven ids, not six.
- Settings restructured: seven pages, stage-page route pickers own model lifecycle, the On-device AI page is retired (probe → introduction, languages → Listening, storage → Data & privacy, auto-setup → App & diagnostics).
- Design docs restructured: normative spec now lives in `guidelines/surfaces/*.md`; `migration-goal.md` and `explorations/` retired after absorption.

## Sync history

### 2026-08-09

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
| `components/workspace/**` | `src/components/AppWordmark.tsx`, `Picker.tsx`, `IntroBanner.tsx`, `PremiumUpgradeModal.tsx`, `src/screens/main/**` (orb, satellites, composer) |
| `components/chat/**` | `src/components/ChatBubble.tsx`, `ChatTranscript.tsx`, `MessageImageAttachments.tsx`, `conversationDrawer/ConversationDrawerItem.tsx` |
| `components/brand/ProviderIcon.jsx` | `src/components/ProviderIcon.tsx`, `assets/providers/` |
| `components/on-device/LocalModelPerformanceSummary.jsx` | `src/components/LocalModelPerformanceSummary.tsx` |
| `components/on-device/AutoSetup*`, `InstallProgress.jsx` | New — no upstream source. Implement per `guidelines/surfaces/on-device.md` against `src/features/settings/pages/OnDevicePage`, the on-device model catalogue and the download machinery. |
| `components/workspace/BackgroundTaskBar.jsx` | New — no upstream source. Home screen, `src/screens/main/**`. |
| `components/intro/IntroFlow.jsx` `auto` step | New — no upstream source. `src/features/intro/**`. |
| `ui_kits/mobile-app/**` | `src/screens/main/**`, `src/features/settings/pages/**` |
| `readme.md` content and visual sections | `DESIGN.md`, `src/design-system/SPEC.md`, `src/i18n/locales/en.ts` |
