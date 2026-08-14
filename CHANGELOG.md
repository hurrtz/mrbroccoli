# Changelog

This file records user-visible changes to Mr Broccoli.

Each released version also includes localized store notes. These summaries are
kept within Google Play's 500-character limit per language and can also be used
for Apple's **What's New in This Version** field. Beginning with version 2.5.3,
the complete Play Store translations are kept in a dedicated file under
`docs/`.

## Unreleased

- The transcript sheet now uses one continuous canvas color and the approved
  18-point gutter instead of nesting the script inside a differently colored,
  dialog-padded rectangle; only expanded turn metrics lift onto a surface.
- The transcript's speaker thread line draws at its intended one-and-a-half
  point weight instead of a hairline that vanished against the canvas.
- Bottom sheets can now actually be pulled closed: a downward drag from the
  grabber band follows the finger and releases into a dismiss or a spring
  back, on the transcript, route picker, image source, and Premium sheets
  alike. Taps and the content's own scrolling are unaffected.
- The conversations drawer's header controls keep the approved 14-point
  separation and the docked search keeps its 26-point bottom clearance on
  devices without a gesture bar.
- The "Review conversation integrity" feature has been removed: the action
  sheet entry, the inspection and repair flow, and its stored repair
  snapshots are gone.
- The session Memory feature has been removed: the action-sheet entry and
  the modal for viewing, editing, copying, or clearing a conversation's
  compact summary are gone. The summary itself remains an internal detail
  of how long threads stay within a model's context window.
- The home screen drops the status row between the shortcut buttons and the
  transcript peek, along with the "Current setup" sheet its info control
  opened: the orb already states the phase, the transcript handle names the
  latest model and age, and Settings lists the routes. Screen readers still
  hear every phase change announced.
- The voice/text pager is now a full circle: swiping in either direction — or
  tapping either chevron — always moves to the other input surface, so a swipe
  is never a dead end.
- Automatic naming's success and failure messages now appear inside the
  conversations drawer where the action was taken; they were previously
  held behind the drawer until it closed, which made a failed naming —
  for example on a route out of credits — look like nothing happened.
- Fixed the session details, conversation settings, and voice picker scrims
  using a fixed light dimming color instead of the theme's overlay, so they
  now match every other modal in both light and dark appearance.
- The composer's send arrow now uses the white on-accent ink from the design
  system instead of near-black, and the text field grows to 116 points before
  scrolling.
- The empty transcript now shows the conversation glyph in a quiet circle with
  the design system's type sizes, and turn metrics align to the standard label
  column.
- The home screen's setup notice no longer draws a red border around its
  invitation; the warning glyph alone carries the tone. Settings rows dim while
  pressed, the sessions search field matches the standard input shape, the
  background install row tints its border and finished states from its tone,
  and toast tints follow the design system's strengths in both appearances.
- The introduction banner is now the approved violet gradient row: a play
  glyph in a hairline circle announces the spoken walkthrough, setup-focused
  copy replaces "New here?", a quiet chevron replaces the white action pill,
  and the slow sheen it shares with the Premium band invites without shouting.
- Drive Session's three-button row is now Repeat plus one fixed-position
  Pause/Resume toggle whose green fill means the loop is live, and the silence
  countdown appears on screen as a "Sends in N…" chip above it.

- Settings route pickers now set prose about a route in the reading face and
  keep the mono face for machine facts, the "Nobody" web-search route
  describes what it actually does, the Thinking page's Premium bands carry
  short copy about their own sections, and provider health chips use the
  design system's flat rectangular shape.
- In landscape, a setup notice no longer paints its full paragraph over the
  status line and shortcut ring; the left pane always shows the compact
  single-row action, with the complete message kept for screen readers.
- Conversation forks now use a splitting-paths glyph everywhere instead of
  the developer-flavored git-branch symbol.
- The walkthrough's back and close controls are now bare glyphs on their
  44-point targets — no filled circles — and back is a full arrow.
- The welcome step's headline is simply "Welcome" — the dialogue introduces
  the name — and its conversation now sinks to rest just above the play
  button, with earlier turns emerging from a blur where the platform draws
  it. Screen readers hear only the crisp question, the play button, and the
  language switch.
- The walkthrough's manual setup now shows the recommended on-device models
  inline with their real install and test state, so every route is judgeable
  at a glance; "More models…" is the only hand-off to a settings page.
- Mr Broccoli is "he" everywhere copy speaks about him — the walkthrough no
  longer slips into "it" in English or German — and the background install
  bar's action says it opens the automatic setup, not a retired page.
- The transcript sheet is now the handle pulled up: its only chrome is the
  grabber, which is the labeled close action — the status line already
  carries the conversation's name. Message headers show the time alone;
  the drawer row owns the date.
- The Premium purchase sheet now states the whole honesty rule: models and
  voices run on your own keys, billed by your providers, and none are
  included in the purchase.
- The voice orb steps down a size while the setup banner is on screen instead
  of squeezing the rest of the home screen.
- The Settings overview's Connections summary names at most two providers and
  counts the rest ("+2") instead of truncating a third name mid-word.
- The session actions sheet is now one grouped card with hairline dividers
  instead of an outlined card per action, and forked sessions gain a
  "Show root conversation" action that jumps to the original session.
- Copy no longer references the retired "On-device AI" page: the setup note
  points at Settings, and on-device model rows drop the "· On-device AI"
  suffix since their meta line already says where they run. The system
  recognition route describes itself in one sentence, reply-playback options
  read in sentence case, echoed voice names are capitalized, and a speech
  route that cannot take delivery instructions explains that in one line
  instead of showing a dead text box.

### Changed

- The introduction is now three steps instead of seven: a welcome where a
  stored dialogue is answered by the localized recording in your language, one
  setup screen with a single automatic path and an optional manual catalogue,
  and a live hold-to-talk test of your own setup whose reply is spoken back
  with its response time — nothing from the test is saved. On a first run the
  walkthrough completes before it can be closed; reopening it later is
  unrestricted.
- Fixed successful local transcription crashing the iOS Release app when its
  JavaScript runtime does not provide relative-time formatting.
- Fixed provider connection sheets occasionally freezing while returning to
  Settings by sequencing iOS keyboard and sheet dismissal.
- Fixed the iOS home screen overlapping its blocked-route warning, status,
  voice controls, and transcript at accessibility-large text sizes.

### Added

- Automatic on-device setup: one tap measures what your phone can run, shows
  the models it would install — one to think, one to listen, one to speak —
  and downloads only after you have seen the list. The install keeps running
  if you leave the screen, a quiet row on the home screen leads back to it,
  and a failure keeps everything that finished so retrying resumes instead of
  starting over. The introduction gains this as its own step.
- The Premium settings overview shows at a glance whether the app can think,
  listen, speak, and search: four dots with their state, each opening the
  setting behind it.

### Changed

- Thinking, Listening, Speaking, Search, and Connections now use the approved
  job-first headings and guidance throughout Settings, including an explicit
  device-keychain boundary for provider credentials and accurate home-route
  wording for answering models.
- The introduction now uses full 44-point header and picker controls, marks
  automatic setup as Recommended, and contracts its invitation to a stable
  title-only row in landscape. Setup completion and failure stay reachable in
  the home task row, transient notices wait behind open sheets, Premium uses
  its gold treatment consistently, and speech or search fallbacks remain with
  the reply they affected instead of appearing again as global alerts.
