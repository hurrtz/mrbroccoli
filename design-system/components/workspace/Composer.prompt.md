The text composer, page two of the workspace pager beside the orb.

```jsx
<Composer value={draft} onChange={setDraft} onSend={send} height={orbSize} />
```

Geometry comes from the app's own composer and is not negotiable: radius 15, border 1.5 in accent, padding 16/9/8, gap 10, a 46pt circular send button, and a 116pt cap when the height is not fixed.

On the workspace, pass the orb's current size as `height` so the composer fills exactly the orb's slot — the satellites and status line below must not move when the pager swaps pages.

The send button is inert while the field is empty: `surface-alt` fill, muted glyph, no pointer. It never disappears — the layout is the same with and without a draft. Attach does not live here; it sits under the orb, reachable from both pager pages.
