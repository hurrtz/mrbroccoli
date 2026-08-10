export interface MessageImageAttachment {
  id: string;
  uri: string;
}

export interface MessageImageAttachmentsProps {
  attachments?: MessageImageAttachment[];
  /** Present only in the composer; committed messages show no remove control. */
  onRemove?: (attachmentId: string) => void;
  compact?: boolean;
}

export declare function MessageImageAttachments(props: MessageImageAttachmentsProps): JSX.Element | null;
