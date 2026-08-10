The contents of a `Button` — an icon and a label, in the body-medium face.

```jsx
<Button type="primary" onClick={save}>
  <AntButtonLabel color="var(--mb-color-on-active-control)" icon="check" label="Save key" />
</Button>
```

Choose `color` to match the surface you sit on. This component exists because `Button` deliberately does not style its children.
