import React from "react";

export interface DialogAction {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** success paints the action as the confirming button. */
  tone?: "default" | "success";
}

/** The app's dialog shell: centred sheet, rounded 20, header row with a close control. */
export interface ModalProps {
  visible: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Footer actions stay on-screen: the body scrolls before they move. */
  footer?: DialogAction[];
  /** sheet pins to the bottom edge and rounds only its top corners. */
  layout?: "dialog" | "sheet";
  maskClosable?: boolean;
  onClose?: () => void;
  /** Position over the nearest positioned ancestor instead of the viewport. */
  inline?: boolean;
}

export declare function Modal(props: ModalProps): JSX.Element | null;
