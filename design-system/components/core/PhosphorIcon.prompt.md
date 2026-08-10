Every glyph in Mr Broccoli, addressed by a semantic name and a semantic size — the only icon boundary the app has.

```jsx
<PhosphorIcon name="mic" size="control" color="var(--mb-color-accent)" />
```

Sizes describe visual importance: `inline` 14, `compact` 16, `control` 20, `navigation` 24, `prominent` 28, `feature` 32, `hero` 40. Never pass a pixel number, and never let the glyph define the touch target — wrap it in `IconButton` (44×44) instead. Provider brand marks are the one exception; use `ProviderIcon`.

Requires the Phosphor webfont on the page: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css">`.
