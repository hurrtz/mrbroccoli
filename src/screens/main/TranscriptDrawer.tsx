import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { APP_MODAL_ORIENTATIONS } from "../../constants/layout";
import { IconButton } from "../../design-system/IconButton";
import { TranscriptHandle } from "../../design-system/TranscriptHandle";
import type { Colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import type { Message } from "../../types";
import { TranscriptPreviewCard } from "./TranscriptPreviewCard";
import type { TranslateFn } from "./shared";

type TranscriptProps = Omit<
  React.ComponentProps<typeof TranscriptPreviewCard>,
  "colors" | "layout" | "presentation" | "style"
>;

/** The provenance of the last reply: who answered, and how long ago. */
function getLastReply(messages: Message[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === "assistant" && message.content.trim()) {
      return message;
    }
  }

  return null;
}

/**
 * The transcript, demoted to a drawer that peeks above the bottom edge.
 *
 * **Decision:** it opens *over* the workspace rather than replacing it, so the
 * route and the settings stay visible above it. A conversation you have to
 * leave the workspace to read makes the route you are about to use invisible at
 * the moment you are deciding whether to change it.
 */
export function TranscriptDrawer({
  colors,
  t,
  transcript,
}: {
  colors: Colors;
  t: TranslateFn;
  transcript: TranscriptProps;
}) {
  const [open, setOpen] = React.useState(false);
  const messages = transcript.messages ?? [];
  const lastReply = getLastReply(messages);
  const title = transcript.activeConversationTitle ?? "";

  return (
    <React.Fragment>
      <TranscriptHandle
        copy={{
          accessibilityLabel: t("transcriptHandleLabel", {
            count: messages.length,
          }),
          empty: t("transcriptHandleEmpty"),
          emptyAccessibilityLabel: t("transcriptHandleEmptyLabel"),
        }}
        messageCount={messages.length}
        meta={lastReply?.model ?? undefined}
        onPress={() => setOpen(true)}
        preview={lastReply?.content}
      />

      <Modal
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
        supportedOrientations={APP_MODAL_ORIENTATIONS}
        transparent
        visible={open}
      >
        <View style={styles.root}>
          <Pressable
            accessibilityElementsHidden
            accessibilityLabel={t("dismiss")}
            importantForAccessibility="no-hide-descendants"
            onPress={() => setOpen(false)}
            style={[styles.backdrop, { backgroundColor: colors.overlay }]}
            testID="transcript-drawer-backdrop"
          />
          <SafeAreaView
            accessibilityViewIsModal
            edges={["bottom"]}
            style={[
              styles.sheet,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            testID="transcript-drawer"
          >
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text
                accessibilityRole="header"
                numberOfLines={1}
                style={[styles.title, { color: colors.text }]}
              >
                {title}
              </Text>
              <IconButton
                accessibilityLabel={t("hide")}
                icon="close"
                onPress={() => setOpen(false)}
                testID="transcript-drawer-close"
              />
            </View>
            <TranscriptPreviewCard
              colors={colors}
              presentation="canvas"
              style={styles.transcript}
              {...transcript}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill },
  header: {
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  root: { flex: 1, justifyContent: "flex-end" },
  // Not the full height: the route and the settings stay visible above it.
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    height: "85%",
    overflow: "hidden",
  },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    minWidth: 0,
  },
  transcript: { flex: 1 },
});
