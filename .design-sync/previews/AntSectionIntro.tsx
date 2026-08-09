import React from "react";
import { AntSectionIntro, IconButton, View, darkColors } from "mrbroccoli";

// AntSectionIntro is the heading above a group of cards, always over the app
// canvas — see styles.pageStack / styles.sectionGroup in every settings page.
const Canvas = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      width: "100%",
      maxWidth: 520,
    }}
  >
    {children}
  </View>
);

// Canonical, bare use: ListeningSettingsPage.tsx opens the page with just a
// title, no description or extra.
export const TitleOnly = () => (
  <Canvas>
    <AntSectionIntro title="Voice Input" />
  </Canvas>
);

// With description: DataPrivacyKnowledgeSections.tsx's
// PastConversationKnowledgeSection — title plus explanatory copy underneath,
// no extra.
export const WithDescription = () => (
  <Canvas>
    <AntSectionIntro
      title="Past conversation knowledge"
      description="Let new conversations recall relevant parts of earlier sessions."
    />
  </Canvas>
);

// With extra: ThinkingSettingsPage.tsx's "Model Selection" header — an info
// action next to the title, no description.
export const WithExtra = () => (
  <Canvas>
    <AntSectionIntro
      title="Model Selection"
      extra={
        <IconButton
          accessibilityLabel="About model selection"
          icon="info-circle"
          onPress={() => {}}
        />
      }
    />
  </Canvas>
);

// Multiple actions in extra: AppSettingsPage.tsx's speech-diagnostics header
// pairs an info action with a conditional destructive "clear" action in the
// same slot.
export const WithMultipleActions = () => (
  <Canvas>
    <AntSectionIntro
      title="Recent Speech Activity"
      extra={
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <IconButton
            accessibilityLabel="About Recent Speech Activity"
            icon="info-circle"
            onPress={() => {}}
          />
          <IconButton
            accessibilityLabel="Clear recent speech activity"
            icon="delete"
            iconColor={darkColors.danger}
            onPress={() => {}}
          />
        </View>
      }
    />
  </Canvas>
);
