package com.tobiaswinkler.app.mrbroccoli

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class MrBroccoliNativeWaveformPackage : ReactPackage {
  override fun createNativeModules(
    reactContext: ReactApplicationContext,
  ): List<NativeModule> =
    listOf(
      MrBroccoliNativeWaveformModule(reactContext),
      MrBroccoliNativeAudioQueueModule(reactContext),
      MrBroccoliDiagnosticsModule(reactContext),
      MrBroccoliVoiceLiveActivityModule(reactContext),
    )

  override fun createViewManagers(
    reactContext: ReactApplicationContext,
  ): List<ViewManager<*, *>> = listOf(MrBroccoliNativeWaveformViewManager())
}
