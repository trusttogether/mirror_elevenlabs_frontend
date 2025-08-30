// stores/useSignupStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface SignupState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions defined directly in the store
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSignup: () => void;
}

// Create the store instance
export const useSignupStore = create<SignupState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Actions defined directly
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearSignup: () =>
        set({
          user: null,
          token: null,
          error: null,
        }),
    }),
    {
      name: "signup-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
