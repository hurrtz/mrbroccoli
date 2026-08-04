import React from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import {
  ArrowClockwiseIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BugIcon,
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
  CopyIcon,
  CpuIcon,
  DownloadSimpleIcon,
  DotsThreeVerticalIcon,
  ExportIcon,
  EyeIcon,
  EyeSlashIcon,
  FileTextIcon,
  FolderOpenIcon,
  GearIcon,
  GlobeHemisphereWestIcon,
  GitBranchIcon,
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
  TrashIcon,
  TrayIcon,
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
  "ellipsis-vertical": DotsThreeVerticalIcon,
  "exclamation-circle": WarningCircleIcon,
  export: ExportIcon,
  eye: EyeIcon,
  "eye-invisible": EyeSlashIcon,
  "file-text": FileTextIcon,
  "folder-open": FolderOpenIcon,
  global: GlobeHemisphereWestIcon,
  branch: GitBranchIcon,
  bug: BugIcon,
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
  thunderbolt: LightningIcon,
  up: CaretUpIcon,
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
  style,
  testID,
}: {
  color: string;
  name: PhosphorIconName;
  size?: IconSize;
  style?: StyleProp<ViewStyle | Omit<TextStyle, "cursor">>;
  testID?: string;
}) {
  const Glyph = PHOSPHOR_ICONS[
    name
  ] as React.ComponentType<DecorativeIconProps>;
  const resolvedSize = resolveIconSize(size);

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
      weight="regular"
    />
  );
}
