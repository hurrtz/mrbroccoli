module.exports = {
  preset: "react-native",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native(-community)?|@react-native-async-storage|react-native-uuid|@testing-library)",
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
