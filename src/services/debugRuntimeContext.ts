import Constants from "expo-constants";
import * as Network from "expo-network";
import {
  AppState,
  Dimensions,
  I18nManager,
  Platform,
} from "react-native";

export async function buildDebugRuntimeContext(
  appContext: Record<string, unknown>,
) {
  const window = Dimensions.get("window");
  const screen = Dimensions.get("screen");
  const platformConstants = Platform.constants as Record<string, unknown>;
  const nativeBuildVersion =
    Platform.OS === "ios"
      ? Constants.platform?.ios?.buildNumber ?? null
      : Platform.OS === "android"
        ? Constants.platform?.android?.versionCode ?? null
        : null;
  const network = await Network.getNetworkStateAsync().catch(() => null);

  return {
    ...appContext,
    runtime: {
      appState: AppState.currentState,
      appVersion: Constants.expoConfig?.version ?? null,
      buildVersion: nativeBuildVersion,
      debugBuild: __DEV__,
      device: {
        brand: platformConstants.Brand ?? null,
        manufacturer: platformConstants.Manufacturer ?? null,
        model:
          platformConstants.Model ?? Constants.platform?.ios?.model ?? null,
        yearClass: Constants.deviceYearClass ?? null,
      },
      dimensions: {
        fontScale: window.fontScale,
        orientation: window.width > window.height ? "landscape" : "portrait",
        screenHeight: screen.height,
        screenWidth: screen.width,
        windowHeight: window.height,
        windowWidth: window.width,
      },
      executionEnvironment: Constants.executionEnvironment,
      locale:
        Intl.DateTimeFormat().resolvedOptions().locale ?? "undetermined",
      network: network
        ? {
            isConnected: network.isConnected,
            isInternetReachable: network.isInternetReachable,
            type: network.type,
          }
        : { unavailable: true },
      platform: Platform.OS,
      platformVersion: Platform.Version,
      rtl: I18nManager.isRTL,
      sessionId: Constants.sessionId,
      timeZone:
        Intl.DateTimeFormat().resolvedOptions().timeZone ?? "undetermined",
    },
  };
}
