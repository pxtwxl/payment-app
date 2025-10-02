import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_BASE_URL = "http://localhost:8091";

export const api = axios.create();

// Add auth token to requests if available (skip for auth endpoints)
api.interceptors.request.use(
  async (config) => {
    try {
      const url = config.url ?? "";
      const isAuthEndpoint = url.includes("/user/login") || url.includes("/user/register");
      if (!isAuthEndpoint) {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          config.headers = config.headers ?? {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch (_) {
      // noop: if storage fails, send request without token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;