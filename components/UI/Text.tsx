import React from "react";
import { Text as RNText } from "react-native";
import { moderateScale } from "react-native-size-matters";
import tw from "twrnc";

interface TextProps {
  children: string | React.ReactNode;
  classN?: string;
  fontSize?: number;
  fontWeight?: "normal" | "medium" | "bold";
  numberOfLines?: number;
  style?: string;
  ellipsizeMode?: "head" | "middle" | "tail";
  type?: "title" | "body";
}

const Text = ({
  children,
  classN = "",
  fontSize,
  fontWeight = "normal",
  numberOfLines,
  style = "",
  ellipsizeMode,
  type = "body",
  ...props
}: TextProps) => {
  // Map font weights to the actual font family names for title fonts (Cormorant Garamond)
  const getTitleFontFamily = () => {
    switch (fontWeight) {
      case "bold":
        return "title-bold";
      case "medium":
        return "title-medium";
      case "normal":
      default:
        return "title-regular";
    }
  };

  // For body font, you only have one font file, so we'll always return "body"
  // The fontWeight will be handled by React Native's font weight system
  const getBodyFontFamily = () => {
    return "body"; // Always use the same body font
  };

  // Get the appropriate font family based on text type
  const getFontFamily = () => {
    return type === "title" ? getTitleFontFamily() : getBodyFontFamily();
  };

  // Handle italic variants for title fonts only
  const getItalicFontFamily = () => {
    if (type !== "title") return getBodyFontFamily();

    switch (fontWeight) {
      case "bold":
        return "title-bold-italic";
      case "normal":
      default:
        return "title-italic";
    }
  };

  // Check if classN contains italic styling and if it's a title
  const isItalic =
    (classN.includes("italic") || style.includes("italic")) && type === "title";

  return (
    <RNText
      ellipsizeMode={ellipsizeMode}
      numberOfLines={numberOfLines}
      allowFontScaling={false}
      style={[
        tw`${classN}`,
        {
          fontFamily: isItalic ? getItalicFontFamily() : getFontFamily(),
          fontSize: fontSize ? moderateScale(fontSize) : undefined,
          // For body text, use React Native's font weight system since we only have one font file
          fontWeight:
            type === "body"
              ? fontWeight === "bold"
                ? "bold"
                : fontWeight === "medium"
                ? "500"
                : "normal"
              : undefined,
          // Apply italic style for body text (system generated)
          fontStyle:
            type === "body" &&
            (classN.includes("italic") || style.includes("italic"))
              ? "italic"
              : "normal",
        },
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;
