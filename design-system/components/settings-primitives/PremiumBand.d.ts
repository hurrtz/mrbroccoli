export interface PremiumBandProps {
  /** One supporting line under the "Premium" wordline. */
  copy: string;
  /** Default "Upgrade". */
  actionLabel?: string;
  /** Opens the one upgrade sheet (PremiumUpgradeModal). */
  onPress?: () => void;
}
export declare function PremiumBand(props: PremiumBandProps): JSX.Element;
