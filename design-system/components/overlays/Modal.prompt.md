Every dialog and bottom sheet in the app.

```jsx
<Modal visible={open} title="Delete conversation?" onClose={close}
  footer={[{ text: "Cancel", onPress: close }, { text: "Delete", onPress: remove, tone: "success" }]}>
  <p>This removes the conversation and its attachments from this device.</p>
</Modal>
```

`layout="sheet"` is for surfaces that want full width and want the page behind them partly visible — it pins to the bottom edge, caps at 85% height and rounds only the top corners. The default `"dialog"` centres a card capped at 560pt. Footer actions never leave the screen: the body scrolls first.
