One row in the conversation drawer.

```jsx
<ConversationDrawerItem title="Tide tables" providers={["openai"]} models={["GPT-5"]}
  messageCount={12} updatedAt="09.08.26 · 14:12" active onSelect={open} onOpenActions={openMenu} />
```

The active row is marked by a 3pt accent rail at the leading edge, not by a fill alone. Branch children indent 14pt per level, capped at four. Pinned and private state are inline glyphs before the title.
