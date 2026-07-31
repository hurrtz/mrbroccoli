module.exports = {
  preset: "react-native",
  setupFiles: [
    "react-native-gesture-handler/jestSetup",
    "<rootDir>/jest.setup.js",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native(-community)?|@react-native-async-storage|react-native-uuid|@testing-library|@ant-design|@bang88|@expo-google-fonts|rc-util)",
  ],
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/__mocks__/svgMock.js",
    "^@expo/vector-icons/Feather$": "<rootDir>/__mocks__/FeatherIcon.js",
    "^expo-keep-awake$": "<rootDir>/__mocks__/expoKeepAwake.js",
    "^expo-clipboard$": "<rootDir>/__mocks__/expoClipboard.js",
    "^expo-file-system$": "<rootDir>/__mocks__/expoFileSystem.js",
    "^expo-file-system/legacy$":
      "<rootDir>/__mocks__/expoFileSystemLegacy.js",
    "^expo-crypto$": "<rootDir>/__mocks__/expoCrypto.js",
    "^expo-document-picker$":
      "<rootDir>/__mocks__/expoDocumentPicker.js",
    "^expo-sharing$": "<rootDir>/__mocks__/expoSharing.js",
    "^react-native-reanimated$":
      "<rootDir>/__mocks__/reactNativeReanimated.js",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "svg"],
  testMatch: ["**/__tests__/**/*.test.(ts|tsx|js)"],
};
