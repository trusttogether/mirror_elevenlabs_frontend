import {
  ImageBackground,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import DrawerHeader from "../../components/drawer/DrawerHeader";
import tw from "twrnc";
import Text from "../../components/UI/Text";
import {
  ChatIcon,
  FacialVerificationIcon,
  VoiceChatIcon,
} from "../../assets/icons/scanIcons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const Scan = () => {
  const backgroundImage = require("../../assets/images/aiimage.jpg");
  const [activeButton, setActiveButton] = useState("face"); // Track active button

  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanTip, setScanTip] = useState(
    "Avoid obstructions like glasses or hair"
  );
  const scanLinePosition = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef(null);
  const tipTimerRef = useRef(null);

  // Start scanning animation
  useEffect(() => {
    if (scanning) {
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

      // Set initial tip
      setScanTip("Avoid obstructions like glasses or hair");

      // Change tip after 2.5 seconds (half of the total scanning time)
      tipTimerRef.current = setTimeout(() => {
        setScanTip("Ensure good lighting");
      }, 2500);
    } else {
      scanLinePosition.stopAnimation();
      scanLinePosition.setValue(0);

      // Clear timer when scanning stops
      if (tipTimerRef.current) {
        clearTimeout(tipTimerRef.current);
        tipTimerRef.current = null;
      }
    }
  }, [scanning]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (tipTimerRef.current) {
        clearTimeout(tipTimerRef.current);
      }
    };
  }, []);

  const handleFacialScanPress = async () => {
    if (!cameraActive) {
      // Request camera permission if not already granted
      if (!permission?.granted) {
        await requestPermission();
      }
      setCameraActive(true);

      // Start scanning automatically after a brief delay to allow camera to initialize
      setTimeout(() => {
        startScanning();
      }, 500);
    }
  };

  const startScanning = () => {
    setScanning(true);

    // Scanning process for 5 seconds then automatically capture
    setTimeout(() => {
      captureImage();
    }, 5000);
  };

  const captureImage = async () => {
    if (cameraRef.current) {
      try {
        setScanning(false);
        setProcessing(true);

        // Take picture automatically
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          skipProcessing: false, // Process the image for better quality
        });

        // Store the captured image for preview
        setCapturedImage(photo.uri);

        // Process the image
        await processFacialScan(photo);
      } catch (error) {
        console.error("Error capturing image:", error);
        setProcessing(false);
        setCameraActive(false);
      }
    }
  };

  const processFacialScan = async (photoData: any) => {
    try {
      // API call to your endpoint
      // Replace this with your actual API call
      console.log("Sending image to API endpoint");

      // Create form data for the image
      const formData = new FormData();
      formData.append("image", {
        uri: photoData.uri,
        type: "image/jpeg",
        name: "face_scan.jpg",
      });
      formData.append("timestamp", new Date().toISOString());

      // Send to your API endpoint
      const response = await fetch("https://your-api-endpoint.com/face-scan", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      // Handle the response
      console.log("Scan result:", result);

      // Reset states after processing
      setProcessing(false);
      setCameraActive(false);
      setCapturedImage(null);
    } catch (error) {
      console.error("Error processing facial scan:", error);
      setProcessing(false);
      setCameraActive(false);
      setCapturedImage(null);
    }
  };

  const closeCamera = () => {
    setCameraActive(false);
    setScanning(false);
    setProcessing(false);
    setCapturedImage(null);
  };

  if (!permission) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text classN={``}>Requesting camera permission...</Text>
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
          {/* Show camera view only when not processing */}
          {!processing && (
            <CameraView style={tw`flex-1`} facing="front" ref={cameraRef} />
          )}

          {/* Show captured image preview when processing */}
          {processing && capturedImage && (
            <Image
              source={{ uri: capturedImage }}
              style={tw`flex-1`}
              resizeMode="cover"
            />
          )}

          {/* Overlay with scanning UI - positioned absolutely */}
          <View style={tw`absolute inset-0 justify-between`}>
            {/* Back button */}
            <TouchableOpacity
              onPress={closeCamera}
              style={tw`absolute top-[2rem] left-4 w-10 h-10 rounded-full bg-white justify-center items-center z-10`}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Top message */}
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

            {/* Scanning frame with corner lines - only show during scanning */}
            {scanning && (
              <View style={tw`flex-1 justify-center items-center`}>
                <View style={tw`w-64 h-80 justify-center items-center`}>
                  {/* Top left corner */}
                  <View style={tw`absolute top-0 left-0`}>
                    <View style={[styles.corner, styles.topLeft]} />
                  </View>

                  {/* Top right corner */}
                  <View style={tw`absolute top-0 right-0`}>
                    <View style={[styles.corner, styles.topRight]} />
                  </View>

                  {/* Bottom left corner */}
                  <View style={tw`absolute bottom-0 left-0`}>
                    <View style={[styles.corner, styles.bottomLeft]} />
                  </View>

                  {/* Bottom right corner */}
                  <View style={tw`absolute bottom-0 right-0`}>
                    <View style={[styles.corner, styles.bottomRight]} />
                  </View>

                  {/* Animated scan line with shadow effect */}
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

            {/* Bottom tip text - show during scanning */}
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

            {/* Processing indicator */}
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
          </View>
        </View>
      ) : (
        <ImageBackground
          source={backgroundImage}
          style={tw`flex-1 pt-12`}
          resizeMode="cover"
        >
          <DrawerHeader />

          {/* Bottom buttons container */}
          <View
            style={tw`absolute bottom-20 left-0 right-0 flex-row justify-center items-center gap-6`}
          >
            {/* Voice Control Button */}
            <TouchableOpacity
              style={tw`w-16 h-16 rounded-full bg-black bg-opacity-30 items-center justify-center border border-white border-opacity-50`}
              onPress={() => setActiveButton("voice")}
            >
              <VoiceChatIcon />
            </TouchableOpacity>

            {/* Facial Scan Button (Active Focus) */}
            <TouchableOpacity
              style={[
                tw`w-20 h-20 rounded-full items-center justify-center border-2`,
                activeButton === "face"
                  ? tw`bg-white bg-opacity-20 border-white`
                  : tw`bg-black bg-opacity-30 border-white border-opacity-50`,
              ]}
              onPress={handleFacialScanPress}
            >
              <FacialVerificationIcon />
            </TouchableOpacity>

            {/* Chat Button */}
            <TouchableOpacity
              style={tw`w-16 h-16 rounded-full bg-black bg-opacity-30 items-center justify-center border border-white border-opacity-50`}
              onPress={() => setActiveButton("chat")}
            >
              <ChatIcon />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  corner: {
    width: 30,
    height: 30,
    borderColor: "white",
    position: "absolute",
  },
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
