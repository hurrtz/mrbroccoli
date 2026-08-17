# Past decisions

Nothing in this file is buildable. It records what the product tried and dropped, so a question that was settled once is not reopened by accident. Every surface doc, component and card describes only the status quo; if you find history anywhere else, move it here.

When something is dropped, its components are **deleted** from the system rather than parked. A retired idea that stays compiled gets used.

## Automatic on-device setup (dropped 2026-08)

One green button measured the phone, proposed three models — one to think with, one to hear the user, one to speak back — showed the total size and a time estimate, then installed all three, with a home-screen row reporting the job from anywhere and a toast where the outcome wasn't already on screen. It appeared in introduction step 2 and at the top of App & diagnostics.

Why it went: it was a second way to do what the stage pages already do one model at a time, and the app never had it — the shipped route is a per-model lifecycle in the page that uses the model (download → cancel → test → use → remove). Two acquisition paths meant two places to state the same truths (what's installed, what fits, what it costs in storage), and the automatic one had to speak for a device it could only guess at. Introduction step 2 now shows the routes themselves; the one required download is the reasoning model, and nothing downloads until the user taps it.

Deleted with it: `AutoSetupCard`, `AutoSetupPlanRow`, `InstallProgress`, `LocalModelPerformanceSummary`, `BackgroundTaskBar`, `guidelines/surfaces/on-device.md`.

Kept from it, as rules: **evidence before verdict** — an on-device claim states how the app knows before what it concludes ("Measured · Viable", never "Viable" alone), and a number that cannot be measured is dropped rather than estimated. That rule now lives in the model rows.

## The violet introduction banner (dropped 2026-08)

A violet card on the home screen advertised the walkthrough, and was the last surface that made the orb step down from 196 to 156. The home screen now advertises nothing: the walkthrough opens by itself on a first launch and is reached afterwards from App & diagnostics → Introduction. The violet-versus-gold question — two ornamental colours competing on one screen — died with it. Deleted: `IntroBanner`.

## Premium upsell surfaces (dropped 2026-08)

A gold band with a sweeping sheen on the settings overview, and a detailed upgrade sheet behind every premium mention. Free edition now shows provider routes as locked ghost rows plus the editions row in App & diagnostics, and that is the whole story; a locked row says what it is when tapped. Deleted: `PremiumBand`, `PremiumUpgradeModal`. The keys-honesty rule survives wherever premium is explained at all: your own keys, billed by the provider, no models or voices or credits included.

## Drive mode as a listening mode (dropped 2026-08)

Hands-free was a third input mode beside push-to-talk and tap-to-talk, with its own dock row on the workspace (Pause auto · Repeat last · Resume auto) and its own orb states. It is now the **Hands free switch** in the composing row — one on/off wrapped around whichever input mode is chosen, live in both directions mid-turn. Listening's input picker has two entries again, and the workspace has no dock row.

## The satellite ring that changed meaning (dropped 2026-08)

The four controls under the orb once swapped their meaning by phase: composing actions at idle, transport verbs during a turn. One row of buttons that means two things is a row you have to read every time. The composing three now stay put and rest at 38% while a turn runs, and the transport verbs live in their own orbit around the orb, whose footprint is permanent so the orb never moves.

## The phase-coloured double ring (dropped 2026-08)

The orb wore two concentric rings, tinted per phase. They told one story twice. One 12pt slate ring remains — a fill meter, never a judgement; the phase colour lives in the disc alone, and red still means late.

## The seven-step introduction wizard (dropped 2026-08)

welcome / requirements / auto / llm / stt / tts / premium, each a page of prose about what the app would do. Replaced by three steps that demonstrate instead: a welcome that plays a real answer, one setup screen, and a test turn the user judges. Deleted with it: `IntroPanel`, `IntroPanelDivider`, `IntroPoint`, `IntroDivider`, `IntroButton`, `IntroVoicePicker`. Premium appears nowhere in the flow — the first premium surface a new user meets is the settings overview, after the app has proven itself.

## The Ant-styled settings recreation (dropped 2026-08)

An eight-page settings tree built from `Ant*` primitives with card-based radio sections, recreating the upstream screens as they were. Replaced by seven pages built from this system's own primitives, split into pages that **decide** (one question each, one unified route picker) and pages that **manage**. The upstream On-device AI page went with it: its parts moved into the stage pages, Listening, Data & privacy, and the walkthrough.

## Message sub-cards inside the bubble (dropped 2026-08)

Four disclosures lived in the assistant bubble's content tree: turn receipt, token usage, web-search references, council audit. Their content is now rows in one **Turn receipt** modal opened from the meta line, so a message stays a message. Deleted: `TurnReceiptCard`, `WebSearchReferences`, `UsageCard`, `UberModeAuditCard`. Three sub-cards survive and mount bare under the transcript row: `ReplyFailureCard`, `PipelineNotices`, `MessageBranchIndicator`.

## Upstream pieces this system does not package (2026-08)

`ResponseModeToggle` (a model switcher with four layouts for one, two, three and four-plus models) and `PhaseAwareVoiceAction` (a phase-coloured voice bar docked at the bottom) are replaced by the orb plus the route byline — one treatment at every model count and every phase, with no small-orb variant to fall back to. `WorkspaceStatusLine` (phase dot · activity · conversation meta under the orb) read as alien and repeated what the orb already showed. `DriveSessionControls` went with drive mode. None of the four were ever built here.
