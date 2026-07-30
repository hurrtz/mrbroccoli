describe("nativeWaveform", () => {
  afterEach(() => {
    jest.resetModules();
    jest.dontMock("react-native");
  });

  it("forwards native speech recording lifecycle calls", async () => {
    const startRecording = jest.fn(async () => ({ uri: "file:///recording.wav" }));
    const stopRecording = jest.fn(async () => ({ uri: "file:///recording.wav" }));
    const cancelRecording = jest.fn(async () => true);
    const startAmbientMonitoring = jest.fn(async () => ({
      audioRoute: "built-in",
    }));
    const stopAmbientMonitoring = jest.fn(async () => true);
    jest.doMock("react-native", () => ({
      NativeEventEmitter: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(() => ({ remove: jest.fn() })),
      })),
      NativeModules: {
        MrBroccoliNativeWaveform: {
          startRecording,
          stopRecording,
          cancelRecording,
          startAmbientMonitoring,
          stopAmbientMonitoring,
        },
      },
    }));

    const {
      cancelNativeWaveformRecording,
      isNativeAmbientMonitoringAvailable,
      isNativeWaveformAvailable,
      startNativeAmbientMonitoring,
      startNativeWaveformRecording,
      stopNativeAmbientMonitoring,
      stopNativeWaveformRecording,
    } = require("../../src/services/nativeWaveform");

    expect(isNativeWaveformAvailable()).toBe(true);
    expect(isNativeAmbientMonitoringAvailable()).toBe(true);
    await startNativeWaveformRecording({
      sessionId: "recording-1",
      outputUri: "file:///recording.wav",
    });
    await stopNativeWaveformRecording("recording-1");
    await cancelNativeWaveformRecording("recording-1");
    await startNativeAmbientMonitoring("ambient-1");
    await stopNativeAmbientMonitoring("ambient-1");

    expect(startRecording).toHaveBeenCalledWith(
      "recording-1",
      "file:///recording.wav",
    );
    expect(stopRecording).toHaveBeenCalledWith("recording-1");
    expect(cancelRecording).toHaveBeenCalledWith("recording-1");
    expect(startAmbientMonitoring).toHaveBeenCalledWith("ambient-1");
    expect(stopAmbientMonitoring).toHaveBeenCalledWith("ambient-1");
  });
});
