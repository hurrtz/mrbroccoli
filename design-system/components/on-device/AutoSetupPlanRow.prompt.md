One line of an automatic on-device selection: the job, then the model chosen
for it.

```jsx
<AutoSetupPlanRow role="listen" roleLabel="Listening" name="Whisper Small" size="466 MB"
  evidence="Calibrated" fit="Likely" details={["0.42–0.58 RTF"]} />
<AutoSetupPlanRow role="think" roleLabel="Thinking" name="Qwen 2.5 1.5B" size="934 MB"
  state="done" note="Installed and selected." />
```

The role reads before the model name. Someone accepting an automatic choice is
agreeing that a job will be covered, not picking a product. Use `note` for any
state where a performance verdict is not yet true — downloading, failed,
skipped.
