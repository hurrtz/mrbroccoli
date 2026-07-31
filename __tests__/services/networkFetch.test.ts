jest.mock("expo/fetch", () => ({ fetch: jest.fn() }));
jest.mock("../../src/services/debugLogCapture", () => ({
  getDebugTurnIdForSignal: jest.fn(() => "turn-1"),
  recordDebugLogEvent: jest.fn(),
}));

import { fetch as expoFetch } from "expo/fetch";
import { networkFetch } from "../../src/services/networkFetch";
import { recordDebugLogEvent } from "../../src/services/debugLogCapture";

describe("networkFetch diagnostics", () => {
  beforeEach(() => jest.clearAllMocks());

  it("records safe endpoint metadata, status, timing and turn correlation", async () => {
    jest.mocked(expoFetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
    } as never);

    await networkFetch("https://api.example.com/v1/messages?api_key=secret", {
      method: "POST",
    });

    expect(recordDebugLogEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        event: "network-request-started",
        payload: expect.objectContaining({
          host: "api.example.com",
          method: "POST",
          route: "/v1/messages",
          turnId: "turn-1",
        }),
      }),
    );
    expect(JSON.stringify(jest.mocked(recordDebugLogEvent).mock.calls)).not.toContain(
      "secret",
    );
    expect(recordDebugLogEvent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        event: "network-request-completed",
        payload: expect.objectContaining({ status: 200 }),
      }),
    );
  });

  it("records a terminal failure without request content", async () => {
    jest.mocked(expoFetch).mockRejectedValueOnce(new Error("offline"));

    await expect(networkFetch("https://api.example.com/v1/messages")).rejects.toThrow(
      "offline",
    );
    expect(recordDebugLogEvent).toHaveBeenLastCalledWith(
      expect.objectContaining({ event: "network-request-failed", level: "warn" }),
    );
  });
});
