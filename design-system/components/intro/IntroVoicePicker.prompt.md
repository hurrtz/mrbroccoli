Lets someone hear the app speak, in any of the nineteen interface languages, before they set anything up. It sits inside the introduction's speech step, directly under the claim it is evidence for.

```jsx
<IntroVoicePicker value={language} onChange={setLanguage} playing={playing} onTogglePlay={toggle} />
```

The selected language fills edge to edge in sand rather than carrying a checkmark alone — a filled row is readable at a glance, a marked one is not. Sand is deliberately not the green accent: green means "the thing to press next", sand means "the thing you picked".

Clips ship with the app, so this works offline and on first launch. Nothing autoplays; a voice starting by itself is startling.
