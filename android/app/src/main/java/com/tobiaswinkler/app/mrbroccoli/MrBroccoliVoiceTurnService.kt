package com.tobiaswinkler.app.mrbroccoli

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.graphics.Color
import android.media.session.MediaSession
import android.media.session.PlaybackState
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat

internal data class MrBroccoliVoiceTurnState(
  val phase: String,
  val expectedSpeechAtMs: Long?,
  val phaseLabel: String,
  val statusLabel: String,
) {
  companion object {
    private val supportedPhases = setOf(
      "listening",
      "transcribing",
      "searching",
      "thinking",
      "synthesizing",
    )

    fun isSupportedPhase(phase: String): Boolean = phase in supportedPhases
  }
}

internal data class MrBroccoliVoiceTurnControlState(
  val mode: String = "inactive",
  val canRepeat: Boolean = false,
  val phaseLabel: String = "",
  val pauseLabel: String = "",
  val continueLabel: String = "",
  val stopLabel: String = "",
  val repeatLabel: String = "",
) {
  val isActive: Boolean
    get() = mode != "inactive"

  companion object {
    private val supportedModes = setOf(
      "drive-active",
      "drive-paused",
      "inactive",
      "playback-active",
      "playback-paused",
      "recording",
    )

    fun isSupportedMode(mode: String): Boolean = mode in supportedModes
  }
}

internal data class MrBroccoliVoiceTurnStartupSnapshot(
  val state: MrBroccoliVoiceTurnState?,
  val controls: MrBroccoliVoiceTurnControlState,
)

internal class MrBroccoliVoiceTurnStartupState {
  private var startRequested = false
  private var pendingState: MrBroccoliVoiceTurnState? = null
  private var pendingControls = MrBroccoliVoiceTurnControlState()

  fun setState(state: MrBroccoliVoiceTurnState): Boolean {
    pendingState = state
    return requestStart()
  }

  fun endState() {
    pendingState = null
  }

  fun setControls(controls: MrBroccoliVoiceTurnControlState): Boolean {
    pendingControls = controls
    return controls.isActive && requestStart()
  }

  fun clearControls() {
    pendingControls = MrBroccoliVoiceTurnControlState()
  }

  fun consume(): MrBroccoliVoiceTurnStartupSnapshot {
    val snapshot = MrBroccoliVoiceTurnStartupSnapshot(
      state = pendingState,
      controls = pendingControls,
    )
    startRequested = false
    pendingState = null
    pendingControls = MrBroccoliVoiceTurnControlState()
    return snapshot
  }

  fun cancelStartRequest() {
    startRequested = false
  }

  private fun requestStart(): Boolean {
    if (startRequested) {
      return false
    }
    startRequested = true
    return true
  }
}

