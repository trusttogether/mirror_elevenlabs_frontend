import { View, TouchableOpacity } from "react-native";
import React from "react";
import AuthHeader from "../../components/UI/AuthHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Form from "../../components/common/Form";
import Text from "../../components/UI/Text";
import Button from "../../components/UI/Button";
import Divider from "../../components/common/Divider";
import { AppleIcon, GoogleIcon } from "../../assets/icons/authIcons";
import tw from "twrnc";
import { Link, router } from "expo-router";

const Signup = () => {
  return (
    <View>
      <AuthHeader
        className="h-[10rem]"
        title="Create an account with Mirrora"
      />

      <KeyboardAwareScrollView
        contentContainerStyle={tw`px-4 pb-4 mt-[3rem]`}
        keyboardShouldPersistTaps="handled"
      >
        <Form containerStyle="mb-6" label="Full Name" placeholder="Jane doe" />
        <Form
          containerStyle="mb-6"
          label="Phone Number / Email Address"
          placeholder="email@gmail.com"
        />
        <Form
          type="password"
          containerStyle="mb-6"
          label="Password"
          placeholder="********"
        />

        <Button
          onPress={() => router.push("/otpverification")}
          text={true}
          title="Proceed"
        />

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
            Already have an account ?{" "}
            <Link href={"/signup"} style={tw`pt-2`}>
              <Text classN="text-[#424DB9] underline">Signup</Text>
            </Link>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Signup;
