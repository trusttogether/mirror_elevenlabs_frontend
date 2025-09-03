// stores/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface OtpVerificationData {
  identifier: string; // email or phone number
  type: "email" | "phone";
  expiresAt?: number; // timestamp for OTP expiration
  purpose?: "signup" | "login" | "password_reset"; // purpose of OTP
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  otpVerificationData: OtpVerificationData | null; // Add OTP data
  setOtpVerificationData: (data: OtpVerificationData | null) => void; // Add OTP action

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  logout: () => void; // Add logout method
  clearOtpData: () => void; // Add clear OTP action
  markEmailVerified: () => void; // Add verification status
  markPhoneVerified: () => void;
}

export const useSigninStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      otpVerificationData: null, // Initialize OTP datas

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setOtpVerificationData: (
        otpVerificationData: OtpVerificationData | null
      ) => set({ otpVerificationData }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          error: null,
          otpVerificationData: null, // Clear OTP data on auth clear
        }),
      logout: () => {
        set({
          user: null,
          token: null,
          error: null,
          otpVerificationData: null, // Clear OTP data on logout
        });
      },

      markEmailVerified: () => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, emailVerified: true },
          });
        }
      },

      clearOtpData: () => set({ otpVerificationData: null }),

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
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Export the store instance for non-React usage
export const authStore = useSigninStore;

// Helper function to get token (for use in axios)
export const getAuthToken = (): string | null => {
  return authStore.getState().token;
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const { token, user } = useSigninStore.getState();
  return !!token && !!user;
};

// Helper hooks for React components
export const useAuth = () =>
  useSigninStore((state) => ({
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: !!state.token && !!state.user,
  }));

export const useAuthActions = () =>
  useSigninStore((state) => ({
    setUser: state.setUser,
    setToken: state.setToken,
    setLoading: state.setLoading,
    setError: state.setError,
    clearAuth: state.clearAuth,
    logout: state.logout,
  }));
