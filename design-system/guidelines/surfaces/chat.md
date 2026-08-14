# Surface: chat

The normative description of the transcript and its message anatomy. Components: `components/chat/`.

## The spoken script

The transcript renders a spoken conversation as a script, not as chat bubbles. `TranscriptMessage` renders one row; `ChatTranscript` remains the scrolling container and empty state; `MessageImageAttachments` carries image attachments inside a row.

Row anatomy: a 34pt margin column carries the speaker — YOU in accent for the user, the provider mark for the assistant, “Council of” plus one mark per participating model (duplicates included) for council turns — with a thread line connecting rows. The name line carries model and time; user asks render italic in the secondary colour; there are no boxes and no fills.

**The fold.** Every message clamps to three lines with a plain ellipsis; the fold chevron sits right-aligned on the name line, and tapping the message toggles it. Session-aware defaults: in an ongoing session the latest message arrives expanded and folds when the next turn starts; a reopened past session is entirely collapsed.

**Actions** (branch, copy, share, speak again) appear only on expanded messages, as bare 44pt icon targets — expanding is already the “I care about this one” gesture. The upstream report action is deliberately not carried.

**Metadata.** With usage stats on (Settings → App & diagnostics), one mono meta line sits under each answer, always visible (“3 sources · OpenRouter · 6.4 s”), and is its own disclosure: tapping it opens the full metrics panel — turn details, route, timing, tokens in/out/total, web search and council details. With the setting off, the meta line disappears entirely. The meta line and metrics panel are the transcript's rendering of what `TurnReceiptCard`, `UsageCard`, `WebSearchReferences` and `UberModeAuditCard` carry — those components remain in the system for non-transcript surfaces, but the transcript itself uses the meta disclosure. `ReplyFailureCard` and `PipelineNotices` still mount under a failed or noisy turn; `MessageBranchIndicator` stays as branch metadata.

**Swipe to remove.** Any message swipes away (danger action, “Remove”): removing an irrelevant turn drops it from the context sent with every future request, so tossing redundancy directly saves tokens.

The sheet contract: the transcript opens over the workspace as a plain drawer — grip only, no title, no close control (the conversation name already heads the workspace, and a drawer with a handle closes by pulling it down or tapping the backdrop; this supersedes both the upstream “Hide transcript” text link and this system's earlier grip + name + close header). The conversation settings sheet stays a home-screen surface opened from the settings sentence; the transcript does not duplicate it — auto-naming moved to the sessions drawer's actions sheet.

Where the transcript appears:

- On the home screen it is demoted to `TranscriptHandle` and opens as a sheet — see `guidelines/surfaces/workspace.md`.
- In landscape it is permanently visible in the right pane.

## The sessions drawer

`ConversationDrawerItem` renders one conversation in the drawer. **The fork model is flat**: there is no nesting, no expansion state, and no branch rails — every session, forked or not, is a first-class row sorted by recency. A forked session carries a pill tag naming its root session with a trailing caret (44pt effective touch target around a 32pt pill); tapping it jumps to the root, and it is the drawer's only fork affordance. The upstream nested-tree pieces (`ConversationBranchRail`, branch expansion state, depth indenting) are retired by this design.

Row anatomy, top to bottom: title line (pinned glyph in accent, private glyph in secondary, before the title); one mono meta line `date · N messages · provider marks` — date only with no time of day, one mark per model with duplicates included and no model names; the fork tag on its own row when the session is a fork. The active row is marked by its surface fill alone — no accent rail. Rows swipe to delete; the ellipsis button opens the actions sheet (pin, private, rename, share, archive, delete).

The screen around the rows: the plus CTA is a filled 44pt accent circle in the header (the header's trailing slot); search is a sticky bottom bar in thumb range that rides above the keyboard when focused; sections are raised uppercase bands — Pinned, Earlier, and a trailing Archived group that is collapsed by default and shows its count. Archiving keeps a session without it occupying the everyday list; it lives in the actions sheet (`ConversationActionSheet`), which also carries pin, private, rename (`ConversationRenameModal`), integrity (`ConversationIntegrityModal`), memory, share, copy and delete. Search covers titles, models, and message text — the placeholder says so. **Landscape**: the drawer is a side panel, 44% of the width capped at 520pt, backdrop over the workspace; the layout inside is unchanged — the search bar docks at the panel's bottom edge.

Rows the real data produces, all first-class: untitled sessions use their first message as the title (long, ellipsized at one line); a brand-new session has zero messages and no provider marks. One upstream row element is deliberately not carried: the hollow leading circle — its meaning is unresolved. Open decision: if it marks unread state, it returns as a small accent dot before the title.

## Message sub-cards

Seven sub-cards and one modal exist upstream inside `ChatBubble`'s content tree; this system carries all of them, redesigned — and in the transcript, four of them (receipt, usage, search references, council audit) surface through `TranscriptMessage`'s meta disclosure rather than as in-row cards. The components remain for surfaces that need them standalone (`ChatBubble` still accepts them through `children`); `ChatBubble` itself remains the rail-style message row for non-script contexts:

| Piece | What it carries |
| --- | --- |
| `TurnReceiptCard` | The turn's route, effort, duration and cost |
| `WebSearchReferences` | Sources a searching turn used |
| `UsageCard` | Token counts for the turn |
| `UberModeAuditCard` | Model Council's per-model votes |
| `ReplyFailureCard` | A failed turn, with retry |
| `PipelineNotices` | Warnings the pipeline raised mid-turn |
| `MessageBranchIndicator` | Where a conversation branched |
| `ConversationMemoryModal` | What the conversation remembers |

`ChatBubble` accepts them through `children`. Content and behaviour follow the upstream implementations in `MrBroccoli/src/components/chatBubble/` and `ConversationMemoryModal.tsx`; appearance follows this system. All values arrive pre-formatted from the app's locale keys — these components lay text out and never compose it; the same is true of `TranscriptMessage`'s `meta` string and `metrics` rows.

The shared grammar: disclosure sections (receipt, search, council) are 44pt toggle rows — accent glyph, display-face title, mono summary, chevron — above label/value content; the usage line is bare mono; failure is the one danger-inked section and sits on the user's message; branches are chips because they are metadata, not speech.

## Register

Spoken replies are a separate register from the transcript: no markdown, no bullets, no headings — full sentences with paragraph breaks that make sense as pauses. The transcript renders what was said; timestamps and token counts take the mono metadata role.
