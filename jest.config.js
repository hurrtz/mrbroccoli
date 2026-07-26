module.exports = {
  preset: "react-native",
  setupFiles: ["react-native-gesture-handler/jestSetup"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native(-community)?|@react-native-async-storage|react-native-uuid|@testing-library|@ant-design|@bang88|@expo-google-fonts|rc-util)",
  ],
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/__mocks__/svgMock.js",
    "^@expo/vector-icons/Feather$": "<rootDir>/__mocks__/FeatherIcon.js",
    "^react-native-reanimated$":
      "<rootDir>/__mocks__/reactNativeReanimated.js",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "svg"],
  testMatch: ["**/__tests__/**/*.test.(ts|tsx|js)"],
};
