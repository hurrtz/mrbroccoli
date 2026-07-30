package com.tobiaswinkler.app.mrbroccoli

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.lang.ref.WeakReference

class MrBroccoliVoiceLiveActivityModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
  companion object {
    const val NAME = "MrBroccoliVoiceLiveActivity"
    private const val ACTION_EVENT = "MrBroccoliVoiceRemoteAction"

    @Volatile
    private var listenerCount = 0

    @Volatile
    private var pendingAction: String? = null

    private var reactContextRef =
      WeakReference<ReactApplicationContext>(null)

    internal fun emitRemoteAction(action: String) {
      val context = reactContextRef.get()
      if (
        listenerCount <= 0 ||
        context == null ||
        !context.hasActiveReactInstance()
      ) {
        pendingAction = action
        return
      }

      val payload = Arguments.createMap().apply {
        putString("action", action)
      }
      context
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(ACTION_EVENT, payload)
    }
  }

  init {
    reactContextRef = WeakReference(reactContext)
  }

  override fun getName(): String = NAME

  @ReactMethod
  fun addListener(eventName: String?) {
    listenerCount += 1
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    listenerCount = (listenerCount - count).coerceAtLeast(0)
  }

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

  @ReactMethod
  fun setControls(
    mode: String,
    canRepeat: Boolean,
    phaseLabel: String,
    pauseLabel: String,
    continueLabel: String,
    stopLabel: String,
    repeatLabel: String,
    promise: Promise,
  ) {
    if (!MrBroccoliVoiceTurnControlState.isSupportedMode(mode)) {
      promise.reject(
        "voice_remote_controls_invalid_mode",
        "Unsupported voice remote-control mode: $mode",
      )
      return
    }

    try {
      MrBroccoliVoiceTurnService.setControls(
        context = reactApplicationContext,
        mode = mode,
        canRepeat = canRepeat,
        phaseLabel = phaseLabel.trim(),
        pauseLabel = pauseLabel.trim(),
        continueLabel = continueLabel.trim(),
        stopLabel = stopLabel.trim(),
        repeatLabel = repeatLabel.trim(),
      )
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject(
        "voice_remote_controls_error",
        error.message ?: "Could not update voice remote controls.",
        error,
      )
    }
  }

  @ReactMethod
  fun clearControls(promise: Promise) {
    try {
      MrBroccoliVoiceTurnService.clearControls(reactApplicationContext)
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject(
        "voice_remote_controls_clear_error",
        error.message ?: "Could not clear voice remote controls.",
        error,
      )
    }
  }

  @ReactMethod
  fun consumePendingAction(promise: Promise) {
    val action = pendingAction
    pendingAction = null
    promise.resolve(action)
  }
}
