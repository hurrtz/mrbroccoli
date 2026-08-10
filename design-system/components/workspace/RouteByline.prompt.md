Who is answering the next turn, and at what effort — one line above the transcript.

```jsx
<RouteByline provider="anthropic" providerLabel="Anthropic" modelName="Claude Sonnet 4.5"
  effort="Medium" effortLevels={["Low","Medium","High"]} onPress={openRoutePicker} />
```

It is **not** a button: no fill, no border, no card. That is deliberate — a contained control here reads as a second CTA directly above the voice stage. The provider mark supplies the prominence and the closing hairline says the whole row is the target, not just the caret.

The dots are that model's **own** effort scale, so the count varies — four steps on GPT-5, three on Sonnet. A model with no effort control reads `Normal` with no dots; one dot would carry no information.

`switchable={false}` for a single configured model: the caret and the press target both go, and the row becomes a credit line rather than a dead control. Use `local` for on-device routes — they take the `cpu` glyph, never a provider mark or a letter fallback.
