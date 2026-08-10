window.MB_SETTINGS = {
  version: "3.2.0",
  // settings-core/readiness.ts: think, listen, speak, search — ready, attention, broken, off.
  readiness: { think: "ready", listen: "ready", speak: "attention", search: "off" },
  groups: [
    { title: "Conversation & tools", pages: ["connections", "thinking", "search"] },
    { title: "Voice & models", pages: ["listening", "speaking", "local"] },
    { title: "Privacy & app", pages: ["data", "app"] },
  ],
  // Order, icons and summaries are the overviewRows table in AntSettingsOverview.tsx.
  rows: {
    connections: { icon: "key", title: "Connections", summary: "Provider keys, validation, and capabilities.", premium: true },
    thinking: { icon: "robot", title: "Thinking", summary: "Home cards, models, effort, and system prompt.", premium: true },
    listening: { icon: "audio", title: "Listening", summary: "Input mode and speech-to-text routing.", premium: true },
    speaking: { icon: "sound", title: "Speaking", summary: "Spoken replies, playback, voices, and previews.", premium: true },
    local: { icon: "cpu", title: "On-device AI", summary: "Models that run without a network connection." },
    search: { icon: "search", title: "Search", summary: "Web search provider and search quality controls.", premium: true },
    data: { icon: "safety-certificate", title: "Data & privacy", summary: "Backups, archives, and past conversation knowledge." },
    app: { icon: "sliders", title: "App & diagnostics", summary: "Theme, language, usage, debug logs, and recent activity." },
  },
  providers: [
    { id: "openai", label: "OpenAI", health: "healthy", capabilities: ["LLM", "STT", "TTS"] },
    { id: "anthropic", label: "Anthropic", health: "configured", capabilities: ["LLM"] },
    { id: "elevenlabs", label: "ElevenLabs", health: "none", capabilities: ["TTS", "Voice library"] },
    { id: "mistral", label: "Mistral AI", health: "failing", capabilities: ["LLM"] },
    { id: "groq", label: "Groq", health: "healthy", capabilities: ["LLM", "STT"] },
  ],
  // getProviderLlmModelOptions shape: the models each connected provider offers.
  providerModels: {
    OpenAI: ["GPT-5", "GPT-5 mini", "o4-mini"],
    Anthropic: ["Claude Sonnet 4.5", "Claude Opus 4.1", "Claude Haiku 4"],
    "Mistral AI": ["Mistral Large", "Mistral Small 3"],
    Groq: ["llama-3.3-70b", "llama-3.1-8b"],
    "On device": ["Qwen 2.5 1.5B", "Llama 3.2 1B"],
  },
  sttModels: { OpenAI: ["whisper-1", "gpt-4o-transcribe"], Groq: ["whisper-large-v3"] },
  ttsModels: { ElevenLabs: ["eleven_turbo_v2_5", "eleven_multilingual_v2"], OpenAI: ["gpt-4o-mini-tts"] },
  responseModes: [
    { id: 1, provider: "openai", providerLabel: "OpenAI", model: "GPT-5", effort: "Extra high" },
    { id: 2, provider: "anthropic", providerLabel: "Anthropic", model: "Claude Sonnet 4.5", effort: "Medium" },
    { id: 3, local: true, providerLabel: "On device", model: "Qwen 2.5 1.5B", effort: "Normal" },
  ],
  localModels: [
    { id: "qwen", name: "Qwen 2.5 1.5B", capability: "Replies", size: "934 MB", state: "installed" },
    { id: "whisper", name: "Whisper Small", capability: "Speech input", size: "466 MB", state: "installed" },
    { id: "kokoro", name: "Kokoro 82M", capability: "Voice output", size: "312 MB", state: "available" },
  ],
  speechActivity: [
    { at: "14:12:08", route: "OpenAI · whisper-1", detail: "Transcribed 4.2 s in 610 ms" },
    { at: "14:12:14", route: "On device · Kokoro", detail: "Synthesised 3 paragraphs" },
    { at: "13:58:41", route: "System recognition", detail: "Cancelled before capture" },
  ],
};
