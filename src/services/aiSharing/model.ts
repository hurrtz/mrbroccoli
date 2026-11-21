import type { Provider } from "../../types";
import {
  getOpenRouterHost,
  getOpenRouterHosts,
} from "../../constants/providers/openRouterHosts";

export const AI_SHARING_PURPOSES = [
  "prompt",
  "history",
  "images",
  "transcription",
  "speech",
  "search",
  "council",
  "titles",
  "knowledge",
] as const;

export type AiSharingPurpose = (typeof AI_SHARING_PURPOSES)[number];
export type AiSharingPermissions = Partial<
  Record<Provider, Partial<Record<AiSharingPurpose, "allowed" | "denied">>>
>;
export interface AiSharingNeed {
  provider: Provider;
  purpose: AiSharingPurpose;
}
export interface AiSharingCouncil {
  providers: readonly Provider[];
  synthesisProvider: Provider;
  synthesisModel?: string;
}
export interface AiSharingRequest {
  required: readonly AiSharingNeed[];
  optional?: readonly AiSharingNeed[];
  council?: AiSharingCouncil;
  imageCount?: number;
  shareEarlier?: boolean;
  openRouterModels?: readonly string[];
  systemSpeech?: string;
}
export interface AiSharingSelection {
  optional: readonly AiSharingNeed[];
  rememberImages?: readonly Provider[];
}
export interface AiSharingAuthorization {
  allows(provider: Provider, purpose: AiSharingPurpose): boolean;
  allowsSystemSpeech?(id: string): boolean;
}
export interface AiSharingPending {
  id: number;
  request: AiSharingRequest;
  missingRequired: readonly AiSharingNeed[];
  optional: readonly AiSharingNeed[];
}
export interface AiSharingSnapshot {
  ready: boolean;
  permissions: AiSharingPermissions;
  systemSpeech?: Record<string, "allowed" | "denied" | "ask">;
  pending: AiSharingPending | null;
}

export function needKey({ provider, purpose }: AiSharingNeed) {
  return `${provider}/${purpose}`;
}

export function uniqueNeeds(needs: readonly AiSharingNeed[]) {
  return [...new Map(needs.map((need) => [needKey(need), need])).values()];
}

export function councilKey(
  council: AiSharingCouncil,
  models?: readonly string[],
) {
  const synthesisHost =
    council.synthesisProvider === "openrouter" &&
    getOpenRouterHost(council.synthesisModel);
  const hosts = getOpenRouterHosts(models)
    .map((host) => host.slugs[0])
    .sort();
  return [
    council.synthesisProvider,
    ...new Set(council.providers.slice().sort()),
    ...(synthesisHost ? ["final@" + synthesisHost.slugs[0]] : []),
    ...hosts.map((host) => "host@" + host),
  ].join("/");
}
