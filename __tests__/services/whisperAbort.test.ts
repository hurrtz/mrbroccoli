import { fetchWithDeadline } from "../../src/services/networkFetch";

describe("fetchWithDeadline", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("does not create a timeout when the caller already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const fetchSpy = jest.spyOn(global, "fetch");

    await expect(
      fetchWithDeadline(
        "https://example.test",
        {},
        45_000,
        () => new Error("Timed out"),
        (response) => response.text(),
        controller.signal,
      ),
    ).rejects.toMatchObject({ name: "AbortError" });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
  });

  it("clears its timeout when fetch throws synchronously", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() => {
      throw new Error("Invalid request");
    });

    await expect(
      fetchWithDeadline(
        "https://example.test",
        {},
        45_000,
        () => new Error("Timed out"),
        (response) => response.text(),
      ),
    ).rejects.toThrow("Invalid request");

    expect(jest.getTimerCount()).toBe(0);
  });
});
