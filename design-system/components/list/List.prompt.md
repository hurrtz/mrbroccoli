The container half of the list primitive. It draws nothing on its own — fill it with `ListItem`.

```jsx
<List>
  <ListItem extra={<PhosphorIcon name="right" size="compact" color="var(--mb-color-text-muted)" />} onClick={open}>
    Connections
    <ListItem.Brief>Provider keys, validation, and capabilities.</ListItem.Brief>
  </ListItem>
</List>
```
