import { useCallback, useRef, useState } from "react";

import type { SpeechDiagnosticsContext } from "../../services/speech/diagnostics";

type SpeakOptions = {
  voice?: string;
  language?: string;
  diagnostics?: SpeechDiagnosticsContext;
  onPlaybackStarted?: () => void;
  startsParagraph?: boolean;
};

/** What a clip says, so paragraphs can be grouped and weighted. */
export type PlaybackChunk = { text: string; startsParagraph: boolean };

type PlaybackUnit = {
  /** Which paragraph this unit belongs to. */
  paragraph: number;
  /** Characters spoken: the stand-in for how long this unit takes. */
  weight: number;
} & (
  | {
      kind: "audio";
      audioUri: string;
      diagnostics?: SpeechDiagnosticsContext;
      onPlaybackStarted?: () => void;
    }
  | { kind: "speech"; text: string; options?: SpeakOptions }
);

/** How long after a paragraph starts that "back" still means the one before. */
const BACK_TO_PREVIOUS_WINDOW_MS = 2000;

interface UsePlaybackReelParams {
  enqueueAudio: (
    audioUri: string,
    diagnostics?: SpeechDiagnosticsContext,
    onPlaybackStarted?: () => void,
  ) => void;
  speakText: (text: string, options?: SpeakOptions) => void;
  /** Bumped by the player whenever a new response supersedes the last. */
  playbackGenerationRef: { current: number };
  resetCancellation: () => void;
  stopPlayback: () => Promise<void> | void;
}

/**
 * The response as an ordered reel of the paragraphs it was spoken in.
 *
 * The native queue takes whole clips and cannot seek inside one, but a reply
 * arrives as a sequence of chunks that each report when they start, and the
 * pipeline tells us which of them open a paragraph. That is enough to move
 * between paragraphs without any native work: remember the units of the
 * current response, remember which one is playing, then stop and play the reel
 * again from the first unit of the paragraph asked for.
 *
 * Paragraphs differ in length, so each unit carries the weight of what it says
 * and `readingProgress` measures the response in those weights. A seek then
 * moves the orb's arc by what the paragraph actually holds rather than by an
 * even step per paragraph.
 *
 * The reel resets whenever the player's generation changes, so a new answer
 * never inherits the last one's paragraphs.
 */
