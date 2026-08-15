import React from "react";
import {
  Animated,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import type { EdgeInsets } from "react-native-safe-area-context";
import { Toast } from "../../components/Toast";
import { IconButton } from "../../design-system/IconButton";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import type { SettingsPage } from "../settings-core/types";
import {
  SETTINGS_OVERVIEW_GROUPS,
  SETTINGS_OVERVIEW_ROWS,
  type SettingsDetailPage,
} from "./AntSettingsOverview";
import { styles } from "./styles";

interface AntSettingsFrameProps {
  activePage: SettingsPage;
  children: React.ReactNode;
  contentScrollRef: React.RefObject<ScrollView | null>;
  entrance: Animated.Value;
  insets: EdgeInsets;
  isLandscape: boolean;
  isRegularIpad: boolean;
  keyboardInset: number;
  modalMaxWidth: number;
  onBack: () => void;
  onClose: () => void;
  onDismissValidationToast: () => void;
  onSelectPage: (page: SettingsDetailPage) => void;
  title: string;
  validationToastMessage: string | null;
}

const SETTINGS_BACK_SWIPE_EDGE = 28;
const SETTINGS_BACK_SWIPE_SLOP = 10;
const SETTINGS_BACK_SWIPE_DISTANCE = 72;
const SETTINGS_BACK_SWIPE_VELOCITY = 0.55;

interface SettingsBackSwipeGesture {
  dx: number;
  dy: number;
  isRtl: boolean;
  width: number;
  x0: number;
}

/** Compact iOS Settings follows the platform's leading-edge back gesture. */
export function shouldClaimSettingsBackSwipe({
  dx,
  dy,
  isRtl,
  width,
  x0,
}: SettingsBackSwipeGesture) {
  const beganAtLeadingEdge = isRtl
    ? x0 >= width - SETTINGS_BACK_SWIPE_EDGE
    : x0 <= SETTINGS_BACK_SWIPE_EDGE;
  const leadingDistance = isRtl ? -dx : dx;

  return (
    beganAtLeadingEdge &&
    leadingDistance > SETTINGS_BACK_SWIPE_SLOP &&
    leadingDistance > Math.abs(dy) * 1.2
  );
}

export function shouldCompleteSettingsBackSwipe({
  dx,
  isRtl,
  vx,
}: Pick<SettingsBackSwipeGesture, "dx" | "isRtl"> & { vx: number }) {
  const leadingDistance = isRtl ? -dx : dx;
  const leadingVelocity = isRtl ? -vx : vx;

  return (
    leadingDistance >= SETTINGS_BACK_SWIPE_DISTANCE ||
    leadingVelocity >= SETTINGS_BACK_SWIPE_VELOCITY
  );
}

function IpadSettingsCategoryNav({
  activePage,
  insets,
  isRtl,
  onSelectPage,
}: {
  activePage: SettingsDetailPage;
  insets: EdgeInsets;
  isRtl: boolean;
  onSelectPage: (page: SettingsDetailPage) => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <View
      testID="settings-ipad-category-nav"
      style={[
        styles.ipadCategoryNav,
        {
          backgroundColor: colors.surface,
          borderEndColor: colors.border,
          borderEndWidth: 1,
        },
      ]}
    >
      <Text
        accessibilityRole="header"
        style={[
          styles.ipadCategoryTitle,
          {
            color: colors.text,
            paddingTop: insets.top + 22,
            textAlign: isRtl ? "right" : "left",
          },
        ]}
      >
        {t("settings")}
      </Text>
      <ScrollView
        contentContainerStyle={[
          styles.ipadCategoryContent,
          { paddingBottom: insets.bottom + 14 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {SETTINGS_OVERVIEW_GROUPS.map((group) => (
          <View key={group.titleKey} style={styles.ipadCategoryGroup}>
            <Text
              style={[
                styles.ipadCategoryGroupTitle,
                {
                  color: colors.textMuted,
                  textAlign: isRtl ? "right" : "left",
                },
              ]}
            >
              {t(group.titleKey)}
            </Text>
            {group.pages.map((page) => {
              const row = SETTINGS_OVERVIEW_ROWS[page];
              const selected = page === activePage;

              return (
                <Pressable
                  accessibilityLabel={t(row.titleKey)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={page}
                  onPress={() => onSelectPage(page)}
                  style={({ pressed }) => [
                    styles.ipadCategoryRow,
                    {
                      backgroundColor: selected
                        ? colors.accentSoft
                        : "transparent",
                    },
                    pressed ? styles.pressedControl : null,
                  ]}
                  testID={`settings-ipad-category-row-${page}`}
                >
                  <PhosphorIcon
                    color={selected ? colors.accent : colors.text}
                    name={row.icon}
                    size="control"
                  />
                  <Text
                    style={[
                      styles.ipadCategoryRowLabel,
                      {
                        color: selected ? colors.accent : colors.text,
                        textAlign: isRtl ? "right" : "left",
                      },
                    ]}
                  >
                    {t(row.titleKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export function AntSettingsFrame({
  activePage,
  children,
  contentScrollRef,
  entrance,
  insets,
  isLandscape,
  isRegularIpad,
  keyboardInset,
  modalMaxWidth,
  onBack,
  onClose,
  onDismissValidationToast,
  onSelectPage,
  title,
  validationToastMessage,
}: AntSettingsFrameProps) {
  const { colors } = useTheme();
  const { isRtl, t } = useLocalization();
  const { width } = useWindowDimensions();
  const showsBackButton = !isRegularIpad && activePage !== "overview";
  const backSwipeEnabled = Platform.OS === "ios" && showsBackButton;
  const backSwipeStateRef = React.useRef({
    enabled: backSwipeEnabled,
    isRtl,
    onBack,
    width,
  });
  backSwipeStateRef.current = {
    enabled: backSwipeEnabled,
    isRtl,
    onBack,
    width,
  };
  const backSwipeResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_event, gesture) => {
        const state = backSwipeStateRef.current;
        return (
          state.enabled &&
          shouldClaimSettingsBackSwipe({
            dx: gesture.dx,
            dy: gesture.dy,
            isRtl: state.isRtl,
            width: state.width,
            x0: gesture.x0,
          })
        );
      },
      onPanResponderRelease: (_event, gesture) => {
        const state = backSwipeStateRef.current;
        if (
          state.enabled &&
          shouldCompleteSettingsBackSwipe({
            dx: gesture.dx,
            isRtl: state.isRtl,
            vx: gesture.vx,
          })
        ) {
          state.onBack();
        }
      },
      onPanResponderTerminationRequest: () => false,
    }),
  ).current;
  const detailPage: SettingsDetailPage =
    activePage === "overview" ? "connections" : activePage;
  const animatedModalStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  };

  return (
    <View
      testID="settings-modal"
      accessibilityViewIsModal
      style={[
        styles.overlay,
        isRegularIpad
          ? styles.ipadOverlay
          : {
              paddingTop: isLandscape ? Math.max(insets.top + 8, 16) : 0,
              paddingBottom: isLandscape ? Math.max(insets.bottom + 8, 16) : 0,
              paddingHorizontal: isLandscape ? 12 : 0,
            },
      ]}
    >
      {!isRegularIpad ? (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.backdrop,
              {
                backgroundColor: colors.overlay,
                opacity: entrance,
              },
            ]}
            testID="settings-modal-backdrop"
          />
          <Pressable
            accessibilityElementsHidden
            accessible={false}
            importantForAccessibility="no"
            onPress={onClose}
            style={styles.backdrop}
          />
        </>
      ) : null}
      <Animated.View
        {...(backSwipeEnabled ? backSwipeResponder.panHandlers : null)}
        testID="settings-modal-panel"
        style={[
          styles.modal,
          isRegularIpad
            ? styles.ipadMasterDetail
            : isLandscape
              ? styles.modalLandscape
              : null,
          isRegularIpad
            ? {
                backgroundColor: colors.surface,
                borderRadius: 0,
                borderWidth: 0,
                maxWidth: "100%",
                shadowOpacity: 0,
              }
            : {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: isLandscape ? 22 : 0,
                borderWidth: isLandscape ? 1 : 0,
                maxWidth: modalMaxWidth,
                shadowColor: colors.glow,
              },
          animatedModalStyle,
        ]}
      >
        {isRegularIpad ? (
          <IpadSettingsCategoryNav
            activePage={detailPage}
            insets={insets}
            isRtl={isRtl}
            onSelectPage={onSelectPage}
          />
        ) : null}
        <View
          style={
            isRegularIpad ? styles.ipadDetailPane : styles.compactDetailPane
          }
          testID={isRegularIpad ? "settings-ipad-detail-pane" : undefined}
        >
          <View
            style={[
              styles.header,
              {
                backgroundColor: colors.surface,
                borderBottomColor: colors.border,
                paddingTop: isRegularIpad
                  ? insets.top + 14
                  : isLandscape
                    ? 14
                    : insets.top + 12,
              },
            ]}
          >
            {showsBackButton ? (
              <IconButton
                iconNode={
                  <PhosphorIcon
                    name={isRtl ? "arrow-right" : "arrow-left"}
                    size="navigation"
                    color={colors.textSecondary}
                  />
                }
                style={styles.headerControl}
                onPress={onBack}
                accessibilityLabel={t("settingsBackToOverview")}
                testID="settings-back-button"
              />
            ) : (
              <View style={styles.headerControl} />
            )}
            <View style={styles.headerTitleWrap}>
              <Text
                testID="settings-modal-title"
                accessibilityRole="header"
                style={[styles.headerTitle, { color: colors.text }]}
              >
                {title}
              </Text>
            </View>
            <IconButton
              iconNode={
                <PhosphorIcon
                  name="close"
                  size="navigation"
                  color={colors.textSecondary}
                />
              }
              style={styles.headerControl}
              onPress={onClose}
              accessibilityLabel={t("dismiss")}
              testID="settings-close-button"
            />
          </View>

          <ScrollView
            testID="settings-scroll-view"
            ref={contentScrollRef}
            style={styles.scroll}
            contentContainerStyle={[
              styles.content,
              {
                paddingBottom: Math.max(insets.bottom + 20, keyboardInset + 20),
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="interactive"
            nestedScrollEnabled
          >
            {children}
          </ScrollView>
        </View>
      </Animated.View>
      <Toast
        message={validationToastMessage ?? ""}
        visible={validationToastMessage !== null}
        onDismiss={onDismissValidationToast}
        tone="danger"
      />
    </View>
  );
}
