export interface Attachment {
  id?: string;
  /** Image source. `null` draws a neutral placeholder tile. */
  uri?: string | null;
}

/**
 * The attachments of the next question, in a small panel anchored to the Image
 * satellite. One horizontally scrolling row of 64pt thumbs, each with its own
 * delete control, above one add action — or a single line of copy when nothing
 * is attached. Height is constant at every count.
 */
export interface AttachmentPopoverProps {
  visible?: boolean;
  attachments?: Attachment[];
  onRemove?: (id: string | undefined, index: number) => void;
  /** Hands off to the device's own picker — camera or library, any number. */
  onAdd?: () => void;
  /** Localised. Shown in place of the row when nothing is attached. */
  emptyLabel?: string;
  /** Localised label of the add action. */
  addLabel?: string;
  /** Tap-away dismissal. The workspace also closes it when the picker returns with images. */
  onClose?: () => void;
  width?: number;
  /** Absolute inside the nearest positioned ancestor (default) or fixed to the viewport. */
  inline?: boolean;
  /** Placement — the workspace passes `{ left: 0, bottom: "100%", marginBottom: 10 }` on the row. */
  style?: React.CSSProperties;
}

export function AttachmentPopover(props: AttachmentPopoverProps): JSX.Element | null;
