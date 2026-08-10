A card of mutually exclusive rows — theme, input mode, response style.

```jsx
<AntRadioSection label="Theme" value={theme} onChange={setTheme}
  options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }, { value: "system", label: "System" }]} />
```

Option descriptions do not sit under the rows; they belong in the card's info modal, reached through `headerExtra`.
