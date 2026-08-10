import type { IconSize, PhosphorIconName } from "../core/PhosphorIcon";

export interface AntButtonLabelProps {
  /** Match the surface: on-active-control on primary, accent on ghost, on-danger on warning. */
  color: string;
  icon?: PhosphorIconName;
  iconSize?: IconSize;
  label: string;
}

export declare function AntButtonLabel(props: AntButtonLabelProps): JSX.Element;
