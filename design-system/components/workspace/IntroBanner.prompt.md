The first-run invitation above the workspace — the route into the introduction.

```jsx
<IntroBanner onOpen={openIntro} />
```

Listen-first anatomy: a plain play glyph in a hairline circle (promising the walkthrough is spoken), setup-focused copy in the persona voice — Mr Broccoli is a "he", never an "it" (the defaults are the canonical strings; override only to translate), a slow sheen, and a trailing chevron. The whole banner is one pressable; the play circle is drawn, not a separate target.

Rules: violet in both appearances — the one surface that never follows the theme; while it is visible the orb steps down from 196 to 156; `compact` collapses it to a 48pt row in landscape. Withhold the dismiss control until the user has opened the intro at least once:

```jsx
const [opened, setOpened] = useState(false);
<IntroBanner
  visible={banner}
  showDismiss={opened}
  onOpen={() => { setOpened(true); openIntro(); }}
  onDismiss={() => setBanner(false)}
/>
```

The sheen is shared vocabulary with `PremiumBand` — the product's two invitation surfaces; nothing else animates as ornament.
