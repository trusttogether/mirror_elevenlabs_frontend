import { TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import AuthHeader from "../../components/UI/AuthHeader";
import Form from "../../components/common/Form";
import Button from "../../components/UI/Button";
import tw from "twrnc";
import Text from "../../components/UI/Text";
import { router } from "expo-router";
import Modal from "../../components/UI/Modal";
import Feather from "@expo/vector-icons/Feather";

const Forgotpassword = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View>
      <AuthHeader className="h-[10rem]" title="Forgot Password" />

      <Text classN="px-4 mt-6 mb-12 text-[#585858]" fontSize={16} type="body">
        Enter your email address or phone number associated with your account
      </Text>
      <View style={tw`px-4`}>
        <Form
          containerStyle="mb-6"
          label="Phone Number / Email Address"
          placeholder="email@gmail.com"
        />

        <Button
          onPress={() => setIsModalVisible(true)}
          text={true}
          title="Send Link"
        />
      </View>

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

export default Forgotpassword;
