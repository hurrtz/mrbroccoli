import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import {
  bindInstallation,
  invalidateInstallationBinding,
  readInstallationBinding,
} from "./installation";

import { isRuntimeProviderId } from "../../constants/providers/runtimeState";
import { getOpenRouterHosts } from "../../constants/providers/openRouterHosts";
import type { Provider } from "../../types";
import {
  AI_SHARING_PURPOSES,
  needKey,
  type AiSharingPermissions,
  type AiSharingPurpose,
  type AiSharingSnapshot,
} from "./model";

const STORAGE_KEY = "@mrbroccoli/ai-sharing/v1";

export interface Policy {
  installation: string;
  permissions: AiSharingPermissions;
  councils: string[];
  hostGrants: string[];
  skippedOptional: string[];
  systemSpeech: NonNullable<AiSharingSnapshot["systemSpeech"]>;
}

let policy: Policy = {
  installation: "",
  permissions: {},
  councils: [],
  hostGrants: [],
  skippedOptional: [],
  systemSpeech: {},
};
let snapshot: AiSharingSnapshot = {
  ready: false,
  permissions: {},
  pending: null,
};
let loading: Promise<void> | undefined;
let writes = Promise.resolve();
const listeners = new Set<() => void>();
const revocations = new Map<string, number>();
type PolicyChange = (previous: Policy) => Policy;
// Apply withdrawals immediately, including while an older disk write settles.
const withdrawals = new Map<string, PolicyChange>();

function withWithdrawals(saved: Policy, except?: PolicyChange) {
  let current = saved;
  for (const change of withdrawals.values()) {
    if (change !== except) current = change(current);
  }
  return current;
}
export const getPolicy = () => withWithdrawals(policy);
export const getAiSharingSnapshot = () => snapshot;
export function subscribeAiSharing(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function publishAiSharing(change: Partial<AiSharingSnapshot> = {}) {
  const { permissions, systemSpeech } = getPolicy();
  snapshot = { ...snapshot, ...change, permissions, systemSpeech };
  listeners.forEach((listener) => listener());
}

function cleanPermissions(value: unknown): AiSharingPermissions {
  if (!value || typeof value !== "object") return {};
  const permissions: AiSharingPermissions = {};
  for (const [provider, purposes] of Object.entries(value)) {
    if (
      !isRuntimeProviderId(provider) ||
      !purposes ||
      typeof purposes !== "object"
    )
      continue;
    permissions[provider] = Object.fromEntries(
      AI_SHARING_PURPOSES.flatMap((purpose) => {
        const decision = purposes[purpose];
        return decision === "allowed" || decision === "denied"
          ? [[purpose, decision]]
          : [];
      }),
    );
  }
  return permissions;
}

async function loadPolicy() {
  const [raw, device] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEY),
    readInstallationBinding(),
  ]);
  let stored: Partial<Policy> | null = null;
  try {
    stored = raw ? JSON.parse(raw) : null;
  } catch {
    /* A damaged record grants nothing. */
  }
  if (device && stored?.installation === device) {
    policy = {
      installation: device,
      permissions: cleanPermissions(stored.permissions),
      councils: Array.isArray(stored.councils)
        ? stored.councils.filter((key) => typeof key === "string")
        : [],
      hostGrants: Array.isArray(stored.hostGrants)
        ? stored.hostGrants.filter((key) => typeof key === "string")
        : [],
      skippedOptional: Array.isArray(stored.skippedOptional)
        ? stored.skippedOptional.filter((key) => typeof key === "string")
        : [],
      systemSpeech: Object.fromEntries(
        Object.entries(stored.systemSpeech ?? {}).filter(
          ([key, value]) =>
            /^(apple|android\.[a-zA-Z0-9_.]+)$/.test(key) &&
            ["allowed", "denied", "ask"].includes(value),
        ),
      ),
    };
  } else {
    // Keychain items can survive uninstall on iOS. A restored preferences file
    // can survive a move to another device. Both halves must match.
    const installation = randomUUID();
    await bindInstallation(installation);
    const fresh = {
      installation,
      permissions: {},
      councils: [],
      hostGrants: [],
      skippedOptional: [],
      systemSpeech: {},
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    policy = fresh;
  }
  publishAiSharing({
    ready: true,
    permissions: policy.permissions,
    systemSpeech: policy.systemSpeech,
  });
}

