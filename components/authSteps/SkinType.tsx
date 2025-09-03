import { TouchableOpacity, View } from "react-native";
import React, { useState, useEffect, JSX } from "react";
import Text from "../UI/Text";
import tw from "twrnc";
import {
  DrySkinIcon,
  NormalSkinIcon,
  OilySkin,
  SensitiveSkinTypeIcon,
  SkinCombinationIcon,
} from "../../assets/icons/manualIcons";
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

const SkinType = ({
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

  // Map skin type labels to icons and descriptions
  const skinTypeData: Record<string, { icon: JSX.Element; text: string }> = {
    Oily: {
      icon: <OilySkin />,
      text: "Shiny, enlarged pores, prone to acne",
    },
    Dry: {
      icon: <DrySkinIcon />,
      text: "Flaky, dull, tight",
    },
    Normal: {
      icon: <NormalSkinIcon />,
      text: "Balanced, clear, not sensitive",
    },
    Combination: {
      icon: <SkinCombinationIcon />,
      text: "Oily in T-zone, dry elsewhere",
    },
    Sensitive: {
      icon: <SensitiveSkinTypeIcon />,
      text: "Easily irritated or reactive",
    },
    "Not sure": {
      icon: <View style={tw`w-6 h-6`} />, // Empty icon for "Not sure"
      text: "I'm not sure about my skin type",
    },
  };

  return (
    <View style={tw`flex-1`}>
      {/* Question Text with Skeleton */}
      {isLoading ? (
        <AnimatedSkeleton type="text" />
      ) : (
        <Text type="title" fontSize={24}>
          {questions?.question_text || "What is your skin type?"}
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
            <AnimatedSkeleton type="option" />
            <AnimatedSkeleton type="option" />
          </>
        ) : (
          questions?.options?.map((skinType: string, index: number) => {
            const skinData = skinTypeData[skinType] || {
              icon: <View style={tw`w-6 h-6`} />,
              text: skinType,
            };

            return (
              <TouchableOpacity
                style={[
                  tw`flex-row bg-white items-center p-4 rounded-full mt-4 border-2`,
                  selectedOption === skinType && !hasError
                    ? tw`border-blue-500 bg-blue-50`
                    : tw`border-transparent`,
                  hasError && tw`border-red-200 bg-red-50`,
                ]}
                key={index}
                onPress={() => handleSelect(skinType)}
                disabled={isLoading}
              >
                {skinData.icon}

                <View style={tw`ml-3 flex-1`}>
                  <Text
                    classN={`
                      ${
                        selectedOption === skinType &&
                        !hasError &&
                        "text-blue-700 font-semibold"
                      }
                      ${hasError && "text-red-600"}
                    `}
                    fontSize={16}
                  >
                    {skinType}
                  </Text>
                  <Text fontSize={14} classN="text-[#585858]">
                    {skinData.text}
                  </Text>
                </View>

                {/* Selection indicator */}
                <View
                  style={[
                    tw`w-6 h-6 rounded-full border-2 items-center justify-center`,
                    selectedOption === skinType && !hasError
                      ? tw`bg-blue-500 border-blue-500`
                      : tw`border-gray-300`,
                    hasError && tw`border-red-300`,
                  ]}
                >
                  {selectedOption === skinType && !hasError && (
                    <View style={tw`w-3 h-3 rounded-full bg-white`} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })
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

export default SkinType;
