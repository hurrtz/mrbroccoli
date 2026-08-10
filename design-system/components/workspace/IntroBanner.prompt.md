The first-run invitation above the workspace.

```jsx
<IntroBanner title="New here?" body="A short introduction to voice-first answers." action="Start" onOpen={openIntro} />
```

## The dismiss control is earned, not given

`showDismiss` must stay `false` until the user has opened the intro at least once. On a first launch the banner is the only route into the six-step walkthrough, and a close button next to an offer the user has not yet read invites them to remove it unseen. Once they have opened it, the offer has been made and dismissing it is an informed choice.

```jsx
const [opened, setOpened] = useState(false);
<IntroBanner
  visible={banner}
  showDismiss={opened}
  onOpen={() => { openIntro(); setOpened(true); }}
  onDismiss={() => setBanner(false)}
/>
```

This holds in both variants. Do not hardcode `showDismiss` in one layout and gate it in another — the rule is about what the user has done, not about how much room the layout has.

`compact` collapses the card to a single 48pt row with the title centred, for landscape, where the full card would take nearly half the column. `body` and `action` are not shown in that variant — the whole row is the target — so keep the title able to stand alone.

This is the single exception to the one-accent rule: violet (#5B21B6), fixed in both appearances, because on a first launch it must not read as part of the furniture. Do not reuse the violet anywhere else, and do not add a second banner. Dismissal only appears once the intro has been opened at least once.
