Model Council's audit trail under a council reply: rounds, calls, challenges, and what the synthesis kept.

```jsx
<UberModeAuditCard summary="3 rounds · 11 calls · 1 failed"
  outcome="Convergence reached after round 2."
  details={["11 successful · 1 failed · 0 retired", "Reviews: 2 challenges · 6 converged"]}
  routes={["#1 · Anthropic · Claude Sonnet 4.5", "#2 · OpenAI · GPT-5"]} />
```

The header carries the `council` glyph (`users-three`) — never `robot`, which means the thinking phase. Collapsed, the summary line answers the only common question: how much work did this cost. The expanded audit is evidence before verdict, all pre-formatted by the app from its locale keys.

Rail style: hairline-topped section, no filled container, matching `TurnReceiptCard` — a council turn commonly shows both, and they must read as siblings.
