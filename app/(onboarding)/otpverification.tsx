import { View } from "react-native";
import React, { useState } from "react";
import AuthHeader from "../../components/UI/AuthHeader";
import Text from "../../components/UI/Text";
import OtpTextInput from "react-native-otp-textinput";
import Button from "../../components/UI/Button";
import tw from "twrnc";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/axios";
import { useToast } from "../../components/UI/ToastManager";
import { useSignupStore } from "../../stores/useSignupStore";

interface VerifyOtpResponse {
  message: string;
  verified: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    phone?: string;
  };
}

interface VerifyOtpPayload {
  identifier: string | undefined;
  otp: string;
}

const Otpverification = () => {
  const [otp, setOtp] = useState("");
  const { showToast } = useToast();
  const { user } = useSignupStore();

  // OTP verification mutation
  const { mutate: verifyOtp, isPending: isVerifying } = useMutation({
    mutationFn: async (payload: VerifyOtpPayload) => {
      const response = await api.post<VerifyOtpResponse>(
        "/auth/verify-otp",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      showToast({
        type: "success",
        message: "Verification successful!",
        description: "Your account has been verified",
      });
      router.replace("/manual");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Verification failed. Please try again.";

      showToast({
        type: "error",
        message: "Verification failed",
        description: errorMessage,
        duration: 4000,
      });
      console.log(error, "Otp verificaiton error");
    },
  });

  const handleVerifyOtp = () => {
    console.log("Entered OTP:", otp); // Debug log

    if (!otp || otp.length !== 6) {
      showToast({
        type: "error",
        message: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP code",
      });
      return;
    }

    verifyOtp({
      identifier: user?.email,
      otp: otp,
    });
  };

  // Alternative approach: Use ref to get the OTP value
  const otpInputRef = React.useRef<any>(null);

  const handleOtpChange = (text: string) => {
    setOtp(text);
    console.log("OTP changed:", text); // Debug log
  };

  return (
    <View>
      <AuthHeader className="h-[10rem]" title="OTP Verification" />

      <Text classN="px-4 mt-6 mb-4 text-[#585858]" fontSize={16} type="body">
        Enter the verification code sent to {user?.email}
      </Text>

      <View style={tw`px-4`}>
        <View style={tw`mb-8`}>
          <OtpTextInput
            ref={otpInputRef}
            handleTextChange={handleOtpChange} // Try handleTextChange instead of handleChange
            tintColor="#000"
            offTintColor="#c4c4c4"
            textInputStyle={{
              borderWidth: 1,
              borderColor: "#DEDDDD",
              borderRadius: 8,
              width: 45,
              height: 45,
            }}
            inputCount={6}
            autoFocus={true}
            keyboardType="numeric"
          />
        </View>

        <Button
          onPress={handleVerifyOtp}
          text={true}
          title={isVerifying ? "Verifying..." : "Verify OTP"}
          disabled={isVerifying || otp.length < 6}
          isLoading={isVerifying}
        />
      </View>
    </View>
  );
};

export default Otpverification;
