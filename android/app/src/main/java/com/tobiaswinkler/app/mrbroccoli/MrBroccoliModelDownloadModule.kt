package com.tobiaswinkler.app.mrbroccoli

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Starts and stops the model-download foreground service.
 *
 * Notification copy comes from JavaScript because that is where the user's
 * language lives; the service itself has no access to the app's translations.
 */
class MrBroccoliModelDownloadModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
  companion object {
    const val NAME = "MrBroccoliModelDownload"
  }

  override fun getName(): String = NAME

  @ReactMethod
  fun beginDownload(title: String, body: String, promise: Promise) {
    try {
      MrBroccoliModelDownloadService.start(reactApplicationContext, title, body)
      promise.resolve(true)
    } catch (error: Throwable) {
      // A refused foreground start must not take the download with it: the
      // transfer still works while the app is in front, which is where the
      // user started it.
      promise.resolve(false)
    }
  }

  @ReactMethod
  fun endDownload(promise: Promise) {
    try {
      MrBroccoliModelDownloadService.stop(reactApplicationContext)
      promise.resolve(true)
    } catch (error: Throwable) {
      promise.resolve(false)
    }
  }
}
