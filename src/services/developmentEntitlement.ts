import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules } from "react-native";

export type DevelopmentEntitlementMode = "free" | "premium";

export const DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY =
  "@mrbroccoli/development-entitlement-mode";

const DEVELOPMENT_APPLICATION_ID_SUFFIX = ".dev";
const MAESTRO_APPLICATION_ID_SUFFIX = ".maestro";

type DiagnosticsNativeModule = {
  getApplicationId?: () => Promise<string | null>;
};

export async function getApplicationId() {
  const diagnostics = NativeModules.MrBroccoliDiagnostics as
    DiagnosticsNativeModule | undefined;
  if (!diagnostics?.getApplicationId) {
    return null;
  }

  try {
    return await diagnostics.getApplicationId();
  } catch {
    return null;
  }
}

export async function isDevelopmentAppVariant() {
  const applicationId = await getApplicationId();
  return (
    applicationId?.endsWith(DEVELOPMENT_APPLICATION_ID_SUFFIX) === true ||
    applicationId?.endsWith(MAESTRO_APPLICATION_ID_SUFFIX) === true
  );
}

export async function loadDevelopmentEntitlementMode(): Promise<DevelopmentEntitlementMode | null> {
  const applicationId = await getApplicationId();

  const isDevelopment =
    applicationId?.endsWith(DEVELOPMENT_APPLICATION_ID_SUFFIX) === true;
  const isMaestro =
    applicationId?.endsWith(MAESTRO_APPLICATION_ID_SUFFIX) === true;
  if (!isDevelopment && !isMaestro) {
    return null;
  }

  const stored = await AsyncStorage.getItem(
    DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY,
  );
  if (stored === "premium" || stored === "free") {
    return stored;
  }

  // Release UI automation keeps its previous clean-install Premium default,
  // while now allowing the same manual Free/Premium control as `.dev`.
  return isMaestro ? "premium" : "free";
}

export async function saveDevelopmentEntitlementMode(
  mode: DevelopmentEntitlementMode,
) {
  if (!(await isDevelopmentAppVariant())) {
    return false;
  }

  await AsyncStorage.setItem(DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY, mode);
  return true;
}
