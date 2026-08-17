The two things the workspace states before the orb: who answers next, and how this conversation is set.

```jsx
<WorkspaceHeader
  provider="openai" providerLabel="OpenAI" modelName="GPT-5" effort="High"
  assetBase={ASSETS} onSwitchRoute={openRoutePicker}
  summary="Length: Brief · Tone: Balanced · Voice: Heart" onOpenSettings={openSettings} />
```

**One object, two targets.** A raised block on the quiet surface fill with a hairline border, two 44pt rows, a hairline between them inset by 12pt. It sits **14pt below the top bar** — the old treatment sat tight under it and read as part of the headline.

The containment is deliberate and reverses the earlier "a contained control here reads as a second CTA above the voice stage" call (owner, 2026-08): the rows have to look pressable, and the model row — the most consequential choice on the screen — needs a mark at proper size and room for its effort word rather than one crowded line. Surface fill and a hairline, never an accent fill: pressable, not loud. The orb remains the only loud element.

Row one leads because it changes the answer: provider mark (or `cpu` for on-device), model name in the display face, the effort **word** (never a dot ladder), and a caret. `switchable={false}` for a single configured model drops the caret and the press target, and the row becomes a credit line. Row two states the conversation and opens the settings sheet; it truncates at the end, so a narrow screen simply shows less.

Portrait only. Landscape keeps `RouteByline` plus the icon-only `ConversationSettingsSummary` — the 300pt column has no room for a block, and the settings control floats over the stage's corner there. Both components stay in the system for that reason. See `guidelines/surfaces/workspace.md` → Header.

**`running` — the block's second life.** Neither choice can be changed once voice is submitted, so the block goes disabled at that moment, for every turn. It keeps its shape, its fill and its hairline exactly — nothing moves, nothing is removed — and drops to disabled strength, which is what says the caret and the settings control are unavailable. It takes `role="status" aria-live="polite"`, so what changes inside it is announced.

That is what lets a **council** report itself with no new furniture. Add `council` and both rows strip to the report and centre — the answering model above (`modelName`), where the council has got to below (`summary="2 of 4 models done · Round 2 of 3"`, growing a `· 1 failed` clause only when a member has failed). The effort word, the caret and the settings control all go: none is available or true mid-council. With nothing left to disable, **the dimming lifts** — these two lines are the only report of a wait that runs for minutes.
