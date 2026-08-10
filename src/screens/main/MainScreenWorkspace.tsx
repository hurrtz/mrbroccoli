import React from "react";
import { View } from "react-native";

import { IntroBanner } from "../../components/IntroBanner";
import type { Colors } from "../../theme/colors";
import { MainScreenRouteCard } from "./MainScreenRouteCard";
import { MainScreenRouteControls } from "./MainScreenRouteControls";
import { MainScreenTopBar } from "./MainScreenTopBar";
import { MainScreenVoiceStage } from "./MainScreenVoiceStage";
import { TranscriptDrawer } from "./TranscriptDrawer";
import { TranscriptPreviewCard } from "./TranscriptPreviewCard";
import { styles } from "./styles";

interface MainScreenWorkspaceProps {
  colors: Colors;
  introBanner: React.ComponentProps<typeof IntroBanner>;
  isLandscape: boolean;
  routeCard: Omit<
    React.ComponentProps<typeof MainScreenRouteCard>,
    "colors" | "compact" | "style"
  >;
  routeControls: Omit<
    React.ComponentProps<typeof MainScreenRouteControls>,
    "colors" | "layout"
  >;
  topBar: Omit<
    React.ComponentProps<typeof MainScreenTopBar>,
    "colors"
  >;
  transcript: Omit<
    React.ComponentProps<typeof TranscriptPreviewCard>,
    "colors" | "layout" | "presentation" | "style"
  >;
  voiceStage: Omit<
    React.ComponentProps<typeof MainScreenVoiceStage>,
    "colors" | "layout"
  >;
}

export function MainScreenWorkspace({
  colors,
  introBanner,
  isLandscape,
  routeCard,
  routeControls,
  topBar,
  transcript,
  voiceStage,
}: MainScreenWorkspaceProps) {
  const {
    debugLogActive: _debugLogActive,
    debugLogLabel: _debugLogLabel,
    onToggleDebugLog: _onToggleDebugLog,
    ...landscapeTopBar
  } = topBar;

  if (isLandscape) {
    return (
      <View style={styles.landscapeShell}>
        <View
          testID="landscape-left-pane"
          style={styles.landscapeLeftColumn}
        >
          <MainScreenTopBar colors={colors} {...landscapeTopBar} />
          <IntroBanner {...introBanner} />

          <MainScreenRouteCard
            colors={colors}
            compact
            style={styles.heroCardLandscape}
            {...routeCard}
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
              {...voiceStage}
            />
            <MainScreenRouteControls
              colors={colors}
              layout="landscape"
              {...routeControls}
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

        <View
          testID="landscape-right-pane"
          style={styles.landscapeRightColumn}
        >
          <TranscriptPreviewCard
            colors={colors}
            layout="landscape"
            style={styles.landscapeTranscriptCard}
            {...transcript}
          />
        </View>
      </View>
    );
  }

  return (
    <>
      <MainScreenTopBar colors={colors} {...topBar} />

      <View style={styles.workspaceBody}>
        <IntroBanner {...introBanner} />
        <MainScreenRouteCard colors={colors} {...routeCard} />

        <View
          testID="portrait-conversation-stack"
          style={styles.portraitConversationStack}
        >
          <View testID="portrait-input-section">
            <MainScreenVoiceStage colors={colors} {...voiceStage} />
            {/* Below the control it modifies: it changes how the next turn is
                answered, so it reads as a note on that action rather than as a
                setting the user must pass through first. */}
            <MainScreenRouteControls colors={colors} {...routeControls} />
          </View>

        </View>
      </View>

      {/* Flush to the bottom edge with no side padding, so it reads as a drawer
          to pull rather than a card floating above one. */}
      <TranscriptDrawer colors={colors} t={transcript.t} transcript={transcript} />
    </>
  );
}
