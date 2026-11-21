import type { Provider } from "../../types";
import { getOpenRouterHosts } from "../../constants/providers/openRouterHosts";
import {
  councilKey,
  needKey,
  uniqueNeeds,
  type AiSharingAuthorization,
  type AiSharingNeed,
  type AiSharingRequest,
  type AiSharingSelection,
} from "./model";
import {
  getAiSharingSnapshot,
  getPolicy,
  hasAiSharingPermission,
  hydrateAiSharing,
  publishAiSharing,
  revocationVersion,
  setAiSharingPermission,
  setSystemSpeechPermission,
  updatePolicy,
} from "./policy";

interface Queued {
  id: number;
  request: AiSharingRequest;
  signal?: AbortSignal;
  finish: (answer: AiSharingAuthorization | null) => void;
  settling: boolean;
}
const queue: Queued[] = [];
let nextId = 0;

function modelsForPurpose(
  purpose: AiSharingNeed["purpose"],
  request: AiSharingRequest,
) {
  if (
    purpose === "titles" &&
    request.council?.synthesisProvider === "openrouter"
  ) {
    return request.council.synthesisModel
      ? [request.council.synthesisModel]
      : [];
  }
  return request.openRouterModels;
}

function optionalKey(need: AiSharingNeed, models?: string | readonly string[]) {
  const hosts =
    need.provider === "openrouter"
      ? getOpenRouterHosts(models)
          .map((host) => host.slugs[0])
          .sort()
      : [];
  return needKey(need) + "/" + hosts.join(",");
}

export function isAiSharingOptionalSkipped(
  provider: Provider,
  purpose: AiSharingNeed["purpose"],
  models?: string | readonly string[],
) {
  return getPolicy().skippedOptional.includes(
    optionalKey({ provider, purpose }, models),
  );
}

function authorize(
  entry: Queued,
  once: readonly AiSharingNeed[] = [],
): AiSharingAuthorization {
  const { required, optional = [], council } = entry.request;
  const temporary = new Set(once.map(needKey));
  const grants = new Map<string, number>();
  for (const need of [...required, ...optional]) {
    const key = needKey(need);
    if (
      temporary.has(key) ||
      hasAiSharingPermission(
        need.provider,
        need.purpose,
        modelsForPurpose(need.purpose, entry.request),
      )
    ) {
      grants.set(key, revocationVersion(key));
    }
  }
  const systemId = entry.request.systemSpeech;
  const systemVersion = systemId ? revocationVersion(systemId) : -1;
  return {
    allowsSystemSpeech(id) {
      return (
        !entry.signal?.aborted &&
        id === systemId &&
        systemVersion === revocationVersion(id) &&
        getPolicy().systemSpeech[id] === "allowed"
      );
    },
    allows(provider, purpose) {
      const key = needKey({ provider, purpose });
      if (entry.signal?.aborted || grants.get(key) !== revocationVersion(key))
        return false;
      if (
        purpose === "council" &&
        council &&
        !getPolicy().councils.includes(
          councilKey(council, entry.request.openRouterModels),
        )
      )
        return false;
      return (
        temporary.has(key) ||
        hasAiSharingPermission(
          provider,
          purpose,
          modelsForPurpose(purpose, entry.request),
        )
      );
    },
  };
}

function finish(entry: Queued, answer: AiSharingAuthorization | null) {
  const index = queue.indexOf(entry);
  if (index < 0) return;
  queue.splice(index, 1);
  if (getAiSharingSnapshot().pending?.id === entry.id)
    publishAiSharing({ pending: null });
  entry.finish(answer);
  advance();
}

function advance() {
  const entry = queue[0];
  if (!entry || entry.settling || getAiSharingSnapshot().pending) return;
  const { request } = entry;
  const { permissions } = getAiSharingSnapshot();
  const systemState = request.systemSpeech
    ? getPolicy().systemSpeech[request.systemSpeech]
    : undefined;
  if (systemState === "denied") {
    finish(entry, null);
    return;
  }
  if (
    entry.signal?.aborted ||
    request.required.some(
      ({ provider, purpose }) => permissions[provider]?.[purpose] === "denied",
    )
  ) {
    finish(entry, null);
    return;
  }
  const missing = ({ provider, purpose }: AiSharingNeed) =>
    !hasAiSharingPermission(
      provider,
      purpose,
      modelsForPurpose(purpose, request),
    );
  const missingRequired = request.required.filter(missing);
  const optional = (request.optional ?? []).filter(
    (need) =>
      permissions[need.provider]?.[need.purpose] !== "denied" &&
      missing(need) &&
      !isAiSharingOptionalSkipped(
        need.provider,
        need.purpose,
        modelsForPurpose(need.purpose, request),
      ),
  );
  const newCouncil =
    request.council &&
    !getPolicy().councils.includes(
      councilKey(request.council, request.openRouterModels),
    );
  if (
    (!request.systemSpeech || systemState === "allowed") &&
    !request.shareEarlier &&
    !newCouncil &&
    !missingRequired.length &&
    !optional.length
  ) {
    finish(entry, authorize(entry));
    return;
  }
  publishAiSharing({
    pending: { id: entry.id, request, missingRequired, optional },
  });
}

