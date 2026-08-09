import React from "react";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { Pressable, Text, View } from "react-native";
import { getProviderModelName } from "../../constants/models";
import { getLocalModel } from "../../constants/localModels";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { ResponseMode, ResponseModeSelections } from "../../types";
import { getResponseModeRouteEffortLabel } from "../../utils/modelEffort";
import { ProviderIcon } from "../ProviderIcon";
import { getResponseModeCardModelLabels } from "./modelLabels";
import { ResponseModeSheet } from "./ResponseModeSheet";
import { responseModeToggleStyles as styles } from "./styles";

interface ResponseModeOverflowSelectorProps {
  compact: boolean;
  modes: ResponseModeSelections;
  onSelect: (mode: ResponseMode) => void;
  readyModes: ResponseMode[];
  selected: ResponseMode;
}

export function ResponseModeOverflowSelector({
  compact,
  modes,
  onSelect,
  readyModes,
  selected,
}: ResponseModeOverflowSelectorProps) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const [open, setOpen] = React.useState(false);
  const activeMode = modes.find(({ id }) => id === selected) ?? modes[0];

  const openSheet = React.useCallback(() => {
    setOpen(true);
  }, []);

  if (!activeMode) {
    return null;
  }

  const activeLocal =
    activeMode.route.runtime === "local" &&
    Boolean(activeMode.route.localModelId);
  const activeLocalModel =
    activeLocal && activeMode.route.localModelId
      ? getLocalModel(activeMode.route.localModelId)
      : null;
  const activeModelLabel = activeLocalModel
    ? t(
        activeLocalModel.capability === "llm" &&
          activeLocalModel.responseProfile === "thorough"
          ? "onboardingBestSetupThoroughModel"
          : "onboardingBestSetupQuickModel",
      )
    : getProviderModelName(activeMode.route.provider, activeMode.route.model);
  const activeCompactLabel = activeLocal
    ? { family: t("settingsOnDevice"), name: activeModelLabel }
    : getResponseModeCardModelLabels(
        activeMode.route.provider,
        activeModelLabel,
      );
  const activeEffortLabel =
    getResponseModeRouteEffortLabel(activeMode.route, language) ?? t("fixed");

  return (
    <>
      <Pressable
        testID="response-mode-overflow-selector"
        accessibilityLabel={`${t("chooseResponseModel")}. ${activeModelLabel}`}
        accessibilityRole="button"
        onPress={openSheet}
        style={({ pressed }) => [
          styles.overflowSelector,
          compact ? styles.overflowSelectorCompact : null,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.inactiveControlBorder,
          },
          pressed ? styles.optionPressed : null,
        ]}
      >
        <View
          style={[
            styles.overflowSelectorProvider,
            compact ? styles.overflowSelectorProviderCompact : null,
          ]}
        >
          {activeLocal ? (
            <PhosphorIcon
              name="cpu"
              color={colors.textSecondary}
              size={compact ? "feature" : "hero"}
            />
          ) : (
            <ProviderIcon
              provider={activeMode.route.provider}
              color={colors.textSecondary}
              size={compact ? "feature" : "hero"}
            />
          )}
        </View>
        <View style={styles.overflowSelectorModel}>
          <Text
            style={[
              styles.modelFamily,
              styles.modelFamilySingle,
              { color: colors.textSecondary },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activeCompactLabel.family}
          </Text>
          <Text
            style={[
              styles.modelText,
              styles.modelTextDetailedPortraitSingle,
              styles.overflowSelectorModelName,
              compact ? styles.overflowSelectorModelNameCompact : null,
              { color: colors.text },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activeCompactLabel.name}
          </Text>
        </View>
        <View
          style={[
            styles.overflowSelectorEffort,
            compact ? styles.overflowSelectorEffortCompact : null,
          ]}
        >
          <Text
            style={[
              styles.modelEffortSingleLabel,
              { color: colors.textSecondary },
            ]}
            numberOfLines={1}
          >
            {t("effort")}
          </Text>
          <Text
            style={[
              styles.modelEffortSingleValue,
              { color: colors.textSecondary },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activeEffortLabel}
          </Text>
        </View>
        <PhosphorIcon
          name="down"
          size={compact ? "compact" : "control"}
          color={colors.textSecondary}
        />
      </Pressable>

      <ResponseModeSheet
        compact={compact}
        modes={modes}
        onClose={() => setOpen(false)}
        onSelect={onSelect}
        open={open}
        readyModes={readyModes}
        selected={selected}
      />
    </>
  );
}
