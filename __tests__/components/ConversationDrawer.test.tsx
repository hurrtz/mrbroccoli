import React from "react";
import { Alert, FlatList, Modal, StyleSheet } from "react-native";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { ConversationDrawer } from "../../src/components/ConversationDrawer";
import { ConversationDrawerList } from "../../src/components/conversationDrawer/ConversationDrawerList";
import { ConversationMeta } from "../../src/types";
import type { ConversationIntegrityInspection } from "../../src/services/conversationIntegrity";
import { renderWithProviders } from "../test-utils/renderWithProviders";

const hiddenIconQuery = { includeHiddenElements: true } as const;

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("react-native-gesture-handler", () => ({
  Swipeable: ({
    children,
    renderRightActions,
  }: {
    children: React.ReactNode;
    renderRightActions?: () => React.ReactNode;
  }) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, null, children, renderRightActions?.());
  },
}));

jest.mock("../../src/components/ProviderIcon", () => ({
  ProviderIcon: ({ provider }: { provider: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, provider);
  },
}));

const conversations: ConversationMeta[] = [
  {
    id: "one",
    title: "Morning briefing",
    createdAt: "2026-03-20T08:00:00.000Z",
    updatedAt: "2026-03-20T08:15:00.000Z",
    messageCount: 4,
    providers: ["openai"],
    providerModels: { openai: ["gpt-5.4"] },
    lastModel: "gpt-5.4",
    lastProvider: "openai",
    pinned: false,
  },
  {
    id: "two",
    title: "Travel planning",
    createdAt: "2026-03-20T09:00:00.000Z",
    updatedAt: "2026-03-20T09:30:00.000Z",
    messageCount: 7,
    providers: ["anthropic"],
    providerModels: { anthropic: ["claude-sonnet-4-5"] },
    lastModel: "claude-sonnet-4-5",
    lastProvider: "anthropic",
    pinned: true,
  },
];

function renderConversationDrawer(
  overrideProps: Partial<React.ComponentProps<typeof ConversationDrawer>> = {},
) {
  return renderWithProviders(
    <ConversationDrawer
      visible
      conversations={conversations}
      activeId="one"
      onSearchConversations={jest.fn(async (query: string) =>
        conversations.filter((conversation) =>
          conversation.title.toLowerCase().includes(query.toLowerCase()),
        ),
      )}
      onSelect={jest.fn()}
      onCopyThread={jest.fn()}
      onShareThread={jest.fn()}
      onManageMemory={jest.fn()}
      onInspectIntegrity={jest.fn(async () => null)}
      onRepairIntegrity={jest.fn(async () => null)}
      onUndoIntegrityRepair={jest.fn(async () => null)}
      onExportIntegrityOriginals={jest.fn()}
      onRenameThread={jest.fn()}
      onTogglePinned={jest.fn()}
      onTogglePrivate={jest.fn()}
      onToggleArchived={jest.fn()}
      onAutoName={jest.fn()}
      onNewSession={jest.fn(async () => undefined)}
      onDelete={jest.fn()}
      onClose={jest.fn()}
      {...overrideProps}
    />,
  );
}

