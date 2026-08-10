The container for a run of `AntPickerRow`s inside a full-bleed card.

```jsx
<AntPickerRows helperText="Recognition runs on the device unless a provider is chosen.">
  <AntPickerRow label="Provider" value={p} options={providers} onChange={setP} />
  <AntPickerRow label="Model" value={m} options={models} onChange={setM} />
</AntPickerRows>
```

It renders only its children — it draws no rows of its own.
