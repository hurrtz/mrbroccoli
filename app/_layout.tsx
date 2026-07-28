import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SettingsProvider, useSharedSettings } from "../src/context/SettingsContext";
import { AntDesignAppProvider } from "../src/design-system/AntDesignAppProvider";
import { LocalizationProvider } from "../src/i18n";
import { ThemeProvider } from "../src/theme/ThemeContext";

function RootLayoutInner() {
  const { settings } = useSharedSettings();

  return (
    <LocalizationProvider language={settings.language}>
      <ThemeProvider mode={settings.theme}>
        <AntDesignAppProvider>
          <View
            style={{
              flex: 1,
              direction: settings.language === "ar" ? "rtl" : "ltr",
            }}
          >
            <Stack screenOptions={{ headerShown: false }} />
          </View>
        </AntDesignAppProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <RootLayoutInner />
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
