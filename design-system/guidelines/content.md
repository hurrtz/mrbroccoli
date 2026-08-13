# Content

How Mr Broccoli writes. These rules apply to UI copy, settings summaries, warnings and spoken output alike.

**Plain and declarative.** Sentence case, full stops, no exclamation marks, no marketing language. The app states what a thing does and stops.

- "Provider keys, validation, and capabilities."
- "Input mode and speech-to-text routing."
- "Recognition runs on the device unless a provider is chosen."

**Settings summaries are noun phrases**, not sentences with verbs, and they end in a full stop: "Home cards, models, effort, and system prompt." A summary that starts "You can…" is wrong.

**Person.** The app addresses the user as *you* only where an action is being described ("Choose a language to improve recognition"). It never says *we*, and it never speaks as a character — despite the name, there is no broccoli persona in the copy.

**Titles are two or three words.** "Guided setup". "Runtime readiness". "Model Council". "Response style". Nouns, not questions.

**Numbers and units are exact.** "Up to 12 model calls per message with the current setup." "Version 3.2.0." "14.2 tok/s". The app never rounds a measured value into a vague adjective.

**Warnings state the cost, then let the user continue.** "More than 4 models or 3 rounds can take a long time, consume many tokens, and hit provider context or rate limits. This is a warning only." No scare styling, no blocking.

**Evidence before verdict.** On-device summaries read "Measured · Viable", never "Viable" alone — how the app knows comes first.

**Spoken replies are a separate register.** Text-to-speech output never uses markdown, bullets or headings. It is written to be read aloud: full sentences, paragraph breaks that make sense as pauses.

**No emoji.** Not in the UI, not in copy, not in release notes. Unicode is used only as punctuation: the middle dot `·` as a separator ("09.08.26 · 14:12", "Heart · American female") and the en dash in ranges ("0.42–0.58 RTF").

**Nineteen languages, including right-to-left.** English strings are the shortest of the set. Never build a layout that depends on an English string's length, and never truncate a label to make a row fit; the rows grow instead. Every new string needs a key in every locale file. Formatted values (times, counts) are composed by the formatter, not concatenated, so RTL locales can reorder them.

**Accessible name and visible state come from one value.** A component must never show "no messages" while announcing "12 messages". Derive the label and the text from a single source — this failure occurred three separate times during the system's own construction.

## Premium honesty

Premium unlocks bring-your-own-key routes; it includes no models, voices or credits. Detail copy (upgrade sheet, locked sections, the voice note after the intro’s play button) always states "your own key". Teaser copy (the gold band) may name capabilities without the caveat, because every teaser opens the sheet that carries it.

## Persona pronoun

Mr Broccoli is a "he", never an "it": "he listens", "he thinks", "he answers", "gets him thinking". Applies to every surface that speaks about the app — onboarding, banner, settings copy alike. The app still says "I" when speaking as itself.