- Image source choice, provider-sharing consent, and Model Council cost
  warnings now use app-owned sheets and dialogs. Local-model and speech-cache
  outcomes remain on their owning Settings rows, transcript branching starts
  directly, and modal backdrops stay out of screen-reader navigation while
  every modal retains an explicit close action.

- Sessions now use a flat, recency-first drawer with collapsible Pinned,
  Earlier, and Archived groups, a bottom search field, compact provider marks,
  root-session links for forks, and one action sheet for naming, pinning,
  privacy, memory, integrity, sharing, archiving, and deletion. The transcript
  now reads as a continuous script instead of stacked cards: saved messages
  open folded, a newly arriving message opens in place, details and actions
  expand on demand, and a swipe can remove an individual message.
- The home screen is rebuilt around a central voice orb. Two rings show the
  current phase and the whole turn against its estimate — running late fills
  them red — and the orb sizes itself to the space the screen leaves it. The
  model switcher becomes one quiet line naming who answers next, opening a
  sheet to change it; your conversation's style reads as a line of text with
  one control; image, Model Council, and Web Search sit as small labelled
  controls under the orb; and the transcript peeks above the bottom edge,
  opening as a sheet over the workspace with a single compact header. Model
  and conversation ages now stay visible in the quiet status areas, and the
  conversation line includes its voice. In landscape the transcript stays
  beside the orb while portrait-only image and conversation controls stay out
  of the constrained pane.

- The voice pipeline's phase colours follow the approved design system's new
  ramp: green at recording and speaking, travelling through teal and blue to
  violet at the deepest thinking and back, with a set tuned separately for
  each appearance.
- Home always opens on the voice orb. Text remains one deliberate swipe or
  page-control away, while a blocked route gives a direct On-device settings
  notice instead of turning the orb into an older CTA or opening the
  introduction. The Free edition label and the empty credential card are no
  longer shown above the model byline.
- Voice-orb progress rings now interpolate on the native animation thread, so
  recording, turn estimates, and late red tails stay smooth while answers
  stream in.
- The portrait home stage now gives the voice orb its full approved size, with
  visible left/right input chevrons and a stable Image, Model Council, and Web
  Search row beneath it. On-device model catalogues now collapse their local
  responses, recognition, and voices sections until needed, keeping the page
  compact while automatically opening the section that owns an active download.
- The settings overview adopts the approved green on-device and gold Premium
  card treatments.
- Settings now presents the same seven-section map to Free and Premium users,
  with live state beneath every row. Listening uses compact input and language
  sheets plus one system/local/provider route list; Free users can choose usable
  on-device recognition while provider routes remain visibly locked.
- Thinking now uses four numbered answering-model slots with focused provider,
  model, and effort sheets. Local response models download, test, select, and
  swipe-remove in that page; Model Council and the system prompt move into
  quiet sheets. The retired On-device page is gone: setup lives under App &
  diagnostics, speech models live under Listening and Speaking, and storage
  cleanup lives under Data & privacy. Free local choices become active only as
  a complete installed and tested profile, preventing Settings from claiming a
  route is in use while the runtime remains blocked.
- Connections now uses one manifest-ordered provider list with capability and
  health summaries, opening credentials and tests in a focused sheet. Search
  uses a clear Nobody route followed by provider routes and shows quality
  controls only for the active provider; both pages preserve the same structure
  in Free while cloud routes remain visibly locked.
- Speaking now follows the same single-route design: playback and delivery
  instructions lead into one System, downloaded, or provider voice list.
  Download and device-test actions stay beside local voices, selected routes
  expose a searchable voice sheet with exact-voice previews, and replay-cache
  cleanup lives in its own Storage group. Free keeps the same page with cloud
  voices visibly locked, and old text-only settings migrate to an active speech
  route.
- Data & privacy now follows the approved grouped layout for conversation
  knowledge, archived conversations, backup and restore, and downloaded-model
  storage. App & diagnostics now brings automatic setup, appearance, home-screen
  switches, speech diagnostics, and runtime compatibility into the same compact
  row-and-sheet vocabulary.

### Fixed

- Keep compatible downloaded speech models visible when the system recognizer
  cannot report its own on-device eligibility, and show only the speech route
  the app will actually use in Free mode.

- Open conversation or Speaking settings from the transcript without freezing
  iPhone: the transcript sheet now finishes dismissing before the next settings
  surface is presented.
- Open Archived conversations from Data & privacy without freezing iPhone: the
  archive sheet and Settings now finish dismissing in order before the sessions
  drawer opens with Archived expanded.
- Make Tap to Speak and Drive Session treat an orb tap as one toggle instead of
  immediately stopping the recording as a too-short hold. Swiping from the orb
  to the message field also leaves the keyboard closed until the field is
  deliberately focused.
- Stop a hosted response request that returns no activity for five minutes,
  instead of leaving the turn waiting for the longer streaming-inactivity
  window. Once a slow response starts streaming, its existing longer window is
  preserved.
- Let the downloaded Kristin and Norman Piper voices initialize against their
  verified libphonemize packs. Native build verification now rejects an older
  speech archive that still expects eSpeak's absent monolithic data files.
- Let iPhone Kokoro downloads extract their model files: the native archive
  helper now accepts libarchive's successful zero payload status instead of
  mistaking it for a short write and resolves iOS's system container-path alias
  before applying secure symlink checks.
- Prevent iPhone local-voice tests from crashing when a native speech engine
  rejects its model. The licence-safe Kokoro/Piper runtime now accepts its
  verified pronunciation-pack layout and returns a normal error if a future
  engine cannot initialize.
- Return Speaking to the system voice when the selected Kokoro download is
  removed, instead of leaving a now-missing local voice selected.
- Let downloaded response models initialize and answer normally on Android,
  without exposing an internal response-history label, and stop optimized
  Release builds from crashing when Kokoro begins speaking. Automatic setup
  retry now selects another compatible model after a real device-test failure
  instead of repeating the failed model or describing its completed download
  as unfinished. Android one-tap setup now uses compact Piper speech instead of
  starting an unbounded Kokoro benchmark; Kokoro remains available as an
  explicit advanced choice.
- Make the home microphone immediately use the downloaded speech recognizer
  selected by automatic setup instead of incorrectly treating the provider
  speech-model picker as the local readiness signal.
- Record Android microphone turns as mono 16 kHz PCM WAV audio so downloaded
  speech recognition can read the same capture that provider routes receive,
  instead of failing every local voice turn on the recorder's AAC/M4A file.
- Keep the home-screen instruction in sync when capability checks move from
  the unavailable voice control to the message field, so it says to type
  instead of still saying to speak.
- Finish the seven-step introduction with a clear, labelled Done action in the
  same place as its Next control instead of leaving an empty footer that looks
  like a missing button.
- Restore a completed on-device profile as Ready after it has been revalidated,
  rather than offering to download models that are already present. Piper
  downloads now include their required phoneme packs before the voice is
  accepted, avoiding intermittent local-voice failures on iPhone. A successful
  automatic install now records its completed profile for that later
  revalidation.
- Repair local speech installs on iPhone: Kokoro now verifies its pronunciation
  packs before it is offered as usable, and Piper/Kokoro pack archives extract
  safely without deleting their own source or an already-installed companion
  pack. Retrying a failed Piper archive uses a foreground iOS download, so the
  installed model and its speech data recover together.
- Let the iOS native extractor skip valid archive-root records while retaining
  its traversal protection, so Kokoro can finish installing its pronunciation
  packs on iPhone.
- Replace the iOS extractor's brittle canonical-string path check and
  incompatible archive-writer path flags with direct validation of relative
  regular archive entries, so valid Kokoro and Piper pronunciation packs
  install on iPhone without weakening traversal or link protection.
