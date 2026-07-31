import { writeBytesAudioFile } from "../../src/services/tts/shared";
import {
  getDriveCountdownCueAudioUri,
  getDriveReadyCueAudioUri,
  getInterParagraphPauseAudioUri,
  INTER_PARAGRAPH_PAUSE_MS,
} from "../../src/services/playbackCues";

jest.mock("../../src/services/tts/shared", () => ({
  writeBytesAudioFile: jest.fn(
    async ({ bytes }: { bytes: Uint8Array }) =>
      `file:///tmp/cue-${bytes.length}.wav`,
  ),
}));

describe("playback cues", () => {
  it("builds and caches a short silent WAV for paragraph cadence", async () => {
    const firstUri = await getInterParagraphPauseAudioUri();
    const secondUri = await getInterParagraphPauseAudioUri();
    const pauseCall = (writeBytesAudioFile as jest.Mock).mock.calls[0][0];
    const pauseBytes = pauseCall.bytes as Uint8Array;

    expect(firstUri).toBe(secondUri);
    expect(INTER_PARAGRAPH_PAUSE_MS).toBe(250);
    expect(pauseBytes.length).toBe(44 + 4_000 * 2);
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

  it("builds and caches soft countdown cues by urgency", async () => {
    const first = await getDriveCountdownCueAudioUri(1);
    const firstAgain = await getDriveCountdownCueAudioUri(1);
    const urgent = await getDriveCountdownCueAudioUri(3);
    const firstCall = (writeBytesAudioFile as jest.Mock).mock.calls[2][0];
    const urgentCall = (writeBytesAudioFile as jest.Mock).mock.calls[3][0];

    expect(first).toBe(firstAgain);
    expect(urgent).toBeTruthy();
    expect((firstCall.bytes as Uint8Array).length).toBe(44 + 2_880 * 2);
    expect((urgentCall.bytes as Uint8Array).length).toBe(44 + 2_880 * 2);
    expect(
      Array.from((firstCall.bytes as Uint8Array).slice(44)).some(
        (sample) => sample !== 0,
      ),
    ).toBe(true);
  });
});
