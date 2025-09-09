// app/_layout.tsx
import "react-native-gesture-handler";
import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "../components/UI/ToastManager";
import { useSigninStore } from "../stores/useSigninStore";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    "title-regular": require("../assets/fonts/titlefonts/CormorantGaramond-Regular.ttf"),
    "title-bold": require("../assets/fonts/titlefonts/CormorantGaramond-Bold.ttf"),
    "title-bold-italic": require("../assets/fonts/titlefonts/CormorantGaramond-BoldItalic.ttf"),
    "title-italic": require("../assets/fonts/titlefonts/CormorantGaramond-Italic.ttf"),
    "title-medium": require("../assets/fonts/titlefonts/CormorantGaramond-Medium.ttf"),
    body: require("../assets/fonts/textfonts/ProductSansInfanity.ttf"),
  });

  const [isAppReady, setIsAppReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const { token, user } = useSigninStore();

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    if (fontError) {
      console.log("Font loading error:", fontError);
    }
  }, [fontError]);

  // Check authentication status and redirect accordingly
  useEffect(() => {
    if (isAppReady) {
      const inAuthGroup = segments[0] === "(auth)";
      const inOnboardingGroup = segments[0] === "(onboarding)";

      // Don't redirect if we're already in auth or onboarding
      if (inAuthGroup || inOnboardingGroup) return;

      if (!isAuthenticated) {
        router.push("/");
      } else {
        router.replace("/scan");
      }
    }
  }, [isAppReady, isAuthenticated]); // Removed segments from dependency

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts are loaded or if there's an error
      await SplashScreen.hideAsync();
      setIsAppReady(true);
      console.log("App is ready, splash screen hidden.");
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
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToastProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(onboarding)"
              options={{ headerShown: false }}
            />
          </Stack>
        </ToastProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default RootLayout;
