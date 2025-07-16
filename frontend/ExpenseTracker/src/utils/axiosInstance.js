import axios from "axios";
import { BASE_URL } from "./apiPaths";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? BASE_URL : "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Set token in request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle errors in response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       if (error.response.status === 401) {
//         window.location.href = "/login";
//       } else if (error.response.status === 500) {
//         console.error("Server error. Please try again.");
//       }
//     } else if (error.code === "ECONNABORTED") {
//       console.error("Request timed out. Please try again.");
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
