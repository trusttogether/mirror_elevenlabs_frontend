import { TouchableOpacity, View } from "react-native";
import React from "react";
import Text from "../UI/Text";
import tw from "twrnc";
import { GenederStepIcon } from "../../assets/icons/manualIcons";

const Gender = () => {
  const genders = [
    {
      label: "Female",
    },
    {
      label: "Male",
    },
    {
      label: "Non-binary",
    },
    {
      label: "Prefer not to say",
    },
  ];

  return (
    <View style={tw`flex-1`}>
      <Text type="title" fontSize={24}>
        What gener do you identify with?
      </Text>

      <View style={tw`mt-6`}>
        {genders.map((gender, index) => (
          <TouchableOpacity
            style={tw`flex-row bg-white items-center p-4 rounded-full mt-4`}
            key={index}
          >
            <GenederStepIcon />
            <Text key={index}>{gender.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Gender;
