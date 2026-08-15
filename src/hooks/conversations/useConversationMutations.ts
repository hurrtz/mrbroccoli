import {
  useCallback,
  useRef,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import uuid from "react-native-uuid";
import {
  Conversation,
  ConversationArtifact,
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
  getVisibleConversationMessageCount,
  normalizeConversationTitle,
  truncateConversationTitle,
} from "./meta";
import {
  readConversation,
  removeConversation,
  saveConversation,
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

async function cloneMessagesForBranch(messages: Message[]) {
  const attachmentsBySourceId = new Map<string, MessageImageAttachment>();
  const createdAttachments: MessageImageAttachment[] = [];
  const messageIds = new Map<string, string>();

  try {
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
  } catch (error) {
    await deleteImageAttachments(createdAttachments);
    throw error;
  }
}

async function isIdenticalBackupConversation(
  existing: Conversation,
  record: AppDataBackupConversation,
) {
  const portableExisting: Conversation = {
    ...existing,
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
  if (
    JSON.stringify(portableExisting) !== JSON.stringify(record.conversation)
  ) {
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
) {
  const backupAttachments = new Map(
    (record.attachments ?? []).map((attachment) => [attachment.id, attachment]),
  );
  const restoredAttachments = new Map<
    string,
    Awaited<ReturnType<typeof writeRestoredImageAttachment>>
  >();

  try {
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
  } catch (error) {
    await deleteImageAttachments([...restoredAttachments.values()]);
    throw error;
  }
}

export function useConversationMutations(params: {
  activeConversationRef: MutableRefObject<Conversation | null>;
  canAccessConversation: (id: string) => boolean;
  conversationMetas: ConversationMeta[];
  persistMetas: (metas: ConversationMeta[]) => ConversationMeta[];
  setActiveConversationValue: (conversation: Conversation | null) => void;
  setConversations: Dispatch<SetStateAction<ConversationMeta[]>>;
  pastConversationKnowledgeEnabled: boolean;
}) {
  const {
    activeConversationRef,
    canAccessConversation,
    conversationMetas,
    persistMetas,
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
      };

      setConversations((previous) => persistMetas([meta, ...previous]));
      saveConversation(conversation);
      setActiveConversationValue(conversation);
      return conversation.id;
    },
    [persistMetas, setActiveConversationValue, setConversations],
  );

  const selectConversation = useCallback(
    async (id: string) => {
      if (!canAccessConversation(id)) {
        return;
      }
      const requestId = selectionRequestRef.current + 1;
      selectionRequestRef.current = requestId;
      const conversation = await readConversation(id);

      if (conversation && selectionRequestRef.current === requestId) {
        setActiveConversationValue(conversation);
      }
    },
    [canAccessConversation, setActiveConversationValue],
  );

  const getConversationById = useCallback(
    async (id: string) => {
      if (!canAccessConversation(id)) {
        return null;
      }
      if (activeConversationRef.current?.id === id) {
        return activeConversationRef.current;
      }

      return readConversation(id);
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
      const lastModel = messageInput.model ?? undefined;
      const lastProvider = messageInput.provider ?? undefined;

      setActiveConversationValue(updatedConversation);
      saveConversation(updatedConversation);
      if (
        messageInput.role === "user" &&
        pastConversationKnowledgeEnabled &&
        !updatedConversation.isLocked
      ) {
        void syncConversationKnowledge(updatedConversation, true);
      }
      setConversations((previous) =>
        persistMetas(
          previous.map((meta) =>
            meta.id === updatedConversation.id
              ? {
                  ...meta,
                  title: updatedConversation.title,
                  createdAt: updatedConversation.createdAt,
                  updatedAt: updatedConversation.updatedAt,
                  messageCount:
                    getVisibleConversationMessageCount(updatedConversation),
                  providers:
                    messageInput.provider &&
                    !meta.providers.includes(messageInput.provider)
                      ? [...meta.providers, messageInput.provider]
                      : meta.providers,
                  providerModels:
                    messageInput.provider && messageInput.model
                      ? {
                          ...meta.providerModels,
                          [messageInput.provider]: (
                            meta.providerModels[messageInput.provider] ?? []
                          ).includes(messageInput.model)
                            ? meta.providerModels[messageInput.provider]
                            : [
                                ...(meta.providerModels[
                                  messageInput.provider
                                ] ?? []),
                                messageInput.model,
                              ],
                        }
                      : meta.providerModels,
                  ...(lastModel !== undefined ? { lastModel } : {}),
                  ...(lastProvider !== undefined ? { lastProvider } : {}),
                }
              : meta,
          ),
        ),
      );

      return message;
    },
    [
      activeConversationRef,
      pastConversationKnowledgeEnabled,
      persistMetas,
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
      saveConversation(updatedConversation);
      setConversations((previous) =>
        persistMetas(
          previous.map((meta) =>
            meta.id === updatedConversation.id
              ? {
                  ...meta,
                  updatedAt,
                }
              : meta,
          ),
        ),
      );

      return updatedMessage;
    },
    [
      activeConversationRef,
      persistMetas,
      setActiveConversationValue,
      setConversations,
    ],
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

      const updatedAt = new Date().toISOString();
      const updatedConversation: Conversation = {
        ...currentConversation,
        updatedAt,
        messages: currentConversation.messages.filter(
          (message) => message.id !== messageId,
        ),
      };
      delete updatedConversation.contextSummary;
      delete updatedConversation.summarizedMessageCount;

      await saveConversation(updatedConversation);
      await deleteImageAttachments(removedMessage.attachments ?? []);
      setActiveConversationValue(updatedConversation);
      setConversations((previous) =>
        persistMetas(
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

      if (pastConversationKnowledgeEnabled && !updatedConversation.isLocked) {
        await syncConversationKnowledge(updatedConversation, true);
      }

      return true;
    },
    [
      activeConversationRef,
      pastConversationKnowledgeEnabled,
      persistMetas,
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
      await saveConversation(updatedConversation);
      setConversations((previous) =>
        persistMetas(
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
      persistMetas,
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

      const now = new Date().toISOString();
      const { clonedMessages, messageIds } = await cloneMessagesForBranch(
        currentConversation.messages.slice(0, messageIndex + 1),
      );
      const checkpointMessage = clonedMessages.at(-1);
      if (!checkpointMessage) {
        return null;
      }

      const conversationId = uuid.v4() as string;
      const rootConversationId =
        currentConversation.branch?.rootConversationId ??
        currentConversation.id;
      const familyIds = [
        ...new Set([
          currentConversation.id,
          ...conversationMetas
            .filter(
              (meta) =>
                meta.id === rootConversationId ||
                meta.branch?.rootConversationId === rootConversationId,
            )
            .map(({ id }) => id),
        ]),
      ];

      const artifacts = currentConversation.artifacts
        ?.map((artifact) => {
          const clonedSourceMessageId = messageIds.get(
            artifact.sourceMessageId,
          );
          return clonedSourceMessageId
            ? {
                ...artifact,
                id: uuid.v4() as string,
                sourceMessageId: clonedSourceMessageId,
              }
            : null;
        })
        .filter((artifact): artifact is ConversationArtifact =>
          Boolean(artifact),
        );
      const conversation: Conversation = {
        id: conversationId,
        title: truncateConversationTitle(
          sourceMessage.role === "user"
            ? checkpointMessage.content
            : currentConversation.title,
        ),
        createdAt: now,
        updatedAt: now,
        messages: clonedMessages,
        knowledgeExcludedConversationIds: familyIds,
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
      const meta = buildConversationMetaFromConversation(conversation);

      // Read the family first, then write the branch and every updated sibling
      // in one transaction. Saving them separately could leave a family whose
      // members disagree about which conversations to exclude from retrieval.
      const familyUpdates = await Promise.all(
        familyIds.map(async (familyConversationId) => {
          const familyConversation =
            familyConversationId === currentConversation.id
              ? currentConversation
              : await readConversation(familyConversationId);
          if (!familyConversation) {
            return null;
          }

          return {
            ...familyConversation,
            knowledgeExcludedConversationIds: [
              ...new Set([
                ...(familyConversation.knowledgeExcludedConversationIds ?? []),
                ...familyIds.filter((id) => id !== familyConversationId),
                conversationId,
              ]),
            ],
          };
        }),
      );
      await saveConversationsAtomically([
        conversation,
        ...familyUpdates.filter((entry) => entry !== null),
      ]);
      setConversations((previous) => persistMetas([meta, ...previous]));
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
      conversationMetas,
      pastConversationKnowledgeEnabled,
      persistMetas,
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
      saveConversation(updatedConversation);
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
      saveConversation(updatedConversation);
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
    saveConversation(updatedConversation);
    return updatedConversation;
  }, [activeConversationRef, setActiveConversationValue]);

  const deleteConversation = useCallback(
    (id: string) => {
      const activeConversation =
        activeConversationRef.current?.id === id
          ? activeConversationRef.current
          : null;
      void (async () => {
        const conversation = activeConversation ?? (await readConversation(id));
        await Promise.all([
          removeConversation(id),
          removeConversationKnowledge(id),
          deleteImageAttachments(
            conversation?.messages.flatMap(
              (message) => message.attachments ?? [],
            ) ?? [],
          ),
        ]);
      })();
      setConversations((previous) =>
        persistMetas(previous.filter((entry) => entry.id !== id)),
      );

      if (activeConversationRef.current?.id === id) {
        selectionRequestRef.current += 1;
        setActiveConversationValue(null);
      }
    },
    [
      activeConversationRef,
      persistMetas,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const restoreConversationBackup = useCallback(
    async (
      records: AppDataBackupConversation[],
      importedActiveConversationId: string | null,
    ): Promise<Omit<AppDataBackupRestoreResult, "settingsRestored">> => {
      const existingMetasById = new Map(
        conversationMetas.map((meta) => [meta.id, meta] as const),
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

      for (const record of records) {
        const originalId = record.conversation.id;
        const existingMeta = existingMetasById.get(originalId);

        if (existingMeta) {
          const existingConversation = await readConversation(originalId);
          if (
            existingConversation &&
            (await isIdenticalBackupConversation(
              existingConversation,
              record,
            )) &&
            existingMeta.pinned === record.pinned
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

        const materializedConversation =
          await materializeBackupConversation(record);
        const { isLocked: _isLocked, ...unlockedConversation } =
          materializedConversation;
        const restoredConversation = {
          ...unlockedConversation,
          id: restoredId,
        };
        restoredByOriginalId.set(originalId, restoredConversation);
        pendingRestores.push({
          originalId,
          conversation: restoredConversation,
          pinned: record.pinned,
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
      await saveConversationsAtomically(restoredConversations);

      if (pastConversationKnowledgeEnabled) {
        for (const restoredConversation of restoredConversations) {
          void syncConversationKnowledge(restoredConversation, true);
        }
      }

      if (restoredMetas.length > 0) {
        setConversations((current) =>
          persistMetas([...restoredMetas, ...current]),
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
      conversationMetas,
      pastConversationKnowledgeEnabled,
      persistMetas,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const renameConversation = useCallback(
    async (id: string, nextTitle: string) => {
      const currentConversation =
        activeConversationRef.current?.id === id
          ? activeConversationRef.current
          : await getConversationById(id);

      if (!currentConversation) {
        return;
      }

      const title = normalizeConversationTitle(
        nextTitle,
        currentConversation.title,
      );
      const updatedConversation: Conversation = {
        ...currentConversation,
        title,
      };

      saveConversation(updatedConversation);
      if (pastConversationKnowledgeEnabled && !updatedConversation.isLocked) {
        void syncConversationKnowledge(updatedConversation, true);
      }

      if (activeConversationRef.current?.id === id) {
        setActiveConversationValue(updatedConversation);
      }

      setConversations((previous) =>
        persistMetas(
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
      getConversationById,
      pastConversationKnowledgeEnabled,
      persistMetas,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const toggleConversationPinned = useCallback(
    async (id: string) => {
      const target = conversationMetas.find(
        (conversation) => conversation.id === id,
      );
      if (!target) {
        return false;
      }
      const nextPinned = !target.pinned;
      const wasArchived = Boolean(target.archived);

      setConversations((previous) =>
        persistMetas(
          previous.map((conversation) => {
            if (conversation.id !== id) {
              return conversation;
            }

            return {
              ...conversation,
              pinned: nextPinned,
              ...(nextPinned && wasArchived ? { archived: false } : {}),
            };
          }),
        ),
      );

      if (nextPinned && wasArchived) {
        const currentConversation = await getConversationById(id);
        if (currentConversation?.archived) {
          const updatedConversation = {
            ...currentConversation,
            archived: false,
          };
          await saveConversation(updatedConversation);
          if (activeConversationRef.current?.id === id) {
            setActiveConversationValue(updatedConversation);
          }
        }
      }

      return nextPinned;
    },
    [
      activeConversationRef,
      conversationMetas,
      getConversationById,
      persistMetas,
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

      await saveConversation(updatedConversation);
      if (activeConversationRef.current?.id === id) {
        setActiveConversationValue(updatedConversation);
      }

      setConversations((previous) =>
        persistMetas(
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
      persistMetas,
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
      if (!currentConversation) {
        return false;
      }

      const updatedConversation: Conversation = {
        ...currentConversation,
        isLocked,
      };
      await saveConversation(updatedConversation);
      await setConversationKnowledgeExcluded(id, isLocked);
      setConversations((previous) =>
        persistMetas(
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
      if (!isLocked && pastConversationKnowledgeEnabled) {
        await syncConversationKnowledge(updatedConversation, true);
      }
      return true;
    },
    [
      activeConversationRef,
      pastConversationKnowledgeEnabled,
      persistMetas,
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
