// lib/axios.ts
import axios from "axios";
import { getAuthToken, logoutUser, authStore } from "../stores/useSigninStore";

const API_BASE_URL = "https://mirriora.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = getAuthToken();
        if (token) {
          // Try to refresh token
          const response = await api.post("/auth/refresh-token");
          const newToken = response.data.token;

          // Update store with new token
          authStore.getState().setToken(newToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.log("Token refresh failed, logging out user");
        // Refresh failed, logout user
        logoutUser();

        // Clear any stored tokens
        authStore.getState().clearAuth();

        // Redirect to login if not already there
        // You might want to use a navigation library here
        return Promise.reject(refreshError);
      }
    }

    // Handle other auth errors
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.log("Auth error detected, logging out user");
      logoutUser();
      authStore.getState().clearAuth();
    }

    return Promise.reject(error);
  }
);

export default api;
