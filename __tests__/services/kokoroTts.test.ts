const mockDestroy = jest.fn().mockResolvedValue(undefined);
const mockGenerateSpeech = jest.fn().mockResolvedValue({
  samples: [0, 0.25, -0.25],
  sampleRate: 24_000,
});
const mockCreateTTS = jest.fn().mockResolvedValue({
  destroy: mockDestroy,
  generateSpeech: mockGenerateSpeech,
});
const mockSaveAudioToFile = jest.fn().mockResolvedValue(undefined);
const mockDeleteAsync = jest.fn().mockResolvedValue(undefined);
const mockCopyFile = jest.fn().mockResolvedValue(undefined);
const mockMkdir = jest.fn().mockResolvedValue(undefined);
const mockGetFSInfo = jest.fn().mockResolvedValue({
  freeSpace: 2_000_000_000,
  freeSpaceEx: 2_000_000_000,
  totalSpace: 4_000_000_000,
  totalSpaceEx: 4_000_000_000,
});
const mockUnlink = jest.fn().mockResolvedValue(undefined);
const mockStopDownload = jest.fn();
const mockForegroundDownload = jest.fn().mockReturnValue({
  jobId: 9,
  promise: Promise.resolve({
    jobId: 9,
    statusCode: 200,
    bytesWritten: 147_031_220,
  }),
});
const mockDeleteModel = jest.fn().mockResolvedValue(undefined);
const mockDeleteIncompleteDownload = jest.fn().mockResolvedValue(undefined);
const mockExtractModel = jest.fn().mockResolvedValue({
  modelId: "kokoro-int8-multi-lang-v1_1",
  localPath: "/models/kokoro",
});
const mockDownloadModel = jest.fn().mockResolvedValue({
  modelId: "kokoro-int8-multi-lang-v1_1",
  localPath: "/models/kokoro",
});

const mockModelEntries = [
  "model.int8.onnx",
  "voices.bin",
  "tokens.txt",
  "espeak-ng-data",
  "lexicon-us-en.txt",
  "lexicon-zh.txt",
].map((name) => ({
  name,
  path: `/models/kokoro/${name}`,
  isDirectory: () => name === "espeak-ng-data",
}));

jest.mock("react-native-sherpa-onnx/download", () => ({
  ModelCategory: { Tts: "tts" },
  isModelDownloadedByCategory: jest.fn().mockResolvedValue(true),
  getLocalModelPathByCategory: jest.fn().mockResolvedValue("/models/kokoro"),
  refreshModelsByCategory: jest.fn().mockResolvedValue([]),
  downloadModelByCategory: mockDownloadModel,
  deleteModelByCategory: mockDeleteModel,
  deleteIncompleteDownload: mockDeleteIncompleteDownload,
  extractModelByCategory: mockExtractModel,
  getDownloadStorageBase: jest.fn().mockResolvedValue("/documents"),
  getModelByIdByCategory: jest.fn().mockResolvedValue({
    id: "kokoro-int8-multi-lang-v1_1",
    downloadUrl: "https://example.com/kokoro.tar.bz2",
    archiveExt: "tar.bz2",
    bytes: 147_031_220,
  }),
}));

jest.mock("react-native-sherpa-onnx/tts", () => ({
  createTTS: mockCreateTTS,
  saveAudioToFile: mockSaveAudioToFile,
}));

jest.mock("react-native-sherpa-onnx", () => ({
  fileModelPath: (path: string) => ({ type: "file", path }),
}));

jest.mock("@dr.pogodin/react-native-fs", () => ({
  exists: jest.fn().mockResolvedValue(true),
  readDir: jest.fn().mockResolvedValue(mockModelEntries),
  copyFile: mockCopyFile,
  getFSInfo: mockGetFSInfo,
  mkdir: mockMkdir,
  downloadFile: mockForegroundDownload,
  stopDownload: mockStopDownload,
  unlink: mockUnlink,
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///cache/",
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true, size: 1024 }),
  deleteAsync: (...args: unknown[]) => mockDeleteAsync(...args),
}));

import {
  downloadKokoroModel,
  getKokoroInstallStatus,
  releaseKokoroResources,
  removeKokoroModel,
  synthesizeKokoroSpeech,
} from "../../src/services/kokoroTts";

