import {
  ElevenLabsVoiceDirectoryError,
  fetchElevenLabsVoices,
} from "../../src/services/elevenLabsVoices";

describe("fetchElevenLabsVoices", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock;
  });

  it("loads, normalizes, deduplicates, and sorts account voices", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        voices: [
          {
            voice_id: "voice-z",
            name: "Zulu",
            category: "premade",
            labels: { accent: "British", gender: "female" },
            description: "Narration",
            preview_url: "https://example.com/zulu.mp3",
          },
          {
            voice_id: "voice-a",
            name: "Alpha",
            labels: { accent: "American" },
          },
          {
            voice_id: "voice-a",
            name: "Alpha updated",
            labels: {},
          },
          { name: "Invalid" },
        ],
        has_more: false,
        next_page_token: null,
      }),
    });

    const voices = await fetchElevenLabsVoices({ apiKey: " test-key " });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toContain("https://api.elevenlabs.io/v2/voices?");
    expect(url).toContain("page_size=100");
    expect(url).toContain("sort=name");
    expect(url).toContain("include_total_count=false");
    expect(request).toEqual(
      expect.objectContaining({
        method: "GET",
        headers: {
          Accept: "application/json",
          "xi-api-key": "test-key",
        },
      }),
    );
    expect(voices).toEqual([
      expect.objectContaining({
        id: "voice-a",
        name: "Alpha updated",
        value: "voice-a",
        label: "Alpha updated",
      }),
      expect.objectContaining({
        id: "voice-z",
        name: "Zulu",
        value: "voice-z",
        label: "Zulu · British · female",
        category: "premade",
        accent: "British",
        gender: "female",
      }),
    ]);
  });

  it("follows next-page tokens until all voices are loaded", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          voices: [{ voice_id: "voice-1", name: "One" }],
          has_more: true,
          next_page_token: "page-2",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          voices: [{ voice_id: "voice-2", name: "Two" }],
          has_more: false,
          next_page_token: null,
        }),
      });

    const voices = await fetchElevenLabsVoices({ apiKey: "test-key" });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain("next_page_token=page-2");
    expect(voices).toHaveLength(2);
  });

  it("surfaces typed credential errors", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
    });

    await expect(
      fetchElevenLabsVoices({ apiKey: "invalid-key" }),
    ).rejects.toEqual(
      expect.objectContaining<ElevenLabsVoiceDirectoryError>({
        name: "ElevenLabsVoiceDirectoryError",
        status: 401,
      }),
    );
  });

  it("requires a non-empty API key without issuing a request", async () => {
    await expect(fetchElevenLabsVoices({ apiKey: " " })).rejects.toThrow(
      "An ElevenLabs API key is required",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
