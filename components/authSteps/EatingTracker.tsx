import { View, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import Text from "../UI/Text";
import tw from "twrnc";
import AnimatedSkeleton from "../loaders/AnimatedSkeleton";

export interface StepsProps {
  questions: {
    id: string;
    options: string[];
    order_number: number;
    question_text: string;
  };
  onAnswer?: (stepId: string, answer: any) => void;
  isLoading?: boolean;
  initialAnswer?: string | null;
  hasError?: boolean;
}

const EatingTracker = ({
  questions,
  onAnswer,
  isLoading,
  initialAnswer,
  hasError,
}: StepsProps) => {
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>(
    {}
  );

  // Parse initial answer if it exists
  useEffect(() => {
    if (initialAnswer) {
      try {
        // Handle both object and JSON string formats
        let parsedAnswer;
        if (typeof initialAnswer === "string") {
          parsedAnswer = JSON.parse(initialAnswer);
        } else if (typeof initialAnswer === "object") {
          parsedAnswer = initialAnswer;
        }

        if (parsedAnswer && typeof parsedAnswer === "object") {
          setSelectedItems(parsedAnswer);
        }
      } catch (error) {
        console.error("Error parsing initial answer:", error);
      }
    }
  }, [initialAnswer]);

  // Parse the options from the API to match the expected format
  const parseFoodItems = () => {
    if (!questions?.options) return [];

    return questions.options.map((option) => {
      // Split the option string to extract food name and frequencies
      const [foodPart, frequenciesPart] = option.split(": ");
      const frequencies = frequenciesPart
        ? frequenciesPart.split("/")
        : ["Daily", "Few times a week", "Rarely"];

      return {
        name: foodPart,
        frequency: frequencies.map((freq) => freq.trim()),
      };
    });
  };

  const foodItems = parseFoodItems();

  const handleSelect = (foodName: string, frequency: string) => {
    const newSelectedItems = {
      ...selectedItems,
      [foodName]: frequency,
    };

    setSelectedItems(newSelectedItems);

    // Send the answer to the parent component
    if (onAnswer && questions?.id) {
      onAnswer(questions.id, newSelectedItems);
    }
  };

  return (
    <View style={tw`flex-1`}>
      {/* Question Text with Skeleton */}
      {isLoading ? (
        <AnimatedSkeleton type="text" />
      ) : (
        <Text type="title" fontSize={24} classN={`mb-6 text-center`}>
          {questions?.question_text || "How often do you eat the following?"}
        </Text>
      )}

      <View>
        {isLoading ? (
          // Show skeleton loaders while loading
          <>
            <View style={tw`mb-6`}>
              <AnimatedSkeleton type="text" />
              <View style={tw`bg-white rounded-lg shadow-sm p-4 mt-2`}>
                <AnimatedSkeleton type="option" />
                <AnimatedSkeleton type="option" />
                <AnimatedSkeleton type="option" />
              </View>
            </View>
            <View style={tw`mb-6`}>
              <AnimatedSkeleton type="text" />
              <View style={tw`bg-white rounded-lg shadow-sm p-4 mt-2`}>
                <AnimatedSkeleton type="option" />
                <AnimatedSkeleton type="option" />
                <AnimatedSkeleton type="option" />
              </View>
            </View>
            <View style={tw`mb-6`}>
              <AnimatedSkeleton type="text" />
              <View style={tw`bg-white rounded-lg shadow-sm p-4 mt-2`}>
                <AnimatedSkeleton type="option" />
                <AnimatedSkeleton type="option" />
                <AnimatedSkeleton type="option" />
              </View>
            </View>
          </>
        ) : (
          foodItems.map((food) => (
            <View key={food.name} style={tw`mb-6`}>
              <Text
                type="body"
                fontSize={18}
                classN={`mb-2 ml-2 text-gray-700`}
              >
                {food.name}
              </Text>

              <View
                style={[
                  tw`bg-white rounded-lg shadow-sm p-4`,
                  hasError && tw`border border-red-200 bg-red-50`,
                ]}
              >
                {food.frequency.map((freq: string) => {
                  const isSelected = selectedItems[food.name] === freq;

                  return (
                    <TouchableOpacity
                      key={freq}
                      style={tw`flex-row items-center py-3`}
                      onPress={() => handleSelect(food.name, freq)}
                      disabled={isLoading}
                    >
                      {/* Radio Button */}
                      <View
                        style={[
                          tw`h-6 w-6 rounded-full border-2 mr-3 items-center justify-center`,
                          isSelected && !hasError
                            ? tw`border-blue-400`
                            : tw`border-gray-300`,
                          hasError && tw`border-red-300`,
                        ]}
                      >
                        {isSelected && !hasError && (
                          <View style={tw`h-3 w-3 rounded-full bg-blue-700`} />
                        )}
                      </View>

                      {/* Frequency Text */}
                      <Text
                        classN={[
                          isSelected && !hasError
                            ? "font-medium text-blue-700"
                            : "text-gray-800",
                          hasError && "text-red-600",
                        ].join(" ")}
                      >
                        {freq}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Error message */}
      {hasError && (
        <Text classN="text-red-500 mt-4 text-center">
          Failed to save answer. Please try again.
        </Text>
      )}
    </View>
  );
};

export default EatingTracker;
