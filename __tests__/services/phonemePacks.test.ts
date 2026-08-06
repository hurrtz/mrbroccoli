import {
  PHONEME_PACKS,
  getPhonemePackDownloadUrl,
  getPhonemePacksForLanguage,
} from "../../src/constants/phonemePacks";
import {
  arePhonemePacksInstalled,
  getPhonemePackDownloadBytes,
  installPhonemePacks,
} from "../../src/services/phonemePacks";

const mockExists = jest.fn();
const mockDownloadFile = jest.fn();
const mockHash = jest.fn();
const mockUnlink = jest.fn();
const mockExtractArchive = jest.fn();

jest.mock("@dr.pogodin/react-native-fs", () => ({
  downloadFile: (...args: unknown[]) => mockDownloadFile(...args),
  exists: (...args: unknown[]) => mockExists(...args),
  hash: (...args: unknown[]) => mockHash(...args),
  unlink: (...args: unknown[]) => mockUnlink(...args),
}));

jest.mock(
  "react-native-sherpa-onnx/extraction",
  () => ({
    extractArchive: (...args: unknown[]) => mockExtractArchive(...args),
  }),
  { virtual: true },
);

const DATA_DIR = "/documents/models/kokoro/espeak-ng-data";

describe("phoneme packs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDownloadFile.mockReturnValue({
      jobId: 1,
      promise: Promise.resolve({ statusCode: 200 }),
    });
    mockUnlink.mockResolvedValue(undefined);
    mockExtractArchive.mockResolvedValue({});
  });

  it("pins every pack with an exact size and checksum", () => {
    for (const pack of PHONEME_PACKS) {
      expect(pack.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(pack.downloadBytes).toBeGreaterThan(0);
      expect(pack.license).not.toHaveLength(0);
      expect(getPhonemePackDownloadUrl(pack)).toBe(
        `https://github.com/hurrtz/libphonemize/releases/download/packs-v3/${pack.id}.tar.bz2`,
      );
    }
  });

  it("gives every Free conversation language a lexicon and a neural fallback", () => {
    for (const language of [
      "en",
      "de",
      "fr",
      "es",
      "it",
      "pt",
      "pt-BR",
      "ru",
    ] as const) {
      const ids = getPhonemePacksForLanguage(language).map(({ id }) => id);
      // Without the G2P pack, out-of-vocabulary words (names, brands) would
      // be dropped from speech instead of pronounced.
      expect(ids.some((id) => id.endsWith(".lpk"))).toBe(true);
      expect(ids.some((id) => id.endsWith(".g2p"))).toBe(true);
      expect(getPhonemePackDownloadBytes(language)).toBeGreaterThan(0);
    }
  });

  it("verifies the checksum before extracting and cleans up the archive", async () => {
    const packs = getPhonemePacksForLanguage("de");
    const pack = packs[0];
    // An install path reports missing on its first check and present once
    // extraction has run; archives always exist for the cleanup step.
    const checked = new Set<string>();
    mockExists.mockImplementation(async (path: string) => {
      if (path.endsWith(".tar.bz2")) {
        return true;
      }
      if (checked.has(path)) {
        return true;
      }
      checked.add(path);
      return false;
    });
    mockHash.mockImplementation(async (path: string) =>
      packs
        .find(({ id }) => path.endsWith(`${id}.tar.bz2`))!
        .sha256.toUpperCase(),
    );

    await installPhonemePacks(DATA_DIR, "de");

    // Every pack the language needs is installed, lexicon and G2P alike.
    expect(mockDownloadFile).toHaveBeenCalledTimes(packs.length);
    expect(mockExtractArchive).toHaveBeenCalledTimes(packs.length);

    expect(mockDownloadFile).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        fromUrl: getPhonemePackDownloadUrl(pack),
        toFile: `${DATA_DIR}/${pack.id}.tar.bz2`,
      }),
    );
    expect(mockHash).toHaveBeenCalledWith(
      `${DATA_DIR}/${pack.id}.tar.bz2`,
      "sha256",
    );
    expect(mockExtractArchive).toHaveBeenCalledWith(
      expect.objectContaining({ format: "tar.bz2" }),
      DATA_DIR,
      expect.objectContaining({ force: true }),
    );
    expect(mockUnlink).toHaveBeenCalledWith(`${DATA_DIR}/${pack.id}.tar.bz2`);
  });

  it("fails closed on a checksum mismatch and never extracts", async () => {
    mockExists.mockResolvedValue(false);
    mockHash.mockResolvedValue("0".repeat(64));

    await expect(installPhonemePacks(DATA_DIR, "ru")).rejects.toThrow(
      "did not match its pinned checksum",
    );
    expect(mockExtractArchive).not.toHaveBeenCalled();
  });

  it("skips packs that are already installed", async () => {
    mockExists.mockResolvedValue(true);

    await installPhonemePacks(DATA_DIR, "it");

    expect(mockDownloadFile).not.toHaveBeenCalled();
    await expect(arePhonemePacksInstalled(DATA_DIR, "it")).resolves.toBe(true);
  });
});
