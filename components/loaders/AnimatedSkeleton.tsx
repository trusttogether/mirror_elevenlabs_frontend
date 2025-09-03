import { TouchableOpacity, View, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import tw from "twrnc";

// Animated Skeleton Component with Shimmer Effect
const AnimatedSkeleton = ({ type }: { type: "text" | "option" }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateShimmer();

    return () => {
      shimmerAnim.stopAnimation();
    };
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  if (type === "text") {
    return (
      <View style={tw`h-8 bg-gray-200 rounded-full w-3/4 mb-6 overflow-hidden`}>
        <Animated.View
          style={[
            tw`absolute top-0 left-0 right-0 bottom-0 bg-gray-300`,
            { transform: [{ translateX }] },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={tw`flex-row items-center p-4 rounded-full mt-4 bg-gray-200 overflow-hidden`}
    >
      <View style={tw`w-6 h-6 bg-gray-300 rounded-full mr-3 overflow-hidden`}>
        <Animated.View
          style={[
            tw`absolute top-0 left-0 right-0 bottom-0 bg-gray-400`,
            { transform: [{ translateX }] },
          ]}
        />
      </View>
      <View style={tw`h-4 bg-gray-300 rounded-full flex-1 overflow-hidden`}>
        <Animated.View
          style={[
            tw`absolute top-0 left-0 right-0 bottom-0 bg-gray-400`,
            { transform: [{ translateX }] },
          ]}
        />
      </View>
    </View>
  );
};

export default AnimatedSkeleton;
