import { Image, View } from "react-native";
import React from "react";
import Text from "../../components/UI/Text";
import tw from "twrnc";

const Success = () => {
  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Image
        source={require("../../assets/images/success.png")}
        style={tw`mb-4`}
      />

      <Text type="title" classN="font-[600]" fontWeight="bold" fontSize={32}>
        Password Changed
      </Text>
    </View>
  );
};

export default Success;
