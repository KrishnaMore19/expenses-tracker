// Use environment variable or fallback to localhost for dev
export const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000/api";

export const API_USERS_URL = `${API_BASE_URL}/users`;
