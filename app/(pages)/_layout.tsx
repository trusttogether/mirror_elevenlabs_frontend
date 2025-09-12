import { View } from "react-native";
import React from "react";
import Text from "../../components/UI/Text";
import { Stack } from "expo-router";

const PagesLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="scan-result" options={{ headerShown: false }} />
      <Stack.Screen name="journals" options={{ headerShown: false }} />
    </Stack>
  );
};

export default PagesLayout;
