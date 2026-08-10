States the conversation's quick settings in one line, under the route byline, with a single control to open the sheet that changes them.

```jsx
<ConversationSettingsSummary summary="Balanced · Brief · Heart" onPress={openSheet} />
```

Write the summary as noun phrases joined by middots, in the order the settings sheet lists them, with no trailing stop. It truncates rather than wrapping, so put the settings a user is most likely to have changed first.

Prefer this over a row of chips. Chips have no container and read as scattered; one line of muted text says the same thing and adds nothing to look at.