- Repair the full local-voice catalogue: the app now handles a stale runtime
  checksum only by directly hashing the reviewed archive, re-pins the updated
  Brazilian Portuguese Faber voice, and replays every tested Piper voice in
  its selected language instead of asking it to speak English immediately
  afterwards.

## 3.2.0 - 2026-08-08

### Added

- A six-step introduction, reachable from a dismissible invitation above your
  conversation. It covers what the app needs to run, what is optional and why,
  and what Premium adds, and you can swipe through it in either direction or
  leave at any point. It opens with a spoken example in your language, and the
  speaking step lets you hear the app in any of its nineteen languages before
  deciding whether to set speech up. The examples are part of the app, so they
  work offline and on first launch.

### Changed

- Replaced the setup wizards. The app now opens straight into the workspace
  instead of requiring a multi-gigabyte download before anything can be seen.
  Setting up on-device models or your own provider is still one action away,
  and the introduction opens by itself if a turn is attempted with nothing
  configured, so the microphone is never a dead end.
- Conversations are now stored in a database rather than in individual files.
  Branching, deleting, and restoring a backup either complete or leave nothing
  behind, instead of being able to stop halfway.
- Every action in the introduction opens the settings page that does the work.
  Choosing to install the on-device model opens the page that downloads and
  verifies it, rather than closing the introduction with nothing to show for
  it. Connecting your own provider opens the Premium purchase over the
  introduction, so backing out of the purchase leaves you where you were.
- The introduction follows your light or dark theme. The invitation on the home
  screen keeps a colour of its own so it still stands out, and it only offers
  to be dismissed once you have opened it at least once. Buying Premium removes
  it. You can bring it back under App & diagnostics.
- Web Search now sits under the button it affects rather than above it, and
  controls that cannot be used at all -- Web Search with no provider configured,
  and attaching an image on a route that cannot take one -- are left out rather
  than shown greyed out.

### Fixed

- Keep a model download running when the phone sleeps or you leave the app. The
  transfer ran only while the app was in front, so a screen timeout under
  battery saver dropped a multi-gigabyte download after about a minute, and
  switching to another app dropped it at once. Downloads now hold the screen
  awake and continue in the background until they finish.
- A running download can now be cancelled from the button that started it,
  instead of only by clearing app data.
- Stop a single test run under battery saver from ruling out on-device setup
  for good. A model tested while the phone was throttled or in power saving was
  recorded as too slow for the phone permanently, and once every candidate had
  been tested that way the app reported that the phone could not run a local
  setup at all, and kept reporting it after a restart. Those results are now
  retried rather than held against the phone.
- Play an example again after switching the introduction's language. The first
  language change left every later example silent with nothing to indicate why.
- Show the message field whenever the voice control cannot be pressed, and
  explain on the control itself why, instead of leaving it looking ready to
  press. The message field now carries a green outline in both themes, matching
  the voice control it sits beside.
- Lift the credentials card clear of the background in dark mode, where it
  previously read as dark on dark.

## 3.1.1 - 2026-08-07

### Fixed

- Keep the screen awake while on-device setup downloads and tests its models.
  The phone could fall asleep partway through and abort the download, leaving
  setup to be started over. The screen now stays on until preparation
  finishes, fails, or is cancelled.
- Install the pronunciation packs that the downloadable on-device voice needs.
  They never arrived on iPhone and iPad, so installing the voice ended in an
  unexplained failure while Settings still listed the voice as present but
  missing its pronunciation pack.
- Keep the app responsive while a downloadable on-device voice speaks. A long
  spoken answer, in particular a deliberated one, could leave the screen
  unresponsive until it finished: the transcript still scrolled but no control
  reacted. Speech is now produced away from the interface.
- A downloaded on-device Kokoro voice whose pronunciation packs failed to
  install no longer reports a confusing request to copy eSpeak data into the
  model folder. The download now fails when no pack could be installed, and
  speaking reports the missing packs and points at downloading the voice
  again.

## 3.1.0 - 2026-08-06

### Added

- Report an AI response directly from its message actions. The report action
  assembles the response, its provider route, and a report preamble into the
  system share sheet, so the user chooses the channel and sees exactly what
  leaves the device. Available in all 19 languages.

### Changed

- Present the Premium upgrade screen as a full-width sheet that rises from the
  bottom of the display, leaving the page heading visible above it, instead of a
  narrow centred box. In landscape it stays a centred dialog.
- Move the image attachment button from beneath the record control into the
  transcript header, next to the conversation style and jump-to-latest
  controls. The button no longer sits off-centre against the input page
  indicators, and it stays in the same place in portrait and landscape.
- Rename the deliberation feature from Uber Mode to Model Council in English
  across the app and store material. Other languages keep their established
  localized names and drop the literal `Uber` token.
- Replace the eSpeak NG phonemizer with the permissively licensed libphonemize
  runtime for downloaded on-device voices. Every Free conversation language
  now ships a pinned, checksum-verified pronunciation pack with its own neural
  fallback, so names, brands, and other out-of-vocabulary words are pronounced
  instead of dropped; Brazilian Portuguese gets its own pronunciations instead
  of borrowing European Portuguese ones. Refreshed lexicons also correct
  English stressed-schwa, Russian ч, and French nasal-vowel pronunciations. A
  missing pack falls back to system speech rather than guessing.
- Rework localized store-promotion capture into deterministic Premium and Free
  stories. The ten iOS and eight Android images now cover populated active and
  idle conversations, Free onboarding, expanded branches, Settings, on-device
  AI, and per-conversation controls without making provider requests.

### Fixed

- Correct machine-translation defects across all eighteen translated
  interface languages. The worst cases changed meaning rather than only
  reading awkwardly: speech-to-text and text-to-speech instructions named the
  opposite feature, "web grounding" appeared as electrical earthing, "Resume"
  became the word for a curriculum vitae, "Back" became the body part, and the
  debug LOG button was named after a wooden log. Action buttons now read as
  actions rather than nouns, live status labels as ongoing states, and counted
  plurals follow each language's own agreement rules, including Czech, Polish,
  Russian, and Ukrainian paucal forms. European Portuguese no longer carries
  Brazilian wording, formal and informal address is consistent within each
  language, and an Azure credential hint that had lost its `<region>`
  placeholder to corrupted text is restored.
- Keep dialog footer actions on-screen when a dialog's content is taller than
  the available window. The Premium dialog's Buy and Restore purchase buttons
  were pushed off-screen on small windows such as iPad compatibility mode; the
  dialog body now shrinks and scrolls inside the card instead.
- The Premium restore hint now names only the current platform's store: the
  App Store on iOS and the Play Store on Android, in every language.
- Free on-device setup no longer pauses for phone warmth, low memory, or
  battery saver, so downloads and tests always run to completion. A model test
  that misses its speed target while the phone is throttled or in battery
  saver is reported as inconclusive instead of permanently marking the phone
  too slow.
- Keep the Premium purchase reachable while Free on-device setup is running:
  the setup screen now offers a Premium escape hatch, so unsupported hardware
  or a failing download no longer strands the user on Retry.
- Completing Free setup no longer erases previously configured Premium
  response modes; they persist untouched and return with Premium.
- Long conversation histories on Android no longer silently stop saving; the
  local storage limit now accommodates years of history.
- A downloaded model or voice artifact whose checksum does not match is now
  always deleted and its install fails, instead of being kept and reported as
  verified.
