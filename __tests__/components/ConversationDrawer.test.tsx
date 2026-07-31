import React from "react";
import { Alert, FlatList, Modal, StyleSheet } from "react-native";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { ConversationDrawer } from "../../src/components/ConversationDrawer";
import { ConversationDrawerList } from "../../src/components/conversationDrawer/ConversationDrawerList";
import { ConversationMeta } from "../../src/types";
import { renderWithProviders } from "../test-utils/renderWithProviders";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@expo/vector-icons", () => ({
  Feather: ({ name }: { name: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, name);
  },
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
      onRenameThread={jest.fn()}
      onTogglePinned={jest.fn()}
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

    expect(screen.getByText("Conversations")).toBeTruthy();
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
  });

  it("exposes every conversation action as a labeled button", async () => {
    const screen = renderConversationDrawer();

    fireEvent.press(screen.getByTestId("conversation-drawer-menu-one"));

    await waitFor(() => {
      for (const label of [
        "Pin",
        "Rename",
        "Memory",
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
      expect(screen.UNSAFE_getByType(FlatList).props.data).toEqual([
        conversations[1],
      ]);
    });
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
