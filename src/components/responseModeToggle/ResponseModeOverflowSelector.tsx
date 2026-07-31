import React from "react";
import { AntIcon } from "../../design-system/AntIcon";
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
import {
  PROVIDER_LABELS,
  getProviderModelName,
} from "../../constants/models";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import {
  ResponseMode,
  ResponseModeConfig,
  ResponseModeSelections,
} from "../../types";
import { getResponseModeRouteEffortLabel } from "../../utils/modelEffort";
import { ProviderIcon } from "../ProviderIcon";
import { getResponseModeCardModelLabels } from "./modelLabels";
import { responseModeToggleStyles as styles } from "./styles";

interface ResponseModeOverflowSelectorProps {
  compact: boolean;
  modes: ResponseModeSelections;
  onSelect: (mode: ResponseMode) => void;
  readyModes: ResponseMode[];
  selected: ResponseMode;
}

function useResponseModeSheetAnimation(open: boolean, height: number) {
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const sheetTranslateY = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (!open) {
      return;
    }

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
  }, [backdropOpacity, open, sheetTranslateY]);

  const prepare = React.useCallback(() => {
    backdropOpacity.stopAnimation();
    sheetTranslateY.stopAnimation();
    backdropOpacity.setValue(0);
    sheetTranslateY.setValue(height);
  }, [backdropOpacity, height, sheetTranslateY]);

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

  return { backdropOpacity, exit, prepare, sheetTranslateY };
}

function ResponseModeOverflowOption({
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
  const modelLabel = getProviderModelName(
    item.route.provider,
    item.route.model,
  );
  const effortLabel =
    getResponseModeRouteEffortLabel(item.route, language) ?? t("fixed");

  return (
    <Pressable
      testID={`response-mode-overflow-option-${item.id}`}
      accessibilityLabel={t("useResponseMode", {
        mode: `${PROVIDER_LABELS[item.route.provider]}. ${modelLabel}`,
      })}
      accessibilityRole="button"
      accessibilityState={{ disabled: !ready, selected: active }}
      disabled={!ready}
      onPress={() => onSelect(item.id)}
      style={({ pressed }) => [
        styles.overflowOption,
        {
          backgroundColor: active
            ? colors.accentSoft
            : colors.surfaceElevated,
          borderColor: active ? colors.accent : colors.border,
          opacity: ready ? (pressed ? 0.76 : 1) : 0.5,
        },
      ]}
    >
      <View style={styles.overflowOptionProvider}>
        <ProviderIcon
          provider={item.route.provider}
          color={active ? colors.accent : colors.textSecondary}
          size="feature"
        />
      </View>
      <View style={styles.overflowOptionModel}>
        <Text
          style={[
            styles.overflowOptionProviderLabel,
            { color: colors.textSecondary },
          ]}
        >
          {PROVIDER_LABELS[item.route.provider]}
        </Text>
        <Text
          style={[
            styles.overflowOptionModelName,
            { color: colors.text },
          ]}
        >
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
          <AntIcon name="check" size="control" color={colors.accent} />
        ) : null}
      </View>
    </Pressable>
  );
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
  const { height } = useWindowDimensions();
  const [open, setOpen] = React.useState(false);
  const { backdropOpacity, exit, prepare, sheetTranslateY } =
    useResponseModeSheetAnimation(open, height);
  const activeMode =
    modes.find(({ id }) => id === selected) ?? modes[0];

  const openSheet = React.useCallback(() => {
    prepare();
    setOpen(true);
  }, [prepare]);

  const closeSheet = React.useCallback(() => {
    exit(() => setOpen(false));
  }, [exit]);

  const handleSelect = React.useCallback(
    (mode: ResponseMode) => {
      onSelect(mode);
      closeSheet();
    },
    [closeSheet, onSelect],
  );

  if (!activeMode) {
    return null;
  }

  const activeModelLabel = getProviderModelName(
    activeMode.route.provider,
    activeMode.route.model,
  );
  const activeCompactLabel = getResponseModeCardModelLabels(
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
          <ProviderIcon
            provider={activeMode.route.provider}
            color={colors.textSecondary}
            size={compact ? "feature" : "hero"}
          />
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
        <AntIcon
          name="down"
          size={compact ? "compact" : "control"}
          color={colors.textSecondary}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="none"
        supportedOrientations={APP_MODAL_ORIENTATIONS}
        statusBarTranslucent
        onRequestClose={closeSheet}
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
              onPress={closeSheet}
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
                    style={[
                      styles.overflowSheetTitle,
                      { color: colors.text },
                    ]}
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
                  onPress={closeSheet}
                  style={({ pressed }) => [
                    styles.overflowSheetClose,
                    pressed ? styles.iconPressed : null,
                  ]}
                >
                  <AntIcon
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
                  <ResponseModeOverflowOption
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
    </>
  );
}
