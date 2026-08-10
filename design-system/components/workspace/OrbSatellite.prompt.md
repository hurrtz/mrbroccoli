The small labelled controls that sit under the orb — attach an image, and the two per-question switches.

```jsx
<OrbSatellite icon="image" label="Image" accessibilityLabel="Add image" onPress={attach} />
<OrbSatellite icon="council" label="Council" kind="toggle" active={council} onPress={toggleCouncil} />
```

Use `kind="toggle"` for anything that stays on: it gains a round well that tints with the accent. Momentary actions stay borderless so the two read as different kinds of thing at a glance.

The label is always neutral, in both states — the well carries the state. Keep it to one or two words; it sits under a 44pt target and has to hold in nineteen languages.
