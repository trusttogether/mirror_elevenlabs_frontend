import React from "react";
import Text from "../UI/Text";
import { TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import tw from "twrnc";

type FontWeight = "normal" | "medium" | "bold";

interface ButtonProps {
  fontWeight?: FontWeight;
  icon?: React.ReactNode;
  textStyle?: string;
  btnStyle?: string;
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  text: boolean;
  textSize?: number;
  textType?: "title" | "body"; // Add textType prop to pass to Text component
}

const Button = ({
  fontWeight = "normal",
  icon,
  textStyle = "text-white",
  btnStyle = "bg-[#222222] rounded-full",
  title,
  onPress,
  disabled,
  textSize = 14,
  isLoading,
  text = true,
  textType = "body", // Default to body type
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={tw`flex-row rounded-[12px] px-8 py-4 items-center justify-center ${btnStyle}`}
      {...props}
    >
      {icon && <View style={tw`mr-4`}>{icon}</View>}

      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        text && (
          <Text
            type={textType} // Pass the textType to Text component
            fontWeight={fontWeight}
            fontSize={textSize}
            classN={`${textStyle}`}
          >
            {title}
          </Text>
        )
      )}
    </TouchableOpacity>
  );
};

export default Button;
