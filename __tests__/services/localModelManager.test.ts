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
const mockDeleteIncompleteDownload = jest.fn();
const mockExtractSherpaModel = jest.fn();
const mockExtractArchive = jest.fn();
const mockGetDownloadStorageBase = jest.fn();
const mockDeleteSherpaModel = jest.fn();
const mockIsSherpaModelDownloaded = jest.fn();
const mockListDownloadedModels = jest.fn();
const mockGetLocalSherpaPath = jest.fn();
const mockArePhonemePacksInstalled = jest.fn();
const mockInstallPhonemePacks = jest.fn();

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
  deleteIncompleteDownload: (...args: unknown[]) =>
    mockDeleteIncompleteDownload(...args),
  downloadModelByCategory: (...args: unknown[]) =>
    mockDownloadSherpaModel(...args),
  extractModelByCategory: (...args: unknown[]) =>
    mockExtractSherpaModel(...args),
  getDownloadStorageBase: (...args: unknown[]) =>
    mockGetDownloadStorageBase(...args),
  getLocalModelPathByCategory: (...args: unknown[]) =>
    mockGetLocalSherpaPath(...args),
  getModelByIdByCategory: (...args: unknown[]) => mockGetRemoteModel(...args),
  isModelDownloadedByCategory: (...args: unknown[]) =>
    mockIsSherpaModelDownloaded(...args),
  listDownloadedModelsByCategory: (...args: unknown[]) =>
    mockListDownloadedModels(...args),
  refreshModelsByCategory: (...args: unknown[]) => mockRefreshModels(...args),
}));

jest.mock("react-native-sherpa-onnx/extraction", () => ({
  extractArchive: (...args: unknown[]) => mockExtractArchive(...args),
}));

jest.mock("../../src/services/phonemePacks", () => ({
  arePhonemePacksInstalled: (...args: unknown[]) =>
    mockArePhonemePacksInstalled(...args),
  installPhonemePacks: (...args: unknown[]) => mockInstallPhonemePacks(...args),
}));

import {
  getLocalModel,
  LOCAL_MODEL_CATALOG_VERSION,
} from "../../src/constants/localModels";
import {
  downloadLocalModel,
  getLocalModelInstallStatus,
} from "../../src/services/localModelManager";
import { Platform } from "react-native";

