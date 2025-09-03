import { TouchableOpacity, View, Animated, Easing } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Text from "../UI/Text";
import tw from "twrnc";
import { GenederStepIcon } from "../../assets/icons/manualIcons";
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

const SkinReactions = ({
  questions,
  onAnswer,
  isLoading,
  initialAnswer,
  hasError,
}: StepsProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    initialAnswer || null
  );

  // Update selected option when initialAnswer changes (when navigating back)
  useEffect(() => {
    if (initialAnswer !== undefined) {
      setSelectedOption(initialAnswer);
    }
  }, [initialAnswer]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    if (onAnswer && questions?.id) {
      onAnswer(questions.id, option);
    }
  };

  return (
    <View style={tw`flex-1`}>
      {/* Question Text with Skeleton */}
      {isLoading ? (
        <AnimatedSkeleton type="text" />
      ) : (
        <Text type="title" fontSize={24}>
          {questions?.question_text}
        </Text>
      )}

      <View style={tw`mt-6`}>
        {/* Options with Skeleton */}
        {isLoading ? (
          <>
            <AnimatedSkeleton type="option" />
            <AnimatedSkeleton type="option" />
            <AnimatedSkeleton type="option" />
            <AnimatedSkeleton type="option" />
          </>
        ) : (
          questions?.options?.map((gender: string, index: number) => (
            <TouchableOpacity
              style={[
                tw`flex-row bg-white items-center p-4 rounded-full mt-4 border-2`,
                selectedOption === gender && !hasError
                  ? tw`border-blue-500 bg-blue-50`
                  : tw`border-transparent`,
                hasError && tw`border-red-200 bg-red-50`,
              ]}
              key={index}
              onPress={() => handleSelect(gender)}
              disabled={isLoading}
            >
              <Text
                classN={`
                  ml-3
                  ${
                    selectedOption === gender &&
                    !hasError &&
                    "text-blue-700 font-semibold"
                  }
                  ${hasError && "text-red-600"}
                `}
              >
                {gender}
              </Text>

              {/* Selection indicator */}
              <View
                style={[
                  tw`ml-auto w-6 h-6 rounded-full border-2 items-center justify-center`,
                  selectedOption === gender && !hasError
                    ? tw`bg-blue-500 border-blue-500`
                    : tw`border-gray-300`,
                  hasError && tw`border-red-300`,
                ]}
              >
                {selectedOption === gender && !hasError && (
                  <View style={tw`w-3 h-3 rounded-full bg-white`} />
                )}
              </View>
            </TouchableOpacity>
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

export default SkinReactions;