class MrBroccoliVoiceTurnService : Service() {
  companion object {
    private val ACTION_START_PENDING =
      "${BuildConfig.APPLICATION_ID}.action.START_VOICE_TURN"
    private val ACTION_SET_STATE =
      "${BuildConfig.APPLICATION_ID}.action.SET_VOICE_TURN_STATE"
    private val ACTION_SET_CONTROLS =
      "${BuildConfig.APPLICATION_ID}.action.SET_VOICE_TURN_CONTROLS"
    private val ACTION_REMOTE_ACTION =
      "${BuildConfig.APPLICATION_ID}.action.VOICE_REMOTE_ACTION"
    private const val EXTRA_PHASE = "phase"
    private const val EXTRA_EXPECTED_SPEECH_AT_MS = "expectedSpeechAtMs"
    private const val EXTRA_PHASE_LABEL = "phaseLabel"
    private const val EXTRA_STATUS_LABEL = "statusLabel"
    private const val EXTRA_CONTROL_MODE = "controlMode"
    private const val EXTRA_CAN_REPEAT = "canRepeat"
    private const val EXTRA_PAUSE_LABEL = "pauseLabel"
    private const val EXTRA_CONTINUE_LABEL = "continueLabel"
    private const val EXTRA_STOP_LABEL = "stopLabel"
    private const val EXTRA_REPEAT_LABEL = "repeatLabel"
    private const val EXTRA_REMOTE_ACTION = "remoteAction"
    private const val CHANNEL_ID = "mrbroccoli_voice_turn"
    private const val NOTIFICATION_ID = 2404

    private val lifecycleLock = Any()
    private val startupState = MrBroccoliVoiceTurnStartupState()

    @Volatile
    private var activeService: MrBroccoliVoiceTurnService? = null

    fun setState(
      context: Context,
      phase: String,
      expectedSpeechAtMs: Long?,
      phaseLabel: String,
      statusLabel: String,
    ) {
      val state = MrBroccoliVoiceTurnState(
        phase,
        expectedSpeechAtMs,
        phaseLabel,
        statusLabel,
      )
      synchronized(lifecycleLock) {
        activeService?.let { service ->
          service.handler.post {
            service.updateState(state)
          }
          return
        }
        if (startupState.setState(state)) {
          startPendingService(context)
        }
      }
    }

    fun setControls(
      context: Context,
      mode: String,
      canRepeat: Boolean,
      phaseLabel: String,
      pauseLabel: String,
      continueLabel: String,
      stopLabel: String,
      repeatLabel: String,
    ) {
      val controls = MrBroccoliVoiceTurnControlState(
        mode = mode,
        canRepeat = canRepeat,
        phaseLabel = phaseLabel,
        pauseLabel = pauseLabel,
        continueLabel = continueLabel,
        stopLabel = stopLabel,
        repeatLabel = repeatLabel,
      )
      synchronized(lifecycleLock) {
        activeService?.let { service ->
          service.handler.post {
            service.updateControls(controls)
          }
          return
        }
        if (startupState.setControls(controls)) {
          startPendingService(context)
        }
      }
    }

    fun clearControls(context: Context) {
      synchronized(lifecycleLock) {
        activeService?.let { service ->
          service.handler.post(service::clearVoiceControls)
          return
        }
        // A pending foreground-service launch must be allowed to enter the
        // foreground before it can be stopped. Remember the latest desired
        // state instead of racing the launch with Context.stopService().
        startupState.clearControls()
      }
    }

    fun end(context: Context) {
      synchronized(lifecycleLock) {
        activeService?.let { service ->
          service.handler.post(service::endVoiceTurn)
          return
        }
        startupState.endState()
      }
    }

    private fun startPendingService(context: Context) {
      try {
        ContextCompat.startForegroundService(
          context,
          Intent(context, MrBroccoliVoiceTurnService::class.java).apply {
            action = ACTION_START_PENDING
          },
        )
      } catch (error: Exception) {
        startupState.cancelStartRequest()
        throw error
      }
    }

    private fun activateAndConsumeStartup(
      service: MrBroccoliVoiceTurnService,
    ): MrBroccoliVoiceTurnStartupSnapshot = synchronized(lifecycleLock) {
      activeService = service
      startupState.consume()
    }

    private fun activate(service: MrBroccoliVoiceTurnService) {
      synchronized(lifecycleLock) {
        activeService = service
      }
    }

    private fun deactivate(service: MrBroccoliVoiceTurnService) {
      synchronized(lifecycleLock) {
        if (activeService === service) {
          activeService = null
        }
      }
    }
  }

  private val handler = Handler(Looper.getMainLooper())
  private val notificationManager by lazy {
    getSystemService(NotificationManager::class.java)
  }
  private var currentState: MrBroccoliVoiceTurnState? = null
  private var currentControls = MrBroccoliVoiceTurnControlState()
  private var mediaSession: MediaSession? = null

  private val overtimeUpdate = Runnable {
    publishCurrentNotification()
  }

  override fun onCreate() {
    super.onCreate()
    createNotificationChannel()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      ACTION_START_PENDING -> {
        handleStartup(activateAndConsumeStartup(this))
      }
      ACTION_SET_STATE -> {
        activate(this)
        handleSetState(intent)
      }
      ACTION_SET_CONTROLS -> {
        activate(this)
        handleSetControls(intent)
      }
      ACTION_REMOTE_ACTION -> {
        activate(this)
        intent.getStringExtra(EXTRA_REMOTE_ACTION)
          ?.takeIf(::isSupportedRemoteAction)
          ?.let(MrBroccoliVoiceLiveActivityModule::emitRemoteAction)
        stopIfInactive()
      }
      else -> {
        activate(this)
        stopIfInactive()
      }
    }
    return START_NOT_STICKY
  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onTimeout(startId: Int, fgsType: Int) {
    stopVoiceTurn()
  }

