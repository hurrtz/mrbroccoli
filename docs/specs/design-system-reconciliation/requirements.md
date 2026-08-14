# Design-system reconciliation requirements

## Purpose

Reconcile the React Native product with the approved vendored design system
without confusing source discovery, unit coverage, or an older device run with
acceptance of the current checkout. The deliverable is a complete mapping of
the current contract plus exact-SHA native evidence for every retained surface
and state.

## Authority

Read evidence in this order:

1. `design-system/_ds_manifest.json` defines the approved export inventory;
   its component source, `.d.ts`, prompt, foundations, content charter, and
   surface documents define design intent. Contradictions inside the mirror are
   recorded rather than silently resolved.
2. Root and subtree `SPEC.md` / `DESIGN.md` files define product behavior,
   state ownership, privacy, persistence, and native constraints.
3. `src/` and `app/` define what the inspected checkout implements. A path
   mapping is evidence of ownership, not a parity verdict.
4. Tests, rebuilt native apps, accessibility trees, and reviewed screenshots
   prove behavior only for the exact source SHA and build identity that
   produced them.

`design-system/` remains a read-only web mirror. Nothing in it is imported into
the shipped app or edited during reconciliation.

## Current contract

The current manifest contains **63 entries**:

| Boundary            | Entries |
| ------------------- | ------: |
| Brand               |       1 |
| Chat                |      13 |
| Core                |      10 |
| Introduction        |       8 |
| List                |       2 |
| On-device setup     |       8 |
| Overlays            |       3 |
| Settings primitives |       6 |
| Workspace           |      12 |

The introduction has exactly three steps: `welcome`, `setup`, and `try`. The
last step runs an ephemeral real pipeline turn; it does not create a stored
conversation. Settings retains seven pages plus the edition-specific overview.

The following former contracts are not manifest entries and must not be
reintroduced as current mappings: `ResponseModeToggle`,
`PhaseAwareVoiceAction`, `WorkspaceStatusLine`, `DriveSessionControls`,
`ConversationActionSheet`, `ConversationIntegrityModal`,
`ConversationMemoryModal`, `IntroVoicePicker`, `IntroButton`, `IntroDivider`,
`IntroPanel`, `IntroPanelDivider`, and `IntroPoint`. Historical `Ant*` source
names retained for import stability are implementation details, not approved
design-system components.

## Acceptance

- Map every one of the 63 manifest entries to its native component,
  composition, runtime data owner, or localized equivalent.
- Reconcile the workspace, conversation drawer, transcript, three-step
  introduction, seven-page settings hierarchy, on-device setup, chat metadata,
  overlays, and announcements in every represented state.
- Preserve design tokens, semantic Phosphor glyphs, regular icon weight,
  minimum 44-point targets, modal focus isolation, hidden dismissal backdrops,
  dynamic announcements, and light/dark contrast.
- Validate portrait and landscape, light and dark appearance, RTL, increased
  contrast, and accessibility-large text on rebuilt Android and iOS apps.
- Exercise orb idle, recording, transcribing, brief thinking, searching,
  thinking, synthesizing, speaking, ring boundaries, and overtime. The
  satellite ring owns composition and transport controls; Drive Session adds
  no dock or drawn countdown.
- Exercise first-run and re-entry intro gating, localized dialogue/audio
  pairing, automatic setup, cancellation, failure, retry/resume, and the
  ephemeral test turn.
- Exercise drawer actions, branches, transcript folding/actions, reply
  failures, pipeline notices, toasts, pickers, dialogs, readiness, and
  persistence through their real entry points.
- Give every confirmed defect the closest reliable automated regression test.

Hosted-provider calls remain outside this reconciliation unless a separate
release request authorizes quota spend.

## Evidence rule

The implementation audited here is frozen at
`db1d59b4c8ff56fea3ee8ab66cb1ba57c2174ffa`. Its 63-entry manifest has SHA-256
`b8f6f5f0c7013be81f5f8c544786f297c0f169d3dc3b4eda6e26923a0cf3174a`, and the
complete spend-free `make pre-push` gate passed against that implementation.
This establishes committed source and static/test evidence only. No current
row is accepted without rebuilt exact-SHA apps, native tests, physical
capability runs, accessibility evidence, and manual review of every captured
image. An unavailable or ineligible target is a blocker, not a pass.

The shared checkout still contains unrelated local files outside this audit's
commits, so this record does not claim a clean-worktree or detached-checkout
pass. Those files were excluded from both reconciliation commits.

Each artifact manifest must record source SHA, build identity, target model and
OS, locale, appearance, orientation, text/contrast settings, command, result,
and review status. It must not retain credentials, prompts, transcripts,
provider bodies, or model output.
