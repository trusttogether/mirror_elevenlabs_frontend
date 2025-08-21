import { ImageBackground, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DrawerHeader from "../../components/drawer/DrawerHeader";
import tw from "twrnc";
import Text from "../../components/UI/Text";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import {
  ChatIcon,
  FacialVerificationIcon,
  VoiceChatIcon,
} from "../../assets/icons/scanIcons";

const Scan = () => {
  const backgroundImage = require("../../assets/images/aiimage.jpg");
  const [activeButton, setActiveButton] = useState("face"); // Track active button

  return (
    <ImageBackground
      source={backgroundImage}
      style={tw`flex-1 pt-12`}
      resizeMode="cover"
    >
      <DrawerHeader />

      {/* <View style={tw`items-center justify-center`}>
        <View
          style={tw`mt-8 w-[9rem] items-center justify-center h-[35.84px] bg-[#D9E0F2] rounded-full`}
        >
          <Text fontSize={13} type="body" classN={`text-black`}>
            Say Something...
          </Text>
        </View>
      </View> */}

      {/* Bottom buttons container */}
      <View
        style={tw`absolute bottom-20 left-0 right-0 flex-row justify-center items-center gap-6`}
      >
        {/* Voice Control Button */}
        <TouchableOpacity
          style={tw`w-16 h-16 rounded-full bg-black bg-opacity-30 items-center justify-center border border-white border-opacity-50`}
          onPress={() => setActiveButton("voice")}
        >
          <VoiceChatIcon />
        </TouchableOpacity>

        {/* Facial Scan Button (Active Focus) */}
        <TouchableOpacity
          style={[
            tw`w-20 h-20 rounded-full items-center justify-center border-2`,
            activeButton === "face"
              ? tw`bg-white bg-opacity-20 border-white`
              : tw`bg-black bg-opacity-30 border-white border-opacity-50`,
          ]}
          onPress={() => setActiveButton("face")}
        >
          <FacialVerificationIcon />
        </TouchableOpacity>

        {/* Chat Button */}
        <TouchableOpacity
          style={tw`w-16 h-16 rounded-full bg-black bg-opacity-30 items-center justify-center border border-white border-opacity-50`}
          onPress={() => setActiveButton("chat")}
        >
          <ChatIcon />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Scan;
