import { TouchableOpacity, View } from "react-native";
import React from "react";
import Text from "../UI/Text";
import tw from "twrnc";

const SkinReactions = () => {
  const genders = [
    {
      label: "Very fair, always burns, never tans",
    },
    {
      label: "Fair, usually burns, tans poorly",
    },
    {
      label: "Medium, sometimes mild burn, tans gradually ",
    },
    {
      label: "Olive/light brown, rarely burns, tans easily",
    },
    {
      label: "Brown, very rarely brown, tans well",
    },
    {
      label: "Deep brown, never burns, deeply pigmented",
    },
  ];

  return (
    <View style={tw`flex-1`}>
      <Text type="title" fontSize={24}>
        How does your skin usually react to the sun ?
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

export default SkinReactions;
