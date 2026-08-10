`AntSettingsCard` + `AntPickerRows` in one — the usual shape of a routing group.

```jsx
<AntPickerSection title="Speech to text" helperText="Recognition runs on the device unless a provider is chosen.">
  <AntPickerRow label="Route" value={route} options={routes} onChange={setRoute} />
</AntPickerSection>
```
