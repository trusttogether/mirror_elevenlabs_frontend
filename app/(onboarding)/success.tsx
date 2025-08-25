import { Image, View } from "react-native";
import React from "react";
import Text from "../../components/UI/Text";
import tw from "twrnc";
import Button from "../../components/UI/Button";
import { router } from "expo-router";

const Success = () => {
  return (
    <View style={tw`flex-1 justify-center px-4`}>
      <Image
        source={require("../../assets/images/success.png")}
        style={tw`mb-4 h-[12rem] mx-auto w-[12rem]`}
      />

      <Text
        type="title"
        classN="font-[600] text-center"
        fontWeight="bold"
        fontSize={32}
      >
        Password Changed
      </Text>

      <Text type="body" classN="my-5 w-[80%] mx-auto text-center" fontSize={15}>
        Click on the sign in button below to continue .
      </Text>
      <Button
        onPress={() => router.push("/signin")}
        text={true}
        title="Sign In"
      />
    </View>
  );
};

export default Success;
