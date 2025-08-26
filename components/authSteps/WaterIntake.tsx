import { TouchableOpacity, View } from "react-native";
import React from "react";
import Text from "../UI/Text";
import tw from "twrnc";

const WaterIntake = () => {
  const genders = [
    {
      label: "Less than 1 liter",
    },
    {
      label: "1-2 liters",
    },
    {
      label: "2-3 liters",
    },
    {
      label: "More than 3 liters",
    },
    {
      label: "Not sure",
    },
  ];

  return (
    <View style={tw`flex-1`}>
      <Text type="title" fontSize={24}>
        How much water do you drink per day?
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

export default WaterIntake;
