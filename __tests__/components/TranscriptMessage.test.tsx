import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { TranscriptMessage } from "../../src/components/TranscriptMessage";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";
import type { Message } from "../../src/types";

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
    return React.createElement(
      Text,
      { testID: `provider-icon-${provider}` },
      provider,
    );
  },
}));

const baseMessage: Message = {
  id: "assistant-1",
  role: "assistant",
  content: "A concise answer.",
  model: "gpt-5.4",
  provider: "openai",
  timestamp: "2026-08-13T08:30:00.000Z",
};

// The name line carries the time alone — dates belong to the drawer row and
// the status line, and the design system's transcript shows "14:12" style.
const expectedTime = new Intl.DateTimeFormat("en", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}).format(new Date(baseMessage.timestamp));

function renderMessage(
  overrideProps: Partial<React.ComponentProps<typeof TranscriptMessage>> = {},
) {
  const props: React.ComponentProps<typeof TranscriptMessage> = {
    expanded: false,
    last: false,
    message: baseMessage,
    onToggle: jest.fn(),
    ...overrideProps,
  };

  return render(
    <ThemeProvider mode="light">
      <LocalizationProvider language="en">
        <TranscriptMessage {...props} />
      </LocalizationProvider>
    </ThemeProvider>,
  );
}

