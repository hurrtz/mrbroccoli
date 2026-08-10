A settings card that collapses — provider connection panels, Kokoro voice groups.

```jsx
<AntDisclosureCard expanded={open} onToggle={toggle} toggleAccessibilityLabel="Show OpenAI settings"
  header={<strong>OpenAI</strong>}>
  <Input type="password" value={key} onChange={setKey} />
</AntDisclosureCard>
```

Both the header area and the caret toggle it; the caret is a separate 44pt target so a screen reader has one labelled control.
