import { ImageBackground, View } from "react-native";
import React from "react";
import DrawerHeader from "../../components/drawer/DrawerHeader";
import tw from "twrnc";
import Text from "../../components/UI/Text";

// Import your background image.
// Make sure to replace the path with your actual image file.
const backgroundImage = require("../../assets/images/aiimage.jpg");

const Scan = () => {
  return (
    // Use the ImageBackground component as the main container
    <ImageBackground
      source={backgroundImage}
      // Apply Tailwind classes directly with `tw`
      style={tw`flex-1 pt-12`}
      resizeMode="cover"
    >
      <DrawerHeader />
      <View style={tw`items-center justify-center`}>
        <View
          style={tw`mt-8 w-[9rem] items-center justify-center h-[35.84px] bg-[#D9E0F2] rounded-full`}
        >
          <Text fontSize={13} type="body" classN={`text-black`}>
            Say Something...
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Scan;