describe("TranscriptMessage", () => {
  it("shows the time alone on the name line, never a date", () => {
    const screen = renderMessage();

    expect(screen.getByText(expectedTime)).toBeTruthy();
    expect(screen.queryByText(/\d{2}\/\d{2}\/\d{2}/)).toBeNull();
  });

  it("renders an unboxed script row with a fixed speaker margin", () => {
    const screen = renderMessage({
      message: {
        ...baseMessage,
        id: "user-1",
        role: "user",
        model: null,
        provider: null,
      },
    });

    const rowStyle = StyleSheet.flatten(
      screen.getByTestId("transcript-message-user-1").props.style,
    );
    const speakerStyle = StyleSheet.flatten(
      screen.getByTestId("transcript-speaker-user-1").props.style,
    );
    const body = screen.getByText("A concise answer.");

    expect(screen.getByText("You")).toBeTruthy();
    expect(rowStyle).toEqual(
      expect.objectContaining({ backgroundColor: lightColors.background }),
    );
    expect(rowStyle).not.toHaveProperty("borderWidth");
    expect(rowStyle).not.toHaveProperty("borderRadius");
    expect(speakerStyle.width).toBe(34);
    // The thread line is 1.5pt like the design system's — a hairline all
    // but disappears against the canvas.
    const speaker = screen.getByTestId("transcript-speaker-user-1");
    const threadLine = speaker.children[speaker.children.length - 1];
    expect(
      StyleSheet.flatten(
        (threadLine as unknown as { props: { style: unknown } }).props.style,
      ),
    ).toEqual(expect.objectContaining({ width: 1.5 }));
    expect(StyleSheet.flatten(body.props.style)).toEqual(
      expect.objectContaining({ fontStyle: "italic" }),
    );
    expect(body.props.numberOfLines).toBe(3);
  });

  it("keeps actions outside a collapsed message", () => {
    const onToggle = jest.fn();
    const onCopy = jest.fn(async () => true);
    const screen = renderMessage({ onCopy, onToggle });

    expect(screen.getByLabelText("Copy")).toBeTruthy();
    expect(
      screen.getByTestId("transcript-toggle-assistant-1").props
        .accessibilityState,
    ).toEqual({ expanded: false });

    fireEvent.press(screen.getByTestId("transcript-toggle-assistant-1"));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("shows bare 44-point message actions regardless of fold state", () => {
    const onBranch = jest.fn();
    const onCopy = jest.fn();
    const onShare = jest.fn();
    const onRepeat = jest.fn();
    const screen = renderMessage({
      expanded: false,
      onBranch,
      onCopy,
      onRepeat,
      onShare,
    });

    const actions = [
      ["Branch from here", onBranch],
      ["Copy", onCopy],
      ["Share", onShare],
      ["Repeat Reply", onRepeat],
    ] as const;

    actions.forEach(([label, callback]) => {
      const action = screen.getByLabelText(label);
      expect(StyleSheet.flatten(action.props.style)).toEqual(
        expect.objectContaining({ height: 44, width: 44 }),
      );
      fireEvent.press(action);
      expect(callback).toHaveBeenCalledWith(baseMessage);
    });
  });

  it("copies from the transcript and confirms success in place", async () => {
    const onCopy = jest.fn(async () => true);
    const screen = renderMessage({ onCopy });

    fireEvent.press(screen.getByTestId("transcript-copy-assistant-1"));

    expect(onCopy).toHaveBeenCalledWith(baseMessage);
    await waitFor(() =>
      expect(screen.getByLabelText("Message copied.")).toBeTruthy(),
    );
    expect(
      screen.getByTestId("phosphor-icon-check", {
        includeHiddenElements: true,
      }),
    ).toBeTruthy();
  });

  it("keeps metadata inside expanded content and opens full metrics in a modal", () => {
    const message = {
      ...baseMessage,
      content:
        "This answer is deliberately long enough to fold. Its compact metadata belongs inside the expanded content while the action bar remains available outside of it for quick transcript actions.",
      metadata: {
        webSearch: {
          provider: "openai" as const,
          model: "gpt-5.4-mini",
          query: "What changed this week?",
          summary: "Several relevant updates shipped this week.",
          sources: [
            {
              title: "Release notes",
              url: "https://example.com/release-notes",
            },
          ],
        },
      },
      usage: {
        kind: "reply" as const,
        source: "estimated" as const,
        promptTokens: 120,
        completionTokens: 30,
        totalTokens: 150,
      },
    };
    const collapsed = renderMessage({
      showUsageStats: true,
      message,
    });

    expect(collapsed.queryByTestId("transcript-meta-assistant-1")).toBeNull();
    collapsed.unmount();

    const screen = renderMessage({
      expanded: true,
      showUsageStats: true,
      message,
    });

    expect(
      StyleSheet.flatten(
        screen.getByTestId("transcript-meta-assistant-1").props.style,
      ),
    ).toEqual(expect.objectContaining({ minHeight: 44 }));
    expect(screen.queryByTestId("transcript-metrics-assistant-1")).toBeNull();

    fireEvent.press(screen.getByTestId("transcript-meta-assistant-1"));

    expect(screen.getByTestId("transcript-metrics-assistant-1")).toBeTruthy();
    expect(screen.getByText("Estimated Usage")).toBeTruthy();
    expect(screen.getByText("Est. 120 in · 30 out · 150 total")).toBeTruthy();
    expect(screen.getByText("Several relevant updates shipped this week.")).toBeTruthy();
    expect(
      screen.getByText("Release notes · https://example.com/release-notes"),
    ).toBeTruthy();
    expect(screen.queryByText("Search query")).toBeNull();
    expect(screen.queryByText("What changed this week?")).toBeNull();
  });

  it("renders one council provider mark per participant and exposes swipe removal", () => {
    const onRemove = jest.fn();
    const screen = renderMessage({
      onRemove,
      message: {
        ...baseMessage,
        metadata: {
          ulraMode: {
            contributions: [
              {
                modeId: "reviewer-1",
                model: "gpt-5.4",
                participant: 1,
                provider: "openai",
                round: 1,
                usage: {
                  kind: "reply",
                  source: "estimated",
                  promptTokens: 10,
                  completionTokens: 5,
                  totalTokens: 15,
                },
              },
              {
                modeId: "reviewer-2",
                model: "gpt-5.4",
                participant: 2,
                provider: "openai",
                round: 1,
                usage: {
                  kind: "reply",
                  source: "estimated",
                  promptTokens: 10,
                  completionTokens: 5,
                  totalTokens: 15,
                },
              },
            ],
            estimatedIntermediateTokens: 30,
            failedCalls: 0,
            failures: [],
            roundsCompleted: 1,
            roundsRequested: 1,
            successfulCalls: 2,
          },
        },
      },
    });

    expect(screen.getByText("Council")).toBeTruthy();
    expect(screen.getAllByTestId("provider-icon-openai")).toHaveLength(3);

    fireEvent.press(screen.getByTestId("transcript-remove-assistant-1"));
    expect(onRemove).toHaveBeenCalledWith(
      expect.objectContaining({ id: "assistant-1" }),
    );
  });
});
