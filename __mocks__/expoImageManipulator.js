const context = {
  resize: jest.fn(() => context),
  renderAsync: jest.fn(async () => ({
    saveAsync: jest.fn(async () => ({
      uri: "file:///tmp/processed.jpg",
      width: 100,
      height: 100,
    })),
  })),
};

module.exports = {
  ImageManipulator: {
    manipulate: jest.fn(() => context),
  },
  SaveFormat: {
    JPEG: "jpeg",
    PNG: "png",
    WEBP: "webp",
  },
};
