import React from "react";
import {
  Input,
  Modal,
  PhosphorIcon,
  ScrollView,
  Text,
  View,
  darkColors,
  textStyles,
} from "mrbroccoli";

// Modal renders a real RN Modal overlay whenever `visible` is true, so unlike
// the other design-system previews it paints its own full-bleed backdrop
// (colors.overlay) and dialog card — it needs no app-canvas wrapper of its
// own. Every cell below is `visible` unconditionally, since a card grader
// cannot toggle state; see learnings for the {"cardMode":"single","viewport"}
// override this needs.

// Ported from TranscriptPreviewCard's "correct the transcript" dialog: the
// default `layout="dialog"`, an Input.TextArea body, and a three-action
// footer (Cancel / Save / Save & send with `tone="success"`). Shown mid
// save — the mutually-exclusive disabled/loading state real saves pass
// through.
export const Dialog = () => {
  const [text, setText] = React.useState(
    "The caller wanted to know if the refund lands back on the original card or as store credit, and I told them it depends on how they originally paid.",
  );
  return (
    <Modal
      visible
      transparent
      title="Correct the transcript"
      maskClosable={false}
      onClose={() => {}}
      footer={[
        { text: "Cancel", disabled: true, onPress: () => {} },
        { text: "Save", disabled: true, onPress: () => {} },
        { text: "Save and send", tone: "success", loading: true, onPress: () => {} },
      ]}
    >
      <View style={{ gap: 12 }}>
        <Text style={{ ...textStyles.supporting, color: darkColors.textSecondary }}>
          Edit what Mr Broccoli heard before saving it or sending it as a new reply.
        </Text>
        <Input.TextArea
          rows={5}
          value={text}
          onChangeText={setText}
          // The RN Modal's focus trap auto-focuses the first focusable child
          // on web, which otherwise paints the browser's default blue
          // outline — not a themed color, so it reads as unstyled.
          inputStyle={{ outlineStyle: "none" }}
        />
      </View>
    </Modal>
  );
};

// Ported from PremiumUpgradeModal: `layout="sheet"`, a scrollable benefit
// list, and a wrapping multi-action footer with one action mid-purchase
// (`loading`).
export const Sheet = () => (
  <Modal
    visible
    transparent
    layout="sheet"
    title="Upgrade to premium"
    maskClosable
    onClose={() => {}}
    footer={[
      { text: "Restore purchase", disabled: true, onPress: () => {} },
      { text: "Continue", loading: true, onPress: () => {} },
    ]}
  >
    <ScrollView style={{ maxHeight: 340 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <PhosphorIcon name="thunderbolt" size="feature" color={darkColors.accent} />
        <Text style={{ ...textStyles.sectionTitle, color: darkColors.text }}>Premium</Text>
      </View>
      <Text
        style={{ ...textStyles.body, color: darkColors.textSecondary, marginBottom: 14 }}
      >
        Unlock every response mode, unlimited saved conversations, and priority voice
        models.
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <PhosphorIcon name="redo" size="control" color={darkColors.accent} />
        <Text style={{ ...textStyles.body, color: darkColors.text }}>
          Unlimited response modes
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <PhosphorIcon name="global" size="control" color={darkColors.accent} />
        <Text style={{ ...textStyles.body, color: darkColors.text }}>
          Web search on every provider
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <PhosphorIcon name="folder-open" size="control" color={darkColors.accent} />
        <Text style={{ ...textStyles.body, color: darkColors.text }}>
          Full conversation memory
        </Text>
      </View>
    </ScrollView>
  </Modal>
);

// Ported from AntSettingsInfoButton: the simplest real shape — text-only
// body, a single "Done" footer action, no destructive or multi-action
// branching.
export const InfoSingleAction = () => (
  <Modal
    visible
    transparent
    title="Listen languages"
    maskClosable
    onClose={() => {}}
    footer={[{ text: "Done", onPress: () => {} }]}
  >
    <ScrollView style={{ maxHeight: 200 }}>
      <Text style={{ ...textStyles.body, color: darkColors.textSecondary }}>
        Mr Broccoli only replies out loud in the languages you pick here. Everything else
        still gets a written reply on screen.
      </Text>
    </ScrollView>
  </Modal>
);
