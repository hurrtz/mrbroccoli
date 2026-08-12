One 52pt settings row inside a `SettingsGroup`.

```jsx
<SettingsRow icon="eye" label="Theme" value="Dark" onPress={openThemeSheet} />
<SettingsRow icon="info-circle" label="Introduction banner" control={<NativeSwitch />} />
<SettingsRow icon="delete" label="Clear speech replay cache" danger control={null} last />
```

Icon, label, current value, then either a drill-in chevron (default), a control, or nothing (`control={null}`). Options with more than three choices open a sheet; two-to-three-way choices may render as a value the sheet cycles. Danger rows carry no chevron; accent is for additive rows.