export function hydrateAiSharing(): Promise<void> {
  if (snapshot.ready) return Promise.resolve();
  loading ??= loadPolicy().finally(() => {
    loading = undefined;
  });
  return loading;
}

export async function updatePolicy(
  change: PolicyChange,
  supersededWithdrawal?: PolicyChange,
) {
  await hydrateAiSharing();
  const write = writes.then(async () => {
    const next = withWithdrawals(change(policy), supersededWithdrawal);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    policy = next;
    if (supersededWithdrawal) {
      for (const [key, withdrawal] of withdrawals) {
        if (withdrawal === supersededWithdrawal) withdrawals.delete(key);
      }
    }
    publishAiSharing({
      permissions: policy.permissions,
      systemSpeech: policy.systemSpeech,
    });
  });
  writes = write.catch(() => {});
  return write;
}

export function hasAiSharingPermission(
  provider: Provider,
  purpose: AiSharingPurpose,
  models?: string | readonly string[],
) {
  if (snapshot.permissions[provider]?.[purpose] !== "allowed") return false;
  if (provider !== "openrouter" || models === undefined) return true;
  const hosts = getOpenRouterHosts(models);
  return (
    hosts.length > 0 &&
    hosts.every((host) =>
      policy.hostGrants.includes(host.slugs[0] + "/" + purpose),
    )
  );
}

export function revocationVersion(key: string) {
  return revocations.get(key) ?? 0;
}

function setDecision(
  key: string,
  allowed: boolean | null,
  change: PolicyChange,
) {
  if (!allowed) {
    revocations.set(key, revocationVersion(key) + 1);
    withdrawals.set(key, change);
    publishAiSharing();
  }
  const superseded = withdrawals.get(key);
  return updatePolicy(change, superseded).catch(async (error: unknown) => {
    // An older durable grant must not reappear when a withdrawal could not be
    // written. The next installation handshake will ask again.
    if (!allowed) await invalidateInstallationBinding().catch(() => {});
    throw error;
  });
}

export function setSystemSpeechPermission(id: string, allowed: boolean | null) {
  return setDecision(id, allowed, (previous) => ({
    ...previous,
    systemSpeech: {
      ...previous.systemSpeech,
      [id]: allowed === null ? "ask" : allowed ? "allowed" : "denied",
    },
  }));
}

export function getSystemSpeechName(id: string) {
  if (id === "apple") return "Apple Speech";
  const packageName = id.replace(/^android\./, "");
  // Display the exact installed service when its publisher is unknown.
  if (
    [
      "com.google.android.googlequicksearchbox",
      "com.google.android.tts",
      "com.google.android.as",
    ].includes(packageName)
  )
    return "Google";
  if (
    [
      "com.samsung.android.bixby.agent",
      "com.samsung.android.svoiceime",
    ].includes(packageName)
  )
    return "Samsung";
  return packageName;
}

export function setAiSharingPermission(
  provider: Provider,
  purpose: AiSharingPurpose,
  allowed: boolean | null,
) {
  return setDecision(needKey({ provider, purpose }), allowed, (previous) => ({
    ...previous,
    permissions: {
      ...previous.permissions,
      [provider]: {
        ...previous.permissions[provider],
        [purpose]:
          allowed === null ? undefined : allowed ? "allowed" : "denied",
      },
    },
    hostGrants:
      !allowed && provider === "openrouter"
        ? previous.hostGrants.filter((key) => !key.endsWith("/" + purpose))
        : previous.hostGrants,
    skippedOptional: previous.skippedOptional.filter(
      (key) => !key.startsWith(needKey({ provider, purpose }) + "/"),
    ),
    councils:
      !allowed && (purpose === "council" || purpose === "prompt")
        ? previous.councils.filter(
            (group) => !group.split("/").includes(provider),
          )
        : previous.councils,
  }));
}
