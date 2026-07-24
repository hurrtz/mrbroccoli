import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { useLocalization } from "../../i18n";
import type {
  Provider,
  ResponseMode,
  ResponseModeRoute,
  Settings,
} from "../../types";
import { useTheme } from "../../theme/ThemeContext";

import { ResponseModesSection } from "./ResponseModesSection";
import { styles } from "./styles";

export function ThinkingSection({
  settings,
  llmProviders,
  onUpdate,
  onUpdateResponseModeRoute,
  onAddResponseMode,
  onRemoveResponseMode,
}: {
  settings: Settings;
  llmProviders: Provider[];
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onUpdateResponseModeRoute: (
    mode: ResponseMode,
    route: ResponseModeRoute,
  ) => void;
  onAddResponseMode: () => void;
  onRemoveResponseMode: (mode: ResponseMode) => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [systemPromptOpen, setSystemPromptOpen] = React.useState(false);

  return (
    <View style={styles.tabPane}>
      <ResponseModesSection
        settings={settings}
        enabledProviders={llmProviders}
        onUpdateResponseModeRoute={onUpdateResponseModeRoute}
        onAddResponseMode={onAddResponseMode}
        onRemoveResponseMode={onRemoveResponseMode}
      />

      <View style={styles.inlineAccordion}>
        <TouchableOpacity
          style={[
            styles.inlineAccordionButton,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          activeOpacity={0.85}
          onPress={() => setSystemPromptOpen((previous) => !previous)}
        >
          <Text style={[styles.inlineAccordionTitle, { color: colors.text }]}>
            {t("systemPrompt")}
          </Text>
          <Feather
            name={systemPromptOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {systemPromptOpen ? (
          <View
            style={[
              styles.promptCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
              {t("assistantInstructionsIntro")}
            </Text>
            <TextInput
              value={settings.assistantInstructions}
              onChangeText={(value) => onUpdate({ assistantInstructions: value })}
              multiline
              placeholder={t("assistantInstructionsPlaceholder")}
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.accent}
              style={[
                styles.promptInput,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}
