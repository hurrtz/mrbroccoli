# Mr Broccoli product experience and visual system

Status: implemented and release-verified design contract, 2026-07-22

## 1. User-facing capability map

This map deliberately describes what a person can accomplish without using the current screen layout as its organizing model.

### Converse

- Start a conversation by voice using tap-to-talk or push-to-talk.
- Send a typed message.
- See live progress through recording, transcription, optional web search, model generation, voice preparation, playback, pause, and completion.
- Cancel an in-flight turn; pause, resume, or stop spoken output; replay a previous assistant reply.
- Read the full conversation, select text, copy or share a message, and open cited web sources.
- Choose among configured response routes, each combining a provider, model, and optional reasoning effort.
- Change response length and tone.
- Turn configured web search on or off for the next turn.
- See optional per-message and per-conversation token estimates.

### Manage conversations

- Start a fresh conversation and return to the current one.
- Search saved conversations by title, provider, model, or message content.
- Pin, rename, copy, share, or delete a conversation.
- See which providers and models contributed to a conversation, its message count, and its time span.
- Inspect, copy, or clear the compact memory summary used for long conversations.

### Configure intelligence and services

- Store and validate credentials for reply, transcription, speech, and web-search providers.
- Filter providers by capability and inspect provider-specific support, limits, regions, models, and setup links.
- Add, remove, and edit response routes.
- Select native or provider speech recognition, its provider and model, and the voice-control gesture.
- Enable or disable spoken replies; select native or provider speech, model, voice, output languages, and streamed or whole-reply playback.
- Preview native and provider voices with editable sample text.
- Select a web-search provider and provider-specific depth, result-count, or search-mode controls.
- Edit the assistant instruction, default response length, and tone.

### Personalize and diagnose

- Follow first-run setup: connect a reply provider, validate it, test the complete voice route, and review the resolved setup.
- Choose English or German and light, dark, or system appearance.
- Show or hide usage estimates and the debug-capture control.
- Inspect current reply, speech-input, speech-output, and fallback routes.
- See route readiness, provider validation failures, recoverable pipeline notices, persistence errors, recording limits, and permission problems.
- Capture diagnostics and use the native speech diagnostics tools.
- Receive background/Live Activity progress while a submitted voice turn continues.

## 2. Product model

Mr Broccoli is a conversation workspace whose primary instrument is voice. It is not a provider dashboard with a microphone attached, and it is not a decorative voice orb with the conversation hidden elsewhere.

The product has four conceptual surfaces:

1. **Conversation** — the current thread, response route, live state, text entry, and voice control.
2. **Library** — saved conversations and their management actions.
3. **Configuration** — credentials, response routes, input, output, search, behavior, appearance, and diagnostics.
4. **Guided setup** — a temporary path through the minimum configuration and a real end-to-end voice test.

The conversation is the home surface and the transcript is its content. Voice is the primary action, but text is always one direct action away. Technical routing detail is visible on demand and never competes with the user’s words.

## 3. Ideal information architecture

### Conversation workspace

- A quiet top bar contains History, the conversation title/brand, and Settings.
- A compact route bar sits below it and gives response-route choices the full row. Web Search sits immediately below the cards at the trailing edge. Style stays in the conversation header in both orientations, so neither control squeezes the cards.
- The conversation canvas uses the remaining height. Empty space is intentional; an empty thread needs one concise instruction, not a stack of onboarding cards.
- The newest exchange is visible without opening another screen. The same canvas expands naturally as the thread grows.
- A stable **voice dock** unifies typed input, the voice action, live waveform, phase copy, ETA, pause/resume, stop, and cancel. Upright places it immediately above the separated transcript canvas; landscape keeps it in the left control pane.
- At idle the dock contains a text field and a prominent microphone action. During recording or playback the input becomes a low-latency signal surface with status and explicit controls.

### Conversation library

- Phone: a full-height sheet. Landscape/tablet: a persistent-width side panel.
- Search and New conversation are fixed at the top.
- Pinned and recent threads use restrained list rows rather than nested cards. Each row prioritizes title and recency; provider/model metadata is secondary.
- Swipe exposes Delete; a single overflow menu contains Pin, Rename, Memory, Share, Copy, and Delete.

