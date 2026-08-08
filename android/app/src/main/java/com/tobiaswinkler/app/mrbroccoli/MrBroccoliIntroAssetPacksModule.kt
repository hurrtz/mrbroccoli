package com.tobiaswinkler.app.mrbroccoli

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.android.play.core.assetpacks.AssetPackManager
import com.google.android.play.core.assetpacks.AssetPackManagerFactory
import com.google.android.play.core.assetpacks.AssetPackStateUpdateListener
import com.google.android.play.core.assetpacks.model.AssetPackStatus
import java.io.File
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Play Asset Delivery for the intro audio examples.
 *
 * Every interface language has an example clip and any one user opens one or
 * two, so the clips ship as store-hosted packs rather than inside the app.
 * Google serves them, which keeps roughly eighty megabytes of audio that almost
 * nobody plays out of every install.
 *
 * Nothing here rejects for an absent pack. During rollout most languages have
 * no pack yet, and the intro sheet falls back to its transcript -- the same
 * branch that already covers a language whose clip has not been recorded.
 */
class MrBroccoliIntroAssetPacksModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "MrBroccoliIntroAssetPacks"

  private val assetPackManager: AssetPackManager by lazy {
    AssetPackManagerFactory.getInstance(reactContext.applicationContext)
  }

  @ReactMethod
  fun isSupported(promise: Promise) {
    // Play Asset Delivery is present wherever the app was installed through
    // Play. A sideloaded build has no pack service, which surfaces as an absent
    // pack location rather than an exception, so the honest probe is whether
    // the manager can be constructed at all.
    promise.resolve(
      try {
        assetPackManager
        true
      } catch (error: Throwable) {
        false
      },
    )
  }

  @ReactMethod
  fun getLocalPath(packName: String, fileName: String, promise: Promise) {
    promise.resolve(resolveDownloadedFile(packName, fileName))
  }

  @ReactMethod
  fun ensurePack(packName: String, fileName: String, promise: Promise) {
    resolveDownloadedFile(packName, fileName)?.let {
      promise.resolve(it)
      return
    }

    // A Promise may only be settled once, but a fetch can report terminal
    // states through both the listener and the completion callback.
    val settled = AtomicBoolean(false)
    var listener: AssetPackStateUpdateListener? = null

    fun finish(result: String?) {
      if (!settled.compareAndSet(false, true)) {
        return
      }
      listener?.let { assetPackManager.unregisterListener(it) }
      promise.resolve(result)
    }

    fun fail(code: String, message: String, error: Throwable?) {
      if (!settled.compareAndSet(false, true)) {
        return
      }
      listener?.let { assetPackManager.unregisterListener(it) }
      promise.reject(code, message, error)
    }

    listener = AssetPackStateUpdateListener { state ->
      if (state.name() != packName) {
        return@AssetPackStateUpdateListener
      }

      when (state.status()) {
        AssetPackStatus.COMPLETED ->
          finish(resolveDownloadedFile(packName, fileName))
        // Treat an unavailable pack as "no clip" rather than an error: a
        // language whose pack was never uploaded is an expected state.
        AssetPackStatus.CANCELED, AssetPackStatus.NOT_INSTALLED -> finish(null)
        AssetPackStatus.FAILED ->
          fail(
            "intro_asset_pack_fetch_failed",
            "Could not fetch $packName (error ${state.errorCode()}).",
            null,
          )
        AssetPackStatus.REQUIRES_USER_CONFIRMATION ->
          // Large downloads over cellular need consent. The intro example is
          // not worth interrupting someone for, so treat it as unavailable and
          // let the transcript stand in.
          finish(null)
        else -> Unit
      }
    }

    assetPackManager.registerListener(listener)

    assetPackManager
      .fetch(listOf(packName))
      .addOnFailureListener { error ->
        fail(
          "intro_asset_pack_fetch_failed",
          "Could not request $packName.",
          error,
        )
      }
      .addOnSuccessListener { states ->
        val state = states.packStates()[packName]
        if (state == null || state.status() == AssetPackStatus.NOT_INSTALLED) {
          finish(null)
          return@addOnSuccessListener
        }
        if (state.status() == AssetPackStatus.COMPLETED) {
          finish(resolveDownloadedFile(packName, fileName))
        }
      }
  }

  @ReactMethod
  fun removePack(packName: String, promise: Promise) {
    try {
      assetPackManager.removePack(packName)
      promise.resolve(null)
    } catch (error: Throwable) {
      promise.reject(
        "intro_asset_pack_remove_failed",
        "Could not remove $packName.",
        error,
      )
    }
  }

  /**
   * Returns the clip's path only when the pack is on disk. `getPackLocation`
   * is null until the pack is fully installed, which makes it the local check
   * as well as the path resolver.
   */
  private fun resolveDownloadedFile(packName: String, fileName: String): String? {
    val assetsPath =
      try {
        assetPackManager.getPackLocation(packName)?.assetsPath()
      } catch (error: Throwable) {
        null
      } ?: return null

    val file = File(assetsPath, fileName)
    return if (file.isFile) file.absolutePath else null
  }
}
