import axios from "axios";
import { API_BASE_URL } from "./config"; // Import API base URL

const BASE_URL = `${API_BASE_URL}/expenses`;

/**
 * Fetch all expenses for a specific user
 * @param {string} userId - The ID of the logged-in user
 * @returns {Promise} - Resolves to the user's expenses
 */
export const fetchExpenses = async (userId) => {
  if (!userId) {
    console.error("fetchExpenses: User ID is missing!");
    return;
  }

  try {
    console.log(`Fetching expenses for userId: ${userId}`);
    const response = await axios.get(`${BASE_URL}`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Failed to fetch expenses.");
  }
};

/**
 * Add a new expense for the user
 * @param {Object} expenseData - Expense details
 * @returns {Promise} - Resolves to the created expense
 */
export const addExpense = async (expenseData) => {
  if (!expenseData.userId) {
    console.error("addExpense: User ID is missing in request body!");
    return;
  }

  try {
    console.log("Adding expense:", expenseData);
    const response = await axios.post(BASE_URL, expenseData);
    return response.data;
  } catch (error) {
    console.error("Error adding expense:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Failed to add expense.");
  }
};

/**
 * Delete an expense by ID
 * @param {string} expenseId - The ID of the expense to delete
 * @param {string} userId - The ID of the logged-in user
 * @returns {Promise} - Resolves when expense is deleted
 */
export const deleteExpense = async (expenseId, userId) => {
  if (!userId) {
    console.error("deleteExpense: User ID is missing!");
    return;
  }

  try {
    console.log(`Deleting expense ${expenseId} for userId: ${userId}`);
    const response = await axios.delete(`${BASE_URL}/${expenseId}`, {
      params: { userId }, // ✅ Changed from `data` to `params`
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting expense:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Failed to delete expense.");
  }
};
