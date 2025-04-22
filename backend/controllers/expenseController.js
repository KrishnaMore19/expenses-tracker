import mongoose from "mongoose";
import Expense from "../models/Expense.js";

// Add Expense
export const addExpense = async (req, res) => {
  console.log("📩 Received request body:", req.body); // Debugging log

  const { userId, title, amount, category, date } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Ensure userId is stored as an ObjectId
    const expense = await Expense.create({
      user: new mongoose.Types.ObjectId(userId),
      title,
      amount,
      category,
      date: date || new Date(), // Default to current date if missing
    });

    console.log("✅ Expense added successfully:", expense);
    res.status(201).json(expense);
  } catch (error) {
    console.error("🚨 Error adding expense:", error);
    res.status(500).json({ message: "Error adding expense", error: error.message });
  }
};

// Get All Expenses
export const getExpenses = async (req, res) => {
  const { userId } = req.query;

  console.log("🔍 Backend received userId:", userId); // Debugging log

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });

    if (!expenses.length) {
      console.log("⚠️ No expenses found for this user.");
      return res.status(404).json({ message: "No expenses found for this user." });
    }

    res.json(expenses);
  } catch (error) {
    console.error("🚨 Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses", error: error.message });
  }
};

// Update Expense
export const updateExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;
  const { userId } = req.query; 

  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (expense.user.toString() !== userId)
      return res.status(403).json({ message: "Not authorized to update this expense" });

    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Error updating expense", error: error.message });
  }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
  const { userId } = req.query; 

  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (expense.user.toString() !== userId)
      return res.status(403).json({ message: "Not authorized to delete this expense" });

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Error deleting expense", error: error.message });
  }
};
