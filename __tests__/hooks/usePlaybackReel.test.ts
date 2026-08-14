import { act, renderHook } from "@testing-library/react-native";

import { usePlaybackReel } from "../../src/hooks/audioPlayer/usePlaybackReel";

function setup() {
  const enqueueAudio =
    jest.fn<void, [string, unknown?, (() => void)?]>();
  const speakText = jest.fn<void, [string, { onPlaybackStarted?: () => void }?]>();
  const stopPlayback = jest.fn(async () => undefined);
  const resetCancellation = jest.fn();
  const playbackGenerationRef = { current: 1 };

  const view = renderHook(() =>
    usePlaybackReel({
      enqueueAudio,
      playbackGenerationRef,
      resetCancellation,
      speakText,
      stopPlayback,
    }),
  );

  /** Plays the reel's chunk at `index` the way the queue would. */
  const startChunk = (index: number) => {
    act(() => {
      enqueueAudio.mock.calls[index][2]?.();
    });
  };

  // Three paragraphs of deliberately different lengths: 10, 30 and 60
  // characters, so a jump between them moves the arc by different amounts.
  const enqueueThree = () => {
    act(() => {
      view.result.current.recordAudio("file://one.m4a", undefined, undefined, {
        startsParagraph: true,
        text: "x".repeat(10),
      });
      view.result.current.recordAudio("file://two.m4a", undefined, undefined, {
        startsParagraph: true,
        text: "x".repeat(30),
      });
      view.result.current.recordAudio(
        "file://three.m4a",
        undefined,
        undefined,
        { startsParagraph: true, text: "x".repeat(60) },
      );
    });
  };

  return {
    enqueueAudio,
    enqueueThree,
    playbackGenerationRef,
    resetCancellation,
    speakText,
    startChunk,
    stopPlayback,
    view,
  };
}

