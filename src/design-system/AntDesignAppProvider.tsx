import React from "react";

import { Provider as AntProvider } from "@ant-design/react-native";
import { Outfit_400Regular } from "@expo-google-fonts/outfit/400Regular";
import { Outfit_500Medium } from "@expo-google-fonts/outfit/500Medium";
import { Outfit_600SemiBold } from "@expo-google-fonts/outfit/600SemiBold";
import { Outfit_700Bold } from "@expo-google-fonts/outfit/700Bold";
import { UnicaOne_400Regular } from "@expo-google-fonts/unica-one/400Regular";
import { useFonts } from "expo-font";

import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { createAntTheme } from "./antTheme";

type AntLocale = NonNullable<
  React.ComponentProps<typeof AntProvider>["locale"]
>;

const antLocales: Record<"en" | "de" | "uk", AntLocale> = {
  en: {
    locale: "en",
    Modal: {
      okText: "OK",
      cancelText: "Cancel",
      buttonText: "Button",
    },
    Picker: {
      okText: "OK",
      dismissText: "Cancel",
      extra: "Select",
    },
    SearchBar: {
      cancelText: "Cancel",
    },
  },
  de: {
    locale: "de",
    Modal: {
      okText: "OK",
      cancelText: "Abbrechen",
      buttonText: "Schaltfläche",
    },
    Picker: {
      okText: "OK",
      dismissText: "Abbrechen",
      extra: "Auswählen",
    },
    SearchBar: {
      cancelText: "Abbrechen",
    },
  },
  uk: {
    locale: "uk",
    Modal: {
      okText: "Гаразд",
      cancelText: "Скасувати",
      buttonText: "Кнопка",
    },
    Picker: {
      okText: "Гаразд",
      dismissText: "Скасувати",
      extra: "Вибрати",
    },
    SearchBar: {
      cancelText: "Скасувати",
    },
  },
};

export function AntDesignAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  const { language } = useLocalization();
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    UnicaOne_400Regular,
    antfill: require("../../node_modules/@ant-design/icons-react-native/fonts/antfill.ttf"),
    antoutline: require("../../node_modules/@ant-design/icons-react-native/fonts/antoutline.ttf"),
  });
  const antTheme = React.useMemo(() => createAntTheme(colors), [colors]);

  if (fontError) {
    throw fontError;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AntProvider locale={antLocales[language]} theme={antTheme}>
      {children}
    </AntProvider>
  );
}
