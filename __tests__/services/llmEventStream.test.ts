import AsyncStorage from "@react-native-async-storage/async-storage";

import { readEventStream } from "../../src/services/llm/eventStream";
import { streamChat } from "../../src/services/llm";
import { resetProviderModelHealthForTests } from "../../src/services/providerResilience";
import {
  RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY,
  resetRuntimeCapabilityOverridesForTests,
} from "../../src/services/runtimeCapabilityOverrides";
import { Message } from "../../src/types";

global.fetch = jest.fn();

const mockMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Hello",
    model: null,
    provider: null,
    timestamp: "2026-01-01T00:00:00Z",
  },
];

beforeEach(async () => {
  jest.clearAllMocks();
  resetProviderModelHealthForTests();
  await AsyncStorage.removeItem(RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY);
  resetRuntimeCapabilityOverridesForTests();
});

describe("readEventStream cancellation", () => {
  it("cancels the reader when the event handler throws", async () => {
    const encoder = new TextEncoder();
    const cancelled = jest.fn();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode("data: first\n\n"));
        controller.enqueue(encoder.encode("data: second\n\n"));
        // Deliberately left open: an abandoned reader would leave this
        // connection alive.
      },
      cancel: cancelled,
    });

    await expect(
      readEventStream(stream, () => {
        throw new Error("handler failure");
      }),
    ).rejects.toThrow("handler failure");

    expect(cancelled).toHaveBeenCalledTimes(1);
  });

  it("does not disturb a normally completed stream", async () => {
    const encoder = new TextEncoder();
    const events: string[] = [];
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode("data: one\n\ndata: two\n\n"));
        controller.close();
      },
    });

    await readEventStream(stream, (event) => {
      events.push(event.data);
    });

    expect(events).toEqual(["one", "two"]);
  });
});

describe("streamChat transport cancellation", () => {
  it("aborts the transport when an in-stream error ends the turn", async () => {
    const encoder = new TextEncoder();
    const cancelled = jest.fn();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          encoder.encode('data: {"error":{"message":"Rate limit exceeded"}}\n\n'),
        );
        // Stream intentionally not closed: the provider would keep
        // generating on a real connection.
      },
      cancel: cancelled,
    });
    let requestSignal: AbortSignal | undefined;
    (fetch as jest.Mock).mockImplementationOnce(
      async (_url: string, options: { signal?: AbortSignal }) => {
        requestSignal = options.signal;
        return { ok: true, body: stream };
      },
    );
    const onError = jest.fn();

    await streamChat({
      messages: mockMessages,
      model: "qwen3.7-plus-2026-05-26",
      provider: "alibaba-qwen-dashscope",
      apiKey: "qwen-test-key|us",
      assistantInstructions: "",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      onChunk: () => {},
      onDone: () => {},
      onError,
    });

    expect(onError).toHaveBeenCalled();
    expect(cancelled).toHaveBeenCalled();
    expect(requestSignal?.aborted).toBe(true);
  });
});
