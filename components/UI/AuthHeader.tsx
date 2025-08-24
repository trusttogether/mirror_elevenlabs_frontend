import { Image, TouchableOpacity, View } from "react-native";
import React from "react";
import Text from "./Text";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import tw from "twrnc";
import { BlurView } from "expo-blur";

interface AuthHeaderProps {
  title: string;
  className?: string;
}

const AuthHeader = ({ title, className = "h-[10rem]" }: AuthHeaderProps) => {
  return (
    <View style={tw`px-4 ${className} justify-end w-full relative`}>
      <Image
        source={require("../../assets/images/Rectangle.png")}
        style={tw`absolute top-[-1rem] right-[-1rem]`}
      />
      <TouchableOpacity style={tw`mb-2`} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text classN="font-[600]" fontWeight="bold" type="title" fontSize={32}>
        {title}
      </Text>
    </View>
  );
};

export default AuthHeader;
