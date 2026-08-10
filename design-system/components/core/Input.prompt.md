The single-line field: hairline border, surface fill, 46pt tall.

```jsx
<Input type="password" value={key} onChange={setKey} placeholder="sk-…" allowClear
  suffix={<IconButton icon="eye" accessibilityLabel="Show key" onClick={reveal} />} />
```

`type="password"` is the provider-key case. `suffix` is a 44×44 slot — put an `IconButton` there, not a bare glyph. For multi-line use `TextArea`.
