import { useSyncExternalStore } from "react";

import {
  getRuntimeCapabilityOverrideRevision,
  getRuntimeCapabilityOverrides,
  subscribeToRuntimeCapabilityOverrides,
} from "../services/runtimeCapabilityOverrides";

export function useRuntimeCapabilityOverrides() {
  useSyncExternalStore(
    subscribeToRuntimeCapabilityOverrides,
    getRuntimeCapabilityOverrideRevision,
    getRuntimeCapabilityOverrideRevision,
  );

  return getRuntimeCapabilityOverrides();
}
