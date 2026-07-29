import {
  Conversation,
  Message,
  Provider,
  UsageEstimate,
  UsageEstimateKind,
} from "../types";
import {
  estimateMessageTokens,
  estimateTextTokens,
} from "../services/conversationContext";

export interface ConversationUsageTotals {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  replyCount: number;
  summaryCount: number;
}

export interface ConversationUsageRouteTotals {
  provider: Provider | null;
  model: string | null;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  entryCount: number;
}

interface UsageRouteEntry {
  provider: Provider | null;
  model: string | null;
  usage: UsageEstimate;
}

function getMessageUsageRouteEntries(message: Message): UsageRouteEntry[] {
  if (!message.usage) {
    return [];
  }

  const contributions = message.metadata?.ulraMode?.contributions;
  if (!contributions?.length) {
    return [
      {
        provider: message.provider,
        model: message.model,
        usage: message.usage,
      },
    ];
  }

  const intermediateUsage = contributions.reduce(
    (total, contribution) => ({
      promptTokens:
        total.promptTokens + contribution.usage.promptTokens,
      completionTokens:
        total.completionTokens + contribution.usage.completionTokens,
      totalTokens: total.totalTokens + contribution.usage.totalTokens,
    }),
    {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    },
  );
  const finalUsage: UsageEstimate = {
    kind: "reply",
    source: "estimated",
    promptTokens: Math.max(
      0,
      message.usage.promptTokens - intermediateUsage.promptTokens,
    ),
    completionTokens: Math.max(
      0,
      message.usage.completionTokens - intermediateUsage.completionTokens,
    ),
    totalTokens: Math.max(
      0,
      message.usage.totalTokens - intermediateUsage.totalTokens,
    ),
  };

  return [
    ...(finalUsage.totalTokens > 0
      ? [
          {
            provider: message.provider,
            model: message.model,
            usage: finalUsage,
          },
        ]
      : []),
    ...contributions.map(({ model, provider, usage }) => ({
      provider,
      model,
      usage,
    })),
  ];
}

export function estimateChatUsage(params: {
  provider: Provider;
  model: string;
  kind: UsageEstimateKind;
  systemPrompt: string;
  messages: Pick<Message, "role" | "content">[];
  completionText: string;
}): UsageEstimate {
  const promptTokens =
    estimateMessageTokens({
      role: "assistant",
      content: params.systemPrompt,
    }) +
    params.messages.reduce(
      (total, message) => total + estimateMessageTokens(message),
      0,
    );
  const completionTokens = Math.max(
    estimateTextTokens(params.completionText.trim()),
    0,
  );
  const totalTokens = promptTokens + completionTokens;

  return {
    kind: params.kind,
    source: "estimated",
    promptTokens,
    completionTokens,
    totalTokens,
  };
}

export function aggregateConversationUsage(
  conversation?: Pick<Conversation, "messages" | "usageEvents"> | null,
): ConversationUsageTotals {
  if (!conversation) {
    return {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      replyCount: 0,
      summaryCount: 0,
    };
  }

  const messageUsages = conversation.messages
    .filter(
      (message): message is Message & { usage: UsageEstimate } =>
        !!message.usage,
    )
    .map((message) => message.usage);
  const eventUsages = (conversation.usageEvents ?? []).map(
    (event) => event.usage,
  );
  const usages = [...messageUsages, ...eventUsages];

  return usages.reduce<ConversationUsageTotals>(
    (total, usage) => {
      total.promptTokens += usage.promptTokens;
      total.completionTokens += usage.completionTokens;
      total.totalTokens += usage.totalTokens;

      if (usage.kind === "reply") {
        total.replyCount += 1;
      } else if (usage.kind === "summary") {
        total.summaryCount += 1;
      }

      return total;
    },
    {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      replyCount: 0,
      summaryCount: 0,
    },
  );
}

export function aggregateConversationUsageByRoute(
  conversation?: Pick<Conversation, "messages" | "usageEvents"> | null,
): ConversationUsageRouteTotals[] {
  if (!conversation) {
    return [];
  }

  const entries = [
    ...conversation.messages.flatMap(getMessageUsageRouteEntries),
    ...(conversation.usageEvents ?? []).map((event) => ({
      provider: event.provider,
      model: event.model,
      usage: event.usage,
    })),
  ];

  const totalsByRoute = new Map<string, ConversationUsageRouteTotals>();

  for (const entry of entries) {
    const key = `${entry.provider ?? "unknown"}::${entry.model ?? "unknown"}`;
    const existing = totalsByRoute.get(key) ?? {
      provider: entry.provider,
      model: entry.model,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      entryCount: 0,
    };

    existing.promptTokens += entry.usage.promptTokens;
    existing.completionTokens += entry.usage.completionTokens;
    existing.totalTokens += entry.usage.totalTokens;
    existing.entryCount += 1;

    totalsByRoute.set(key, existing);
  }

  return [...totalsByRoute.values()].sort(
    (left, right) => right.totalTokens - left.totalTokens,
  );
}

export function formatTokenCount(count: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(count);
}
