import { TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Text from "../UI/Text";
import tw from "twrnc";

const SkinConcern = () => {
  const [selectedConcerns, setSelectedConcerns] = useState([]);

  const skinConcernArray = [
    {
      id: 1,
      label: "Cleanser",
    },
    {
      id: 2,
      label: "Mositurizer",
    },
    {
      id: 3,
      label: "SPF or sunscreen",
    },
    {
      id: 4,
      label: "Serum",
    },
    {
      id: 5,
      label: "Retinol or other activities",
    },
    {
      id: 6,
      label: "Exfoliator",
    },
    {
      id: 7,
      label: "Toner",
    },
    {
      id: 8,
      label: "Face masks",
    },
    {
      id: 9,
      label: "I don't have a routine yet",
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
        What is your skin routine?
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
