import { writeBytesAudioFile } from "../../src/services/tts/shared";
import {
  getDriveReadyCueAudioUri,
  getInterParagraphPauseAudioUri,
} from "../../src/services/playbackCues";

jest.mock("../../src/services/tts/shared", () => ({
  writeBytesAudioFile: jest.fn(
    async ({ bytes }: { bytes: Uint8Array }) =>
      `file:///tmp/cue-${bytes.length}.wav`,
  ),
}));

describe("playback cues", () => {
  it("builds and caches a one-second silent WAV for paragraph gaps", async () => {
    const firstUri = await getInterParagraphPauseAudioUri();
    const secondUri = await getInterParagraphPauseAudioUri();
    const pauseCall = (writeBytesAudioFile as jest.Mock).mock.calls[0][0];
    const pauseBytes = pauseCall.bytes as Uint8Array;

    expect(firstUri).toBe(secondUri);
    expect(pauseBytes.length).toBe(44 + 16_000 * 2);
    expect(
      Array.from(pauseBytes.slice(44)).every((sample) => sample === 0),
    ).toBe(true);
  });

  it("builds a quiet, non-silent WAV for the Drive Session ready cue", async () => {
    await getDriveReadyCueAudioUri();
    const cueCall = (writeBytesAudioFile as jest.Mock).mock.calls[1][0];
    const cueBytes = cueCall.bytes as Uint8Array;

    expect(cueBytes.length).toBe(44 + 11_520 * 2);
    expect(
      Array.from(cueBytes.slice(44)).some((sample) => sample !== 0),
    ).toBe(true);
  });
});
