import { View, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import Text from "../UI/Text";
import tw from "twrnc";

const EatingTracker = () => {
  const [selectedItems, setSelectedItems] = useState({});

  const foodItems = [
    {
      name: "Dairy",
      frequency: ["Daily", "Few times / week", "Rarely"],
    },
    {
      name: "Sugar / sweets",
      frequency: ["Daily", "Few times / week", "Rarely"],
    },
    {
      name: "Fried / processed Food",
      frequency: ["Daily", "Few times / week", "Rarely"],
    },
  ];

  const handleSelect = (foodName: string, frequency: number) => {
    setSelectedItems({
      ...selectedItems,
      [foodName]: frequency,
    });
  };

  return (
    <View style={tw`flex-1`}>
      <Text type="title" fontSize={24} classN={`mb-6 text-center`}>
        How often do you eat the following?
      </Text>

      <View>
        {foodItems.map((food) => (
          <View key={food.name} style={tw`mb-6`}>
            <Text type="body" fontSize={18} classN={`mb-2 ml-2 text-gray-700`}>
              {food.name}
            </Text>

            <View style={tw`bg-white rounded-lg shadow-sm p-4`}>
              {food.frequency.map((freq: any) => {
                const isSelected = selectedItems[food.name] === freq;

                return (
                  <TouchableOpacity
                    key={freq}
                    style={tw`flex-row items-center py-3`}
                    onPress={() => handleSelect(food.name, freq)}
                  >
                    {/* Radio Button */}
                    <View
                      style={tw`h-6 w-6 rounded-full border-2 mr-3 items-center justify-center ${
                        isSelected ? "border-blue-400" : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <View style={tw`h-3 w-3 rounded-full bg-blue-700`} />
                      )}
                    </View>

                    {/* Frequency Text */}
                    <Text
                      classN={`text-gray-800 ${
                        isSelected ? "font-medium" : ""
                      }`}
                    >
                      {freq}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default EatingTracker;