  override fun onDestroy() {
    handler.removeCallbacks(overtimeUpdate)
    releaseMediaSession()
    deactivate(this)
    super.onDestroy()
  }

  private fun handleStartup(snapshot: MrBroccoliVoiceTurnStartupSnapshot) {
    currentState = snapshot.state
    currentControls = snapshot.controls

    if (currentState == null && !currentControls.isActive) {
      // The user may cancel during the small interval between requesting the
      // service and Android creating it. Satisfy the foreground-service
      // contract first, then stop immediately.
      publishStartupCancellationNotification()
      stopVoiceTurn()
      return
    }

    // Foreground promotion must happen before MediaSession or any other
    // potentially blocking service setup.
    publishCurrentNotification()
    updateMediaSession()
  }

  private fun handleSetState(intent: Intent) {
    val phase = intent.getStringExtra(EXTRA_PHASE)
    if (phase == null || !MrBroccoliVoiceTurnState.isSupportedPhase(phase)) {
      stopIfInactive()
      return
    }

    val expectedSpeechAtMs = if (
      intent.hasExtra(EXTRA_EXPECTED_SPEECH_AT_MS)
    ) {
      intent.getLongExtra(EXTRA_EXPECTED_SPEECH_AT_MS, 0L)
        .takeIf { it > 0L }
    } else {
      null
    }

    updateState(
      MrBroccoliVoiceTurnState(
        phase = phase,
        expectedSpeechAtMs = expectedSpeechAtMs,
        phaseLabel = intent.getStringExtra(EXTRA_PHASE_LABEL)
          ?.takeIf(String::isNotBlank)
          ?: getString(phaseLabel(phase)),
        statusLabel = intent.getStringExtra(EXTRA_STATUS_LABEL)
          ?.takeIf(String::isNotBlank)
          ?: getString(R.string.voice_turn_notification_title),
      ),
    )
  }

  private fun handleSetControls(intent: Intent) {
    val mode = intent.getStringExtra(EXTRA_CONTROL_MODE)
    if (
      mode == null ||
      !MrBroccoliVoiceTurnControlState.isSupportedMode(mode)
    ) {
      stopIfInactive()
      return
    }

    updateControls(
      MrBroccoliVoiceTurnControlState(
        mode = mode,
        canRepeat = intent.getBooleanExtra(EXTRA_CAN_REPEAT, false),
        phaseLabel = intent.getStringExtra(EXTRA_PHASE_LABEL).orEmpty(),
        pauseLabel = intent.getStringExtra(EXTRA_PAUSE_LABEL).orEmpty(),
        continueLabel = intent.getStringExtra(EXTRA_CONTINUE_LABEL).orEmpty(),
        stopLabel = intent.getStringExtra(EXTRA_STOP_LABEL).orEmpty(),
        repeatLabel = intent.getStringExtra(EXTRA_REPEAT_LABEL).orEmpty(),
      ),
    )
  }

  private fun updateState(state: MrBroccoliVoiceTurnState) {
    currentState = state
    publishCurrentNotification()
  }

  private fun updateControls(controls: MrBroccoliVoiceTurnControlState) {
    currentControls = controls
    if (currentState != null || controls.isActive) {
      publishCurrentNotification()
      updateMediaSession()
    } else {
      stopVoiceTurn()
    }
  }

  private fun publishStartupCancellationNotification() {
    val state = MrBroccoliVoiceTurnState(
      phase = "thinking",
      expectedSpeechAtMs = null,
      phaseLabel = getString(R.string.voice_turn_thinking),
      statusLabel = getString(R.string.voice_turn_notification_title),
    )
    ServiceCompat.startForeground(
      this,
      NOTIFICATION_ID,
      buildNotification(state),
      foregroundTypeFor(state.phase),
    )
  }

  private fun publishCurrentNotification() {
    val state = currentState ?: if (currentControls.isActive) {
      MrBroccoliVoiceTurnState(
        phase = if (currentControls.mode == "recording") {
          "listening"
        } else {
          "thinking"
        },
        expectedSpeechAtMs = null,
        phaseLabel = currentControls.phaseLabel,
        statusLabel = currentControls.phaseLabel,
      )
    } else {
      stopVoiceTurn()
      return
    }

    handler.removeCallbacks(overtimeUpdate)
    val notification = buildNotification(state)
    val foregroundType = foregroundTypeFor(state.phase)

    ServiceCompat.startForeground(
      this,
      NOTIFICATION_ID,
      notification,
      foregroundType,
    )

    state.expectedSpeechAtMs
      ?.let { deadline ->
        val now = System.currentTimeMillis()
        val delayMs = if (deadline > now) {
          deadline - now
        } else {
          1_000L
        }
        handler.postDelayed(
          overtimeUpdate,
          delayMs.coerceAtLeast(1L),
        )
      }
  }

