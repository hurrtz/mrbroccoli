import type { VoicePhase } from "./VoiceOrb";

/**
 * The orb with its four transport verbs in orbit — Back and Forward on the
 * flanks, Restart and Stop on the lower diagonals. Use this anywhere the orb
 * appears, at every phase: the cluster's footprint is permanent (328×227 at a
 * 196pt orb with labels, inside a 4.7" column), so the orb never moves when a
 * turn starts; the keys render for turn phases only, and their presence is the
 * signal that a turn is running. The row beneath stays composing at every phase.
 */
export interface OrbTransportProps {
  /** Which pipeline phase the orb is showing. Keys appear for every phase but idle. */
  phase?: VoicePhase;
  /** Orb diameter. 196 in portrait, 150 in landscape; the cluster sizes itself from it. */
  orbSize?: number;
  /** Mono captions under each key. False in landscape, where the column has no room. */
  labels?: boolean;
  phaseProgress?: number;
  turnProgress?: number;
  overtime?: number;
  /** The orb's own tap: pause/resume, position kept. */
  onOrbPress?: () => void;
  /** Replays the response from its first word. Live only while he speaks. */
  onRestart?: () => void;
  /** Start of the current paragraph, or the preceding one inside the first two seconds. Live only while he speaks. */
  onBack?: () => void;
  /** Next paragraph. Live only while he speaks. */
  onForward?: () => void;
  /** Abandons the turn and returns to idle. Live in every turn phase. Ending the hands-free loop is NOT this — that is the Hands free switch in the composing row. */
  onStop?: () => void;
  style?: React.CSSProperties;
}

export function OrbTransport(props: OrbTransportProps): JSX.Element;
