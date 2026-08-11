import { AppState } from "react-native";
import { act, renderHook, waitFor } from "@testing-library/react-native";

jest.mock("../../src/services/kokoroTts", () => ({
  downloadKokoroModel: jest.fn(),
  getKokoroInstallReadiness: jest.fn(),
  installKokoroLifecycleGuard: jest.fn(() => jest.fn()),
  removeKokoroModel: jest.fn(),
  verifyKokoroModel: jest.fn(),
}));

import { useKokoroModel } from "../../src/hooks/useKokoroModel";
import {
  downloadKokoroModel,
  getKokoroInstallReadiness,
  verifyKokoroModel,
} from "../../src/services/kokoroTts";

function createDeferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((nextResolve) => {
    resolve = nextResolve;
  });

  return { promise, resolve };
}

describe("useKokoroModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does not let an app-state refresh interrupt a model download", async () => {
    let appStateListener: ((state: string) => void) | undefined;
    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((_event, listener) => {
        appStateListener = listener as (state: string) => void;
        return { remove: jest.fn() };
      });
    jest.mocked(getKokoroInstallReadiness).mockResolvedValue({
      installed: false,
      rootPath: null,
      verified: false,
    });
    const deferredDownload = createDeferred();
    jest.mocked(downloadKokoroModel).mockReturnValue(deferredDownload.promise);
    jest.mocked(verifyKokoroModel).mockResolvedValue(undefined);

    const { result } = renderHook(() => useKokoroModel());

    await waitFor(() => {
      expect(result.current.busy).toBeNull();
    });

    let downloadPromise!: Promise<boolean>;
    act(() => {
      downloadPromise = result.current.download();
    });

    await waitFor(() => {
      expect(result.current.busy).toBe("downloading");
    });

    await act(async () => {
      appStateListener?.("active");
      await Promise.resolve();
    });

    expect(getKokoroInstallReadiness).toHaveBeenCalledTimes(1);

    await act(async () => {
      deferredDownload.resolve();
      await downloadPromise;
    });

    expect(verifyKokoroModel).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual(
      expect.objectContaining({
        installed: true,
        verified: true,
        busy: null,
        error: null,
      }),
    );
  });
});