export function usePlaybackReel({
  enqueueAudio,
  speakText,
  playbackGenerationRef,
  resetCancellation,
  stopPlayback,
}: UsePlaybackReelParams) {
  const unitsRef = useRef<PlaybackUnit[]>([]);
  const generationRef = useRef(playbackGenerationRef.current);
  const playingIndexRef = useRef(-1);
  const startedAtRef = useRef(0);
  const floorRef = useRef(0);
  const [readingProgress, setReadingProgress] = useState<number | null>(null);
  // State, not a ref read: Back and Forward have to come alive the moment the
  // reply holds a second paragraph, and nothing else is guaranteed to
  // re-render the workspace at that moment.
  const [paragraphCount, setParagraphCount] = useState(0);

  /**
   * How much of the response has been read, in spoken weight.
   *
   * **Decision:** the arc only runs backwards when the listener sends it
   * back. A streamed reply grows while it is being spoken, so a paragraph
   * arriving late enlarges the denominator and would otherwise drag the arc
   * backwards through content already read. Holding the last value until the
   * true position catches up stalls; regressing lies.
   */
  const publishProgress = useCallback((rewind = false) => {
    const units = unitsRef.current;
    const playing = playingIndexRef.current;
    if (playing < 0 || playing >= units.length) {
      setReadingProgress(null);
      return;
    }

    let read = 0;
    let total = 0;
    units.forEach((unit, index) => {
      total += unit.weight;
      if (index < playing) {
        read += unit.weight;
      }
    });
    if (total <= 0) {
      setReadingProgress(null);
      return;
    }

    const measured = read / total;
    const next = rewind ? measured : Math.max(measured, floorRef.current);
    floorRef.current = next;
    setReadingProgress(next);
  }, []);

  const syncGeneration = useCallback(() => {
    if (generationRef.current !== playbackGenerationRef.current) {
      generationRef.current = playbackGenerationRef.current;
      unitsRef.current = [];
      playingIndexRef.current = -1;
      floorRef.current = 0;
      setReadingProgress(null);
      setParagraphCount(0);
    }
  }, [playbackGenerationRef]);

  /** Reports the absolute unit, so a seeked reel still counts from zero. */
  const markStarted = useCallback(
    (index: number) => {
      playingIndexRef.current = index;
      startedAtRef.current = Date.now();
      publishProgress();
    },
    [publishProgress],
  );

  const play = useCallback(
    (unit: PlaybackUnit, index: number) => {
      if (unit.kind === "audio") {
        enqueueAudio(unit.audioUri, unit.diagnostics, () => {
          markStarted(index);
          unit.onPlaybackStarted?.();
        });
        return;
      }

      speakText(unit.text, {
        ...unit.options,
        onPlaybackStarted: () => {
          markStarted(index);
          unit.options?.onPlaybackStarted?.();
        },
      });
    },
    [enqueueAudio, markStarted, speakText],
  );

  const nextParagraph = useCallback((startsParagraph: boolean) => {
    const units = unitsRef.current;
    if (units.length === 0) {
      return 0;
    }
    const last = units[units.length - 1].paragraph;
    return startsParagraph ? last + 1 : last;
  }, []);

  const append = useCallback(
    (unit: PlaybackUnit) => {
      unitsRef.current = [...unitsRef.current, unit];
      play(unit, unitsRef.current.length - 1);
      setParagraphCount(unit.paragraph + 1);
      // A late paragraph changes what the response weighs, so the arc is
      // remeasured against the reel as it now stands.
      publishProgress();
    },
    [play, publishProgress],
  );

  const recordAudio = useCallback(
    (
      audioUri: string,
      diagnostics?: SpeechDiagnosticsContext,
      onPlaybackStarted?: () => void,
      chunk?: PlaybackChunk,
    ) => {
      syncGeneration();
      append({
        audioUri,
        diagnostics,
        kind: "audio",
        onPlaybackStarted,
        paragraph: nextParagraph(chunk?.startsParagraph ?? false),
        weight: chunk?.text.length ?? 1,
      });
    },
    [append, nextParagraph, syncGeneration],
  );

  const recordSpeech = useCallback(
    (text: string, options?: SpeakOptions) => {
      syncGeneration();
      append({
        kind: "speech",
        options,
        paragraph: nextParagraph(options?.startsParagraph ?? false),
        text,
        weight: text.length,
      });
    },
    [append, nextParagraph, syncGeneration],
  );

  /** The reel's paragraphs in reading order. */
  const paragraphOrder = useCallback(
    () => [...new Set(unitsRef.current.map((unit) => unit.paragraph))],
    [],
  );

  const seekParagraph = useCallback(
    async (direction: "back" | "forward") => {
      const units = unitsRef.current;
      const playing = playingIndexRef.current;
      if (units.length === 0 || playing < 0) {
        return;
      }

      const current = units[playing].paragraph;
      const paragraphs = paragraphOrder();
      const position = paragraphs.indexOf(current);
      const withinWindow =
        Date.now() - startedAtRef.current < BACK_TO_PREVIOUS_WINDOW_MS;
      // Back means the start of this paragraph, unless it has barely begun, in
      // which case it means the one before. Forward always means the next.
      const targetParagraph =
        direction === "forward"
          ? paragraphs[position + 1]
          : withinWindow
            ? paragraphs[position - 1]
            : current;

      if (targetParagraph === undefined) {
        return;
      }

      const target = units.findIndex(
        (unit) => unit.paragraph === targetParagraph,
      );
      if (target < 0) {
        return;
      }

      await stopPlayback();
      resetCancellation();
      // Both of those bump the player's generation. That marker means "a new
      // answer supersedes this one", and a seek is the opposite — the same
      // answer, from further back — so the reel adopts the new number instead
      // of forgetting the reply it is still reading.
      generationRef.current = playbackGenerationRef.current;
      playingIndexRef.current = target;
      // The listener asked to move back, so the arc is allowed to follow.
      publishProgress(direction === "back");
      units.slice(target).forEach((unit, offset) => play(unit, target + offset));
    },
    [
      paragraphOrder,
      play,
      playbackGenerationRef,
      publishProgress,
      resetCancellation,
      stopPlayback,
    ],
  );

  return {
    canSeekParagraph: paragraphCount > 1,
    readingProgress,
    recordAudio,
    recordSpeech,
    seekParagraph,
  };
}
