import React from "react";
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { APP_MODAL_ORIENTATIONS } from "../../constants/layout";
import { PROVIDER_LABELS, getProviderModelName } from "../../constants/models";
import { getLocalModel } from "../../constants/localModels";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import {
  ResponseMode,
  ResponseModeConfig,
  ResponseModeSelections,
} from "../../types";
import { getResponseModeRouteEffortLabel } from "../../utils/modelEffort";
import { ProviderIcon } from "../ProviderIcon";
import { responseModeToggleStyles as styles } from "./styles";

function useResponseModeSheetAnimation(open: boolean, height: number) {
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const sheetTranslateY = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (!open) {
      return;
    }

    // Start from the closed position on every open, so a sheet reopened before
    // its exit finished does not animate from halfway.
    backdropOpacity.stopAnimation();
    sheetTranslateY.stopAnimation();
    backdropOpacity.setValue(0);
    sheetTranslateY.setValue(height);

    const entranceAnimation = Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    entranceAnimation.start();
    return () => entranceAnimation.stop();
  }, [backdropOpacity, height, open, sheetTranslateY]);

  const exit = React.useCallback(
    (onFinished: () => void) => {
      backdropOpacity.stopAnimation();
      sheetTranslateY.stopAnimation();
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 140,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: height,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          onFinished();
        }
      });
    },
    [backdropOpacity, height, sheetTranslateY],
  );

  return { backdropOpacity, exit, sheetTranslateY };
}

