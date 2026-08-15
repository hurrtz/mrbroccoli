import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { IntroBanner } from "../../components/IntroBanner";
import { BackgroundTaskBar } from "../../design-system/BackgroundTaskBar";
import { ConversationSettingsSummary } from "../../design-system/ConversationSettingsSummary";
import { IconButton } from "../../design-system/IconButton";
import { OrbSatellite } from "../../design-system/OrbSatellite";
import { TranscriptHandle } from "../../design-system/TranscriptHandle";
import { Modal } from "../../design-system/NativeControls";
import { SheetHeader } from "../../design-system/SheetHeader";
import type { Colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import type { VoiceVisualPhase } from "../../types";
import type { IpadLayout } from "../../utils/ipadLayout";
import { MainScreenRouteCard } from "./MainScreenRouteCard";
import { MainScreenTopBar } from "./MainScreenTopBar";
import { MainScreenVoiceStage } from "./MainScreenVoiceStage";
import { RoutePickerSheet } from "./RoutePickerSheet";
import { TranscriptPreviewCard } from "./TranscriptPreviewCard";
import type { TranslateFn } from "./shared";
import { styles } from "./styles";

const ACCESSIBILITY_COMPACT_FONT_SCALE = 1.8;

interface WorkspaceSatellitesProps {
  colors: Colors;
  compact?: boolean;
  councilActive: boolean;
  councilAvailable: boolean;
  disabled: boolean;
  imageAvailable: boolean;
  imageDisabled: boolean;
  driveRunning: boolean;
  driveSession: boolean;
  onAddImage?: () => void;
  onDriveResume?: () => void;
  onDriveStop?: () => void;
  /** Replays the response from its first word; live only while he speaks. */
  onRestart?: () => void;
  /** Moves a paragraph back or forward; live only while he speaks. */
  onSeekBack?: () => void;
  onSeekForward?: () => void;
  onStopPlayback: () => void;
  onToggleCouncil?: () => void;
  onToggleWeb?: () => void;
  speaking: boolean;
  t: TranslateFn;
  turnActive: boolean;
  webActive: boolean;
  webAvailable: boolean;
}

/**
 * The ring belongs to the phase. At idle it carries the composing controls —
 * image, council, web — the only moment they mean anything. Once a turn runs
 * they give way to the transport verbs, and a drive session shows transport in
 * every phase, idle included, because the loop must be stoppable at rest.
 *
 * Restart, Back and Forward stay disabled until speaking begins; Back and
 * Forward additionally require a reply with more than one paragraph.
 */
function WorkspaceSatellites({
  colors,
  compact = false,
  councilActive,
  councilAvailable,
  driveRunning,
  driveSession,
  onDriveResume,
  onDriveStop,
  onRestart,
  onSeekBack,
  onSeekForward,
  disabled,
  imageAvailable,
  imageDisabled,
  onAddImage,
  onStopPlayback,
  onToggleCouncil,
  onToggleWeb,
  speaking,
  t,
  turnActive,
  webActive,
  webAvailable,
}: WorkspaceSatellitesProps) {
  const divider = (
    <View
      style={[
        workspaceStyles.satelliteDivider,
        { backgroundColor: colors.border },
      ]}
    />
  );

  const composing = !turnActive && !driveSession;

  return (
    <View
      style={[
        workspaceStyles.satellites,
        compact ? workspaceStyles.satellitesCompact : null,
      ]}
      testID="workspace-satellites"
    >
      {composing ? (
        <>
          {!compact ? (
            <>
              <OrbSatellite
                accessibilityLabel={t("addImage")}
                compact={compact}
                disabled={imageDisabled || !imageAvailable}
                icon="image"
                label={t("workspaceImageLabel")}
                onPress={imageAvailable ? onAddImage : undefined}
                testID="satellite-image"
              />
              {divider}
            </>
          ) : null}
          <OrbSatellite
            accessibilityLabel={t("ulraMode")}
            active={councilActive}
            compact={compact}
            disabled={disabled || !councilAvailable}
            icon="council"
            kind="toggle"
            label={t("workspaceCouncilLabel")}
            onPress={councilAvailable ? onToggleCouncil : undefined}
            testID="satellite-council"
          />
          <OrbSatellite
            accessibilityLabel={t("webSearch")}
            active={webActive}
            compact={compact}
            disabled={disabled || !webAvailable}
            icon="search"
            kind="toggle"
            label={t("workspaceWebLabel")}
            onPress={webAvailable ? onToggleWeb : undefined}
            testID="satellite-web"
          />
        </>
      ) : (
        <>
          <OrbSatellite
            compact={compact}
            disabled={!speaking || !onRestart}
            icon="reload"
            label={t("transportRestart")}
            onPress={onRestart}
            testID="satellite-restart"
          />
          <OrbSatellite
            compact={compact}
            disabled={!speaking || !onSeekBack}
            icon="left"
            label={t("transportBack")}
            onPress={onSeekBack}
            testID="satellite-back"
          />
          <OrbSatellite
            compact={compact}
            disabled={!speaking || !onSeekForward}
            icon="right"
            label={t("transportForward")}
            onPress={onSeekForward}
            testID="satellite-forward"
          />
          {driveSession && !driveRunning ? (
            <OrbSatellite
              accessibilityLabel={t("continueDriveSession")}
              compact={compact}
              icon="play"
              label={t("transportResume")}
              onPress={onDriveResume}
              testID="satellite-resume"
              tone="success"
            />
          ) : (
            <OrbSatellite
              accessibilityLabel={
                driveSession ? t("stopDriveSession") : t("stop")
              }
              compact={compact}
              icon="stop"
              label={t("stop")}
              onPress={driveSession ? onDriveStop : onStopPlayback}
              testID="satellite-stop"
              tone="danger"
            />
          )}
        </>
      )}
    </View>
  );
}

interface MainScreenWorkspaceProps {
  /** The one row reporting work the user started somewhere else. */
  backgroundTask: Omit<
    React.ComponentProps<typeof BackgroundTaskBar>,
    "style"
  > | null;
  colors: Colors;
  introBanner: React.ComponentProps<typeof IntroBanner>;
  ipadLayout: IpadLayout;
  isLandscape: boolean;
  routeCard: Omit<React.ComponentProps<typeof MainScreenRouteCard>, "style"> & {
    t: TranslateFn;
  };
  routePicker: Omit<React.ComponentProps<typeof RoutePickerSheet>, "t">;
  satellites: Omit<
    WorkspaceSatellitesProps,
    "colors" | "compact" | "speaking" | "turnActive"
  >;
  settingsSummary: {
    accessibilityLabel: string;
    onPress: () => void;
    summary: string;
  };
  topBar: Omit<React.ComponentProps<typeof MainScreenTopBar>, "colors">;
  transcript: Omit<
    React.ComponentProps<typeof TranscriptPreviewCard>,
    "colors" | "layout" | "presentation" | "style"
  >;
  transcriptSheet: {
    countLabel: string | null;
    emptyLabel: string;
    hideLabel: string;
    onClose: () => void;
    onDismiss: () => void;
    onOpen: () => void;
    showLabel: string;
    titleLabel: string;
    visible: boolean;
  };
  visualPhase: VoiceVisualPhase;
  voiceStage: Omit<
    React.ComponentProps<typeof MainScreenVoiceStage>,
    "colors" | "layout" | "maxOrbSize"
  >;
}

export function MainScreenWorkspace({
  backgroundTask,
  colors,
  introBanner,
  ipadLayout,
  isLandscape,
  routeCard,
  routePicker,
  satellites,
  settingsSummary,
  topBar,
  transcript,
  transcriptSheet,
  visualPhase,
  voiceStage,
}: MainScreenWorkspaceProps) {
  const { fontScale, height: windowHeight } = useWindowDimensions();
  const useAccessibilityCompactLayout =
    fontScale >= ACCESSIBILITY_COMPACT_FONT_SCALE;
  const messageCount = transcript.messages.length;
  // The accessible name always states the real count, from the same list
  // that decides the empty state.
  const handleAccessibilityLabel = `${transcriptSheet.showLabel}. ${
    messageCount > 0 && transcriptSheet.countLabel
      ? transcriptSheet.countLabel
      : transcriptSheet.emptyLabel
  }`;

  const {
    debugLogActive: _debugLogActive,
    debugLogLabel: _debugLogLabel,
    onToggleDebugLog: _onToggleDebugLog,
    ...landscapeTopBar
  } = topBar;
  const { t: routePickerTranslate, ...routeCardProps } = routeCard;
  const {
    councilActive,
    councilAvailable,
    disabled: satellitesDisabled,
    driveRunning,
    driveSession,
    imageAvailable,
    imageDisabled,
    onAddImage,
    onDriveResume,
    onDriveStop,
    onRestart,
    onSeekBack,
    onSeekForward,
    onStopPlayback,
    onToggleCouncil,
    onToggleWeb,
    t: translateSatellite,
    webActive,
    webAvailable,
  } = satellites;
  const portraitSatellites = React.useMemo(
    () => (
      <WorkspaceSatellites
        colors={colors}
        compact={useAccessibilityCompactLayout}
        councilActive={councilActive}
        councilAvailable={councilAvailable}
        disabled={satellitesDisabled}
        driveRunning={driveRunning}
        driveSession={driveSession}
        imageAvailable={imageAvailable}
        imageDisabled={imageDisabled}
        onAddImage={onAddImage}
        onDriveResume={onDriveResume}
        onDriveStop={onDriveStop}
        onRestart={onRestart}
        onSeekBack={onSeekBack}
        onSeekForward={onSeekForward}
        onStopPlayback={onStopPlayback}
        onToggleCouncil={onToggleCouncil}
        onToggleWeb={onToggleWeb}
        speaking={visualPhase === "speaking"}
        t={translateSatellite}
        turnActive={visualPhase !== "idle"}
        webActive={webActive}
        webAvailable={webAvailable}
      />
    ),
    [
      colors,
      councilActive,
      councilAvailable,
      driveRunning,
      driveSession,
      imageAvailable,
      imageDisabled,
      onAddImage,
      onDriveResume,
      onDriveStop,
      onRestart,
      onSeekBack,
      onSeekForward,
      onStopPlayback,
      onToggleCouncil,
      onToggleWeb,
      satellitesDisabled,
      translateSatellite,
      useAccessibilityCompactLayout,
      visualPhase,
      webActive,
      webAvailable,
    ],
  );

  if (ipadLayout.isRegularWidth) {
    const regularOrbCeiling = introBanner.visible
      ? 168
      : ipadLayout.transcriptDocked
        ? 204
        : isLandscape
          ? 224
          : 208;

    return (
      <View style={workspaceStyles.ipadShell} testID="ipad-workspace">
        <View
          style={workspaceStyles.ipadContentPane}
          testID="ipad-content-pane"
        >
          <View
            style={workspaceStyles.ipadHeader}
            testID="ipad-workspace-header"
          >
            <View style={workspaceStyles.ipadHeaderControl}>
              {topBar.onToggleDebugLog ? (
                <IconButton
                  active={topBar.debugLogActive}
                  accessibilityLabel={topBar.debugLogLabel ?? "Debug log"}
                  icon="bug"
                  onPress={topBar.onToggleDebugLog}
                  testID="main-debug-log-button"
                />
              ) : null}
            </View>
            <View style={workspaceStyles.ipadRouteSlot}>
              <MainScreenRouteCard {...routeCardProps} />
            </View>
            <ConversationSettingsSummary
              accessibilityLabel={settingsSummary.accessibilityLabel}
              compact
              onPress={settingsSummary.onPress}
              summary={settingsSummary.summary}
              testID="conversation-settings-summary"
            />
          </View>

          <View style={workspaceStyles.ipadBody}>
            <IntroBanner {...introBanner} compact={introBanner.compact} />
            {backgroundTask ? <BackgroundTaskBar {...backgroundTask} /> : null}
            <View style={workspaceStyles.ipadStageArea}>
              <MainScreenVoiceStage
                colors={colors}
                footer={portraitSatellites}
                layout="portrait"
                maxOrbSize={regularOrbCeiling}
                {...voiceStage}
              />
            </View>
            {!ipadLayout.transcriptDocked ? (
              <TranscriptHandle
                accessibilityLabel={handleAccessibilityLabel}
                label={transcriptSheet.titleLabel}
                onPress={transcriptSheet.onOpen}
                style={workspaceStyles.ipadTranscriptHandle}
                testID="transcript-handle"
              />
            ) : null}
          </View>

          {!ipadLayout.transcriptDocked ? (
            <Modal
              cardStyle={[
                workspaceStyles.transcriptSheetCard,
                { backgroundColor: colors.background },
              ]}
              layout="sheet"
              onClose={transcriptSheet.onClose}
              onDismiss={transcriptSheet.onDismiss}
              title={
                <SheetHeader
                  closeAccessibilityLabel={transcriptSheet.hideLabel}
                  onClose={transcriptSheet.onClose}
                  testID="transcript-sheet-header"
                  title={transcriptSheet.titleLabel}
                />
              }
              visible={transcriptSheet.visible}
            >
              <TranscriptPreviewCard
                colors={colors}
                contentMaxWidth={720}
                preferredHeight={Math.round(windowHeight * 0.85)}
                presentation="canvas"
                {...transcript}
              />
            </Modal>
          ) : null}
        </View>

        {ipadLayout.transcriptDocked ? (
          <View
            style={[
              workspaceStyles.ipadTranscriptPane,
              {
                backgroundColor: colors.surface,
                borderStartColor: colors.border,
                width: ipadLayout.transcriptWidth ?? 400,
              },
            ]}
            testID="ipad-transcript-pane"
          >
            <View
              style={[
                workspaceStyles.ipadTranscriptPaneHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <Text
                accessibilityRole="header"
                style={[
                  workspaceStyles.ipadTranscriptPaneTitle,
                  { color: colors.text },
                ]}
              >
                {transcriptSheet.titleLabel}
              </Text>
            </View>
            <View style={workspaceStyles.ipadTranscriptPaneContent}>
              <TranscriptPreviewCard
                colors={colors}
                layout="landscape"
                style={styles.landscapeTranscriptCard}
                {...transcript}
              />
            </View>
          </View>
        ) : null}

        <RoutePickerSheet t={routePickerTranslate} {...routePicker} />
      </View>
    );
  }

  if (isLandscape) {
    return (
      <View style={styles.landscapeShell}>
        <View testID="landscape-left-pane" style={styles.landscapeLeftColumn}>
          <MainScreenTopBar colors={colors} {...landscapeTopBar} />

          {/* In landscape the row belongs in the left pane, above the byline. */}
          {backgroundTask ? <BackgroundTaskBar {...backgroundTask} /> : null}

          <MainScreenRouteCard
            style={styles.heroCardLandscape}
            {...routeCardProps}
          />
          <View
            testID="landscape-stage-area"
            style={[
              styles.landscapeStageArea,
              voiceStage.inputMode === "drive-session"
                ? styles.landscapeStageAreaDrive
                : null,
            ]}
          >
            {/* The words cost the orb height this narrow column cannot spare,
                so the control floats over the stage's top-right corner and the
                orb owns everything between the byline and the control row. */}
            <ConversationSettingsSummary
              accessibilityLabel={settingsSummary.accessibilityLabel}
              compact
              onPress={settingsSummary.onPress}
              style={workspaceStyles.landscapeSettingsControl}
              summary={settingsSummary.summary}
              testID="conversation-settings-summary"
            />
            <MainScreenVoiceStage
              colors={colors}
              footer={
                <WorkspaceSatellites
                  colors={colors}
                  compact
                  speaking={visualPhase === "speaking"}
                  turnActive={visualPhase !== "idle"}
                  {...satellites}
                />
              }
              layout="landscape"
              // Short phone windows must retain the complete 44pt transport
              // row above the system gesture area. Regular-width iPads use
              // their larger, separately measured ceilings above.
              maxOrbSize={104}
              {...voiceStage}
              // The left pane cannot fit the full notice paragraph above the
              // status line at any font scale, so landscape always takes the
              // single-row action variant.
              compactPromptNotice
            />
          </View>
        </View>

        <View
          testID="landscape-pane-divider"
          style={[
            styles.landscapePaneDivider,
            { backgroundColor: colors.border },
          ]}
        />

        <View testID="landscape-right-pane" style={styles.landscapeRightColumn}>
          <IntroBanner compact {...introBanner} />
          <TranscriptPreviewCard
            colors={colors}
            layout="landscape"
            style={styles.landscapeTranscriptCard}
            {...transcript}
          />
        </View>

        <RoutePickerSheet t={routePickerTranslate} {...routePicker} />
      </View>
    );
  }

  return (
    <>
      <MainScreenTopBar colors={colors} {...topBar} />

      <View style={styles.workspaceBody}>
        <IntroBanner
          {...introBanner}
          compact={useAccessibilityCompactLayout || introBanner.compact}
        />
        {backgroundTask ? <BackgroundTaskBar {...backgroundTask} /> : null}
        <MainScreenRouteCard {...routeCardProps} />
        <ConversationSettingsSummary
          accessibilityLabel={settingsSummary.accessibilityLabel}
          compact={useAccessibilityCompactLayout}
          onPress={settingsSummary.onPress}
          summary={settingsSummary.summary}
          testID="conversation-settings-summary"
        />

        <View
          testID="portrait-conversation-stack"
          style={styles.portraitConversationStack}
        >
          <View
            testID="portrait-input-section"
            style={styles.portraitInputSection}
          >
            <MainScreenVoiceStage
              colors={colors}
              footer={portraitSatellites}
              // The banner row borrows vertical room from the stage; the orb
              // steps down rather than squeezing the caption or satellites.
              maxOrbSize={introBanner.visible ? 156 : 196}
              {...voiceStage}
            />
          </View>
        </View>
      </View>

      <TranscriptHandle
        accessibilityLabel={handleAccessibilityLabel}
        label={transcriptSheet.titleLabel}
        onPress={transcriptSheet.onOpen}
        style={workspaceStyles.transcriptHandle}
        testID="transcript-handle"
      />

      <Modal
        cardStyle={[
          workspaceStyles.transcriptSheetCard,
          { backgroundColor: colors.background },
        ]}
        layout="sheet"
        onClose={transcriptSheet.onClose}
        onDismiss={transcriptSheet.onDismiss}
        title={
          <SheetHeader
            closeAccessibilityLabel={transcriptSheet.hideLabel}
            onClose={transcriptSheet.onClose}
            testID="transcript-sheet-header"
            title={transcriptSheet.titleLabel}
          />
        }
        visible={transcriptSheet.visible}
      >
        <TranscriptPreviewCard
          colors={colors}
          preferredHeight={Math.round(windowHeight * 0.85)}
          presentation="canvas"
          {...transcript}
        />
      </Modal>

      <RoutePickerSheet t={routePickerTranslate} {...routePicker} />
    </>
  );
}

const workspaceStyles = StyleSheet.create({
  ipadShell: {
    alignItems: "stretch",
    flex: 1,
    flexDirection: "row",
    minHeight: 0,
    minWidth: 0,
  },
  ipadContentPane: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
  },
  ipadHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 66,
    paddingBottom: 6,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  ipadHeaderControl: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  ipadRouteSlot: {
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  ipadBody: {
    flex: 1,
    gap: 6,
    minHeight: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ipadStageArea: {
    flex: 1,
    minHeight: 0,
  },
  ipadTranscriptHandle: {
    marginHorizontal: 0,
  },
  ipadTranscriptPane: {
    borderStartWidth: StyleSheet.hairlineWidth,
    flexShrink: 0,
    minHeight: 0,
  },
  ipadTranscriptPaneHeader: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  ipadTranscriptPaneTitle: {
    fontFamily: fonts.headline,
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  ipadTranscriptPaneContent: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  satellites: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  satellitesCompact: {
    alignItems: "center",
    flexShrink: 0,
  },
  satelliteDivider: {
    alignSelf: "stretch",
    marginHorizontal: 6,
    maxHeight: 44,
    width: 1,
  },
  transcriptHandle: {
    marginHorizontal: 0,
  },
  landscapeSettingsControl: {
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
  // A 64pt grab-and-close target around the grip and visible title.
  transcriptSheetCard: {
    gap: 0,
    paddingHorizontal: 18,
    paddingTop: 0,
  },
});
