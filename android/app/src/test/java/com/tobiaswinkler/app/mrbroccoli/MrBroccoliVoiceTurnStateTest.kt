package com.tobiaswinkler.app.mrbroccoli

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class MrBroccoliVoiceTurnStateTest {
  @Test
  fun acceptsEveryVoicePipelinePhaseExposedToTheNativeService() {
    listOf(
      "listening",
      "transcribing",
      "searching",
      "thinking",
      "synthesizing",
    ).forEach { phase ->
      assertTrue(MrBroccoliVoiceTurnState.isSupportedPhase(phase))
    }
  }

  @Test
  fun rejectsUnknownPhasesAtTheNativeBoundary() {
    assertFalse(MrBroccoliVoiceTurnState.isSupportedPhase("speaking"))
    assertFalse(MrBroccoliVoiceTurnState.isSupportedPhase("prompt-content"))
  }

  @Test
  fun coalescesStatusAndControlsIntoOnePendingServiceStart() {
    val startup = MrBroccoliVoiceTurnStartupState()
    val state = MrBroccoliVoiceTurnState(
      phase = "listening",
      expectedSpeechAtMs = null,
      phaseLabel = "Listening",
      statusLabel = "Your turn",
    )
    val controls = MrBroccoliVoiceTurnControlState(
      mode = "recording",
      phaseLabel = "Listening",
    )

    assertTrue(startup.setState(state))
    assertFalse(startup.setControls(controls))

    val snapshot = startup.consume()
    assertEquals(state, snapshot.state)
    assertEquals(controls, snapshot.controls)
  }

  @Test
  fun keepsCancellationPendingUntilTheServiceCanPromoteAndStop() {
    val startup = MrBroccoliVoiceTurnStartupState()

    assertTrue(
      startup.setControls(
        MrBroccoliVoiceTurnControlState(
          mode = "drive-active",
          phaseLabel = "Drive session",
        ),
      ),
    )

    startup.clearControls()
    startup.endState()

    val snapshot = startup.consume()
    assertNull(snapshot.state)
    assertFalse(snapshot.controls.isActive)
  }

  @Test
  fun permitsRetryAfterAndroidRejectsAStartRequest() {
    val startup = MrBroccoliVoiceTurnStartupState()
    val state = MrBroccoliVoiceTurnState(
      phase = "thinking",
      expectedSpeechAtMs = null,
      phaseLabel = "Thinking",
      statusLabel = "Please wait",
    )

    assertTrue(startup.setState(state))
    startup.cancelStartRequest()
    assertTrue(startup.setState(state))
    assertEquals(state, startup.consume().state)
  }
}
