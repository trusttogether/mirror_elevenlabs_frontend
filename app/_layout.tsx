import "react-native-gesture-handler";
import { View, Text } from "react-native";
import React, { useCallback, useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    "title-regular": require("../assets/fonts/titlefonts/CormorantGaramond-Regular.ttf"),
    "title-bold": require("../assets/fonts/titlefonts/CormorantGaramond-Bold.ttf"),
    "title-bold-italic": require("../assets/fonts/titlefonts/CormorantGaramond-BoldItalic.ttf"),
    "title-italic": require("../assets/fonts/titlefonts/CormorantGaramond-Italic.ttf"),
    "title-medium": require("../assets/fonts/titlefonts/CormorantGaramond-Medium.ttf"),
    body: require("../assets/fonts/textfonts/ProductSansInfanity.ttf"),
  });
  useEffect(() => {
    if (fontError) {
      console.log("Font loading error:", fontError);
    }
  }, [fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts are loaded or if there's an error
      await SplashScreen.hideAsync();
      console.log(
        "Fonts loaded successfully or error occurred, splash screen hidden."
      );
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  // Don't render until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
