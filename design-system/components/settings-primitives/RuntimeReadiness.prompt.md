Shows whether the app can hold a conversation — think, listen, speak, search — as one line of dots and labels, each opening the setting behind it.

```jsx
<RuntimeReadiness
  readiness={{ think: "ready", listen: "attention", speak: "broken", search: "off" }}
  onSelect={(step) => openSettingsFor(step)}
/>
```

## States

`ready` fills the dot green, `broken` fills it red, `attention` draws a hollow gold ring, `off` a hollow muted ring. Filled versus hollow is the second channel, so the four states separate without colour.

## Labels stay in body ink

Never tint the label to match its dot. Gold on the warm off-white measures 4.35:1, under AA — the shipped settings grid never colours its text either. Colour lives in the dot; the accessible name carries the state word ("Listen. Attention.") for anyone who cannot use it.

## No affordance chrome

The rows carry no underline, border or fill. On a settings screen everything is tappable, and the line's whole value is that it is quiet — link chrome spends exactly what it is there to provide. Explored in `explorations/runtime-readiness.html`, where the underlined and boxed variants sit beside this one.

## Not a stepper, and not in a card

Earlier drafts connected the four with hairlines, which promised a sequence. These are independent capabilities — nothing is step 1 of 4 — so there are no connectors.

It also carries no container and no heading. Four dots with words beside them read as status without being told they are status, and a card around them makes a small line of text look like a section of the page. Place it directly on the surface, aligned with the rows around it.

The component bleeds its own padding outwards (`margin: -10px -6px`), so the first dot lands flush with the left edge of the cards and rows around it rather than 10px inside them. The 6px on each item is what keeps the 44pt targets from colliding, so neutralise it at the container — never delete it. Drop the component straight into the column with no wrapper padding; anything you add on the outside will push it off that edge again.
