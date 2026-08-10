A labelled boolean inside a settings card.

```jsx
<AntSwitchRow label="Keep conversations on device" description="Nothing is uploaded when this is on." value={local} onChange={setLocal} />
```

The row is 58pt so the description can wrap in longer languages. The switch itself is the only accent-filled control in a quiet card.