### Configuration

- A native-feeling full-screen hierarchy, not a dashboard embedded inside a modal card.
- Overview order follows user intent: Connections, Response routes, Voice input, Voice output, Web search, Behavior, Appearance, Diagnostics.
- One compact readiness line summarizes Think, Listen, Speak, and Search. Problems link directly to the responsible section.
- Controls are grouped by spacing and separators. Cards are reserved for provider identities, warnings, and preview instruments—not used as default containers for every row.
- Technical provider catalog detail is progressive disclosure below the action needed to configure that provider.

### Guided setup

1. Explain local storage/BYOK and the minimum viable route.
2. Connect and validate one reply provider.
3. Choose the voice gesture and run a real microphone-to-reply test.
4. Review the resolved Listen / Think / Speak / Search routes and enter the conversation.

The setup uses the same provider and voice controls as Configuration so the two experiences cannot drift.

## 4. Interaction hierarchy

- **Primary:** speak/send, stop an active action, select a response route.
- **Secondary:** type, toggle search, change response style, pause/resume playback.
- **Tertiary:** route diagnostics, usage detail, copy/share/replay, conversation management.
- **Administrative:** credentials, models, voices, provider limits, debug capture.

Only one primary action is visually dominant at a time. A screen may contain many capabilities, but it must not look as if every control is asking to be clicked first.

## 5. Visual language: Signal & Ink

Mr Broccoli should feel like a precise listening instrument and a well-edited notebook: calm, direct, tactile, and slightly editorial. It must not imply magic, sentience, or generic “AI energy.”

### Principles

- Content before chrome.
- State before decoration.
- Spacing and alignment before cards.
- Solid color before gradients.
- One visible hierarchy, one dominant action.
- Motion communicates input, work, or playback; nothing moves merely to look alive.
- Technical detail is exact but progressively disclosed.

### Things intentionally absent

- Ambient gradient blobs, glowing borders, glass cards, sparkles, rainbow accents, and ornamental ripple fields.
- A giant central orb that consumes the conversation canvas.
- Pill-shaped containers around every noun.
- Multiple nested modal cards with independent shadows.
- provider logos as the dominant visual identity of the product.

### Color roles

Light mode is warm paper and carbon ink; dark mode is neutral graphite rather than blue-black “AI space.” The brand accent is a disciplined cobalt used for selection and action, not illumination.

| Role            |     Light |      Dark | Use                                |
| --------------- | --------: | --------: | ---------------------------------- |
| Canvas          | `#F3F2EE` | `#0D0F12` | app background                     |
| Primary surface | `#FCFBF8` | `#15181D` | dock, sheets, grouped content      |
| Raised surface  | `#FFFFFF` | `#1C2026` | menus, active panels               |
| Ink             | `#17191D` | `#F4F2ED` | primary text                       |
| Secondary ink   | `#60636A` | `#A8ABB2` | metadata                           |
| Hairline        | `#D9D7D1` | `#2C3138` | separation                         |
| Cobalt          | `#315CF5` | `#8098FF` | active process and selection       |
| Cobalt wash     | `#E8ECFF` | `#202A4A` | selected background                |
| Solid action    | `#315CF5` | `#536FD9` | primary action and user message    |
| Success         | `#287E55` | `#5BC18A` | configured/complete                |
| Failure text    | `#D94F45` | `#FF766D` | error and destructive state        |
| Failure fill    | `#C63F37` | `#B93B35` | destructive action with white text |

The semantic repertoire is intentionally small: blue means active or user-owned, green means successful, and red means failed or destructive. Neutral ink and surfaces carry everything else. State is never communicated by color alone; every state also has a label and, where useful, an icon or waveform behavior.

### Typography

- Platform system typography for body, labels, controls, and numbers. Native proportions age better than a conspicuous display font applied everywhere.
- Product wordmark may retain one restrained custom treatment; it does not become the general UI typeface.
- Primary hierarchy: 28/34 page title, 20/26 section title, 17/22 emphasized body, 15/21 body, 13/18 metadata, 11/14 uppercase micro-label only where necessary.
- Sentence case throughout. Avoid marketing-style title case inside operational controls.

