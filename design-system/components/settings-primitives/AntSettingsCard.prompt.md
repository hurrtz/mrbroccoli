The card every settings group lives in.

```jsx
<AntSettingsCard title="Voice replies">
  <AntSwitchRow label="Speak answers" description="Replies are read aloud paragraph by paragraph." value={on} onChange={setOn} />
</AntSettingsCard>
```

Use `fullBleed` when the content is rows that should run edge to edge (radio lists, picker rows). `headerExtra` holds the info button.
