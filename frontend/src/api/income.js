import axios from "axios";
import { API_BASE_URL } from "./config";

// Add Income
export const addIncome = async (incomeData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/incomes`, incomeData);
    return response.data;
  } catch (error) {
    console.error("Error adding income:", error.response?.data || error.message);
    throw error;
  }
};

// Get All Incomes for a User
export const getIncome = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/incomes`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching incomes:", error.response?.data || error.message);
    throw error;
  }
};

// Update Income
export const updateIncome = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/incomes/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating income:", error.response?.data || error.message);
    throw error;
  }
};

// Delete Income
export const deleteIncome = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/incomes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting income:", error.response?.data || error.message);
    throw error;
  }
};