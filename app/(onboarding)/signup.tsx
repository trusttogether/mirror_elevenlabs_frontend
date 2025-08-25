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

const Signup = () => {
  const [user, setUser] = useState({
    name: "Moyosore",
    phone: "",
    email: "",
    password: "",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

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
          onPress={() => setIsModalVisible(true)}
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
          An email verification link as been sent to your email,
          moyosoreibrahim@gmail.com, kindly check to confirm sign up{" "}
        </Text>

        <Button
          onPress={() => router.push("/otpverification")}
          text={true}
          title="Resend Link"
        />

        <TouchableOpacity
          style={tw`items-center justify-center mt-4`}
          onPress={() => setIsModalVisible(false)}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Signup;
