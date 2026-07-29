package com.tobiaswinkler.app.mrbroccoli

import android.content.Context
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.net.Uri
import java.io.File

internal class MrBroccoliAndroidAudioQueuePlayer(
  context: Context,
  item: MrBroccoliAudioQueueItem,
  callbacks: MrBroccoliAudioQueuePlayerCallbacks,
) : MrBroccoliAudioQueuePlayer {
  private val mediaPlayer = MediaPlayer()

  init {
    mediaPlayer.setAudioAttributes(
      AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_ASSISTANCE_ACCESSIBILITY)
        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
        .build(),
    )
    mediaPlayer.setOnCompletionListener {
      callbacks.onCompletion()
    }
    mediaPlayer.setOnErrorListener { _, _, _ ->
      callbacks.onError("Audio playback failed.")
      true
    }
    mediaPlayer.setDataSource(context, resolveUri(item.uri))
    mediaPlayer.prepare()
  }

  override fun start() {
    mediaPlayer.start()
  }

  override fun pause() {
    mediaPlayer.pause()
  }

  override fun stop() {
    try {
      mediaPlayer.stop()
    } catch (_: IllegalStateException) {
    }
  }

  override fun release() {
    mediaPlayer.setOnCompletionListener(null)
    mediaPlayer.setOnErrorListener(null)
    mediaPlayer.reset()
    mediaPlayer.release()
  }

  private fun resolveUri(uri: String): Uri {
    val parsed = Uri.parse(uri)
    if (!parsed.scheme.isNullOrBlank()) {
      return parsed
    }

    return Uri.fromFile(File(uri))
  }
}
