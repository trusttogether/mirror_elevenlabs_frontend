import {
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import React, { useState } from "react";
import Text from "../../components/UI/Text";
import ResultHeader from "../../components/UI/ResultHeader";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

const ScanResult = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const userImage = require("../../assets/images/aiimage.jpg"); // Replace with actual image path

  const toggleSection = (section: any) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const metricsData = [
    { id: 1, title: "Redness", value: "95%", icon: "💧", color: "#F6EBF1" },
    { id: 2, title: "Hydration", value: "76%", icon: "💦", color: "#E5F1F6" },
    {
      id: 3,
      title: "Inflammation",
      value: "80%",
      icon: "🔥",
      color: "#FFF7ED",
    },
    { id: 4, title: "Pores", value: "68%", icon: "🔍", color: "#F0F7FF" },
    { id: 5, title: "Texture", value: "82%", icon: "✨", color: "#F6F0EB" },
    { id: 6, title: "Elasticity", value: "79%", icon: "🔵", color: "#EBF6F0" },
    { id: 7, title: "Dark Spots", value: "45%", icon: "⚫", color: "#F5EBF6" },
    { id: 8, title: "Wrinkles", value: "38%", icon: "📝", color: "#F6F6EB" },
    { id: 9, title: "Oiliness", value: "62%", icon: "🛢️", color: "#EBF6F6" },
  ];

  const detailSections = [
    {
      id: 1,
      title: "Possible Causes",
      points: [
        "1. Sun exposure without adequate protection",
        "2. Harsh skincare products causing irritation",
        "3. Allergic reactions to certain ingredients",
        "4. Environmental pollutants and free radicals",
      ],
    },
    {
      id: 2,
      title: "Recommended Products",
      points: [
        "1. Gentle hydrating cleanser with ceramides",
        "2. Soothing serum with niacinamide",
        "3. Broad-spectrum SPF 50+ sunscreen",
        "4. Barrier repair moisturizer",
      ],
    },
    {
      id: 3,
      title: "Daily Routine",
      points: [
        "1. Cleanse twice daily with lukewarm water",
        "2. Apply serum while skin is still damp",
        "3. Moisturize immediately after serum",
        "4. Reapply sunscreen every 2 hours when outdoors",
      ],
    },
    {
      id: 4,
      title: "Lifestyle Changes",
      points: [
        "1. Increase water intake to 8 glasses daily",
        "2. Incorporate antioxidant-rich foods in diet",
        "3. Get 7-8 hours of quality sleep nightly",
        "4. Reduce stress through meditation or yoga",
      ],
    },
    {
      id: 5,
      title: "Professional Treatments",
      points: [
        "1. Consult a dermatologist for personalized advice",
        "2. Consider laser therapy for redness reduction",
        "3. Professional facials every 4-6 weeks",
        "4. Chemical peels to improve skin texture",
      ],
    },
    {
      id: 6,
      title: "Progress Tracking",
      points: [
        "1. Take weekly photos in consistent lighting",
        "2. Note any changes in skin sensitivity",
        "3. Track product effectiveness",
        "4. Schedule follow-up scan in 4 weeks",
      ],
    },
  ];

  return (
    <View style={tw`flex-1 pt-10 bg-gray-50`}>
      <ResultHeader title="Full Scan Report" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-8`}
      >
        {/* User Image and Glow Score Section */}
        <View style={tw`flex-row items-center px-5 py-6 bg-white mb-4`}>
          <Image
            source={userImage}
            style={tw`w-24 h-24 rounded-full border-4 border-blue-100`}
            resizeMode="cover"
          />

          <View style={tw`ml-6 items-center`}>
            <View
              style={tw`w-28 h-28 rounded-full border-8 border-blue-500 items-center justify-center`}
            >
              <Text
                type="title"
                fontSize={24}
                fontWeight="bold"
                classN="text-blue-600"
              >
                85%
              </Text>
            </View>
            <Text type="body" classN="text-gray-500 mt-2">
              Scan Date: {new Date().toLocaleDateString()}
            </Text>
            <Text type="body" classN="text-blue-600 font-medium mt-1">
              Glow Score
            </Text>
          </View>
        </View>

        {/* Goals Card */}
        <View style={tw`bg-white mx-4 p-5 rounded-xl shadow-sm mb-6`}>
          <Text type="title" fontSize={20} classN="text-center mb-3">
            Let's Hit Your Goals
          </Text>
          <Text type="body" classN="text-gray-600 text-center">
            Based on your scan, we've identified key areas for improvement.
            Follow your personalized plan for radiant skin.
          </Text>
        </View>

        {/* Metrics Grid */}
        <View style={tw`px-4 mb-6`}>
          <Text type="title" fontSize={18} classN="mb-4 text-center">
            Skin Health Metrics
          </Text>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {metricsData.map((metric) => (
              <View
                key={metric.id}
                style={[
                  tw`w-[30%] p-3 rounded-[12px] justify-center mb-4`,
                  { backgroundColor: metric.color },
                ]}
              >
                <View style={tw`flex-row items-center gap-1 mb-2`}>
                  <View
                    style={tw`w-6 h-6 rounded-full bg-white items-center justify-center`}
                  >
                    <Text>{metric.icon}</Text>
                  </View>
                  <Text
                    type="body"
                    fontSize={12}
                    classN="text-gray-600"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {metric.title}
                  </Text>
                </View>
                <Text type="title" classN="font-bold text-center" fontSize={14}>
                  {metric.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Expandable Detail Sections */}
        <View style={tw`px-4`}>
          {detailSections.map((section) => (
            <View
              key={section.id}
              style={tw`bg-white rounded-xl p-4 mb-4 shadow-sm`}
            >
              <TouchableOpacity
                style={tw`flex-row justify-between items-center`}
                onPress={() => toggleSection(section.id)}
              >
                <Text type="title" fontSize={16} classN="text-gray-800">
                  {section.title}
                </Text>
                <Ionicons
                  name={
                    expandedSections[section.id] ? "chevron-up" : "chevron-down"
                  }
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {expandedSections[section.id] && (
                <View style={tw`mt-3`}>
                  {section.points.map((point, index) => (
                    <Text
                      key={index}
                      type="body"
                      classN="text-gray-600 mb-2"
                      fontSize={14}
                    >
                      {point}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ScanResult;
