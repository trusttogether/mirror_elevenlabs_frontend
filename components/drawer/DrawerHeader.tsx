import { View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import tw from "twrnc";
import { BurgerIcon, NotificationsIcon } from "../../assets/icons/drawerIcons";

const DrawerHeader = () => {
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
      style={tw`flex-row justify-between items-center px-5 py-4 bg-transparent`}
    >
      {/* Hamburger Menu Button */}
      <TouchableOpacity
        onPress={toggleDrawer}
        style={tw`bg-white rounded-full w-12 h-12 items-center justify-center shadow-md`}
      >
        <BurgerIcon />
      </TouchableOpacity>

      {/* Notifications Button */}
      <TouchableOpacity
        onPress={handleNotifications}
        style={tw`bg-white rounded-full w-12 h-12 items-center justify-center shadow-md`}
      >
        <NotificationsIcon />
      </TouchableOpacity>
    </View>
  );
};

export default DrawerHeader;
