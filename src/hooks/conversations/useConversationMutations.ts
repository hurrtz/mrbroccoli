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
  ConversationArtifactKind,
  ConversationFork,
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
  normalizeConversationTitle,
  truncateConversationTitle,
} from "./meta";
import {
  readConversation,
  removeConversation,
  saveConversation,
} from "./storage";
import {
  removeConversationKnowledge,
  setConversationKnowledgePrivate,
  syncConversationKnowledge,
} from "../../services/conversationKnowledge";
import {
  deleteImageAttachments,
  readImageAttachmentData,
  writeRestoredImageAttachment,
} from "../../services/imageAttachmentFiles";
import {
  applyConversationIntegrityRepairs,
  scanConversationIntegrity,
  undoConversationIntegrityRepairs,
} from "../../services/conversationIntegrity";
import {
  readConversationIntegrityRepairSnapshot,
  removeConversationIntegrityRepairSnapshot,
  saveConversationIntegrityRepairSnapshot,
} from "../../services/conversationIntegrityStorage";

async function cloneMessagesForFork(messages: Message[]) {
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
  conversationMetas: ConversationMeta[];
  persistMetas: (metas: ConversationMeta[]) => ConversationMeta[];
  setActiveConversationValue: (conversation: Conversation | null) => void;
  setConversations: Dispatch<SetStateAction<ConversationMeta[]>>;
  pastConversationKnowledgeEnabled: boolean;
}) {
  const {
    activeConversationRef,
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
        isPrivate: false,
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
      const requestId = selectionRequestRef.current + 1;
      selectionRequestRef.current = requestId;
      const conversation = await readConversation(id);

      if (conversation && selectionRequestRef.current === requestId) {
        setActiveConversationValue(conversation);
      }
    },
    [setActiveConversationValue],
  );

  const getConversationById = useCallback(
    async (id: string) => {
      if (activeConversationRef.current?.id === id) {
        return activeConversationRef.current;
      }

      return readConversation(id);
    },
    [activeConversationRef],
  );

  const inspectConversationIntegrity = useCallback(
    async (id: string) => {
      const conversation = await getConversationById(id);
      if (!conversation) {
        return null;
      }

      const [report, repairSnapshot] = await Promise.all([
        Promise.resolve(scanConversationIntegrity(conversation)),
        readConversationIntegrityRepairSnapshot(id),
      ]);
      return {
        conversation,
        repairSnapshot,
        report,
      };
    },
    [getConversationById],
  );

  const repairConversationIntegrity = useCallback(
    async (id: string) => {
      const currentConversation = await getConversationById(id);
      if (!currentConversation) {
        return null;
      }

      const repair = applyConversationIntegrityRepairs(currentConversation);
      if (!repair.snapshot) {
        return {
          conversation: currentConversation,
          repairedMessageIds: [],
        };
      }

      const previousSnapshot =
        await readConversationIntegrityRepairSnapshot(id);
      const previousMessageIds = new Set(
        previousSnapshot?.messages.map(({ messageId }) => messageId) ?? [],
      );
      const snapshot = previousSnapshot
        ? {
            ...repair.snapshot,
            messages: [
              ...previousSnapshot.messages,
              ...repair.snapshot.messages.filter(
                ({ messageId }) => !previousMessageIds.has(messageId),
              ),
            ],
          }
        : repair.snapshot;

      await saveConversationIntegrityRepairSnapshot(snapshot);
      await saveConversation(repair.conversation);
      if (activeConversationRef.current?.id === id) {
        setActiveConversationValue(repair.conversation);
      }
      setConversations((previous) =>
        persistMetas(
          previous.map((meta) =>
            meta.id === id
              ? { ...meta, updatedAt: repair.conversation.updatedAt }
              : meta,
          ),
        ),
      );

      return {
        conversation: repair.conversation,
        repairedMessageIds: repair.repairedMessageIds,
      };
    },
    [
      activeConversationRef,
      getConversationById,
      persistMetas,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const undoConversationIntegrityRepair = useCallback(
    async (id: string) => {
      const [currentConversation, snapshot] = await Promise.all([
        getConversationById(id),
        readConversationIntegrityRepairSnapshot(id),
      ]);
      if (!currentConversation || !snapshot) {
        return null;
      }

      const restoration = undoConversationIntegrityRepairs(
        currentConversation,
        snapshot,
      );
      if (!restoration) {
        return null;
      }

      await saveConversation(restoration.conversation);
      await removeConversationIntegrityRepairSnapshot(id);
      if (activeConversationRef.current?.id === id) {
        setActiveConversationValue(restoration.conversation);
      }
      setConversations((previous) =>
        persistMetas(
          previous.map((meta) =>
            meta.id === id
              ? { ...meta, updatedAt: restoration.conversation.updatedAt }
              : meta,
          ),
        ),
      );

      return restoration.conversation;
    },
    [
      activeConversationRef,
      getConversationById,
      persistMetas,
      setActiveConversationValue,
      setConversations,
    ],
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
      const updatedConversation: Conversation = {
        ...currentConversation,
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
        !updatedConversation.isPrivate
      ) {
        void syncConversationKnowledge(updatedConversation, true);
      }
      setConversations((previous) =>
        persistMetas(
          previous.map((meta) =>
            meta.id === updatedConversation.id
              ? {
                  ...meta,
                  createdAt: updatedConversation.createdAt,
                  updatedAt: updatedConversation.updatedAt,
                  messageCount: updatedConversation.messages.length,
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

      if (pastConversationKnowledgeEnabled && !updatedConversation.isPrivate) {
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

  const forkConversationAtMessage = useCallback(
    async (messageId: string): Promise<ConversationFork | null> => {
      const currentConversation = activeConversationRef.current;
      const messageIndex =
        currentConversation?.messages.findIndex(
          (message) => message.id === messageId,
        ) ?? -1;
      const sourceMessage = currentConversation?.messages[messageIndex];

      if (
        !currentConversation ||
        messageIndex < 0 ||
        sourceMessage?.role !== "user" ||
        !sourceMessage.editedAt
      ) {
        return null;
      }

      const now = new Date().toISOString();
      const { clonedMessages, messageIds } = await cloneMessagesForFork(
        currentConversation.messages.slice(0, messageIndex + 1),
      );
      const promptMessage = clonedMessages.at(-1);
      if (!promptMessage) {
        return null;
      }

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
        id: uuid.v4() as string,
        title: truncateConversationTitle(promptMessage.content),
        createdAt: now,
        updatedAt: now,
        messages: clonedMessages,
        knowledgeExcludedConversationIds: [
          ...new Set([
            ...(currentConversation.knowledgeExcludedConversationIds ?? []),
            currentConversation.id,
          ]),
        ],
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
        ...(currentConversation.isPrivate ? { isPrivate: true } : {}),
      };
      const meta = buildConversationMetaFromConversation(conversation);

      await saveConversation(conversation);
      setConversations((previous) => persistMetas([meta, ...previous]));
      setActiveConversationValue(conversation);

      if (pastConversationKnowledgeEnabled && !conversation.isPrivate) {
        void syncConversationKnowledge(conversation, true);
      }

      return {
        conversation,
        contextMessages: clonedMessages.slice(0, -1),
        promptMessage,
      };
    },
    [
      activeConversationRef,
      pastConversationKnowledgeEnabled,
      persistMetas,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const addConversationArtifact = useCallback(
    async (messageId: string, kind: ConversationArtifactKind, text: string) => {
      const currentConversation = activeConversationRef.current;
      const normalizedText = text.trim();
      if (
        !currentConversation ||
        !normalizedText ||
        !currentConversation.messages.some(
          (message) => message.id === messageId,
        )
      ) {
        return null;
      }

      const createdAt = new Date().toISOString();
      const artifact: ConversationArtifact = {
        id: uuid.v4() as string,
        kind,
        text: normalizedText,
        sourceMessageId: messageId,
        createdAt,
      };
      const updatedConversation: Conversation = {
        ...currentConversation,
        artifacts: [...(currentConversation.artifacts ?? []), artifact],
        updatedAt: createdAt,
      };

      setActiveConversationValue(updatedConversation);
      await saveConversation(updatedConversation);
      setConversations((previous) =>
        persistMetas(
          previous.map((meta) =>
            meta.id === updatedConversation.id
              ? { ...meta, updatedAt: createdAt }
              : meta,
          ),
        ),
      );
      if (pastConversationKnowledgeEnabled && !updatedConversation.isPrivate) {
        await syncConversationKnowledge(updatedConversation, true);
      }

      return artifact;
    },
    [
      activeConversationRef,
      pastConversationKnowledgeEnabled,
      persistMetas,
      setActiveConversationValue,
      setConversations,
    ],
  );

  const removeConversationArtifact = useCallback(
    async (conversationId: string, artifactId: string) => {
      const currentConversation =
        activeConversationRef.current?.id === conversationId
          ? activeConversationRef.current
          : await getConversationById(conversationId);
      if (
        !currentConversation ||
        !(currentConversation.artifacts ?? []).some(
          (artifact) => artifact.id === artifactId,
        )
      ) {
        return null;
      }

      const updatedAt = new Date().toISOString();
      const updatedConversation: Conversation = {
        ...currentConversation,
        artifacts: (currentConversation.artifacts ?? []).filter(
          (artifact) => artifact.id !== artifactId,
        ),
        updatedAt,
      };

      await saveConversation(updatedConversation);
      if (activeConversationRef.current?.id === conversationId) {
        setActiveConversationValue(updatedConversation);
      }
      setConversations((previous) =>
        persistMetas(
          previous.map((meta) =>
            meta.id === conversationId ? { ...meta, updatedAt } : meta,
          ),
        ),
      );
      if (pastConversationKnowledgeEnabled && !updatedConversation.isPrivate) {
        await syncConversationKnowledge(updatedConversation, true);
      }

      return updatedConversation;
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

  const clearConversationMemory = useCallback(
    async (id: string) => {
      const currentConversation =
        activeConversationRef.current?.id === id
          ? activeConversationRef.current
          : await getConversationById(id);

      if (!currentConversation) {
        return null;
      }

      const updatedConversation: Conversation = {
        ...currentConversation,
      };

      delete updatedConversation.contextSummary;
      delete updatedConversation.summarizedMessageCount;

      saveConversation(updatedConversation);

      if (activeConversationRef.current?.id === id) {
        setActiveConversationValue(updatedConversation);
      }

      return updatedConversation;
    },
    [activeConversationRef, getConversationById, setActiveConversationValue],
  );

  const updateConversationMemory = useCallback(
    async (id: string, summary: string) => {
      const currentConversation =
        activeConversationRef.current?.id === id
          ? activeConversationRef.current
          : await getConversationById(id);
      const normalizedSummary = summary.trim();

      if (!currentConversation || !normalizedSummary) {
        return null;
      }

      const updatedConversation: Conversation = {
        ...currentConversation,
        contextSummary: normalizedSummary,
      };

      await saveConversation(updatedConversation);
      if (activeConversationRef.current?.id === id) {
        setActiveConversationValue(updatedConversation);
      }

      return updatedConversation;
    },
    [activeConversationRef, getConversationById, setActiveConversationValue],
  );

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
          removeConversationIntegrityRepairSnapshot(id),
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
      const restoredByOriginalId = new Map<string, Conversation>();
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

        const restoredConversation = {
          ...(await materializeBackupConversation(record)),
          id: restoredId,
        };
        const restoredMeta = {
          ...buildConversationMetaFromConversation(restoredConversation),
          pinned: record.pinned,
        };

        await saveConversation(restoredConversation);
        if (
          pastConversationKnowledgeEnabled &&
          !restoredConversation.isPrivate
        ) {
          void syncConversationKnowledge(restoredConversation, true);
        }
        restoredMetas.push(restoredMeta);
        restoredByOriginalId.set(originalId, restoredConversation);
        conversationsRestored += 1;
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
      if (pastConversationKnowledgeEnabled && !updatedConversation.isPrivate) {
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
    (id: string) => {
      let nextPinned = false;

      setConversations((previous) =>
        persistMetas(
          previous.map((conversation) => {
            if (conversation.id !== id) {
              return conversation;
            }

            nextPinned = !conversation.pinned;
            return {
              ...conversation,
              pinned: nextPinned,
            };
          }),
        ),
      );

      return nextPinned;
    },
    [persistMetas, setConversations],
  );

  const toggleConversationPrivate = useCallback(
    async (id: string) => {
      const currentConversation =
        activeConversationRef.current?.id === id
          ? activeConversationRef.current
          : await getConversationById(id);

      if (!currentConversation) {
        return null;
      }

      const isPrivate = !currentConversation.isPrivate;
      const updatedConversation: Conversation = {
        ...currentConversation,
        isPrivate,
      };

      const privacyUpdate = setConversationKnowledgePrivate(id, isPrivate);
      await saveConversation(updatedConversation);

      if (activeConversationRef.current?.id === id) {
        setActiveConversationValue(updatedConversation);
      }

      setConversations((previous) =>
        persistMetas(
          previous.map((conversation) =>
            conversation.id === id
              ? { ...conversation, isPrivate }
              : conversation,
          ),
        ),
      );

      await privacyUpdate;
      if (!isPrivate && pastConversationKnowledgeEnabled) {
        await syncConversationKnowledge(updatedConversation, true);
      }

      return isPrivate;
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

  const clearActiveConversation = useCallback(() => {
    selectionRequestRef.current += 1;
    setActiveConversationValue(null);
  }, [setActiveConversationValue]);

  return {
    addMessage,
    addConversationArtifact,
    clearActiveConversation,
    clearConversationMemory,
    createConversation,
    deleteConversation,
    editUserMessage,
    forkConversationAtMessage,
    restoreConversationBackup,
    getConversationById,
    inspectConversationIntegrity,
    renameConversation,
    repairConversationIntegrity,
    removeConversationArtifact,
    selectConversation,
    toggleConversationPinned,
    toggleConversationPrivate,
    undoConversationIntegrityRepair,
    updateMessage,
    updateConversationMemory,
    updateConversationContextSummary,
    updateConversationSettings,
  };
}
