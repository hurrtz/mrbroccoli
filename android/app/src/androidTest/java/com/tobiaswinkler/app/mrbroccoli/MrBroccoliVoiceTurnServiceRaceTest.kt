package com.tobiaswinkler.app.mrbroccoli

import android.content.Context
import android.os.SystemClock
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class MrBroccoliVoiceTurnServiceRaceTest {
  @Test
  fun rapidControlStartAndClearDoesNotAbortPendingForegroundLaunch() {
    val context = ApplicationProvider.getApplicationContext<Context>()

    ActivityScenario.launch(MainActivity::class.java).use {
      repeat(100) {
        MrBroccoliVoiceTurnService.setControls(
          context = context,
          mode = "playback-active",
          canRepeat = false,
          phaseLabel = "Speaking",
          pauseLabel = "Pause",
          continueLabel = "Continue",
          stopLabel = "Stop",
          repeatLabel = "Repeat",
        )
        MrBroccoliVoiceTurnService.clearControls(context)
      }

      // Android reports ForegroundServiceDidNotStartInTimeException back to
      // the app process asynchronously. Keeping the scenario alive beyond the
      // watchdog interval makes the test fail if that process abort occurs.
      SystemClock.sleep(6_000L)
    }
  }
}
