import Income from "../models/Income.js";

// Add Income
export const addIncome = async (req, res) => {
  const { userId, source, amount, category, date } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const income = await Income.create({
      user: userId, // Store user ID from request
      source, // ✅ Changed from title to source
      amount,
      category,
      date,
    });
    res.status(201).json(income);
  } catch (error) {
    console.error("Error adding income:", error); // ✅ Log error to debug
    res.status(500).json({ message: "Error adding income", error: error.message });
  }
};

// Get Incomes (Fetch only the logged-in user's incomes)
export const getIncomes = async (req, res) => {
  const { userId } = req.query; // Extract userId from query params

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const incomes = await Income.find({ user: userId }).sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ message: "Error fetching incomes", error: error.message });
  }
};

// Update Income
export const updateIncome = async (req, res) => {
  const { id } = req.params;
  const { source, amount, category, date } = req.body;

  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { source, amount, category, date },
      { new: true, runValidators: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json(updatedIncome);
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(500).json({ message: "Error updating income", error: error.message });
  }
};

// Delete Income
export const deleteIncome = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedIncome = await Income.findByIdAndDelete(id);

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error deleting income:", error);
    res.status(500).json({ message: "Error deleting income", error: error.message });
  }
};
