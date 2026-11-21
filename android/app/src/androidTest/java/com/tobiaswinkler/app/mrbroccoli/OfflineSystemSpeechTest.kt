package com.tobiaswinkler.app.mrbroccoli

import android.speech.tts.TextToSpeech
import android.speech.tts.Voice
import expo.modules.speech.OfflineSpeechVoices
import java.util.Locale
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Test

class OfflineSystemSpeechTest {
  private fun voice(name: String, locale: Locale, remote: Boolean = false, installed: Boolean = true): Voice =
    Voice(
      name, locale, Voice.QUALITY_NORMAL, Voice.LATENCY_NORMAL, remote,
      if (installed) emptySet() else setOf(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED),
    )

  @Test
  fun rejectsNetworkAndUninstalledVoicesEvenWhenSelectedExplicitly() {
    val remote = voice("online", Locale.US, remote = true)
    val missing = voice("missing", Locale.US, installed = false)
    val local = voice("local", Locale.US)
    val voices = listOf(remote, missing, local)
    assertFalse(OfflineSpeechVoices.installed(remote))
    assertFalse(OfflineSpeechVoices.installed(missing))
    assertNull(OfflineSpeechVoices.select(voices, remote.name, Locale.US, remote.name))
    assertNull(OfflineSpeechVoices.select(voices, missing.name, Locale.US, remote.name))
    assertEquals(local, OfflineSpeechVoices.select(voices, local.name, Locale.US, remote.name))
  }

  @Test
  fun defaultPrefersTheRequestedLocaleAndRequiresAnInstalledLanguageMatch() {
    val remoteDefault = voice("network-default", Locale.UK, remote = true)
    val us = voice("en-us", Locale.US)
    val uk = voice("en-gb", Locale.UK)
    val voices = listOf(remoteDefault, us, uk)
    assertEquals(uk, OfflineSpeechVoices.select(voices, null, Locale.UK, remoteDefault.name))
    assertEquals(us, OfflineSpeechVoices.select(voices, null, Locale.ENGLISH, us.name))
    assertNull(OfflineSpeechVoices.select(voices, null, Locale.FRENCH, remoteDefault.name))
  }
}
