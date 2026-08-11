# Docs Index

## How To Use This Index

1. Start with [`SPEC.md`](./SPEC.md) and [`DESIGN.md`](./DESIGN.md).
2. Follow the chain into the subtree you plan to change.
3. Read the deepest document that owns the behavior.
4. Update every affected document in that chain before completing the work.

This index is navigation only. `SPEC.md`, `DESIGN.md`, and `AGENTS.md` are the
authoritative documents.

## Document Types

- `AGENTS.md` — workflow, validation, collaboration, and spec-maintenance rules.
- `SPEC.md` — intent, ownership, product/domain rules, and invariants.
- `DESIGN.md` — runtime architecture, orchestration, state flow, and fallback
  behavior for complex boundaries.
- `docs/specs/<change-name>/` — detailed temporary or worked-example
  requirements, design, and task plans; not automatically canonical.
- `README.md` and `docs/` — operational setup and focused reference material.
- `CHANGELOG.md` — user-visible release history, not architecture authority.

## Active Cross-Cutting Goal

- [`docs/specs/design-system-reconciliation/requirements.md`](./docs/specs/design-system-reconciliation/requirements.md)
  defines the current design-system and native-runtime reconciliation goal;
  its sibling `design.md`, `tasks.md`, and `matrix.md` hold the execution model
  and live evidence status.

## Stable Boundaries

| Area | Path | Read First | Deeper Design |
| --- | --- | --- | --- |
| App entry and routing | `app/` | [`app/SPEC.md`](./app/SPEC.md) | root `DESIGN.md` |
| Source tree | `src/` | [`src/SPEC.md`](./src/SPEC.md) | child specs below |
| Shared contexts | `src/context/` | [`src/context/SPEC.md`](./src/context/SPEC.md) | root `DESIGN.md` |
| Settings persistence | `src/hooks/settings/` | [`src/hooks/settings/SPEC.md`](./src/hooks/settings/SPEC.md) | root persistence design |
| Conversations | `src/hooks/conversations/` | [`src/hooks/conversations/SPEC.md`](./src/hooks/conversations/SPEC.md) | root conversation design |
| Main workspace | `src/screens/main/` | [`src/screens/main/SPEC.md`](./src/screens/main/SPEC.md) | [`src/screens/main/DESIGN.md`](./src/screens/main/DESIGN.md) |
| Settings UI | `src/features/settings/` | [`src/features/settings/SPEC.md`](./src/features/settings/SPEC.md) | root edition design |
| Provider manifest | `src/constants/providers/` | [`src/constants/providers/SPEC.md`](./src/constants/providers/SPEC.md) | service routing specs |
| Service layer | `src/services/` | [`src/services/SPEC.md`](./src/services/SPEC.md) | service child specs |
| Voice pipeline | `src/services/voicePipeline/` | [`src/services/voicePipeline/SPEC.md`](./src/services/voicePipeline/SPEC.md) | [`src/services/voicePipeline/DESIGN.md`](./src/services/voicePipeline/DESIGN.md) |
| LLM routing | `src/services/llm/` | [`src/services/llm/SPEC.md`](./src/services/llm/SPEC.md) | root/provider design |
| Conversation knowledge | `src/services/conversationKnowledge/` | [`src/services/conversationKnowledge/SPEC.md`](./src/services/conversationKnowledge/SPEC.md) | root context design |
| Localization | `src/i18n/` | [`src/i18n/SPEC.md`](./src/i18n/SPEC.md) | [`docs/localization.md`](./docs/localization.md) |
| Native controls | `src/design-system/` | [`src/design-system/SPEC.md`](./src/design-system/SPEC.md) | [`docs/native-controls.md`](./docs/native-controls.md) |
| Build/release automation | `scripts/` | [`scripts/SPEC.md`](./scripts/SPEC.md) | `Makefile` and release docs |
| Android native layer | `android/` | [`android/SPEC.md`](./android/SPEC.md) | native source and tests |
| iOS native layer | `ios/` | [`ios/SPEC.md`](./ios/SPEC.md) | native source and tests |

## Common Chains

### Changing the main conversation or voice experience

