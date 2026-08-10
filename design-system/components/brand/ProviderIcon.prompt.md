The official provider brand marks — the only icons in the app that are not Phosphor glyphs.

```jsx
<ProviderIcon provider="anthropic" size="feature" color="var(--mb-color-text-secondary)" assetBase="../../assets/providers" />
```

Marks ship for the eleven routed providers (OpenAI, Anthropic, Gemini / Vertex, Mistral, DeepSeek, xAI, OpenRouter, ElevenLabs, Alibaba Qwen). Anything else falls back to two letters — never draw a replacement mark. `assetBase` must point at `assets/providers` relative to the page. The full set of 47 marks lives there; add an id to `PROVIDER_ASSETS` to route one.
