import axios from "axios";
import { store } from "./store/store.ts";

const api = axios.create({
  baseURL: import.meta.env.VITE_BackEndURL,
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token || localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;