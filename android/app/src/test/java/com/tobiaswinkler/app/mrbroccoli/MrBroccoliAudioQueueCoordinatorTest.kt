package com.tobiaswinkler.app.mrbroccoli

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class MrBroccoliAudioQueueCoordinatorTest {
  private val events = mutableListOf<MrBroccoliAudioQueueEvent>()
  private val players = mutableListOf<FakeAudioQueuePlayer>()
  private val coordinator = MrBroccoliAudioQueueCoordinator(
    playerFactory = { _, callbacks ->
      FakeAudioQueuePlayer(callbacks).also(players::add)
    },
    eventSink = events::add,
  )

  @Test
  fun playsQueuedItemsSequentiallyAndDrainsOnce() {
    coordinator.enqueue(item("first"))
    coordinator.enqueue(item("second"))

    assertTrue(coordinator.start())
    assertEventTypes("started")
    assertEquals("first", events.single().itemId)

    players[0].complete()

    assertEventTypes("started", "finished", "started")
    assertEquals("second", events.last().itemId)

    players[1].complete()

    assertEventTypes("started", "finished", "started", "finished", "drained")
  }

  @Test
  fun resumeDoesNotEmitDuplicateStartedForCurrentItem() {
    coordinator.enqueue(item("reply"))

    assertTrue(coordinator.start())
    coordinator.pause()
    assertTrue(coordinator.resume())

    assertEventTypes("started")
    assertEquals(2, players.single().startCount)
  }

  @Test
  fun stopEmitsStoppedForCurrentAndPendingItemsThenDrains() {
    coordinator.enqueue(item("current"))
    coordinator.enqueue(item("pending"))

    assertTrue(coordinator.start())
    coordinator.stop(emitStopped = true)

    assertEventTypes("started", "stopped", "stopped", "drained")
    assertEquals(listOf("current", "pending"), events.filter { it.type == "stopped" }.map { it.itemId })
    assertTrue(players.single().released)
  }

  @Test
  fun failedItemAdvancesToNextQueuedItem() {
    coordinator.enqueue(item("broken"))
    coordinator.enqueue(item("next"))

    assertTrue(coordinator.start())
    players[0].fail("no decoder")

    assertEventTypes("started", "failed", "started")
    assertEquals("no decoder", events[1].message)

    players[1].complete()

    assertEventTypes("started", "failed", "started", "finished", "drained")
  }

  @Test
  fun constructionFailureDuringCompletionFailsItemAndContinues() {
    val queue = MrBroccoliAudioQueueCoordinator(
      playerFactory = { item, callbacks ->
        if (item.itemId == "broken") throw IllegalStateException("missing file")
        FakeAudioQueuePlayer(callbacks).also(players::add)
      },
      eventSink = events::add,
    )
    queue.enqueue(item("first"))
    queue.enqueue(item("broken"))
    queue.enqueue(item("last"))
    assertTrue(queue.start())

    players[0].complete()

    assertEventTypes("started", "finished", "failed", "started")
    assertEquals("broken", events[2].itemId)
    assertEquals("last", events.last().itemId)
    players[1].complete()
    assertEquals(1, events.count { it.type == "drained" })
  }

  @Test
  fun synchronousStartFailureReleasesPlayerAndContinues() {
    val queue = MrBroccoliAudioQueueCoordinator(
      playerFactory = { item, callbacks ->
        FakeAudioQueuePlayer(callbacks).also {
          it.throwOnStart = item.itemId == "broken"
          players.add(it)
        }
      },
      eventSink = events::add,
    )
    queue.enqueue(item("first"))
    queue.enqueue(item("broken"))
    queue.enqueue(item("last"))
    assertTrue(queue.start())

    players[0].complete()

    assertTrue(players[1].released)
    assertEventTypes("started", "finished", "failed", "started")
    assertEquals("last", events.last().itemId)
    players[1].complete() // Obsolete callbacks must not advance the new player.
    assertEventTypes("started", "finished", "failed", "started")
    players[2].complete()
    assertEquals(1, events.count { it.type == "drained" })
  }

  @Test
  fun failedInitialItemDrainsWithoutLeavingAStaleCurrentItem() {
    val queue = MrBroccoliAudioQueueCoordinator(
      playerFactory = { _, _ -> throw IllegalStateException("missing file") },
      eventSink = events::add,
    )
    queue.enqueue(item("broken"))
    assertFalse(queue.start())
    assertEventTypes("failed", "drained")
    queue.stop(emitStopped = true)
    assertTrue(events.none { it.type == "stopped" })
  }

  @Test
  fun resumeFailureReleasesCurrentPlayerAndAdvances() {
    coordinator.enqueue(item("first"))
    coordinator.enqueue(item("next"))
    assertTrue(coordinator.start())
    coordinator.pause()
    players[0].throwOnStart = true

    assertTrue(coordinator.resume())

    assertTrue(players[0].released)
    assertEventTypes("started", "failed", "started")
    assertEquals("next", events.last().itemId)
  }

  @Test
  fun startReturnsFalseWhenQueueIsEmpty() {
    assertFalse(coordinator.start())
    assertTrue(events.isEmpty())
  }

  private fun item(id: String) = MrBroccoliAudioQueueItem(
    uri = "file:///tmp/$id.m4a",
    itemId = id,
    requestId = "request-$id",
    source = "test",
  )

  private fun assertEventTypes(vararg expected: String) {
    assertEquals(expected.toList(), events.map { it.type })
  }

  private class FakeAudioQueuePlayer(
    private val callbacks: MrBroccoliAudioQueuePlayerCallbacks,
  ) : MrBroccoliAudioQueuePlayer {
    var startCount = 0
    var released = false
    var throwOnStart = false

    override fun start() {
      if (throwOnStart) throw IllegalStateException("decoder start failed")
      startCount += 1
    }

    override fun pause() = Unit

    override fun stop() = Unit

    override fun release() {
      released = true
    }

    fun complete() {
      callbacks.onCompletion()
    }

    fun fail(message: String) {
      callbacks.onError(message)
    }
  }
}
