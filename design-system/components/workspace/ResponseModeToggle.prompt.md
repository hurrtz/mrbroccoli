The model cards above the transcript — each one a route the next answer can take.

```jsx
<ResponseModeToggle selected={mode} onSelect={setMode} detailed modes={[
  { id: "a", provider: "openai", providerLabel: "OpenAI", modelLabel: "GPT-5", effortLabel: "Medium" },
  { id: "b", provider: "anthropic", providerLabel: "Anthropic", modelLabel: "Claude Sonnet 4.5", effortLabel: "High" },
]} />
```

The selected card is the only accent-filled control on the workspace. `detailed` adds the provider family and effort line; `compact` stacks the cards. A single card renders as a static summary — there is nothing to switch to.
