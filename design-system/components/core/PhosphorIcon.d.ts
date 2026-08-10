export type IconSize = "inline" | "compact" | "control" | "navigation" | "prominent" | "feature" | "hero";

export type PhosphorIconName =
  | "arrow-down" | "arrow-left" | "arrow-right" | "arrow-up" | "audio" | "check" | "check-circle"
  | "checkbox-checked" | "checkbox-unchecked" | "close" | "control" | "copy" | "customer-service"
  | "delete" | "down" | "download" | "edit" | "ellipsis-vertical" | "exclamation-circle" | "export"
  | "eye" | "eye-invisible" | "file-text" | "folder-open" | "global" | "branch" | "bug" | "headphones"
  | "inbox" | "image" | "info-circle" | "key" | "left" | "line-chart" | "loading" | "lock" | "menu"
  | "message" | "mic" | "pause" | "play-circle" | "plus" | "pushpin" | "redo" | "radio-selected"
  | "radio-unselected" | "reload" | "right" | "robot" | "safety-certificate" | "search" | "send"
  | "setting" | "share-alt" | "sliders" | "sound" | "stop" | "thunderbolt" | "up" | "warning" | "cpu";

export interface PhosphorIconProps {
  /** Semantic glyph name from the app's fixed set. */
  name: PhosphorIconName;
  /** Semantic visual size. Never a raw pixel number — the control owns the touch target. */
  size?: IconSize;
  color?: string;
  style?: React.CSSProperties;
}

export declare function PhosphorIcon(props: PhosphorIconProps): JSX.Element;
export declare const ICON_SIZE: Record<IconSize, number>;
export declare const MIN_ICON_TOUCH_TARGET: 44;
export declare function resolveIconSize(size: IconSize): number;
