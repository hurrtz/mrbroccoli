import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { IntroBanner } from "../../components/IntroBanner";
import { BackgroundTaskBar } from "../../design-system/BackgroundTaskBar";
import { ConversationSettingsSummary } from "../../design-system/ConversationSettingsSummary";
import { OrbSatellite } from "../../design-system/OrbSatellite";
import { TranscriptHandle } from "../../design-system/TranscriptHandle";
import { WorkspaceStatusLine } from "../../design-system/WorkspaceStatusLine";
import { Modal } from "../../design-system/NativeControls";
import type { Colors } from "../../theme/colors";
import type { Message, VoiceVisualPhase } from "../../types";
import { MainScreenRouteCard } from "./MainScreenRouteCard";
import { MainScreenTopBar } from "./MainScreenTopBar";
import { MainScreenVoiceStage } from "./MainScreenVoiceStage";
import { RoutePickerSheet } from "./RoutePickerSheet";
import { TranscriptPreviewCard } from "./TranscriptPreviewCard";
import type { InputSurface } from "./VoiceTextInputPager";
import type { TranslateFn } from "./shared";
import { styles } from "./styles";

interface WorkspaceSatellitesProps {
  colors: Colors;
  compact?: boolean;
  councilActive: boolean;
  councilAvailable: boolean;
  disabled: boolean;
  imageAvailable: boolean;
  imageDisabled: boolean;
  onAddImage?: () => void;
  onInterruptPlayback?: () => void;
  onStopPlayback: () => void;
  onToggleCouncil?: () => void;
  onToggleWeb?: () => void;
  speaking: boolean;
  t: TranslateFn;
  webActive: boolean;
  webAvailable: boolean;
}

/**
 * The row of small labelled controls under the orb: attach an image, and the
 * two per-question switches. During speech it also carries the stop and
 * barge-in actions the docked bar used to own, because the orb has one press.
 */
function WorkspaceSatellites({
  colors,
  compact = false,
  councilActive,
  councilAvailable,
  disabled,
  imageAvailable,
  imageDisabled,
  onAddImage,
  onInterruptPlayback,
  onStopPlayback,
  onToggleCouncil,
  onToggleWeb,
  speaking,
  t,
  webActive,
  webAvailable,
}: WorkspaceSatellitesProps) {
  const showToggles = councilAvailable || webAvailable;
  const divider = (
    <View
      style={[
        workspaceStyles.satelliteDivider,
        { backgroundColor: colors.border },
      ]}
    />
  );

  return (
    <View
      style={[
        workspaceStyles.satellites,
        compact ? workspaceStyles.satellitesCompact : null,
      ]}
      testID="workspace-satellites"
    >
      {imageAvailable ? (
        <OrbSatellite
          accessibilityLabel={t("addImage")}
          compact={compact}
          disabled={imageDisabled}
          icon="image"
          label={t("workspaceImageLabel")}
          onPress={onAddImage}
          testID="satellite-image"
        />
      ) : null}
      {imageAvailable && showToggles ? divider : null}
      {councilAvailable ? (
        <OrbSatellite
          accessibilityLabel={t("ulraMode")}
          active={councilActive}
          compact={compact}
          disabled={disabled}
          icon="council"
          kind="toggle"
          label={t("workspaceCouncilLabel")}
          onPress={onToggleCouncil}
          testID="satellite-council"
        />
      ) : null}
      {webAvailable ? (
        <OrbSatellite
          accessibilityLabel={t("webSearch")}
          active={webActive}
          compact={compact}
          disabled={disabled}
          icon="search"
          kind="toggle"
          label={t("workspaceWebLabel")}
          onPress={onToggleWeb}
          testID="satellite-web"
        />
      ) : null}
      {speaking ? (
        <>
          {imageAvailable || showToggles ? divider : null}
          <OrbSatellite
            accessibilityLabel={t("stop")}
            compact={compact}
            icon="stop"
            label={t("stop")}
            onPress={onStopPlayback}
            testID="satellite-stop"
          />
          {onInterruptPlayback ? (
            <OrbSatellite
              accessibilityLabel={t("tapToSpeak")}
              compact={compact}
              icon="mic"
              label={t("tapToSpeak")}
              onPress={onInterruptPlayback}
              testID="satellite-interrupt"
            />
          ) : null}
        </>
      ) : null}
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
  isLandscape: boolean;
  routeCard: Omit<React.ComponentProps<typeof MainScreenRouteCard>, "style"> & {
    t: TranslateFn;
  };
  routePicker: Omit<React.ComponentProps<typeof RoutePickerSheet>, "t">;
  satellites: Omit<WorkspaceSatellitesProps, "colors" | "compact" | "speaking">;
  settingsSummary: {
    accessibilityLabel: string;
    onPress: () => void;
    summary: string;
  };
  statusLine: {
    detailIdle: string;
    detailActive: string;
    onInfo: () => void;
    sessionDetailsLabel: string;
    titleActive: string;
    titleIdleText: string;
    titleIdleVoice: string;
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
    onOpen: () => void;
    showLabel: string;
    title: string;
    visible: boolean;
  };
  visualPhase: VoiceVisualPhase;
  voiceStage: Omit<
    React.ComponentProps<typeof MainScreenVoiceStage>,
    "colors" | "layout" | "maxOrbSize"
  >;
}

function getLastAssistantMessage(messages: Message[]): Message | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === "assistant" && message.content.trim()) {
      return message;
    }
  }
  return null;
}

