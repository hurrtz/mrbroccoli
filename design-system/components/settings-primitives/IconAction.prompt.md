The single state-driven action at a model row's edge — a bordered 36pt squircle in a 44pt target.

```jsx
<IconAction icon="download" label="Download Piper" onPress={download} />
<IconAction icon="close" label="Cancel download" danger onPress={cancel} />
<IconAction icon="egg" label="Test Moonshine Tiny" onPress={test} />
<IconAction icon="loading" label="Testing" spin />
```

One per row, chosen by state: download → cancel (danger) → egg to test → cracked egg to retest after a failure → reload when an update exists. Never stack several; removal is a swipe, not a button.
