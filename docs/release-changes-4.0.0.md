# Mr Broccoli 4.0.0 — noteworthy changes since 3.2.0

This is the concise release handoff. `CHANGELOG.md` remains the complete
user-visible history; closely related implementation and test commits are
combined here into product-level changes.

## Major features

- **Universal iPhone and iPad experience.** Mr Broccoli now adapts one shared
  app across compact iPad windows and regular iPad layouts, adding persistent
  conversations, docked transcripts where space permits, master-detail
  Settings, rotation support, and a centred introduction card.
- **A voice-orb workspace built from the latest design system.** Home,
  conversations, transcripts, Settings, dialogs, sheets, notices, and controls
  now share the approved colors, typography, spacing, shapes, icons, and
  accessibility-sized targets.
- **Automatic on-device setup.** One flow measures the device, proposes a
  complete local thinking/listening/speaking profile, installs only after
  consent, survives navigation, resumes partial work, and keeps manual model
  choices available in their owning Settings pages.
- **A shorter three-step introduction.** A five-exchange localized conversation
  leads into a spoken example, automatic or manual setup, and an ephemeral live
  voice test that saves no conversation data. It works across screen sizes and
  themes, scrolls only where content requires it, and can always be closed.
- **Per-session conversation settings.** Length, tone, model instructions,
  speech instructions, and voice can override standard Settings defaults for
  one conversation and can be reset to inherit those defaults again.
- **Foreground session locks.** A conversation can require a password or
  supported device biometrics before opening. Locked content stays out of
  search and cross-session knowledge, and grants clear when the app backgrounds.
- **Live spoken-reply navigation and hands-free Drive Session.** Restart, Back,
  Forward, pause/resume, progress, and paragraph-aware seeking now work during
  speech. Drive Session adapts to ambient audio, detects when speech ends,
  counts down with a cue, and re-arms listening after the reply.

## Small features

- Grok 4.6 is available directly through xAI and through OpenRouter, including
  xAI's extra-high reasoning effort, and is the new default xAI route.
- The home model picker applies a tapped route immediately, iPhone Settings
  supports edge-swipe navigation in both text directions, and bottom sheets
  support a real pull-down gesture from a roomy labelled grabber.
- Conversation actions now open beside the selected session, automatic naming
  reports its result in the drawer, and the voice/text pager wraps in either
  swipe direction.
- The introduction's Setup and Try pages keep fixed actions while their content
  scrolls, the Try action mirrors the round home orb, and pausing speech changes
  the orb glyph to Play so the next action is unambiguous.
- Route-specific response style now remains binding for the turn, even when a
  broader assistant instruction asks for a conflicting style.

## Bugs

- Restored adaptive Drive Session endpointing, including repeated equal meter
  readings, changed ambient-noise floors, speech attack, the end-of-speech
  countdown and cue, continuous restart, and landscape transport visibility.
- Fixed iPhone Kokoro and Piper archive extraction, pronunciation-pack layout,
  failed-engine recovery, local voice initialization, and selected-voice
  fallback after a downloaded model is removed.
- Fixed Android local response-model loading, release-mode Kokoro startup,
  local-recognition WAV capture, automatic-setup retry selection, and accidental
  use of an unsuitable large speech model during one-tap setup.
- Fixed overlapping or frozen native surfaces by sequencing keyboard, sheet,
  Settings, transcript, archive, provider, Premium, and introduction dismissal
  through native modal boundaries.
- Fixed compact-phone lock setup under the iOS keyboard, missing password-field
  insets, accessibility-large home overlap, tall-screen control drift, landscape
  collisions, and the onboarding headline fade across Android, iPhone, and iPad.
- Fixed stalled hosted requests, local-transcription relative-time crashes,
  premature recording stops from orb taps, text-swipe keyboard activation,
  stale setup readiness, and local speech-profile recovery.

## Other improvements

- Interface copy across all 19 languages now uses Mr Broccoli's first-person
  voice, a consistent informal register, native idiom, and script-appropriate
  punctuation instead of literal English renderings.
- Bottom sheets use a fixed backdrop with a separately animated drawer,
  consistent centred headlines, and no redundant Done or close action. The
  voice orb merges identical rings into one continuous band without a seam.
- The transcript is a continuous readable script with consistent headings,
  message times, branch glyphs, details, metrics, and a matching peek label.
- Premium copy now states that models and voices use the buyer's provider keys
  and billing. Provider readiness, route prose, voice selection, storage,
  privacy, diagnostics, and setup status are clearer throughout Settings.
- Retired or redundant surfaces were removed: Mark as private, session Memory
  editing, conversation-integrity repair, the global status row and Current
  setup sheet, the old direct model switcher, and the separate Drive controls.
- Release fixtures now cover every supported locale, iPhone/iPad and Android
  phone/tablet class in light and dark appearance, with deterministic manifests,
  dimensions, opacity, hashes, duplicate detection, and review galleries.
