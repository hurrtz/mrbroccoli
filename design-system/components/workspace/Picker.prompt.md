The workspace dropdown — heavier than `AntPickerRow`, used where a choice is the point of the surface (voice, language, model).

```jsx
<Picker label="Voice" value={voice} options={voices} onChange={setVoice} dropdownLabel="Selection" />
```

Two labels: the uppercase mono control label above the control, and a smaller one inside it above the value. The caret sits in an accent-soft well, the one place a round shape appears.
