import { TouchableOpacity, View } from "react-native";
import React from "react";
import Text from "../UI/Text";
import tw from "twrnc";

const StressLevel = () => {
  const genders = [
    {
      label: "Very low",
    },
    {
      label: "Low",
    },
    {
      label: "Moderate",
    },
    {
      label: "High",
    },
    {
      label: "Very high",
    },
  ];

  return (
    <View style={tw`flex-1`}>
      <Text type="title" fontSize={24}>
        How would you rate your current stress level ?
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

export default StressLevel;
