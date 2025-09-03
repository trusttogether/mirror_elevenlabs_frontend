import { TouchableOpacity, View, Modal, Image } from "react-native";
import React, { useState } from "react";
import Text from "../UI/Text";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Button from "../UI/Button";
import { router, usePathname } from "expo-router";
import Foundation from "@expo/vector-icons/Foundation";
import {
  LogoutIcon,
  MyChallengesIcon,
  MyJournalIcon,
  NotificationsIcon,
  ScanIcon,
  SettingsIcon,
} from "../../assets/icons/drawerIcons";
import { useToast } from "../UI/ToastManager";
import { useSigninStore } from "../../stores/useSigninStore";

const CustomDrawer = ({ ...props }) => {
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname(); // Get current route path

  const { showToast } = useToast(); // If you have toast notifications
  const { logout, user, clearAuth } = useSigninStore(); // Get logout function and user from store

  console.log(user, "Current User");

  // Hardcoded user data
  const userData = {
    data: {
      firstName: "Sophia Rose",
      phone: "+1234567890",
      verified: true,
    },
  };

  const hyperLinks = [
    {
      name: "Scans",
      icon: <ScanIcon />,
      route: "/scan",
    },
    {
      name: "My Journal",
      icon: <MyJournalIcon />,
      route: "/auth-steps",
    },
    {
      name: "My Challenges",
      icon: <MyChallengesIcon />,
      route: "/my-challenges",
    },
    {
      name: "Notifications",
      icon: <NotificationsIcon />,
      route: "/notifications",
    },
    {
      name: "Settings",
      icon: <SettingsIcon />,
      route: "/settings",
    },
  ];

  const handleLogout = async () => {
    try {
      // Close drawer first
      props.navigation.closeDrawer();

      // Call the logout function from your store
      logout();

      // Clear any additional auth data if needed
      clearAuth();

      // Show success message (optional)
      showToast?.({
        type: "success",
        message: "Logged out successfully",
        description: "You have been logged out",
      });

      router.replace("/signin");

      console.log("Logged out successfully");
    } catch (error) {
      console.log("Logout failed:", error);
      showToast?.({
        type: "error",
        message: "Logout failed",
        description: "Please try again",
      });
    } finally {
      setShowLogoutModal(false);
    }
  };

  // Check if a route is active
  const isRouteActive = (route: any) => {
    return pathname === route;
  };

  return (
    <>
      <DrawerContentScrollView
        showsVerticalScrollIndicator={false}
        {...props}
        contentContainerStyle={tw`px-0 relative bg-white min-h-full`}
      >
        <Image
          style={tw`absolute left-[-2rem]`}
          source={require("../../assets/images/drawerRectangle2.png")}
        />

        <Image
          style={tw`absolute bottom-[-1rem] right-[-2rem]`}
          source={require("../../assets/images/draweRectangle.png")}
        />
        <View
          style={tw`min-h-[10rem] items-start justify-center border-b-[1px] border-gray-200 px-4 w-full`}
        >
          <View style={tw`flex-row items-center gap-4`}>
            <View style={tw`h-[4rem] w-[4rem]`}>
              <FontAwesome name="user-circle" size={64} color="#7D7B7B" />
            </View>

            <View>
              <Text type="body" fontSize={17}>
                {user?.name || "User"}
              </Text>

              <View style={tw`flex-row items-center gap-2`}>
                <View
                  style={tw`mt-2 items-center rounded-[8px] justify-center`}
                >
                  <Text fontSize={12} classN="#817C7C">
                    Edit Profile
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Other links */}
        <View style={tw`mt-[1.5rem] px-3`}>
          {hyperLinks.map((item, index) => {
            const isActive = isRouteActive(item.route);

            return (
              <TouchableOpacity
                onPress={() => router.push(item?.route)}
                key={index}
                style={[
                  tw`flex-row items-center justify-between p-3`,
                  isActive && tw`bg-black/4`, // Gray background for active route
                ]}
              >
                <View style={tw`flex-row items-center gap-3`}>
                  <View
                    style={[
                      tw`h-[3rem] bg-transparent w-[3rem] items-center justify-center rounded-[12px]`,
                    ]}
                  >
                    {item.icon}
                  </View>

                  <Text
                    type="body"
                    fontSize={18}
                    classN={isActive ? "text-gray-800 font-medium" : ""} // Bold text for active route
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* logout button */}
        <View style={tw`mt-[7rem] px-5`}>
          <TouchableOpacity
            style={tw`flex-row items-center gap-3 p-3 rounded-xl`}
            onPress={handleLogout}
          >
            <View
              style={tw`h-[3rem] w-[3rem] items-center justify-center rounded-[12px] bg-[#FDFDFD]`}
            >
              <LogoutIcon />
            </View>
            <Text type="body" fontSize={18}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </>
  );
};

export default CustomDrawer;
