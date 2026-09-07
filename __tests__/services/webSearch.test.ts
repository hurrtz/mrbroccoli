import {
  searchWeb,
  validateWebSearchConnection,
} from "../../src/services/webSearch";
import {
  DEFAULT_WEB_SEARCH_PROVIDER_SETTINGS,
  getWebSearchProviderModel,
  type WebSearchProvider,
  WEB_SEARCH_PROVIDER_IDS,
  WEB_SEARCH_PROVIDER_KIND,
  WEB_SEARCH_PROVIDER_MODEL_CANDIDATES,
  WEB_SEARCH_PROVIDER_MODELS,
  WEB_SEARCH_TIMEOUT_MS_BY_PROVIDER,
} from "../../src/constants/webSearch";
import { resetProviderModelHealthForTests } from "../../src/services/providerResilience";
import {
  RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY,
  resetRuntimeCapabilityOverridesForTests,
} from "../../src/services/runtimeCapabilityOverrides";

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

global.fetch = jest.fn();

function fetchBody(callIndex = 0) {
  return JSON.parse((fetch as jest.Mock).mock.calls[callIndex][1].body);
}

describe("webSearch", () => {
  beforeEach(async () => {
    await AsyncStorage.removeItem(RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY);
    jest.clearAllMocks();
    resetProviderModelHealthForTests();
    resetRuntimeCapabilityOverridesForTests();
  });

  it("keeps raw search vendors removed while exposing native search-capable LLM providers", () => {
    expect(WEB_SEARCH_PROVIDER_IDS).toEqual([
      "openai",
      "anthropic",
      "alibaba-qwen-dashscope",
      "gemini",
      "xai",
      "mistral",
    ]);
    expect(WEB_SEARCH_PROVIDER_IDS).toEqual(
      expect.not.arrayContaining([
        "brave",
        "exa",
        "firecrawl",
        "serpapi",
        "tavily",
      ]),
    );

    for (const provider of WEB_SEARCH_PROVIDER_IDS) {
      expect(WEB_SEARCH_PROVIDER_MODELS[provider]).toBeTruthy();
      expect(WEB_SEARCH_PROVIDER_MODEL_CANDIDATES[provider][0]).toBe(
        WEB_SEARCH_PROVIDER_MODELS[provider],
      );
      expect(WEB_SEARCH_PROVIDER_KIND[provider]).toBe("grounded-answer");
      expect(WEB_SEARCH_TIMEOUT_MS_BY_PROVIDER[provider]).toBeGreaterThan(0);
      expect(DEFAULT_WEB_SEARCH_PROVIDER_SETTINGS[provider]).toEqual(
        expect.objectContaining({
          resultLimit: 5,
          depth: "standard",
          searchMode: "balanced",
        }),
      );
    }
  });

  it("returns a normalized summary and source list for OpenAI web search", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          output_text: "Mars has water ice near its poles.",
          output: [
            {
              type: "web_search_call",
              action: {
                sources: [
                  {
                    title: "NASA Mars Overview",
                    url: "https://example.com/nasa-mars",
                  },
                ],
              },
            },
          ],
        }),
    });

    const result = await searchWeb({
      provider: "openai",
      apiKey: "sk-test",
      language: "en",
      query: "Does Mars have water ice?",
      options: {
        resultLimit: 5,
        depth: "standard",
        searchMode: "deep",
      },
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/responses",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"search_context_size":"high"'),
      }),
    );
    expect(fetchBody().tool_choice).toBe("required");
    expect(result).toEqual(
      expect.objectContaining({
        model: "gpt-5.6-sol",
        provider: "openai",
        summary: "Mars has water ice near its poles.",
        sources: [
          {
            title: "NASA Mars Overview",
            url: "https://example.com/nasa-mars",
          },
        ],
      }),
    );
    expect(result?.context).toContain("Does Mars have water ice?");
  });

  it("fails over to another search-capable model after a model retirement", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () =>
          JSON.stringify({
            error: {
              message:
                "Model gemini-3.6-flash is not found or is no longer available.",
            },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          steps: [
            {
              type: "google_search_call",
              arguments: { queries: ["What changed today?"] },
            },
            {
              type: "google_search_result",
              result: [],
            },
            {
              type: "model_output",
              content: [
                {
                  text: "Recovered current answer.",
                  annotations: [
                    {
                      title: "Recovered source",
                      url: "https://example.com/recovered",
                    },
                  ],
                },
              ],
            },
          ],
        }),
      });

    const result = await searchWeb({
      provider: "gemini",
      apiKey: "gemini-test",
      language: "en",
      query: "What changed today?",
    });

    expect(
      (fetch as jest.Mock).mock.calls.map(
        ([, options]) => JSON.parse(options.body).model,
      ),
    ).toEqual(["gemini-3.6-flash", "gemini-3.8-flash"]);
    expect(result?.model).toBe("gemini-3.8-flash");
  });

  it("tries another search-capable model after generic quota exhaustion", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () =>
          JSON.stringify({
            error: {
              message:
                "You exceeded your current quota. Check your plan and billing details.",
            },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          steps: [
            {
              type: "google_search_call",
              arguments: { queries: ["What changed today?"] },
            },
            {
              type: "google_search_result",
              result: [],
            },
            {
              type: "model_output",
              content: [
                {
                  text: "Recovered current answer.",
                  annotations: [
                    {
                      title: "Recovered source",
                      url: "https://example.com/recovered",
                    },
                  ],
                },
              ],
            },
          ],
        }),
      });

    const result = await searchWeb({
      provider: "gemini",
      apiKey: "gemini-test",
      language: "en",
      query: "What changed today?",
    });

    expect(
      (fetch as jest.Mock).mock.calls.map(
        ([, options]) => JSON.parse(options.body).model,
      ),
    ).toEqual(["gemini-3.6-flash", "gemini-3.8-flash"]);
    expect(result?.model).toBe("gemini-3.8-flash");
  });

  it("uses a readable hostname when a provider only returns a citation URL", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          output_text: "The source confirms the current answer.",
          output: [
            {
              type: "web_search_call",
              action: {
                sources: [
                  {
                    url: "https://www.example.com/very/long/source/path",
                  },
                ],
              },
            },
          ],
        }),
    });

    const result = await searchWeb({
      provider: "xai",
      apiKey: "xai-test",
      language: "en",
      query: "What changed today?",
    });

    expect(result?.sources).toEqual([
      {
        title: "example.com",
        url: "https://www.example.com/very/long/source/path",
      },
    ]);
  });

  it.each([
    {
      provider: "anthropic",
      url: "https://api.anthropic.com/v1/messages",
      response: {
        content: [
          {
            type: "web_search_tool_result",
            content: [
              {
                title: "Claude search result",
                url: "https://example.com/claude-search",
              },
            ],
          },
          {
            type: "text",
            text: "Anthropic web search found the current answer.",
          },
        ],
      },
      assertBody: (body: Record<string, unknown>) => {
        expect(body.max_tokens).toBe(420);
        expect(body.output_config).toEqual({ effort: "low" });
        expect(body.tool_choice).toEqual({
          type: "tool",
          name: "web_search",
        });
        expect(body.tools).toEqual([
          expect.objectContaining({
            allowed_callers: ["direct"],
            max_uses: 5,
            name: "web_search",
            type: "web_search_20260318",
          }),
        ]);
        expect((body.tools as Record<string, unknown>[])[0]).not.toHaveProperty(
          "response_inclusion",
        );
      },
      expectedSummary: "Anthropic web search found the current answer.",
      expectedSourceUrl: "https://example.com/claude-search",
    },
    {
      provider: "alibaba-qwen-dashscope",
      url: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/responses",
      response: {
        output: [
          {
            type: "web_search_call",
            id: "qwen_search_1",
            status: "completed",
            action: {
              type: "search",
              query: "What changed today?",
              sources: [
                {
                  type: "url",
                  url: "https://example.com/qwen-search",
                },
              ],
            },
          },
          {
            type: "message",
            role: "assistant",
            status: "completed",
            content: [
              {
                type: "output_text",
                text: "Qwen web search found the current answer.",
              },
            ],
          },
        ],
      },
      assertBody: (body: Record<string, unknown>) => {
        expect(body.model).toBe("qwen3.7-plus-2026-05-26");
        expect(body.tools).toEqual([{ type: "web_search" }]);
        expect(body.tool_choice).toBe("required");
        expect(body.reasoning).toEqual({ effort: "none" });
        expect(body).not.toHaveProperty("enable_thinking");
        expect(body.input).toEqual(
          expect.stringContaining("What changed today?"),
        );
      },
      expectedSummary: "Qwen web search found the current answer.",
      expectedSourceUrl: "https://example.com/qwen-search",
    },
    {
      provider: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/interactions",
      response: {
        steps: [
          {
            type: "google_search_call",
            arguments: {
              queries: ["What changed today?"],
            },
          },
          {
            type: "google_search_result",
            result: [],
          },
          {
            type: "model_output",
            content: [
              {
                text: "Gemini web search found the current answer.",
                annotations: [
                  {
                    title: "Gemini search result",
                    url: "https://example.com/gemini-search",
                  },
                ],
              },
            ],
          },
        ],
      },
      assertBody: (body: Record<string, unknown>) => {
        expect(body.tools).toEqual([{ type: "google_search" }]);
        expect(body.model).toBe("gemini-3.6-flash");
        expect(body.store).toBe(false);
      },
      expectedSummary: "Gemini web search found the current answer.",
      expectedSourceUrl: "https://example.com/gemini-search",
    },
    {
      provider: "xai",
      url: "https://api.x.ai/v1/responses",
      response: {
        output_text: "xAI web search found the current answer.",
        output: [
          {
            type: "web_search_call",
            action: {
              sources: [
                {
                  title: "xAI search result",
                  url: "https://example.com/xai-search",
                },
              ],
            },
          },
        ],
      },
      assertBody: (body: Record<string, unknown>) => {
        expect(body.tools).toEqual([{ type: "web_search" }]);
        expect(body.tool_choice).toBe("required");
        expect(body.model).toBe("grok-4.3");
        expect(body.store).toBe(false);
      },
      expectedSummary: "xAI web search found the current answer.",
      expectedSourceUrl: "https://example.com/xai-search",
    },
    {
      provider: "mistral",
      url: "https://api.mistral.ai/v1/conversations",
      response: {
        outputs: [
          {
            type: "message.output",
            content: [
              {
                type: "text",
                text: "Mistral web search found the current answer.",
              },
              {
                type: "tool_reference",
                title: "Mistral search result",
                url: "https://example.com/mistral-search",
              },
            ],
          },
        ],
      },
      assertBody: (body: Record<string, unknown>) => {
        expect(body.tools).toEqual([{ type: "web_search" }]);
        expect(body.store).toBe(false);
        expect(body.model).toBe("mistral-medium-3-5");
      },
      expectedSummary: "Mistral web search found the current answer.",
      expectedSourceUrl: "https://example.com/mistral-search",
    },
  ] as {
    provider: WebSearchProvider;
    url: string;
    response: unknown;
    assertBody: (body: Record<string, unknown>) => void;
    expectedSummary: string;
    expectedSourceUrl: string;
  }[])(
    "uses the native web search route for $provider",
    async ({
      provider,
      url,
      response,
      assertBody,
      expectedSummary,
      expectedSourceUrl,
    }) => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(response),
      });

      const result = await searchWeb({
        provider,
        apiKey: "provider-key",
        language: "en",
        query: "What changed today?",
      });

      expect(fetch).toHaveBeenCalledWith(
        url,
        expect.objectContaining({ method: "POST" }),
      );
      assertBody(fetchBody());
      expect(result).toEqual(
        expect.objectContaining({
          model: getWebSearchProviderModel(provider),
          provider,
          summary: expectedSummary,
          sources: [
            expect.objectContaining({
              url: expectedSourceUrl,
            }),
          ],
        }),
      );
    },
  );

  it("skips provider requests for blank queries", async () => {
    const result = await searchWeb({
      provider: "openai",
      apiKey: "sk-test",
      language: "en",
      query: "   ",
    });

    expect(result).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects a Qwen response that did not run the web search tool", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          output: [
            {
              type: "message",
              role: "assistant",
              status: "completed",
              content: [
                {
                  type: "output_text",
                  text: "An ungrounded answer.",
                },
              ],
            },
          ],
        }),
    });

    await expect(
      searchWeb({
        provider: "alibaba-qwen-dashscope",
        apiKey: "dashscope-test|us",
        language: "en",
        query: "What changed today?",
      }),
    ).rejects.toThrow(
      "Alibaba / Qwen returned a response without running web search.",
    );
  });

  it("rejects an Anthropic response that did not run the web search tool", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          content: [
            {
              type: "text",
              text: "An answer from model memory.",
            },
          ],
        }),
    });

    await expect(
      searchWeb({
        provider: "anthropic",
        apiKey: "anthropic-test",
        language: "en",
        query: "What changed today?",
      }),
    ).rejects.toThrow(
      "Anthropic returned a response without running web search.",
    );
  });

  it("gives Grok 4.6 search reasoning headroom", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 400, text: async () => JSON.stringify({ error: { message: "Model grok-4.3 is no longer available" } }) }).mockResolvedValueOnce({ ok: true, json: async () => ({ output_text: "Current evidence", output: [{ type: "web_search_call", status: "completed", action: { sources: [{ url: "https://example.com/evidence" }] } }] }) });
    await searchWeb({ provider: "xai", apiKey: "test", language: "en", query: "Current evidence?", maxOutputTokens: 120 });
    const body = JSON.parse((fetch as jest.Mock).mock.calls[1][1].body);
    expect(body).toMatchObject({ model: "grok-4.6", max_output_tokens: 4096, reasoning: { effort: "low" }, store: false });
  });

  it("rejects a Gemini response that did not run Google Search", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          status: "completed",
          steps: [
            {
              type: "model_output",
              content: [
                {
                  type: "text",
                  text: "An answer from model memory.",
                },
              ],
            },
          ],
        }),
    });

    await expect(
      searchWeb({
        provider: "gemini",
        apiKey: "gemini-test",
        language: "en",
        query: "What changed today?",
      }),
    ).rejects.toThrow("Google returned a response without running web search.");
  });

  it.each([
    ["openai", "sk-test"],
    ["xai", "xai-test"],
  ] as const)("rejects an ungrounded %s response", async (provider, apiKey) => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          output_text: "An answer from model memory.",
          output: [
            {
              type: "message",
              content: [
                {
                  type: "output_text",
                  text: "An answer from model memory.",
                },
              ],
            },
          ],
        }),
    });

    await expect(
      searchWeb({
        provider,
        apiKey,
        language: "en",
        query: "What happened today?",
      }),
    ).rejects.toThrow("returned a response without running web search");
  });

  it("validates Qwen only after a completed web search call", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          output: [
            {
              type: "web_search_call",
              id: "qwen_validation_search",
              status: "completed",
              action: {
                type: "search",
                query: "current UTC time",
                sources: [
                  {
                    type: "url",
                    url: "https://example.com/current-time",
                  },
                ],
              },
            },
            {
              type: "message",
              role: "assistant",
              status: "completed",
              content: [
                {
                  type: "output_text",
                  text: "The current UTC time is available from the source.",
                },
              ],
            },
          ],
        }),
    });

    await expect(
      validateWebSearchConnection({
        provider: "alibaba-qwen-dashscope",
        apiKey: "dashscope-test|us",
        language: "en",
      }),
    ).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledWith(
      "https://dashscope-us.aliyuncs.com/compatible-mode/v1/responses",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
import AsyncStorage from "@react-native-async-storage/async-storage";

describe("web search result and cancellation boundaries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetProviderModelHealthForTests();
    resetRuntimeCapabilityOverridesForTests();
  });

  it("does not validate a completed search with no usable evidence brief", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        output: [{ type: "web_search_call", status: "completed" }],
      }),
    });
    await expect(
      validateWebSearchConnection({
        provider: "openai",
        apiKey: "test-key",
        language: "en",
      }),
    ).rejects.toThrow();
  });

  it("reserves reasoning headroom before asking OpenAI for an evidence brief", async () => {
    (fetch as jest.Mock).mockImplementation(async (_url, init) => {
      const body = JSON.parse(init.body);
      const budgetCanProduceBrief =
        body.max_output_tokens >= 4096 && body.reasoning?.effort === "low";
      return {
        ok: true,
        json: async () => ({
          output: [{ type: "web_search_call", status: "completed" }],
          output_text: budgetCanProduceBrief
            ? "Current evidence from the completed search."
            : "",
        }),
      };
    });
    await expect(
      searchWeb({
        provider: "openai",
        apiKey: "test-key",
        language: "en",
        query: "News today",
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        summary: "Current evidence from the completed search.",
      }),
    );
  });

  it.each([true, false])(
    "bounds a stalled %s response body by the search deadline",
    async (ok) => {
      jest.useFakeTimers();
      try {
        const requestSignals: AbortSignal[] = [];
        let bodyStarted!: () => void;
        const started = new Promise<void>((resolve) => {
          bodyStarted = resolve;
        });
        (fetch as jest.Mock).mockImplementation(async (_url, init) => {
          requestSignals.push(init.signal);
          const readBody = () => {
            bodyStarted();
            return new Promise(() => {});
          };
          return { ok, status: ok ? 200 : 503, json: readBody, text: readBody };
        });
        const request = searchWeb({
          provider: "openai",
          apiKey: "test-key",
          language: "en",
          query: "News today",
        });
        const rejection = expect(request).rejects.toMatchObject({
          failureKind: "timeout",
        });
        await started;
        await jest.runAllTimersAsync();
        expect(requestSignals.length).toBeGreaterThan(0);
        expect(requestSignals.every((signal) => signal.aborted)).toBe(true);
        await rejection;
      } finally {
        jest.useRealTimers();
      }
    },
  );

  it("does not label an Anthropic tool failure as live web evidence", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [
          {
            type: "web_search_tool_result",
            content: {
              type: "web_search_tool_result_error",
              error_code: "unavailable",
            },
          },
          {
            type: "text",
            text: "I could not search; here is what I already know.",
          },
        ],
      }),
    });
    await expect(
      searchWeb({
        provider: "anthropic",
        apiKey: "test-key",
        language: "en",
        query: "News today",
      }),
    ).rejects.toThrow();
  });

  it("keeps cancellation connected while the response body is pending", async () => {
    const controller = new AbortController();
    let requestSignal: AbortSignal | undefined;
    let bodyStarted!: () => void;
    const started = new Promise<void>((resolve) => {
      bodyStarted = resolve;
    });
    (fetch as jest.Mock).mockImplementation(async (_url, init) => {
      requestSignal = init.signal;
      return {
        ok: true,
        json: () => {
          bodyStarted();
          return new Promise(() => {});
        },
      };
    });
    const request = searchWeb({
      provider: "openai",
      apiKey: "test-key",
      language: "en",
      query: "News today",
      abortSignal: controller.signal,
    });
    const rejection = expect(request).rejects.toThrow("Stopped");
    await started;
    controller.abort(new Error("Stopped"));
    expect(requestSignal?.aborted).toBe(true);
    await rejection;
  });
});
