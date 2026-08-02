const mockExists = jest.fn();
const mockReadFile = jest.fn();
const mockHash = jest.fn();
const mockMkdir = jest.fn();
const mockMoveFile = jest.fn();
const mockStopDownload = jest.fn();
const mockUnlink = jest.fn();
const mockWriteFile = jest.fn();
const mockDownloadFile = jest.fn();

const mockRefreshModels = jest.fn();
const mockGetRemoteModel = jest.fn();
const mockDownloadSherpaModel = jest.fn();
const mockDeleteSherpaModel = jest.fn();
const mockIsSherpaModelDownloaded = jest.fn();
const mockListDownloadedModels = jest.fn();
const mockGetLocalSherpaPath = jest.fn();

jest.mock("@dr.pogodin/react-native-fs", () => ({
  DocumentDirectoryPath: "/documents",
  downloadFile: (...args: unknown[]) => mockDownloadFile(...args),
  exists: (...args: unknown[]) => mockExists(...args),
  hash: (...args: unknown[]) => mockHash(...args),
  mkdir: (...args: unknown[]) => mockMkdir(...args),
  moveFile: (...args: unknown[]) => mockMoveFile(...args),
  readFile: (...args: unknown[]) => mockReadFile(...args),
  stopDownload: (...args: unknown[]) => mockStopDownload(...args),
  unlink: (...args: unknown[]) => mockUnlink(...args),
  writeFile: (...args: unknown[]) => mockWriteFile(...args),
}));

jest.mock("react-native-sherpa-onnx/download", () => ({
  ModelCategory: { Stt: "stt", Tts: "tts" },
  deleteModelByCategory: (...args: unknown[]) => mockDeleteSherpaModel(...args),
  downloadModelByCategory: (...args: unknown[]) =>
    mockDownloadSherpaModel(...args),
  getLocalModelPathByCategory: (...args: unknown[]) =>
    mockGetLocalSherpaPath(...args),
  getModelByIdByCategory: (...args: unknown[]) => mockGetRemoteModel(...args),
  isModelDownloadedByCategory: (...args: unknown[]) =>
    mockIsSherpaModelDownloaded(...args),
  listDownloadedModelsByCategory: (...args: unknown[]) =>
    mockListDownloadedModels(...args),
  refreshModelsByCategory: (...args: unknown[]) => mockRefreshModels(...args),
}));

import { getLocalModel } from "../../src/constants/localModels";
import {
  downloadLocalModel,
  getLocalModelInstallStatus,
} from "../../src/services/localModelManager";

describe("local model manager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMkdir.mockResolvedValue(undefined);
    mockMoveFile.mockResolvedValue(undefined);
    mockUnlink.mockResolvedValue(undefined);
    mockWriteFile.mockResolvedValue(undefined);
    mockRefreshModels.mockResolvedValue([]);
    mockDeleteSherpaModel.mockResolvedValue(undefined);
    mockGetLocalSherpaPath.mockResolvedValue("/documents/models/whisper");
  });

  it("only trusts a local LLM when its pinned verification marker matches", async () => {
    const model = getLocalModel("qwen3-0.6b-q8");
    mockExists.mockResolvedValue(true);
    mockReadFile.mockResolvedValue(model.sha256);

    await expect(getLocalModelInstallStatus("qwen3-0.6b-q8")).resolves.toEqual({
      installed: true,
      path: "/documents/local-models/llm/Qwen3-0.6B-Q8_0.gguf",
      verified: true,
    });

    mockReadFile.mockResolvedValueOnce("different-digest");
    await expect(getLocalModelInstallStatus("qwen3-0.6b-q8")).resolves.toEqual({
      installed: true,
      path: "/documents/local-models/llm/Qwen3-0.6B-Q8_0.gguf",
      verified: false,
    });
  });

  it("hashes an LLM download before moving it into the verified path", async () => {
    const model = getLocalModel("qwen3-0.6b-q8");
    mockExists.mockResolvedValue(false);
    mockHash.mockResolvedValue(model.sha256);
    mockDownloadFile.mockImplementation(
      (options: {
        progress?: (event: {
          bytesWritten: number;
          contentLength: number;
        }) => void;
      }) => {
        options.progress?.({
          bytesWritten: model.downloadBytes,
          contentLength: model.downloadBytes,
        });
        return {
          jobId: 7,
          promise: Promise.resolve({ statusCode: 200 }),
        };
      },
    );
    const onProgress = jest.fn();

    await expect(downloadLocalModel(model.id, { onProgress })).resolves.toBe(
      "/documents/local-models/llm/Qwen3-0.6B-Q8_0.gguf",
    );
    expect(mockHash).toHaveBeenCalledWith(
      expect.stringMatching(/\.partial$/),
      "sha256",
    );
    expect(mockMoveFile).toHaveBeenCalledWith(
      expect.stringMatching(/\.partial$/),
      "/documents/local-models/llm/Qwen3-0.6B-Q8_0.gguf",
    );
    expect(mockWriteFile).toHaveBeenCalledWith(
      expect.stringContaining(".verified-1"),
      model.sha256,
      "utf8",
    );
    expect(onProgress).toHaveBeenLastCalledWith({
      phase: "verifying",
      progress: 1,
    });
  });

  it("refuses a Sherpa model when refreshed upstream metadata changed", async () => {
    const model = getLocalModel("whisper-tiny");
    if (model.capability !== "stt") {
      throw new Error("Whisper catalogue entry must be an STT model");
    }
    mockGetRemoteModel.mockResolvedValue({
      id: model.runtimeModelId,
      bytes: model.downloadBytes,
      sha256: "0".repeat(64),
    });

    await expect(downloadLocalModel(model.id)).rejects.toThrow(
      "changed upstream",
    );
    expect(mockDownloadSherpaModel).not.toHaveBeenCalled();
  });

  it("accepts an installed Sherpa model only when its manifest is pinned", async () => {
    const model = getLocalModel("whisper-tiny");
    if (model.capability !== "stt") {
      throw new Error("Whisper catalogue entry must be an STT model");
    }
    mockIsSherpaModelDownloaded.mockResolvedValue(true);
    mockListDownloadedModels.mockResolvedValue([
      {
        id: model.runtimeModelId,
        bytes: model.downloadBytes,
        sha256: model.sha256,
      },
    ]);

    await expect(getLocalModelInstallStatus(model.id)).resolves.toEqual({
      installed: true,
      path: "/documents/models/whisper",
      verified: true,
    });
  });
});
