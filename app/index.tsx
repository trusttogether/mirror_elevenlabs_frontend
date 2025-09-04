import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { BlurView } from "expo-blur";
import Text from "../components/UI/Text";
import { router } from "expo-router";

const Index = () => {
  return (
    <View style={tw`flex-1`}>
      <ImageBackground
        source={require("../assets/images/indeximage.jpg")}
        style={tw`flex-1 w-full h-full`}
        resizeMode="cover"
      >
        {/* Overlay layer */}
        <View
          style={tw`absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40`}
        />

        {/* Company Logo */}
        <View style={tw`items-center mt-10 z-10`}>
          <Image
            source={require("../assets/images/whitemirrora.png")}
            style={tw`w-44 h-44`}
            resizeMode="contain"
          />
        </View>

        {/* Centered Glass panel */}
        <View style={tw`flex-1 justify-end pb-[7rem] items-center px-2 z-10`}>
          {/* Expo BlurView for glass effect */}
          <BlurView
            intensity={20} // Controls the blur intensity (0-100)
            tint="light" // 'light', 'dark', or 'default'
            style={[
              styles.glassCardContainer,
              tw`rounded-[63px] border-solid border-[1px] border-white h-[347px] w-full max-w-md overflow-hidden`,
            ]}
          >
            {/* Semi-transparent overlay for better glass effect */}
            <View
              style={tw`bg-white bg-opacity-10 h-full justify-center p-8 border border-white border-opacity-30 rounded-[63px]`}
            >
              <Text
                fontSize={30}
                type="title"
                fontWeight="bold"
                classN="text-white text-center"
              >
                Welcome to Mirrora
              </Text>
              <Text
                type="body"
                fontWeight="medium"
                classN={`text-[#DADADA] text-center mb-8 text-sm leading-6`}
              >
                Your AI-powered mirror for personalized beauty and wellness
                guidance
              </Text>

              <View style={tw`justify-between gap-2`}>
                <TouchableOpacity
                  onPress={() => router.push("/signup")}
                  style={tw`bg-black py-4 px-6 rounded-full`}
                >
                  <Text
                    fontWeight="medium"
                    type="body"
                    classN={`text-white text-center font-bold`}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push("/signin")}
                  style={tw`py-4 px-6 rounded-full border border-white mt-2`}
                >
                  <Text
                    fontWeight="medium"
                    type="body"
                    classN={`text-white text-center font-bold`}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333", // A darker background helps the glass effect stand out
  },
  backgroundContent: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  glassCardContainer: {
    overflow: "hidden", // Crucial for blur to respect border radius
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Index;
