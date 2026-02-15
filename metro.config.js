const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add CSV to recognized asset extensions so dictionary.csv can be bundled
config.resolver.assetExts.push("csv");

// Fix for react-native-svg v15.x resolution issues
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "react-native-svg": path.dirname(require.resolve("react-native-svg")),
};

module.exports = config;
