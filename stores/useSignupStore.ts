// stores/useSignupStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface OtpVerificationData {
  identifier: string; // email or phone number
  type: "email" | "phone";
  expiresAt?: number; // timestamp for OTP expiration
  purpose?: "signup" | "login" | "password_reset"; // purpose of OTP
}

export interface SignupState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  otpVerificationData: OtpVerificationData | null; // Add OTP data

  // Actions defined directly in the store
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOtpVerificationData: (data: OtpVerificationData | null) => void; // Add OTP action
  clearSignup: () => void;
  clearOtpData: () => void; // Add clear OTP action
  markEmailVerified: () => void; // Add verification status
  markPhoneVerified: () => void;
}

// Create the store instance
export const useSignupStore = create<SignupState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      otpVerificationData: null, // Initialize OTP data

      // Actions defined directly
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // OTP Verification actions
      setOtpVerificationData: (otpVerificationData) =>
        set({ otpVerificationData }),
      clearOtpData: () => set({ otpVerificationData: null }),

      clearSignup: () =>
        set({
          user: null,
          error: null,
          otpVerificationData: null, // Clear OTP data on signup clear
        }),

      markEmailVerified: () => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, emailVerified: true },
          });
        }
      },

      markPhoneVerified: () => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, phoneVerified: true },
          });
        }
      },
    }),
    {
      name: "signup-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Export the store instance for non-React usage
export const signupStore = useSignupStore;

// Helper function to get OTP verification data
export const getOtpVerificationData = (): OtpVerificationData | null => {
  return signupStore.getState().otpVerificationData;
};

// Helper function to check if OTP is expired
export const isOtpExpired = (): boolean => {
  const { otpVerificationData } = signupStore.getState();
  if (!otpVerificationData?.expiresAt) return true;
  return Date.now() > otpVerificationData.expiresAt;
};

// Helper function to get OTP time remaining
export const getOtpTimeRemaining = (): number => {
  const { otpVerificationData } = signupStore.getState();
  if (!otpVerificationData?.expiresAt) return 0;
  return Math.max(0, otpVerificationData.expiresAt - Date.now());
};

// Helper hooks for React components
export const useSignup = () =>
  useSignupStore((state) => ({
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    otpVerificationData: state.otpVerificationData,
  }));

export const useSignupActions = () =>
  useSignupStore((state) => ({
    setUser: state.setUser,
    setLoading: state.setLoading,
    setError: state.setError,
    setOtpVerificationData: state.setOtpVerificationData,
    clearSignup: state.clearSignup,
    clearOtpData: state.clearOtpData,
    markEmailVerified: state.markEmailVerified,
    markPhoneVerified: state.markPhoneVerified,
  }));

// Format time for display
export const formatOtpTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Check if OTP can be resent (not within cooldown period)
export const canResendOtp = (): boolean => {
  const { otpVerificationData } = signupStore.getState();
  if (!otpVerificationData?.expiresAt) return true;

  // Allow resend if OTP is expired or will expire in less than 1 minute
  return Date.now() > otpVerificationData.expiresAt - 60 * 1000;
};
