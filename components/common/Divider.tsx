import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import Text from "../UI/Text";

const Divider = () => {
  return (
    <View style={tw`flex-row justify-center items-center mt-4`}>
      <View style={tw`w-[40%] h-[.1rem] bg-[#E2E2E2]`} />
      <Text classN="mx-2 text-[#585858]" fontSize={12}>
        Or
      </Text>
      <View style={tw`w-[40%] h-[.1rem] bg-[#E2E2E2]`} />
    </View>
  );
};

export default Divider;
