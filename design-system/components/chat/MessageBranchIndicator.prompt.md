Where a conversation branched — chips on the message, because a branch point is metadata about the message, not part of what was said.

```jsx
<MessageBranchIndicator originLabel="Context kept from 'Weekend plans'" onOpenSource={openParent}
  branchesLabel="2 branches" onOpenBranches={openList} />
```

Two chips at most: the origin (this conversation kept context from another message) and the children (branches that grew from this one). A tappable chip is `accent-soft` with a strong border and accent text; when the source conversation no longer exists, pass `originLabel` without `onOpenSource` and the chip renders inert in `surface-alt` — stated, not clickable.

The drawn chip is 30pt; it wraps itself in a 44pt target with negative margins, the system's standard trick, so rows around it do not move.
