import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import AuthHeader from "../../components/UI/AuthHeader";
import Text from "../../components/UI/Text";
import Form from "../../components/common/Form";
import Button from "../../components/UI/Button";
import { router } from "expo-router";

const CreateNewpw = () => {
  return (
    <View>
      <AuthHeader className="h-[10rem]" title="Create a new password" />
      <Text classN="px-4 mt-6 mb-12 text-[#585858]" fontSize={16} type="body">
        Your new password must be different from previous passwords.
      </Text>

      <View style={tw`mt-6 px-4`}>
        <Form
          type="password"
          containerStyle="mb-4"
          label="New Password"
          placeholder="********"
        />
        <Form
          type="password"
          containerStyle="mb-12"
          label="Confirm Password"
          placeholder="********"
        />

        <Button
          onPress={() => router.push("/success")}
          text={true}
          title="Reset Password"
        />
      </View>
    </View>
  );
};

export default CreateNewpw;