1. [`SPEC.md`](./SPEC.md)
2. [`DESIGN.md`](./DESIGN.md)
3. [`src/SPEC.md`](./src/SPEC.md)
4. [`src/screens/main/SPEC.md`](./src/screens/main/SPEC.md)
5. [`src/screens/main/DESIGN.md`](./src/screens/main/DESIGN.md)
6. For turn execution, continue through the voice-pipeline chain below.

### Changing voice-turn orchestration

1. [`SPEC.md`](./SPEC.md)
2. [`DESIGN.md`](./DESIGN.md)
3. [`src/SPEC.md`](./src/SPEC.md)
4. [`src/services/SPEC.md`](./src/services/SPEC.md)
5. [`src/services/voicePipeline/SPEC.md`](./src/services/voicePipeline/SPEC.md)
6. [`src/services/voicePipeline/DESIGN.md`](./src/services/voicePipeline/DESIGN.md)
7. Add [`src/services/llm/SPEC.md`](./src/services/llm/SPEC.md) when response
   routing or prompt construction changes.

### Changing settings or a persisted field

1. Root spec and design.
2. [`src/SPEC.md`](./src/SPEC.md)
3. [`src/hooks/settings/SPEC.md`](./src/hooks/settings/SPEC.md)
4. [`src/features/settings/SPEC.md`](./src/features/settings/SPEC.md) for UI.
5. The owning service or provider spec when the setting changes runtime
   behavior.

### Changing conversations, branches, backups, or memory

1. Root spec and design.
2. [`src/SPEC.md`](./src/SPEC.md)
3. [`src/hooks/conversations/SPEC.md`](./src/hooks/conversations/SPEC.md)
4. [`src/services/SPEC.md`](./src/services/SPEC.md) for backup/archive behavior.
5. [`src/services/conversationKnowledge/SPEC.md`](./src/services/conversationKnowledge/SPEC.md)
   for cross-session retrieval or privacy.

### Changing a hosted provider or model

1. Root spec and design.
2. [`src/SPEC.md`](./src/SPEC.md)
3. [`src/constants/providers/SPEC.md`](./src/constants/providers/SPEC.md)
4. [`src/services/SPEC.md`](./src/services/SPEC.md)
5. [`src/services/llm/SPEC.md`](./src/services/llm/SPEC.md) for LLM behavior.
6. Voice-pipeline specs when STT/TTS/search execution changes.

### Changing Free/Premium behavior

1. Root spec and design.
2. [`src/context/SPEC.md`](./src/context/SPEC.md)
3. [`src/screens/main/SPEC.md`](./src/screens/main/SPEC.md)
4. [`src/features/settings/SPEC.md`](./src/features/settings/SPEC.md)
5. [`src/services/SPEC.md`](./src/services/SPEC.md) when offline-profile
   selection or store integration changes.

### Changing a native module

1. Root spec and design.
2. [`src/SPEC.md`](./src/SPEC.md) and the owning TypeScript service spec.
3. [`android/SPEC.md`](./android/SPEC.md) or [`ios/SPEC.md`](./ios/SPEC.md).
4. [`scripts/SPEC.md`](./scripts/SPEC.md) when validation or release packaging
   changes.

## Documentation Rules

- Parent documents constrain child documents; children refine without copying.
- Use `Decision`, `Assumption`, `Open question`, and `Dependency` markers where
  misunderstanding confidence would cause a wrong implementation.
- Prefer evidence links to tests and source contracts for security, privacy,
  persistence, release, and fallback rules.
- Add a child `SPEC.md` only for a stable boundary with non-obvious ownership or
  invariants.
- Add `DESIGN.md` only when runtime complexity would clutter the spec.
- Keep chronological implementation history in Git and `CHANGELOG.md`, not in
  living specs.

## Change Together

- Public behavior changes with its owning spec, tests, translations, and
  changelog entry.
- Architecture, state flow, or fallback changes with its owning design.
- Persisted shape changes with migration rules and backup compatibility.
- Provider changes with the runtime manifest, route services, pickers,
  validation, and provider spec.
- Native changes with native tests, configuration parity, and release checks.
- Workflow or tooling changes with `AGENTS.md`, `scripts/SPEC.md`, and relevant
  operational docs.