  private fun buildNotification(state: MrBroccoliVoiceTurnState): Notification {
    val openAppIntent = Intent(this, MainActivity::class.java).apply {
      flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
    }
    val contentIntent = PendingIntent.getActivity(
      this,
      0,
      openAppIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    val builder = NotificationCompat.Builder(this, CHANNEL_ID)
      .setSmallIcon(R.drawable.ic_mrbroccoli_voice_turn)
      .setContentTitle("Mr Broccoli")
      .setContentText(notificationStatus(state))
      .setContentIntent(contentIntent)
      .setCategory(
        if (currentControls.isActive) {
          NotificationCompat.CATEGORY_TRANSPORT
        } else {
          NotificationCompat.CATEGORY_PROGRESS
        },
      )
      .setColor(Color.rgb(35, 205, 225))
      .setLocalOnly(true)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .setSilent(true)
      .setRequestPromotedOngoing(true)

    addControlActions(builder)

    val deadline = state.expectedSpeechAtMs
    if (deadline != null) {
      val countingDown = deadline > System.currentTimeMillis()
      if (countingDown) {
        builder
          .setWhen(deadline)
          .setShowWhen(true)
          .setUsesChronometer(true)
          .setChronometerCountDown(true)
      } else {
        builder
          .setShowWhen(false)
          .setUsesChronometer(false)
      }
    } else {
      builder.setShowWhen(false)
      if (!currentControls.isActive) {
        builder.setProgress(0, 0, true)
      }
    }

    return builder.build()
  }

  private fun addControlActions(builder: NotificationCompat.Builder) {
    if (!currentControls.isActive) {
      return
    }

    val primaryAction = when (currentControls.mode) {
      "recording" -> "stop"
      "drive-paused", "playback-paused" -> "continue"
      else -> "pause"
    }
    val primaryLabel = when (primaryAction) {
      "stop" -> currentControls.stopLabel
      "continue" -> currentControls.continueLabel
      else -> currentControls.pauseLabel
    }
    val primaryIcon = when (primaryAction) {
      "stop" -> android.R.drawable.ic_menu_close_clear_cancel
      "continue" -> android.R.drawable.ic_media_play
      else -> android.R.drawable.ic_media_pause
    }
    builder.addAction(
      primaryIcon,
      primaryLabel,
      remoteActionIntent(primaryAction, requestCode = 1),
    )

    if (currentControls.canRepeat) {
      builder.addAction(
        android.R.drawable.ic_media_next,
        currentControls.repeatLabel,
        remoteActionIntent("repeat", requestCode = 2),
      )
    }
  }

  private fun remoteActionIntent(
    action: String,
    requestCode: Int,
  ): PendingIntent {
    val intent = Intent(this, MrBroccoliVoiceTurnService::class.java).apply {
      this.action = ACTION_REMOTE_ACTION
      putExtra(EXTRA_REMOTE_ACTION, action)
    }
    return PendingIntent.getService(
      this,
      requestCode,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
  }

  private fun updateMediaSession() {
    if (!currentControls.isActive) {
      releaseMediaSession()
      return
    }

    val session = mediaSession ?: MediaSession(
      this,
      "MrBroccoliVoiceSession",
    ).also { created ->
      created.setCallback(object : MediaSession.Callback() {
        override fun onPlay() {
          dispatchMediaAction(
            if (currentControls.mode == "recording") "stop" else "continue",
          )
        }

        override fun onPause() {
          dispatchMediaAction(
            if (currentControls.mode == "recording") "stop" else "pause",
          )
        }

        override fun onStop() {
          dispatchMediaAction(
            if (currentControls.mode == "recording") "stop" else "pause",
          )
        }

        override fun onSkipToNext() {
          if (currentControls.canRepeat) {
            dispatchMediaAction("repeat")
          }
        }
      })
      created.setFlags(
        MediaSession.FLAG_HANDLES_MEDIA_BUTTONS or
          MediaSession.FLAG_HANDLES_TRANSPORT_CONTROLS,
      )
      mediaSession = created
    }

    val paused = currentControls.mode == "drive-paused" ||
      currentControls.mode == "playback-paused"
    var actions = PlaybackState.ACTION_PLAY or
      PlaybackState.ACTION_PAUSE or
      PlaybackState.ACTION_PLAY_PAUSE or
      PlaybackState.ACTION_STOP
    if (currentControls.canRepeat) {
      actions = actions or PlaybackState.ACTION_SKIP_TO_NEXT
    }
    session.setPlaybackState(
      PlaybackState.Builder()
        .setActions(actions)
        .setState(
          if (paused) {
            PlaybackState.STATE_PAUSED
          } else {
            PlaybackState.STATE_PLAYING
          },
          PlaybackState.PLAYBACK_POSITION_UNKNOWN,
          if (paused) 0f else 1f,
        )
        .build(),
    )
    session.isActive = true
  }

  private fun dispatchMediaAction(action: String) {
    if (isSupportedRemoteAction(action)) {
      MrBroccoliVoiceLiveActivityModule.emitRemoteAction(action)
    }
  }

  private fun releaseMediaSession() {
    mediaSession?.run {
      isActive = false
      release()
    }
    mediaSession = null
  }

  private fun notificationStatus(state: MrBroccoliVoiceTurnState): String {
    val deadline = state.expectedSpeechAtMs
    val overtimeMs = deadline?.let { System.currentTimeMillis() - it } ?: 0L
    return if (overtimeMs >= 0L && deadline != null) {
      "${state.phaseLabel} · + ${formatDuration(overtimeMs)}"
    } else if (currentControls.isActive && deadline == null) {
      currentControls.phaseLabel
    } else {
      "${state.phaseLabel} · ${state.statusLabel}"
    }
  }

  private fun formatDuration(durationMs: Long): String {
    val totalSeconds = (durationMs / 1_000L).coerceAtLeast(0L)
    return if (totalSeconds < 60L) {
      "$totalSeconds s"
    } else {
      val minutes = totalSeconds / 60L
      val seconds = totalSeconds % 60L
      "$minutes:${seconds.toString().padStart(2, '0')}"
    }
  }

  private fun phaseLabel(phase: String): Int = when (phase) {
    "listening" -> R.string.voice_turn_listening
    "transcribing" -> R.string.voice_turn_transcribing
    "searching" -> R.string.voice_turn_searching
    "synthesizing" -> R.string.voice_turn_synthesizing
    else -> R.string.voice_turn_thinking
  }

  private fun foregroundTypeFor(phase: String): Int {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
      return 0
    }

    if (
      currentControls.mode == "playback-active" ||
      currentControls.mode == "playback-paused"
    ) {
      return ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
    }

    return if (
      phase == "listening" ||
      currentControls.mode == "drive-active"
    ) {
      ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE or
        if (phase == "listening") {
          0
        } else {
          ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC
        }
    } else {
      ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC
    }
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }

    val channel = NotificationChannel(
      CHANNEL_ID,
      getString(R.string.voice_turn_channel_name),
      NotificationManager.IMPORTANCE_LOW,
    ).apply {
      description = getString(R.string.voice_turn_channel_description)
      setSound(null, null)
      enableVibration(false)
    }
    notificationManager.createNotificationChannel(channel)
  }

  private fun endVoiceTurn() {
    handler.removeCallbacks(overtimeUpdate)
    currentState = null
    if (currentControls.isActive) {
      publishCurrentNotification()
    } else {
      stopVoiceTurn()
    }
  }

  private fun clearVoiceControls() {
    currentControls = MrBroccoliVoiceTurnControlState()
    releaseMediaSession()
    if (currentState != null) {
      publishCurrentNotification()
    } else {
      stopVoiceTurn()
    }
  }

  private fun stopIfInactive() {
    if (currentState == null && !currentControls.isActive) {
      stopVoiceTurn()
    }
  }

  private fun stopVoiceTurn() {
    handler.removeCallbacks(overtimeUpdate)
    currentState = null
    currentControls = MrBroccoliVoiceTurnControlState()
    releaseMediaSession()
    ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
    stopSelf()
  }

  private fun isSupportedRemoteAction(action: String): Boolean =
    action == "continue" ||
      action == "pause" ||
      action == "repeat" ||
      action == "stop"
}
