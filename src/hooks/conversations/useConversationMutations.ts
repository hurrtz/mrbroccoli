import {
  useCallback,
  useRef,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import { reconcileConversationMessageLinks } from "../../utils/conversationMessageLinks";
import uuid from "react-native-uuid";
import {
  Conversation,
  ConversationBranchResult,
  ConversationMeta,
  ConversationSettings,
  Message,
  MessageImageAttachment,
  Provider,
  UsageEstimate,
} from "../../types";
import type {
  AppDataBackupConversation,
  AppDataBackupRestoreResult,
} from "../../services/appDataBackup";
import {
  buildConversationMetaFromConversation,
  sortConversationMeta,
  normalizeConversationTitle,
  truncateConversationTitle,
} from "./meta";
import {
  consumeFirstPrompt,
  readConversation,
  readStoredConversationMetas,
  persistConversationMeta,
  renameStoredConversation,
  removeConversation,
  saveConversation,
  saveConversationBranch,
  setConversationPinned,
  setStoredConversationLock,
  saveConversationsAtomically,
} from "./storage";
import {
  removeConversationKnowledge,
  setConversationKnowledgeExcluded,
  syncConversationKnowledge,
} from "../../services/conversationKnowledge";
import {
  deleteImageAttachments,
  readImageAttachmentData,
  writeRestoredImageAttachment,
} from "../../services/imageAttachmentFiles";

// Files cannot participate in a SQLite transaction. Transfer ownership to the
// conversation row only after every staged record commits.
async function withStagedImages<T>(
  write: (created: MessageImageAttachment[]) => Promise<T>,
) {
  const created: MessageImageAttachment[] = [];
  try {
    return await write(created);
  } catch (error) {
    await deleteImageAttachments(created);
    throw error;
  }
}

async function cloneMessagesForBranch(
  messages: Message[],
  createdAttachments: MessageImageAttachment[],
) {
  const attachmentsBySourceId = new Map<string, MessageImageAttachment>();
  const messageIds = new Map<string, string>();

  const clonedMessages: Message[] = [];
  for (const message of messages) {
    const id = uuid.v4() as string;
    messageIds.set(message.id, id);
    const attachments: MessageImageAttachment[] = [];

    for (const attachment of message.attachments ?? []) {
      let clonedAttachment = attachmentsBySourceId.get(attachment.id);
      if (!clonedAttachment) {
        clonedAttachment = await writeRestoredImageAttachment({
          ...attachment,
          data: await readImageAttachmentData(attachment),
          id: uuid.v4() as string,
        });
        attachmentsBySourceId.set(attachment.id, clonedAttachment);
        createdAttachments.push(clonedAttachment);
      }
      attachments.push(clonedAttachment);
    }

    clonedMessages.push({
      ...message,
      id,
      ...(attachments.length > 0
        ? { attachments }
        : { attachments: undefined }),
    });
  }

  return { clonedMessages, messageIds };
}

async function isIdenticalBackupConversation(
  existing: Conversation,
  record: AppDataBackupConversation,
) {
  const { awaitingFirstPrompt: _pendingTitle, ...existingConversation } =
    existing;
  const portableExisting: Conversation = {
    ...existingConversation,
    messages: existing.messages.map((message, messageIndex) => ({
      ...message,
      attachments: message.attachments?.map((attachment, attachmentIndex) => {
        const backupAttachment =
          record.conversation.messages[messageIndex]?.attachments?.[
            attachmentIndex
          ];
        return {
          ...attachment,
          id: backupAttachment?.id ?? attachment.id,
          uri:
            backupAttachment?.uri ??
            `mrbroccoli-backup://image/${attachment.id}`,
        };
      }),
    })),
  };
  const { awaitingFirstPrompt: _importedPendingTitle, ...portableIncoming } =
    record.conversation;
  if (JSON.stringify(portableExisting) !== JSON.stringify(portableIncoming)) {
    return false;
  }

  const dataById = new Map(
    (record.attachments ?? []).map((attachment) => [
      attachment.id,
      attachment.data,
    ]),
  );
  try {
    const comparisons = await Promise.all(
      existing.messages.flatMap((message, messageIndex) =>
        (message.attachments ?? []).map(async (attachment, attachmentIndex) => {
          const backupId =
            record.conversation.messages[messageIndex]?.attachments?.[
              attachmentIndex
            ]?.id;
          const expected = backupId ? dataById.get(backupId) : undefined;
          return (
            expected !== undefined &&
            (await readImageAttachmentData(attachment)) === expected
          );
        }),
      ),
    );
    return comparisons.every(Boolean);
  } catch {
    return false;
  }
}

async function materializeBackupConversation(
  record: AppDataBackupConversation,
  createdAttachments: MessageImageAttachment[],
) {
  const backupAttachments = new Map(
    (record.attachments ?? []).map((attachment) => [attachment.id, attachment]),
  );
  const restoredAttachments = new Map<
    string,
    Awaited<ReturnType<typeof writeRestoredImageAttachment>>
  >();

  for (const message of record.conversation.messages) {
    for (const attachment of message.attachments ?? []) {
      if (restoredAttachments.has(attachment.id)) {
        continue;
      }
      const backupAttachment = backupAttachments.get(attachment.id);
      if (!backupAttachment) {
        throw new Error("Backup image data is missing.");
      }
      const restored = await writeRestoredImageAttachment({
        ...backupAttachment,
        id: uuid.v4() as string,
        sharedWithProviders: attachment.sharedWithProviders,
      });
      createdAttachments.push(restored);
      restoredAttachments.set(attachment.id, restored);
    }
  }

  return {
    ...record.conversation,
    messages: record.conversation.messages.map((message) => ({
      ...message,
      attachments: message.attachments?.map((attachment) => {
        const restored = restoredAttachments.get(attachment.id);
        if (!restored) {
          throw new Error("Backup image data is missing.");
        }
        return restored;
      }),
    })),
  };
}

export function useConversationMutations(params: {
  activeConversationRef: MutableRefObject<Conversation | null>;
  canAccessConversation: (id: string, documentLocked?: boolean) => boolean;
  conversationMetas: ConversationMeta[];
  setActiveConversationValue: (conversation: Conversation | null) => void;
  setConversations: Dispatch<SetStateAction<ConversationMeta[]>>;
  pastConversationKnowledgeEnabled: boolean;
}) {
  const {
    activeConversationRef,
    canAccessConversation,
    conversationMetas,
    setActiveConversationValue,
    setConversations,
    pastConversationKnowledgeEnabled,
  } = params;
  const selectionRequestRef = useRef(0);

  const createConversation = useCallback(
    (
      firstMessage: string,
      initialModel: string | null = null,
      initialProvider: Provider | null = null,
      initialSettings?: ConversationSettings,
    ) => {
      selectionRequestRef.current += 1;
      const now = new Date().toISOString();
      const conversation: Conversation = {
        id: uuid.v4() as string,
        title: truncateConversationTitle(firstMessage),
        createdAt: now,
        updatedAt: now,
        messages: [],
        awaitingFirstPrompt: true,
        ...(initialSettings && Object.keys(initialSettings).length > 0
          ? { settings: initialSettings }
          : {}),
      };
      const meta: ConversationMeta = {
        id: conversation.id,
        title: conversation.title,
        createdAt: now,
        updatedAt: now,
        messageCount: 0,
        providers: initialProvider ? [initialProvider] : [],
        providerModels:
          initialProvider && initialModel
            ? { [initialProvider]: [initialModel] }
            : {},
        lastModel: initialModel,
        lastProvider: initialProvider,
        pinned: false,
        isLocked: false,
        archived: false,
        branchSchemaVersion: 2,
        providerHistoryVersion: 1,
      };

      setConversations((previous) => sortConversationMeta([meta, ...previous]));
      void saveConversation(conversation, { initialMeta: meta });
      setActiveConversationValue(conversation);
      return conversation.id;
    },
    [setActiveConversationValue, setConversations],
  );

  const claimFirstPrompt = useCallback(
    async (id: string) => {
      const active = activeConversationRef.current;
      if (active?.id !== id || !active.awaitingFirstPrompt) return null;
      const { awaitingFirstPrompt: _claimed, ...conversation } = active;
      // A second submission in the same event loop must see this immediately.
      const claim = consumeFirstPrompt(id);
      setActiveConversationValue(conversation);
      const title = await claim;
      return active.isLocked ? null : title;
    },
    [activeConversationRef, setActiveConversationValue],
  );

  const selectConversation = useCallback(
    async (id: string) => {
      if (!canAccessConversation(id)) {
        return;
      }
      const requestId = selectionRequestRef.current + 1;
      selectionRequestRef.current = requestId;
      const conversation = await readConversation(id);

      if (
        conversation &&
        selectionRequestRef.current === requestId &&
        canAccessConversation(id, conversation.isLocked)
      ) {
        const previous = conversationMetas.find((meta) => meta.id === id);
        if (previous && previous.providerHistoryVersion !== 1) {
          const repaired = buildConversationMetaFromConversation(
            conversation,
            previous,
          );
          persistConversationMeta([repaired], [previous]);
          setConversations((current) =>
            current.map((meta) => (meta.id === id ? repaired : meta)),
          );
        }
        setActiveConversationValue(conversation);
      }
    },
    [
      canAccessConversation,
      conversationMetas,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const getConversationById = useCallback(
    async (id: string, strict = false) => {
      if (!canAccessConversation(id)) {
        return null;
      }
      if (!strict && activeConversationRef.current?.id === id) {
        return canAccessConversation(id, activeConversationRef.current.isLocked)
          ? activeConversationRef.current
          : null;
      }

      const conversation = await readConversation(id, strict);
      return canAccessConversation(id, conversation?.isLocked)
        ? conversation
        : null;
    },
    [activeConversationRef, canAccessConversation],
  );

  const addMessage = useCallback(
    (messageInput: Omit<Message, "id" | "timestamp">) => {
      const currentConversation = activeConversationRef.current;

      if (!currentConversation) {
        return null;
      }

      const message: Message = {
        ...messageInput,
        id: uuid.v4() as string,
        timestamp: new Date().toISOString(),
      };
      const startsAssistantCheckpointBranch =
        messageInput.role === "user" &&
        currentConversation.branch?.kind === "continue-from-message" &&
        currentConversation.messages.at(-1)?.id ===
          currentConversation.branch.branchMessageId;
      const updatedConversation: Conversation = {
        ...currentConversation,
        ...(startsAssistantCheckpointBranch
          ? { title: truncateConversationTitle(message.content) }
          : {}),
        updatedAt: message.timestamp,
        messages: [...currentConversation.messages, message],
      };
      setActiveConversationValue(updatedConversation);
      void saveConversation(updatedConversation, {
        preserveTitle: !startsAssistantCheckpointBranch,
        mode: "update",
      });
      if (
        messageInput.role === "user" &&
        pastConversationKnowledgeEnabled &&
        !updatedConversation.isLocked
      ) {
        void syncConversationKnowledge(updatedConversation, true);
      }
      setConversations((previous) =>
        sortConversationMeta(
          previous.map((meta) =>
            meta.id === updatedConversation.id
              ? buildConversationMetaFromConversation(updatedConversation, meta)
              : meta,
          ),
        ),
      );

      return message;
    },
    [
      activeConversationRef,
      pastConversationKnowledgeEnabled,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const updateMessage = useCallback(
    (messageId: string, updater: (message: Message) => Message) => {
      const currentConversation = activeConversationRef.current;

      if (!currentConversation) {
        return null;
      }

      let updatedMessage: Message | null = null;
      const nextMessages = currentConversation.messages.map((message) => {
        if (message.id !== messageId) {
          return message;
        }

        updatedMessage = updater(message);
        return updatedMessage;
      });

      if (!updatedMessage) {
        return null;
      }

      const updatedAt = new Date().toISOString();
      const updatedConversation: Conversation = {
        ...currentConversation,
        updatedAt,
        messages: nextMessages,
      };

      setActiveConversationValue(updatedConversation);
      void saveConversation(updatedConversation, {
        preserveTitle: true,
        mode: "update",
      });
      setConversations((previous) =>
        sortConversationMeta(
          previous.map((meta) =>
            meta.id === updatedConversation.id
              ? buildConversationMetaFromConversation(updatedConversation, meta)
              : meta,
          ),
        ),
      );

      return updatedMessage;
    },
    [activeConversationRef, setActiveConversationValue, setConversations],
  );

  const removeMessage = useCallback(
    async (messageId: string) => {
      const currentConversation = activeConversationRef.current;
      const removedMessage = currentConversation?.messages.find(
        (message) => message.id === messageId,
      );

      if (!currentConversation || !removedMessage) {
        return false;
      }

      // An assistant stream can append or update a message while the SQLite write
      // is pending. Reapply the deletion to its newest document before releasing
      // any bytes a concurrent save could still reference.
      let source = currentConversation;
      let updatedConversation: Conversation;
      for (;;) {
        updatedConversation = reconcileConversationMessageLinks({
          ...source,
          updatedAt: new Date().toISOString(),
          messages: source.messages.filter(
            (message) => message.id !== messageId,
          ),
        });
        delete updatedConversation.contextSummary;
        delete updatedConversation.summarizedMessageCount;
        if (
          !(await saveConversation(updatedConversation, {
            clearRouteHistory: true,
            preserveTitle: true,
            mode: "update",
          }))
        )
          return false;
        if (activeConversationRef.current === source) {
          setActiveConversationValue(updatedConversation);
          break;
        }
        const latest =
          activeConversationRef.current?.id === source.id
            ? activeConversationRef.current
            : await readConversation(source.id);
        if (!latest) return false;
        if (!latest.messages.some(({ id }) => id === messageId)) {
          updatedConversation = latest;
          break;
        }
        source = latest;
      }
      const retainedImages = new Set(
        updatedConversation.messages.flatMap(
          (message) => message.attachments?.map(({ id }) => id) ?? [],
        ),
      );
      const removedImages = (removedMessage.attachments ?? []).filter(
        ({ id }) => !retainedImages.has(id),
      );
      setConversations((previous) =>
        sortConversationMeta(
          previous.map((meta) =>
            meta.id === updatedConversation.id
              ? buildConversationMetaFromConversation(updatedConversation, {
                  ...meta,
                  // Removing the final provider-authored message must not
                  // leave its route represented in the drawer metadata.
                  providers: [],
                  providerModels: {},
                  lastModel: null,
                  lastProvider: null,
                })
              : meta,
          ),
        ),
      );

      await Promise.all([
        deleteImageAttachments(removedImages),
        pastConversationKnowledgeEnabled && !updatedConversation.isLocked
          ? syncConversationKnowledge(updatedConversation, true)
          : undefined,
      ]);

      return true;
    },
    [
      activeConversationRef,
      pastConversationKnowledgeEnabled,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const editUserMessage = useCallback(
    async (messageId: string, content: string) => {
      const currentConversation = activeConversationRef.current;
      const normalizedContent = content.trim();

      if (!currentConversation || !normalizedContent) {
        return false;
      }

      const existingMessage = currentConversation.messages.find(
        (message) => message.id === messageId,
      );
      if (
        !existingMessage ||
        existingMessage.role !== "user" ||
        existingMessage.content === normalizedContent
      ) {
        return false;
      }

      const updatedAt = new Date().toISOString();
      const updatedConversation: Conversation = {
        ...currentConversation,
        updatedAt,
        messages: currentConversation.messages.map((message) =>
          message.id === messageId
            ? { ...message, content: normalizedContent, editedAt: updatedAt }
            : message,
        ),
      };
      delete updatedConversation.contextSummary;
      delete updatedConversation.summarizedMessageCount;

      setActiveConversationValue(updatedConversation);
      if (!(await saveConversation(updatedConversation, { mode: "update" })))
        return false;
      setConversations((previous) =>
        sortConversationMeta(
          previous.map((meta) =>
            meta.id === updatedConversation.id ? { ...meta, updatedAt } : meta,
          ),
        ),
      );

      if (pastConversationKnowledgeEnabled && !updatedConversation.isLocked) {
        await syncConversationKnowledge(updatedConversation, true);
      }

      return true;
    },
    [
      activeConversationRef,
      pastConversationKnowledgeEnabled,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const branchConversationAtMessage = useCallback(
    async (messageId: string): Promise<ConversationBranchResult | null> => {
      const currentConversation = activeConversationRef.current;
      const messageIndex =
        currentConversation?.messages.findIndex(
          (message) => message.id === messageId,
        ) ?? -1;
      const sourceMessage = currentConversation?.messages[messageIndex];

      if (!currentConversation || messageIndex < 0 || !sourceMessage) {
        return null;
      }

      const branch = await withStagedImages(async (created) => {
        const now = new Date().toISOString();
        const { clonedMessages, messageIds } = await cloneMessagesForBranch(
          currentConversation.messages.slice(0, messageIndex + 1),
          created,
        );
        const checkpointMessage = clonedMessages.at(-1);
        if (!checkpointMessage) {
          return null;
        }

        const conversationId = uuid.v4() as string;
        const rootConversationId =
          currentConversation.branch?.rootConversationId ??
          currentConversation.id;
        const artifacts = currentConversation.artifacts
          ?.map((artifact) => {
            const clonedSourceMessageId = artifact.sourceMessageId
              ? messageIds.get(artifact.sourceMessageId)
              : undefined;
            return clonedSourceMessageId
              ? {
                  ...artifact,
                  id: uuid.v4() as string,
                  sourceMessageId: clonedSourceMessageId,
                }
              : null;
          })
          .filter((artifact) => artifact !== null);
        const branchDocument: Conversation = {
          id: conversationId,
          title: truncateConversationTitle(
            sourceMessage.role === "user"
              ? checkpointMessage.content
              : currentConversation.title,
          ),
          createdAt: now,
          updatedAt: now,
          messages: clonedMessages,
          awaitingFirstPrompt: true,
          branch: {
            rootConversationId,
            parentConversationId: currentConversation.id,
            parentMessageId: sourceMessage.id,
            branchMessageId: checkpointMessage.id,
            kind:
              sourceMessage.role === "assistant"
                ? "continue-from-message"
                : sourceMessage.editedAt
                  ? "edited-prompt"
                  : "alternative-response",
            createdAt: now,
          },
          ...(artifacts?.length ? { artifacts } : {}),
          ...(currentConversation.settings
            ? {
                settings: {
                  ...currentConversation.settings,
                  ...(currentConversation.settings.ttsVoice
                    ? { ttsVoice: { ...currentConversation.settings.ttsVoice } }
                    : {}),
                },
              }
            : {}),
        };
        const conversation = await saveConversationBranch(
          branchDocument,
          rootConversationId,
          currentConversation.id,
          canAccessConversation,
        );
        const meta = buildConversationMetaFromConversation(conversation);
        return { conversation, meta, clonedMessages, checkpointMessage };
      });
      if (!branch) return null;
      const { conversation, meta, clonedMessages, checkpointMessage } = branch;
      setConversations((previous) => sortConversationMeta([meta, ...previous]));
      setActiveConversationValue(conversation);

      if (pastConversationKnowledgeEnabled && !conversation.isLocked) {
        void syncConversationKnowledge(conversation, true);
      }

      return {
        conversation,
        contextMessages: clonedMessages.slice(0, -1),
        checkpointMessage,
      };
    },
    [
      activeConversationRef,
      canAccessConversation,
      pastConversationKnowledgeEnabled,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const updateConversationContextSummary = useCallback(
    (
      contextSummary: string,
      summarizedMessageCount: number,
      usage?: UsageEstimate,
      usageModel?: string | null,
      usageProvider?: Provider | null,
    ) => {
      const currentConversation = activeConversationRef.current;

      if (!currentConversation) {
        return;
      }

      const lastMessage =
        currentConversation.messages[currentConversation.messages.length - 1];
      const updatedConversation: Conversation = {
        ...currentConversation,
        contextSummary: contextSummary.trim(),
        summarizedMessageCount,
        usageEvents: usage
          ? [
              ...(currentConversation.usageEvents ?? []),
              {
                id: uuid.v4() as string,
                kind: "context-summary",
                model: usageModel ?? lastMessage?.model ?? null,
                provider: usageProvider ?? lastMessage?.provider ?? null,
                timestamp: new Date().toISOString(),
                usage,
              },
            ]
          : currentConversation.usageEvents,
      };

      setActiveConversationValue(updatedConversation);
      void saveConversation(updatedConversation, {
        preserveTitle: true,
        mode: "update",
      });
    },
    [activeConversationRef, setActiveConversationValue],
  );

  const updateConversationSettings = useCallback(
    (partial: Partial<ConversationSettings>) => {
      const currentConversation = activeConversationRef.current;

      if (!currentConversation) {
        return null;
      }

      const updatedConversation: Conversation = {
        ...currentConversation,
        settings: {
          ...currentConversation.settings,
          ...partial,
        },
      };

      setActiveConversationValue(updatedConversation);
      void saveConversation(updatedConversation, {
        preserveTitle: true,
        mode: "update",
      });
      return updatedConversation;
    },
    [activeConversationRef, setActiveConversationValue],
  );

  const clearConversationSettings = useCallback(() => {
    const currentConversation = activeConversationRef.current;

    if (!currentConversation) {
      return null;
    }

    const updatedConversation: Conversation = {
      ...currentConversation,
      settings: undefined,
    };

    setActiveConversationValue(updatedConversation);
    void saveConversation(updatedConversation, {
      preserveTitle: true,
      mode: "update",
    });
    return updatedConversation;
  }, [activeConversationRef, setActiveConversationValue]);

  const deleteConversation = useCallback(
    async (id: string) => {
      const attachments = await removeConversation(id);
      if (!attachments) return false;

      setConversations((previous) =>
        previous.filter((entry) => entry.id !== id),
      );
      if (activeConversationRef.current?.id === id) {
        selectionRequestRef.current += 1;
        setActiveConversationValue(null);
      }
      await Promise.all([
        removeConversationKnowledge(id),
        deleteImageAttachments(attachments),
      ]);
      return true;
    },
    [activeConversationRef, setActiveConversationValue, setConversations],
  );

  const restoreConversationBackup = useCallback(
    async (
      records: AppDataBackupConversation[],
      importedActiveConversationId: string | null,
    ): Promise<Omit<AppDataBackupRestoreResult, "settingsRestored">> => {
      const existingMetasById = new Map(
        (await readStoredConversationMetas(true)).map(
          (meta) => [meta.id, meta] as const,
        ),
      );

      const usedIds = new Set(existingMetasById.keys());
      const restoredMetas: ConversationMeta[] = [];
      const restoredConversations: Conversation[] = [];
      const restoredByOriginalId = new Map<string, Conversation>();
      const pendingRestores: {
        originalId: string;
        conversation: Conversation;
        pinned: boolean;
      }[] = [];
      let conversationsCopied = 0;
      let conversationsRestored = 0;
      let conversationsSkipped = 0;

      await withStagedImages(async (created) => {
        for (const record of records) {
          const originalId = record.conversation.id;
          const existingMeta = existingMetasById.get(originalId);
          const importedPinned = record.conversation.archived
            ? false
            : record.pinned;
          const existingPinned = existingMeta?.archived
            ? false
            : existingMeta?.pinned;

          if (existingMeta) {
            const existingConversation = await readConversation(
              originalId,
              true,
            );
            if (
              existingConversation &&
              (await isIdenticalBackupConversation(
                existingConversation,
                record,
              )) &&
              existingPinned === importedPinned
            ) {
              conversationsSkipped += 1;
              restoredByOriginalId.set(originalId, existingConversation);
              continue;
            }
          }

          let restoredId = originalId;
          if (usedIds.has(restoredId)) {
            do {
              restoredId = uuid.v4() as string;
            } while (usedIds.has(restoredId));
            conversationsCopied += 1;
          }
          usedIds.add(restoredId);

          const materializedConversation = await materializeBackupConversation(
            record,
            created,
          );
          const {
            isLocked: _isLocked,
            awaitingFirstPrompt: _pendingTitle,
            ...unlockedConversation
          } = materializedConversation;
          const restoredConversation = {
            ...unlockedConversation,
            id: restoredId,
          };
          restoredByOriginalId.set(originalId, restoredConversation);
          pendingRestores.push({
            originalId,
            conversation: restoredConversation,
            pinned: importedPinned,
          });
          conversationsRestored += 1;
        }

        const restoredIdByOriginalId = new Map(
          [...restoredByOriginalId.entries()].map(
            ([originalId, conversation]) =>
              [originalId, conversation.id] as const,
          ),
        );
        for (const pending of pendingRestores) {
          const remapConversationId = (id: string) =>
            restoredIdByOriginalId.get(id) ?? id;
          const restoredConversation: Conversation = {
            ...pending.conversation,
            ...(pending.conversation.knowledgeExcludedConversationIds
              ? {
                  knowledgeExcludedConversationIds: [
                    ...new Set(
                      pending.conversation.knowledgeExcludedConversationIds.map(
                        remapConversationId,
                      ),
                    ),
                  ],
                }
              : {}),
            ...(pending.conversation.branch
              ? {
                  branch: {
                    ...pending.conversation.branch,
                    rootConversationId: remapConversationId(
                      pending.conversation.branch.rootConversationId,
                    ),
                    parentConversationId: remapConversationId(
                      pending.conversation.branch.parentConversationId,
                    ),
                  },
                }
              : {}),
          };
          restoredConversations.push(restoredConversation);
          restoredMetas.push({
            ...buildConversationMetaFromConversation(restoredConversation),
            pinned: pending.pinned,
          });
          restoredByOriginalId.set(pending.originalId, restoredConversation);
        }

        // One transaction for the whole import. Writing record by record could
        // leave a restore half-applied, with branch references pointing at
        // conversations that never landed.
        await saveConversationsAtomically(restoredConversations, restoredMetas);
      });

      if (pastConversationKnowledgeEnabled) {
        for (const restoredConversation of restoredConversations) {
          void syncConversationKnowledge(restoredConversation, true);
        }
      }

      if (restoredMetas.length > 0) {
        setConversations((current) =>
          sortConversationMeta([...restoredMetas, ...current]),
        );
      }

      const importedActiveConversation = importedActiveConversationId
        ? (restoredByOriginalId.get(importedActiveConversationId) ?? null)
        : null;
      if (importedActiveConversation) {
        selectionRequestRef.current += 1;
        setActiveConversationValue(importedActiveConversation);
      }

      return {
        conversationsCopied,
        conversationsRestored,
        conversationsSkipped,
      };
    },
    [
      pastConversationKnowledgeEnabled,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const renameConversation = useCallback(
    async (id: string, nextTitle: string, expectedTitle?: string) => {
      const currentConversation =
        activeConversationRef.current?.id === id
          ? activeConversationRef.current
          : await getConversationById(id);

      if (
        !currentConversation ||
        !canAccessConversation(id, currentConversation.isLocked) ||
        (expectedTitle !== undefined &&
          (currentConversation.isLocked ||
            currentConversation.title !== expectedTitle))
      ) {
        return;
      }

      const title = normalizeConversationTitle(
        nextTitle,
        currentConversation.title,
      );
      if (!(await renameStoredConversation(id, title, expectedTitle))) return;
      const latest =
        activeConversationRef.current?.id === id
          ? activeConversationRef.current
          : currentConversation;
      const updatedConversation = { ...latest, title };
      if (pastConversationKnowledgeEnabled && !updatedConversation.isLocked) {
        void syncConversationKnowledge(updatedConversation, true);
      }
      if (activeConversationRef.current?.id === id) {
        setActiveConversationValue(updatedConversation);
      }

      setConversations((previous) =>
        sortConversationMeta(
          previous.map((conversation) =>
            conversation.id === id
              ? {
                  ...conversation,
                  title,
                }
              : conversation,
          ),
        ),
      );
    },
    [
      activeConversationRef,
      canAccessConversation,
      getConversationById,
      pastConversationKnowledgeEnabled,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const toggleConversationPinned = useCallback(
    async (id: string) => {
      const target = conversationMetas.find((meta) => meta.id === id);
      if (!target) return false;
      const pinned = !target.pinned;
      if (!(await setConversationPinned(id, pinned))) return false;
      setConversations((previous) =>
        sortConversationMeta(
          previous.map((meta) =>
            meta.id === id
              ? { ...meta, pinned, archived: pinned ? false : meta.archived }
              : meta,
          ),
        ),
      );
      const active = activeConversationRef.current;
      if (active?.id === id && active.archived && pinned) {
        setActiveConversationValue({ ...active, archived: false });
      }
      return pinned;
    },
    [
      activeConversationRef,
      conversationMetas,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const toggleConversationArchived = useCallback(
    async (id: string) => {
      const currentConversation =
        activeConversationRef.current?.id === id
          ? activeConversationRef.current
          : await getConversationById(id);

      if (!currentConversation) {
        return null;
      }

      const archived = !currentConversation.archived;
      const updatedConversation: Conversation = {
        ...currentConversation,
        archived,
      };

      if (!(await saveConversation(updatedConversation, { mode: "update" })))
        return null;
      if (activeConversationRef.current?.id === id) {
        setActiveConversationValue(updatedConversation);
      }

      setConversations((previous) =>
        sortConversationMeta(
          previous.map((conversation) =>
            conversation.id === id
              ? {
                  ...conversation,
                  archived,
                  // Archived sessions leave the everyday pinned section.
                  pinned: archived ? false : conversation.pinned,
                }
              : conversation,
          ),
        ),
      );

      return archived;
    },
    [
      activeConversationRef,
      getConversationById,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const updateConversationLocked = useCallback(
    async (id: string, isLocked: boolean) => {
      const currentConversation =
        activeConversationRef.current?.id === id
          ? activeConversationRef.current
          : await readConversation(id);
      if (
        !currentConversation ||
        (!isLocked && !canAccessConversation(id, currentConversation.isLocked))
      ) {
        return false;
      }

      const updatedConversation: Conversation = {
        ...currentConversation,
        isLocked,
      };
      if (!(await setStoredConversationLock(id, isLocked))) return false;
      const knowledgeUpdate = setConversationKnowledgeExcluded(id, isLocked);
      setConversations((previous) =>
        sortConversationMeta(
          previous.map((conversation) =>
            conversation.id === id
              ? { ...conversation, isLocked }
              : conversation,
          ),
        ),
      );

      if (activeConversationRef.current?.id === id) {
        if (isLocked) {
          selectionRequestRef.current += 1;
          setActiveConversationValue(null);
        } else {
          setActiveConversationValue(updatedConversation);
        }
      }
      await knowledgeUpdate;
      if (!isLocked && pastConversationKnowledgeEnabled) {
        await syncConversationKnowledge(updatedConversation, true);
      }
      return true;
    },
    [
      activeConversationRef,
      canAccessConversation,
      pastConversationKnowledgeEnabled,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const clearActiveConversation = useCallback(() => {
    selectionRequestRef.current += 1;
    setActiveConversationValue(null);
  }, [setActiveConversationValue]);

  return {
    addMessage,
    claimFirstPrompt,
    clearActiveConversation,
    createConversation,
    deleteConversation,
    editUserMessage,
    branchConversationAtMessage,
    restoreConversationBackup,
    getConversationById,
    renameConversation,
    removeMessage,
    selectConversation,
    toggleConversationPinned,
    toggleConversationArchived,
    updateConversationLocked,
    updateMessage,
    updateConversationContextSummary,
    updateConversationSettings,
    clearConversationSettings,
  };
}