describe("playback reel", () => {
  it("plays each paragraph as it arrives", () => {
    const { enqueueAudio, enqueueThree } = setup();
    enqueueThree();

    expect(enqueueAudio.mock.calls.map(([uri]) => uri)).toEqual([
      "file://one.m4a",
      "file://two.m4a",
      "file://three.m4a",
    ]);
  });

  it("moves forward by replaying the reel from the next paragraph", async () => {
    const { enqueueAudio, enqueueThree, startChunk, stopPlayback, view } =
      setup();
    enqueueThree();
    startChunk(0);
    enqueueAudio.mockClear();

    await act(async () => {
      await view.result.current.seekParagraph("forward");
    });

    expect(stopPlayback).toHaveBeenCalledTimes(1);
    expect(enqueueAudio.mock.calls.map(([uri]) => uri)).toEqual([
      "file://two.m4a",
      "file://three.m4a",
    ]);
  });

  it("sends back to the paragraph's own start once it is under way", async () => {
    // Under two seconds back means the paragraph before; after that it means
    // the start of the one being read.
    const { enqueueAudio, enqueueThree, startChunk, view } = setup();
    enqueueThree();
    startChunk(1);
    jest.spyOn(Date, "now").mockReturnValue(Date.now() + 5_000);
    enqueueAudio.mockClear();

    await act(async () => {
      await view.result.current.seekParagraph("back");
    });

    expect(enqueueAudio.mock.calls.map(([uri]) => uri)).toEqual([
      "file://two.m4a",
      "file://three.m4a",
    ]);
    jest.restoreAllMocks();
  });

  it("sends back to the previous paragraph inside the first seconds", async () => {
    const { enqueueAudio, enqueueThree, startChunk, view } = setup();
    enqueueThree();
    startChunk(1);
    enqueueAudio.mockClear();

    await act(async () => {
      await view.result.current.seekParagraph("back");
    });

    expect(enqueueAudio.mock.calls.map(([uri]) => uri)).toEqual([
      "file://one.m4a",
      "file://two.m4a",
      "file://three.m4a",
    ]);
  });

  it("stays put at both ends of the reel", async () => {
    const { enqueueAudio, enqueueThree, startChunk, view } = setup();
    enqueueThree();
    startChunk(2);
    jest.spyOn(Date, "now").mockReturnValue(Date.now() + 5_000);
    enqueueAudio.mockClear();

    await act(async () => {
      await view.result.current.seekParagraph("forward");
    });

    expect(enqueueAudio).not.toHaveBeenCalled();
    jest.restoreAllMocks();
  });

  it("keeps the reel through the generation bump its own seek causes", async () => {
    // Stopping and re-arming playback bumps the player's generation, which
    // otherwise reads as "a new answer" and would drop the reply mid-read —
    // taking the rest of a streamed reply's paragraphs with it.
    const {
      enqueueAudio,
      enqueueThree,
      playbackGenerationRef,
      startChunk,
      stopPlayback,
      view,
    } = setup();
    enqueueThree();
    startChunk(1);
    stopPlayback.mockImplementation(async () => {
      playbackGenerationRef.current += 1;
    });

    await act(async () => {
      await view.result.current.seekParagraph("back");
    });
    act(() => {
      view.result.current.recordAudio("file://four.m4a", undefined, undefined, {
        startsParagraph: true,
        text: "x".repeat(100),
      });
    });
    enqueueAudio.mockClear();

    await act(async () => {
      await view.result.current.seekParagraph("forward");
    });

    // All four paragraphs still stand, numbered as one continuous reply. A
    // forgotten reel would hold only the fourth and have nowhere to go.
    expect(view.result.current.canSeekParagraph).toBe(true);
    expect(enqueueAudio.mock.calls.map(([uri]) => uri)).toEqual([
      "file://two.m4a",
      "file://three.m4a",
      "file://four.m4a",
    ]);
  });

  it("opens seeking the moment a second paragraph exists", () => {
    // Back and Forward are drawn from this, so it has to be state the
    // workspace re-renders on, not a value read out of a ref mid-render.
    const { view } = setup();

    act(() => {
      view.result.current.recordAudio("file://one.m4a", undefined, undefined, {
        startsParagraph: true,
        text: "Only paragraph.",
      });
    });
    expect(view.result.current.canSeekParagraph).toBe(false);

    act(() => {
      view.result.current.recordAudio("file://two.m4a", undefined, undefined, {
        startsParagraph: true,
        text: "A second paragraph.",
      });
    });
    expect(view.result.current.canSeekParagraph).toBe(true);
  });

  it("forgets the paragraphs when the next answer supersedes them", () => {
    const { enqueueThree, playbackGenerationRef, view } = setup();
    enqueueThree();
    expect(view.result.current.canSeekParagraph).toBe(true);

    playbackGenerationRef.current = 2;
    act(() => {
      view.result.current.recordAudio("file://fresh.m4a", undefined, undefined, {
        startsParagraph: true,
        text: "fresh",
      });
    });

    expect(view.result.current.canSeekParagraph).toBe(false);
  });

  it("places the reading arc by paragraph length, not by paragraph count", () => {
    // 10 / 30 / 60 characters: the second paragraph starts a tenth of the way
    // in and the third four tenths, where an even split would say a third and
    // two thirds.
    const { enqueueThree, startChunk, view } = setup();
    enqueueThree();

    startChunk(0);
    expect(view.result.current.readingProgress).toBe(0);

    startChunk(1);
    expect(view.result.current.readingProgress).toBeCloseTo(0.1);

    startChunk(2);
    expect(view.result.current.readingProgress).toBeCloseTo(0.4);
  });

  it("moves the arc back by what the skipped paragraph holds", async () => {
    const { enqueueThree, startChunk, view } = setup();
    enqueueThree();
    startChunk(2);
    expect(view.result.current.readingProgress).toBeCloseTo(0.4);

    await act(async () => {
      await view.result.current.seekParagraph("back");
    });

    // Back inside the opening seconds means the paragraph before, and the arc
    // gives up exactly the three tenths that paragraph covers.
    expect(view.result.current.readingProgress).toBeCloseTo(0.1);
  });

  it("holds the arc still when a late paragraph re-weights the reply", () => {
    // A streamed reply grows while it is spoken. The second paragraph is a
    // quarter of two paragraphs but a tenth of three, and the arc must not
    // walk backwards through what has already been read.
    const { startChunk, view } = setup();
    act(() => {
      view.result.current.recordAudio("file://one.m4a", undefined, undefined, {
        startsParagraph: true,
        text: "x".repeat(10),
      });
      view.result.current.recordAudio("file://two.m4a", undefined, undefined, {
        startsParagraph: true,
        text: "x".repeat(30),
      });
    });
    startChunk(1);
    expect(view.result.current.readingProgress).toBeCloseTo(0.25);

    act(() => {
      view.result.current.recordAudio(
        "file://three.m4a",
        undefined,
        undefined,
        { startsParagraph: true, text: "x".repeat(60) },
      );
    });

    expect(view.result.current.readingProgress).toBeCloseTo(0.25);
  });

  it("keeps sentences of one paragraph together when seeking", async () => {
    // Two sentences in the first paragraph, one in the second: back from the
    // second sentence returns to the paragraph's first sentence.
    const { enqueueAudio, startChunk, view } = setup();
    act(() => {
      view.result.current.recordAudio("file://a1.m4a", undefined, undefined, {
        startsParagraph: true,
        text: "First sentence.",
      });
      view.result.current.recordAudio("file://a2.m4a", undefined, undefined, {
        startsParagraph: false,
        text: "Second sentence.",
      });
      view.result.current.recordAudio("file://b1.m4a", undefined, undefined, {
        startsParagraph: true,
        text: "New paragraph.",
      });
    });

    startChunk(1);
    jest.spyOn(Date, "now").mockReturnValue(Date.now() + 5_000);
    enqueueAudio.mockClear();

    await act(async () => {
      await view.result.current.seekParagraph("back");
    });

    expect(enqueueAudio.mock.calls.map(([uri]) => uri)).toEqual([
      "file://a1.m4a",
      "file://a2.m4a",
      "file://b1.m4a",
    ]);
    jest.restoreAllMocks();
  });
});
