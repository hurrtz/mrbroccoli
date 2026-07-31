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
  role: id.startsWith("user") ? "user" : "assistant",
  timestamp: "2026-07-21T12:00:00.000Z",
});

const scrollEvent = (offsetY: number) => ({
  nativeEvent: {
    contentOffset: { x: 0, y: offsetY },
    contentSize: { height: 1_000, width: 320 },
    layoutMeasurement: { height: 400, width: 320 },
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
        screen.getByTestId("empty-transcript-icon").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        color: lightColors.textSecondary,
        fontSize: 24,
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
          <ChatTranscript
            conversationId="conversation-1"
            messages={messages}
          />
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
          <ChatTranscript
            conversationId="conversation-1"
            messages={messages}
          />
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

    fireEvent(
      screen.getByTestId("chat-transcript-list"),
      "scrollBeginDrag",
    );
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
