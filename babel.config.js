module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Add the reanimated plugin if you're using react-native-reanimated
      "react-native-reanimated/plugin",

      // Or use the new worklets plugin if you have react-native-worklets installed
      // "react-native-worklets/plugin",
    ],
  };
};
