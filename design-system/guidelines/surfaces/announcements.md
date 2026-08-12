# Surface: announcements

How the product interrupts. One home for the choreography of toasts, in-row notices, and confirmations — the pieces live in `components/overlays/` (`Toast`) and `components/chat/` (`PipelineNotices`, `ReplyFailureCard`).

## The ladder

Three rungs, by how much the user must care. Escalating a rung is a design decision, never a default.

1. **In-row notice** — the problem belongs to one message or one row: reply failure (`ReplyFailureCard` on the user's message), a pipeline stage warning (`PipelineNotices` inside the assistant's row), a provider key gone invalid (status chip on the Connections row). The notice sits **where the user will act**, scrolls with its content, and never floats.
2. **Toast (`Toast`)** — the problem or confirmation is transient and screen-level: a failed provider call outside a turn, a finished export, a completed backup, persistence alerts. Three tones (`info`, `success`, `danger`). Auto-dismisses after four seconds — **unless it carries `onRetry`, then it waits**; an actionable toast that vanishes is a bug. One toast at a time; a newer one replaces the older, never stacks.
3. **Alert/dialog** — destructive confirmations only (delete conversation, discard originals). Platform alert, two actions, destructive one marked.

## Rules

- **Errors during a voice turn never toast.** The turn's own surfaces carry them (`ReplyFailureCard`, `PipelineNotices`, orb overtime) — a toast over the orb would announce the same failure twice.
- Success is quiet: an action whose result is visible (a row renamed, a message sent) gets no toast at all. Toast success only when the evidence is off-screen (export written, backup finished).
- Auto-setup and model downloads announce through `BackgroundTaskBar` and `InstallProgress`, not toasts — long-running work gets a persistent surface, not a repeating transient one.
- Toasts render above the workspace, below sheets: an open sheet's job is focus, so a toast waits for the sheet to close if it isn't about the sheet's own action.
- The stripe and glyph carry the tone; message text stays in the normal text colour (`Toast` already enforces this). No exclamation marks in the copy — the tone colour is the exclamation.
- Spoken announcements (the voice pipeline reading an error aloud) follow `guidelines/content.md`'s spoken register and only fire for turn-level failures the user would otherwise wait on silently.
