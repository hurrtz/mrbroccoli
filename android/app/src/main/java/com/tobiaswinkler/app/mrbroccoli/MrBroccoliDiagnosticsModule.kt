package com.tobiaswinkler.app.mrbroccoli

import android.app.ActivityManager
import android.app.ApplicationExitInfo
import android.content.Context
import android.os.Build
import android.os.PowerManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MrBroccoliDiagnosticsModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
  companion object {
    const val NAME = "MrBroccoliDiagnostics"
    private const val PREFS = "mrbroccoli_diagnostics"
    private const val LAST_EXIT_TIMESTAMP = "last_exit_timestamp"
  }

  override fun getName(): String = NAME

  @ReactMethod
  fun consumePostmortemRecords(promise: Promise) {
    val records = Arguments.createArray()
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
      promise.resolve(records)
      return
    }

    try {
      val preferences = reactApplicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      val lastSeen = preferences.getLong(LAST_EXIT_TIMESTAMP, 0L)
      val activityManager =
        reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
      val exits = activityManager.getHistoricalProcessExitReasons(null, 0, 8)
      var newestTimestamp = lastSeen

      exits
        .filter { it.timestamp > lastSeen }
        .sortedBy { it.timestamp }
        .forEach { exit ->
          newestTimestamp = maxOf(newestTimestamp, exit.timestamp)
          records.pushMap(Arguments.createMap().apply {
            putString("source", "android-process-exit")
            putString("reason", exitReasonName(exit.reason))
            putDouble("timestampMs", exit.timestamp.toDouble())
            putInt("importance", exit.importance)
            putDouble("pssBytes", exit.pss.toDouble())
            putDouble("rssBytes", exit.rss.toDouble())
            putInt("status", exit.status)
          })
        }

      if (newestTimestamp > lastSeen) {
        preferences.edit().putLong(LAST_EXIT_TIMESTAMP, newestTimestamp).apply()
      }
      promise.resolve(records)
    } catch (error: Exception) {
      promise.reject("diagnostics_exit_history_failed", "Could not read process exit history.", error)
    }
  }

  @ReactMethod
  fun getDeviceCapabilities(promise: Promise) {
    try {
      val activityManager =
        reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
      val memoryInfo = ActivityManager.MemoryInfo()
      activityManager.getMemoryInfo(memoryInfo)
      val powerManager =
        reactApplicationContext.getSystemService(Context.POWER_SERVICE) as PowerManager
      val thermalState =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          when (powerManager.currentThermalStatus) {
            PowerManager.THERMAL_STATUS_NONE -> "nominal"
            PowerManager.THERMAL_STATUS_LIGHT -> "fair"
            PowerManager.THERMAL_STATUS_MODERATE -> "fair"
            PowerManager.THERMAL_STATUS_SEVERE -> "serious"
            PowerManager.THERMAL_STATUS_CRITICAL -> "critical"
            PowerManager.THERMAL_STATUS_EMERGENCY -> "critical"
            PowerManager.THERMAL_STATUS_SHUTDOWN -> "critical"
            else -> "unknown"
          }
        } else {
          "unknown"
        }

      promise.resolve(Arguments.createMap().apply {
        putString("platform", "android")
        putDouble("physicalMemoryBytes", memoryInfo.totalMem.toDouble())
        putDouble("availableMemoryBytes", memoryInfo.availMem.toDouble())
        putBoolean("memoryLow", memoryInfo.lowMemory)
        putInt("processorCount", Runtime.getRuntime().availableProcessors())
        putInt("activeProcessorCount", Runtime.getRuntime().availableProcessors())
        putString("architecture", Build.SUPPORTED_ABIS.firstOrNull() ?: Build.CPU_ABI)
        putString("osVersion", Build.VERSION.RELEASE)
        putBoolean("lowPowerMode", powerManager.isPowerSaveMode)
        putString("thermalState", thermalState)
      })
    } catch (error: Exception) {
      promise.reject(
        "diagnostics_device_capabilities_failed",
        "Could not inspect device capabilities.",
        error,
      )
    }
  }

  private fun exitReasonName(reason: Int): String =
    when (reason) {
      ApplicationExitInfo.REASON_EXIT_SELF -> "exit-self"
      ApplicationExitInfo.REASON_SIGNALED -> "signaled"
      ApplicationExitInfo.REASON_LOW_MEMORY -> "low-memory"
      ApplicationExitInfo.REASON_CRASH -> "crash"
      ApplicationExitInfo.REASON_CRASH_NATIVE -> "native-crash"
      ApplicationExitInfo.REASON_ANR -> "anr"
      ApplicationExitInfo.REASON_INITIALIZATION_FAILURE -> "initialization-failure"
      ApplicationExitInfo.REASON_PERMISSION_CHANGE -> "permission-change"
      ApplicationExitInfo.REASON_EXCESSIVE_RESOURCE_USAGE -> "excessive-resource-usage"
      ApplicationExitInfo.REASON_USER_REQUESTED -> "user-requested"
      ApplicationExitInfo.REASON_USER_STOPPED -> "user-stopped"
      ApplicationExitInfo.REASON_DEPENDENCY_DIED -> "dependency-died"
      ApplicationExitInfo.REASON_FREEZER -> "freezer"
      ApplicationExitInfo.REASON_PACKAGE_STATE_CHANGE -> "package-state-change"
      ApplicationExitInfo.REASON_PACKAGE_UPDATED -> "package-updated"
      else -> "other-$reason"
    }
}
