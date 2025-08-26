import { TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Text from "../UI/Text";
import tw from "twrnc";

const SkinConcern = () => {
  const [selectedConcerns, setSelectedConcerns] = useState([]);

  const skinConcernArray = [
    {
      id: 1,
      label: "Pimple or acne",
    },
    {
      id: 2,
      label: "Redness or rosacea",
    },
    {
      id: 3,
      label: "Uneven skin tone",
    },
    {
      id: 4,
      label: "Dullness",
    },
    {
      id: 5,
      label: "Dark circles",
    },
    {
      id: 6,
      label: "Fine lines and wrinkles",
    },
    {
      id: 7,
      label: "Visible pores",
    },
    {
      id: 8,
      label: "Dry patches / flakiness",
    },
    {
      id: 9,
      label: "Not sure",
    },
  ];

  const handleSelect = (id: number) => {
    setSelectedConcerns((prevSelected: any) => {
      if (prevSelected.includes(id)) {
        // Remove id if already selected
        return prevSelected.filter((item: number) => item !== id);
      } else {
        // Add id if not selected
        return [...prevSelected, id];
      }
    });
  };

  const isSelected = (id: number) => selectedConcerns.includes(id);

  return (
    <View style={tw`flex-1 pb-8`}>
      <Text type="title" fontSize={24}>
        What is your skin concern?
      </Text>

      <View style={tw`mt-6`}>
        {skinConcernArray.map((item) => (
          <TouchableOpacity
            style={tw`flex-row justify-between items-center py-4 px-5 rounded-full mt-4 border border-gray-200 bg-white`}
            key={item.id}
            onPress={() => handleSelect(item.id)}
            activeOpacity={0.7}
          >
            <Text classN={`text-[#222222] text-base`}>{item.label}</Text>

            {/* Radio Button - Now functions as a checkbox for multiple selection */}
            <View
              style={tw`h-6 w-6 rounded-full border-2 ${
                isSelected(item.id)
                  ? "bg-[#424DB9] border-[#424DB9]"
                  : "border-gray-300"
              } justify-center items-center`}
            >
              {isSelected(item.id) && (
                <View
                  style={tw`w-2 h-3 border-r-2 border-b-2 border-white transform rotate-45 -mt-0.5`}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SkinConcern;
