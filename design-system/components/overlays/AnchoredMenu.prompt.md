Quick verbs from a kebab, anchored where the tap happened — the light alternative to a bottom sheet.

```jsx
<AnchoredMenu visible={!!target} onClose={close} style={{ top: anchorY, right: 12 }}
  groups={[
    [{ icon: "pushpin", label: "Pin", onPress: pin }, { icon: "inbox", label: "Archive", onPress: archive }],
    [{ icon: "edit", label: "Rename", onPress: openRename }],
    [{ icon: "delete", label: "Delete", danger: true, onPress: remove }],
  ]} />
```

Anatomy: 252pt panel, 44pt rows — label left in body type, glyph trailing — hairlines within a group, a 6px band between groups. The grouping is the hierarchy: order groups by frequency, keep Delete last and alone in danger ink. No backdrop dim; a transparent click-away layer closes it, and every item press closes it too.

Rules: menus carry quick verbs; bottom sheets stay reserved for configuration surfaces (conversation settings, route pickers). The caller owns placement via `style` — anchor to the pressed control, right-aligned to the screen edge in the drawer. First mount: the sessions drawer's ellipsis button (`guidelines/surfaces/chat.md`), replacing the retired ConversationActionSheet bottom sheet.
