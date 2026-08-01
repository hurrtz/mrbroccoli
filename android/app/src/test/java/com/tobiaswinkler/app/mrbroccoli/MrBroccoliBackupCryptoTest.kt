package com.tobiaswinkler.app.mrbroccoli

import org.junit.Assert.assertEquals
import org.junit.Test

class MrBroccoliBackupCryptoTest {
  @Test
  fun derivesTheStandardPbkdf2HmacSha256Vector() {
    val key = MrBroccoliBackupKeyDerivation.pbkdf2Sha256(
      passphrase = "password",
      salt = "salt".toByteArray(Charsets.UTF_8),
      iterations = 1,
      keyLength = 32,
    )

    assertEquals(
      "120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b",
      key.joinToString("") { byte -> "%02x".format(byte.toInt() and 0xff) },
    )
  }
}