### Shape, spacing, and depth

- 4-point base grid; principal steps 8, 12, 16, 24, and 32.
- 12-point control corners, 16-point panels, 22-point sheets. Fully round only for icon and voice buttons.
- Hairline separators and tonal surfaces perform most grouping.
- Shadows appear only on floating dock/sheets and remain low-opacity with a short radius.

### Motion

- 120 ms press feedback, 180 ms control/state transition, 260 ms sheet transition.
- Voice button scales to 0.96 on press. Phase labels crossfade with a four-point vertical shift.
- The waveform is a horizontal signal, sampled and rendered independently from React screen layout.
- Recording uses immediate amplitude response. Playback uses the actual output signal. Processing uses stable phase copy and an ETA instead of fake audio.
- Respect reduced-motion settings by replacing looping transforms with opacity/state changes.
- Hidden surfaces run no animation loop.

## 6. Component contract

- `ConversationWorkspace`: header, route bar, voice dock, orientation-aware separator, transcript canvas.
- `RouteBar`: compact, full-row response mode selector.
- `RouteControls`: native Web Search switch below the route cards.
- `ConversationHeaderControls`: compact Style action beside the transcript title in both orientations.
- `ConversationCanvas`: one transcript implementation shared by empty, active, and historical states.
- `VoiceDock`: the sole owner of idle/recording/processing/speaking controls and its waveform.
- `ConversationLibrary`: responsive full-height sheet/side panel.
- `SettingsNavigator`: overview and drill-in sections using shared settings rows.
- `ProviderConnectionRow`, `ChoiceRow`, `DisclosureRow`, `StatusRow`, and `PreviewInstrument`: the small vocabulary used throughout configuration and setup.

The shell components receive state and callbacks; voice, provider, persistence, and conversation behavior remain in their existing hooks and services.

## 7. Current-state comparison

Evidence reviewed: all 38 supplied screenshots in `~/Desktop/mrbroccoli`, covering empty and populated home states, every processing/playback phase, the conversation surface, history, first-run setup, response-style selection, connections, response routes, listening, speaking, search, and app settings.

### Structural gaps

- The home screen behaves like three stacked demos: a provider/model dashboard, a large voice orb, and a transcript preview. The actual conversation is subordinate and requires a second full-screen surface for typing and reading.
- The voice control consumes roughly a third of the viewport even when idle. Its decorative rings are visually louder than the user’s message, while phase/status information is repeated below it.
- Response routes use tall provider-logo cards. This gives external vendors more visual authority than Mr Broccoli and turns a frequent selector into a large dashboard.
- Typed input exists only in the separate Conversation modal. Voice-first has accidentally become text-hostile rather than simply voice-prioritized.
- Phone history is a partial-width drawer but each conversation is a dense dashboard card. Long titles, multiple provider/model lines, message chips, and start/end columns compete at once.
- Settings is logically grouped, but it presents nearly every group, choice, provider, and readiness state as another rounded card or pill. The hierarchy comes from boxes rather than information.
- First-run setup duplicates the rounded-card/modal language over an already busy home surface instead of feeling like a focused beginning.

### Visual gaps

- Cyan-to-blue gradients, ambient pastel blobs, glow rings, very large corner radii, glass-like layering, and a luminous central orb form the exact commonplace generative-AI visual shorthand the redesign must avoid.
- The palette has too many simultaneous accent roles: blue/cyan gradients, peach background blobs, green playback, orange processing, and blue outer wave rings. State is colorful but not coherent.
- Borders are extremely faint while secondary copy is pale, especially in settings. The result looks soft but loses operational clarity and will age poorly.
- Avenir display styling, wide mono uppercase labels, large title sizes, and oversized controls are mixed without a stable type scale. Screens feel assembled from individually styled modules.
- Most controls are pills, including readiness, filters, language, radio choices, message counts, provider capabilities, action buttons, and transcript affordances. Shape stops conveying meaning when everything has the same shape.
- User messages use a high-saturation gradient while assistant messages are large white cards with always-visible circular actions. The conversation looks like a component gallery instead of a continuous exchange.
- The supplied screenshots prove light mode only. Dark-mode quality therefore remains unverified, not implicitly acceptable.

