import {
  View,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef } from "react";
import tw from "twrnc";
import Text from "../../components/UI/Text";
import {
  CameraManualIcon,
  InsightManualIcon,
  MessageManualIcon,
} from "../../assets/icons/manualIcons";
import Button from "../../components/UI/Button";
import { router } from "expo-router";

const Manual = () => {
  const screenWidth = Dimensions.get("window").width;

  // Create animated values for each card
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const translateY1 = useRef(new Animated.Value(20)).current;
  const translateY2 = useRef(new Animated.Value(20)).current;
  const translateY3 = useRef(new Animated.Value(20)).current;

  const cardItems = [
    {
      title: "Voice + Message Interaction",
      body: "Mira is your smart wellness and beauty advisor. She listens, understands, and responds with intelligent, personalized guidance to support your everyday questions and goals.",
      icon: <MessageManualIcon />,
      fadeAnim: fadeAnim1,
      translateY: translateY1,
    },
    {
      title: "Visual Tracking",
      body: "Mirrora captures subtle changes using AI-powered visual tracking- helping you understand your progress and what's working.",
      icon: <CameraManualIcon />,
      fadeAnim: fadeAnim2,
      translateY: translateY2,
    },
    {
      title: "Personalized Insights",
      body: "Mirrora uses daily scans to analyze patterns in your skin, mood, and habits.",
      icon: <InsightManualIcon />,
      fadeAnim: fadeAnim3,
      translateY: translateY3,
    },
  ];

  useEffect(() => {
    // Animate the cards one after another
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim1, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(translateY1, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(translateY2, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim3, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(translateY3, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={tw`relative pb-2 min-h-full`}
    >
      <Image
        source={require("../../assets/images/Rectangle2.png")}
        style={{
          position: "absolute",
          top: -50,
          left: 0,
          width: screenWidth,
          height: "100%",
          resizeMode: "cover",
        }}
      />
      <Image
        source={require("../../assets/images/orb.png")}
        style={tw`w-[140px] h-[147.27px] mt-5 mx-auto`}
        resizeMode="contain"
      />

      <Text type="title" fontSize={34} classN="mx-auto text-center mt-[1rem]">
        How Mirrora Works
      </Text>

      <View style={tw`mt-[2rem]`}>
        {cardItems.map((item, index) => (
          <Animated.View
            key={index}
            style={[
              tw`bg-transparent flex-row items-center rounded-xl p-5 mx-4 mb-6 shadow-md`,
              {
                opacity: item.fadeAnim,
                transform: [{ translateY: item.translateY }],
              },
            ]}
          >
            <View style={tw`mr-4 mt-1`}>{item.icon}</View>

            <View style={tw`flex-1`}>
              <Text type="body" fontSize={18} classN="mb-2 font-semibold">
                {item.title}
              </Text>
              <Text type="body" fontSize={13} classN="text-[#585858] leading-5">
                {item.body}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>

      <View style={tw`mt-12 px-4`}>
        <Button
          onPress={() => router.push("/auth-steps")}
          text={true}
          title="Start My Assignment"
        />

        <TouchableOpacity
          style={tw`items-center justify-center mt-4`}
          onPress={() => router.push(`/scan`)}
        >
          <Text>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Manual;