export async function requestAiSharing(
  input: AiSharingRequest,
  signal?: AbortSignal,
): Promise<AiSharingAuthorization | null> {
  try {
    await hydrateAiSharing();
  } catch {
    return null;
  }
  if (signal?.aborted) return null;
  const required = uniqueNeeds(input.required);
  if (
    [...required, ...(input.optional ?? [])].some(
      (need) => need.provider === "openrouter",
    ) &&
    !getOpenRouterHosts(input.openRouterModels).length
  )
    return null;
  const requiredKeys = new Set(required.map(needKey));
  const request = {
    ...input,
    required,
    optional: uniqueNeeds(input.optional ?? []).filter(
      (need) => !requiredKeys.has(needKey(need)),
    ),
  };
  return new Promise((resolve) => {
    const entry: Queued = {
      id: ++nextId,
      request,
      signal,
      settling: false,
      finish(answer) {
        signal?.removeEventListener("abort", abort);
        resolve(answer);
      },
    };
    const abort = () => finish(entry, null);
    queue.push(entry);
    signal?.addEventListener("abort", abort, { once: true });
    advance();
  });
}

export async function resolveAiSharing(
  id: number,
  selection: AiSharingSelection | null,
): Promise<void> {
  const entry = queue[0];
  const pending = getAiSharingSnapshot().pending;
  if (!entry || entry.id !== id || !pending || entry.settling) return;
  entry.settling = true;
  const { request } = entry;
  try {
    if (!selection) {
      if (request.systemSpeech)
        await setSystemSpeechPermission(request.systemSpeech, false);
      if (!request.council && !request.imageCount && !request.shareEarlier) {
        await Promise.all(
          pending.missingRequired
            .filter(({ purpose }) => purpose === "prompt")
            .map(({ provider }) =>
              setAiSharingPermission(provider, "prompt", false),
            ),
        );
      }
      finish(entry, null);
      return;
    }
    const optional = new Set(selection.optional.map(needKey));
    const remember = new Set<Provider>(selection.rememberImages);
    const once: AiSharingNeed[] = [];
    await updatePolicy((previous) => {
      if (entry.signal?.aborted) return previous;
      const permissions = { ...previous.permissions };
      const hostGrants = new Set(previous.hostGrants);
      const skippedOptional = new Set(previous.skippedOptional);
      // A concurrent revocation in Settings always wins over an open sheet.
      if (
        request.required.some(
          ({ provider, purpose }) =>
            permissions[provider]?.[purpose] === "denied",
        )
      )
        return previous;
      for (const need of [...pending.missingRequired, ...pending.optional]) {
        const { provider, purpose } = need;
        const providerGrants = { ...permissions[provider] };
        if (providerGrants[purpose] !== "denied") {
          const selected =
            pending.missingRequired.includes(need) ||
            optional.has(needKey(need));
          if (purpose === "images" && selected && !remember.has(provider))
            once.push(need);
          else if (selected) {
            providerGrants[purpose] = "allowed";
            if (provider === "openrouter") {
              getOpenRouterHosts(modelsForPurpose(purpose, request)).forEach(
                (host) => hostGrants.add(host.slugs[0] + "/" + purpose),
              );
            }
          } else
            skippedOptional.add(
              optionalKey(need, modelsForPurpose(purpose, request)),
            );
        }
        permissions[provider] = providerGrants;
      }
      const councils = new Set(previous.councils);
      if (request.council)
        councils.add(councilKey(request.council, request.openRouterModels));
      const systemSpeech = { ...previous.systemSpeech };
      if (
        request.systemSpeech &&
        systemSpeech[request.systemSpeech] !== "denied"
      )
        systemSpeech[request.systemSpeech] = "allowed";
      return {
        ...previous,
        permissions,
        councils: [...councils],
        hostGrants: [...hostGrants],
        skippedOptional: [...skippedOptional],
        systemSpeech,
      };
    });
    const authorization = authorize(entry, once);
    const complete =
      (!request.systemSpeech ||
        !!authorization.allowsSystemSpeech?.(request.systemSpeech)) &&
      request.required.every(({ provider, purpose }) =>
        authorization.allows(provider, purpose),
      );
    finish(entry, complete && !entry.signal?.aborted ? authorization : null);
  } catch {
    finish(entry, null);
  }
}
