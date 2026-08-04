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
  return applicationId?.endsWith(DEVELOPMENT_APPLICATION_ID_SUFFIX) === true;
}

export async function loadDevelopmentEntitlementMode(): Promise<DevelopmentEntitlementMode | null> {
  const applicationId = await getApplicationId();

  // Release UI automation uses an isolated application identity so a clean
  // install can reach the complete Premium surface without StoreKit or Play
  // test-account state. The production identity cannot enter this branch.
  if (applicationId?.endsWith(MAESTRO_APPLICATION_ID_SUFFIX) === true) {
    return "premium";
  }

  if (applicationId?.endsWith(DEVELOPMENT_APPLICATION_ID_SUFFIX) !== true) {
    return null;
  }

  const stored = await AsyncStorage.getItem(
    DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY,
  );
  return stored === "premium" ? "premium" : "free";
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
