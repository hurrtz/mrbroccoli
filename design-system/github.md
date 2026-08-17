repo: hurrtz/mrbroccoli
branch: main

## Last sync

date: 2026-08-17

### Updated in this project
- Automatic on-device setup removed entirely (owner call): `AutoSetupCard`, `AutoSetupPlanRow`, `InstallProgress`, `LocalModelPerformanceSummary`, `BackgroundTaskBar` and `surfaces/on-device.md` deleted. Models are acquired one at a time in the stage page that uses them.
- Introduction step 2 rebuilt: no measure/propose/install job and no green automatic action — the routes themselves, with the one required reasoning-model download. `IntroFlow` props `autoSetup` and `manualGroups` are gone (`setupGroups` replaces the latter).
- Retired chat sub-cards deleted (`TurnReceiptCard`, `WebSearchReferences`, `UsageCard`, `UberModeAuditCard`); their content is rows in the Turn receipt modal.
- New `guidelines/past-decisions.md` (+ a "Past decisions" card): the one home for dropped ideas. Surface docs now carry only the status quo.
- Settings: App & diagnostics loses the setup job and the banner toggle, gains Introduction and the editions row.

## Sync history

### 2026-08-10

- Introduction redesigned to three steps (welcome with stored intro session, "Don’t panic" setup, ephemeral test with gated Done); IntroFlow, intro kit and intro.md rebuilt.
- Settings restructured: seven pages, stage-page route pickers own model lifecycle, the On-device AI page retired (probe → introduction, languages → Listening, storage → Data & privacy).
- Design docs restructured: normative spec now lives in `guidelines/surfaces/*.md`; `migration-goal.md` and `explorations/` retired after absorption.

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
| `components/workspace/**` | `src/components/AppWordmark.tsx`, `Picker.tsx`, `src/screens/main/**` (orb, satellites, composer) |
| `components/chat/**` | `src/components/ChatBubble.tsx`, `ChatTranscript.tsx`, `MessageImageAttachments.tsx`, `conversationDrawer/ConversationDrawerItem.tsx` |
| `components/brand/ProviderIcon.jsx` | `src/components/ProviderIcon.tsx`, `assets/providers/` |
| `components/intro/IntroFlow.jsx` | `src/features/intro/**`; step 2's route rows follow `src/features/settings/settings-primitives/LocalModelRouteGroup.tsx` |
| `components/workspace/OrbTransport.jsx`, `OrbSatellite.jsx` | New — no upstream source. `src/screens/main/**`. |
| `ui_kits/mobile-app/**` | `src/screens/main/**`, `src/features/settings/pages/**` |
| `readme.md` content and visual sections | `DESIGN.md`, `src/design-system/SPEC.md`, `src/i18n/locales/en.ts` |