- Cancel the provider stream when a response fails mid-turn, so the provider
  stops generating and billing a completion that can no longer arrive.
- A provider that reports a temporary quota problem recovers automatically
  after the wait window instead of staying disabled for the rest of the
  session, and per-minute rate limits are treated as transient instead of
  exhausted quota.
- Mid-stream provider errors now keep retry and failover available, map to
  their real provider status, and long thinking phases are no longer treated
  as stalled streams.
- Backup export now reports conversations it had to skip because their stored
  body could not be read, with a localized warning on the Data & privacy
  screen, instead of reporting a silently incomplete backup as successful.
- Share thread and Manage memory from the conversation drawer now work on
  Android; both actions were silently dropped after closing the drawer.
- Drive Mode replies no longer occasionally swap the order of their opening
  audio clips.
- Voice capture no longer wedges for the rest of the session when the Android
  speech service fails to deliver its final event; stop, abort, and file
  transcription are all bounded by watchdogs.
- Modal backdrops are no longer exposed to screen readers as unlabeled
  buttons; every modal keeps its labeled close action.

## 3.0.0 - 2026-08-04

### Changed

- Simplify Settings by removing the redundant Free edition summary and Guided
  setup shortcut cards. Free setup remains available from Home.

### Added

- Preview the selected system or Kokoro voice directly beside its Advanced
  onboarding dropdown. The volume button becomes Stop during synthesis or
  playback and restores itself when the sample finishes.
- Keep completed sanitized debug captures in app storage and mirror them into a
  `debug-logs` folder beside the user-selected conversation archive. Later
  archive syncs backfill retained logs when a direct folder write was
  temporarily unavailable, so a failed clipboard paste no longer loses the
  only accessible copy.
- Assess every compatible on-device model before download using the current
  phone's RAM, available memory, storage, architecture, OS, power, and thermal
  state. Advanced onboarding and Settings distinguish specification estimates,
  estimates calibrated from another model tested on the same phone, and exact
  short benchmark results with tokens per second or speech real-time factor,
  load time, and RAM headroom.
- Continue from any user or assistant checkpoint, including inside an existing
  branch. Transcript markers identify the exact branch point, the conversation
  drawer renders recursive Git-style rails, related checkpoints are directly
  navigable, and every branch remains independently usable if its parent is
  deleted or restored from backup.
- Expand the on-device catalogue with opt-in Qwen3.5, Granite, Ministral
  Reasoning, and larger Qwen reasoning routes; Whisper Base and Small,
  Parakeet, and Qwen3-ASR recognition; and additional permissively licensed
  Piper voices. Automatic setup quality-ranks approved candidates after
  language and device filtering, while every advanced choice remains
  benchmark-gated and available for manual selection.
- Add an expandable Uber Mode audit to each deliberated reply, showing routes,
  rounds, challenge and convergence verdicts, failures, retired participants,
  retained synthesis history, and intermediate tokens without storing private
  contribution text.
- Interrupt a spoken response with a dedicated speak-now control. Completed
  answers remain intact, still-streaming text is retained with a visible
  interruption marker, prefetched audio is stopped, and recording starts only
  after the playback route settles.
- Render Markdown headings, lists, links, citations, tables, and code fences
  into clearer speech without changing the visible or saved response.
- Correct a misheard user transcript in place. Corrections update saved
  history, search, archives, future conversation context, and optional local
  knowledge while leaving already-generated replies visibly unchanged.
- Show separate Quick and Thorough on-device response cards when a phone has
  enough memory and storage for both benchmarked Qwen models; smaller phones
  keep a single viable Quick card.
- Add optional Omnilingual on-device speech recognition and compact Piper
  voices for Italian, Russian, and European Portuguese, each with pinned
  artifacts, license checks, and device-local benchmarks.
- Add a zero-account Free experience that selects, downloads, verifies, and
  benchmarks one complete on-device listening, thinking, and speaking setup
  for the user's preferred speaking language and phone. Once installed, Free
  conversations and session history run without provider keys or network
  inference.
- Add a permanent Premium unlock through App Store and Play Store billing,
  including localized store pricing, offline entitlement caching, automatic
  same-platform ownership reconciliation, and an explicit restore action.

### Changed

- Make the automatic Free recommendation reassuring rather than technical: it
  now confirms four plain-language capabilities with large green checks
  without exposing model brands,
  presents download size and setup time directly on the recommendation card,
  and reduces the Free Home cards to only `Quick response` and
  `Thorough thinking`, centered in each card. Completed local routes now remain
  visible immediately after relaunch instead of briefly collapsing to Quick.
  Exact model names remain available in Advanced setup and Settings.
- Arrange both automatic and custom setup summaries with Quick responses and
  Thorough reasoning first, followed by Text to Speech and Speech to Text.
- Put the Advanced `Your selected setup` summary after all model and device
  controls, immediately before setup completion. It now uses the app's soft
  violet AI-work color to distinguish a user-curated plan from the green
  automatic recommendation; enabling Advanced visually disables the automatic
  card so the active configuration source is unambiguous.
- Make Free on-device preparation thermal-safe: reuse current viable device
  tests, validate the essential Quick, listening, and speaking paths without
  making the larger Thorough model a blocking benchmark, pause automatically
  under heat, memory, or power pressure, and add short cooldowns between heavy
  steps. Completed downloads and tests survive the pause, the setup resumes
  when the phone is safe, and an unused local language-model context is
  released after 30 seconds in the foreground. Native iOS voices are loaded
  only when Advanced options actually select the system voice, and an equal
  language selection no longer retriggers the expensive system voice-directory
  request on every render. Setup toasts now use the native animation driver
  instead of scheduling their transition through Worklets.
- Present required Free onboarding as a full-width app screen instead of a
  narrow modal. It shares the localized home wordmark and spacing, offers a
  single initially empty language dropdown whose placeholder carries the
  selection instruction, highlights the personalized best-match setup only
  after an explicit choice and a short matching step, and uses a compact
  Advanced checkbox plus a more prominent Start action. The recommendation card avoids
  duplicate confirmation decoration and uses the same restrained corner radius
  as the language dropdown without a decorative top rail. Major screen sections
  have clearer separation, with extra emphasis between the language dropdown
  and recommendation, while the recommendation-to-Advanced relationship remains
  compact. The card now uses `Your best setup` as its sole headline instead of
  repeating a second best-match claim. The page language still defaults from
  the storefront with an English fallback. The Start action remains visible but
  disabled until a language is selected and the matching presentation has
  completed. The screen replaces the main workspace until setup is complete and
  cannot be dismissed before every selected model has been downloaded,
  installed, and verified and the essential runtime paths have passed their
  device tests. The best-match recommendation now remains
  immutable while Advanced options maintain a separate selected-setup preview;
  hiding Advanced switches Start back to the recommendation without discarding
  the custom draft. Advanced sections share one heading hierarchy, and voice
  selection lives inside the selected text-to-speech option.
- Update the home-screen wordmark immediately with the selected interface
  language, and replace the visible translated debug-log text with the shared
  bug icon while retaining an accessible localized label.
- Prefer stronger automatic Free models when the phone has enough headroom.
  Qwen3 0.6B remains a constrained-device fallback instead of displacing
  Granite on the Quick card; high-end German profiles now pair Granite with
  Ministral Reasoning and Parakeet speech recognition.
- Keep branch families compact and collapsed until opened, expand the active
  path automatically, label each child with its parent, and show a child thread
  from its forked checkpoint while retaining earlier parent context invisibly.
