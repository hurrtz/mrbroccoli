import type { PhosphorIconName } from "../core/PhosphorIcon";

export interface PremiumBenefit {
  icon: PhosphorIconName;
  label: string;
}

export interface PremiumUpgradeModalProps {
  visible: boolean;
  onClose?: () => void;
  isPremium?: boolean;
  /** Store-formatted price. The action reads "Buy for €4.99". */
  price?: string;
  benefits?: PremiumBenefit[];
  description?: string;
  valueNote?: string;
  freeNote?: string;
  inline?: boolean;
}

export declare function PremiumUpgradeModal(props: PremiumUpgradeModalProps): JSX.Element;
