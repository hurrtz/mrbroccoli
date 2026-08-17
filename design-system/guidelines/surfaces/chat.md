# Surface: chat

The normative description of the transcript and its message anatomy. Components: `components/chat/`.

## The spoken script

The transcript renders a spoken conversation as a script, not as chat bubbles. `TranscriptMessage` renders one row; `ChatTranscript` remains the scrolling container and empty state; `MessageImageAttachments` carries image attachments inside a row.

Row anatomy: a 34pt margin column carries the speaker — YOU in accent for the user, the provider mark for the assistant, “Council of” plus one mark per participating model (duplicates included) for council turns — with a thread line connecting rows. The name line carries model and time; user asks render italic in the secondary colour; there are no boxes and no fills.

**The fold.** Every message clamps to three lines with a plain ellipsis; the fold chevron sits right-aligned on the name line, and tapping the message toggles it. Session-aware defaults: in an ongoing session the latest message arrives expanded and folds when the next turn starts; a reopened past session is entirely collapsed.

**Actions** are **always present** under every message, expanded or folded, as six bare 44pt icon targets in a fixed order: edit (correct the transcript), branch, copy, share, speak again, report. The copy target confirms with a check for three seconds once the clipboard accepts; speak again becomes stop while that message is speaking and a loading glyph while it prepares. They are not a hover, long-press or expansion affordance. (This supersedes the earlier "actions only while expanded" rule and the earlier omission of the report action — both are settled by the shipped row.)

**Metadata — the turn receipt is a modal.** With usage stats on (Settings → App & diagnostics), a 44pt mono meta line sits under each answer (“3 sources · OpenRouter · 250 s”) ending in an `info-circle` mark; tapping it opens **Turn receipt** as a titled dialogue with a Done action, its label/value rows scrolling inside the card. Nothing expands under the message: the row keeps its height, so the transcript never reflows under your thumb while you read. The receipt carries requested route, actual route (gateway → upstream), effort, the timing chain, estimated usage, the search summary with one row per source, and the council audit. The meta line shows when the row is expanded or too short to fold, and with the setting off there is no meta line at all. (This supersedes the earlier inline metrics panel.) The receipt is the transcript's rendering of what `TurnReceiptCard`, `UsageCard`, `WebSearchReferences` and `UberModeAuditCard` carried upstream. `ReplyFailureCard`, `PipelineNotices`, `MessageBranchIndicator` and the knowledge references mount directly under the row — `TranscriptMessage` renders them itself, with no bubble wrapping them.

**Swipe to remove.** Any message swipes away (danger action, “Remove”): removing an irrelevant turn drops it from the context sent with every future request, so tossing redundancy directly saves tokens.

The sheet contract: the transcript opens over the workspace as a plain drawer — grip, the headline “Transcript,” no close control (the conversation itself is never named here; the byline above the workspace already carries it, and a drawer with a handle closes by pulling it down or tapping the backdrop; this supersedes both the upstream “Hide transcript” text link and this system's earlier grip-only header). The conversation settings sheet stays a home-screen surface opened from the settings sentence; the transcript does not duplicate it — auto-naming moved to the sessions drawer's actions sheet.

Where the transcript appears:

- On the home screen it is demoted to `TranscriptHandle` and opens as a sheet — see `guidelines/surfaces/workspace.md`.
- In landscape it is permanently visible in the right pane.

## The sessions drawer

`ConversationDrawerItem` renders one conversation in the drawer. **The fork model is flat**: there is no nesting, no expansion state, and no branch rails — every session, forked or not, is a first-class row sorted by recency. A forked session carries a pill tag naming its root session with a trailing caret (44pt effective touch target around a 32pt pill); tapping it jumps to the root, and it is the drawer's only fork affordance. The upstream nested-tree pieces (`ConversationBranchRail`, branch expansion state, depth indenting) are retired by this design.

Row anatomy, top to bottom: title line (pinned glyph in accent, private glyph in secondary, before the title); one mono meta line `date · N messages · provider marks` — date only with no time of day, one mark per model with duplicates included and no model names; the fork tag on its own row when the session is a fork. The active row is marked by its surface fill alone — no accent rail. Rows swipe to delete; the ellipsis button opens the session actions menu.

The screen around the rows: the plus CTA is a filled 44pt accent squircle in the header (the header's trailing slot); search is a sticky bottom bar in thumb range that rides above the keyboard when focused; sections are raised uppercase bands — Pinned, Earlier, and a trailing Archived group that is collapsed by default and shows its count. Archiving keeps a session without it occupying the everyday list; it lives in the session actions menu (`AnchoredMenu`): a compact panel anchored to the row’s ellipsis button, no backdrop dim — Organize (pin, archive, private), Identity (rename via `ConversationRenameModal`, name automatically), Out (share, copy), and Delete alone in danger ink at the bottom. Quick verbs are menus; bottom sheets stay reserved for configuration surfaces (owner call, 2026-08 — the earlier `ConversationActionSheet` bottom sheet is retired). “Show root conversation” is deliberately absent: the root tag on the row itself is the fork affordance. **Parked (owner, 2026-08):** integrity review and conversation memory are removed from the drawer and the component set for now, to be revisited. Search covers titles, models, and message text — the placeholder says so. **Landscape**: the drawer is a side panel, 44% of the width capped at 520pt, backdrop over the workspace; the layout inside is unchanged — the search bar docks at the panel's bottom edge.

Rows the real data produces, all first-class: untitled sessions use their first message as the title (long, ellipsized at one line); a brand-new session has zero messages and no provider marks. One upstream row element is deliberately not carried: the hollow leading circle — its meaning is unresolved. Open decision: if it marks unread state, it returns as a small accent dot before the title.

## Message sub-cards

Seven sub-cards exist upstream inside `ChatBubble`'s content tree (plus a conversation-memory modal, parked with the memory feature). Four of them — receipt, usage, search references, council audit — are **not packaged**: their content is the Turn receipt modal, and the components were deleted (`guidelines/past-decisions.md`). Three mount bare under the transcript row. `ChatBubble` itself is mounted by no shipped surface: the app's `ChatBubble.tsx` has no importer, and this system keeps it only for the introduction's stored session, which is drawn in messenger anatomy on purpose so it reads as a memory rather than as the live transcript.

| Piece | What it carries |
| --- | --- |
| `ReplyFailureCard` | A failed turn, with retry |
| `PipelineNotices` | Warnings the pipeline raised mid-turn |
| `MessageBranchIndicator` | Where a conversation branched |

The three survivors need no wrapper. Content and behaviour follow the upstream implementations in `MrBroccoli/src/components/chatBubble/`; appearance follows this system. All values arrive pre-formatted from the app's locale keys — these components lay text out and never compose it; the same is true of `TranscriptMessage`'s `meta` string and `metrics` rows.

The shared grammar: failure is the one danger-inked section and sits on the user's message; notices carry a stage label and their own actions; branches are chips because they are metadata, not speech. Receipt content is mono label/value rows in the modal — the old 44pt disclosure-toggle grammar retires with the four cards.

## Register

Spoken replies are a separate register from the transcript: no markdown, no bullets, no headings — full sentences with paragraph breaks that make sense as pauses. The transcript renders what was said; timestamps and token counts take the mono metadata role.
