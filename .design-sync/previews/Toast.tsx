import React from "react";
import { Toast, View, darkColors } from "mrbroccoli";

// Real messages/tones are ported from actual showToast() call sites:
// - info (default tone):  useConversationActions.ts -> "Nothing to copy yet."
// - success:               useConversationActions.ts -> "Conversation memory cleared."
// - danger + retry:        createVoicePipelineErrorHandlers.ts handleNoTranscription
//                           -> "Couldn't catch that, try again." (no auto-dismiss
//                           timer runs while onRetry is set, so this stays put)
// - danger, long message:  usePersistenceFailureAlert.ts -> persistenceFailure
//
// Toast positions itself with `position: "absolute", top: 60, left/right: 16"`,
// which only lays out correctly against a sized, positioned ancestor -- an
// unsized wrapper collapses to nothing since the toast is out of flow. The
// canvas below fixes a height for that reason. Cells with no onRetry get a
// long `duration` so the real 4s auto-dismiss timer can't race the capture.
const Canvas = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      width: "100%",
      maxWidth: 480,
      height: 190,
    }}
  >
    {children}
  </View>
);

export const Info = () => (
  <Canvas>
    <Toast
      message="Nothing to copy yet."
      visible
      onDismiss={() => {}}
      duration={60_000}
    />
  </Canvas>
);

export const Success = () => (
  <Canvas>
    <Toast
      message="Conversation memory cleared."
      visible
      onDismiss={() => {}}
      tone="success"
      duration={60_000}
    />
  </Canvas>
);

export const DangerWithRetry = () => (
  <Canvas>
    <Toast
      message="Couldn't catch that, try again."
      visible
      onDismiss={() => {}}
      onRetry={() => {}}
      tone="danger"
    />
  </Canvas>
);

export const LongMessageDanger = () => (
  <Canvas>
    <Toast
      message="Mr Broccoli couldn't save data on this device. Keep the app open and try again; recent changes may be lost after restart."
      visible
      onDismiss={() => {}}
      tone="danger"
      duration={60_000}
    />
  </Canvas>
);
