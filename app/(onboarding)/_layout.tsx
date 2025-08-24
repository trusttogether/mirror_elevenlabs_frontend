import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const OnboardingLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="signin" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
      <Stack.Screen name="manual" options={{ headerShown: false }} />
      <Stack.Screen name="otpverification" options={{ headerShown: false }} />
      <Stack.Screen name="createnewpw" options={{ headerShown: false }} />
    </Stack>
  );
};

export default OnboardingLayout;
