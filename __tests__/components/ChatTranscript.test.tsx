import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { FlatList, StyleSheet } from "react-native";

import {
  ChatTranscript,
  getTranscriptDistanceFromBottom,
} from "../../src/components/ChatTranscript";
import { Message } from "../../src/types";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";

jest.mock("../../src/components/ChatBubble", () => ({
  ChatBubble: ({ message }: { message: Message }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, message.content);
  },
}));

const message = (id: string, content: string): Message => ({
  id,
  content,
  model: "gpt-5.4",
  provider: "openai",
  role: id.startsWith("user") ? "user" : "assistant",
  timestamp: "2026-07-21T12:00:00.000Z",
});

const hiddenIconQuery = { includeHiddenElements: true } as const;

const scrollEvent = (offsetY: number) => ({
  nativeEvent: {
    contentOffset: { x: 0, y: offsetY },
    contentInset: { bottom: 0, left: 0, right: 0, top: 0 },
    contentSize: { height: 1_000, width: 320 },
    layoutMeasurement: { height: 400, width: 320 },
    zoomScale: 1,
  },
});

describe("ChatTranscript follow-tail scrolling", () => {
  it("renders a passive information icon for an empty transcript", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ChatTranscript messages={[]} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("empty-transcript-icon", hiddenIconQuery).props
          .style,
      ),
    ).toEqual(
      expect.objectContaining({
        color: lightColors.textSecondary,
        width: 24,
        height: 24,
      }),
    );

    // Design-system empty state: the message glyph sits in a quiet 46pt
    // icon-button squircle on the surface color.
    expect(
      StyleSheet.flatten(
        screen.getByTestId("empty-transcript-well", hiddenIconQuery).props
          .style,
      ),
    ).toEqual(
      expect.objectContaining({
        width: 46,
        height: 46,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: lightColors.surface,
      }),
    );
  });

  it("calculates the distance from the visible viewport to the tail", () => {
    expect(getTranscriptDistanceFromBottom(scrollEvent(250).nativeEvent)).toBe(
      350,
    );
    expect(getTranscriptDistanceFromBottom(scrollEvent(800).nativeEvent)).toBe(
      0,
    );
  });

  it("scrolls to the exact checkpoint selected through branch navigation", () => {
    const scrollToIndex = jest
      .spyOn(FlatList.prototype, "scrollToIndex")
      .mockImplementation(() => undefined);

    render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ChatTranscript
            conversationId="branch-conversation"
            messages={[
              message("user-1", "Earlier"),
              message("assistant-1", "Branch checkpoint"),
            ]}
            scrollToMessageRequest={{
              messageId: "assistant-1",
              request: 1,
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(scrollToIndex).toHaveBeenCalledWith({
      animated: true,
      index: 1,
      viewPosition: 0.35,
    });
    scrollToIndex.mockRestore();
  });

  it("expands only a newly arriving message and refolds restored sessions", () => {
    const onCopyMessage = jest.fn();
    const initialMessages = [
      message(
        "assistant-1",
        "This stored answer is deliberately long enough to have a folded transcript state when the conversation is first opened. It stays folded until someone chooses to inspect it.",
      ),
    ];
    const renderTranscript = (conversationId: string, messages: Message[]) => (
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ChatTranscript
            conversationId={conversationId}
            messages={messages}
            onCopyMessage={onCopyMessage}
          />
        </LocalizationProvider>
      </ThemeProvider>
    );
    const screen = render(renderTranscript("conversation-1", initialMessages));

    expect(screen.queryByLabelText("Copy")).toBeNull();

    const messagesWithNewReply = [
      ...initialMessages,
      message(
        "assistant-2",
        "This answer just arrived and therefore opens as the active script row while every earlier message remains folded above it.",
      ),
    ];
    screen.rerender(renderTranscript("conversation-1", messagesWithNewReply));

    expect(screen.getAllByLabelText("Copy")).toHaveLength(1);
    expect(
      screen.getByTestId("transcript-toggle-assistant-2").props
        .accessibilityState,
    ).toEqual({ expanded: true });

    screen.rerender(renderTranscript("conversation-2", messagesWithNewReply));

    expect(screen.queryByLabelText("Copy")).toBeNull();
  });

  it("treats small native layout offsets as still being at the tail", () => {
    const onTailStateChange = jest.fn();
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ChatTranscript
            conversationId="conversation-1"
            messages={[message("user-1", "Hello")]}
            onTailStateChange={onTailStateChange}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );
    const list = screen.getByTestId("chat-transcript-list");

    fireEvent(list, "scrollBeginDrag");
    fireEvent(list, "scroll", scrollEvent(500));
    fireEvent(list, "scrollEndDrag", scrollEvent(500));
    expect(onTailStateChange).toHaveBeenLastCalledWith(false);

    fireEvent(list, "scrollBeginDrag");
    fireEvent(list, "scroll", scrollEvent(560));
    fireEvent(list, "scrollEndDrag", scrollEvent(560));
    expect(onTailStateChange).toHaveBeenLastCalledWith(true);
  });

  it("retries the initial tail scroll after a hidden transcript gets a viewport", () => {
    const scrollToEnd = jest
      .spyOn(FlatList.prototype, "scrollToEnd")
      .mockImplementation(() => undefined);
    const originalRequestAnimationFrame = global.requestAnimationFrame;
    global.requestAnimationFrame = (callback) => {
      callback(0);
      return 1;
    };
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ChatTranscript
            conversationId="restored-conversation"
            messages={[message("user-1", "Stored message")]}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    fireEvent(screen.getByTestId("chat-transcript-list"), "layout", {
      nativeEvent: { layout: { height: 400, width: 320, x: 0, y: 0 } },
    });

    expect(scrollToEnd).toHaveBeenLastCalledWith({ animated: false });
    global.requestAnimationFrame = originalRequestAnimationFrame;
    scrollToEnd.mockRestore();
  });

  it("follows incoming content until the user scrolls up, then resumes at the tail", () => {
    const originalRequestAnimationFrame = global.requestAnimationFrame;
    const originalCancelAnimationFrame = global.cancelAnimationFrame;
    global.requestAnimationFrame = (callback) => {
      callback(0);
      return 1;
    };
    global.cancelAnimationFrame = () => undefined;
    const scrollToEnd = jest
      .spyOn(FlatList.prototype, "scrollToEnd")
      .mockImplementation(() => undefined);
    const firstMessages = [message("user-1", "Hello")];
    const renderTranscript = (messages: Message[]) => (
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ChatTranscript conversationId="conversation-1" messages={messages} />
        </LocalizationProvider>
      </ThemeProvider>
    );
    const screen = render(renderTranscript(firstMessages));
    let list = screen.getByTestId("chat-transcript-list");

    fireEvent(list, "contentSizeChange", 320, 500);
    expect(scrollToEnd).toHaveBeenLastCalledWith({ animated: false });

    fireEvent(list, "scrollBeginDrag");
    fireEvent(list, "scroll", scrollEvent(180));
    fireEvent(list, "scrollEndDrag", scrollEvent(180));
    scrollToEnd.mockClear();

    const secondMessages = [
      ...firstMessages,
      message("assistant-1", "Streaming reply"),
    ];
    screen.rerender(renderTranscript(secondMessages));
    list = screen.getByTestId("chat-transcript-list");
    fireEvent(list, "contentSizeChange", 320, 700);
    expect(scrollToEnd).not.toHaveBeenCalled();

    fireEvent(list, "scrollBeginDrag");
    fireEvent(list, "scroll", scrollEvent(600));
    fireEvent(list, "scrollEndDrag", scrollEvent(600));
    expect(scrollToEnd).not.toHaveBeenCalled();
    scrollToEnd.mockClear();

    screen.rerender(
      renderTranscript([
        ...secondMessages,
        message("assistant-2", "The next reply"),
      ]),
    );
    list = screen.getByTestId("chat-transcript-list");
    fireEvent(list, "contentSizeChange", 320, 900);
    expect(scrollToEnd).toHaveBeenLastCalledWith({ animated: false });

    scrollToEnd.mockRestore();
    global.requestAnimationFrame = originalRequestAnimationFrame;
    global.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it("does not pull back to the tail when a user starts scrolling upward", () => {
    const originalRequestAnimationFrame = global.requestAnimationFrame;
    const originalCancelAnimationFrame = global.cancelAnimationFrame;
    global.requestAnimationFrame = (callback) => {
      callback(0);
      return 1;
    };
    global.cancelAnimationFrame = () => undefined;
    const scrollToEnd = jest
      .spyOn(FlatList.prototype, "scrollToEnd")
      .mockImplementation(() => undefined);
    const firstMessages = [message("user-1", "Hello")];
    const renderTranscript = (messages: Message[]) => (
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ChatTranscript conversationId="conversation-1" messages={messages} />
        </LocalizationProvider>
      </ThemeProvider>
    );
    const screen = render(renderTranscript(firstMessages));
    let list = screen.getByTestId("chat-transcript-list");

    fireEvent(list, "scroll", scrollEvent(600));
    fireEvent(list, "scrollBeginDrag");
    fireEvent(list, "scroll", scrollEvent(595));
    fireEvent(list, "scrollEndDrag", scrollEvent(595));
    scrollToEnd.mockClear();

    screen.rerender(
      renderTranscript([
        ...firstMessages,
        message("assistant-1", "Incoming content while reading above"),
      ]),
    );
    list = screen.getByTestId("chat-transcript-list");
    fireEvent(list, "contentSizeChange", 320, 700);

    expect(scrollToEnd).not.toHaveBeenCalled();

    scrollToEnd.mockRestore();
    global.requestAnimationFrame = originalRequestAnimationFrame;
    global.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it("returns to the tail when the user submits a new prompt", () => {
    const originalRequestAnimationFrame = global.requestAnimationFrame;
    const originalCancelAnimationFrame = global.cancelAnimationFrame;
    global.requestAnimationFrame = (callback) => {
      callback(0);
      return 1;
    };
    global.cancelAnimationFrame = () => undefined;
    const scrollToEnd = jest
      .spyOn(FlatList.prototype, "scrollToEnd")
      .mockImplementation(() => undefined);
    const initialMessages = [
      message("user-1", "First question"),
      message("assistant-1", "First answer"),
    ];
    const renderTranscript = (messages: Message[]) => (
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ChatTranscript conversationId="conversation-1" messages={messages} />
        </LocalizationProvider>
      </ThemeProvider>
    );
    const screen = render(renderTranscript(initialMessages));
    const list = screen.getByTestId("chat-transcript-list");

    fireEvent(list, "scrollBeginDrag");
    fireEvent(list, "scroll", scrollEvent(180));
    fireEvent(list, "scrollEndDrag", scrollEvent(180));
    scrollToEnd.mockClear();

    screen.rerender(
      renderTranscript([
        ...initialMessages,
        message("assistant-2", "Background update"),
      ]),
    );
    expect(scrollToEnd).not.toHaveBeenCalled();

    screen.rerender(
      renderTranscript([
        ...initialMessages,
        message("assistant-2", "Background update"),
        message("user-2", "New question"),
        message("streaming", "New answer"),
      ]),
    );
    expect(scrollToEnd).toHaveBeenLastCalledWith({ animated: false });

    scrollToEnd.mockRestore();
    global.requestAnimationFrame = originalRequestAnimationFrame;
    global.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it("pauses tail following as soon as the user touches the transcript", () => {
    const originalRequestAnimationFrame = global.requestAnimationFrame;
    const originalCancelAnimationFrame = global.cancelAnimationFrame;
    const cancelAnimationFrame = jest.fn();
    global.requestAnimationFrame = () => 37;
    global.cancelAnimationFrame = cancelAnimationFrame;
    const scrollToEnd = jest
      .spyOn(FlatList.prototype, "scrollToEnd")
      .mockImplementation(() => undefined);
    const screen = render(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ChatTranscript
            conversationId="conversation-1"
            messages={[message("user-1", "Hello")]}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );
    const list = screen.getByTestId("chat-transcript-list");

    fireEvent(list, "contentSizeChange", 320, 500);
    cancelAnimationFrame.mockClear();
    fireEvent(list, "touchStart");
    expect(cancelAnimationFrame).toHaveBeenCalledWith(37);
    cancelAnimationFrame.mockClear();
    fireEvent(list, "contentSizeChange", 320, 520);

    expect(cancelAnimationFrame).not.toHaveBeenCalled();
    expect(scrollToEnd).not.toHaveBeenCalled();

    scrollToEnd.mockRestore();
    global.requestAnimationFrame = originalRequestAnimationFrame;
    global.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it("does not report programmatic tail-jump frames as user scrolling away", () => {
    const onTailStateChange = jest.fn();
    const scrollToEnd = jest
      .spyOn(FlatList.prototype, "scrollToEnd")
      .mockImplementation(() => undefined);
    const renderTranscript = (scrollToLatestRequest: number) => (
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <ChatTranscript
            conversationId="conversation-1"
            messages={[message("user-1", "Hello")]}
            onTailStateChange={onTailStateChange}
            scrollToLatestRequest={scrollToLatestRequest}
          />
        </LocalizationProvider>
      </ThemeProvider>
    );
    const screen = render(renderTranscript(0));

    fireEvent(screen.getByTestId("chat-transcript-list"), "scrollBeginDrag");
    fireEvent(
      screen.getByTestId("chat-transcript-list"),
      "scroll",
      scrollEvent(180),
    );
    fireEvent(
      screen.getByTestId("chat-transcript-list"),
      "scrollEndDrag",
      scrollEvent(180),
    );
    expect(onTailStateChange).toHaveBeenLastCalledWith(false);

    screen.rerender(renderTranscript(1));
    expect(onTailStateChange).toHaveBeenLastCalledWith(true);
    onTailStateChange.mockClear();

    fireEvent(
      screen.getByTestId("chat-transcript-list"),
      "scroll",
      scrollEvent(250),
    );

    expect(onTailStateChange).not.toHaveBeenCalled();

    scrollToEnd.mockRestore();
  });
});
