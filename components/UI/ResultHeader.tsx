import { View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import tw from "twrnc";
import { BurgerIcon, NotificationsIcon } from "../../assets/icons/drawerIcons";
import Text from "../UI/Text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

interface DrawerHeaderprops {
  title?: string;
  button?: React.ReactNode;
  action?: () => void;
  goBack?: () => void;
}

const ResultHeader = ({ title, button, action, goBack }: DrawerHeaderprops) => {
  const navigation = useNavigation();

  const toggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const handleNotifications = () => {
    console.log("Notifications pressed");
    // Add your notifications logic here
  };

  return (
    <View
      style={tw`flex-row justify-between items-center px-4 py-4 bg-transparent`}
    >
      <TouchableOpacity
        onPress={goBack}
        style={tw`bg-white rounded-full w-12 h-12 items-center justify-center shadow-md`}
      >
        <MaterialIcons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Notifications Button */}

      {title ? (
        <Text type="title" fontSize={20}>
          {title}
        </Text>
      ) : (
        <View
          style={tw`w-[148px] items-center justify-center h-[42px] rounded-full bg-white`}
        >
          <Text fontSize={14} type="body">
            Scan complete
          </Text>
        </View>
      )}

      {button ? (
        <TouchableOpacity style={tw``} onPress={action}>
          {button}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleNotifications}
          style={tw`bg-white rounded-full w-12 h-12 items-center justify-center shadow-md`}
        >
          <MaterialIcons name="replay" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ResultHeader;