describe("ConversationDrawer", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does not mount the native modal while the drawer is hidden", () => {
    const screen = renderConversationDrawer({ visible: false });

    expect(screen.UNSAFE_queryByType(Modal)).toBeNull();
  });

  it("renders the drawer shell and existing conversations", () => {
    const screen = renderConversationDrawer();

    expect(
      StyleSheet.flatten(screen.getByText("Conversations").props.style),
    ).toEqual(
      expect.objectContaining({
        fontFamily: "UnicaOne_400Regular",
        fontSize: 20,
        textAlign: "center",
      }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("conversation-drawer-close").props.style,
      ).borderWidth,
    ).toBeUndefined();
    expect(screen.getByText("Morning briefing")).toBeTruthy();
    expect(screen.getByText("Travel planning")).toBeTruthy();
    expect(
      screen.getByLabelText("Morning briefing").props.accessibilityState,
    ).toEqual({ selected: true });
    expect(screen.getAllByLabelText("Conversation actions")).toHaveLength(2);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("conversation-drawer-menu-one").props.style,
      ),
    ).toEqual(expect.objectContaining({ height: 44, width: 44 }));
    expect(
      StyleSheet.flatten(
        screen.getByTestId("conversation-drawer-menu-one").props.style,
      ).borderWidth,
    ).toBeUndefined();
    expect(
      screen.getAllByTestId("phosphor-icon-ellipsis-vertical", hiddenIconQuery),
    ).toHaveLength(2);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("conversation-drawer-new-session").props.style,
      ),
    ).toEqual(expect.objectContaining({ height: 44, borderRadius: 22 }));
    // Header controls sit 14pt apart and the docked search keeps the kit's
    // 26pt clearance even without a bottom safe-area inset.
    expect(
      StyleSheet.flatten(
        screen.getByTestId("conversation-drawer-header").props.style,
      ),
    ).toEqual(expect.objectContaining({ gap: 14 }));
    expect(
      StyleSheet.flatten(
        screen.getByTestId("conversation-drawer-search-dock").props.style,
      ),
    ).toEqual(expect.objectContaining({ paddingBottom: 26 }));
  });

  it("exposes every conversation action as a labeled button", async () => {
    const screen = renderConversationDrawer();

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));

    await waitFor(() => {
      for (const label of [
        "Pin",
        "Rename",
        "Name automatically",
        "Archive",
        "Memory",
        "Review conversation integrity",
        "Share",
        "Copy",
        "Delete",
      ]) {
        expect(
          screen
            .getAllByLabelText(label)
            .every((control) => control.props.accessibilityRole === "button"),
        ).toBe(true);
      }
    });
  });

  it("filters conversations through async search", async () => {
    const onSearchConversations = jest.fn(async () => [conversations[1]]);
    const screen = renderConversationDrawer({ onSearchConversations });

    fireEvent.changeText(
      screen.getByTestId("conversation-drawer-search-input"),
      "travel",
    );

    await waitFor(() => {
      expect(onSearchConversations).toHaveBeenCalledWith("travel");
      expect(
        screen
          .UNSAFE_getByType(FlatList)
          .props.data.filter(
            (entry: { kind: string }) => entry.kind === "conversation",
          )
          .map(
            ({ conversation }: { conversation: ConversationMeta }) =>
              conversation,
          ),
      ).toEqual([conversations[1]]);
    });
  });

  it("renders forks as flat rows with a root-session tag", () => {
    const onSelectConversation = jest.fn();
    const child: ConversationMeta = {
      ...conversations[1],
      id: "child",
      title: "Branched explanation",
      pinned: false,
      branch: {
        rootConversationId: "one",
        parentConversationId: "one",
        parentMessageId: "message-2",
        branchMessageId: "child-message-2",
        kind: "continue-from-message",
        createdAt: "2026-03-20T08:20:00.000Z",
      },
    };
    const screen = renderWithProviders(
      <ConversationDrawerList
        activeId="child"
        conversations={[child, conversations[0]]}
        searchQuery=""
        onDeleteConversation={jest.fn()}
        onOpenActionConversation={jest.fn()}
        onSelectConversation={onSelectConversation}
      />,
    );
    const rows = screen
      .UNSAFE_getByType(FlatList)
      .props.data.filter(
        (entry: { kind: string }) => entry.kind === "conversation",
      );

    expect(
      rows.map(
        ({ conversation }: { conversation: ConversationMeta }) =>
          conversation.id,
      ),
    ).toEqual(["child", "one"]);
    expect(screen.queryByTestId("conversation-branch-rail-one")).toBeNull();
    expect(screen.queryByTestId("conversation-branch-toggle-one")).toBeNull();
    expect(screen.getAllByText("Morning briefing")).toHaveLength(2);

    fireEvent.press(screen.getByTestId("conversation-drawer-root-child"));
    expect(onSelectConversation).toHaveBeenCalledWith("one");
  });

  it("groups pinned and earlier sessions while keeping archived sessions collapsed", () => {
    const archived: ConversationMeta = {
      ...conversations[0],
      id: "archived",
      title: "Old research",
      archived: true,
    };
    const screen = renderWithProviders(
      <ConversationDrawerList
        activeId="one"
        conversations={[conversations[1], conversations[0], archived]}
        searchQuery=""
        onDeleteConversation={jest.fn()}
        onOpenActionConversation={jest.fn()}
        onSelectConversation={jest.fn()}
      />,
    );

    const visibleConversationIds = () =>
      screen
        .UNSAFE_getByType(FlatList)
        .props.data.filter(
          (entry: { kind: string }) => entry.kind === "conversation",
        )
        .map(
          ({ conversation }: { conversation: ConversationMeta }) =>
            conversation.id,
        );

    expect(screen.getByText("Pinned")).toBeTruthy();
    expect(screen.getByText("Earlier")).toBeTruthy();
    expect(screen.getByText("Archived · 1")).toBeTruthy();
    expect(visibleConversationIds()).toEqual(["two", "one"]);

    fireEvent.press(screen.getByTestId("conversation-section-archived"));
    expect(visibleConversationIds()).toEqual(["two", "one", "archived"]);
  });

  it("can open directly with archived sessions expanded", () => {
    const archived: ConversationMeta = {
      ...conversations[0],
      id: "archived",
      title: "Old research",
      archived: true,
    };
    const screen = renderWithProviders(
      <ConversationDrawerList
        activeId="one"
        archivedInitiallyExpanded
        conversations={[conversations[0], archived]}
        searchQuery=""
        onDeleteConversation={jest.fn()}
        onOpenActionConversation={jest.fn()}
        onSelectConversation={jest.fn()}
      />,
    );

    expect(
      screen.getByTestId("conversation-section-archived").props
        .accessibilityState,
    ).toMatchObject({ expanded: true });
    expect(screen.getByText("Old research")).toBeTruthy();
  });

  it("tightens the empty state for a landscape drawer", () => {
    const screen = renderWithProviders(
      <ConversationDrawerList
        activeId={null}
        compact
        conversations={[]}
        searchQuery=""
        onDeleteConversation={jest.fn()}
        onOpenActionConversation={jest.fn()}
        onSelectConversation={jest.fn()}
      />,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("conversation-drawer-empty-state").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        gap: 7,
        marginTop: 4,
        paddingVertical: 12,
      }),
    );
  });

  it("opens the rename modal from the action sheet and saves the new title", async () => {
    const onRenameThread = jest.fn();
    const screen = renderConversationDrawer({ onRenameThread });

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));

    await waitFor(() => {
      expect(screen.getByTestId("conversation-action-rename")).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId("conversation-action-rename"));
    fireEvent.changeText(
      screen.getByTestId("conversation-rename-input"),
      "Renamed briefing",
    );
    fireEvent.press(screen.getByTestId("conversation-rename-save"));

    expect(onRenameThread).toHaveBeenCalledWith("one", "Renamed briefing");
  });

  it("shows a root action only on forked sessions and navigates to the root", async () => {
    const onSelect = jest.fn();
    const forked: ConversationMeta = {
      ...conversations[0],
      id: "fork-1",
      title: "Fork of the briefing",
      branch: {
        rootConversationId: "one",
        parentConversationId: "one",
        parentMessageId: "m1",
        branchMessageId: "m2",
        kind: "edited-prompt",
        createdAt: "2026-03-21T08:00:00.000Z",
      },
    };
    const screen = renderConversationDrawer({
      conversations: [...conversations, forked],
      onSelect,
    });

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-fork-1"));
    const rootAction = await screen.findByTestId(
      "conversation-action-show-root",
    );
    fireEvent.press(rootAction);
    expect(onSelect).toHaveBeenCalledWith("one");

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));
    await waitFor(() => {
      expect(screen.getByTestId("conversation-action-rename")).toBeTruthy();
    });
    expect(screen.queryByTestId("conversation-action-show-root")).toBeNull();
  });

  it("groups the sheet's actions in one card with dividers, not islands", async () => {
    const screen = renderConversationDrawer();

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));
    const pinRow = await screen.findByTestId("conversation-action-toggle-pin");

    const rowStyle = StyleSheet.flatten(pinRow.props.style);
    expect(rowStyle.borderWidth).toBeUndefined();
    expect(rowStyle.borderRadius).toBeUndefined();
    expect(rowStyle.borderBottomWidth).toBe(StyleSheet.hairlineWidth);

    const deleteStyle = StyleSheet.flatten(
      screen.getByTestId("conversation-action-delete").props.style,
    );
    expect(deleteStyle.borderBottomWidth).toBeUndefined();
  });

  it("keeps the action-sheet backdrop decorative and provides an explicit close action", async () => {
    const screen = renderConversationDrawer();

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));

    const backdrop = await screen.findByTestId(
      "conversation-action-backdrop",
      hiddenIconQuery,
    );
    expect(backdrop.props.accessible).toBe(false);
    expect(backdrop.props.accessibilityElementsHidden).toBe(true);
    expect(backdrop.props.importantForAccessibility).toBe("no");

    fireEvent.press(screen.getByTestId("conversation-action-close"));
    expect(screen.queryByTestId("conversation-action-rename")).toBeNull();
  });

  it("marks a conversation private from its action sheet", async () => {
    const onTogglePrivate = jest.fn();
    const screen = renderConversationDrawer({ onTogglePrivate });

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));
    fireEvent.press(
      await screen.findByTestId("conversation-action-toggle-private"),
    );

    expect(onTogglePrivate).toHaveBeenCalledWith("one");
  });

  it("archives and automatically names a conversation from its action sheet", async () => {
    const onToggleArchived = jest.fn();
    const onAutoName = jest.fn();
    const screen = renderConversationDrawer({
      onToggleArchived,
      onAutoName,
    });

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));
    fireEvent.press(
      await screen.findByTestId("conversation-action-toggle-archive"),
    );
    expect(onToggleArchived).toHaveBeenCalledWith("one");

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));
    fireEvent.press(await screen.findByTestId("conversation-action-auto-name"));
    expect(onAutoName).toHaveBeenCalledWith("one");
  });

  it("previews, exports, and repairs a damaged assistant response", async () => {
    const originalContent = [
      "Keep this answer.",
      "",
      "SOURCE 2 — Earlier conversation",
      "User: hidden prompt",
    ].join("\n");
    const finding = {
      kind: "assistant-internal-context" as const,
      markerIds: ["source-header", "serialized-speaker"],
      messageId: "assistant-1",
      originalContent,
      removedContent: "SOURCE 2 — Earlier conversation\nUser: hidden prompt",
      suggestedContent: "Keep this answer.",
    };
    const issueInspection: ConversationIntegrityInspection = {
      conversation: {
        id: "one",
        title: "Morning briefing",
        createdAt: "2026-03-20T08:00:00.000Z",
        updatedAt: "2026-03-20T08:15:00.000Z",
        messages: [],
      },
      repairSnapshot: null,
      report: {
        automaticallyRepairableCount: 1,
        conversationId: "one",
        findings: [finding],
      },
    };
    const repairedInspection: ConversationIntegrityInspection = {
      ...issueInspection,
      repairSnapshot: {
        conversationId: "one",
        repairedAt: "2026-03-20T08:16:00.000Z",
        messages: [
          {
            messageId: "assistant-1",
            originalContent,
            repairedContent: "Keep this answer.",
          },
        ],
      },
      report: {
        automaticallyRepairableCount: 0,
        conversationId: "one",
        findings: [],
      },
    };
    const onInspectIntegrity = jest
      .fn()
      .mockResolvedValueOnce(issueInspection)
      .mockResolvedValueOnce(repairedInspection);
    const onRepairIntegrity = jest.fn(async () => ({ repaired: true }));
    const onExportIntegrityOriginals = jest.fn();
    const screen = renderConversationDrawer({
      onInspectIntegrity,
      onRepairIntegrity,
      onExportIntegrityOriginals,
    });

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));
    fireEvent.press(
      await screen.findByTestId("conversation-action-review-integrity"),
    );

    expect(
      await screen.findByText("1 potentially damaged response found."),
    ).toBeTruthy();
    expect(screen.getByText("Keep this answer.")).toBeTruthy();
    fireEvent.press(screen.getByTestId("conversation-integrity-export"));
    expect(onExportIntegrityOriginals).toHaveBeenCalledWith(originalContent);

    fireEvent.press(screen.getByTestId("conversation-integrity-repair"));
    await waitFor(() => {
      expect(onRepairIntegrity).toHaveBeenCalledWith("one");
      expect(
        screen.getByText(
          "Repair complete. The original is stored locally for export or undo.",
        ),
      ).toBeTruthy();
    });
    expect(screen.getByTestId("conversation-integrity-undo")).toBeTruthy();
  });

  it("starts a new session and closes the drawer", async () => {
    const onNewSession = jest.fn(async () => undefined);
    const onClose = jest.fn();
    const screen = renderConversationDrawer({ onNewSession, onClose });

    fireEvent.press(screen.getByTestId("conversation-drawer-new-session"));

    await waitFor(() => {
      expect(onNewSession).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("requires destructive confirmation before deleting a conversation", async () => {
    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation(() => undefined);
    const onDelete = jest.fn();
    const screen = renderConversationDrawer({ onDelete });

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));
    fireEvent.press(await screen.findByTestId("conversation-action-delete"));

    expect(onDelete).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      "Delete “Morning briefing”?",
      "This permanently deletes the conversation and all its messages. This action cannot be undone.",
      expect.arrayContaining([
        expect.objectContaining({ text: "Cancel", style: "cancel" }),
        expect.objectContaining({ text: "Delete", style: "destructive" }),
      ]),
    );

    const cancelAction = alertSpy.mock.calls[0]?.[2]?.find(
      (action) => action.style === "cancel",
    );
    cancelAction?.onPress?.();
    expect(onDelete).not.toHaveBeenCalled();

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));
    fireEvent.press(await screen.findByTestId("conversation-action-delete"));

    const destructiveAction = alertSpy.mock.calls[1]?.[2]?.find(
      (action) => action.style === "destructive",
    );
    destructiveAction?.onPress?.();
    expect(onDelete).toHaveBeenCalledWith("one");
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("also confirms deletion from a swiped session row", () => {
    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation(() => undefined);
    const onDelete = jest.fn();
    const screen = renderConversationDrawer({ onDelete });

    fireEvent.press(screen.getByTestId("conversation-drawer-delete-two"));

    expect(onDelete).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      "Delete “Travel planning”?",
      expect.any(String),
      expect.arrayContaining([
        expect.objectContaining({ text: "Delete", style: "destructive" }),
      ]),
    );

    const destructiveAction = alertSpy.mock.calls[0]?.[2]?.find(
      (action) => action.style === "destructive",
    );
    destructiveAction?.onPress?.();
    expect(onDelete).toHaveBeenCalledWith("two");
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
