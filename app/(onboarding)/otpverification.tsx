import { View } from "react-native";
import React, { useState } from "react";
import AuthHeader from "../../components/UI/AuthHeader";
import Text from "../../components/UI/Text";
import OtpTextInput from "react-native-otp-textinput";
import Button from "../../components/UI/Button";
import tw from "twrnc";
import { router } from "expo-router";

const Otpverification = () => {
  const [otp, setOtp] = useState("");

  return (
    <View>
      <AuthHeader className="h-[10rem]" title="OTP Verification" />

      <Text classN="px-4 mt-6 mb-12 text-[#585858]" fontSize={16} type="body">
        Enter the OTP Code that was sent to your phone number
      </Text>

      <View style={tw`px-4`}>
        <View style={tw`mb-12`}>
          <OtpTextInput
            handleChange={(text: any) => setOtp(text)}
            tintColor="#000"
            offTintColor="#c4c4c4"
            textInputStyle={{
              borderWidth: 1,
              borderColor: "#DEDDDD",
              borderRadius: 8,
            }}
            inputCount={6}
          />
        </View>
        <Button
          onPress={() => router.push("/manual")}
          text={true}
          title="Submit"
        />
      </View>
    </View>
  );
};

export default Otpverification;
