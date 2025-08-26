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

const SkinType = () => {
  const skinType = [
    {
      label: "Oily",
      text: "Shiny, enlarged pores, prone to acne",
      icon: <OilySkin />,
    },
    {
      label: "Dry",
      text: "Flaky, dull, tight",
      icon: <DrySkinIcon />,
    },
    {
      label: "Normal",
      text: "Balanced, clear, not sensitive",
      icon: <NormalSkinIcon />,
    },
    {
      label: "Combination",
      text: "Oily in T-zone, dry elsewhere",
      icon: <SkinCombinationIcon />,
    },
    {
      label: "Sensitive",
      text: "Easily irritated or reactive",
      icon: <SensitiveSkinTypeIcon />,
    },
  ];

  return (
    <View style={tw`flex-1`}>
      <Text type="title" fontSize={24}>
        What is your skin type?
      </Text>

      <View style={tw`mt-6`}>
        {skinType.map((item, index) => (
          <TouchableOpacity
            style={tw`flex-row gap-5 bg-white items-center py-4 px-5 rounded-full mt-4`}
            key={index}
          >
            {item?.icon}
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
          style={tw`flex-row gap-5 bg-white items-center py-6 px-5 rounded-full mt-4`}
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

export default SkinType;
