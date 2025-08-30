import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import tw from "twrnc";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react-native";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

interface ToastConfig {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  icon: React.ReactNode;
}

const ToastComponent: React.FC<ToastProps> = ({
  type,
  message,
  description,
  duration = 3000,
  onClose,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isVisible, setIsVisible] = useState(true);

  const toastConfigs: Record<ToastType, ToastConfig> = {
    success: {
      backgroundColor: "bg-green-50",
      borderColor: "border-green-500",
      textColor: "text-green-800",
      icon: <CheckCircle size={20} color={tw.color("green-500")} />,
    },
    error: {
      backgroundColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-800",
      icon: <XCircle size={20} color={tw.color("red-500")} />,
    },
    warning: {
      backgroundColor: "bg-yellow-50",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-800",
      icon: <AlertTriangle size={20} color={tw.color("yellow-500")} />,
    },
    info: {
      backgroundColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-800",
      icon: <Info size={20} color={tw.color("blue-500")} />,
    },
  };

  const config = toastConfigs[type];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      hideToast();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      onClose?.();
    });
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        tw`${config.backgroundColor} p-4 mx-4 my-1 rounded shadow-lg`,
        styles.toast,
        { opacity: fadeAnim },
      ]}
    >
      <View style={tw`flex-row items-start`}>
        <View style={tw`mr-3 mt-0.5`}>{config.icon}</View>
        <View style={tw`flex-1`}>
          <Text style={tw`${config.textColor} font-bold`}>{message}</Text>
          {description && (
            <Text style={tw`${config.textColor} mt-1`}>{description}</Text>
          )}
        </View>
        <TouchableOpacity onPress={hideToast} style={tw`ml-2`}>
          <Text style={tw`${config.textColor} font-bold`}>×</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40, // Adjust for status bar height
    left: 0,
    right: 0,
    zIndex: 999,
  },
});

// Toast Context for global access
const ToastContext = React.createContext<{
  showToast: (toast: Omit<ToastProps, "onClose">) => void;
}>({
  showToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = (toast: Omit<ToastProps, "onClose">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return React.useContext(ToastContext);
};