- Confirm standalone fork actions, move edited-prompt submission into an
  explicit Save + send dialog action, provide parent navigation above and below
  the forked checkpoint, and keep secondary user-message actions out of the
  primary message-action row.
- Strengthen Uber Mode synthesis with an evidence-ledger contract that keeps
  established information, inference, assumptions, and unresolved dissent
  distinct and passes explicit review verdicts into the final synthesis.
- Make each conversation's compact memory directly editable as well as
  inspectable, copyable, and forgettable, so an automatic summary can be
  corrected before it shapes later turns.
- Streamline first-run Free setup around one speaking language and an automatic
  storefront-aware phone-to-model recommendation, with a deliberately readable
  evaluation, model summary, one green confirmation action, per-step download
  progress, remaining-step count, and a live ETA. An Advanced toggle exposes
  phone evidence, compatibility guidance, persistent Quick/Thorough model
  choices, local or phone-native speech routes, and voice selection.
- Build cross-session knowledge automatically from every user and assistant
  message in eligible conversations, without asking users to categorize or
  promote individual messages. Retrieved context remains linked to its source
  conversation, while private conversations remain excluded.
- Present Free as a coherent Private Offline edition across Home, setup, and
  Settings, with a three-step single-language model flow and explicit
  language-aware phone speech options.
- Group Settings by conversation, voice and models, and privacy and app tasks;
  replace the technical readiness dashboard with a clear edition summary and
  a direct setup action.
- Explain Premium before purchase with its concrete provider, response-mode,
  Uber, web, image, Drive, knowledge, and archive benefits, plus the one-time,
  no-subscription, no-token-markup purchase model and same-platform restore
  boundary.
- Keep Free Settings focused on on-device AI, data and privacy, and app
  preferences while exposing the same complete device evidence, model tests,
  route choices, and voice controls as the onboarding wizard's Advanced view.
- Hide the image attachment action from the Free home screen instead of
  showing a disabled Premium-only button beneath the main action.
- Keep cloud providers, response-mode configuration, web search, images,
  Drive and Uber modes, cross-session knowledge, portable archive sync, and
  advanced controls behind Premium while preserving the user's configuration
  across Free and Premium transitions.

### Fixed

- Let the standalone iOS deployment script find a paired physical iPhone while
  its CoreDevice tunnel and developer services are still dormant, matching
  Expo's device discovery instead of incorrectly reporting the phone missing.
- Tell small on-device reasoning models to treat the latest message as the
  current task and not blend an earlier topic into the answer when a branch
  changes subject.
- Keep Free setup's selected speaking language, interface locale, local model
  prompt, and speech routes synchronized; repair existing mismatched profiles,
  and remove private Qwen thinking plus stray Markdown from visible, saved, and
  spoken on-device replies.
- Prevent Qwen Thorough replies from starting with an English Markdown topic
  heading or ending mid-answer by enforcing the target language in its own
  language, removing standalone generated titles, and reserving a separate
  generation budget for private reasoning.
- Let Save + send on an edited user transcript create an independent branch
  through the corrected prompt, preserving prior context, settings, privacy,
  and image files while generating the replacement reply.
- Keep the product name exactly “Mr Broccoli” in every interface language
  instead of translating, respelling, or punctuating the brand per locale.
- Make past-conversation retrieval abstain on weak incidental matches, suppress
  duplicated conversation copies, and label retained sources by match quality
  while indexing the complete eligible conversation history.
- Add a conversation-integrity review for saved assistant responses that
  previews suspected internal-context leakage before changing anything,
  preserves the original locally for export or undo, and avoids automatic
  deletion when no safe repaired prefix exists.
- Make debug capture available in Free and record sanitized Premium store
  diagnostics for connection, product lookup, retry, purchase, restore, and
  entitlement reconciliation failures.
- Restore saved image attachments after iOS app updates by resolving their
  relative paths against the current app container, preventing one stale image
  URL from blocking readable or encrypted session backups.
- Keep the active conversation out of past-conversation retrieval from its
  first transcribed turn, reject interrupted Anthropic streams instead of
  silently continuing them, and block serialized internal context before it
  can be spoken, saved, or re-indexed.
- Keep Free setup focused on one preferred speaking language chosen from
  English, Spanish, French, German, Portuguese, Russian, or Italian. Portuguese
  automatically follows the phone's Brazilian or European locale, with the
  phone's language-aware system voice available when no downloaded voice fits.
- Prevent a stalled private Uber Mode participant from blocking an entire run
  indefinitely; timed-out participants are skipped while successful models
  continue through review and final synthesis.
- Allow max-effort model replies to remain inactive for up to ten minutes
  before timing out, matching Uber Mode's participant deadline.
- Trust a successfully installed and benchmarked Free on-device profile when
  it selects Kokoro, avoiding a stale verification warning that redirected
  Free users into the Premium-only Speaking settings after changing language.
- Prevent local Whisper testing and transcription from terminating the app
  during automatic language detection, and benchmark a real speech fixture
  through the normal file-transcription route instead of synthetic silence.
- Make the Free home action open on-device setup instead of remaining disabled,
  open the complete on-device model catalogue from Settings, and return to the
  same Settings flow after a Premium prompt closes.
- Remove the redundant home-screen Premium shortcut and prevent purchase
  attempts from failing silently when the App Store or Play Store product is
  unavailable by showing the store error with an explicit retry action.
- Reuse suitable models already installed on the device when building the Free
  profile, avoid models that failed a current-device benchmark when an
  alternative exists, and keep setup open until all three local routes pass.
- Stop portable conversation archive sync and provider-backed title generation
  from crossing the Free offline boundary, discard delayed image-picker results
  after image access is locked, and release local benchmark resources after
  failures.

### Store release notes

See `docs/google-play-release-notes-3.0.0.md`.

## 2.8.0 - 2026-08-02

### Added

- Add optional on-device knowledge from past conversations with local hybrid
  retrieval, visible source sessions, and private conversations that are never
  indexed while retaining their own in-session memory.
- Add up to four camera or photo-library images to typed and spoken prompts,
  keep them with conversation history and backups, and require explicit
  consent before resending them to new or multiple reasoning providers.
- Add a guided on-device AI catalogue for Android and iOS. It filters models by
  the selected languages and measured device capacity, verifies every download,
  benchmarks models before use, and makes local Whisper, Qwen, Kokoro, and
  Piper routes selectable from the normal listening, thinking, and speaking
  settings. Web search remains disabled for local responses in this first
  version.
- Keep readable Markdown copies of conversations in a user-selected Files or
  Drive folder, automatically maintain index and latest-conversation files,
  and share threads as structured handoffs for other AI apps. Provider keys,
  hidden memory, instructions, and runtime metadata remain excluded.

### Fixed

- Prevent the optional past-conversation knowledge index from terminating the
  iOS app while opening or clearing its local full-text database.
- Prevent Android release optimization from renaming Sherpa JNI classes and
  crashing the app when Kokoro speech initializes.
- Keep backup export responsive by deriving encryption keys on a native
  background queue, reject duplicate exports and obviously weak passphrases,
  and retain shared files long enough for mail apps to attach them reliably.
- Prevent provider and model provenance labels from accumulating at the start
  of replies across repeated conversation turns.
- Reject recordings with clear silence before sending them to provider speech
  recognition, avoiding hallucinated one-word prompts such as “No” or “One”.

### Store release notes

See `docs/google-play-release-notes-2.8.0.md`.

## 2.7.0 - 2026-08-01

### Changed

- Optimize Android release builds with R8 and resource shrinking, and preserve
  Play Console deobfuscation mappings plus native debug symbols for readable
  production crash reports.
