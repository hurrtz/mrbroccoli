import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { UberModeAuditCard } from "../../src/components/chatBubble/UberModeAuditCard";
import type { Message } from "../../src/types";
import { renderWithProviders } from "../test-utils/renderWithProviders";

describe("UberModeAuditCard", () => {
  it("shows an expandable audit without exposing private contribution text", () => {
    const message: Message = {
      id: "assistant-uber",
      role: "assistant",
      content: "Final answer",
      model: "gpt-5.4",
      provider: "openai",
      timestamp: "2026-08-03T12:00:00.000Z",
      metadata: {
        ulraMode: {
          convergenceReached: false,
          contributions: [
            {
              modeId: "quick",
              model: "gpt-5.4",
              participant: 1,
              provider: "openai",
              round: 0,
              usage: {
                kind: "reply",
                source: "estimated",
                promptTokens: 10,
                completionTokens: 5,
                totalTokens: 15,
              },
            },
            {
              modeId: "quick",
              model: "gpt-5.4",
              participant: 1,
              provider: "openai",
              reviewVerdict: "challenge",
              round: 1,
              usage: {
                kind: "reply",
                source: "estimated",
                promptTokens: 12,
                completionTokens: 4,
                totalTokens: 16,
              },
            },
          ],
          estimatedIntermediateTokens: 31,
          failedCalls: 1,
          failures: [],
          retiredParticipants: 1,
          roundsCompleted: 1,
          roundsRequested: 2,
          successfulCalls: 2,
          synthesisContract: "evidence-ledger-v1",
          synthesisContributions: 2,
          synthesisEstimatedTokens: 31,
          synthesisOmittedContributions: 0,
        },
      },
    };
    const screen = renderWithProviders(<UberModeAuditCard message={message} />);

    expect(screen.getByText("Uber Mode audit")).toBeTruthy();
    expect(
      screen.queryByText("Reviews: 1 challenged · 0 converged · 0 unmarked"),
    ).toBeNull();
    fireEvent.press(screen.getByTestId("uber-audit-toggle-assistant-uber"));

    expect(
      screen.getByText(
        "Full convergence was not reached; material dissent may remain in the final answer.",
      ),
    ).toBeTruthy();
    expect(
      screen.getByText("Reviews: 1 challenged · 0 converged · 0 unmarked"),
    ).toBeTruthy();
    expect(
      screen.getByText("Synthesis contract: evidence-ledger-v1"),
    ).toBeTruthy();
    expect(screen.queryByText("private participant text")).toBeNull();
  });
});
