An integer setting — review rounds, retained turns, timeouts.

```jsx
<AntNumberInputRow label="Review rounds" value={rounds} onChange={setRounds} />
```

The field commits on blur and reverts to the last valid value; it never accepts a partial or non-integer entry.
