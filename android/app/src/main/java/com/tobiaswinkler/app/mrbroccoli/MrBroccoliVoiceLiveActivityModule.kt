package com.tobiaswinkler.app.mrbroccoli

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MrBroccoliVoiceLiveActivityModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
  companion object {
    const val NAME = "MrBroccoliVoiceLiveActivity"
  }

  override fun getName(): String = NAME

  @ReactMethod
  fun setState(
    phase: String,
    expectedSpeechAtMs: Double?,
    phaseLabel: String,
    statusLabel: String,
    promise: Promise,
  ) {
    if (!MrBroccoliVoiceTurnState.isSupportedPhase(phase)) {
      promise.reject(
        "voice_turn_status_invalid_phase",
        "Unsupported voice-turn phase: $phase",
      )
      return
    }

    try {
      MrBroccoliVoiceTurnService.setState(
        context = reactApplicationContext,
        phase = phase,
        expectedSpeechAtMs = expectedSpeechAtMs
          ?.takeIf(Double::isFinite)
          ?.toLong(),
        phaseLabel = phaseLabel.trim(),
        statusLabel = statusLabel.trim(),
      )
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject(
        "voice_turn_status_error",
        error.message ?: "Could not update voice-turn status.",
        error,
      )
    }
  }

  @ReactMethod
  fun endActivity(promise: Promise) {
    try {
      MrBroccoliVoiceTurnService.end(reactApplicationContext)
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject(
        "voice_turn_status_end_error",
        error.message ?: "Could not end voice-turn status.",
        error,
      )
    }
  }
}