### What remains valid

- History, route choice, web search, style, setup, and diagnostics are all discoverable.
- Phase names and stop/pause controls are explicit.
- The settings taxonomy—Connections, Thinking, Listening, Speaking, Search, App—is a useful basis even though its presentation and final grouping need refinement.
- Provider validation/readiness, conversation provenance, source links, and memory controls are valuable differentiators and should remain available through progressive disclosure.

### Redesign decisions

- Replace the ambient gradient background with a solid canvas and remove decorative orbs.
- Replace the giant circular stage with a stable voice dock and a horizontal signal treatment.
- Make the transcript the home canvas and remove the redundant expanded-current-conversation view. Keep per-message actions on the home transcript and session-level actions in history.
- Compress route choices into a single upright row, keep Web Search directly below them, and move only Style into the conversation header.
- Simplify messages and settings into editorial rows with fewer containers and visibly stronger text/separators.
- Keep modal/sheet transitions only where they represent a real change of task: configuration and detailed secondary actions.
- Build and visually verify every principal surface in both light and dark mode.

## 8. Implemented design

- Rebuilt the home screen as a conversation workspace: quiet top bar, compact response routes, direct text composer, orientation-aware separation, and a transcript canvas that owns the remaining space.
- Replaced the decorative circular voice stage and ripple system with a horizontal control. Recording and processing use explicit state copy; spoken output renders the real output signal through the native waveform path when available.
- Retained the left session-history drawer with search, switching, rename, pin, delete, share, memory, and New Session. Removed only the redundant expanded-current-conversation modal after promoting the transcript to the home canvas.
- Reworked transcript messages, session actions, memory, pickers, notifications, style controls, and preview controls around solid surfaces, separators, and a smaller radius vocabulary.
- Rebuilt Settings and Guided setup as full-screen, safe-area-aware hierarchies. Guided setup is directly available from Settings by default and can be hidden persistently from its intro screen when launched there.
- Added light and dark Signal & Ink tokens, platform-native typography, stronger muted-text contrast, the blue/green/red semantic state system, WCAG-safe solid action fills, and reduced-motion handling for looping status and replay animation.
- Removed the unused provider toggle, giant waveform circle implementation, ripple/gradient animation helpers, and the `expo-linear-gradient` dependency and native pod.
- Memoized transcript rows and coalesced rapid provider stream chunks to one visual update per animation frame. Final response text remains lossless, stale frame writes are cancelled, and transient streaming state is cleared on every terminal path.
- Added durable reply-without-speech recovery. A completed answer survives a TTS failure and exposes Retry speech plus a direct route to speech settings instead of discarding the turn.
- Normalized web citations to readable hostname labels when providers omit titles, and filtered provider provenance markers across arbitrary stream chunk boundaries before they can reach the transcript, persistence, or TTS.
- Removed six superseded settings modules after the current settings hierarchy replaced them; orchestration, persistence, provider routing, voice capture, playback, and view components remain separated by hooks and services.

## 9. Verification

