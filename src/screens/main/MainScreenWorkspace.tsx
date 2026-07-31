import React from "react";
import { View } from "react-native";

import type { Colors } from "../../theme/colors";
import { MainScreenRouteCard } from "./MainScreenRouteCard";
import { MainScreenRouteControls } from "./MainScreenRouteControls";
import { MainScreenTopBar } from "./MainScreenTopBar";
import { MainScreenVoiceStage } from "./MainScreenVoiceStage";
import { TranscriptPreviewCard } from "./TranscriptPreviewCard";
import { styles } from "./styles";

interface MainScreenWorkspaceProps {
  colors: Colors;
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

          <MainScreenRouteCard
            colors={colors}
            compact
            style={styles.heroCardLandscape}
            {...routeCard}
          />

          <MainScreenRouteControls
            colors={colors}
            layout="landscape"
            {...routeControls}
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
        <MainScreenRouteCard colors={colors} {...routeCard} />

        <MainScreenRouteControls colors={colors} {...routeControls} />

        <View
          testID="portrait-conversation-stack"
          style={styles.portraitConversationStack}
        >
          <View testID="portrait-input-section">
            <MainScreenVoiceStage colors={colors} {...voiceStage} />
          </View>

          <View
            testID="portrait-transcript-pane"
            style={styles.portraitTranscriptPane}
          >
            <TranscriptPreviewCard
              colors={colors}
              presentation="canvas"
              style={styles.workspaceTranscript}
              {...transcript}
            />
          </View>
        </View>
      </View>
    </>
  );
}
