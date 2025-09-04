import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import Text from "../../components/UI/Text";
import Gender from "../../components/authSteps/Gender";
import Age from "../../components/authSteps/Age";
import SkinType from "../../components/authSteps/SkinType";
import SkinConcern from "../../components/authSteps/SkinConcern";
import SkinRoutine from "../../components/authSteps/SkinRoutine";
import SkinCareRoutine from "../../components/authSteps/SkinCareRoutine";
import WaterIntake from "../../components/authSteps/WaterIntake";
import EatingTracker from "../../components/authSteps/EatingTracker";
import Usage from "../../components/authSteps/Usage";
import tw from "twrnc";
import { ArrowLeft } from "lucide-react-native";
import SkinReactions from "../../components/authSteps/SkinReactions";
import { router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { useSigninStore } from "../../stores/useSigninStore";
import StressLevel from "../../components/authSteps/StressLevel";

const AuthSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(
    new Set()
  );
  const { user } = useSigninStore();

  const {
    data: questions,
    isLoading: isLoadingQuestions,
    error: queryError,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const response = await api.get("/survey/all");
      return response.data;
    },
  });

  // Fetch answered questions
  const {
    data: answeredQuestions,
    isLoading: isLoadingAnswers,
    refetch: refetchAnswers,
  } = useQuery({
    queryKey: ["answered-questions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await api.get(`/survey/answered/${user.id}`);
      console.log(response?.data, "Answered Questions");
      return response.data;
    },
    enabled: !!user?.id,
  });

  // Populate formData with answered questions when they load
  useEffect(() => {
    if (answeredQuestions && questions) {
      const answeredData: Record<string, any> = {};
      const answeredIds = new Set<string>();

      // Map answered questions to formData
      answeredQuestions.forEach((answered: any) => {
        answeredData[answered.question_id] = answered.answer;
        answeredIds.add(answered.question_id);
      });

      setFormData(answeredData);
      setAnsweredQuestionIds(answeredIds);
    }
  }, [answeredQuestions, questions]);

  const answerMutation = useMutation({
    mutationFn: async ({
      questionId,
      answer,
    }: {
      questionId: string;
      answer: any;
    }) => {
      const payload = {
        questionId: questionId,
        answer: answer,
      };

      const response = await api.post(
        `/survey/survey/${user?.id}/answer`,
        payload
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Add the question ID to answered questions set
      setAnsweredQuestionIds((prev) => new Set(prev).add(variables.questionId));
      // Clear any previous error for this question
      setErrors((prev) => ({ ...prev, [variables.questionId]: false }));
      // Refetch answered questions after successful submission
      refetchAnswers();

      // Move to next step after successful submission if not the last step
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
    },
    onError: (error, variables) => {
      console.log("Error submitting answer:", error);
      setErrors((prev) => ({ ...prev, [variables.questionId]: true }));
    },
  });

  const handleAnswer = (stepId: string, answer: any) => {
    setFormData((prev) => ({ ...prev, [stepId]: answer }));
    setErrors((prev) => ({ ...prev, [stepId]: false }));
  };

  // Get the current question based on step
  const getCurrentQuestion = () => {
    if (!questions || !Array.isArray(questions)) return null;
    return questions[currentStep];
  };

  // Get answer for a specific step
  const getAnswerForStep = (stepIndex: number) => {
    if (!questions) return null;
    const questionId = questions[stepIndex]?.id;
    return formData[questionId] || null;
  };

  // Check if current step has an answer
  const hasAnswerForCurrentStep = () => {
    if (!questions) return false;
    const questionId = questions[currentStep]?.id;
    return !!formData[questionId];
  };

  // Check if current step has an error
  const hasErrorForCurrentStep = () => {
    if (!questions) return false;
    const questionId = questions[currentStep]?.id;
    return errors[questionId];
  };

  // Check if current question has already been answered
  const hasQuestionBeenAnswered = () => {
    if (!questions) return false;
    const questionId = questions[currentStep]?.id;
    return answeredQuestionIds.has(questionId);
  };

  const steps = [
    {
      title: "Gender",
      component: (
        <Gender
          questions={getCurrentQuestion()}
          onAnswer={handleAnswer}
          isLoading={isLoadingQuestions || isLoadingAnswers}
          initialAnswer={getAnswerForStep(0)}
          hasError={hasErrorForCurrentStep()}
        />
      ),
    },
    {
      title: "Age",
      component: (
        <Age
          questions={getCurrentQuestion()}
          onAnswer={handleAnswer}
          isLoading={isLoadingQuestions || isLoadingAnswers}
          initialAnswer={getAnswerForStep(1)}
          hasError={hasErrorForCurrentStep()}
        />
      ),
    },
    {
      title: "Skin Type",
      component: (
        <SkinType
          questions={getCurrentQuestion()}
          onAnswer={handleAnswer}
          isLoading={isLoadingQuestions || isLoadingAnswers}
          initialAnswer={getAnswerForStep(2)}
          hasError={hasErrorForCurrentStep()}
        />
      ),
    },
    {
      title: "Skin Concerns",
      component: (
        <SkinConcern
          questions={getCurrentQuestion()}
          onAnswer={handleAnswer}
          isLoading={isLoadingQuestions || isLoadingAnswers}
          initialAnswer={getAnswerForStep(3)}
          hasError={hasErrorForCurrentStep()}
        />
      ),
    },
    {
      title: "Skin Routine",
      component: (
        <SkinRoutine
          questions={getCurrentQuestion()}
          onAnswer={handleAnswer}
          isLoading={isLoadingQuestions || isLoadingAnswers}
          initialAnswer={getAnswerForStep(4)}
          hasError={hasErrorForCurrentStep()}
        />
      ),
    },
    {
      title: "Skin Care Routine",
      component: (
        <SkinCareRoutine
          questions={getCurrentQuestion()}
          onAnswer={handleAnswer}
          isLoading={isLoadingQuestions || isLoadingAnswers}
          initialAnswer={getAnswerForStep(5)}
          hasError={hasErrorForCurrentStep()}
        />
      ),
    },
    {
      title: "Skin Reactions",
      component: (
        <SkinReactions
          questions={getCurrentQuestion()}
          onAnswer={handleAnswer}
          isLoading={isLoadingQuestions || isLoadingAnswers}
          initialAnswer={getAnswerForStep(6)}
          hasError={hasErrorForCurrentStep()}
        />
      ),
    },
    {
      title: "Water Intake",
      component: (
        <WaterIntake
          questions={getCurrentQuestion()}
          onAnswer={handleAnswer}
          isLoading={isLoadingQuestions || isLoadingAnswers}
          initialAnswer={getAnswerForStep(7)}
          hasError={hasErrorForCurrentStep()}
        />
      ),
    },
    {
      title: "Stress Level",
      component: (
        <StressLevel
          questions={getCurrentQuestion()}
          onAnswer={handleAnswer}
          isLoading={isLoadingQuestions || isLoadingAnswers}
          initialAnswer={getAnswerForStep(8)}
          hasError={hasErrorForCurrentStep()}
        />
      ),
    },
    {
      title: "Eating Tracker",
      component: (
        <EatingTracker
          questions={getCurrentQuestion()}
          onAnswer={handleAnswer}
          isLoading={isLoadingQuestions || isLoadingAnswers}
          initialAnswer={getAnswerForStep(9)}
          hasError={hasErrorForCurrentStep()}
        />
      ),
    },
    {
      title: "Usage",
      component: (
        <Usage
          questions={getCurrentQuestion()}
          onAnswer={handleAnswer}
          isLoading={isLoadingQuestions || isLoadingAnswers}
          initialAnswer={getAnswerForStep(10)}
          hasError={hasErrorForCurrentStep()}
        />
      ),
    },
  ];

  const totalSteps = steps.length;

  const handleNext = () => {
    if (!hasAnswerForCurrentStep()) return;

    const questionId = questions[currentStep].id;
    const answer = formData[questionId];

    // Only submit if the question hasn't been answered yet
    if (!hasQuestionBeenAnswered()) {
      answerMutation.mutate({ questionId, answer });
    } else {
      // If already answered, just move to next step
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(totalSteps - 1);
  };

  // Progress bar calculation
  const progress = (currentStep / (totalSteps - 1)) * 100;

  // Check if all questions are answered to enable "Done" button
  const allQuestionsAnswered = () => {
    if (!questions) return false;
    return questions.every((question: any) => formData[question.id]);
  };

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
          <TouchableOpacity
            onPress={() => router.push("/scan")}
            style={tw`p-2`}
          >
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
      </View>

      {/* Current step content */}
      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1 p-5`}>
        {steps[currentStep].component}
      </ScrollView>

      {/* Footer with next button */}
      <View style={tw`p-5 mb-13`}>
        <TouchableOpacity
          onPress={() => {
            if (currentStep === totalSteps - 1 && allQuestionsAnswered()) {
              handleNext();
              router.push("/scan");
            } else {
              handleNext();
            }
          }}
          disabled={!hasAnswerForCurrentStep() || answerMutation.isPending}
          style={[
            tw`py-4 rounded-full items-center flex-row justify-center`,
            !hasAnswerForCurrentStep() ? tw`bg-gray-300` : tw`bg-black`,
          ]}
        >
          {answerMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text classN={`text-white text-base font-semibold mr-2`}>
              {currentStep === totalSteps - 1 ? "Done" : "Continue"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthSteps;
