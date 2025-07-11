// Use environment variable or fallback to localhost for dev
export const API_BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : "http://localhost:3000/api";

export const API_USERS_URL = `${API_BASE_URL}/users`;

 // Updated to port 3000
