import { View, TouchableOpacity } from "react-native";
import React from "react";
import AuthHeader from "../../components/UI/AuthHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import tw from "twrnc";
import Form from "../../components/common/Form";
import Button from "../../components/UI/Button";
import Text from "../../components/UI/Text";
import Divider from "../../components/common/Divider";
import { AppleIcon, GoogleIcon } from "../../assets/icons/authIcons";
import { Link, router } from "expo-router";

const Signin = () => {
  const user = { name: "Moyosore" };

  return (
    <View>
      <AuthHeader title={`Welcome back, ${user.name}`} />

      <KeyboardAwareScrollView
        contentContainerStyle={tw`px-4 pb-4 mt-[3rem]`}
        keyboardShouldPersistTaps="handled"
      >
        <Form
          containerStyle="mb-6"
          label="Phone Number / Email Address"
          placeholder="email@gmail.com"
        />
        <Form
          type="password"
          containerStyle="mb-4"
          label="Password"
          placeholder="********"
        />

        <TouchableOpacity
          onPress={() => router.push("/forgotpassword")}
          style={tw`mb-8`}
        >
          <Text fontSize={12} classN="text-[#424DB9] text-right">
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <Button text={true} title="Proceed" />

        <Divider />

        <View style={tw`items-center mt-4 justify-center gap-[12px]`}>
          <Button
            icon={<GoogleIcon />}
            btnStyle="text-white h-[56px] rounded-full w-full border-solid border-[1px] bg-transparent border-[#E2E2E2]"
            textStyle="text-black"
            textSize={14}
            text
            title="Continue with Google"
          />

          <Button
            icon={<AppleIcon />}
            btnStyle="text-white rounded-full bg-transparent h-[56px] w-full border-solid border-[1px] border-[#E2E2E2]"
            textStyle="text-black font-bold"
            textSize={14}
            text
            title="Continue with Apple"
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
