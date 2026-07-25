import {
  fetchMistralVoices,
  MistralVoiceDirectoryError,
} from "../../src/services/mistralVoices";

describe("fetchMistralVoices", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock;
  });

  it("loads, normalizes, deduplicates, and sorts voice slugs", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        items: [
          {
            id: "voice-z",
            name: "Zulu",
            slug: "zulu",
            languages: ["en", "", null],
            gender: "female",
            user_id: null,
          },
          {
            id: "voice-a",
            name: "Alpha",
            slug: "alpha",
            languages: ["de"],
            user_id: "account-1",
          },
          {
            id: "voice-a-duplicate",
            name: "Alpha duplicate",
            slug: "alpha",
          },
          {
            id: "custom-id-without-slug",
            name: "Custom fallback",
            slug: null,
          },
          { name: "Invalid" },
        ],
        total: 5,
      }),
    });

    const voices = await fetchMistralVoices({ apiKey: " test-key " });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toContain("https://api.mistral.ai/v1/audio/voices?");
    expect(url).toContain("limit=10");
    expect(url).toContain("offset=0");
    expect(url).toContain("type=all");
    expect(request).toEqual(
      expect.objectContaining({
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer test-key",
        },
      }),
    );
    expect(voices).toEqual([
      expect.objectContaining({
        id: "voice-a-duplicate",
        name: "Alpha duplicate",
        slug: "alpha",
        value: "alpha",
        label: "Alpha duplicate · alpha",
        isCustom: false,
      }),
      expect.objectContaining({
        id: "custom-id-without-slug",
        slug: null,
        value: "custom-id-without-slug",
        isCustom: false,
      }),
      expect.objectContaining({
        id: "voice-z",
        slug: "zulu",
        value: "zulu",
        languages: ["en"],
        gender: "female",
      }),
    ]);
  });

  it("follows Mistral pagination until the reported total is loaded", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          items: [
            { id: "voice-1", name: "One", slug: "one" },
            { id: "voice-2", name: "Two", slug: "two" },
          ],
          total: 3,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          items: [{ id: "voice-3", name: "Three", slug: "three" }],
          total: 3,
        }),
      });

    const voices = await fetchMistralVoices({ apiKey: "test-key" });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain("offset=2");
    expect(voices).toHaveLength(3);
  });

  it("surfaces a typed error for rejected credentials", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () =>
        JSON.stringify({ message: "The supplied API key is invalid." }),
    });

    await expect(
      fetchMistralVoices({ apiKey: "invalid-key" }),
    ).rejects.toEqual(
      expect.objectContaining<MistralVoiceDirectoryError>({
        name: "MistralVoiceDirectoryError",
        message: "The supplied API key is invalid.",
        status: 401,
      }),
    );
  });

  it("requires a non-empty API key without issuing a request", async () => {
    await expect(fetchMistralVoices({ apiKey: " " })).rejects.toThrow(
      "A Mistral API key is required",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
