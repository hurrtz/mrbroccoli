import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SettingsProvider, useSharedSettings } from "../src/context/SettingsContext";
import { AntDesignAppProvider } from "../src/design-system/AntDesignAppProvider";
import { LocalizationProvider, useLocalization } from "../src/i18n";
import { ThemeProvider } from "../src/theme/ThemeContext";
import { initializeDiagnosticPostmortem } from "../src/services/diagnosticPostmortem";

initializeDiagnosticPostmortem();

function RootLayoutInner() {
  const { settings } = useSharedSettings();
  const { direction } = useLocalization();

  return (
    <ThemeProvider mode={settings.theme}>
      <AntDesignAppProvider>
        <View style={{ flex: 1, direction }}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </AntDesignAppProvider>
    </ThemeProvider>
  );
}

function LocalizedRootLayoutInner() {
  const { settings } = useSharedSettings();

  return (
    <LocalizationProvider language={settings.language}>
      <RootLayoutInner />
    </LocalizationProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <LocalizedRootLayoutInner />
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
