function loadNativeAudioQueue(registered: boolean) {
  const remove = jest.fn();
  const addListener = jest.fn(() => ({ remove }));
  const nativeModule = registered
    ? {
        prepare: jest.fn().mockResolvedValue(true),
        enqueue: jest.fn().mockResolvedValue(true),
        start: jest.fn().mockResolvedValue(true),
        pause: jest.fn().mockResolvedValue(true),
        resume: jest.fn().mockResolvedValue(true),
        stop: jest.fn().mockResolvedValue(true),
      }
    : undefined;

  jest.doMock("react-native", () => ({
    NativeEventEmitter: jest.fn().mockImplementation(() => ({ addListener })),
    NativeModules: registered
      ? { MrBroccoliNativeAudioQueue: nativeModule }
      : {},
  }));

  return {
    service: require("../../src/services/nativeAudioQueue") as typeof import("../../src/services/nativeAudioQueue"),
    nativeModule,
    addListener,
    remove,
  };
}

describe("nativeAudioQueue", () => {
  afterEach(() => {
    jest.resetModules();
    jest.dontMock("react-native");
  });

  it("delegates queue lifecycle operations to the registered native module", async () => {
    const { service, nativeModule } = loadNativeAudioQueue(true);

    expect(service.isNativeAudioQueueAvailable()).toBe(true);
    await expect(service.prepareNativeAudioQueue()).resolves.toBe(true);
    await expect(
      service.enqueueNativeAudioQueueItem({
        uri: "file://speech.wav",
        itemId: "speech-1",
        requestId: "request-1",
        source: "kokoro",
      }),
    ).resolves.toBe(true);
    await expect(service.startNativeAudioQueue()).resolves.toBe(true);
    await expect(service.pauseNativeAudioQueue()).resolves.toBe(true);
    await expect(service.resumeNativeAudioQueue()).resolves.toBe(true);
    await expect(service.stopNativeAudioQueue()).resolves.toBe(true);

    expect(nativeModule?.prepare).toHaveBeenCalledTimes(1);
    expect(nativeModule?.enqueue).toHaveBeenCalledWith(
      "file://speech.wav",
      "speech-1",
      "request-1",
      "kokoro",
    );
    expect(nativeModule?.start).toHaveBeenCalledTimes(1);
    expect(nativeModule?.pause).toHaveBeenCalledTimes(1);
    expect(nativeModule?.resume).toHaveBeenCalledTimes(1);
    expect(nativeModule?.stop).toHaveBeenCalledTimes(1);
  });

  it("uses null native metadata defaults when queue context is omitted", async () => {
    const { service, nativeModule } = loadNativeAudioQueue(true);

    await service.enqueueNativeAudioQueueItem({
      uri: "file://speech.wav",
      itemId: "speech-1",
    });

    expect(nativeModule?.enqueue).toHaveBeenCalledWith(
      "file://speech.wav",
      "speech-1",
      null,
      null,
    );
  });

  it("forwards native queue events and removes the subscription", () => {
    const { service, addListener, remove } = loadNativeAudioQueue(true);
    const listener = jest.fn();

    const unsubscribe = service.subscribeToNativeAudioQueue(listener);

    expect(addListener).toHaveBeenCalledWith(
      "MrBroccoliNativeAudioQueueEvent",
      listener,
    );
    unsubscribe();
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it("returns safe fallbacks when the native queue module is unavailable", async () => {
    const { service, addListener } = loadNativeAudioQueue(false);

    expect(service.isNativeAudioQueueAvailable()).toBe(false);
    await expect(service.prepareNativeAudioQueue()).resolves.toBe(false);
    await expect(
      service.enqueueNativeAudioQueueItem({
        uri: "file://speech.wav",
        itemId: "speech-1",
      }),
    ).resolves.toBe(false);
    await expect(service.startNativeAudioQueue()).resolves.toBe(false);
    await expect(service.pauseNativeAudioQueue()).resolves.toBe(false);
    await expect(service.resumeNativeAudioQueue()).resolves.toBe(false);
    await expect(service.stopNativeAudioQueue()).resolves.toBe(false);

    const unsubscribe = service.subscribeToNativeAudioQueue(jest.fn());
    unsubscribe();
    expect(addListener).not.toHaveBeenCalled();
  });
});
