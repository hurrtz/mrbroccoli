import React from "react";
import { Alert, FlatList, Modal, StyleSheet } from "react-native";
import { fireEvent, waitFor, within } from "@testing-library/react-native";

import { ConversationDrawer } from "../../src/components/ConversationDrawer";
import { ConversationDrawerList } from "../../src/components/conversationDrawer/ConversationDrawerList";
import { ConversationMeta } from "../../src/types";
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

  it("shows action feedback inside the drawer instead of behind it", () => {
    // Auto-naming completes while the drawer modal is still open; deferring
    // its toast to the workspace layer hid both success and failure.
    const onDismissToast = jest.fn();
    const screen = renderConversationDrawer({
      toast: { message: "Conversation renamed.", tone: "success" },
      onDismissToast,
    });

    expect(screen.getByText("Conversation renamed.")).toBeTruthy();
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
    ).toEqual(expect.objectContaining({ height: 44, borderRadius: 12 }));
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
      const menu = within(screen.getByTestId("conversation-action-menu"));
      for (const label of [
        "Pin",
        "Rename",
        "Name automatically",
        "Archive",
        "Share",
        "Copy",
        "Delete",
      ]) {
        expect(menu.getByLabelText(label).props.accessibilityRole).toBe(
          "menuitem",
        );
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

  it("opens quick verbs as an anchored menu, not a dimmed sheet", async () => {
    const screen = renderConversationDrawer();

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));
    const panel = await screen.findByTestId("conversation-action-menu");

    expect(StyleSheet.flatten(panel.props.style)).toEqual(
      expect.objectContaining({ position: "absolute", width: 252 }),
    );
    const pin = screen.getByTestId("conversation-action-toggle-pin");
    expect(StyleSheet.flatten(pin.props.style)).toEqual(
      expect.objectContaining({ minHeight: 44 }),
    );
    // Delete stays last and alone, in danger ink.
    expect(screen.getByTestId("conversation-action-delete")).toBeTruthy();
  });
  it("closes the menu through a decorative click-away layer", async () => {
    const screen = renderConversationDrawer();

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));
    const backdrop = await screen.findByTestId(
      "conversation-action-backdrop",
      hiddenIconQuery,
    );
    expect(backdrop.props.accessible).toBe(false);
    expect(backdrop.props.importantForAccessibility).toBe("no");

    fireEvent.press(backdrop);
    expect(screen.queryByTestId("conversation-action-menu")).toBeNull();
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
