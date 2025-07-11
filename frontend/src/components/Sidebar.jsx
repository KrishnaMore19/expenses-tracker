import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Receipt, 
  LogOut 
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col h-full pt-4">
      {/* User Info */}
      {user && (
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div>
              <p className="font-medium">{user.name || "User"}</p>
              <p className="text-sm text-gray-500">{user.email || "user@example.com"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <Link to="/dashboard" className={`flex items-center py-3 px-4 rounded-lg transition-all ${
          isActive('/dashboard') ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'
        }`}>
          <LayoutDashboard size={20} className="mr-3" />
          Dashboard
        </Link>

        <Link to="/dashboard/income" className={`flex items-center py-3 px-4 rounded-lg transition-all ${
          isActive('/dashboard/income') ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'
        }`}>
          <TrendingUp size={20} className="mr-3" />
          Income
        </Link>

        <Link to="/dashboard/expenses" className={`flex items-center py-3 px-4 rounded-lg transition-all ${
          isActive('/dashboard/expenses') ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'
        }`}>
          <Receipt size={20} className="mr-3" />
          Expenses
        </Link>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={logout}
          className="flex items-center w-full py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
