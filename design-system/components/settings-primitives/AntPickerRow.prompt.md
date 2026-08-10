The settings picker: a label, the current value, and a caret that opens a modal list.

```jsx
<AntPickerRow label="Provider" value={provider} onChange={setProvider}
  options={[{ value: "openai", label: "OpenAI" }, { value: "anthropic", label: "Anthropic" }]} />
```

With a single option the row becomes static — no caret, no modal. Use `standalone` outside `AntPickerRows`.
