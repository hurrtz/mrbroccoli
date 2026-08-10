import React from "react";

export interface ListItemProps {
  children?: React.ReactNode;
  /** Secondary line. Equivalent to nesting a <ListItem.Brief>. */
  brief?: React.ReactNode;
  /** Trailing slot: a value, a chevron, a switch. */
  extra?: React.ReactNode;
  /** Leading slot: a provider mark or a section icon. */
  thumb?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export declare function ListItem(props: ListItemProps): JSX.Element;
export declare namespace ListItem {
  function Brief(props: { children?: React.ReactNode; style?: React.CSSProperties }): JSX.Element;
}
