jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("react-native-safe-area-context", () => {
  const actual = jest.requireActual("react-native-safe-area-context");
  return {
    ...actual,
    useSafeAreaInsets: jest.fn(() => ({
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    })),
    // The real provider withholds its children until a native layout event
    // reports insets, which never arrives under test. Screens presented in a
    // full-screen modal carry their own provider, so without this they render
    // as an empty shell.
    SafeAreaProvider: ({ children }) => children,
  };
});

jest.mock("expo-speech", () => ({
  getAvailableVoicesAsync: jest.fn(() => Promise.resolve([])),
}));

jest.mock("@dr.pogodin/react-native-fs", () => ({
  DocumentDirectoryPath: "/tmp",
  exists: jest.fn(() => Promise.resolve(false)),
  unlink: jest.fn(() => Promise.resolve()),
}));