- Reviewed all 38 supplied screenshots and mapped the complete user-facing capability set before comparing the current screens with the target model.
- Visually exercised the home workspace, session-history drawer, Settings, and Guided setup on an iPhone 14 Plus simulator in light and dark appearance, including accessibility labels, safe-area behavior, cold-thread restoration, replay, pause/resume/stop, and keyless fallback.
- Entered a disposable xAI credential through Mr Broccoli's real Settings UI and exercised two selectable routes (Grok 4.5 with high reasoning and Grok 4.3 with low reasoning), streamed chat, grounded web search with rendered/persisted sources, provider TTS, audible voice preview, reply replay, and the provider-STT upload/error path. A generated xAI speech sample also completed an xAI STT round trip outside the simulator. The credential was then removed through Settings and confirmed absent after a full app reload.
- Exercised an invalid credential in the live app: the submitted message remained durable, the phase returned immediately to idle, the provider error was actionable, and the persisted Retry action completed exactly one reply after valid credentials were restored.
- Verified transcript follow-tail behavior live for restored and streaming conversations. Focused tests cover the complementary interaction contract: user scroll-up suspends following, returning within 48 px of the tail resumes it, a new conversation follows by default, and hidden-modal layout does not lose the initial tail scroll. Streaming growth uses non-animated tail anchoring to avoid overlapping iOS scroll animations.
- Fixed and instrumented the native iOS queue's final-item boundary handling. A 624 ms tail completed in about 655 ms and drained 17 ms later instead of leaving the UI in `Speaking`; long xAI provider speech began roughly 4.8 seconds sooner after smaller first-speech chunks. Native stop tears down immediately, and resume restores the real output waveform from the elapsed position.
- Passed all 89 Jest suites and 599 tests, `npx tsc --noEmit`, `git diff --check`, all 18 `npx expo-doctor` checks, and production Hermes exports for iOS and Android. Focused playback, transcript, provider, routing, persistence, phase, latency, and service tests also passed after their respective final changes.
- Completed Android `testDebugUnitTest` plus `assembleDebug`, a fresh Debug iOS simulator build, and a signed arm64 device build installed and exercised on the paired `hurrtzifon`. Physical-iPhone stop-to-idle measured 0.919 seconds. A 16.4-second speaking-waveform Instruments run reported zero hitches, zero hangs, and nominal thermal state.
- Removed the remaining `xcode -> uuid` build-chain advisory with a scoped `uuid` 11.1.1 override. The real Expo Xcode parser passes against Mr Broccoli's project and `npm audit --omit=dev` now reports zero vulnerabilities.
- Physical speaker playback, voice preview, multiple live provider turns, web search, keyboard avoidance, landscape layout, waveform pacing, and cancellation were exercised successfully. A final user-spoken microphone/STT pass on physical hardware remains advisable because host-to-phone acoustic injection was inconclusive; simulator and generated-audio STT coverage cannot substitute for a human speaking into the device.

## 10. Home hierarchy refinement

- Gave response modes an unhindered full-width area and increased icon size and inner spacing. Upright keeps up to four routes in one non-scrolling row; landscape stacks every configured route as one full-width row in the input pane. Web Search sits below the cards at the trailing edge; Conversation settings remains in the conversation header in both orientations.
- Consolidated idle text and voice input into one composer. Its trailing action is a microphone while the field is empty and becomes Send as soon as meaningful text is entered. Push-to-talk press boundaries remain attached to the shared action; active recording, processing, and playback replace the composer with the existing live waveform and phase controls. Upright places this composer above the transcript rather than visually attaching it to the screen bottom.
- Changed the main Settings action to a gear while retaining sliders for Conversation settings, removing the duplicate icon meaning.
- Visually exercised the populated two-model home, mic-to-send composer switch, and both light and dark themes on the iPhone 14 Plus simulator. Restored dark mode, cleared the draft, removed the temporary xAI credential through Settings, and confirmed the cleanup after reload.

## 11. Final cross-platform closure

- Preserved the configured multi-provider state and exercised successful live turns through Alibaba/Qwen, Mistral, OpenAI, and xAI routes on iOS, plus a live xAI route on Android. Grounded xAI web search persisted and rendered sources. Provider and system speech playback returned naturally to idle.
- Fixed an Android-only playback startup race where system speech could begin after the turn finalizer had already observed an empty queue, leaving the UI stuck in Voice Output. Playback generation IDs now isolate cancelled work, startup counts as pending, and stale callbacks cannot revive an old turn.
- Added a synchronous typed-submission lock shared by new turns and inline retries. Rapid duplicate native events can no longer submit two concurrent requests before React's busy state rerenders. The keyboard now dismisses as soon as a typed turn is accepted.
- Hardened adaptive phase estimates against malformed persisted sample collections and expired route history. Successful milestones still update bounded route/family percentiles; cancellations and errors never poison the learned timing.
- Split `SetupGuideModal` into modal chrome, step content, footer state, shared route copy, styles, and types. Split `ChatBubble` into its shell plus focused message-text, metadata, failure, notice, citation, usage, and action components. Provider manifests and web-search transports remain data/service registries rather than being fragmented solely for line count.
- Declared iOS and Android as the supported Expo platforms so production export no longer implies an unsupported web build. Both mobile Hermes bundles export successfully.

