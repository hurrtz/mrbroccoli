# Surface: chat

The normative description of the transcript and its message anatomy. Components: `components/chat/`.

## The rail, not bubbles

There are no chat bubbles. The message rail is the one structural border in the product: a 3pt edge on the outer side of each message row — accent on the user's right, strong border on the assistant's left. Messages take radius 6. `ChatBubble` renders one row; `ChatTranscript` stacks them; `MessageImageAttachments` carries image attachments inside a row.

Where the transcript appears:

- On the home screen it is demoted to `TranscriptHandle` and opens as a sheet — see `guidelines/surfaces/workspace.md`.
- In landscape it is permanently visible in the right pane.
- `ConversationDrawerItem` renders one conversation (with branch rows) in the drawer.

## Message sub-cards

Seven sub-cards and one modal exist upstream inside `ChatBubble`'s content tree; this system carries all of them, **redesigned to the rail style** — flat hairline-topped sections of the message row instead of the upstream card-in-card boxes:

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

`ChatBubble` accepts them through `children`. Content and behaviour follow the upstream implementations in `MrBroccoli/src/components/chatBubble/` and `ConversationMemoryModal.tsx`; appearance follows this system. All values arrive pre-formatted from the app's locale keys — these components lay text out and never compose it.

The shared grammar: disclosure sections (receipt, search, council) are 44pt toggle rows — accent glyph, display-face title, mono summary, chevron — above label/value content; the usage line is bare mono; failure is the one danger-inked section and sits on the user's message; branches are chips because they are metadata, not speech.

## Register

Spoken replies are a separate register from the transcript: no markdown, no bullets, no headings — full sentences with paragraph breaks that make sense as pauses. The transcript renders what was said; timestamps and token counts take the mono metadata role.