describe("Kokoro TTS service", () => {
  afterEach(async () => {
    await releaseKokoroResources();
    jest.clearAllMocks();
  });

  it("finds and initializes the installed model for the selected language", async () => {
    await expect(getKokoroInstallStatus()).resolves.toEqual({
      installed: true,
      rootPath: "/models/kokoro",
    });
    expect(mockMkdir).toHaveBeenCalledWith("/models/kokoro", {
      NSURLIsExcludedFromBackupKey: true,
    });

    const result = await synthesizeKokoroSpeech({
      text: "Hello from the phone.",
      listenLanguages: ["en"],
      voices: { en: "af_sol", zh: "zf_001" },
    });

    expect(mockCopyFile).toHaveBeenCalledWith(
      "/models/kokoro/lexicon-us-en.txt",
      "/models/kokoro/lexicon.txt",
    );
    expect(mockCreateTTS).toHaveBeenCalledWith(
      expect.objectContaining({
        modelType: "kokoro",
        numThreads: 2,
        provider: "cpu",
      }),
    );
    expect(mockGenerateSpeech).toHaveBeenCalledWith(
      "Hello from the phone.",
      expect.objectContaining({ sid: 1 }),
    );
    expect(mockSaveAudioToFile).toHaveBeenCalledWith(
      expect.objectContaining({ sampleRate: 24_000 }),
      expect.stringMatching(/^\/cache\/kokoro-.+\.wav$/),
    );
    expect(result).toEqual(
      expect.objectContaining({
        fileUri: expect.stringMatching(/^file:\/\/\/cache\/kokoro-.+\.wav$/),
        language: "en",
        voice: "af_sol",
      }),
    );
  });

  it("reports progress while downloading and removes the model explicitly", async () => {
    mockDownloadModel.mockImplementationOnce(
      async (
        _category: string,
        _model: string,
        options: { onProgress?: (progress: unknown) => void },
      ) => {
        options.onProgress?.({
          phase: "downloading",
          percent: 42,
        });
        return {
          modelId: "kokoro-int8-multi-lang-v1_1",
          localPath: "/models/kokoro",
        };
      },
    );
    const onProgress = jest.fn();

    await downloadKokoroModel({ onProgress });
    expect(onProgress).toHaveBeenCalledWith({
      phase: "downloading",
      progress: 0.42,
    });

    await removeKokoroModel();
    expect(mockDeleteModel).toHaveBeenCalledWith(
      "tts",
      "kokoro-int8-multi-lang-v1_1",
    );
  });

  it("falls back to a foreground iOS download when the background session fails", async () => {
    mockDownloadModel.mockRejectedValueOnce(new Error("unknown error"));
    mockForegroundDownload.mockImplementationOnce(
      (options: {
        progress?: (progress: {
          bytesWritten: number;
          contentLength: number;
        }) => void;
      }) => {
        options.progress?.({
          bytesWritten: 73_515_610,
          contentLength: 147_031_220,
        });
        return {
          jobId: 9,
          promise: Promise.resolve({
            jobId: 9,
            statusCode: 200,
            bytesWritten: 147_031_220,
          }),
        };
      },
    );
    const onProgress = jest.fn();

    await downloadKokoroModel({ onProgress });

    expect(mockDeleteIncompleteDownload).toHaveBeenCalledWith(
      "tts",
      "kokoro-int8-multi-lang-v1_1",
    );
    expect(mockForegroundDownload).toHaveBeenCalledWith(
      expect.objectContaining({
        background: false,
        fromUrl: "https://example.com/kokoro.tar.bz2",
        toFile:
          "/documents/sherpa-onnx/models/tts/kokoro-int8-multi-lang-v1_1.tar.bz2",
      }),
    );
    expect(onProgress).toHaveBeenCalledWith({
      phase: "downloading",
      progress: 0.5,
    });
    expect(mockExtractModel).toHaveBeenCalledWith(
      "tts",
      "kokoro-int8-multi-lang-v1_1",
      expect.objectContaining({ deleteArchiveAfterExtract: true }),
    );
  });

  it("does not start a model download without enough installation space", async () => {
    mockGetFSInfo.mockResolvedValueOnce({
      freeSpace: 100_000_000,
      freeSpaceEx: 100_000_000,
      totalSpace: 4_000_000_000,
      totalSpaceEx: 4_000_000_000,
    });

    await expect(downloadKokoroModel()).rejects.toThrow(
      "Kokoro needs about",
    );
    expect(mockDownloadModel).not.toHaveBeenCalled();
  });

  it("removes a generated cache file when cancellation arrives after synthesis", async () => {
    const controller = new AbortController();
    mockSaveAudioToFile.mockImplementationOnce(async () => {
      controller.abort();
    });

    await expect(
      synthesizeKokoroSpeech({
        text: "This result is cancelled.",
        listenLanguages: ["en"],
        abortSignal: controller.signal,
      }),
    ).rejects.toMatchObject({ name: "AbortError" });

    expect(mockDeleteAsync).toHaveBeenCalledWith(
      expect.stringMatching(/^file:\/\/\/cache\/kokoro-.+\.wav$/),
      { idempotent: true },
    );
  });
});
