The icon-only control: a fixed 44×44 target with a smaller glyph inside.

```jsx
<IconButton icon="setting" onClick={openSettings} accessibilityLabel="Settings" />
```

`active` gives it the accent-soft fill and accent hairline used for the current route. `accessibilityLabel` is required. Never shrink the target to fit the glyph.
