import axios from "axios";
import config from "./config";

// Create an instance of axios with the base URL and default headers
const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
