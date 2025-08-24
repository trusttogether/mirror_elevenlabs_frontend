import { View } from "react-native";
import React from "react";
import AuthHeader from "../../components/UI/AuthHeader";
import Form from "../../components/common/Form";
import Button from "../../components/UI/Button";
import tw from "twrnc";
import Text from "../../components/UI/Text";
import { router } from "expo-router";

const Forgotpassword = () => {
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
          onPress={() => router.push("/createnewpw")}
          text={true}
          title="Send Link"
        />
      </View>
    </View>
  );
};

export default Forgotpassword;
