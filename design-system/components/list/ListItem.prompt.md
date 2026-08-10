One list row: 46pt minimum, thumb / content / extra.

```jsx
<ListItem thumb={<PhosphorIcon name="key" />} extra="OpenAI" onClick={open}>
  Provider
  <ListItem.Brief>Stored in the device keychain.</ListItem.Brief>
</ListItem>
```

The secondary line is `ListItem.Brief` (or the `brief` prop). A row without `onClick` renders as static content with no press feedback.