describe("local model manager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMkdir.mockResolvedValue(undefined);
    mockMoveFile.mockResolvedValue(undefined);
    mockUnlink.mockResolvedValue(undefined);
    mockWriteFile.mockResolvedValue(undefined);
    mockRefreshModels.mockResolvedValue([]);
    mockDeleteSherpaModel.mockResolvedValue(undefined);
    mockDeleteIncompleteDownload.mockResolvedValue(undefined);
    mockExtractSherpaModel.mockResolvedValue({
      localPath: "/documents/models/whisper",
    });
    mockExtractArchive.mockResolvedValue({ success: true });
    mockGetDownloadStorageBase.mockResolvedValue("/documents");
    mockGetLocalSherpaPath.mockResolvedValue("/documents/models/whisper");
    mockArePhonemePacksInstalled.mockResolvedValue(true);
    mockInstallPhonemePacks.mockResolvedValue(undefined);
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
      `/documents/local-models/llm/Qwen3-0.6B-Q8_0.gguf.verified-${LOCAL_MODEL_CATALOG_VERSION}`,
      model.sha256,
      "utf8",
    );
    expect(onProgress).toHaveBeenLastCalledWith({
      phase: "verifying",
      progress: 1,
    });
  });

  it("uses the direct pinned install when a registry checksum is stale", async () => {
    const model = getLocalModel("piper-pt-pt-tugao");
    if (model.capability !== "tts") {
      throw new Error("Tugão must remain a Piper TTS model");
    }
    mockGetRemoteModel.mockResolvedValue({
      id: model.runtimeModelId,
      bytes: model.downloadBytes,
      sha256: "0".repeat(64),
      archiveExt: "tar.bz2",
    });
    mockExists.mockResolvedValue(false);
    mockHash.mockResolvedValue(model.sha256);
    mockDownloadFile.mockReturnValue({
      jobId: 10,
      promise: Promise.resolve({ statusCode: 200 }),
    });
    mockIsSherpaModelDownloaded
      .mockResolvedValueOnce(false)
      .mockResolvedValue(true);
    mockListDownloadedModels.mockResolvedValue([
      {
        id: model.runtimeModelId,
        bytes: model.downloadBytes,
        sha256: model.sha256,
      },
    ]);
    mockGetLocalSherpaPath.mockResolvedValue("/documents/models/tugao");

    await expect(downloadLocalModel(model.id)).resolves.toBe(
      "/documents/models/tugao",
    );
    expect(mockDownloadSherpaModel).not.toHaveBeenCalled();
    expect(mockHash).toHaveBeenCalledWith(
      expect.stringContaining(`${model.runtimeModelId}.tar.bz2`),
      "sha256",
    );
    expect(mockExtractArchive).toHaveBeenCalledWith(
      expect.objectContaining({
        archivePath: expect.stringContaining(
          `${model.runtimeModelId}.tar.bz2`,
        ),
        modelId: model.runtimeModelId,
      }),
      expect.stringContaining(model.runtimeModelId),
      expect.objectContaining({ force: true }),
    );
  });

  it("does not mark a direct pinned install ready when extraction fails", async () => {
    const model = getLocalModel("piper-pt-pt-tugao");
    if (model.capability !== "tts") {
      throw new Error("Tugão must remain a Piper TTS model");
    }
    mockGetRemoteModel.mockResolvedValue({
      id: model.runtimeModelId,
      bytes: model.downloadBytes,
      sha256: "0".repeat(64),
      archiveExt: "tar.bz2",
    });
    mockExists.mockResolvedValue(false);
    mockHash.mockResolvedValue(model.sha256);
    mockDownloadFile.mockReturnValue({
      jobId: 10,
      promise: Promise.resolve({ statusCode: 200 }),
    });
    mockIsSherpaModelDownloaded.mockResolvedValue(false);
    mockExtractArchive.mockResolvedValue({
      success: false,
      reason: "archive is corrupt",
    });

    await expect(downloadLocalModel(model.id)).rejects.toThrow(
      "Tugão extraction failed: archive is corrupt",
    );
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it("fails a Sherpa download closed on checksum mismatch instead of prompting", async () => {
    const model = getLocalModel("whisper-tiny");
    if (model.capability !== "stt") {
      throw new Error("Whisper catalogue entry must be an STT model");
    }
    mockGetRemoteModel.mockResolvedValue({
      id: model.runtimeModelId,
      bytes: model.downloadBytes,
      sha256: model.sha256,
    });
    mockDownloadSherpaModel.mockResolvedValue({
      localPath: "/documents/models/whisper",
    });
    mockIsSherpaModelDownloaded
      .mockResolvedValueOnce(false)
      .mockResolvedValue(true);
    mockListDownloadedModels.mockResolvedValue([
      {
        id: model.runtimeModelId,
        bytes: model.downloadBytes,
        sha256: model.sha256,
      },
    ]);

    await downloadLocalModel(model.id);

    const options = mockDownloadSherpaModel.mock.calls[0][2] as {
      onChecksumIssue?: (issue: unknown) => Promise<boolean>;
    };
    expect(typeof options.onChecksumIssue).toBe("function");
    // A checksum issue must always be rejected so the library deletes the
    // artifact and throws instead of showing its interactive keep-file prompt.
    await expect(
      options.onChecksumIssue?.({ reason: "CHECKSUM_MISMATCH" }),
    ).resolves.toBe(false);
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

  it("does not report Piper as ready until its phoneme packs are installed", async () => {
    const model = getLocalModel("piper-en-us-kristin");
    if (model.capability !== "tts") {
      throw new Error("Kristin must remain a Piper TTS model");
    }
    mockIsSherpaModelDownloaded.mockResolvedValue(true);
    mockListDownloadedModels.mockResolvedValue([
      {
        id: model.runtimeModelId,
        bytes: model.downloadBytes,
        sha256: model.sha256,
      },
    ]);
    mockGetLocalSherpaPath.mockResolvedValue("/documents/models/kristin");
    mockArePhonemePacksInstalled.mockResolvedValue(false);

    await expect(getLocalModelInstallStatus(model.id)).resolves.toEqual({
      installed: true,
      path: null,
      verified: false,
    });
    expect(mockArePhonemePacksInstalled).toHaveBeenCalledWith(
      "/documents/models/kristin/espeak-ng-data",
      "en",
    );
  });

  it("installs Piper phoneme packs before accepting a completed download", async () => {
    const model = getLocalModel("piper-en-us-kristin");
    if (model.capability !== "tts") {
      throw new Error("Kristin must remain a Piper TTS model");
    }
    mockGetRemoteModel.mockResolvedValue({
      id: model.runtimeModelId,
      bytes: model.downloadBytes,
      sha256: model.sha256,
    });
    mockDownloadSherpaModel.mockResolvedValue({
      localPath: "/documents/models/kristin",
    });
    mockIsSherpaModelDownloaded.mockResolvedValue(true);
    mockListDownloadedModels.mockResolvedValue([
      {
        id: model.runtimeModelId,
        bytes: model.downloadBytes,
        sha256: model.sha256,
      },
    ]);
    mockGetLocalSherpaPath.mockResolvedValue("/documents/models/kristin");
    const abortController = new AbortController();

    await expect(
      downloadLocalModel(model.id, { abortSignal: abortController.signal }),
    ).resolves.toBe("/documents/models/kristin");
    expect(mockInstallPhonemePacks).toHaveBeenCalledWith(
      "/documents/models/kristin/espeak-ng-data",
      "en",
      { abortSignal: abortController.signal },
    );
  });

  it("retries a failed iOS Piper archive in the foreground", async () => {
    const model = getLocalModel("piper-en-us-kristin");
    if (model.capability !== "tts") {
      throw new Error("Kristin must remain a Piper TTS model");
    }
    const originalPlatform = Platform.OS;
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
    try {
      mockGetRemoteModel.mockResolvedValue({
        id: model.runtimeModelId,
        archiveExt: "tar.bz2",
        bytes: model.downloadBytes,
        sha256: model.sha256,
      });
      mockDownloadSherpaModel.mockRejectedValue(new Error("unknown error"));
      mockDownloadFile.mockReturnValue({
        jobId: 9,
        promise: Promise.resolve({ statusCode: 200 }),
      });
      mockExists.mockResolvedValue(false);
      mockIsSherpaModelDownloaded
        .mockResolvedValueOnce(false)
        .mockResolvedValue(true);
      mockListDownloadedModels.mockResolvedValue([
        {
          id: model.runtimeModelId,
          bytes: model.downloadBytes,
          sha256: model.sha256,
        },
      ]);
      mockGetLocalSherpaPath.mockResolvedValue("/documents/models/kristin");
      mockHash.mockResolvedValue(model.sha256);

      await expect(downloadLocalModel(model.id)).resolves.toBe(
        "/documents/models/kristin",
      );

      expect(mockDownloadFile).toHaveBeenCalledWith(
        expect.objectContaining({
          background: false,
          fromUrl: model.downloadUrl,
          toFile: expect.stringContaining(`${model.runtimeModelId}.tar.bz2`),
        }),
      );
      expect(mockExtractArchive).toHaveBeenCalledWith(
        expect.objectContaining({ modelId: model.runtimeModelId }),
        expect.stringContaining(model.runtimeModelId),
        expect.objectContaining({ force: true }),
      );
    } finally {
      Object.defineProperty(Platform, "OS", {
        configurable: true,
        value: originalPlatform,
      });
    }
  });
});