- Remove the legacy Ant Design Native runtime dependency while retaining the
  app's established native controls and visual behavior.
- Strengthen release validation with fresh-checkout static analysis, enforced
  coverage and TypeScript checks, native lifecycle tests, release-size and
  secret budgets, and cross-platform accessibility and localization audits.
- Make Uber Mode deliberation more efficient and adversarial: reviewers receive
  each participant's latest provider-anonymous position, actively stress-test
  agreement, and stop unused rounds after explicit unanimous convergence.
  Intermediate answers retain material reasoning without a restrictive word
  target, while final synthesis preserves earlier successful reasoning within
  a safe context budget and always keeps every model's latest position.

### Fixed

- Keep navigation, response routes, Settings, and conversation controls usable
  with accessibility-large text on compact screens.
- Prevent decorative application and provider icons from creating duplicate or
  confusing screen-reader stops.
- Make voice-preview Stop respond immediately during Kokoro or provider speech
  generation, prevent cancelled previews from playing later, and report
  intentional cancellation separately from synthesis failures.

### Store release notes

See `docs/google-play-release-notes-2.7.0.md`.

## 2.6.0 - 2026-07-31

### Added

- Added readable and passphrase-encrypted app-data backups for portable
  settings and complete conversation history. Provider API keys, diagnostics,
  caches, audio, and downloaded models are never included.
- Added non-destructive backup restore: existing data and API keys remain in
  place, identical conversations are skipped, and ID conflicts are restored as
  separate copies.

### Changed

- Display the current release version on the Settings overview.
- Replace application glyphs with consistent regular-weight Phosphor icons and
  semantic sizing, while retaining official provider-brand artwork, compact
  transcript disclosures, accessible touch targets, and clearer message
  actions.
- Promote the home wordmark to the larger screen-title size, align Conversations
  and Conversation Settings with the smaller Settings page-title hierarchy,
  and remove the inconsistent border from the conversation close action.
- Keep the Conversation Settings title on one truncated line, anchor its close
  action to the top-right corner, and replace oversized pills with compact
  segmented choices.
- Use the standard vertical overflow glyph for per-conversation actions while
  retaining an invisible accessible touch target.
- Bring the voice/text swipe indicators closer together without shrinking their
  accessible tap targets.
- Focus the direct provider list on OpenAI, OpenRouter, Anthropic, Google,
  xAI, DeepSeek, Mistral, Alibaba Qwen, and ElevenLabs by removing the direct
  ByteDance, Moonshot, and Perplexity integrations. Kimi K3 remains available
  through OpenRouter.
- Use one Gemini API key for Google chat, recorded-audio transcription, web
  search, and speech synthesis; the legacy Google Cloud Speech credential
  format is no longer supported.
- Persist provider-confirmed retired models and unsupported effort
  configurations as on-device compatibility overrides, recover through the
  curated fallback route, remove disabled choices from Settings, and expose a
  local reset under App & diagnostics. Authentication, quota, rate-limit,
  network, and server failures never disable a configuration.
- Redact credentials and user-authored text from debug captures before logs are
  written to disk or copied to the clipboard.
- Make debug reports durable, bounded, recoverable after an interrupted
  capture, and easier to diagnose with build, device, network, interaction,
  turn, pipeline, and privacy-minimized platform exit context. Validate every
  report before it is shared and clearly surface capture or export failures.
- Improve screen-reader behavior for pickers, overlays, voice phases, setup,
  and download/validation statuses, and expand interactive controls to
  accessible touch targets.
- Reduce the native app footprint by excluding Sherpa's unused audio-conversion
  runtime while retaining Kokoro model installation and WAV speech synthesis.
- Add a local, manifest-driven release gate that checks every retained provider
  model and effort, all speech and web-search routes, and one representative
  voice per TTS model behind a fail-fast credential and spend-reservation gate.
- Add an install-and-run Maestro release gate across Android emulator, physical
  Android hardware, and iOS simulator, including every UI language, landscape
  regressions, and a complete screenshot review gallery.

### Fixed

- Persist each provider capability test atomically so complete LLM, STT, TTS,
  search, and voice-library health results survive app restarts.
- Keep the conversation anchored to newly submitted prompts and incoming
  replies while preserving intentional reading of older messages.
- Replace the artificial one-second silence between spoken paragraphs with a
  short natural cadence gap.
- Add a dedicated Stop action that cancels current and prefetched reply audio,
  alongside the existing pause and resume control.
- Prevent three response modes from crowding or overlapping Drive controls in
  landscape by using the horizontal three-card layout.
- Keep long voice-preview text inside its editor instead of letting it overlap
  the preview button.
- Update OpenAI Realtime text responses to the current GA event schema.
- Keep Anthropic grounded web-search replies reliable when adaptive thinking is
  enabled by reserving enough response budget and requiring a completed search.
- Parse Gemini's current Interactions API search steps so grounded replies and
  their search results are recognized correctly.

### Store release notes

See `docs/google-play-release-notes-2.6.0.md`.

## 2.5.6 - 2026-07-31

### Changed

- Show Kokoro download, installation, and verification progress directly on
  temporarily disabled home-screen actions.
- Made the full guided-setup shortcut row in Settings tappable.

### Fixed

- Fixed an Android foreground-service startup race that could close the app
  when starting a Drive Session or voice recording.
- Fixed stopping a spoken-reply replay during preparation so it no longer
  fails with a cancellation error.
- Required the Kokoro on-device model to download and pass verification before
  Kokoro can be selected, with clearer setup guidance for existing invalid
  selections.
- Prevented voice, typed, retry, and Drive Session prompts while the selected
  Kokoro model is missing or still being prepared.
- Fixed the Kokoro model-removal confirmation being hidden behind the Settings
  window on Android.

### Store release notes

See `docs/google-play-release-notes-2.5.6.md`.

## 2.5.5 - 2026-07-30

### Added

- Added headset media-button and lock-screen controls for recording and spoken
  replies.
- Added background continuation for active Drive Sessions so listening can
  resume while the screen is off.
- Added a persistent provider-speech cache. Replaying the same answer can reuse
  previously synthesized audio instead of spending provider quota again.

### Changed

- Made Drive Session endpoint detection continuously adapt to the user's speech
  level, ambient noise, audio route, and sustained environment changes.
- Made live response estimates learn separately for Uber Mode routes, provider
  outcomes, fallbacks, and failures.
- Added provider circuit breakers so terminal quota, authentication, and
  permission failures stop repeated calls and expose clearer recovery guidance.
- Improved long-running voice diagnostics while reducing repetitive debug-log
  noise.
- Updated Expo, React Native, Android Material Components, and the native build
  toolchain for current iOS and Android compatibility.
- Changed the main action's timing border to fill symmetrically clockwise and
  counterclockwise from the top center.

### Fixed

- Fixed transcript replay quota failures so one failed speech chunk stops the
  remaining provider requests and shows a quota-specific message.
- Fixed the Input Mode and Speech to Text information dialogs being hidden
  behind the settings window on Android.
- Preserved provider speech-to-text uploads across the updated Expo networking
  stack.

### Store release notes

See `docs/google-play-release-notes-2.5.5.md`.

## 2.5.4 - 2026-07-29

### Added

- Added live response-time estimates to the main action, iOS Dynamic Island and
  Lock Screen, and the Android foreground notification, including overtime.
- Added screen wake protection during recording and active Drive Sessions.

### Changed

