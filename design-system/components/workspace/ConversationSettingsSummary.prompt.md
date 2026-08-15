States the conversation's quick settings in one line, under the route byline, with a single control at the trailing edge to open the sheet that changes them.

```jsx
<ConversationSettingsSummary summary="Length: Brief · Tone: Balanced · Voice: Heart" onPress={openSheet} />
```

List every quick setting worth stating — don't trim to two or three for the sake of brevity. "Label: value" pairs joined by the standard separator dot, in the order the settings sheet lists them. Longer is fine: the line truncates at the end rather than wrapping, so a narrow screen or Slide Over width simply shows less; put whatever the user is most likely to have changed first so it survives the cut.

Prefer this over a row of chips. Chips have no container and read as scattered; one full line of muted text says the same thing and adds nothing to look at.
