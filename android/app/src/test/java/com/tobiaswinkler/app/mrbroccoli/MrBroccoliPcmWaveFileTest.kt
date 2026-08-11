package com.tobiaswinkler.app.mrbroccoli

import java.io.File
import java.io.RandomAccessFile
import java.nio.ByteBuffer
import java.nio.ByteOrder
import org.junit.Assert.assertEquals
import org.junit.Test

class MrBroccoliPcmWaveFileTest {
  @Test
  fun `native capture uses a wave file name`() {
    assertEquals(
      "native-waveform-1234.wav",
      MrBroccoliPcmWaveFile.defaultFileName(1_234),
    )
  }

  @Test
  fun `writes a mono 16 kilohertz pcm wave header`() {
    val outputFile = File.createTempFile("mrbroccoli-recording-", ".wav")
    try {
      RandomAccessFile(outputFile, "rw").use { file ->
        MrBroccoliPcmWaveFile.writeHeader(file, 32_000)
      }

      val header = outputFile.readBytes()
      val littleEndian = ByteBuffer.wrap(header).order(ByteOrder.LITTLE_ENDIAN)
      assertEquals("RIFF", header.copyOfRange(0, 4).toString(Charsets.US_ASCII))
      assertEquals(32_036, littleEndian.getInt(4))
      assertEquals("WAVE", header.copyOfRange(8, 12).toString(Charsets.US_ASCII))
      assertEquals("fmt ", header.copyOfRange(12, 16).toString(Charsets.US_ASCII))
      assertEquals(16, littleEndian.getInt(16))
      assertEquals(1, littleEndian.getShort(20).toInt())
      assertEquals(1, littleEndian.getShort(22).toInt())
      assertEquals(16_000, littleEndian.getInt(24))
      assertEquals(32_000, littleEndian.getInt(28))
      assertEquals(2, littleEndian.getShort(32).toInt())
      assertEquals(16, littleEndian.getShort(34).toInt())
      assertEquals("data", header.copyOfRange(36, 40).toString(Charsets.US_ASCII))
      assertEquals(32_000, littleEndian.getInt(40))
    } finally {
      outputFile.delete()
    }
  }
}
