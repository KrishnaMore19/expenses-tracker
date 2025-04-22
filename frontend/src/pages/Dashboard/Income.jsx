import React, { useState, useEffect } from "react";
import { getIncome, deleteIncome, addIncome } from "/src/api/income";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth } from "/src/context/AuthContext";
import { FiPlus, FiTrash2, FiCalendar, FiDollarSign, FiTag, FiAlertTriangle } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Income = () => {
  const { user } = useAuth();
  const userId = user?._id;

  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [newIncome, setNewIncome] = useState({
    amount: "",
    source: "",
    category: "",
    date: "",
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
        const data = await getIncome(userId);
        setIncome(Array.isArray(data) ? data.sort((a, b) => new Date(a.date) - new Date(b.date)) : []);
        setError(null);
      } catch (err) {
        setError("Failed to load income");
        notifyError("Error loading income data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const openDeleteConfirmation = (incomeId, incomeSource, incomeAmount) => {
    setItemToDelete({ id: incomeId, source: incomeSource, amount: incomeAmount });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userId || !itemToDelete) {
      notifyError("User not found or invalid item to delete");
      return;
    }

    try {
      await deleteIncome(itemToDelete.id);
      setIncome(income.filter((i) => i._id !== itemToDelete.id));
      notifySuccess("Income deleted successfully!");
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      notifyError("Error deleting income");
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!userId) {
      notifyError("User is not logged in!");
      return;
    }

    if (!newIncome.amount || !newIncome.source || !newIncome.category || !newIncome.date) {
      notifyError("All fields are required!");
      return;
    }

    try {
      const addedIncome = await addIncome({ ...newIncome, userId });
      setIncome([...income, addedIncome].sort((a, b) => new Date(a.date) - new Date(b.date)));
      notifySuccess("Income added successfully!");
      setShowAddModal(false);
      setNewIncome({ amount: "", source: "", category: "", date: "" });
    } catch (err) {
      notifyError("Failed to add income!");
    }
  };

  // Calculate total income
  const totalIncome = income.reduce((sum, entry) => sum + (Number(entry?.amount) || 0), 0);

  // Transform income data for BarChart (Date vs Income)
  const barData = income.map((entry) => ({
    date: entry?.date ? new Date(entry.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) : "Unknown",
    amount: entry?.amount || 0,
  }));

  // Group income by category for summary
  const categoryTotals = income.reduce((acc, entry) => {
    const category = entry?.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + Number(entry?.amount || 0);
    return acc;
  }, {});

  const getCategoryColor = (category) => {
    const colors = {
      "Salary": "#4CAF50",
      "Freelance": "#2196F3",
      "Investment": "#FF9800",
      "Bonus": "#E91E63",
      "Other": "#9C27B0",
    };
    return colors[category] || "#607D8B";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="p-6 sm:px-12 lg:px-20 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Income Tracker</h1>
            <p className="text-gray-600">Track and manage your income sources</p>
          </div>
          <div className="flex items-center">
            <div className="mr-6 bg-white p-3 rounded-lg shadow-md">
              <span className="block text-sm text-gray-500">Total Income</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center"
            >
              <FiPlus size={20} className="mr-2" /> Add Income
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Bar Chart Card */}
          <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Income Over Time</h2>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, "Amount"]} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Summary */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Income by Category</h2>
            {Object.entries(categoryTotals).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No categories found</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(categoryTotals).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3" 
                        style={{ backgroundColor: getCategoryColor(category) }}
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

        {/* Income List Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Income Details</h2>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">{error}</div>
          ) : income.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <FiDollarSign size={40} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No income records found.</p>
              <p className="text-sm mt-2">Add your first income by clicking the "Add Income" button.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {income.map((entry, index) => (
                    <tr key={entry?._id || `income-${index}`} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{entry?.source || "Unknown"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{entry?.category || "No category"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {entry?.date ? new Date(entry.date).toLocaleDateString("en-US", { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-600">
                        {formatCurrency(entry?.amount || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => openDeleteConfirmation(entry?._id, entry?.source, entry?.amount)}
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

      {/* Add Income Modal - NO DARK OVERLAY */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md pointer-events-auto relative border-2 border-gray-200">
            <h2 className="text-xl font-bold mb-5 text-gray-800 border-b pb-3">Add New Income</h2>
            <form onSubmit={handleAddIncome} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                    className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <input
                  type="text"
                  value={newIncome.source}
                  onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  placeholder="E.g., Salary, Freelance"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiTag className="text-gray-400" />
                  </div>
                  <select
                    value={newIncome.category}
                    onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })}
                    className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 appearance-none"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investment">Investment</option>
                    <option value="Bonus">Bonus</option>
                    <option value="Other">Other</option>
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
                    value={newIncome.date}
                    onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                    className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 font-medium text-gray-700"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium"
                >
                  Add Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - NO DARK OVERLAY */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md pointer-events-auto relative border-2 border-gray-200">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FiAlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete income from <span className="font-medium text-gray-900">{itemToDelete?.source}</span> worth <span className="font-medium text-gray-900">{formatCurrency(itemToDelete?.amount || 0)}</span>?
              </p>
              <p className="text-xs text-gray-500 mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 font-medium text-gray-700 min-w-24"
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium min-w-24"
                onClick={handleDelete}
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

export default Income;