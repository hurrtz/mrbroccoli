import { getKokoroPromptBlockState } from "../../../src/screens/main/kokoroPromptBlockState";

const t = (key: string, params?: Record<string, string | number>) =>
  params ? `${key}:${params.progress}` : key;

const readyModel = {
  busy: null,
  error: null,
  installed: true,
  phase: null,
  progress: 1,
  verified: true,
} as const;

describe("getKokoroPromptBlockState", () => {
  it("does not block when Kokoro is ready or spoken replies are off", () => {
    expect(
      getKokoroPromptBlockState({
        kokoroModel: readyModel,
        spokenRepliesEnabled: true,
        t,
        ttsMode: "kokoro",
      }),
    ).toEqual({ actionLabel: null, message: null, progress: null });
    expect(
      getKokoroPromptBlockState({
        kokoroModel: { ...readyModel, installed: false, verified: false },
        spokenRepliesEnabled: false,
        t,
        ttsMode: "kokoro",
      }),
    ).toEqual({ actionLabel: null, message: null, progress: null });
  });

  it("accepts Kokoro readiness verified by the Free offline profile", () => {
    expect(
      getKokoroPromptBlockState({
        kokoroModel: {
          ...readyModel,
          installed: false,
          verified: false,
        },
        verifiedByOfflineProfile: true,
        spokenRepliesEnabled: true,
        t,
        ttsMode: "kokoro",
      }),
    ).toEqual({ actionLabel: null, message: null, progress: null });
  });

  it("shows bounded download progress directly on the disabled action", () => {
    expect(
      getKokoroPromptBlockState({
        kokoroModel: {
          ...readyModel,
          busy: "downloading",
          installed: false,
          phase: "downloading",
          progress: 1.4,
          verified: false,
        },
        spokenRepliesEnabled: true,
        t,
        ttsMode: "kokoro",
      }),
    ).toEqual({
      actionLabel: "kokoroDownloading:140",
      message: "kokoroDownloading:140",
      progress: 1,
    });
  });

  it("distinguishes extraction and surfaces installation errors", () => {
    expect(
      getKokoroPromptBlockState({
        kokoroModel: {
          ...readyModel,
          busy: "downloading",
          installed: false,
          phase: "extracting",
          progress: 0.42,
          verified: false,
        },
        spokenRepliesEnabled: true,
        t,
        ttsMode: "kokoro",
      }).message,
    ).toBe("kokoroExtracting:42");
    expect(
      getKokoroPromptBlockState({
        kokoroModel: {
          ...readyModel,
          error: "Model archive is corrupt",
          installed: false,
          verified: false,
        },
        spokenRepliesEnabled: true,
        t,
        ttsMode: "kokoro",
      }),
    ).toEqual({
      actionLabel: null,
      message: "Model archive is corrupt",
      progress: null,
    });
  });
});
