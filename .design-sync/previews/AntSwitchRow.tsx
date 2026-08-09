import React from "react";
import {
  AntSectionIntro,
  AntSettingsCard,
  AntSwitchRow,
  Text,
  View,
  darkColors,
  fonts,
} from "mrbroccoli";

// Every real call site (SpeakingSettingsPage, ThinkingSettingsPage,
// DataPrivacyKnowledgeSections) puts AntSwitchRow inside an AntSettingsCard on
// the app canvas — a bare switch on the white preview page has no surface to
// read against and the native Switch track colours disappear.
const Canvas = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      width: "100%",
      maxWidth: 520,
      gap: 16,
    }}
  >
    {children}
  </View>
);

const helperText = {
  fontFamily: fonts.body,
  fontSize: 13,
  lineHeight: 19,
} as const;

// Canonical use: a single switch, no description, under a section intro —
// matches SpeakingSettingsPage's "Voice Output" > "Spoken Replies" row.
export const SpokenRepliesOn = () => (
  <Canvas>
    <AntSectionIntro title="Voice Output" />
    <AntSettingsCard>
      <AntSwitchRow label="Spoken Replies" value={true} onChange={() => {}} />
    </AntSettingsCard>
  </Canvas>
);

// On, with a description line — ThinkingSettingsPage's Model Council toggle.
export const ModelCouncilOnWithDescription = () => (
  <Canvas>
    <AntSettingsCard>
      <AntSwitchRow
        label="Show Model Council on the home screen"
        description="Allow multi-model deliberation when at least two home-screen models are ready."
        value={true}
        onChange={() => {}}
      />
    </AntSettingsCard>
  </Canvas>
);

// Off, with a description and a trailing disclosure line in the same card —
// matches DataPrivacyKnowledgeSections' past-conversation-knowledge toggle.
export const PastConversationKnowledgeOff = () => (
  <Canvas>
    <AntSettingsCard>
      <AntSwitchRow
        label="Use past conversation knowledge"
        description="Builds a derived local index and retrieves a few relevant excerpts for each request."
        value={false}
        onChange={() => {}}
      />
      <Text style={[helperText, { color: darkColors.textMuted }]}>
        Indexing and retrieval stay on this device. Retrieved excerpts are
        sent to the model provider with your request. Turning this off
        deletes the derived index.
      </Text>
    </AntSettingsCard>
  </Canvas>
);
