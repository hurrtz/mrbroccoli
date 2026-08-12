window.MB_DATA = {
  modes: [
    { id: "fast", provider: "openai", providerLabel: "OpenAI", modelLabel: "GPT-5 mini", effortLabel: "Low", effortLevels: ["Minimal", "Low", "Medium", "High"] },
    { id: "deep", provider: "anthropic", providerLabel: "Anthropic", modelLabel: "Claude Sonnet 4.5", effortLabel: "Medium", effortLevels: ["Low", "Medium", "High"] },
    { id: "local", local: true, providerLabel: "On device", modelLabel: "On device · Qwen 2.5 1.5B", effortLabel: "Normal", effortLevels: [] },
  ],
  conversations: [
    { id: "c1", title: "Tide tables", models: [{ provider: "anthropic" }], messageCount: 12, updatedAt: "09.08.26", pinned: true },
    { id: "c2", title: "Sourdough timing", models: [{ provider: "openai" }], messageCount: 6, updatedAt: "08.08.26" },
    { id: "b1", title: "Rye experiment", forkOf: "Sourdough timing", models: [{ provider: "openai" }], messageCount: 3, updatedAt: "08.08.26" },
    { id: "c3", title: "Insurance letter", models: [{ provider: "mistral" }], messageCount: 7, updatedAt: "06.08.26", isPrivate: true },
    { id: "c4", title: "Portuguese phrases", models: [{ provider: "gemini" }], messageCount: 21, updatedAt: "04.08.26" },
    { id: "a1", title: "Flat hunt 2025", archived: true, models: [{ provider: "anthropic" }], messageCount: 88, updatedAt: "12.11.25" },
  ],
  messages: [
    { id: "m1", role: "user", timestamp: "09.08.26 · 14:11", text: "When does the tide turn in Lisbon today?" },
    { id: "m2", role: "assistant", provider: "anthropic", model: "Claude Sonnet 4.5", timestamp: "09.08.26 · 14:12", text: "High water is at 15:40 today. After that the tide turns roughly every six hours, so the next low water is a little before ten in the evening." },
  ],
  reply: "The forecast holds until Tuesday. Wind stays under twelve knots from the north-west, and there is no rain in the model runs I can see.",
  sections: [
    { id: "connections", icon: "key", title: "Connections", summary: "Provider keys, validation, and capabilities." },
    { id: "thinking", icon: "robot", title: "Thinking", summary: "Home cards, models, effort, and system prompt." },
    { id: "listening", icon: "mic", title: "Listening", summary: "Input mode and speech-to-text routing." },
    { id: "speaking", icon: "sound", title: "Speaking", summary: "Spoken replies, playback, voices, and previews." },
    { id: "search", icon: "global", title: "Search", summary: "Web search provider and search quality controls." },
    { id: "app", icon: "setting", title: "App & diagnostics", summary: "Theme, language, usage, debug logs, and recent activity." },
  ],
  providers: [
    { id: "openai", label: "OpenAI", connected: true, capabilities: ["Reply", "Speech to text", "Text to speech"] },
    { id: "anthropic", label: "Anthropic", connected: true, capabilities: ["Reply"] },
    { id: "elevenlabs", label: "ElevenLabs", connected: false, capabilities: ["Text to speech"] },
    { id: "mistral", label: "Mistral", connected: false, capabilities: ["Reply"] },
  ],
};
