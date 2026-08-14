import { useEffect } from "react";

import type { PipelinePhase, ReplayPhase } from "../../hooks/useVoicePipeline";
import {
  installDebugLogConsoleCapture,
  recordDebugLogEvent,
} from "../../services/debugLogCapture";
import type {
  AssistantResponseLength,
  AssistantResponseTone,
  InputMode,
  Provider,
  ReplyPlayback,
  ResponseMode,
  SttBackendMode,
  TtsBackendMode,
  VoiceVisualPhase,
} from "../../types";

interface MainScreenDiagnosticsState {
  activeConversationId: string | null;
  activeConversationTitle: string | null;
  activeReplayMessageId: string | null;
  activeResponseMode: ResponseMode;
  conversationCount: number;
  drawerVisible: boolean;
  inputMode: InputMode;
  isRecording: boolean;
  loaded: boolean;
  messageCount: number;
  model: string;
  modelEffort?: string;
  pipelinePhase: PipelinePhase;
  playerIsPlaying: boolean;
  provider: Provider;
  replayPhase: ReplayPhase;
  replyPlayback: ReplyPlayback;
  responseLength: AssistantResponseLength;
  responseTone: AssistantResponseTone;
  settingsFocusCatalogProviderId: string | null;
  settingsVisible: boolean;
  spokenRepliesEnabled: boolean;
  statusDetailsVisible: boolean;
  sttMode: SttBackendMode;
  sttProvider: Provider | null;
  ttsMode: TtsBackendMode;
  ttsProvider: Provider | null;
  visualPhase: VoiceVisualPhase;
}

export function useMainScreenDiagnostics(state: MainScreenDiagnosticsState) {
  useEffect(() => {
    if (__DEV__) {
      installDebugLogConsoleCapture();
    }

    recordDebugLogEvent({ event: "main-screen-mounted" });
    return () => recordDebugLogEvent({ event: "main-screen-unmounted" });
  }, []);

  useEffect(() => {
    recordDebugLogEvent({
      event: "main-screen-loaded-state-changed",
      payload: { loaded: state.loaded },
    });
  }, [state.loaded]);

  useEffect(() => {
    recordDebugLogEvent({
      event: "route-selection-changed",
      payload: {
        activeResponseMode: state.activeResponseMode,
        inputMode: state.inputMode,
        model: state.model,
        modelEffort: state.modelEffort ?? null,
        provider: state.provider,
        replyPlayback: state.replyPlayback,
        responseLength: state.responseLength,
        responseTone: state.responseTone,
        spokenRepliesEnabled: state.spokenRepliesEnabled,
        sttMode: state.sttMode,
        sttProvider: state.sttProvider,
        ttsMode: state.ttsMode,
        ttsProvider: state.ttsProvider,
      },
    });
  }, [
    state.activeResponseMode,
    state.inputMode,
    state.model,
    state.modelEffort,
    state.provider,
    state.replyPlayback,
    state.responseLength,
    state.responseTone,
    state.spokenRepliesEnabled,
    state.sttMode,
    state.sttProvider,
    state.ttsMode,
    state.ttsProvider,
  ]);

  useEffect(() => {
    recordDebugLogEvent({
      event: "pipeline-phase-changed",
      payload: { pipelinePhase: state.pipelinePhase },
    });
  }, [state.pipelinePhase]);

  useEffect(() => {
    recordDebugLogEvent({
      event: "visual-phase-changed",
      payload: { visualPhase: state.visualPhase },
    });
  }, [state.visualPhase]);

  useEffect(() => {
    recordDebugLogEvent({
      event: "recording-state-changed",
      payload: { isRecording: state.isRecording, sttMode: state.sttMode },
    });
  }, [state.isRecording, state.sttMode]);

  useEffect(() => {
    recordDebugLogEvent({
      event: "audio-playback-state-changed",
      payload: {
        activeReplayMessageId: state.activeReplayMessageId,
        isPlaying: state.playerIsPlaying,
        replayPhase: state.replayPhase,
      },
    });
  }, [state.activeReplayMessageId, state.playerIsPlaying, state.replayPhase]);

  useEffect(() => {
    recordDebugLogEvent({
      event: "active-conversation-changed",
      payload: {
        conversationCount: state.conversationCount,
        id: state.activeConversationId,
        title: state.activeConversationTitle,
      },
    });
  }, [
    state.activeConversationId,
    state.activeConversationTitle,
    state.conversationCount,
  ]);

  useEffect(() => {
    recordDebugLogEvent({
      event: "message-count-changed",
      payload: { count: state.messageCount },
    });
  }, [state.messageCount]);

  useEffect(() => {
    recordDebugLogEvent({
      event: "settings-visibility-changed",
      payload: {
        focusCatalogProviderId: state.settingsFocusCatalogProviderId,
        visible: state.settingsVisible,
      },
    });
  }, [state.settingsFocusCatalogProviderId, state.settingsVisible]);

  useEffect(() => {
    recordDebugLogEvent({
      event: "drawer-visibility-changed",
      payload: { visible: state.drawerVisible },
    });
  }, [state.drawerVisible]);

  useEffect(() => {
    recordDebugLogEvent({
      event: "status-details-visibility-changed",
      payload: { visible: state.statusDetailsVisible },
    });
  }, [state.statusDetailsVisible]);

}
