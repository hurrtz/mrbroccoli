# Design-System Reconciliation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This session executes inline (executing-plans) because the executor holds the full extracted design contracts in context.

**Goal:** Make every app surface match the vendored claude.ai/design system (design-system/ @ 9a4e83fa), verified by screenshot on Android emulator, physical Pixel 4a, and iPhone 17 Pro Max simulator in light + dark.

**Architecture:** Fix root causes in order: shared primitives → single components → structural rebuilds (IntroBanner anatomy, DriveSessionControls toggle+chip, intro flow 7→3 steps). Design contracts extracted to session scratchpad (`design-contract.md`, `contracts-a.md`, `reconciliation-diff.md` — R/C/V/O numbering used below). DS-internal drifts are NOT copied; tokens/foundations win over DS web JSX.

**Tech Stack:** React Native/Expo, src/theme tokens, PhosphorIcon boundary, Jest (+ node:sqlite-backed mocks), Metro dev-clients on 3 live targets.

## Global Constraints

- Every interactive target ≥44×44pt; icons never define the target.
- All user-visible strings in all 19 locale dictionaries (`npm run i18n:verify`).
- "Mr Broccoli" never "Mr." (root SPEC); brand names untranslated.
- Theme colors only from `src/theme/` (exceptions: intro banner violet family, premium gold — documented).
- Every bug fix ships with a regression test in the same commit (AGENTS.md).
- Gates per change: `npx tsc --noEmit` + targeted Jest; before finish: `npm run static:verify`, full coverage run, `npm run i18n:verify`.
- Verify each fix by re-screenshot on all 3 targets (light+dark where color-relevant).
- Local commits only, atomic per AGENTS.md; NO push (pre-push spec-review gate is the user's call).
- Do not touch `design-system/` or `.design-sync/`.

---

### Task A1: Overlay + theme-token hygiene (C12, C13)
**Files:** Modify: `src/screens/main/styles.ts:202,270`, `src/components/Picker.tsx:247`, `src/components/conversationDrawer/styles.ts:518`, `src/components/introFlow/introTheme.ts:51-56`
- [ ] statusDetailsOverlay + styleSheetOverlay + Picker overlay `rgba(0,0,0,0.16)`/`rgba(0,0,0,0.5)` → `colors.overlay` (thread colors where stylesheet is static — convert to themed factory or inline override, matching each file's existing pattern)
- [ ] Remove `deleteText.color:"#FFFFFF"` default (call site passes `colors.onDanger`)
- [ ] `getIntroTheme` premium triple reads `colors.premium/premiumSoft/premiumBorder`
- [ ] Test: extend existing theme/component tests asserting overlay color = theme token (new `__tests__` cases). Run targeted jest + tsc. Commit `fix(theme): use overlay token for modal scrims and derive intro premium from theme`

### Task A2: Composer conformance (C2, C3)
**Files:** Modify `src/screens/main/voiceTextInputPager/styles.ts` (+ `InputSurfacePages.tsx` if glyph passed there)
- [ ] Send glyph ink `colors.onPrimary` → `colors.onActiveControl`; disabled state unchanged
- [ ] Field/container cap 96 → 116 (DS "not negotiable"); verify layout on Pixel (smallest)
- [ ] Test: snapshot/unit for send button color + maxHeight. Commit `fix(workspace): composer send ink and 116pt field cap per design system`

### Task A3: Transcript polish (C4, C5, C6, C7)
**Files:** Modify `src/components/TranscriptMessage.tsx`, `src/components/ChatTranscript.tsx`, `src/screens/main/MainScreenWorkspace.tsx` (sheet title face/height)
- [ ] Speak-again action glyph `repeat`→`sound`, label key stays "Speak again" (exists)
- [ ] Empty state: glyph `message`, circle 46 r23 border+surface, title 18, desc 14/21 maxW 360
- [ ] Metrics label column 88→76
- [ ] Sheet title `fonts.display`→`fonts.headline` 17 (−0.2); content height 0.75→0.85 of window
- [ ] Tests: update TranscriptMessage/ChatTranscript tests. Commit `fix(transcript): align empty state, actions, metrics and sheet header with design system`

### Task A4: Notice + row-press + drawer search + task bar + toast tints (C1, C11, C8, C9, C10)
**Files:** `src/screens/main/VoiceTextInputPager.tsx` (notice), `src/features/settings/settings-primitives/SettingsRow.tsx` (press dim 0.72 instead of bg swap), `src/components/conversationDrawer/*` (search shell 46/r10), `src/design-system/BackgroundTaskBar.tsx` (30% ink border, 9% ink end-state bg), `src/components/Toast.tsx` (12% tints via shared alpha helper safe for rgba tokens)
- [ ] Each with focused test updates; screenshot-verify notice card + toast tones. Commit per file group (2–3 atomic commits)

### Task A5: Wordmark + brand spelling (C14)
**Files:** `src/screens/main/MainScreenTopBar.tsx` / `src/components/AppWordmark.tsx` (brand constant, stop passing localized appName), grep all locales for `Mr\.` / `Brokkoli`-style period forms; fix prose keys to no-period forms
- [ ] i18n:verify + regression test asserting wordmark literal. Commit `fix(brand): wordmark renders canonical Mr Broccoli; remove period forms from locales`

### Task B1: IntroBanner anatomy (R3)
**Files:** `src/components/IntroBanner.tsx`, `src/components/introFlow/introTheme.ts` (grad-a/b/shadow), `src/i18n/**` ×19 (new title/body keys)
- [ ] Gradient 135° #4C1D95→#6D28D9 (expo-linear-gradient already dep via PremiumBand), pad 13/15 gap 13 r14, 40pt hairline play circle (44 target, margin −2), title display 600 15, body supporting 12/17, trailing chevron/dismiss logic (existing introOpened rule), sheen 3.6s (reduce-motion off), whole-card pressable; compact 48/r10/30-circle variant; delete glow blob + "Take a look" pill
- [ ] Copy: "Set up Mr Broccoli" / "A minute of setup gets him thinking, hearing you and speaking back." ×19 locales
- [ ] Tests: banner render/dismiss/press; i18n:verify. Screenshot all 3 targets both themes. Commit `feat(intro): redesign intro banner to design-system violet gradient row`

### Task B2: DriveSessionControls toggle + countdown chip (R2)
**Files:** `src/screens/main/voiceTextInputPager/DriveSessionControls.tsx`, MainScreen wiring for countdownSeconds (exists via orb label), i18n (keys exist: Pause auto/Resume auto/Repeat last; add "Sends in {n}…" if missing), tests
- [ ] Two buttons (Repeat + fixed toggle) minH 48 r12 pad 6/10; toggle running = accent fill/border + onAccent ink + pause glyph; countdown chip r99 mono 11 accent-soft, role=status; keep spoken countdown; orb core countdown retained
- [ ] Regression test: toggle position fixed across states; chip renders when running+countdown. Commit `feat(drive): single pause/resume toggle with on-screen send countdown per design system`

### Task C1: Intro flow 3-step rebuild (R1) — subtasks
**Files:** `src/components/introFlow/` (IntroFlowScreen.tsx, introSteps.tsx → welcome/setup/try step components, introTheme.ts), `src/screens/MainScreen.tsx` wiring (thinkingReady, ephemeral test turn), `src/i18n/**` ×19, `src/screens/main/SPEC.md` Onboarding section, tests
- [ ] C1a Welcome step: blurred dialogue stack (4/2.4/1.1 blur + mask), play 128 r999 (existing audio assets + session activation hook), language chip + sand-styled language sheet, post-play voice note
- [ ] C1b Setup step: "Don't panic" + hero + 3 glyphs + AutoSetupCard(state≠idle)/hero button + FlowSwitch + manual groups (RouteOptionRow + IconAction from settings-primitives; Required/Optional pills)
- [ ] C1c Try step: hold-to-talk 76 r999 mic (press-in/out ephemeral turn via pipeline route snapshot, nothing persisted), transcribed bubble + reply bubble + latency meta + Replay
- [ ] C1d Gating: firstRun close suppression, step2 forward gate (thinkingReady), step3 Done gate (one completed turn); re-entry rules; manual switch reset
- [ ] C1e i18n: INTRO_COPY keys ×19; retire 7-step-only keys; i18n:verify
- [ ] C1f Update src/screens/main/SPEC.md Onboarding (7→3 decision, cite design-system 2026-08 owner resolution); update AGENTS.md intro description
- [ ] C1g Tests: step gating unit tests, ephemeral-turn hook test, render tests per step
- [ ] Screenshot: all 3 steps × 3 targets × light/dark; RTL spot-check (ar)
- [ ] Commits: one per subtask where separable; final `feat(intro): replace seven-step wizard with three-step walkthrough per design system`

### Task D1: Verification sweep + gates (V1–V9, C15, C16, C19 + Task 7/8 of goal)
- [ ] Drive deep surfaces via adb/simctl taps: settings overview + 7 pages, drawer (+archived/fork/search/actions sheet), route picker, style sheet, premium sheet, toasts, phase states (scripted turn), landscape × all targets; both themes
- [ ] C15 orb floor measurement on Pixel; C16 connections chips; C19 live theme change on Android 13
- [ ] `npm run static:verify`, `npx tsc --noEmit`, `npm run test:coverage -- --runInBand --watchman=false`, `npm run i18n:verify`
- [ ] CHANGELOG.md Unreleased entries; spec updates per Completion Checklist; Obsidian session notes
