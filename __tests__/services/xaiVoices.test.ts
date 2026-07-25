import {
  XaiVoiceDirectoryError,
  fetchXaiVoices,
} from "../../src/services/xaiVoices";

describe("fetchXaiVoices", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("loads built-in and paginated custom voices", async () => {
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          voices: [
            { voice_id: "eve", name: "Eve", language: "multilingual" },
            { voice_id: "ara", name: "Ara", language: "multilingual" },
          ],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          voices: [
            {
              voice_id: "custom01",
              name: "Friendly Narrator",
              accent: "American",
              tone: "warm",
            },
          ],
          pagination_token: "next-page",
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          voices: [
            {
              voice_id: "custom02",
              name: "Calm Guide",
              tone: "calm",
            },
          ],
          pagination_token: null,
        }),
      } as Response);

    await expect(fetchXaiVoices({ apiKey: "xai-key" })).resolves.toEqual([
      expect.objectContaining({ value: "ara", label: "Ara", isCustom: false }),
      expect.objectContaining({
        value: "custom02",
        label: "Calm Guide · Custom · calm",
        isCustom: true,
      }),
      expect.objectContaining({ value: "eve", label: "Eve", isCustom: false }),
      expect.objectContaining({
        value: "custom01",
        label: "Friendly Narrator · Custom · American · warm",
        isCustom: true,
      }),
    ]);
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining("pagination_token=next-page"),
      expect.any(Object),
    );
  });

  it("keeps built-in voices when custom voices are unavailable", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          voices: [{ voice_id: "eve", name: "Eve" }],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
      } as Response);

    await expect(fetchXaiVoices({ apiKey: "xai-key" })).resolves.toEqual([
      expect.objectContaining({ value: "eve", isCustom: false }),
    ]);
  });

  it("surfaces rejected built-in voice credentials", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      text: async () =>
        JSON.stringify({ error: { message: "Incorrect API key." } }),
    } as Response);

    await expect(fetchXaiVoices({ apiKey: "invalid" })).rejects.toEqual(
      expect.objectContaining<XaiVoiceDirectoryError>({
        name: "XaiVoiceDirectoryError",
        message: "Incorrect API key.",
        status: 401,
      }),
    );
  });

  it("requires a non-empty API key without issuing a request", async () => {
    const fetchMock = jest.spyOn(global, "fetch");

    await expect(fetchXaiVoices({ apiKey: " " })).rejects.toBeInstanceOf(
      XaiVoiceDirectoryError,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
