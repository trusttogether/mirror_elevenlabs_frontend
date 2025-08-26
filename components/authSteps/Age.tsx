import { TouchableOpacity, View } from "react-native";
import React from "react";
import Text from "../UI/Text";
import tw from "twrnc";

const Age = () => {
  const genders = [
    {
      label: "Under 25",
    },
    {
      label: "25-34",
    },
    {
      label: "35-44",
    },
    {
      label: "45-60",
    },
    {
      label: "Over 60",
    },
  ];

  return (
    <View style={tw`flex-1`}>
      <Text type="title" fontSize={24}>
        How old are you?
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

export default Age;