## 12. Model alignment and landscape reduction

- Reserved an equal two-line model-name slot in every response-mode card. One-line and wrapped labels now begin at the same vertical level while remaining centered.
- Reduced landscape to a roughly 30/70 input-and-transcript split, moved the voice stage into the narrower left pane, and gave the transcript the full height of the wider right pane.
- Replaced the right transcript card treatment in landscape with a single vertical hairline and a borderless text canvas. The overall canvas uses sensible edge padding instead of treating the Dynamic Island safe area as the layout boundary.
- Kept Conversation settings in the transcript header. Removed the redundant idle landscape status band; active recording, processing, and playback status remains within the real voice stage with its pause, resume, stop, and detail actions. The filled rounded treatment is reserved for the actual text-and-microphone composer.
- Kept Web Search visible below the route cards even before configuration. The native switch is forced off, functionally disabled, accessibility-disabled, and visually muted until a search provider and a capability-correct credential are configured; speech-only Gemini and ByteDance credentials do not falsely enable it.
- Mirrored landscape's concern separation in upright mode: the composer now completes the upper routing/input workspace, a full-width horizontal hairline begins the conversation area, and the transcript renders as a borderless transparent canvas instead of another rounded outer card. Conversation settings remains in the transcript header.
- Visually verified upright mode and both landscape orientations on an iPhone 14 Plus simulator with four active routes. Conversation settings, Web Search, transcript, and composer remained reachable with the Dynamic Island on either side.

## 13. Full-width transcript rows

- Replaced alternating chat bubbles with full-width editorial rows so transcript copy can use the conversation canvas instead of wrapping inside an arbitrary 88% column.
- User rows use a restrained blue tint, a right-side blue rail, and a trailing `You` label. Assistant rows remain neutral, use a left-side rail, and identify the provider and model with its logo. Message bodies stay left-aligned in both roles, preserving reading rhythm while the opposing rails and labels carry authorship.
- Kept reply recovery, pipeline notices, web citations, token usage, selection, copy, share, and replay inside the same row contract. Secondary information still uses nested cards where grouping is useful; the primary message itself no longer does.
- Preserved row memoization and the transcript's tail-follow contract. Long-press copy now owns the full row hit target rather than only the former bubble width.
- Visually verified adjacent user/assistant rows in populated upright mode and the wider assistant/source treatment in landscape on the iPhone 14 Plus simulator. Web Search remained off and the simulator was restored to upright afterward.
- Tightened the transcript's outer horizontal inset from 12 to 4 points and the row's inner inset from 14 to 12 points. Each turn now has an eight-point inter-message gap and a complete one-point outline in addition to its stronger role rail, so turns are separated by structure and whitespace rather than background color alone.
- Verification: all 88 Jest suites / 590 tests, `npx tsc --noEmit`, targeted Prettier checks, and `git diff --check` pass.

## 14. Restored transcript utilities and search disclosure

- Re-enabled direct native text selection for every home-transcript message. Assistant turns now keep Copy, Share, and Repeat speech controls in a compact, left-aligned action footer; user turns remain selection-capable without redundant whole-message actions.
- Replaced the always-visible web-search summary/source block with an in-message accordion that is collapsed by default. Its compact header shows `Web Search` and the source count; expansion reveals the original query, provider summary, and source links. The former `Used web search` header tag and localization key were removed.
- Simplified message metadata: assistant headers now show only the provider logo plus model name on the left and localized date/time on the right. User headers show localized date/time on the left and `You` on the right. Timestamp formatters are cached per locale rather than recreated for every row.
- Live simulator QA covered populated upright and landscape transcripts, assistant actions, collapsed/expanded web-search evidence, source visibility, provider-name removal, and timestamp placement. The search accordion was returned to collapsed state and the simulator to upright portrait afterward.
- Verification: all 88 Jest suites / 591 tests, `npx tsc --noEmit`, targeted Prettier checks, and `git diff --check` pass.

## 15. Conversation settings and final transcript spacing

