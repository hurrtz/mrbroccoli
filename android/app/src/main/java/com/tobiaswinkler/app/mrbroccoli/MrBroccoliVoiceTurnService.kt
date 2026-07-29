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

class MrBroccoliVoiceTurnService : Service() {
  companion object {
    private const val ACTION_SET_STATE =
      "com.tobiaswinkler.app.mrbroccoli.action.SET_VOICE_TURN_STATE"
    private const val EXTRA_PHASE = "phase"
    private const val EXTRA_EXPECTED_SPEECH_AT_MS = "expectedSpeechAtMs"
    private const val EXTRA_PHASE_LABEL = "phaseLabel"
    private const val EXTRA_STATUS_LABEL = "statusLabel"
    private const val CHANNEL_ID = "mrbroccoli_voice_turn"
    private const val NOTIFICATION_ID = 2404

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
      activeService?.let { service ->
        service.handler.post {
          service.updateState(state)
        }
      } ?: run {
        val intent = Intent(context, MrBroccoliVoiceTurnService::class.java).apply {
          action = ACTION_SET_STATE
          putExtra(EXTRA_PHASE, phase)
          if (expectedSpeechAtMs != null) {
            putExtra(EXTRA_EXPECTED_SPEECH_AT_MS, expectedSpeechAtMs)
          }
          putExtra(EXTRA_PHASE_LABEL, phaseLabel)
          putExtra(EXTRA_STATUS_LABEL, statusLabel)
        }
        ContextCompat.startForegroundService(context, intent)
      }
    }

    fun end(context: Context) {
      activeService?.let { service ->
        service.handler.post(service::stopVoiceTurn)
      } ?: context.stopService(Intent(context, MrBroccoliVoiceTurnService::class.java))
    }
  }

  private val handler = Handler(Looper.getMainLooper())
  private val notificationManager by lazy {
    getSystemService(NotificationManager::class.java)
  }
  private var currentState: MrBroccoliVoiceTurnState? = null

  private val overtimeUpdate = Runnable {
    currentState?.let(::publishNotification)
  }

  override fun onCreate() {
    super.onCreate()
    activeService = this
    createNotificationChannel()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (intent?.action != ACTION_SET_STATE) {
      stopVoiceTurn()
      return START_NOT_STICKY
    }

    val phase = intent.getStringExtra(EXTRA_PHASE)
    if (phase == null || !MrBroccoliVoiceTurnState.isSupportedPhase(phase)) {
      stopVoiceTurn()
      return START_NOT_STICKY
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
    return START_NOT_STICKY
  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onTimeout(startId: Int, fgsType: Int) {
    stopVoiceTurn()
  }

  override fun onDestroy() {
    handler.removeCallbacks(overtimeUpdate)
    if (activeService === this) {
      activeService = null
    }
    super.onDestroy()
  }

  private fun updateState(state: MrBroccoliVoiceTurnState) {
    currentState = state
    publishNotification(state)
  }

  private fun publishNotification(state: MrBroccoliVoiceTurnState) {
    handler.removeCallbacks(overtimeUpdate)
    val notification = buildNotification(state)
    val foregroundType = foregroundTypeFor(state.phase)

    // Calling startForeground again updates both the notification and the
    // declared service type when capture becomes network processing.
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
      .setCategory(NotificationCompat.CATEGORY_PROGRESS)
      .setColor(Color.rgb(35, 205, 225))
      .setLocalOnly(true)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .setSilent(true)
      .setRequestPromotedOngoing(true)

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
      builder
        .setShowWhen(false)
        .setProgress(0, 0, true)
    }

    return builder.build()
  }

  private fun notificationStatus(state: MrBroccoliVoiceTurnState): String {
    val deadline = state.expectedSpeechAtMs
    val overtimeMs = deadline?.let { System.currentTimeMillis() - it } ?: 0L
    return if (overtimeMs >= 0L && deadline != null) {
      "${state.phaseLabel} · + ${formatDuration(overtimeMs)}"
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

    return if (
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE &&
      phase == "listening"
    ) {
      ServiceInfo.FOREGROUND_SERVICE_TYPE_SHORT_SERVICE
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

  private fun stopVoiceTurn() {
    handler.removeCallbacks(overtimeUpdate)
    currentState = null
    ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
    stopSelf()
  }
}
