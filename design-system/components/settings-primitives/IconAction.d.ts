export interface IconActionProps {
  /** Semantic PhosphorIcon name: "download", "close", "egg", "egg-cracked", "reload", "loading". */
  icon: string;
  /** Accessibility label — required, the button has no text. */
  label: string;
  danger?: boolean;
  /** Spin the glyph (in-flight states with icon "loading"). */
  spin?: boolean;
  onPress?: () => void;
}
export declare function IconAction(props: IconActionProps): JSX.Element;