export function MainScreenWorkspace({
  backgroundTask,
  colors,
  introBanner,
  isLandscape,
  routeCard,
  routePicker,
  satellites,
  settingsSummary,
  statusLine,
  topBar,
  transcript,
  transcriptSheet,
  visualPhase,
  voiceStage,
}: MainScreenWorkspaceProps) {
  const { height: windowHeight } = useWindowDimensions();
  const [surface, setSurface] = React.useState<InputSurface>(
    voiceStage.initialInputSurface ?? "voice",
  );
  const onInputSurfaceChange = voiceStage.onInputSurfaceChange;
  const handleSurfaceChange = React.useCallback(
    (nextSurface: InputSurface) => {
      setSurface(nextSurface);
      onInputSurfaceChange?.(nextSurface);
    },
    [onInputSurfaceChange],
  );

  const isActive = visualPhase !== "idle";
  const speaking = visualPhase === "speaking";
  const lastAssistant = getLastAssistantMessage(transcript.messages);
  const messageCount = transcript.messages.length;
  // The accessible name always states the real count, from the same list
  // that decides the empty state.
  const handleAccessibilityLabel = `${transcriptSheet.showLabel}. ${
    messageCount > 0 && transcriptSheet.countLabel
      ? transcriptSheet.countLabel
      : transcriptSheet.emptyLabel
  }`;

  const statusTitle = isActive
    ? statusLine.titleActive
    : surface === "text"
      ? statusLine.titleIdleText
      : statusLine.titleIdleVoice;
  const statusDetail = isActive
    ? statusLine.detailActive
    : statusLine.detailIdle;

  const {
    debugLogActive: _debugLogActive,
    debugLogLabel: _debugLogLabel,
    onToggleDebugLog: _onToggleDebugLog,
    ...landscapeTopBar
  } = topBar;
  const { t: routePickerTranslate, ...routeCardProps } = routeCard;

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
          <ConversationSettingsSummary
            accessibilityLabel={settingsSummary.accessibilityLabel}
            onPress={settingsSummary.onPress}
            summary={settingsSummary.summary}
            testID="conversation-settings-summary"
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
            <MainScreenVoiceStage
              colors={colors}
              layout="landscape"
              maxOrbSize={150}
              {...voiceStage}
              onInputSurfaceChange={handleSurfaceChange}
            />
            <WorkspaceSatellites
              colors={colors}
              compact
              speaking={speaking}
              {...satellites}
            />
          </View>

          <WorkspaceStatusLine
            detail={statusDetail}
            info={{
              accessibilityLabel: statusLine.sessionDetailsLabel,
              onPress: statusLine.onInfo,
            }}
            phase={visualPhase}
            testID="workspace-status-line"
            title={statusTitle}
          />
        </View>

        <View
          testID="landscape-pane-divider"
          style={[
            styles.landscapePaneDivider,
            { backgroundColor: colors.border },
          ]}
        />

        <View testID="landscape-right-pane" style={styles.landscapeRightColumn}>
          <IntroBanner {...introBanner} />
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
        <IntroBanner {...introBanner} />
        {backgroundTask ? <BackgroundTaskBar {...backgroundTask} /> : null}
        <MainScreenRouteCard {...routeCardProps} />
        <ConversationSettingsSummary
          accessibilityLabel={settingsSummary.accessibilityLabel}
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
              maxOrbSize={196}
              {...voiceStage}
              onInputSurfaceChange={handleSurfaceChange}
            />
            <WorkspaceSatellites
              colors={colors}
              speaking={speaking}
              {...satellites}
            />
          </View>

          <WorkspaceStatusLine
            detail={statusDetail}
            info={{
              accessibilityLabel: statusLine.sessionDetailsLabel,
              onPress: statusLine.onInfo,
            }}
            phase={visualPhase}
            testID="workspace-status-line"
            title={statusTitle}
          />
        </View>
      </View>

      <TranscriptHandle
        accessibilityLabel={handleAccessibilityLabel}
        emptyLabel={transcriptSheet.emptyLabel}
        messageCount={messageCount}
        meta={lastAssistant?.model ?? undefined}
        onPress={transcriptSheet.onOpen}
        preview={lastAssistant?.content.trim()}
        style={workspaceStyles.transcriptHandle}
        testID="transcript-handle"
      />

      <Modal
        footer={[
          { text: transcriptSheet.hideLabel, onPress: transcriptSheet.onClose },
        ]}
        layout="sheet"
        onClose={transcriptSheet.onClose}
        title={transcriptSheet.title}
        visible={transcriptSheet.visible}
      >
        <TranscriptPreviewCard
          colors={colors}
          preferredHeight={Math.round(windowHeight * 0.6)}
          presentation="card"
          {...transcript}
        />
      </Modal>

      <RoutePickerSheet t={routePickerTranslate} {...routePicker} />
    </>
  );
}

const workspaceStyles = StyleSheet.create({
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
});
