package com.tobiaswinkler.app.mrbroccoli

import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.os.Process
import android.os.SystemClock
import java.io.File
import java.io.RandomAccessFile
import kotlin.math.abs
import kotlin.math.log10

internal object MrBroccoliPcmWaveFile {
  const val HEADER_BYTES = 44
  const val SAMPLE_RATE = 16_000
  const val CHANNELS = 1
  const val BITS_PER_SAMPLE = 16

  fun defaultFileName(nowMs: Long): String = "native-waveform-$nowMs.wav"

  fun writeHeader(file: RandomAccessFile, pcmDataBytes: Long) {
    require(pcmDataBytes in 0L..0xffff_ffffL) {
      "PCM recording is too large for a WAV file."
    }

    val byteRate = SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE / 8
    val blockAlign = CHANNELS * BITS_PER_SAMPLE / 8
    file.seek(0)
    file.writeBytes("RIFF")
    writeLittleEndianInt(file, pcmDataBytes + 36)
    file.writeBytes("WAVE")
    file.writeBytes("fmt ")
    writeLittleEndianInt(file, 16L)
    writeLittleEndianShort(file, 1)
    writeLittleEndianShort(file, CHANNELS)
    writeLittleEndianInt(file, SAMPLE_RATE.toLong())
    writeLittleEndianInt(file, byteRate.toLong())
    writeLittleEndianShort(file, blockAlign)
    writeLittleEndianShort(file, BITS_PER_SAMPLE)
    file.writeBytes("data")
    writeLittleEndianInt(file, pcmDataBytes)
  }

  private fun writeLittleEndianInt(file: RandomAccessFile, value: Long) {
    repeat(4) { offset ->
      file.write(((value shr (offset * 8)) and 0xff).toInt())
    }
  }

  private fun writeLittleEndianShort(file: RandomAccessFile, value: Int) {
    repeat(2) { offset ->
      file.write((value shr (offset * 8)) and 0xff)
    }
  }
}

internal class MrBroccoliPcmWaveRecorder(
  private val outputFile: File,
  private val onMetering: (Double) -> Unit,
) {
  private val minimumBufferBytes = AudioRecord.getMinBufferSize(
    MrBroccoliPcmWaveFile.SAMPLE_RATE,
    AudioFormat.CHANNEL_IN_MONO,
    AudioFormat.ENCODING_PCM_16BIT,
  )
  private val bufferBytes = maxOf(4_096, minimumBufferBytes)
  private val audioRecord = AudioRecord.Builder()
    .setAudioSource(MediaRecorder.AudioSource.VOICE_RECOGNITION)
    .setAudioFormat(
      AudioFormat.Builder()
        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
        .setSampleRate(MrBroccoliPcmWaveFile.SAMPLE_RATE)
        .setChannelMask(AudioFormat.CHANNEL_IN_MONO)
        .build(),
    )
    .setBufferSizeInBytes(bufferBytes * 2)
    .build()

  @Volatile private var running = false
  @Volatile private var writeFailure: Throwable? = null
  private var output: RandomAccessFile? = null
  private var worker: Thread? = null
  private var pcmDataBytes = 0L

  init {
    require(minimumBufferBytes > 0) {
      "Android could not allocate a speech recording buffer."
    }
    require(audioRecord.state == AudioRecord.STATE_INITIALIZED) {
      "Android could not initialize the speech recorder."
    }
  }

  fun start() {
    check(!running && worker == null) { "The speech recorder is already active." }
    outputFile.parentFile?.mkdirs()
    val nextOutput = RandomAccessFile(outputFile, "rw")
    try {
      nextOutput.setLength(0)
      MrBroccoliPcmWaveFile.writeHeader(nextOutput, 0)
      nextOutput.seek(MrBroccoliPcmWaveFile.HEADER_BYTES.toLong())
      output = nextOutput
      pcmDataBytes = 0
      writeFailure = null
      running = true
      audioRecord.startRecording()
      check(audioRecord.recordingState == AudioRecord.RECORDSTATE_RECORDING) {
        "Android could not start the speech recorder."
      }
      worker = createWorker(nextOutput).also(Thread::start)
    } catch (error: Throwable) {
      running = false
      runCatching { audioRecord.stop() }
      audioRecord.release()
      runCatching { nextOutput.close() }
      output = null
      outputFile.delete()
      throw error
    }
  }

  fun stop() {
    finish(deleteOutput = false)
    writeFailure?.let { throw IllegalStateException("Speech recording failed.", it) }
    require(pcmDataBytes > 0) { "The recording contains no audio samples." }
  }

  fun cancel() {
    finish(deleteOutput = true)
  }

  private fun finish(deleteOutput: Boolean) {
    running = false
    runCatching {
      if (audioRecord.recordingState == AudioRecord.RECORDSTATE_RECORDING) {
        audioRecord.stop()
      }
    }

    worker?.join(2_000)
    if (worker?.isAlive == true) {
      worker?.interrupt()
      worker?.join(500)
    }
    if (worker?.isAlive == true && writeFailure == null) {
      writeFailure = IllegalStateException("Speech recording did not stop in time.")
    }
    worker = null
    audioRecord.release()

    val currentOutput = output
    output = null
    if (currentOutput != null) {
      if (!deleteOutput && writeFailure == null) {
        MrBroccoliPcmWaveFile.writeHeader(currentOutput, pcmDataBytes)
      }
      runCatching { currentOutput.close() }
    }

    if (deleteOutput || writeFailure != null) {
      outputFile.delete()
    }
  }

  private fun createWorker(destination: RandomAccessFile): Thread = Thread(
    {
      Process.setThreadPriority(Process.THREAD_PRIORITY_AUDIO)
      val samples = ShortArray(bufferBytes / 2)
      val encodedSamples = ByteArray(samples.size * 2)
      var peakAmplitude = 0
      var lastEmissionAtMs = SystemClock.elapsedRealtime()

      while (running && !Thread.currentThread().isInterrupted) {
        val samplesRead = try {
          audioRecord.read(
            samples,
            0,
            samples.size,
            AudioRecord.READ_BLOCKING,
          )
        } catch (error: Throwable) {
          if (running) {
            writeFailure = error
          }
          break
        }

        if (samplesRead <= 0) {
          if (running) {
            writeFailure = IllegalStateException(
              "Android speech recording returned error $samplesRead.",
            )
          }
          break
        }

        for (index in 0 until samplesRead) {
          val sample = samples[index].toInt()
          encodedSamples[index * 2] = (sample and 0xff).toByte()
          encodedSamples[index * 2 + 1] = ((sample ushr 8) and 0xff).toByte()
          peakAmplitude = maxOf(peakAmplitude, abs(sample))
        }

        try {
          val byteCount = samplesRead * 2
          destination.write(encodedSamples, 0, byteCount)
          pcmDataBytes += byteCount
        } catch (error: Throwable) {
          writeFailure = error
          break
        }

        val nowMs = SystemClock.elapsedRealtime()
        if (nowMs - lastEmissionAtMs >= 150) {
          val metering = if (peakAmplitude <= 0) {
            -160.0
          } else {
            (20.0 * log10(peakAmplitude.toDouble() / 32_767.0))
              .coerceIn(-160.0, 0.0)
          }
          peakAmplitude = 0
          lastEmissionAtMs = nowMs
          onMetering(metering)
        }
      }
    },
    "MrBroccoliSpeechRecorder",
  )
}
