import React, { ReactNode, useEffect } from "react";
import {
  View,
  Modal as RNModal,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import tw from "twrnc";

export interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  animationType?: "none" | "slide" | "fade";
  backdropOpacity?: number;
  backdropColor?: string;
  position?: "center" | "bottom" | "top";
  avoidKeyboard?: boolean;
  disableBackdropPress?: boolean;
  style?: string;
  backdropStyle?: string;
  testID?: string;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  animationType = "fade",
  backdropOpacity = 0.5,
  backdropColor = "black",
  position = "center",
  avoidKeyboard = false,
  disableBackdropPress = false,
  style = "",
  backdropStyle = "",
  testID,
}) => {
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { height: screenHeight } = Dimensions.get("window");

  useEffect(() => {
    if (isVisible) {
      if (animationType === "slide") {
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
        }).start();
      } else if (animationType === "fade") {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } else {
      if (animationType === "slide") {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
        }).start();
      } else if (animationType === "fade") {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [isVisible, animationType, slideAnim, fadeAnim]);

  const handleBackdropPress = () => {
    if (!disableBackdropPress) {
      onClose();
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case "bottom":
        return tw`justify-end`;
      case "top":
        return tw`justify-start`;
      case "center":
      default:
        return tw`justify-center`;
    }
  };

  const getModalContentAnimation = () => {
    switch (animationType) {
      case "slide":
        const translateY = slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange:
            position === "bottom"
              ? [screenHeight, 0]
              : position === "top"
              ? [-screenHeight, 0]
              : [0, 0],
        });
        return { transform: [{ translateY }] };
      case "fade":
        return { opacity: fadeAnim };
      case "none":
      default:
        return {};
    }
  };

  const renderBackdrop = () => (
    <Animated.View
      style={[
        tw`absolute inset-0`,
        {
          backgroundColor: backdropColor,
          opacity:
            animationType === "fade"
              ? fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, backdropOpacity],
                })
              : backdropOpacity,
        },
        tw`${backdropStyle}`,
      ]}
    />
  );

  return (
    <RNModal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      testID={testID}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View
          style={[
            tw`flex-1`,
            getPositionStyles(),
            avoidKeyboard && Platform.OS === "ios" ? tw`pb-10` : tw``,
          ]}
          onStartShouldSetResponder={() => true}
        >
          {renderBackdrop()}

          <TouchableWithoutFeedback>
            <Animated.View
              style={[tw`m-4 ${style}`, getModalContentAnimation()]}
              onStartShouldSetResponder={() => true}
            >
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

export default Modal;
