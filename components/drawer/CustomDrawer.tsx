import { TouchableOpacity, View, Modal } from "react-native";
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

const CustomDrawer = ({ ...props }) => {
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname(); // Get current route path

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
      route: "/my-journal",
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
      props.navigation.closeDrawer();
      setShowLogoutModal(false);
      router.replace("/welcome");
      console.log("Logged out successfully (demo)");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  const handleLogoutClick = () => {
    props.navigation.closeDrawer();
    setTimeout(() => {
      setShowLogoutModal(true);
    }, 200);
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
        contentContainerStyle={tw`px-0 bg-white min-h-full`}
      >
        <View
          style={tw`min-h-[10rem] items-start justify-center border-b-[1px] border-gray-200 px-4 w-full`}
        >
          <View style={tw`flex-row items-center gap-4`}>
            <View style={tw`h-[4rem] w-[4rem]`}>
              <FontAwesome name="user-circle" size={64} color="#7D7B7B" />
            </View>

            <View>
              <Text type="body" fontSize={17}>
                {userData?.data?.firstName}
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
        <View style={tw`mt-[12rem] px-5`}>
          <TouchableOpacity
            style={tw`flex-row items-center gap-3 p-3 rounded-xl`}
            onPress={handleLogoutClick}
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