- Improved AirPods, Bluetooth, wired, and USB headset audio routing.
- Made Drive Session speech endpointing adapt to ambient noise and reject
  background chatter more reliably.
- Made Uber Mode response estimates account for its multi-model deliberation.
- Updated the main action wording and timing border to make the current state
  and expected wait visible together.

### Store release notes

See `docs/google-play-release-notes-2.5.4.md`.

## 2.5.3 - 2026-07-29

### Added

- Added a fully hands-free Drive Mode with microphone activity feedback, a
  ten-second silence countdown, and automatic turn submission.
- Added Uber Mode, where multiple configured models assess and refine a question
  before the selected model delivers the final answer.
- Added complete Czech, Polish, Turkish, Swedish, and Urdu interfaces and speech
  language support.

### Changed

- Improved cross-provider model fallback and recovery from quota and model
  availability failures.
- Updated Gemini validation and generation routes to current supported models.
- Localized Uber Mode naming consistently across every interface language.

### Fixed

- Fixed Android Back navigation inside settings.
- Correctly attributed Uber Mode usage to each participating provider and model.

### Store release notes

See `docs/google-play-release-notes-2.5.3.md`.

## 2.5.2 - 2026-07-29

### Added

- Added complete Japanese and Hungarian interfaces, including settings,
  provider guidance, accessibility labels, and localized app names.
- Added Hungarian as an independently selectable language for speech
  recognition and spoken replies on providers that support it.

### Changed

- Refreshed the app icon with clearer Mr Broccoli artwork on iOS and Android.
- Improved Android launcher presentation with adaptive safe-zone artwork and a
  dedicated themed-icon layer.

### Store release notes

#### English

Mr Broccoli now offers complete Japanese and Hungarian interfaces. Hungarian
can also be selected for speech recognition and spoken replies where supported.
The refreshed app icon gives Mr Broccoli a clearer new look and properly adapts
to Android launcher shapes and themed icons.

#### Deutsch

Mr. Brokkoli bietet jetzt vollständige Oberflächen auf Japanisch und Ungarisch.
Ungarisch kann, sofern unterstützt, auch für Spracherkennung und gesprochene
Antworten gewählt werden. Das neue App-Symbol sorgt für einen klareren Auftritt
und passt sich unter Android an Symbolformen und Farbschemata an.

#### Українська

Пан Броколі тепер має повні інтерфейси японською та угорською. Угорську також
можна вибрати для розпізнавання мовлення й озвучених відповідей, якщо
постачальник її підтримує. Оновлена іконка краще відображає характер Пана
Броколі та адаптується до форм і тем Android.

#### हिन्दी

मिस्टर ब्रोकली में अब पूर्ण जापानी और हंगेरियाई इंटरफ़ेस हैं। जहाँ प्रदाता
समर्थन करता है, हंगेरियाई को वाक् पहचान और बोले गए जवाबों के लिए भी चुना जा
सकता है। नया ऐप आइकन अधिक स्पष्ट रूप देता है और Android के अलग-अलग आइकन आकारों
व थीम के अनुसार ढलता है।

#### Español

Mr. Brócoli ya ofrece interfaces completas en japonés y húngaro. Cuando el
proveedor lo admite, el húngaro también puede elegirse para el reconocimiento
de voz y las respuestas habladas. El nuevo icono muestra mejor su personalidad
y se adapta a las formas y los temas de Android.

#### Français

M. Brocoli propose désormais des interfaces complètes en japonais et en
hongrois. Lorsque le fournisseur le permet, le hongrois peut aussi être choisi
pour la reconnaissance vocale et les réponses parlées. La nouvelle icône
affirme mieux son identité et s’adapte aux formes et thèmes Android.

#### Italiano

Sig. Broccoli ora offre interfacce complete in giapponese e ungherese. Dove
supportato dal provider, l’ungherese può essere scelto anche per il
riconoscimento vocale e le risposte parlate. La nuova icona rende l’identità più
chiara e si adatta alle forme e ai temi di Android.

#### Português

O Sr. Brócolo dispõe agora de interfaces completas em japonês e húngaro. Quando
o fornecedor o permite, o húngaro também pode ser escolhido para o
reconhecimento de voz e as respostas faladas. O novo ícone reforça a identidade
da aplicação e adapta-se às formas e aos temas do Android.

#### Português (Brasil)

O Sr. Brócolis agora oferece interfaces completas em japonês e húngaro. Quando
houver suporte do provedor, o húngaro também pode ser usado no reconhecimento
de voz e nas respostas faladas. O novo ícone destaca melhor a identidade do app
e se adapta aos formatos e temas do Android.

#### Русский

Мистер Брокколи теперь предлагает полноценный интерфейс на японском и венгерском
языках. Если провайдер поддерживает венгерский, его также можно выбрать для
распознавания речи и озвучивания ответов. Новая иконка лучше передаёт характер
приложения и адаптируется к формам и темам Android.

#### 简体中文

西兰花先生现已提供完整的日语和匈牙利语界面。服务提供商支持时，匈牙利语也可用于
语音识别和语音回复。全新的应用图标更鲜明地展现了西兰花先生，并可适配 Android
的不同图标形状和主题色。

#### العربية

يوفر السيد بروكلي الآن واجهتين كاملتين باليابانية والمجرية. ويمكن اختيار
المجرية للتعرّف على الكلام والردود المنطوقة عندما يدعمها المزوّد. يعكس رمز
التطبيق الجديد شخصية السيد بروكلي بوضوح أكبر ويتكيف مع أشكال الرموز وسمات
Android.

#### 日本語

ミスター・ブロッコリーに、日本語とハンガリー語の完全なインターフェイスを追加しました。
対応プロバイダーでは、ハンガリー語を音声認識と読み上げにも選択できます。新しい
アプリアイコンは個性がより伝わるデザインになり、Android のアイコン形状や
テーマカラーにも対応します。

#### Magyar

A Brokkoli úr mostantól teljes japán és magyar felülettel is használható. A
magyar nyelv a beszédfelismeréshez és a felolvasott válaszokhoz is
kiválasztható, ha a szolgáltató támogatja. Az új alkalmazásikon jobban kifejezi
Brokkoli úr karakterét, és igazodik az Android ikonformáihoz és témáihoz.

## 2.5.1 - 2026-07-28

### Added

- Added complete interfaces for Hindi, Spanish, French, Italian, European
  Portuguese, Brazilian Portuguese, Russian, Simplified Chinese, and Arabic.
- Made every interface language independently selectable for speech
  recognition and spoken replies. Japanese remains available as an additional
  speech-only language.
- Added a gentle local cue before Drive Session automatically starts listening
  for the next turn.

### Changed

- Spoken replies now begin with the first complete paragraph, prefetch following
  paragraphs, and leave a natural pause between them.
- Interface, recognition, and spoken-reply languages now use one consistent,
  capability-aware language system without tying one choice to another.
- Drive Session now waits for playback to finish before automatically reopening
  the microphone.
- OpenAI and xAI web search now require current, grounded search results instead
  of accepting answers based only on model memory.

### Fixed

- Pausing a spoken reply now pauses the complete stream rather than allowing the
  next generated paragraph to start.
- Stabilized the response-timing border so it remains clearly visible and begins
  at the top center of the voice control.
- Prevented unsupported speech languages from being sent to provider routes.
  User-configured fallback routes remain explicit and preserve their chosen
  order.
- Improved right-to-left layout behavior throughout the Arabic interface.

### Store release notes

#### English

