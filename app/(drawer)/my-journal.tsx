import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import React from "react";
import Text from "../../components/UI/Text";
import DrawerHeader from "../../components/drawer/DrawerHeader";
import tw from "twrnc";
import { PlusIcon, ToolIcon } from "../../assets/icons/journalIcons";

const MyJournal = () => {
  const refelctionsBlog = [
    {
      title: "Glow Up Journey",
      time: "Last updated: July 20",
      entries: "8 entries",
      url: require("../../assets/images/glowup.jpg"),
    },
    {
      title: "Hydration Goals",
      time: "Last updated: July 20",
      entries: "2 entries",
      url: require("../../assets/images/hydrationgoals.jpg"),
    },
    {
      title: "Before & After Archive",
      time: "Last updated: July 20",
      entries: "2 entries",
      url: require("../../assets/images/beforeafter.jpg"),
    },
    {
      title: "Travel Skin Changes",
      time: "Last updated: July 20",
      entries: "2 entries",
      url: require("../../assets/images/beforeafter.jpg"),
    },
    {
      title: "Wellness Challenges",
      time: "Last updated: July 20",
      entries: "2 entries",
      url: require("../../assets/images/beforeafter.jpg"),
    },
  ];

  return (
    <View style={tw`pt-12 relative flex-1`}>
      <Image
        style={tw`absolute left-[-2rem]`}
        source={require("../../assets/images/drawerRectangle2.png")}
      />

      <Image
        style={tw`absolute bottom-[-1rem] right-[-2rem]`}
        source={require("../../assets/images/draweRectangle.png")}
      />
      <DrawerHeader
        title="My Daily Reflection"
        button={
          <View
            style={tw`h-[56.02px] shadow-md w-[56.02px] rounded-full items-center justify-center bg-white`}
          >
            <PlusIcon />
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={tw`px-4 mt-[1.3rem]`}
        showsVerticalScrollIndicator={false}
      >
        {refelctionsBlog.map((item, index) => (
          <View
            style={tw`bg-white mb-4 rounded-[11px] h-[99px] p-2 flex-row items-center justify-between`}
          >
            <View style={tw`flex-row items-center gap-2`}>
              <Image
                source={item?.url}
                style={tw`h-[83px] w-[83px] object-cover rounded-[7px]`}
              />

              <View>
                <Text classN="" type="title" fontSize={18} fontWeight="medium">
                  {item?.title}
                </Text>

                <Text type="body" fontSize={14} classN="text-[#585858] my-1">
                  {item?.time}
                </Text>
                <Text type="body" fontSize={14} classN="text-[#585858]">
                  {item?.entries}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={tw`bg-[#F5F5F5F5] h-[35px] w-[35px] items-center justify-center rounded-full`}
            >
              <ToolIcon />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MyJournal;