function ResponseModeSheetOption({
  item,
  onSelect,
  ready,
  selected,
}: {
  item: ResponseModeConfig;
  onSelect: (mode: ResponseMode) => void;
  ready: boolean;
  selected: ResponseMode;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();
  const active = item.id === selected;
  const local =
    item.route.runtime === "local" && Boolean(item.route.localModelId);
  const localModel =
    local && item.route.localModelId
      ? getLocalModel(item.route.localModelId)
      : null;
  const modelLabel = localModel
    ? t(
        localModel.capability === "llm" &&
          localModel.responseProfile === "thorough"
          ? "onboardingBestSetupThoroughModel"
          : "onboardingBestSetupQuickModel",
      )
    : getProviderModelName(item.route.provider, item.route.model);
  const routeLabel = local
    ? t("settingsOnDevice")
    : PROVIDER_LABELS[item.route.provider];
  const effortLabel =
    getResponseModeRouteEffortLabel(item.route, language) ?? t("fixed");

  return (
    <Pressable
      testID={`response-mode-overflow-option-${item.id}`}
      accessibilityLabel={t("useResponseMode", {
        mode: `${routeLabel}. ${modelLabel}`,
      })}
      accessibilityRole="button"
      accessibilityState={{ disabled: !ready, selected: active }}
      disabled={!ready}
      onPress={() => onSelect(item.id)}
      style={({ pressed }) => [
        styles.overflowOption,
        {
          backgroundColor: active ? colors.accentSoft : colors.surfaceElevated,
          borderColor: active ? colors.accent : colors.border,
          opacity: ready ? (pressed ? 0.76 : 1) : 0.5,
        },
      ]}
    >
      <View style={styles.overflowOptionProvider}>
        {local ? (
          <PhosphorIcon
            name="cpu"
            color={active ? colors.accent : colors.textSecondary}
            size="feature"
          />
        ) : (
          <ProviderIcon
            provider={item.route.provider}
            color={active ? colors.accent : colors.textSecondary}
            size="feature"
          />
        )}
      </View>
      <View style={styles.overflowOptionModel}>
        <Text
          style={[
            styles.overflowOptionProviderLabel,
            { color: colors.textSecondary },
          ]}
        >
          {routeLabel}
        </Text>
        <Text style={[styles.overflowOptionModelName, { color: colors.text }]}>
          {modelLabel}
        </Text>
      </View>
      <View style={styles.overflowOptionEffort}>
        <Text
          style={[
            styles.modelEffortSingleLabel,
            { color: colors.textSecondary },
          ]}
        >
          {t("effort")}
        </Text>
        <Text
          style={[
            styles.modelEffortSingleValue,
            { color: colors.textSecondary },
          ]}
        >
          {effortLabel}
        </Text>
      </View>
      <View style={styles.overflowOptionCheck}>
        {active ? (
          <PhosphorIcon name="check" size="control" color={colors.accent} />
        ) : null}
      </View>
    </Pressable>
  );
}

/**
 * The list of configured routes as a bottom sheet.
 *
 * Extracted from `ResponseModeOverflowSelector` so the route byline can open the
 * same sheet from a different trigger. The selector's own behaviour is
 * unchanged: it still owns its trigger and still holds the open state.
 */
export function ResponseModeSheet({
  compact = false,
  modes,
  onClose,
  onSelect,
  open,
  readyModes,
  selected,
}: {
  compact?: boolean;
  modes: ResponseModeSelections;
  /** Called once the exit animation has finished, not when it starts. */
  onClose: () => void;
  onSelect: (mode: ResponseMode) => void;
  open: boolean;
  readyModes: ResponseMode[];
  selected: ResponseMode;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { height } = useWindowDimensions();
  const { backdropOpacity, exit, sheetTranslateY } =
    useResponseModeSheetAnimation(open, height);

  const requestClose = React.useCallback(() => {
    exit(onClose);
  }, [exit, onClose]);

  const handleSelect = React.useCallback(
    (mode: ResponseMode) => {
      onSelect(mode);
      requestClose();
    },
    [onSelect, requestClose],
  );

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      supportedOrientations={APP_MODAL_ORIENTATIONS}
      statusBarTranslucent
      onRequestClose={requestClose}
    >
      <View style={styles.overflowModalRoot}>
        <Animated.View
          testID="response-mode-overflow-backdrop-motion"
          style={[
            styles.overflowBackdrop,
            {
              backgroundColor: colors.overlay,
              opacity: backdropOpacity,
            },
          ]}
        >
          <Pressable
            testID="response-mode-overflow-backdrop"
            accessibilityLabel={t("dismiss")}
            accessibilityRole="button"
            onPress={requestClose}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View
          testID="response-mode-overflow-sheet-motion"
          style={[
            styles.overflowSheetMotion,
            compact ? styles.overflowSheetMotionCompact : null,
            { transform: [{ translateY: sheetTranslateY }] },
          ]}
        >
          <SafeAreaView
            testID="response-mode-overflow-sheet"
            edges={["bottom"]}
            accessibilityViewIsModal
            style={[
              styles.overflowSheet,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.glow,
              },
            ]}
          >
            <View
              style={[
                styles.overflowSheetHandle,
                { backgroundColor: colors.borderStrong },
              ]}
            />
            <View style={styles.overflowSheetHeader}>
              <View style={styles.overflowSheetHeaderCopy}>
                <Text
                  accessibilityRole="header"
                  style={[styles.overflowSheetTitle, { color: colors.text }]}
                >
                  {t("chooseResponseModel")}
                </Text>
                <Text
                  style={[
                    styles.overflowSheetSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  {t("responseModelCount", { count: modes.length })}
                </Text>
              </View>
              <Pressable
                testID="response-mode-overflow-close"
                accessibilityLabel={t("dismiss")}
                accessibilityRole="button"
                hitSlop={10}
                onPress={requestClose}
                style={({ pressed }) => [
                  styles.overflowSheetClose,
                  pressed ? styles.iconPressed : null,
                ]}
              >
                <PhosphorIcon
                  name="close"
                  size="control"
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <FlatList
              testID="response-mode-overflow-list"
              data={modes}
              keyExtractor={({ id }) => id}
              style={styles.overflowList}
              contentContainerStyle={styles.overflowListContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <ResponseModeSheetOption
                  item={item}
                  onSelect={handleSelect}
                  ready={readyModes.includes(item.id)}
                  selected={selected}
                />
              )}
            />
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}
