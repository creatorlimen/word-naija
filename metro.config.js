const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add CSV to recognized asset extensions so dictionary.csv can be bundled
config.resolver.assetExts.push("csv");

module.exports = config;
