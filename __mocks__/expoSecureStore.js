const values = new Map();
module.exports = {
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
  getItemAsync: jest.fn(async (key) => values.get(key) ?? null),
  setItemAsync: jest.fn(async (key, value) => {
    values.set(key, value);
  }),
  deleteItemAsync: jest.fn(async (key) => {
    values.delete(key);
  }),
  canUseBiometricAuthentication: jest.fn(() => false),
};
