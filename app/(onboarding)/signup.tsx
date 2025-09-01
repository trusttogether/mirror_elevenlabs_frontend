import { View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AuthHeader from "../../components/UI/AuthHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Form from "../../components/common/Form";
import Text from "../../components/UI/Text";
import Button from "../../components/UI/Button";
import Divider from "../../components/common/Divider";
import { AppleIcon, GoogleIcon } from "../../assets/icons/authIcons";
import tw from "twrnc";
import { Link, router } from "expo-router";
import Modal from "../../components/UI/Modal";
import Feather from "@expo/vector-icons/Feather";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/axios";
import { useSignupStore } from "../../stores/useSignupStore";
import { useToast } from "../../components/UI/ToastManager";

interface SignupResponse {
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
  };
  token: string;
  message: string;
}

interface SignupCredentials {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { showToast } = useToast();
  const { setUser, setLoading, setError, isLoading } = useSignupStore();

  // Function to format Nigerian phone number as user types
  const formatNigerianPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");

    // Check if it starts with 0 (local format) or 234 (international format)
    const isInternationalFormat = cleaned.startsWith("234");

    // Limit to appropriate length
    let limited;
    if (isInternationalFormat) {
      limited = cleaned.slice(0, 13); // 2348012345678 (13 digits)
    } else {
      limited = cleaned.slice(0, 11); // 08012345678 (11 digits)
    }

    // Apply formatting based on format type
    if (isInternationalFormat) {
      if (limited.length <= 3) {
        return limited;
      } else if (limited.length <= 7) {
        return `${limited.slice(0, 3)} ${limited.slice(3)}`;
      } else {
        return `${limited.slice(0, 3)} ${limited.slice(3, 7)} ${limited.slice(
          7
        )}`;
      }
    } else {
      if (limited.length <= 4) {
        return limited;
      } else if (limited.length <= 7) {
        return `${limited.slice(0, 4)} ${limited.slice(4)}`;
      } else {
        return `${limited.slice(0, 4)} ${limited.slice(4, 7)} ${limited.slice(
          7
        )}`;
      }
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    const formatted = formatNigerianPhoneNumber(value);
    setFormData((prev) => ({ ...prev, phoneNumber: formatted }));
  };

  // Direct useMutation for signup
  const { mutate: signup } = useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      setLoading(true);
      setError(null);
      console.log(credentials, "signup credentials");
      try {
        // Clean phone number before sending to server
        const cleanedCredentials = {
          ...credentials,
          phoneNumber: credentials.phoneNumber.replace(/\D/g, ""),
        };

        const response = await api.post("/auth/register", cleanedCredentials);
        console.log("Signup response:", response.data);
        return response.data;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Signup failed. Please try again.";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      setUser(data.user);
      setLoading(false);
      console.log("Token saved:", data.token);
      setIsModalVisible(true);
    },
    onError: (error: Error) => {
      console.log(error?.message, "Error");
      setError(error.message);
      setLoading(false);

      showToast({
        type: "error",
        message: "Signup failed",
        description: error.message,
        duration: 4000,
      });
    },
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = () => {
    // Basic validation

    if (!formData.fullName || !formData.email || !formData.password) {
      showToast({
        type: "error",
        message: "Missing fields",
        description: "Please fill in all required fields",
      });
      return;
    }

    if (!formData.email.includes("@")) {
      showToast({
        type: "error",
        message: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }

    if (formData.password.length < 6) {
      showToast({
        type: "error",
        message: "Weak password",
        description: "Password must be at least 6 characters long",
      });
      return;
    }

    // Check if phone number has valid Nigerian format
    const cleanedPhone = formData.phoneNumber.replace(/\D/g, "");
    const isValidLocalFormat = /^0[7-9][0-1]\d{8}$/.test(cleanedPhone); // e.g., 0818617226
    const isValidInternationalFormat = /^234[7-9][0-1]\d{8}$/.test(
      cleanedPhone
    );

    signup(formData);
  };

  const handleResendEmail = () => {
    showToast({
      type: "info",
      message: "Verification email sent",
      description: "Check your email for the verification link",
    });
  };

  return (
    <View style={tw`flex-1`}>
      <AuthHeader
        className="h-[10rem]"
        title="Create an account with Mirrora"
      />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-4 pb-14 mt-[1rem]`}
      >
        <Form
          containerStyle="mb-6"
          label="Full Name"
          placeholder="Jane doe"
          value={formData.fullName}
          onChangeText={(value) => handleInputChange("fullName", value)}
          editable={!isLoading}
        />

        <Form
          containerStyle="mb-6"
          label="Phone Number"
          placeholder="0818 617 226"
          value={formData.phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="phone-pad"
          editable={!isLoading}
        />

        <Form
          containerStyle="mb-6"
          label="Email Address"
          placeholder="email@gmail.com"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <Form
          type="password"
          containerStyle="mb-6"
          label="Password"
          placeholder="********"
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          editable={!isLoading}
        />

        <Button
          onPress={handleSignup}
          text={true}
          title={isLoading ? "Creating account..." : "Proceed"}
          disabled={isLoading}
          isLoading={isLoading}
        />

        <Divider />

        <View style={tw`items-center mt-4 justify-center gap-[12px]`}>
          <Button
            icon={<GoogleIcon />}
            btnStyle={`text-white h-[56px] rounded-full w-full border-solid border-[1px] bg-transparent border-[#E2E2E2] ${
              isLoading ? "opacity-50" : ""
            }`}
            textStyle="text-black"
            textSize={14}
            text
            title="Continue with Google"
            disabled={isLoading}
          />

          <Button
            icon={<AppleIcon />}
            btnStyle={`text-white rounded-full bg-transparent h-[56px] w-full border-solid border-[1px] border-[#E2E2E2] ${
              isLoading ? "opacity-50" : ""
            }`}
            textStyle="text-black font-bold"
            textSize={14}
            text
            title="Continue with Apple"
            disabled={isLoading}
          />

          <Text type="body" fontSize={14} classN="items-center">
            Already have an account ?{" "}
            <Link href={"/signin"} style={tw`pt-2`}>
              <Text classN="text-[#424DB9] underline">Signin</Text>
            </Link>
          </Text>
        </View>
      </KeyboardAwareScrollView>

      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        animationType="fade"
        backdropOpacity={0.7}
        style="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-md"
      >
        <View
          style={tw`items-center mb-6 justify-center rounded-full h-[58px] w-[58px] bg-[#CCD5EEBD]`}
        >
          <Feather name="mail" size={24} color="black" />
        </View>

        <Text type="title" fontSize={22}>
          Email Verification
        </Text>

        <Text type="body" classN="text-[#585858] mt-1 mb-5" fontSize={14}>
          An email verification link has been sent to your email,{" "}
          {formData.email}. Kindly check to confirm your sign up.
        </Text>

        <Button
          onPress={() => {
            router.push("/otpverification");
            setIsModalVisible(false);
          }}
          text={true}
          title="Verify Email"
        />

        <TouchableOpacity
          style={tw`items-center justify-center mt-4`}
          onPress={() => setIsModalVisible(false)}
        >
          <Text classN="text-gray-500">Cancel</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Signup;
