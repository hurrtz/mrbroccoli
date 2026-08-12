window.MB_SETTINGS = {
  version: "3.2.0",
  // settings-core/readiness.ts: think, listen, speak, search — ready, attention, broken, off.
  readiness: { think: "ready", listen: "ready", speak: "attention", search: "off" },
  // 7 pages, 3 groups — no Device page: lifecycle lives in the stage pages, storage under Data & privacy.
  groups: [
    { title: "Conversation", pages: ["connections", "thinking", "search"] },
    { title: "Voice", pages: ["listening", "speaking"] },
    { title: "Privacy & app", pages: ["data", "app"] },
  ],
  // Overview rows report LIVE STATE, not page descriptions.
  rows: {
    connections: { icon: "key", title: "Connections", premium: true, state: "OpenAI, Anthropic working · Mistral failing" },
    thinking: { icon: "robot", title: "Thinking", premium: true, state: "GPT-5 · Claude Sonnet 4.5 · Qwen on device" },
    search: { icon: "search", title: "Search", premium: true, state: "OpenAI · 5 results per query" },
    listening: { icon: "audio", title: "Listening", premium: true, state: "Push to talk · Whisper Small on device" },
    speaking: { icon: "sound", title: "Speaking", premium: true, state: "Kokoro · Heart · as it arrives" },
    data: { icon: "safety-certificate", title: "Data & privacy", state: "Knowledge on · 2.8 GB in models" },
    app: { icon: "sliders", title: "App & diagnostics", state: "Dark · English" },
  },
  // Free-edition live state (same pages, different contents).
  freeRows: {
    connections: { state: "Part of Premium" },
    thinking: { state: "Qwen on device" },
    search: { state: "Part of Premium" },
    listening: { state: "Push to talk · Whisper Small on device" },
    speaking: { state: "Kokoro · Heart · as it arrives" },
  },
  // Connected providers only — unconnected ones never appear in stage pickers.
  providers: [
    { id: "openai", label: "OpenAI", health: "healthy", capabilities: "Replies · listening · speaking · search" },
    { id: "anthropic", label: "Anthropic", health: "healthy", capabilities: "Replies" },
    { id: "elevenlabs", label: "ElevenLabs", health: "none", capabilities: "Speaking · voice library" },
    { id: "mistral", label: "Mistral AI", health: "failing", capabilities: "Replies" },
    { id: "groq", label: "Groq", health: "configured", capabilities: "Replies · listening" },
  ],
  // Thinking slots (response modes): coexisting, switched from the home byline.
  slots: [
    { n: 1, name: "GPT-5", meta: "OpenAI · via provider · effort Extra high" },
    { n: 2, name: "Claude Sonnet 4.5", meta: "Anthropic · via provider · effort Medium" },
    { n: 3, name: "Qwen 2.5 1.5B", meta: "On this device · 934 MB · effort Normal" },
  ],
  // On-device model catalogue with every lifecycle state.
  listenModels: [
    { id: "sys", route: true, label: "System recognition", meta: "The phone transcribes · on-device when the system offers it" },
    { id: "whisper", label: "Whisper Small · on this device", meta: "Tested · viable · 466 MB · update available", selected: true, action: "update" },
    { id: "whisper-xl", label: "Whisper Large v3 Turbo · on this device", meta: "Downloading · 62% of 1.6 GB", disabled: true, action: "cancel" },
    { id: "moonshine", label: "Moonshine Tiny · on this device", meta: "Installed · not tested yet", disabled: true, action: "test" },
    { id: "vosk", label: "Vosk Small · on this device", meta: "Testing on this phone…", disabled: true, action: "testing" },
    { id: "nemo", label: "Nemo Parakeet · on this device", meta: "Tested · below target on this phone — not selectable", disabled: true, action: "retest" },
    { id: "turbo-xl", label: "Whisper Turbo XL · on this device", meta: "Not installed · 2.4 GB", disabled: true, action: "download" },
    { id: "openai-stt", label: "OpenAI · whisper-1", meta: "Via provider · your key" },
  ],
  speakModels: [
    { id: "sys", label: "System voice", meta: "The phone's own voices · no download, no cost" },
    { id: "kokoro", label: "Kokoro 82M · on this device", meta: "Installed · 312 MB · no audio leaves the phone", selected: true, voice: "Heart" },
    { id: "piper", label: "Piper · Thorsten · on this device", meta: "Not installed · 76 MB", disabled: true, action: "download" },
    { id: "elevenlabs", label: "ElevenLabs", meta: "Via provider · your key · model and voice chosen when selected", providerOnly: true },
  ],
  voices: [
    { n: "Heart", d: "American · female", on: true }, { n: "Bella", d: "American · female" }, { n: "Puck", d: "American · male" },
    { n: "River", d: "British · female" }, { n: "Fable", d: "British · male" }, { n: "Nicole", d: "Australian · female" },
    { n: "Thorsten", d: "German · male" }, { n: "Amélie", d: "French · female" },
  ],
  storage: [
    { name: "Qwen 2.5 1.5B", cap: "Thinking", size: "934 MB", state: "installed" },
    { name: "Whisper Small", cap: "Listening", size: "466 MB", state: "installed" },
    { name: "Whisper Large v3 Turbo", cap: "Listening", size: "1.6 GB · 62%", state: "downloading" },
    { name: "Kokoro 82M", cap: "Speaking", size: "312 MB", state: "installed" },
  ],
  speechActivity: [
    { at: "14:12:08", route: "OpenAI · whisper-1", detail: "Transcribed 4.2 s in 610 ms" },
    { at: "14:12:14", route: "On device · Kokoro", detail: "Synthesised 3 paragraphs" },
    { at: "13:58:41", route: "System recognition", detail: "Cancelled before capture" },
  ],
};
