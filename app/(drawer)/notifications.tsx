import { TouchableOpacity, View, ScrollView } from "react-native";
import React from "react";
import tw from "twrnc";
import Text from "../../components/UI/Text";
import { ArrowLeft, BellOff } from "lucide-react-native";
import { router } from "expo-router";

const Notifications = () => {
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "Skin Analysis Complete",
      subtext: "Your facial scan results are ready to view",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      title: "Daily Reminder",
      subtext: "Don't forget to log your skincare routine today",
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      title: "New Challenge Available",
      subtext: "Join the Hydration Challenge starting tomorrow",
      timestamp: "1 day ago",
    },
    {
      id: 4,
      title: "Progress Update",
      subtext: "You've completed 7 days of your skincare routine!",
      timestamp: "2 days ago",
    },
  ];

  // Check if there are no notifications
  const hasNotifications = notifications.length > 0;

  return (
    <View style={tw`flex-1 px-4 pt-[3.5rem] bg-white`}>
      <View style={tw`flex-row items-center mb-6`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`mr-18`}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text fontWeight="bold" fontSize={24} type="title">
          Notifications
        </Text>
      </View>

      {hasNotifications ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((notification, index) => (
            <View key={notification.id}>
              <View style={tw`py-4`}>
                <View style={tw`flex-1`}>
                  <Text
                    fontWeight="bold"
                    fontSize={16}
                    classN={`mb-1 text-black`}
                  >
                    {notification.title}
                  </Text>
                  <Text type="body" classN={`text-gray-600 mb-2`}>
                    {notification.subtext}
                  </Text>
                  <Text classN={`text-gray-400`}>{notification.timestamp}</Text>
                </View>
              </View>

              {/* Separator line */}
              {index < notifications.length - 1 && (
                <View style={tw`h-[1px] bg-gray-200`} />
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          {/* Empty state */}
          <View style={tw`items-center mb-6`}>
            <View style={tw`relative mb-4`}>
              <BellOff size={64} color="#BFDBFE" />
              <View
                style={tw`absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-500 items-center justify-center`}
              >
                <Text classN={`text-white text-xs font-bold`}>0</Text>
              </View>
            </View>
            <Text fontWeight="bold" fontSize={20} classN={`text-gray-800 mb-2`}>
              No Notifications
            </Text>
            <Text type="body" classN={`text-gray-500 text-center`}>
              You're all caught up! Check back later for updates.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Notifications;
