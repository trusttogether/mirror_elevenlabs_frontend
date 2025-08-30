// stores/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  logout: () => void; // Add logout method
}

// Create the store instance
export const useSigninStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearAuth: () =>
        set({
          user: null,
          token: null,
          error: null,
        }),
      logout: () => {
        set({
          user: null,
          token: null,
          error: null,
        });
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

// Helper function to logout (for use in axios)
export const logoutUser = (): void => {
  authStore.getState().logout();
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
