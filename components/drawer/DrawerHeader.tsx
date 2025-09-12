import { View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import tw from "twrnc";
import { BurgerIcon, NotificationsIcon } from "../../assets/icons/drawerIcons";
import Text from "../UI/Text";
import { router } from "expo-router";

interface DrawerHeaderprops {
  title?: string;
  button?: React.ReactNode;
  action?: () => void;
}

const DrawerHeader = ({ title, button, action }: DrawerHeaderprops) => {
  const navigation = useNavigation();

  const toggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const handleNotifications = () => {
    router.push("/notifications");
    // Add your notifications logic here
  };

  return (
    <View
      style={tw`flex-row justify-between items-center px-4 py-4 bg-transparent`}
    >
      {/* Hamburger Menu Button */}
      <TouchableOpacity
        onPress={toggleDrawer}
        style={tw`bg-white rounded-full w-12 h-12 items-center justify-center shadow-md`}
      >
        <BurgerIcon />
      </TouchableOpacity>

      {/* Notifications Button */}

      {title && (
        <Text type="title" fontSize={20}>
          {title}
        </Text>
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
          <NotificationsIcon />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DrawerHeader;
