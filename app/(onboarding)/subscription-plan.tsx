import { Image, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Text from "../../components/UI/Text";
import tw from "twrnc";
import { CancelIcon } from "../../assets/icons/authIcons";
import { BlackTickIcon } from "../../assets/icons/scanIcons";
import Button from "../../components/UI/Button";
import { router } from "expo-router";

const SubscriptionPlan = () => {
  const [active, setActive] = useState("weekly");

  const planDetails = [
    {
      text: "Unlimited facial scans, reports a month",
    },

    {
      text: "⁠Unlimited text chat with Mira",
    },
    {
      text: "Unlimited Journal Storage",
    },
    {
      text: "Unlimited number of challenges",
    },
    {
      text: "Access all App’s features",
    },
    {
      text: "60 minutes voice chat with Mira per day",
    },
  ];

  return (
    <View style={tw`flex-1 px-3 bg-white relative mt-[2rem] relative`}>
      <Image
        style={tw`absolute`}
        source={require("../../assets/images/ellipse.png")}
      />

      <Image
        style={tw`absolute top-[-12rem]`}
        source={require("../../assets/images/ellipse2.png")}
      />

      <TouchableOpacity
        onPress={() => router.push("scan")}
        style={tw`rounded-full mb-[1.5rem] bg-white items-center justify-center h-[40px] w-[40px]`}
      >
        <CancelIcon />
      </TouchableOpacity>

      <Text type="title" fontWeight="bold" fontSize={32}>
        Unlock access to all our best features
      </Text>

      <View style={tw`mt-[1.3rem]`}>
        {planDetails.map((item, index) => (
          <View key={index} style={tw`flex-row mb-3 items-center gap-1`}>
            <BlackTickIcon />

            <Text type="body" fontSize={14}>
              {item.text}
            </Text>
          </View>
        ))}
      </View>

      <View style={tw`mt-[1.3rem]`}>
        <Text type="title" fontWeight="bold" fontSize={26}>
          Choose your plan
        </Text>

        <View>
          <TouchableOpacity
            onPress={() => setActive("weekly")}
            style={tw`mt-[1.2rem] justify-center h-[113px] relative px-[1rem] bg-white rounded-[10px] ${
              active === "weekly"
                ? "border-solid border-[3px] border-black"
                : ""
            }`}
          >
            <View
              style={tw`h-[31px] items-center top-[-1rem] left-[1rem] justify-center absolute w-[152.21px] rounded-full bg-[#F5F5DC]`}
            >
              <Text type="body" fontSize={10}>
                Best Value-2 months free
              </Text>
            </View>

            <Text type="title" fontSize={26}>
              Weekly
            </Text>

            <View style={tw`flex-row items-center justify-between`}>
              <Text type="body" fontSize={14} classN="text-[#595D62]">
                Get 3 days free trial
              </Text>

              <Text fontSize={20} classN="font-[700]">
                $3.99 /
                <Text type="body" fontSize={14} classN="text-[#595D62]">
                  weeks
                </Text>
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActive("monthly")}
            style={tw`mt-[1.2rem] justify-center h-[113px] relative px-[1rem] bg-white rounded-[10px] ${
              active === "monthly"
                ? "border-solid border-[3px] border-black"
                : ""
            }`}
          >
            <Text type="title" fontSize={26}>
              Monthly
            </Text>

            <View style={tw`flex-row items-center justify-between`}>
              <Text type="body" fontSize={14} classN="text-[#595D62]">
                Get 7 days free trial
              </Text>

              <Text fontSize={20} classN="font-[700]">
                $11.99 /
                <Text type="body" fontSize={14} classN="text-[#595D62]">
                  month
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`mt-[2rem]`}>
        <Button
          text={true}
          title={`Start ${active === "weekly" ? "3" : "7"} days free trial`}
        />
        <Text fontSize={16} classN="text-[#888888] text-center mt-[1rem]">
          {active === "weekly" ? "3 days" : "7 days"} free trial then{" "}
          {active === "weekly" ? "$3.99 per week" : "$11.99 per month"}
        </Text>
      </View>
    </View>
  );
};

export default SubscriptionPlan;
