package com.tobiaswinkler.app.mrbroccoli

import android.util.Base64
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.concurrent.Executors
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec

internal object MrBroccoliBackupKeyDerivation {
  fun pbkdf2Sha256(
    passphrase: String,
    salt: ByteArray,
    iterations: Int,
    keyLength: Int,
  ): ByteArray {
    require(iterations > 0) { "Iterations must be positive." }
    require(keyLength > 0) { "Key length must be positive." }

    val characters = passphrase.toCharArray()
    val spec = PBEKeySpec(characters, salt, iterations, keyLength * 8)
    return try {
      SecretKeyFactory
        .getInstance("PBKDF2WithHmacSHA256")
        .generateSecret(spec)
        .encoded
    } finally {
      characters.fill('\u0000')
      spec.clearPassword()
    }
  }
}

class MrBroccoliBackupCryptoModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
  companion object {
    const val NAME = "MrBroccoliBackupCrypto"
  }

  private val executor = Executors.newSingleThreadExecutor { runnable ->
    Thread(runnable, "mrbroccoli-backup-crypto")
  }

  override fun getName(): String = NAME

  @ReactMethod
  fun pbkdf2Sha256(
    passphrase: String,
    saltBase64: String,
    iterations: Int,
    keyLength: Int,
    promise: Promise,
  ) {
    executor.execute {
      var salt: ByteArray? = null
      var key: ByteArray? = null
      try {
        salt = Base64.decode(saltBase64, Base64.NO_WRAP)
        key = MrBroccoliBackupKeyDerivation.pbkdf2Sha256(
          passphrase = passphrase,
          salt = salt,
          iterations = iterations,
          keyLength = keyLength,
        )
        promise.resolve(Base64.encodeToString(key, Base64.NO_WRAP))
      } catch (error: Exception) {
        promise.reject(
          "backup_key_derivation_failed",
          "Could not derive the backup encryption key.",
          error,
        )
      } finally {
        salt?.fill(0)
        key?.fill(0)
      }
    }
  }

  override fun invalidate() {
    executor.shutdownNow()
    super.invalidate()
  }
}
