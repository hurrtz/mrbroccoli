import React from "react";
import type { PhosphorIconName } from "../core/PhosphorIcon";

export interface ChatBubbleAction {
  icon: PhosphorIconName;
  label: string;
  showLabel?: boolean;
  onPress?: () => void;
}

export interface ChatBubbleProps {
  role: "user" | "assistant";
  text: string;
  /** Assistant only — the curated model name, e.g. "Claude Sonnet 4.5". */
  model?: string;
  provider?: string;
  /** Pre-formatted: "09.08.26 · 14:12". Never a relative string. */
  timestamp?: string;
  edited?: boolean;
  actions?: ChatBubbleAction[];
  /** Receipts, references, usage and notice cards belong here, under the text. */
  children?: React.ReactNode;
  assetBase?: string;
}

export declare function ChatBubble(props: ChatBubbleProps): JSX.Element;
