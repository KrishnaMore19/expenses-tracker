import React, { useState, useEffect } from "react";
import { fetchExpenses, deleteExpense, addExpense } from "/src/api/expenses";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useAuth } from "/src/context/AuthContext";
import { FiPlus, FiTrash2, FiDollarSign, FiTag, FiCalendar, FiShoppingBag, FiAlertTriangle, FiX } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Expenses = () => {
  const { user } = useAuth();
  const userId = user?._id;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [newExpense, setNewExpense] = useState({ 
    title: "", 
    amount: "", 
    category: "",
    date: new Date().toISOString().split('T')[0]
  });

  // Toast configuration
  const notifySuccess = (message) => toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  const notifyError = (message) => toast.error(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing! Please log in.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchExpenses(userId);
        setExpenses(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError("Failed to load expenses");
        notifyError("Error loading expense data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const confirmDelete = (expenseId) => {
    const expenseToRemove = expenses.find(e => e._id === expenseId);
    setExpenseToDelete(expenseToRemove);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userId || !expenseToDelete) {
      notifyError("User not found or expense invalid! Please try again.");
      return;
    }

    try {
      await deleteExpense(expenseToDelete._id, userId);
      setExpenses(expenses.filter((e) => e._id !== expenseToDelete._id));
      notifySuccess("Expense deleted successfully!");
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    } catch (err) {
      notifyError("Error deleting expense");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount || !newExpense.category || !newExpense.date) {
      notifyError("All fields are required!");
      return;
    }

    try {
      const addedExpense = await addExpense({
        ...newExpense,
        userId,
        amount: Number(newExpense.amount),
      });

      setExpenses([...expenses, addedExpense]);
      notifySuccess("Expense added successfully!");
      setShowModal(false);
      setNewExpense({ 
        title: "", 
        amount: "", 
        category: "",
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      notifyError("Failed to add expense!");
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + (Number(expense?.amount) || 0), 0);

  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense?.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + Number(expense?.amount || 0);
    return acc;
  }, {});

  // Create data for chart
  const barData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    amount: amount,
  })).sort((a, b) => b.amount - a.amount);

  const COLORS = [
    "#FF6B6B", "#F06595", "#CC5DE8", "#845EF7", 
    "#5C7CFA", "#339AF0", "#22B8CF", "#20C997",
    "#51CF66", "#94D82D", "#FCC419", "#FF922B"
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const predefinedCategories = [
    "Food", "Transportation", "Housing", "Entertainment", 
    "Utilities", "Healthcare", "Shopping", "Travel", "Other"
  ];

  return (
    <div className="p-6 sm:px-12 lg:px-20 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Expense Tracker</h1>
            <p className="text-gray-600">Monitor and manage your spending</p>
          </div>
          <div className="flex items-center">
            <div className="mr-6 bg-white p-3 rounded-lg shadow-md">
              <span className="block text-sm text-gray-500">Total Expenses</span>
              <span className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 flex items-center"
            >
              <FiPlus size={20} className="mr-2" /> Add Expense
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Bar Chart Card */}
          <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Expenses By Category</h2>
            <div className="w-full h-72">
              {barData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <FiShoppingBag size={40} className="mx-auto mb-4 text-gray-400" />
                    <p>No expense data to display</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, "Amount"]} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Category Summary */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Spending Breakdown</h2>
            {Object.entries(categoryTotals).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No categories found</p>
                <p className="text-sm mt-2">Add expenses to see spending breakdown</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(categoryTotals)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount], index) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-medium">{category}</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(amount)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Expenses List Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Expense Details</h2>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">{error}</div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <FiShoppingBag size={40} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No expenses recorded yet.</p>
              <p className="text-sm mt-2">Add your first expense by clicking the "Add Expense" button.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense, index) => (
                    <tr key={expense?._id || `expense-${index}`} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{expense?.title || "Untitled Expense"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{expense?.category || "Uncategorized"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {expense?.date ? new Date(expense.date).toLocaleDateString("en-US", { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-red-600">
                        {formatCurrency(expense?.amount || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => confirmDelete(expense?._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition duration-200"
                        >
                          <FiTrash2 size={16} className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md pointer-events-auto relative border-2 border-gray-200">
            <h2 className="text-xl font-bold mb-5 text-gray-800 border-b pb-3">Add New Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiShoppingBag className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
                    placeholder="E.g., Groceries, Rent, etc."
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiTag className="text-gray-400" />
                  </div>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 appearance-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {predefinedCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 font-medium text-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Floating popup without dark overlay */}
      {showDeleteModal && expenseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md pointer-events-auto relative border-2 border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 mr-3">
                  <FiAlertTriangle size={16} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Delete Expense</h3>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setShowDeleteModal(false);
                  setExpenseToDelete(null);
                }}
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Title:</span>
                <span className="text-sm font-medium">{expenseToDelete.title}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Category:</span>
                <span className="text-sm font-medium">{expenseToDelete.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Amount:</span>
                <span className="text-sm font-medium text-red-600">{formatCurrency(expenseToDelete.amount)}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to remove this expense? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 font-medium text-gray-700"
                onClick={() => {
                  setShowDeleteModal(false);
                  setExpenseToDelete(null);
                }}
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;