import { Image, ScrollView, View } from "react-native";
import React from "react";
import Text from "../../components/UI/Text";
import DrawerHeader from "../../components/drawer/DrawerHeader";
import tw from "twrnc";
import { PlusIcon } from "../../assets/icons/journalIcons";

const MyJournal = () => {
  const refelctionsBlog = [
    {
      title: "Glow Up Journey",
      time: "Last updated: July 20",
      entries: "8 entries",
      url: "../../assets/images/glowup.jpg",
    },
    {
      title: "Hydration Goals",
      time: "Last updated: July 20",
      entries: "2 entries",
      url: "../../assets/images/hydrationgoals.jpg",
    },
    {
      title: "Before & After Archive",
      time: "Last updated: July 20",
      entries: "2 entries",
      url: "../../assets/images/beforeafter.jpg",
    },
    {
      title: "Travel Skin Changes",
      time: "Last updated: July 20",
      entries: "2 entries",
      url: "../../assets/images/beforeafter.jpg",
    },
    {
      title: "Wellness Challenges",
      time: "Last updated: July 20",
      entries: "2 entries",
      url: "../../assets/images/beforeafter.jpg",
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
            style={tw`h-[56.02px] w-[56.02px] rounded-full items-center justify-center bg-white`}
          >
            <PlusIcon />
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={tw``}
        showsVerticalScrollIndicator={false}
      >
        {refelctionsBlog.map((item, index) => (
          <View
            style={tw`bg-white rounded-[11px] h-[99px] p-2 justify-between`}
          ></View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MyJournal;
