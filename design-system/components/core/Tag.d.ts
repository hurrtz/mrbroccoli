import React from "react";

export interface TagProps {
  children: React.ReactNode;
  selected: boolean;
  onChange: () => void;
  style?: React.CSSProperties;
}

export declare function Tag(props: TagProps): JSX.Element;
