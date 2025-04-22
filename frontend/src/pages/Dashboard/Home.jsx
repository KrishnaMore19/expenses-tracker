import { useEffect, useState, useMemo } from "react";
import { fetchExpenses } from "/src/api/expenses";
import { getIncome } from "/src/api/income";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAuth } from "/src/context/AuthContext"; // Adjust this import path as needed

// Enhanced color palette
const INCOME_COLORS = ["#4CAF50", "#81C784", "#A5D6A7", "#C8E6C9", "#E8F5E9", "#F1F8E9"];
const EXPENSE_COLORS = ["#F44336", "#E57373", "#EF9A9A", "#FFCDD2", "#FFEBEE", "#FFF8F8"];
const OVERVIEW_COLORS = ["#4CAF50", "#F44336"];

// Card component for consistent styling
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);

// Transaction item component
const TransactionItem = ({ transaction }) => (
  <div className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
    <div className="flex items-center">
      <div 
        className={`w-2 h-10 rounded-full mr-3 ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}
      ></div>
      <div>
        <p className="font-medium">
          {transaction.type === 'income' ? transaction.source : transaction.title}
        </p>
        <p className="text-xs text-gray-500">
          {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'No date'}
        </p>
      </div>
    </div>
    <span 
      className={`font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}
    >
      {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
    </span>
  </div>
);


const Home = () => {
  const { user } = useAuth(); // Get the user from auth context
  const userId = user?._id; // Extract the userId
  
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        console.log("No userId available in auth context");
        setError("Authentication required");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const [expenseData, incomeData] = await Promise.all([
          fetchExpenses(userId),
          getIncome(userId),
        ]);
        setExpenses(expenseData || []);
        setIncomes(incomeData || []);
        setError(null);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load financial data");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [userId]);

  // Memoized calculations
  const totalIncome = useMemo(() => incomes.reduce((acc, i) => acc + i.amount, 0), [incomes]);
  const totalExpense = useMemo(() => expenses.reduce((acc, e) => acc + e.amount, 0), [expenses]);
  const balance = totalIncome - totalExpense;
  const recentExpenses = useMemo(() => expenses.slice(0, 6), [expenses]);
  const recentIncomes = useMemo(() => incomes.slice(0, 6), [incomes]);
  const expenseData = useMemo(() => recentExpenses.map(e => ({ name: e.title, value: e.amount })), [recentExpenses]);
  const incomeData = useMemo(() => recentIncomes.map(i => ({ name: i.title, value: i.amount })), [recentIncomes]);
  
  // Combined recent transactions (both incomes and expenses)
  const recentTransactions = useMemo(() => {
    const combined = [
      ...recentExpenses.map(e => ({ ...e, type: 'expense' })),
      ...recentIncomes.map(i => ({ ...i, type: 'income' }))
    ];
    // Sort by date (assuming there's a date property)
    return combined.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 6);
  }, [recentExpenses, recentIncomes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
          <p className="text-gray-600">Please make sure you're logged in to access your financial dashboard.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
        <p className="text-gray-600">Track your income, expenses, and overall financial health</p>
      </div>
      
      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-green-100 opacity-50"></div>
          <h3 className="text-lg font-medium text-gray-500 mb-1">Total Income</h3>
          <p className="text-3xl font-bold text-green-500">${totalIncome.toLocaleString()}</p>
          <div className="mt-2 text-sm text-gray-500">From {incomes.length} sources</div>
        </Card>
        
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-red-100 opacity-50"></div>
          <h3 className="text-lg font-medium text-gray-500 mb-1">Total Expense</h3>
          <p className="text-3xl font-bold text-red-500">${totalExpense.toLocaleString()}</p>
          <div className="mt-2 text-sm text-gray-500">From {expenses.length} transactions</div>
        </Card>
        
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-100 opacity-50"></div>
          <h3 className="text-lg font-medium text-gray-500 mb-1">Balance</h3>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
            ${balance.toLocaleString()}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            {balance >= 0 ? 'You\'re doing great!' : 'Time to cut expenses'}
          </div>
        </Card>
      </div>

      {/* Recent Transactions and Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Transactions */}
        <Card>
          <div className="border-b border-gray-100 p-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionItem key={transaction._id} transaction={transaction} />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No recent transactions</p>
                <p className="text-sm mt-2">Your transactions will appear here</p>
              </div>
            )}
          </div>
          {recentTransactions.length > 0 && (
            <div className="p-4 border-t border-gray-100 text-center">
              <button className="text-blue-500 hover:text-blue-700 font-medium">
                View All Transactions
              </button>
            </div>
          )}
        </Card>

        {/* Financial Overview Pie Chart */}
        <Card>
          <div className="border-b border-gray-100 p-4">
            <h2 className="text-xl font-semibold text-gray-800">Financial Overview</h2>
          </div>
          <div className="p-4 flex flex-col items-center h-80">
            {(totalIncome > 0 || totalExpense > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={[
                      { name: "Income", value: totalIncome || 0.1 },  // Use 0.1 to prevent empty chart
                      { name: "Expense", value: totalExpense || 0.1 }
                    ]} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    innerRadius={60} // Creates a donut chart
                    fill="#8884d8" 
                    dataKey="value"
                    paddingAngle={2}
                    label
                  >
                    <Cell fill="#4CAF50" stroke="#FFFFFF" strokeWidth={2} />
                    <Cell fill="#F44336" stroke="#FFFFFF" strokeWidth={2} />
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <div>
                  <p>No financial data yet</p>
                  <p className="text-sm mt-2">Add income and expenses to see your overview</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Expense Breakdown and Income Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Expense Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Recent Expenses List */}
          <Card>
            <div className="border-b border-gray-100 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Recent Expenses</h2>
              <span className="text-sm font-medium px-3 py-1 bg-red-100 text-red-600 rounded-full">
                ${totalExpense.toLocaleString()}
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {recentExpenses.length > 0 ? (
                recentExpenses.map((expense) => (
                  <div key={expense._id} className="p-3 flex justify-between hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{expense.title}</p>
                      <p className="text-xs text-gray-500">{expense.date ? new Date(expense.date).toLocaleDateString() : 'No date'}</p>
                    </div>
                    <span className="font-bold text-red-500">${expense.amount}</span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>No recent expenses</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Expense Breakdown Pie Chart */}
        <Card>
          <div className="border-b border-gray-100 p-4">
            <h2 className="text-xl font-semibold text-gray-800">Expense Breakdown</h2>
          </div>
          <div className="p-4 flex flex-col items-center h-80">
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={expenseData} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    innerRadius={30}
                    fill="#FF5722" 
                    dataKey="value"
                    paddingAngle={1}
                    label
                  >
                    {expenseData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} 
                        stroke="#FFFFFF"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <p>No expense data to display</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Income Breakdown section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Income List */}
        <Card>
          <div className="border-b border-gray-100 p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Recent Income</h2>
            <span className="text-sm font-medium px-3 py-1 bg-green-100 text-green-600 rounded-full">
              ${totalIncome.toLocaleString()}
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {recentIncomes.length > 0 ? (
              recentIncomes.map((income) => (
                <div key={income._id} className="p-3 flex justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{income.source}</p>
                    <p className="text-xs text-gray-500">{income.date ? new Date(income.date).toLocaleDateString() : 'No date'}</p>
                  </div>
                  <span className="font-bold text-green-500">${income.amount}</span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No recent income</p>
              </div>
            )}
          </div>
        </Card>

        {/* Income Breakdown Pie Chart */}
        <Card>
          <div className="border-b border-gray-100 p-4">
            <h2 className="text-xl font-semibold text-gray-800">Income Breakdown</h2>
          </div>
          <div className="p-4 flex flex-col items-center h-80">
            {incomeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={incomeData} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    innerRadius={30}
                    fill="#4CAF50" 
                    dataKey="value"
                    paddingAngle={1}
                    label
                  >
                    {incomeData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={INCOME_COLORS[index % INCOME_COLORS.length]} 
                        stroke="#FFFFFF"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <p>No income data to display</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;