- Removed the redundant `Conversation` eyebrow from the transcript header so the saved title is the only heading.
- Renamed Style & Length to Conversation settings. The sheet still owns response length and tone, and now offers a one-off title generator for the active conversation.
- Title generation uses the currently selected provider, model, and effort through the existing non-streaming LLM transport. It sends bounded conversation excerpts plus existing memory in one request, never adds the prompt or result to the transcript, and never invokes web search or speech. The controller aborts on conversation changes/unmount, ignores late results, enforces a 45-second timeout, and persists only to the conversation whose content was submitted.
- Made the assistant action footer smaller, left-aligned, full-width, and separated from message content by a hairline and tonal fill. Increased breathing room around the collapsed web-search accordion.
- Pulled the native Web Search switch six points closer to the route cards in portrait while retaining deliberate breathing room in landscape. Removed the idle-only landscape information band and anchored the real composer to the bottom of the input pane; active status and playback controls still appear from the voice stage when needed.
- Conversation settings uses a scroll-safe upright sheet and a two-column landscape layout so length, tone, title generation, and Done are visible without a hidden initial scroll.
- Live simulator QA covered populated portrait, populated landscape, both settings layouts, action footers, collapsed web-search evidence, route-to-switch spacing, and removal of the idle landscape status band. The one-off title action completed through the configured xAI / Grok 4.5 route and persisted `AI multi-provider active route tests`; the original `Testee` title was then restored through the normal rename flow. Configured providers and conversation messages were preserved, Web Search stayed off, and the simulator was restored to portrait.
- Verification: all 89 Jest suites / 597 tests, `npx tsc --noEmit`, and `git diff --check` pass.

## 16. Landscape route stack

- Narrowed the landscape input pane from roughly 36% to 30% of the workspace, giving the transcript more horizontal reading space.
- Replaced the one-to-three row / four-card grid variants with one consistent vertical stack for every landscape route count. Each route now owns the full pane width, uses a larger provider mark, and centers its model name between equal leading and trailing slots.
- Reduced compact card height to 54 points so four routes, Web Search, and the unified composer fit without scrolling or overlap on the iPhone 14 Plus landscape viewport.
- Added a six-point landscape margin above the native Web Search switch. Portrait retains its tighter existing placement and its four-card horizontal row.
- Live simulator QA covered the populated four-route landscape stack and the unchanged portrait row. Web Search remained off, the `Testee` conversation and configured providers were preserved, and the simulator was restored to portrait.
- Verification: all 89 Jest suites / 598 tests, `npx tsc --noEmit`, and `git diff --check` pass.

## 17. Adaptive route selector and Settings completion

This section supersedes the earlier four-card home-screen layout described in
sections 10, 12, and 16.

- One visible response route uses a spacious full-width card with a large
  provider mark, centered model identity, and restrained effort metadata. Two
  routes use a balanced compact layout; three routes use centered vertical
  cards. Portrait and landscape preserve the same hierarchy while adapting
  spacing to their available width.
- Four or more visible routes collapse into one full-width selector card for
  the active route. Tapping it opens a scrollable bottom sheet with the full
  route list, active-state feedback, effort metadata, a uniformly fading
  backdrop, and safe bottom spacing.
- Settings now uses the Ant Design Native surface under
  `src/features/settings/`, with separate responsive frame, navigation,
  page-routing, and page components. Provider cards use distinct header, body,
  and capability-footer regions; help content opens in standard scrollable
  information modals.
- Outfit is the copy and control typeface. Unica One is limited to the product
  wordmark and major Settings page titles.
- Speaking settings now cover native, provider, and downloaded Kokoro routes;
  global and per-language voice choices; voice previews; and explicitly
  ordered opt-in fallbacks. Native speech remains the terminal route without a
  fallback.
- Home Web Search and Android Settings toggles use platform-native switches
  with theme-aligned colors. Visible custom pressables expose pressed feedback,
  while icon-only actions use standard vector icons and accessibility labels.
- The underlying architecture now separates response-route layouts,
  voice/text input faces, conversation-setting sections, Settings navigation
  and presentation, standard versus Drive Session voice control, persisted
  setting normalization, and voice-pipeline lifecycle stages.
- Verification: 111 Jest suites / 856 tests, `npm run typecheck`, 19 native
  configuration checks, and all 18 Expo Doctor checks pass.