Mr Broccoli now offers Hindi, Spanish, French, Italian, Portuguese, Brazilian
Portuguese, Russian, Simplified Chinese, and Arabic interfaces. Every interface
language can also be selected independently for speech recognition and replies.
Spoken responses now have natural paragraph pauses, Drive Session resumes
listening automatically with a gentle cue, and web search requires current
grounded results.

#### Deutsch

Mr. Brokkoli bietet jetzt Oberflächen auf Hindi, Spanisch, Französisch,
Italienisch, Portugiesisch, brasilianischem Portugiesisch, Russisch,
vereinfachtem Chinesisch und Arabisch. Alle Oberflächensprachen können
unabhängig für Spracherkennung und Antworten gewählt werden. Gesprochene
Antworten haben natürlichere Pausen, der Fahrmodus hört automatisch weiter zu
und die Websuche nutzt aktuelle Quellen.

#### Українська

Пан Броколі тепер має інтерфейси гінді, іспанською, французькою, італійською,
португальською, бразильською португальською, російською, спрощеною китайською
та арабською. Мову розпізнавання й озвучення можна вибирати незалежно від мови
інтерфейсу. Озвучення отримало природні паузи, режим водіння автоматично
відновлює слухання, а вебпошук використовує актуальні джерела.

#### हिन्दी

मिस्टर ब्रोकली अब हिंदी, स्पेनिश, फ़्रेंच, इतालवी, पुर्तगाली, ब्राज़ीलियाई
पुर्तगाली, रूसी, सरलीकृत चीनी और अरबी इंटरफ़ेस देता है। इंटरफ़ेस, वाक् पहचान
और बोले गए जवाबों की भाषा अलग-अलग चुनी जा सकती है। बोले गए जवाबों में अब
स्वाभाविक अनुच्छेद विराम हैं, ड्राइव मोड हल्की ध्वनि के साथ अपने आप फिर सुनता
है और वेब खोज ताज़ा स्रोतों का उपयोग करती है।

#### Español

Mr. Brócoli ahora ofrece interfaces en hindi, español, francés, italiano,
portugués, portugués de Brasil, ruso, chino simplificado y árabe. Los idiomas
de la interfaz, el reconocimiento de voz y las respuestas habladas se eligen
por separado. Las respuestas tienen pausas naturales, el modo de conducción
reanuda la escucha con una señal suave y la búsqueda web usa fuentes actuales.

#### Français

M. Brocoli propose désormais des interfaces en hindi, espagnol, français,
italien, portugais, portugais brésilien, russe, chinois simplifié et arabe. Les
langues de l’interface, de la reconnaissance vocale et des réponses parlées se
choisissent séparément. La lecture bénéficie de pauses naturelles, le mode
conduite reprend l’écoute avec un signal discret et la recherche web utilise
des sources actuelles.

#### Italiano

Sig. Broccoli ora offre interfacce in hindi, spagnolo, francese, italiano,
portoghese, portoghese brasiliano, russo, cinese semplificato e arabo. Le
lingue dell’interfaccia, del riconoscimento vocale e delle risposte parlate
possono essere scelte separatamente. La lettura ha pause naturali, la modalità
Guida riprende l’ascolto con un segnale delicato e la ricerca web usa fonti
aggiornate.

#### Português

O Sr. Brócolo oferece agora interfaces em hindi, espanhol, francês, italiano,
português, português do Brasil, russo, chinês simplificado e árabe. Os idiomas
da interface, do reconhecimento de voz e das respostas faladas podem ser
escolhidos separadamente. A leitura tem pausas naturais, o modo de condução
retoma a escuta com um sinal suave e a pesquisa web utiliza fontes atuais.

#### Português (Brasil)

O Sr. Brócolis agora oferece interfaces em hindi, espanhol, francês, italiano,
português, português brasileiro, russo, chinês simplificado e árabe. Os idiomas
da interface, do reconhecimento de voz e das respostas faladas podem ser
escolhidos separadamente. A leitura ganhou pausas naturais, o modo de direção
volta a ouvir com um sinal suave e a pesquisa na web usa fontes atuais.

#### Русский

Мистер Брокколи теперь поддерживает интерфейс на хинди, испанском, французском,
итальянском, португальском, бразильском португальском, русском, упрощённом
китайском и арабском языках. Языки интерфейса, распознавания и озвучивания
выбираются отдельно. В речи появились естественные паузы, режим вождения сам
возобновляет прослушивание, а веб-поиск использует актуальные источники.

#### 简体中文

西兰花先生现已提供印地语、西班牙语、法语、意大利语、葡萄牙语、巴西葡萄牙语、
俄语、简体中文和阿拉伯语界面。界面语言、语音识别语言和朗读语言可以分别选择。
语音回复现在会在段落之间自然停顿；驾驶模式会以柔和提示音自动恢复聆听；网页
搜索会使用最新的可靠来源。

#### العربية

يوفر السيد بروكلي الآن واجهات بالهندية والإسبانية والفرنسية والإيطالية
والبرتغالية والبرتغالية البرازيلية والروسية والصينية المبسطة والعربية. يمكن
اختيار لغة الواجهة والتعرّف على الكلام والردود المنطوقة بشكل مستقل. أصبحت
الردود تتضمن فواصل طبيعية، ويستأنف وضع القيادة الاستماع تلقائيًا بتنبيه هادئ،
ويستخدم بحث الويب مصادر حديثة.

## 2.5.0 - 2026-07-28

### Added

- Added a complete Ukrainian interface, including settings, provider guidance,
  accessibility labels, and the localized app name **Пан Броколі**.
- Added a visual recording-capacity indicator to show how much speaking time
  remains.
- Added an adaptive border timeline that shows when a spoken response is
  expected and turns red when the response takes longer than estimated.

### Changed

- Redesigned the main voice control so recording, processing, interruption,
  pausing, and resuming all use the same prominent button.
- Replaced technical timing text with clearer phase guidance for recording,
  transcribing, thinking, searching, voice conversion, and speaking.
- Simplified Drive Session with explicit controls to pause or resume automatic
  continuation and repeat the last reply.
- Removed unnecessary synthesized voice cues from Drive Session.

### Fixed

- Fixed recording sessions ending immediately on some physical Android devices.
- Prevented Drive Session from automatically reopening the microphone after a
  failed or cancelled response.
- Made the recording-capacity indicator continue correctly across interface
  updates and layout changes.

### Store release notes

#### English

Mr Broccoli's voice controls have been redesigned for clearer, simpler
conversations. Recording now shows the available speaking time, and an animated
border indicates when a spoken response is expected. Drive Session gains clear
controls to pause or resume automatic continuation and repeat the last reply.
This release also improves Android recording reliability and adds a complete
Ukrainian interface.

#### Deutsch

Die Sprachsteuerung von Mr. Brokkoli wurde für klarere, einfachere Gespräche
überarbeitet. Beim Aufnehmen wird jetzt die verfügbare Sprechzeit angezeigt,
und ein animierter Rahmen zeigt, wann eine gesprochene Antwort zu erwarten ist.
Der Fahrmodus bietet klare Funktionen zum Pausieren und Fortsetzen der
Automatik sowie zum Wiederholen der letzten Antwort. Außerdem verbessert dieses
Update die Aufnahme unter Android und ergänzt eine ukrainische Oberfläche.

#### Українська

Голосове керування Пана Броколі стало простішим і зрозумілішим. Під час запису
тепер видно доступний час, а анімована рамка показує, коли очікується голосова
відповідь. У режимі водіння можна призупинити або відновити автоматичне
продовження та повторити останню відповідь. Також покращено надійність запису
на Android і додано повний український інтерфейс.
