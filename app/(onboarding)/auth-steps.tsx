import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Text from "../../components/UI/Text";
import Gender from "../../components/authSteps/Gender";
import Age from "../../components/authSteps/Age";
import SkinType from "../../components/authSteps/SkinType";
import SkinConcern from "../../components/authSteps/SkinConcern";
import SkinRoutine from "../../components/authSteps/SkinRoutine";
import SkinCareRoutine from "../../components/authSteps/SkinCareRoutine";
import WaterIntake from "../../components/authSteps/WaterIntake";
import StressLevel from "../../components/authSteps/StressLevel";
import EatingTracker from "../../components/authSteps/EatingTracker";
import Usage from "../../components/authSteps/Usage";
import tw from "twrnc";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import SkinReactions from "../../components/authSteps/SkinReactions";
import { router } from "expo-router";

const AuthSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Gender", component: <Gender /> },
    { title: "Age", component: <Age /> },
    { title: "Skin Type", component: <SkinType /> },
    { title: "Skin Concerns", component: <SkinConcern /> },
    { title: "Skin Routine", component: <SkinRoutine /> },
    { title: "Skin Care Routine", component: <SkinCareRoutine /> },
    { title: "Skin Reactions", component: <SkinReactions /> },
    { title: "Water Intake", component: <WaterIntake /> },
    { title: "Stress Level", component: <StressLevel /> },
    { title: "Eating Tracker", component: <EatingTracker /> },
    { title: "Usage", component: <Usage /> },
  ];

  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/scan");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Skip to the last step or implement your skip logic
    setCurrentStep(totalSteps - 1);
  };

  // Progress bar calculation
  const progress = (currentStep / (totalSteps - 1)) * 100;
  return (
    <View style={tw`flex-1 bg-[#EDEEF2] relative`}>
      <Image
        source={require("../../assets/images/Rectangle3.png")}
        style={tw`absolute top-[-1rem] left-[-1rem]`}
      />

      {/* Header with back button and progress */}

      <View style={tw`p-5 pt-12 bg-transparent`}>
        <View style={tw`flex-row items-center justify-between mb-5`}>
          <TouchableOpacity onPress={handleBack} style={tw`p-2`}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip} style={tw`p-2`}>
            <Text classN={`text-gray-600`}>Skip for now</Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={tw`h-1.5 bg-gray-200 rounded-full overflow-hidden`}>
          <View
            style={[
              tw`h-full bg-blue-700 rounded-full`,
              { width: `${progress}%` },
            ]}
          />
        </View>

        {/* Step indicators */}
        {/* <View style={tw`flex-row justify-between mt-3`}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={tw`w-2 h-2 rounded-full ${
                index <= currentStep ? "bg-blue-700" : "bg-gray-200"
              }`}
            />
          ))}
        </View> */}
      </View>

      {/* Current step content */}
      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1 p-5`}>
        {steps[currentStep].component}
      </ScrollView>

      {/* Footer with next button */}
      <View style={tw`p-5 mb-13`}>
        <TouchableOpacity
          onPress={handleNext}
          style={tw`bg-black py-4 rounded-full items-center flex-row justify-center`}
        >
          <Text classN={`text-white text-base font-semibold mr-2`}>
            {currentStep === totalSteps - 1 ? "Done" : "Continue"}
          </Text>
          {/* {currentStep < totalSteps - 1 && (
            <ChevronRight size={20} color="white" />
          )} */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthSteps;
