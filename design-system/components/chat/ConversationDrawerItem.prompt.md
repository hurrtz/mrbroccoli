One conversation row in the drawer — flat fork model.

```jsx
<ConversationDrawerItem title="Shortlist vote" forkOf="Serious contenders"
  models={[{ provider: "openai" }, { provider: "anthropic" }]}
  messageCount={5} updatedAt="08.08.26" active
  onSelect={open} onOpenActions={openMenu} onOpenRoot={jumpToRoot} />
```

There is no nesting: every session — forked or not — is a first-class row, sorted by recency. A forked session carries a pill tag naming its root session with a trailing caret; tapping it fires `onOpenRoot` (44pt effective touch target around a 32pt pill, so mis-taps don't select the row). The meta line is `date · N messages · provider marks` — one mark per model, duplicates included, no model names, no time of day. The active row is marked by its surface fill alone. Pinned (accent) and private (secondary) glyphs sit inline before the title. Swipe-to-delete is the row's delete affordance in the app; the ellipsis button opens the actions sheet (pin, private, rename, share, archive, delete).
