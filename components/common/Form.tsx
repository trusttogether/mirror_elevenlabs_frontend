import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardTypeOptions,
} from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import Feather from "@expo/vector-icons/Feather";
import { Ionicons } from "@expo/vector-icons";
import Text from "../UI/Text";

interface FormProps {
  placeholder: string;
  value?: string;
  containerStyle?: string;
  label?: string;
  icon?: boolean;
  formStyle?: string;
  type?: string;
  onChangeText?: (text: string) => void;
  labelFontSize?: number;
  labelStyle?: string;
  inputStyle?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions; // Add this
  autoCapitalize?: "none" | "sentences" | "words" | "characters"; // Add this
  editable?: boolean; // Add this
}

const Form = ({
  error,
  inputStyle = "",
  labelStyle,
  labelFontSize = 11,
  type,
  icon = false,
  placeholder,
  value,
  containerStyle = "",
  label,
  formStyle = "h-[3rem]",
  onChangeText,
  keyboardType = "default", // Default value
  autoCapitalize = "sentences", // Default value
  editable = true, // Default value
  ...props
}: FormProps) => {
  const [secureTextEntry, setSecureTextEntry] = useState(type === "password");

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={tw`${containerStyle}`}>
      {label && (
        <View>
          <Text type="body" classN={labelStyle} fontSize={labelFontSize}>
            {label}
          </Text>
        </View>
      )}
      <View
        style={tw`border-solid ${
          icon || type === "password" ? "flex-row items-center" : ""
        } mt-2 px-4 border-[1px] border-[#DADADA] rounded-full ${formStyle} w-full`}
      >
        {icon && (
          <View style={tw`mr-2`}>
            <Feather name="search" size={24} color="gray" />
          </View>
        )}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={"#a4a0a0"}
          style={tw`flex-1 text-[.9rem] text-black ${inputStyle}`}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={type === "password" ? secureTextEntry : false}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          {...props}
        />
        {type === "password" && (
          <TouchableOpacity style={tw``} onPress={toggleSecureEntry}>
            {secureTextEntry ? (
              <Text classN="text-black underline">Show</Text>
            ) : (
              <Text classN="underline">Hide</Text>
            )}

            {/* <Ionicons
              name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#575555"
            /> */}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text classN="text-red-600" fontSize={12}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Form;
