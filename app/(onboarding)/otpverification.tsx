import { View } from "react-native";
import React, { useState, useEffect } from "react";
import AuthHeader from "../../components/UI/AuthHeader";
import Text from "../../components/UI/Text";
import OtpTextInput from "react-native-otp-textinput";
import Button from "../../components/UI/Button";
import tw from "twrnc";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/axios";
import { useToast } from "../../components/UI/ToastManager";
import { useSignupStore, useSignupActions } from "../../stores/useSignupStore"; // Import from signup store

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
  identifier: string;
  otp: string;
  type?: "email" | "phone";
}

const Otpverification = () => {
  const [otp, setOtp] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { showToast } = useToast();

  // Get OTP verification data and actions from SIGNUP store
  const { otpVerificationData } = useSignupStore();
  const { setUser, setLoading, setOtpVerificationData, clearOtpData } =
    useSignupActions();

  const isLoading = useSignupStore((state) => state.isLoading);

  // Timer for OTP expiration
  useEffect(() => {
    if (otpVerificationData?.expiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(
          0,
          otpVerificationData.expiresAt! - Date.now()
        );
        setTimeRemaining(remaining);
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [otpVerificationData]);

  // OTP verification mutation
  const { mutate: verifyOtp, isPending } = useMutation({
    mutationFn: async (payload: VerifyOtpPayload) => {
      console.log(payload, "Payload");
      setLoading(true);
      const response = await api.post<VerifyOtpResponse>(
        "/auth/verify-otp",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      setLoading(false);

      if (data.verified) {
        // Only set user data (no token handling in signup store)
        if (data.user) {
          setUser(data.user);
        }

        showToast({
          type: "success",
          message: "Verification successful!",
          description: "Your account has been verified",
        });

        // Clear OTP data
        clearOtpData();

        // Navigate to main app
        router.replace("/(drawer)/home");
      } else {
        showToast({
          type: "error",
          message: "Verification failed",
          description: "Invalid OTP code",
        });
      }
    },
    onError: (error: any) => {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        "Verification failed. Please try again.";

      showToast({
        type: "error",
        message: "Verification failed",
        description: errorMessage,
        duration: 4000,
      });
    },
  });

  // Resend OTP mutation
  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationFn: async () => {
      if (!otpVerificationData) {
        throw new Error("No verification data found");
      }

      const response = await api.post("/auth/resend-otp", {
        identifier: otpVerificationData.identifier,
        type: otpVerificationData.type,
      });
      return response.data;
    },
    onSuccess: () => {
      // Set new expiration time (5 minutes from now)
      const expiresAt = Date.now() + 5 * 60 * 1000;
      setOtpVerificationData({
        ...otpVerificationData!,
        expiresAt,
      });

      showToast({
        type: "success",
        message: "OTP resent",
        description: "A new verification code has been sent",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP";
      showToast({
        type: "error",
        message: "Resend failed",
        description: errorMessage,
      });
    },
  });

  const handleVerifyOtp = () => {
    if (!otp || otp.length !== 6) {
      showToast({
        type: "error",
        message: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP code",
      });
      return;
    }

    if (!otpVerificationData) {
      showToast({
        type: "error",
        message: "Verification error",
        description: "No verification data found. Please try again.",
      });
      return;
    }

    if (
      otpVerificationData.expiresAt &&
      Date.now() > otpVerificationData.expiresAt
    ) {
      showToast({
        type: "error",
        message: "OTP expired",
        description: "This code has expired. Please request a new one.",
      });
      return;
    }

    verifyOtp({
      identifier: otpVerificationData.identifier,
      otp: otp,
    });
  };

  const handleResendOtp = () => {
    if (!otpVerificationData) {
      showToast({
        type: "error",
        message: "Cannot resend OTP",
        description: "No verification data found",
      });
      return;
    }

    resendOtp();
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  // If no verification data, show error and redirect
  if (!otpVerificationData) {
    return (
      <View>
        <AuthHeader className="h-[10rem]" title="OTP Verification" />
        <View style={tw`px-4 mt-6`}>
          <Text classN="text-red-600 mb-4" fontSize={16}>
            No verification data found. Please start the verification process
            again.
          </Text>
          <Button onPress={() => router.back()} text={true} title="Go Back" />
        </View>
      </View>
    );
  }

  return (
    <View>
      <AuthHeader className="h-[10rem]" title="OTP Verification" />

      <Text classN="px-4 mt-6 mb-4 text-[#585858]" fontSize={16} type="body">
        Enter the verification code sent to {otpVerificationData.identifier}
      </Text>

      {timeRemaining > 0 && (
        <Text classN="px-4 mb-4 text-[#585858]" fontSize={14}>
          Code expires in: {formatTime(timeRemaining)}
        </Text>
      )}

      <View style={tw`px-4`}>
        <View style={tw`mb-8`}>
          <OtpTextInput
            handleChange={setOtp}
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
          title={isPending ? "Verifying..." : "Verify OTP"}
          disabled={isPending || otp.length !== 6}
          isLoading={isPending}
        />

        <View style={tw`mt-6 items-center`}>
          <Text classN="text-[#585858]" fontSize={14}>
            Didn't receive the code?{" "}
            <Text
              // onPress={handleResendOtp}
              classN={`text-[#424DB9] underline ${
                isResending || timeRemaining > 0 ? "opacity-50" : ""
              }`}
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Otpverification;
