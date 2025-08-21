import { TouchableOpacity, View, Modal } from "react-native";
import React, { useState } from "react";
import Text from "../UI/Text";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Button from "../UI/Button";
import { router } from "expo-router";
import Foundation from "@expo/vector-icons/Foundation";
import {
  MyChallengesIcon,
  MyJournalIcon,
  NotificationsIcon,
  ScanIcon,
  SettingsIcon,
} from "../../assets/icons/drawerIcons";

const CustomDrawer = ({ ...props }) => {
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Hardcoded user data
  const userData = {
    data: {
      firstName: "John Doe",
      phone: "+1234567890",
      verified: true,
    },
  };

  const hyperLinks = [
    {
      name: "Scans",
      icon: <ScanIcon />,
      route: "/vehicleInfo",
    },
    {
      name: "My Journal",
      icon: <MyJournalIcon />,
      route: "/paymentmethod",
    },
    {
      name: "My Challenges",
      icon: <MyChallengesIcon />,
      route: "/tripDetails",
    },
    {
      name: "Notifications",
      icon: <NotificationsIcon />,
      route: "/settings",
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

  return (
    <>
      <DrawerContentScrollView
        showsVerticalScrollIndicator={false}
        {...props}
        contentContainerStyle={tw`px-0`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <View
            style={tw`bg-[#F7F8F9] items-center rounded-[8px] justify-center px-6 py-2`}
          >
            <Text fontSize={13}>
              {userData?.data?.verified ? "Verified" : "Unverified"}
            </Text>
          </View>
        </View>
        <View
          style={tw`min-h-[10rem] items-center justify-center border-b-[1px] border-gray-200 w-full`}
        >
          <View style={tw`flex-row items-center gap-2`}>
            <View style={tw`h-[4rem] w-[4rem]`}>
              <FontAwesome name="user-circle" size={64} color="#7D7B7B" />
            </View>

            <View>
              <Text type="body" fontSize={17}>
                {userData?.data?.firstName}
              </Text>

              <View style={tw`flex-row items-center gap-2`}>
                <View
                  style={tw`bg-[#F7F8F9] mt-2 items-center rounded-[8px] justify-center px-4 py-1`}
                >
                  <Text fontSize={12} classN="#817C7C">
                    {userData?.data?.phone}
                  </Text>
                </View>

                <View
                  style={tw`bg-[#F7F8F9] flex-row mt-2 items-center rounded-[8px] justify-center px-2 py-1`}
                >
                  <Text fontSize={12} classN="#817C7C">
                    5.0
                  </Text>
                  <Foundation name="star" size={14} color="#FBCA17" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Other links */}
        <View style={tw`mt-[1.5rem] px-3`}>
          {hyperLinks.map((item, index) => (
            <TouchableOpacity
              onPress={() => router.push(item?.route)}
              key={index}
              style={tw`flex-row mb-6 items-center justify-between`}
            >
              <View style={tw`flex-row items-center gap-5`}>
                <View
                  style={tw`h-[3rem] bg-[#FDFDFD] border-solid border-[1px] border-[#E3E3E7] w-[3rem] items-center justify-center rounded-[12px]`}
                >
                  {item.icon}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* logout button */}
        <View style={tw`mt-[4rem]`}>
          <Button
            btnStyle="mt-7 bg-[#F44336]"
            onPress={handleLogoutClick}
            text={true}
            title="Logout"
          />
        </View>
      </DrawerContentScrollView>
    </>
  );
};

export default CustomDrawer;
