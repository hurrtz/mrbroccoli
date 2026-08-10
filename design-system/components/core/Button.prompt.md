The shared action control — use it for every button that carries a text label.

```jsx
<Button type="primary" onClick={preview}>
  <AntButtonLabel color="var(--mb-color-on-active-control)" icon="sound" label="Preview voice" />
</Button>
```

`Button` does not style its children. Put an `AntButtonLabel` inside for icon + text, or a bare `PhosphorIcon` for an icon-only action, and pick the label colour to match the surface: `--mb-color-on-active-control` on `primary`, `--mb-color-accent` on `ghost`, `--mb-color-on-danger` on `warning`.

Variants: `type` ghost / primary / warning, `size` small (40pt) / large, plus `loading` and `disabled`. Minimum height is 44pt; do not override it.
