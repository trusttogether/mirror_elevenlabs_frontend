import {
  View,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator as RNActivityIndicator,
  ImageBackground,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import DrawerHeader from "../../components/drawer/DrawerHeader";
import tw from "twrnc";
import Text from "../../components/UI/Text";
import {
  ChatIcon,
  DropletIcon,
  FacialVerificationIcon,
  VoiceChatIcon,
} from "../../assets/icons/scanIcons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import axios from "axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import ResultHeader from "../../components/UI/ResultHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { getAuthToken } from "../../stores/useSigninStore";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const Scan = () => {
  const backgroundImage = require("../../assets/images/aiimage.jpg");
  const testImage = require("../../assets/images/test.jpg");
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasDetectedSpeech, setHasDetectedSpeech] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState<
    boolean | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSaveScanModal, setShowSaveScanModal] = useState(false);
  const [saveDestination, setSaveDestination] = useState(""); // "journal" or "challenges"
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [personalNote, setPersonalNote] = useState("");

  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanTip, setScanTip] = useState(
    "Avoid obstructions like glasses or hair"
  );
  const [showScanResults, setShowScanResults] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const [result, setResult] = useState<any>(null);

  // Animation refs
  const scanLinePosition = useRef(new Animated.Value(0)).current;
  const orbScale = useRef(new Animated.Value(1)).current;
  const voiceWaveAnim = useRef(new Animated.Value(0)).current;
  const bottomSheetHeight = useRef(new Animated.Value(0)).current;

  const cameraRef = useRef<CameraView>(null);
  const tipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechSimulatorRef = useRef<NodeJS.Timeout | null>(null);
  const recordingInstanceRef = useRef<Audio.Recording | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Folders data
  const journalFolders = [
    { id: 1, name: "Daily Skin Log" },
    { id: 2, name: "Progress Tracking" },
    { id: 3, name: "Treatment Results" },
    { id: 4, name: "Monthly Comparisons" },
  ];

  const challengeFolders = [
    { id: 1, name: "Hydration Challenge" },
    { id: 2, name: "Acne Treatment" },
    { id: 3, name: "Anti-Aging Routine" },
    { id: 4, name: "Sunscreen Habit" },
  ];

  // Start scan animation
  useEffect(() => {
    if (scanning) {
      startScanAnimation();
    }
  }, [scanning]);

  const startScanAnimation = () => {
    scanLinePosition.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLinePosition, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLinePosition, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const takePhoto = async () => {
    if (!cameraActive) {
      if (!permission?.granted) {
        await requestPermission();
      }
      setCameraActive(true);
      setTimeout(() => startScanning(), 500);
    }
  };

  const getScanGuidance = () => {
    const tips = [
      "Position your face in the center of the frame",
      "Ensure good lighting - avoid shadows on your face",
      "Remove glasses or anything obscuring your face",
      "Keep a neutral expression for best results",
      "Make sure your entire face is visible",
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };
  // Update the startScanning function to provide better guidance
  const startScanning = () => {
    setScanning(true);
    setScanTip(getScanGuidance()); // Set a helpful tip
    setTimeout(() => captureImage(), 5000);
  };

  const captureImage = async () => {
    if (cameraRef.current) {
      try {
        setScanning(false);
        setProcessing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
          skipProcessing: false,
        });
        setCapturedImage(photo.uri);
        // Validate that we have a usable image
        if (!photo.uri || !photo.base64) {
          throw new Error("Failed to capture image");
        }
        await processFacialScan(photo);
      } catch (error) {
        console.error("Error capturing image:", error);
        Alert.alert("Error", "Failed to capture image. Please try again.");
        setProcessing(false);
        setCameraActive(false);
      }
    }
  };

  const processFacialScan = async (photoData: any) => {
    try {
      setIsLoadingAnalysis(true);

      // For local images in React Native, we need a different approach
      // Let's use the actual captured image instead of trying to access bundled assets
      // Create form data with the captured image
      const formData = new FormData();
      formData.append("file", {
        uri: photoData.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      console.log("[INFO] Sending captured image to API:", photoData.uri);

      try {
        const apiResponse = await axios.post(
          "https://face-analysis-api-ljw4mgjxlq-uc.a.run.app/analyze-face/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 30000,
          }
        );

        if (!apiResponse.data || !apiResponse.data.facial_score) {
          throw new Error("Invalid response from analysis server");
        }

        console.log("Face analysis response:", apiResponse.data);

        setResult(apiResponse.data);
        await AsyncStorage.setItem(
          "face_analysis_result",
          JSON.stringify(apiResponse.data)
        );

        setShowScanResults(true);

        if (showBottomSheet) {
          const successMessage = {
            id: Date.now(),
            text: "Facial scan completed successfully! I've analyzed your skin health.",
            sender: "ai",
            timestamp: new Date(),
          };
          setChatMessages((prev) => [...prev, successMessage]);
          Speech.speak(
            "Facial scan completed successfully! I've analyzed your skin health."
          );
        }
      } catch (apiError) {
        console.log("API call failed, using test image as fallback:", apiError);

        // If the API call with the captured image fails, try with the test image
        // using a different approach for bundled assets
        await processWithTestImage();
      }
    } catch (err: any) {
      console.log("Error processing facial scan:", err);

      // Fallback to mock data
      useMockData();
    } finally {
      setProcessing(false);
      setCameraActive(false);
      setCapturedImage(null);
      setIsLoadingAnalysis(false);
    }
  };

  const processWithTestImage = async () => {
    try {
      const token = getAuthToken();
      // For bundled assets, we need to use a different approach
      // Since we can't directly access the file, we'll use a base64 representation
      // or fetch the image from a URL if it's available online

      // Alternative: Use a publicly accessible test image URL
      const testImageUrl = "../../assets/images/test.jpg"; // Replace with your actual test image URL

      const response = await fetch(testImageUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "test_image.jpg");

      const apiResponse = await axios.post(
        "https://face-analysis-api-ljw4mgjxlq-uc.a.run.app/analyze-face/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!apiResponse.data || !apiResponse.data.facial_score) {
        throw new Error("Invalid response from analysis server");
      }

      console.log("Face analysis response with test image:", apiResponse.data);

      setResult(apiResponse.data);
      await AsyncStorage.setItem(
        "face_analysis_result",
        JSON.stringify(apiResponse.data)
      );

      setShowScanResults(true);
    } catch (testImageError) {
      console.log("Test image also failed, using mock data:", testImageError);
      useMockData();
    }
  };

  const useMockData = async () => {
    // Mock response data for development
    const mockResponse = {
      facial_score: 85,
      raw: {
        hd_redness: { ui_score: 72 },
        hd_moisture: { ui_score: 88 },
        hd_oiliness: { ui_score: 65 },
      },
    };

    setResult(mockResponse);
    await AsyncStorage.setItem(
      "face_analysis_result",
      JSON.stringify(mockResponse)
    );

    setShowScanResults(true);

    if (showBottomSheet) {
      const successMessage = {
        id: Date.now(),
        text: "Facial scan completed successfully! I've analyzed your skin health.",
        sender: "ai",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, successMessage]);
      Speech.speak(
        "Facial scan completed successfully! I've analyzed your skin health."
      );
    }

    Alert.alert("Scan Completed", "I've analyzed your skin with mock data", [
      { text: "OK", onPress: () => {} },
    ]);
  };

  // Check microphone permission on component mount
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const { status } = await Audio.getPermissionsAsync();
      setMicrophonePermission(status === "granted");
    } catch (error) {
      console.error("Error checking microphone permission:", error);
      setMicrophonePermission(false);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setMicrophonePermission(status === "granted");
      return status === "granted";
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      setMicrophonePermission(false);
      return false;
    }
  };

  // Start voice animation
  useEffect(() => {
    if (recording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(orbScale, {
            toValue: 1.1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(orbScale, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(voiceWaveAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      orbScale.stopAnimation();
      voiceWaveAnim.stopAnimation();
      orbScale.setValue(1);
      voiceWaveAnim.setValue(0);
    }
  }, [recording]);

  // Handle bottom sheet animation
  useEffect(() => {
    if (showBottomSheet) {
      Animated.timing(bottomSheetHeight, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(bottomSheetHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [showBottomSheet]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (tipTimerRef.current) clearTimeout(tipTimerRef.current);
      if (speechSimulatorRef.current) clearInterval(speechSimulatorRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      stopRecording();
    };
  }, []);

  const handleSaveScanPress = () => {
    setShowSaveScanModal(true);
  };

  const handleSaveDestination = (destination: string) => {
    setSaveDestination(destination);
    setSelectedFolder("");
    setShowFolderDropdown(false);
  };

  const handleSaveScan = () => {
    // Implement save functionality here
    console.log(
      "Saving scan to:",
      saveDestination,
      "Folder:",
      selectedFolder,
      "Note:",
      personalNote
    );
    setShowSaveScanModal(false);
    setSaveDestination("");
    setSelectedFolder("");
    setPersonalNote("");
  };

  const handleCancelSave = () => {
    setShowSaveScanModal(false);
    setSaveDestination("");
    setSelectedFolder("");
    setPersonalNote("");
  };

  const handleVoicePress = async () => {
    if (activeButton === "voice") {
      setActiveButton(null);
      setShowBottomSheet(false);
      setHasDetectedSpeech(false);
      stopRecording();
      return;
    }

    if (microphonePermission === null) {
      await checkMicrophonePermission();
    }

    if (!microphonePermission) {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        alert("Microphone permission is required for voice features");
        return;
      }
    }

    setActiveButton("voice");
    setHasDetectedSpeech(false);

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingInstanceRef.current = recording;
      setRecording(true);
      await recording.startAsync();

      startVoiceDetection();
    } catch (err) {
      console.error("Failed to start recording", err);
      setActiveButton(null);
      setRecording(false);
    }
  };

  const startVoiceDetection = () => {
    if (speechSimulatorRef.current) {
      clearInterval(speechSimulatorRef.current);
    }

    let detectionCount = 0;

    speechSimulatorRef.current = setInterval(() => {
      if (!recording) {
        clearInterval(speechSimulatorRef.current!);
        return;
      }

      detectionCount++;

      if (detectionCount === 3) {
        setHasDetectedSpeech(true);
        setShowBottomSheet(true);
        simulateSpeechRecognition();
        clearInterval(speechSimulatorRef.current!);
      }
    }, 500);
  };

  const stopRecording = async () => {
    setRecording(false);
    if (recordingInstanceRef.current) {
      try {
        await recordingInstanceRef.current.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        recordingInstanceRef.current = null;
      } catch (err) {
        console.error("Error stopping recording", err);
      }
    }
    setTranscribedText("");

    if (speechSimulatorRef.current) {
      clearInterval(speechSimulatorRef.current);
      speechSimulatorRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const simulateSpeechRecognition = () => {
    if (speechSimulatorRef.current) {
      clearInterval(speechSimulatorRef.current);
    }

    const phrases = [
      "Hello there!",
      "How are you doing today?",
      "I'd like to know more about my skin health",
      "Can you give me some skincare tips?",
      "Thank you for your help!",
    ];

    let currentText = "";
    let phraseIndex = 0;
    let charIndex = 0;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    speechSimulatorRef.current = setInterval(() => {
      if (!recording) {
        clearInterval(speechSimulatorRef.current!);
        return;
      }

      if (phraseIndex >= phrases.length) {
        clearInterval(speechSimulatorRef.current!);
        stopRecording();
        return;
      }

      if (charIndex < phrases[phraseIndex].length) {
        currentText += phrases[phraseIndex][charIndex];
        setTranscribedText(currentText);
        charIndex++;

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          if (recording) stopRecording();
        }, 2000);
      } else {
        const userMessage = {
          id: Date.now(),
          text: phrases[phraseIndex],
          sender: "user",
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, userMessage]);

        // Process AI response
        setTimeout(() => {
          processAIResponse(phrases[phraseIndex]);
        }, 1000);

        phraseIndex++;
        charIndex = 0;
        currentText = "";

        if (phraseIndex >= phrases.length) {
          clearInterval(speechSimulatorRef.current!);
          stopRecording();
        }
      }
    }, 80);
  };

  const processAIResponse = async (userMessage: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call - replace with your actual API endpoint
      const aiResponse = {
        text: `I understand you said: "${userMessage}". I can help you with skincare advice based on your facial analysis. Your skin looks great overall!`,
        audio: null, // In a real app, this would be base64 audio from your API
      };

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse.text,
        sender: "ai",
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiMessage]);

      // Speak the response
      Speech.speak(aiResponse.text, {
        onStart: () => setIsSpeaking(true),
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error("Error processing AI response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);

    await processAIResponse(text);
  };

  const closeCamera = () => {
    setCameraActive(false);
    setScanning(false);
    setProcessing(false);
    setCapturedImage(null);
  };

  const closeBottomSheet = () => {
    setShowBottomSheet(false);
    setActiveButton(null);
    setHasDetectedSpeech(false);
    stopRecording();
  };

  const closeScanResults = () => {
    setShowScanResults(false);
    setResult(null);
  };

  // Function to calculate the stroke dasharray for the progress circle
  const calculateProgressCircle = (score: number) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    return { circumference, strokeDashoffset };
  };

  if (!permission) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text classN={`text-center mb-4`}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={tw`bg-blue-500 px-4 py-2 rounded`}
        >
          <Text classN={`text-white`}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={tw`flex-1`}>
      {cameraActive ? (
        <View style={tw`flex-1 bg-black`}>
          {!processing && (
            <CameraView style={tw`flex-1`} facing="front" ref={cameraRef} />
          )}
          {processing && capturedImage && (
            <Image
              source={{ uri: capturedImage }}
              style={tw`flex-1`}
              resizeMode="cover"
            />
          )}

          <View style={tw`absolute inset-0 justify-between`}>
            <TouchableOpacity
              onPress={closeCamera}
              style={tw`absolute top-[2rem] left-4 w-10 h-10 rounded-full bg-white justify-center items-center z-10`}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {scanning && (
              <View style={tw`items-center mt-16`}>
                <View
                  style={tw`bg-[#D9E0F2] bg-opacity-70 px-6 py-3 rounded-full`}
                >
                  <Text classN={`text-white`}>
                    Scanning your face. Hold still...
                  </Text>
                </View>
              </View>
            )}

            {scanning && (
              <View style={tw`flex-1 justify-center items-center`}>
                <View style={tw`w-64 h-80 justify-center items-center`}>
                  <View style={tw`absolute top-0 left-0`}>
                    <View style={[styles.corner, styles.topLeft]} />
                  </View>
                  <View style={tw`absolute top-0 right-0`}>
                    <View style={[styles.corner, styles.topRight]} />
                  </View>
                  <View style={tw`absolute bottom-0 left-0`}>
                    <View style={[styles.corner, styles.bottomLeft]} />
                  </View>
                  <View style={tw`absolute bottom-0 right-0`}>
                    <View style={[styles.corner, styles.bottomRight]} />
                  </View>
                  <Animated.View
                    style={[
                      tw`absolute w-full h-2 bg-white rounded-full`,
                      {
                        transform: [
                          {
                            translateY: scanLinePosition.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 320],
                            }),
                          },
                        ],
                        shadowColor: "#ffffff",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 10,
                        elevation: 10,
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {scanning && (
              <View style={tw`items-center mb-12`}>
                <View style={tw`px-6 py-3`}>
                  <Text
                    fontSize={20}
                    type="title"
                    classN={`text-white text-center`}
                  >
                    {scanTip}
                  </Text>
                </View>
              </View>
            )}

            {processing && (
              <View
                style={tw`absolute inset-0 justify-center items-center bg-black bg-opacity-70`}
              >
                <ActivityIndicator size="large" color="#ffffff" />
                <Text classN={`text-white mt-4 text-lg`}>
                  Processing scan...
                </Text>
                <Text classN={`text-white mt-2 text-sm`}>
                  Please wait while we verify your identity
                </Text>
              </View>
            )}

            {isLoadingAnalysis && (
              <View
                style={tw`absolute inset-0 justify-center items-center bg-black bg-opacity-70`}
              >
                <ActivityIndicator size="large" color="#ffffff" />
                <Text classN={`text-white mt-4 text-lg`}>
                  Analyzing your skin...
                </Text>
                <Text classN={`text-white mt-2 text-sm`}>
                  This may take a few moments
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <ImageBackground
          source={backgroundImage}
          style={tw`flex-1 pt-12`}
          resizeMode="cover"
        >
          {showScanResults ? (
            <ResultHeader goBack={closeScanResults} />
          ) : (
            <DrawerHeader />
          )}

          {!showScanResults && (
            <View
              style={tw`absolute bottom-20 left-0 right-0 flex-row justify-center items-center gap-6`}
            >
              {activeButton === "voice" && !hasDetectedSpeech ? (
                <View style={tw`flex-row items-center justify-center`}>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveButton(null);
                      stopRecording();
                    }}
                    style={tw`w-12 h-12 rounded-full bg-red-500 items-center justify-center mr-4`}
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                  <Animated.View
                    style={[
                      tw`w-24 h-24 rounded-full bg-white bg-opacity-20 items-center justify-center border-2 border-white`,
                      { transform: [{ scale: orbScale }] },
                    ]}
                  >
                    <VoiceChatIcon />
                    <Animated.View
                      style={[
                        tw`absolute -inset-4 rounded-full border-2 border-white`,
                        {
                          opacity: voiceWaveAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 0],
                          }),
                          transform: [
                            {
                              scale: voiceWaveAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 2],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                    {recording && (
                      <Text classN={`text-white text-xs mt-2`}>
                        Listening...
                      </Text>
                    )}
                  </Animated.View>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={tw`w-16 h-16 rounded-full bg-black bg-opacity-30 items-center justify-center border border-white border-opacity-50`}
                    onPress={handleVoicePress}
                  >
                    <VoiceChatIcon />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`w-20 h-20 rounded-full bg-black bg-opacity-30 items-center justify-center border-2 border-white border-opacity-50`}
                    onPress={takePhoto}
                  >
                    <FacialVerificationIcon />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`w-16 h-16 rounded-full bg-black bg-opacity-30 items-center justify-center border border-white border-opacity-50`}
                    onPress={() => setActiveButton("chat")}
                  >
                    <ChatIcon />
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* Scan Results Modal */}
          {showScanResults && result && (
            <View style={tw`px-2 absolute bottom-15 left-0 right-0`}>
              <View style={tw`bg-white rounded-3xl p-3`}>
                <View style={tw`mb-6`}>
                  <Text
                    type="title"
                    fontSize={18}
                    classN={`font-bold mt-2 text-left mb-2`}
                  >
                    Your Skin Health
                  </Text>
                  <View style={tw`relative w-32 h-32 mb-4 mx-auto`}>
                    {/* Progress Circle */}
                    <View
                      style={tw`w-full h-full rounded-full border-8 border-blue-100 items-center justify-center`}
                    >
                      <Text classN={`text-3xl font-bold text-blue-600`}>
                        {Math.round(result.facial_score)}%
                      </Text>
                    </View>
                  </View>
                  <Text classN={`text-gray-500 text-center`}>
                    Scan Date: {new Date().toLocaleDateString()}
                  </Text>
                </View>

                <View style={tw`flex-row flex-wrap  gap-1 mb-8`}>
                  {/* Redness Card */}
                  <View
                    style={tw`bg-[#F6EBF1] w-[29%] p-2 rounded-[12px] justify-center mb-2`}
                  >
                    <View style={tw`flex-row items-center gap-2`}>
                      <View
                        style={tw`w-[25px] items-center justify-center h-[25px] rounded-full bg-white`}
                      >
                        <DropletIcon />
                      </View>
                      <Text fontSize={12} classN={`text-sm text-gray-600 mb-1`}>
                        Redness
                      </Text>
                    </View>
                    <Text classN={`font-bold mt-3`} fontSize={14}>
                      {Math.round(result.breakdown.clarity * 100)}%
                    </Text>
                  </View>

                  {/* Inflammation Card */}
                  <View
                    style={tw`bg-[#FDF6E3] w-[37%] p-2 rounded-[12px] justify-center mb-2`}
                  >
                    <View style={tw`flex-row items-center gap-2`}>
                      <View
                        style={tw`w-[25px] items-center justify-center h-[25px] rounded-full bg-white`}
                      >
                        <DropletIcon />
                      </View>
                      <Text fontSize={12} classN={`text-sm text-gray-600 mb-1`}>
                        Inflammation
                      </Text>
                    </View>
                    <Text classN={`font-bold mt-3`} fontSize={14}>
                      {Math.round(result.breakdown.glow * 100)}%
                    </Text>
                  </View>

                  {/* Hydration Card */}
                  <View
                    style={tw`bg-[#E8F4F8] w-[31%] p-2 rounded-[12px] justify-center mb-2`}
                  >
                    <View style={tw`flex-row items-center gap-2`}>
                      <View
                        style={tw`w-[25px] items-center justify-center h-[25px] rounded-full bg-white`}
                      >
                        <DropletIcon />
                      </View>
                      <Text fontSize={12} classN={`text-sm text-gray-600 mb-1`}>
                        Hydration
                      </Text>
                    </View>
                    <Text classN={`font-bold mt-3`} fontSize={14}>
                      {Math.round(result.breakdown.hydration * 100)}%
                    </Text>
                  </View>
                </View>
              </View>

              <View style={tw`flex-row mt-4 justify-between`}>
                <TouchableOpacity
                  onPress={handleSaveScanPress}
                  style={tw`bg-white w-[49%] py-3 rounded-lg mr-2 px-4 gap-5 border-solid border-[1px] border-[#E8E8E866] items-center justify-between flex-row`}
                >
                  <Text classN={`text-gray-700 font-medium`}>Save Scan</Text>

                  <View
                    style={tw`h-[32px] w-[32px] rounded-full bg-black items-center justify-center`}
                  >
                    <MaterialCommunityIcons
                      name="arrow-top-right"
                      size={15}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/scan-result")}
                  style={tw`bg-white w-[49%] py-3 rounded-lg mr-2 px-4 gap-5 border-solid border-[1px] border-[#E8E8E866] items-center justify-between flex-row`}
                >
                  <Text classN={`text-black font-medium`}>
                    View Full Analysis
                  </Text>

                  <View
                    style={tw`h-[32px] w-[32px] rounded-full bg-black items-center justify-center`}
                  >
                    <MaterialCommunityIcons
                      name="arrow-top-right"
                      size={15}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ImageBackground>
      )}

      {/* Save Scan Modal */}
      <Modal
        visible={showSaveScanModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelSave}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 p-4`}
        >
          <View style={tw`bg-white rounded-2xl p-6 w-full max-w-md`}>
            <Text type="title" fontSize={20} classN="text-center mb-2">
              Where would you like to save this scan?
            </Text>
            <Text type="body" classN="text-gray-600 text-center mb-6">
              Choose a destination for your scan insights
            </Text>

            {/* Destination Cards */}
            <View style={tw`flex-row justify-between mb-6`}>
              <TouchableOpacity
                onPress={() => handleSaveDestination("journal")}
                style={[
                  tw`w-[48%] p-4 rounded-xl border-2 items-center`,
                  saveDestination === "journal"
                    ? tw`bg-blue-50 border-blue-500`
                    : tw`bg-white border-gray-200`,
                ]}
              >
                <Ionicons
                  name="journal-outline"
                  size={24}
                  color={saveDestination === "journal" ? "#3B82F6" : "#6B7280"}
                />
                <Text
                  type="body"
                  classN={`mt-2 ${
                    saveDestination === "journal"
                      ? "text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  My Journal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSaveDestination("challenges")}
                style={[
                  tw`w-[48%] p-4 rounded-xl border-2 items-center`,
                  saveDestination === "challenges"
                    ? tw`bg-blue-50 border-blue-500`
                    : tw`bg-white border-gray-200`,
                ]}
              >
                <Ionicons
                  name="trophy-outline"
                  size={24}
                  color={
                    saveDestination === "challenges" ? "#3B82F6" : "#6B7280"
                  }
                />
                <Text
                  type="body"
                  classN={`mt-2 ${
                    saveDestination === "challenges"
                      ? "text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  Challenges
                </Text>
              </TouchableOpacity>
            </View>

            {/* Folder Selection */}
            {saveDestination && (
              <View style={tw`mb-6`}>
                <Text type="body" classN="text-gray-700 mb-3 font-medium">
                  {saveDestination === "journal"
                    ? "Select Folder in Daily Journal"
                    : "Select Folder in Challenges"}
                </Text>

                <TouchableOpacity
                  onPress={() => setShowFolderDropdown(!showFolderDropdown)}
                  style={tw`border border-gray-300 rounded-xl p-4 flex-row justify-between items-center`}
                >
                  <Text
                    classN={`${
                      selectedFolder ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {selectedFolder || "Select a folder"}
                  </Text>
                  <Ionicons
                    name={showFolderDropdown ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>

                {showFolderDropdown && (
                  <View
                    style={tw`mt-2 border border-gray-200 rounded-xl max-h-40`}
                  >
                    <ScrollView>
                      {(saveDestination === "journal"
                        ? journalFolders
                        : challengeFolders
                      ).map((folder) => (
                        <TouchableOpacity
                          key={folder.id}
                          onPress={() => {
                            setSelectedFolder(folder.name);
                            setShowFolderDropdown(false);
                          }}
                          style={tw`p-3 flex-row items-center border-b border-gray-100`}
                        >
                          {selectedFolder === folder.name && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="#3B82F6"
                              style={tw`mr-2`}
                            />
                          )}
                          <Text
                            classN={`${
                              selectedFolder === folder.name
                                ? "text-blue-600 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {folder.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}

            {/* Personal Note Field */}
            {saveDestination && (
              <View style={tw`mb-6`}>
                <Text type="body" classN="text-gray-700 mb-3 font-medium">
                  Add Personal Note (Optional)
                </Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-xl p-4 h-20`}
                  placeholder="Add your notes here..."
                  multiline
                  value={personalNote}
                  onChangeText={setPersonalNote}
                />
              </View>
            )}

            {/* Buttons */}
            <TouchableOpacity
              onPress={handleSaveScan}
              disabled={!selectedFolder}
              style={[
                tw`py-4 rounded-xl mb-3 items-center`,
                selectedFolder ? tw`bg-black` : tw`bg-gray-300`,
              ]}
            >
              <Text classN="text-white font-medium">Save Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCancelSave}
              style={tw`py-4 rounded-xl border border-gray-300 items-center`}
            >
              <Text classN="text-gray-700">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showBottomSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={closeBottomSheet}
      >
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <Animated.View
            style={[
              tw`bg-white rounded-t-3xl overflow-hidden`,
              {
                height: bottomSheetHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "85%"],
                }),
              },
            ]}
          >
            <View
              style={tw`flex-row justify-between items-center p-4 border-b border-gray-200`}
            >
              <TouchableOpacity onPress={closeBottomSheet}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text classN={`text-lg font-semibold`}>Talk to Mira</Text>
              <View style={tw`w-6`} />
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={tw`flex-1`}
            >
              <ScrollView
                style={tw`flex-1 p-4`}
                contentContainerStyle={tw`flex-grow`}
              >
                {chatMessages.length === 0 ? (
                  <View style={tw`items-center mt-8`}>
                    <Animated.View
                      style={[
                        tw`w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-4`,
                        { transform: [{ scale: isSpeaking ? orbScale : 1 }] },
                      ]}
                    >
                      <Ionicons name="mic" size={32} color="#3B82F6" />
                    </Animated.View>
                    <Text classN={`text-lg font-semibold mb-2`}>
                      Hi, I'm Mira
                    </Text>
                    <Text classN={`text-gray-500 text-center`}>
                      What would you like to ask me today?
                    </Text>
                  </View>
                ) : (
                  <>
                    {chatMessages.map((message: Message) => (
                      <View
                        key={message.id}
                        style={[
                          tw`p-3 rounded-2xl mb-3 max-w-3/4`,
                          message.sender === "user"
                            ? tw`bg-blue-500 self-end`
                            : tw`bg-gray-200 self-start`,
                        ]}
                      >
                        <Text
                          classN={
                            message.sender === "user"
                              ? "text-white"
                              : "text-black"
                          }
                        >
                          {message.text}
                        </Text>
                      </View>
                    ))}
                  </>
                )}

                {recording && transcribedText && (
                  <View
                    style={tw`bg-gray-100 p-3 rounded-2xl self-end mb-3 max-w-3/4`}
                  >
                    <Text>{transcribedText}</Text>
                  </View>
                )}
                {isProcessing && (
                  <View
                    style={tw`bg-gray-100 p-3 rounded-2xl self-start mb-3 max-w-3/4`}
                  >
                    <Text>Thinking...</Text>
                  </View>
                )}
              </ScrollView>

              <View style={tw`p-4 border-t border-gray-200`}>
                <View style={tw`flex-row items-center`}>
                  <TextInput
                    style={tw`flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2`}
                    placeholder="Type your message..."
                  />
                  <TouchableOpacity
                    style={tw`bg-blue-500 w-10 h-10 rounded-full items-center justify-center`}
                  >
                    <Ionicons name="send" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  corner: { width: 30, height: 30, borderColor: "white", position: "absolute" },
  topLeft: {
    borderTopWidth: 4,
    borderLeftWidth: 4,
    top: -2,
    left: -2,
    borderTopLeftRadius: 12,
  },
  topRight: {
    borderTopWidth: 4,
    borderRightWidth: 4,
    top: -2,
    right: -2,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    bottom: -2,
    left: -2,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    borderBottomWidth: 4,
    borderRightWidth: 4,
    bottom: -2,
    right: -2,
    borderBottomRightRadius: 12,
  },
});

export default Scan;
