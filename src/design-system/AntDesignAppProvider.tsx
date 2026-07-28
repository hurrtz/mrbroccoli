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
import type { AppLanguage } from "../types";
import { createAntTheme } from "./antTheme";

type AntLocale = NonNullable<
  React.ComponentProps<typeof AntProvider>["locale"]
>;

const antLocales: Record<AppLanguage, AntLocale> = {
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
  hi: {
    locale: "hi",
    Modal: {
      okText: "ठीक है",
      cancelText: "रद्द करें",
      buttonText: "बटन",
    },
    Picker: {
      okText: "ठीक है",
      dismissText: "रद्द करें",
      extra: "चुनें",
    },
    SearchBar: {
      cancelText: "रद्द करें",
    },
  },
  es: {
    locale: "es",
    Modal: {
      okText: "Aceptar",
      cancelText: "Cancelar",
      buttonText: "Botón",
    },
    Picker: {
      okText: "Aceptar",
      dismissText: "Cancelar",
      extra: "Seleccionar",
    },
    SearchBar: {
      cancelText: "Cancelar",
    },
  },
  fr: {
    locale: "fr",
    Modal: {
      okText: "OK",
      cancelText: "Annuler",
      buttonText: "Bouton",
    },
    Picker: {
      okText: "OK",
      dismissText: "Annuler",
      extra: "Sélectionner",
    },
    SearchBar: {
      cancelText: "Annuler",
    },
  },
  it: {
    locale: "it",
    Modal: {
      okText: "OK",
      cancelText: "Annulla",
      buttonText: "Pulsante",
    },
    Picker: {
      okText: "OK",
      dismissText: "Annulla",
      extra: "Seleziona",
    },
    SearchBar: {
      cancelText: "Annulla",
    },
  },
  pt: {
    locale: "pt",
    Modal: {
      okText: "OK",
      cancelText: "Cancelar",
      buttonText: "Botão",
    },
    Picker: {
      okText: "OK",
      dismissText: "Cancelar",
      extra: "Selecionar",
    },
    SearchBar: {
      cancelText: "Cancelar",
    },
  },
  "pt-BR": {
    locale: "pt-BR",
    Modal: {
      okText: "OK",
      cancelText: "Cancelar",
      buttonText: "Botão",
    },
    Picker: {
      okText: "OK",
      dismissText: "Cancelar",
      extra: "Selecionar",
    },
    SearchBar: {
      cancelText: "Cancelar",
    },
  },
  ru: {
    locale: "ru",
    Modal: {
      okText: "ОК",
      cancelText: "Отмена",
      buttonText: "Кнопка",
    },
    Picker: {
      okText: "ОК",
      dismissText: "Отмена",
      extra: "Выбрать",
    },
    SearchBar: {
      cancelText: "Отмена",
    },
  },
  "zh-CN": {
    locale: "zh-CN",
    Modal: {
      okText: "确定",
      cancelText: "取消",
      buttonText: "按钮",
    },
    Picker: {
      okText: "确定",
      dismissText: "取消",
      extra: "请选择",
    },
    SearchBar: {
      cancelText: "取消",
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
