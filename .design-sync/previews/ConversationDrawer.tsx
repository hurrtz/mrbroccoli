import React from "react";
import { ConversationDrawer } from "mrbroccoli";

// ConversationDrawer renders a real RN <Modal> (raw react-native, not the DS
// Modal) — on react-native-web that portals to a full-viewport overlay, so
// there is no bounded "card" to wrap it in; the drawer paints its own opaque
// surface. It needs {"cardMode":"single","viewport":"..."} to be captured
// correctly (see learnings). Authored open regardless, per the brief.

const conversationMeta = (
  id: string,
  title: string,
  overrides: Record<string, unknown> = {},
) => ({
  id,
  title,
  createdAt: "2026-08-05T08:00:00.000Z",
  updatedAt: "2026-08-09T07:42:00.000Z",
  messageCount: 6,
  providers: ["anthropic"],
  providerModels: { anthropic: ["claude-sonnet-5"] },
  lastModel: "claude-sonnet-5",
  lastProvider: "anthropic",
  pinned: false,
  ...overrides,
});

// None of these fire during a static render (the search box starts empty,
// so onSearchConversations is never invoked), but every ConversationDrawer
// prop is required except onDismiss, so real-shaped stubs are needed for a
// clean compile.
const handlers = {
  onSearchConversations: async () => [],
  onSelect: async () => {},
  onCopyThread: () => {},
  onShareThread: () => {},
  onManageMemory: () => {},
  onInspectIntegrity: async () => null,
  onRepairIntegrity: async () => undefined,
  onUndoIntegrityRepair: async () => undefined,
  onExportIntegrityOriginals: () => {},
  onRenameThread: () => {},
  onTogglePinned: () => {},
  onTogglePrivate: () => {},
  onNewSession: async () => {},
  onDelete: () => {},
  onClose: () => {},
};

export const Populated = () => (
  <ConversationDrawer
    visible
    activeId="c1"
    conversations={[
      conversationMeta("c1", "Airport route for tomorrow", {
        updatedAt: "2026-08-09T07:42:00.000Z",
        messageCount: 4,
        pinned: true,
      }),
      conversationMeta("c2", "Weekend trip to Lisbon", {
        updatedAt: "2026-08-08T19:05:00.000Z",
        messageCount: 12,
        providers: ["openai"],
        providerModels: { openai: ["gpt-5.6-sol"] },
        lastModel: "gpt-5.6-sol",
        lastProvider: "openai",
      }),
      conversationMeta("c3", "Private journal check-in", {
        updatedAt: "2026-08-07T22:15:00.000Z",
        messageCount: 8,
        isPrivate: true,
        providers: ["gemini"],
        providerModels: { gemini: ["gemini-3.6-flash"] },
        lastModel: "gemini-3.6-flash",
        lastProvider: "gemini",
      }),
      conversationMeta("c4", "Grocery list for the week", {
        updatedAt: "2026-08-06T11:30:00.000Z",
        messageCount: 3,
        providers: ["xai"],
        providerModels: { xai: ["grok-4.5"] },
        lastModel: "grok-4.5",
        lastProvider: "xai",
      }),
    ]}
    {...handlers}
  />
);

export const WithBranch = () => (
  <ConversationDrawer
    visible
    activeId="b2"
    conversations={[
      conversationMeta("b1", "Trip budget planning", {
        updatedAt: "2026-08-08T10:00:00.000Z",
        messageCount: 9,
      }),
      conversationMeta("b2", "Trip budget — extra hotel night", {
        updatedAt: "2026-08-08T10:04:00.000Z",
        messageCount: 3,
        branch: {
          rootConversationId: "b1",
          parentConversationId: "b1",
          parentMessageId: "b1-m5",
          branchMessageId: "b2-m1",
          kind: "alternative-response",
          createdAt: "2026-08-08T10:04:00.000Z",
        },
        branchSchemaVersion: 2,
      }),
    ]}
    {...handlers}
  />
);

export const EmptyState = () => (
  <ConversationDrawer visible activeId={null} conversations={[]} {...handlers} />
);
