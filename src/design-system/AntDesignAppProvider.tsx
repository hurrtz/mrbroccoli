import React from "react";

import { Provider as AntProvider } from "@ant-design/react-native";
import { Outfit_400Regular } from "@expo-google-fonts/outfit/400Regular";
import { Outfit_500Medium } from "@expo-google-fonts/outfit/500Medium";
import { Outfit_600SemiBold } from "@expo-google-fonts/outfit/600SemiBold";
import { Outfit_700Bold } from "@expo-google-fonts/outfit/700Bold";
import { UnicaOne_400Regular } from "@expo-google-fonts/unica-one/400Regular";
import { useFonts } from "expo-font";

import { useLocalization } from "../i18n";
import { getAppLocale } from "../i18n/localeRegistry";
import { useTheme } from "../theme/ThemeContext";
import { createAntTheme } from "./antTheme";

type AntLocale = NonNullable<
  React.ComponentProps<typeof AntProvider>["locale"]
>;

export function AntDesignAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  const { isRtl, language } = useLocalization();
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    UnicaOne_400Regular,
  });
  const antTheme = React.useMemo(() => createAntTheme(colors), [colors]);
  const appLocale = getAppLocale(language);
  const antLocale: AntLocale = {
    locale: appLocale.intlLocale,
    Modal: {
      okText: appLocale.antDesign.modal.ok,
      cancelText: appLocale.antDesign.modal.cancel,
      buttonText: appLocale.antDesign.modal.button,
    },
    Picker: {
      okText: appLocale.antDesign.picker.ok,
      dismissText: appLocale.antDesign.picker.cancel,
      extra: appLocale.antDesign.picker.select,
    },
    SearchBar: {
      cancelText: appLocale.antDesign.search.cancel,
    },
  };

  if (fontError) {
    throw fontError;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AntProvider isRTL={isRtl} locale={antLocale} theme={antTheme}>
      {children}
    </AntProvider>
  );
}
