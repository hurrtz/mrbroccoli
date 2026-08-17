import React from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import {
  ArrowClockwiseIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsSplitIcon,
  ArrowUpIcon,
  BrainIcon,
  BugIcon,
  CarIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  ChartLineUpIcon,
  ChatCircleIcon,
  CheckSquareIcon,
  CheckCircleIcon,
  CheckIcon,
  CircleIcon,
  CircuitryIcon,
  CopyIcon,
  CpuIcon,
  DownloadSimpleIcon,
  EggCrackIcon,
  EggIcon,
  DotsThreeVerticalIcon,
  ExportIcon,
  EyeIcon,
  EyeSlashIcon,
  FileTextIcon,
  FolderOpenIcon,
  GearIcon,
  GlobeHemisphereWestIcon,
  HeadphonesIcon,
  HeadsetIcon,
  InfoIcon,
  ImageIcon,
  KeyIcon,
  LightningIcon,
  ListIcon,
  LockIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  PauseIcon,
  PaperPlaneTiltIcon,
  PencilSimpleIcon,
  PlayIcon,
  PlayCircleIcon,
  PlusIcon,
  PushPinIcon,
  RepeatIcon,
  RobotIcon,
  RadioButtonIcon,
  ShareNetworkIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  SpeakerHighIcon,
  SpinnerGapIcon,
  SquareIcon,
  StopIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TrashIcon,
  TrayIcon,
  UsersThreeIcon,
  UserSoundIcon,
  WarningCircleIcon,
  WarningIcon,
  WaveformIcon,
  XIcon,
  type Icon,
  type IconProps,
} from "phosphor-react-native";

export const ICON_SIZE = {
  inline: 14,
  compact: 16,
  control: 20,
  navigation: 24,
  prominent: 28,
  feature: 32,
  hero: 40,
} as const;

export const MIN_ICON_TOUCH_TARGET = 44;

const PHOSPHOR_ICONS = {
  "arrow-down": ArrowDownIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-up": ArrowUpIcon,
  audio: WaveformIcon,
  check: CheckIcon,
  "check-circle": CheckCircleIcon,
  "checkbox-checked": CheckSquareIcon,
  "checkbox-unchecked": SquareIcon,
  close: XIcon,
  control: SlidersHorizontalIcon,
  copy: CopyIcon,
  "customer-service": HeadsetIcon,
  delete: TrashIcon,
  down: CaretDownIcon,
  download: DownloadSimpleIcon,
  edit: PencilSimpleIcon,
  egg: EggIcon,
  "egg-cracked": EggCrackIcon,
  "ellipsis-vertical": DotsThreeVerticalIcon,
  "exclamation-circle": WarningCircleIcon,
  export: ExportIcon,
  eye: EyeIcon,
  "eye-invisible": EyeSlashIcon,
  "file-text": FileTextIcon,
  "folder-open": FolderOpenIcon,
  global: GlobeHemisphereWestIcon,
  // The thinking phase's glyph on the voice orb. The surviving voice-action
  // bar keeps "robot"; the two deliberately coexist.
  brain: BrainIcon,
  // The DS maps the semantic branch name to arrows-split: a conversation
  // fork is a path splitting, not a developer's git operation.
  branch: ArrowsSplitIcon,
  bug: BugIcon,
  car: CarIcon,
  circuitry: CircuitryIcon,
  // Model Council. The key is the meaning, not the glyph name — matches the
  // design system's icon map, which also keys UsersThree as "council".
  council: UsersThreeIcon,
  headphones: HeadphonesIcon,
  inbox: TrayIcon,
  image: ImageIcon,
  "info-circle": InfoIcon,
  key: KeyIcon,
  left: CaretLeftIcon,
  "line-chart": ChartLineUpIcon,
  loading: SpinnerGapIcon,
  lock: LockIcon,
  menu: ListIcon,
  message: ChatCircleIcon,
  mic: MicrophoneIcon,
  pause: PauseIcon,
  play: PlayIcon,
  "play-circle": PlayCircleIcon,
  plus: PlusIcon,
  pushpin: PushPinIcon,
  redo: RepeatIcon,
  "radio-selected": RadioButtonIcon,
  "radio-unselected": CircleIcon,
  reload: ArrowClockwiseIcon,
  right: CaretRightIcon,
  robot: RobotIcon,
  "safety-certificate": ShieldCheckIcon,
  search: MagnifyingGlassIcon,
  send: PaperPlaneTiltIcon,
  setting: GearIcon,
  "share-alt": ShareNetworkIcon,
  sliders: SlidersHorizontalIcon,
  sound: SpeakerHighIcon,
  stop: StopIcon,
  "text-align-left": TextAlignLeftIcon,
  "text-align-right": TextAlignRightIcon,
  thunderbolt: LightningIcon,
  up: CaretUpIcon,
  "user-sound": UserSoundIcon,
  warning: WarningIcon,
  cpu: CpuIcon,
} satisfies Record<string, Icon>;

export type PhosphorIconName = keyof typeof PHOSPHOR_ICONS;
export type IconSize = keyof typeof ICON_SIZE;

export function resolveIconSize(size: IconSize) {
  return ICON_SIZE[size];
}

type DecorativeIconProps = IconProps & {
  accessible?: boolean;
  accessibilityElementsHidden?: boolean;
  focusable?: boolean;
  importantForAccessibility?: "auto" | "yes" | "no" | "no-hide-descendants";
};

export function PhosphorIcon({
  color,
  name,
  size = "control",
  weight = "regular",
  visualSize,
  style,
  testID,
}: {
  color: string;
  name: PhosphorIconName;
  size?: IconSize;
  /** Filled glyphs are reserved for active toggle state. */
  weight?: "regular" | "fill";
  /**
   * The voice orb's deliberate exception to the semantic scale: its glyph is
   * a fixed proportion of a measured diameter, so no static token can name
   * it. Everything else uses the semantic sizes.
   */
  visualSize?: number;
  style?: StyleProp<ViewStyle | Omit<TextStyle, "cursor">>;
  testID?: string;
}) {
  const Glyph = PHOSPHOR_ICONS[
    name
  ] as React.ComponentType<DecorativeIconProps>;
  const resolvedSize = visualSize ?? resolveIconSize(size);

  return (
    <Glyph
      accessible={false}
      accessibilityElementsHidden
      color={color}
      focusable={false}
      importantForAccessibility="no-hide-descendants"
      size={resolvedSize}
      style={[{ color, width: resolvedSize, height: resolvedSize }, style]}
      testID={testID ?? `phosphor-icon-${name}`}
      weight={weight}
    />
  );
}
