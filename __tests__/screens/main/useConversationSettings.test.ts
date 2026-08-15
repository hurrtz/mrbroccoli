import { act, renderHook } from "@testing-library/react-native";

import { useConversationSettings } from "../../../src/screens/main/useConversationSettings";
import type { Conversation } from "../../../src/types";

function conversation(
  id: string,
  settings?: Conversation["settings"],
): Conversation {
  return {
    id,
    title: id,
    createdAt: "2026-07-24T08:00:00.000Z",
    updatedAt: "2026-07-24T08:00:00.000Z",
    messages: [],
    settings,
  };
}

function createProps(activeConversation: Conversation | null) {
  return {
    activeConversation,
    globalAssistantInstructions: "Keep replies spoken-friendly.",
    globalResponseLength: "normal" as const,
    globalResponseTone: "professional" as const,
    globalTtsInstructions: "Speak clearly.",
    globalTtsVoice: "alloy",
    ttsModel: "gpt-4o-mini-tts",
    ttsProvider: "openai" as const,
    clearConversationSettings: jest.fn(() => activeConversation),
    updateConversationSettings: jest.fn(() => activeConversation),
  };
}

describe("useConversationSettings", () => {
  it("resolves persisted overrides only for the active conversation", () => {
    const first = createProps(
      conversation("first", {
        responseLength: "thorough",
        responseTone: "nerdy",
        llmInstructions: "Use examples from distributed systems.",
        ttsInstructions: "Use a warm, optimistic delivery.",
        ttsVoice: {
          provider: "openai",
          model: "gpt-4o-mini-tts",
          voice: "nova",
        },
      }),
    );
    const { result, rerender } = renderHook(
      (props: ReturnType<typeof createProps>) => useConversationSettings(props),
      { initialProps: first },
    );

    expect(result.current.responseLength).toBe("thorough");
    expect(result.current.responseTone).toBe("nerdy");
    expect(result.current.hasOverrides).toBe(true);
    expect(result.current.selectedTtsVoice).toBe("nova");
    expect(result.current.assistantInstructions).toBe(
      "Keep replies spoken-friendly.\n\nUse examples from distributed systems.",
    );
    expect(result.current.effectiveTtsInstructions).toBe(
      "Speak clearly.\n\nUse a warm, optimistic delivery.",
    );

    rerender(createProps(conversation("second")));

    expect(result.current.responseLength).toBe("normal");
    expect(result.current.responseTone).toBe("professional");
    expect(result.current.hasOverrides).toBe(false);
    expect(result.current.selectedTtsVoice).toBe("alloy");
    expect(result.current.assistantInstructions).toBe(
      "Keep replies spoken-friendly.",
    );
    expect(result.current.effectiveTtsInstructions).toBe("Speak clearly.");
  });

  it("does not apply a voice override to a different TTS route", () => {
    const props = createProps(
      conversation("route-change", {
        ttsVoice: {
          provider: "gemini",
          model: "gemini-2.5-flash-preview-tts",
          voice: "Kore",
        },
      }),
    );
    const { result } = renderHook(() => useConversationSettings(props));

    expect(result.current.selectedTtsVoice).toBe("alloy");
  });

  it("persists active-conversation changes without touching global settings", () => {
    const props = createProps(conversation("active"));
    const { result } = renderHook(() => useConversationSettings(props));

    act(() => {
      result.current.updateResponseSettings({ responseTone: "casual" });
      result.current.updateLlmInstructions("Prefer short examples.");
      result.current.updateTtsInstructions("Slow down for numbers.");
      result.current.updateTtsVoice("shimmer");
    });

    expect(props.updateConversationSettings).toHaveBeenCalledWith({
      responseTone: "casual",
    });
    expect(props.updateConversationSettings).toHaveBeenCalledWith({
      llmInstructions: "Prefer short examples.",
    });
    expect(props.updateConversationSettings).toHaveBeenCalledWith({
      ttsInstructions: "Slow down for numbers.",
    });
    expect(props.updateConversationSettings).toHaveBeenCalledWith({
      ttsVoice: {
        provider: "openai",
        model: "gpt-4o-mini-tts",
        voice: "shimmer",
      },
    });
    expect(props.globalResponseTone).toBe("professional");
  });

  it("carries pending overrides into the first message of a new conversation", () => {
    const props = createProps(null);
    const { result } = renderHook(() => useConversationSettings(props));

    act(() => {
      result.current.updateResponseSettings({ responseLength: "brief" });
      result.current.updateLlmInstructions("Answer as a travel planner.");
      result.current.updateTtsVoice("nova");
    });

    expect(result.current.initialConversationSettings).toEqual({
      responseLength: "brief",
      llmInstructions: "Answer as a travel planner.",
      ttsVoice: {
        provider: "openai",
        model: "gpt-4o-mini-tts",
        voice: "nova",
      },
    });
    expect(props.updateConversationSettings).not.toHaveBeenCalled();
  });

  it("clears active and pending overrides so defaults are inherited again", () => {
    const activeProps = createProps(
      conversation("active", { responseLength: "brief" }),
    );
    const active = renderHook(() => useConversationSettings(activeProps));

    act(() => {
      active.result.current.resetConversationSettings();
    });

    expect(activeProps.clearConversationSettings).toHaveBeenCalledTimes(1);

    const pendingProps = createProps(null);
    const pending = renderHook(() => useConversationSettings(pendingProps));
    act(() => {
      pending.result.current.updateResponseSettings({
        responseTone: "casual",
      });
    });
    expect(pending.result.current.hasOverrides).toBe(true);

    act(() => {
      pending.result.current.resetConversationSettings();
    });

    expect(pending.result.current.hasOverrides).toBe(false);
    expect(pending.result.current.responseTone).toBe("professional");
    expect(pending.result.current.initialConversationSettings).toBeUndefined();
  });
});
