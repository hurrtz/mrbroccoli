import type { IconSize } from "../core/PhosphorIcon";

export interface ProviderIconProps {
  /** Provider id, e.g. "openai", "anthropic", "gemini", "xai". */
  provider: string;
  /** The mark is masked to this colour so it inherits the surface's foreground. */
  color?: string;
  /** Used to build the two-letter fallback when no mark is shipped. */
  label?: string;
  size?: IconSize;
  /** Path to the provider SVG folder, relative to the page. */
  assetBase?: string;
}

export declare function ProviderIcon(props: ProviderIconProps): JSX.Element;
