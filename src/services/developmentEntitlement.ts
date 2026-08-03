import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules } from "react-native";

export type DevelopmentEntitlementMode = "free" | "premium";

export const DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY =
  "@mrbroccoli/development-entitlement-mode";

const DEVELOPMENT_APPLICATION_ID_SUFFIX = ".dev";

type DiagnosticsNativeModule = {
  getApplicationId?: () => Promise<string | null>;
};

async function getApplicationId() {
  const diagnostics = NativeModules.MrBroccoliDiagnostics as
    | DiagnosticsNativeModule
    | undefined;
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

export async function loadDevelopmentEntitlementMode(): Promise<
  DevelopmentEntitlementMode | null
> {
  if (!(await isDevelopmentAppVariant())) {
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
