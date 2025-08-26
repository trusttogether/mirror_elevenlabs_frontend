import { TouchableOpacity, View } from "react-native";
import React from "react";
import Text from "../UI/Text";
import tw from "twrnc";
import {
  DrySkinIcon,
  NormalSkinIcon,
  OilySkin,
  SensitiveSkinTypeIcon,
  SkinCombinationIcon,
} from "../../assets/icons/manualIcons";

const Usage = () => {
  const usageType = [
    {
      label: "Have daily conversations with Mira",
      text: "Speak or chat with your smart mirror for ongoing support, insights, an guidance",
    },
    {
      label: "Build healthy wellness habits",
      text: "Set routines and stay consistent with self-care",
    },
    {
      label: "Track how my products are working",
      text: "Use smart tracking features to watch face and skin evolve",
    },
    {
      label: "See visual progress",
      text: "Join guided challenges and build routines",
    },
    {
      label: "Join guided wellness challenges",
      text: "Create step-by-step guided routines to stay motivated and achieve your goals",
    },
    {
      label: "Explore and have fun with Mira",
      text: "Discover features, track casually, and enjoy the journey.",
    },
  ];

  return (
    <View style={tw`flex-1 mb-10`}>
      <Text type="title" fontSize={24}>
        How do you want to use Mirrora?
      </Text>

      <View style={tw`mt-6`}>
        {usageType.map((item, index) => (
          <TouchableOpacity
            style={tw`flex-row gap-5 bg-white items-center py-4 px-5 rounded-[16px] mt-4`}
            key={index}
          >
            <View>
              <Text classN="text-[#222222]" fontSize={16}>
                {item.label}
              </Text>
              <Text fontSize={14} classN="text-[#585858]">
                {item.text}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={tw`flex-row gap-5 bg-white items-center py-6 px-5 rounded-[16px] mt-4`}
        >
          <View>
            <Text classN="text-[#222222]" fontSize={16}>
              Not sure
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Usage;
