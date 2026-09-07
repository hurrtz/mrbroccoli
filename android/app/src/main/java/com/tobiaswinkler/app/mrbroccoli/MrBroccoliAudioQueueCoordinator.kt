package com.tobiaswinkler.app.mrbroccoli

import java.util.ArrayDeque

internal data class MrBroccoliAudioQueueItem(
  val uri: String,
  val itemId: String,
  val requestId: String?,
  val source: String?,
)

internal data class MrBroccoliAudioQueueEvent(
  val type: String,
  val itemId: String? = null,
  val uri: String? = null,
  val requestId: String? = null,
  val source: String? = null,
  val message: String? = null,
)

internal interface MrBroccoliAudioQueuePlayer {
  fun start()
  fun pause()
  fun stop()
  fun release()
}

internal data class MrBroccoliAudioQueuePlayerCallbacks(
  val onCompletion: () -> Unit,
  val onError: (String) -> Unit,
)

internal class MrBroccoliAudioQueueCoordinator(
  private val playerFactory: (
    item: MrBroccoliAudioQueueItem,
    callbacks: MrBroccoliAudioQueuePlayerCallbacks,
  ) -> MrBroccoliAudioQueuePlayer,
  private val eventSink: (MrBroccoliAudioQueueEvent) -> Unit,
) {
  private val lock = Any()
  private val queue = ArrayDeque<MrBroccoliAudioQueueItem>()
  private var player: MrBroccoliAudioQueuePlayer? = null
  private var currentItem: MrBroccoliAudioQueueItem? = null
  private var currentStarted = false

  fun enqueue(item: MrBroccoliAudioQueueItem) {
    synchronized(lock) {
      queue.addLast(item)
    }
  }

  fun start(): Boolean =
    synchronized(lock) {
      val hadPendingItem = currentItem != null || queue.isNotEmpty()
      val started = startLocked()
      if (!started && hadPendingItem) emitDrainedLocked()
      started
    }

  fun pause() {
    synchronized(lock) {
      player?.pause()
    }
  }

  fun resume(): Boolean = start()

  fun stop(emitStopped: Boolean) {
    synchronized(lock) {
      stopLocked(emitStopped)
    }
  }

  private fun startLocked(): Boolean {
    val activePlayer = player
    if (activePlayer != null) {
      try {
        activePlayer.start()
        emitStartedForCurrentItemLocked()
        return true
      } catch (_: Exception) {
        failCurrentPlayerLocked()
      }
    }

    // Construction and start can fail synchronously, including when this runs
    // from MediaPlayer's completion callback. Consume failed items iteratively
    // so corrupt audio cannot escape onto the callback thread or wedge the queue.
    while (true) {
      val nextItem = queue.pollFirst() ?: return false
      currentItem = nextItem
      currentStarted = false
      var nextPlayer: MrBroccoliAudioQueuePlayer? = null
      val callbacks = MrBroccoliAudioQueuePlayerCallbacks(
        onCompletion = {
          synchronized(lock) {
            if (nextPlayer == null || player !== nextPlayer) {
              return@synchronized
            }
            currentItem?.let { emitItemEvent("finished", it) }
            cleanupCurrentPlayerLocked()
            if (!startLocked()) emitDrainedLocked()
          }
        },
        onError = { message ->
          synchronized(lock) {
            if (nextPlayer == null || player !== nextPlayer) {
              return@synchronized
            }
            currentItem?.let { emitItemEvent("failed", it, message) }
            cleanupCurrentPlayerLocked()
            if (!startLocked()) emitDrainedLocked()
          }
        },
      )

      try {
        nextPlayer = playerFactory(nextItem, callbacks)
        player = nextPlayer
        nextPlayer.start()
        emitStartedForCurrentItemLocked()
        return true
      } catch (_: Exception) {
        failCurrentPlayerLocked()
      }
    }
  }

  private fun failCurrentPlayerLocked() {
    currentItem?.let { emitItemEvent("failed", it, "Audio playback failed.") }
    cleanupCurrentPlayerLocked()
  }

  private fun stopLocked(emitStopped: Boolean) {
    val stoppedItems = mutableListOf<MrBroccoliAudioQueueItem>()
    currentItem?.let(stoppedItems::add)
    while (queue.isNotEmpty()) {
      queue.pollFirst()?.let(stoppedItems::add)
    }

    cleanupCurrentPlayerLocked()

    if (emitStopped) {
      stoppedItems.forEach { emitItemEvent("stopped", it) }
      emitDrainedLocked()
    }
  }

  private fun cleanupCurrentPlayerLocked() {
    val activePlayer = player
    player = null
    currentItem = null
    currentStarted = false

    if (activePlayer != null) {
      // Both operations must be attempted even after a failed start. Native
      // cleanup failures must not prevent later items from playing.
      try {
        activePlayer.stop()
      } catch (_: Exception) {
      }
      try {
        activePlayer.release()
      } catch (_: Exception) {
      }
    }
  }

  private fun emitStartedForCurrentItemLocked() {
    val item = currentItem ?: return
    if (currentStarted) {
      return
    }

    currentStarted = true
    emitItemEvent("started", item)
  }

  private fun emitItemEvent(
    type: String,
    item: MrBroccoliAudioQueueItem,
    message: String? = null,
  ) {
    eventSink(
      MrBroccoliAudioQueueEvent(
        type = type,
        itemId = item.itemId,
        uri = item.uri,
        requestId = item.requestId,
        source = item.source,
        message = message,
      ),
    )
  }

  private fun emitDrainedLocked() {
    eventSink(MrBroccoliAudioQueueEvent(type = "drained"))
  }
}
