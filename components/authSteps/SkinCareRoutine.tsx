import { TouchableOpacity, View } from "react-native";
import React from "react";
import Text from "../UI/Text";
import tw from "twrnc";

const SkinCareRoutine = () => {
  const genders = [
    {
      label: "Everyday",
    },
    {
      label: "Most days",
    },
    {
      label: "A few times a week",
    },
    {
      label: "Rarely",
    },
    {
      label: "I don't have a skincare routine",
    },
  ];

  return (
    <View style={tw`flex-1`}>
      <Text type="title" fontSize={24}>
        How consistent are you with your skincare routine ?
      </Text>

      <View style={tw`mt-6`}>
        {genders.map((gender, index) => (
          <TouchableOpacity
            style={tw`flex-row bg-white items-center py-4 px-8 rounded-full mt-4`}
            key={index}
          >
            <Text key={index}>{gender.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SkinCareRoutine;
