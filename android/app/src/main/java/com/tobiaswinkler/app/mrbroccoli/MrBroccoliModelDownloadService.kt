package com.tobiaswinkler.app.mrbroccoli

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat

/**
 * Keeps the process running while an on-device model is downloading.
 *
 * A model download runs inside the app process, both for the artifacts this
 * app fetches itself and for the ones the speech runtime fetches. A wake lock
 * only stops the display sleeping; it does nothing once the user leaves the
 * app, and nothing against Doze or battery saver, both of which cut background
 * network within about a minute. Reporters saw a multi-gigabyte transfer die a
 * minute after the screen went dark, and die instantly on an app switch.
 *
 * `dataSync` is the honest foreground type for this: the work is a file
 * transfer the user asked for and is waiting on. The notification is required
 * by the platform and doubles as the way out of a download the user forgot
 * about, since tapping it returns to the app.
 */
class MrBroccoliModelDownloadService : Service() {
  companion object {
    const val ACTION_START = "com.tobiaswinkler.app.mrbroccoli.DOWNLOAD_START"
    const val ACTION_STOP = "com.tobiaswinkler.app.mrbroccoli.DOWNLOAD_STOP"
    const val EXTRA_TITLE = "title"
    const val EXTRA_BODY = "body"

    private const val CHANNEL_ID = "mrbroccoli.model-download"
    private const val NOTIFICATION_ID = 4711

    fun start(context: Context, title: String, body: String) {
      val intent = Intent(context, MrBroccoliModelDownloadService::class.java)
        .setAction(ACTION_START)
        .putExtra(EXTRA_TITLE, title)
        .putExtra(EXTRA_BODY, body)
      ContextCompat.startForegroundService(context, intent)
    }

    fun stop(context: Context) {
      val intent = Intent(context, MrBroccoliModelDownloadService::class.java)
        .setAction(ACTION_STOP)
      // Deliberately not startForegroundService: stopping never needs to
      // promote the service, and doing so on a dead service would demand a
      // notification we are about to remove.
      context.startService(intent)
    }
  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      ACTION_STOP -> {
        stopAsForeground()
        return START_NOT_STICKY
      }
      else -> {
        val title = intent?.getStringExtra(EXTRA_TITLE).orEmpty()
        val body = intent?.getStringExtra(EXTRA_BODY).orEmpty()
        promote(title, body)
      }
    }

    // The transfer belongs to a screen the user is looking at. If the process
    // is killed, restarting the service without that screen would leave a
    // notification for work nobody is doing.
    return START_NOT_STICKY
  }

  override fun onDestroy() {
    stopAsForeground()
    super.onDestroy()
  }

  private fun promote(title: String, body: String) {
    ensureChannel()

    val launch = packageManager.getLaunchIntentForPackage(packageName)
    val contentIntent = launch?.let {
      PendingIntent.getActivity(
        this,
        0,
        it,
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
      )
    }

    val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle(title)
      .setContentText(body)
      .setSmallIcon(android.R.drawable.stat_sys_download)
      .setOngoing(true)
      .setSilent(true)
      .setCategory(NotificationCompat.CATEGORY_PROGRESS)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .setProgress(0, 0, true)
      .apply { contentIntent?.let { setContentIntent(it) } }
      .build()

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      ServiceCompat.startForeground(
        this,
        NOTIFICATION_ID,
        notification,
        ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC,
      )
    } else {
      startForeground(NOTIFICATION_ID, notification)
    }
  }

  private fun stopAsForeground() {
    ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
    stopSelf()
  }

  private fun ensureChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }
    val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    if (manager.getNotificationChannel(CHANNEL_ID) != null) {
      return
    }
    val channel = NotificationChannel(
      CHANNEL_ID,
      "Model downloads",
      NotificationManager.IMPORTANCE_LOW,
    ).apply {
      description = "Shown while an on-device model is downloading."
      setShowBadge(false)
      enableVibration(false)
      setSound(null, null)
    }
    manager.createNotificationChannel(channel)
  }
}
