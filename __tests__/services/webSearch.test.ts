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

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

global.fetch = jest.fn();

function fetchBody(callIndex = 0) {
  return JSON.parse((fetch as jest.Mock).mock.calls[callIndex][1].body);
}

describe("webSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetProviderModelHealthForTests();
  });

  it("keeps raw search vendors removed while exposing native search-capable LLM providers", () => {
    expect(WEB_SEARCH_PROVIDER_IDS).toEqual([
      "openai",
      "anthropic",
      "alibaba-qwen-dashscope",
      "bytedance-doubao-seed",
      "gemini",
      "xai",
      "mistral",
      "moonshot-ai-kimi",
      "perplexity",
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
          output: [
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
    ).toEqual(["gemini-3.6-flash", "gemini-3.5-flash"]);
    expect(result?.model).toBe("gemini-3.5-flash");
  });

  it("does not hide exhausted search quota by rotating models", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () =>
        JSON.stringify({
          error: {
            message:
              "You exceeded your current quota. Check your plan and billing details.",
          },
        }),
    });

    await expect(
      searchWeb({
        provider: "gemini",
        apiKey: "gemini-test",
        language: "en",
        query: "What changed today?",
      }),
    ).rejects.toThrow("sufficient API credit");

    expect(fetch).toHaveBeenCalledTimes(1);
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
        expect(body.tools).toEqual([
          expect.objectContaining({
            name: "web_search",
            type: "web_search_20260318",
          }),
        ]);
        expect(
          (body.tools as Array<Record<string, unknown>>)[0],
        ).not.toHaveProperty("response_inclusion");
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
        expect(body.enable_thinking).toBe(false);
        expect(body).not.toHaveProperty("reasoning");
        expect(body.input).toEqual(
          expect.stringContaining("What changed today?"),
        );
      },
      expectedSummary: "Qwen web search found the current answer.",
      expectedSourceUrl: "https://example.com/qwen-search",
    },
    {
      provider: "bytedance-doubao-seed",
      url: "https://ark.cn-beijing.volces.com/api/v3/responses",
      response: {
        output_text: "Doubao web search found the current answer.",
        output: [
          {
            type: "web_search_call",
            action: {
              sources: [
                {
                  title: "Doubao search result",
                  url: "https://example.com/doubao-search",
                },
              ],
            },
          },
        ],
      },
      assertBody: (body: Record<string, unknown>) => {
        expect(body.tools).toEqual([{ type: "web_search" }]);
        expect(body.model).toBe("doubao-seed-2-1-turbo-260628");
      },
      expectedSummary: "Doubao web search found the current answer.",
      expectedSourceUrl: "https://example.com/doubao-search",
    },
    {
      provider: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/interactions",
      response: {
        output: [
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
  ] as Array<{
    provider: WebSearchProvider;
    url: string;
    response: unknown;
    assertBody: (body: Record<string, unknown>) => void;
    expectedSummary: string;
    expectedSourceUrl: string;
  }>)(
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

  it("runs Kimi built-in web search through the required tool handoff", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                finish_reason: "tool_calls",
                message: {
                  role: "assistant",
                  content: null,
                  tool_calls: [
                    {
                      id: "call_1",
                      type: "builtin_function",
                      function: {
                        name: "$web_search",
                        arguments: '{"query":"current answer"}',
                      },
                    },
                  ],
                },
              },
            ],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: "Kimi web search found the current answer.",
                },
              },
            ],
            citations: [
              {
                title: "Kimi search result",
                url: "https://example.com/kimi-search",
              },
            ],
          }),
      });

    const result = await searchWeb({
      provider: "moonshot-ai-kimi",
      apiKey: "kimi-key",
      language: "en",
      query: "What changed today?",
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "https://api.moonshot.ai/v1/chat/completions",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchBody(0)).toEqual(
      expect.objectContaining({
        model: "kimi-k2.6",
        thinking: { type: "disabled" },
        tools: [
          {
            type: "builtin_function",
            function: { name: "$web_search" },
          },
        ],
      }),
    );
    expect(fetchBody(1).messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: "tool",
          tool_call_id: "call_1",
          content: '{"query":"current answer"}',
        }),
      ]),
    );
    expect(result).toEqual(
      expect.objectContaining({
        model: "kimi-k2.6",
        provider: "moonshot-ai-kimi",
        summary: "Kimi web search found the current answer.",
        sources: [
          {
            title: "Kimi search result",
            url: "https://example.com/kimi-search",
          },
        ],
      }),
    );
  });

  it("returns a normalized summary and search_results list for Perplexity", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          model: "sonar",
          choices: [
            {
              message: {
                role: "assistant",
                content:
                  "The latest Perseverance update confirms continued sampling activity.",
              },
            },
          ],
          search_results: [
            {
              title: "NASA Perseverance Rover",
              url: "https://example.com/perseverance",
              date: "2026-03-25",
            },
          ],
          citations: ["https://example.com/perseverance"],
        }),
    });

    const result = await searchWeb({
      provider: "perplexity",
      apiKey: "pplx-test",
      language: "en",
      query: "What is the latest Perseverance rover update?",
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.perplexity.ai/chat/completions",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        model: "sonar",
        provider: "perplexity",
        summary:
          "The latest Perseverance update confirms continued sampling activity.",
        sources: [
          {
            title: "NASA Perseverance Rover",
            url: "https://example.com/perseverance",
          },
        ],
      }),
    );
  });

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

  it("validates the configured provider through the web search service", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [
            {
              message: {
                role: "assistant",
                content: "Today in UTC it is 2026-03-25.",
              },
            },
          ],
          search_results: [],
        }),
    });

    await expect(
      validateWebSearchConnection({
        provider: "perplexity",
        apiKey: "pplx-test",
        language: "en",
      }),
    ).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledWith(
      "https://api.perplexity.ai/chat/completions",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
});
