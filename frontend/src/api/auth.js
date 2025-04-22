import axios from "axios";
import { API_BASE_URL } from "./config"; // Import API base URL

const AUTH_URL = `${API_BASE_URL}/auth`;

/**
 * Log in a user
 * @param {Object} credentials - { email, password }
 * @returns {Promise} - Resolves to the logged-in user data
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};

/**
 * Sign up a new user
 * @param {Object} credentials - { name, email, password }
 * @returns {Promise} - Resolves to the registered user data
 */
export const signupUser = async (credentials) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw new Error(error.response?.data?.message || "Signup failed.");
  }
};

/**
 * Check if the server is running
 * @returns {Promise} - Resolves to a success message if the server is reachable
 */
export const checkServerHealth = async () => {
  try {
    const response = await axios.get(`${AUTH_URL}/health`, { timeout: 5000 });
    return { success: response.status === 200 };
  } catch (error) {
    console.error("Server health check failed:", error);
    return { success: false, message: "Server is unreachable" };
  }
};
