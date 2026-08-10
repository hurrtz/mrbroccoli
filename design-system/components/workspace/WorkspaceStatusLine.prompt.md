The line beneath the orb that says what is happening and which conversation you are in.

```jsx
<WorkspaceStatusLine title="Tap to speak" detail="Tide tables · 12 messages · 2 min ago" onInfo={openDetails} />
<WorkspaceStatusLine title="Speaking" detail="Tap the orb to stop" phase="speaking" />
```

Keep `title` to what is happening and `detail` to context. At rest the detail carries the conversation name, message count and age; while a turn runs it carries the instruction for the current phase, because that is the moment a user needs telling what tapping will do.

The dot repeats the orb's phase colour so the pair reads as one statement. Both lines truncate rather than wrap.
