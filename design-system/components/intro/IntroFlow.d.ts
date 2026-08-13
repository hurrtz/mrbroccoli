export type IntroStep = "welcome" | "setup" | "try";
export declare const INTRO_STEPS: IntroStep[];
export declare const INTRO_COPY: Record<string, string>;

export interface IntroManualRow {
  id: string;
  label: string;
  /** Mono meta: install state · size, or provider attribution. Omit for system routes. */
  meta?: string;
  selected?: boolean;
  /** Radio dimmed until the model has tested viable (settings lifecycle). */
  disabled?: boolean;
  /** Free-edition ghost with lock glyph. */
  locked?: boolean;
  /** "download" renders the IconAction download squircle. */
  action?: "download" | null;
}
export interface IntroManualGroup {
  label: string;
  required?: boolean;
  rows: IntroManualRow[];
}
/** Pipeline-ordered defaults: He listens · He thinks (required) · He answers. */
export declare const DEFAULT_MANUAL_GROUPS: IntroManualGroup[];

export interface IntroTestTurn {
  question: string;
  answer: string;
  /** Release-to-first-word latency, e.g. "2.4 s". */
  latency: string;
}
/** The sample turn a preview mic-press produces when onPressMic is not wired. */
export declare const DEMO_TURN: IntroTestTurn;

export interface IntroFlowProps {
  visible?: boolean;
  initialStep?: number;
  /** First run: no close control, gated forward (step 2) and Done (step 3). Re-entry (false) relaxes all three. */
  firstRun?: boolean;
  /** True once a reasoning model is actually running — unlocks step 2's forward action. */
  thinkingReady?: boolean;
  /** Show step 3 with this turn already taken (unlocks Done). */
  demoTurn?: IntroTestTurn | null;
  /** String overrides merged over INTRO_COPY (translation). */
  copy?: Record<string, string>;
  /** AutoSetupCard cardProps; the hero button calls autoSetup.onStart, and any non-idle state renders the card. */
  autoSetup?: object;
  manualGroups?: IntroManualGroup[];
  /** Display label of the intro-recording language, e.g. "English". */
  language?: string;
  onChangeLanguage?: () => void;
  onClose?: () => void;
  /** Wire the real hold-to-talk; unwired, a press shows DEMO_TURN. */
  onPressMic?: () => void;
  onSelectRoute?: (rowId: string) => void;
  onDownloadModel?: (rowId: string) => void;
  style?: React.CSSProperties;
}
export declare function IntroFlow(props: IntroFlowProps): JSX.Element | null;
