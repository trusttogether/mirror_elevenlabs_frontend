import { View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AuthHeader from "../../components/UI/AuthHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import tw from "twrnc";
import Form from "../../components/common/Form";
import Button from "../../components/UI/Button";
import Text from "../../components/UI/Text";
import Divider from "../../components/common/Divider";
import { AppleIcon, GoogleIcon } from "../../assets/icons/authIcons";
import { Link, router } from "expo-router";
import { useToast } from "../../components/UI/ToastManager";
import { useSigninStore } from "../../stores/useSigninStore";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/axios";

// Update the interface to match your actual API response
interface LoginResponse {
  id: string;
  email: string;
  fullName: string; // Changed from user.name to fullName
  phoneNumber: string;
  success: boolean;
  token: string;
}

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const { setUser, setToken } = useSigninStore();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (credentials: {
      identifier: string;
      password: string;
    }) => {
      console.log("Sending login request:", credentials);

      try {
        const response = await api.post<LoginResponse>(
          "/auth/login",
          credentials
        );
        console.log("Login response:", response.data);
        return response.data;
      } catch (error: any) {
        console.log("Login error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Login success, showing toast...");

      // Transform the API response to match your store's expected format
      const userData = {
        id: data.id,
        email: data.email,
        name: data.fullName, // Map fullName to name
        phone: data.phoneNumber, // Map phoneNumber to phone
      };

      setUser(userData);
      setToken(data.token);

      showToast({
        type: "success",
        message: "Login successful!",
        description: `Welcome back, ${data.fullName}`, // Use fullName here
      });

      router.replace("/auth-steps");
    },
    onError: (error: any) => {
      console.log("Error details:", error);

      // Try different ways to extract the error message
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.response?.data?.msg ||
        error.message ||
        "Login failed. Please try again.";

      console.log("Final error message to show:", errorMessage);

      showToast({
        type: "error",
        message: "Login failed",
        description: errorMessage,
        duration: 4000,
      });
    },
  });

  const handleLogin = () => {
    console.log(email, password, "Credentials");

    if (!email || !password) {
      showToast({
        type: "error",
        message: "Missing fields",
        description: "Please fill in all required fields",
      });
      return;
    }

    if (!email.includes("@")) {
      showToast({
        type: "error",
        message: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }

    const payload = {
      identifier: email,
      password: password,
    };

    login(payload);
  };

  return (
    <View>
      <AuthHeader title={`Welcome back`} />

      <KeyboardAwareScrollView
        contentContainerStyle={tw`px-4 pb-4 mt-[3rem]`}
        keyboardShouldPersistTaps="handled"
      >
        <Form
          containerStyle="mb-6"
          label="Email Address"
          placeholder="email@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isPending}
        />

        <Form
          type="password"
          containerStyle="mb-4"
          label="Password"
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          editable={!isPending}
        />

        <TouchableOpacity
          onPress={() => router.push("/forgotpassword")}
          style={tw`mb-8`}
          disabled={isPending}
        >
          <Text fontSize={12} classN="text-[#424DB9] text-right">
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <Button
          text={true}
          title={isPending ? "Signing in..." : "Proceed"}
          onPress={handleLogin}
          disabled={isPending}
          isLoading={isPending}
        />

        <Divider />

        <View style={tw`items-center mt-4 justify-center gap-[12px]`}>
          <Button
            icon={<GoogleIcon />}
            btnStyle={`text-white h-[56px] rounded-full w-full border-solid border-[1px] bg-transparent border-[#E2E2E2] ${
              isPending ? "opacity-50" : ""
            }`}
            textStyle="text-black"
            textSize={14}
            text
            title="Continue with Google"
            disabled={isPending}
          />

          <Button
            icon={<AppleIcon />}
            btnStyle={`text-white rounded-full bg-transparent h-[56px] w-full border-solid border-[1px] border-[#E2E2E2] ${
              isPending ? "opacity-50" : ""
            }`}
            textStyle="text-black font-bold"
            textSize={14}
            text
            title="Continue with Apple"
            disabled={isPending}
          />

          <Text type="body" fontSize={14} classN="items-center">
            Don't have account ?{" "}
            <Link href={"/signup"} style={tw`pt-2`}>
              <Text classN="text-[#424DB9] underline">Signup</Text>
            </Link>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Signin;
