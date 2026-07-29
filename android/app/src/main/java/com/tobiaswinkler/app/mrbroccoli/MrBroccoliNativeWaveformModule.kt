package com.tobiaswinkler.app.mrbroccoli

import android.media.MediaPlayer
import android.media.MediaRecorder
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.File
import kotlin.math.log10

class MrBroccoliNativeWaveformModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
  companion object {
    const val NAME = "MrBroccoliNativeWaveform"
    private const val EVENT_NAME = "MrBroccoliNativeWaveformEvent"
  }

  private val lock = Any()
  private val mainHandler = Handler(Looper.getMainLooper())

  private var recorder: MediaRecorder? = null
  private var activeSessionId: String? = null
  private var activeOutputFile: File? = null
  private var levelRunnable: Runnable? = null

  override fun getName(): String = NAME

  @ReactMethod
  fun addListener(eventName: String?) = Unit

  @ReactMethod
  fun removeListeners(count: Int) = Unit

  @ReactMethod
  fun startRecording(sessionId: String, outputUri: String?, promise: Promise) {
    synchronized(lock) {
      if (sessionId.isBlank()) {
        promise.reject(
          "native_waveform_record_error",
          "sessionId is required.",
        )
        return
      }

      if (recorder != null || activeSessionId != null) {
        promise.reject(
          "native_waveform_record_error",
          "Another native waveform recording session is already active.",
        )
        return
      }

      try {
        val outputFile = resolveOutputFile(outputUri)
        outputFile.parentFile?.mkdirs()

        val nextRecorder =
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            MediaRecorder(reactApplicationContext)
          } else {
            @Suppress("DEPRECATION")
            MediaRecorder()
          }

        configureRecorder(nextRecorder, outputFile)
        nextRecorder.prepare()
        nextRecorder.start()

        recorder = nextRecorder
        activeSessionId = sessionId
        activeOutputFile = outputFile
        startLevelUpdatesLocked(sessionId, nextRecorder)
        emitLifecycleEvent(
          type = "started",
          sessionId = sessionId,
          file = outputFile,
        )
        promise.resolve(createUriResult(outputFile))
      } catch (error: Exception) {
        cleanupRecorderLocked(deleteOutput = true)
        emitErrorEvent(
          sessionId = sessionId,
          message =
            error.message ?: "The native waveform recorder could not be started.",
        )
        promise.reject(
          "native_waveform_record_error",
          error.message ?: "The native waveform recorder could not be started.",
          error,
        )
      }
    }
  }

  @ReactMethod
  fun stopRecording(sessionId: String, promise: Promise) {
    synchronized(lock) {
      val currentRecorder = recorder
      val currentSessionId = activeSessionId
      val outputFile = activeOutputFile

      if (
        currentRecorder == null ||
        currentSessionId == null ||
        outputFile == null ||
        currentSessionId != sessionId
      ) {
        promise.reject(
          "native_waveform_record_error",
          "No active recording session matches the requested sessionId.",
        )
        return
      }

      try {
        currentRecorder.stop()
        currentRecorder.reset()
        currentRecorder.release()

        recorder = null
        activeSessionId = null
        activeOutputFile = null
        emitLifecycleEvent(
          type = "stopped",
          sessionId = sessionId,
          file = outputFile,
        )
        promise.resolve(createUriResult(outputFile))
      } catch (error: RuntimeException) {
        cleanupRecorderLocked(deleteOutput = true)
        emitErrorEvent(
          sessionId = sessionId,
          message = "The recording was too short to be processed.",
        )
        promise.reject(
          "native_waveform_record_error",
          "The recording was too short to be processed.",
          error,
        )
      } catch (error: Exception) {
        cleanupRecorderLocked(deleteOutput = true)
        emitErrorEvent(
          sessionId = sessionId,
          message =
            error.message ?: "The native waveform recorder could not be stopped.",
        )
        promise.reject(
          "native_waveform_record_error",
          error.message ?: "The native waveform recorder could not be stopped.",
          error,
        )
      }
    }
  }

  @ReactMethod
  fun cancelRecording(sessionId: String, promise: Promise) {
    synchronized(lock) {
      if (recorder == null || activeSessionId == null || activeSessionId != sessionId) {
        promise.resolve(false)
        return
      }

      cleanupRecorderLocked(deleteOutput = true)
      emitLifecycleEvent(type = "cancelled", sessionId = sessionId)
      promise.resolve(true)
    }
  }

  @ReactMethod
  fun playRecordingCue(uri: String, promise: Promise) {
    mainHandler.post {
      try {
        val parsed = Uri.parse(uri)
        val path = if (parsed.scheme == "file") parsed.path else uri
        require(!path.isNullOrBlank()) {
          "The recording cue URI is invalid."
        }

        val player = MediaPlayer()
        player.setDataSource(path)
        player.setVolume(1f, 1f)
        player.setOnCompletionListener { completed ->
          completed.release()
        }
        player.setOnErrorListener { failed, _, _ ->
          failed.release()
          true
        }
        player.prepare()
        player.start()
        promise.resolve(true)
      } catch (error: Exception) {
        promise.reject(
          "native_waveform_cue_error",
          error.message ?: "The recording cue could not be played.",
          error,
        )
      }
    }
  }

  override fun invalidate() {
    synchronized(lock) {
      cleanupRecorderLocked(deleteOutput = true)
    }
    super.invalidate()
  }

  private fun configureRecorder(recorder: MediaRecorder, outputFile: File) {
    recorder.setAudioSource(MediaRecorder.AudioSource.MIC)
    recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
    recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
    recorder.setAudioChannels(1)
    recorder.setAudioSamplingRate(16_000)
    recorder.setAudioEncodingBitRate(64_000)
    recorder.setOutputFile(outputFile.absolutePath)
  }

  private fun resolveOutputFile(outputUri: String?): File {
    if (!outputUri.isNullOrBlank()) {
      val parsed = Uri.parse(outputUri)
      val path =
        if (parsed.scheme == "file") {
          parsed.path
        } else {
          outputUri
        }

      if (!path.isNullOrBlank()) {
        return File(path)
      }
    }

    val fileName = "native-waveform-${System.currentTimeMillis()}.m4a"
    return File(reactApplicationContext.cacheDir, fileName)
  }

  private fun cleanupRecorderLocked(deleteOutput: Boolean) {
    val currentRecorder = recorder
    val outputFile = activeOutputFile

    recorder = null
    activeSessionId = null
    activeOutputFile = null
    stopLevelUpdatesLocked()

    if (currentRecorder != null) {
      try {
        currentRecorder.stop()
      } catch (_: RuntimeException) {
      } catch (_: IllegalStateException) {
      }

      try {
        currentRecorder.reset()
      } catch (_: RuntimeException) {
      } catch (_: IllegalStateException) {
      }

      try {
        currentRecorder.release()
      } catch (_: RuntimeException) {
      }
    }

    if (deleteOutput) {
      outputFile?.delete()
    }
  }

  private fun startLevelUpdatesLocked(
    sessionId: String,
    activeRecorder: MediaRecorder,
  ) {
    stopLevelUpdatesLocked()

    val runnable = object : Runnable {
      override fun run() {
        val metering = synchronized(lock) {
          if (
            recorder !== activeRecorder ||
            activeSessionId != sessionId
          ) {
            null
          } else {
            val amplitude =
              try {
                activeRecorder.maxAmplitude
              } catch (_: RuntimeException) {
                0
              }

            if (amplitude <= 0) {
              -160.0
            } else {
              (20.0 * log10(amplitude.toDouble() / 32_767.0))
                .coerceIn(-160.0, 0.0)
            }
          }
        }

        if (metering != null) {
          emitLevelEvent(sessionId, metering)
          mainHandler.postDelayed(this, 150)
        }
      }
    }

    levelRunnable = runnable
    mainHandler.post(runnable)
  }

  private fun stopLevelUpdatesLocked() {
    levelRunnable?.let(mainHandler::removeCallbacks)
    levelRunnable = null
  }

  private fun emitLifecycleEvent(type: String, sessionId: String, file: File? = null) {
    val payload = Arguments.createMap().apply {
      putString("type", type)
      putString("sessionId", sessionId)
      if (file != null) {
        putString("uri", Uri.fromFile(file).toString())
      } else {
        putNull("uri")
      }
    }

    emitEvent(payload)
  }

  private fun emitErrorEvent(sessionId: String, message: String) {
    val payload = Arguments.createMap().apply {
      putString("type", "error")
      putString("sessionId", sessionId)
      putString("message", message)
    }

    emitEvent(payload)
  }

  private fun emitLevelEvent(sessionId: String, metering: Double) {
    val payload = Arguments.createMap().apply {
      putString("type", "levels")
      putString("sessionId", sessionId)
      putDouble("metering", metering)
    }

    emitEvent(payload)
  }

  private fun createUriResult(file: File): WritableMap =
    Arguments.createMap().apply {
      putString("uri", Uri.fromFile(file).toString())
    }

  private fun emitEvent(payload: WritableMap) {
    val reactContext = getReactApplicationContextIfActiveOrWarn() ?: return
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(EVENT_NAME, payload)
  }
}
