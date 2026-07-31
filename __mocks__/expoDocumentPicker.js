module.exports = {
  getDocumentAsync: jest.fn(async () => ({
    assets: null,
    canceled: true,
  })),
};
