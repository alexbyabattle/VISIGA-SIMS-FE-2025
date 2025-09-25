import axios from "axios";
import toast from "react-hot-toast";
import { ErrorResponse } from "./api-Utils";


const API_BASE_URL = "http://localhost:8082/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const useClient = () => {
  const [loading, toggle] = useToggle();

  const request = async ({ method = "GET", url, data, params }) => {
    toggle(); // Start loading
    try {
      const response = await axiosInstance({
        url,
        method,
        data,
        params,
      });

      const responseData = response.data;
      if (method !== "GET") {
        toast.success(response?.message || "Request successful");
      }
      return responseData;
    } catch (error) {
      const errorMessage = error.response?.message || "Connection Failed";
      toast.error(errorMessage);
      return ErrorResponse(errorMessage, error.response?.status || 500);
    } finally {
      toggle(); // Stop loading
    }
  };

  return { request, loading };
};

export default useClient;
